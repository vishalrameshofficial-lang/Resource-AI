import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Download, 
  Clock, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeading } from '../components/common/PageHeading';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
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

export const ActivityStreamPage: React.FC = () => {
  const { activityLogs, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || log.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  // Real CSV Download Generator
  const exportAuditLogCSV = () => {
    try {
      const headers = ['Log ID', 'Timestamp', 'Domain', 'Action', 'Location Name', 'Details', 'Status'];
      const rows = filteredLogs.map(log => [
        `"${log.id}"`,
        `"${log.timestamp}"`,
        `"${log.domain.toUpperCase()}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.locationName.replace(/"/g, '""')}"`,
        `"${log.details.replace(/"/g, '""')}"`,
        `"${log.status.toUpperCase()}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ResourceAI_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Downloaded official allocation dispatch audit log (.CSV)', 'success');
    } catch (err) {
      addToast('Failed to export CSV audit log', 'warning');
    }
  };

  // Status color helper according to requirements
  const getBadgeStyle = (domain: string, status: string) => {
    if (status === 'success') {
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-[#16A974]" />,
        badgeBg: 'bg-[#16A974]/10 text-[#16A974] border-[#16A974]/30',
        domainBadge: 'bg-emerald-50 text-[#16A974] border-emerald-200'
      };
    }
    if (status === 'warning' || domain === 'disaster') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
        badgeBg: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
        domainBadge: 'bg-amber-50 text-[#F59E0B] border-amber-200'
      };
    }
    if (domain === 'education') {
      return {
        icon: <Info className="w-5 h-5 text-[#7257E8]" />,
        badgeBg: 'bg-[#7257E8]/10 text-[#7257E8] border-[#7257E8]/30',
        domainBadge: 'bg-purple-50 text-[#7257E8] border-purple-200'
      };
    }
    if (domain === 'healthcare') {
      return {
        icon: <Activity className="w-5 h-5 text-[#16B8A6]" />,
        badgeBg: 'bg-[#16B8A6]/10 text-[#16B8A6] border-[#16B8A6]/30',
        domainBadge: 'bg-teal-50 text-[#16B8A6] border-teal-200'
      };
    }
    return {
      icon: <Info className="w-5 h-5 text-[#1677E8]" />,
      badgeBg: 'bg-[#1677E8]/10 text-[#1677E8] border-[#1677E8]/30',
      domainBadge: 'bg-blue-50 text-[#1677E8] border-blue-200'
    };
  };

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
          highlightText="Activity System"
          suffixText=""
          subtitle="Track real-time events, audit logs, system activities, and important updates across all domains and services."
        />

        <div className="shrink-0">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(22,119,232,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={exportAuditLogCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1677E8] to-[#08A8C8] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Ledger (.CSV)</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-[20px] border border-[#E5EAF0] shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search audit log by facility name, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F7FA] border border-[#E5EAF0] rounded-xl pl-10 pr-4 py-2 text-xs text-[#102A43] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1677E8]/30 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <Filter className="w-4 h-4 text-[#64748B]" />
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-[#F4F7FA] border border-[#E5EAF0] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#1677E8]/30 transition-all cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="healthcare">Healthcare</option>
            <option value="disaster">Disaster Relief</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>

      {/* Activity Log Timeline Stream */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
          <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#1677E8]" />
            </div>
            <span>Real-Time Event Stream ({filteredLogs.length} Events)</span>
          </h2>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#16A974]/10 text-[#16A974] border border-[#16A974]/30 shadow-xs">
            <motion.span 
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-[#16A974]" 
            />
            <span>System Live</span>
          </span>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredLogs.map((log) => {
            const styleCfg = getBadgeStyle(log.domain, log.status);

            return (
              <motion.div
                key={log.id}
                variants={itemVariants}
                className="bg-slate-50/70 border border-[#E5EAF0] hover:border-[#1677E8]/40 hover:bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${styleCfg.badgeBg}`}>
                    {styleCfg.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-[#102A43]">{log.action}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${styleCfg.domainBadge}`}>
                        {log.domain}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1677E8]">{log.locationName}</p>
                    <p className="text-xs text-[#64748B] leading-relaxed">{log.details}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                  <span className="text-xs font-mono font-bold text-[#64748B] bg-white px-3 py-1.5 rounded-xl border border-[#E5EAF0] shadow-xs">
                    {log.timestamp}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1677E8] transition-colors group-hover:translate-x-1 duration-150" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

