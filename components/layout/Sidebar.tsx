"use client";

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home, Newspaper, Layers, HeartHandshake, FileText,
  MessageSquare, Search, Bot, FolderKanban, Calendar,
  Mail, Compass, LayoutDashboard, Database,
  Inbox, ClipboardList, BarChart3, Settings,
  LogOut, ChevronRight, Info, X
} from 'lucide-react';

/* Facebook inline SVG */
const FbIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/* ─── Staff menu: main sections ─── */
const STAFF_SECTIONS = [
  {
    id: 'tong-quan',
    label: 'Tổng quan',
    icon: LayoutDashboard,
    route: '/cong-lam-viec-can-bo',
    desc: 'Dashboard điều hành'
  },
  {
    id: 'quan-ly-gioi-thieu',
    label: 'Quản lý Giới thiệu',
    icon: Info,
    route: '/cong-lam-viec-can-bo?tab=quan-ly-gioi-thieu',
    desc: 'Nội dung, ảnh & nhân sự'
  },
  {
    id: 'quan-ly-so',
    label: 'Quản lý số',
    icon: Database,
    route: '/cong-lam-viec-can-bo?tab=quan-ly-so',
    desc: 'Dữ liệu & Fanpage'
  },
  {
    id: 'giai-quyet',
    label: 'Giải quyết – Tiếp nhận',
    icon: Inbox,
    route: '/cong-lam-viec-can-bo?tab=giai-quyet',
    desc: 'Kiến nghị & phản ánh'
  },
  {
    id: 'van-thu',
    label: 'Văn thư',
    icon: ClipboardList,
    route: '/cong-lam-viec-can-bo?tab=van-thu',
    desc: 'Biểu mẫu & hành chính'
  },
  {
    id: 'bao-cao',
    label: 'Báo cáo tiến độ',
    icon: BarChart3,
    route: '/cong-lam-viec-can-bo?tab=bao-cao',
    desc: 'KPI & thống kê'
  },
  {
    id: 'tuy-chinh',
    label: 'Tuỳ chỉnh',
    icon: Settings,
    route: '/cong-lam-viec-can-bo?tab=tuy-chinh',
    desc: 'Cấu hình hệ thống'
  }
];

/* ─── Citizen menu ─── */
const CITIZEN_GROUPS = [
  {
    group: 'Mặt trận Chánh Hưng',
    items: [
      { id: '/', label: 'Trang chủ', icon: Home },
      { id: '/hoat-dong-mttq', label: 'Giới thiệu hoạt động', icon: Layers },
      { id: '/tin-tuc', label: 'Tin tức - Sự kiện', icon: Newspaper },
      { id: '/khong-gian-van-hoa-hcm', label: 'Không gian VH HCM', icon: Compass },
      { id: '/an-sinh-xa-hoi', label: 'An sinh xã hội', icon: HeartHandshake },
      { id: '/phan-anh', label: 'Phản ánh & Kiến nghị', icon: MessageSquare },
      { id: '/tra-cuu-phan-anh', label: 'Tra cứu kết quả', icon: Search },
      { id: '/van-ban-bieu-mau', label: 'Văn bản biểu mẫu', icon: FolderKanban },
      { id: '/lich-su-kien', label: 'Lịch sự kiện', icon: Calendar },
      { id: '/tong-dai-ai', label: 'Trợ lý AI', icon: Bot },
      { id: '/lien-he', label: 'Liên hệ', icon: Mail },
    ]
  }
];

