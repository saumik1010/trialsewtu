import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { Home } from './pages/public/Home';
import { Login } from './pages/public/Login';
import { PublicDirectory } from './pages/public/PublicDirectory';
import { Audits } from './pages/public/Audits';
import { AboutCooperative } from './pages/public/AboutCooperative';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PublicLayout } from './components/layout/PublicLayout';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { BookService } from './pages/customer/BookService';
import { CustomerBookings } from './pages/customer/CustomerBookings';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerPortfolio } from './pages/worker/WorkerPortfolio';
import { WorkerSchemes } from './pages/worker/WorkerSchemes';
import { WorkerEarnings } from './pages/worker/WorkerEarnings';
import { WorkerWelfare } from './pages/worker/WorkerWelfare';
import { VoiceSaathi } from './pages/worker/VoiceSaathi';
import { WorkerMassHiring } from './pages/worker/WorkerMassHiring';

// Cooperative Pages
import { CooperativeDashboard } from './pages/cooperative/CooperativeDashboard';
import { FairWorkload } from './pages/cooperative/FairWorkload';
import { Grievances } from './pages/cooperative/Grievances';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Shared Header and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/directory" element={<PublicDirectory />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/about" element={<AboutCooperative />} />
        </Route>

        {/* Dashboard Shell Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Customer Routes */}
          <Route path="customer" element={<CustomerDashboard />} />
          <Route path="customer/book" element={<BookService />} />
          <Route path="customer/bookings" element={<CustomerBookings />} />
          <Route path="customer/bookings/:id" element={<CustomerBookings />} />

          {/* Worker Routes */}
          <Route path="worker" element={<WorkerDashboard />} />
          <Route path="worker/portfolio" element={<WorkerPortfolio />} />
          <Route path="worker/mass-hiring" element={<WorkerMassHiring />} />
          <Route path="worker/schemes" element={<WorkerSchemes />} />
          <Route path="worker/earnings" element={<WorkerEarnings />} />
          <Route path="worker/welfare" element={<WorkerWelfare />} />
          <Route path="worker/voice" element={<VoiceSaathi />} />

          {/* Cooperative Admin Routes */}
          <Route path="cooperative" element={<CooperativeDashboard />} />
          <Route path="cooperative/workload" element={<FairWorkload />} />
          <Route path="cooperative/grievances" element={<Grievances />} />
          <Route path="coop" element={<Navigate to="/dashboard/cooperative" replace />} />
          <Route path="coop/*" element={<Navigate to="/dashboard/cooperative" replace />} />

          {/* Fallback Dashboard Route */}
          <Route index element={<Navigate to="/dashboard/customer" replace />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
