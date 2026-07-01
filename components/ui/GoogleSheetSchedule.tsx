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
const SHEET_ID = '1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
const GVZ_URL   = `${SHEET_URL}/gviz/tq?tqx=out:json`;
const PUBHTML   = `${SHEET_URL}/pubhtml?widget=true&headers=false`;
const REFRESH_MS = 5 * 60 * 1000;

/* ─── Column field mapping (match Vietnamese headers) ─── */
type FieldKey = 'stt' | 'thu' | 'thoigian' | 'noidung' | 'thanhphan' | 'diaDiem' | 'ghiChu';

const FIELD_MATCHERS: Record<FieldKey, string[]> = {
  stt:       ['stt', 'số', 'tt', 'no', '#'],
  thu:       ['thứ', 'thu', 'ngày', 'day', 'ngay'],
  thoigian:  ['thời gian', 'thoi gian', 'giờ', 'gio', 'time', 'buổi', 'buoi'],
  noidung:   ['nội dung', 'noi dung', 'content', 'công việc', 'cong viec', 'chương trình', 'chuong trinh'],
  thanhphan: ['thành phần', 'thanh phan', 'participants', 'thành viên', 'thanh vien', 'chủ trì', 'chu tri'],
  diaDiem:   ['địa điểm', 'dia diem', 'location', 'nơi', 'phòng', 'phong', 'venue'],
  ghiChu:    ['ghi chú', 'ghi chu', 'note', 'notes', 'ghi chú'],
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
  unmappedHeaders: string[];
  lastFetched: Date;
}

/* ─── Normalise string for matching ─── */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

function detectFieldIndex(headers: string[]): Partial<Record<FieldKey, number>> {
  const result: Partial<Record<FieldKey, number>> = {};
  headers.forEach((h, i) => {
    const n = norm(h);
    for (const [field, matchers] of Object.entries(FIELD_MATCHERS) as [FieldKey, string[]][]) {
      if (result[field] !== undefined) continue;
      if (matchers.some(m => n.includes(norm(m)))) {
        result[field] = i;
      }
    }
  });
  return result;
}

/* ─── Parse gviz JSON ─── */
function parseGviz(raw: string): ParsedSheet {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Phản hồi không hợp lệ');
  const json = JSON.parse(raw.slice(start, end + 1));
  const table = json.table;

  const headers: string[] = (table.cols || []).map(
    (c: { label?: string; id?: string }) => c.label || c.id || ''
  );

  const fieldMap = detectFieldIndex(headers);

  const mappedIdxs = new Set(Object.values(fieldMap));
  const unmappedHeaders = headers.filter((_, i) => !mappedIdxs.has(i) && headers[i].trim());

  const rows: ScheduleRow[] = (table.rows || [])
    .map((r: { c: ({ v?: unknown; f?: string } | null)[] }) => {
      const cell = (i?: number): string | null => {
        if (i === undefined) return null;
        const c = r.c?.[i];
        if (!c) return null;
        const val = c.f ?? c.v;
        if (val === null || val === undefined) return null;
        return String(val).trim() || null;
      };

      const raw: Record<string, string | null> = {};
      unmappedHeaders.forEach((h, hi) => {
        const realIdx = headers.indexOf(h);
        raw[h] = cell(realIdx);
      });

      return {
        stt:       cell(fieldMap.stt),
        thu:       cell(fieldMap.thu),
        thoigian:  cell(fieldMap.thoigian),
        noidung:   cell(fieldMap.noidung),
        thanhphan: cell(fieldMap.thanhphan),
        diaDiem:   cell(fieldMap.diaDiem),
        ghiChu:    cell(fieldMap.ghiChu),
        raw,
      };
    })
    .filter((r: ScheduleRow) =>
      r.noidung || r.thu || r.thoigian
    );

  return { rows, unmappedHeaders, lastFetched: new Date() };
}

