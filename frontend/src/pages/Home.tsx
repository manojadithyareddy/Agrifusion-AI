import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface HomeProps {
  onNavigate?: (page: string) => void;
  onBgChange?: (bgUrl: string) => void;
}

/* ─────────────────────────────────────────────
   SECTION: Scroll Reveal Wrapper
   ───────────────────────────────────────────── */
function RevealSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION: Reusable section title
   ───────────────────────────────────────────── */
function SectionTitle({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)',
        borderRadius: '40px', padding: '8px 20px', fontSize: '0.8rem', fontWeight: 600,
        color: '#4ade80', marginBottom: '20px', letterSpacing: '0.5px',
      }}>
        {badge}
      </div>
      <h2 style={{
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1.2, marginBottom: '16px',
      }}>
        {title}
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
        {subtitle}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION: Glass Card
   ───────────────────────────────────────────── */
function GlassCard({ children, style = {}, hover = true }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '32px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
          : '0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════════
   MAIN HOME COMPONENT (Scroll-Responsive Background)
   ═════════════════════════════════════════════ */
export default function Home({ onNavigate, onBgChange }: HomeProps) {
  useEffect(() => {
    let lastBg = '';

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      const sections = [
        { id: 'section-hero', bg: '/hero-cinematic-agri.jpg' },
        { id: 'section-models', bg: '/backgrounds/golden_harvest.jpg' },
        { id: 'section-how-it-works', bg: '/backgrounds/precision_farming.jpg' },
        { id: 'section-live-farm', bg: '/backgrounds/iot_sensor_field.jpg' },
        { id: 'section-multimodal', bg: '/backgrounds/smart_agri_lab.jpg' },
        { id: 'section-assistant', bg: '/backgrounds/farmer_advisor.jpg' },
        { id: 'section-disease', bg: '/backgrounds/leaf_pathology.jpg' },
        { id: 'section-irrigation', bg: '/backgrounds/smart_irrigation.jpg' },
        { id: 'section-market', bg: '/backgrounds/mandi_market.jpg' },
        { id: 'section-dashboard', bg: '/backgrounds/greenhouse_tech.jpg' },
        { id: 'section-rag', bg: '/backgrounds/satellite_earth.jpg' },
        { id: 'section-journey', bg: '/backgrounds/sustainable_journey.jpg' },
        { id: 'section-technical', bg: '/backgrounds/vertical_farming.jpg' },
        { id: 'section-final-cta', bg: '/backgrounds/sunrise_horizon.jpg' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          if (sections[i].bg !== lastBg) {
            lastBg = sections[i].bg;
            onBgChange?.(sections[i].bg);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onBgChange]);

  return (
    <div>
      <div id="section-hero"><HeroSection onNavigate={onNavigate} /></div>
      <div id="section-models"><AIPredictionShowcase onNavigate={onNavigate} /></div>
      <div id="section-how-it-works"><HowItWorks /></div>
      <div id="section-live-farm"><LiveFarmIntelligence /></div>
      <div id="section-multimodal"><MultimodalAISection /></div>
      <div id="section-assistant"><AIAssistantSection onNavigate={onNavigate} /></div>
      <div id="section-disease"><CropDiseaseIntelligence /></div>
      <div id="section-irrigation"><PrecisionIrrigation /></div>
      <div id="section-market"><MarketIntelligence onNavigate={onNavigate} /></div>
      <div id="section-dashboard"><FarmDashboardPreview /></div>
      <div id="section-rag"><RAGArchitecture /></div>
      <div id="section-journey"><FarmJourney onNavigate={onNavigate} /></div>
      <div id="section-technical"><TechnicalImpact /></div>
      <div id="section-final-cta"><FinalCTA onNavigate={onNavigate} /></div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   §1  HERO
   ═════════════════════════════════════════════ */
const HERO_CROPS = [
  { id: 'rice', name: 'Rice', img: '/crops/rice.jpg', suitability: '96%', color: '#fef08a' },
  { id: 'maize', name: 'Maize', img: '/crops/maize.jpg', suitability: '92%', color: '#facc15' },
  { id: 'cotton', name: 'Cotton', img: '/crops/cotton.jpg', suitability: '88%', color: '#f8fafc' },
  { id: 'mango', name: 'Mango', img: '/crops/mango.jpg', suitability: '94%', color: '#fb923c' },
  { id: 'chili', name: 'Chili', img: '/crops/chili.jpg', suitability: '89%', color: '#ef4444' },
  { id: 'soybean', name: 'Soybean', img: '/crops/soybean.jpg', suitability: '91%', color: '#fde047' },
];

function HeroSection({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '120px 40px 40px',
      overflow: 'hidden',
    }}>
      {/* Hero Headline & Intro */}
      <div style={{ maxWidth: '850px', zIndex: 2 }}>
        <h1 style={{
          fontSize: 'clamp(2.8rem, 6.5vw, 5rem)',
          fontWeight: 900,
          lineHeight: 1.08,
          margin: '0 0 20px',
          letterSpacing: '-1px',
        }}>
          <span style={{
            color: '#4ade80',
            textShadow: '0 0 35px rgba(74, 222, 128, 0.45)',
            display: 'inline-block',
          }}>
            Predict
          </span>
          <br />
          <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Plan</span>
          <br />
          <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Harvest More</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          lineHeight: 1.55,
          color: '#e2e8f0',
          maxWidth: '560px',
          margin: '0 0 32px',
          fontWeight: 400,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          AI models for multiple crops.<br />
          Better planning. Higher profits.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button
            onClick={() => onNavigate?.('predictions')}
            style={{
              background: 'linear-gradient(135deg, #00ff66 0%, #10b981 100%)',
              color: '#050a11', border: 'none', padding: '15px 34px', borderRadius: '40px',
              fontWeight: 800, fontSize: '1.02rem', cursor: 'pointer',
              boxShadow: '0 6px 28px rgba(0,255,102,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,255,102,0.6)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,255,102,0.4)'; }}
          >
            Explore AI Predictions <span>→</span>
          </button>
          <button
            onClick={() => onNavigate?.('assistant')}
            style={{
              background: 'rgba(5, 20, 10, 0.65)', backdropFilter: 'blur(12px)',
              color: '#fff', border: '1px solid rgba(74,222,128,0.3)',
              padding: '15px 32px', borderRadius: '40px', fontWeight: 600,
              fontSize: '1.02rem', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00ff66'; e.currentTarget.style.background = 'rgba(0,255,102,0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'; e.currentTarget.style.background = 'rgba(5, 20, 10, 0.65)'; }}
          >
            Talk to AI Assistant <span>💬</span>
          </button>
        </div>
      </div>

      {/* ─── Bottom 6 Crop Cards (Reference Replica) ─── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1200px',
        margin: '20px auto 0',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
        }}>
          {HERO_CROPS.map((crop) => {
            const isHovered = hoveredCrop === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => onNavigate?.('predictions')}
                onMouseEnter={() => setHoveredCrop(crop.id)}
                onMouseLeave={() => setHoveredCrop(null)}
                style={{
                  background: isHovered
                    ? 'rgba(7, 36, 18, 0.88)'
                    : 'rgba(5, 24, 12, 0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: isHovered
                    ? '1.5px solid rgba(74, 222, 128, 0.8)'
                    : '1px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '18px',
                  padding: '12px 10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? '0 15px 35px -5px rgba(0, 255, 102, 0.35), inset 0 0 15px rgba(74, 222, 128, 0.15)'
                    : '0 8px 24px rgba(0, 0, 0, 0.45)',
                }}
              >
                {/* Crop Image Container */}
                <div style={{
                  width: '100%',
                  height: '84px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  background: 'rgba(2, 18, 10, 0.5)',
                  padding: '4px',
                }}>
                  <img
                    src={crop.img}
                    alt={crop.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 8px rgba(74,222,128,0.4))' : 'brightness(1.0)',
                      transition: 'transform 0.3s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  />
                </div>

                {/* Crop Name */}
                <span style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  letterSpacing: '0.4px',
                  marginTop: '10px',
                  textAlign: 'center',
                }}>
                  {crop.name}
                </span>

                {/* Suitability Metric Badge */}
                <span style={{
                  color: isHovered ? '#4ade80' : '#86efac',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  marginTop: '4px',
                  opacity: 0.9,
                }}>
                  Suitability {crop.suitability}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §2  AI CAPABILITY CARDS (8 Core Models)
   ═════════════════════════════════════════════ */
const CAPABILITY_CARDS = [
  {
    icon: '🌾',
    title: 'Crop Recommendation',
    desc: 'Scientific crop recommendation evaluating soil NPK, pH, rainfall, temperature, and seasonal suitability.',
    aiIndicator: 'ML / XGBoost',
    color: '#22c55e',
    route: 'crop-recommendation',
  },
  {
    icon: '🔬',
    title: 'Disease & Pest Detection',
    desc: 'Deep learning computer vision for leaf lesion classification, pathogen diagnosis, and treatment guidance.',
    aiIndicator: 'YOLOv8 / CV',
    color: '#06b6d4',
    route: 'disease-detection',
  },
  {
    icon: '📊',
    title: 'Yield Prediction',
    desc: 'Forecast expected crop output per acre based on historical climate, irrigation method, and soil type.',
    aiIndicator: 'LightGBM Regression',
    color: '#3b82f6',
    route: 'yield-prediction',
  },
  {
    icon: '💧',
    title: 'Irrigation Advisory',
    desc: 'Precision irrigation scheduling based on crop growth stage, evapotranspiration, and water stress level.',
    aiIndicator: 'Water Stress Index',
    color: '#0ea5e9',
    route: 'irrigation-prediction',
  },
  {
    icon: '⚠️',
    title: 'Climate Risk Prediction',
    desc: 'Early warning evaluation for drought, flood, excessive rainfall, and extreme heatwave hazards.',
    aiIndicator: 'Climate Analytics',
    color: '#f59e0b',
    route: 'predictions',
  },
  {
    icon: '📈',
    title: 'Market Price Prediction',
    desc: 'Live APMC mandi price forecasting, historical price direction trends, and optimal selling windows.',
    aiIndicator: 'Time-Series ML',
    color: '#a855f7',
    route: 'market',
  },
  {
    icon: '💰',
    title: 'Revenue & Profit Calculator',
    desc: 'Interactive farm economics: calculate total production, operational expenses, net profit, and ROI.',
    aiIndicator: 'Financial Engine',
    color: '#ec4899',
    route: 'predictions',
  },
  {
    icon: '🤖',
    title: 'AI Agriculture Assistant',
    desc: 'Multimodal conversational agronomy agent powered by Google Gemini 1.5 Flash and agricultural RAG.',
    aiIndicator: 'Gemini RAG Agent',
    color: '#10b981',
    route: 'assistant',
  },
];

function AIPredictionShowcase({ onNavigate }: { onNavigate?: (p: string) => void }) {
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="🧠 Agriculture Intelligence"
          title="Agriculture Intelligence Models"
          subtitle="Select an intelligence model below. Every model provides actionable, farmer-friendly recommendations."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px', maxWidth: '1250px', margin: '0 auto' }}>
        {CAPABILITY_CARDS.map((m, i) => (
          <RevealSection key={m.title} delay={i * 0.06}>
            <GlassCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${m.color}18`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.6rem',
                  border: `1px solid ${m.color}30`,
                }}>
                  {m.icon}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px',
                  borderRadius: '20px', letterSpacing: '0.5px',
                  background: 'rgba(0,255,102,0.1)',
                  color: '#4ade80',
                  border: '1px solid rgba(0,255,102,0.25)',
                }}>
                  {m.aiIndicator}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{m.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 20px', minHeight: '64px' }}>{m.desc}</p>
              <button
                onClick={() => onNavigate?.(m.route)}
                style={{
                  background: 'none', border: `1px solid ${m.color}50`,
                  color: m.color, padding: '9px 22px', borderRadius: '25px', fontSize: '0.82rem',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = `${m.color}20`; e.currentTarget.style.boxShadow = `0 0 15px ${m.color}40`; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Explore →
              </button>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §3  HOW IT WORKS
   ═════════════════════════════════════════════ */
const PIPELINE_STEPS = [
  { step: '01', icon: '🌱', title: 'Farm Data', desc: 'Real-time collection of soil NPK, pH, moisture, local weather, and high-resolution crop photos.' },
  { step: '02', icon: '🧠', title: 'AI Analysis', desc: 'Deep learning vision, feature engineering, and agronomic neural networks analyze farm indicators.' },
  { step: '03', icon: '📊', title: 'Prediction', desc: 'Quantitative forecast of crop suitability, harvest yield, water requirement, and climate risks.' },
  { step: '04', icon: '📋', title: 'Recommendation', desc: 'Science-backed actionable guidance: optimal sowing dates, precision fertilizer dosage, and IPM sprays.' },
  { step: '05', icon: '🎯', title: 'Decision', desc: 'Empowered farmer takes profitable, risk-minimized decisions with maximum harvest potential.' },
];

function HowItWorks() {
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.35)' }}>
      <RevealSection>
        <SectionTitle
          badge="⚡ Connected Intelligence Journey"
          title="How AgriFusion AI Works"
          subtitle="From raw farm inputs to optimal harvest decisions — an animated, transparent 5-stage pipeline."
        />
      </RevealSection>

      {/* Horizontal Connected Journey on Desktop */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 40px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px', background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)', border: '1px solid rgba(0,255,102,0.2)',
          borderRadius: '24px', padding: '24px 32px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
        }}>
          {['Farm Data', 'AI Analysis', 'Prediction', 'Recommendation', 'Decision'].map((stage, idx, arr) => (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(0,255,102,0.15)', color: '#4ade80',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.85rem', border: '1px solid rgba(0,255,102,0.3)',
                }}>
                  {idx + 1}
                </span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{stage}</span>
              </div>
              {idx < arr.length - 1 && (
                <span style={{ color: '#4ade80', fontSize: '1.2rem', opacity: 0.7, padding: '0 4px' }}>
                  ➔
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute', left: '36px', top: '40px', bottom: '40px',
          width: '2px', background: 'linear-gradient(to bottom, rgba(0,255,102,0.6), rgba(16,185,129,0.2))',
        }} />

        {PIPELINE_STEPS.map((s, i) => (
          <RevealSection key={s.step} delay={i * 0.1}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', marginBottom: '40px', position: 'relative' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', flexShrink: 0,
                background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', zIndex: 2, boxShadow: '0 0 20px rgba(0,255,102,0.15)',
              }}>
                {s.icon}
                <span style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 800 }}>{s.step}</span>
              </div>
              <div style={{ paddingTop: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §4  LIVE FARM INTELLIGENCE (Simulated)
   ═════════════════════════════════════════════ */
function LiveFarmIntelligence() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const simMetrics = [
    { label: 'Soil Moisture', value: '62%', icon: '💧', color: '#3b82f6' },
    { label: 'Crop Health Index', value: '0.81', icon: '🌿', color: '#22c55e' },
    { label: 'Pest Risk', value: 'Low', icon: '🐛', color: '#f59e0b' },
    { label: 'Temperature', value: '31°C', icon: '🌡️', color: '#ef4444' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="📡 Live Dashboard"
          title="Farm Intelligence at a Glance"
          subtitle="This is a preview of the real-time farm dashboard. All values shown below are simulated for demonstration purposes."
        />
      </RevealSection>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* SIMULATED DATA LABEL */}
        <div style={{
          textAlign: 'center', marginBottom: '24px', padding: '8px 20px',
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600,
          margin: '0 auto 24px', width: 'fit-content',
        }}>
          ⚠️ SIMULATED DATA — Not connected to live sensors. Last rendered: {time.toLocaleTimeString('en-IN')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {simMetrics.map((m) => (
            <RevealSection key={m.label}>
              <GlassCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{m.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>{m.label}</div>
              </GlassCard>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §5  MULTIMODAL AI
   ═════════════════════════════════════════════ */
function MultimodalAISection() {
  const modalities = [
    { icon: '📷', label: 'Image Analysis', desc: 'Upload crop photos for disease and pest detection using YOLOv8 computer vision.' },
    { icon: '🗣️', label: 'Natural Language', desc: 'Ask farming questions in plain language — powered by RAG + LLM for context-aware answers.' },
    { icon: '📊', label: 'Structured Data', desc: 'Input soil, weather, and crop data for ML-powered predictions and recommendations.' },
    { icon: '🌍', label: 'Geospatial', desc: 'Location-aware analysis using geocoding and regional agricultural patterns.' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.3)' }}>
      <RevealSection>
        <SectionTitle
          badge="🔀 Multimodal"
          title="Multiple Data Types, One Platform"
          subtitle="AgriFusion AI processes images, text, structured data, and location information to deliver comprehensive agricultural intelligence."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {modalities.map((m, i) => (
          <RevealSection key={m.label} delay={i * 0.1}>
            <GlassCard style={{ textAlign: 'center', padding: '40px 28px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px',
                background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              }}>
                {m.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{m.label}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §6  AI ASSISTANT / AI AGENT
   ═════════════════════════════════════════════ */
function AIAssistantSection({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const sampleConvo = [
    { role: 'user', text: 'My rice leaves are turning yellow. What should I do?' },
    { role: 'ai', text: 'Yellowing in rice leaves can indicate nitrogen deficiency or iron chlorosis. Check soil pH — if above 7.5, apply ferrous sulphate (20 kg/acre). For nitrogen deficiency, apply urea in split doses. Also check for water stagnation which can cause root suffocation.' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="🤖 AI Agent"
          title="Your Personal Farming Assistant"
          subtitle="Ask questions in natural language. The RAG-powered assistant retrieves answers from agricultural knowledge bases and responds with actionable advice."
        />
      </RevealSection>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
              <span style={{ color: '#fff', fontWeight: 600 }}>AgriFusion AI Agent</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>RAG + LangChain + pgvector</span>
          </div>

          {/* Messages */}
          <div style={{ padding: '24px' }}>
            {sampleConvo.map((msg, i) => (
              <div key={i} style={{
                marginBottom: '16px',
                display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '12px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                  background: msg.role === 'user' ? 'rgba(59,130,246,0.2)' : 'rgba(0,255,102,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                }}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{
                  background: msg.role === 'user' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (msg.role === 'user' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)'),
                  borderRadius: '16px', padding: '14px 18px', maxWidth: '85%',
                  color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <button
              onClick={() => onNavigate?.('assistant')}
              style={{
                background: 'linear-gradient(135deg, #00ff66, #00e1ff)', color: '#050a11',
                border: 'none', padding: '12px 32px', borderRadius: '30px',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              }}
            >
              Open AI Assistant →
            </button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §7  CROP & DISEASE INTELLIGENCE
   ═════════════════════════════════════════════ */
function CropDiseaseIntelligence() {
  const diseases = [
    { crop: 'Rice', disease: 'Blast', pathogen: 'Magnaporthe oryzae', severity: 'High', icon: '🌾' },
    { crop: 'Tomato', disease: 'Late Blight', pathogen: 'Phytophthora infestans', severity: 'High', icon: '🍅' },
    { crop: 'Wheat', disease: 'Rust', pathogen: 'Puccinia striiformis', severity: 'Medium', icon: '🌿' },
    { crop: 'Cotton', disease: 'Bollworm', pathogen: 'Helicoverpa armigera', severity: 'High', icon: '🌸' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.3)' }}>
      <RevealSection>
        <SectionTitle
          badge="🔬 Vision AI"
          title="Crop Disease Intelligence"
          subtitle="Upload plant images for AI-powered disease detection. The YOLOv8 model identifies diseases across major Indian crops."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {diseases.map((d, i) => (
          <RevealSection key={d.disease} delay={i * 0.08}>
            <GlassCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.8rem' }}>{d.icon}</span>
                <div>
                  <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{d.crop}</h4>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem' }}>{d.disease}</p>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                <strong style={{ color: '#cbd5e1' }}>Pathogen:</strong> <em>{d.pathogen}</em>
              </div>
              <span style={{
                display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: '20px', letterSpacing: '0.5px',
                background: d.severity === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
                color: d.severity === 'High' ? '#f87171' : '#fbbf24',
                border: `1px solid ${d.severity === 'High' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
              }}>
                {d.severity} Severity
              </span>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §8  PRECISION IRRIGATION
   ═════════════════════════════════════════════ */
function PrecisionIrrigation() {
  const factors = [
    { icon: '🌡️', label: 'Temperature', desc: 'High temps (>35°C) with low rainfall triggers immediate irrigation alerts.' },
    { icon: '💧', label: 'Soil Moisture', desc: 'Water balance calculation using recent + forecast rainfall data.' },
    { icon: '🌧️', label: 'Rainfall Forecast', desc: 'Delays irrigation if >20mm rainfall is expected in next 48 hours.' },
    { icon: '🌱', label: 'Growth Stage', desc: 'Irrigation recommendations adapt to crop growth phases.' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="💧 Irrigation"
          title="Precision Irrigation Advisory"
          subtitle="Rule-based irrigation recommendations considering temperature, humidity, rainfall, and crop water requirements."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {factors.map((f, i) => (
          <RevealSection key={f.label} delay={i * 0.08}>
            <GlassCard style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>{f.label}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §9  MARKET INTELLIGENCE
   ═════════════════════════════════════════════ */
function MarketIntelligence({ onNavigate }: { onNavigate?: (p: string) => void }) {
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.3)' }}>
      <RevealSection>
        <SectionTitle
          badge="📈 Market"
          title="Market Intelligence & Pricing"
          subtitle="Market price predictions and government scheme matching to help farmers maximize revenue."
        />
      </RevealSection>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <RevealSection>
          <GlassCard style={{ borderTop: '3px solid #a855f7' }}>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>💰 Price Forecasting</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Predict mandi prices for your crop based on historical data and regional trends.
              Get optimal selling window recommendations.
            </p>
            <p style={{ color: '#fbbf24', fontSize: '0.78rem', marginTop: '12px', fontStyle: 'italic' }}>
              Note: Price model is currently in placeholder mode — requires Agmarknet training data.
            </p>
            <button onClick={() => onNavigate?.('market')} style={{ marginTop: '16px', background: 'none', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7', padding: '8px 20px', borderRadius: '25px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              View Market →
            </button>
          </GlassCard>
        </RevealSection>

        <RevealSection delay={0.1}>
          <GlassCard style={{ borderTop: '3px solid #22c55e' }}>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>🏛️ Government Schemes</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Auto-matched to your farm profile. Covers PM-KISAN, PM Fasal Bima Yojana,
              Soil Health Card Scheme, PMKSY, and state-level programs.
            </p>
            <p style={{ color: '#4ade80', fontSize: '0.78rem', marginTop: '12px' }}>
              ✅ Loaded from verified government data sources.
            </p>
          </GlassCard>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §10  FARM DASHBOARD PREVIEW
   ═════════════════════════════════════════════ */
function FarmDashboardPreview() {
  const dashItems = [
    { icon: '🌾', label: 'Active Crops', value: '—', sub: 'Connect farm to start' },
    { icon: '🧪', label: 'Soil Reports', value: '—', sub: 'Run soil analysis' },
    { icon: '📋', label: 'Predictions', value: '—', sub: 'No predictions yet' },
    { icon: '💬', label: 'AI Queries', value: '—', sub: 'Ask the assistant' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="📱 Dashboard"
          title="Your Farm Command Center"
          subtitle="A personalized dashboard tracking all your farming activities, predictions, and AI interactions in one place."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {dashItems.map((d, i) => (
          <RevealSection key={d.label} delay={i * 0.08}>
            <GlassCard style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{d.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{d.value}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>{d.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '6px' }}>{d.sub}</div>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §11  RAG + GENAI ARCHITECTURE
   ═════════════════════════════════════════════ */
function RAGArchitecture() {
  const archLayers = [
    { icon: '📄', title: 'Knowledge Ingestion', desc: 'Agricultural documents → chunked → embedded (text-embedding-3-small) → stored in pgvector.' },
    { icon: '🔍', title: 'Semantic Retrieval', desc: 'Farmer query → embedded → similarity search → top-4 relevant chunks retrieved.' },
    { icon: '🧠', title: 'LLM Reasoning', desc: 'Retrieved context + query → LLM generates factual, actionable answer with source attribution.' },
    { icon: '💾', title: 'Conversation Memory', desc: 'All queries and responses are stored per-user for continuity and analytics.' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.3)' }}>
      <RevealSection>
        <SectionTitle
          badge="🏗️ Architecture"
          title="RAG + GenAI + AI Agent"
          subtitle="The Retrieval-Augmented Generation pipeline powering the AgriFusion AI Assistant."
        />
      </RevealSection>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {archLayers.map((l, i) => (
          <RevealSection key={l.title} delay={i * 0.1}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(0,255,102,0.1), rgba(0,225,255,0.1))',
                border: '1px solid rgba(0,255,102,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
              }}>
                {l.icon}
              </div>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700 }}>{l.title}</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>{l.desc}</p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §12  END-TO-END FARM JOURNEY
   ═════════════════════════════════════════════ */
function FarmJourney({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const journey = [
    { icon: '🌱', title: 'Plan', desc: 'AI recommends best crops for your soil, season, and location.', page: 'predictions' },
    { icon: '🌾', title: 'Grow', desc: 'Monitor weather, get irrigation advice, detect diseases early.', page: 'predictions' },
    { icon: '🛡️', title: 'Protect', desc: 'Climate risk alerts and pest/disease management guidance.', page: 'predictions' },
    { icon: '📈', title: 'Sell', desc: 'Market price predictions and government scheme matching.', page: 'market' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
      <RevealSection>
        <SectionTitle
          badge="🗺️ Journey"
          title="End-to-End Farm Support"
          subtitle="AgriFusion AI supports every phase of the farming cycle — from planning to selling."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {journey.map((j, i) => (
          <RevealSection key={j.title} delay={i * 0.1}>
            <GlassCard style={{ textAlign: 'center', padding: '40px 28px', cursor: 'pointer' }} hover>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{j.icon}</div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{j.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 16px' }}>{j.desc}</p>
              <button
                onClick={() => onNavigate?.(j.page)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#4ade80', padding: '6px 18px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Explore →
              </button>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §13  TECHNICAL IMPACT
   ═════════════════════════════════════════════ */
function TechnicalImpact() {
  const metrics = [
    { value: '6', label: 'AI Prediction Models', desc: 'Crop, Yield, Climate, Irrigation, Market, Revenue' },
    { value: '4', label: 'Input Modalities', desc: 'Image, Text, Structured Data, Geospatial' },
    { value: '<1s', label: 'API Response Target', desc: 'Async FastAPI with connection pooling' },
    { value: '4', label: 'Languages', desc: 'English, Hindi, Kannada, Telugu' },
    { value: '100+', label: 'Crop Diseases', desc: 'In YOLOv8 training dataset (PlantVillage)' },
    { value: '28+', label: 'Indian States', desc: 'Weather + scheme coverage' },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', background: 'rgba(0,0,0,0.3)' }}>
      <RevealSection>
        <SectionTitle
          badge="📊 Metrics"
          title="Platform Capabilities"
          subtitle="Honest, verifiable technical metrics — no fabricated statistics."
        />
      </RevealSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {metrics.map((m, i) => (
          <RevealSection key={m.label} delay={i * 0.06}>
            <GlassCard style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px',
                background: 'linear-gradient(135deg, #00ff66, #00e1ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {m.value}
              </div>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>{m.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{m.desc}</div>
            </GlassCard>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════
   §14  FINAL CTA
   ═════════════════════════════════════════════ */
function FinalCTA({ onNavigate }: { onNavigate?: (p: string) => void }) {
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '120px 40px', textAlign: 'center' }}>
      <RevealSection>
        <div style={{
          maxWidth: '800px', margin: '0 auto', padding: '80px 40px',
          background: 'rgba(0,255,102,0.03)', border: '1px solid rgba(0,255,102,0.1)',
          borderRadius: '32px', backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
            background: 'linear-gradient(135deg, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '20px', lineHeight: 1.2,
          }}>
            Ready to Transform Your Farm?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '550px', margin: '0 auto 40px' }}>
            Start making data-driven farming decisions today with AI-powered predictions, real-time weather, and expert agricultural guidance.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate?.('predictions')}
              style={{
                background: 'linear-gradient(135deg, #00ff66, #00e1ff)', color: '#050a11',
                border: 'none', padding: '18px 44px', borderRadius: '40px',
                fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,255,102,0.4)',
              }}
            >
              Get Started Free →
            </button>
            <button
              onClick={() => onNavigate?.('assistant')}
              style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)', padding: '18px 44px',
                borderRadius: '40px', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer',
              }}
            >
              Try AI Assistant
            </button>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
