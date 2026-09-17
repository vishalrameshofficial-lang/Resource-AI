import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  ShieldAlert, 
  GraduationCap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Domain } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, setDomain } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Global Operations Chief');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole || 'Global Operations Chief');
    onClose();
  };

  const handleQuickLogin = (role: string, dom: Domain) => {
    setDomain(dom);
    loginAs(role);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#060D20]/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white dark:bg-[#0B1736] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-stripe-hover overflow-hidden flex flex-col"
        >
          {/* Top Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-slate-700 shadow-md shadow-indigo-500/20">
                <img src="/logo.png" alt="ResourceAI Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B1736] dark:text-white font-sans">
                  Executive Sign In
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ResourceAI Operations Portal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 space-y-5">
            {/* Quick 1-Click Executive Presets */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                1-Click Quick Demo Sign In:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Hospital Network Administrator', 'healthcare')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 text-center transition-all duration-200 hover:scale-[1.02] shadow-subtle group"
                >
                  <Activity className="w-5 h-5 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Healthcare</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Disaster Relief Commander', 'disaster')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 text-center transition-all duration-200 hover:scale-[1.02] shadow-subtle group"
                >
                  <ShieldAlert className="w-5 h-5 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Disaster</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Education Board Official', 'education')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 text-center transition-all duration-200 hover:scale-[1.02] shadow-subtle group"
                >
                  <GraduationCap className="w-5 h-5 text-indigo-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Education</span>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Or sign in with email</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="aarav.sharma@resourceai.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-stripe-indigo"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-stripe-indigo"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group w-full py-3 rounded-2xl bg-gradient-to-r from-[#173B8F] via-[#4F46E5] to-[#22D3EE] text-white text-xs font-bold shadow-stripe hover:shadow-stripe-hover transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Command Center</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
