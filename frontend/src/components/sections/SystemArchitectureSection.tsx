import { useState } from 'react';

interface ArchTier {
  id: string;
  name: string;
  layer: string;
  components: string[];
  techStack: string;
  throughputOrLatency: string;
  securityAndReliability: string;
  deepDive: string;
}

const ARCH_TIERS: ArchTier[] = [
  {
    id: 'edge',
    name: 'Edge & Client Layer',
    layer: 'Presentation & Edge CDN',
    components: ['Vite 8 Single Page App', 'React 19 Concurrent Mode', 'Three.js WebGL Engine', 'Cloudflare Anycast CDN'],
    techStack: 'TypeScript, WebGL, HTTP/3, Brotli/AVIF',
    throughputOrLatency: '< 45ms Global TTFB',
    securityAndReliability: 'Edge DDoS mitigation, CSP nonce, client-side MIME & 5MB file sanitization',
    deepDive: 'Delivers route-split lazy chunks from edge points-of-presence globally, adapting 3D rendering complexity dynamically based on local device GPU capabilities.',
  },
  {
    id: 'gateway',
    name: 'API Gateway & Security',
    layer: 'Ingress & Traffic Control',
    components: ['Cloudflare WAF', 'Envoy Gateway / NGINX Ingress', 'Token Bucket Rate Limiter', 'JWT & Argon2 Auth'],
    techStack: 'Envoy, Redis Token Bucket, OWASP Top-10 Rules',
    throughputOrLatency: '< 2ms Overhead',
    securityAndReliability: 'IP Throttling (60 req/min/IP), Prompt-Injection Sanitization, mTLS Ingress',
    deepDive: 'Shields internal microservices, verifies cryptographically signed JWT tokens, terminates TLS 1.3, and drops abusive automated scrapers at the edge.',
  },
  {
    id: 'api',
    name: 'FastAPI Microservices',
    layer: 'Core Application Service',
    components: ['FastAPI Uvicorn ASGI Cluster', 'Pydantic v2 Schema Validators', 'X-Request-ID Distributed Tracer'],
    techStack: 'Python 3.11+, AsyncIO, Gunicorn Multi-Worker',
    throughputOrLatency: '22,000 req/sec benchmark capacity',
    securityAndReliability: 'Strict input schemas, sanitized error responses (no leaked stack traces), CORS origin regex',
    deepDive: 'High-throughput asynchronous Python layer orchestrating agricultural domain routes (Crops, Vision, Predictions, Weather, APMC Mandis) with microsecond latency.',
  },
  {
    id: 'orchestration',
    name: 'AI Agent & Task Orchestration',
    layer: 'Autonomous Decision Engine',
    components: ['LangGraph Stateful Agent Graph', 'Celery Asynchronous Task Workers', 'Redis Message Broker'],
    techStack: 'LangGraph, Celery, Redis Streams',
    throughputOrLatency: 'Sub-second multi-step routing',
    securityAndReliability: 'State checkpointing, exponential backoff retries, tool execution sandboxing',
    deepDive: 'Coordinates parallel model queries: dispatches heavy vision tensors to GPU clusters while asynchronously retrieving historical mandi rates and Doppler weather radar.',
  },
  {
    id: 'ai-engines',
    name: 'Specialized AI Inference Engines',
    layer: 'Machine Learning Substrate',
    components: ['YOLOv8-Seg ONNX Runtime GPU', 'XGBoost Yield Ensembles', 'BAAI/bge-large Vectorizer', 'Gemini / Claude LLM Router'],
    techStack: 'PyTorch, TensorRT, Scikit-learn, ONNX Runtime',
    throughputOrLatency: '34ms Vision • 14ms ML • 400ms LLM',
    securityAndReliability: 'Dual-model consensus validation, confidence threshold gates (>85% required for prescription)',
    deepDive: 'Decoupled specialized inference runtimes utilizing hardware acceleration (CUDA/TensorRT) to execute real-time segmentation, yield regression, and grounded reasoning.',
  },
  {
    id: 'data',
    name: 'Distributed Data & Vector Layer',
    layer: 'Persistence & Vector Memory',
    components: ['PostgreSQL Relational DB', 'pgvector / Qdrant Vector Index', 'Redis L2 Semantic Cache', 'MinIO / S3 Object Storage'],
    techStack: 'SQLAlchemy Core, HNSW Cosine Index, Redis Sentinel',
    throughputOrLatency: 'Sub-5ms Cache Hits • Sub-15ms Vector KNN',
    securityAndReliability: 'Automated WAL replication, encrypted at rest (AES-256), point-in-time recovery (PITR)',
    deepDive: 'High-density spatial storage storing raw multi-spectral field rasters in S3, structured farm histories in PostgreSQL, and 85,000+ indexed agronomic research chunks in vector memory.',
  },
  {
    id: 'observability',
    name: 'Observability & Resilience',
    layer: 'Telemetry & SRE Operations',
    components: ['OpenTelemetry Tracing SDK', 'Prometheus Time-Series Metrics', 'Grafana Dashboards', 'Circuit Breakers'],
    techStack: 'OpenTelemetry, Prometheus, Alertmanager',
    throughputOrLatency: 'Continuous real-time telemetry',
    securityAndReliability: 'Automated health endpoints, zero-downtime rolling updates, fallback to client-side agronomic engine',
    deepDive: 'End-to-end request tracing tracking every inference call from user browser to GPU kernel, with automated circuit breakers preventing cascade failures.',
  },
];

