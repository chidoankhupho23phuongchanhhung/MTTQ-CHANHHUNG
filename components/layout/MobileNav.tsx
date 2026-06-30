"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, MessageSquare, Newspaper, Compass, Bot, Briefcase, Calendar, LogOut } from 'lucide-react';

export default function MobileNav() {
  const { setCurrentRoute, viewMode, setViewMode } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const isStaff = viewMode === 'staff';

  const navItems = isStaff
    ? [
        { id: '/cong-lam-viec-can-bo', label: "Tổng quan", icon: Briefcase },
        { id: '/tong-dai-ai', label: "Soạn thảo AI", icon: Bot },
        { id: '/lich-su-kien', label: "Lịch họp", icon: Calendar },
        { id: 'exit', label: "Thoát", icon: LogOut }
      ]
    : [
        { id: '/', label: "Trang chủ", icon: Home },
        { id: '/tin-tuc', label: "Tin tức", icon: Newspaper },
        { id: '/phan-anh', label: "Phản ánh", icon: MessageSquare },
        { id: '/khong-gian-van-hoa-hcm', label: "Thư viện", icon: Compass },
        { id: '/tong-dai-ai', label: "Trợ lý AI", icon: Bot }
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
    <div className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-around px-2 shadow-lg md:hidden pb-safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === 'exit' ? false : (pathname === item.id);

        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-full transition-all cursor-pointer select-none",
              isActive 
                ? "text-blue-650 dark:text-blue-400 font-extrabold scale-105" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
            )}
          >
            <Icon className={cn("h-5.5 w-5.5", isActive ? "stroke-[2.5px]" : "stroke-[1.8px]")} />
            <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
