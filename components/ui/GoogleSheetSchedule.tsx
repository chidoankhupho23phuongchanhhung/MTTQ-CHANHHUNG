"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, ExternalLink, Calendar, Clock, AlertCircle,
  CheckCircle2, Maximize2, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Sheet config ─── */
const SHEET_ID = '1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
/* gviz/tq endpoint works without API key for publicly shared sheets */
const GVZ_URL = `${SHEET_URL}/gviz/tq?tqx=out:json`;
/* pubhtml for iframe fallback view */
const PUBHTML_URL = `${SHEET_URL}/pubhtml?widget=true&headers=false`;
/* Auto-refresh every 5 minutes */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface SheetRow {
  cells: (string | null)[];
}

interface ParsedSheet {
  headers: string[];
  rows: SheetRow[];
  lastFetched: Date;
}

/* ─── Parse Google gviz JSON response ─── */
function parseGvizResponse(raw: string): ParsedSheet {
  // Strip the JS wrapper: /*O_o*/ google.visualization.Query.setResponse({...});
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('Invalid gviz response');

  const json = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  const table = json.table;

  const headers: string[] = (table.cols || []).map(
    (c: { label?: string; id?: string }) => c.label || c.id || ''
  ).filter((h: string) => h.trim() !== '');

  const rows: SheetRow[] = (table.rows || []).map((r: { c: ({ v?: unknown } | null)[] }) => ({
    cells: (r.c || []).slice(0, headers.length).map((cell) => {
      if (!cell || cell.v === null || cell.v === undefined) return null;
      return String(cell.v);
    })
  })).filter((row: SheetRow) => row.cells.some((c) => c !== null && c.trim?.() !== ''));

  return { headers, rows, lastFetched: new Date() };
}

/* ─── Cell colour based on content keywords ─── */
function getCellStyle(val: string | null): string {
  if (!val) return '';
  const v = val.toLowerCase();
  if (v.includes('hoàn tất') || v.includes('xong') || v.includes('done') || v.includes('✅'))
    return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold';
  if (v.includes('đang') || v.includes('họp') || v.includes('thực hiện'))
    return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold';
  if (v.includes('chờ') || v.includes('chuẩn bị') || v.includes('pending'))
    return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold';
  if (v.includes('quan trọng') || v.includes('khẩn') || v.includes('urgent') || v.includes('❗') || v.includes('🔴'))
    return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-bold';
  return '';
}

export default function GoogleSheetSchedule() {
  const [data, setData] = useState<ParsedSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'embed'>('table');
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSheet = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch(GVZ_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseGvizResponse(text);
      if (parsed.headers.length === 0) throw new Error('Sheet trống hoặc chưa được chia sẻ công khai.');
      setData(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu Sheet.';
      setError(msg);
      // Silently switch to iframe embed on error
      if (viewMode === 'table') setViewMode('embed');
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchSheet();
    timerRef.current = setInterval(() => fetchSheet(true), REFRESH_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastUpdatedText = data?.lastFetched
    ? data.lastFetched.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <>
      {/* ─── Main card ─── */}
      <div className="flex flex-col gap-3">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest leading-none">
                Lịch làm việc — Cập nhật thực
              </span>
              {lastUpdatedText && (
                <span className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  Cập nhật lúc {lastUpdatedText}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer',
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                Bảng
              </button>
              <button
                onClick={() => setViewMode('embed')}
                className={cn(
                  'text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer',
                  viewMode === 'embed'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                Sheet
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchSheet()}
              disabled={loading}
              className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 hover:text-blue-600 transition-all cursor-pointer disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            </button>

            {/* Expand */}
            <button
              onClick={() => setExpanded(true)}
              className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
              title="Phóng to"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            {/* Open in Sheets */}
            <a
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 hover:text-emerald-600 transition-all cursor-pointer"
              title="Mở Google Sheets"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm">

          {/* Loading skeleton */}
          {loading && !data && (
            <div className="flex flex-col gap-2 p-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex gap-3">
                  {[1,2,3,4].map(j => (
                    <div key={j} className="h-7 flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" style={{ animationDelay: `${(i+j)*0.05}s` }} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !data && (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Không thể tải dữ liệu</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs">{error}</p>
                <p className="text-[10px] text-blue-600 mt-2 font-semibold">
                  Đảm bảo Google Sheet được chia sẻ <strong>Anyone with the link → Viewer</strong>
                </p>
              </div>
              <button
                onClick={() => { setViewMode('embed'); setError(null); }}
                className="text-[10px] font-bold text-blue-600 underline cursor-pointer"
              >
                Xem dạng nhúng thay thế →
              </button>
            </div>
          )}

          {/* Table view */}
          {viewMode === 'table' && data && (
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto no-scrollbar">
              <table className="w-full text-xs border-collapse min-w-[500px]">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {data.headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, ri) => (
                    <motion.tr
                      key={ri}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ri * 0.03 }}
                      className="border-b border-slate-100/60 dark:border-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      {data.headers.map((_, ci) => {
                        const val = row.cells[ci] ?? null;
                        const style = getCellStyle(val);
                        return (
                          <td
                            key={ci}
                            className={cn(
                              'px-3 py-2.5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap align-top leading-relaxed',
                              ci === 0 && 'font-semibold text-slate-800 dark:text-white min-w-[100px]',
                              style ? `rounded-lg ${style}` : ''
                            )}
                          >
                            {val !== null ? (
                              <span className={cn('inline-block px-1.5 py-0.5 rounded-lg text-[11px]', style)}>
                                {val}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 text-[10px] italic">—</span>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Row count */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {data.rows.length} dòng • {data.headers.length} cột
                </span>
                <span className="text-[9px] text-slate-400">Tự động cập nhật mỗi 5 phút</span>
              </div>
            </div>
          )}

          {/* Embed iframe view */}
          {viewMode === 'embed' && (
            <div className="relative">
              <iframe
                src={PUBHTML_URL}
                className="w-full h-[420px] border-0"
                title="Lịch làm việc Google Sheets"
                sandbox="allow-scripts allow-popups allow-same-origin"
              />
              {/* Subtle overlay gradient bottom */}
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white/40 dark:from-slate-900/40 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* ─── Fullscreen modal ─── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/80 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Lịch làm việc — Toàn màn hình</span>
                  {lastUpdatedText && (
                    <span className="flex items-center gap-1 text-[9px] text-slate-400 ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Cập nhật {lastUpdatedText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Mở Google Sheets
                  </a>
                  <button
                    onClick={() => setExpanded(false)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal content — full iframe */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={PUBHTML_URL}
                  className="w-full h-full border-0"
                  title="Lịch làm việc Google Sheets (Fullscreen)"
                  sandbox="allow-scripts allow-popups allow-same-origin"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
