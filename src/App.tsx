import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AllocationModal } from './components/common/AllocationModal';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { WhatIfSimulationModal } from './components/simulation/WhatIfSimulationModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HealthcareDashboard } from './pages/HealthcareDashboard';
import { DisasterDashboard } from './pages/DisasterDashboard';
import { EducationDashboard } from './pages/EducationDashboard';
import { ActivityStreamPage } from './pages/ActivityStreamPage';
import { MapView } from './pages/MapView';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

import { motion } from 'framer-motion';

const AppContent: React.FC = () => {
  const { activeTab, isLoggedIn, isSimulationOpen, setIsSimulationOpen } = useApp();

  if (!isLoggedIn || activeTab === 'landing') {
    return <LandingPage />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col selection:bg-cyan-500 selection:text-white relative overflow-x-hidden font-sans"
    >
      {/* 5-Layer Abstract Flowing Liquid Glass Aurora & Domain Illustrations Background */}
      <AnimatedBackground />

      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Page Content Viewport with smooth 0.5s fade-in */}
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 md:pb-12 max-w-[1600px] mx-auto w-full"
        >
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'healthcare-dashboard' && <HealthcareDashboard />}
          {activeTab === 'disaster-dashboard' && <DisasterDashboard />}
          {activeTab === 'education-dashboard' && <EducationDashboard />}
          {activeTab === 'activity-dashboard' && <ActivityStreamPage />}
          {activeTab === 'map' && <MapView />}
          {activeTab === 'inventory' && <InventoryPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </motion.main>
      </div>

      {/* What-If Simulation Engine Modal */}
      <WhatIfSimulationModal isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} />

      {/* Floating Allocation Modal / Drawer for Overrides */}
      <AllocationModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </motion.div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
