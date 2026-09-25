"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import { useAppStore } from '@/store/useAppStore';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRoute } = useAppStore();
  const assistantRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Close when clicking outside on desktop
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
    <>
      {/* Viewport boundary for dragging constraints */}
      <div
        ref={constraintsRef}
        className="fixed inset-3 bottom-20 sm:bottom-6 pointer-events-none z-40"
      />

      {/* Mobile Backdrop when chat is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-2xs z-45"
          />
        )}
      </AnimatePresence>

      {/* Main Draggable Chat Bubble Container */}
      <motion.div
        ref={assistantRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 touch-none select-none"
      >
        {/* Expanded Chat Box */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="fixed sm:relative inset-x-3 bottom-20 sm:inset-x-auto sm:bottom-auto w-auto sm:w-[400px] max-w-[calc(100vw-1.5rem)] sm:max-w-none shadow-2xl rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 z-50"
            >
              {/* Embedded Chat Header Close Trigger */}
              <div className="absolute top-3.5 right-12 z-20">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                  title="Đóng chat"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <ChatPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Toggle Button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
          onClick={() => {
            if (isDraggingRef.current) return;
            setIsOpen(!isOpen);
          }}
          className="relative h-14 w-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-grab active:cursor-grabbing bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 shadow-blue-500/35 border-2 border-white/30 dark:border-slate-800 active:scale-95 transition-shadow"
          aria-label="Hỗ trợ AI Mặt trận số"
          title="Bấm để mở chat hoặc kéo để di chuyển bong bóng"
        >
          {isOpen ? (
            <X className="h-6 w-6 pointer-events-none" />
          ) : (
            <div className="relative pointer-events-none">
              <MessageSquareText className="h-6 w-6 pointer-events-none" />
              {/* Online status indicator */}
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
