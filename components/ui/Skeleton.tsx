import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
  variant = 'rectangular',
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer-bg",
        variant === 'text' && "h-4 w-full rounded-md",
        variant === 'circular' && "h-10 w-10 rounded-full",
        variant === 'rectangular' && "h-20 w-full rounded-2xl",
        className
      )}
      {...props}
    />
  );
}
