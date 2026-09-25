"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface ToastItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function Toast() {
  const { notifications } = useAppStore();
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const timerMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear individual timer if exists
    if (timerMapRef.current.has(id)) {
      clearTimeout(timerMapRef.current.get(id)!);
      timerMapRef.current.delete(id);
    }
    processedIdsRef.current.add(id);
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Monitor notifications and display new ones as toasts
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    // Check all new notifications created "Vừa xong" that haven't been processed yet
    const newItems = notifications.filter(
      n => n.time === 'Vừa xong' && !processedIdsRef.current.has(n.id)
    );

    if (newItems.length > 0) {
      newItems.forEach(item => {
        processedIdsRef.current.add(item.id);

        // Schedule individual auto-dismiss after 4.5 seconds
        const timer = setTimeout(() => {
          removeToast(item.id);
        }, 4500);

        timerMapRef.current.set(item.id, timer);
      });

      setActiveToasts(prev => [...newItems.reverse(), ...prev].slice(0, 3));
    }
  }, [notifications, removeToast]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timerMapRef.current.forEach(timer => clearTimeout(timer));
      timerMapRef.current.clear();
    };
  }, []);

  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10 dark:shadow-black/40"
          >
            <div className="flex-shrink-0 mt-0.5">
              {icons[toast.type as keyof typeof icons] || icons.info}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {toast.title}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                {toast.description}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              title="Đóng thông báo"
              className="flex-shrink-0 p-1.5 -mr-1 -mt-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
