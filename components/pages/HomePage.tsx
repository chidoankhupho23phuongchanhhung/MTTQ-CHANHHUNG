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
  PenLine, SpellCheck, ChevronDown, ChevronUp, Users, ArrowRight,
  LayoutDashboard, Globe, Building2, Briefcase, Sparkles
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
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1ZsJfimQEU7WdHY5cK1KoO_ULELcSLlPf';
/* ─── Facebook Page ─── */
const FB_PAGE_URL = 'https://www.facebook.com/profile.php?id=61580661372890';
/* ─── External Links ─── */
const MAT_TRAN_SO_TPHCM_URL = 'https://mttqtphcm.vn/';
const DICH_VU_CONG_URL = 'https://dichvucong.gov.vn';

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

  const getFanpageUrl = (id: string, defaultUrl: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fanpage_url_${id}`) || defaultUrl;
    }
    return defaultUrl;
  };

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

  /* ─── Reusable Card Component ─── */
  const FeatureCard = ({
    index,
    onClick,
    icon: Icon,
    iconBg,
    iconColor,
    hoverShadow,
    title,
    buttonLabel,
    buttonHoverColor,
    customIcon,
  }: {
    index: number;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    hoverShadow: string;
    title: React.ReactNode;
    buttonLabel: string;
    buttonHoverColor: string;
    customIcon?: React.ReactNode;
  }) => (
    <motion.button
      {...fadeUpProps(index)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-between p-5 sm:p-6 rounded-3xl",
        "border border-slate-200/50 dark:border-slate-800/50",
        "bg-white/60 dark:bg-slate-900/40 backdrop-blur-md",
        "cursor-pointer transition-all duration-300",
        hoverShadow,
        "min-h-[200px] sm:min-h-[240px] text-center w-full group"
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        "p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border",
        iconBg
      )}>
        {customIcon ? customIcon : Icon && <Icon className="h-7 w-7 sm:h-8 sm:w-8" />}
      </div>

      {/* Title */}
      <span className="text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight text-center my-auto flex-1 flex items-center justify-center min-h-[52px] px-1 select-none">
        {title}
      </span>

      {/* Button Box */}
      <div className="w-full mt-3">
        <div className={cn(
          "flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-2xl",
          "text-xs sm:text-[13px] font-black",
          "bg-slate-100 hover:bg-slate-200 text-slate-700",
          "dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200",
          "transition-all border border-slate-200/30 dark:border-slate-700/30",
          buttonHoverColor
        )}>
          <span>{buttonLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.button>
  );

  /* ─── Vibrant Colored Tab Card Component (Chỉ Logo + Tên) ─── */
  const ColorTabCard = ({
    index,
    onClick,
    title,
    gradient,
    shadowColor,
    borderColor,
    icon: Icon,
    customIcon,
  }: {
    index: number;
    onClick: () => void;
    title: React.ReactNode;
    gradient: string;
    shadowColor: string;
    borderColor: string;
    icon?: React.ComponentType<{ className?: string }>;
    customIcon?: React.ReactNode;
  }) => (
    <motion.button
      {...fadeUpProps(index)}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl",
        "border overflow-hidden cursor-pointer transition-all duration-300 text-center w-full group",
        "min-h-[145px] sm:min-h-[165px] md:min-h-[180px] shadow-lg",
        gradient,
        borderColor,
        shadowColor
      )}
    >
      {/* Decorative background glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/15 pointer-events-none" />

      {/* Icon / Logo Container */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/35 text-white shadow-md group-hover:scale-110 transition-transform duration-300 mb-2.5 sm:mb-3">
        {customIcon ? customIcon : Icon && <Icon className="h-7 w-7 sm:h-9 sm:w-9 text-white" />}
      </div>

      {/* Title (Tên đoàn thể) */}
      <span className="relative z-10 text-xs sm:text-sm md:text-base font-black text-white uppercase leading-snug tracking-tight drop-shadow-md text-center select-none">
        {title}
      </span>
    </motion.button>
  );

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
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain filter drop-shadow-2xl mb-2"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.div
            className="flex flex-col items-center gap-3.5 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Cổng thông tin chính thức — Phường Chánh Hưng
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight uppercase drop-shadow-2xl tracking-tight text-center">
              MẶT TRẬN SỐ<br />
              <span className="text-yellow-300">Phường Chánh Hưng</span>
            </h1>

            <p className="text-sm sm:text-base font-semibold text-yellow-200 italic border-l-2 border-yellow-400 pl-3 leading-relaxed text-left">
              &quot;Đoàn kết – Dân chủ – Đổi mới – Phát triển&quot;
            </p>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════ */}
      <PageContainer className="relative z-10 -mt-8 sm:-mt-10">

        {/* ═══════════════════════════════════════════
            ROW 1 — 4 cards per row
            Không gian VH HCM | Tài liệu | Kiến nghị | Phong trào
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-5">

          {/* Card 1: Không gian Văn hóa Hồ Chí Minh */}
          <FeatureCard
            index={0}
            onClick={() => handleNav('/khong-gian-van-hoa-hcm')}
            icon={Compass}
            iconBg="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-100/50 dark:border-red-900/25"
            iconColor="text-red-600"
            hoverShadow="hover:shadow-lg hover:shadow-red-500/5"
            title={<>Không gian Văn hóa<br />Hồ Chí Minh</>}
            buttonLabel="Tham quan"
            buttonHoverColor="group-hover:border-red-500/20 group-hover:text-red-600 dark:group-hover:text-red-400"
          />

          {/* Card 2: Tài liệu Sinh hoạt & Tuyên truyền */}
          <FeatureCard
            index={1}
            onClick={() => handleExternal(DRIVE_FOLDER_URL)}
            icon={BookOpen}
            iconBg="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/25"
            iconColor="text-amber-600"
            hoverShadow="hover:shadow-lg hover:shadow-amber-500/5"
            title={<>Tài liệu Sinh hoạt<br />& Tuyên truyền</>}
            buttonLabel="Mở tài liệu"
            buttonHoverColor="group-hover:border-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400"
          />

          {/* Card 3: Kiến nghị & Phản ánh */}
          <FeatureCard
            index={2}
            onClick={() => handleExternal(GOOGLE_FORM_URL)}
            icon={MessageSquare}
            iconBg="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/25"
            iconColor="text-emerald-600"
            hoverShadow="hover:shadow-lg hover:shadow-emerald-500/5"
            title={<>Kiến nghị<br />& Phản ánh</>}
            buttonLabel="Gửi phản ánh"
            buttonHoverColor="group-hover:border-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
          />

          {/* Card 4: Phong trào thi đua */}
          <FeatureCard
            index={3}
            onClick={() => setPhongTraoOpen(!phongTraoOpen)}
            icon={Users}
            iconBg="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/25"
            iconColor="text-purple-600"
            hoverShadow="hover:shadow-lg hover:shadow-purple-500/5"
            title={<>Phong trào<br />thi đua</>}
            buttonLabel={phongTraoOpen ? 'Thu gọn' : 'Xem phong trào'}
            buttonHoverColor="group-hover:border-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-400"
          />

        </div>

        {/* Sub-items — animated dropdown */}
        <div className="mb-6">
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
                        className="relative overflow-hidden rounded-2xl h-32 sm:h-28 flex flex-col items-start justify-end p-5 shadow-lg cursor-pointer group border border-white/10 text-left"
                      >
                        <img
                          src={item.bg} alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ filter: "brightness(0.4)" }}
                        />
                        <div className={cn("absolute inset-0 bg-gradient-to-t", item.accent)} />
                        <div className="relative z-10 flex flex-col gap-1">
                          <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg w-fit mb-0.5">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-black text-white drop-shadow leading-tight">{item.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════
            ROW 2 — 4 cards per row
            Trợ lý AI | Mặt trận số TPHCM | Dịch vụ công | Dashboard quản lý
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">

          {/* Card 5: Trợ lý AI Mặt trận số */}
          <FeatureCard
            index={4}
            onClick={() => handleNav('/tong-dai-ai')}
            icon={Bot}
            iconBg="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/25"
            iconColor="text-blue-600"
            hoverShadow="hover:shadow-lg hover:shadow-blue-500/5"
            title={<>Trợ lý AI<br />Mặt trận số</>}
            buttonLabel="Dùng Trợ lý AI"
            buttonHoverColor="group-hover:border-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          />

          {/* Card 6: Mặt trận số TPHCM — NEW */}
          <FeatureCard
            index={5}
            onClick={() => handleExternal(MAT_TRAN_SO_TPHCM_URL)}
            iconBg="bg-red-500/10 dark:bg-red-500/20 border-red-100/50 dark:border-red-900/25"
            iconColor="text-red-600"
            hoverShadow="hover:shadow-lg hover:shadow-red-500/5"
            title={<>Mặt trận số<br />TPHCM</>}
            buttonLabel="Truy cập"
            buttonHoverColor="group-hover:border-red-500/20 group-hover:text-red-600 dark:group-hover:text-red-400"
            customIcon={
              <img
                src="/mttq-logo.png"
                alt="Logo MTTQ"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
              />
            }
          />

          {/* Card 7: Dịch vụ công trực tuyến — NEW */}
          <FeatureCard
            index={6}
            onClick={() => handleExternal(DICH_VU_CONG_URL)}
            iconBg="bg-sky-500/10 dark:bg-sky-500/20 border-sky-100/50 dark:border-sky-900/25"
            iconColor="text-sky-600"
            hoverShadow="hover:shadow-lg hover:shadow-sky-500/5"
            title={<>Dịch vụ công<br />trực tuyến</>}
            buttonLabel="Truy cập"
            buttonHoverColor="group-hover:border-sky-500/20 group-hover:text-sky-600 dark:group-hover:text-sky-400"
            customIcon={
              <img
                src="/ubnd-logo.svg"
                alt="Logo UBND"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
              />
            }
          />

          {/* Card 8: Bản đồ số Phường Chánh Hưng */}
          <FeatureCard
            index={7}
            onClick={() => handleExternal('https://www.google.com/maps/place/Ph%C6%B0%E1%BB%9Dng+Ch%C3%A1nh+H%C6%B0ng,+Qu%E1%BA%ADn+8,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh')}
            icon={Globe}
            iconBg="bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border-teal-100/50 dark:border-teal-900/25"
            iconColor="text-teal-600"
            hoverShadow="hover:shadow-lg hover:shadow-teal-500/5"
            title={<>Bản đồ số<br />P. Chánh Hưng</>}
            buttonLabel="Xem bản đồ"
            buttonHoverColor="group-hover:border-teal-500/20 group-hover:text-teal-600 dark:group-hover:text-teal-400"
          />

        </div>

        {/* ═══════════════════════════════════════════
            ROW 3 — 4 Tab Màu Truy Cập Nhanh Fanpage Đoàn Thể (Responsive)
            MTTQ (Đỏ) | Công Đoàn (Xanh) | Đoàn Thanh Niên (Lục) | Hội Phụ Nữ (Hồng)
        ═══════════════════════════════════════════ */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-3.5 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
              Cổng Fanpage Đoàn thể • Truy cập nhanh
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

            {/* Tab 1 (Đỏ): Fanpage MTTQ Phường Chánh Hưng */}
            <ColorTabCard
              index={8}
              onClick={() => handleExternal(getFanpageUrl('mttq', 'https://www.facebook.com/profile.php?id=61580661372890'))}
              title="Mặt trận Tổ quốc"
              gradient="bg-gradient-to-br from-red-600 via-red-700 to-amber-700"
              borderColor="border-red-400/40"
              shadowColor="shadow-red-900/30 hover:shadow-red-600/40"
              customIcon={
                <img
                  src="/mttq-logo.png"
                  alt="Logo MTTQ"
                  className="h-8 w-8 sm:h-9 sm:w-9 object-contain filter drop-shadow-md"
                />
              }
            />

            {/* Tab 2 (Xanh): Fanpage Công Đoàn Phường Chánh Hưng */}
            <ColorTabCard
              index={9}
              onClick={() => handleExternal(getFanpageUrl('congdoan', 'https://www.facebook.com/search/top?q=C%C3%B4ng%20%C4%90o%C3%A0n%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng'))}
              title="Công Đoàn"
              gradient="bg-gradient-to-br from-blue-600 via-indigo-700 to-sky-800"
              borderColor="border-blue-400/40"
              shadowColor="shadow-blue-900/30 hover:shadow-blue-600/40"
              icon={Briefcase}
            />

            {/* Tab 3 (Lục): Fanpage Đoàn Thanh Niên TNCS Hồ Chí Minh */}
            <ColorTabCard
              index={10}
              onClick={() => handleExternal(getFanpageUrl('doanthanhnien', 'https://www.facebook.com/search/top?q=%C4%90o%C3%A0n%20Thanh%20Ni%C3%AAn%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng'))}
              title="Đoàn Thanh Niên"
              gradient="bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800"
              borderColor="border-emerald-400/40"
              shadowColor="shadow-emerald-900/30 hover:shadow-emerald-600/40"
              icon={Sparkles}
            />

            {/* Tab 4 (Hồng): Fanpage Hội Liên Hiệp Phụ Nữ */}
            <ColorTabCard
              index={11}
              onClick={() => handleExternal(getFanpageUrl('phunu', 'https://www.facebook.com/search/top?q=H%E1%BB%99i%20Li%C3%AAn%20hi%E1%BB%87p%20Ph%E1%BB%A5%20n%E1%BB%AF%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng'))}
              title="Hội Phụ Nữ"
              gradient="bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800"
              borderColor="border-pink-400/40"
              shadowColor="shadow-pink-900/30 hover:shadow-pink-600/40"
              icon={Flower2}
            />

          </div>
        </div>

        {/* ─── Facebook Live Feed ─── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pl-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest">Tin tức từ Fanpage MTTQ</h2>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-black uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Live
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => handleExternal(FB_PAGE_URL)}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Xem Fanpage <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
          <FacebookFeed />
        </div>



        <div className="h-4 md:h-0" />
      </PageContainer>
    </div>
  );
}
