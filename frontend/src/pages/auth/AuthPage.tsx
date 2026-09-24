import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordReset } from '../../lib/supabase';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export default function AuthPage({ initialMode = 'signin' }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle, demoLogin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up only states
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResult, setForgotResult] = useState<{ message: string; reset_token?: string } | null>(null);

  // Destination after login
  const from = (location.state as any)?.from?.pathname;

  const handleRoleRedirect = (role: 'USER' | 'ADMIN') => {
    if (from && from !== '/login' && from !== '/signup' && from !== '/dashboard') {
      navigate(from, { replace: true });
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const { role } = await login({ email, password, remember_me: rememberMe });
      handleRoleRedirect(role);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('unreachable')) {
        setErrorMsg('Authentication server is offline. Please use the 1-Click Demo accounts below.');
      } else {
        setErrorMsg(msg || 'Incorrect email or password. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy to create your account.');
      return;
    }

    setLoading(true);
    try {
      // NOTE: Default role is strictly USER; admin can never be self-assigned.
      const { role } = await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
        phone: phone.trim() || undefined,
        terms_accepted: termsAccepted,
      });
      handleRoleRedirect(role);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('unreachable')) {
        setErrorMsg('Registration service is currently offline. You can test immediately using the 1-Click Demo accounts.');
      } else {
        setErrorMsg(msg || 'Registration failed. An account with this email may already exist.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleClick = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { role } = await loginWithGoogle();
      handleRoleRedirect(role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Account 1-Click Login
  const handleDemoClick = async (targetRole: 'ADMIN' | 'USER') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { role } = await demoLogin(targetRole);
      handleRoleRedirect(role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password submit
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await sendPasswordReset(forgotEmail);
      setForgotResult({
        message: 'Password reset link dispatched to your email address.',
        reset_token: 'supabase-dispatched',
      });
    } catch (err: any) {
      setForgotResult({
        message: err.message || 'Password reset instructions dispatched to your email address.',
        reset_token: 'demo-token-12345',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // Password strength score (0-4)
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getPasswordStrength(password);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #0d1927 0%, #04080e 100%)',
      color: '#fff',
      padding: '30px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
    }}>
      {/* Background ambient agricultural glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(15, 23, 36, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '36px 32px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo & Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}>
              🌱
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
              AgriFusion <span style={{ color: '#10b981' }}>AI</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px', color: '#fff', letterSpacing: '-0.3px' }}>
            Welcome to AgriFusion AI
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            AI-powered intelligence for smarter agriculture.
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'signin' ? '#10b981' : 'transparent',
              color: mode === 'signin' ? '#022c22' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'signup' ? '#10b981' : 'transparent',
              color: mode === 'signup' ? '#022c22' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Method A: Large Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            background: '#ffffff',
            color: '#1f2937',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            marginBottom: '20px',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {/* Official Google 'G' icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 600 }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#86efac',
            fontSize: '0.85rem',
            marginBottom: '18px',
          }}>
            {successMsg}
          </div>
        )}

        {/* Method B: Email & Password Form */}
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Email Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '11px 14px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {mode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Phone Number <span style={{ color: '#64748b' }}>(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotResult(null); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  paddingRight: '42px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: 0,
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password strength meter for Sign Up */}
            {mode === 'signup' && password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        borderRadius: '2px',
                        background:
                          strength >= step
                            ? strength <= 2
                              ? '#f59e0b'
                              : '#10b981'
                            : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: strength < 2 ? '#f59e0b' : '#10b981' }}>
                  {strength < 2 ? 'Weak password (add letters, numbers, symbols)' : 'Strong password'}
                </div>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Confirm Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${confirmPassword && confirmPassword !== password ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '10px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              {confirmPassword && confirmPassword !== password && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                  Passwords do not match
                </div>
              )}
            </div>
          )}

          {/* Remember Me (Sign In) or Terms Checkbox (Sign Up) */}
          {mode === 'signin' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#10b981', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                Remember this device for 30 days
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ accentColor: '#10b981', marginTop: '3px', cursor: 'pointer' }}
                required
              />
              <label htmlFor="terms" style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, cursor: 'pointer' }}>
                I agree to the <span style={{ color: '#10b981' }}>Terms of Service</span> and <span style={{ color: '#10b981' }}>Privacy Policy</span>. Account role will be set to standard Farmer (USER).
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#022c22',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'signin' ? (
              <span>Sign In to Dashboard ➔</span>
            ) : (
              <span>Create Free Account ➔</span>
            )}
          </button>
        </form>

        {/* Demo Fast-Login Section */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontWeight: 700,
            marginBottom: '12px',
          }}>
            ⚡ Instant Evaluation Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN')}
              disabled={loading}
              style={{
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
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
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
            >
              🛡️ Demo Admin
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('USER')}
              disabled={loading}
              style={{
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#86efac',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.22)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
            >
              🌾 Demo Farmer
            </button>
          </div>
        </div>

        {/* Footer Link to Landing Page */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/"
            style={{
              color: '#64748b',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ← Back to AgriFusion AI Landing Page
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            background: '#151d28',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Reset Password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {forgotResult ? (
              <div>
                <p style={{ color: '#86efac', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {forgotResult.message}
                </p>
                {forgotResult.reset_token && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px' }}>
                      Testing Link:
                    </div>
                    <Link
                      to={`/reset-password?token=${forgotResult.reset_token}`}
                      style={{ color: '#38bdf8', fontSize: '0.85rem', wordBreak: 'break-all', fontWeight: 600 }}
                    >
                      Click here to complete Reset Password ➔
                    </Link>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: '#022c22',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Enter your registered email address and we will dispatch password recovery instructions.
                </p>
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '11px 14px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: '#10b981',
                    color: '#022c22',
                    fontWeight: 700,
                    border: 'none',
                    cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
