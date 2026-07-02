"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageContainer from '../layout/PageContainer';
import FacebookFeed from '../ui/FacebookFeed';
import { cn } from '@/lib/utils';
import {
  MessageSquare, Bot, PhoneCall, Compass, BookOpen,
  Shield, Flower2, ChevronRight, FileText, ExternalLink,
  PenLine, SpellCheck, ChevronDown, ChevronUp, Users
} from 'lucide-react';

/* ─── per-index fade-up ─── */
const fadeUpProps = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const }
});

/* ─── Google Form link (thay link này khi có form chính thức) ─── */
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSflI6uajykE5zW3Ula8BSUFQelEbyXF04AnJfjTZ87sluz7ag/viewform';
/* ─── Google Drive link tài liệu ─── */
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID';
/* ─── Facebook Page ─── */
const FB_PAGE_URL = 'https://www.facebook.com/profile.php?id=61580661372890';

export default function HomePage() {
  const { setCurrentRoute, setViewMode } = useAppStore();
  const [phongTraoOpen, setPhongTraoOpen] = useState(false);

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    if (['/cong-lam-viec-can-bo', '/thong-ke'].includes(route)) {
      setViewMode('staff');
    } else {
      setViewMode('citizen');
    }
    window.location.href = route;
  };

  const handleExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  /* ─── Phong trào sub-items ─── */
  const phongTraoItems = [
    {
      label: 'Toàn dân Bảo vệ ANTQ',
      icon: Shield,
      accent: 'from-slate-600/90 to-slate-800/95',
      bg: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&auto=format&fit=crop&q=60',
      route: '/hoat-dong-mttq'
    },
    {
      label: 'Thành phố Muôn Sắc Hoa',
      icon: Flower2,
      accent: 'from-pink-600/90 to-rose-800/95',
      bg: 'https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=400&auto=format&fit=crop&q=60',
      route: '/hoat-dong-mttq'
    },
    {
      label: 'Cảm hóa – Giáo dục người lầm lỗi',
      icon: FileText,
      accent: 'from-violet-600/90 to-purple-800/95',
      bg: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop&q=60',
      route: '/an-sinh-xa-hoi'
    }
  ];

  return (
    <div className="flex flex-col gap-0">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '320px' }}>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&auto=format&fit=crop&q=80"
          alt="Cảnh phường Chánh Hưng"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/75 via-red-700/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/85 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-5 px-5 sm:px-10 pt-10 pb-16 md:py-16">
          <motion.img
            src="/mttq-logo.png"
            alt="Logo MTTQ"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain filter drop-shadow-2xl mb-2"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.div
            className="flex flex-col items-center gap-3.5 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Cổng thông tin chính thức — Phường Chánh Hưng
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight uppercase drop-shadow-2xl tracking-tight text-center">
              MẶT TRẬN SỐ<br />
              <span className="text-yellow-300">Phường Chánh Hưng</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-yellow-200 italic border-l-2 border-yellow-400 pl-3 leading-relaxed text-left">
              "Đoàn kết – Dân chủ – Đổi mới – Phát triển"
            </p>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════ */}
      <PageContainer className="relative z-10 -mt-8 sm:-mt-10">

        {/* ─── SECTION LABEL ─── */}
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-4">Lối tắt chức năng</p>

        {/* ═══════════════════════════════════════════
            ROW 1 — 2 full-width tiles side-by-side
            Không gian Hồ Chí Minh  |  Tài liệu sinh hoạt
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

          {/* Tile 1: Không gian Văn hóa Hồ Chí Minh — with Bác Hồ image */}
          <motion.button
            {...fadeUpProps(0)}
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNav('/khong-gian-van-hoa-hcm')}
            className="relative overflow-hidden rounded-3xl h-36 sm:h-44 flex flex-col items-start justify-end p-4 sm:p-5 shadow-xl cursor-pointer group border border-white/10 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-red-900 to-amber-950" />
            {/* Bác Hồ vector portrait */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Ho_Chi_Minh_Vector_%28positive%29.svg"
              alt="Chủ tịch Hồ Chí Minh"
              className="absolute right-0 bottom-0 h-[105%] w-auto object-contain object-right-bottom transition-transform duration-500 group-hover:scale-105 opacity-40 dark:opacity-30 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/30 to-transparent" />
            <div className="relative z-10 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg">
                  <Compass className="h-4 w-4 text-white" />
                </div>
                <span className="text-[8px] font-black text-yellow-300 uppercase tracking-widest">Tham quan số</span>
              </div>
              <span className="text-sm sm:text-base font-black text-white drop-shadow leading-tight">
                Không gian Văn hóa<br />
                <span className="text-yellow-300">Hồ Chí Minh</span>
              </span>
              <span className="text-[10px] text-white/70 font-medium">Tư liệu & di sản Bác Hồ</span>
            </div>
          </motion.button>

          {/* Tile 2: Tài liệu Sinh hoạt — Google Drive */}
          <motion.button
            {...fadeUpProps(1)}
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleExternal(DRIVE_FOLDER_URL)}
            className="relative overflow-hidden rounded-3xl h-36 sm:h-44 flex flex-col items-start justify-end p-4 sm:p-5 shadow-xl cursor-pointer group border border-white/10 text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=60"
              alt="Tài liệu"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ filter: 'brightness(0.45)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/92 via-orange-800/50 to-transparent" />
            <div className="relative z-10 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="flex items-center gap-1 text-[8px] font-black text-yellow-300 uppercase tracking-widest">
                  <ExternalLink className="h-2.5 w-2.5" /> Google Drive
                </span>
              </div>
              <span className="text-sm sm:text-base font-black text-white drop-shadow leading-tight">Tài liệu Sinh hoạt<br /><span className="text-yellow-300">& Tuyên truyền</span></span>
              <span className="text-[10px] text-white/70 font-medium">Bấm để mở thư mục Drive</span>
            </div>
            {/* Drive badge */}
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 text-slate-700 text-[8px] font-black px-2 py-1 rounded-full">
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none">
                <path d="M4.5 20.5L9 12l4.5 8H4.5z" fill="#1DA462"/>
                <path d="M14 12l-4.5-8H19L14 12z" fill="#FBBC04"/>
                <path d="M14 12H9L4.5 20.5h9.5L19 12h-5z" fill="#4285F4"/>
              </svg>
              Drive
            </span>
          </motion.button>
        </div>

        {/* ═══════════════════════════════════════════
            ROW 2 — Grouped AI Button (col-span-2) + Kiến nghị
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">

          {/* Grouped AI Card - Prominent (col-span-2) */}
          <motion.button
            {...fadeUpProps(2)}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNav('/tong-dai-ai')}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-32 sm:h-40 sm:col-span-2 flex flex-col items-start justify-end p-4 sm:p-5 shadow-lg cursor-pointer group border border-white/10 text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&auto=format&fit=crop&q=80"
              alt="Tổng đài AI Mặt trận số" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'brightness(0.35) saturate(1.3)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-indigo-900/80 to-transparent" />
            <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">AI MẶT TRẬN</span>
            
            <div className="relative z-10 flex flex-col gap-1 max-w-lg">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="p-1.5 bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm rounded-xl text-blue-200">
                  <Bot className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <span className="text-[9px] font-black text-blue-300 uppercase tracking-wider">Trợ lý Số hóa Mặt trận Tổ quốc</span>
              </div>
              <span className="text-sm sm:text-base font-black text-white drop-shadow leading-tight">
                Trợ lý AI Mặt trận số — <span className="text-yellow-300">Tổng đài AI đa năng</span>
              </span>
              <span className="text-[10px] text-white/70 font-medium">Soạn thảo kế hoạch công tác & Kiểm tra lỗi chính tả, thể thức văn bản hành chính</span>
            </div>
          </motion.button>

          {/* Kiến nghị & Phản ánh → Google Form */}
          <motion.button
            {...fadeUpProps(4)}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => handleExternal(GOOGLE_FORM_URL)}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-32 sm:h-40 flex flex-col items-start justify-end p-3.5 sm:p-4 shadow-lg cursor-pointer group border border-white/10 text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60"
              alt="Kiến nghị" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ filter: 'brightness(0.35)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/92 via-teal-800/50 to-transparent" />
            <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Hot</span>
            <div className="relative z-10 flex flex-col gap-1">
              <div className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg w-fit mb-1">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-black text-white drop-shadow leading-tight">Kiến nghị<br /><span className="text-emerald-300">& Phản ánh</span></span>
              <span className="text-[9px] text-white/65 flex items-center gap-1">
                <ExternalLink className="h-2.5 w-2.5" /> Gửi qua Google Form
              </span>
            </div>
          </motion.button>
        </div>

        {/* ═══════════════════════════════════════════
            ROW 3 — Phong trào (expandable) full-width
        ═══════════════════════════════════════════ */}
        <div className="mb-8">
          {/* Main Phong trào button */}
          <motion.button
            {...fadeUpProps(5)}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhongTraoOpen(!phongTraoOpen)}
            className="relative overflow-hidden rounded-3xl w-full h-28 flex items-center justify-between px-5 sm:px-6 shadow-xl cursor-pointer group border border-white/10 text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop&q=60"
              alt="Phong trào"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'brightness(0.4) saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/15 backdrop-blur-sm rounded-2xl flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-yellow-300 uppercase tracking-widest mb-0.5">Các cuộc vận động</span>
                <span className="text-sm sm:text-base font-black text-white drop-shadow">Phong trào thi đua</span>
                <span className="text-[10px] text-white/60 mt-0.5">Bấm để xem 3 phong trào</span>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <span className="hidden sm:block text-[9px] font-bold text-white/60 uppercase tracking-wider">
                {phongTraoOpen ? 'Thu gọn' : 'Xem thêm'}
              </span>
              <motion.div
                animate={{ rotate: phongTraoOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-white/15 rounded-xl"
              >
                <ChevronDown className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.button>

          {/* Sub-items — animated dropdown */}
          <AnimatePresence>
            {phongTraoOpen && (
              <motion.div
                key="phong-trao-items"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {phongTraoItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNav(item.route)}
                        className="relative overflow-hidden rounded-2xl h-28 flex flex-col items-start justify-end p-4 shadow-lg cursor-pointer group border border-white/10 text-left"
                      >
                        <img
                          src={item.bg} alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ filter: 'brightness(0.4)' }}
                        />
                        <div className={cn('absolute inset-0 bg-gradient-to-t', item.accent)} />
                        <div className="relative z-10 flex flex-col gap-1">
                          <div className="p-1.5 bg-white/15 backdrop-blur-sm rounded-lg w-fit mb-0.5">
                            <Icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="text-[11px] font-black text-white drop-shadow leading-tight">{item.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── AI Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=80"
              alt="AI" className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.3) saturate(1.5)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6">
              <div className="p-3.5 bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm text-blue-200 rounded-2xl flex-shrink-0 animate-bounce">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Trợ lý Ảo AI — Soạn thảo & Kiểm tra văn bản</h3>
                <p className="text-[11px] text-blue-200/80 mt-1 leading-relaxed">
                  Soạn kế hoạch công tác, kiểm tra thể thức hành chính, phát hiện lỗi chính tả văn bản — tất cả chỉ trong vài giây với AI hỗ trợ cán bộ MTTQ.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.05 }}
                onClick={() => handleNav('/tong-dai-ai')}
                className="flex-shrink-0 px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wider w-full sm:w-auto"
              >
                Dùng AI ngay
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── Facebook Live Feed ─── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pl-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tin tức từ Fanpage MTTQ</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleExternal(FB_PAGE_URL)}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Xem Fanpage <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          <FacebookFeed />
        </div>



        <div className="h-4 md:h-0" />
      </PageContainer>
    </div>
  );
}
