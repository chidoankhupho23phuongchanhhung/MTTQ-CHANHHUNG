"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink, Copy, Check, Edit3, Globe,
  Image as ImageIcon, Link as LinkIcon, RotateCcw,
  Sparkles, Camera, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useAppStore } from '@/store/useAppStore';

interface FanpageItem {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  desc: string;
  defaultUrl: string;
  logo: string;
  defaultBg: string;
  gradient: string;
  presets: string[];
  colorScheme: {
    bgLight: string;
    border: string;
    badge: string;
    badgeText: string;
    btnHover: string;
    iconBg: string;
  };
}

const DEFAULT_FANPAGES: FanpageItem[] = [
  {
    id: 'mttq',
    name: 'Mặt trận Tổ Quốc Việt Nam Phường Chánh Hưng',
    shortName: 'Mặt trận Tổ Quốc Việt Nam Phường Chánh Hưng',
    tag: 'Cổng Mặt Trận',
    desc: 'Đại đoàn kết toàn dân tộc - Lắng nghe ý kiến và tâm tư nguyện vọng của nhân dân',
    defaultUrl: 'https://www.facebook.com/profile.php?id=61580661372890',
    logo: '/mttq-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-red-950/90 via-red-900/65 to-red-800/40',
    presets: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80'
    ],
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
    shortName: 'Công Đoàn Phường Chánh Hưng',
    tag: 'Công đoàn VN',
    desc: 'Chăm lo, đại diện, bảo vệ quyền và lợi ích hợp pháp, chính đáng của người lao động',
    defaultUrl: 'https://www.facebook.com/search/top?q=C%C3%B4ng%20%C4%90o%C3%A0n%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    logo: '/congdoan-logo.svg',
    defaultBg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-blue-950/90 via-blue-900/65 to-indigo-800/40',
    presets: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80'
    ],
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
    name: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hưng',
    shortName: 'Đoàn TNCS Hồ Chí Minh Phường Chánh Hưng',
    tag: 'Tuổi trẻ Chánh Hưng',
    desc: 'Khát vọng - Tiên phong - Bản lĩnh - Đoàn kết - Sáng tạo vì cộng đồng văn minh',
    defaultUrl: 'https://www.facebook.com/search/top?q=%C4%90o%C3%A0n%20Thanh%20Ni%C3%AAn%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    logo: '/doan-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-950/90 via-emerald-900/65 to-teal-800/40',
    presets: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80'
    ],
    colorScheme: {
      bgLight: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      border: 'border-emerald-200/50 dark:border-emerald-900/30',
      badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      badgeText: 'Đang liên kết',
      btnHover: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-blue-400 border-emerald-200/60 dark:border-emerald-800/40',
    }
  },
  {
    id: 'phunu',
    name: 'Hội Liên Hiệp Phụ Nữ Phường Chánh Hưng',
    shortName: 'Hội Liên Hiệp Phụ Nữ Phường Chánh Hưng',
    tag: 'Phụ nữ VN',
    desc: 'Tự tin - Tự trọng - Trung hậu - Đảm đang, xây dựng gia đình hạnh phúc, bình đẳng',
    defaultUrl: 'https://www.facebook.com/search/top?q=H%E1%BB%99i%20Li%C3%AAn%20hi%E1%BB%87p%20Ph%E1%BB%A5%20n%E1%BB%AF%20Ph%C6%B0%E1%BB%9Dng%20Ch%C3%A1nh%20H%C6%B0ng',
    logo: '/phunu-logo.png',
    defaultBg: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-rose-950/90 via-pink-900/65 to-rose-800/40',
    presets: [
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ],
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
  const { addNotification } = useAppStore();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [bgs, setBgs] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<FanpageItem | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [tempBg, setTempBg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process and compress image file
  const processFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (JPG, PNG, WebP...)');
      return;
    }

    setUploading(true);
    setUploadedFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const maxDim = 1200;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
              setTempBg(compressedDataUrl);

              // Attempt upload to Firebase Storage
              try {
                const { getFirebaseStorage } = await import('@/lib/firebase');
                const storage = await getFirebaseStorage();
                if (storage && editingItem) {
                  const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
                  const storageRef = ref(storage, `fanpages/${editingItem.id}_${Date.now()}.jpg`);
                  await uploadString(storageRef, compressedDataUrl, 'data_url');
                  const downloadUrl = await getDownloadURL(storageRef);
                  if (downloadUrl) {
                    setTempBg(downloadUrl);
                  }
                }
              } catch (fbErr) {
                console.log('Firebase storage upload skipped/cached locally', fbErr);
              }
            }
          } finally {
            setUploading(false);
          }
        };
        img.onerror = () => {
          console.error('Failed to load image element');
          setUploading(false);
        };
        img.src = rawDataUrl;
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error', err);
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Clear input value so selecting the same file triggers onChange again
    e.target.value = '';
  };

  // Load custom URLs & Backgrounds from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrls: Record<string, string> = {};
      const savedBgs: Record<string, string> = {};
      DEFAULT_FANPAGES.forEach(item => {
        const u = localStorage.getItem(`fanpage_url_${item.id}`);
        if (u) savedUrls[item.id] = u;
        const b = localStorage.getItem(`fanpage_bg_${item.id}`);
        if (b) savedBgs[item.id] = b;
      });
      setUrls(savedUrls);
      setBgs(savedBgs);
    }
  }, []);

  const getUrl = (item: FanpageItem) => urls[item.id] || item.defaultUrl;
  const getBg = (item: FanpageItem) => bgs[item.id] || item.defaultBg;

  const handleOpenEdit = (item: FanpageItem) => {
    setEditingItem(item);
    setTempUrl(getUrl(item));
    setTempBg(getBg(item));
    setUploadedFileName(null);
    setUploading(false);
  };

  const handleSave = () => {
    if (!editingItem) return;

    const trimmedUrl = tempUrl.trim();
    const trimmedBg = tempBg.trim();

    const newUrls = { ...urls, [editingItem.id]: trimmedUrl || editingItem.defaultUrl };
    const newBgs = { ...bgs, [editingItem.id]: trimmedBg || editingItem.defaultBg };

    setUrls(newUrls);
    setBgs(newBgs);

    if (typeof window !== 'undefined') {
      if (trimmedUrl && trimmedUrl !== editingItem.defaultUrl) {
        localStorage.setItem(`fanpage_url_${editingItem.id}`, trimmedUrl);
      } else {
        localStorage.removeItem(`fanpage_url_${editingItem.id}`);
      }

      if (trimmedBg && trimmedBg !== editingItem.defaultBg) {
        localStorage.setItem(`fanpage_bg_${editingItem.id}`, trimmedBg);
      } else {
        localStorage.removeItem(`fanpage_bg_${editingItem.id}`);
      }
    }

    addNotification(
      'Cập nhật thành công',
      `Đã lưu ảnh nền & liên kết Fanpage ${editingItem.shortName}`,
      'success'
    );

    setEditingItem(null);
  };

  const handleReset = () => {
    if (!editingItem) return;
    setTempUrl(editingItem.defaultUrl);
    setTempBg(editingItem.defaultBg);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Quản lý Hệ thống 4 Fanpage Đoàn thể
            </h3>
            <p className="text-[11px] text-slate-400">
              Quản lý liên kết chính thức và tùy chỉnh ảnh nền hiển thị trên trang chủ cho từng đoàn thể
            </p>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {DEFAULT_FANPAGES.map((item, index) => {
          const currentUrl = getUrl(item);
          const currentBg = getBg(item);
          const isCopied = copiedId === item.id;
          const hasCustomUrl = !!urls[item.id];
          const hasCustomBg = !!bgs[item.id];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className={cn(
                "relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-150",
                "bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-xs hover:shadow-lg group",
                item.colorScheme.border
              )}
            >
              {/* Top Accent Gradient Bar */}
              <div className={cn("absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r", item.colorScheme.bgLight)} />

              {/* Card Header: Logo + Tag Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={cn("p-2 rounded-2xl border shadow-xs flex-shrink-0 bg-white/90 dark:bg-white/10 flex items-center justify-center", item.colorScheme.iconBg)}>
                  <img src={item.logo} alt={item.name} className="h-8 w-8 object-contain" />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide", item.colorScheme.badge)}>
                    {item.tag}
                  </span>
                  {(hasCustomUrl || hasCustomBg) && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Tùy chỉnh
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col justify-start mb-3">
                <h4 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white uppercase leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2 font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Background Thumbnail Preview */}
              <div className="mb-3 relative rounded-xl overflow-hidden h-16 border border-slate-200 dark:border-slate-700/80 group/thumb">
                <img src={currentBg} alt="Ảnh nền hiện tại" className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform" />
                <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none", item.gradient)} />
                <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white/90 drop-shadow flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Ảnh nền trang chủ
                </span>
                {hasCustomBg && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded shadow">
                    Đã đổi
                  </span>
                )}
              </div>

              {/* URL Display Bar */}
              <div className="mb-3 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[170px]" title={currentUrl}>
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
                </div>
              </div>

              {/* Buttons: Edit & Open Fanpage */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Đổi ảnh / Link</span>
                </button>

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-sm",
                    item.colorScheme.btnHover
                  )}
                >
                  <span>Mở Fanpage</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Fanpage & Background Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={editingItem ? `Chỉnh sửa Fanpage: ${editingItem.shortName}` : 'Chỉnh sửa'}
        size="md"
      >
        {editingItem && (
          <div className="flex flex-col gap-4 text-left">
            {/* Live Preview Box */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Xem trước thẻ hiển thị ở trang chủ:
              </span>
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center">
                <img
                  src={tempBg || editingItem.defaultBg}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none", editingItem.gradient)} />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                {/* Logo & Title preview */}
                <div className="relative z-10 w-12 h-12 rounded-xl bg-white/95 p-2 shadow-lg flex items-center justify-center mb-1.5 border border-white/40">
                  <img src={editingItem.logo} alt={editingItem.name} className="w-full h-full object-contain" />
                </div>
                <span className="relative z-10 text-xs sm:text-sm font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {editingItem.shortName}
                </span>
                <span className="absolute bottom-2 right-2.5 z-10 text-[10px] font-bold bg-black/50 text-white/90 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Trực tiếp
                </span>
              </div>
            </div>

            {/* Presets Gallery */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                Chọn ảnh mẫu tiêu chuẩn có sẵn:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {editingItem.presets.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempBg(presetUrl)}
                    className={cn(
                      "relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group",
                      tempBg === presetUrl
                        ? "border-blue-500 ring-2 ring-blue-500/30 scale-95"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    )}
                  >
                    <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    {tempBg === presetUrl && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Image Upload from Device (Firebase / Local Storage) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-500" />
                Tải ảnh lên từ máy tính / điện thoại:
              </label>

              {/* Native label click trigger — 100% works across all browsers including Safari */}
              <label
                htmlFor="fanpage-upload-input"
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none",
                  uploading
                    ? "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
                    : uploadedFileName
                    ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50"
                    : "border-blue-400 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
              >
                <input
                  id="fanpage-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                />

                <div className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : uploadedFileName ? (
                    <Check className="w-5 h-5 text-emerald-600 stroke-[3px]" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {uploading
                      ? 'Đang nén & lưu ảnh...'
                      : uploadedFileName
                      ? `✓ Đã tải ảnh: ${uploadedFileName}`
                      : 'Bấm vào đây để chọn ảnh từ máy (hoặc kéo thả ảnh vào)'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Hỗ trợ JPG, PNG, WebP (Tối đa 15MB) • Tự động nén & đồng bộ Firebase
                  </p>
                </div>
              </label>
            </div>

            {/* Custom Background Image URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                Hoặc dán URL ảnh nền tùy chỉnh:
              </label>
              <Input
                value={tempBg}
                onChange={(e) => setTempBg(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs font-mono"
              />
            </div>

            {/* Fanpage Link URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                Đường dẫn liên kết Fanpage Facebook:
              </label>
              <Input
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://www.facebook.com/..."
                className="w-full text-xs font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Khôi phục mặc định
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                  className="text-slate-600 dark:text-slate-300 font-bold"
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  className="font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                >
                  <Check className="w-3.5 h-3.5 mr-1 stroke-[3px]" />
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
