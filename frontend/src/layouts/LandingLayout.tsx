import { type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LeafCursorFX from '../components/LeafCursorFX';

interface LandingLayoutProps {
  children: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
  currentHomeBg?: string;
  currentPredictionBg?: string;
}

export default function LandingLayout({
  children,
  activePage = 'home',
  onNavigate,
  currentHomeBg = '/hero-cinematic-agri.jpg',
  currentPredictionBg = '/backgrounds/sustainable_journey.jpg',
}: LandingLayoutProps) {
  const routerNavigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic Navigation Items: About followed by Sign In (unauthenticated) or Profile & Admin (authenticated)
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'predictions', label: 'AI Prediction' },
    { id: 'market', label: 'Market Insights' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'about', label: 'About' },
    ...(isAuthenticated
      ? [
          { id: 'profile', label: 'Profile' },
          ...(user?.role === 'ADMIN' ? [{ id: 'admin', label: '🛡️ Admin' }] : []),
        ]
      : [{ id: 'signin', label: 'Sign In' }]),
  ];

  const handleNavigate = (page: string) => {
    if (page === 'signin') {
      routerNavigate('/login');
    } else if (page === 'profile') {
      routerNavigate('/profile');
    } else if (page === 'admin') {
      routerNavigate('/admin/dashboard');
    } else {
      onNavigate?.(page);
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const getPillStyle = (id: string): React.CSSProperties => {
    const isActive = activePage === id;
    return isActive
      ? {
          color: '#fff', fontWeight: 600, fontSize: '0.85rem',
          padding: '10px 24px', borderRadius: '30px',
          background: 'radial-gradient(circle, rgba(0,255,102,0.4) 0%, rgba(0,255,102,0) 100%)',
          boxShadow: 'inset 0 0 20px rgba(0,255,102,0.2)',
          border: '1px solid rgba(0,255,102,0.3)', cursor: 'pointer',
        }
      : {
          color: '#cbd5e1', fontWeight: 500, fontSize: '0.85rem',
          padding: '10px 24px', transition: 'color 0.2s', cursor: 'pointer',
          border: '1px solid transparent', borderRadius: '30px', background: 'transparent',
        };
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', background: '#050a11', color: '#fff' }}>
      {/* ── Interactive Green Leaf Cursor & Click Ripple FX ── */}
      <LeafCursorFX />

      {/* Dynamic Page-by-Page & Section-by-Section 3D Perspective Background Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Home page: Dynamic scroll-responsive cinematic agricultural backgrounds */}
        {activePage === 'home' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
              key={currentHomeBg}
              style={{
                position: 'absolute',
                inset: '-25px',
                backgroundImage: `url(${currentHomeBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                filter: 'brightness(0.78) contrast(1.12) saturate(1.15)',
                animation: 'kenBurnsPan 32s ease-in-out infinite alternate, bgCrossFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />
            {/* Atmospheric overlay with dark gradient on top and bottom matching reference */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(2, 18, 10, 0.72) 0%, rgba(2, 18, 10, 0.25) 30%, rgba(2, 18, 10, 0.45) 60%, rgba(2, 18, 10, 0.96) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 20% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }} />
          </div>
        )}

        {/* Prediction, Disease & Profile pages: Dynamic background based on active prediction model & selected crop */}
        {(activePage === 'predictions' || activePage === 'disease' || activePage === 'profile') && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
              key={currentPredictionBg}
              style={{
                position: 'absolute',
                inset: '-25px',
                backgroundImage: `url(${currentPredictionBg || '/backgrounds/sustainable_journey.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                filter: 'brightness(0.68) contrast(1.15) saturate(1.15)',
                animation: 'kenBurnsPan 32s ease-in-out infinite alternate, bgCrossFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(2, 18, 10, 0.82) 0%, rgba(3, 20, 12, 0.45) 40%, rgba(2, 18, 10, 0.94) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.18) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }} />
          </div>
        )}

        {/* Market page: Authentic Bustling APMC Mandi Warehouse + 3D Isometric Digital Grid */}
        {activePage === 'market' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src="/backgrounds/mandi_market.jpg"
              alt="AgriFusion AI APMC Mandi Market"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 45%',
                filter: 'brightness(0.55) contrast(1.18) saturate(1.1)',
                transform: 'scale(1.03)',
                animation: 'kenBurnsPan 30s ease-in-out infinite alternate, bgCrossFade 0.85s ease-out forwards',
              }}
            />
            {/* Animated 3D Isometric Grid Floor */}
            <div style={{
              position: 'absolute',
              inset: '-50%',
              backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) translateY(120px)',
              transformOrigin: 'center bottom',
              animation: 'marketGridMove 20s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(3, 20, 10, 0.82) 0%, rgba(3, 20, 10, 0.45) 40%, rgba(3, 20, 10, 0.95) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
            }} />
          </div>
        )}

        {/* Assistant page: Futuristic Smart Agricultural Research Laboratory */}
        {activePage === 'assistant' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src="/backgrounds/smart_agri_lab.jpg"
              alt="AgriFusion AI Smart Research Lab"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                filter: 'brightness(0.35) contrast(1.22) saturate(1.2)',
                transform: 'scale(1.03)',
                animation: 'kenBurnsPan 30s ease-in-out infinite alternate, bgCrossFade 0.85s ease-out forwards',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(2, 18, 10, 0.85) 0%, rgba(5, 20, 15, 0.72) 45%, rgba(10, 15, 20, 0.96) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 65% 25%, rgba(16, 185, 129, 0.18) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }} />
          </div>
        )}

        {/* About page: Ultra-HD Satellite Earth River Delta Overview */}
        {activePage === 'about' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src="/backgrounds/satellite_earth.jpg"
              alt="AgriFusion AI Satellite River Delta Overview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                filter: 'brightness(0.65) contrast(1.2) saturate(1.15)',
                transform: 'scale(1.03)',
                animation: 'kenBurnsPan 35s ease-in-out infinite alternate, bgCrossFade 0.85s ease-out forwards',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(3, 15, 10, 0.82) 0%, rgba(3, 15, 10, 0.45) 40%, rgba(3, 15, 10, 0.95) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: '-30px',
              backgroundImage: 'radial-gradient(rgba(74,222,128,0.18) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.4,
              animation: 'satellitePulse 12s ease-in-out infinite alternate',
            }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes bgCrossFade {
          0% { opacity: 0; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes marketGridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(40px); }
        }
        @keyframes satellitePulse {
          0% { transform: scale(1.0) rotate(0deg); }
          100% { transform: scale(1.08) rotate(2deg); }
        }
        @keyframes kenBurnsPan {
          0% { transform: scale(1.02) translate(0, 0); }
          50% { transform: scale(1.06) translate(-1%, -1%); }
          100% { transform: scale(1.02) translate(0, 0); }
        }
      `}</style>

      {/* ─── Top Navigation Bar ─── */}
      <header
        role="banner"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '15px 40px',
          background: scrolled ? 'rgba(5, 10, 17, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'background 0.3s, backdrop-filter 0.3s',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => handleNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label="Go to homepage"
          onKeyDown={(e) => e.key === 'Enter' && handleNavigate('home')}
        >
          <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(0,255,102,0.5))' }}>🌿</div>
          <div>
            <div style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              AgriFusion <span style={{ color: '#4ade80' }}>AI</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '1.5px', color: '#cbd5e1', textTransform: 'uppercase' }}>
              SMART FARMING • BETTER DECISIONS
            </p>
          </div>
        </div>

        {/* Primary Pill Navigation — Desktop */}
        <nav
          aria-label="Primary navigation"
          className="desktop-nav"
          style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '5px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              style={{ ...getPillStyle(item.id), background: activePage === item.id ? getPillStyle(item.id).background : 'transparent' }}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA + Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isAuthenticated ? (
            <button
              onClick={() => routerNavigate('/signup')}
              className="desktop-nav"
              style={{
                background: '#86efac',
                color: '#022c22',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '30px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(134,239,172,0.4)',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Get Started <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>➔</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => routerNavigate('/admin/dashboard')}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🛡️ Admin Panel
                </button>
              )}
              <div
                onClick={() => routerNavigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <img
                  src={user?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Farmer'}`}
                  alt="Avatar"
                  style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #10b981' }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
                  {user?.name?.split(' ')[0] || 'Farmer'}
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: user?.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                  color: user?.role === 'ADMIN' ? '#fca5a5' : '#86efac',
                  fontWeight: 700,
                }}>
                  {user?.role === 'ADMIN' ? 'ADMIN' : 'FARMER'}
                </span>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  routerNavigate('/login');
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px',
              width: '44px', height: '44px', cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu Overlay ─── */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(5, 10, 17, 0.95)', backdropFilter: 'blur(30px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '20px',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => { e.stopPropagation(); handleNavigate(item.id); }}
              style={{
                background: activePage === item.id ? 'rgba(0,255,102,0.15)' : 'transparent',
                border: activePage === item.id ? '1px solid rgba(0,255,102,0.3)' : '1px solid rgba(255,255,255,0.1)',
                color: activePage === item.id ? '#4ade80' : '#fff',
                padding: '18px 50px', borderRadius: '16px', fontSize: '1.2rem',
                fontWeight: activePage === item.id ? 700 : 500,
                cursor: 'pointer', width: '280px', textAlign: 'center',
                transition: 'all 0.2s',
              }}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
          {!isAuthenticated ? (
            <button
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); routerNavigate('/signup'); }}
              style={{
                marginTop: '10px', background: '#86efac', color: '#022c22', border: 'none',
                padding: '16px 40px', borderRadius: '30px', fontWeight: 800, fontSize: '1.05rem',
                cursor: 'pointer', width: '280px',
              }}
            >
              Get Started ➔
            </button>
          ) : (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
                await logout();
                routerNavigate('/login');
              }}
              style={{
                marginTop: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)', padding: '14px 40px',
                borderRadius: '30px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', width: '280px',
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      )}

      {/* ─── Main Content ─── */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </main>

      {/* ─── Premium Footer (Hidden on assistant page for full-height ChatGPT immersion) ─── */}
      {activePage !== 'assistant' && (
        <footer role="contentinfo" style={{ position: 'relative', zIndex: 1, background: '#03060a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 40px 40px' }}>
        <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌿</div>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 5px', color: '#fff' }}>AgriFusion AI</h2>
            <p style={{ color: '#00ff66', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600 }}>SMART FARMING • BETTER DECISIONS</p>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Multimodal agriculture intelligence & decision agent helping farmers make data-driven decisions with AI.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700 }}>AI Prediction</h4>
            <FooterLink text="Crop Recommendation" onClick={() => handleNavigate('predictions')} />
            <FooterLink text="Disease Detection" onClick={() => handleNavigate('predictions')} />
            <FooterLink text="Yield Forecast" onClick={() => handleNavigate('predictions')} />
            <FooterLink text="Climate Risk" onClick={() => handleNavigate('predictions')} />
            <FooterLink text="Irrigation Advice" onClick={() => handleNavigate('predictions')} />
            <FooterLink text="Revenue & Profit" onClick={() => handleNavigate('predictions')} />
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700 }}>Market Insights</h4>
            <FooterLink text="Live Mandi Rates" onClick={() => handleNavigate('market')} />
            <FooterLink text="Price Trends" onClick={() => handleNavigate('market')} />
            <FooterLink text="e-NAM APMC Bids" onClick={() => handleNavigate('market')} />
            <FooterLink text="State Mandis" onClick={() => handleNavigate('market')} />
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700 }}>AI Assistant</h4>
            <FooterLink text="Agrifusion Chatbot" onClick={() => handleNavigate('assistant')} />
            <FooterLink text="Multimodal Diagnosis" onClick={() => handleNavigate('assistant')} />
            <FooterLink text="Voice Agro Advisory" onClick={() => handleNavigate('assistant')} />
            <FooterLink text="About Platform" onClick={() => handleNavigate('about')} />
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700 }}>Resources</h4>
            <FooterLink text="Documentation" href="/docs" external />
            <FooterLink text="API Schema (OpenAPI)" href="/openapi.json" external />
            <FooterLink text="GitHub Repository" href="https://github.com" external />
            <FooterLink text="About AgriFusion" onClick={() => handleNavigate('about')} />
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '16px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b' }}>Disclaimer:</strong> AI-generated predictions are decision-support information and should not replace professional agricultural advice.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '30px auto 0', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', flexWrap: 'wrap', gap: '10px' }}>
          <p>© {new Date().getFullYear()} AgriFusion AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Built for farmers, powered by Multimodal AI</span>
          </div>
        </div>
      </footer>
      )}

      {/* ─── Responsive Styles ─── */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-only { display: none !important; }

        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          header { padding: 12px 20px !important; }
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FooterLink({ text, onClick, href, external }: { text: string; onClick?: () => void; href?: string; external?: boolean }) {
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={{ display: 'block', color: '#a0aec0', textDecoration: 'none', marginBottom: '12px', fontSize: '0.9rem', transition: 'color 0.2s' }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#00ff66')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#a0aec0')}
      >
        {text}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      style={{ display: 'block', color: '#a0aec0', background: 'none', border: 'none', padding: 0, marginBottom: '12px', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s', textAlign: 'left' }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#00ff66')}
      onMouseOut={(e) => (e.currentTarget.style.color = '#a0aec0')}
    >
      {text}
    </button>
  );
}
