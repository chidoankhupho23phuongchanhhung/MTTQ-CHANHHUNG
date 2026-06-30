import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function SectionTitle({
  title,
  subtitle,
  gradient = false,
  className,
  children
}: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div className="flex flex-col gap-1.5">
        <h2 className={cn(
          "text-xl sm:text-2xl font-black tracking-tight",
          gradient ? "text-red-gold-gradient" : "text-slate-800 dark:text-white"
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 self-start sm:self-center">
          {children}
        </div>
      )}
    </div>
  );
}
