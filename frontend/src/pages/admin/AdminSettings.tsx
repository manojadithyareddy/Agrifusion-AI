import { useState } from 'react';

export default function AdminSettings() {
  const [modelFallback, setModelFallback] = useState(true);
  const [strictAuth, setStrictAuth] = useState(true);
  const [rateLimit, setRateLimit] = useState(120);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
          Cluster System Configuration
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Manage global API rate limits, model fallback rules, and authentication security policies.
        </p>
      </div>

      {saved && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          color: '#86efac',
          fontSize: '0.9rem',
          marginBottom: '20px',
        }}>
          ✓ System configurations updated across all nodes!
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Automated Model Failover</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Automatically route vision requests to OpenCV heuristic engine if GPU load exceeds 90%</div>
            </div>
            <input
              type="checkbox"
              checked={modelFallback}
              onChange={(e) => setModelFallback(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Strict Role Authorization Verification</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Enforce dual JWT claim verification on all administrative REST routes</div>
            </div>
            <input
              type="checkbox"
              checked={strictAuth}
              onChange={(e) => setStrictAuth(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Global API Rate Limit (requests / min / IP)</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Threshold before throttling anonymous public requests</div>
            </div>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              style={{
                width: '90px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px', padding: '8px', color: '#fff', textAlign: 'center', fontWeight: 700,
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: '28px', padding: '12px 28px', borderRadius: '10px',
            background: '#10b981', color: '#022c22', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
          }}
        >
          Save System Configuration
        </button>
      </div>
    </div>
  );
}
