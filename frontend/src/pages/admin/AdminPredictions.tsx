import { useState, useEffect } from 'react';
import { adminService, type AdminPredictionItem } from '../../api/admin';

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState<AdminPredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getPredictions()
      .then(res => setPredictions(res.predictions))
      .catch(err => console.warn('Predictions fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = predictions.filter(p => {
    if (filterType !== 'ALL' && !p.prediction_type.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (search && !p.user.toLowerCase().includes(search.toLowerCase()) && !p.result.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
          Prediction Activity Monitoring
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Real-time global telemetry stream of farmer requests across crop, disease, yield, and water prediction microservices.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter by user or result..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '240px',
            background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.88rem', outline: 'none',
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'Crop', 'Disease', 'Yield', 'Irrigation', 'Market'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '8px 14px', borderRadius: '8px',
                background: filterType === type ? '#10b981' : 'rgba(255, 255, 255, 0.04)',
                color: filterType === type ? '#022c22' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {type === 'ALL' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '14px 18px' }}>Farmer / User</th>
                <th style={{ padding: '14px 18px' }}>Prediction Type</th>
                <th style={{ padding: '14px 18px' }}>Input Summary</th>
                <th style={{ padding: '14px 18px' }}>Inference Result</th>
                <th style={{ padding: '14px 18px' }}>Confidence</th>
                <th style={{ padding: '14px 18px' }}>Model</th>
                <th style={{ padding: '14px 18px' }}>Timestamp</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading activity...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No matching predictions.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#fff' }}>
                      {p.user}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#38bdf8' }}>
                      {p.prediction_type}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {p.input}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1', fontWeight: 600 }}>
                      {p.result}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)', color: '#86efac',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700,
                      }}>
                        {p.confidence}%
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#a78bfa', fontSize: '0.82rem' }}>
                      {p.model}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.8rem' }}>
                      {p.timestamp}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.78rem' }}>
                        ✓ {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
