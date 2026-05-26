import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
const Landing = lazy(() => import('./pages/public/Landing'));
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail'));
const SEOGuide = lazy(() => import('./pages/public/SEOGuide'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'));
const AdminResumes = lazy(() => import('./pages/admin/AdminResumes'));
const AdminCertifications = lazy(() => import('./pages/admin/AdminCertifications'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="project/:slug" element={<ProjectDetail />} />
          <Route path="seo-guide" element={<SEOGuide />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="resumes" element={<AdminResumes />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
