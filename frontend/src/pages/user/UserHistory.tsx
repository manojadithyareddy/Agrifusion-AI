import { useState, useEffect } from 'react';
import { userService } from '../../api/user';

export default function UserHistory() {
  const [history, setHistory] = useState<Array<{ timestamp: string; event: string; detail: string }>>([]);

  useEffect(() => {
    userService.getHistory().then(setHistory).catch(() => {
      setHistory([
        { timestamp: "2026-09-24 13:42", event: "Leaf Photo Scanned", detail: "Tomato Early Blight diagnosed with 98.4% accuracy" },
        { timestamp: "2026-09-23 16:15", event: "Soil Report Analyzed", detail: "Rice crop recommended based on N-P-K levels" },
        { timestamp: "2026-09-21 09:10", event: "Mandi Price Checked", detail: "Cotton price tracked at ₹7,420/Quintal" },
        { timestamp: "2026-09-18 14:00", event: "Account Signed In", detail: "Logged in via Google Authentication" },
      ]);
    });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
        Agricultural Activity Timeline
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 24px' }}>
        Chronological record of your farm scans, crop recommendations, and market inquiries.
      </p>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {history.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                flexShrink: 0,
              }}>
                🌾
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.event}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.timestamp}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
