"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home, MessageSquare, Newspaper, Compass, Bot,
  Briefcase, Calendar, LogOut, Sparkles, Info,
  LayoutDashboard
} from 'lucide-react';

export default function MobileNav() {
  const { setCurrentRoute, viewMode, setViewMode, toggleSidebar, sidebarOpen } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const isStaff = viewMode === 'staff';

  const navItems = isStaff
    ? [
        { id: '/cong-lam-viec-can-bo', label: "Tổng quan", icon: Briefcase },
        { id: 'dashboard-menu', label: "Menu số", icon: LayoutDashboard },
        { id: '/tong-dai-ai', label: "Trợ lý AI", icon: Sparkles, isSpecial: true },
        { id: '/lich-su-kien', label: "Lịch họp", icon: Calendar },
        { id: 'exit', label: "Thoát", icon: LogOut }
      ]
    : [
        { id: '/', label: "Trang chủ", icon: Home },
        { id: '/hoat-dong-mttq', label: "Giới thiệu", icon: Info },
        { id: '/tong-dai-ai', label: "Trợ lý AI", icon: Sparkles, isSpecial: true },
        { id: '/phan-anh', label: "Phản ánh", icon: MessageSquare },
        { id: '/khong-gian-van-hoa-hcm', label: "Thư viện", icon: Compass }
      ];

  const handleNavigate = (id: string) => {
    if (id === 'exit') {
      setViewMode('citizen');
      setCurrentRoute('/');
      router.push('/');
    } else if (id === 'dashboard-menu') {
      toggleSidebar();
    } else {
      setCurrentRoute(id);
      router.push(id);
    }
  };

  return (
    <nav 
      aria-label="Google M3 Mobile Navigation" 
      className="fixed bottom-0 inset-x-0 z-40 md:hidden pointer-events-auto"
    >
      {/* Google Material 3 Navigation Bar Container */}
      <div className="bg-white/95 dark:bg-[#1a1c1e]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] flex items-center justify-around px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] h-[70px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'exit'
            ? false
            : item.id === 'dashboard-menu'
              ? sidebarOpen
              : (pathname === item.id);

          // Google AI Special Pill (Gemini Floating pill style)
          if (item.isSpecial) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleNavigate(item.id)}
                className="relative -top-3.5 flex flex-col items-center justify-center focus:outline-none cursor-pointer select-none group"
                aria-label={item.label}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                  "bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 text-white",
                  isActive
                    ? "ring-4 ring-blue-500/30 shadow-blue-500/50 scale-105"
                    : "shadow-blue-600/30 group-hover:scale-105"
                )}>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black mt-1 text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  {item.label}
                </span>
              </motion.button>
            );
          }

          // Google M3 Standard Navigation Item with Active Pill Indicator
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 px-1 focus:outline-none cursor-pointer select-none group"
              aria-label={item.label}
            >
              {/* Google M3 Active Indicator Pill */}
              <div className="relative flex items-center justify-center min-w-[56px] h-8">
                {isActive && (
                  <motion.div
                    layoutId="m3-active-pill"
                    className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/40"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5 transition-transform duration-200 group-hover:scale-105",
                    isActive
                      ? "text-blue-700 dark:text-blue-300 stroke-[2.4px]"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 stroke-[1.8px]"
                  )}
                />
              </div>

              {/* Google M3 Label */}
              <span
                className={cn(
                  "text-[10.5px] mt-0.5 tracking-tight transition-colors duration-200 truncate max-w-[68px] text-center",
                  isActive
                    ? "font-bold text-blue-700 dark:text-blue-300"
                    : "font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
