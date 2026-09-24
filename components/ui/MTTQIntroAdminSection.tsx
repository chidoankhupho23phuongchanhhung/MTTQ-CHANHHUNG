"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Save, RotateCcw, Plus, Trash2, Camera, Upload,
  Check, Info, Star, Clock, Shield, Sparkles, ExternalLink,
  ChevronDown, ChevronUp, Image as ImageIcon, Eye
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import {
  IntroSettings,
  LeaderItem,
  HistorySectionItem,
  DEFAULT_INTRO_SETTINGS,
  DEFAULT_LEADERS,
  getCachedIntroSettings
} from '@/lib/introSettings';

export default function MTTQIntroAdminSection({ className }: { className?: string }) {
  const { addNotification } = useAppStore();

  const [settings, setSettings] = useState<IntroSettings>(DEFAULT_INTRO_SETTINGS);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'leaders' | 'general' | 'history'>('leaders');
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hidden file input for uploading portrait photos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadLeaderIdRef = useRef<string | null>(null);

  // Load settings on mount from API + cache
  useEffect(() => {
    // 1. Instant local read
    const cached = getCachedIntroSettings();
    setSettings(cached);

    // 2. Server API fetch
    const fetchServerSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.intro && Object.keys(data.intro).length > 0) {
            setSettings(prev => ({
              ...prev,
              ...data.intro,
              leaders: data.intro.leaders && data.intro.leaders.length > 0 ? data.intro.leaders : prev.leaders,
              historySections: data.intro.historySections && data.intro.historySections.length > 0 ? data.intro.historySections : prev.historySections,
            }));
          }
        }
      } catch (err) {
        console.warn('Không thể nạp cài đặt giới thiệu từ server:', err);
      }
    };

    fetchServerSettings();
  }, []);

  // Handle uploading portrait photo
  const handleTriggerUpload = (leaderId: string) => {
    targetUploadLeaderIdRef.current = leaderId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = async (file: File) => {
    const leaderId = targetUploadLeaderIdRef.current;
    if (!file || !leaderId) return;

    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.name);
    if (!isImage && file.type) {
      alert('Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP...)');
      return;
    }

    setUploadingForId(leaderId);

    try {
      // 1. Try server API upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            updateLeaderField(leaderId, 'photoUrl', data.url);
            addNotification('Tải ảnh thành công', 'Đã cập nhật ảnh chân dung mới', 'success');
            setUploadingForId(null);
            return;
          }
        }
      } catch (e) {
        console.warn('API upload error, using canvas fallback', e);
      }

      // 2. Fallback to client canvas compression
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawData = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 600;
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
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            updateLeaderField(leaderId, 'photoUrl', compressedUrl);
            addNotification('Tải ảnh thành công', 'Đã nén và lưu ảnh chân dung', 'success');
          }
          setUploadingForId(null);
        };
        img.onerror = () => setUploadingForId(null);
        img.src = rawData;
      };
      reader.onerror = () => setUploadingForId(null);
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
      setUploadingForId(null);
    }
  };

  // Helper to update a leader
  const updateLeaderField = (id: string, field: keyof LeaderItem, value: any) => {
    setSettings(prev => ({
      ...prev,
      leaders: prev.leaders.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  // Add new leader
  const handleAddLeader = () => {
    const newId = `leader_${Date.now()}`;
    const newLeader: LeaderItem = {
      id: newId,
      salutation: 'Đồng chí',
      name: 'Họ và tên mới',
      title: 'Chức vụ công tác tại Ủy ban MTTQ Việt Nam Phường Chánh Hưng',
      photoUrl: '/mttq-logo.png',
      level: 'ward',
    };
    setSettings(prev => ({
      ...prev,
      leaders: [...prev.leaders, newLeader]
    }));
    setEditingLeaderId(newId);
    addNotification('Đã thêm', 'Đã thêm một nhân sự mới vào danh sách. Vui lòng chỉnh sửa thông tin.', 'info');
  };

  // Delete a leader
  const handleDeleteLeader = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa đồng chí "${name}" khỏi danh sách?`)) {
      setSettings(prev => ({
        ...prev,
        leaders: prev.leaders.filter(l => l.id !== id)
      }));
      if (editingLeaderId === id) setEditingLeaderId(null);
      addNotification('Đã xóa', `Đã xóa nhân sự "${name}"`, 'info');
    }
  };

  // Update history section
  const updateHistoryField = (id: string, field: keyof HistorySectionItem, value: string) => {
    setSettings(prev => ({
      ...prev,
      historySections: prev.historySections.map(h => h.id === id ? { ...h, [field]: value } : h)
    }));
  };

  // Save all settings to API and localStorage
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // 1. Save to local storage for instant cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mttq_intro_settings', JSON.stringify(settings));
        } catch (e) {
          console.warn('Lỗi ghi localStorage', e);
        }
      }

      // 2. Save to server API
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'intro',
          data: settings
        })
      });

      if (res.ok) {
        // Dispatch real-time events for other tabs/components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('intro-settings-updated'));
          window.dispatchEvent(new Event('storage'));
        }

        addNotification(
          'Lưu thành công',
          'Đã cập nhật toàn bộ nội dung & hình ảnh phần Giới thiệu MTTQ lên hệ thống!',
          'success'
        );
      } else {
        throw new Error('Server returned non-ok status');
      }
    } catch (err: any) {
      console.error('Lỗi khi lưu cài đặt intro:', err);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('intro-settings-updated'));
      }
      addNotification(
        'Đã lưu cục bộ',
        'Nội dung đã được lưu vào bộ nhớ máy bạn (lỗi đồng bộ server)',
        'warning'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to initial default settings
  const handleResetToDefault = () => {
    if (confirm('Khôi phục toàn bộ nội dung Giới thiệu về trạng thái mặc định ban đầu?')) {
      setSettings(DEFAULT_INTRO_SETTINGS);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mttq_intro_settings');
        window.dispatchEvent(new Event('intro-settings-updated'));
      }
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'intro',
          data: DEFAULT_INTRO_SETTINGS
        })
      }).catch(e => console.warn('Reset server error:', e));

      addNotification('Đã đặt lại', 'Đã khôi phục toàn bộ nội dung mặc định.', 'info');
    }
  };

  return (
    <div className={cn("rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-xs", className)}>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processUploadedFile(file);
        }}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Quản lý Nội dung & Hình ảnh Giới thiệu MTTQ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tùy chỉnh danh sách Ban Thường trực, ảnh chân dung, khẩu hiệu và các phần lịch sử hiển thị
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Mặc định</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Leaders | General & Slogan | History */}
      <div className="flex items-center gap-2 mt-5 mb-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveAdminSubTab('leaders')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap",
            activeAdminSubTab === 'leaders'
              ? "bg-red-600 text-white border-red-600 shadow-xs"
              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Danh sách Ban Thường trực ({settings.leaders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('general')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap",
            activeAdminSubTab === 'general'
              ? "bg-red-600 text-white border-red-600 shadow-xs"
              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          )}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Khẩu hiệu & Văn bản giới thiệu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('history')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap",
            activeAdminSubTab === 'history'
              ? "bg-red-600 text-white border-red-600 shadow-xs"
              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Mục Lịch sử hình thành (1 box dài)</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: DANH SÁCH BAN THƯỜNG TRỰC & HÌNH ẢNH CHÂN DUNG
      ──────────────────────────────────────────────────────── */}
      {activeAdminSubTab === 'leaders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Bấm vào từng đồng chí để chỉnh sửa thông tin hoặc bấm <strong>"Đổi ảnh chân dung"</strong> để tải ảnh từ máy tính/điện thoại.
            </span>
            <button
              type="button"
              onClick={handleAddLeader}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đồng chí mới</span>
            </button>
          </div>

          {/* Leaders List */}
          <div className="grid grid-cols-1 gap-3.5">
            {settings.leaders.map((leader) => {
              const isEditing = editingLeaderId === leader.id;
              const isUploading = uploadingForId === leader.id;

              return (
                <div
                  key={leader.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Photo + Name + Position summary */}
                    <div className="flex items-center gap-3.5">
                      {/* Portrait Photo Container */}
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-2xs group">
                        {leader.photoUrl.endsWith('.svg') || leader.photoUrl.includes('mttq-logo') ? (
                          <img src={leader.photoUrl} alt={leader.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover object-top" />
                        )}

                        {/* Quick Camera Hover Button */}
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(leader.id)}
                          title="Tải ảnh mới từ thiết bị"
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-bold cursor-pointer"
                        >
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Đổi ảnh</span>
                        </button>
                      </div>

                      {/* Info preview */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {leader.salutation}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {leader.name}
                          </h4>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            leader.level === 'city'
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300"
                          )}>
                            {leader.level === 'city' ? 'TP. Hồ Chí Minh' : 'Phường Chánh Hưng'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                          {leader.title}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Upload photo button */}
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(leader.id)}
                        disabled={isUploading}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-3.5 h-3.5" />
                        )}
                        <span>{isUploading ? 'Đang tải...' : 'Đổi ảnh'}</span>
                      </button>

                      {/* Expand / Collapse Details Edit */}
                      <button
                        type="button"
                        onClick={() => setEditingLeaderId(isEditing ? null : leader.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isEditing ? 'Đóng' : 'Sửa chữ'}</span>
                        {isEditing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLeader(leader.id, leader.name)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Xóa nhân sự này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Form to Edit Name, Salutation, Position, Direct URL */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs"
                    >
                      {/* Xưng hô */}
                      <div className="sm:col-span-3">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Xưng hô:
                        </label>
                        <select
                          value={leader.salutation}
                          onChange={(e) => updateLeaderField(leader.id, 'salutation', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-white"
                        >
                          <option value="Ông">Ông</option>
                          <option value="Bà">Bà</option>
                          <option value="Đồng chí">Đồng chí</option>
                        </select>
                      </div>

                      {/* Họ và tên */}
                      <div className="sm:col-span-5">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Họ và Tên:
                        </label>
                        <input
                          type="text"
                          value={leader.name}
                          onChange={(e) => updateLeaderField(leader.id, 'name', e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-white"
                        />
                      </div>

                      {/* Cấp */}
                      <div className="sm:col-span-4">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phân cấp:
                        </label>
                        <select
                          value={leader.level}
                          onChange={(e) => updateLeaderField(leader.id, 'level', e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-white"
                        >
                          <option value="ward">Ủy ban MTTQ Phường Chánh Hưng</option>
                          <option value="city">Ủy ban MTTQ TP. Hồ Chí Minh</option>
                        </select>
                      </div>

                      {/* Chức vụ đầy đủ */}
                      <div className="sm:col-span-12">
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Chức vụ, chức danh đầy đủ:
                        </label>
                        <textarea
                          rows={2}
                          value={leader.title}
                          onChange={(e) => updateLeaderField(leader.id, 'title', e.target.value)}
                          placeholder="Ví dụ: Ủy viên Ban Thường vụ Đảng ủy, Chủ tịch Ủy ban MTTQ Việt Nam Phường..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white leading-relaxed"
                        />
                      </div>

                      {/* Đường dẫn ảnh trực tiếp */}
                      <div className="sm:col-span-12 flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Hoặc dán đường link ảnh chân dung trực tiếp (URL):
                          </label>
                          <input
                            type="text"
                            value={leader.photoUrl}
                            onChange={(e) => updateLeaderField(leader.id, 'photoUrl', e.target.value)}
                            placeholder="https://... hoặc /leaders/..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateLeaderField(leader.id, 'photoUrl', '/mttq-logo.png')}
                          className="self-end px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors"
                        >
                          Dùng logo MTTQ
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: KHẨU HIỆU & VĂN BẢN GIỚI THIỆU CHÍNH THỨC
      ──────────────────────────────────────────────────────── */}
      {activeAdminSubTab === 'general' && (
        <div className="space-y-5 text-xs sm:text-sm">
          {/* Slogan */}
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 space-y-2">
            <label className="block font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
              <Star className="w-4 h-4 text-red-600" />
              Khẩu hiệu hành động chính thức:
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings(prev => ({ ...prev, slogan: e.target.value }))}
              placeholder="ĐOÀN KẾT - DÂN CHỦ - ĐỔI MỚI - SÁNG TẠO - PHÁT TRIỂN"
              className="w-full px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 font-black text-red-600 dark:text-red-400 uppercase tracking-wide shadow-2xs"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Khẩu hiệu này hiển thị nổi bật trên banner Trang chủ và phần đầu trang Lịch sử hình thành.
            </p>
          </div>

          {/* Official Intro Text */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <label className="block font-bold text-slate-800 dark:text-white">
              Văn bản Chức năng & Nhiệm vụ Cơ quan Ủy ban MTTQ Việt Nam phường:
            </label>
            <textarea
              rows={4}
              value={settings.introText}
              onChange={(e) => setSettings(prev => ({ ...prev, introText: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm"
            />
          </div>

          {/* Subtext about 05 departments and 04 organizations */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <label className="block font-bold text-slate-800 dark:text-white">
              Tóm tắt về Tổ chức bộ máy (05 bộ phận chuyên môn & 04 tổ chức chính trị - xã hội):
            </label>
            <textarea
              rows={2}
              value={settings.introSubtext}
              onChange={(e) => setSettings(prev => ({ ...prev, introSubtext: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: NỘI DUNG 3 PHẦN LỊCH SỬ HÌNH THÀNH
      ──────────────────────────────────────────────────────── */}
      {activeAdminSubTab === 'history' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chỉnh sửa 3 mốc thời gian và giai đoạn truyền thống hiển thị ở mục <strong>"Lịch sử hình thành"</strong>:
          </p>

          <div className="grid grid-cols-1 gap-4">
            {settings.historySections.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateHistoryField(item.id, 'title', e.target.value)}
                      placeholder="Tiêu đề giai đoạn lịch sử..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <input
                    type="text"
                    value={item.badge}
                    onChange={(e) => updateHistoryField(item.id, 'badge', e.target.value)}
                    placeholder="Mốc thời gian"
                    className="w-28 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-semibold text-slate-600 dark:text-slate-300"
                  />
                </div>

                <textarea
                  rows={4}
                  value={item.content}
                  onChange={(e) => updateHistoryField(item.id, 'content', e.target.value)}
                  placeholder="Nội dung chi tiết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Save Reminder */}
      <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Mọi thay đổi sẽ hiển thị ngay lập tức trên trang Giới thiệu (/hoat-dong-mttq) sau khi bấm Lưu.</span>
        </span>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Đang lưu cài đặt...' : 'Lưu tất cả thay đổi'}
        </button>
      </div>

    </div>
  );
}
