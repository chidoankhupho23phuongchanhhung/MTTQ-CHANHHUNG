"use client";

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import CitizenFooter from './CitizenFooter';
import FloatingAIAssistant from '../ai/FloatingAIAssistant';
import Toast from '../ui/Toast';
import { cn } from '@/lib/utils';

interface AppShellProps { children: React.ReactNode; }

/* Portal switch transition variants */
const portalTransition = {
  citizen: {
    initial: { opacity: 0, scale: 1.03, filter: 'blur(8px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: 'easeOut' as const } },
    exit:    { opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.35, ease: 'easeIn' as const } }
  },
  staff: {
    initial: { opacity: 0, x: 40, filter: 'blur(8px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: 'easeOut' as const } },
    exit:    { opacity: 0, x: -40, filter: 'blur(6px)', transition: { duration: 0.35, ease: 'easeIn' as const } }
  }
};

export default function AppShell({ children }: AppShellProps) {
  const { sidebarOpen, toggleSidebar, theme, setCurrentRoute, viewMode, setViewMode } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setCurrentRoute(pathname);
      if (['/cong-lam-viec-can-bo', '/thong-ke', '/quan-ly-facebook'].includes(pathname)) {
        setViewMode('staff');
      } else {
        setViewMode('citizen');
      }
    }
  }, [pathname, setCurrentRoute, setViewMode]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1280) toggleSidebar(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  const isStaff = viewMode === 'staff';

  return (
    <div className={cn("min-h-screen flex flex-col relative", theme)}>
      {/* ── Background ── */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f4f6fa] dark:bg-[#0b0f19] transition-colors duration-500">
        <div className="absolute inset-0 tech-grid-bg opacity-[0.5] dark:opacity-[0.2]" />
        <div className="light-orb-blue top-[-100px] left-[-100px] opacity-70" />
        <div className="light-orb-gold bottom-12 right-1/4 opacity-40" />
        <div className="light-orb-red top-1/3 left-1/2 opacity-30" />
        {/* Staff mode tints the BG to darker navy */}
        <AnimatePresence>
          {isStaff && (
            <motion.div
              key="staff-bg-tint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-blue-950/20 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Layout ── */}
      <div className="flex-1 flex flex-row">
        <Sidebar />

        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => toggleSidebar(false)}
              className={cn(
                "fixed inset-0 z-35 bg-slate-900/60 backdrop-blur-sm",
                isStaff ? "xl:hidden" : "md:hidden"
              )}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 pb-16 md:pb-0 transition-all duration-500",
          isStaff ? "xl:pl-72" : "xl:pl-0"
        )}>
          {/* Header — hides nav tabs in staff mode internally */}
          <Header />

          {/* ═══ Portal Transition ═══
              AnimatePresence keyed on viewMode triggers the full-screen
              crossfade + slide/scale whenever the user switches portals.
          */}
          <main className="flex-grow focus:outline-none relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={portalTransition[viewMode as 'citizen' | 'staff'].initial}
                animate={portalTransition[viewMode as 'citizen' | 'staff'].animate}
                exit={portalTransition[viewMode as 'citizen' | 'staff'].exit}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {!isStaff && <CitizenFooter />}
        </div>
      </div>

      {!isStaff && <FloatingAIAssistant />}
      <MobileNav />
      <Toast />
    </div>
  );
}
