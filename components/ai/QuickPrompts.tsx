"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const quickPrompts = [
  "Thủ tục đăng ký tạm trú",
  "Chính sách hỗ trợ người dân",
  "Phản ánh về ô nhiễm tiếng ồn",
  "Lịch tiếp xúc cử tri",
  "Hướng dẫn sao y công chứng"
];

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span>Gợi ý câu hỏi</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200/50 bg-white/40 dark:border-slate-800/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-500/50 transition-all text-left cursor-pointer active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
