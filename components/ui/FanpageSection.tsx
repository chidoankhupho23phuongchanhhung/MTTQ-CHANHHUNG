"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Copy, Check, Edit3, Globe,
  Briefcase, Sparkles, Flower2, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

interface FanpageItem {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  desc: string;
  defaultUrl: string;
  colorScheme: {
    bgLight: string;
    border: string;
    badge: string;
    badgeText: string;
    btnHover: string;
    iconBg: string;
  };
  logo?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const DEFAULT_FANPAGES: FanpageItem[] = [
  {
    id: 'mttq',
    name: 'Mặt trận Tổ Quốc Phường Chánh Hưng',
    shortName: 'MTTQ Chánh Hưng',
    tag: 'Cổng Mặt Trận',
    desc: 'Đại đoàn kết toàn dân tộc - Lắng nghe ý kiến và tâm tư nguyện vọng của nhân dân',
    defaultUrl: 'https://www.facebook.com/profile.php?id=61580661372890',
    logo: '/mttq-logo.png',
    colorScheme: {
      bgLight: 'from-red-500/10 via-amber-500/5 to-transparent',
      border: 'border-red-200/50 dark:border-red-900/30',
      badge: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      badgeText: 'Trực tuyến',
      btnHover: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
      iconBg: 'bg-red-500/15 border-red-200/60 dark:border-red-800/40',
    }
  },
  {
    id: 'congdoan',
    name: 'Công Đoàn Phường Chánh Hưng',
    shortName: 'Công Đoàn Chánh Hưng',
    tag: 'Công đoàn VN',
    desc: 'Chăm lo, đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của người lao động',
    defaultUrl: 'https://www.facebook.com/search/top?q=C%C3%B4ng%20%C4%90o%C3%A0n%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    icon: Briefcase,
    colorScheme: {
      bgLight: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      border: 'border-blue-200/50 dark:border-blue-900/30',
      badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      badgeText: 'Đang liên kết',
      btnHover: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40',
    }
  },
  {
    id: 'doanthanhnien',
    name: 'Đoàn Thanh Niên TNCS Hồ Chí Minh Phường Chánh Hưng',
    shortName: 'Đoàn Thanh Niên',
    tag: 'Tuổi trẻ Chánh Hưng',
    desc: 'Khát vọng - Tiên phong - Bản lĩnh - Đoàn kết - Sáng tạo vì cộng đồng văn minh',
    defaultUrl: 'https://www.facebook.com/search/top?q=%C4%90o%C3%A0n%20Thanh%20Ni%C3%AAn%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    icon: Sparkles,
    colorScheme: {
      bgLight: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      border: 'border-emerald-200/50 dark:border-emerald-900/30',
      badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      badgeText: 'Đang liên kết',
      btnHover: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
    }
  },
  {
    id: 'phunu',
    name: 'Hội Liên Hiệp Phụ Nữ Phường Chánh Hưng',
    shortName: 'Hội Phụ Nữ',
    tag: 'Phụ nữ VN',
    desc: 'Tự tin - Tự trọng - Trung hậu - Đảm đang, xây dựng gia đình hạnh phúc, bình đẳng',
    defaultUrl: 'https://www.facebook.com/search/top?q=H%E1%BB%99i%20Li%C3%AAn%20hi%E1%BB%87p%20Ph%E1%BB%A5%20n%E1%BB%AF%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    icon: Flower2,
    colorScheme: {
      bgLight: 'from-pink-500/10 via-rose-500/5 to-transparent',
      border: 'border-pink-200/50 dark:border-pink-900/30',
      badge: 'bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      badgeText: 'Đang liên kết',
      btnHover: 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/20',
      iconBg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-200/60 dark:border-pink-800/40',
    }
  }
];

export default function FanpageSection({ className }: { className?: string }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<FanpageItem | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load custom URLs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved: Record<string, string> = {};
      DEFAULT_FANPAGES.forEach(item => {
        const val = localStorage.getItem(`fanpage_url_${item.id}`);
        if (val) saved[item.id] = val;
      });
      setUrls(saved);
    }
  }, []);

  const getUrl = (item: FanpageItem) => urls[item.id] || item.defaultUrl;

  const handleOpenEdit = (item: FanpageItem) => {
    setEditingItem(item);
    setTempUrl(getUrl(item));
  };

  const handleSaveUrl = () => {
    if (!editingItem) return;
    const newUrls = { ...urls, [editingItem.id]: tempUrl.trim() || editingItem.defaultUrl };
    setUrls(newUrls);
    if (typeof window !== 'undefined') {
      if (tempUrl.trim() && tempUrl.trim() !== editingItem.defaultUrl) {
        localStorage.setItem(`fanpage_url_${editingItem.id}`, tempUrl.trim());
      } else {
        localStorage.removeItem(`fanpage_url_${editingItem.id}`);
      }
    }
    setEditingItem(null);
  };

  const handleResetUrl = () => {
    if (!editingItem) return;
    setTempUrl(editingItem.defaultUrl);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Hệ thống Fanpage Đoàn thể Phường Chánh Hưng
            </h3>
            <p className="text-[10px] text-slate-400">
              Liên kết các trang thông tin trực tuyến chính thức của các ban ngành, đoàn thể địa phương
            </p>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {DEFAULT_FANPAGES.map((item, index) => {
          const currentUrl = getUrl(item);
          const Icon = item.icon;
          const isCopied = copiedId === item.id;
          const hasCustomUrl = !!urls[item.id];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className={cn(
                "relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300",
                "bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-md group",
                item.colorScheme.border
              )}
            >
              {/* Top Accent Gradient Bar */}
              <div className={cn("absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r", item.colorScheme.bgLight)} />

              {/* Card Header: Icon/Logo + Tag Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={cn("p-2.5 rounded-2xl border shadow-xs flex-shrink-0", item.colorScheme.iconBg)}>
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-7 w-7 object-contain" />
                  ) : Icon ? (
                    <Icon className="h-6 w-6" />
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide", item.colorScheme.badge)}>
                    {item.tag}
                  </span>
                  {hasCustomUrl && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Tùy chỉnh
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col justify-start mb-4">
                <h4 className="text-xs sm:text-[13px] font-black text-slate-800 dark:text-white uppercase leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* URL Display Bar */}
              <div className="mb-4 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[170px]" title={currentUrl}>
                  {currentUrl}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(item.id, currentUrl)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Sao chép liên kết"
                  >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Chỉnh sửa liên kết Fanpage"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Action Button: Open Fanpage */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl",
                  "text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm",
                  item.colorScheme.btnHover
                )}
              >
                <span>Truy cập Fanpage</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Edit URL Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Cập nhật liên kết Fanpage: ${editingItem?.shortName}`}
        size="sm"
      >
        {editingItem && (
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 block">
                Đường dẫn URL Fanpage Facebook chính thức:
              </label>
              <Input
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://www.facebook.com/..."
                className="w-full text-xs font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Dán đường dẫn trực tiếp đến Fanpage của {editingItem.name}. Link sẽ được lưu tự động trên máy của bạn.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetUrl}
                className="text-[10px] font-bold text-slate-500"
              >
                Khôi phục mặc định
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveUrl}
                  className="font-bold"
                >
                  Lưu liên kết
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
