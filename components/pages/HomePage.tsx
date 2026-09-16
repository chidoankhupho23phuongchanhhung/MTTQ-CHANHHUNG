"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageContainer from '../layout/PageContainer';
import { cn } from '@/lib/utils';
import {
  MessageSquare, Bot, Compass, BookOpen,
  Shield, Flower2, FileText,
  Users, ArrowRight, Globe
} from 'lucide-react';

/* ─── per-index fade-up ─── */
const fadeUpProps = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.06, ease: 'easeOut' as const }
});

/* ─── External Links ─── */
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSflI6uajykE5zW3Ula8BSUFQelEbyXF04AnJfjTZ87sluz7ag/viewform';
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1ZsJfimQEU7WdHY5cK1KoO_ULELcSLlPf';
const MAT_TRAN_SO_TPHCM_URL = 'https://mttqtphcm.vn/';
const DICH_VU_CONG_URL = 'https://dichvucong.gov.vn';

/* ─── Fanpage Configuration for 4 Organizations ─── */
interface FanpageConfig {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  defaultBg: string;
  defaultUrl: string;
  gradient: string;
  borderColor: string;
  shadowColor: string;
}

const FANPAGES: FanpageConfig[] = [
  {
    id: 'mttq',
    name: 'Mặt trận Tổ quốc',
    shortName: 'MTTQ',
    logo: '/mttq-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    defaultUrl: 'https://www.facebook.com/profile.php?id=61580661372890',
    gradient: 'from-red-950/90 via-red-900/65 to-red-800/40',
    borderColor: 'border-red-500/40 hover:border-red-400',
    shadowColor: 'shadow-red-950/40 hover:shadow-red-700/40',
  },
  {
    id: 'congdoan',
    name: 'Công đoàn',
    shortName: 'Công đoàn',
    logo: '/congdoan-logo.svg',
    defaultBg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    defaultUrl: 'https://www.facebook.com/search/top?q=C%C3%B4ng%20%C4%90o%C3%A0n%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    gradient: 'from-blue-950/90 via-blue-900/65 to-indigo-800/40',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    shadowColor: 'shadow-blue-950/40 hover:shadow-blue-700/40',
  },
  {
    id: 'doanthanhnien',
    name: 'Đoàn Thanh niên',
    shortName: 'Đoàn TN',
    logo: '/doan-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    defaultUrl: 'https://www.facebook.com/search/top?q=%C4%90o%C3%A0n%20Thanh%20Ni%C3%AAn%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    gradient: 'from-emerald-950/90 via-emerald-900/65 to-teal-800/40',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    shadowColor: 'shadow-emerald-950/40 hover:shadow-emerald-700/40',
  },
  {
    id: 'phunu',
    name: 'Hội Phụ nữ',
    shortName: 'Hội PN',
    logo: '/phunu-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
    defaultUrl: 'https://www.facebook.com/search/top?q=H%E1%BB%99i%20Li%C3%AAn%20hi%E1%BB%87p%20Ph%E1%BB%A5%20n%E1%BB%AF%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    gradient: 'from-rose-950/90 via-pink-900/65 to-rose-800/40',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    shadowColor: 'shadow-rose-950/40 hover:shadow-rose-700/40',
  }
];

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

  const getFanpageBg = (id: string, defaultBg: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fanpage_bg_${id}`) || defaultBg;
    }
    return defaultBg;
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

  /* ─── Reusable Card Component with strict height uniformity ─── */
  const FeatureCard = ({
    index,
    onClick,
    icon: Icon,
    iconBg,
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
    hoverShadow: string;
    title: React.ReactNode;
    buttonLabel: string;
    buttonHoverColor: string;
    customIcon?: React.ReactNode;
  }) => (
    <motion.button
      {...fadeUpProps(index)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-between p-4 sm:p-5 md:p-6 rounded-3xl",
        "border border-slate-200/60 dark:border-slate-800/60",
        "bg-white/70 dark:bg-slate-900/50 backdrop-blur-md",
        "cursor-pointer transition-all duration-300",
        hoverShadow,
        "h-full min-h-[210px] sm:min-h-[235px] text-center w-full group select-none"
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        "p-3.5 sm:p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border flex-shrink-0 flex items-center justify-center",
        iconBg
      )}>
        {customIcon ? customIcon : Icon && <Icon className="h-7 w-7 sm:h-8 sm:w-8" />}
      </div>

      {/* Title - Fixed height so 1, 2, or 3 lines of text never cause vertical jumping */}
      <div className="flex-1 flex items-center justify-center my-2 sm:my-3 min-h-[50px] sm:min-h-[58px] px-1 w-full text-center">
        <div className="text-xs sm:text-sm md:text-base font-black text-slate-800 dark:text-white uppercase leading-snug tracking-tight">
          {title}
        </div>
      </div>

      {/* Action Button Box - pinned to bottom */}
      <div className="w-full mt-auto pt-1">
        <div className={cn(
          "flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl",
          "text-xs sm:text-[13px] font-black",
          "bg-slate-100 hover:bg-slate-200 text-slate-700",
          "dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200",
          "transition-all border border-slate-200/30 dark:border-slate-700/30",
          buttonHoverColor
        )}>
          <span>{buttonLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
        </div>
      </div>
    </motion.button>
  );

  /* ─── Vibrant Colored Tab Fanpage Card (Chỉ Logo + Tên, người dân chỉ click truy cập) ─── */
  const ColorTabCard = ({
    index,
    item,
  }: {
    index: number;
    item: FanpageConfig;
  }) => {
    const bg = getFanpageBg(item.id, item.defaultBg);
    const url = getFanpageUrl(item.id, item.defaultUrl);

    return (
      <motion.button
        {...fadeUpProps(index)}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => handleExternal(url)}
        className={cn(
          "relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl",
          "border overflow-hidden cursor-pointer transition-all duration-300 text-center w-full select-none group",
          "h-full min-h-[175px] sm:min-h-[195px] md:min-h-[210px] shadow-lg",
          item.borderColor,
          item.shadowColor
        )}
      >
        {/* Background image with gentle zoom on hover */}
        <img
          src={bg}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Tint gradient overlay matching organization identity */}
        <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none", item.gradient)} />
        <div className="absolute inset-0 bg-black/20 pointer-events-none group-hover:bg-black/10 transition-colors duration-300" />

        {/* Official Emblem / Logo Badge */}
        <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-white/95 dark:bg-white/90 p-2 sm:p-2.5 shadow-xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-white/40 mb-2 sm:mb-2.5 flex-shrink-0">
          <img
            src={item.logo}
            alt={item.name}
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </div>

        {/* Name: Only Logo + Name as requested */}
        <div className="relative z-10 h-[44px] flex items-center justify-center px-1">
          <span className="text-xs sm:text-sm md:text-[15px] font-black text-white uppercase leading-snug tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center select-none line-clamp-2">
            {item.name}
          </span>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="flex flex-col gap-0 pb-6">

      {/* ════════════════════════════════════════════
          HERO (Mobile app style banner)
      ════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[330px]">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&auto=format&fit=crop&q=80"
          alt="Cảnh phường Chánh Hưng"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.42) saturate(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/75 via-red-700/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/85 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4 px-4 sm:px-10 pt-8 pb-14 md:py-14">
          <motion.img
            src="/mttq-logo.png"
            alt="Logo MTTQ"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain filter drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          <motion.div
            className="flex flex-col items-center gap-2.5 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Cổng thông tin Mặt trận số — Phường Chánh Hưng
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight uppercase drop-shadow-2xl tracking-tight text-center">
              MẶT TRẬN SỐ<br />
              <span className="text-yellow-300">Phường Chánh Hưng</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-yellow-200 italic border-l-2 border-yellow-400 pl-3 leading-relaxed text-left">
              &quot;Đoàn kết – Dân chủ – Đổi mới – Phát triển&quot;
            </p>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ════════════════════════════════════════════ */}
      <PageContainer className="relative z-10 -mt-6 sm:-mt-8">

        {/* ═══════════════════════════════════════════
            ROW 1 — 4 cards per row (Equal heights)
            Không gian VH HCM | Tài liệu | Kiến nghị | Phong trào
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 items-stretch">

          {/* Card 1: Không gian Văn hóa Hồ Chí Minh */}
          <FeatureCard
            index={0}
            onClick={() => handleNav('/khong-gian-van-hoa-hcm')}
            icon={Compass}
            iconBg="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-100/50 dark:border-red-900/25"
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
                animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {phongTraoItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleNav(item.route)}
                        className="relative overflow-hidden rounded-2xl h-28 flex flex-col items-start justify-end p-4 shadow-md cursor-pointer group border border-white/10 text-left"
                      >
                        <img
                          src={item.bg} alt={item.label}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ filter: "brightness(0.38)" }}
                        />
                        <div className={cn("absolute inset-0 bg-gradient-to-t", item.accent)} />
                        <div className="relative z-10 flex flex-col gap-1">
                          <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg w-fit">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-white drop-shadow leading-tight">{item.label}</span>
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
            ROW 2 — 4 cards per row (Equal heights)
            Trợ lý AI | Mặt trận số TP. Hồ Chí Minh | Dịch vụ công | Bản đồ số
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 items-stretch">

          {/* Card 5: Trợ lý AI Mặt trận số */}
          <FeatureCard
            index={4}
            onClick={() => handleNav('/tong-dai-ai')}
            icon={Bot}
            iconBg="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/25"
            hoverShadow="hover:shadow-lg hover:shadow-blue-500/5"
            title={<>Trợ lý AI<br />Mặt trận số</>}
            buttonLabel="Dùng Trợ lý AI"
            buttonHoverColor="group-hover:border-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          />

          {/* Card 6: Mặt trận số Thành phố Hồ Chí Minh (Ghi rõ đầy đủ theo yêu cầu) */}
          <FeatureCard
            index={5}
            onClick={() => handleExternal(MAT_TRAN_SO_TPHCM_URL)}
            iconBg="bg-red-500/10 dark:bg-red-500/20 border-red-100/50 dark:border-red-900/25"
            hoverShadow="hover:shadow-lg hover:shadow-red-500/5"
            title={
              <div className="flex flex-col items-center">
                <span>Mặt trận số</span>
                <span className="text-[11px] sm:text-[13px] font-black tracking-tight mt-0.5">
                  Thành phố Hồ Chí Minh
                </span>
              </div>
            }
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

          {/* Card 7: Dịch vụ công trực tuyến */}
          <FeatureCard
            index={6}
            onClick={() => handleExternal(DICH_VU_CONG_URL)}
            iconBg="bg-sky-500/10 dark:bg-sky-500/20 border-sky-100/50 dark:border-sky-900/25"
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
            hoverShadow="hover:shadow-lg hover:shadow-teal-500/5"
            title={<>Bản đồ số<br />P. Chánh Hưng</>}
            buttonLabel="Xem bản đồ"
            buttonHoverColor="group-hover:border-teal-500/20 group-hover:text-teal-600 dark:group-hover:text-teal-400"
          />

        </div>

        {/* ═══════════════════════════════════════════
            ROW 3 — 4 Tab Màu Cổng Fanpage Đoàn Thể
            Mặt trận Tổ quốc | Công đoàn | Đoàn Thanh niên | Hội Phụ nữ
            (Chỉ Logo + Tên, người dân nhấn để truy cập trực tiếp)
        ═══════════════════════════════════════════ */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Cổng Fanpage Đoàn thể • Truy cập nhanh
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 items-stretch">
            {FANPAGES.map((item, index) => (
              <ColorTabCard
                key={item.id}
                index={8 + index}
                item={item}
              />
            ))}
          </div>
        </div>

      </PageContainer>

    </div>
  );
}
