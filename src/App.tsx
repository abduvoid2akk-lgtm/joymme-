import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ListingsProvider } from './context/ListingsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';
import { ListingDetails } from './pages/ListingDetails';
import { UserProfile } from './pages/UserProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Chat } from './pages/Chat';
import { Messages } from './pages/Messages';
import { AddListing } from './pages/AddListing';
import { HistoryPage } from './pages/HistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';

import { Favorites } from './pages/Favorites';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPendingListings } from './pages/admin/AdminPendingListings';
import { AdminAllListings } from './pages/admin/AdminAllListings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminMap } from './pages/admin/AdminMap';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminMessages } from './pages/admin/AdminMessages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-12">
      {!isAuthPage && <Header />}
      <main className={`max-w-7xl mx-auto px-4 md:px-8 ${!isAuthPage ? 'pt-24' : 'pt-8'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/listing/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <ListingsProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="pending" element={<AdminPendingListings />} />
              <Route path="listings" element={<AdminAllListings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="chats" element={<AdminMessages />} />
              <Route path="chats/:id" element={<Chat />} />
            </Route>

            {/* Main App Routes */}
            <Route path="*" element={<MainLayout />} />
          </Routes>
        </Router>
      </ListingsProvider>
    </UserProvider>
  );
}