/* ─── Day colour palette ─── */
const DAY_COLORS: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  '2': { bg: 'from-blue-50 to-blue-50/40 dark:from-blue-950/20 dark:to-blue-950/5',   border: 'border-blue-200/60 dark:border-blue-800/40',   badge: 'bg-blue-600 text-white',   dot: 'bg-blue-500' },
  '3': { bg: 'from-violet-50 to-violet-50/40 dark:from-violet-950/20 dark:to-violet-950/5', border: 'border-violet-200/60 dark:border-violet-800/40', badge: 'bg-violet-600 text-white', dot: 'bg-violet-500' },
  '4': { bg: 'from-emerald-50 to-emerald-50/40 dark:from-emerald-950/20 dark:to-emerald-950/5', border: 'border-emerald-200/60 dark:border-emerald-800/40', badge: 'bg-emerald-600 text-white', dot: 'bg-emerald-500' },
  '5': { bg: 'from-amber-50 to-amber-50/40 dark:from-amber-950/20 dark:to-amber-950/5',  border: 'border-amber-200/60 dark:border-amber-800/40',  badge: 'bg-amber-500 text-white',  dot: 'bg-amber-500' },
  '6': { bg: 'from-rose-50 to-rose-50/40 dark:from-rose-950/20 dark:to-rose-950/5',    border: 'border-rose-200/60 dark:border-rose-800/40',    badge: 'bg-rose-600 text-white',   dot: 'bg-rose-500' },
  '7': { bg: 'from-indigo-50 to-indigo-50/40 dark:from-indigo-950/20 dark:to-indigo-950/5', border: 'border-indigo-200/60 dark:border-indigo-800/40', badge: 'bg-indigo-600 text-white', dot: 'bg-indigo-500' },
  'cn': { bg: 'from-slate-50 to-slate-50/40 dark:from-slate-900/30 dark:to-slate-900/10', border: 'border-slate-200/60 dark:border-slate-700/40', badge: 'bg-slate-600 text-white', dot: 'bg-slate-400' },
};
const DEFAULT_COLOR = { bg: 'from-slate-50 to-white/50 dark:from-slate-900/20 dark:to-slate-900/5', border: 'border-slate-200/40 dark:border-slate-800/30', badge: 'bg-slate-500 text-white', dot: 'bg-slate-400' };

function getDayColor(thu: string | null) {
  if (!thu) return DEFAULT_COLOR;
  const n = norm(thu);
  if (n.includes('cn') || n.includes('chu nhat') || n.includes('sunday')) return DAY_COLORS['cn'];
  const match = n.match(/\d/);
  if (match) return DAY_COLORS[match[0]] ?? DEFAULT_COLOR;
  return DEFAULT_COLOR;
}

function formatDay(thu: string | null): string {
  if (!thu) return '—';
  const n = norm(thu);
  if (n.includes('cn') || n.includes('chu nhat')) return 'CN';
  if (n.includes('2')) return 'Thứ 2';
  if (n.includes('3')) return 'Thứ 3';
  if (n.includes('4')) return 'Thứ 4';
  if (n.includes('5')) return 'Thứ 5';
  if (n.includes('6')) return 'Thứ 6';
  if (n.includes('7')) return 'Thứ 7';
  return thu;
}

/* ─── Is row a "trọng tâm" highlight? ─── */
function isTrongTam(row: ScheduleRow): boolean {
  const text = [row.noidung, row.ghiChu].join(' ').toLowerCase();
  return /trọng tâm|trong tam|quan trọng|quan trong|họp|hop|hội nghị|hoi nghi|hội thảo|hoi thao|ký kết|ky ket|lễ|le |kỷ niệm|ky niem|khánh thành|khanh thanh/i.test(text);
}

