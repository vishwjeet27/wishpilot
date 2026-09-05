/**
 * WishPilot - Stealth Live Interview & Preparation Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

import React, { useState, useEffect, useRef } from 'react';
import StealthHUD from './components/StealthHUD';
import StudioDashboard from './components/StudioDashboard';
import StealthNotch from './components/StealthNotch';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';
import { AudioTranscriber } from './services/audioTranscriber';

export default function App() {
  const [mode, setMode] = useState('studio'); // 'studio' | 'hud' | 'notch'
  const [lastFullMode, setLastFullMode] = useState('studio');
  const [settings, setSettings] = useState(storageService.getSettings());
  const [profile, setProfile] = useState(storageService.getProfile());
  const [apiKeys, setApiKeys] = useState(storageService.getApiKeys());
  const [isStealthActive, setIsStealthActive] = useState(true);
  const [platformInfo, setPlatformInfo] = useState({ platform: 'win32', isWayland: false });

  // Latency metrics tracking
  const [latencyMetrics, setLatencyMetrics] = useState({ stt: 0, ai: 0, total: 0 });

  // Proctor scanning results
  const [proctorStatus, setProctorStatus] = useState({ safe: true, detected: [] });

  // Real-time audio and question state
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [detectedQuestion, setDetectedQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);

  // Interview Sessions state
  const [sessions, setSessions] = useState(() => storageService.getSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storageService.getActiveSessionId());

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  // Screenshot context attached to vision query
  const [capturedScreenshot, setCapturedScreenshot] = useState(null);
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);

  // References
  const transcriberRef = useRef(null);
  const toggleListeningRef = useRef(null);
  const utteranceAccumulatorRef = useRef('');
  const lastChunkTimestampRef = useRef(0);

  const handleClearTranscript = () => {
    setCurrentTranscript('');
    setDetectedQuestion(null);
    utteranceAccumulatorRef.current = '';
    lastChunkTimestampRef.current = 0;
  };

  const handleSwitchSession = (sessionId) => {
    storageService.setActiveSessionId(sessionId);
    setActiveSessionId(sessionId);
    const session = storageService.getSessions().find((s) => s.id === sessionId);
    if (session) {
      const updatedProfile = {
        ...profile,
        name: session.candidateName || profile.name,
        targetCompany: session.company || profile.targetCompany,
        targetRole: session.targetRole || profile.targetRole,
        resumeText: session.resumeText || profile.resumeText,
        jobDescription: session.jobDescription || profile.jobDescription,
        skills: session.skills || profile.skills,
        category: session.category || profile.category || 'it'
      };
      setProfile(updatedProfile);
      storageService.saveProfile(updatedProfile);

      if (session.answerStyle) {
        const nextSettings = { ...settings, answerStyle: session.answerStyle };
        setSettings(nextSettings);
        storageService.saveSettings(nextSettings);
      }
      handleClearTranscript();
      setTranscriptHistory([]);
    }
  };

  const handleCreateSession = (sessionData) => {
    const newSession = storageService.createSession(sessionData);
    if (newSession) {
      const all = storageService.getSessions();
      setSessions(all);
      handleSwitchSession(newSession.id);
    }
    return newSession;
  };

  const handleUpdateSession = (sessionId, updates) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      const updated = storageService.saveSession({ ...session, ...updates });
      const all = storageService.getSessions();
      setSessions(all);
      if (activeSessionId === sessionId) {
        handleSwitchSession(sessionId);
      }
      return updated;
    }
  };

  const handleDeleteSession = (sessionId) => {
    const ok = storageService.deleteSession(sessionId);
    if (ok) {
      const all = storageService.getSessions();
      setSessions(all);
      const newActiveId = storageService.getActiveSessionId();
      setActiveSessionId(newActiveId);
      handleSwitchSession(newActiveId);
    }
    return ok;
  };

  const handleExportSession = (sessionId, format = 'markdown') => {
    const session = sessions.find((s) => s.id === sessionId) || activeSession;
    if (!session) return;
    if (format === 'json') {
      storageService.exportSessionJSON(session);
    } else {
      storageService.exportSessionMarkdown(session);
    }
  };

  // Scan host process list for blacklisted proctoring binaries
  const handleCheckProctors = async () => {
    if (window.wishpilot?.checkProctors) {
      try {
        const result = await window.wishpilot.checkProctors();
        setProctorStatus(result || { safe: true, detected: [] });
        return result;
      } catch (e) {
        console.warn('[WishPilot] Proctor check failed:', e);
      }
    }
    return { safe: true, detected: [] };
  };

  // Capture current screen content for vision analysis
  const captureScreenshot = async () => {
    if (!window.wishpilot?.captureScreen) return;
    setIsCapturingScreen(true);
    try {
      const result = await window.wishpilot.captureScreen();
      if (result.success && result.image) {
        setCapturedScreenshot(result.image);
        console.log('[WishPilot] Screen capture attached to context.');
      }
    } catch (e) {
      console.warn('[WishPilot] Screen capture failed:', e);
    } finally {
      setIsCapturingScreen(false);
    }
  };

  // Subscribe to Electron IPC events and global hotkeys
  useEffect(() => {
    // Initial proctor software security check
    handleCheckProctors();

    if (window.wishpilot?.getStealthStatus) {
      window.wishpilot.getStealthStatus().then((status) => {
        if (typeof status === 'boolean') {
          setIsStealthActive(status);
        }
      }).catch(() => {});
    }

    if (window.wishpilot?.getPlatformInfo) {
      window.wishpilot.getPlatformInfo().then((info) => {
        if (info) {
          setPlatformInfo(info);
        }
      }).catch(() => {});
    }

    // Ctrl+Shift+S = silent screenshot capture (no modal)
    const cleanupSnip = window.wishpilot?.onTriggerSnip?.(() => {
      captureScreenshot();
    });

    const cleanupPanic = window.wishpilot?.onPanicTriggered?.(() => {
      if (transcriberRef.current) {
        transcriberRef.current.stop();
        setIsListening(false);
      }
    });

    const cleanupAnswer = window.wishpilot?.onTriggerAnswer?.(() => {
      handleAnswerNow();
    });

    const cleanupDock = window.wishpilot?.onDockNotch?.(() => {
      setLastFullMode((prev) => (mode === 'notch' ? prev : mode));
      handleSetMode('notch');
    });

    const cleanupMic = window.wishpilot?.onToggleMic?.(() => {
      if (toggleListeningRef.current) toggleListeningRef.current();
    });

    return () => {
      if (cleanupSnip) cleanupSnip();
      if (cleanupPanic) cleanupPanic();
      if (cleanupAnswer) cleanupAnswer();
      if (cleanupDock) cleanupDock();
      if (cleanupMic) cleanupMic();
    };
  }, [detectedQuestion, currentTranscript, mode]);

  // Initialize AudioTranscriber (Groq Whisper)
  useEffect(() => {
    transcriberRef.current = new AudioTranscriber({
      apiKey: apiKeys.groq,
      audioSource: settings.audioSource || 'mic',
      onTranscript: ({ text, isFinal, latencyMs }) => {
        if (latencyMs) {
          setLatencyMetrics((prev) => ({
            ...prev,
            stt: latencyMs,
            total: latencyMs + (prev.ai || 0)
          }));
        }

        const clean = (text || '').trim();
        if (!clean) return;

        const now = Date.now();
        const timeSinceLast = now - lastChunkTimestampRef.current;
        const prevEndsSentence = /[?!.]$/.test(utteranceAccumulatorRef.current.trim());

        // If previous chunk arrived within 3.5s and wasn't a finished sentence, accumulate into the prompt
        let fullUtterance = clean;
        if (timeSinceLast < 3500 && utteranceAccumulatorRef.current && !prevEndsSentence) {
          fullUtterance = `${utteranceAccumulatorRef.current} ${clean}`.trim();
        }
        utteranceAccumulatorRef.current = fullUtterance;
        lastChunkTimestampRef.current = now;

        setCurrentTranscript(fullUtterance);
        if (fullUtterance.length >= 3) {
          setDetectedQuestion(fullUtterance);
        }
        if (isFinal && fullUtterance) {
          setTranscriptHistory((prev) => {
            const copy = [...prev];
            if (copy.length > 0 && timeSinceLast < 3500) {
              copy[copy.length - 1] = fullUtterance;
              return copy;
            }
            return [...copy.slice(-10), fullUtterance];
          });
        }
      },
      onQuestionDetected: (voicePrompt) => {
        const fullPrompt = utteranceAccumulatorRef.current || (voicePrompt || '').trim();
        if (fullPrompt) {
          setDetectedQuestion(fullPrompt);
          if (settings.autoGenerateAnswer && settings.answerTriggerMode === 'auto') {
            triggerAnswerGeneration(fullPrompt);
          }
        }
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onError: (err) => {
        console.warn('Transcriber warning:', err);
      }
    });

    return () => {
      if (transcriberRef.current) {
        transcriberRef.current.stop();
      }
    };
  }, [settings, profile, apiKeys]);

  const handleAnswerNow = (customQ) => {
    const q =
      customQ ||
      detectedQuestion ||
      currentTranscript ||
      (transcriptHistory.length > 0 ? transcriptHistory[transcriptHistory.length - 1] : '') ||
      (capturedScreenshot ? 'Analyze the captured screenshot and provide the complete solution or answer.' : '');
    if (q && q.trim()) {
      setDetectedQuestion(q.trim());
      triggerAnswerGeneration(q.trim());
    }
  };

  const handleSendScreenshot = (customPrompt) => {
    const prompt =
      customPrompt ||
      detectedQuestion ||
      currentTranscript ||
      'Analyze the captured screenshot and provide the complete solution or answer.';
    setDetectedQuestion(prompt);
    triggerAnswerGeneration(prompt);
  };

  const toggleListening = async () => {
    if (!transcriberRef.current) return;
    if (isListening) {
      transcriberRef.current.stop();
      setIsListening(false);
      setAudioLevel(0);
    } else {
      try {
        transcriberRef.current.setApiKey(apiKeys.groq);
        transcriberRef.current.setAudioSource(settings.audioSource || 'mic');
        await transcriberRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('[WishPilot] Failed to start microphone:', err);
        setIsListening(false);
        setAudioLevel(0);
      }
    }
  };
  toggleListeningRef.current = toggleListening;

  const triggerAnswerGeneration = async (question) => {
    setIsGenerating(true);
    setCurrentAnswer('');
    utteranceAccumulatorRef.current = '';
    lastChunkTimestampRef.current = 0;

    const context = transcriptHistory.slice(-8).join('\n');

    await aiService.generateAnswer({
      question,
      transcriptContext: context,
      // Pass screenshot as visual context if one was captured
      screenshotDataUrl: capturedScreenshot || null,
      profile,
      settings,
      apiKeys,
      onChunk: (chunk) => {
        setCurrentAnswer(chunk);
      },
      onComplete: (finalAnswer, meta) => {
        setCurrentAnswer(finalAnswer);
        setIsGenerating(false);
        if (meta?.totalMs) {
          setLatencyMetrics((prev) => ({
            ...prev,
            ai: meta.totalMs,
            total: (prev.stt || 0) + meta.totalMs
          }));
        }
        // Clear screenshot after use (one-shot context)
        setCapturedScreenshot(null);
        const historyItem = {
          id: Date.now(),
          question,
          answer: finalAnswer,
          timestamp: new Date().toLocaleTimeString()
        };
        storageService.saveSessionHistoryItem(activeSessionId, historyItem);
        setSessions(storageService.getSessions());
      },
      onError: (err) => {
        console.error('Answer generation error', err);
        setIsGenerating(false);
      }
    });
  };

  const handleRefineAnswer = async (refinementType) => {
    if (!currentAnswer || isGenerating) return;

    const question =
      detectedQuestion ||
      currentTranscript ||
      (transcriptHistory.length > 0 ? transcriptHistory[transcriptHistory.length - 1] : '') ||
      'Interview Question';

    setIsGenerating(true);

    await aiService.refineAnswer({
      question,
      previousAnswer: currentAnswer,
      refinementType,
      profile,
      settings,
      apiKeys,
      onChunk: (chunk) => {
        setCurrentAnswer(chunk);
      },
      onComplete: (finalAnswer, meta) => {
        setCurrentAnswer(finalAnswer);
        setIsGenerating(false);
        if (meta?.totalMs) {
          setLatencyMetrics((prev) => ({
            ...prev,
            ai: meta.totalMs,
            total: (prev.stt || 0) + meta.totalMs
          }));
        }
        const historyItem = {
          id: Date.now(),
          question: `[Refined: ${refinementType.toUpperCase()}] ${question}`,
          answer: finalAnswer,
          timestamp: new Date().toLocaleTimeString()
        };
        storageService.saveSessionHistoryItem(activeSessionId, historyItem);
        setSessions(storageService.getSessions());
      },
      onError: (err) => {
        console.error('Refinement error', err);
        setIsGenerating(false);
      }
    });
  };

  const handleSetMode = async (newMode) => {
    if (newMode !== 'notch') {
      setLastFullMode(newMode);
    }
    setMode(newMode);
    if (window.wishpilot?.setMode) {
      await window.wishpilot.setMode(newMode);
    }
  };

  const handleToggleStealth = async () => {
    const next = !isStealthActive;
    if (window.wishpilot?.toggleStealth) {
      const success = await window.wishpilot.toggleStealth(next);
      setIsStealthActive(success);
    } else {
      setIsStealthActive(next);
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  const handleSaveApiKeys = (newKeys) => {
    setApiKeys(newKeys);
    storageService.saveApiKeys(newKeys);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent">
      {mode === 'notch' ? (
        <StealthNotch
          isListening={isListening}
          audioLevel={audioLevel}
          detectedQuestion={detectedQuestion}
          onExpand={() => handleSetMode(lastFullMode || 'studio')}
          onGenerateAnswer={handleAnswerNow}
          isGenerating={isGenerating}
        />
      ) : mode === 'studio' ? (
        <StudioDashboard
          settings={settings}
          onSaveSettings={handleSaveSettings}
          profile={profile}
          onSaveProfile={handleSaveProfile}
          apiKeys={apiKeys}
          onSaveApiKeys={handleSaveApiKeys}
          activeSession={activeSession}
          sessions={sessions}
          onSwitchSession={handleSwitchSession}
          onCreateSession={handleCreateSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
          onExportSession={handleExportSession}
          isStealthActive={isStealthActive}
          onToggleStealth={handleToggleStealth}
          onLaunchHUD={() => handleSetMode('hud')}
          isListening={isListening}
          onToggleListening={toggleListening}
          audioLevel={audioLevel}
          currentTranscript={currentTranscript}
          detectedQuestion={detectedQuestion}
          currentAnswer={currentAnswer}
          isGenerating={isGenerating}
          onGenerateAnswer={handleAnswerNow}
          onRefineAnswer={handleRefineAnswer}
          onClearTranscript={handleClearTranscript}
          latencyMetrics={latencyMetrics}
          proctorStatus={proctorStatus}
          onCheckProctors={handleCheckProctors}
          platformInfo={platformInfo}
        />
      ) : (
        <StealthHUD
          settings={settings}
          onSaveSettings={handleSaveSettings}
          profile={profile}
          apiKeys={apiKeys}
          activeSession={activeSession}
          sessions={sessions}
          onSwitchSession={handleSwitchSession}
          isStealthActive={isStealthActive}
          onToggleStealth={handleToggleStealth}
          platformInfo={platformInfo}
          onSwitchMode={() => handleSetMode('studio')}
          onCaptureScreenshot={captureScreenshot}
          capturedScreenshot={capturedScreenshot}
          isCapturingScreen={isCapturingScreen}
          onClearScreenshot={() => setCapturedScreenshot(null)}
          onSendScreenshot={handleSendScreenshot}
          currentTranscript={currentTranscript}
          detectedQuestion={detectedQuestion}
          currentAnswer={currentAnswer}
          isGenerating={isGenerating}
          audioLevel={audioLevel}
          isListening={isListening}
          onToggleListening={toggleListening}
          onGenerateAnswer={handleAnswerNow}
          onRefineAnswer={handleRefineAnswer}
          latencyMetrics={latencyMetrics}
          proctorStatus={proctorStatus}
          onManualAsk={(q) => {
            setDetectedQuestion(q);
            triggerAnswerGeneration(q);
          }}
          onClearTranscript={handleClearTranscript}
        />
      )}
    </div>
  );
}
