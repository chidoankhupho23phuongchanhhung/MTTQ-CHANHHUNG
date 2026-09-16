"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home, MessageSquare, Newspaper, Compass, Bot,
  Briefcase, Calendar, LogOut, Sparkles
} from 'lucide-react';

export default function MobileNav() {
  const { setCurrentRoute, viewMode, setViewMode } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const isStaff = viewMode === 'staff';

  const navItems = isStaff
    ? [
        { id: '/cong-lam-viec-can-bo', label: "Tổng quan", icon: Briefcase },
        { id: '/tong-dai-ai', label: "Soạn thảo AI", icon: Bot, isSpecial: true },
        { id: '/lich-su-kien', label: "Lịch họp", icon: Calendar },
        { id: 'exit', label: "Thoát", icon: LogOut }
      ]
    : [
        { id: '/', label: "Trang chủ", icon: Home },
        { id: '/tin-tuc', label: "Tin tức", icon: Newspaper },
        { id: '/tong-dai-ai', label: "Trợ lý AI", icon: Bot, isSpecial: true },
        { id: '/phan-anh', label: "Phản ánh", icon: MessageSquare },
        { id: '/khong-gian-van-hoa-hcm', label: "Thư viện", icon: Compass }
      ];

  const handleNavigate = (id: string) => {
    if (id === 'exit') {
      setViewMode('citizen');
      setCurrentRoute('/');
      router.push('/');
    } else {
      setCurrentRoute(id);
      router.push(id);
    }
  };

  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Mobile Tab Bar Container */}
      <div className="mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 py-1 h-16 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'exit' ? false : (pathname === item.id);

          if (item.isSpecial) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigate(item.id)}
                className="relative -top-3 flex flex-col items-center justify-center focus:outline-none cursor-pointer"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200",
                  isActive
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/20 shadow-blue-500/40"
                    : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-600/30"
                )}>
                  <Bot className="h-6 w-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black mt-1 text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all select-none cursor-pointer",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-black"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
              )}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 w-6 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "stroke-[2.5px]" : "stroke-[1.8px]")} />
              <span className="text-[10px] tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
