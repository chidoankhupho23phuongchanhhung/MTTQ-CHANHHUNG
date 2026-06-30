import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = <Inbox className="h-10 w-10 text-slate-400" />,
  title = "Không tìm thấy dữ liệu",
  description = "Hiện tại không có thông tin nào trùng khớp hoặc dữ liệu chưa được cập nhật.",
  actionText,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm min-h-[220px]", className)}>
      <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-3.5 text-slate-500">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mb-4 leading-normal">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
