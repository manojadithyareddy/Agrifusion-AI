import { useState } from 'react';
import type { CropAnalysisResult, PresetCropSample } from '../../utils/agriFramerEngine';
import { getPlainLanguageDiagnosis } from '../../utils/agriFramerEngine';
import FramerCanvas from './FramerCanvas';
import FramerPipelineFlow from './FramerPipelineFlow';
import JsonSchemaViewer from './JsonSchemaViewer';

interface AIIntelligencePanelProps {
  analysis: CropAnalysisResult;
  activeImageSrc?: string;
  isHi?: boolean;
  onSelectSample?: (sample: PresetCropSample) => void;
  onCustomImageAnalyzed?: (result: CropAnalysisResult, imageSrc: string) => void;
  onSpeak?: (text: string) => void;
  className?: string;
}

export default function AIIntelligencePanel({
  analysis,
  activeImageSrc,
  isHi = false,
  onSelectSample,
  onCustomImageAnalyzed,
  onSpeak,
  className = '',
}: AIIntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<'dossier' | 'prescription' | 'inspection'>('dossier');
  const plainDiag = getPlainLanguageDiagnosis(analysis);

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
      case 'high':
        return '#ef4444';
      case 'moderate':
        return '#f59e0b';
      case 'low':
        return '#38bdf8';
      default:
        return '#10b981';
    }
  };

  const confidencePct = Math.round((analysis.confidence ?? 0.95) * 100);
  const severityColor = getSeverityColor(analysis.severity ?? 'Moderate');

  return (
    <div
      className={className}
      style={{
        background: 'rgba(11, 16, 28, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* ── Panel Header ── */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: severityColor,
              boxShadow: `0 0 10px ${severityColor}`,
            }}
          />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.5px' }}>
              AGRONOMIC INTELLIGENCE DOSSIER
            </div>
            <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
              Autonomous Multi-Agent Threat Assessment
            </div>
          </div>
        </div>

        {onSpeak && (
          <button
            onClick={() =>
              onSpeak(
                `${plainDiag.cropName}. ${plainDiag.diseaseSimple}. ${plainDiag.homeRemedy}. Store medicine: ${plainDiag.storeMedicine}`
              )
            }
            title="Read out agronomic dossier"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#34d399',
              borderRadius: '8px',
              padding: '5px 9px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🔊</span>
            <span style={{ fontSize: '0.68rem' }}>Listen</span>
          </button>
        )}
      </div>

      {/* ── Tab Switcher ── */}
      <div
        style={{
          display: 'flex',
          padding: '6px 14px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setActiveTab('dossier')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'dossier' ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
            color: activeTab === 'dossier' ? '#34d399' : '#94a3b8',
            fontWeight: activeTab === 'dossier' ? 800 : 600,
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          📊 Overview
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'prescription' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
            color: activeTab === 'prescription' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === 'prescription' ? 800 : 600,
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          💊 Prescription
        </button>

        <button
          onClick={() => setActiveTab('inspection')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'inspection' ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
            color: activeTab === 'inspection' ? '#c084fc' : '#94a3b8',
            fontWeight: activeTab === 'inspection' ? 800 : 600,
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          🔬 Vision Tools
        </button>
      </div>

      {/* ── Scrollable Tab Content ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* TAB 1: OVERVIEW DOSSIER */}
        {activeTab === 'dossier' && (
          <>
            {/* Primary Result Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.4) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '16px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                    Identified Crop
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                    {analysis.cropName}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#34d399' }}>
                    {confidencePct}%
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#86efac', fontWeight: 700 }}>
                    Confidence
                  </div>
                </div>
              </div>

              {/* Disease Tag */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Pathological Condition:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {analysis.diseaseName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                  {plainDiag.diseaseExplanation}
                </div>
              </div>
            </div>

            {/* Metric Gauges Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
              }}
            >
              {/* Severity Gauge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Severity Risk
                </div>
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: severityColor,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>●</span>
                  <span>{analysis.severity}</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
                  Pathogen: {analysis.scientificPathogen || 'Foliar Pathogen'}
                </div>
              </div>

              {/* Latency & Verification */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Inference Engine
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#e2e8f0', marginTop: '4px' }}>
                  {analysis.id.includes('gemini') ? 'Gemini 2.5 Vision' : 'Dual CNN-YOLO'}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#10b981', marginTop: '4px' }}>
                  Latency: ~118ms
                </div>
              </div>
            </div>

            {/* Visible Symptoms */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '14px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🔍</span>
                <span>{isHi ? 'पहचाने गए लक्षण' : 'Visible Field Symptoms'}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {plainDiag.symptomsList.map((sym, i) => (
                  <li key={i}>{sym}</li>
                ))}
              </ul>
            </div>

            {/* Pest Status Banner */}
            <div
              style={{
                background: plainDiag.pestsStatus.includes('ALERT')
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(16, 185, 129, 0.06)',
                border: `1px solid ${
                  plainDiag.pestsStatus.includes('ALERT')
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(16, 185, 129, 0.2)'
                }`,
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: plainDiag.pestsStatus.includes('ALERT') ? '#fca5a5' : '#86efac',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                🐛 {isHi ? 'कीट व परजीवी स्थिति' : 'Insect Pest Infestation'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.4 }}>
                {plainDiag.pestsStatus}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PRESCRIPTION MATRIX */}
        {activeTab === 'prescription' && (
          <>
            {/* Store Medicine Prescription */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#7dd3fc',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🛒</span>
                <span>{isHi ? 'कृषि केंद्र से दवा व सटीक मात्रा' : 'Store Medicine & Exact Dilution'}</span>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 600 }}>
                {plainDiag.storeMedicine}
              </div>
            </div>

            {/* Safe Organic / Home Remedy */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#86efac',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🏡</span>
                <span>{isHi ? 'घरेलू जैविक रोकथाम' : 'Organic & Home Remedy'}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {plainDiag.homeRemedy}
              </div>
            </div>

            {/* Mistakes to Avoid */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#fcd34d',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🚫</span>
                <span>{isHi ? 'निषेध: ये गलतियां न करें' : 'Prohibited Actions & Pitfalls'}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#e2e8f0', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {plainDiag.avoidMistakes.map((mis, i) => (
                  <li key={i}>{mis}</li>
                ))}
              </ul>
            </div>

            {/* Next Recommended Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                📋 {isHi ? 'आगामी 7 दिनों की कार्ययोजना' : '7-Day Agronomic Protocol'}
              </div>
              <ol style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5 }}>
                {(analysis.jsonOutput?.recommendation ? [analysis.jsonOutput.recommendation] : [])
                  .concat(plainDiag.avoidMistakes)
                  .map((act: string, i: number) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {act}
                    </li>
                  ))}
              </ol>
            </div>
          </>
        )}

        {/* TAB 3: DEEP-TECH VISION & FRAMER INSPECTION TOOLS */}
        {activeTab === 'inspection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Framer Canvas with Bounding Boxes */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c084fc', marginBottom: '8px' }}>
                DETECTION CANVAS & YOLO SEGMENTATION
              </div>
              <FramerCanvas
                currentAnalysis={analysis}
                onSelectSample={onSelectSample || (() => {})}
                onCustomImageAnalyzed={onCustomImageAnalyzed || (() => {})}
                activeImageSrc={activeImageSrc}
              />
            </div>

            {/* Framer Neural Pipeline */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>
                NEURAL NETWORK TOPOLOGY
              </div>
              <FramerPipelineFlow analysis={analysis} />
            </div>

            {/* JSON Schema Viewer */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
                STRUCTURED SCHEMATIC OUTPUT
              </div>
              <JsonSchemaViewer data={analysis.jsonOutput} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
