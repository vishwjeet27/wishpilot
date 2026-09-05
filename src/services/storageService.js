/**
 * WishPilot - Local Storage & Session State Service
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

const STORAGE_KEYS = {
  SETTINGS: 'wishpilot_settings',
  PROFILE: 'wishpilot_profile',
  API_KEYS: 'wishpilot_api_keys',
  HISTORY: 'wishpilot_history'
};

const DEFAULT_SETTINGS = {
  stealthProtection: true,
  hudOpacity: 0.90,
  autoDetectQuestions: true,
  autoGenerateAnswer: false, // Default to explicit manual click trigger
  answerTriggerMode: 'manual', // 'manual' (click to generate) | 'auto' (instant)
  answerStyle: 'concise', // 'concise' | 'star' | 'technical'
  provider: 'groq', // 'groq' | 'cerebras' | 'together' | 'fireworks' | 'nvidia' | 'huggingface' | 'openrouter' | 'openai' | 'gemini'
  sttProvider: 'groq', // Groq Whisper Large v3 Turbo
  groqModel: 'openai/gpt-oss-120b',
  cerebrasModel: 'llama-3.3-70b',
  togetherModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  fireworksModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
  nvidiaModel: 'nvidia/nemotron-3-ultra-550b-a55b',
  huggingfaceModel: 'meta-llama/Llama-3.3-70B-Instruct',
  openrouterModel: 'anthropic/claude-3.5-sonnet',
  openaiModel: 'gpt-4o',
  geminiModel: 'gemini-2.0-flash',
  clickThrough: false,
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  audioSource: 'mic' // 'mic' | 'system' (WASAPI / meeting audio loopback)
};

const DEFAULT_PROFILE = {
  name: '',
  role: '',
  yearsOfExperience: '',
  targetCompany: '',
  targetRole: '',
  resumeText: '',
  jobDescription: '',
  category: 'it'
};

const DEFAULT_API_KEYS = {
  groq: '',
  cerebras: '',
  together: '',
  fireworks: '',
  nvidia: '',
  huggingface: '',
  openrouter: '',
  openai: '',
  gemini: ''
};

export const storageService = {
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const parsed = data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
      if (parsed.groqModel === 'llama-3.3-70b-versatile') {
        parsed.groqModel = 'openai/gpt-oss-120b';
      }
      return parsed;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile: (profile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },

  getApiKeys: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      return data ? { ...DEFAULT_API_KEYS, ...JSON.parse(data) } : DEFAULT_API_KEYS;
    } catch {
      return DEFAULT_API_KEYS;
    }
  },

  saveApiKeys: (keys) => {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    } catch (e) {
      console.error('Failed to save api keys:', e);
    }
  },

  getHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistoryItem: (item) => {
    try {
      const history = storageService.getHistory();
      const updated = [item, ...history].slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history item:', e);
    }
  },

  clearHistory: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  },

  // Sessions Management
  getSessions: () => {
    try {
      const data = localStorage.getItem('wishpilot_sessions');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  getActiveSessionId: () => {
    try {
      const activeId = localStorage.getItem('wishpilot_active_session_id');
      const sessions = storageService.getSessions();
      if (activeId && sessions.some((s) => s.id === activeId)) {
        return activeId;
      }
      return sessions[0]?.id || null;
    } catch {
      return null;
    }
  },

  getActiveSession: () => {
    const sessions = storageService.getSessions();
    if (sessions.length === 0) return null;
    const activeId = storageService.getActiveSessionId();
    return sessions.find((s) => s.id === activeId) || sessions[0] || null;
  },

  setActiveSessionId: (sessionId) => {
    try {
      localStorage.setItem('wishpilot_active_session_id', sessionId);
      const session = storageService.getSessions().find((s) => s.id === sessionId);
      if (session) {
        // Sync profile and settings
        const currentProfile = storageService.getProfile();
        const updatedProfile = {
          ...currentProfile,
          name: session.candidateName || currentProfile.name,
          targetCompany: session.company || currentProfile.targetCompany,
          targetRole: session.targetRole || currentProfile.targetRole,
          resumeText: session.resumeText || currentProfile.resumeText,
          jobDescription: session.jobDescription || currentProfile.jobDescription,
          skills: session.skills || currentProfile.skills,
          category: session.category || currentProfile.category || 'it'
        };
        storageService.saveProfile(updatedProfile);

        const currentSettings = storageService.getSettings();
        if (session.answerStyle) {
          storageService.saveSettings({ ...currentSettings, answerStyle: session.answerStyle });
        }
      }
    } catch (e) {
      console.error('Failed to set active session:', e);
    }
  },

  saveSession: (session) => {
    try {
      const sessions = storageService.getSessions();
      const idx = sessions.findIndex((s) => s.id === session.id);
      const updated = {
        ...session,
        category: session.category || 'it',
        updatedAt: new Date().toISOString()
      };
      if (idx >= 0) {
        sessions[idx] = updated;
      } else {
        sessions.push(updated);
      }
      localStorage.setItem('wishpilot_sessions', JSON.stringify(sessions));
      return updated;
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  },

  createSession: ({ name, company, targetRole, candidateName, skills, resumeText, jobDescription, answerStyle, category }) => {
    try {
      const sessions = storageService.getSessions();
      const existingProfile = storageService.getProfile();
      const newSession = {
        id: 'session_' + Date.now(),
        name: (name || `${company || 'Company'} - ${targetRole || 'Interview'}`).trim(),
        company: (company || 'Company').trim(),
        targetRole: (targetRole || 'Professional').trim(),
        candidateName: (candidateName || existingProfile.name || 'Candidate').trim(),
        skills: (skills || '').trim(),
        resumeText: resumeText || existingProfile.resumeText || '',
        jobDescription: jobDescription || '',
        answerStyle: answerStyle || 'concise',
        category: category || existingProfile.category || 'it',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: []
      };
      sessions.unshift(newSession);
      localStorage.setItem('wishpilot_sessions', JSON.stringify(sessions));
      storageService.setActiveSessionId(newSession.id);
      return newSession;
    } catch (e) {
      console.error('Failed to create session:', e);
      return null;
    }
  },

  deleteSession: (sessionId) => {
    try {
      let sessions = storageService.getSessions();
      sessions = sessions.filter((s) => s.id !== sessionId);
      localStorage.setItem('wishpilot_sessions', JSON.stringify(sessions));

      // If active session was deleted, switch to first remaining or clear
      const activeId = localStorage.getItem('wishpilot_active_session_id');
      if (activeId === sessionId) {
        if (sessions.length > 0) {
          storageService.setActiveSessionId(sessions[0].id);
        } else {
          localStorage.removeItem('wishpilot_active_session_id');
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to delete session:', e);
      return false;
    }
  },

  saveSessionHistoryItem: (sessionId, item) => {
    try {
      const sessions = storageService.getSessions();
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        if (!Array.isArray(session.history)) {
          session.history = [];
        }
        session.history = [item, ...session.history].slice(0, 50);
        session.updatedAt = new Date().toISOString();
        localStorage.setItem('wishpilot_sessions', JSON.stringify(sessions));
      }
      // Also write to generic history for backward compatibility
      storageService.saveHistoryItem(item);
    } catch (e) {
      console.error('Failed to save session history item:', e);
    }
  },

  clearSessionHistory: (sessionId) => {
    try {
      const sessions = storageService.getSessions();
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        session.history = [];
        session.updatedAt = new Date().toISOString();
        localStorage.setItem('wishpilot_sessions', JSON.stringify(sessions));
      }
    } catch (e) {
      console.error('Failed to clear session history:', e);
    }
  },

  exportSessionMarkdown: (session) => {
    if (!session) return;
    const history = session.history || [];
    let md = `# WishPilot Interview Transcript\n\n`;
    md += `**Session**: ${session.name || 'Interview'}\n`;
    md += `**Company**: ${session.company || 'N/A'}\n`;
    md += `**Role**: ${session.targetRole || 'N/A'}\n`;
    md += `**Candidate**: ${session.candidateName || 'Candidate'}\n`;
    md += `**Date**: ${new Date(session.updatedAt || session.createdAt).toLocaleString()}\n\n`;

    if (session.jobDescription) {
      md += `### Job Description\n\n\`\`\`\n${session.jobDescription}\n\`\`\`\n\n`;
    }

    md += `---\n\n## Recorded Questions & Live Answers (${history.length})\n\n`;

    if (history.length === 0) {
      md += `*No questions recorded in this session yet.*\n`;
    } else {
      history.forEach((item, idx) => {
        md += `### ${idx + 1}. Question (${item.timestamp || 'N/A'})\n\n`;
        md += `> **Question**: ${item.question}\n\n`;
        md += `#### AI Co-Pilot Spoken Answer:\n\n${item.answer}\n\n`;
        md += `---\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (session.name || 'interview_session').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    a.href = url;
    a.download = `${safeName}_transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportSessionJSON: (session) => {
    if (!session) return;
    const jsonStr = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (session.name || 'interview_session').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    a.href = url;
    a.download = `${safeName}_session.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
