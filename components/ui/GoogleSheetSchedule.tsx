"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, ExternalLink, Calendar, Clock, AlertCircle,
  MapPin, Users, FileText, Star, Maximize2, X, StickyNote,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Config ─── */
const SHEET_ID  = '1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
const API_URL   = '/api/schedule';   // server-side proxy → bypasses CORS
const PUBHTML   = `${SHEET_URL}/pubhtml?widget=true&headers=false`;
const REFRESH_MS = 5 * 60 * 1000;

/* ─── Types ─── */
type FieldKey = 'stt' | 'thu' | 'thoigian' | 'noidung' | 'thanhphan' | 'diaDiem' | 'ghiChu';

const FIELD_MATCHERS: Record<FieldKey, string[]> = {
  stt:       ['stt', 'so', '#', 'tt', 'no'],
  thu:       ['thu', 'ngay', 'day'],
  thoigian:  ['thoi gian', 'gio', 'time', 'buoi'],
  noidung:   ['noi dung', 'content', 'cong viec', 'chuong trinh', 'noi'],
  thanhphan: ['thanh phan', 'participants', 'thanh vien', 'chu tri'],
  diaDiem:   ['dia diem', 'location', 'noi', 'phong', 'venue'],
  ghiChu:    ['ghi chu', 'note', 'notes', 'ghi'],
};

interface ScheduleRow {
  stt:       string | null;
  thu:       string | null;
  thoigian:  string | null;
  noidung:   string | null;
  thanhphan: string | null;
  diaDiem:   string | null;
  ghiChu:    string | null;
  raw:       Record<string, string | null>;
}

interface ParsedSheet {
  rows: ScheduleRow[];
  lastFetched: Date;
}

/* ─── Normalise (strip diacritics + lowercase) ─── */
const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

function detectFieldIndex(headers: string[]): Partial<Record<FieldKey, number>> {
  const map: Partial<Record<FieldKey, number>> = {};
  headers.forEach((h, i) => {
    const n = norm(h);
    (Object.entries(FIELD_MATCHERS) as [FieldKey, string[]][]).forEach(([field, matchers]) => {
      if (map[field] !== undefined) return;
      if (matchers.some(m => n.includes(m))) map[field] = i;
    });
  });
  return map;
}

/* ─── Parse API JSON into ScheduleRow[] ─── */
function parseApiData(headers: string[], dataRows: string[][]): ParsedSheet {
  const fieldMap = detectFieldIndex(headers);
  const mappedSet = new Set(Object.values(fieldMap));
  const extraHeaders = headers.filter((_, i) => !mappedSet.has(i) && headers[i]?.trim());

  const cell = (row: string[], idx?: number): string | null => {
    if (idx === undefined || idx >= row.length) return null;
    return row[idx]?.trim() || null;
  };

  let lastDay: string | null = null;

  const rows: ScheduleRow[] = dataRows
    .map(row => {
      const raw: Record<string, string | null> = {};
      extraHeaders.forEach(h => { raw[h] = cell(row, headers.indexOf(h)); });

      let dayVal = cell(row, fieldMap.thu);
      if (dayVal && dayVal.trim()) {
        lastDay = dayVal.trim();
      } else {
        dayVal = lastDay;
      }

      return {
        stt:       cell(row, fieldMap.stt),
        thu:       dayVal,
        thoigian:  cell(row, fieldMap.thoigian),
        noidung:   cell(row, fieldMap.noidung),
        thanhphan: cell(row, fieldMap.thanhphan),
        diaDiem:   cell(row, fieldMap.diaDiem),
        ghiChu:    cell(row, fieldMap.ghiChu),
        raw,
      };
    })
    .filter(r => r.noidung && r.noidung.trim() && r.noidung !== 'NỘI DUNG');

  return { rows, lastFetched: new Date() };
}

/* ─── Colour palette by day ─── */
const DAY_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  '2':  { bg: 'from-blue-50/80 to-blue-50/20 dark:from-blue-950/20 dark:to-transparent',     border: 'border-blue-200/60 dark:border-blue-800/40',     badge: 'bg-blue-600 text-white'   },
  '3':  { bg: 'from-violet-50/80 to-violet-50/20 dark:from-violet-950/20 dark:to-transparent', border: 'border-violet-200/60 dark:border-violet-800/40', badge: 'bg-violet-600 text-white' },
  '4':  { bg: 'from-emerald-50/80 to-emerald-50/20 dark:from-emerald-950/20 dark:to-transparent', border: 'border-emerald-200/60 dark:border-emerald-800/40', badge: 'bg-emerald-600 text-white' },
  '5':  { bg: 'from-amber-50/80 to-amber-50/20 dark:from-amber-950/20 dark:to-transparent',   border: 'border-amber-200/60 dark:border-amber-800/40',   badge: 'bg-amber-500 text-white'  },
  '6':  { bg: 'from-rose-50/80 to-rose-50/20 dark:from-rose-950/20 dark:to-transparent',     border: 'border-rose-200/60 dark:border-rose-800/40',     badge: 'bg-rose-600 text-white'   },
  '7':  { bg: 'from-indigo-50/80 to-indigo-50/20 dark:from-indigo-950/20 dark:to-transparent', border: 'border-indigo-200/60 dark:border-indigo-800/40', badge: 'bg-indigo-600 text-white' },
  'cn': { bg: 'from-slate-50/80 to-slate-50/20 dark:from-slate-900/30 dark:to-transparent',  border: 'border-slate-200/60 dark:border-slate-700/40',   badge: 'bg-slate-600 text-white'  },
};
const DEFAULT_CLR = { bg: 'from-white/60 to-white/20 dark:from-slate-900/20 dark:to-transparent', border: 'border-slate-200/40 dark:border-slate-800/30', badge: 'bg-slate-500 text-white' };

