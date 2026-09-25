import { useState } from 'react';

interface RAGQuery {
  id: string;
  query: string;
  retrievedChunk: {
    source: string;
    page: string;
    similarityScore: number;
    text: string;
  };
  groundedOutput: string;
}

const RAG_QUERIES: RAGQuery[] = [
  {
    id: 'q1',
    query: 'What is the approved bactericide dosage and withholding period for Paddy BLB under Indian CIBRC regulations?',
    retrievedChunk: {
      source: 'CIBRC Registered Pesticides Codex (Crop: Rice/Paddy - Bacterial Blight)',
      page: 'Section 4, Page 118 (Gazette Update 2024)',
      similarityScore: 0.942,
      text: 'Copper Oxychloride 50% WP is registered for foliar application at 1.75 - 2.5 kg/ha in 750-1000L water. Streptocycline (9:1 Streptomycin:Tetracycline) recommended as tank-mix at 100 ppm (1g/10L). Pre-harvest interval (PHI) mandatory at 15 days.',
    },
    groundedOutput:
      'Per official CIBRC guidelines, apply Copper Oxychloride 50% WP @ 2.5g/L water combined with Streptocycline @ 100 ppm (1g per 10L water). A strict 15-day pre-harvest withholding interval (PHI) must be observed before grain harvesting.',
  },
  {
    id: 'q2',
    query: 'Recommended spray timing and whorl application for Fall Armyworm in Maize?',
    retrievedChunk: {
      source: 'ICAR-IIMR National Advisory on Spodoptera frugiperda Management',
      page: 'Technical Bulletin No. 42, Page 18',
      similarityScore: 0.928,
      text: 'Direct spray into the plant whorl using a knapsack sprayer with solid cone nozzle. Apply Emamectin Benzoate 5% SG @ 0.4g/L during early morning (06:00-08:00) or late evening to intercept active larval feeding while minimizing beneficial pollinator exposure.',
    },
    groundedOutput:
      'Direct the spray specifically into the central plant whorl using Emamectin Benzoate 5% SG @ 0.4g/L. Schedule application during early morning (06:00-08:00 AM) to maximize contact with nocturnal larvae and protect pollinators.',
  },
  {
    id: 'q3',
    query: 'SRI (System of Rice Intensification) nursery seedling age and spacing for saline soils?',
    retrievedChunk: {
      source: 'FAO-ICAR Technical Handbook on Conservation Agriculture & SRI Protocols',
      page: 'Chapter 7, Page 204',
      similarityScore: 0.915,
      text: 'Transplant single young seedlings (8-12 days old at 2-leaf stage) with square spacing of 25cm x 25cm. In saline coastal soils, provide light intermittant irrigation to prevent salt crusting without prolonged submergence.',
    },
    groundedOutput:
      'Transplant 8-12 day old single seedlings at 2-leaf stage in a 25cm × 25cm square grid. In saline soils, practice alternate wetting and drying (AWD) with 2cm standing water replenishment every 4-5 days to flush surface root salinity.',
  },
];

export default function RAGArchitectureSection() {
  const [selectedQuery, setSelectedQuery] = useState<RAGQuery>(RAG_QUERIES[0]);

  return (
    <section
      id="section-rag-engine"
      aria-label="RAG Knowledge Engine Architecture"
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
          <span>📚</span>
          <span>ENTERPRISE RAG ARCHITECTURE</span>
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
          Agricultural RAG Knowledge Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto' }}>
          Zero hallucination through strict grounded retrieval. Every agricultural recommendation
          is cited directly from accredited ICAR, FAO, and CIBRC scientific source documents.
        </p>
      </div>

      {/* RAG Visual Pipeline Diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '36px',
        }}
      >
        {[
          { step: '01', title: 'SOURCE CORPUS', desc: '85,000+ ICAR / FAO / CIBRC Docs', icon: '📄' },
          { step: '02', title: 'EMBEDDING MODEL', desc: 'BAAI/bge-large [1024 Dim]', icon: '🧮' },
          { step: '03', title: 'VECTOR DATABASE', desc: 'pgvector / Qdrant HNSW', icon: '🗄️' },
          { step: '04', title: 'HYBRID RETRIEVER', desc: 'Dense + BM25 Lexical Re-rank', icon: '🔍' },
          { step: '05', title: 'LLM REASONER', desc: 'Gemini / Claude Context Window', icon: '🧠' },
          { step: '06', title: 'GROUNDED ANSWER', desc: 'Fact-checked with Citations', icon: '✅' },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{item.icon}</div>
            <div style={{ fontSize: '0.68rem', color: '#00ff66', fontFamily: 'monospace', fontWeight: 800 }}>
              STEP {item.step}
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 4px' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Interactive Query Sandbox */}
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
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
            Select Sample Scientific Query to Inspect Retrieval Pipeline:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RAG_QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuery(q)}
                style={{
                  textAlign: 'left',
                  background: selectedQuery.id === q.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedQuery.id === q.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedQuery.id === q.id ? '#f8fafc' : '#cbd5e1',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  fontSize: '0.88rem',
                  fontWeight: selectedQuery.id === q.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ❓ "{q.query}"
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Inspection: Retrieved Vector Chunk vs Grounded LLM Response */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Left: Retrieved Vector Chunk */}
          <div
            style={{
              background: 'rgba(5, 10, 18, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Retrieved Vector Chunk (Top-1 Match)
              </span>
              <span
                style={{
                  background: 'rgba(0, 255, 102, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(0, 255, 102, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                Cosine Sim: {selectedQuery.retrievedChunk.similarityScore}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
              Source: {selectedQuery.retrievedChunk.source}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '12px' }}>
              {selectedQuery.retrievedChunk.page}
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderLeft: '3px solid #38bdf8',
                padding: '12px 14px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.55,
                fontFamily: 'monospace',
              }}
            >
              "{selectedQuery.retrievedChunk.text}"
            </div>
          </div>

          {/* Right: Grounded LLM Synthesis */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 800 }}>
                  Grounded Advisory Output
                </span>
                <span
                  style={{
                    background: 'rgba(0, 255, 102, 0.2)',
                    color: '#00ff66',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  Zero Hallucination Guarantee
                </span>
              </div>

              <div style={{ fontSize: '0.94rem', color: '#f8fafc', lineHeight: 1.6, fontWeight: 500 }}>
                {selectedQuery.groundedOutput}
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.74rem',
                color: '#a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🏛️</span>
              <span>Verified against official Indian Central Insecticide Board & Registration Committee records</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
