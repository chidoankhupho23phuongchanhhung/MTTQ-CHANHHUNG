"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Toast() {
  const { notifications } = useAppStore();
  const [activeToasts, setActiveToasts] = useState<any[]>([]);

  // Monitor notifications and display new ones as toasts
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0]; // Get the newest notification
      // Only show as toast if it was created "Vừa xong"
      if (latest.time === 'Vừa xong' && !activeToasts.some(t => t.id === latest.id)) {
        setActiveToasts(prev => [latest, ...prev].slice(0, 3)); // Max 3 toasts at a time

        // Auto-dismiss after 4 seconds
        const timer = setTimeout(() => {
          setActiveToasts(prev => prev.filter(t => t.id !== latest.id));
        }, 4000);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications, activeToasts]);

  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />
  };

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-2xl"
          >
            <div className="flex-shrink-0 mt-0.5">
              {icons[toast.type as keyof typeof icons] || icons.info}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {toast.title}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {toast.description}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
