import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Laptop, 
  Truck, 
  ChevronRight, 
  Award,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeading } from '../components/common/PageHeading';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  }
};

export const EducationDashboard: React.FC = () => {
  const { 
    locations, 
    categories, 
    recommendations, 
    setSelectedAllocationModal, 
    setSelectedLocationId, 
    setActiveTab,
    runOptimization,
    setIsSimulationOpen
  } = useApp();

  const eduLocs = locations.filter(l => l.domain === 'education');
  const criticalSchools = eduLocs.filter(l => l.urgencyLevel === 'critical' || l.urgencyLevel === 'high');
  const totalTeachers = categories.find(c => c.id === 'res-teacher')?.availableStock || 160;
  const totalTablets = categories.find(c => c.id === 'res-tablet')?.availableStock || 3500;
  const totalLabs = categories.find(c => c.id === 'res-stem')?.availableStock || 120;

  const rankedSchools = [...eduLocs].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 pb-16 relative z-10"
    >
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          prefixText=""
          highlightText="Education Equity"
          suffixText=""
          subtitle="Optimizing STEM educator deployment, PM-eVIDYA tablets, and Atal Tinkering Lab grants across government schools in India."
        />

        <div className="flex items-center space-x-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulationOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#102A43] text-xs font-bold border border-[#E5EAF0] shadow-sm flex items-center space-x-2 transition-all duration-200 active:scale-95 hover:shadow-md"
          >
            <Sliders className="w-4 h-4 text-[#7257E8]" />
            <span>What-If Simulation</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(114,87,232,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              runOptimization('res-teacher');
              setActiveTab('map');
            }}
            className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7257E8] via-[#6366F1] to-[#1677E8] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center space-x-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Deploy STEM Educators</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      </div>

      {/* KPI Cards Grid (Staggered Fade and Rise Into Place) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Card 1: TEACHER DEFICIT SCHOOLS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(114,87,232,0.12)] bg-gradient-to-br from-purple-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#7257E8] uppercase tracking-wider">
              TEACHER DEFICIT SCHOOLS
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shadow-xs">
              <Building2 className="w-4.5 h-4.5 text-[#7257E8]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={criticalSchools.length || 26} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-purple-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '84%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              className="bg-[#7257E8] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-purple-100/60">
            <span className="inline-flex items-center space-x-1.5 font-bold text-[11px] text-[#7257E8] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <motion.span 
                animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#7257E8]" 
              />
              <span>High Dropout Risk</span>
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Immediate Reposting</span>
          </div>
        </motion.div>

        {/* Card 2: STEM EDUCATORS RESERVE */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,119,232,0.12)] bg-gradient-to-br from-blue-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#1677E8] uppercase tracking-wider">
              STEM EDUCATORS RESERVE
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
              <Users className="w-4.5 h-4.5 text-[#1677E8]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalTeachers || 160} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-blue-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              className="bg-[#1677E8] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-blue-100/60">
            <span className="font-bold text-[11px] text-[#1677E8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Certified Educators
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">District Posting</span>
          </div>
        </motion.div>

        {/* Card 3: PM-eVIDYA TABLETS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,184,166,0.12)] bg-gradient-to-br from-teal-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#16B8A6] uppercase tracking-wider">
              PM-eVIDYA TABLETS
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shadow-xs">
              <Laptop className="w-4.5 h-4.5 text-[#16B8A6]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalTablets || 3500} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-teal-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '90%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
              className="bg-[#16B8A6] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-teal-100/60">
            <span className="font-bold text-[11px] text-[#16B8A6] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Pre-loaded Devices
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Ready for Shipping</span>
          </div>
        </motion.div>

        {/* Card 4: ATAL TINKERING LAB KITS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)] bg-gradient-to-br from-amber-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#F59E0B] uppercase tracking-wider">
              ATAL TINKERING LAB KITS
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <Award className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalLabs || 120} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-amber-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
              className="bg-[#F59E0B] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-100/60">
            <span className="font-bold text-[11px] text-[#F59E0B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Robotics Grants
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">School Installation</span>
          </div>
        </motion.div>
      </motion.div>

      {/* SCHOOL PRIORITY SECTION */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#7257E8]" />
              </div>
              <span>Ranked School Intervention Priority</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Schools ranked by student-teacher shortage, dropout risk score, and enrollment capacity
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs text-[#1677E8] hover:text-[#1366C8] font-bold flex items-center space-x-1 transition-colors"
          >
            <span>View School Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* School Cards Grid with Staggered Fade-Up */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rankedSchools.map((sch, idx) => {
            const rec = recommendations.find(r => r.locationId === sch.id);
            const isCritical = sch.urgencyLevel === 'critical';

            return (
              <motion.div
                key={sch.id}
                variants={itemVariants}
                className="bg-slate-50/70 border border-[#E5EAF0] rounded-2xl p-4.5 space-y-3.5 hover:border-[#7257E8]/40 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#E5EAF0] font-mono text-xs font-black text-[#102A43] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#7257E8] group-hover:text-white group-hover:border-[#7257E8] transition-colors">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#102A43]">
                        {sch.name}
                      </h3>
                      <p className="text-xs text-[#64748B] flex items-center space-x-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>📍 {sch.region}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isCritical ? 'bg-rose-50 text-[#EF4444] border-rose-200' : 'bg-purple-50 text-[#7257E8] border-purple-200'
                  }`}>
                    {sch.urgencyLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#E5EAF0]">
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Staff Deficit</p>
                    <p className="text-sm font-black text-[#7257E8] mt-0.5">{sch.occupancyOrDeficitPct}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Students</p>
                    <p className="text-sm font-black text-[#102A43] mt-0.5">{sch.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Risk Score</p>
                    <p className="text-sm font-black text-[#F59E0B] mt-0.5">{sch.severityScore}/10</p>
                  </div>
                </div>

                {/* Micro progress bar for Staff Deficit */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(sch.occupancyOrDeficitPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * idx }}
                    className={`h-full rounded-full ${isCritical ? 'bg-[#EF4444]' : 'bg-[#7257E8]'}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#64748B] font-mono">{sch.contactPhone}</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedLocationId(sch.id);
                      if (rec) setSelectedAllocationModal(rec);
                      else setActiveTab('map');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7257E8] to-[#1677E8] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1 active:scale-95"
                  >
                    <span>{rec ? 'Deploy Teachers' : 'Inspect School'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

