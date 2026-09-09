import React, { useState, useRef, useEffect } from 'react';
import logoSrc from '../img-asset/logo.png';
import groqSvg from '../img-asset/provides-svg/Groq.svg';
import cerebrasSvg from '../img-asset/provides-svg/Cerebras.svg';
import togetherSvg from '../img-asset/provides-svg/Together_AI.svg';
import fireworksSvg from '../img-asset/provides-svg/Fireworks_AI.svg';
import nvidiaSvg from '../img-asset/provides-svg/NVIDIA.svg';
import huggingFaceSvg from '../img-asset/provides-svg/Hugging_Face.svg';
import openrouterSvg from '../img-asset/provides-svg/openrouter.svg';
import geminiSvg from '../img-asset/provides-svg/Gemini.svg';
import openaiSvg from '../img-asset/provides-svg/openai.svg';

const PROVIDER_SVGS = {
  groq: groqSvg,
  cerebras: cerebrasSvg,
  together: togetherSvg,
  fireworks: fireworksSvg,
  nvidia: nvidiaSvg,
  huggingface: huggingFaceSvg,
  openrouter: openrouterSvg,
  gemini: geminiSvg,
  openai: openaiSvg
};
import { INTERVIEW_CATEGORIES, getCategoryById, MOCK_TOPIC_LABELS } from '../constants/interviewCategories';
import RefinementPills from './RefinementPills';
import {
  Shield,
  Key,
  FileText,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink,
  Mic,
  MicOff,
  Play,
  CheckCircle2,
  Terminal,
  Upload,
  Minus,
  X,
  Monitor,
  Radio,
  Download,
  Copy,
  Trash2,
  Headphones,
  Volume2,
  Layers,
  Plus,
  Edit2,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';

const GROQ_MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'openai/gpt-oss-120b (Flagship)' },
  { id: 'openai/gpt-oss-20b', label: 'openai/gpt-oss-20b (Ultra-Fast)' },
  { id: 'qwen/qwen3.8-27b', label: 'qwen/qwen3.8-27b (Reasoning)' },
  { id: 'qwen/qwen3.6-27b', label: 'qwen/qwen3.6-27b' },
  { id: 'groq/compound', label: 'groq/compound' },
  { id: 'groq/compound-mini', label: 'groq/compound-mini' },
  { id: 'whisper-large-v3-turbo', label: 'whisper-large-v3-turbo (STT)' },
  { id: 'whisper-large-v3', label: 'whisper-large-v3 (STT)' }
];

const CEREBRAS_MODELS = [
  { id: 'llama-3.3-70b', label: 'llama-3.3-70b (Flagship ~1,800 tok/s)' },
  { id: 'llama3.1-70b', label: 'llama3.1-70b (Ultra-Fast)' },
  { id: 'llama3.1-8b', label: 'llama3.1-8b (Instant)' },
  { id: 'qwen-3-32b', label: 'qwen-3-32b (Reasoning)' }
];

