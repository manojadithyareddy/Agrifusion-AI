import { useState } from 'react';

interface PipelineStage {
  id: string;
  step: string;
  title: string;
  shortDesc: string;
  icon: string;
  activeModel: string;
  inputs: string[];
  outputs: string[];
  latency: string;
  deepDive: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'data',
    step: '01',
    title: 'DATA INGESTION',
    shortDesc: 'Heterogeneous multi-source agricultural sensor & telemetry fusion',
    icon: '🛰️',
    activeModel: 'Apache Kafka / TimescaleDB Ingestion Layer',
    inputs: [
      'Sentinel-2 Multi-spectral Bands (B2, B3, B4, B8 NIR)',
      'Subsurface IoT Soil Capacitance (15cm & 45cm)',
      'IMD Real-time Doppler Weather & Microclimate',
      'APMC e-NAM Daily Mandi Commodity Arrivals',
      'Farmer Smartphone High-Resolution RGB & Voice',
    ],
    outputs: [
      'Normalized GeoTIFF NDVI Tensors',
      'Calibrated Volumetric Moisture Curves',
      'Harmonized Agro-Climatic Feature Vectors',
    ],
    latency: 'Sub-second real-time streaming',
    deepDive: 'Ingests raster satellite arrays, temporal soil probe telemetry, and spot commodity rates into high-velocity streaming queues with automated coordinate projection.',
  },
  {
    id: 'perception',
    step: '02',
    title: 'PERCEPTION & EXTRACTION',
    shortDesc: 'Edge computer vision, leaf segmentation & vernacular speech recognition',
    icon: '👁️',
    activeModel: 'YOLOv8-Seg + ViT-Hybrid + Whisper Indic',
    inputs: [
      'Raw foliar camera captures',
      'Drone orthomosaic field imagery',
      'Farmer vernacular voice notes (14 languages)',
      'Soil Health Card lab report scans',
    ],
    outputs: [
      'Instance bounding boxes & pixel masks for foliar lesions',
      'Chlorophyll index & Canopy chlorosis quantification',
      'Grounded phonetic audio transcriptions',
      'Parsed NPK values, Organic Carbon %, and soil pH',
    ],
    latency: '38 ms GPU inference',
    deepDive: 'Processes visual foliar imagery via custom fine-tuned YOLOv8 weights with spatial attention gates, converting unstructured visual cues into structured diagnostic tokens.',
  },
  {
    id: 'prediction',
    step: '03',
    title: 'PREDICTIVE MODELING',
    shortDesc: 'Ensemble machine learning & temporal biophysical disease forecasting',
    icon: '📊',
    activeModel: 'XGBoost + LightGBM + 1D Temporal CNN',
    inputs: [
      'Soil nutrient balance (N-P-K-pH)',
      '14-day rainfall and vapor pressure deficit trend',
      'Historical yield records (ICAR 10-year dataset)',
      'Foliar pathogen density vectors',
    ],
    outputs: [
      'Crop suitability rankings with confidence bounds',
      'Yield forecast in quintals/hectare [95% CI]',
      'Disease propagation probability over 7 days',
      'Irrigation deficit & soil drying rate curves',
    ],
    latency: '14 ms CPU inference',
    deepDive: 'Trained on 45,000+ national multi-season field trials to predict yield outcomes and pest epidemic trajectories with robust statistical confidence intervals.',
  },
  {
    id: 'reasoning',
    step: '04',
    title: 'AGENTIC REASONING',
    shortDesc: 'Multimodal cross-attention & RAG verification against agronomic codex',
    icon: '🧠',
    activeModel: 'LangGraph Autonomous Agent + BAAI/bge-large',
    inputs: [
      'Perception tokens + Predictive metrics',
      'ICAR Agricultural Package of Practices Codex',
      'CIBRC Central Insecticide Board Registries',
      'Farmer landholding size & capital constraints',
    ],
    outputs: [
      'Synthesized multi-hypothesis diagnostic graph',
      'Active ingredient chemical compatibility verification',
      'Withholding safety period calculation',
      'Economic cost-benefit justification per acre',
    ],
    latency: '420 ms RAG retrieval & LLM synthesis',
    deepDive: 'LangGraph state machine evaluates conflicting variables (e.g. spray efficacy vs imminent rainfall) and retrieves grounded ICAR scientific literature to eliminate hallucination.',
  },
  {
    id: 'decision',
    step: '05',
    title: 'MULTI-OBJECTIVE DECISION',
    shortDesc: 'Mathematical optimization balancing profit, risk & ecological impact',
    icon: '⚖️',
    activeModel: 'Pareto-Optimal Multi-Factor Decision Matrix',
    inputs: [
      'Market price forecast vs cultivation cost',
      'Pathogen epidemic risk score (0-100)',
      'Water availability & aquifer recharge constraints',
      'Carbon footprint & chemical residue limits',
    ],
    outputs: [
      'Single unified optimal agronomic prescription',
      'Ranked contingency plans (Plan B & Plan C)',
      'Risk mitigation guarantees and trigger thresholds',
    ],
    latency: '8 ms matrix solver',
    deepDive: 'Executes Pareto optimization to maximize farmer net profitability while maintaining sustainable soil ecology and avoiding pesticide overuse.',
  },
  {
    id: 'action',
    step: '06',
    title: 'AUTONOMOUS ACTION',
    shortDesc: 'Direct farm execution via IoT controls, farmer alerts & mandi routing',
    icon: '⚡',
    activeModel: 'MQTT Telemetry Broker + Twilio / WhatsApp APIs',
    inputs: [
      'Optimal Agronomic Prescription',
      'IoT smart valve schedules',
      'Farmer contact & preferred vernacular dialect',
    ],
    outputs: [
      'Automated drip irrigation pulse command (Liters/acre)',
      'Interactive voice/SMS advisory with exact chemical dosage',
      'Optimal APMC mandi dispatch window recommendation',
      'Audit log entry into distributed farm ledger',
    ],
    latency: 'Instant event-driven dispatch',
    deepDive: 'Closes the loop by dispatching precise commands to connected farm hardware and delivering clear, actionable instructions directly into the farmer’s hands.',
  },
];

