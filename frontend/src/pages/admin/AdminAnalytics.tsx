
export default function AdminAnalytics() {
  const regionalActivity = [
    { state: 'Maharashtra', scans: 14200, topCrop: 'Soybean & Cotton' },
    { state: 'Punjab', scans: 12100, topCrop: 'Wheat & Rice' },
    { state: 'Telangana', scans: 9800, topCrop: 'Cotton & Chilli' },
    { state: 'Uttar Pradesh', scans: 8900, topCrop: 'Sugarcane & Potato' },
    { state: 'Gujarat', scans: 7400, topCrop: 'Groundnut & Cotton' },
    { state: 'Karnataka', scans: 6500, topCrop: 'Maize & Ragi' },
  ];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
          Deep System Analytics & Geographic Telemetry
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
          Regional distribution of farmers, inference compute density, and seasonal crop query clusters.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Regional Crop Advisory Demand</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {regionalActivity.map((r) => (
              <div key={r.state}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{r.state}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{r.scans.toLocaleString()} scans ({r.topCrop})</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(r.scans / 15000) * 100}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>GPU & Compute Infrastructure</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Inference Engine:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>OpenCV 5.0 + FastAPI UVLoop</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>P99 Inference Latency:</span>
              <span style={{ color: '#86efac', fontWeight: 700 }}>168 ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Database Engine:</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Async SQLite / PostgreSQL AsyncPG</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ color: '#94a3b8' }}>Active Session Cache:</span>
              <span style={{ color: '#fff' }}>Redis v7.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
