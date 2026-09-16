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
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md no-scrollbar">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        <thead>
          <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/30">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
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
