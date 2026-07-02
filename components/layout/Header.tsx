"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, Sun, Moon, Search, LogOut, ArrowRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '../ui/Badge';

export default function Header() {
  const { 
    viewMode, setViewMode, setCurrentRoute, 
    notifications, markNotificationsAsRead, 
    theme, toggleTheme, toggleSidebar 
  } = useAppStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  const handleNotifClick = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const handlePortalSwitch = () => {
    const targetMode = viewMode === 'citizen' ? 'staff' : 'citizen';
    setViewMode(targetMode);
    setCurrentRoute(targetMode === 'staff' ? '/cong-lam-viec-can-bo' : '/');
    router.push(targetMode === 'staff' ? '/cong-lam-viec-can-bo' : '/');
  };

  const isStaff = viewMode === 'staff';

  const navItems = [
    { id: '/', label: 'Trang chủ' },
    { id: '/hoat-dong-mttq', label: 'Giới thiệu' },
    { id: '/tin-tuc', label: 'Tin tức - Sự kiện' },
    { id: '/phan-anh', label: 'Kiến nghị' },
    { id: '/van-ban-bieu-mau', label: 'Văn bản' },
    { id: '/khong-gian-van-hoa-hcm', label: 'Thư viện số' },
    { id: '/lien-he', label: 'Liên hệ' }
  ];

  const handleNavigate = (id: string) => {
    setCurrentRoute(id);
    router.push(id);
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full flex flex-col justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all",
      isStaff ? "h-16" : "h-16 md:h-28"
    )}>
      {/* Top Row: Brand Logo, search and profile controls */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 h-16">
        
        {/* Left brand logo & Hamburger */}
        <div className="flex items-center gap-3">
          {/* Hamburger for staff (tablet/mobile) */}
          {isStaff && (
            <button
              onClick={() => toggleSidebar()}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {/* Hamburger for citizens (mobile drawer) */}
          {!isStaff && (
            <button
              onClick={() => toggleSidebar()}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer active:scale-90 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

            <img 
              src="/mttq-logo.png" 
              alt="Logo MTTQ" 
              className="w-9 h-9 object-contain flex-shrink-0 animate-float" 
            />
            <div className="flex flex-col text-left">
              <h1 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase leading-none tracking-tight">
                {isStaff ? 'Dashboard Điều hành' : 'MẶT TRẬN SỐ'}
              </h1>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                {isStaff ? 'Dành cho cán bộ, chuyên viên' : 'Phường Chánh Hưng'}
              </span>
            </div>
        </div>

        {/* Middle Search Bar (Hidden on Mobile, Citizen Mode places it on right) */}
        {isStaff && (
          <div className="hidden md:flex items-center relative w-72 max-w-full">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm công việc, văn bản..."
              className="glass-input w-full pl-10 pr-4 py-2 text-xs"
            />
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search bar inside citizen header on right */}
          {!isStaff && (
            <div className="hidden md:flex items-center relative w-48 max-w-full">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="glass-input w-full pl-8 pr-3 py-1.5 text-[11px]"
              />
            </div>
          )}

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-white/20 dark:bg-slate-900/20 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer hover:bg-white/40 active:scale-95"
            title="Chế độ màu"
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Notifications Panel */}
          <div ref={notifRef} className="relative">
            <button
              onClick={handleNotifClick}
              className="relative p-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-white/20 dark:bg-slate-900/20 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer hover:bg-white/40 active:scale-95"
              title="Thông báo"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 shadow-2xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-2 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-slate-800 dark:text-white">Thông báo mới</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-bold">
                    {unreadCount} chưa đọc
                  </span>
                </div>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto no-scrollbar">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-2.5 rounded-xl transition-all flex flex-col gap-0.5 text-left",
                        notif.read ? "opacity-70 hover:opacity-100" : "bg-blue-50/40 dark:bg-blue-950/15"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{notif.title}</span>
                        <span className="text-[9px] text-slate-400">{notif.time}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{notif.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portal Switching Button */}
          <button
            onClick={handlePortalSwitch}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm border",
              !isStaff
                ? "bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-900"
                : "bg-blue-600 text-white border-blue-500 shadow-blue-500/10"
            )}
          >
            {!isStaff ? (
              <>
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cổng Cán bộ</span>
                <ArrowRight className="h-3 w-3 ml-0.5" />
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Thoát Cán bộ</span>
              </>
            )}
          </button>

          {/* Avatar Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200/50 dark:border-slate-800/50 h-8">
            <div className="w-8 h-8 rounded-full border border-slate-200/50 dark:border-slate-800/50 overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-xs text-blue-600">
              {!isStaff ? 'US' : 'AD'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                {!isStaff ? 'Cư dân Chánh Hưng' : 'Nguyễn Văn An'}
              </span>
              <span className="text-[9px] text-slate-400 mt-1">
                {!isStaff ? 'Người dùng' : 'Chuyên viên'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Horizontal Navigation Bar (Only for Citizen layout, hidden on Staff) */}
      {!isStaff && (
        <div className="hidden md:flex w-full h-12 border-t border-slate-200/40 dark:border-slate-800/40 px-4 sm:px-6 items-center justify-center overflow-x-auto no-scrollbar gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold transition-all rounded-full cursor-pointer select-none border",
                  isActive 
                    ? "bg-blue-600/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-400/20 shadow-xs" 
                    : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
