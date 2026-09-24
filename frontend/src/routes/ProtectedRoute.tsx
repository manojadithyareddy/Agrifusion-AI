import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import Forbidden403 from '../pages/error/Forbidden403';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050a11',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Modern Pulse Spinner */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '3px solid rgba(16, 185, 129, 0.15)',
          borderTopColor: '#10b981',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '20px',
        }} />
        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>
          AgriFusion AI
        </div>
        <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>
          Verifying security session...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, redirect to /login with state memory
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: If Admin is required but user is not Admin
  if (requiredRole === 'ADMIN' && role !== 'ADMIN') {
    return <Forbidden403 />;
  }

  return <Outlet />;
}
