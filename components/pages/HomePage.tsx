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
  PenLine, SpellCheck, ChevronDown, ChevronUp, Users, ArrowRight
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">

          {/* Card 1: Không gian Văn hóa Hồ Chí Minh */}
          <motion.button
            {...fadeUpProps(0)}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNav('/khong-gian-van-hoa-hcm')}
            className="flex flex-col items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 min-h-[220px] text-center w-full group"
          >
            {/* Icon Container */}
            <div className="p-3.5 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100/50 dark:border-red-900/25">
              <Compass className="h-6 w-6" />
            </div>

            {/* Title */}
            <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[48px] px-1 select-none">
              Không gian Văn hóa<br />Hồ Chí Minh
            </span>

            {/* Button Box */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-2xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-all border border-slate-200/30 dark:border-slate-700/30 group-hover:border-red-500/20 group-hover:text-red-600 dark:group-hover:text-red-400">
                <span>Tham quan</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.button>

          {/* Card 2: Tài liệu Sinh hoạt & Tuyên truyền */}
          <motion.button
            {...fadeUpProps(1)}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleExternal(DRIVE_FOLDER_URL)}
            className="flex flex-col items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 min-h-[220px] text-center w-full group"
          >
            {/* Icon Container */}
            <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-amber-100/50 dark:border-amber-900/25">
              <BookOpen className="h-6 w-6" />
            </div>

            {/* Title */}
            <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[48px] px-1 select-none">
              Tài liệu Sinh hoạt<br />& Tuyên truyền
            </span>

            {/* Button Box */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-2xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-all border border-slate-200/30 dark:border-slate-700/30 group-hover:border-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                <span>Mở tài liệu</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.button>

          {/* Card 3: Trợ lý AI Mặt trận số */}
          <motion.button
            {...fadeUpProps(2)}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNav('/tong-dai-ai')}
            className="flex flex-col items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 min-h-[220px] text-center w-full group"
          >
            {/* Icon Container */}
            <div className="p-3.5 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100/50 dark:border-blue-900/25">
              <Bot className="h-6 w-6 animate-pulse" />
            </div>

            {/* Title */}
            <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[48px] px-1 select-none">
              Trợ lý AI<br />Mặt trận số
            </span>

            {/* Button Box */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-2xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-all border border-slate-200/30 dark:border-slate-700/30 group-hover:border-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <span>Dùng Trợ lý AI</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.button>

          {/* Card 4: Kiến nghị & Phản ánh */}
          <motion.button
            {...fadeUpProps(3)}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleExternal(GOOGLE_FORM_URL)}
            className="flex flex-col items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 min-h-[220px] text-center w-full group"
          >
            {/* Icon Container */}
            <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-100/50 dark:border-emerald-900/25">
              <MessageSquare className="h-6 w-6" />
            </div>

            {/* Title */}
            <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[48px] px-1 select-none">
              Kiến nghị<br />& Phản ánh
            </span>

            {/* Button Box */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-2xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-all border border-slate-200/30 dark:border-slate-700/30 group-hover:border-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <span>Gửi phản ánh</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.button>

          {/* Card 5: Phong trào thi đua */}
          <motion.button
            {...fadeUpProps(4)}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhongTraoOpen(!phongTraoOpen)}
            className="flex flex-col items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 min-h-[220px] text-center w-full group"
          >
            {/* Icon Container */}
            <div className="p-3.5 bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-purple-100/50 dark:border-purple-900/25">
              <Users className="h-6 w-6" />
            </div>

            {/* Title */}
            <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[48px] px-1 select-none">
              Phong trào<br />thi đua
            </span>

            {/* Button Box */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-2xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-all border border-slate-200/30 dark:border-slate-700/30 group-hover:border-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                <span>{phongTraoOpen ? 'Thu gọn' : 'Xem phong trào'}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.button>

        </div>

        {/* Sub-items — animated dropdown */}
        <div className="mb-8">
          <AnimatePresence>
            {phongTraoOpen && (
              <motion.div
                key="phong-trao-items"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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
                          style={{ filter: "brightness(0.4)" }}
                        />
                        <div className={cn("absolute inset-0 bg-gradient-to-t", item.accent)} />
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
