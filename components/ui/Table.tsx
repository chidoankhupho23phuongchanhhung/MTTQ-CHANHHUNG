import React from 'react';
import { cn } from '@/lib/utils';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({
  headers,
  children,
  className,
  ...props
}: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md no-scrollbar">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        <thead>
          <tr className="border-b border-slate-200/70 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-950/60">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
}
