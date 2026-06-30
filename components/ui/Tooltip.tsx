import React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className
}: TooltipProps) {
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const arrows = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800 dark:border-t-slate-950",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 dark:border-b-slate-950",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800 dark:border-l-slate-950",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800 dark:border-r-slate-950"
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          "absolute hidden group-hover:block z-[99] bg-slate-800 text-white dark:bg-slate-950 text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap leading-none",
          positions[position],
          className
        )}
      >
        {content}
        {/* Tooltip Arrow */}
        <div
          className={cn(
            "absolute border-4 border-transparent",
            arrows[position]
          )}
        />
      </div>
    </div>
  );
}
