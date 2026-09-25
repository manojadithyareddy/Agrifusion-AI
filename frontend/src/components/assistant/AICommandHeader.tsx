import { useState } from 'react';
import type { PresetCropSample } from '../../utils/agriFramerEngine';

interface LanguageOption {
  code: string;
  name: string;
  native: string;
  flag: string;
}

export const ASSISTANT_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🌾' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🌱' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌿' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🌻' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🚜' },
];

interface AICommandHeaderProps {
  isAnalyzing: boolean;
  onClearChat: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyStep: number;
  historyTotal: number;
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  onSelectSample: (sample: PresetCropSample) => void;
  presetSamples: PresetCropSample[];
  className?: string;
}

export default function AICommandHeader({
  isAnalyzing,
  onClearChat,
  undo,
  redo,
  canUndo,
  canRedo,
  historyStep,
  historyTotal,
  selectedLanguage,
  onSelectLanguage,
  onSelectSample,
  presetSamples,
  className = '',
}: AICommandHeaderProps) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const currentLang =
    ASSISTANT_LANGUAGES.find((l) => l.code === selectedLanguage) || ASSISTANT_LANGUAGES[0];

  const systemIndicators = [
    { label: 'Vision', status: isAnalyzing ? 'Scanning' : 'Online', color: '#10b981' },
    { label: 'Reasoning', status: 'Active', color: '#38bdf8' },
    { label: 'Knowledge', status: '120k ICAR', color: '#a855f7' },
    { label: 'Prediction', status: 'Ensemble', color: '#f59e0b' },
    { label: 'Decision', status: 'v4.2 Ready', color: '#34d399' },
  ];

  return (
    <header
      className={className}
      style={{
        background: 'rgba(8, 12, 22, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        padding: '12px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 30,
        position: 'relative',
      }}
    >
      {/* ── Top Level Title & Controls Bar ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Branding & Core Dynamic Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            🌾
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: '#ffffff',
                }}
              >
                AgriFusion <span style={{ color: '#10b981' }}>AI</span>
              </h1>

              {/* Dynamic Status: AI SYSTEM ONLINE */}
              <div
                style={{
                  background: isAnalyzing
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${
                    isAnalyzing ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.35)'
                  }`,
                  color: isAnalyzing ? '#fcd34d' : '#34d399',
                  padding: '3px 10px',
                  borderRadius: '14px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isAnalyzing ? '#fcd34d' : '#34d399',
                    boxShadow: `0 0 8px ${isAnalyzing ? '#fcd34d' : '#34d399'}`,
                  }}
                />
                <span>{isAnalyzing ? 'AI PROCESSING' : 'AI SYSTEM ONLINE'}</span>
              </div>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: '0.74rem',
                color: '#94a3b8',
                marginTop: '1px',
                letterSpacing: '0.2px',
              }}
            >
              Your Multimodal Agricultural Intelligence Assistant
            </p>
          </div>
        </div>

        {/* Right: Controls & History */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Undo Button */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo last state (Ctrl+Z)"
            style={{
              background: canUndo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${canUndo ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)'}`,
              color: canUndo ? '#fff' : '#64748b',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: canUndo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>↩</span>
            <span className="hide-mobile-sm">Undo</span>
          </button>

          {/* Redo Button */}
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo state (Ctrl+Y)"
            style={{
              background: canRedo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${canRedo ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)'}`,
              color: canRedo ? '#fff' : '#64748b',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: canRedo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>↪</span>
            <span className="hide-mobile-sm">Redo</span>
          </button>

          {/* History Step Badge */}
          <span
            style={{
              fontSize: '0.68rem',
              color: '#64748b',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '5px 8px',
              borderRadius: '6px',
              fontFamily: 'monospace',
            }}
            className="hide-mobile-sm"
          >
            Step {historyStep}/{historyTotal}
          </span>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            {showLangDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#141a26',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '6px',
                  minWidth: '150px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  zIndex: 100,
                }}
              >
                {ASSISTANT_LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      onSelectLanguage(l.code);
                      setShowLangDropdown(false);
                    }}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: selectedLanguage === l.code ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: selectedLanguage === l.code ? '#34d399' : '#e2e8f0',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.native}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset / Clear Chat */}
          <button
            onClick={onClearChat}
            title="Reset Chat Session"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '6px',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ── Subsystems Live Telemetry & Benchmark Quick Samples ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '8px',
        }}
      >
        {/* Subtle Live System Indicators: Vision, Reasoning, Knowledge, Prediction, Decision */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
          }}
          className="hide-scrollbar"
        >
          {systemIndicators.map((ind) => (
            <div
              key={ind.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                color: '#94a3b8',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: ind.color,
                  boxShadow: `0 0 6px ${ind.color}`,
                }}
              />
              <span style={{ fontWeight: 700, color: '#cbd5e1' }}>{ind.label}:</span>
              <span style={{ color: ind.color }}>{ind.status}</span>
            </div>
          ))}
        </div>

        {/* Benchmark Sample Crop Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
          }}
          className="hide-scrollbar"
        >
          <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Benchmark Tests:
          </span>
          {presetSamples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.68rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              {sample.cropName}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
