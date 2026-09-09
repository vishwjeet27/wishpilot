/**
 * WishPilot - Universal Stealth Interview Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

import React, { useState, useRef } from 'react';
import logoSrc from '../img-asset/logo.png';
import { marked } from 'marked';
import {
  Shield,
  Mic,
  MicOff,
  Camera,
  X,
  Copy,
  Check,
  MousePointer,
  Settings,
  Minus,
  Monitor,
  Send,
  Layers,
  Trash2
} from 'lucide-react';
import { getCategoryById } from '../constants/interviewCategories';
import RefinementPills from './RefinementPills';

export default function StealthHUD({
  settings,
  profile,
  apiKeys,
  activeSession,
  sessions = [],
  onSwitchSession,
  isStealthActive,
  onToggleStealth,
  platformInfo,
  onSwitchMode,
  onCaptureScreenshot,
  capturedScreenshot,
  isCapturingScreen,
  onClearScreenshot,
  onSendScreenshot,
  currentTranscript,
  detectedQuestion,
  currentAnswer,
  isGenerating,
  audioLevel,
  isListening,
  onToggleListening,
  onGenerateAnswer,
  onRefineAnswer,
  onManualAsk,
  onClearTranscript,
  onSaveSettings,
  latencyMetrics,
  proctorStatus
}) {
  const [opacity, setOpacity] = useState(settings.hudOpacity || 0.90);
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const answerEndRef = useRef(null);

  const toggleClickThrough = async () => {
    const next = !isClickThrough;
    setIsClickThrough(next);
    if (window.wishpilot?.setClickThrough) {
      await window.wishpilot.setClickThrough(next);
    }
  };

  const handleCopyAnswer = () => {
    if (!currentAnswer) return;
    navigator.clipboard.writeText(currentAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim() && onManualAsk) {
      onManualAsk(manualInput.trim());
      setManualInput('');
    }
  };

  const renderedAnswer = React.useMemo(() => {
    if (!currentAnswer) return '';
    try { return marked.parse(currentAnswer); } catch { return currentAnswer; }
  }, [currentAnswer]);

  const bgAlpha = Math.max(0.12, opacity);

  const borderStyle = '1px solid #282828';
  const cardBg = `rgba(10, 10, 10, ${bgAlpha})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', padding: '6px', background: 'transparent', fontFamily: 'Inter, -apple-system, sans-serif', userSelect: 'none' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          border: borderStyle,
          background: cardBg
        }}
      >
        {/* Header - Row 1: Brand + Stealth + Controls */}
        <div
          className="app-drag"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: borderStyle,
            background: `rgba(0, 0, 0, ${bgAlpha * 0.5})`,
            cursor: 'move',
            flexShrink: 0
          }}
        >
          {/* Left: brand + stealth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img src={logoSrc} alt="WishPilot" style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', flexShrink: 0 }}>WishPilot</span>
            <button
              onClick={onToggleStealth}
              className="no-drag"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                borderRadius: '4px',
                border: `1px solid ${isStealthActive ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                background: isStealthActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: isStealthActive ? '#4ade80' : '#f87171',
                fontSize: '10px',
                fontFamily: 'monospace',
                fontWeight: '700',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title={platformInfo?.platform === 'linux' ? (platformInfo.isWayland ? 'Wayland: captures require user selection' : 'X11: DOCK window type hint applied') : 'Content protection against screen capture'}
            >
              <Shield style={{ width: '9px', height: '9px' }} />
              {isStealthActive ? 'ON' : 'OFF'}
              {platformInfo?.platform === 'linux' && (
                <span style={{ fontSize: '8px', opacity: 0.8, marginLeft: '2px' }}>
                  ({platformInfo.isWayland ? 'Wayland' : 'X11'})
                </span>
              )}
            </button>

            {/* Proctor warning — only when detected */}
            {proctorStatus && !proctorStatus.safe && proctorStatus.detected?.length > 0 && (
              <div
                className="no-drag"
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}
                title={`Restricted testing environment software active: ${proctorStatus.detected.join(', ')}`}
              >
                ENV NOTICE
              </div>
            )}

            {/* Category indicator badge */}
            {(() => {
              const cat = getCategoryById(activeSession?.category || profile?.category || 'it');
              const CatIcon = cat.icon;
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: borderStyle,
                    background: '#141414',
                    color: '#e4e4e7',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  title={`Interview Stream: ${cat.label} (${cat.frameworkName})`}
                >
                  <CatIcon size={10} style={{ color: '#ffffff' }} />
                  <span>{cat.badgeText}</span>
                </div>
              );
            })()}

            {/* Session switcher */}
            {activeSession && (
              <div className="no-drag" style={{ position: 'relative', minWidth: 0 }}>
                <button
                  onClick={() => setShowSessionPicker(!showSessionPicker)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: borderStyle,
                    background: '#141414',
                    color: '#d4d4d8',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    maxWidth: '110px'
                  }}
                  title="Click to switch session"
                >
                  <Layers style={{ width: '9px', height: '9px', color: '#a0a0a0', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeSession.name || activeSession.company || 'Session'}
                  </span>
                  <span style={{ fontSize: '8px', color: '#555555', flexShrink: 0 }}>▼</span>
                </button>
                {showSessionPicker && sessions?.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      background: '#0d0d0f',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      padding: '4px',
                      zIndex: 9999,
                      minWidth: '200px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.85)'
                    }}
                  >
                    <div style={{ fontSize: '9px', color: '#71717a', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Switch Session
                    </div>
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (onSwitchSession) onSwitchSession(s.id);
                          setShowSessionPicker(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: s.id === activeSession.id ? '#1a1a1a' : 'transparent',
                          color: s.id === activeSession.id ? '#ffffff' : '#e4e4e7',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '11px',
                          gap: '2px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <span style={{ fontWeight: s.id === activeSession.id ? '700' : '500' }}>{s.name}</span>
                          {(() => {
                            const cat = getCategoryById(s.category || 'it');
                            const CatIcon = cat.icon;
                            return (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8px', color: '#a1a1aa', fontFamily: 'monospace' }}>
                                <CatIcon size={9} />
                                <span>{cat.badgeText}</span>
                              </span>
                            );
                          })()}
                        </div>
                        <span style={{ fontSize: '9px', color: '#71717a' }}>{s.company || 'Company'} • {s.targetRole || 'Role'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: opacity + icon controls */}
          <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
            {/* Opacity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 7px', borderRadius: '20px', border: borderStyle, background: '#111111', marginRight: '2px' }}>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#666666', minWidth: '20px' }}>{Math.round(opacity * 100)}%</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                style={{ width: '36px', height: '2px', cursor: 'pointer' }}
                title="Opacity"
              />
            </div>

            <button
              onClick={toggleClickThrough}
              className="wp-btn-ghost"
              style={{ width: '22px', height: '22px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isClickThrough ? borderStyle : 'none', background: isClickThrough ? '#1a1a1a' : 'transparent' }}
              title="Click-Through Mode (Ctrl+Shift+C)"
            >
              <MousePointer style={{ width: '10px', height: '10px' }} />
            </button>

            <button
              onClick={onSwitchMode}
              className="wp-btn-ghost"
              style={{ width: '22px', height: '22px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Open Studio (settings)"
            >
              <Settings style={{ width: '10px', height: '10px' }} />
            </button>

            <button
              onClick={() => window.wishpilot?.minimize()}
              className="wp-btn-ghost"
              style={{ width: '22px', height: '22px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Minimize"
            >
              <Minus style={{ width: '10px', height: '10px' }} />
            </button>

            <button
              onClick={() => window.wishpilot?.close()}
              className="wp-btn-ghost"
              style={{ width: '22px', height: '22px', borderRadius: '4px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Close"
            >
              <X style={{ width: '10px', height: '10px' }} />
            </button>
          </div>
        </div>

        {/* Toolbar - Row 2: Mic + Latency | Screenshot */}
        <div
          className="no-drag"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            borderBottom: borderStyle,
            background: `rgba(0, 0, 0, 0.15)`,
            flexShrink: 0,
            gap: '8px'
          }}
        >
          {/* Left: Mic + latency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <button
                onClick={onToggleListening}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  border: borderStyle,
                  background: isListening ? '#1a1a1a' : '#111111',
                  color: isListening ? '#ffffff' : '#a0a0a0',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {isListening ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '13px' }}>
                      <span className="wave-bar" style={{ height: `${Math.max(4, audioLevel * 0.2)}px` }} />
                      <span className="wave-bar" style={{ height: `${Math.max(6, audioLevel * 0.3)}px` }} />
                      <span className="wave-bar" style={{ height: `${Math.max(4, audioLevel * 0.15)}px` }} />
                    </div>
                    Listening
                  </>
                ) : (
                  <>
                    <MicOff style={{ width: '11px', height: '11px' }} />
                    Mic Off
                  </>
                )}
              </button>
              <span style={{ fontSize: '9px', color: '#3a3a3a', fontFamily: 'monospace', marginTop: '1px' }}>Ctrl+Shift+M</span>
            </div>

            {/* Latency badge — compact */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                borderRadius: '4px',
                border: borderStyle,
                background: '#0d0d0d',
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#777777'
              }}
              title="Real-time STT and AI latency"
            >
              <span>STT {latencyMetrics?.stt ? `${latencyMetrics.stt}ms` : '--'}</span>
              <span style={{ color: '#2a2a2a' }}>·</span>
              <span>AI {latencyMetrics?.ai ? `${latencyMetrics.ai}ms` : '--'}</span>
            </div>
          </div>

          {/* Right: Screenshot */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={onCaptureScreenshot}
                disabled={isCapturingScreen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  border: capturedScreenshot ? '1px solid rgba(255,255,255,0.4)' : borderStyle,
                  background: capturedScreenshot ? '#1a1a1a' : '#111111',
                  color: capturedScreenshot ? '#ffffff' : '#a0a0a0',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  cursor: isCapturingScreen ? 'not-allowed' : 'pointer'
                }}
                title="Capture Screenshot (Ctrl+Shift+S)"
              >
                <Camera style={{ width: '11px', height: '11px' }} />
                {isCapturingScreen ? 'Capturing...' : capturedScreenshot ? 'Retake' : 'Screenshot'}
              </button>
              {capturedScreenshot && (
                <>
                  <button
                    onClick={() => (onSendScreenshot ? onSendScreenshot() : onGenerateAnswer())}
                    disabled={isGenerating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 9px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#ffffff',
                      color: '#000000',
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'inherit',
                      cursor: isGenerating ? 'not-allowed' : 'pointer'
                    }}
                    title="Send screenshot to AI"
                  >
                    <Send style={{ width: '10px', height: '10px' }} />
                    {isGenerating ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    onClick={onClearScreenshot}
                    style={{ background: 'none', border: 'none', color: '#555555', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                    title="Clear screenshot"
                  >
                    <X style={{ width: '10px', height: '10px' }} />
                  </button>
                </>
              )}
            </div>
            <span style={{ fontSize: '9px', color: '#3a3a3a', fontFamily: 'monospace', marginTop: '1px' }}>Ctrl+Shift+S</span>
          </div>
        </div>

        {/* Screenshot Ready Banner */}
        {capturedScreenshot && (
          <div
            className="no-drag"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px',
              borderBottom: borderStyle,
              background: '#141414',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={capturedScreenshot}
                alt="Captured Preview"
                style={{ width: '36px', height: '22px', objectFit: 'cover', borderRadius: '3px', border: borderStyle }}
              />
              <span style={{ fontSize: '11px', color: '#ffffff', fontFamily: 'monospace' }}>
                Screenshot captured & ready
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => (onSendScreenshot ? onSendScreenshot() : onGenerateAnswer())}
                disabled={isGenerating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  background: '#ffffff',
                  color: '#000000',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                <Send style={{ width: '10px', height: '10px' }} />
                {isGenerating ? 'Analyzing...' : 'Send Screenshot'}
              </button>
              <button
                onClick={onClearScreenshot}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: borderStyle,
                  background: '#1a1a1a',
                  color: '#888888',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
                title="Discard screenshot"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div
          className="no-drag"
          style={{
            padding: '8px 14px',
            borderBottom: borderStyle,
            maxHeight: '72px',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.15)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#555555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Interviewer Speech
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {detectedQuestion && (
                <span style={{ fontSize: '9px', color: '#a0a0a0', background: '#1a1a1a', border: borderStyle, padding: '1px 6px', borderRadius: '3px', fontFamily: 'monospace' }}>
                  Voice Ready
                </span>
              )}
              {Boolean(currentTranscript || detectedQuestion) && (
                <button
                  onClick={onClearTranscript}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    border: borderStyle,
                    background: '#1a1a1a',
                    color: '#a1a1aa',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    cursor: 'pointer'
                  }}
                  title="Clear detected speech & audio buffer"
                >
                  <Trash2 style={{ width: '9px', height: '9px' }} />
                  Clear
                </button>
              )}
            </div>
          </div>
          <p style={{ fontSize: '11px', color: currentTranscript ? '#d0d0d0' : '#444444', fontFamily: 'monospace', fontStyle: currentTranscript ? 'normal' : 'italic', lineHeight: '1.5' }}>
            {currentTranscript || (isListening ? 'Listening...' : 'Mic is off.')}
          </p>
        </div>

        {/* Answer Trigger Bar */}
        {(currentTranscript || detectedQuestion) && (
          <div
            className="no-drag"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px',
              borderBottom: borderStyle,
              background: '#111111',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '10px', color: '#a0a0a0', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {detectedQuestion || currentTranscript?.slice(0, 40)}...
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={onClearTranscript}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: borderStyle,
                  background: '#1a1a1a',
                  color: '#a1a1aa',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
                title="Discard audio buffer"
              >
                Clear
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={() => onGenerateAnswer()}
                  disabled={isGenerating}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    background: isGenerating ? '#1a1a1a' : '#ffffff',
                    color: isGenerating ? '#a0a0a0' : '#000000',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    opacity: isGenerating ? 0.6 : 1,
                    flexShrink: 0
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Answer'}
                </button>
                <span style={{ fontSize: '9px', color: '#444444', fontFamily: 'monospace', marginTop: '2px' }}>Ctrl+Shift+A</span>
              </div>
            </div>
          </div>
        )}

        {/* Answer Area */}
        <div className="no-drag" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Answer
              </span>
              {isGenerating && (
                <span style={{ fontSize: '10px', color: '#555555', fontFamily: 'monospace' }}>Streaming...</span>
              )}
            </div>
            {currentAnswer && (
              <button
                onClick={handleCopyAnswer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: borderStyle,
                  background: '#111111',
                  color: '#a0a0a0',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check style={{ width: '10px', height: '10px' }} /> : <Copy style={{ width: '10px', height: '10px' }} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* Instant Refinement Action Pills */}
          {currentAnswer && (
            <div style={{ marginBottom: '8px', flexShrink: 0 }}>
              <RefinementPills
                onRefine={(type) => onRefineAnswer && onRefineAnswer(type)}
                isGenerating={isGenerating}
                compact={true}
              />
            </div>
          )}

          <div
            style={{
              flex: 1,
              borderRadius: '8px',
              padding: '12px',
              border: borderStyle,
              background: 'rgba(0,0,0,0.3)',
              overflowY: 'auto',
              fontSize: '12px',
              lineHeight: '1.7'
            }}
          >
            {currentAnswer ? (
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: renderedAnswer }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444444', textAlign: 'center', gap: '8px' }}>
                <Monitor style={{ width: '18px', height: '18px' }} />
                <p style={{ fontSize: '11px' }}>AI answers will stream here when a question is detected or triggered manually.</p>
              </div>
            )}
            <div ref={answerEndRef} />
          </div>
        </div>

        {/* Manual ask bar */}
        <div
          className="no-drag"
          style={{
            padding: '10px 14px',
            borderTop: borderStyle,
            background: 'rgba(0,0,0,0.3)',
            flexShrink: 0
          }}
        >
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Type a custom question..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="wp-input"
              style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            />
            <button
              type="submit"
              disabled={!manualInput.trim() || isGenerating}
              className="wp-btn wp-btn-primary"
              style={{ fontSize: '11px', padding: '7px 14px' }}
            >
              Ask
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
