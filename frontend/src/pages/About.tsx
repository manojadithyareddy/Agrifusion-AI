import { useScrollReveal } from '../hooks/useScrollReveal';

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  const techStack = [
    { layer: 'Frontend', tech: 'React 19, TypeScript, Vite 8', icon: '⚛️' },
    { layer: 'Backend', tech: 'FastAPI, SQLAlchemy (async), PostgreSQL', icon: '⚡' },
    { layer: 'ML/AI', tech: 'XGBoost, LightGBM, scikit-learn, YOLOv8', icon: '🧠' },
    { layer: 'RAG/LLM', tech: 'LangChain, pgvector, OpenAI / Gemini', icon: '🤖' },
    { layer: 'Queue', tech: 'ARQ + Redis (async background tasks)', icon: '📦' },
    { layer: 'Infra', tech: 'Docker Compose, Nginx, GitHub Actions CI', icon: '🐳' },
    { layer: 'Auth', tech: 'JWT (python-jose) + bcrypt + RBAC', icon: '🔐' },
    { layer: 'I18n', tech: 'English, Hindi, Kannada, Telugu', icon: '🌐' },
  ];

  const capabilities = [
    { value: '6', label: 'AI Models', desc: 'Crop, Yield, Climate, Irrigation, Market, Revenue' },
    { value: '4', label: 'Input Modalities', desc: 'Image, Text, Structured Data, Geospatial' },
    { value: '28+', label: 'States Covered', desc: 'Weather + government scheme data' },
    { value: '4', label: 'Languages', desc: 'Multilingual support for rural India' },
  ];

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', padding: '120px 40px 80px' }}>
      {/* Header */}
      <RevealSection>
        <div style={{ marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)',
            borderRadius: '40px', padding: '8px 20px', fontSize: '0.8rem', fontWeight: 600,
            color: '#4ade80', marginBottom: '20px',
          }}>
            ℹ️ About the Project
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
            background: 'linear-gradient(135deg, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.15, marginBottom: '24px',
          }}>
            AgriFusion AI
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '700px' }}>
            AgriFusion AI is a multimodal agriculture intelligence platform that combines machine learning,
            computer vision, natural language processing, and real-time data sources to help Indian farmers
            make informed, data-driven decisions across every phase of the farming cycle.
          </p>
        </div>
      </RevealSection>

      {/* Mission */}
      <RevealSection>
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
          padding: '40px', marginBottom: '60px',
          borderLeft: '4px solid #4ade80',
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>🎯 Mission</h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
            Bridge the information gap between agricultural research and farmers on the ground.
            Deliver actionable, AI-powered insights — crop recommendations, disease detection,
            weather advisories, irrigation scheduling, and market intelligence — through an
            accessible, multilingual interface designed for rural India.
          </p>
        </div>
      </RevealSection>

      {/* Platform Capabilities — Honest Metrics */}
      <RevealSection>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '30px' }}>Platform Capabilities</h2>
      </RevealSection>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '60px' }}>
        {capabilities.map((c, i) => (
          <RevealSection key={c.label} delay={i * 0.08}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
              padding: '28px', textAlign: 'center',
            }}>
              <div style={{
                fontSize: '2rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #00ff66, #00e1ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
              }}>
                {c.value}
              </div>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{c.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>{c.desc}</div>
            </div>
          </RevealSection>
        ))}
      </div>

      {/* Technology Stack */}
      <RevealSection>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '30px' }}>Technology Stack</h2>
      </RevealSection>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '60px' }}>
        {techStack.map((t, i) => (
          <RevealSection key={t.layer} delay={i * 0.06}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
              <div>
                <div style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.layer}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '2px' }}>{t.tech}</div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>

      {/* Architecture Principles */}
      <RevealSection>
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
          padding: '40px', marginBottom: '60px',
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>🏗️ Architecture Principles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { title: 'Async First', desc: 'FastAPI with async SQLAlchemy for non-blocking I/O.' },
              { title: 'Separation of Concerns', desc: 'Router → Service → ML Engine layered architecture.' },
              { title: 'Graceful Degradation', desc: 'Features degrade to placeholder mode when API keys are missing.' },
              { title: 'Honest AI', desc: 'No fabricated statistics. Placeholder models return explicit status.' },
              { title: 'Multilingual', desc: 'Custom i18n provider with fallback to English.' },
              { title: 'Docker-ready', desc: 'Full Docker Compose stack for one-command deployment.' },
            ].map((p) => (
              <div key={p.title}>
                <h4 style={{ color: '#4ade80', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Disclaimer */}
      <RevealSection>
        <div style={{
          background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '16px', padding: '24px', fontSize: '0.85rem', color: '#fbbf24',
          lineHeight: 1.7,
        }}>
          ⚠️ <strong>Disclaimer:</strong> AgriFusion AI is a decision-support tool, not a replacement for
          professional agronomic advice. AI predictions are estimates based on available data and models.
          Actual results may vary due to local conditions. Always consult your local Krishi Vigyan Kendra (KVK)
          or agricultural extension officer for critical decisions.
        </div>
      </RevealSection>
    </div>
  );
}
