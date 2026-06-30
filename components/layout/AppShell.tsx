"use client";

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import CitizenFooter from './CitizenFooter';
import FloatingAIAssistant from '../ai/FloatingAIAssistant';
import Toast from '../ui/Toast';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { sidebarOpen, toggleSidebar, theme, setCurrentRoute, viewMode, setViewMode } = useAppStore();
  const pathname = usePathname();

  // Sync route state and viewMode with active browser URL path
  useEffect(() => {
    if (pathname) {
      setCurrentRoute(pathname);
      if (['/cong-lam-viec-can-bo', '/thong-ke'].includes(pathname)) {
        setViewMode('staff');
      } else {
        setViewMode('citizen');
      }
    }
  }, [pathname, setCurrentRoute, setViewMode]);

  // Close mobile sidebar on route changes or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        toggleSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  const isStaff = viewMode === 'staff';

  return (
    <div className={cn("min-h-screen flex flex-col relative", theme)}>
      {/* Dynamic Background Graphics & Orbs */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f4f6fa] dark:bg-[#0b0f19] transition-colors duration-300">
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 tech-grid-bg opacity-[0.5] dark:opacity-[0.2]" />
        
        {/* Glowing Orbs */}
        <div className="light-orb-blue top-[-100px] left-[-100px] opacity-70" />
        <div className="light-orb-gold bottom-12 right-1/4 opacity-40" />
        <div className="light-orb-red top-1/3 left-1/2 opacity-30" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-row">
        {/* Sidebar Navigation - Always render (internally handles its own responsiveness) */}
        <Sidebar />

        {/* Backdrop for mobile sidebar drawer with smooth fade transitions */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => toggleSidebar(false)}
              className={cn(
                "fixed inset-0 z-35 bg-slate-900/50 backdrop-blur-xs",
                isStaff ? "xl:hidden" : "md:hidden"
              )}
            />
          )}
        </AnimatePresence>

        {/* Content Panel Wrapper */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 pb-16 xl:pb-0",
          isStaff ? "xl:pl-64" : "xl:pl-0"
        )}>
          {/* Header Bar */}
          <Header />

          {/* Main Body view */}
          <main className="flex-grow focus:outline-none">
            {children}
          </main>

          {/* Site footer for citizens */}
          {!isStaff && <CitizenFooter />}
        </div>
      </div>

      {/* Popups, Chat Bubbles, and Toast Stack */}
      {!isStaff && <FloatingAIAssistant />}
      <MobileNav />
      <Toast />
    </div>
  );
}
