import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
//@ts-ignore
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OTPPage from './pages/auth/OTPPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/profile/ProfilePage';

// Room Pages
import RoomsPage from './pages/rooms/RoomsPage';
import MyRoomsPage from './pages/rooms/MyRoomsPage';
import RoomDetailsPage from './pages/rooms/RoomDetailsPage';
import CreateRoomPage from './pages/rooms/CreateRoomPage';
import EditRoomPage from './pages/rooms/EditRoomPage';
import RoomImagesPage from './pages/rooms/RoomImagesPage';

// Document Pages
import DocumentsPage from './pages/documents/DocumentsPage';

// Review Pages
import AddReviewPage from './pages/reviews/AddReviewPage';

// Chat Pages
import ChatPage from './pages/chat/ChatPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DocumentVerificationPage from './pages/admin/DocumentVerificationPage';
import AdminUserFuncPage from './pages/admin/AdminUserFuncPage';
import AdminRoomFuncPage from './pages/admin/AdminRoomFuncPage';
import SearchRooms from './pages/rooms/SearchRooms';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Room Routes */}
            <Route path="/rooms" element={<Layout><RoomsPage /></Layout>} />
            <Route path="/rooms/:id" element={<Layout><RoomDetailsPage /></Layout>} />
            <Route
              path="/rooms/create"
              element={
                <ProtectedRoute>
                  <Layout><CreateRoomPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout><EditRoomPage /></Layout>
                </ProtectedRoute>
              }
            />

            
            <Route path="/location-search" element={<Layout><SearchRooms /></Layout>} />

            <Route
              path="/rooms/:id/images"
              element={
                <ProtectedRoute>
                  <Layout><RoomImagesPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/review"
              element={
                <ProtectedRoute>
                  <Layout><AddReviewPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rooms"
              element={
                <ProtectedRoute>
                  <Layout><MyRoomsPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Document Routes */}
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Layout><DocumentsPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Chat Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout><ChatPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <ProtectedRoute adminOnly>
                  <Layout><DocumentVerificationPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <Layout><AdminUserFuncPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute adminOnly>
                  <Layout><AdminRoomFuncPage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Go Home
                    </a>
                  </div>
                </Layout>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;