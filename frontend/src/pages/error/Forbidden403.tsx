import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Forbidden403() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #151d28 0%, #060a10 100%)',
      color: '#fff',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(239, 68, 68, 0.05)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Shield Icon */}
        <div style={{
          width: '84px',
          height: '84px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)',
        }}>
          🛡️
        </div>

        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '20px',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          HTTP 403 • FORBIDDEN
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px', color: '#fff' }}>
          Access Restricted
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 24px' }}>
          You do not have permission to access the <strong>AgriFusion AI Admin Console</strong>.
          Your current account (<span style={{ color: '#38bdf8' }}>{user?.email}</span>) is assigned the standard role{' '}
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: 700,
          }}>
            USER
          </span>.
          Administrative privileges can only be granted via backend authorization.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            🌾 Return to AgriFusion Home
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            🔒 Sign In as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
