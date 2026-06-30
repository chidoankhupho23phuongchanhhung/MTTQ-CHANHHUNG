"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X, Bot, HelpCircle } from 'lucide-react';
import ChatPanel from './ChatPanel';
import { useAppStore } from '@/store/useAppStore';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRoute } = useAppStore();
  const assistantRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto-hide popup chat panel when on the dedicated chat page to avoid clutter
  if (currentRoute === '/tong-dai-ai') return null;

  return (
    <div ref={assistantRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30, x: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900"
          >
            {/* Embedded Chat Header Close Trigger */}
            <div className="absolute top-3.5 right-12 z-20">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <ChatPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 animate-pulse-glow"
        aria-label="Hỗ trợ AI"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquareText className="h-6 w-6" />
            {/* Status dot */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-blue-600 rounded-full" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
