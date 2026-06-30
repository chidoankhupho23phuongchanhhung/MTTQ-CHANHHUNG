import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gradient';
  children: React.ReactNode;
}

export default function Badge({
  children,
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors";
  
  const variants = {
    primary: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    secondary: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800/50",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50",
    danger: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/50",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/50",
    neutral: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    gradient: "red-gold-gradient text-white border-none text-[10px] uppercase tracking-wider"
  };

  // Auto colors based on Vietnamese states
  let autoVariant = variant;
  const labelText = typeof children === 'string' ? children : '';
  
  if (variant === 'neutral' && labelText) {
    if (['Mới tiếp nhận', 'Mới', 'Đang nhận hồ sơ'].includes(labelText)) {
      autoVariant = 'info';
    } else if (['Đang xử lý', 'Đang xác minh', 'Đang xét duyệt'].includes(labelText)) {
      autoVariant = 'warning';
    } else if (['Hoàn tất', 'Hoàn thành', 'Đã phản hồi', 'Đã hoàn thành'].includes(labelText)) {
      autoVariant = 'success';
    } else if (['Quá hạn', 'Khẩn cấp', 'Cao', 'Hỏa tốc'].includes(labelText)) {
      autoVariant = 'danger';
    } else if (['Chờ phản hồi', 'Chờ duyệt'].includes(labelText)) {
      autoVariant = 'primary';
    }
  }

  return (
    <span className={cn(baseStyles, variants[autoVariant], className)} {...props}>
      {children}
    </span>
  );
}
