"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Bell, Sun, Moon, Search, LogOut, ArrowRight, Shield, Clock, CloudSun } from 'lucide-react';
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
  
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    { id: '/van-ban-bieu-mau', label: 'Văn bản' },
    { id: '/khong-gian-van-hoa-hcm', label: 'Không gian văn hóa' }
  ];

  const handleNavigate = (id: string) => {
    setCurrentRoute(id);
    router.push(id);
  };

  return (
    <header className="sticky top-0 z-30 w-full flex flex-col justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all h-16">
      {/* Brand Logo, horizontal navigation menu, and profile controls */}
      <div className="w-full flex items-center justify-between px-3 sm:px-6 h-16 max-w-7xl mx-auto">
        
        {/* Left brand logo & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger for staff (tablet/mobile) */}
          {isStaff && (
            <button
              onClick={() => toggleSidebar()}
              className="p-2 -ml-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden cursor-pointer transition-colors"
              title="Menu điều hành"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {/* Hamburger for citizens (mobile drawer) */}
          {!isStaff && (
            <button
              onClick={() => toggleSidebar()}
              className="p-2 -ml-1 rounded-full text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer active:scale-90 transition-transform"
              title="Danh mục Mặt trận số"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div 
            onClick={() => handleNavigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group min-w-0"
          >
            <img 
              src="/mttq-logo.png" 
              alt="Logo MTTQ" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain flex-shrink-0 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-[11px] xs:text-xs sm:text-sm font-black text-slate-850 dark:text-white uppercase leading-tight tracking-tight truncate max-w-[165px] xs:max-w-[210px] sm:max-w-none">
                {isStaff ? 'Dashboard Điều hành' : 'Ủy ban MTTQ Việt Nam'}
              </h1>
              <span className="text-[9px] xs:text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider leading-none mt-0.5 truncate whitespace-nowrap">
                {isStaff ? 'Chuyên viên nghiệp vụ' : 'Phường Chánh Hưng'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Horizontal Navigation Bar (Citizen layout, hidden on Staff) */}
        {!isStaff && (
          <div className="hidden md:flex items-center justify-center flex-1 mx-3 gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "px-3.5 py-1.5 text-xs font-bold transition-all rounded-full cursor-pointer select-none whitespace-nowrap",
                    isActive 
                      ? "bg-blue-600/12 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-black shadow-xs ring-1 ring-blue-500/20" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Time & Weather Widget (Google Pill style) */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/40 select-none text-[11px] font-semibold text-slate-600 dark:text-slate-350">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Clock className="h-3.5 w-3.5" />
              <span className="tabular-nums">{dateStr} · {timeStr}</span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5 text-amber-500">
              <CloudSun className="h-3.5 w-3.5" />
              <span>Chánh Hưng · 30°C</span>
            </div>
          </div>

          {/* Toggle Theme - Google Pill Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
            title="Chế độ màu"
            aria-label="Đổi giao diện sáng/tối"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Notifications Panel */}
          <div ref={notifRef} className="relative">
            <button
              onClick={handleNotifClick}
              className="relative w-9 h-9 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              title="Thông báo"
              aria-label="Thông báo hệ thống"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Dropdown (Google M3 surface container) */}
            {notifOpen && (
              <div className="absolute right-0 mt-2.5 w-80 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-2.5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-slate-850 dark:text-white">Thông báo mới</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} chưa đọc
                  </span>
                </div>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto no-scrollbar">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-2.5 rounded-2xl transition-all flex flex-col gap-0.5 text-left cursor-pointer",
                        notif.read ? "opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-900" : "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50/80"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">{notif.title}</span>
                        <span className="text-[9px] text-slate-400">{notif.time}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{notif.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Đăng nhập — Google M3 Pill Button */}
          {!isStaff ? (
            <button
              onClick={handlePortalSwitch}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs border bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-blue-500/15 tracking-wide"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cổng Cán bộ</span>
              <span className="sm:hidden">Cán bộ</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={handlePortalSwitch}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs border bg-slate-850 hover:bg-slate-800 text-white border-slate-700 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 dark:border-slate-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Dân cư</span>
            </button>
          )}

        </div>
      </div>

    </header>
  );
}
