"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  delay?: number;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  description,
  delay = 0,
  className
}: StatCardProps) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <GlassCard
      delay={delay}
      className={cn(
        "flex flex-col relative overflow-hidden bg-white/70 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-700/70 shadow-xs dark:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-200 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/40">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center font-bold px-2 py-0.5 rounded-lg border",
                isUp && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
                isDown && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/40",
                trend === 'neutral' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              )}
            >
              {isUp && <ArrowUpRight className="h-3 w-3 mr-0.5 stroke-[3px]" />}
              {isDown && <ArrowDownRight className="h-3 w-3 mr-0.5 stroke-[3px]" />}
              {change}
            </span>
          )}
          {description && (
            <span className="text-slate-500 dark:text-slate-300 font-medium leading-none">
              {description}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
}
