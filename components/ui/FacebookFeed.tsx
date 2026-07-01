"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, AlertCircle, ImageOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

/* Inline Facebook icon (lucide-react v1 doesn't include it) */
const FbIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface FbPost {
  id: string;
  message?: string;
  story?: string;
  full_picture?: string;
  created_time: string;
  permalink_url?: string;
}

interface FbApiResponse {
  data: FbPost[];
  error?: { message: string };
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

/* Mock posts shown when no token is configured */
const MOCK_POSTS: FbPost[] = [
  {
    id: 'mock-1',
    message: '🎉 Ủy ban MTTQ Việt Nam Phường Chánh Hưng tổ chức thành công Hội nghị hiệp thương lần thứ nhất bầu cử đại biểu HĐND phường nhiệm kỳ 2026-2031. Xin trân trọng cảm ơn sự tham gia đóng góp của bà con nhân dân!',
    full_picture: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=70',
    created_time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    permalink_url: '#'
  },
  {
    id: 'mock-2',
    message: '🌸 Phong trào "Thành phố Muôn Sắc Hoa" — MTTQ Phường Chánh Hưng kêu gọi bà con trồng hoa, cây xanh trước nhà, góp phần làm đẹp cảnh quan khu phố. Đăng ký tham gia tại văn phòng UBND Phường.',
    full_picture: 'https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=600&auto=format&fit=crop&q=70',
    created_time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    permalink_url: '#'
  },
  {
    id: 'mock-3',
    message: '🛡️ Thông báo: Phường Chánh Hưng ra quân tổng kiểm tra an ninh trật tự khu phố 2, 3, 5 vào ngày 05/07/2026. Bà con nhân dân tích cực phối hợp với lực lượng Công an và MTTQ phường.',
    full_picture: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&auto=format&fit=crop&q=70',
    created_time: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    permalink_url: '#'
  },
  {
    id: 'mock-4',
    message: '💚 Chương trình "An sinh xã hội" tháng 7/2026: MTTQ Phường Chánh Hưng phối hợp trao 45 phần quà (500.000đ/phần) cho hộ khó khăn, gia đình chính sách. Đăng ký nhận hỗ trợ tại Ban Công tác Mặt trận Khu phố.',
    full_picture: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=70',
    created_time: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    permalink_url: '#'
  }
];

export default function FacebookFeed() {
  const { fbPageId, fbAccessToken } = useAppStore();
  const [posts, setPosts] = useState<FbPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isConfigured = !!(fbPageId && fbAccessToken);

  const fetchPosts = useCallback(async () => {
    if (!isConfigured) {
      setPosts(MOCK_POSTS);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fields = 'message,story,full_picture,created_time,permalink_url';
      const url = `https://graph.facebook.com/v20.0/${fbPageId}/posts?fields=${fields}&limit=6&access_token=${fbAccessToken}`;
      const res = await fetch(url);
      const json: FbApiResponse = await res.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      setPosts(json.data || []);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải bài viết Facebook';
      setError(msg);
      setPosts(MOCK_POSTS); // fallback to mock
    } finally {
      setLoading(false);
    }
  }, [isConfigured, fbPageId, fbAccessToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex flex-col gap-4">

      {/* Config notice banner */}
      {!isConfigured && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-700/30">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex-1">
            Đang hiển thị tin mẫu. Cán bộ vui lòng cấu hình <strong>Page ID & Access Token</strong> trong{' '}
            <a href="/quan-ly-facebook" className="underline font-black">Quản lý Facebook</a> để tải bài viết thật từ Fanpage.
          </p>
        </div>
      )}

      {/* Error banner */}
      {error && isConfigured && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-300/40">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold flex-1">
            Lỗi API: {error}. Đang hiển thị bài mẫu.
          </p>
          <button onClick={fetchPosts} className="text-[10px] text-rose-600 font-black underline cursor-pointer">
            Thử lại
          </button>
        </div>
      )}

      {/* Refresh row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FbIcon className="h-4 w-4 text-blue-600" />
          <span className="text-[10px] text-slate-400 font-medium">
            {lastUpdated ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN')}` : isConfigured ? 'Đang tải...' : 'Bài viết mẫu'}
          </span>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 animate-pulse">
                  <div className="h-40 bg-slate-200/60 dark:bg-slate-800/60" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 bg-slate-200/80 dark:bg-slate-700/80 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded-full w-full" />
                    <div className="h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded-full w-5/6" />
                  </div>
                </div>
              ))
            : posts.map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.permalink_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/40 shadow-md cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    {post.full_picture ? (
                      <img
                        src={post.full_picture}
                        alt="Post"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                    {/* Facebook badge */}
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <FbIcon className="h-2.5 w-2.5" /> Fanpage
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="text-[9px] text-slate-400 font-medium">{timeAgo(post.created_time)}</span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed line-clamp-4">
                      {post.message || post.story || 'Xem bài viết trên Fanpage...'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-auto pt-1">
                      Xem trên Facebook <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </motion.a>
              ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
