import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';

// Public Landing Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Schemes from '../pages/Schemes';
import Predictions from '../pages/Predictions';
import Assistant from '../pages/Assistant';

// Auth Pages
import AuthPage from '../pages/auth/AuthPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Farmer / User Pages
import UserDashboard from '../pages/user/UserDashboard';
import UserProfile from '../pages/user/UserProfile';
import UserHistory from '../pages/user/UserHistory';
import UserSettings from '../pages/user/UserSettings';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminModels from '../pages/admin/AdminModels';
import AdminDatasets from '../pages/admin/AdminDatasets';
import AdminPredictions from '../pages/admin/AdminPredictions';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';
import AdminSettings from '../pages/admin/AdminSettings';

// Error Pages
import Forbidden403 from '../pages/error/Forbidden403';
import NotFound404 from '../pages/error/NotFound404';

// Helper wrapper for public landing subpages
function LandingPageWrapper({ page, component: Component }: { page: string; component: React.ComponentType<any> }) {
  const navigate = useNavigate();
  const [homeBg, setHomeBg] = React.useState('/hero-cinematic-agri.jpg');
  const [predictionBg] = React.useState('/backgrounds/sustainable_journey.jpg');

  const onNav = (p: string) => {
    if (p === 'home') navigate('/');
    else if (p === 'predictions') navigate('/predictions');
    else if (p === 'market') navigate('/market');
    else if (p === 'assistant') navigate('/ai-assistant');
    else if (p === 'about') navigate('/about');
    else if (p === 'signin') navigate('/login');
    else if (p === 'profile') navigate('/profile');
  };

  return (
    <LandingLayout
      activePage={page}
      onNavigate={onNav}
      currentHomeBg={homeBg}
      currentPredictionBg={predictionBg}
    >
      <Component onNavigate={onNav} onBgChange={setHomeBg} />
    </LandingLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<LandingPageWrapper page="home" component={Home} />} />
      <Route path="/about" element={<LandingPageWrapper page="about" component={About} />} />
      <Route path="/market" element={<LandingPageWrapper page="market" component={Schemes} />} />
      {/* Auth Entry Routes */}
      <Route path="/login" element={<AuthPage initialMode="signin" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route path="/forgot-password" element={<AuthPage initialMode="signin" />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ── User Protected Routes ── */}
      <Route element={<ProtectedRoute requiredRole="USER" />}>
        <Route element={<UserDashboardLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/crop-recommendation" element={<Predictions initialTab="crop" />} />
          <Route path="/disease-detection" element={<Predictions initialTab="crop" />} />
          <Route path="/yield-prediction" element={<Predictions initialTab="yield" />} />
          <Route path="/irrigation-prediction" element={<Predictions initialTab="irrigation" />} />
          <Route path="/market-price" element={<Predictions initialTab="market" />} />
          <Route path="/ai-assistant" element={<Assistant />} />
          <Route path="/assistant" element={<Assistant />} />
        </Route>
      </Route>

      {/* ── Admin Protected Routes ── */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
  );
}
