"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import { useAppStore } from '@/store/useAppStore';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRoute } = useAppStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Close when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        bubbleRef.current &&
        !bubbleRef.current.contains(target)
      ) {
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

      {/* Expanded Chat Box (RENDERED INDEPENDENTLY FROM DRAGGABLE BUBBLE) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-2xs z-50"
            />

            {/* Chat Box Container - Fixed cleanly on both mobile and desktop */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed inset-x-3 bottom-20 sm:inset-x-auto sm:right-6 sm:bottom-22 w-auto sm:w-[410px] max-w-[calc(100vw-1.5rem)] sm:max-w-none z-55 shadow-2xl rounded-2xl overflow-hidden"
            >
              <ChatPanel onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Draggable Bubble Button (ONLY THE BUBBLE IS DRAGGABLE) */}
      <motion.div
        ref={bubbleRef}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 touch-none select-none"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
          onClick={() => {
            if (isDraggingRef.current) return;
            setIsOpen(prev => !prev);
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
        </motion.button>
      </motion.div>
    </>
  );
}