export default function PlatformPipelineSection() {
  const [activeStage, setActiveStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  return (
    <section
      id="section-pipeline"
      aria-label="One Platform Complete Agricultural Intelligence Pipeline"
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
            background: 'rgba(0, 255, 102, 0.1)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '40px',
            padding: '6px 20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#4ade80',
            marginBottom: '16px',
            letterSpacing: '1px',
          }}
        >
          <span>🔄</span>
          <span>END-TO-END AUTONOMOUS ARCHITECTURE</span>
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
          One Platform. Complete Agricultural Intelligence.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto' }}>
          Explore the unified autonomous pipeline that transforms raw field telemetry into validated,
          high-yield agricultural actions.
        </p>
      </div>

      {/* Pipeline Navigation Stages (Horizontal Flow with Connecting Arrows) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '40px',
        }}
      >
        {PIPELINE_STAGES.map((s) => {
          const isSelected = activeStage.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setActiveStage(s)}
              style={{
                background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: isSelected ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '18px 16px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 10px 30px rgba(0, 255, 102, 0.25)' : 'none',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: isSelected ? '#00ff66' : '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  STAGE {s.step}
                </span>
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                {s.title}
              </div>

              <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {s.shortDesc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Stage Execution Card */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header with Title & Latency Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '20px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '2.4rem' }}>{activeStage.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#00ff66', fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  STAGE {activeStage.step}
                </span>
                <span style={{ color: '#64748b' }}>•</span>
                <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  ENGINE: {activeStage.activeModel}
                </span>
              </div>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc' }}>
                {activeStage.title}
              </h3>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(5, 10, 18, 0.8)',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              borderRadius: '30px',
              padding: '8px 20px',
              fontSize: '0.84rem',
              color: '#86efac',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66' }} />
            <span>Execution Latency: {activeStage.latency}</span>
          </div>
        </div>

        {/* Narrative Description */}
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {activeStage.deepDive}
        </p>

        {/* 2-Column Input Tensors vs Output Decisions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Inputs Column */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#38bdf8', fontSize: '1.1rem' }}>📥</span>
              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                Input Data Tensors & Sensors
              </h4>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeStage.inputs.map((inp, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.86rem',
                    color: '#cbd5e1',
                  }}
                >
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Outputs Column */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '18px',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#00ff66', fontSize: '1.1rem' }}>📤</span>
              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                Output Artifacts & Agronomic Insights
              </h4>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeStage.outputs.map((out, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.86rem',
                    color: '#cbd5e1',
                  }}
                >
                  <span style={{ color: '#00ff66' }}>✓</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
