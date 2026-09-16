import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-2.5 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 w-fit">
      <span className="text-xs font-semibold mr-1">AI đang soạn tin</span>
      <div className="flex gap-1">
        <span className="typing-dot h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
        <span className="typing-dot h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
        <span className="typing-dot h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
      </div>
    </div>
  );
}
