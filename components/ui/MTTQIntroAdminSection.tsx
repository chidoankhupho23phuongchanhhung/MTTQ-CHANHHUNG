"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Save, RotateCcw, Plus, Trash2, Camera, Upload,
  Check, Info, Star, Clock, Shield, Sparkles, ExternalLink,
  ChevronDown, ChevronUp, Image as ImageIcon, Eye, FolderOpen,
  RefreshCw, CheckCircle2, AlertCircle, Link2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import {
  IntroSettings,
  LeaderItem,
  DEFAULT_INTRO_SETTINGS,
  DEFAULT_LEADERS,
  getCachedIntroSettings,
  normalizePhotoUrl
} from '@/lib/introSettings';

export default function MTTQIntroAdminSection({ className }: { className?: string }) {
  const { addNotification } = useAppStore();

  const [settings, setSettings] = useState<IntroSettings>(DEFAULT_INTRO_SETTINGS);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'leaders' | 'general' | 'history'>('leaders');
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string; url: string; viewUrl?: string }>>([]);
  const [loadingDriveFiles, setLoadingDriveFiles] = useState(false);
  const [selectedLeaderForDrive, setSelectedLeaderForDrive] = useState<string | null>(null);

  // Hidden file input for uploading portrait photos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadLeaderIdRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core save function to persist to server API & localStorage
  const saveSettingsToServer = useCallback(async (settingsToSave: IntroSettings, showToast = false) => {
    setIsSaving(true);
    try {
      // 1. Cache to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mttq_intro_settings', JSON.stringify(settingsToSave));
          window.dispatchEvent(new Event('intro-settings-updated'));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.warn('Lỗi ghi localStorage:', e);
        }
      }

      // 2. Post to server settings.json
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'intro',
          data: settingsToSave
        })
      });

      if (res.ok) {
        const timeStr = new Date().toLocaleTimeString('vi-VN');
        setLastSavedTime(timeStr);
        if (showToast) {
          addNotification(
            'Lưu thành công',
            'Đã cập nhật toàn bộ nội dung & hình ảnh lên hệ thống và Google Drive!',
            'success'
          );
        }
      } else {
        throw new Error('Server returned non-ok status');
      }
    } catch (err) {
      console.error('Lỗi khi lưu cài đặt intro:', err);
      if (showToast) {
        addNotification(
          'Đã lưu cục bộ',
          'Nội dung đã được lưu vào bộ nhớ máy bạn (lỗi đồng bộ server)',
          'warning'
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [addNotification]);

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
              historyContent: data.intro.historyContent || prev.historyContent,
            }));
          }
        }
      } catch (err) {
        console.warn('Không thể nạp cài đặt giới thiệu từ server:', err);
      }
    };

    fetchServerSettings();
  }, []);

  // Debounced auto-save helper for text inputs
  const triggerDebouncedAutoSave = useCallback((newSettings: IntroSettings) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveSettingsToServer(newSettings, false);
    }, 700);
  }, [saveSettingsToServer]);

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
      // 1. Upload to server (which saves locally to /uploads and syncs to Google Drive)
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          const finalUrl = data.url;
          const updatedLeaders = settings.leaders.map(l =>
            l.id === leaderId
              ? {
                  ...l,
                  photoUrl: finalUrl,
                  driveUrl: data.driveUrl || l.driveUrl,
                  driveFileId: data.driveFileId || l.driveFileId
                }
              : l
          );
          const newSettings = { ...settings, leaders: updatedLeaders };
          setSettings(newSettings);
          await saveSettingsToServer(newSettings, false);

          addNotification(
            'Tải & Lưu thành công!',
            data.gasSuccess
              ? 'Ảnh đã được lưu trên máy chủ và đồng bộ an toàn lên Google Drive MTTQ!'
              : 'Ảnh đã được lưu và cập nhật trên website!',
            'success'
          );
          setUploadingForId(null);
          return;
        }
      }

      // 2. Client fallback compression if upload endpoint fails
      const reader = new FileReader();
      reader.onload = async (e) => {
        const rawData = e.target?.result as string;
        const img = new Image();
        img.onload = async () => {
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
            const updatedLeaders = settings.leaders.map(l =>
              l.id === leaderId ? { ...l, photoUrl: compressedUrl } : l
            );
            const newSettings = { ...settings, leaders: updatedLeaders };
            setSettings(newSettings);
            await saveSettingsToServer(newSettings, false);
            addNotification('Tải ảnh thành công', 'Đã nén và lưu ảnh chân dung vào hệ thống', 'success');
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

  // Helper to update a leader field and auto-save
  const updateLeaderField = (id: string, field: keyof LeaderItem, value: any) => {
    setSettings(prev => {
      const updatedLeaders = prev.leaders.map(l => (l.id === id ? { ...l, [field]: value } : l));
      const nextSettings = { ...prev, leaders: updatedLeaders };
      triggerDebouncedAutoSave(nextSettings);
      return nextSettings;
    });
  };

  // Add new leader
  const handleAddLeader = async () => {
    const newId = `leader_${Date.now()}`;
    const newLeader: LeaderItem = {
      id: newId,
      salutation: 'Đồng chí',
      name: 'Họ và tên nhân sự mới',
      title: 'Chức vụ công tác tại Ủy ban MTTQ Việt Nam Phường Chánh Hưng',
      photoUrl: '/mttq-logo.png',
      level: 'ward',
    };
    const newSettings = {
      ...settings,
      leaders: [...settings.leaders, newLeader]
    };
    setSettings(newSettings);
    setEditingLeaderId(newId);
    await saveSettingsToServer(newSettings, false);
    addNotification('Đã thêm nhân sự', 'Đã thêm một đồng chí mới vào danh sách và tự động lưu.', 'info');
  };

  // Delete a leader
  const handleDeleteLeader = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa đồng chí "${name}" khỏi danh sách?`)) {
      const newSettings = {
        ...settings,
        leaders: settings.leaders.filter(l => l.id !== id)
      };
      setSettings(newSettings);
      if (editingLeaderId === id) setEditingLeaderId(null);
      await saveSettingsToServer(newSettings, false);
      addNotification('Đã xóa', `Đã xóa nhân sự "${name}" và cập nhật hệ thống`, 'info');
    }
  };

  // Manual save trigger
  const handleSaveAll = async () => {
    await saveSettingsToServer(settings, true);
  };

  // Fetch drive files list
  const handleOpenDriveBrowser = async (leaderId: string) => {
    setSelectedLeaderForDrive(leaderId);
    setDriveModalOpen(true);
    setLoadingDriveFiles(true);
    try {
      const res = await fetch('/api/drive-files');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.files) {
          setDriveFiles(data.files);
        } else {
          setDriveFiles([]);
        }
      }
    } catch (e) {
      console.warn('Lỗi lấy danh sách Drive:', e);
    } finally {
      setLoadingDriveFiles(false);
    }
  };

  const handleSelectDriveFile = async (fileId: string, fileName: string) => {
    if (!selectedLeaderForDrive) return;
    const photoUrl = `/api/drive-image?id=${fileId}`;
    const updatedLeaders = settings.leaders.map(l =>
      l.id === selectedLeaderForDrive
        ? {
            ...l,
            photoUrl: photoUrl,
            driveUrl: `https://drive.google.com/file/d/${fileId}/view`,
            driveFileId: fileId,
          }
        : l
    );
    const newSettings = { ...settings, leaders: updatedLeaders };
    setSettings(newSettings);
    await saveSettingsToServer(newSettings, false);
    setDriveModalOpen(false);
    addNotification('Đã chọn ảnh Drive', `Đã áp dụng ảnh "${fileName}" từ Google Drive`, 'success');
  };

  // Reset to initial default settings
  const handleResetToDefault = async () => {
    if (confirm('Khôi phục toàn bộ nội dung Giới thiệu về trạng thái mặc định ban đầu?')) {
      setSettings(DEFAULT_INTRO_SETTINGS);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mttq_intro_settings');
        window.dispatchEvent(new Event('intro-settings-updated'));
      }
      await saveSettingsToServer(DEFAULT_INTRO_SETTINGS, true);
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Quản lý Nội dung & Hình ảnh Giới thiệu MTTQ
              </h3>
              {/* Auto-save status indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{lastSavedTime ? `Đã lưu tự động lúc ${lastSavedTime}` : 'Tự động lưu kích hoạt'}</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mọi thay đổi thông tin hoặc tải ảnh mới đều được tự động lưu ngay lập tức và đồng bộ lên Google Drive
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

      {/* Cloud Drive Sync Status Banner */}
      <div className="mt-4 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white flex-shrink-0">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-blue-950 dark:text-blue-200 block">
              Thư mục Google Drive MTTQ Phường Chánh Hưng đã kết nối
            </span>
            <span className="text-[11px] text-blue-700 dark:text-blue-300">
              Mã thư mục: <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-mono">1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J</code> &bull; Ảnh tải lên được lưu 2 nơi: Máy chủ website & Google Drive.
            </span>
          </div>
        </div>

        <a
          href="https://drive.google.com/drive/folders/1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 hover:bg-blue-50 transition-colors flex-shrink-0"
        >
          <span>Mở thư mục trên Google Drive</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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
              Bấm <strong>"Đổi ảnh chân dung"</strong> để tải ảnh từ thiết bị (tự lưu lên Drive) hoặc bấm <strong>"Sửa chữ"</strong> để chỉnh sửa tên, chức danh.
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
              const displayUrl = normalizePhotoUrl(leader.photoUrl);

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
                        {displayUrl.endsWith('.svg') || displayUrl.includes('mttq-logo') ? (
                          <img src={displayUrl} alt={leader.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <img
                            src={displayUrl}
                            alt={leader.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/mttq-logo.png';
                            }}
                            className="w-full h-full object-cover object-top"
                          />
                        )}

                        {/* Quick Camera Hover Button */}
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(leader.id)}
                          title="Tải ảnh mới từ thiết bị"
                          className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-bold cursor-pointer"
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
                        {leader.driveUrl && (
                          <a
                            href={leader.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
                          >
                            <FolderOpen className="w-2.5 h-2.5" />
                            <span>Đã sao lưu trên Google Drive</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
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
                        <span>{isUploading ? 'Đang tải lên...' : 'Đổi ảnh'}</span>
                      </button>

                      {/* Browse from Google Drive */}
                      <button
                        type="button"
                        onClick={() => handleOpenDriveBrowser(leader.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Chọn ảnh từ kho ảnh Google Drive"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Kho Drive</span>
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

                      {/* Đường dẫn ảnh trực tiếp hoặc Google Drive */}
                      <div className="sm:col-span-12 flex flex-col sm:flex-row items-start sm:items-end gap-2">
                        <div className="flex-1 w-full">
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Đường link ảnh chân dung trực tiếp (URL hoặc link Google Drive):
                          </label>
                          <input
                            type="text"
                            value={leader.photoUrl}
                            onChange={(e) => updateLeaderField(leader.id, 'photoUrl', e.target.value)}
                            placeholder="Dán link Google Drive hoặc URL ảnh..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateLeaderField(leader.id, 'photoUrl', '/mttq-logo.png')}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Logo MTTQ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriggerUpload(leader.id)}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Tải ảnh mới</span>
                          </button>
                        </div>
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
              onChange={(e) => {
                const val = e.target.value;
                setSettings(prev => {
                  const next = { ...prev, slogan: val };
                  triggerDebouncedAutoSave(next);
                  return next;
                });
              }}
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
              onChange={(e) => {
                const val = e.target.value;
                setSettings(prev => {
                  const next = { ...prev, introText: val };
                  triggerDebouncedAutoSave(next);
                  return next;
                });
              }}
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
              onChange={(e) => {
                const val = e.target.value;
                setSettings(prev => {
                  const next = { ...prev, introSubtext: val };
                  triggerDebouncedAutoSave(next);
                  return next;
                });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: NỘI DUNG LỊCH SỬ HÌNH THÀNH (1 VĂN BẢN XUYÊN SUỐT)
      ──────────────────────────────────────────────────────── */}
      {activeAdminSubTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <label className="block font-bold text-slate-800 dark:text-white flex items-center justify-between">
              <span>Nội dung Lịch sử hình thành và phát triển (1 văn bản xuyên suốt):</span>
              <span className="text-[11px] font-normal text-slate-400">Cách các đoạn bằng 2 lần xuống dòng (Enter)</span>
            </label>
            <textarea
              rows={12}
              value={settings.historyContent || ''}
              onChange={(e) => {
                const val = e.target.value;
                setSettings(prev => {
                  const next = { ...prev, historyContent: val };
                  triggerDebouncedAutoSave(next);
                  return next;
                });
              }}
              placeholder="Nhập nội dung lịch sử hình thành..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nội dung trên sẽ được hiển thị thành một văn bản dài liền mạch, trang nhã trong mục Lịch sử hình thành.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Save Reminder */}
      <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Hệ thống đã kích hoạt <strong>Tự động lưu</strong>. Mọi thay đổi hiển thị ngay trên website (/hoat-dong-mttq).</span>
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

      {/* MODAL: CHỌN ẢNH TỪ GOOGLE DRIVE */}
      {driveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Kho ảnh Google Drive MTTQ Phường Chánh Hưng
                  </h4>
                  <p className="text-xs text-slate-500">
                    Chọn một ảnh để gán trực tiếp cho đồng chí đang chỉnh sửa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDriveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {loadingDriveFiles ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Đang tải danh sách ảnh từ Google Drive...</span>
                </div>
              ) : driveFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleSelectDriveFile(file.id, file.name)}
                      className="group border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center gap-2"
                    >
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                        <img
                          src={`/api/drive-image?id=${file.id}`}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/mttq-logo.png';
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 line-clamp-1 text-center w-full">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Bạn có thể tải ảnh trực tiếp bằng nút <strong>"Đổi ảnh"</strong> (ảnh sẽ tự động lưu cả lên máy chủ website và thư mục Google Drive).
                  </p>
                  <a
                    href="https://drive.google.com/drive/folders/1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <span>Mở thư mục Google Drive để kiểm tra</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
              <button
                type="button"
                onClick={() => setDriveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
