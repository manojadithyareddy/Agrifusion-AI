import { useEffect, useState } from 'react';

export type PipelineStage =
  | 'idle'
  | 'input'
  | 'vision'
  | 'analysis'
  | 'knowledge'
  | 'reasoning'
  | 'decision'
  | 'complete';

interface AIProcessingPipelineBarProps {
  isAnalyzing: boolean;
  cropName?: string;
  diseaseName?: string;
  modelLabel?: string;
  className?: string;
}

interface StageMeta {
  id: PipelineStage;
  label: string;
  sub: string;
  icon: string;
}

const STAGES: StageMeta[] = [
  { id: 'input', label: 'INPUT', sub: 'Leaf / Multimodal Data', icon: '📥' },
  { id: 'vision', label: 'VISION', sub: 'Foliar Segmentation', icon: '👁️' },
  { id: 'analysis', label: 'ANALYSIS', sub: 'Pathogen Classification', icon: '🔬' },
  { id: 'knowledge', label: 'KNOWLEDGE', sub: 'ICAR Agronomic Corpus', icon: '📚' },
  { id: 'reasoning', label: 'REASONING', sub: 'Dosage & Safety Chain', icon: '🧠' },
  { id: 'decision', label: 'DECISION', sub: 'Actionable Prescription', icon: '🎯' },
];

export default function AIProcessingPipelineBar({
  isAnalyzing,
  cropName,
  diseaseName,
  modelLabel = 'Gemini Multimodal Vision API',
  className = '',
}: AIProcessingPipelineBarProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(isAnalyzing ? 1 : 5);

  // When isAnalyzing triggers, simulate real pipeline progression through the 6 stages
  useEffect(() => {
    if (!isAnalyzing) {
      setActiveStepIndex(5); // Complete state
      return;
    }

    setActiveStepIndex(0); // Input received
    const t1 = setTimeout(() => setActiveStepIndex(1), 350);  // Vision
    const t2 = setTimeout(() => setActiveStepIndex(2), 850);  // Analysis
    const t3 = setTimeout(() => setActiveStepIndex(3), 1400); // Knowledge
    const t4 = setTimeout(() => setActiveStepIndex(4), 1950); // Reasoning
    const t5 = setTimeout(() => setActiveStepIndex(5), 2500); // Decision

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isAnalyzing]);

  return (
    <div
      className={className}
      style={{
        background: 'rgba(10, 15, 26, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Telemetry Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isAnalyzing ? '#f59e0b' : '#10b981',
              boxShadow: `0 0 10px ${isAnalyzing ? '#f59e0b' : '#10b981'}`,
              animation: isAnalyzing ? 'pulseDot 1s infinite' : 'none',
            }}
          />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.8px' }}>
            AUTONOMOUS AGRONOMIC PIPELINE
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#64748b',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {modelLabel}
          </span>
        </div>

        {cropName && (
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', gap: '6px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{cropName}</span>
            {diseaseName && <span style={{ color: '#cbd5e1' }}>• {diseaseName}</span>}
          </div>
        )}
      </div>

      {/* Stepper Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '6px',
          position: 'relative',
        }}
      >
        {STAGES.map((stage, idx) => {
          const isDone = !isAnalyzing || idx < activeStepIndex;
          const isCurrent = isAnalyzing && idx === activeStepIndex;
          const isPending = isAnalyzing && idx > activeStepIndex;

          return (
            <div
              key={stage.id}
              style={{
                position: 'relative',
                background: isCurrent
                  ? 'rgba(245, 158, 11, 0.12)'
                  : isDone
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isCurrent
                    ? 'rgba(245, 158, 11, 0.5)'
                    : isDone
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                borderRadius: '10px',
                padding: '8px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.25s ease',
              }}
            >
              <div
                style={{
                  fontSize: '1rem',
                  marginBottom: '2px',
                  opacity: isPending ? 0.35 : 1,
                  transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {stage.icon}
              </div>

              <div
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  color: isCurrent
                    ? '#fcd34d'
                    : isDone
                    ? '#34d399'
                    : '#64748b',
                }}
              >
                {stage.label}
              </div>

              <div
                style={{
                  fontSize: '0.55rem',
                  color: isCurrent ? '#fbbf24' : isDone ? '#94a3b8' : '#475569',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {isCurrent ? 'Processing...' : isDone ? '✓ Verified' : stage.sub}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
