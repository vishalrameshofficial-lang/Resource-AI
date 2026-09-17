import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  GraduationCap, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from '../components/common/AuthModal';
import { Hero3DScene } from '../components/landing/Hero3DScene';

export const LandingPage: React.FC = () => {
  const { loginAs, setDomain, setActiveTab } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mouse Parallax Physics for Hero Background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const layer1X = useTransform(smoothX, [-500, 500], [-25, 25]);
  const layer1Y = useTransform(smoothY, [-500, 500], [-15, 15]);
  
  const layer2X = useTransform(smoothX, [-500, 500], [35, -35]);
  const layer2Y = useTransform(smoothY, [-500, 500], [25, -25]);

  const layer3X = useTransform(smoothX, [-500, 500], [-15, 15]);
  const layer3Y = useTransform(smoothY, [-500, 500], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#FAFCFF] dark:bg-[#071124] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white overflow-x-hidden relative transition-colors duration-300"
    >
      {/* ------------------------------------------------------------- */}
      {/* BRIGHT FUTURISTIC SAAS HERO BACKGROUND WITH 3D ROTATING RIBBON*/}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 h-[880px] overflow-hidden pointer-events-none z-0">
        
        {/* Soft Flowing 3D Wave Ambient Glow 1: Cyan & Light Blue */}
        <motion.div
          style={{ x: layer1X, y: layer1Y }}
          animate={{
            rotate: [0, 6, -4, 0],
            scale: [1, 1.05, 0.98, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-1/4 w-[750px] h-[550px] bg-gradient-to-br from-[#06b6d4]/18 via-[#38bdf8]/14 to-transparent blur-[110px] rounded-full pointer-events-none"
        />

        {/* Soft Flowing 3D Wave Ambient Glow 2: Purple & Subtle Pink */}
        <motion.div
          style={{ x: layer2X, y: layer2Y }}
          animate={{
            rotate: [-6, 4, -8, -6],
            scale: [0.96, 1.06, 0.96]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 -left-20 w-[720px] h-[520px] bg-gradient-to-tr from-[#a855f7]/16 via-[#f472b6]/12 to-transparent blur-[120px] rounded-full pointer-events-none"
        />

        {/* Soft Flowing 3D Wave Ambient Glow 3: Bright Teal & White Refraction */}
        <motion.div
          style={{ x: layer3X, y: layer3Y }}
          animate={{
            rotate: [4, -6, 5, 4],
            scale: [1.02, 0.95, 1.02]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-72 left-1/3 w-[650px] h-[480px] bg-gradient-to-r from-[#14b8a6]/14 via-[#38bdf8]/10 to-transparent blur-[110px] rounded-full pointer-events-none"
        />

        {/* High-Precision Modern SaaS Micro-Dot Grid */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#0284c7 0.75px, transparent 0.75px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black 40%, transparent 85%)'
          }}
        />

        {/* Large Glossy 3D Abstract Object / Ribbon Structure (Continuous 360° Rotation) */}
        <Hero3DScene />

        {/* Soft Radial Luminosity Shield to Ensure 100% Crisp Text Readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 42%, rgba(250,252,255,0.72) 0%, rgba(250,252,255,0.3) 55%, transparent 85%)'
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STICKY BLURRED NAVBAR                                        */}
      {/* ------------------------------------------------------------- */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0B1736]/70 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => loginAs('Global Operations Chief')}>
          <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-slate-700 shadow-lg shadow-indigo-500/20">
            <img src="/logo.png" alt="ResourceAI Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0B1736] dark:text-white font-sans">
                Resource<span className="bg-gradient-to-r from-stripe-indigo to-stripe-cyan bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-stripe-indigo dark:text-stripe-cyan border border-indigo-500/20">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">India Allocation Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <LogIn className="w-4 h-4 text-stripe-indigo" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setShowAuthModal(true)}
            className="group relative px-6 py-2.5 rounded-2xl bg-[#0B1736] dark:bg-white text-white dark:text-[#0B1736] text-xs font-bold shadow-stripe hover:shadow-stripe-hover transition-all duration-300 flex items-center space-x-2 active:scale-95"
          >
            <span>Launch Operations Hub</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.nav>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-16 lg:pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* Hero Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-subtle mb-8 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-stripe-cyan animate-pulse" />
          <span className="tracking-wide">AI-Driven Scarce Resource Allocation Optimizer for India</span>
        </motion.div>

        {/* Hero Heading (64-80px on desktop) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-hero-lg font-extrabold tracking-tight text-[#0B1736] dark:text-white max-w-5xl leading-[1.08] font-sans"
        >
          Predictive Optimization for{' '}
          <span className="bg-gradient-to-r from-stripe-indigo via-stripe-cyan to-stripe-teal bg-clip-text text-transparent">
            Scarce Resource Allocation
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal"
        >
          Empowering hospital admins, NDRF disaster coordinators, and education officials across India to route ICU beds, oxygen, food kits, and teachers where urgency is highest.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
        >
          <button
            onClick={() => setShowAuthModal(true)}
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#173B8F] via-[#4F46E5] to-[#22D3EE] text-white text-sm font-bold shadow-stripe hover:shadow-stripe-hover transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Executive Sign In & Demo</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>

          <button
            onClick={() => {
              loginAs('Global Operations Chief');
              setActiveTab('map');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold shadow-subtle hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-stripe-indigo" />
            <span>Explore GIS Urgency Map</span>
          </button>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* EXECUTIVE PERSONA SELECTION CARDS                            */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 w-full max-w-4xl"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Select an Executive Persona to Experience Live Dashboard:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Healthcare Admin */}
            <motion.div
              whileHover={{ y: -8 }}
              onClick={() => {
                setDomain('healthcare');
                loginAs('Hospital Network Administrator');
                setActiveTab('healthcare-dashboard');
              }}
              className="group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 p-6 rounded-3xl cursor-pointer text-left transition-all duration-300 shadow-stripe hover:shadow-stripe-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-[#0B1736] dark:text-white">Healthcare Ops</h3>
                <ChevronRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ICU beds, ventilators & 47L oxygen cylinders across AIIMS, KEM & PGIMER trauma centers.
              </p>
            </motion.div>

            {/* Disaster Relief Commander */}
            <motion.div
              whileHover={{ y: -8 }}
              onClick={() => {
                setDomain('disaster');
                loginAs('Disaster Relief Commander');
                setActiveTab('disaster-dashboard');
              }}
              className="group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 p-6 rounded-3xl cursor-pointer text-left transition-all duration-300 shadow-stripe hover:shadow-stripe-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-[#0B1736] dark:text-white">Disaster Relief</h3>
                <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ration food packs, water purification kits & medical tents across Assam flood & Odisha cyclone camps.
              </p>
            </motion.div>

            {/* Education Board Official */}
            <motion.div
              whileHover={{ y: -8 }}
              onClick={() => {
                setDomain('education');
                loginAs('Education Board Official');
                setActiveTab('education-dashboard');
              }}
              className="group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 p-6 rounded-3xl cursor-pointer text-left transition-all duration-300 shadow-stripe hover:shadow-stripe-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-[#0B1736] dark:text-white">Education Equity</h3>
                <ChevronRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                STEM teachers, PM-eVIDYA tablets & Atal Tinkering Lab grants across Kendriya & Navodaya Vidyalayas.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE HIGHLIGHT GRID WITH SCROLL ANIMATIONS                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80 w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-section-md font-bold text-[#0B1736] dark:text-white font-sans">
            Engineered for High-Stakes Indian Crisis Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            Combining multi-criteria decision analysis, linear knapsack optimization, and explainable AI narrative generation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-stripe transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#173B8F] to-[#4F46E5] flex items-center justify-center text-white shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1736] dark:text-white">Greedy LP Optimization</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-criteria decision analysis factoring crisis severity, stock shortage %, logarithmic population density, and road transit accessibility.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-stripe transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14B8A6] to-[#84CC16] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1736] dark:text-white">Explainability & Overrides</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every recommendation includes natural language narrative rationale. Decision makers can override quantities with live impact coverage recalculation.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-stripe transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#173B8F] flex items-center justify-center text-white shadow-md">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1736] dark:text-white">Prophet Predictive Demand</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Time-series exponential smoothing models predict 30-day demand curves so resources can be pre-positioned before disaster peaks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-10 px-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#0B1736]/50">
        <p>© 2026 ResourceAI India Operations. Designed for NDMA & National Crisis Taskforces.</p>
      </footer>
    </div>
  );
};
