"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({
  options,
  activeId,
  onChange,
  className
}: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1.5 p-1 bg-slate-100/50 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-slate-800/40 w-fit max-w-full overflow-x-auto no-scrollbar", className)}>
      {options.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer select-none whitespace-nowrap z-10",
              isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white dark:bg-slate-900 shadow-md shadow-slate-200/50 dark:shadow-none rounded-xl -z-10 border border-slate-200/20 dark:border-slate-800/50"
                transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
