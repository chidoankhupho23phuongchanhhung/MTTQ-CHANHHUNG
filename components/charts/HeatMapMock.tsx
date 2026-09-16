"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert, Users, Info } from 'lucide-react';

interface HeatItem {
  id: string;
  name: string;
  count: number;
  density: 'high' | 'medium' | 'low';
  description: string;
}

const mockHeatData: HeatItem[] = [
  { id: 'kp1', name: 'Khu phố 1', count: 148, density: 'medium', description: 'Mật độ phản ánh tập trung quanh đường Tạ Quang Bửu.' },
  { id: 'kp2', name: 'Khu phố 2', count: 85, density: 'low', description: 'Tập trung chủ yếu là kiến nghị bảo vệ sinh môi trường hẻm.' },
  { id: 'kp3', name: 'Khu phố 3', count: 210, density: 'high', description: 'Mật độ cao do có trục đường Phạm Hùng đang thi công nâng cấp.' },
  { id: 'kp4', name: 'Khu phố 4', count: 160, density: 'medium', description: 'Đa dạng phản ánh về đô thị và trật tự xây dựng hè phố.' },
  { id: 'kp5', name: 'Khu phố 5', count: 64, density: 'low', description: 'Cư dân chung cư phản ánh chủ yếu về dịch vụ công ích.' }
];

export default function HeatMapMock() {
  const [activeKP, setActiveKP] = useState<HeatItem | null>(null);

  const densityStyles = {
    high: "bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/40 hover:bg-rose-500/30",
    medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/30",
    low: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
  };

  const densityGlows = {
    high: "shadow-lg shadow-rose-500/10",
    medium: "shadow-lg shadow-amber-500/10",
    low: "shadow-lg shadow-emerald-500/10"
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Heat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {mockHeatData.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveKP(item)}
            onMouseLeave={() => setActiveKP(null)}
            className={cn(
              "p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col gap-1.5 select-none",
              densityStyles[item.density],
              densityGlows[item.density],
              activeKP?.id === item.id && "scale-105 ring-2 ring-blue-500/30 border-blue-500/50"
            )}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
            <span className="text-2xl font-black">{item.count}</span>
            <span className="text-[10px] opacity-75 font-semibold">Phản ánh</span>
          </div>
        ))}
      </div>

      {/* Info panel */}
      <div className="min-h-[76px] p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 flex gap-3 items-start transition-all">
        {activeKP ? (
          <>
            <div className={cn(
              "p-2 rounded-xl flex-shrink-0 mt-0.5",
              activeKP.density === 'high' && "bg-rose-50 text-rose-500 dark:bg-rose-950/30",
              activeKP.density === 'medium' && "bg-amber-50 text-amber-500 dark:bg-amber-950/30",
              activeKP.density === 'low' && "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30"
            )}>
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-white">{activeKP.name}</span>
                <span className={cn(
                  "px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider",
                  activeKP.density === 'high' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                  activeKP.density === 'medium' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  activeKP.density === 'low' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                )}>
                  {activeKP.density === 'high' ? 'Mật độ cao' : activeKP.density === 'medium' ? 'Mật độ trung bình' : 'Mật độ thấp'}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{activeKP.description}</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-blue-50 text-blue-500 dark:bg-blue-950/30 rounded-xl flex-shrink-0 mt-0.5">
              <Info className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5 pt-0.5">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Biểu đồ mật độ địa bàn</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 leading-normal">Di chuột vào từng khu phố để xem phân tích chi tiết.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
