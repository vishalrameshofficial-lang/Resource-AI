import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ShieldAlert, 
  Waves, 
  Package, 
  Truck, 
  ChevronRight, 
  AlertTriangle,
  Droplets,
  Flame,
  MapPin,
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

export const DisasterDashboard: React.FC = () => {
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

  const disasterLocs = locations.filter(l => l.domain === 'disaster');
  const criticalZones = disasterLocs.filter(l => l.urgencyLevel === 'critical');
  const totalFood = categories.find(c => c.id === 'res-food')?.availableStock || 3800;
  const totalWater = categories.find(c => c.id === 'res-water')?.availableStock || 580;
  const totalTents = categories.find(c => c.id === 'res-medkit')?.availableStock || 145;

  const rankedZones = [...disasterLocs].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);

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
          highlightText="Disaster Relief Command Center"
          suffixText=""
          subtitle="Real-time emergency supply routing, ration distribution, water purification, and medical relief across disaster zones in India."
        />

        <div className="flex items-center space-x-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulationOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#102A43] text-xs font-bold border border-[#E5EAF0] shadow-sm flex items-center space-x-2 transition-all duration-200 active:scale-95 hover:shadow-md"
          >
            <Sliders className="w-4 h-4 text-[#F59E0B]" />
            <span>What-If Simulation</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(245,158,11,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              runOptimization('res-food');
              setActiveTab('map');
            }}
            className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#EF4444] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center space-x-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Dispatch Relief Rations</span>
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
        {/* Card 1: SEVERE CRISIS ZONES */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)] bg-gradient-to-br from-amber-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#F59E0B] uppercase tracking-wider">
              SEVERE CRISIS ZONES
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={criticalZones.length || 15} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-amber-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '88%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              className="bg-[#F59E0B] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-100/60">
            <span className="inline-flex items-center space-x-1.5 font-bold text-[11px] text-[#F59E0B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <motion.span 
                animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" 
              />
              <span>Urgency &gt; 8.5/10</span>
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Assam & Odisha</span>
          </div>
        </motion.div>

        {/* Card 2: RATION FOOD PACKS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(239,68,68,0.12)] bg-gradient-to-br from-rose-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#EF4444] uppercase tracking-wider">
              RATION FOOD PACKS
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shadow-xs">
              <Package className="w-4.5 h-4.5 text-[#EF4444]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalFood} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-rose-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              className="bg-[#EF4444] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-rose-100/60">
            <span className="font-bold text-[11px] text-[#EF4444] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Rice & Dal Crates
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">NDRF Depots</span>
          </div>
        </motion.div>

        {/* Card 3: WATER PURIFICATION KITS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,119,232,0.12)] bg-gradient-to-br from-blue-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#1677E8] uppercase tracking-wider">
              WATER PURIFICATION KITS
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
              <Droplets className="w-4.5 h-4.5 text-[#1677E8]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalWater} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-blue-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
              className="bg-[#1677E8] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-blue-100/60">
            <span className="font-bold text-[11px] text-[#1677E8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Aqua-Pure Units
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Disease control</span>
          </div>
        </motion.div>

        {/* Card 4: EMERGENCY MEDICAL TENTS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(249,115,22,0.12)] bg-gradient-to-br from-orange-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-wider">
              EMERGENCY MEDICAL TENTS
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center shadow-xs">
              <Flame className="w-4.5 h-4.5 text-[#F97316]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalTents} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-orange-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
              className="bg-[#F97316] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-orange-100/60">
            <span className="font-bold text-[11px] text-[#F97316] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Trauma Setup
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Ready for deployment</span>
          </div>
        </motion.div>
      </motion.div>

      {/* DISASTER RELIEF PRIORITY SECTION */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Waves className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <span>Ranked Relief Intervention Priority</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Disaster sectors ranked by population affected, severity rating, and road transit access
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs text-[#1677E8] hover:text-[#1366C8] font-bold flex items-center space-x-1 transition-colors"
          >
            <span>View Disaster Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Disaster Cards Grid with Staggered Fade-Up */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rankedZones.map((zone, idx) => {
            const rec = recommendations.find(r => r.locationId === zone.id);
            const isCritical = zone.urgencyLevel === 'critical';

            return (
              <motion.div
                key={zone.id}
                variants={itemVariants}
                className="bg-slate-50/70 border border-[#E5EAF0] rounded-2xl p-4.5 space-y-3.5 hover:border-[#F59E0B]/40 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#E5EAF0] font-mono text-xs font-black text-[#102A43] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#F59E0B] group-hover:text-white group-hover:border-[#F59E0B] transition-colors">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#102A43]">
                        {zone.name}
                      </h3>
                      <p className="text-xs text-[#64748B] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>📍 {zone.region}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isCritical ? 'bg-rose-50 text-[#EF4444] border-rose-200' : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                  }`}>
                    {zone.urgencyLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#E5EAF0]">
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Deficit Stress</p>
                    <p className="text-sm font-black text-[#EF4444] mt-0.5">{zone.occupancyOrDeficitPct}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Affected Pop</p>
                    <p className="text-sm font-black text-[#102A43] mt-0.5">{zone.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Road Access</p>
                    <p className="text-sm font-black text-[#F59E0B] mt-0.5">{Math.round(zone.accessibilityIndex * 100)}%</p>
                  </div>
                </div>

                {/* Micro progress bar for Deficit Stress */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(zone.occupancyOrDeficitPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * idx }}
                    className={`h-full rounded-full ${isCritical ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#64748B] font-mono">{zone.contactPhone}</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedLocationId(zone.id);
                      if (rec) setSelectedAllocationModal(rec);
                      else setActiveTab('map');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1 active:scale-95"
                  >
                    <span>{rec ? 'Dispatch Relief' : 'Inspect Zone'}</span>
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

