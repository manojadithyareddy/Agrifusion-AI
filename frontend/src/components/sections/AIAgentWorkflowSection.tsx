import { useState, useEffect } from 'react';

interface AgentStep {
  step: number;
  title: string;
  category: 'LLM' | 'Computer Vision' | 'RAG' | 'Data' | 'Decision Engine' | 'Tools';
  color: string;
  toolCall: string;
  executionDetail: string;
  outputJson: string;
}

const AGENT_WORKFLOW: AgentStep[] = [
  {
    step: 1,
    title: 'Understand Request',
    category: 'LLM',
    color: '#a855f7',
    toolCall: 'agent.parse_intent(prompt="My rice crop is showing symptoms. What should I do?")',
    executionDetail: 'Zero-shot entity extractor identifies user crop intent (Rice / Paddy), symptom distress indicator, and implicit requirement for multimodal foliar diagnosis.',
    outputJson: '{\n  "intent": "crop_pathology_diagnosis",\n  "crop_hint": "rice",\n  "requires_multimodal_vision": true,\n  "language": "en"\n}',
  },
  {
    step: 2,
    title: 'Analyze Image',
    category: 'Computer Vision',
    color: '#00ff66',
    toolCall: 'vision_service.preprocess_and_segment(image_payload)',
    executionDetail: 'Receives uploaded foliar photo, normalizes chromatic balance, removes background soil clutter, and generates high-fidelity leaf mask.',
    outputJson: '{\n  "image_status": "valid",\n  "leaf_area_coverage_pct": 82.4,\n  "chlorosis_index": 0.48,\n  "segmentation_time_ms": 28.5\n}',
  },
  {
    step: 3,
    title: 'Identify Crop',
    category: 'Computer Vision',
    color: '#00ff66',
    toolCall: 'crop_classifier.predict(tensor_input)',
    executionDetail: 'Fine-tuned ResNet-50 visual feature extractor confirms botanical taxonomy: Oryza sativa (Paddy Rice) with 99.4% classification certainty.',
    outputJson: '{\n  "identified_crop": "Rice (Oryza sativa)",\n  "taxonomic_confidence": 0.994,\n  "cultivar_family": "Indica"\n}',
  },
  {
    step: 4,
    title: 'Detect Disease',
    category: 'Computer Vision',
    color: '#00ff66',
    toolCall: 'yolo_pathology.detect_lesions(tensor_input)',
    executionDetail: 'YOLOv8-Seg isolates necrotic wavy lesions along leaf margins. Predicts Bacterial Leaf Blight (BLB) caused by Xanthomonas oryzae pv. oryzae.',
    outputJson: '{\n  "primary_disease": "Bacterial Leaf Blight",\n  "pathogen": "Xanthomonas oryzae",\n  "detection_confidence": 0.974,\n  "severity": "Severe"\n}',
  },
  {
    step: 5,
    title: 'Retrieve Agricultural Knowledge',
    category: 'RAG',
    color: '#38bdf8',
    toolCall: 'vector_db.hybrid_search(query="Bacterial Leaf Blight Rice ICAR CIBRC chemical management")',
    executionDetail: 'Queries pgvector Qdrant index. Retrieves official ICAR Rice Pathology protocol and CIBRC approved bactericides with dosage and withholding limits.',
    outputJson: '{\n  "source": "ICAR-DRR Protocol Sec 4.2",\n  "chemical": "Copper Oxychloride 50 WP (2.5g/L) + Streptocycline 100ppm",\n  "phi_days": 15\n}',
  },
  {
    step: 6,
    title: 'Analyze Climate',
    category: 'Data',
    color: '#facc15',
    toolCall: 'weather_service.fetch_microclimate(lat=16.3067, lon=80.4365)',
    executionDetail: 'Retrieves local Doppler radar: Canopy relative humidity 89%, rain probability 75% in 36h. Flags high risk of bacterial ooze splash transmission.',
    outputJson: '{\n  "rh_pct": 89,\n  "rain_prob_36h": 0.75,\n  "splash_dispersal_risk": "Critical",\n  "transpiration_vpd": 1.2\n}',
  },
  {
    step: 7,
    title: 'Evaluate Risk',
    category: 'Decision Engine',
    color: '#3b82f6',
    toolCall: 'risk_engine.compute_epidemic_spread(disease, weather, crop_stage)',
    executionDetail: 'Mathematical epidemiology simulation projects 65% crop yield loss if untreated within 7 days. Escalates advisory priority to Urgent Action.',
    outputJson: '{\n  "composite_risk_score": 84,\n  "epidemic_velocity": "High",\n  "projected_yield_loss_pct": 65,\n  "action_urgency": "Immediate"\n}',
  },
  {
    step: 8,
    title: 'Generate Recommendation',
    category: 'Tools',
    color: '#fb923c',
    toolCall: 'prescription_generator.synthesize(disease, chemical, weather, irrigation)',
    executionDetail: 'Formulates multi-pronged action: Immediate copper + antibiotic foliar spray, drain field by 4cm, and cease sprinkler irrigation to stop dispersal.',
    outputJson: '{\n  "spray_protocol": "Copper Oxychloride 50% WP @ 2.5g/L + Streptocycline 1g/10L",\n  "water_action": "Drain standing water 4cm immediately",\n  "sprinkler_prohibition": true\n}',
  },
  {
    step: 9,
    title: 'Explain Action',
    category: 'Decision Engine',
    color: '#3b82f6',
    toolCall: 'vernacular_explainer.format_advisory(prescription, language="en")',
    executionDetail: 'Synthesizes transparent, scientific rationale for the farmer explaining WHY standing water must be drained and the exact safety withholding interval.',
    outputJson: '{\n  "final_advisory_ready": true,\n  "explanation_clarity_score": 0.98,\n  "delivered_via": ["web_console", "voice_assistant", "whatsapp"]\n}',
  },
];

