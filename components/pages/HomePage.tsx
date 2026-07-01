"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageContainer from '../layout/PageContainer';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import FacebookFeed from '../ui/FacebookFeed';
import { cn } from '@/lib/utils';
import {
  MessageSquare, Bot, ArrowRight, PhoneCall,
  Compass, BookOpen, Shield, Flower2, ChevronRight, FileText
} from 'lucide-react';

/* ─── per-index fade-up helper ─── */
const fadeUpProps = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const }
});

/* ─── Quick action tiles ─── */
const quickActions = [
  {
    label: "Không gian Văn hóa HCM",
    desc: "Tham quan số & tư liệu Bác Hồ",
    icon: Compass,
    route: "/khong-gian-van-hoa-hcm",
    bg: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop&q=60",
    accent: "from-red-700/85 to-red-900/95",
    badge: null
  },
  {
    label: "Tài liệu Sinh hoạt",
    desc: "Tuyên truyền & biểu mẫu",
    icon: BookOpen,
    route: "/van-ban-bieu-mau",
    bg: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=60",
    accent: "from-amber-700/85 to-orange-900/95",
    badge: null
  },
  {
    label: "Trợ lý Ảo AI",
    desc: "Soạn thảo & kiểm tra văn bản",
    icon: Bot,
    route: "/tong-dai-ai",
    bg: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&auto=format&fit=crop&q=60",
    accent: "from-blue-700/85 to-indigo-900/95",
    badge: "AI"
  },
  {
    label: "Kiến nghị & Phản ánh",
    desc: "Gửi ý kiến đến MTTQ",
    icon: MessageSquare,
    route: "/phan-anh",
    bg: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60",
    accent: "from-emerald-700/85 to-teal-900/95",
    badge: "Hot"
  },
  {
    label: "Toàn dân Bảo vệ ANTQ",
    desc: "Phong trào an ninh trật tự",
    icon: Shield,
    route: "/hoat-dong-mttq",
    bg: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&auto=format&fit=crop&q=60",
    accent: "from-slate-700/85 to-slate-900/95",
    badge: null
  },
  {
    label: "TP Muôn Sắc Hoa",
    desc: "Thành phố Muôn sắc hoa",
    icon: Flower2,
    route: "/hoat-dong-mttq",
    bg: "https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=400&auto=format&fit=crop&q=60",
    accent: "from-pink-700/85 to-rose-900/95",
    badge: null
  },
  {
    label: "Cảm hóa Người lầm lỗi",
    desc: "Mô hình giáo dục tái hòa nhập",
    icon: FileText,
    route: "/an-sinh-xa-hoi",
    bg: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop&q=60",
    accent: "from-violet-700/85 to-purple-900/95",
    badge: null
  }
];

export default function HomePage() {
  const { setCurrentRoute, setViewMode } = useAppStore();

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    if (['/cong-lam-viec-can-bo', '/thong-ke'].includes(route)) {
      setViewMode('staff');
    } else {
      setViewMode('citizen');
    }
    window.location.href = route;
  };

  return (
    <div className="flex flex-col gap-0">

      {/* ═══════════════════════════════════════════════════
          HERO – Full-bleed with centered brand identity
      ═══════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&auto=format&fit=crop&q=80"
          alt="Cảnh phường Chánh Hưng"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/75 via-red-700/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/85 via-transparent to-transparent" />

        {/* Centered hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4 px-5 sm:px-10 pt-10 pb-16 md:py-16">
          
          {/* Logo MTTQ centered top */}
          <motion.img
            src="/mttq-logo.png"
            alt="Logo MTTQ"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.div
            className="flex flex-col items-center gap-3 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            {/* Pill badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Cổng thông tin chính thức — Phường Chánh Hưng
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase drop-shadow-lg tracking-tight text-center">
              MẶT TRẬN SỐ<br />
              <span className="text-yellow-300">Phường Chánh Hưng</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-yellow-200 italic border-l-2 border-yellow-400 pl-3 leading-relaxed text-left">
              "Đoàn kết – Dân chủ – Đổi mới – Phát triển"
            </p>

            <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-lg text-center">
              Chào mừng bà con nhân dân ghé thăm Cổng thông tin Mặt trận số Phường Chánh Hưng. Nơi cập nhật hoạt động chính thức, an sinh xã hội và tiếp nhận phản ánh kiến nghị 24/24.
            </p>

            <div className="flex flex-wrap gap-3 mt-1 justify-center">
              <motion.button
                whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.04 }}
                onClick={() => handleNav('/phan-anh')}
                className="px-5 py-2.5 rounded-full bg-white text-red-700 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Gửi kiến nghị ngay
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.04 }}
                onClick={() => handleNav('/tin-tuc')}
                className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Xem tin tức
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════ */}
      <PageContainer className="relative z-10 -mt-8 sm:-mt-10">

        {/* ─── Quick Actions 7-tile grid ─── */}
        <div className="mb-8">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-4">Lối tắt chức năng</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {quickActions.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.button
                  key={act.route + act.label}
                  {...fadeUpProps(i)}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleNav(act.route)}
                  className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square flex flex-col items-center justify-end p-3 sm:p-4 shadow-lg cursor-pointer group border border-white/10"
                >
                  <img
                    src={act.bg} alt={act.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t", act.accent)} />

                  {act.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide z-10">
                      {act.badge}
                    </span>
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center gap-1.5">
                    <div className="p-2 bg-white/15 backdrop-blur-sm rounded-xl group-hover:bg-white/25 transition-all">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black text-white leading-tight line-clamp-2 drop-shadow text-center">
                      {act.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
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
              onClick={() => handleNav('/tin-tuc')}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Tất cả <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
          <FacebookFeed />
        </div>

        {/* ─── Hotline (full-width on mobile, slim on desktop) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="relative overflow-hidden rounded-3xl border border-rose-200/20 dark:border-rose-900/20 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&auto=format&fit=crop&q=80"
              alt="Hotline"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.2) saturate(1.2)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 to-red-900/80" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-rose-500/30 border border-rose-400/30 text-rose-200 rounded-full animate-pulse flex-shrink-0">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Hotline Tiếp nhận ý kiến MTTQ 24/7</h4>
                  <p className="text-2xl font-black text-rose-300 mt-1 tracking-tight">(028) 7101 1234</p>
                  <p className="text-[10px] text-white/60 mt-0.5">Đội phản ứng nhanh trật tự đô thị — Phường Chánh Hưng</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.05 }}
                onClick={() => window.open('tel:02871011234')}
                className="flex-shrink-0 px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs rounded-2xl uppercase tracking-wider shadow-lg transition-all w-full sm:w-auto"
              >
                Gọi ngay
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="h-4 md:h-0" />
      </PageContainer>
    </div>
  );
}
