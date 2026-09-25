import { useState } from 'react';

interface TechItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  latencyOrStat: string;
  description: string;
}

const TECHNOLOGIES: TechItem[] = [
  {
    id: 'cv',
    name: 'Computer Vision',
    category: 'Perception',
    spec: 'YOLOv8 + Vision Transformer (ViT)',
    latencyOrStat: '98.4% mAP50',
    description: 'Real-time foliar pathology segmentation, canopy chlorosis detection, and pest count quantification on raw drone & smartphone feeds.',
  },
  {
    id: 'yolo',
    name: 'YOLO Instance Segmentation',
    category: 'Edge Vision',
    spec: 'ONNX Runtime GPU TensorRT',
    latencyOrStat: '34ms latency',
    description: 'Sub-40ms spatial bounding box and polygon contour extraction for fungal necrotic lesions and insect egg clusters.',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'Agronomic Models',
    spec: 'XGBoost & LightGBM Ensembles',
    latencyOrStat: '96.2% F1 Score',
    description: 'Trained on 45,000+ national multi-season agricultural trial records across 28 states and diverse agro-climatic zones.',
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    category: 'Neural Networks',
    spec: 'ResNet-50 + Temporal 1D-CNN',
    latencyOrStat: '1.4M parameters',
    description: 'Multi-layer neural architectures fusing NDVI multi-spectral time-series data with soil moisture decay curves.',
  },
  {
    id: 'nlp',
    name: 'NLP & Multilingual Speech',
    category: 'Farmer Interface',
    spec: 'Whisper + Indic-BERT Fine-tuned',
    latencyOrStat: '14 Indian Dialects',
    description: 'Natural vernacular voice & text understanding enabling vernacular farmers to converse in Hindi, Telugu, Marathi, Tamil, and English.',
  },
  {
    id: 'rag',
    name: 'RAG Knowledge Engine',
    category: 'Grounded Retrieval',
    spec: 'pgvector + BAAI/bge-large',
    latencyOrStat: '85,000+ Agri Docs',
    description: 'Indexed ICAR manuals, FAO extension circulars, CIBRC pesticide registries, and state university package of practices.',
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'Advisory Synthesis',
    spec: 'Gemini 2.5 Flash + Claude 3.5 Sonnet',
    latencyOrStat: 'Zero-Hallucination Guard',
    description: 'Constrained synthesis engines generating farmer-friendly, scientifically validated pesticide and fertilization recommendations.',
  },
  {
    id: 'agents',
    name: 'Autonomous AI Agents',
    category: 'Decision Orchestration',
    spec: 'Stateful LangGraph Agentic Loops',
    latencyOrStat: 'Multi-Tool Calling',
    description: 'Self-reflective agents executing diagnosis, telemetry retrieval, risk estimation, and economic feasibility checks sequentially.',
  },
  {
    id: 'fastapi',
    name: 'FastAPI Backend',
    category: 'API Engine',
    spec: 'Uvicorn ASGI + Pydantic v2',
    latencyOrStat: '22,000 req/sec',
    description: 'Asynchronous, high-throughput Python API layer with strict schema validation, request tracing, and OpenAPI documentation.',
  },
  {
    id: 'python',
    name: 'Python Ecosystem',
    category: 'Core Runtime',
    spec: 'Python 3.11+ Optimized Wheels',
    latencyOrStat: 'NumPy / PyTorch / SciPy',
    description: 'High-performance scientific computing foundation powering mathematical crop modeling, evapotranspiration, and matrix algebra.',
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure',
    category: 'Distributed Scale',
    spec: 'Edge CDN + Redis L2 + Kubernetes',
    latencyOrStat: '99.95% SLA Target',
    description: 'Global anycast distribution, distributed Celery worker queues, Redis semantic caching, and auto-scaling compute clusters.',
  },
];

export default function TechnologyTrustStrip() {
  const [activeTech, setActiveTech] = useState<TechItem>(TECHNOLOGIES[0]);

  return (
    <section
      aria-label="Enterprise AI Technology Stack"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '60px 40px 80px',
        maxWidth: '1320px',
        margin: '0 auto',
      }}
    >
      {/* Decorative Neural Circuit Line Across the Top */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 102, 0.4) 25%, rgba(56, 189, 248, 0.5) 50%, rgba(0, 255, 102, 0.4) 75%, transparent 100%)',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            left: '48%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#00ff66',
            boxShadow: '0 0 12px #00ff66',
          }}
        />
      </div>

      {/* Tech Stack Heading */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#4ade80',
            marginBottom: '8px',
          }}
        >
          ENTERPRISE-GRADE AI ARSENAL
        </p>
        <h3
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
            fontWeight: 800,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Proven AI Infrastructure Built for Agricultural Complexity
        </h3>
      </div>

      {/* Interactive Neural Nodes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        {TECHNOLOGIES.map((tech) => {
          const isSelected = activeTech.id === tech.id;
          return (
            <div
              key={tech.id}
              onClick={() => setActiveTech(tech)}
              style={{
                background: isSelected ? 'rgba(16, 185, 129, 0.16)' : 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(16px)',
                border: isSelected ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 8px 25px rgba(0,255,102,0.2)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Subtle top indicator bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: isSelected ? 'linear-gradient(90deg, #00ff66, #38bdf8)' : 'transparent',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.66rem', color: isSelected ? '#4ade80' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {tech.category}
                </span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSelected ? '#00ff66' : '#64748b',
                    boxShadow: isSelected ? '0 0 6px #00ff66' : 'none',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                {tech.name}
              </div>

              <div style={{ fontSize: '0.74rem', color: isSelected ? '#a7f3d0' : '#64748b', fontFamily: 'monospace' }}>
                {tech.latencyOrStat}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Technology Deep Dive Callout */}
      <div
        style={{
          background: 'rgba(10, 18, 28, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '20px',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(0, 255, 102, 0.15)',
                color: '#4ade80',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.74rem',
                fontWeight: 800,
                border: '1px solid rgba(0, 255, 102, 0.3)',
              }}
            >
              {activeTech.category.toUpperCase()}
            </span>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>
              {activeTech.name}
            </h4>
            <span style={{ fontSize: '0.84rem', color: '#38bdf8', fontFamily: 'monospace' }}>
              [{activeTech.spec}]
            </span>
          </div>

          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.6 }}>
            {activeTech.description}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(5, 10, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 24px',
            textAlign: 'center',
            minWidth: '180px',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
            Benchmark Metric
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00ff66' }}>
            {activeTech.latencyOrStat}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Production Verified</div>
        </div>
      </div>
    </section>
  );
}
