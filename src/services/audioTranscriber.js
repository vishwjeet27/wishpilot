/**
 * WishPilot - Web Audio DSP & Real-Time Speech-to-Text Transcriber
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

// Resample Float32 PCM samples from hardware rate to 16kHz mono
function downsampleTo16k(inputSamples, inputSampleRate, outputSampleRate = 16000) {
  if (inputSampleRate === outputSampleRate) return inputSamples;
  const ratio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(inputSamples.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputSamples.length; i++) {
      accum += inputSamples[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : (inputSamples[offsetBuffer] || 0);
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

// Encode Float32Array (at 16kHz) to standard 16-bit Mono WAV Blob
function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + samples.length * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // "fmt " subchunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);          // subchunk size = 16
  view.setUint16(20, 1, true);           // PCM format
  view.setUint16(22, 1, true);           // mono channel
  view.setUint32(24, sampleRate, true);  // sample rate (16000)
  view.setUint32(28, sampleRate * 2, true); // byte rate (16000 * 2)
  view.setUint16(32, 2, true);           // block align (1 channel * 2 bytes)
  view.setUint16(34, 16, true);          // 16 bits per sample

  // "data" subchunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, samples.length * 2, true);

  // Write 16-bit PCM samples with clipping protection
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export class AudioTranscriber {
  constructor({
    apiKey = '',
    audioSource = 'mic', // 'mic' | 'system'
    deviceId = '',
    onTranscript,
    onQuestionDetected,
    onAudioLevel,
    onError,
    onStatus
  }) {
    this.apiKey = apiKey;
    this.audioSource = audioSource || 'mic';
    this.deviceId = deviceId || '';
    this.onTranscript = onTranscript;
    this.onQuestionDetected = onQuestionDetected;
    this.onAudioLevel = onAudioLevel;
    this.onError = onError;
    this.onStatus = onStatus;

    this.isListening = false;
    this.mediaStream = null;
    this.audioContext = null;
    this.sourceNode = null;
    this.analyser = null;
    this.processor = null;
    this.silentGain = null;

    // VAD & Buffering State
    this.hardwareSampleRate = 48000;
    this.preRollCapacity = 24000; // ~500ms pre-roll at 48kHz
    this.preRollBuffer = [];
    this.activeSpeechSamples = [];
    this.isSpeaking = false;
    this.silenceSamplesCount = 0;
    this.speechSamplesCount = 0;
    this.isTranscribing = false;
    this.lastTriggeredQuestion = '';
  }

  setApiKey(newKey) {
    this.apiKey = newKey;
  }

  setAudioSource(newSource) {
    this.audioSource = newSource;
  }

  setDeviceId(newId) {
    this.deviceId = newId;
  }

  async start() {
    if (this.isListening) return;

    try {
      console.log(`[WishPilot Audio] Initializing capture. Source: ${this.audioSource}`);

      let stream = null;

      if (this.audioSource === 'system') {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) videoTrack.stop();
        } catch (sysErr) {
          console.warn('[WishPilot Audio] System loopback not available, falling back to mic:', sysErr);
        }
      }

      if (!stream) {
        const constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };
        if (this.deviceId) {
          constraints.audio.deviceId = { exact: this.deviceId };
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      this.mediaStream = stream;
      const audioTracks = stream.getAudioTracks();
      const micName = audioTracks.map((t) => t.label || 'Default Microphone').join(', ');
      console.log('[WishPilot Audio] Hardware mic active:', micName);

      if (audioTracks.length === 0) {
        throw new Error('No audio input device detected.');
      }

      // Initialize Web Audio Context
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.hardwareSampleRate = this.audioContext.sampleRate || 48000;
      this.preRollCapacity = Math.round(this.hardwareSampleRate * 0.25); // 250ms pre-roll
      this.preRollBuffer = [];
      this.activeSpeechSamples = [];
      this.isSpeaking = false;
      this.silenceSamplesCount = 0;
      this.speechSamplesCount = 0;

      this.sourceNode = this.audioContext.createMediaStreamSource(stream);

      // Fast AnalyserNode for RMS level & HUD wave display
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.sourceNode.connect(this.analyser);

      // Low-latency ScriptProcessorNode (bufferSize 2048 = ~42ms chunks for instant reactivity)
      this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

      // Route through a 0-gain node to prevent any audio feedback through speakers!
      this.silentGain = this.audioContext.createGain();
      this.silentGain.gain.setValueAtTime(0, this.audioContext.currentTime);

      this.sourceNode.connect(this.processor);
      this.processor.connect(this.silentGain);
      this.silentGain.connect(this.audioContext.destination);

      // Process audio blocks in real-time
      this.processor.onaudioprocess = (e) => {
        if (!this.isListening) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const chunkLength = inputData.length;

        // Calculate exact time-domain RMS power
        let sumSquares = 0;
        for (let i = 0; i < chunkLength; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / chunkLength);

        // Convert RMS to 0-100 visual level for HUD waveform bars
        const visualLevel = Math.min(100, Math.round(Math.min(1.0, rms * 7.0) * 100));
        if (this.onAudioLevel) {
          this.onAudioLevel(visualLevel);
        }

        // Voice Activity Threshold:
        const isVoiceFrame = rms >= 0.015;

        // Update 250ms pre-roll circular buffer
        for (let i = 0; i < chunkLength; i++) {
          this.preRollBuffer.push(inputData[i]);
        }
        if (this.preRollBuffer.length > this.preRollCapacity) {
          this.preRollBuffer.splice(0, this.preRollBuffer.length - this.preRollCapacity);
        }

        if (isVoiceFrame) {
          if (!this.isSpeaking) {
            // Speech has just started! Prepend the pre-roll so first word isn't clipped
            this.isSpeaking = true;
            this.speechSamplesCount = 0;
            this.activeSpeechSamples = [...this.preRollBuffer];
          }
          // Accumulate current chunk
          for (let i = 0; i < chunkLength; i++) {
            this.activeSpeechSamples.push(inputData[i]);
          }
          this.speechSamplesCount += chunkLength;
          this.silenceSamplesCount = 0;
        } else if (this.isSpeaking) {
          // Candidate was speaking, now paused
          for (let i = 0; i < chunkLength; i++) {
            this.activeSpeechSamples.push(inputData[i]);
          }
          this.silenceSamplesCount += chunkLength;
        }

        if (this.isSpeaking && !this.isTranscribing) {
          const speechSec = this.speechSamplesCount / this.hardwareSampleRate;
          const silenceSec = this.silenceSamplesCount / this.hardwareSampleRate;

          // Dispatch triggers:
          // 1. Natural end-of-sentence pause: spoken >= 0.35s and paused >= 0.38s (ultra-fast reaction)
          // 2. Continuous buffer overflow protection: spoken >= 12.0s
          const isSentencePause = speechSec >= 0.35 && silenceSec >= 0.38;
          const isMaxDuration = speechSec >= 12.0;

          if (isSentencePause || isMaxDuration) {
            // Trim trailing silence so Whisper doesn't decode dead air
            const silenceSamplesToTrim = Math.max(0, this.silenceSamplesCount - Math.round(this.hardwareSampleRate * 0.08));
            const usefulLength = Math.max(Math.round(this.hardwareSampleRate * 0.3), this.activeSpeechSamples.length - silenceSamplesToTrim);
            const trimmedAudio = this.activeSpeechSamples.slice(0, usefulLength);

            const rawAudioToProcess = new Float32Array(trimmedAudio);
            this.activeSpeechSamples = [];
            this.isSpeaking = false;
            this.silenceSamplesCount = 0;
            this.speechSamplesCount = 0;

            this.dispatchWavToWhisper(rawAudioToProcess);
          }
        }
      };

      this.isListening = true;
      console.log('[WishPilot Audio] Live speech engine successfully running (ultra-low latency).');
    } catch (err) {
      console.error('[WishPilot Audio Error]', err);
      if (this.onError) this.onError(err);
      this.isListening = false;
      throw err;
    }
  }

  async dispatchWavToWhisper(rawSamples) {
    if (rawSamples.length === 0 || this.isTranscribing) return;
    this.isTranscribing = true;

    if (!this.apiKey) {
      console.warn('[WishPilot Audio] Groq API key missing. Transcriptions paused.');
      if (this.onTranscript) {
        this.onTranscript({
          text: '(Groq API key required for live transcription. Open Settings -> Models to enter key)',
          isFinal: false,
          speaker: 'Notice'
        });
      }
      this.isTranscribing = false;
      return;
    }

    try {
      // 1. Downsample raw samples to 16kHz mono
      const samples16k = downsampleTo16k(rawSamples, this.hardwareSampleRate, 16000);

      // 2. Encode to standard RIFF WAV Blob
      const wavBlob = encodeWAV(samples16k, 16000);
      console.log(`[WishPilot Audio] Dispatching WAV: ${wavBlob.size} bytes (${(samples16k.length / 16000).toFixed(1)}s) to Groq Whisper...`);

      const formData = new FormData();
      formData.append('file', wavBlob, 'audio.wav');
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('response_format', 'json');
      formData.append('temperature', '0.0');
      formData.append('language', 'en'); // Skip language identification pass for ultra-fast response
      // Technical dictionary biasing
      formData.append(
        'prompt',
        'Kubernetes, Kafka, PostgreSQL, gRPC, Redis, LeetCode, BFS, DFS, Big-O, API, REST, GraphQL, Docker, Microservices, CI/CD, AWS, System Design, Go, Python, React, indexing, latency, throughput, concurrency, deadlocks, multi-threading, dynamic programming, binary search, tree traversal, SQL.'
      );

      const sttStart = Date.now();
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        },
        body: formData
      });

      const latencyMs = Date.now() - sttStart;

      if (response.ok) {
        const data = await response.json();
        const text = (data.text || '').trim();

        // Reject Whisper silence hallucinations
        const lower = text.toLowerCase().replace(/[.!?,]/g, '').trim();
        const isHallucination = [
          'thank you',
          'thank you for watching',
          'thanks for watching',
          'subtitles by',
          'subtitles created by',
          'please subscribe',
          'bye',
          'you'
        ].includes(lower);

        if (text && text.length > 1 && !isHallucination) {
          console.log(`[WishPilot Whisper Result (${latencyMs}ms)]:`, text);

          if (this.onTranscript) {
            this.onTranscript({
              text,
              isFinal: true,
              speaker: 'Interviewer',
              latencyMs
            });
          }

          this.checkQuestion(text);
        }
      } else {
        const errText = await response.text();
        console.warn('[WishPilot Whisper API Error]', response.status, errText);
        if (this.onError) {
          this.onError(new Error(`Groq Whisper API ${response.status}: ${errText}`));
        }
      }
    } catch (e) {
      console.warn('[WishPilot Whisper Fetch Error]', e);
    } finally {
      this.isTranscribing = false;
    }
  }

  checkQuestion(text) {
    const clean = text.trim();
    if (clean.length < 3) return;

    if (clean !== this.lastTriggeredQuestion) {
      this.lastTriggeredQuestion = clean;
      console.log('[WishPilot Voice Question Detected]:', clean);
      if (this.onQuestionDetected) {
        this.onQuestionDetected(clean);
      }
    }
  }

  stop() {
    this.isListening = false;

    if (this.processor) {
      try {
        this.processor.disconnect();
      } catch {}
      this.processor = null;
    }

    if (this.silentGain) {
      try {
        this.silentGain.disconnect();
      } catch {}
      this.silentGain = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch {}
      this.analyser = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch {}
      this.mediaStream = null;
    }

    this.preRollBuffer = [];
    this.activeSpeechSamples = [];
    this.isSpeaking = false;
    this.silenceSamplesCount = 0;
    this.speechSamplesCount = 0;
    this.isTranscribing = false;

    if (this.onAudioLevel) {
      this.onAudioLevel(0);
    }
    console.log('[WishPilot Audio] Stopped listening.');
  }
}
