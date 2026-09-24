import { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/crop-recommendation', label: 'Crop Recommendation', icon: '🌱' },
    { path: '/disease-detection', label: 'Disease Detection', icon: '🦠' },
    { path: '/yield-prediction', label: 'Yield Prediction', icon: '📈' },
    { path: '/irrigation-prediction', label: 'Irrigation Prediction', icon: '💧' },
    { path: '/market-price', label: 'Market Price', icon: '💰' },
    { path: '/ai-assistant', label: 'AI Agri Assistant', icon: '🤖' },
    { path: '/predictions', label: 'My Predictions', icon: '📋' },
    { path: '/history', label: 'History', icon: '🕘' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#090e17',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
    }}>
      {/* ── Left Sidebar (Desktop) ── */}
      <aside style={{
        width: '260px',
        background: '#0c1421',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }} className="desktop-sidebar">
        {/* Brand */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }} onClick={() => navigate('/dashboard')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          }}>
            🌱
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
              AgriFusion <span style={{ color: '#10b981' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Farmer Dashboard
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <img
              src={user?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Farmer'}`}
              alt="Avatar"
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.4)' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Farmer Friend'}
              </div>
              <div style={{ fontSize: '0.72rem', color: user?.role === 'ADMIN' ? '#f87171' : '#10b981', fontWeight: 600 }}>
                Role: {user?.role || 'USER'}
              </div>
            </div>
          </div>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              🛡️ Admin Panel
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px',
          background: 'rgba(12, 20, 33, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}>
          {/* Mobile hamburger button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#fff',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              ☰
            </button>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#cbd5e1' }}>
              🌾 AgriFusion Decision Intelligence
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/ai-assistant')}
              style={{
                background: location.pathname.includes('assistant') ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#86efac',
                padding: '7px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🤖 Open AI Assistant
            </button>

            <button
              onClick={() => navigate('/profile')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img
                src={user?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Farmer'}`}
                alt="Avatar"
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }} className="user-nav-name">
                {user?.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>
          </div>
        </header>

        {/* Content Body: Zero padding when in Assistant for full ChatGPT immersion */}
        <main style={{
          flex: 1,
          padding: location.pathname.includes('assistant') ? '0' : '24px',
          overflowY: location.pathname.includes('assistant') ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            width: '270px',
            height: '100%',
            background: '#0c1421',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontWeight: 800, color: '#fff' }}>AgriFusion AI</div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: location.pathname === item.path ? '#10b981' : '#94a3b8',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .user-nav-name {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
