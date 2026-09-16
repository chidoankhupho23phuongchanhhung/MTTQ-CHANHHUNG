"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        "w-full max-w-[1600px] mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 focus:outline-none",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
