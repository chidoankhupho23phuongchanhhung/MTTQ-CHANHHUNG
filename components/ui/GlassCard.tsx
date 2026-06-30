"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  animate?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className,
  hoverable = true,
  animate = true,
  delay = 0,
  ...props
}: GlassCardProps) {
  const cardClasses = cn(
    "glass-card overflow-hidden p-6 rounded-3xl",
    !hoverable && "hover:transform-none hover:box-shadow-none hover:border-color-inherit",
    className
  );

  if (!animate) {
    return (
      <div className={cardClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverable ? { y: -4, scale: 1.005 } : undefined}
      className={cardClasses}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
