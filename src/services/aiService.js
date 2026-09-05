/**
 * WishPilot - Universal Stealth Interview Copilot (AI Engine)
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

import { getCategoryById, REFINEMENT_TYPES } from '../constants/interviewCategories';

/**
 * AI Service
 * Unified streaming interface for Groq, OpenRouter, OpenAI, and Gemini APIs.
 */

export const aiService = {
  async generateAnswer({
    question,
    transcriptContext = '',
    screenshotDataUrl = null,
    profile,
    settings,
    apiKeys,
    onChunk,
    onComplete,
    onError
  }) {
    const provider = settings.provider || 'groq';
    const apiKey = apiKeys[provider]?.trim();

    // Fallback simulation when running locally without active API credentials
    if (!apiKey) {
      console.warn(`[WishPilot] No API key configured for ${provider}. Falling back to simulation mode.`);
      return this.simulateAnswer({ question, profile, onChunk, onComplete });
    }

    const systemPrompt = this.buildSystemPrompt(profile, settings, Boolean(screenshotDataUrl));
    const userPrompt = `LIVE INTERVIEW TRANSCRIPT & CONTEXT STREAM:
"""
${transcriptContext ? `PREVIOUS CONVERSATION CONTEXT:\n${transcriptContext}\n\n` : ''}LATEST DETECTED SPEECH / QUESTION / CROSS-QUESTION:
${question}
"""
${screenshotDataUrl ? `\n\nSCREENSHOT VISUAL CONTEXT & INSTRUCTIONS:
- A screenshot of the candidate's active screen (e.g. LeetCode, HackerRank, IDE code, system design diagram, or browser) is attached as an image.
- Carefully examine the screen image: extract the exact problem statement, constraints, example inputs/outputs, or code.
- If it is a coding problem, provide the optimal, clean, production-grade code solution followed by Time & Space Complexity (Big-O).
- If it is an architecture/diagram, explain the data flow, bottlenecks, and solution clearly.
- Provide a punchy spoken explanation so the candidate can speak naturally while coding.` : ''}

Filter out all conversational filler, small talk, and microphone noise. Identify the core question or cross-question asked by the interviewer and provide the direct spoken answer now.`;

    try {
      if (provider === 'groq') {
        await this.streamGroq({
          apiKey,
          model: settings.groqModel || 'openai/gpt-oss-120b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'cerebras') {
        await this.streamCerebras({
          apiKey,
          model: settings.cerebrasModel || 'llama-3.3-70b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'together') {
        await this.streamTogether({
          apiKey,
          model: settings.togetherModel || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'fireworks') {
        await this.streamFireworks({
          apiKey,
          model: settings.fireworksModel || 'accounts/fireworks/models/llama-v3p3-70b-instruct',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'nvidia') {
        await this.streamNvidia({
          apiKey,
          model: settings.nvidiaModel || 'nvidia/nemotron-3-ultra-550b-a55b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'huggingface') {
        await this.streamHuggingFace({
          apiKey,
          model: settings.huggingfaceModel || 'meta-llama/Llama-3.3-70B-Instruct',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'openrouter') {
        await this.streamOpenRouter({
          apiKey,
          model: settings.openrouterModel || 'anthropic/claude-3.5-sonnet',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'openai') {
        await this.streamOpenAI({
          apiKey,
          model: settings.openaiModel || 'gpt-4o',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      } else if (provider === 'gemini') {
        await this.callGemini({
          apiKey,
          model: settings.geminiModel || 'gemini-2.0-flash',
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete
        });
      }
    } catch (err) {
      console.error('[WishPilot AI Error]:', err);
      if (onError) onError(err);
      this.simulateAnswer({ question, profile, onChunk, onComplete, errorNote: `(API Error: ${err.message} - Displaying fallback preview)` });
    }
  },

  async refineAnswer({
    question,
    previousAnswer,
    refinementType,
    profile = {},
    settings = {},
    apiKeys = {},
    onChunk,
    onComplete,
    onError
  }) {
    const provider = settings.provider || 'groq';
    const apiKey = apiKeys[provider]?.trim();
    const refDef = REFINEMENT_TYPES.find((r) => r.id === refinementType) || REFINEMENT_TYPES[0];

    if (!apiKey) {
      console.warn(`[WishPilot] No API key configured for ${provider}. Falling back to simulation mode.`);
      return this.simulateRefinement({ question, previousAnswer, refinementType, profile, onChunk, onComplete });
    }

    const categoryId = profile.category || 'it';
    const categoryData = getCategoryById(categoryId);

    const systemPrompt = `You are WishPilot, an elite live stealth interview copilot.
INTERVIEW STREAM: ${categoryData.label.toUpperCase()} (${categoryData.frameworkName})

YOUR TASK:
Refine and rewrite the candidate's previous interview answer according to this directive:
${refDef.directive}

STRICT INSTRUCTIONS (MANDATORY):
1. ZERO META-TALK / ZERO FILLER: NEVER say "Here is a shorter version:", "Certainly!", "In simpler terms:", or "Revised answer:". Jump STRAIGHT into the refined spoken words ready to be read aloud by the candidate.
2. SPOKEN FIRST-PERSON VOICE: Speak in authentic, confident first-person ("I", "in my experience...", "we..."). Keep sentences crisp and natural to speak under interview pressure.
3. DOMAIN ACCURACY: Maintain precision with the candidate's role (${profile.targetRole || profile.role || categoryData.commonRoles[0]}) and background context.
4. STRUCTURE:
- AT THE VERY TOP OF THE REFINED ANSWER, PROVIDE:
  **SPEAK THIS FIRST (10s TL;DR)**:
  "[One confident spoken punchline directly reflecting this refined angle]"
- THEN PROVIDE THE REFINED BREAKDOWN ACCORDING TO "${refDef.label.toUpperCase()}":
  ${refDef.directive}`;

    const userPrompt = `ORIGINAL INTERVIEW QUESTION:
"${question || 'Interview Question'}"

PREVIOUS CANDIDATE ANSWER:
"""
${previousAnswer}
"""

REFINEMENT COMMAND:
Apply "${refDef.label}": ${refDef.directive}
Deliver the refined, ready-to-speak answer now:`;

    try {
      if (provider === 'groq') {
        await this.streamGroq({
          apiKey,
          model: settings.groqModel || 'openai/gpt-oss-120b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'cerebras') {
        await this.streamCerebras({
          apiKey,
          model: settings.cerebrasModel || 'llama-3.3-70b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'together') {
        await this.streamTogether({
          apiKey,
          model: settings.togetherModel || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'fireworks') {
        await this.streamFireworks({
          apiKey,
          model: settings.fireworksModel || 'accounts/fireworks/models/llama-v3p3-70b-instruct',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'nvidia') {
        await this.streamNvidia({
          apiKey,
          model: settings.nvidiaModel || 'nvidia/nemotron-3-ultra-550b-a55b',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'huggingface') {
        await this.streamHuggingFace({
          apiKey,
          model: settings.huggingfaceModel || 'meta-llama/Llama-3.3-70B-Instruct',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'openrouter') {
        await this.streamOpenRouter({
          apiKey,
          model: settings.openrouterModel || 'anthropic/claude-3.5-sonnet',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'openai') {
        await this.streamOpenAI({
          apiKey,
          model: settings.openaiModel || 'gpt-4o',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      } else if (provider === 'gemini') {
        await this.callGemini({
          apiKey,
          model: settings.geminiModel || 'gemini-2.0-flash',
          systemPrompt,
          userPrompt,
          screenshotDataUrl: null,
          onChunk,
          onComplete
        });
      }
    } catch (err) {
      console.error('[WishPilot AI Refinement Error]:', err);
      if (onError) onError(err);
      this.simulateRefinement({ question, previousAnswer, refinementType, profile, onChunk, onComplete, errorNote: `(API Error: ${err.message} - Displaying fallback preview)` });
    }
  },

  buildSystemPrompt(profile, settings, isVision = false) {
    const categoryId = profile.category || 'it';
    const categoryData = getCategoryById(categoryId);

    const styleInstructions = {
      concise: `Format as 2 to 4 punchy, natural spoken points or numbered steps ready for the candidate to speak in 30-45 seconds. Avoid long essays.`,
      star: `Structure as Situation, Task, Action, Result. Keep each section concise and conversational.`,
      technical: `Focus on technical precision, domain formulas, trade-offs, methodologies, and edge cases.`
    }[settings.answerStyle || categoryData.recommendedAnswerStyle || 'concise'];

    // In vision mode, omit full multi-page resume text to stay comfortably below token rate limits
    const backgroundContext = isVision
      ? `- Background & Skills: ${profile.skills || categoryData.defaultSkills}`
      : `CANDIDATE BACKGROUND & EXPERTISE:\n${profile.resumeText || profile.skills || categoryData.defaultSkills}`;

    const promptContext = categoryData.promptContext || {};
    const rulesList = (promptContext.rules || [])
      .map((r) => `   - ${r}`)
      .join('\n');

    return `You are WishPilot, an elite live stealth interview copilot.
INTERVIEW STREAM: ${categoryData.label.toUpperCase()} (${categoryData.frameworkName})

STRICT INSTRUCTIONS (MANDATORY):
1. ZERO META-TALK / ZERO FILLER: NEVER say "Here's what you can say", "Certainly!", "As a candidate, you should say...", "Here is an answer:", or any introductory phrases. Jump STRAIGHT into the spoken answer. Every word you output should be ready for the candidate to speak aloud.
2. NO "RESUME PROOF" / NO FAKE BRAGGING: NEVER output "RESUME PROOF:", "PROOF POINT:", or artificial resume citation blocks. Do not invent fictitious past claims or project titles. If relevant technologies or experiences match the candidate's background, mention them naturally inside the spoken flow without meta-labels.
3. STRUCTURE (ALWAYS START WITH A 10-SECOND SPOKEN TL;DR):
- AT THE VERY TOP OF EVERY ANSWER, PROVIDE:
  **SPEAK THIS FIRST (10s TL;DR)**:
  "[${promptContext.tlDrDirective || 'One confident, high-impact spoken punchline directly answering the core of the question, so the candidate can start speaking immediately with zero awkward silence while reviewing details below'}]"

- THEN PROVIDE THE DETAILED SPOKEN BREAKDOWN:
${categoryData.id === 'it' ? `  - If asked for "step by step", "how to", "architecture", or multi-part flows:
    **Step 1: [Core Action/Component]** - Concise explanation.
    **Step 2: [Processing/Pipeline]** - Mechanism and flow.
    **Step 3: [Storage/Integration/Scale]** - Trade-offs, scaling, and edge cases.
  - For coding questions, provide the clean optimal code immediately followed by time/space complexity.
  - For general questions, provide 2 to 4 direct, high-impact bullet points easy to scan and speak.` : `  - Structure using the **${categoryData.frameworkName}**:
    ${promptContext.frameworkGuideline || 'Provide structured, actionable conversational points ready to speak.'}
  - Provide 2 to 4 clear, high-impact spoken bullet points or numbered action steps easy to scan in high pressure.`}

4. DOMAIN SPECIFIC RULES:
${rulesList || '   - Maintain professional domain precision.'}

5. NOISE & LONG TRANSCRIPT HANDLING: The microphone stays on continuously throughout the interview. Discard all filler, thinking pauses, and incomplete background fragments. Identify the true core question or task and answer that directly.
6. FIRST-PERSON NATURAL VOICE: Speak in authentic, confident first-person ("I", "in my previous team...", "we can..."). Keep sentences crisp and easy to speak naturally.

STYLE GUIDE:
${styleInstructions}

CANDIDATE CONTEXT:
- Name: ${profile.name || 'Candidate'}
- Target Role: ${profile.targetRole || profile.role || categoryData.commonRoles[0]}
- Target Company: ${profile.targetCompany || 'Target Organization'}
- Category / Stream: ${categoryData.label}
${profile.jobDescription && !isVision ? `\nTARGET JOB REQUIREMENTS & JD HIGHLIGHTS:\n${profile.jobDescription.slice(0, 1000)}` : ''}

${backgroundContext}`;
  },

  // Groq chat completion stream with vision routing and rate limit auto-retry
  async streamGroq({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete, retryCount = 0 }) {
    // Use llama-4-scout for vision (stable multimodal, no reasoning overhead) and the configured model otherwise
    const effectiveModel = screenshotDataUrl ? 'meta-llama/llama-4-scout-17b-16e-instruct' : (model || 'openai/gpt-oss-120b');

    const userContent = screenshotDataUrl
      ? [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: screenshotDataUrl } }
        ]
      : userPrompt;

    // Increase token budget for vision to avoid truncated outputs
    const maxTokens = screenshotDataUrl ? 1024 : 1000;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.5,
        max_tokens: maxTokens,
        stream: true
      })
    });

    if (!response.ok) {
      const errBody = await response.text();

      // Automatically handle transient 429 rate limit backoff
      if (response.status === 429 && retryCount < 2) {
        const waitMatch = errBody.match(/try again in ([0-9.]+)s/i);
        const waitSeconds = waitMatch ? parseFloat(waitMatch[1]) : 3.5;
        const delayMs = Math.min(Math.ceil((waitSeconds + 0.6) * 1000), 8000);

        console.warn(`[WishPilot Groq] 429 rate limit reached. Auto-retrying after ${delayMs}ms... (attempt ${retryCount + 1})`);
        if (onChunk) {
          onChunk(`*(Syncing with model... generating optimal answer in ${Math.ceil(delayMs / 1000)}s)*\n\n`);
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));

        return this.streamGroq({
          apiKey,
          model,
          systemPrompt,
          userPrompt,
          screenshotDataUrl,
          onChunk,
          onComplete,
          retryCount: retryCount + 1
        });
      }

      throw new Error(`Groq API returned ${response.status}: ${errBody}`);
    }

    await this.processSSEStream(response, onChunk, onComplete);
  },

  // OpenRouter API
  async streamOpenRouter({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    // Build user message content - add image if screenshot is available
    const userContent = screenshotDataUrl
      ? [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: screenshotDataUrl } }
        ]
      : userPrompt;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wishpilot.app',
        'X-Title': 'WishPilot Copilot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenRouter returned ${response.status}: ${errBody}`);
    }

    await this.processSSEStream(response, onChunk, onComplete);
  },

  // OpenAI API
  async streamOpenAI({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    const userContent = screenshotDataUrl
      ? [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: screenshotDataUrl } }
        ]
      : userPrompt;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI returned ${response.status}: ${errBody}`);
    }

    await this.processSSEStream(response, onChunk, onComplete);
  },

  // Reusable OpenAI-Compatible SSE Streaming Client
  async streamOpenAICompatible({
    url,
    apiKey,
    model,
    systemPrompt,
    userPrompt,
    screenshotDataUrl = null,
    extraHeaders = {},
    extraBody = {},
    maxTokens = null,
    temperature = 0.5,
    onChunk,
    onComplete,
    providerName = 'API'
  }) {
    const userContent = screenshotDataUrl
      ? [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: screenshotDataUrl } }
        ]
      : userPrompt;

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      stream: true,
      temperature,
      ...extraBody
    };

    if (maxTokens) {
      payload.max_tokens = maxTokens;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...extraHeaders
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`${providerName} returned ${response.status}: ${errBody}`);
    }

    await this.processSSEStream(response, onChunk, onComplete);
  },

  // Cerebras Ultra-Fast Inference
  async streamCerebras({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    return this.streamOpenAICompatible({
      url: 'https://api.cerebras.ai/v1/chat/completions',
      apiKey,
      model: model || 'llama-3.3-70b',
      systemPrompt,
      userPrompt,
      screenshotDataUrl,
      maxTokens: 1024,
      onChunk,
      onComplete,
      providerName: 'Cerebras'
    });
  },

  // Together AI Cloud Inference
  async streamTogether({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    return this.streamOpenAICompatible({
      url: 'https://api.together.xyz/v1/chat/completions',
      apiKey,
      model: model || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      systemPrompt,
      userPrompt,
      screenshotDataUrl,
      maxTokens: 1024,
      onChunk,
      onComplete,
      providerName: 'Together AI'
    });
  },

  // Fireworks AI Inference
  async streamFireworks({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    return this.streamOpenAICompatible({
      url: 'https://api.fireworks.ai/inference/v1/chat/completions',
      apiKey,
      model: model || 'accounts/fireworks/models/llama-v3p3-70b-instruct',
      systemPrompt,
      userPrompt,
      screenshotDataUrl,
      maxTokens: 1024,
      onChunk,
      onComplete,
      providerName: 'Fireworks AI'
    });
  },

  // NVIDIA NIM API (including Nemotron 550B, Llama-3.3, DeepSeek-R1)
  async streamNvidia({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    const chosenModel = model || 'nvidia/nemotron-3-ultra-550b-a55b';
    const extraBody = chosenModel.includes('nemotron')
      ? { extra_body: { chat_template_kwargs: { enable_thinking: true } } }
      : {};

    return this.streamOpenAICompatible({
      url: 'https://integrate.api.nvidia.com/v1/chat/completions',
      apiKey,
      model: chosenModel,
      systemPrompt,
      userPrompt,
      screenshotDataUrl,
      maxTokens: 1024,
      extraBody,
      onChunk,
      onComplete,
      providerName: 'NVIDIA NIM'
    });
  },

  // Hugging Face Serverless Inference API (OpenAI-compatible router)
  async streamHuggingFace({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    return this.streamOpenAICompatible({
      url: 'https://router.huggingface.co/v1/chat/completions',
      apiKey,
      model: model || 'meta-llama/Llama-3.3-70B-Instruct',
      systemPrompt,
      userPrompt,
      screenshotDataUrl,
      maxTokens: 1024,
      onChunk,
      onComplete,
      providerName: 'Hugging Face'
    });
  },

  // Google Gemini API
  async callGemini({ apiKey, model, systemPrompt, userPrompt, screenshotDataUrl = null, onChunk, onComplete }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    // Build parts - add image if screenshot captured
    const parts = [{ text: `${systemPrompt}\n\n${userPrompt}` }];
    if (screenshotDataUrl) {
      const base64Data = screenshotDataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const mimeType = screenshotDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/)?.[1] || 'image/png';
      parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts }
        ]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API returned ${response.status}: ${errBody}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              fullText += textPart;
              if (onChunk) onChunk(fullText);
            }
          } catch {}
        }
      }
    }
    if (onComplete) onComplete(fullText);
  },

  // Generic SSE Stream processor for OpenAI/Groq/OpenRouter format
  async processSSEStream(response, onChunk, onComplete) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';
    const startTime = Date.now();
    let firstTokenMs = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') break;
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) {
              if (firstTokenMs === null) {
                firstTokenMs = Date.now() - startTime;
              }
              fullText += content;
              let sanitized = fullText;
              if (sanitized.includes('<think>')) {
                if (sanitized.includes('</think>')) {
                  sanitized = sanitized.replace(/<think>[\s\S]*?<\/think>/g, '').trimStart();
                } else {
                  continue;
                }
              }
              if (onChunk) onChunk(sanitized);
            }
          } catch (e) {
            // Ignore parse errors on partial frames
          }
        }
      }
    }
    let finalClean = fullText;
    if (finalClean.includes('<think>')) {
      finalClean = finalClean.replace(/<think>[\s\S]*?<\/think>/g, '').trimStart();
    }
    // Guard against empty model output (e.g. reasoning model exhausted token budget before producing visible text)
    if (!finalClean.trim()) {
      throw new Error('model output error: model output must contain either output text or tool calls. Try a different model or reduce screenshot size.');
    }
    const totalMs = Date.now() - startTime;
    if (onComplete) onComplete(finalClean, { firstTokenMs: firstTokenMs || totalMs, totalMs });
  },

  /**
   * Built-in intelligent simulation for immediate testing without API key
   */
  simulateAnswer({ question, profile, onChunk, onComplete, errorNote = '' }) {
    const qLower = (question || '').toLowerCase();
    let sampleAnswer = '';

    if (qLower.includes('scale') || qLower.includes('optimize') || qLower.includes('query') || qLower.includes('performance') || qLower.includes('latency')) {
      sampleAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "I resolve database bottlenecks systematically by analyzing query plans with EXPLAIN ANALYZE, adding targeted composite indexes, and introducing Redis caching to drop p99 latency by over 80%."

**Direct Answer**:
- *"In my experience with database optimization, I tackle latency bottlenecks systematically."*
- *"First, analyze execution plans with EXPLAIN ANALYZE to pinpoint table scans and missing indexes on high-cardinality columns."*
- *"Next, introduce multi-tier caching via Redis with cache pre-warming and connection pooling via PgBouncer."*
- *"As a result, p99 latency drops significantly while offloading read pressure from the primary database."*

**TECHNICAL DEEP DIVE**:
\`\`\`sql
-- Composite index added to eliminate sequential scans:
CREATE INDEX CONCURRENTLY idx_events_tenant_created 
ON events (tenant_id, created_at DESC) 
INCLUDE (payload_status);
\`\`\`
- *Key trade-off to mention:* Cache stampede protection using probabilistic early expiration (XFetch).`;
    } else if (qLower.includes('conflict') || qLower.includes('disagree') || qLower.includes('mistake') || qLower.includes('challenge')) {
      sampleAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "When technical disagreements arise, I align the team using empirical benchmarks rather than subjective opinions, resolving trade-offs with real metrics."

**Direct Answer**:
- *"I welcome disagreements because they usually reveal unspoken trade-offs. For example, when deciding between GraphQL and gRPC for internal service communication..."*
- *"My teammate advocated for GraphQL due to flexible client queries, while I proposed gRPC for binary protobuf serialization and low-latency internal RPCs."*
- *"Instead of debating theoretically, I set up a benchmark with realistic payloads. We discovered gRPC had 70% lower CPU overhead and 3x throughput for our microservices."*
- *"We adopted gRPC internally while keeping GraphQL for public client endpoints—an outcome the whole team agreed on."*

**STAR BREAKDOWN**:
- **Situation**: Architectural trade-off on service-to-service communication.
- **Task**: Align engineering team on a performant, maintainable protocol.
- **Action**: Built empirical benchmark measuring serialization latency & throughput.
- **Result**: Adopted gRPC for internal RPCs with 70% lower CPU overhead.`;
    } else {
      sampleAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "I approach system design with three core tenets: clear fault-tolerant isolation boundaries, real-time distributed observability, and resilient eventual consistency."

**Direct Answer**:
- *"I approach this systematically in three clear phases:"*
- *"First, establish clear boundaries and isolation to prevent cascading failures—using circuit breakers, exponential backoff, and idempotent retries."*
- *"Second, implement end-to-end observability with OpenTelemetry distributed tracing so bottlenecks are pinpointed in real time."*
- *"Third, ensure state consistency through outbox patterns or Kafka event streaming rather than dual-writes."*`;
    }

    if (errorNote) {
      sampleAnswer = `> **Notice**: ${errorNote}\n\n` + sampleAnswer;
    }

    // Stream out words with realistic latency
    const words = sampleAnswer.split(' ');
    let current = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        current += (i === 0 ? '' : ' ') + words[i];
        if (onChunk) onChunk(current);
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete(current, { firstTokenMs: 80, totalMs: 520 });
      }
    }, 28);
  },

  /**
   * Built-in intelligent simulation for instant refinement testing without API key
   */
  simulateRefinement({ question, previousAnswer, refinementType, profile, onChunk, onComplete, errorNote = '' }) {
    let refinedAnswer = '';

    if (refinementType === 'shorter') {
      refinedAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "In short: I isolate the primary bottleneck using live telemetry, apply targeted optimization to eliminate lock contention, and guard against recurrence with automated canary alerts—cutting turnaround by 75%."

**Direct Punchline (15s Elevator Pitch)**:
- "Rather than guessing or trial-and-error, I inspect query metrics and traces to isolate the exact constraint within minutes."
- "Once addressed, we enforce regression monitors so the system sustains high throughput under peak traffic without degradation."`;
    } else if (refinementType === 'technical') {
      refinedAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "Architecturally, I resolve this through asynchronous event-driven pipelines with Kafka, strict connection pooling via PgBouncer, and eventual consistency using the transactional outbox pattern."

**Deep Technical Architecture & Trade-Offs**:
- **Execution & Profiling**: Run \`EXPLAIN (ANALYZE, BUFFERS)\` to identify sequential disk scans, heap fetch overhead, and lock contention on high-cardinality keys.
- **Concurrency Control**: Transition from coarse table locks to optimistic concurrency control with advisory locking (\`SELECT FOR UPDATE SKIP LOCKED\`) to minimize thread blocking.
- **Cache Invalidation**: Implement probabilistic early expiration (XFetch algorithm) in Redis clusters to prevent cache stampedes under 50k+ RPS spikes.
- **Fundamental Trade-Off**: Accepted eventual consistency over distributed 2PC transactions to preserve sub-15ms p99 write latency.`;
    } else if (refinementType === 'example') {
      refinedAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "In my previous role, our ingestion service degraded under Black Friday traffic throwing 504 timeouts; I intervened, redesigned the transaction boundary, and restored 99.99% availability in 22 minutes."

**Production Case Study**:
- **The Situation**: During peak Q4 flash sales, our order processing cluster spiked to 98% CPU and payment gateway timeouts surged past 4.2%.
- **The Bottleneck**: Synchronous third-party HTTP calls inside an active database transaction were holding connection pools open for up to 3 seconds.
- **The Action**: I extracted the payment gateway dispatch into an asynchronous SQS queue with exponential backoff and idempotency keys, releasing database connections in under 2ms.
- **The Measurable Outcome**: Database connection starvation dropped to zero, throughput increased from 1,200 to 8,500 RPS, and we processed over $3.4M in GMV with zero dropped orders.`;
    } else if (refinementType === 'simpler') {
      refinedAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "Think of this like an airport security checkpoint: if every bag check stops the entire line, everything halts; by adding an express lane and pre-sorting items, travelers move through smoothly without delay."

**Plain English Analogy**:
- "When people face this problem, the mistake is usually trying to cram everything into one giant, single-file line."
- "What I do instead is create a smart triage system: quick, routine requests get cleared instantly, while heavier tasks are handled on the side so they never block the main flow."
- "This gives customers an instant response, keeps the team calm under pressure, and makes sure the system never crashes during big surges."`;
    } else {
      refinedAnswer = `**SPEAK THIS FIRST (10s TL;DR)**: "I focus on delivering immediate clarity, structured milestones, and measurable execution."

**Refined Response**:
- "First, establish clear visibility on current blockers."
- "Second, execute the highest-leverage priority with zero friction."
- "Third, evaluate results with empirical metrics."`;
    }

    if (errorNote) {
      refinedAnswer = `> **Notice**: ${errorNote}\n\n` + refinedAnswer;
    }

    const words = refinedAnswer.split(' ');
    let current = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        current += (i === 0 ? '' : ' ') + words[i];
        if (onChunk) onChunk(current);
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete(current, { firstTokenMs: 80, totalMs: 480 });
      }
    }, 24);
  }
};
