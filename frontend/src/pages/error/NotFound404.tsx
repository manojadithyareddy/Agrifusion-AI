import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NotFound404() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 30%, #111a24 0%, #050a11 100%)',
      color: '#fff',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px 32px',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#10b981', letterSpacing: '-2px', margin: 0 }}>
          404
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '12px 0 8px' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 28px' }}>
          The agricultural intelligence screen you are looking for does not exist or has been relocated.
        </p>
        <button
          onClick={handleReturn}
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            background: '#10b981',
            color: '#022c22',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          }}
        >
          ➔ Return to Safety
        </button>
      </div>
    </div>
  );
}