const TOGETHER_MODELS = [
  { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'meta-llama/Llama-3.3-70B-Instruct-Turbo (Recommended)' },
  { id: 'deepseek-ai/DeepSeek-R1', label: 'deepseek-ai/DeepSeek-R1 (Reasoning)' },
  { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen/Qwen2.5-72B-Instruct-Turbo (Code & Logic)' },
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', label: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo (Flagship 405B)' },
  { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', label: 'mistralai/Mixtral-8x7B-Instruct-v0.1' }
];

const FIREWORKS_MODELS = [
  { id: 'accounts/fireworks/models/llama-v3p3-70b-instruct', label: 'llama-v3p3-70b-instruct (Recommended)' },
  { id: 'accounts/fireworks/models/deepseek-r1', label: 'deepseek-r1 (Reasoning)' },
  { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', label: 'qwen2p5-72b-instruct (Coding)' },
  { id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', label: 'llama-v3p1-405b-instruct (405B)' }
];

const NVIDIA_MODELS = [
  { id: 'nvidia/nemotron-3-ultra-550b-a55b', label: 'nvidia/nemotron-3-ultra-550b-a55b (Flagship 550B MoE)' },
  { id: 'meta/llama-3.3-70b-instruct', label: 'meta/llama-3.3-70b-instruct (High Accuracy)' },
  { id: 'deepseek-ai/deepseek-r1', label: 'deepseek-ai/deepseek-r1 (Reasoning)' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'nvidia/llama-3.1-nemotron-70b-instruct' }
];

const HUGGINGFACE_MODELS = [
  { id: 'meta-llama/Llama-3.3-70B-Instruct', label: 'meta-llama/Llama-3.3-70B-Instruct (Recommended)' },
  { id: 'deepseek-ai/DeepSeek-R1', label: 'deepseek-ai/DeepSeek-R1 (Reasoning)' },
  { id: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen/Qwen2.5-72B-Instruct (Accurate)' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'mistralai/Mistral-7B-Instruct-v0.3' }
];

const PROVIDERS = [
  { id: 'groq', label: 'Groq Cloud', sub: 'Fastest' },
  { id: 'cerebras', label: 'Cerebras', sub: 'Ultra-Fast' },
  { id: 'together', label: 'Together AI', sub: 'Cloud' },
  { id: 'fireworks', label: 'Fireworks AI', sub: 'Low Latency' },
  { id: 'nvidia', label: 'NVIDIA NIM', sub: 'Nemotron' },
  { id: 'huggingface', label: 'Hugging Face', sub: 'Serverless' },
  { id: 'openrouter', label: 'OpenRouter', sub: 'Multi-Model' },
  { id: 'gemini', label: 'Gemini', sub: 'Google' },
  { id: 'openai', label: 'OpenAI Direct', sub: 'Official' }
];

const ProviderIcon = ({ provider, size = 14, style, className }) => {
  const svgSrc = PROVIDER_SVGS[provider];
  if (!svgSrc) return null;
  return (
    <img
      src={svgSrc}
      alt={provider}
      className={className}
      style={{
        height: `${size}px`,
        width: 'auto',
        maxHeight: `${size}px`,
        maxWidth: `${size * 2.8}px`,
        objectFit: 'contain',
        verticalAlign: 'middle',
        flexShrink: 0,
        display: 'inline-block',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
};

const NAV_ITEMS = [
  { id: 'sessions', label: 'Sessions & Roles', icon: Layers },
  { id: 'models', label: 'Models & Audio', icon: Key },
  { id: 'copilot', label: 'Live Test Lab', icon: Play },
  { id: 'mock', label: 'Mock Simulator', icon: Radio },
  { id: 'history', label: 'Debrief & Export', icon: Download },
  { id: 'profile', label: 'Resume & JD', icon: FileText },
  { id: 'stealth', label: 'Display & Environment', icon: Shield },
  { id: 'about', label: 'About', icon: Info }
];

const MOCK_QUESTIONS = {
  backend: [
    'How do you design an idempotent payment processing service handling 5,000 transactions per second?',
    'Explain how you would resolve a database connection pool exhaustion incident in production under heavy load.',
    'What are the trade-offs between optimistic locking and pessimistic locking in high-throughput updates?',
    'How do Kafka consumer groups handle partition rebalancing during sudden worker crashes?'
  ],
  algorithms: [
    'Given an array of intervals, merge all overlapping intervals in O(N log N) time.',
    'How would you implement an LRU Cache with O(1) get and put operations without using built-in OrderedDict?',
    'Explain how Dijkstra algorithm works versus A* search for shortest path calculations.',
    'How would you detect a cycle in a directed graph using Kahn algorithm (topological sort)?'
  ],
  system_design: [
    'Design a real-time collaborative document editing system like Google Docs using CRDTs or Operational Transformation.',
    'Design a distributed URL shortener (like bit.ly) that scales to 100M daily active redirects.',
    'How would you design a distributed rate limiter that works consistently across multiple geographical regions?',
    'Design a notification delivery engine that guarantees at-least-once delivery to millions of mobile push endpoints.'
  ],
  behavioral: [
    'Tell me about a time you strongly disagreed with a senior architect technical decision. How did you handle it?',
    'Describe a situation where a major bug reached production. How did you remediate and prevent recurrence?',
    'How do you prioritize technical debt versus shipping critical product features when deadlines are aggressive?',
    'Give an example of how you mentored a junior engineer who was struggling with complex architectural concepts.'
  ]
};

export default function StudioDashboard({
  settings,
  onSaveSettings,
  profile,
  onSaveProfile,
  apiKeys,
  onSaveApiKeys,
  activeSession,
  sessions = [],
  onSwitchSession,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
  onExportSession,
  isStealthActive,
  onToggleStealth,
  onLaunchHUD,
  isListening,
  onToggleListening,
  audioLevel,
  currentTranscript,
  detectedQuestion,
  currentAnswer,
  isGenerating,
  onGenerateAnswer,
  onRefineAnswer,
  onClearTranscript,
  latencyMetrics,
  proctorStatus,
  onCheckProctors
}) {
  const [activeTab, setActiveTab] = useState('sessions');
  const [activeProvider, setActiveProvider] = useState(settings.provider || 'groq');

  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [localKeys, setLocalKeys] = useState({ ...apiKeys });
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    name: '',
    company: '',
    targetRole: '',
    candidateName: '',
    skills: '',
    resumeText: '',
    jobDescription: '',
    answerStyle: 'concise',
    category: 'it'
  });
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState(activeSession?.id || 'active');

  // Automatic GitHub Releases update check
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isUpdateDismissed, setIsUpdateDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (window.wishpilot?.checkUpdate) {
      window.wishpilot.checkUpdate()
        .then((res) => {
          if (isMounted && res && res.hasUpdate) {
            setUpdateInfo(res);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (activeSession) {
      setLocalProfile({
        name: activeSession.candidateName || profile.name,
        targetCompany: activeSession.company || profile.targetCompany,
        targetRole: activeSession.targetRole || profile.targetRole,
        resumeText: activeSession.resumeText || profile.resumeText,
        jobDescription: activeSession.jobDescription || profile.jobDescription,
        skills: activeSession.skills || profile.skills,
        category: activeSession.category || profile.category || 'it'
      });
      if (activeSession.answerStyle) {
        setLocalSettings((prev) => ({ ...prev, answerStyle: activeSession.answerStyle }));
      }
    }
  }, [activeSession]);

  const [historyItems, setHistoryItems] = useState([]);
  const [copiedHistory, setCopiedHistory] = useState(false);

  useEffect(() => {
    if (selectedHistorySessionId === 'all') {
      setHistoryItems(storageService.getHistory());
    } else {
      const targetSession = sessions.find((s) => s.id === selectedHistorySessionId) || activeSession;
      setHistoryItems(targetSession?.history || storageService.getHistory());
    }
  }, [activeTab, selectedHistorySessionId, sessions, activeSession]);

  const [mockCategory, setMockCategory] = useState(profile?.category || 'it');
  const [mockTopic, setMockTopic] = useState('backend');
  const [mockSelectedQuestion, setMockSelectedQuestion] = useState(
    getCategoryById(profile?.category || 'it').mockQuestions?.backend?.[0] ||
    Object.values(getCategoryById(profile?.category || 'it').mockQuestions)[0]?.[0] || ''
  );
  const [mockCustomQuestion, setMockCustomQuestion] = useState('');
  const [mockStreamingAnswer, setMockStreamingAnswer] = useState('');
  const [mockIsAnswering, setMockIsAnswering] = useState(false);
  const [mockMetrics, setMockMetrics] = useState(null);

  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  const [resumeInputMode, setResumeInputMode] = useState('text');
  const [isPdfParsing, setIsPdfParsing] = useState(false);
  const pdfInputRef = useRef(null);
  const providerTabsRef = useRef(null);

  const scrollProviderTabs = (direction) => {
    if (providerTabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      providerTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [testPrompt, setTestPrompt] = useState('Tell me about a time you resolved a critical production incident.');
  const [liveAnswer, setLiveAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [firstTokenLatency, setFirstTokenLatency] = useState(null);

  const opacity = Math.max(0.12, localSettings.hudOpacity || 0.90);

  const showToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleSave = () => {
    onSaveApiKeys(localKeys);
    onSaveSettings({ ...localSettings, provider: activeProvider });
    onSaveProfile(localProfile);
    showToast('Settings saved');
  };

  const handleExportMarkdown = () => {
    if (selectedHistorySessionId !== 'all') {
      const targetSession = sessions.find((s) => s.id === selectedHistorySessionId) || activeSession;
      if (targetSession) {
        storageService.exportSessionMarkdown(targetSession);
        showToast(`Exported ${targetSession.name} transcript (.md)`);
        return;
      }
    }

    const items = storageService.getHistory();
    if (items.length === 0) {
      showToast('No interview history to export yet');
      return;
    }
    let md = `# WishPilot Interview Session Transcript\n\n`;
    md += `**Date**: ${new Date().toLocaleString()}\n`;
    md += `**Candidate**: ${profile?.name || 'Candidate'} | **Target Role**: ${profile?.role || 'Software Engineer'}\n\n`;
    md += `---\n\n`;

    items.forEach((item, idx) => {
      md += `## Question ${items.length - idx} (${item.timestamp || 'N/A'})\n\n`;
      md += `> **Question**: ${item.question}\n\n`;
      md += `### Live Answer / Solution\n\n${item.answer}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_transcript_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported session transcript (.md)');
  };

  const handleExportJSON = () => {
    if (selectedHistorySessionId !== 'all') {
      const targetSession = sessions.find((s) => s.id === selectedHistorySessionId) || activeSession;
      if (targetSession) {
        storageService.exportSessionJSON(targetSession);
        showToast(`Exported ${targetSession.name} session (.json)`);
        return;
      }
    }

    const items = storageService.getHistory();
    if (items.length === 0) {
      showToast('No interview history to export yet');
      return;
    }
    const data = {
      exportedAt: new Date().toISOString(),
      profile: {
        name: profile?.name,
        role: profile?.role,
        targetCompany: profile?.targetCompany
      },
      history: items
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_session_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported session transcript (.json)');
  };

  const handleCopyAllQA = () => {
    const items = storageService.getHistory();
    if (items.length === 0) {
      showToast('No interview history to copy');
      return;
    }
    const text = items
      .map((it, idx) => `Q${items.length - idx} [${it.timestamp}]: ${it.question}\n\nANSWER:\n${it.answer}`)
      .join('\n\n' + '='.repeat(50) + '\n\n');
    navigator.clipboard.writeText(text);
    setCopiedHistory(true);
    setTimeout(() => setCopiedHistory(false), 2000);
    showToast('Copied all session Q&As to clipboard');
  };

  const handleClearHistory = () => {
    if (selectedHistorySessionId === 'all') {
      storageService.clearHistory();
    } else {
      const targetId = selectedHistorySessionId || activeSession?.id;
      if (targetId) storageService.clearSessionHistory(targetId);
    }
    setHistoryItems([]);
    showToast('Interview history cleared');
  };

  const handleOpenNewSession = () => {
    const defaultCat = localProfile.category || 'it';
    const catData = getCategoryById(defaultCat);
    setEditingSessionId(null);
    setSessionFormData({
      name: '',
      company: '',
      targetRole: localProfile.targetRole || catData.commonRoles[0],
      candidateName: localProfile.name || 'Candidate',
      skills: localProfile.skills || catData.defaultSkills,
      resumeText: localProfile.resumeText || '',
      jobDescription: '',
      answerStyle: catData.recommendedAnswerStyle || localSettings.answerStyle || 'concise',
      category: defaultCat
    });
    setIsEditingSession(true);
  };

  const handleOpenEditSession = (s) => {
    const sCat = s.category || 'it';
    const catData = getCategoryById(sCat);
    setEditingSessionId(s.id);
    setSessionFormData({
      name: s.name || '',
      company: s.company || '',
      targetRole: s.targetRole || catData.commonRoles[0],
      candidateName: s.candidateName || localProfile.name || 'Candidate',
      skills: s.skills || '',
      resumeText: s.resumeText || '',
      jobDescription: s.jobDescription || '',
      answerStyle: s.answerStyle || catData.recommendedAnswerStyle || 'concise',
      category: sCat
    });
    setIsEditingSession(true);
  };

  const handleSaveSessionForm = (e) => {
    if (e) e.preventDefault();
    if (!sessionFormData.name.trim()) {
      showToast('Please enter a session name');
      return;
    }
    if (editingSessionId) {
      if (onUpdateSession) {
        onUpdateSession(editingSessionId, sessionFormData);
      }
      showToast('Session updated');
    } else {
      if (onCreateSession) {
        onCreateSession(sessionFormData);
      }
      showToast('New session created & activated');
    }
    setIsEditingSession(false);
    setEditingSessionId(null);
  };

  const handleStartMockInterview = async () => {
    const q = (mockTopic === 'custom' ? mockCustomQuestion : mockSelectedQuestion).trim();
    if (!q) {
      showToast('Please select or enter an interview question');
      return;
    }
    setMockStreamingAnswer('');
    setMockIsAnswering(true);
    setMockMetrics(null);

    await aiService.generateAnswer({
      question: q,
      profile: { ...localProfile, category: mockCategory || localProfile.category || 'it' },
      settings: { ...localSettings, provider: activeProvider },
      apiKeys: localKeys,
      onChunk: (chunk) => {
        setMockStreamingAnswer(chunk);
      },
      onComplete: (finalAnswer, meta) => {
        setMockStreamingAnswer(finalAnswer);
        setMockIsAnswering(false);
        setMockMetrics(meta);
        storageService.saveHistoryItem({
          id: Date.now(),
          question: q,
          answer: finalAnswer,
          timestamp: new Date().toLocaleTimeString()
        });
        setHistoryItems(storageService.getHistory());
      },
      onError: (err) => {
        setMockIsAnswering(false);
        showToast('Mock generation error: ' + err.message);
      }
    });
  };

  const handleRefineMockAnswer = async (refinementType) => {
    if (!mockStreamingAnswer || mockIsAnswering) return;
    const q = (mockTopic === 'custom' ? mockCustomQuestion : mockSelectedQuestion).trim() || 'Interview Question';
    setMockIsAnswering(true);
    await aiService.refineAnswer({
      question: q,
      previousAnswer: mockStreamingAnswer,
      refinementType,
      profile: { ...localProfile, category: mockCategory || localProfile.category || 'it' },
      settings: { ...localSettings, provider: activeProvider },
      apiKeys: localKeys,
      onChunk: (chunk) => {
        setMockStreamingAnswer(chunk);
      },
      onComplete: (finalAnswer, meta) => {
        setMockStreamingAnswer(finalAnswer);
        setMockIsAnswering(false);
        setMockMetrics(meta);
        storageService.saveHistoryItem({
          id: Date.now(),
          question: `[Refined: ${refinementType.toUpperCase()}] ${q}`,
          answer: finalAnswer,
          timestamp: new Date().toLocaleTimeString()
        });
        setHistoryItems(storageService.getHistory());
      },
      onError: (err) => {
        setMockIsAnswering(false);
        showToast('Refinement error: ' + (err?.message || 'Failed to refine'));
      }
    });
  };

  const handleTestLatency = async () => {
    setIsPinging(true);
    setPingResult(null);
    const start = performance.now();
    try {
      await aiService.generateAnswer({
        question: 'Ping test',
        profile: localProfile,
        settings: { ...localSettings, provider: activeProvider },
        apiKeys: localKeys,
        onComplete: () => {
          const ms = Math.round(performance.now() - start);
          setIsPinging(false);
          setPingResult({ success: true, msg: `Connected - ${ms}ms latency` });
        },
        onError: (err) => {
          setIsPinging(false);
          setPingResult({ success: false, msg: err.message });
        }
      });
    } catch (e) {
      setIsPinging(false);
      setPingResult({ success: false, msg: e.message });
    }
  };

  const handleRunCopilotTest = async (promptText) => {
    const q = promptText || testPrompt;
    setTestPrompt(q);
    setIsAnswering(true);
    setLiveAnswer('');
    setFirstTokenLatency(null);
    const start = performance.now();
    let recorded = null;
    await aiService.generateAnswer({
      question: q,
      profile: localProfile,
      settings: { ...localSettings, provider: activeProvider },
      apiKeys: localKeys,
      onChunk: (chunk) => {
        if (!recorded) {
          recorded = Math.round(performance.now() - start);
          setFirstTokenLatency(recorded);
        }
        setLiveAnswer(chunk);
      },
      onComplete: (final) => {
        setLiveAnswer(final);
        setIsAnswering(false);
        if (!recorded) setFirstTokenLatency(Math.round(performance.now() - start));
      },
      onError: () => setIsAnswering(false)
    });
  };

  const handleRefineCopilotTest = async (refinementType) => {
    const answerToRefine = liveAnswer || currentAnswer;
    if (!answerToRefine || isAnswering || isGenerating) return;

    if (liveAnswer) {
      setIsAnswering(true);
      const q = testPrompt || currentTranscript || detectedQuestion || 'Interview Question';
      await aiService.refineAnswer({
        question: q,
        previousAnswer: liveAnswer,
        refinementType,
        profile: localProfile,
        settings: { ...localSettings, provider: activeProvider },
        apiKeys: localKeys,
        onChunk: (chunk) => {
          setLiveAnswer(chunk);
        },
        onComplete: (final) => {
          setLiveAnswer(final);
          setIsAnswering(false);
        },
        onError: () => setIsAnswering(false)
      });
    } else if (onRefineAnswer) {
      onRefineAnswer(refinementType);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPdfParsing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + '\n';
      }
      setLocalProfile({ ...localProfile, resumeText: text.trim() });
      setResumeInputMode('text');
      showToast('PDF parsed successfully');
    } catch (err) {
      showToast('PDF parsing failed - try pasting text manually');
    } finally {
      setIsPdfParsing(false);
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ padding: '8px', background: 'transparent' }}
    >
      <div
        className="w-full h-full flex overflow-hidden"
        style={{
          background: `rgba(10, 10, 10, ${opacity})`,
          border: '1px solid #282828',
          borderRadius: '12px'
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: '204px',
            minWidth: '204px',
            maxWidth: '204px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRight: '1px solid #282828',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 14px'
          }}
        >
          {/* Brand */}
          <div>
            <div
              className="app-drag"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '16px',
                marginBottom: '16px',
                borderBottom: '1px solid #1e1e1e',
                cursor: 'move'
              }}
            >
              <img
                src={logoSrc}
                alt="WishPilot"
                style={{ width: '34px', height: '34px', objectFit: 'contain', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                  WishPilot
                </div>
                <div style={{ fontSize: '10px', color: '#555555', marginTop: '2px' }}>
                  Interview Copilot
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="wp-nav-item no-drag"
                    style={active ? {
                      background: '#1a1a1a',
                      color: '#ffffff',
                      borderColor: '#282828'
                    } : {}}
                  >
                    <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px' }}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Stealth toggle + footer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={onToggleStealth}
              className="no-drag"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: isStealthActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: isStealthActive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield style={{ width: '14px', height: '14px', flexShrink: 0, color: isStealthActive ? '#22c55e' : '#ef4444' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: isStealthActive ? '#4ade80' : '#f87171' }}>
                  {isStealthActive ? 'Protected' : 'Unprotected'}
                </span>
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: '700', color: isStealthActive ? '#22c55e' : '#ef4444' }}>
                {isStealthActive ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="wp-shortcut">Ctrl+Shift+H</span>

            {/* Footer */}
            <div style={{
              paddingTop: '8px',
              borderTop: '1px solid #1e1e1e',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '10px', color: '#444444', lineHeight: 1.5, display: 'block' }}>
                Made With 🩶 By
              </span>
              <span style={{ fontSize: '10px', color: '#555555', lineHeight: 1.5, display: 'block' }}>
                Vishwjeet Singh Vilkhu
              </span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Update Available Banner */}
          {updateInfo?.hasUpdate && !isUpdateDismissed && (
            <div
              className="no-drag"
              style={{
                background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(30, 64, 175, 0.05) 100%)',
                borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Update
                </span>
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>
                  WishPilot <strong style={{ color: '#60a5fa' }}>v{updateInfo.latestVersion}</strong> is available (Installed: v{updateInfo.currentVersion})
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    if (window.wishpilot?.openExternal) {
                      window.wishpilot.openExternal(updateInfo.releaseUrl);
                    } else {
                      window.open(updateInfo.releaseUrl, '_blank');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Release Notes</span>
                  <ExternalLink style={{ width: '11px', height: '11px' }} />
                </button>
                <button
                  onClick={() => setIsUpdateDismissed(true)}
                  title="Dismiss update"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X style={{ width: '13px', height: '13px' }} />
                </button>
              </div>
            </div>
          )}
          {/* Header */}
          <header
            className="app-drag"
            style={{
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              borderBottom: '1px solid #282828',
              flexShrink: 0,
              gap: '8px',
              minWidth: 0
            }}
          >
            {/* Left: session pill */}
            <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              {activeSession && (
                <button
                  onClick={() => setActiveTab('sessions')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: '1px solid #282828',
                    background: '#111111',
                    color: '#a0a0a0',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '220px',
                    flexShrink: 1
                  }}
                  title={`Active session: ${activeSession.name}`}
                >
                  <Layers style={{ width: '10px', height: '10px', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeSession.name}
                  </span>
                </button>
              )}
            </div>

            {/* Right: controls */}
            <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {/* Opacity pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#111111', border: '1px solid #282828', borderRadius: '20px', padding: '3px 10px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#666666', minWidth: '22px' }}>
                  {Math.round((localSettings.hudOpacity || 0.90) * 100)}%
                </span>
                <input
                  type="range"
                  min="0.15"
                  max="1.0"
                  step="0.05"
                  value={localSettings.hudOpacity || 0.90}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLocalSettings({ ...localSettings, hudOpacity: val });
                    onSaveSettings({ ...localSettings, hudOpacity: val });
                  }}
                  style={{ width: '52px', height: '2px', cursor: 'pointer' }}
                  title="Adjust window opacity"
                />
              </div>

              {/* Launch Overlay */}
              <button
                onClick={onLaunchHUD}
                className="wp-btn wp-btn-primary"
                style={{ fontSize: '11px', padding: '5px 12px', whiteSpace: 'nowrap' }}
              >
                <Monitor style={{ width: '12px', height: '12px' }} />
                Launch Overlay
              </button>

              {/* Window controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingLeft: '8px', borderLeft: '1px solid #1e1e1e' }}>
                <button
                  onClick={() => window.wishpilot?.minimize()}
                  className="wp-btn-ghost"
                  style={{ width: '24px', height: '24px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Minimize"
                >
                  <Minus style={{ width: '12px', height: '12px' }} />
                </button>
                <button
                  onClick={() => window.wishpilot?.close()}
                  className="wp-btn-ghost"
                  style={{ width: '24px', height: '24px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Close"
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

            {/* Toast */}
            {saveToast && (
              <div style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 50,
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '8px',
                background: '#111111', border: '1px solid #282828',
                color: '#ffffff', fontSize: '12px'
              }}>
                <Check style={{ width: '14px', height: '14px' }} />
                {saveToast}
              </div>
            )}

            {/* ==================== TAB: SESSIONS & ROLES ==================== */}
            {activeTab === 'sessions' && (
              <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Layers style={{ width: '16px', height: '16px', color: '#a0a0a0' }} />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                        Interview Sessions & Target Roles
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#888888', margin: 0, lineHeight: '1.5' }}>
                      Manage independent interview profiles with tailored resumes, company JDs, and archived conversations.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenNewSession}
                    className="wp-btn wp-btn-primary"
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '16px' }}
                  >
                    <Plus style={{ width: '13px', height: '13px' }} />
                    New Session
                  </button>
                </div>

                {/* Session Creation / Edit Form */}
                {isEditingSession && (
                  <form onSubmit={handleSaveSessionForm} className="wp-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid #444444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                        {editingSessionId ? `Edit Session: ${sessionFormData.name}` : 'Create New Interview Session'}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setIsEditingSession(false); setEditingSessionId(null); }}
                        className="wp-btn-ghost"
                        style={{ padding: '4px' }}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>

                    {/* Industry Stream / Category Selector */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label className="wp-label" style={{ margin: 0 }}>Industry Stream & Category *</label>
                        <span style={{ fontSize: '10px', color: '#a0a0a0', fontFamily: 'monospace' }}>
                          Framework: {getCategoryById(sessionFormData.category || 'it').frameworkName}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {INTERVIEW_CATEGORIES.map((cat) => {
                          const isSelected = (sessionFormData.category || 'it') === cat.id;
                          const CatIcon = cat.icon;
                          return (
                            <button
                              type="button"
                              key={cat.id}
                              onClick={() => {
                                setSessionFormData({
                                  ...sessionFormData,
                                  category: cat.id,
                                  answerStyle: cat.recommendedAnswerStyle || sessionFormData.answerStyle,
                                  targetRole: cat.commonRoles[0],
                                  skills: cat.defaultSkills
                                });
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: isSelected ? '1px solid #ffffff' : '1px solid #282828',
                                background: isSelected ? '#1c1c1c' : '#111111',
                                color: isSelected ? '#ffffff' : '#888888',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <CatIcon size={14} style={{ color: isSelected ? '#ffffff' : '#666666' }} />
                              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '11px', fontWeight: isSelected ? '700' : '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {cat.shortLabel}
                                </div>
                                <div style={{ fontSize: '9px', color: isSelected ? '#a0a0a0' : '#555555', fontFamily: 'monospace' }}>
                                  {cat.badgeText}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick-pick roles pills */}
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', color: '#666666', marginRight: '4px' }}>Quick roles:</span>
                        {getCategoryById(sessionFormData.category || 'it').commonRoles.slice(0, 5).map((roleName) => (
                          <button
                            type="button"
                            key={roleName}
                            onClick={() => setSessionFormData({ ...sessionFormData, targetRole: roleName })}
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: sessionFormData.targetRole === roleName ? '1px solid #ffffff' : '1px solid #282828',
                              background: sessionFormData.targetRole === roleName ? '#222222' : '#0d0d0d',
                              color: sessionFormData.targetRole === roleName ? '#ffffff' : '#888888',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {roleName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="wp-label">Session Name *</label>
                        <input
                          type="text"
                          required
                          value={sessionFormData.name}
                          onChange={(e) => setSessionFormData({ ...sessionFormData, name: e.target.value })}
                          placeholder="e.g. Google - Senior Backend L5"
                          className="wp-input"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label className="wp-label">Target Company</label>
                        <input
                          type="text"
                          value={sessionFormData.company}
                          onChange={(e) => setSessionFormData({ ...sessionFormData, company: e.target.value })}
                          placeholder="e.g. Google, Meta, Uber"
                          className="wp-input"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="wp-label">Target Role</label>
                        <input
                          type="text"
                          value={sessionFormData.targetRole}
                          onChange={(e) => setSessionFormData({ ...sessionFormData, targetRole: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="wp-input"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label className="wp-label">Candidate Name</label>
                        <input
                          type="text"
                          value={sessionFormData.candidateName}
                          onChange={(e) => setSessionFormData({ ...sessionFormData, candidateName: e.target.value })}
                          placeholder="e.g. Candidate"
                          className="wp-input"
                          style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    {/* Answer Style selector */}
                    <div>
                      <label className="wp-label">Interview Answer Style</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {[
                          { id: 'concise', label: 'Concise (30-45s)', desc: 'Direct spoken punchlines' },
                          { id: 'star', label: 'STAR Framework', desc: 'Situation, Task, Action, Result' },
                          { id: 'technical', label: 'Deep Technical', desc: 'Architecture & tradeoffs' }
                        ].map((st) => (
                          <button
                            type="button"
                            key={st.id}
                            onClick={() => setSessionFormData({ ...sessionFormData, answerStyle: st.id })}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: sessionFormData.answerStyle === st.id ? '1px solid #ffffff' : '1px solid #282828',
                              background: sessionFormData.answerStyle === st.id ? '#1a1a1a' : '#111111',
                              color: sessionFormData.answerStyle === st.id ? '#ffffff' : '#a0a0a0',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}
                          >
                            <span style={{ fontSize: '11px', fontWeight: '600' }}>{st.label}</span>
                            <span style={{ fontSize: '9px', color: '#666666' }}>{st.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="wp-label">Core Technical Focus & Skills</label>
                      <input
                        type="text"
                        value={sessionFormData.skills}
                        onChange={(e) => setSessionFormData({ ...sessionFormData, skills: e.target.value })}
                        placeholder="e.g. Go, Kubernetes, Kafka, Distributed Systems, Low-Latency"
                        className="wp-input"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label className="wp-label">Job Description (JD)</label>
                      <textarea
                        rows={3}
                        value={sessionFormData.jobDescription}
                        onChange={(e) => setSessionFormData({ ...sessionFormData, jobDescription: e.target.value })}
                        placeholder="Paste the target job description or requirements..."
                        className="wp-input"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <label className="wp-label" style={{ margin: 0 }}>Tailored Resume / Background Context</label>
                        <button
                          type="button"
                          onClick={() => setSessionFormData({ ...sessionFormData, resumeText: localProfile.resumeText || '' })}
                          className="wp-btn-ghost"
                          style={{ fontSize: '10px', color: '#a0a0a0' }}
                        >
                          Copy From Default Profile
                        </button>
                      </div>
                      <textarea
                        rows={5}
                        value={sessionFormData.resumeText}
                        onChange={(e) => setSessionFormData({ ...sessionFormData, resumeText: e.target.value })}
                        placeholder="Paste candidate resume, projects, or background tailored for this role..."
                        className="wp-input"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #1e1e1e', paddingTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => { setIsEditingSession(false); setEditingSessionId(null); }}
                        className="wp-btn wp-btn-secondary"
                        style={{ fontSize: '11px' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="wp-btn wp-btn-primary"
                        style={{ fontSize: '11px' }}
                      >
                        {editingSessionId ? 'Update Session' : 'Create & Activate Session'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Sessions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sessions.length === 0 && !isEditingSession && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '48px 24px',
                      border: '1px dashed #282828',
                      borderRadius: '8px',
                      gap: '12px',
                      textAlign: 'center'
                    }}>
                      <Layers style={{ width: '28px', height: '28px', color: '#333333' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>No sessions yet</div>
                        <div style={{ fontSize: '12px', color: '#555555', maxWidth: '280px', lineHeight: 1.6 }}>
                          Create your first interview session to get started. Each session stores a target company, role, resume, and Q&A history.
                        </div>
                      </div>
                      <button
                        onClick={() => { setIsEditingSession(true); setEditingSessionId(null); }}
                        className="wp-btn wp-btn-primary"
                        style={{ fontSize: '11px', marginTop: '4px' }}
                      >
                        <Plus style={{ width: '12px', height: '12px' }} />
                        Create First Session
                      </button>
                    </div>
                  )}
                  {sessions.map((s) => {
                    const isActive = s.id === activeSession?.id;
                    const historyCount = s.history?.length || 0;
                    return (
                      <div
                        key={s.id}
                        className="wp-card"
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          border: isActive ? '1px solid #555555' : '1px solid #282828',
                          background: isActive ? '#141414' : '#111111'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                              {s.name}
                            </span>
                            {(() => {
                              const cat = getCategoryById(s.category || 'it');
                              const CatIcon = cat.icon;
                              return (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '9px',
                                    fontWeight: '700',
                                    fontFamily: 'monospace',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    background: '#1c1c1c',
                                    color: '#d4d4d8',
                                    border: '1px solid #333333'
                                  }}
                                  title={`${cat.label} • Framework: ${cat.frameworkName}`}
                                >
                                  <CatIcon size={10} />
                                  <span>{cat.badgeText}</span>
                                </span>
                              );
                            })()}
                            {isActive ? (
                              <span style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                fontFamily: 'monospace',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: '#1e1e1e',
                                color: '#ffffff',
                                border: '1px solid #383838'
                              }}>
                                ACTIVE SESSION
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (onSwitchSession) onSwitchSession(s.id);
                                  showToast(`Switched to: ${s.name}`);
                                }}
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: '#111111',
                                  color: '#a0a0a0',
                                  border: '1px solid #282828',
                                  cursor: 'pointer'
                                }}
                              >
                                Switch to this
                              </button>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleOpenEditSession(s)}
                              className="wp-btn wp-btn-secondary"
                              style={{ fontSize: '10px', padding: '4px 8px' }}
                              title="Edit session parameters"
                            >
                              <Edit2 style={{ width: '11px', height: '11px' }} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (onExportSession) onExportSession(s.id, 'markdown');
                                showToast(`Exported ${s.name} transcript (.md)`);
                              }}
                              className="wp-btn wp-btn-secondary"
                              style={{ fontSize: '10px', padding: '4px 8px' }}
                              title="Export interview transcript as Markdown"
                            >
                              <Download style={{ width: '11px', height: '11px' }} />
                              .md
                            </button>
                            <button
                              onClick={() => {
                                if (onExportSession) onExportSession(s.id, 'json');
                                showToast(`Exported ${s.name} session (.json)`);
                              }}
                              className="wp-btn wp-btn-secondary"
                              style={{ fontSize: '10px', padding: '4px 8px' }}
                              title="Export interview session as JSON"
                            >
                              <Download style={{ width: '11px', height: '11px' }} />
                              .json
                            </button>
                            {sessions.length > 1 && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete interview session "${s.name}"?`)) {
                                    if (onDeleteSession) onDeleteSession(s.id);
                                    showToast('Session deleted');
                                  }
                                }}
                                className="wp-btn-ghost"
                                style={{ padding: '4px 6px', color: '#ef4444' }}
                                title="Delete session"
                              >
                                <Trash2 style={{ width: '12px', height: '12px' }} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#a0a0a0', flexWrap: 'wrap' }}>
                          <span>Company: <strong style={{ color: '#ffffff' }}>{s.company || 'Tech Company'}</strong></span>
                          <span>•</span>
                          <span>Role: <strong style={{ color: '#ffffff' }}>{s.targetRole || 'Software Engineer'}</strong></span>
                          <span>•</span>
                          <span>Style: <span style={{ textTransform: 'capitalize' }}>{s.answerStyle || 'concise'}</span></span>
                          <span>•</span>
                          <span style={{ fontFamily: 'monospace' }}>{historyCount} recorded Q&As</span>
                        </div>

                        {s.jobDescription && (
                          <div style={{ fontSize: '11px', color: '#71717a', background: '#0a0a0a', padding: '6px 10px', borderRadius: '4px', border: '1px solid #1e1e1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            JD: {s.jobDescription.slice(0, 120)}...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ==================== TAB: MODELS ==================== */}
            {activeTab === 'models' && (
              <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Provider tabs with left & right scroll buttons */}
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #282828', paddingBottom: '4px', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => scrollProviderTabs('left')}
                    className="no-drag"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '28px',
                      background: '#141414',
                      border: '1px solid #2e2e2e',
                      borderRadius: '5px',
                      color: '#b0b0b0',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                    title="Scroll left"
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#555555'; e.currentTarget.style.background = '#222222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#b0b0b0'; e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.background = '#141414'; }}
                  >
                    <ChevronLeft style={{ width: '14px', height: '14px' }} />
                  </button>

                  <div
                    ref={providerTabsRef}
                    className="hide-scrollbar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      overflowX: 'auto',
                      gap: '4px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      scrollBehavior: 'smooth',
                      flex: 1
                    }}
                  >
                    {PROVIDERS.map((p) => {
                      const isActive = activeProvider === p.id;
                      return (
                        <button
                          key={p.id}
                          className={`wp-tab ${isActive ? 'active' : ''}`}
                          onClick={(e) => {
                            setActiveProvider(p.id);
                            setLocalSettings({ ...localSettings, provider: p.id });
                            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            fontSize: '11px',
                            padding: '6px 11px',
                            flexShrink: 0
                          }}
                        >
                          <ProviderIcon provider={p.id} size={13} style={{ opacity: isActive ? 1 : 0.6 }} />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollProviderTabs('right')}
                    className="no-drag"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '28px',
                      background: '#141414',
                      border: '1px solid #2e2e2e',
                      borderRadius: '5px',
                      color: '#b0b0b0',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                    title="Scroll right"
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#555555'; e.currentTarget.style.background = '#222222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#b0b0b0'; e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.background = '#141414'; }}
                  >
                    <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>

                {/* GROQ Card */}
                {activeProvider === 'groq' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="groq" size={15} />
                        Groq Cloud
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://console.groq.com/keys')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">Groq API Key</label>
                      <input
                        type="password"
                        value={localKeys.groq || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, groq: e.target.value })}
                        placeholder="gsk_..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.groqModel || 'openai/gpt-oss-120b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, groqModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {GROQ_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.groqModel || 'openai/gpt-oss-120b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, groqModel: e.target.value })}
                          placeholder="model-id"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.groqModel || 'openai/gpt-oss-120b'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#555555' }}>Sub-second streaming</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cerebras Card */}
                {activeProvider === 'cerebras' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="cerebras" size={15} />
                        Cerebras Inference
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://cloud.cerebras.ai/platform/')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">Cerebras API Key</label>
                      <input
                        type="password"
                        value={localKeys.cerebras || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, cerebras: e.target.value })}
                        placeholder="csk-..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.cerebrasModel || 'llama-3.3-70b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, cerebrasModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {CEREBRAS_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.cerebrasModel || 'llama-3.3-70b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, cerebrasModel: e.target.value })}
                          placeholder="e.g. llama-3.3-70b"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.cerebrasModel || 'llama-3.3-70b'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#22c55e' }}>~1,800 tokens/sec wafer-scale</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Together AI Card */}
                {activeProvider === 'together' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="together" size={15} />
                        Together AI
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://api.together.ai/settings/api-keys')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">Together API Key</label>
                      <input
                        type="password"
                        value={localKeys.together || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, together: e.target.value })}
                        placeholder="together-api-key..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.togetherModel || 'meta-llama/Llama-3.3-70B-Instruct-Turbo'}
                          onChange={(e) => setLocalSettings({ ...localSettings, togetherModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {TOGETHER_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.togetherModel || 'meta-llama/Llama-3.3-70B-Instruct-Turbo'}
                          onChange={(e) => setLocalSettings({ ...localSettings, togetherModel: e.target.value })}
                          placeholder="e.g. meta-llama/Llama-3.3-70B-Instruct-Turbo"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.togetherModel || 'meta-llama/Llama-3.3-70B-Instruct-Turbo'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#555555' }}>Open-Source Cloud</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fireworks AI Card */}
                {activeProvider === 'fireworks' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="fireworks" size={15} />
                        Fireworks AI
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://fireworks.ai/account/api-keys')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">Fireworks API Key</label>
                      <input
                        type="password"
                        value={localKeys.fireworks || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, fireworks: e.target.value })}
                        placeholder="fw_..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.fireworksModel || 'accounts/fireworks/models/llama-v3p3-70b-instruct'}
                          onChange={(e) => setLocalSettings({ ...localSettings, fireworksModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {FIREWORKS_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.fireworksModel || 'accounts/fireworks/models/llama-v3p3-70b-instruct'}
                          onChange={(e) => setLocalSettings({ ...localSettings, fireworksModel: e.target.value })}
                          placeholder="e.g. accounts/fireworks/models/llama-v3p3-70b-instruct"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.fireworksModel || 'accounts/fireworks/models/llama-v3p3-70b-instruct'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#555555' }}>Optimized Inference</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* NVIDIA NIM Card */}
                {activeProvider === 'nvidia' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="nvidia" size={15} />
                        NVIDIA NIM (Build NVIDIA)
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://build.nvidia.com/')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">NVIDIA API Key</label>
                      <input
                        type="password"
                        value={localKeys.nvidia || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, nvidia: e.target.value })}
                        placeholder="nvapi-..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.nvidiaModel || 'nvidia/nemotron-3-ultra-550b-a55b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, nvidiaModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {NVIDIA_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.nvidiaModel || 'nvidia/nemotron-3-ultra-550b-a55b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, nvidiaModel: e.target.value })}
                          placeholder="e.g. nvidia/nemotron-3-ultra-550b-a55b"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.nvidiaModel || 'nvidia/nemotron-3-ultra-550b-a55b'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#76b900' }}>Nemotron 550B MoE</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hugging Face Card */}
                {activeProvider === 'huggingface' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="huggingface" size={15} />
                        Hugging Face Serverless
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://huggingface.co/settings/tokens')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>

                    <div>
                      <label className="wp-label">Hugging Face Access Token</label>
                      <input
                        type="password"
                        value={localKeys.huggingface || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, huggingface: e.target.value })}
                        placeholder="hf_..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="wp-label" style={{ marginBottom: 0 }}>Model</label>
                        <button
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          style={{ fontSize: '11px', color: '#555555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomModel ? 'Pick from list' : 'Custom model ID'}
                        </button>
                      </div>
                      {!isCustomModel ? (
                        <select
                          value={localSettings.huggingfaceModel || 'meta-llama/Llama-3.3-70B-Instruct'}
                          onChange={(e) => setLocalSettings({ ...localSettings, huggingfaceModel: e.target.value })}
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                        >
                          {HUGGINGFACE_MODELS.map((m) => (
                            <option key={m.id} value={m.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={localSettings.huggingfaceModel || 'meta-llama/Llama-3.3-70B-Instruct'}
                          onChange={(e) => setLocalSettings({ ...localSettings, huggingfaceModel: e.target.value })}
                          placeholder="e.g. meta-llama/Llama-3.3-70B-Instruct"
                          className="wp-input"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#555555' }}>
                          Active: <span style={{ color: '#a0a0a0', fontFamily: 'monospace' }}>{localSettings.huggingfaceModel || 'meta-llama/Llama-3.3-70B-Instruct'}</span>
                        </span>
                        <span style={{ fontSize: '11px', color: '#555555' }}>HF Router API</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* OpenRouter Card */}
                {activeProvider === 'openrouter' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="openrouter" size={15} />
                        OpenRouter
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://openrouter.ai/keys')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>
                    <div>
                      <label className="wp-label">OpenRouter API Key</label>
                      <input
                        type="password"
                        value={localKeys.openrouter || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, openrouter: e.target.value })}
                        placeholder="sk-or-v1-..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label className="wp-label">Model</label>
                      <select
                        value={localSettings.openrouterModel}
                        onChange={(e) => setLocalSettings({ ...localSettings, openrouterModel: e.target.value })}
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
                      >
                        <option value="anthropic/claude-3.5-sonnet" style={{ background: '#0a0a0a' }}>anthropic/claude-3.5-sonnet (Recommended)</option>
                        <option value="deepseek/deepseek-r1" style={{ background: '#0a0a0a' }}>deepseek/deepseek-r1 (Reasoning)</option>
                        <option value="openai/gpt-4o" style={{ background: '#0a0a0a' }}>openai/gpt-4o</option>
                        <option value="meta-llama/llama-3.3-70b-instruct" style={{ background: '#0a0a0a' }}>meta-llama/llama-3.3-70b-instruct</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Gemini Card */}
                {activeProvider === 'gemini' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="gemini" size={15} />
                        Google Gemini
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://aistudio.google.com/app/apikey')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>
                    <div>
                      <label className="wp-label">Gemini API Key</label>
                      <input
                        type="password"
                        value={localKeys.gemini || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, gemini: e.target.value })}
                        placeholder="AIzaSy..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                )}

                {/* OpenAI Card */}
                {activeProvider === 'openai' && (
                  <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <ProviderIcon provider="openai" size={15} />
                        OpenAI Direct
                      </span>
                      <button onClick={() => window.wishpilot?.openExternal('https://platform.openai.com/api-keys')}
                        style={{ fontSize: '11px', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Get API Key <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </button>
                    </div>
                    <div>
                      <label className="wp-label">OpenAI API Key</label>
                      <input
                        type="password"
                        value={localKeys.openai || ''}
                        onChange={(e) => setLocalKeys({ ...localKeys, openai: e.target.value })}
                        placeholder="sk-proj-..."
                        className="wp-input"
                        style={{ width: '100%', padding: '9px 12px', fontSize: '12px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                )}

                {/* Speech Recognition Card */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mic style={{ width: '14px', height: '14px', color: '#a0a0a0' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        Speech Recognition: Groq Whisper Large v3 Turbo
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#ffffff', fontFamily: 'monospace', fontWeight: 'bold', background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #383838' }}>
                      Active
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#888888', margin: 0, lineHeight: '1.5' }}>
                    Live voice is transcribed using Groq's ultra-fast Whisper Large v3 Turbo model (~200ms latency, high accuracy on technical terms). Pre-seeded with a technical engineering dictionary so terms like Kubernetes, Kafka, gRPC, and Redis transcribe with 100% precision.
                  </p>
                </div>

                {/* Audio Capture Card */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Headphones style={{ width: '14px', height: '14px', color: '#a0a0a0' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        Audio Capture Source & Hook Isolation
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#a0a0a0', fontFamily: 'monospace' }}>
                      {localSettings.audioSource === 'system' ? 'System Loopback' : 'Microphone'}
                    </span>
                  </div>

                  <p style={{ fontSize: '11px', color: '#888888', margin: 0, lineHeight: '1.5' }}>
                    Choose whether WishPilot listens to room microphone input or hooks directly into interviewer audio from meetings (Zoom, Google Meet, Microsoft Teams) to eliminate speaker room echo.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, audioSource: 'mic' })}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: localSettings.audioSource !== 'system' ? '1px solid #ffffff' : '1px solid #282828',
                        background: localSettings.audioSource !== 'system' ? '#1a1a1a' : '#0a0a0a',
                        color: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Mic style={{ width: '13px', height: '13px', color: '#a0a0a0' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Microphone (Room Input)</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#888888', margin: 0 }}>
                        Standard default. Captures microphone audio from your laptop or headset.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, audioSource: 'system' })}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: localSettings.audioSource === 'system' ? '1px solid #ffffff' : '1px solid #282828',
                        background: localSettings.audioSource === 'system' ? '#1a1a1a' : '#0a0a0a',
                        color: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Volume2 style={{ width: '13px', height: '13px', color: '#a0a0a0' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>System Audio Loopback</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#888888', margin: 0 }}>
                        Zero echo. Direct digital audio stream from interviewer headphones & meetings.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid #1e1e1e' }}>
                  <div>
                    <button
                      onClick={handleTestLatency}
                      disabled={isPinging}
                      className="wp-btn wp-btn-secondary"
                    >
                      <RefreshCw style={{ width: '12px', height: '12px', ...(isPinging ? { animation: 'spin 1s linear infinite' } : {}) }} />
                      {isPinging ? 'Testing...' : 'Test Connection'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <button
                      onClick={handleSave}
                      className="wp-btn wp-btn-primary"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>

                {/* Ping Result */}
                {pingResult && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #282828',
                    background: '#111111',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff'
                  }}>
                    {pingResult.success
                      ? <CheckCircle2 style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                      : <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    }
                    <span style={{ fontFamily: 'monospace' }}>{pingResult.msg}</span>
                  </div>
                )}

              </div>
            )}

            {/* ==================== TAB: COPILOT TEST ==================== */}
            {activeTab === 'copilot' && (
              <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Mic control card */}
                <div className="wp-card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button
                          onClick={onToggleListening}
                          className="wp-btn wp-btn-secondary"
                          style={{ gap: '8px' }}
                        >
                          {isListening
                            ? <Mic style={{ width: '13px', height: '13px' }} />
                            : <MicOff style={{ width: '13px', height: '13px' }} />
                          }
                          {isListening ? 'Mic Active' : 'Start Mic'}
                        </button>
                        <span className="wp-shortcut">Ctrl+Shift+M</span>
                      </div>
                      {isListening && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px' }}>
                          <span className="wave-bar" style={{ height: `${Math.max(4, audioLevel * 0.25)}px` }} />
                          <span className="wave-bar" style={{ height: `${Math.max(6, audioLevel * 0.35)}px` }} />
                          <span className="wave-bar" style={{ height: `${Math.max(4, audioLevel * 0.2)}px` }} />
                          <span className="wave-bar" style={{ height: `${Math.max(8, audioLevel * 0.4)}px` }} />
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: '#a0a0a0', fontFamily: 'monospace' }}>
                      Groq Whisper Large v3 Turbo
                    </span>
                  </div>

                  {/* Transcript */}
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    background: '#0a0a0a',
                    border: '1px solid #1e1e1e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <span style={{ color: currentTranscript ? '#ffffff' : '#444444', fontStyle: currentTranscript ? 'normal' : 'italic', flex: 1 }}>
                      {currentTranscript || (isListening ? 'Listening... speak into your mic.' : 'Mic is off. Click Start Mic to begin.')}
                    </span>
                    {currentTranscript && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={onClearTranscript}
                          className="wp-btn wp-btn-secondary"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          title="Clear detected speech & buffer"
                        >
                          Clear
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <button
                            onClick={() => handleRunCopilotTest(currentTranscript)}
                            disabled={isAnswering}
                            className="wp-btn wp-btn-primary"
                            style={{ fontSize: '11px', padding: '4px 10px', flexShrink: 0 }}
                          >
                            Answer This
                          </button>
                          <span className="wp-shortcut">Ctrl+Shift+A</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Latency */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#555555' }}>Test manual question prompts:</span>
                  {firstTokenLatency && (
                    <span className="wp-badge">{firstTokenLatency}ms first token</span>
                  )}
                </div>

                {/* Quick prompts */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Tell me about a time you optimized a slow query.',
                    'How do you handle disagreement with a tech lead?',
                    'Design a rate limiter for 100k RPS.'
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleRunCopilotTest(p)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        border: '1px solid #282828',
                        background: '#111111',
                        fontSize: '11px',
                        color: '#a0a0a0',
                        cursor: 'pointer',
                        transition: 'color 0.15s',
                        fontFamily: 'inherit'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Manual input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Type an interview question..."
                    className="wp-input"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '12px' }}
                    onKeyDown={(e) => e.key === 'Enter' && !isAnswering && handleRunCopilotTest()}
                  />
                  <button
                    onClick={() => handleRunCopilotTest()}
                    disabled={isAnswering || !testPrompt.trim()}
                    className="wp-btn wp-btn-primary"
                    style={{ fontSize: '12px' }}
                  >
                    {isAnswering ? 'Generating...' : 'Test'}
                  </button>
                </div>

                {/* Output */}
                <div
                  className="wp-card"
                  style={{
                    padding: '16px',
                    minHeight: '180px',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '1.7',
                    color: '#e0e0e0'
                  }}
                >
                  {liveAnswer || currentAnswer ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{liveAnswer || currentAnswer}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', color: '#444444', textAlign: 'center', gap: '8px' }}>
                      <Terminal style={{ width: '20px', height: '20px' }} />
                      <p style={{ fontSize: '11px' }}>Select a scenario above or type a question to test AI response</p>
                    </div>
                  )}
                </div>

                {/* Instant Refinement Action Pills */}
                {(liveAnswer || currentAnswer) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                    <RefinementPills
                      onRefine={handleRefineCopilotTest}
                      isGenerating={isAnswering || isGenerating}
                      compact={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB: MOCK INTERVIEW SIMULATOR ==================== */}
            {activeTab === 'mock' && (
              <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Radio style={{ width: '15px', height: '15px', color: '#a0a0a0' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>Offline Mock Interview Practice Lab</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#888888', lineHeight: '1.5', margin: 0 }}>
                    Simulate real interview pressure before your actual call. Pick a topic, simulate an interviewer asking a challenging question, and practice speaking the top 10-second TL;DR punchline immediately while the deep-dive streams below.
                  </p>
                </div>

                {/* Industry Stream Selector for Mock */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }} className="hide-scrollbar">
                  {INTERVIEW_CATEGORIES.map((cat) => {
                    const isSelected = (mockCategory || localProfile.category || 'it') === cat.id;
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setMockCategory(cat.id);
                          const firstTopic = Object.keys(cat.mockQuestions)[0];
                          setMockTopic(firstTopic);
                          setMockSelectedQuestion(cat.mockQuestions[firstTopic]?.[0] || '');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          border: isSelected ? '1px solid #ffffff' : '1px solid #282828',
                          background: isSelected ? '#1c1c1c' : '#0d0d0d',
                          color: isSelected ? '#ffffff' : '#777777',
                          fontSize: '11px',
                          fontWeight: isSelected ? '700' : '400',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <CatIcon size={12} style={{ color: isSelected ? '#ffffff' : '#666666' }} />
                        <span>{cat.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Subtopic selector */}
                {(() => {
                  const activeMockCatData = getCategoryById(mockCategory || localProfile.category || 'it');
                  const activeCatQuestions = activeMockCatData.mockQuestions || {};
                  const topicKeys = Object.keys(activeCatQuestions);
                  return (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {topicKeys.map((tKey) => (
                        <button
                          key={tKey}
                          onClick={() => {
                            setMockTopic(tKey);
                            if (activeCatQuestions[tKey]) {
                              setMockSelectedQuestion(activeCatQuestions[tKey][0]);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: mockTopic === tKey ? '1px solid #ffffff' : '1px solid #282828',
                            background: mockTopic === tKey ? '#1a1a1a' : '#0a0a0a',
                            color: mockTopic === tKey ? '#ffffff' : '#888888',
                            fontSize: '11px',
                            fontWeight: mockTopic === tKey ? '600' : '400',
                            cursor: 'pointer'
                          }}
                        >
                          {MOCK_TOPIC_LABELS[tKey] || tKey}
                        </button>
                      ))}
                      <button
                        onClick={() => setMockTopic('custom')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: mockTopic === 'custom' ? '1px solid #ffffff' : '1px solid #282828',
                          background: mockTopic === 'custom' ? '#1a1a1a' : '#0a0a0a',
                          color: mockTopic === 'custom' ? '#ffffff' : '#888888',
                          fontSize: '11px',
                          fontWeight: mockTopic === 'custom' ? '600' : '400',
                          cursor: 'pointer'
                        }}
                      >
                        Custom Question
                      </button>
                    </div>
                  );
                })()}

                {/* Question selection / input */}
                {(() => {
                  const activeMockCatData = getCategoryById(mockCategory || localProfile.category || 'it');
                  const activeCatQuestions = activeMockCatData.mockQuestions || {};
                  return (
                    <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label className="wp-label" style={{ margin: 0 }}>Interviewer Question</label>
                        <span style={{ fontSize: '10px', color: '#777777', fontFamily: 'monospace' }}>
                          Framework: {activeMockCatData.frameworkName}
                        </span>
                      </div>
                      {mockTopic !== 'custom' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(activeCatQuestions[mockTopic] || []).map((q, idx) => (
                            <div
                              key={idx}
                              onClick={() => setMockSelectedQuestion(q)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: mockSelectedQuestion === q ? '1px solid #ffffff' : '1px solid #282828',
                                background: mockSelectedQuestion === q ? '#1a1a1a' : '#0a0a0a',
                                color: mockSelectedQuestion === q ? '#ffffff' : '#a0a0a0',
                                fontSize: '12px',
                                cursor: 'pointer',
                                lineHeight: '1.5'
                              }}
                            >
                              {q}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          rows={3}
                          value={mockCustomQuestion}
                          onChange={(e) => setMockCustomQuestion(e.target.value)}
                          placeholder="Type any interview question..."
                          className="wp-input"
                          style={{ width: '100%', padding: '10px 12px', fontSize: '12px', fontFamily: 'inherit' }}
                        />
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {mockMetrics && (
                            <span style={{ fontSize: '10px', color: '#a0a0a0', fontFamily: 'monospace' }}>
                              First Token: {mockMetrics.firstTokenMs}ms | Total: {mockMetrics.totalMs}ms
                            </span>
                          )}
                        </div>
                        <button
                          onClick={handleStartMockInterview}
                          disabled={mockIsAnswering}
                          className="wp-btn wp-btn-primary"
                          style={{ padding: '8px 18px', fontSize: '12px' }}
                        >
                          <Play style={{ width: '12px', height: '12px' }} />
                          {mockIsAnswering ? 'Simulating Interview...' : 'Start Mock Interview Question'}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Streaming Mock Output */}
                <div
                  className="wp-card"
                  style={{
                    padding: '16px',
                    minHeight: '220px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.7',
                    background: '#0d0d0d'
                  }}
                >
                  {mockStreamingAnswer ? (
                    <div style={{ whiteSpace: 'pre-wrap', color: '#e5e7eb', fontFamily: 'monospace' }}>
                      {mockStreamingAnswer}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#444444', textAlign: 'center', gap: '8px' }}>
                      <Radio style={{ width: '22px', height: '22px' }} />
                      <p style={{ fontSize: '11px' }}>Click Start Mock Interview Question to simulate the response with 10s TL;DR punchline</p>
                    </div>
                  )}
                </div>

                {/* Instant Refinement Action Pills for Mock */}
                {mockStreamingAnswer && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                    <RefinementPills
                      onRefine={handleRefineMockAnswer}
                      isGenerating={mockIsAnswering}
                      compact={false}
                    />
                  </div>
                )}

              </div>
            )}

            {/* ==================== TAB: DEBRIEF & EXPORT ==================== */}
            {activeTab === 'history' && (
              <div style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Download style={{ width: '15px', height: '15px', color: '#a0a0a0' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        Post-Interview Debrief & Export
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#888888', margin: 0 }}>
                      {historyItems.length} question(s) recorded in this session. Export for review or archive.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                    <button
                      onClick={handleExportMarkdown}
                      className="wp-btn wp-btn-secondary"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      title="Export as clean Markdown (.md)"
                    >
                      <Download style={{ width: '12px', height: '12px' }} />
                      Markdown
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="wp-btn wp-btn-secondary"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      title="Export as JSON (.json)"
                    >
                      <Download style={{ width: '12px', height: '12px' }} />
                      JSON
                    </button>

                    <button
                      onClick={handleCopyAllQA}
                      className="wp-btn wp-btn-secondary"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      title="Copy all questions & answers to clipboard"
                    >
                      {copiedHistory ? <Check style={{ width: '12px', height: '12px' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                      {copiedHistory ? 'Copied' : 'Copy All'}
                    </button>

                    {historyItems.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="wp-btn-ghost"
                        style={{ padding: '6px', color: '#ef4444' }}
                        title="Clear history"
                      >
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Session Filter Bar */}
                {sessions?.length > 1 && (
                  <div className="wp-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers style={{ width: '13px', height: '13px', color: '#a0a0a0' }} />
                      <span style={{ fontSize: '11px', color: '#a0a0a0' }}>Filter History by Session:</span>
                    </div>
                    <select
                      value={selectedHistorySessionId}
                      onChange={(e) => setSelectedHistorySessionId(e.target.value)}
                      className="wp-input"
                      style={{ fontSize: '11px', padding: '4px 8px', background: '#0a0a0a' }}
                    >
                      <option value="all">All Sessions Combined</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.history?.length || 0} Q&As) {s.id === activeSession?.id ? '• Active' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* History Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {historyItems.length > 0 ? (
                    historyItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="wp-card"
                        style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Question {historyItems.length - idx}
                          </span>
                          <span style={{ fontSize: '10px', color: '#555555', fontFamily: 'monospace' }}>
                            {item.timestamp || 'Recorded'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', lineHeight: '1.5' }}>
                          {item.question}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#b0b0b0',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          background: '#0a0a0a',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #1e1e1e',
                          fontFamily: 'monospace'
                        }}>
                          {item.answer}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#444444', textAlign: 'center', gap: '8px' }}>
                      <FileText style={{ width: '24px', height: '24px' }} />
                      <p style={{ fontSize: '12px' }}>No interview questions answered yet in this session.</p>
                      <p style={{ fontSize: '11px', color: '#555555' }}>Live interview Q&As generated via HUD or Test Lab will appear here automatically.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== TAB: RESUME & JD ==================== */}
            {activeTab === 'profile' && (
              <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'name', label: 'Full Name' },
                    { key: 'role', label: 'Current Role & Years of Experience' },
                    { key: 'targetCompany', label: 'Target Company' },
                    { key: 'targetRole', label: 'Target Role' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="wp-label">{label}</label>
                      <input
                        type="text"
                        value={localProfile[key] || ''}
                        onChange={(e) => setLocalProfile({ ...localProfile, [key]: e.target.value })}
                        className="wp-input"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Resume section */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label className="wp-label" style={{ marginBottom: 0 }}>Resume Content</label>
                    <div style={{ display: 'flex', border: '1px solid #282828', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => setResumeInputMode('text')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          border: 'none',
                          background: resumeInputMode === 'text' ? '#ffffff' : 'transparent',
                          color: resumeInputMode === 'text' ? '#000000' : '#a0a0a0',
                          transition: 'all 0.15s'
                        }}
                      >
                        Paste Text
                      </button>
                      <button
                        onClick={() => setResumeInputMode('pdf')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          border: 'none',
                          background: resumeInputMode === 'pdf' ? '#ffffff' : 'transparent',
                          color: resumeInputMode === 'pdf' ? '#000000' : '#a0a0a0',
                          transition: 'all 0.15s',
                          borderLeft: '1px solid #282828'
                        }}
                      >
                        Upload PDF
                      </button>
                    </div>
                  </div>

                  {resumeInputMode === 'text' ? (
                    <textarea
                      rows={6}
                      value={localProfile.resumeText || ''}
                      onChange={(e) => setLocalProfile({ ...localProfile, resumeText: e.target.value })}
                      placeholder="Paste your resume text, key highlights, projects, and skills here..."
                      className="wp-input"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'vertical' }}
                    />
                  ) : (
                    <div
                      onClick={() => pdfInputRef.current?.click()}
                      style={{
                        border: '1px dashed #282828',
                        borderRadius: '8px',
                        padding: '32px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#0a0a0a',
                        transition: 'border-color 0.15s'
                      }}
                    >
                      <Upload style={{ width: '20px', height: '20px', color: '#555555', margin: '0 auto 8px' }} />
                      <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '4px' }}>
                        {isPdfParsing ? 'Parsing PDF...' : 'Click to upload your resume PDF'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#444444' }}>Text will be extracted automatically</p>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handlePdfUpload}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="wp-label">Target Job Description</label>
                  <textarea
                    rows={4}
                    value={localProfile.jobDescription || ''}
                    onChange={(e) => setLocalProfile({ ...localProfile, jobDescription: e.target.value })}
                    placeholder="Paste the job description for the role you are interviewing for..."
                    className="wp-input"
                    style={{ width: '100%', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px', borderTop: '1px solid #1e1e1e' }}>
                  <button onClick={handleSave} className="wp-btn wp-btn-primary">
                    Save Profile
                  </button>
                </div>
              </div>
            )}

            {/* ==================== TAB: STEALTH GUIDE ==================== */}
            {activeTab === 'stealth' && (
              <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield style={{ width: '14px', height: '14px', color: '#a0a0a0' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Display Privacy & Presentation Protection</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#a0a0a0', lineHeight: '1.6' }}>
                    Windows Display Affinity (WDA_EXCLUDEFROMCAPTURE) ensures that this utility window remains private to your personal screen. When sharing your desktop during mock interviews or presentations, this practice HUD stays exclusively visible to you.
                  </p>
                </div>

                {/* Assessment Environment Compatibility Card */}
                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle style={{ width: '15px', height: '15px', color: proctorStatus?.safe ? '#4ade80' : '#f87171' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        Assessment Environment Compatibility
                      </span>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: proctorStatus?.safe ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.15)',
                      color: proctorStatus?.safe ? '#4ade80' : '#f87171',
                      border: proctorStatus?.safe ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)'
                    }}>
                      {proctorStatus?.safe ? 'ENVIRONMENT: COMPATIBLE' : 'RESTRICTED PROCESS DETECTED'}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#a0a0a0', lineHeight: '1.5', margin: 0 }}>
                    {proctorStatus?.safe
                      ? 'No conflicting assessment browser or lockdown software detected on this workstation.'
                      : `Notice: Active testing environment software detected: ${proctorStatus.detected.join(', ')}. Some assessment platforms restrict auxiliary practice utilities.`
                    }
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '4px' }}>
                    <button
                      onClick={async () => {
                        if (onCheckProctors) {
                          const res = await onCheckProctors();
                          showToast(res?.safe ? 'Environment check: Compatible' : 'Environment check: Detected ' + res?.detected?.join(', '));
                        }
                      }}
                      className="wp-btn wp-btn-secondary"
                      style={{ fontSize: '11px' }}
                    >
                      <RefreshCw style={{ width: '12px', height: '12px' }} />
                      Check Environment Compatibility
                    </button>
                  </div>
                </div>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Keyboard Shortcuts</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { action: 'Show / Hide Window', key: 'Ctrl+Shift+H' },
                      { action: 'Toggle Mic Mute', key: 'Ctrl+Shift+M' },
                      { action: 'Generate Answer', key: 'Ctrl+Shift+A' },
                      { action: 'Capture Screenshot', key: 'Ctrl+Shift+S' },
                      { action: 'Quick Dismiss', key: 'Ctrl+Shift+X' },
                      { action: 'Click-Through Mode', key: 'Ctrl+Shift+C' }
                    ].map(({ action, key }) => (
                      <div
                        key={key}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #1e1e1e',
                          background: '#0a0a0a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#a0a0a0' }}>{action}</span>
                        <kbd style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#1a1a1a',
                          border: '1px solid #282828',
                          color: '#ffffff',
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="wp-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>Screenshot Input</span>
                  <p style={{ fontSize: '12px', color: '#a0a0a0', lineHeight: '1.6' }}>
                    Press Ctrl+Shift+S to capture the current screen. The screenshot is automatically sent to the AI along with your voice transcript, enabling answers to coding problems or shared recruiter screens.
                  </p>
                  <div>
                    <button
                      onClick={() => window.wishpilot?.captureScreen().then(() => showToast('Screenshot captured'))}
                      className="wp-btn wp-btn-secondary"
                      style={{ fontSize: '11px' }}
                    >
                      <Monitor style={{ width: '12px', height: '12px' }} />
                      Capture Screenshot Now
                    </button>
                    <span className="wp-shortcut">Ctrl+Shift+S</span>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB: ABOUT ==================== */}
            {activeTab === 'about' && (
              <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* App Identity */}
                <div className="wp-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '4px' }}>
                    <img src={logoSrc} alt="WishPilot" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>WishPilot</div>
                      <div style={{ fontSize: '11px', color: '#555555', marginTop: '3px' }}>v1.0.0 — Interview Preparation Copilot</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#a0a0a0', lineHeight: '1.7', margin: 0 }}>
                    WishPilot is a desktop application that helps candidates prepare for technical interviews by providing real-time AI assistance, voice transcription, answer generation, and a mock interview practice environment. It is built as a personal productivity tool for structured, focused interview preparation.
                  </p>
                </div>

                {/* Developer Info */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Developer</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Vishwjeet Singh Vilkhu</div>
                      <div style={{ fontSize: '11px', color: '#555555', marginTop: '2px' }}>Software Engineer & Builder</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => window.wishpilot?.openExternal('https://github.com/vishwjeet27')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #282828',
                          background: '#0a0a0a',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#a0a0a0" style={{ flexShrink: 0 }}>
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <div>
                          <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '500' }}>GitHub</div>
                          <div style={{ fontSize: '10px', color: '#555555', fontFamily: 'monospace' }}>github.com/vishwjeet27</div>
                        </div>
                        <ExternalLink style={{ width: '11px', height: '11px', color: '#444444', marginLeft: 'auto' }} />
                      </button>
                      <button
                        onClick={() => window.wishpilot?.openExternal('https://www.linkedin.com/in/vishwjeet27')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid #282828',
                          background: '#0a0a0a',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#a0a0a0" style={{ flexShrink: 0 }}>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <div>
                          <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '500' }}>LinkedIn</div>
                          <div style={{ fontSize: '10px', color: '#555555', fontFamily: 'monospace' }}>linkedin.com/in/vishwjeet27</div>
                        </div>
                        <ExternalLink style={{ width: '11px', height: '11px', color: '#444444', marginLeft: 'auto' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* What this app does */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What WishPilot Does</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      'Real-time voice transcription via Groq Whisper (sub-350ms latency)',
                      'AI-powered answer generation with structured, role-specific responses',
                      'Multi-provider LLM support — Groq, OpenRouter, Gemini, OpenAI',
                      'Offline mock interview simulation with curated technical question banks',
                      'Session management with tailored resumes, JDs, and answer archives',
                      'Screen capture & visual context analysis for coding problem solving',
                      'Windows display affinity for window visibility control during screen sharing',
                      'Process scanner to detect known assessment environment software'
                    ].map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#555555', marginTop: '6px', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#a0a0a0', lineHeight: '1.5' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #333333' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Important Disclaimer</span>
                  <p style={{ fontSize: '11px', color: '#888888', lineHeight: '1.7', margin: 0 }}>
                    WishPilot is developed strictly as a personal interview preparation and practice tool. It is intended for use during self-directed mock interviews, offline practice sessions, and preparation drills — not during live assessments or evaluations conducted by third-party employers or institutions.
                  </p>
                  <p style={{ fontSize: '11px', color: '#888888', lineHeight: '1.7', margin: 0 }}>
                    The developer assumes no responsibility or liability for any misuse of this software. Users are solely responsible for ensuring their usage complies with all applicable terms of service, institutional policies, and ethical standards. This tool does not endorse or facilitate dishonest conduct of any kind.
                  </p>
                  <p style={{ fontSize: '11px', color: '#888888', lineHeight: '1.7', margin: 0 }}>
                    By using WishPilot, you acknowledge that you are responsible for how you choose to use it and agree to do so in a legal and ethical manner.
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="wp-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built With</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Electron 44', 'React 19', 'Vite 8', 'Groq API', 'Whisper STT', 'Web Audio API', 'pdfjs-dist', 'Lucide React', 'Marked'].map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: '1px solid #282828',
                          background: '#111111',
                          fontSize: '11px',
                          color: '#a0a0a0',
                          fontFamily: 'monospace'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#333333' }}>Made With 🩶 By Vishwjeet Singh Vilkhu</span>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
