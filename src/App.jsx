import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Store
import store from './store/store';

// Import Context
import { AuthProvider } from './context/AuthContext';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import TrainersPage from './pages/TrainersPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Import Admin Pages
import AdminInquiries from './pages/admin/Inquiries';
import AdminServices from './pages/admin/Services';
import AdminAnalytics from './pages/admin/Analytics';
import AdminNotifications from './pages/admin/Notifications';
import AdminSettings from './pages/admin/Settings';
import MembersManagement from './pages/admin/MembersManagement';
import TrainersManagement from './pages/admin/TrainersManagement';

// Import Admin Components
import ProtectedRoute from './components/admin/ProtectedRoute';

import BlogPage from './pages/BlogPage';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes with Header and Footer */}
            <Route path="/" element={<><ScrollToTop /><LayoutWithHeaderFooter component={HomePage} /></>} />
            <Route path="about" element={<><ScrollToTop /><LayoutWithHeaderFooter component={AboutPage} /></>} />
            <Route path="services" element={<><ScrollToTop /><LayoutWithHeaderFooter component={ServicesPage} /></>} />
            <Route path="trainers" element={<><ScrollToTop /><LayoutWithHeaderFooter component={TrainersPage} /></>} />
            <Route path="gallery" element={<><ScrollToTop /><LayoutWithHeaderFooter component={GalleryPage} /></>} />
            <Route path="contact" element={<><ScrollToTop /><LayoutWithHeaderFooter component={ContactPage} /></>} />
            <Route path="blog" element={<><ScrollToTop /><LayoutWithHeaderFooter component={BlogPage} /></>} />
            
            {/* Admin Routes without Header and Footer */}
            <Route path="/admin/*" element={<><ScrollToTop /><AdminLayout /></>} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

const LayoutWithHeaderFooter = ({ component: Component }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Component />
      </main>
      <Footer />
    </div>
  );
};

// Admin Layout Component
const AdminLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
        <Route path="services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="members" element={<ProtectedRoute><MembersManagement /></ProtectedRoute>} />
        <Route path="trainers" element={<ProtectedRoute><TrainersManagement /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;