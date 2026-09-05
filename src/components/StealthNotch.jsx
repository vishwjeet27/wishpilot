import React from 'react';
import logoSrc from '../img-asset/logo.png';
import { Maximize2 } from 'lucide-react';

export default function StealthNotch({
  isListening,
  audioLevel,
  detectedQuestion,
  onExpand,
  onGenerateAnswer,
  isGenerating
}) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', overflow: 'hidden', userSelect: 'none', fontFamily: 'Inter, sans-serif' }}>
      <div
        onClick={onExpand}
        className="app-drag"
        style={{
          width: detectedQuestion ? '230px' : '190px',
          height: '28px',
          borderRadius: '14px',
          border: audioLevel > 5 ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid #282828',
          boxShadow: audioLevel > 5 ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          cursor: 'pointer',
          background: audioLevel > 5 ? 'rgba(20, 20, 20, 0.97)' : 'rgba(10, 10, 10, 0.95)',
          transition: 'all 0.15s ease',
          overflow: 'hidden'
        }}
        title="WishPilot - Click to expand"
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <img src={logoSrc} alt="WishPilot" style={{ width: '12px', height: '12px', objectFit: 'contain' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap' }}>WishPilot</span>
        </div>

        {/* Center status */}
        {isListening && !detectedQuestion && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px', flex: 1, justifyContent: 'center' }}>
            <span className="wave-bar" style={{ height: `${Math.max(3, audioLevel * 0.25)}px`, background: audioLevel > 5 ? '#ffffff' : '#555555' }} />
            <span className="wave-bar" style={{ height: `${Math.max(5, audioLevel * 0.45)}px`, background: audioLevel > 5 ? '#e0e0e0' : '#777777' }} />
            <span className="wave-bar" style={{ height: `${Math.max(4, audioLevel * 0.3)}px`, background: audioLevel > 5 ? '#ffffff' : '#555555' }} />
            <span className="wave-bar" style={{ height: `${Math.max(6, audioLevel * 0.5)}px`, background: audioLevel > 5 ? '#c0c0c0' : '#444444' }} />
            <span className="wave-bar" style={{ height: `${Math.max(3, audioLevel * 0.2)}px`, background: audioLevel > 5 ? '#ffffff' : '#555555' }} />
          </div>
        )}

        {!isListening && !detectedQuestion && (
          <span style={{ fontSize: '9px', color: '#555555', fontFamily: 'monospace', flex: 1, textAlign: 'center' }}>idle</span>
        )}

        {/* Right actions */}
        <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {detectedQuestion && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onGenerateAnswer) onGenerateAnswer();
              }}
              style={{
                padding: '2px 7px',
                borderRadius: '3px',
                background: '#ffffff',
                color: '#000000',
                fontSize: '9px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap'
              }}
            >
              {isGenerating ? '...' : 'Answer'}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              background: 'transparent',
              border: 'none',
              color: '#555555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Expand"
          >
            <Maximize2 style={{ width: '9px', height: '9px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
