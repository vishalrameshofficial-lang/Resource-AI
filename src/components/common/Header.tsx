import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldAlert, 
  GraduationCap, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles, 
  LogOut, 
  Sliders, 
  ChevronDown, 
  ArrowRight, 
  LogIn, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Domain } from '../../types';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { 
    domain, 
    setDomain, 
    activeTab,
    setActiveTab,
    isDarkMode, 
    toggleDarkMode, 
    user, 
    searchQuery, 
    setSearchQuery,
    recommendations,
    logout,
    runOptimization,
    setIsSimulationOpen
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const domainConfigs: Record<string, { label: string; icon: React.ReactNode; color: string; tabId: string }> = {
    healthcare: {
      label: 'Healthcare',
      icon: <Activity className="w-3.5 h-3.5 text-[#16B8A6]" />,
      color: 'bg-[#16B8A6]/10 text-[#16B8A6] border-[#16B8A6]/30',
      tabId: 'healthcare-dashboard'
    },
    disaster: {
      label: 'Disaster Relief',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />,
      color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
      tabId: 'disaster-dashboard'
    },
    education: {
      label: 'Education Equity',
      icon: <GraduationCap className="w-3.5 h-3.5 text-[#7257E8]" />,
      color: 'bg-[#7257E8]/10 text-[#7257E8] border-[#7257E8]/30',
      tabId: 'education-dashboard'
    },
    activity: {
      label: 'Activity Stream',
      icon: <Clock className="w-3.5 h-3.5 text-[#1677E8]" />,
      color: 'bg-[#1677E8]/10 text-[#1677E8] border-[#1677E8]/30',
      tabId: 'activity-dashboard'
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="sticky top-0 z-30 h-16 border-b border-[#E5EAF0] bg-white/85 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-colors shadow-[0_2px_10px_rgba(16,42,67,0.03)]"
      >
        {/* Left: Custom RA Brand Logo */}
        <div className="flex items-center space-x-3 lg:space-x-5">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="Return to ResourceAI Opening Page"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <img src="/logo.png" alt="ResourceAI Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#102A43] font-sans">
                  Resource<span className="text-[#1677E8]">AI</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#1677E8]/10 text-[#1677E8] border border-[#1677E8]/20">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium hidden sm:block">India Operations Platform</p>
            </div>
          </div>

          {/* Domain Switcher Pills */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-full border border-[#E5EAF0]">
            {Object.entries(domainConfigs).map(([key, cfg]) => {
              const active = activeTab === cfg.tabId || (activeTab === 'dashboard' && domain === key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'healthcare' || key === 'disaster' || key === 'education') {
                      setDomain(key as Domain);
                    }
                    setActiveTab(cfg.tabId);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active 
                      ? `${cfg.color} bg-white shadow-sm border font-extrabold scale-[1.02]` 
                      : 'text-[#64748B] hover:text-[#102A43] hover:bg-white/50'
                  }`}
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Search bar */}
        <div className="flex-1 max-w-md mx-4 hidden lg:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder={`Search Indian hospitals, relief camps, or school districts...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FA] border border-[#E5EAF0] rounded-xl pl-10 pr-4 py-1.5 text-xs text-[#102A43] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1677E8]/30 focus:border-[#1677E8] transition-all"
            />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center space-x-2.5 lg:space-x-4">
          {/* What-If Simulation Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(16,42,67,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulationOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-[9px] bg-white hover:bg-slate-50 text-[#102A43] text-xs font-bold border border-[#E5EAF0] shadow-sm transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-[#1677E8]" />
            <span>What-If Simulation</span>
          </motion.button>

          {/* Primary Action Button: Optimize Now */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(22,119,232,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              runOptimization();
              setActiveTab('map');
            }}
            className="group hidden sm:flex items-center space-x-2 px-4 py-2 rounded-[9px] bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-sm transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize Now</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </motion.button>

          {/* Notifications Icon with Badge */}
          <button 
            onClick={() => setActiveTab('map')}
            className="relative p-2 rounded-lg text-[#64748B] hover:text-[#102A43] hover:bg-[#F4F7FA] transition-colors"
            title="Pending Allocation Recommendations"
          >
            <Bell className="w-4.5 h-4.5" />
            {recommendations.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-[#F4F7FA] transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#E5EAF0]"
              />
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-[#102A43] leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#64748B] truncate max-w-[130px] font-medium">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden xl:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E5EAF0] rounded-xl shadow-[0_10px_25px_rgba(15,23,42,0.1)] p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-[#E5EAF0] mb-1">
                  <p className="text-xs font-bold text-[#102A43]">{user.name}</p>
                  <p className="text-[11px] text-[#64748B]">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#102A43] hover:bg-[#F4F7FA] rounded-lg transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1677E8]" />
                  <span>Switch Executive Account</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#102A43] hover:bg-[#F4F7FA] rounded-lg transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>MCDA Algorithm Settings</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
