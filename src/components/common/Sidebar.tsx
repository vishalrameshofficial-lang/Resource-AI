import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  Package, 
  TrendingUp, 
  Sliders,
  Activity,
  ShieldAlert,
  GraduationCap,
  Clock,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Domain } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, domain, setDomain } = useApp();

  const domainDashboards = [
    { 
      id: 'healthcare-dashboard', 
      label: 'Healthcare Ops', 
      icon: Activity, 
      domain: 'healthcare' as Domain,
      badgeText: 'LIVE',
      badgeClass: 'text-[#16B8A6] bg-[#16B8A6]/10 border-[#16B8A6]/30',
      activeAccent: 'text-[#16B8A6]' 
    },
    { 
      id: 'disaster-dashboard', 
      label: 'Disaster Relief', 
      icon: ShieldAlert, 
      domain: 'disaster' as Domain,
      badgeText: 'LIVE',
      badgeClass: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
      activeAccent: 'text-[#F59E0B]' 
    },
    { 
      id: 'education-dashboard', 
      label: 'Education Equity', 
      icon: GraduationCap, 
      domain: 'education' as Domain,
      badgeText: 'LIVE',
      badgeClass: 'text-[#7257E8] bg-[#7257E8]/10 border-[#7257E8]/30',
      activeAccent: 'text-[#7257E8]' 
    },
    { 
      id: 'activity-dashboard', 
      label: 'Activity Stream', 
      icon: Clock, 
      domain: domain,
      badgeText: 'LIVE',
      badgeClass: 'text-[#1677E8] bg-[#1677E8]/10 border-[#1677E8]/30',
      activeAccent: 'text-[#1677E8]' 
    },
  ];

  const coreTools = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'map', label: 'GIS Urgency Map', icon: Map },
    { id: 'inventory', label: 'Stock Pool Inventory', icon: Package },
    { id: 'analytics', label: 'Prophet Analytics', icon: TrendingUp },
    { id: 'settings', label: 'MCDA Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Desktop Dark Navy Sidebar */}
      <motion.aside 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden md:flex flex-col w-64 border-r border-[#102A43] bg-[#0B1F3A] p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)] z-20 shadow-xl"
      >
        
        {/* DOMAIN DASHBOARDS Group */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#829AB1] mb-2">
            DOMAIN DASHBOARDS
          </p>
          {domainDashboards.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.domain) setDomain(item.domain);
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group ${
                  active
                    ? 'bg-white text-[#0B1F3A] font-extrabold shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-[#102A43]/70 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? item.activeAccent : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`inline-flex items-center space-x-1 text-[9px] px-2 py-0.5 rounded-full font-bold border transition-all ${item.badgeClass}`}>
                  <motion.span 
                    animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-current" 
                  />
                  <span>{item.badgeText}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* CORE OPERATIONS Group */}
        <div className="space-y-1.5 pt-3 border-t border-[#102A43]">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#829AB1] mb-2">
            CORE OPERATIONS
          </p>
          {coreTools.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group ${
                  active
                    ? 'bg-white text-[#0B1F3A] font-extrabold shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-[#102A43]/70 font-semibold'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-[#1677E8]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Minimal Enterprise Bottom Information Card */}
        <div className="mt-auto bg-[#081B33] border border-[#102A43] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-[#1677E8]" />
            <span className="text-xs font-bold text-white">Greedy LP Engine</span>
          </div>
          <p className="text-[11px] text-[#829AB1] leading-snug">
            60 Indian location nodes monitored in real-time.
          </p>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1F3A] border-t border-[#102A43] px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setDomain('healthcare');
            setActiveTab('healthcare-dashboard');
          }}
          className={`flex flex-col items-center space-y-1 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'healthcare-dashboard' ? 'text-white font-bold bg-[#102A43]' : 'text-slate-300'
          }`}
        >
          <Activity className="w-5 h-5 text-[#16A974]" />
          <span className="text-[10px]">Healthcare</span>
        </button>

        <button
          onClick={() => {
            setDomain('disaster');
            setActiveTab('disaster-dashboard');
          }}
          className={`flex flex-col items-center space-y-1 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'disaster-dashboard' ? 'text-white font-bold bg-[#102A43]' : 'text-slate-300'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
          <span className="text-[10px]">Disaster</span>
        </button>

        <button
          onClick={() => {
            setDomain('education');
            setActiveTab('education-dashboard');
          }}
          className={`flex flex-col items-center space-y-1 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'education-dashboard' ? 'text-white font-bold bg-[#102A43]' : 'text-slate-300'
          }`}
        >
          <GraduationCap className="w-5 h-5 text-[#7257E8]" />
          <span className="text-[10px]">Education</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center space-y-1 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'map' ? 'text-white font-bold bg-[#102A43]' : 'text-slate-300'
          }`}
        >
          <Map className="w-5 h-5 text-[#1677E8]" />
          <span className="text-[10px]">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('activity-dashboard')}
          className={`flex flex-col items-center space-y-1 px-2.5 py-1 rounded-xl transition-all ${
            activeTab === 'activity-dashboard' ? 'text-white font-bold bg-[#102A43]' : 'text-slate-300'
          }`}
        >
          <Clock className="w-5 h-5 text-[#1677E8]" />
          <span className="text-[10px]">Activity</span>
        </button>
      </nav>
    </>
  );
};
