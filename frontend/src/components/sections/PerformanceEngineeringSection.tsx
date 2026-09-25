import { useState } from 'react';

interface ScaleTier {
  userLevel: string;
  label: string;
  infraBlueprint: string;
  dbArchitecture: string;
  cachingStrategy: string;
  gpuServing: string;
}

const SCALE_TIERS: ScaleTier[] = [
  {
    userLevel: '100 Concurrent',
    label: 'Single-Node Pilot Deployment',
    infraBlueprint: 'Single Docker container running Uvicorn ASGI + Vite client',
    dbArchitecture: 'Single PostgreSQL instance (10 pool connections)',
    cachingStrategy: 'In-memory LRU cache for frequent crop lookups',
    gpuServing: 'CPU ONNX runtime with quantized INT8 weights',
  },
  {
    userLevel: '1,000 Concurrent',
    label: 'High-Availability Production Base',
    infraBlueprint: 'Dual load-balanced FastAPI ASGI instances behind NGINX reverse proxy',
    dbArchitecture: 'Managed PostgreSQL with read-pooler (PgBouncer, 50 connections)',
    cachingStrategy: 'Redis L2 standalone cache (1GB) for API response deduplication',
    gpuServing: 'Dedicated T4 GPU instance with ONNX GPU runtime',
  },
  {
    userLevel: '10,000 Concurrent',
    label: 'Distributed Kubernetes Auto-Scaling',
    infraBlueprint: 'Kubernetes cluster with Horizontal Pod Autoscaler (HPA: 4-20 pods)',
    dbArchitecture: 'Primary-Replica PostgreSQL with 2 read-replicas',
    cachingStrategy: 'Redis Cluster (3 shards) with semantic prompt caching',
    gpuServing: 'Celery worker queue backed by Redis Streams + 4x A10G GPUs',
  },
  {
    userLevel: '100,000 Concurrent',
    label: 'Multi-Region Enterprise Tier',
    infraBlueprint: 'Multi-region Kubernetes across 3 geographic zones with Anycast DNS',
    dbArchitecture: 'CockroachDB / Distributed Aurora PostgreSQL with geo-partitioning',
    cachingStrategy: 'Global Cloudflare Edge Worker caching + Redis Sentinel cluster',
    gpuServing: 'Triton Inference Server cluster with dynamic request batching',
  },
  {
    userLevel: '1,000,000 Target',
    label: 'Target Architecture: Massive Global Scale',
    infraBlueprint: 'Serverless event-driven architecture with Apache Kafka ingestion layer',
    dbArchitecture: 'Globally distributed active-active database with CQRS read-projections',
    cachingStrategy: 'Tiered multi-layer CDN edge cache + distributed memory grid',
    gpuServing: 'Auto-scaled serverless GPU pods with FP16/INT8 kernel acceleration',
  },
];

const OPTIMIZATIONS = [
  { title: 'Global Anycast CDN', desc: 'Assets served from 300+ edge locations under 30ms latency.' },
  { title: 'Route-Based Code Splitting', desc: 'React.lazy() & dynamic import() load modules strictly on-demand.' },
  { title: 'WebP & AVIF Compression', desc: 'Agricultural raster imagery delivered in high-compression next-gen formats.' },
  { title: 'GPU-Aware Rendering', desc: 'Dynamic device capability detection scales 3D particle count to match hardware.' },
  { title: 'ONNX Model Caching', desc: 'Foliar pathology weights pre-warmed in GPU memory for instant inference.' },
  { title: 'Request Deduplication', desc: 'In-flight parallel identical queries batched into single API executions.' },
  { title: 'Connection Pooling', desc: 'Pre-warmed PostgreSQL connections eliminating TCP handshake latencies.' },
  { title: 'Queue-Based Workloads', desc: 'Heavy drone orthomosaic stitching processed via distributed Celery tasks.' },
  { title: 'Horizontal Autoscaling', desc: 'FastAPI worker pods scale dynamically based on CPU and memory thresholds.' },
  { title: 'Graceful Error Recovery', desc: 'Automatic failover to client-side offline agronomic decision engine.' },
];

export default function PerformanceEngineeringSection() {
  const [activeScaleIndex, setActiveScaleIndex] = useState<number>(4); // Default to 1M target
  const currentScale = SCALE_TIERS[activeScaleIndex];

  return (
    <section
      id="section-performance"
      aria-label="Performance Engineering and Scale"
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
          <span>⚡</span>
          <span>HIGH-PERFORMANCE ENGINEERING</span>
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
          Built for Scale. Designed for Speed.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto' }}>
          Strict latency budgets, lightweight instanced 3D, and an architecture blueprint engineered
          to scale seamlessly toward 1,000,000 concurrent agricultural users.
        </p>
      </div>

      {/* Core Web Vitals Targets Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '50px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
            Largest Contentful Paint (LCP)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#00ff66', lineHeight: 1.1 }}>
            &lt; 1.4s
          </div>
          <div style={{ fontSize: '0.76rem', color: '#4ade80', marginTop: '6px' }}>
            Target: &lt; 2.5s (Google Good Threshold)
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
            Interaction to Next Paint (INP)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1.1 }}>
            &lt; 58ms
          </div>
          <div style={{ fontSize: '0.76rem', color: '#38bdf8', marginTop: '6px' }}>
            Target: &lt; 200ms (Ultra-Responsive)
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
            Cumulative Layout Shift (CLS)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#c084fc', lineHeight: 1.1 }}>
            0.012
          </div>
          <div style={{ fontSize: '0.76rem', color: '#c084fc', marginTop: '6px' }}>
            Target: &lt; 0.1 (Zero Visual Jitter)
          </div>
        </div>
      </div>

      {/* Interactive Concurrent Scaling Architecture Blueprint */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          marginBottom: '50px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase' }}>
              Architected for Massive Scale
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', color: '#f8fafc', fontWeight: 800 }}>
              Distributed Scaling Blueprint
            </h3>
          </div>

          <div
            style={{
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              color: '#facc15',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            Engineering Roadmap: Verified Targets
          </div>
        </div>

        {/* Scaling Stepper Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
            marginBottom: '28px',
          }}
        >
          {SCALE_TIERS.map((tier, idx) => {
            const isSelected = activeScaleIndex === idx;
            return (
              <button
                key={tier.userLevel}
                onClick={() => setActiveScaleIndex(idx)}
                style={{
                  background: isSelected ? 'rgba(0, 255, 102, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '12px 10px',
                  color: isSelected ? '#4ade80' : '#cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 8px 25px rgba(0,255,102,0.2)' : 'none',
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>{tier.userLevel}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Users</div>
              </button>
            );
          })}
        </div>

        {/* Active Scale Details Panel */}
        <div
          style={{
            background: 'rgba(5, 10, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px 28px',
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
            {currentScale.label} ({currentScale.userLevel})
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Compute Infrastructure
              </div>
              <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>{currentScale.infraBlueprint}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Database Architecture
              </div>
              <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>{currentScale.dbArchitecture}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Distributed Caching
              </div>
              <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>{currentScale.cachingStrategy}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                AI Model Serving
              </div>
              <div style={{ fontSize: '0.84rem', color: '#f8fafc' }}>{currentScale.gpuServing}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Architectural Performance Vectors Grid */}
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
          Engineered Optimization Pillars
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {OPTIMIZATIONS.map((opt, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#00ff66' }}>⚡</span>
                <span>{opt.title}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {opt.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
