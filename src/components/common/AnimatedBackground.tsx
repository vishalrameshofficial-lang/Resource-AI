import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Dashboard3DBackground } from './Dashboard3DBackground';

export const AnimatedBackground: React.FC = () => {
  const { activeTab, domain } = useApp();

  // Determine current active domain theme
  let currentDomain = domain;
  if (activeTab === 'healthcare-dashboard') currentDomain = 'healthcare';
  else if (activeTab === 'disaster-dashboard') currentDomain = 'disaster';
  else if (activeTab === 'education-dashboard') currentDomain = 'education';

  // Domain gradient theme settings
  const themeColors = {
    healthcare: {
      aurora1: 'from-[#08A8C8]/15 via-[#16B8A6]/10 to-transparent',
      aurora2: 'from-[#1677E8]/12 via-[#16A974]/10 to-transparent',
      gridColor: 'rgba(8, 168, 200, 0.04)',
      accent: '#16B8A6'
    },
    disaster: {
      aurora1: 'from-[#F59E0B]/15 via-[#EF4444]/10 to-transparent',
      aurora2: 'from-[#F97316]/12 via-[#EAB308]/10 to-transparent',
      gridColor: 'rgba(245, 158, 11, 0.04)',
      accent: '#F59E0B'
    },
    education: {
      aurora1: 'from-[#7257E8]/15 via-[#1677E8]/10 to-transparent',
      aurora2: 'from-[#A855F7]/12 via-[#08A8C8]/10 to-transparent',
      gridColor: 'rgba(114, 87, 232, 0.04)',
      accent: '#7257E8'
    },
    activity: {
      aurora1: 'from-[#1677E8]/15 via-[#08A8C8]/10 to-transparent',
      aurora2: 'from-[#16B8A6]/12 via-[#7257E8]/08 to-transparent',
      gridColor: 'rgba(22, 119, 232, 0.04)',
      accent: '#1677E8'
    }
  };

  const currentTheme = activeTab === 'activity-dashboard' 
    ? themeColors.activity 
    : (themeColors[currentDomain] || themeColors.healthcare);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-br from-[#FAFCFF] via-[#F4F7FA] to-[#EDF2F7]"
      style={{ pointerEvents: 'none' }}
    >
      {/* Continuous Animated 3D Futuristic AI Command Center Background */}
      <Dashboard3DBackground />

      {/* Soft Ambient Top Right Aurora Blob - Subtle ambient light movement */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.85, 1, 0.85]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-32 right-0 w-[780px] h-[580px] bg-gradient-to-br ${currentTheme.aurora1} blur-[120px] rounded-full pointer-events-none`}
      />

      {/* Soft Ambient Left Center Aurora Blob - Subtle ambient light movement */}
      <motion.div
        animate={{
          scale: [0.98, 1.03, 0.98],
          opacity: [0.8, 0.95, 0.8]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-1/3 -left-32 w-[720px] h-[520px] bg-gradient-to-tr ${currentTheme.aurora2} blur-[130px] rounded-full pointer-events-none`}
      />

      {/* Subtle Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${currentTheme.accent} 0.75px, transparent 0.75px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* ================================================== */}
      {/* DOMAIN-SPECIFIC STATIC BACKGROUND ILLUSTRATIONS */}
      {/* Exact same artwork and positions, completely static */}
      {/* ================================================== */}

      {/* 1. HEALTHCARE VECTOR ILLUSTRATIONS */}
      {(currentDomain === 'healthcare' && activeTab !== 'activity-dashboard') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Medical Pill / Capsule 1 */}
          <svg
            className="absolute top-16 right-1/4 w-28 h-28 text-teal-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <rect x="3" y="10" width="18" height="8" rx="4" transform="rotate(-35 12 14)" />
            <line x1="8" y1="8" x2="16" y2="20" />
          </svg>

          {/* Medical Cross */}
          <svg
            className="absolute top-1/3 right-12 w-32 h-32 text-cyan-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeWidth="3" />
          </svg>

          {/* Stethoscope */}
          <svg
            className="absolute bottom-24 left-16 w-36 h-36 text-sky-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M4.8 2.3A.3.3 0 0 0 4.5 2h-1a.5.5 0 0 0-.5.5V10a6 6 0 0 0 12 0V2.5a.5.5 0 0 0-.5-.5h-1a.3.3 0 0 0-.3.3V10a4 4 0 0 1-8 0V2.3z" />
            <path d="M11 16v2a5 5 0 0 0 10 0v-1.5" />
            <circle cx="21" cy="16.5" r="1.5" />
          </svg>

          {/* ECG Waveform */}
          <svg
            className="absolute top-1/2 left-1/3 w-64 h-24 text-teal-500"
            viewBox="0 0 200 50" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M0 25 h40 l10 -20 l15 45 l15 -60 l15 40 l10 -15 h55" strokeLinecap="round" />
          </svg>

          {/* Hospital Building Icon */}
          <svg
            className="absolute bottom-12 right-1/3 w-28 h-28 text-emerald-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M12 7v6" />
          </svg>
        </div>
      )}

      {/* 2. DISASTER RELIEF VECTOR ILLUSTRATIONS */}
      {(currentDomain === 'disaster' && activeTab !== 'activity-dashboard') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Relief Box / Cargo */}
          <svg
            className="absolute top-20 right-1/4 w-28 h-28 text-amber-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
          </svg>

          {/* Water Drop */}
          <svg
            className="absolute top-1/3 right-16 w-32 h-32 text-orange-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>

          {/* Flood Wave Pattern */}
          <svg
            className="absolute top-1/2 left-10 w-64 h-24 text-[#EF4444]"
            viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20" />
            <path d="M0 30 Q 25 15, 50 30 T 100 30 T 150 30 T 200 30" />
          </svg>

          {/* Emergency Relief Truck */}
          <svg
            className="absolute bottom-16 right-1/3 w-32 h-32 text-amber-500"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M10 17h4M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>

          {/* Location Map Marker / Warning Pin */}
          <svg
            className="absolute bottom-28 left-1/4 w-28 h-28 text-red-500"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      )}

      {/* 3. EDUCATION EQUITY VECTOR ILLUSTRATIONS */}
      {(currentDomain === 'education' && activeTab !== 'activity-dashboard') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Graduation Cap */}
          <svg
            className="absolute top-16 right-1/4 w-32 h-32 text-purple-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5" />
          </svg>

          {/* Open Book */}
          <svg
            className="absolute top-1/3 right-12 w-32 h-32 text-indigo-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>

          {/* Lightbulb / Innovation */}
          <svg
            className="absolute bottom-24 left-16 w-28 h-28 text-blue-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6M10 22h4" />
          </svg>

          {/* Mathematical Symbols */}
          <g
            className="absolute top-1/2 left-1/3 text-purple-700 font-serif font-bold text-4xl"
          >
            <text x="0" y="30">∑</text>
            <text x="50" y="30">π</text>
            <text x="90" y="30">√x</text>
          </g>

          {/* School / College Building */}
          <svg
            className="absolute bottom-16 right-1/3 w-32 h-32 text-cyan-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M18 22V7H6v15M2 22h20M12 2v5M10 11h4M10 15h4" />
          </svg>
        </div>
      )}

      {/* 4. ACTIVITY STREAM VECTOR ILLUSTRATIONS */}
      {(activeTab === 'activity-dashboard') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {/* Clock / Timer */}
          <svg
            className="absolute top-16 right-1/4 w-32 h-32 text-blue-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>

          {/* Audit Document */}
          <svg
            className="absolute top-1/3 right-16 w-28 h-28 text-cyan-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>

          {/* Activity Waveform */}
          <svg
            className="absolute top-1/2 left-10 w-64 h-24 text-teal-600"
            viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M0 20 h30 l15 -25 l15 50 l15 -35 l15 20 h80" />
          </svg>

          {/* Connected System Nodes */}
          <svg
            className="absolute bottom-20 right-1/3 w-36 h-36 text-indigo-600"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="18" r="3" />
            <line x1="9" y1="6" x2="15" y2="6" />
            <line x1="6" y1="9" x2="6" y2="15" />
            <line x1="9" y1="18" x2="15" y2="18" />
            <line x1="18" y1="9" x2="18" y2="15" />
          </svg>
        </div>
      )}
    </div>
  );
};

