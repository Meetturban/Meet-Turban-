import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import PageTransition, { ScrollToTop } from './components/common/PageTransition';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import TermsPage from './pages/TermsPage';

// Stage 2, 3 & 4 Portals
import ManagerLayout from './layouts/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import BookingOperationsHub from './pages/manager/BookingOperationsHub';
import ServicesManagement from './pages/manager/ServicesManagement';
import CustomerCRM from './pages/manager/CustomerCRM';
import StaffManagement from './pages/manager/StaffManagement';
import PaymentLedger from './pages/manager/PaymentLedger';
import SalaryManagement from './pages/manager/SalaryManagement';
import RevenueAnalytics from './pages/manager/RevenueAnalytics';
import AdvancedReports from './pages/manager/AdvancedReports';
import WebsiteSettingsCMS from './pages/manager/WebsiteSettingsCMS';
import StaffDashboard from './pages/staff/StaffDashboard';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <SettingsProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
              <Navbar />
              <main className="flex-1">
                <PageTransition>
                  <Routes>
                    {/* Customer Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/track" element={<TrackingPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Navigate to="/login" replace />} />
                    <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Staff Portal Route */}
                    <Route
                      path="/staff"
                      element={
                        <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Manager Portal Routes */}
                    <Route
                      path="/manager"
                      element={
                        <ProtectedRoute allowedRoles={['manager', 'admin']}>
                          <ManagerLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<ManagerDashboard />} />
                      <Route path="bookings" element={<BookingOperationsHub />} />
                      <Route path="services" element={<ServicesManagement />} />
                      <Route path="customers" element={<CustomerCRM />} />
                      <Route path="staff" element={<StaffManagement />} />
                      <Route path="payments" element={<PaymentLedger />} />
                      <Route path="salary" element={<SalaryManagement />} />
                      <Route path="analytics" element={<RevenueAnalytics />} />
                      <Route path="reports" element={<AdvancedReports />} />
                      <Route path="settings" element={<WebsiteSettingsCMS />} />
                    </Route>
                  </Routes>
                </PageTransition>
              </main>
              <Footer />
            </div>
          </Router>
        </SettingsProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
