import { useState, useEffect } from 'react';
import { adminService, type AdminModelItem } from '../../api/admin';

export default function AdminModels() {
  const [models, setModels] = useState<AdminModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ modelId: string; data: any } | null>(null);
  const [selectedModel, setSelectedModel] = useState<AdminModelItem | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await adminService.getModels();
      setModels(res);
    } catch (err) {
      console.warn('Using baseline model list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggle = async (m: AdminModelItem) => {
    try {
      await adminService.toggleModel(m.id);
      setModels(prev => prev.map(item => item.id === m.id ? { ...item, status: item.status === 'active' ? 'paused' : 'active' } : item));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle model state.');
    }
  };

  const handleRunTest = async (m: AdminModelItem) => {
    setTestingModelId(m.id);
    setTestResult(null);
    try {
      const res = await adminService.testModel(m.id);
      setTestResult({ modelId: m.id, data: res });
    } catch (err: any) {
      alert(err.message || 'Benchmark inference test failed.');
    } finally {
      setTestingModelId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
          AI & ML Model Governance
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Manage deployed neural networks, computer vision classifiers, and regression engines across the cluster.
        </p>
      </div>

      {/* Models Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
      }}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Loading AI model registry...</div>
        ) : (
          models.map((m) => (
            <div
              key={m.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                      {m.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                      {m.type} • {m.version}
                    </div>
                  </div>

                  <span style={{
                    background: m.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: m.status === 'active' ? '#86efac' : '#fbbf24',
                    border: `1px solid ${m.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {m.status}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Algorithm:</span>
                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{m.algorithm}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Verified Accuracy:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{m.accuracy}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>P95 Latency:</span>
                    <span style={{ color: '#cbd5e1' }}>{m.latency_ms} ms</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>API Status:</span>
                    <span style={{ color: '#86efac' }}>{m.api_status}</span>
                  </div>
                </div>

                {/* Inline test benchmark result if just tested */}
                {testResult && testResult.modelId === m.id && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '14px',
                    fontSize: '0.78rem',
                    color: '#86efac',
                  }}>
                    ✓ Benchmark Test Passed! Latency: {testResult.data.latency_ms}ms • Confidence: {testResult.data.inference_output?.confidence}%
                  </div>
                )}
              </div>

              {/* Actions toolbar */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => setSelectedModel(m)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  View Details
                </button>

                <button
                  onClick={() => handleRunTest(m)}
                  disabled={testingModelId === m.id}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {testingModelId === m.id ? 'Testing...' : '⚡ Test Model'}
                </button>

                <button
                  onClick={() => handleToggle(m)}
                  style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: m.status === 'active' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    color: m.status === 'active' ? '#fca5a5' : '#86efac',
                    border: `1px solid ${m.status === 'active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {m.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setSelectedModel(null)}>
          <div style={{
            maxWidth: '520px', width: '100%', background: '#0e1624',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{selectedModel.name}</h3>
              <button
                onClick={() => setSelectedModel(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Detailed architectural specs, hyperparameters, and production routing status.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', fontSize: '0.85rem' }}>
              <div style={{ marginBottom: '8px' }}><span style={{ color: '#94a3b8' }}>ID:</span> <code style={{ color: '#38bdf8' }}>{selectedModel.id}</code></div>
              <div style={{ marginBottom: '8px' }}><span style={{ color: '#94a3b8' }}>Algorithm:</span> {selectedModel.algorithm}</div>
              <div style={{ marginBottom: '8px' }}><span style={{ color: '#94a3b8' }}>Supported Crops:</span> {selectedModel.supported_crops} crops</div>
              <div style={{ marginBottom: '8px' }}><span style={{ color: '#94a3b8' }}>Last Deployed:</span> {selectedModel.last_updated}</div>
              <div><span style={{ color: '#94a3b8' }}>Runtime Container:</span> FastAPI Microservice + ONNX/PyTorch Engine</div>
            </div>
            <button
              onClick={() => setSelectedModel(null)}
              style={{
                marginTop: '20px', width: '100%', padding: '10px',
                borderRadius: '8px', background: '#10b981', color: '#022c22', border: 'none', fontWeight: 800, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
