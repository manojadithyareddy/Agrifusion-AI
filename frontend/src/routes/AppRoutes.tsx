import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';

// Public & Farmer Landing Pages (Route-Based Dynamic Code Splitting)
import Home from '../pages/Home'; // Eagerly loaded for instant FCP/LCP on landing
const About = lazy(() => import('../pages/About'));
const Schemes = lazy(() => import('../pages/Schemes'));
const Predictions = lazy(() => import('../pages/Predictions'));
const CropHealth = lazy(() => import('../pages/CropHealth'));
const Assistant = lazy(() => import('../pages/Assistant'));

// Auth Pages (Lazy Loaded)
const AuthPage = lazy(() => import('../pages/auth/AuthPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Farmer / User Pages (Lazy Loaded)
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UserProfile = lazy(() => import('../pages/user/UserProfile'));
const UserHistory = lazy(() => import('../pages/user/UserHistory'));
const UserSettings = lazy(() => import('../pages/user/UserSettings'));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminModels = lazy(() => import('../pages/admin/AdminModels'));
const AdminDatasets = lazy(() => import('../pages/admin/AdminDatasets'));
const AdminPredictions = lazy(() => import('../pages/admin/AdminPredictions'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminAuditLogs = lazy(() => import('../pages/admin/AdminAuditLogs'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Error Pages
import Forbidden403 from '../pages/error/Forbidden403';
const NotFound404 = lazy(() => import('../pages/error/NotFound404'));

// High-Performance Ambient Route Loading Fallback
function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: '#4ade80',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid rgba(0, 255, 102, 0.15)',
          borderTopColor: '#00ff66',
          borderRadius: '50%',
          animation: 'routeSpin 0.75s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      />
      <span
        style={{
          fontSize: '0.84rem',
          color: '#94a3b8',
          fontFamily: 'monospace',
          letterSpacing: '1px',
        }}
      >
        LOADING AGRIFUSION AI SUBSYSTEM...
      </span>
      <style>{`
        @keyframes routeSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper wrapper for all farmer and landing pages inside the cinematic LandingLayout
interface LandingPageWrapperProps {
  page: string;
  component: React.ComponentType<any>;
  initialTab?: string;
}

function LandingPageWrapper({ page, component: Component, initialTab }: LandingPageWrapperProps) {
  const navigate = useNavigate();
  const [homeBg, setHomeBg] = React.useState('/hero-cinematic-agri.jpg');
  const [predictionBg, setPredictionBg] = React.useState('/backgrounds/sustainable_journey.jpg');

  const onNav = (p: string) => {
    if (p === 'home') navigate('/');
    else if (p === 'predictions') navigate('/predictions');
    else if (p === 'crop' || p === 'crop-recommendation') navigate('/crop-recommendation');
    else if (p === 'disease' || p === 'disease-detection') navigate('/disease-detection');
    else if (p === 'yield' || p === 'yield-prediction') navigate('/yield-prediction');
    else if (p === 'irrigation' || p === 'irrigation-prediction') navigate('/irrigation-prediction');
    else if (p === 'market' || p === 'market-price') navigate('/market');
    else if (p === 'assistant' || p === 'ai-assistant') navigate('/ai-assistant');
    else if (p === 'about') navigate('/about');
    else if (p === 'signin') navigate('/login');
    else if (p === 'profile') navigate('/profile');
    else if (p === 'admin') navigate('/admin/dashboard');
  };

  return (
    <LandingLayout
      activePage={page}
      onNavigate={onNav}
      currentHomeBg={homeBg}
      currentPredictionBg={predictionBg}
    >
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component onNavigate={onNav} onBgChange={page === 'home' ? setHomeBg : setPredictionBg} initialTab={initialTab} />
      </Suspense>
    </LandingLayout>
  );
}

// Redirects /dashboard: Admins to /admin/dashboard, Farmers/Users to Home page
function DashboardRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated && role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* ── Public & Farmer Routes (All open in Home / Landing Layout) ── */}
        <Route path="/" element={<LandingPageWrapper page="home" component={Home} />} />
        <Route path="/about" element={<LandingPageWrapper page="about" component={About} />} />
        <Route path="/market" element={<LandingPageWrapper page="market" component={Schemes} />} />
        <Route path="/market-price" element={<LandingPageWrapper page="market" component={Schemes} />} />
        <Route path="/predictions" element={<LandingPageWrapper page="predictions" component={Predictions} />} />
        <Route path="/crop-recommendation" element={<LandingPageWrapper page="predictions" component={Predictions} initialTab="crop" />} />
        <Route path="/disease-detection" element={<LandingPageWrapper page="disease" component={CropHealth} />} />
        <Route path="/yield-prediction" element={<LandingPageWrapper page="predictions" component={Predictions} initialTab="yield" />} />
        <Route path="/irrigation-prediction" element={<LandingPageWrapper page="predictions" component={Predictions} initialTab="irrigation" />} />
        <Route path="/ai-assistant" element={<LandingPageWrapper page="assistant" component={Assistant} />} />
        <Route path="/assistant" element={<LandingPageWrapper page="assistant" component={Assistant} />} />

        {/* Auth Entry Routes */}
        <Route path="/login" element={<AuthPage initialMode="signin" />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" />} />
        <Route path="/forgot-password" element={<AuthPage initialMode="signin" />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Farmer Profile & Settings (Rendered in LandingLayout) */}
        <Route element={<ProtectedRoute requiredRole="USER" />}>
          <Route path="/profile" element={<LandingPageWrapper page="profile" component={UserProfile} />} />
          <Route path="/settings" element={<LandingPageWrapper page="profile" component={UserSettings} />} />
          <Route path="/history" element={<LandingPageWrapper page="predictions" component={UserHistory} />} />
        </Route>

        {/* Redirect /dashboard: Admins to Admin Dashboard, Farmers to Home */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* ── Admin Protected Routes (Admin Dashboard Layout) ── */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/farmer-metrics" element={<UserDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/models" element={<AdminModels />} />
            <Route path="/admin/datasets" element={<AdminDatasets />} />
            <Route path="/admin/predictions" element={<AdminPredictions />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/logs" element={<AdminAuditLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ── Error & Fallback Routes ── */}
        <Route path="/403" element={<Forbidden403 />} />
        <Route path="/404" element={<NotFound404 />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}
