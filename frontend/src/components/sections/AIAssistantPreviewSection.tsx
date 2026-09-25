import { useState } from 'react';

export default function AIAssistantPreviewSection({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const queries = [
    {
      label: '🌾 Rice Blast Diagnosis',
      userPrompt: 'My paddy leaves have diamond-shaped gray centered spots with brown borders. What should I spray before tomorrow morning?',
      image: '/crops/rice.jpg',
      diagnosis: {
        disease: 'Rice Blast (Neck & Leaf Blast)',
        pathogen: 'Magnaporthe oryzae (Pyricularia oryzae)',
        confidence: '97.2%',
        chemical: 'Tricyclazole 75% WP or Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dosage: '0.6 g/L Tricyclazole or 1.0 mL/L Azoxystrobin combo',
        phi: '21 Days before harvest',
        waterDirective: 'Avoid drying cracks; maintain shallow standing water (2-3cm) to buffer canopy temperature.',
      },
    },
    {
      label: '🍅 Tomato Blight & Leaf Curl',
      userPrompt: 'Tomato foliage has yellow curled margins and lower leaves are dropping with dark concentric rings.',
      image: '/crops/chili.jpg',
      diagnosis: {
        disease: 'Early Blight + Vector Whitefly Co-infection',
        pathogen: 'Alternaria solani + Begomovirus vector',
        confidence: '95.8%',
        chemical: 'Mancozeb 75% WP + Diafenthiuron 50% WP',
        dosage: '2.0 g/L Mancozeb + 1.25 g/L Diafenthiuron',
        phi: '7 Days withholding interval',
        waterDirective: 'Shift to drip irrigation immediately to eliminate splash dispersal of fungal spores.',
      },
    },
    {
      label: '🌽 Maize Fall Armyworm',
      userPrompt: 'Whorl leaves of 30-day maize crop are perforated like shot-holes with sawdust-like frass inside.',
      image: '/crops/maize.jpg',
      diagnosis: {
        disease: 'Fall Armyworm (FAW) Infestation',
        pathogen: 'Spodoptera frugiperda (Lepidoptera)',
        confidence: '98.5%',
        chemical: 'Chlorantraniliprole 18.5% SC or Emamectin Benzoate 5% SG',
        dosage: '0.4 mL/L Chlorantraniliprole directed into central whorl',
        phi: '14 Days withholding period',
        waterDirective: 'Adequate irrigation reduces plant distress volatile emissions that attract egg-laying moths.',
      },
    },
  ];

  const current = queries[activeQueryIndex];

  const handleSelectQuery = (idx: number) => {
    setIsProcessing(true);
    setActiveQueryIndex(idx);
    setTimeout(() => {
      setIsProcessing(false);
    }, 450);
  };

  return (
    <section
      id="section-assistant-preview"
      aria-label="AI Assistant Interactive Preview"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '100px 40px',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
          <span>💬</span>
          <span>ENTERPRISE ADVISORY INTERFACE</span>
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
          Conversational Multimodal Assistant
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
          Real-time agronomic chat combining live vision, vector RAG retrieval, and chemical safety rules
          into concise, structured guidance farmers can trust.
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {queries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectQuery(idx)}
            style={{
              background: activeQueryIndex === idx ? 'rgba(0, 255, 102, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: activeQueryIndex === idx ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeQueryIndex === idx ? '#4ade80' : '#cbd5e1',
              padding: '10px 22px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: activeQueryIndex === idx ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Interactive Mock Chat Console */}
      <div
        style={{
          maxWidth: '920px',
          margin: '0 auto',
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Chat Console Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(5, 10, 18, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66' }} />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
              AgriFusion AI Advisory Agent
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '10px' }}>
              GPT-4o + Gemini 2.5 Multi-Agent
            </span>
          </div>

          <div style={{ fontSize: '0.76rem', color: '#4ade80', fontFamily: 'monospace' }}>
            Latency: 42ms
          </div>
        </div>

        {/* Chat Body */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Message */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <div
              style={{
                maxWidth: '75%',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '20px 20px 4px 20px',
                padding: '14px 18px',
                color: '#f8fafc',
                fontSize: '0.92rem',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <img
                  src={current.image}
                  alt="Crop attachment"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>📷 [Attached foliar sample]</span>
              </div>
              {current.userPrompt}
            </div>
          </div>

          {/* AI Processing Stepper Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              padding: '6px 12px',
              background: 'rgba(5, 10, 18, 0.6)',
              borderRadius: '16px',
              width: 'fit-content',
            }}
          >
            {[
              { label: 'Vision Analysis', done: !isProcessing },
              { label: 'RAG Retrieval (ICAR Codex)', done: !isProcessing },
              { label: 'Risk Reasoning', done: !isProcessing },
              { label: 'CIBRC Safety Validation', done: !isProcessing },
            ].map((st, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  color: st.done ? '#4ade80' : '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'monospace',
                }}
              >
                <span>{st.done ? '✓' : '⟳'}</span>
                <span>{st.label}</span>
              </span>
            ))}
          </div>

          {/* Assistant Structured Response */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #00ff66 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                flexShrink: 0,
              }}
            >
              🌿
            </div>

            <div
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '4px 20px 20px 20px',
                padding: '20px 24px',
                color: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  {current.diagnosis.disease}
                </div>
                <span
                  style={{
                    background: 'rgba(0, 255, 102, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(0, 255, 102, 0.3)',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                  }}
                >
                  {current.diagnosis.confidence} Certainty
                </span>
              </div>

              <p style={{ margin: '0 0 14px', fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Pathogen: {current.diagnosis.pathogen}
              </p>

              {/* Chemical Protocol */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Targeted Chemical Intervention:
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  {current.diagnosis.chemical}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
                  <strong>Dosage:</strong> {current.diagnosis.dosage} • <strong>PHI:</strong> {current.diagnosis.phi}
                </div>
              </div>

              {/* Water Directive */}
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
                💧 <strong>Hydrological Recommendation:</strong> {current.diagnosis.waterDirective}
              </div>

              {/* Launch CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={() => onNavigate?.('assistant')}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #00ff66 100%)',
                    color: '#022c22',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '24px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 255, 102, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <span>Try AgriFusion AI</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
