"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageContainer from '../layout/PageContainer';
import GlassCard from '../ui/GlassCard';
import {
  Save, Eye, EyeOff, CheckCircle2,
  AlertCircle, ExternalLink, Info, RefreshCw, Trash2, Key, Hash
} from 'lucide-react';

const FbIcon = ({ className = 'h-7 w-7' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function FacebookSettingsPage() {
  const { fbPageId, fbAccessToken, setFacebookConfig } = useAppStore();

  const [pageId, setPageId] = useState(fbPageId);
  const [token, setToken] = useState(fbAccessToken);
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSave = () => {
    setFacebookConfig(pageId.trim(), token.trim());
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    setPageId('');
    setToken('');
    setFacebookConfig('', '');
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!pageId.trim() || !token.trim()) {
      setTestResult({ ok: false, message: 'Vui lòng nhập Page ID và Access Token trước khi kiểm tra.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const url = `https://graph.facebook.com/v20.0/${pageId.trim()}?fields=name,fan_count,picture&access_token=${token.trim()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        setTestResult({ ok: false, message: `Lỗi API: ${data.error.message}` });
      } else {
        setTestResult({
          ok: true,
          message: `✅ Kết nối thành công! Fanpage: "${data.name}" — ${(data.fan_count || 0).toLocaleString('vi-VN')} người theo dõi.`
        });
      }
    } catch {
      setTestResult({ ok: false, message: 'Không thể kết nối. Kiểm tra lại mạng hoặc token.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <div className="p-3 bg-white/15 backdrop-blur-sm rounded-2xl flex-shrink-0">
            <FbIcon className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h1 className="text-base font-black uppercase tracking-wider">Quản lý Kết nối Facebook</h1>
            <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
              Cấu hình Page ID và Access Token để tải bài viết tự động từ Fanpage MTTQ lên Trang chủ dành cho nhân dân.
            </p>
          </div>
        </motion.div>

        {/* How-to Guide */}
        <GlassCard hoverable={false} className="p-5 text-left flex flex-col gap-4 bg-blue-50/30 dark:bg-blue-950/10 border-blue-200/30">
          <h3 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="h-4 w-4" /> Hướng dẫn lấy thông tin
          </h3>
          <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">1</span>
              <p><strong>Page ID:</strong> Truy cập Fanpage MTTQ Chánh Hưng trên Facebook → <em>Giới thiệu</em> (About) → cuộn xuống cuối → tìm số <strong>Page ID</strong>. Hoặc truy cập: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">facebook.com/&lt;tên-trang&gt;</code> và xem URL khi click About.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">2</span>
              <p><strong>Page Access Token:</strong> Truy cập{' '}
                <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold inline-flex items-center gap-0.5">
                  Graph API Explorer <ExternalLink className="h-3 w-3" />
                </a>{' '}
                → Chọn ứng dụng của bạn → Chọn User hoặc Page Token → Cấp quyền <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">pages_read_engagement</code> và <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">pages_read_user_content</code> → Tạo token.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">!</span>
              <p className="text-amber-700 dark:text-amber-300 font-semibold"><strong>Lưu ý bảo mật:</strong> Token được lưu trong trình duyệt (localStorage). Dùng token chỉ đọc (Read Only) và không chia sẻ. Token người dùng thường hết hạn sau 60 ngày — dùng token trang (Page Token) dài hạn hơn.</p>
            </div>
          </div>
        </GlassCard>

        {/* Config Form */}
        <GlassCard hoverable={false} className="p-6 text-left flex flex-col gap-5">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-800 pb-3">
            Cấu hình kết nối Fanpage
          </h3>

          {/* Page ID */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-blue-500" /> Facebook Page ID *
            </label>
            <input
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="Ví dụ: 100064823456789 hoặc mttqchanhhung"
              className="glass-input w-full px-4 py-3 text-xs rounded-xl font-mono"
            />
            <p className="text-[10px] text-slate-400 pl-1">Nhập Page ID (dãy số) hoặc username của Fanpage trên Facebook.</p>
          </div>

          {/* Access Token */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-amber-500" /> Page Access Token *
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Dán Access Token vào đây..."
                className="glass-input w-full pl-4 pr-12 py-3 text-xs rounded-xl font-mono"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 pl-1">Token được lưu cục bộ trong trình duyệt, không gửi về máy chủ.</p>
          </div>

          {/* Test result */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 p-3.5 rounded-2xl text-xs font-semibold border ${
                testResult.ok
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-300/40 text-rose-700 dark:text-rose-300'
              }`}
            >
              {testResult.ok
                ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              }
              <span>{testResult.message}</span>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.02 }}
              onClick={handleTest}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.02 }}
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? 'Đã lưu!' : 'Lưu cấu hình'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleClear}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </motion.button>
          </div>
        </GlassCard>

        {/* Current Status */}
        <GlassCard hoverable={false} className="p-5 text-left flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Trạng thái hiện tại</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Page ID:</span>
              <span className={`font-black font-mono ${fbPageId ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 italic'}`}>
                {fbPageId || '(chưa cấu hình)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Access Token:</span>
              <span className={`font-bold ${fbAccessToken ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 italic'}`}>
                {fbAccessToken ? `${fbAccessToken.slice(0, 12)}••••••••` : '(chưa cấu hình)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Tình trạng Feed:</span>
              <span className={`flex items-center gap-1.5 font-black ${fbPageId && fbAccessToken ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${fbPageId && fbAccessToken ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                {fbPageId && fbAccessToken ? 'Đang dùng dữ liệu thật từ Facebook' : 'Đang hiển thị bài mẫu (Chưa cấu hình)'}
              </span>
            </div>
          </div>
        </GlassCard>

      </div>
    </PageContainer>
  );
}
