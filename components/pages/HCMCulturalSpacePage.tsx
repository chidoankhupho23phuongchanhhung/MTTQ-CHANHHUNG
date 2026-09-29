"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ExhibitionLayout = dynamic(
  () => import('@/components/cultural-space/ExhibitionLayout'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 text-amber-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-300">
          Đang nạp Không Gian Văn Hóa Hồ Chí Minh 3D...
        </p>
      </div>
    )
  }
);

export default function HCMCulturalSpacePage() {
  return (
    <main className="w-full min-h-screen bg-[#0f172a]">
      <ExhibitionLayout />
    </main>
  );
}
