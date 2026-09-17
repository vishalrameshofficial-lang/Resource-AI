import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  MapPin, 
  ArrowUpRight, 
  Activity,
  ChevronRight,
  Truck,
  Sliders
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useApp } from '../context/AppContext';
import { Domain } from '../types';
import { PageHeading } from '../components/common/PageHeading';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { LiveResourceMonitor } from '../components/reallocation/LiveResourceMonitor';

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

export const DashboardPage: React.FC = () => {
  const { 
    domain, 
    setDomain, 
    locations, 
    categories, 
    recommendations, 
    activityLogs, 
    setSelectedAllocationModal, 
    setSelectedLocationId, 
    setActiveTab,
    runOptimization,
    setIsSimulationOpen 
  } = useApp();

  const totalLocations = locations.length;
  const criticalCount = locations.filter(l => l.urgencyLevel === 'critical').length;
  const totalStockAvailable = categories.reduce((sum, c) => sum + c.availableStock, 0);
  const totalStockAllocated = categories.reduce((sum, c) => sum + c.allocatedStock, 0);
  const coverageRatio = Math.round((totalStockAllocated / Math.max(1, totalStockAvailable + totalStockAllocated)) * 100);

  const rankedLocations = [...locations].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 pb-16 relative z-10"
    >
      {/* Sub-Dashboard Title Rule: Executive Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          prefixText=""
          highlightText="Executive Overview"
          suffixText=""
          subtitle={`Real-time multi-criteria decision scoring across ${totalLocations} monitored location nodes in India.`}
        />

        <div className="flex items-center space-x-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(16,42,67,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulationOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#102A43] text-xs font-bold border border-[#E5EAF0] shadow-sm flex items-center space-x-2 transition-all duration-200"
          >
            <Sliders className="w-4 h-4 text-[#1677E8]" />
            <span>What-If Simulation</span>
          </motion.button>

          <div className="flex items-center bg-slate-100/80 p-1 rounded-full border border-[#E5EAF0]">
            {(['healthcare', 'disaster', 'education'] as Domain[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDomain(d);
                  if (d === 'healthcare') setActiveTab('healthcare-dashboard');
                  else if (d === 'disaster') setActiveTab('disaster-dashboard');
                  else setActiveTab('education-dashboard');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                  domain === d 
                    ? 'bg-[#102A43] text-white shadow-sm font-extrabold scale-[1.02]' 
                    : 'text-[#64748B] hover:text-[#102A43]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Summary Cards Grid (4 Cards - Staggered Fade and Rise) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Card 1: Critical Urgency Count */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(239,68,68,0.12)] bg-gradient-to-br from-rose-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#EF4444] uppercase tracking-wider">Critical Priority Nodes</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4.5 h-4.5 text-[#EF4444]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
              <AnimatedCounter value={criticalCount} duration={1100} />
            </div>
            <div className="flex items-center text-xs font-extrabold text-[#EF4444] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+{Math.round((criticalCount / totalLocations) * 100)}%</span>
            </div>
          </div>
          <div className="h-8 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={locations.slice(0, 8)}>
                <Line type="monotone" dataKey="severityScore" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card 2: Total Available Stock */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,119,232,0.12)] bg-gradient-to-br from-blue-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#1677E8] uppercase tracking-wider">Available Stock Pool</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
              <Package className="w-4.5 h-4.5 text-[#1677E8]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
              <AnimatedCounter value={totalStockAvailable} duration={1200} />
            </div>
            <div className="flex items-center text-xs font-extrabold text-[#16A974] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
              <span>Ready</span>
            </div>
          </div>
          <div className="h-8 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categories}>
                <Line type="monotone" dataKey="availableStock" stroke="#1677e8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card 3: System Allocation Efficiency */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,184,166,0.12)] bg-gradient-to-br from-teal-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#16B8A6] uppercase tracking-wider">System Coverage Rate</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4.5 h-4.5 text-[#16B8A6]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-[34px] font-black text-[#16A974] leading-none tracking-tight">
              <AnimatedCounter value={coverageRatio} duration={1100} formatter={(v) => `${v}%`} />
            </div>
            <div className="flex items-center text-xs font-extrabold text-[#16A974] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>+8.4%</span>
            </div>
          </div>
          <div className="h-8 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={locations.slice(0, 10)}>
                <Line type="monotone" dataKey="occupancyOrDeficitPct" stroke="#16a974" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card 4: Pending AI Proposals */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)] bg-gradient-to-br from-amber-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#F59E0B] uppercase tracking-wider">Pending AI Proposals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-[34px] font-black text-[#F59E0B] leading-none tracking-tight">
              <AnimatedCounter value={recommendations.length} duration={1000} />
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center text-xs font-bold text-[#F59E0B] hover:underline"
            >
              <span>Inspect</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
          <div className="pt-1">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => runOptimization()}
              className="w-full py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#F59E0B] text-xs font-extrabold border border-amber-200 transition-colors shadow-xs"
            >
              Re-run Optimization Algorithm
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Dynamic Reallocation Engine: Live Resource Monitor Panel */}
      <LiveResourceMonitor />

      {/* Main Grid: Priority Leaderboard + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ranked Priority Leaderboard */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#1677E8]" />
                </div>
                <span>Ranked Urgent Locations Leaderboard</span>
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Top location nodes in India ranked by Multi-Criteria Priority Score (0-100)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs text-[#1677E8] hover:text-[#1366C8] font-bold flex items-center space-x-1"
            >
              <span>Full GIS Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {rankedLocations.map((loc, index) => {
              const rec = recommendations.find(r => r.locationId === loc.id);
              const isCritical = loc.urgencyLevel === 'critical';

              return (
                <motion.div
                  key={loc.id}
                  variants={itemVariants}
                  className="bg-slate-50/70 border border-[#E5EAF0] hover:border-[#1677E8]/40 hover:bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-xs hover:shadow-md group"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#E5EAF0] font-mono text-xs font-black text-[#102A43] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#1677E8] group-hover:text-white group-hover:border-[#1677E8] transition-colors">
                      #{index + 1}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-[#102A43]">{loc.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          isCritical ? 'bg-rose-50 text-[#EF4444] border-rose-200' : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                        }`}>
                          {loc.urgencyLevel}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center space-x-3">
                        <span>Deficit Stress: <strong className="text-[#102A43]">{loc.occupancyOrDeficitPct}%</strong></span>
                        <span>•</span>
                        <span>Severity: <strong className="text-[#102A43]">{loc.severityScore}/10</strong></span>
                        <span>•</span>
                        <span>Pop: <strong className="text-[#102A43]">{loc.population.toLocaleString()}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-[#64748B]">Priority Score</p>
                      <p className="text-base font-black text-[#1677E8]">{loc.priorityScore}%</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(22,119,232,0.25)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedLocationId(loc.id);
                        if (rec) {
                          setSelectedAllocationModal(rec);
                        } else {
                          setActiveTab('map');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1677E8] to-[#08A8C8] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{rec ? 'Dispatch Rec' : 'Inspect Node'}</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right 1 Col: Recent Activity Feed */}
        <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] flex flex-col">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
            <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#16A974]" />
              </div>
              <span>Allocation Activity Stream</span>
            </h2>
            <button
              onClick={() => setActiveTab('activity-dashboard')}
              className="text-xs text-[#1677E8] hover:text-[#1366C8] font-bold transition-colors"
            >
              Audit Log
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 flex-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50/70 border border-[#E5EAF0] rounded-2xl p-4 space-y-1 shadow-xs hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#102A43]">{log.action}</span>
                  <span className="text-[10px] font-mono text-[#64748B] font-bold">{log.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-[#1677E8]">{log.locationName}</p>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

