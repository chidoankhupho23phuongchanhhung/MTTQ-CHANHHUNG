"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageContainer from '../layout/PageContainer';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';
import {
  FileText, MessageSquare, Search, Bot, Newspaper, Calendar,
  ArrowRight, PhoneCall, Bell, MapPin, Compass, Mail, Clock,
  Shield, ChevronRight, HeartHandshake
} from 'lucide-react';
import { mockNews, mockEvents } from '@/lib/mockData';

/* ─── per-index fade-up helper ─── */
const fadeUpProps = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' as const }
});

/* ─── Quick action tiles with background images ─── */
const quickActions = [
  {
    label: "Gửi Kiến nghị",
    desc: "Phản ánh dân sinh",
    icon: MessageSquare,
    route: "/phan-anh",
    bg: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60",
    accent: "from-blue-700/80 to-blue-900/90",
    badge: "Hot"
  },
  {
    label: "Tin tức",
    desc: "Sự kiện mới nhất",
    icon: Newspaper,
    route: "/tin-tuc",
    bg: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop&q=60",
    accent: "from-emerald-700/80 to-teal-900/90",
    badge: null
  },
  {
    label: "Văn bản",
    desc: "Biểu mẫu & hành chính",
    icon: FileText,
    route: "/van-ban-bieu-mau",
    bg: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=60",
    accent: "from-amber-700/80 to-orange-900/90",
    badge: null
  },
  {
    label: "Tra cứu",
    desc: "Tiến độ xử lý hồ sơ",
    icon: Search,
    route: "/tra-cuu-phan-anh",
    bg: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=60",
    accent: "from-violet-700/80 to-purple-900/90",
    badge: null
  },
  {
    label: "An sinh",
    desc: "Hỗ trợ xã hội",
    icon: HeartHandshake,
    route: "/an-sinh-xa-hoi",
    bg: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop&q=60",
    accent: "from-rose-700/80 to-red-900/90",
    badge: null
  },
  {
    label: "Thư viện số",
    desc: "Không gian văn hoá",
    icon: Compass,
    route: "/khong-gian-van-hoa-hcm",
    bg: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop&q=60",
    accent: "from-indigo-700/80 to-blue-900/90",
    badge: "Mới"
  },
  {
    label: "Dịch vụ công",
    desc: "Thủ tục trực tuyến",
    icon: Shield,
    route: "/dich-vu-cong",
    bg: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&auto=format&fit=crop&q=60",
    accent: "from-cyan-700/80 to-sky-900/90",
    badge: null
  },
  {
    label: "Liên hệ",
    desc: "Hỗ trợ & góp ý",
    icon: Mail,
    route: "/lien-he",
    bg: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&auto=format&fit=crop&q=60",
    accent: "from-slate-700/80 to-slate-900/90",
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
          HERO – Full-bleed background image with glass overlay
      ═══════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '320px' }}>
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&auto=format&fit=crop&q=80"
          alt="Cảnh phường Chánh Hưng"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.55) saturate(1.2)' }}
        />
        {/* Red overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-red-700/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/80 via-transparent to-transparent" />

        {/* Animated entrance content */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-5 sm:px-8 pt-10 pb-14 md:py-14">
          <motion.div
            className="flex flex-col gap-3 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Pill badge */}
            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Cổng thông tin chính thức — Phường Chánh Hưng
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase drop-shadow-lg tracking-tight">
              MẶT TRẬN SỐ<br />
              <span className="text-yellow-300">Phường Chánh Hưng</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-yellow-200 italic border-l-2 border-yellow-400 pl-3 leading-relaxed">
              "Đoàn kết – Dân chủ – Đổi mới – Phát triển"
            </p>

            <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-lg">
              Chào mừng bà con nhân dân ghé thăm Cổng thông tin Mặt trận số Phường Chánh Hưng. Nơi cập nhật hoạt động chính thức, an sinh xã hội và tiếp nhận phản ánh kiến nghị 24/24.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => handleNav('/phan-anh')}
                className="px-5 py-2.5 rounded-full bg-white text-red-700 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Gửi kiến nghị ngay
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => handleNav('/tin-tuc')}
                className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
              >
                Xem tin tức
              </motion.button>
            </div>
          </motion.div>

          {/* Logo */}
          <motion.img
            src="/mttq-logo.png"
            alt="Logo MTTQ"
            className="hidden md:block w-28 h-28 object-contain filter drop-shadow-2xl flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          QUICK ACTIONS – 2×4 card grid with background images
      ═══════════════════════════════════════════════════ */}
      <PageContainer className="relative z-10 -mt-8 sm:-mt-10">

        {/* Section label */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Lối tắt chức năng</h2>
        </div>

        {/* 4×2 grid: 2 cols on mobile, 4 cols on sm+, 8 cols on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-8">
          {quickActions.map((act, i) => {
            const Icon = act.icon;
            return (
              <motion.button
                key={act.route}
                {...fadeUpProps(i)}
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleNav(act.route)}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square flex flex-col items-center justify-end p-3 sm:p-4 text-left shadow-lg cursor-pointer group border border-white/10"
              >
                {/* Background image */}
                <img
                  src={act.bg}
                  alt={act.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-t", act.accent)} />

                {/* Badge */}
                {act.badge && (
                  <span className="absolute top-2.5 right-2.5 bg-yellow-400 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide z-10">
                    {act.badge}
                  </span>
                )}

                {/* Icon + Label */}
                <div className="relative z-10 flex flex-col items-center text-center gap-1.5">
                  <div className="p-2 bg-white/15 backdrop-blur-sm rounded-xl group-hover:bg-white/25 transition-all">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-white leading-tight line-clamp-1 drop-shadow">
                    {act.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-white/70 line-clamp-1 hidden sm:block">
                    {act.desc}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════
            AI ASSISTANT – Full-width premium glass card
        ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 shadow-xl">
            {/* BG */}
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=80"
              alt="AI"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.3) saturate(1.5)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6">
              <div className="p-3.5 bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm text-blue-200 rounded-2xl flex-shrink-0 animate-bounce">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Hỏi đáp với Trợ lý AI</h3>
                <p className="text-[11px] text-blue-200/80 mt-1 leading-relaxed">
                  Bà con muốn hỏi về tiến độ đơn thư, thủ tục hành chính, chính sách an sinh? Chat ngay với trợ lý ảo AI để được hướng dẫn tức thời 24/24.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNav('/tong-dai-ai')}
                className="flex-shrink-0 px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wider w-full sm:w-auto"
              >
                Hỏi AI ngay
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════
            NEWS – Horizontal swipe cards
        ═══════════════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pl-1">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tin tức nổi bật</h2>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleNav('/tin-tuc')}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Xem tất cả <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {mockNews.slice(0, 5).map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNav('/tin-tuc')}
                className="flex-shrink-0 w-64 sm:w-72 snap-start overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer group border border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-md"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {news.tag}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2 text-left">
                  <span className="text-[9px] text-slate-400 font-medium">{news.date} • {news.views} lượt xem</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug">{news.title}</h4>
                  <span className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                    Đọc tiếp <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            BOTTOM GRID – Events + Hotline
        ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Events (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sự kiện sắp diễn ra</h2>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => handleNav('/lich-su-kien')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
              >
                Xem lịch <ChevronRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockEvents.slice(0, 2).map((evt, i) => (
                <motion.div
                  key={evt.id}
                  {...fadeUpProps(i)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNav('/lich-su-kien')}
                  className="flex gap-3.5 p-4 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/40 shadow-sm cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center p-2.5 bg-red-500 text-white rounded-2xl w-12 h-12 flex-shrink-0 shadow">
                    <span className="text-[8px] font-black opacity-80 uppercase">{evt.date.split('-')[1]}</span>
                    <span className="text-base font-black leading-none mt-0.5">{evt.date.split('-')[2]}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[8px] bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      {evt.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-1.5 line-clamp-2 leading-tight">{evt.title}</h4>
                    <div className="flex flex-col gap-0.5 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{evt.time}</span>
                      <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 flex-shrink-0" />{evt.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hotline card (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Hỗ trợ khẩn cấp</h2>

            {/* Hotline card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-200/30 dark:border-rose-900/30 shadow-lg flex-1">
              <img
                src="https://images.unsplash.com/photo-1521791055366-0d553872952f?w=400&auto=format&fit=crop&q=80"
                alt="Hotline"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.25) saturate(1.2)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3 p-5 h-full min-h-[180px]">
                <div className="p-3.5 bg-rose-500/30 border border-rose-400/30 text-rose-200 rounded-full animate-pulse">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Hotline MTTQ</h4>
                  <p className="text-xl font-black text-rose-300 mt-1 tracking-tight">(028) 7101 1234</p>
                  <p className="text-[9px] text-white/70 mt-1 leading-relaxed">Hỗ trợ 24/7 trật tự đô thị & MTTQ phường Chánh Hưng</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => window.open('tel:02871011234')}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black text-[10px] rounded-xl shadow-lg uppercase tracking-wider transition-all w-full"
                >
                  Gọi ngay
                </motion.button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Bottom safe-area padding for mobile nav */}
        <div className="h-4 md:h-0" />
      </PageContainer>
    </div>
  );
}