export default function AIAgentWorkflowSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= AGENT_WORKFLOW.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStep = AGENT_WORKFLOW[activeStepIndex];

  return (
    <section
      id="section-ai-agent"
      aria-label="Autonomous AI Agent Section"
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
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#4ade80',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>🤖</span>
          <span>AUTONOMOUS AGENT WORKFLOW</span>
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
          The Autonomous Agricultural AI Agent
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          Watch how an autonomous agent breaks down a real-world farmer question, invokes specialized tools,
          queries RAG knowledge, evaluates climatic risk, and explains the agronomic reasoning.
        </p>
      </div>

      {/* User Query Banner */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '20px 28px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
            }}
          >
            🌾
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Farmer Input Query
            </div>
            <div style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
              "My rice crop is showing symptoms. What should I do?"
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #10b981 0%, #00ff66 100%)',
              color: isPlaying ? '#f87171' : '#022c22',
              border: isPlaying ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
              padding: '10px 22px',
              borderRadius: '24px',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isPlaying ? '⏸ Pause Autoplay' : '▶ Autoplay Execution'}</span>
          </button>

          <button
            onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : AGENT_WORKFLOW.length - 1))}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '10px 16px',
              borderRadius: '24px',
              fontSize: '0.86rem',
              cursor: 'pointer',
            }}
          >
            ◀ Back
          </button>

          <button
            onClick={() => setActiveStepIndex((prev) => (prev < AGENT_WORKFLOW.length - 1 ? prev + 1 : 0))}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '10px 16px',
              borderRadius: '24px',
              fontSize: '0.86rem',
              cursor: 'pointer',
            }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* 9-Node Execution Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '36px',
        }}
      >
        {AGENT_WORKFLOW.map((s, idx) => {
          const isActive = activeStepIndex === idx;
          return (
            <div
              key={s.step}
              onClick={() => {
                setIsPlaying(false);
                setActiveStepIndex(idx);
              }}
              style={{
                background: isActive ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.5)',
                border: isActive ? `2px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 8px 25px ${s.color}30` : 'none',
              }}
            >
              <div style={{ fontSize: '0.66rem', color: s.color, fontWeight: 800, fontFamily: 'monospace' }}>
                0{s.step}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                {s.title}
              </div>
              <span
                style={{
                  fontSize: '0.62rem',
                  background: `${s.color}20`,
                  color: s.color,
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                {s.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Active Node Execution Sandbox */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${currentStep.color}40`,
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: currentStep.color, fontWeight: 900, fontFamily: 'monospace', fontSize: '0.88rem' }}>
                WORKFLOW STEP 0{currentStep.step} OF 09
              </span>
              <span style={{ color: '#64748b' }}>•</span>
              <span
                style={{
                  background: `${currentStep.color}25`,
                  color: currentStep.color,
                  border: `1px solid ${currentStep.color}50`,
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                }}
              >
                {currentStep.category.toUpperCase()} SUBSYSTEM
              </span>
            </div>
            <h3 style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc' }}>
              {currentStep.title}
            </h3>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Status: <strong style={{ color: '#00ff66' }}>Executed in State Machine</strong>
          </div>
        </div>

        {/* Narrative Description */}
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
          {currentStep.executionDetail}
        </p>

        {/* Technical Tool Call & JSON State Output */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Tool Call Box */}
          <div style={{ background: 'rgba(5, 10, 18, 0.8)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
              Autonomous Tool Call
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.84rem', color: '#38bdf8', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {currentStep.toolCall}
            </div>
          </div>

          {/* JSON State Output */}
          <div style={{ background: 'rgba(5, 10, 18, 0.8)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
              State Machine Context Artifact
            </div>
            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#a7f3d0',
                margin: 0,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.45,
              }}
            >
              {currentStep.outputJson}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
