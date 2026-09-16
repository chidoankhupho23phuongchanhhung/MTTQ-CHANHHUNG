"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon, Upload, X, Check, RotateCcw, Camera,
  ExternalLink, Sparkles, CheckCircle2, Shield, Flower2, FileText, Info
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import {
  DEFAULT_PHONG_TRAO,
  PhongTraoItem,
  getPhongTraoIcon,
  getPhongTraoBg,
  setPhongTraoBg,
  resetPhongTraoBg
} from '@/lib/phongTrao';

interface PhongTraoSectionProps {
  className?: string;
  onSelectEditItem?: (item: PhongTraoItem) => void;
}

export default function PhongTraoSection({ className }: PhongTraoSectionProps) {
  const { addNotification } = useAppStore();

  const [bgs, setBgs] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<PhongTraoItem | null>(null);
  const [tempBg, setTempBg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync backgrounds on mount & listen for custom storage update events
  const loadBackgrounds = () => {
    if (typeof window !== 'undefined') {
      const savedBgs: Record<string, string> = {};
      DEFAULT_PHONG_TRAO.forEach(item => {
        const b = localStorage.getItem(`phongtrao_bg_${item.id}`);
        if (b) savedBgs[item.id] = b;
      });
      setBgs(savedBgs);
    }
  };

  useEffect(() => {
    loadBackgrounds();
    const handleUpdate = () => loadBackgrounds();
    window.addEventListener('phongtrao-bg-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('phongtrao-bg-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getBg = (item: PhongTraoItem) => bgs[item.id] || item.defaultBg;

  const handleOpenEdit = (item: PhongTraoItem) => {
    setEditingItem(item);
    setTempBg(getBg(item));
    setUploadedFileName(null);
    setUploading(false);
  };

  const handleSave = () => {
    if (!editingItem) return;

    const trimmedBg = tempBg.trim();
    const isDefault = trimmedBg === editingItem.defaultBg || !trimmedBg;

    if (isDefault) {
      resetPhongTraoBg(editingItem.id);
      const newBgs = { ...bgs };
      delete newBgs[editingItem.id];
      setBgs(newBgs);
    } else {
      setPhongTraoBg(editingItem.id, trimmedBg);
      setBgs({ ...bgs, [editingItem.id]: trimmedBg });
    }

    addNotification(
      'Cập nhật thành công',
      `Đã lưu ảnh nền mới cho phong trào "${editingItem.shortLabel}"`,
      'success'
    );

    setEditingItem(null);
  };

  const handleResetToDefault = (item: PhongTraoItem) => {
    resetPhongTraoBg(item.id);
    const newBgs = { ...bgs };
    delete newBgs[item.id];
    setBgs(newBgs);
    addNotification(
      'Đã khôi phục',
      `Đã đặt lại ảnh nền mặc định cho "${item.shortLabel}"`,
      'info'
    );
  };

  // Process uploaded local image with canvas compression
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 15MB');
      return;
    }

    setUploading(true);
    setUploadedFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = async () => {
          try {
            const maxWidth = 1200;
            const maxHeight = 800;
            let targetW = img.width;
            let targetH = img.height;

            if (targetW > maxWidth || targetH > maxHeight) {
              const ratio = Math.min(maxWidth / targetW, maxHeight / targetH);
              targetW = Math.round(targetW * ratio);
              targetH = Math.round(targetH * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, targetW, targetH);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
              setTempBg(compressedDataUrl);

              // Upload to Firebase Storage if available
              try {
                const { getFirebaseStorage } = await import('@/lib/firebase');
                const storage = await getFirebaseStorage();
                if (storage && editingItem) {
                  const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
                  const storageRef = ref(storage, `phongtrao/${editingItem.id}_${Date.now()}.jpg`);
                  await uploadString(storageRef, compressedDataUrl, 'data_url');
                  const downloadUrl = await getDownloadURL(storageRef);
                  if (downloadUrl) {
                    setTempBg(downloadUrl);
                  }
                }
              } catch (fbErr) {
                console.log('Firebase storage upload fallback to local data url', fbErr);
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
    e.target.value = '';
  };

  return (
    <div className={cn("relative", className)}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Quản lý Ảnh nền Phong trào thi đua
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tùy chỉnh ảnh nền hiển thị của các phong trào ngoài trang chủ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            3 Phong trào
          </span>
        </div>
      </div>

      {/* Grid of 3 Movements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_PHONG_TRAO.map((item, index) => {
          const currentBg = getBg(item);
          const hasCustomBg = !!bgs[item.id];
          const Icon = getPhongTraoIcon(item.iconName);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-150 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-xs hover:shadow-lg border-slate-200 dark:border-slate-800 group"
            >
              {/* Top Bar Accent */}
              <div className={cn("absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r", item.accent)} />

              {/* Card Header: Icon + Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-2xl border shadow-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    {item.tag}
                  </span>
                  {hasCustomBg && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Tùy chỉnh
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="flex-1 flex flex-col justify-start mb-3">
                <h4 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white uppercase leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {item.label}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed line-clamp-2 font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Background Thumbnail Preview */}
              <div className="mb-3 relative rounded-xl overflow-hidden h-20 border border-slate-200 dark:border-slate-700/80 group/thumb">
                <img
                  src={currentBg}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none", item.accent)} />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white drop-shadow">
                  <span className="text-[10px] font-extrabold uppercase line-clamp-1">
                    {item.shortLabel}
                  </span>
                  <span className="text-[9px] font-semibold bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    Ảnh đang dùng
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Đổi ảnh nền</span>
                </button>

                {hasCustomBg && (
                  <button
                    onClick={() => handleResetToDefault(item)}
                    title="Đặt lại ảnh mẫu ban đầu"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          EDIT MODAL
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Top Accent Bar */}
              <div className={cn("h-2 w-full bg-gradient-to-r", editingItem.accent)} />

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 pr-2">
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Đổi ảnh nền phong trào
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {editingItem.label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* Live Preview Box */}
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Xem trước thẻ ngoài trang chủ:
                  </span>
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner flex flex-col justify-between p-4">
                    <img
                      src={tempBg || editingItem.defaultBg}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none", editingItem.accent)} />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                    {/* Preview Content */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg w-fit">
                        {React.createElement(getPhongTraoIcon(editingItem.iconName), { className: "h-4 w-4 text-white" })}
                      </div>
                      <span className="text-[9px] font-black bg-black/40 text-white/90 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Trực tiếp
                      </span>
                    </div>

                    <div className="relative z-10 mt-auto">
                      <span className="text-xs sm:text-[13px] font-black text-white drop-shadow leading-snug line-clamp-2">
                        {editingItem.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Presets Gallery */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    Chọn ảnh mẫu tiêu chuẩn có sẵn:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {editingItem.presets.map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTempBg(presetUrl);
                          setUploadedFileName(null);
                        }}
                        className={cn(
                          "relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group",
                          tempBg === presetUrl
                            ? "border-purple-600 dark:border-purple-400 scale-95 shadow-md ring-2 ring-purple-500/30"
                            : "border-transparent opacity-80 hover:opacity-100 hover:scale-102"
                        )}
                      >
                        <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        {tempBg === presetUrl && (
                          <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-purple-500" />
                    Tải ảnh từ máy tính hoặc điện thoại:
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none",
                      uploading
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 pointer-events-none"
                        : "border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50/20 dark:hover:bg-purple-950/10"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {uploading ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-purple-600">Đang tối ưu và tải ảnh lên...</span>
                      </div>
                    ) : uploadedFileName ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold truncate max-w-[260px]">Đã chọn: {uploadedFileName}</span>
                        <span className="text-[10px] text-slate-400 font-normal underline">(bấm để đổi)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Camera className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Bấm vào đây để chọn ảnh
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Hỗ trợ PNG, JPG, WEBP (Tự động nén tối ưu hiển thị nhanh)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
                    Hoặc dán đường link ảnh trực tiếp:
                  </label>
                  <input
                    type="url"
                    value={tempBg}
                    onChange={(e) => {
                      setTempBg(e.target.value);
                      setUploadedFileName(null);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => {
                    setTempBg(editingItem.defaultBg);
                    setUploadedFileName(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Mặc định ban đầu
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
