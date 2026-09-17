import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  Clock,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MOCK_HISTORICAL_TRENDS } from '../data/mockData';
import { PageBackground } from '../components/common/PageBackground';
import { PageHeading } from '../components/common/PageHeading';

export const AnalyticsPage: React.FC = () => {
  const { domain, addToast, locations } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Real CSV Export Generator
  const exportCSV = () => {
    try {
      const headers = ['Date', 'Demand', 'Supply', 'Allocated', 'Forecast Upper Bound', 'Forecast Lower Bound'];
      const rows = MOCK_HISTORICAL_TRENDS.map(pt => [
        `"${pt.date}"`,
        pt.demand,
        pt.supply,
        pt.allocated,
        pt.forecastUpper,
        pt.forecastLower
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ResourceAI_${domain.toUpperCase()}_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast(`Downloaded ${domain.toUpperCase()} analytics report (.CSV)`, 'success');
    } catch (e) {
      addToast('Failed to generate CSV export', 'warning');
    }
  };

  // Real Executive Summary PDF/Print Trigger
  const exportPDF = () => {
    window.print();
    addToast(`Opened Executive PDF Print View for ${domain.toUpperCase()}`, 'info');
  };

  return (
    <PageBackground>
      <div className="space-y-6 pb-16">
        {/* Page Title & Highlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeading
            category="CORE OPERATIONS"
            title="Prophet Analytics"
            highlightKeyword="Analytics"
            description="Time-series forecasting, historical coverage curves, and optimization model confidence metrics."
          />

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#102A43] text-xs font-semibold border border-[#E5EAF0] flex items-center space-x-1.5 transition-colors shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportPDF}
              className="px-3.5 py-2 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-md shadow-blue-500/10 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Executive PDF Report</span>
            </button>
          </div>
        </div>

        {/* Model Performance Cards (4 Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-4 space-y-2 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Forecast Model Accuracy</span>
              <Target className="w-4 h-4 text-[#16A974]" />
            </div>
            <p className="text-2xl font-extrabold text-[#102A43]">94.8%</p>
            <p className="text-[11px] text-[#16A974] font-medium">Prophet Time-Series R² Confidence</p>
          </div>

          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-4 space-y-2 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Mean Response Dispatch Time</span>
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-extrabold text-[#F59E0B]">1.4 hrs</p>
            <p className="text-[11px] text-slate-500">-32 mins improvement vs manual routing</p>
          </div>

          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-4 space-y-2 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Systemic Coverage Efficiency</span>
              <ShieldCheck className="w-4 h-4 text-[#1677E8]" />
            </div>
            <p className="text-2xl font-extrabold text-[#1677E8]">89.2%</p>
            <p className="text-[11px] text-[#1677E8] font-medium">Optimal multi-knapsack LP solver score</p>
          </div>

          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-4 space-y-2 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Total Nodes Tracked</span>
              <Sparkles className="w-4 h-4 text-[#7257E8]" />
            </div>
            <p className="text-2xl font-extrabold text-[#102A43]">{locations.length}</p>
            <p className="text-[11px] text-slate-500">Continuous 5-min telemetry polling</p>
          </div>
        </div>

        {/* Main Chart 1: Historical Demand vs Supply with Prophet Forecast Shading */}
        <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-5 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAF0] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#1677E8]" />
                <span>30-Day Demand vs Supply Prophet Predictive Forecast</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Includes 95% confidence bounds for next 7-14 days forecast projection curve
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-[#F4F7FA] p-1 rounded-xl border border-[#E5EAF0] self-start sm:self-auto">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    timeRange === r ? 'bg-[#1677E8] text-white shadow-sm' : 'text-slate-600 hover:text-[#102A43]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORICAL_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677E8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1677E8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A974" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#16A974" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5EAF0', borderRadius: '12px', fontSize: '12px', color: '#102A43', boxShadow: '0 4px 18px rgba(15,23,42,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="forecastUpper" stroke="#7257E8" strokeDasharray="4 4" fill="none" name="Prophet Forecast Upper Bound" />
                <Area type="monotone" dataKey="demand" stroke="#1677E8" strokeWidth={3} fillOpacity={1} fill="url(#demandGrad)" name="Total Resource Demand" />
                <Area type="monotone" dataKey="supply" stroke="#16A974" strokeWidth={2} fillOpacity={1} fill="url(#supplyGrad)" name="Available Supply Pool" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Stress & Allocation Breakdown */}
        <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-5 space-y-4 shadow-card">
          <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#7257E8]" />
            <span>Regional Deficit Stress & Capacity Comparison</span>
          </h2>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locations.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} interval={0} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5EAF0', borderRadius: '12px', fontSize: '12px', color: '#102A43', boxShadow: '0 4px 18px rgba(15,23,42,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="occupancyOrDeficitPct" name="Deficit Stress (%)" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="priorityScore" name="Priority Score" fill="#1677E8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};