function getDayColor(thu: string | null) {
  if (!thu) return DEFAULT_CLR;
  const n = norm(thu);
  if (n.includes('cn') || n.includes('chu nhat')) return DAY_COLORS['cn'];
  const d = n.match(/[2-7]/)?.[0];
  return d ? (DAY_COLORS[d] ?? DEFAULT_CLR) : DEFAULT_CLR;
}

function formatDay(thu: string | null): string {
  if (!thu) return '—';
  const n = norm(thu);
  if (n.includes('cn') || n.includes('chu nhat')) return 'CN';
  const d = n.match(/[2-7]/)?.[0];
  return d ? `Thứ ${d}` : thu;
}

function isTrongTam(row: ScheduleRow): boolean {
  const txt = [row.noidung, row.ghiChu, row.thanhphan].join(' ');
  return /trọng tâm|quan trọng|họp|hội nghị|hội thảo|ký kết|lễ|kỷ niệm|khánh thành/i.test(txt);
}

/* ─── Single card ─── */
function ScheduleCard({ row, index }: { row: ScheduleRow; index: number }) {
  const [open, setOpen] = useState(false);
  const clr       = getDayColor(row.thu);
  const highlight = isTrongTam(row);
  const hasMore   = !!(row.ghiChu || Object.values(row.raw).some(Boolean));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.28 }}
      className={cn(
        'relative rounded-2xl border bg-gradient-to-r overflow-hidden',
        clr.bg, clr.border,
        highlight && 'ring-2 ring-yellow-400/60 shadow-md shadow-yellow-400/10'
      )}
    >
      {/* Trọng tâm ribbon */}
      {highlight && (
        <div className="absolute top-0 right-0 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-bl-xl rounded-tr-2xl z-10">
          <Star className="h-2.5 w-2.5" /> TRỌNG TÂM
        </div>
      )}

      <div className="p-3.5">
        {/* Row 1: Day pill + Time + Content */}
        <div className="flex items-start gap-2.5">
          {row.thu && (
            <span className={cn('flex-shrink-0 text-[9px] font-black uppercase px-2 py-1.5 rounded-xl min-w-[48px] text-center leading-none', clr.badge)}>
              {formatDay(row.thu)}
            </span>
          )}
          <div className="flex-1 min-w-0">
            {row.thoigian && (
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{row.thoigian}</span>
              </div>
            )}
            {row.noidung && (
              <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-snug pr-4">{row.noidung}</p>
            )}
          </div>
        </div>

        {/* Row 2: Location + Participants */}
        {(row.diaDiem || row.thanhphan) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 pl-0">
            {row.diaDiem && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3 text-rose-400 flex-shrink-0" />
                <span className="truncate max-w-[160px]">{row.diaDiem}</span>
              </span>
            )}
            {row.thanhphan && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Users className="h-3 w-3 text-blue-400 flex-shrink-0" />
                <span className="truncate max-w-[180px]">{row.thanhphan}</span>
              </span>
            )}
          </div>
        )}

        {/* Expand toggle */}
        {hasMore && (
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-0.5 mt-1.5 text-[9px] font-bold text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {open ? 'Thu gọn' : 'Ghi chú'}
          </button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/40">
                {row.ghiChu && (
                  <div className="flex items-start gap-1.5">
                    <StickyNote className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">{row.ghiChu}</p>
                  </div>
                )}
                {Object.entries(row.raw).map(([k, v]) =>
                  v ? (
                    <div key={k} className="flex items-start gap-1.5">
                      <FileText className="h-3 w-3 text-slate-300 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-600 dark:text-slate-300">{k}: </span>{v}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Group by Thứ ─── */
function groupByDay(rows: ScheduleRow[]) {
  const groups: { day: string | null; rows: ScheduleRow[] }[] = [];
  const seen = new Map<string, number>();
  rows.forEach(row => {
    const key = row.thu ?? '__none__';
    if (!seen.has(key)) { seen.set(key, groups.length); groups.push({ day: row.thu, rows: [row] }); }
    else groups[seen.get(key)!].rows.push(row);
  });
  return groups;
}

/* ══════════════════════════════════════════════
   Main component
══════════════════════════════════════════════ */
export default function GoogleSheetSchedule() {
  const [data,    setData]    = useState<ParsedSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyHighlight, setShowOnlyHighlight] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSheet = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      if (!json.headers?.length) throw new Error('Sheet trống hoặc chưa được chia sẻ công khai');
      setData(parseApiData(json.headers, json.rows ?? []));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSheet();
    timer.current = setInterval(() => fetchSheet(true), REFRESH_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter rows by search and highlight
  const filteredRows = data ? data.rows.filter(row => {
    const txt = [row.noidung, row.thanhphan, row.diaDiem, row.ghiChu, row.thu].join(' ').toLowerCase();
    const matchesSearch = searchQuery ? txt.includes(searchQuery.toLowerCase()) : true;
    const matchesHighlight = showOnlyHighlight ? isTrongTam(row) : true;
    return matchesSearch && matchesHighlight;
  }) : [];

  const groups        = groupByDay(filteredRows);
  const trongTamCount = data?.rows.filter(isTrongTam).length ?? 0;
  const lastTime      = data?.lastFetched.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl">
            <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-wider leading-none">
              Lịch công tác tuần
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {lastTime && (
                <span className="flex items-center gap-1 text-[9px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cập nhật {lastTime}
                </span>
              )}
              {trongTamCount > 0 && (
                <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-yellow-200/50">
                  <Star className="h-2.5 w-2.5" /> {trongTamCount} trọng tâm
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => fetchSheet()} disabled={loading} title="Tải lại"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all cursor-pointer disabled:opacity-40">
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setExpanded(true)} title="Phóng to"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all cursor-pointer">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" title="Mở Google Sheets"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-all">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center mb-4 bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-xl border border-slate-150 dark:border-slate-850">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Tìm kiếm công tác..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-2.5 pr-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowOnlyHighlight(!showOnlyHighlight)}
          className={cn(
            "w-full sm:w-auto px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap",
            showOnlyHighlight
              ? "bg-yellow-400 border-yellow-400 text-yellow-950 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
          )}
        >
          {showOnlyHighlight ? "★ Hiện tất cả" : "★ Chỉ trọng tâm"}
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 h-20 animate-pulse"
              style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {error && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Không tải được dữ liệu</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">{error}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-semibold">
              Cần chia sẻ Sheet: <strong>Share → Anyone with the link → Viewer</strong>
            </p>
          </div>
        </div>
      )}

      {/* ── Cards grouped by day ── */}
      {data && !error && (
        <div className="flex flex-col gap-5 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
          {groups.map((group, gi) => {
            const clr = getDayColor(group.day);
            return (
              <div key={gi}>
                {group.day && (
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full', clr.badge)}>
                      {formatDay(group.day)}
                    </span>
                    <div className="flex-1 h-px bg-slate-200/60 dark:bg-slate-700/40" />
                    <span className="text-[9px] text-slate-400 font-medium">{group.rows.length} mục</span>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {group.rows.map((row, ri) => (
                    <ScheduleCard key={`${gi}-${ri}`} row={row} index={ri} />
                  ))}
                </div>
              </div>
            );
          })}

          {data.rows.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Sheet chưa có dữ liệu hoặc tất cả hàng đều trống.
            </div>
          )}
        </div>
      )}

      {/* ── Fullscreen modal ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: '92vh' }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-black text-slate-800 dark:text-white">Lịch công tác — Toàn màn hình</span>
                  {trongTamCount > 0 && (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[8px] font-black px-2 py-0.5 rounded-full ml-2">
                      <Star className="h-2.5 w-2.5" /> {trongTamCount} trọng tâm
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a href={SHEET_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-500">
                    <ExternalLink className="h-3 w-3" /> Mở Sheet
                  </a>
                  <button onClick={() => setExpanded(false)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                {groups.map((group, gi) => {
                  const clr = getDayColor(group.day);
                  return (
                    <div key={gi}>
                      {group.day && (
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full', clr.badge)}>
                            {formatDay(group.day)}
                          </span>
                          <div className="flex-1 h-px bg-slate-200/60 dark:bg-slate-700/40" />
                          <span className="text-[9px] text-slate-400">{group.rows.length} mục</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                        {group.rows.map((row, ri) => (
                          <ScheduleCard key={`m-${gi}-${ri}`} row={row} index={ri} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* iframe fallback footer tab */}
              <div className="border-t border-slate-200/60 dark:border-slate-700 flex-shrink-0">
                <details className="group">
                  <summary className="flex items-center gap-2 px-5 py-2.5 cursor-pointer text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 select-none list-none">
                    <ExternalLink className="h-3 w-3" />
                    Xem giao diện Google Sheets gốc
                  </summary>
                  <iframe src={PUBHTML} className="w-full h-80 border-0" title="Sheet embed"
                    sandbox="allow-scripts allow-same-origin allow-popups" />
                </details>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