export default function SystemArchitectureSection() {
  const [selectedTier, setSelectedTier] = useState<ArchTier>(ARCH_TIERS[2]); // Default to FastAPI

  return (
    <section
      id="section-architecture"
      aria-label="Engineering System Architecture"
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
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>🏗️</span>
          <span>PRODUCTION-GRADE CLOUD ARCHITECTURE</span>
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
          Engineered for Reliability & Scale
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto' }}>
          Explore the resilient, multi-tiered infrastructure powering AgriFusion AI across edge devices,
          asynchronous microservices, and distributed GPU inference clusters.
        </p>
      </div>

      {/* Visual Vertical Pipeline / Architecture Stack */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
          marginBottom: '36px',
        }}
      >
        {ARCH_TIERS.map((tier, idx) => {
          const isSelected = selectedTier.id === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                boxShadow: isSelected ? '0 8px 25px rgba(56, 189, 248, 0.25)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.66rem', color: isSelected ? '#38bdf8' : '#64748b', fontFamily: 'monospace', fontWeight: 800 }}>
                TIER 0{idx + 1}
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 2px' }}>
                {tier.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{tier.layer}</div>
            </div>
          );
        })}
      </div>

      {/* Tier Deep Dive Card */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Tier Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              {selectedTier.layer}
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc' }}>
              {selectedTier.name}
            </h3>
          </div>

          <div
            style={{
              background: 'rgba(5, 10, 18, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '24px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              color: '#38bdf8',
              fontFamily: 'monospace',
            }}
          >
            {selectedTier.throughputOrLatency}
          </div>
        </div>

        {/* Narrative */}
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {selectedTier.deepDive}
        </p>

        {/* 3 Technical Sub-Panels: Components, Tech Stack, Security & Reliability */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Components */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              Active Sub-Components
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedTier.components.map((c, i) => (
                <li key={i} style={{ fontSize: '0.86rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#38bdf8' }}>✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              Underlying Technology Stack
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#00ff66', fontFamily: 'monospace', lineHeight: 1.6 }}>
              {selectedTier.techStack}
            </div>
          </div>

          {/* Security & Reliability */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
            <div style={{ fontSize: '0.72rem', color: '#4ade80', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              Security & High Availability
            </div>
            <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
              {selectedTier.securityAndReliability}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
