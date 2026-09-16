import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 pl-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "glass-input w-full px-4 py-2.5 text-sm min-h-[100px] resize-y transition-all focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500",
            error && "border-rose-500 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-rose-500 dark:text-rose-400 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