export default function Sidebar() {
  const {
    currentRoute, setCurrentRoute, viewMode, setViewMode,
    sidebarOpen, toggleSidebar
  } = useAppStore();
  const router = useRouter();
  const isStaff = viewMode === 'staff';

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const updateSize = () => setIsDesktop(window.innerWidth >= 1280);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleNavigate = (route: string) => {
    const basePath = route.split('?')[0];
    setCurrentRoute(basePath);
    router.push(route);
    // Notify StaffDashboardPage of tab change via custom event
    if (typeof window !== 'undefined') {
      setTimeout(() => window.dispatchEvent(new PopStateEvent('popstate')), 50);
    }
    toggleSidebar(false);
  };

  /* Derive active staff section from currentRoute + URL search params */
  const getActiveSection = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) return tab;
    }
    return 'tong-quan';
  };

  const activeSection = getActiveSection();

  return (
    <AnimatePresence>
      <motion.aside
        key={isStaff ? 'staff-sidebar' : 'citizen-sidebar'}
        initial={false}
        animate={{
          x: (isStaff && isDesktop) || sidebarOpen ? 0 : -320,
          opacity: (isStaff && isDesktop) || sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          isStaff ? "w-72 xl:translate-x-0" : "w-68",
          "border-r border-white/8 shadow-2xl"
        )}
        style={{
          background: 'linear-gradient(160deg,#071729 0%,#0d2348 35%,#091523 65%,#040c18 100%)',
          backgroundSize: '200% 200%',
          animation: 'sidebarGradientShift 14s ease infinite'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes sidebarGradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .sidebar-item-active {
            background: linear-gradient(90deg, rgba(59,130,246,0.22), rgba(99,102,241,0.12));
            border-left: 2.5px solid #60a5fa;
          }
        ` }} />

        {/* ─── Logo Row with Mobile Close Button ─── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/mttq-logo.png" alt="MTTQ" className="w-9 h-9 object-contain flex-shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[8.5px] uppercase font-bold tracking-widest text-blue-300 leading-none">MTTQ Việt Nam</span>
              <span className="text-[11px] font-black text-white leading-tight uppercase tracking-tight truncate">Phường Chánh Hưng</span>
              {isStaff && (
                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Cổng Cán bộ</span>
              )}
            </div>
          </div>

          {/* Close button for mobile and tablet */}
          <button
            type="button"
            onClick={() => toggleSidebar(false)}
            className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 xl:hidden cursor-pointer active:scale-90 transition-transform"
            title="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── STAFF: Officer Profile Card ─── */}
        <AnimatePresence mode="wait">
          {isStaff && (
            <motion.div
              key="officer-card"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mx-4 my-3 p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3 flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white flex-shrink-0 shadow-lg shadow-blue-500/30">
                NA
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-black text-white truncate">Nguyễn Văn An</span>
                <span className="text-[9px] text-blue-300 font-semibold truncate">Chuyên viên MTTQ</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold">Đang hoạt động</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Navigation ─── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2">

          {/* Staff: 7 section tabs */}
          <AnimatePresence mode="wait">
            {isStaff ? (
              <motion.nav
                key="staff-nav"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-1"
              >
                <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 pl-3 pb-1">Menu điều hành</span>
                {STAFF_SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id ||
                    (section.id === 'tong-quan' && activeSection === 'tong-quan' && currentRoute === '/cong-lam-viec-can-bo');

                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      onClick={() => handleNavigate(section.route)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left cursor-pointer transition-all border group active:scale-98',
                        isActive
                          ? 'sidebar-item-active text-white border-blue-500/20 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/6 border-transparent'
                      )}
                    >
                      <Icon className={cn('h-4.5 w-4.5 flex-shrink-0 transition-all', isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-300')} />
                      <div className="flex flex-col text-left min-w-0 flex-1">
                        <span className={cn('text-xs font-bold truncate', isActive ? 'font-black' : '')}>{section.label}</span>
                        <span className="text-[9px] text-slate-400 group-hover:text-slate-300 truncate">{section.desc}</span>
                      </div>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />}
                    </motion.button>
                  );
                })}

                {/* ── Divider + Extra tools ── */}
                <div className="my-2 border-t border-white/6" />
                <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 pl-3 pb-1">Công cụ bổ trợ</span>
                <button
                  onClick={() => handleNavigate('/tong-dai-ai')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left cursor-pointer border border-transparent hover:bg-white/6 text-slate-300 hover:text-white transition-all group active:scale-98"
                >
                  <Bot className="h-4.5 w-4.5 text-slate-400 group-hover:text-blue-300" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Trợ lý Ảo AI</span>
                    <span className="text-[9px] text-slate-400">Soạn thảo văn bản & công văn</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigate('/quan-ly-facebook')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left cursor-pointer border border-transparent hover:bg-white/6 text-slate-300 hover:text-white transition-all group active:scale-98"
                >
                  <FbIcon className="h-4.5 w-4.5 text-slate-400 group-hover:text-blue-300" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Kết nối Fanpage</span>
                    <span className="text-[9px] text-slate-400">Cấu hình Facebook MTTQ</span>
                  </div>
                </button>
              </motion.nav>
            ) : (
              /* Citizen drawer menu */
              <motion.nav
                key="citizen-nav"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {CITIZEN_GROUPS.map((group, gi) => (
                  <div key={gi} className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 pl-3 pb-1">{group.group}</span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentRoute === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-left cursor-pointer border transition-all active:scale-98',
                            isActive
                              ? 'sidebar-item-active text-white border-blue-500/20'
                              : 'text-slate-300 hover:bg-white/6 hover:text-white border-transparent'
                          )}
                        >
                          <Icon className={cn('h-4.5 w-4.5 flex-shrink-0', isActive ? 'text-blue-400' : 'text-slate-400')} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer: Portal Switch Button ─── */}
        <div className="px-4 pb-5 pt-3 border-t border-white/8 flex-shrink-0">
          {isStaff ? (
            <button
              onClick={() => {
                setViewMode('citizen');
                setCurrentRoute('/');
                router.push('/');
                toggleSidebar(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white text-xs font-bold transition-all cursor-pointer group active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                </div>
                <span className="text-slate-200">Quay lại Cổng Dân Cư</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={() => {
                setViewMode('staff');
                setCurrentRoute('/cong-lam-viec-can-bo');
                router.push('/cong-lam-viec-can-bo');
                toggleSidebar(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 text-blue-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Vào Cổng Cán bộ
            </button>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
