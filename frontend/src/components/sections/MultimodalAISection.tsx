import { useState } from 'react';

interface StreamItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
  rawSample: string;
  tokenizedEmbedding: string;
  contributionWeight: string;
}

const STREAMS: StreamItem[] = [
  {
    id: 'text',
    name: 'Farmer Vernacular Voice & Text',
    type: 'Natural Language Tokens',
    icon: '💬',
    color: '#38bdf8',
    rawSample: '"వరి ఆకుల అంచులు ఎండిపోతున్నాయి, 3 రోజుల నుండి చినుకులు పడుతున్నాయి..." (Telugu: Rice leaf edges drying after 3 days of drizzle)',
    tokenizedEmbedding: 'Indic-BERT fine-tuned vector [dim: 768] → Intention: {symptom_report, crop: paddy, duration: 72h}',
    contributionWeight: '22% Attention Weight',
  },
  {
    id: 'image',
    name: 'High-Resolution Foliar Imagery',
    type: 'Spatial Tensor Matrix',
    icon: '📷',
    color: '#00ff66',
    rawSample: 'RGB Sensor Array [3840×2160×3] capturing chlorotic foliar stripes with bacterial ooze beads',
    tokenizedEmbedding: 'YOLOv8-Seg + ViT Patch Embeddings [dim: 1024] → Bounding Box: [0.24, 0.31, 0.45, 0.52] (BLB Conf: 97.4%)',
    contributionWeight: '34% Attention Weight',
  },
  {
    id: 'data',
    name: 'IoT Soil & Hardware Sensors',
    type: 'Capacitance & NPK Telemetry',
    icon: '📡',
    color: '#facc15',
    rawSample: 'TDR Probe Depth 15cm: 31% VWC • Depth 45cm: 42% VWC • Soil pH: 6.8 • EC: 0.42 dS/m',
    tokenizedEmbedding: 'Temporal Normalization Vector [dim: 128] → Moisture Status: {Adequate, Anaerobic Root Threat: Moderate}',
    contributionWeight: '18% Attention Weight',
  },
  {
    id: 'weather',
    name: 'Doppler Radar & Microclimate',
    type: 'Atmospheric Time-Series',
    icon: '🌦️',
    color: '#fb923c',
    rawSample: 'Canopy Temp: 29.4°C • Relative Humidity: 89% • Leaf Wetness Duration: 14.2h continuous',
    tokenizedEmbedding: 'Microclimate Latent Embedding [dim: 256] → Epidemic Index: {Spore Germination Rate: Critical}',
    contributionWeight: '14% Attention Weight',
  },
  {
    id: 'knowledge',
    name: 'ICAR & FAO Scientific Codex',
    type: 'Dense Semantic Chunks',
    icon: '📚',
    color: '#c084fc',
    rawSample: 'ICAR Directorate of Rice Research Pathology Protocol Sec. 4.2: Xanthomonas oryzae management under high humidity',
    tokenizedEmbedding: 'BAAI/bge-large Vector [dim: 1024] → Cosine Match: 0.924 against CIBRC Approved Bactericides',
    contributionWeight: '12% Attention Weight',
  },
];

export default function MultimodalAISection() {
  const [activeStream, setActiveStream] = useState<StreamItem>(STREAMS[1]); // Default to image

  return (
    <section
      id="section-multimodal-ai"
      aria-label="Multimodal AI Architecture"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '100px 40px',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#c084fc',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>🧬</span>
          <span>CROSS-ATTENTION FUSION ARCHITECTURE</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Multimodal Agricultural Intelligence
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto' }}>
          Real farming challenges cannot be solved with text or images in isolation. AgriFusion AI
          unifies five distinct modalities into a single reasoning substrate.
        </p>
      </div>

      {/* Visual Convergence Diagram: 5 Streams Converging into Central AI Node */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '36px',
        }}
      >
        {STREAMS.map((s) => {
          const isSelected = activeStream.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setActiveStream(s)}
              style={{
                background: isSelected ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.55)',
                border: isSelected ? `2px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '18px 16px',
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: isSelected ? `0 10px 30px ${s.color}25` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: s.color, textTransform: 'uppercase' }}>
                  {s.contributionWeight.split(' ')[0]} WEIGHT
                </span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                {s.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.type}</div>
            </div>
          );
        })}
      </div>

      {/* Central Fusion Processor & Grounded Decision Output */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Active Stream Inspector */}
        <div
          style={{
            background: 'rgba(5, 10, 18, 0.8)',
            border: `1px solid ${activeStream.color}40`,
            borderRadius: '18px',
            padding: '20px 24px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: activeStream.color, fontWeight: 800, textTransform: 'uppercase' }}>
              Selected Modality Stream Inspector
            </span>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {activeStream.contributionWeight}
            </span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            {activeStream.name}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', marginBottom: '10px', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <strong style={{ color: '#94a3b8' }}>Raw Ingest:</strong> {activeStream.rawSample}
          </div>

          <div style={{ fontSize: '0.76rem', color: '#a7f3d0', fontFamily: 'monospace' }}>
            <strong style={{ color: '#38bdf8' }}>Tensor Embedding:</strong> {activeStream.tokenizedEmbedding}
          </div>
        </div>

        {/* Fusion Core Visual Banner */}
        <div
          style={{
            textAlign: 'center',
            padding: '16px',
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(0, 255, 102, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#c084fc', letterSpacing: '2px', textTransform: 'uppercase' }}>
            ⚡ CROSS-ATTENTION TRANSFORMER LATENT SPACE (FUSED 2048-DIMENSIONAL TOKEN) ⚡
          </div>
        </div>

        {/* Synthesized Agricultural Decision */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(0, 255, 102, 0.4)',
            borderRadius: '20px',
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>
                Synthesized Multimodal Agronomic Action
              </h3>
            </div>
            <span
              style={{
                background: 'rgba(0, 255, 102, 0.2)',
                color: '#4ade80',
                border: '1px solid #00ff66',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 800,
              }}
            >
              VALIDATED GROUNDED PRESCRIPTION
            </span>
          </div>

          <p style={{ margin: '0 0 14px', fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            By correlating the Telugu vernacular voice report with the microscopic foliar lesion tensor,
            subsurface moisture (42% VWC), and continuous 14h canopy wetness, AgriFusion AI confirms active
            <strong> Bacterial Leaf Blight (BLB)</strong> in its early epidemic stage.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ background: 'rgba(5, 10, 18, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TARGETED INTERVENTION</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>Copper Oxychloride 50 WP (2.5g/L)</div>
            </div>
            <div style={{ background: 'rgba(5, 10, 18, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>IRRIGATION SHIFT</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8' }}>Drain 4cm; eliminate sprinkler splash</div>
            </div>
            <div style={{ background: 'rgba(5, 10, 18, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>EXPECTED LOSS AVOIDED</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#00ff66' }}>₹32,400 / acre net yield preserved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
