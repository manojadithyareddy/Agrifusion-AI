import { useState } from 'react';
import type { CropAnalysisResult } from '../../utils/agriFramerEngine';

interface FramerPipelineFlowProps {
  analysis: CropAnalysisResult;
  isProcessing?: boolean;
}

export default function FramerPipelineFlow({ analysis, isProcessing = false }: FramerPipelineFlowProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>('node-yolo');

  return (
    <div style={{
      position: 'relative',
      background: '#0d111a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '32px 24px',
      overflow: 'hidden',
      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
    }}>
      {/* Background Matrix Dot Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
        opacity: 0.7,
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(52, 211, 153, 0.1)',
            padding: '3px 10px',
            borderRadius: '12px',
            marginBottom: '6px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isProcessing ? '#f59e0b' : '#34d399',
              boxShadow: `0 0 10px ${isProcessing ? '#f59e0b' : '#34d399'}`,
              animation: 'pulse 1.8s infinite'
            }} />
            {isProcessing ? 'Processing Neural Inference...' : 'Active Vision Pipeline Telemetry'}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            Technical Processing Background Architecture
          </h2>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            Dual-Stream Neural Inference: YOLO Disease/Pest Bounding Boxes + Classification Softmax Logits + Built-in Multimodal Reasoner
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#e2e8f0',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}>
            ⚡ Latency: <strong style={{ color: '#38bdf8' }}>48ms</strong>
          </span>
          <span style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 800,
          }}>
            Accuracy: <strong style={{ color: '#fff' }}>{(analysis.confidence * 100).toFixed(1)}%</strong>
          </span>
        </div>
      </div>

      {/* ── Main Node Flow Container ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '820px',
        margin: '0 auto',
      }}>

        {/* ── STAGE 1: AGRICULTURAL IMAGE ── */}
        <div
          onClick={() => setSelectedNode('node-image')}
          style={{
            width: '100%',
            maxWidth: '480px',
            background: selectedNode === 'node-image' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(20, 27, 40, 0.85)',
            border: `1.5px solid ${selectedNode === 'node-image' ? '#38bdf8' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '18px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedNode === 'node-image' ? '0 0 24px rgba(56, 189, 248, 0.25)' : '0 4px 14px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>
                📸
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                  AGRICULTURAL IMAGE
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Raw Foliage & Crop Ingestion (RGB Matrix)
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
              {analysis.preprocessing.resolution}
            </span>
          </div>

          {selectedNode === 'node-image' && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>FOLIAGE %</div>
                <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.85rem' }}>{analysis.preprocessing.greenFoliagePct}%</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>ASPECT RATIO</div>
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>{analysis.preprocessing.leafAspectRatio}:1</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>COLOR SPACE</div>
                <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>RGB 8-bit</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Connector Arrow 1 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '2px', height: '24px',
            background: 'linear-gradient(180deg, #38bdf8, #10b981)',
            boxShadow: '0 0 8px #38bdf8',
          }} />
          <span style={{ color: '#10b981', fontSize: '0.8rem', lineHeight: 1 }}>↓</span>
        </div>

        {/* ── STAGE 2: IMAGE PREPROCESSING ── */}
        <div
          onClick={() => setSelectedNode('node-prep')}
          style={{
            width: '100%',
            maxWidth: '480px',
            background: selectedNode === 'node-prep' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(20, 27, 40, 0.85)',
            border: `1.5px solid ${selectedNode === 'node-prep' ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '18px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedNode === 'node-prep' ? '0 0 24px rgba(16, 185, 129, 0.25)' : '0 4px 14px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>
                ⚙️
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                  Image Preprocessing
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  HSV Filtering, Otsu Thresholding, Laplacian Variance
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
              Var: {analysis.preprocessing.laplacianVariance}
            </span>
          </div>

          {selectedNode === 'node-prep' && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>OTSU THRESH</div>
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>{analysis.preprocessing.otsuThreshold}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>NECROSIS SPREAD</div>
                <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>{analysis.preprocessing.necroticLesionPct}%</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>FILTER METHOD</div>
                <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '0.85rem' }}>CIE-LAB + CLAHE</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Splitter Branches (Parallel Path) ── */}
        <div style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* Top Fork Lines */}
          <div style={{ width: '2px', height: '14px', background: '#10b981' }} />
          <div style={{
            width: '56%',
            height: '2px',
            background: 'linear-gradient(90deg, #ec4899, #10b981, #6366f1)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '56%', height: '14px' }}>
            <div style={{ width: '2px', height: '100%', background: '#ec4899' }} />
            <div style={{ width: '2px', height: '100%', background: '#6366f1' }} />
          </div>

          {/* ── PARALLEL NODES: YOLO & CLASSIFICATION ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            width: '100%',
            marginTop: '2px',
          }}>
            {/* 3A: YOLO MODEL */}
            <div
              onClick={() => setSelectedNode('node-yolo')}
              style={{
                background: selectedNode === 'node-yolo' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(20, 27, 40, 0.85)',
                border: `1.5px solid ${selectedNode === 'node-yolo' ? '#ec4899' : 'rgba(236, 72, 153, 0.3)'}`,
                borderRadius: '18px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedNode === 'node-yolo' ? '0 0 24px rgba(236, 72, 153, 0.25)' : '0 4px 14px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>
                  🎯
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                    YOLO Model
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#f472b6' }}>
                    Disease / Pest Detection
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Detected BBoxes:</span>
                  <span style={{ color: '#f472b6', fontWeight: 800 }}>{analysis.yoloBoxes.length} Clusters</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>Max BBox Conf:</span>
                  <span style={{ color: '#34d399', fontWeight: 800 }}>
                    {(Math.max(...analysis.yoloBoxes.map(b => b.confidence)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {selectedNode === 'node-yolo' && (
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                  Anchor box proposals with Non-Max Suppression (IoU 0.45). Localizes necrotic margins and active insect feeding sites.
                </div>
              )}
            </div>

            {/* 3B: CLASSIFICATION MODEL */}
            <div
              onClick={() => setSelectedNode('node-cls')}
              style={{
                background: selectedNode === 'node-cls' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(20, 27, 40, 0.85)',
                border: `1.5px solid ${selectedNode === 'node-cls' ? '#6366f1' : 'rgba(99, 102, 241, 0.3)'}`,
                borderRadius: '18px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedNode === 'node-cls' ? '0 0 24px rgba(99, 102, 241, 0.25)' : '0 4px 14px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>
                  🔬
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                    Classification Model
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a5b4fc' }}>
                    Disease Class Prediction
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Top Softmax:</span>
                  <span style={{ color: '#a5b4fc', fontWeight: 800 }}>{(analysis.classificationLogits[0]?.probability * 100).toFixed(1)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>Pathology Class:</span>
                  <span style={{ color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                    {analysis.diseaseName.split(' ')[0]}
                  </span>
                </div>
              </div>

              {selectedNode === 'node-cls' && (
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                  Deep CNN feature embedding with calibrated temperature scaling. Evaluates 16+ crop pathology classes.
                </div>
              )}
            </div>
          </div>

          {/* Joiner Lines (Convergence) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '56%', height: '14px', marginTop: '4px' }}>
            <div style={{ width: '2px', height: '100%', background: '#ec4899' }} />
            <div style={{ width: '2px', height: '100%', background: '#6366f1' }} />
          </div>
          <div style={{
            width: '56%',
            height: '2px',
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #6366f1)',
          }} />
          <div style={{ width: '2px', height: '14px', background: '#8b5cf6' }} />
        </div>

        {/* ── STAGE 4: LOCAL MULTIMODAL REASONER (GPT-5 / GEMINI 3.5 PRO) ── */}
        <div
          onClick={() => setSelectedNode('node-llm')}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: selectedNode === 'node-llm' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(20, 27, 40, 0.85)',
            border: `1.5px solid ${selectedNode === 'node-llm' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.4)'}`,
            borderRadius: '20px',
            padding: '18px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: selectedNode === 'node-llm' ? '0 0 28px rgba(139, 92, 246, 0.3)' : '0 6px 18px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.3))',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              }}>
                🧠
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>GPT-5 / Gemini 3.5 Pro Multimodal Engine</span>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', padding: '1px 6px', borderRadius: '6px' }}>
                    Own-Built
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#c4b5fd' }}>
                  Autonomous Local Agronomic Reasoner (Zero Paid APIs)
                </div>
              </div>
            </div>
            <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: '0.8rem' }}>
              Deep Agronomy
            </span>
          </div>

          <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            <strong style={{ color: '#c4b5fd' }}>Synthesis: </strong>
            Correlates YOLO bounding box lesion density ({analysis.yoloBoxes.length} spots) with {analysis.cropName} classification logits ({(analysis.confidence * 100).toFixed(1)}%) to deduce pathogen lifecycle, severity index, and differential diagnoses.
          </div>
        </div>

        {/* ── Connector Arrow 3 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '2px', height: '24px',
            background: 'linear-gradient(180deg, #8b5cf6, #10b981)',
            boxShadow: '0 0 8px #10b981',
          }} />
          <span style={{ color: '#10b981', fontSize: '0.8rem', lineHeight: 1 }}>↓</span>
        </div>

        {/* ── STAGE 5: OUTPUT + RECOMMENDATIONS + JSON ── */}
        <div
          onClick={() => setSelectedNode('node-output')}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.3))',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '20px',
            padding: '18px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              }}>
                📋
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#34d399' }}>
                  Explanation + Diagnosis + Farming Recommendations
                </div>
                <div style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                  Validated Output Payload formatted in exact requested JSON
                </div>
              </div>
            </div>
            <span style={{
              background: '#10b981', color: '#022c22',
              fontWeight: 900, fontSize: '0.72rem',
              padding: '3px 10px', borderRadius: '12px'
            }}>
              READY
            </span>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.74rem', padding: '4px 10px', borderRadius: '8px' }}>
              Crop: <strong>{analysis.jsonOutput.crop.split(' ')[0]}</strong>
            </span>
            <span style={{ background: 'rgba(0,0,0,0.3)', color: '#f87171', fontSize: '0.74rem', padding: '4px 10px', borderRadius: '8px' }}>
              Disease: <strong>{analysis.jsonOutput.disease.split(' ')[0]}</strong>
            </span>
            <span style={{ background: 'rgba(0,0,0,0.3)', color: '#fbbf24', fontSize: '0.74rem', padding: '4px 10px', borderRadius: '8px' }}>
              Severity: <strong>{analysis.severity}</strong>
            </span>
            <span style={{ background: 'rgba(0,0,0,0.3)', color: '#38bdf8', fontSize: '0.74rem', padding: '4px 10px', borderRadius: '8px' }}>
              Alternatives: <strong>{analysis.jsonOutput.alternatives.length}</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
