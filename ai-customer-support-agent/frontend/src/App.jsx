import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import KnowledgeBaseSearchPage from './pages/public/KnowledgeBaseSearchPage';

// Customer Pages
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import AiChatPage from './pages/customer/AiChatPage';
import CreateTicketPage from './pages/customer/CreateTicketPage';
import MyTicketsPage from './pages/customer/MyTicketsPage';
import TicketDetailsPage from './pages/customer/TicketDetailsPage';
import ConversationHistoryPage from './pages/customer/ConversationHistoryPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import FeedbackRatingPage from './pages/customer/FeedbackRatingPage';

// Agent Pages
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import AssignedTicketsPage from './pages/agent/AssignedTicketsPage';
import AgentTicketDetailsPage from './pages/agent/AgentTicketDetailsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageTicketsPage from './pages/admin/ManageTicketsPage';
import KnowledgeBaseAdminPage from './pages/admin/KnowledgeBaseAdminPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes with Top Header */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBaseSearchPage />} />
            </Route>

            {/* Customer Routes */}
            <Route element={<DashboardLayout allowedRoles={['CUSTOMER', 'SUPPORT_AGENT', 'ADMIN']} />}>
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/chat" element={<AiChatPage />} />
              <Route path="/customer/tickets" element={<MyTicketsPage />} />
              <Route path="/customer/tickets/new" element={<CreateTicketPage />} />
              <Route path="/customer/tickets/:id" element={<TicketDetailsPage />} />
              <Route path="/customer/history" element={<ConversationHistoryPage />} />
              <Route path="/customer/profile" element={<CustomerProfilePage />} />
              <Route path="/customer/feedback" element={<FeedbackRatingPage />} />
            </Route>

            {/* Support Agent Routes */}
            <Route element={<DashboardLayout allowedRoles={['SUPPORT_AGENT', 'ADMIN']} />}>
              <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
              <Route path="/agent/tickets" element={<AssignedTicketsPage />} />
              <Route path="/agent/tickets/:id" element={<AgentTicketDetailsPage />} />
            </Route>

            {/* Administrator Routes */}
            <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/tickets" element={<ManageTicketsPage />} />
              <Route path="/admin/knowledge-base" element={<KnowledgeBaseAdminPage />} />
              <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
