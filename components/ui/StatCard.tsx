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
        "flex flex-col relative overflow-hidden bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {value}
        </span>
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center font-bold px-1.5 py-0.5 rounded-lg",
                isUp && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
                isDown && "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400",
                trend === 'neutral' && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {isUp && <ArrowUpRight className="h-3 w-3 mr-0.5 stroke-[3px]" />}
              {isDown && <ArrowDownRight className="h-3 w-3 mr-0.5 stroke-[3px]" />}
              {change}
            </span>
          )}
          {description && (
            <span className="text-slate-400 dark:text-slate-500 leading-none">
              {description}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
}