/* ─── Single schedule card ─── */
function ScheduleCard({ row, index }: { row: ScheduleRow; index: number }) {
  const [open, setOpen] = useState(false);
  const color = getDayColor(row.thu);
  const highlight = isTrongTam(row);
  const hasExtra = !!(row.thanhphan || row.diaDiem || row.ghiChu || Object.values(row.raw).some(Boolean));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        'relative rounded-2xl border bg-gradient-to-r overflow-hidden transition-all duration-200',
        color.bg, color.border,
        highlight && 'ring-2 ring-yellow-400/50 shadow-md shadow-yellow-500/10'
      )}
    >
      {/* Trọng tâm ribbon */}
      {highlight && (
        <div className="absolute top-0 right-0 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-bl-xl rounded-tr-2xl">
          <Star className="h-2.5 w-2.5" /> TRỌNG TÂM
        </div>
      )}

      <div className="p-3.5">
        {/* Top row: Day badge + Time + Title */}
        <div className="flex items-start gap-3">
          {/* Day pill */}
          {row.thu && (
            <div className={cn('flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-center min-w-[52px]', color.badge)}>
              {formatDay(row.thu)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Time */}
            {row.thoigian && (
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{row.thoigian}</span>
              </div>
            )}

            {/* Content — main title */}
            {row.noidung && (
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed pr-6">
                {row.noidung}
              </p>
            )}
          </div>
        </div>

        {/* Inline quick info (always visible) */}
        {(row.diaDiem || row.thanhphan) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 pl-0 ml-0">
            {row.diaDiem && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3 text-rose-400 flex-shrink-0" />
                <span className="truncate max-w-[180px]">{row.diaDiem}</span>
              </span>
            )}
            {row.thanhphan && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Users className="h-3 w-3 text-blue-400 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{row.thanhphan}</span>
              </span>
            )}
          </div>
        )}

        {/* Expand toggle for Ghi chú + extra cols */}
        {hasExtra && (row.ghiChu || row.thanhphan || Object.values(row.raw).some(Boolean)) && (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 mt-2 text-[9px] font-bold text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
          >
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {open ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 mt-2.5 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/40">
                {row.ghiChu && (
                  <div className="flex items-start gap-2">
                    <StickyNote className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">{row.ghiChu}</p>
                  </div>
                )}
                {/* Extra unmapped columns */}
                {Object.entries(row.raw).map(([key, val]) =>
                  val ? (
                    <div key={key} className="flex items-start gap-2">
                      <FileText className="h-3 w-3 text-slate-300 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-600 dark:text-slate-300">{key}: </span>{val}
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

/* ─── Group rows by Thứ ─── */
function groupByDay(rows: ScheduleRow[]): { day: string | null; rows: ScheduleRow[] }[] {
  const groups: { day: string | null; rows: ScheduleRow[] }[] = [];
  const seen: Map<string, number> = new Map();

  rows.forEach(row => {
    const key = row.thu ?? '__none__';
    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ day: row.thu, rows: [row] });
    } else {
      groups[seen.get(key)!].rows.push(row);
    }
  });

  return groups;
}

/* ═══════════════════════════════════════════
    Main export component
════════════════════════════════════════════ */
export default function GoogleSheetSchedule() {
  const [data,    setData]    = useState<ParsedSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [expanded, setExpanded]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSheet = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(GVZ_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} — Kiểm tra quyền chia sẻ Sheet`);
      const text = await res.text();
      const parsed = parseGviz(text);
      if (parsed.rows.length === 0) throw new Error('Sheet không có dữ liệu hàng nào');
      setData(parsed);
      setShowEmbed(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không tải được';
      setError(msg);
      setShowEmbed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSheet();
    timerRef.current = setInterval(() => fetchSheet(true), REFRESH_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = data ? groupByDay(data.rows) : [];
  const trongTamCount = data?.rows.filter(isTrongTam).length ?? 0;
  const lastTime = data?.lastFetched.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl">
            <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-wider leading-none">
              Lịch công tác — Cập nhật thực
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {lastTime && (
                <span className="flex items-center gap-1 text-[9px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cập nhật {lastTime} · mỗi 5 phút
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

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchSheet()}
            disabled={loading}
            title="Tải lại"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          </button>
          <button
            onClick={() => setExpanded(true)}
            title="Phóng to"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={SHEET_URL} target="_blank" rel="noopener noreferrer"
            title="Mở Google Sheets"
            className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* ─── Loading skeleton ─── */}
      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 h-24 animate-pulse"
              style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      )}

      {/* ─── Error state ─── */}
      {error && !data && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Không tải được dữ liệu Sheet</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">{error}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-semibold">
              Cần chia sẻ Sheet: <strong>Anyone with the link → Viewer</strong>
            </p>
          </div>
        </div>
      )}

      {/* ─── Embed fallback ─── */}
      {showEmbed && !data && (
        <div className="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/40">
          <iframe src={PUBHTML} className="w-full h-[400px] border-0" title="Lịch làm việc"
            sandbox="allow-scripts allow-same-origin allow-popups" />
        </div>
      )}

      {/* ─── Cards grouped by day ─── */}
      {data && !showEmbed && (
        <div className="flex flex-col gap-5 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
          {groups.map((group, gi) => {
            const color = getDayColor(group.day);
            return (
              <div key={gi}>
                {/* Day section header */}
                {group.day && (
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full', color.badge)}>
                      {formatDay(group.day)}
                    </span>
                    <div className="flex-1 h-px bg-slate-200/60 dark:bg-slate-700/40" />
                    <span className="text-[9px] text-slate-400 font-medium">{group.rows.length} mục</span>
                  </div>
                )}

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {group.rows.map((row, ri) => (
                    <ScheduleCard key={`${gi}-${ri}`} row={row} index={ri} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Fullscreen modal ─── */}
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
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
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

              {/* Scrollable card grid */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                {groups.map((group, gi) => {
                  const color = getDayColor(group.day);
                  return (
                    <div key={gi}>
                      {group.day && (
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full', color.badge)}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
