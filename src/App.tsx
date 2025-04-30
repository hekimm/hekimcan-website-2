import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Layout from './components/layouts/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './components/layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminMessages from './pages/admin/AdminMessages';
import AdminProfile from './pages/admin/AdminProfile';
import AdminCodeEditor from './pages/admin/AdminCodeEditor';
import AdminFooter from './pages/admin/AdminFooter';
import AdminEducation from './pages/admin/AdminEducation';
import AdminContact from './pages/admin/AdminContact';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={theme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hakkimda" element={<AboutPage />} />
          <Route path="projeler" element={<ProjectsPage />} />
          <Route path="egitim" element={<EducationPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/giris" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="profil" element={<AdminProfile />} />
          <Route path="projeler" element={<AdminProjects />} />
          <Route path="yetenekler" element={<AdminSkills />} />
          <Route path="mesajlar" element={<AdminMessages />} />
          <Route path="code-editor" element={<AdminCodeEditor />} />
          <Route path="footer" element={<AdminFooter />} />
          <Route path="egitim" element={<AdminEducation />} />
          <Route path="iletisim" element={<AdminContact />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;