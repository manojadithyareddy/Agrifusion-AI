import { useState } from 'react';

interface StoryStage {
  number: string;
  title: string;
  tagline: string;
  icon: string;
  telemetry: string;
  description: string;
  visualGraphic: string;
}

const STORY_STAGES: StoryStage[] = [
  {
    number: '01',
    title: 'Capture',
    tagline: 'High-Res Multi-Spectral Sensor Acquisition',
    icon: '📸',
    telemetry: 'INPUT: RAW 3840×2160 RGB + SENTINEL-2 NIR (BAND 8)',
    description: 'The journey begins at the edge. A farmer’s smartphone camera or autonomous field drone captures raw multi-spectral photons from the canopy under ambient daylight.',
    visualGraphic: 'RAW_IMAGE_ACQUIRED',
  },
  {
    number: '02',
    title: 'Understand',
    tagline: 'Botanical Taxonomy & Foliar Pre-processing',
    icon: '🔬',
    telemetry: 'CLASSIFICATION: ORYZA SATIVA (PADDY RICE) [CONF: 99.4%]',
    description: 'Deep neural networks strip background soil noise, analyze leaf venation geometry, and classify the exact plant cultivar and vegetative growth stage.',
    visualGraphic: 'TAXONOMIC_ISOLATION',
  },
  {
    number: '03',
    title: 'Detect',
    tagline: 'YOLOv8 Foliar Lesion Segmentation',
    icon: '🎯',
    telemetry: 'BOUNDING BOX: [X:142, Y:98, W:220, H:180] • BACTERIAL BLIGHT 97.4%',
    description: 'Instance segmentation models pinpoint microscopic chlorotic lesions, necrotic margins, and bacterial exudate droplets across millions of image pixels in 34ms.',
    visualGraphic: 'BOUNDING_BOXES_RENDERED',
  },
  {
    number: '04',
    title: 'Predict',
    tagline: 'Biophysical Trajectory & Yield Impact',
    icon: '📈',
    telemetry: 'FORECAST: -65% YIELD LOSS RISK WITHOUT 7-DAY INTERVENTION',
    description: 'Ensemble gradient-boosted trees project how the pathogen will spread under upcoming 14-day rainfall and humidity cycles, calculating exact financial risk.',
    visualGraphic: 'EPIDEMIOLOGY_CURVE_SOLVED',
  },
  {
    number: '05',
    title: 'Reason',
    tagline: 'Grounded RAG Retrieval from Scientific Codex',
    icon: '🧠',
    telemetry: 'RAG CITATION: ICAR-DRR PATHOLOGY BULLETIN #42 • COSINE SIM: 0.942',
    description: 'Autonomous LangGraph agents query 85,000+ accredited agronomic research documents to verify chemical efficacy, safety limits, and organic alternatives.',
    visualGraphic: 'KNOWLEDGE_RETRIEVED',
  },
  {
    number: '06',
    title: 'Decide',
    tagline: 'Multi-Objective Pareto Optimization',
    icon: '⚖️',
    telemetry: 'OPTIMIZATION: MAX NET PROFIT + ZERO RESIDUE VIOLATION',
    description: 'The system balances chemical cost, spraying logistics, withholding intervals, and upcoming weather to formulate the single optimal agronomic prescription.',
    visualGraphic: 'PRESCRIPTION_OPTIMIZED',
  },
  {
    number: '07',
    title: 'Act',
    tagline: 'Autonomous Field Dispatch & Vernacular Alert',
    icon: '⚡',
    telemetry: 'DISPATCH: SMART VALVE DRAIN 4CM + WHATSAPP ADVISORY IN TELUGU',
    description: 'Decisions turn into action: precision IoT valves adjust field water levels while the farmer receives a clear, voice-guided spray schedule in their mother tongue.',
    visualGraphic: 'ACTION_EXECUTED',
  },
];

export default function StorytellingSection() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const stage = STORY_STAGES[activeStageIndex];

  return (
    <section
      id="section-storytelling"
      aria-label="From Image to Decision Storytelling"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '110px 40px',
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
            background: 'rgba(0, 255, 102, 0.1)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#4ade80',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>📜</span>
          <span>THE AUTONOMOUS LIFECYCLE</span>
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
          From Image to Decision
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
          Follow the seven sequential stages where raw optical pixels are transformed into autonomous,
          revenue-saving agricultural interventions.
        </p>
      </div>

      {/* Stepper Buttons 01 to 07 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '40px',
        }}
      >
        {STORY_STAGES.map((s, idx) => {
          const isSelected = activeStageIndex === idx;
          return (
            <button
              key={s.number}
              onClick={() => setActiveStageIndex(idx)}
              style={{
                background: isSelected ? 'rgba(0, 255, 102, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 6px',
                color: isSelected ? '#4ade80' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 8px 25px rgba(0,255,102,0.25)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{s.icon}</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 900, fontFamily: 'monospace' }}>
                {s.number}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700 }}>{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Hero Showcase for Selected Stage */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '28px',
          padding: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Left Narrative Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                color: '#00ff66',
                fontFamily: 'monospace',
                background: 'rgba(0, 255, 102, 0.15)',
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 255, 102, 0.3)',
              }}
            >
              STAGE {stage.number}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              {stage.tagline}
            </span>
          </div>

          <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            {stage.title}
          </h3>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7, margin: '0 0 24px' }}>
            {stage.description}
          </p>

          <div
            style={{
              background: 'rgba(5, 10, 18, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '12px 18px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: '#86efac',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66' }} />
            <span>{stage.telemetry}</span>
          </div>
        </div>

        {/* Right Graphic/Telemetry Visualization */}
        <div
          style={{
            background: 'rgba(5, 10, 18, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(0,255,102,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />

          <div style={{ fontSize: '4.5rem', marginBottom: '14px', filter: 'drop-shadow(0 0 20px rgba(0,255,102,0.4))' }}>
            {stage.icon}
          </div>

          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            STAGE_{stage.number}::{stage.title.toUpperCase()}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
            [{stage.visualGraphic}]
          </div>

          {/* Stepper buttons below graphic */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => setActiveStageIndex((prev) => (prev > 0 ? prev - 1 : STORY_STAGES.length - 1))}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#cbd5e1',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStageIndex((prev) => (prev < STORY_STAGES.length - 1 ? prev + 1 : 0))}
              style={{
                background: 'rgba(0, 255, 102, 0.15)',
                border: '1px solid rgba(0, 255, 102, 0.3)',
                color: '#4ade80',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Next Stage ➔
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
