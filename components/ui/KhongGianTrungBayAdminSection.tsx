"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, Plus, Trash2, Edit3, Upload, Check,
  Sparkles, Eye, RefreshCw, Palette, ExternalLink,
  Info, Calendar, MapPin, FileText, Image as ImageIcon,
  Save, RotateCcw, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import Button from './Button';
import {
  Cabinet,
  Artifact,
  WallpaperPreset,
  WALLPAPER_PRESETS,
  DEFAULT_CABINETS
} from '@/lib/culturalSpaceData';

interface KhongGianTrungBayAdminSectionProps {
  className?: string;
}

export default function KhongGianTrungBayAdminSection({ className }: KhongGianTrungBayAdminSectionProps) {
  const { addNotification } = useAppStore();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'hien-vat' | 'phong-nen'>('hien-vat');

  // Artifacts state
  const [cabinets, setCabinets] = useState<Cabinet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mttq_cabinets_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_CABINETS;
  });

  // Wallpaper state
  const [wallBackUrl, setWallBackUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mttq_3d_wall_back') || '/wall-back.png';
    }
    return '/wall-back.png';
  });
  const [wallSideUrl, setWallSideUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mttq_3d_wall_side') || '/wall-side.png';
    }
    return '/wall-side.png';
  });

  // Modal / Form state for Add/Edit Artifact
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Kỷ vật thiêng liêng');
  const [formYear, setFormYear] = useState('');
  const [formSource, setFormSource] = useState('Ủy ban MTTQ Việt Nam Phường Chánh Hưng');
  const [formDesc, setFormDesc] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formImage, setFormImage] = useState('');

  // Wallpaper custom input
  const [customBgInput, setCustomBgInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Hidden file inputs
  const artifactFileInputRef = useRef<HTMLInputElement>(null);
  const wallFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial data from server settings API
  const loadServerSettings = useCallback(async () => {
    try {
      const res = await fetch(`/api/settings?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cabinets) && data.cabinets.length > 0) {
          setCabinets(data.cabinets);
          if (typeof window !== 'undefined') {
            try { localStorage.setItem('mttq_cabinets_v2', JSON.stringify(data.cabinets)); } catch {}
          }
        }
        if (data.culturalSpace?.wallBackUrl) {
          setWallBackUrl(data.culturalSpace.wallBackUrl);
          setWallSideUrl(data.culturalSpace.wallSideUrl || data.culturalSpace.wallBackUrl);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('mttq_3d_wall_back', data.culturalSpace.wallBackUrl);
              localStorage.setItem('mttq_3d_wall_side', data.culturalSpace.wallSideUrl || data.culturalSpace.wallBackUrl);
            } catch {}
          }
        }
      }
    } catch (err) {
      console.warn('Lỗi đọc cấu hình Không gian trưng bày:', err);
    }
  }, []);

  useEffect(() => {
    loadServerSettings();
  }, [loadServerSettings]);

  // Persist cabinets to Server API and LocalStorage
  const saveCabinets = async (updated: Cabinet[], toastMsg = 'Đã cập nhật danh sách hiện vật') => {
    setCabinets(updated);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('mttq_cabinets_v2', JSON.stringify(updated)); } catch {}
      window.dispatchEvent(new Event('cabinets-updated'));
      window.dispatchEvent(new Event('storage'));
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cabinets',
          data: updated,
        }),
      });
      setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
      addNotification('Thành công', toastMsg, 'success');
    } catch (err) {
      addNotification('Lưu ý', 'Đã lưu cục bộ, đang đợi kết nối Cloud', 'warning');
    }
  };

  // Persist wallpaper to Server API and LocalStorage
  const saveWallpaper = async (backUrl: string, sideUrl?: string, toastMsg = 'Đã đổi phông nền không gian trưng bày') => {
    const targetSide = sideUrl || backUrl;
    setWallBackUrl(backUrl);
    setWallSideUrl(targetSide);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mttq_3d_wall_back', backUrl);
        localStorage.setItem('mttq_3d_wall_side', targetSide);
      } catch {}
      window.dispatchEvent(new Event('cultural-space-updated'));
      window.dispatchEvent(new Event('storage'));
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'culturalSpace',
          data: { wallBackUrl: backUrl, wallSideUrl: targetSide },
        }),
      });
      setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
      addNotification('Thành công', toastMsg, 'success');
    } catch (err) {
      addNotification('Lưu ý', 'Đã lưu cục bộ phông nền', 'warning');
    }
  };

  // Open modal for new artifact
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory('Kỷ vật thiêng liêng');
    setFormYear(new Date().getFullYear().toString());
    setFormSource('Ủy ban MTTQ Việt Nam Phường Chánh Hưng');
    setFormDesc('');
    setFormDetails('');
    setFormImage('/cab1.jpg');
    setModalOpen(true);
  };

  // Open modal for editing existing artifact
  const handleOpenEdit = (c: Cabinet) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormCategory(c.category);
    setFormYear(c.year);
    setFormSource(c.source);
    setFormDesc(c.description);
    setFormDetails(c.details.join('\n'));
    setFormImage(c.image);
    setModalOpen(true);
  };

  // Save Add/Edit Artifact Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addNotification('Thiếu thông tin', 'Vui lòng nhập tên hiện vật', 'error');
      return;
    }

    const detailList = formDetails
      ? formDetails.split('\n').map(s => s.trim()).filter(Boolean)
      : ['Hiện vật số hoá lưu giữ tại Không gian trưng bày MTTQ Phường Chánh Hưng.'];

    if (editingId) {
      // Update existing
      const updated = cabinets.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            name: formName.trim(),
            category: formCategory.trim(),
            year: formYear.trim() || 'Hiện đại',
            source: formSource.trim() || 'Ủy ban MTTQ Việt Nam Phường Chánh Hưng',
            description: formDesc.trim() || c.description,
            details: detailList,
            image: formImage || c.image,
          };
        }
        return c;
      });
      await saveCabinets(updated, `Đã cập nhật hiện vật "${formName.trim()}"`);
    } else {
      // Add new
      const newArtifact: Cabinet = {
        id: `cab-custom-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim() || 'Hiện vật trưng bày',
        description: formDesc.trim() || 'Hiện vật trưng bày lưu giữ tại Không gian Văn hóa Hồ Chí Minh - MTTQ Phường Chánh Hưng.',
        image: formImage || '/cab1.jpg',
        defaultImage: formImage || '/cab1.jpg',
        year: formYear.trim() || 'Hiện đại',
        source: formSource.trim() || 'Ủy ban MTTQ Việt Nam Phường Chánh Hưng',
        details: detailList,
        xrayNote: 'Hiện vật số hoá bảo quản theo tiêu chuẩn quốc gia.',
        infraNote: 'Bảo quản kỹ thuật số.'
      };
      const updated = [...cabinets, newArtifact];
      await saveCabinets(updated, `Đã thêm hiện vật mới "${formName.trim()}"`);
    }

    setModalOpen(false);
  };

  // Delete Artifact
  const handleDeleteArtifact = async (id: string, name: string) => {
    if (typeof window !== 'undefined' && !window.confirm(`Bạn có chắc chắn muốn xoá hiện vật "${name}" khỏi không gian trưng bày?`)) {
      return;
    }
    const updated = cabinets.filter(c => c.id !== id);
    await saveCabinets(updated, `Đã xoá hiện vật "${name}"`);
  };

  // Reset Artifact image to default
  const handleResetArtifactImage = async (c: Cabinet) => {
    const updated = cabinets.map(item => item.id === c.id ? { ...item, image: c.defaultImage } : item);
    await saveCabinets(updated, `Đã khôi phục ảnh mặc định cho hiện vật "${c.name}"`);
  };

  // Handle local image file upload for artifact
  const handleArtifactFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side image compression
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
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
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormImage(compressed);
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle local image file upload for wallpaper
  const handleWallFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1600;
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
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          saveWallpaper(compressed, compressed, 'Đã cập nhật ảnh nền tường tùy biến từ thiết bị');
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Hidden File Inputs */}
      <input ref={artifactFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleArtifactFileChange} />
      <input ref={wallFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleWallFileChange} />

      {/* Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-red-950/80 via-slate-900/90 to-amber-950/70 border border-yellow-700/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-600/30 shrink-0">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                  Không gian trưng bày & Hiện vật
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  Admin 3D
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Quản lý các hiện vật lịch sử, kỷ vật cách mạng và tùy biến phông nền không gian trưng bày 3D phục vụ cán bộ và nhân dân
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => window.open('/khong-gian-van-hoa-hcm', '_blank')}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1.5 border-yellow-600/40 text-yellow-300 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Xem phòng 3D</span>
            </Button>
            
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold shadow-md shadow-amber-600/30 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm hiện vật</span>
            </Button>
          </div>
        </div>

        {lastSavedTime && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-yellow-200/80">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Đã đồng bộ Cloud vĩnh viễn lúc: <strong>{lastSavedTime}</strong></span>
          </div>
        )}
      </GlassCard>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('hien-vat')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            subTab === 'hien-vat'
              ? "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Landmark className="w-4 h-4" />
          <span>Danh sách Hiện vật trưng bày ({cabinets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('phong-nen')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            subTab === 'phong-nen'
              ? "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Palette className="w-4 h-4" />
          <span>Phông nền Không gian trưng bày 3D</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-TAB 1: DANH SÁCH HIỆN VẬT TRƯNG BÀY
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === 'hien-vat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Các hiện vật đang được trưng bày trong không gian 3D
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mỗi hiện vật sẽ được định vị trên một trụ bệ đá trang trọng và gắn tranh tư liệu tương tác
              </p>
            </div>
            <Button onClick={handleOpenAdd} size="sm" className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm hiện vật mới</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabinets.map((c, idx) => {
              const isCustom = c.id.startsWith('cab-custom-');
              return (
                <GlassCard
                  key={c.id}
                  hoverable={false}
                  className="p-4 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 shadow-xs group"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-slate-200 dark:border-slate-800">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-yellow-300 backdrop-blur-md border border-white/20">
                        {c.category}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-slate-300 backdrop-blur-md">
                        {c.year}
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 leading-snug">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 line-clamp-1">
                      {c.source}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Details list badge count */}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{c.details?.length || 0} điểm thuyết minh chi tiết</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenEdit(c)}
                        className="flex items-center gap-1 text-xs py-1.5 px-3"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </Button>

                      {c.image !== c.defaultImage && !isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetArtifactImage(c)}
                          title="Khôi phục ảnh gốc ban đầu"
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isCustom ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteArtifact(c.id, c.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Xoá hiện vật này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Hiện vật gốc
                      </span>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-TAB 2: PHÔNG NỀN KHÔNG GIAN TRƯNG BÀY
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === 'phong-nen' && (
        <div className="space-y-6">
          {/* Current Wallpaper Preview */}
          <GlassCard className="p-5 border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">
              Phông nền đang áp dụng trong không gian trưng bày 3D
            </h3>
            <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <img
                src={wallBackUrl}
                alt="Phông nền tường không gian trưng bày"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                    Đang hiển thị
                  </span>
                  <p className="text-xs text-white/90 mt-1 font-mono truncate max-w-md">
                    {wallBackUrl}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Preset Wallpapers */}
          <div>
            <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Chủ đề phông nền có sẵn
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {WALLPAPER_PRESETS.map((preset) => {
                const isSelected = wallBackUrl === preset.backUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => saveWallpaper(preset.backUrl, preset.sideUrl, `Đã áp dụng chủ đề "${preset.name}"`)}
                    className={cn(
                      "flex flex-col p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-md"
                        : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <div
                      className="w-full h-24 rounded-xl mb-2.5 shadow-inner flex items-center justify-center border border-black/10"
                      style={{ background: preset.previewBg }}
                    >
                      {isSelected && (
                        <div className="p-1 rounded-full bg-white/90 text-amber-700 shadow-md">
                          <Check className="w-5 h-5 font-black" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {preset.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Upload & Link */}
          <GlassCard className="p-5 border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80">
            <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Tùy chỉnh tải ảnh nền tường mới
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Bạn có thể tải ảnh khẩu hiệu, hoa văn, hoặc ảnh phòng triển lãm từ máy tính, hoặc dán link ảnh trực tiếp
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button
                type="button"
                onClick={() => wallFileInputRef.current?.click()}
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Upload className="w-4 h-4" />
                <span>Tải ảnh từ máy tính (PNG/JPG)</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => saveWallpaper('/wall-back.png', '/wall-side.png', 'Đã khôi phục phông nền mặc định MTTQ & Bác Hồ')}
                className="w-full sm:w-auto justify-center"
              >
                <span>Khôi phục nền gốc MTTQ</span>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={customBgInput}
                onChange={(e) => setCustomBgInput(e.target.value)}
                placeholder="Hoặc dán link ảnh nền tường (URL https://...)"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
              />
              <Button
                type="button"
                onClick={() => {
                  if (customBgInput.trim()) {
                    saveWallpaper(customBgInput.trim(), customBgInput.trim(), 'Đã áp dụng link ảnh nền mới');
                    setCustomBgInput('');
                  }
                }}
                disabled={!customBgInput.trim()}
                className="shrink-0"
              >
                Áp dụng
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: THÊM / CHỈNH SỬA HIỆN VẬT TRƯNG BÀY
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-6 flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {editingId ? 'Chỉnh sửa hiện vật trưng bày' : 'Thêm hiện vật trưng bày mới'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thông tin sẽ xuất hiện trực tiếp trong không gian trưng bày 3D
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Tên hiện vật *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Bản Tuyên ngôn Độc lập 1945, Chiếc đồng hồ quả quýt Bác tặng..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Thể loại hiện vật
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                    >
                      <option value="Kỷ vật thiêng liêng">Kỷ vật thiêng liêng</option>
                      <option value="Bảo vật Quốc gia">Bảo vật Quốc gia</option>
                      <option value="Tư liệu & Thư từ">Tư liệu & Thư từ</option>
                      <option value="Trang phục & Đồ dùng">Trang phục & Đồ dùng</option>
                      <option value="Sách báo & Bản thảo">Sách báo & Bản thảo</option>
                      <option value="Kỷ vật MTTQ Phường Chánh Hưng">Kỷ vật MTTQ Phường Chánh Hưng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Niên đại / Thời kỳ
                    </label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="VD: 1945, 1969, Thế kỷ XX..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Nguồn gốc / Đơn vị lưu giữ
                  </label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="VD: Ủy ban MTTQ Việt Nam Phường Chánh Hưng, Bảo tàng Lịch sử..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>

                {/* Artifact Image Upload */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Hình ảnh hiện vật
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-black border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 relative group">
                      <img src={formImage || '/cab1.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => artifactFileInputRef.current?.click()}
                        className="py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-500/30 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính / điện thoại</span>
                      </button>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="Hoặc dán URL ảnh (https://...)"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Mô tả khái quát ý nghĩa lịch sử
                  </label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Mô tả bối cảnh ra đời, nguồn gốc và ý nghĩa biểu trưng của hiện vật..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Đặc điểm chi tiết (mỗi gạch đầu dòng một hàng)
                  </label>
                  <textarea
                    rows={2}
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    placeholder="Chất liệu chế tác: đồng đỏ, giấy dó, vải dệt...&#10;Kích thước: 15cm x 20cm...&#10;Bảo tồn và phát huy trong khối Đại đoàn kết..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2.5 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    {editingId ? 'Cập nhật hiện vật' : 'Lưu & Trưng bày vào 3D'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
