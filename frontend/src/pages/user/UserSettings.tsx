import { useState } from 'react';

export default function UserSettings() {
  const [notifications, setNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [highRiskPestAlerts, setHighRiskPestAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
        Farmer Account Settings
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 24px' }}>
        Configure SMS / WhatsApp advisory notifications, agro-meteorological alerts, and language preferences.
      </p>

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
          ✓ Settings successfully saved!
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '28px',
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', color: '#10b981' }}>
          Advisory Notifications & Alerts
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Pest Outbreak Critical Alerts</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Get instant alerts when armyworms or leaf blights are detected nearby</div>
            </div>
            <input
              type="checkbox"
              checked={highRiskPestAlerts}
              onChange={(e) => setHighRiskPestAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Severe Weather Forecast Warnings</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Alerts for unseasonal rainfall, hailstorms, or high heat stress</div>
            </div>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Mandi Price Peak Trend Notifications</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Weekly forecast notification before best market selling windows</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: '11px 24px',
            borderRadius: '10px',
            background: '#10b981',
            color: '#022c22',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
