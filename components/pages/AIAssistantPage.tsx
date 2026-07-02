"use client";

import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import { 
  FileText, Sparkles, ExternalLink, Bot, CheckSquare
} from 'lucide-react';

export default function AIAssistantPage() {
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Trung tâm Trợ lý Hành chính AI"
        subtitle="Hệ thống tổng đài AI chuyên nghiệp hỗ trợ soạn thảo kế hoạch công tác và kiểm tra thể thức văn bản hành chính"
      />

      <div className="max-w-4xl mx-auto mt-8 flex flex-col gap-6 animate-fade-in-up">
        {/* Intro banner */}
        <GlassCard hoverable={false} className="p-6 bg-gradient-to-br from-blue-600/5 via-blue-600/[0.02] to-amber-600/[0.02] border-blue-200/50 dark:border-blue-900/30 flex items-center gap-4 text-left">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg flex-shrink-0">
            <Bot className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Trợ lý AI Mặt trận số</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Nhấn vào các trợ lý chuyên dụng bên dưới để kết nối trực tiếp đến mô hình Gemini và bắt đầu công việc. Hệ thống đã được lập trình sẵn các biểu mẫu và nghiệp vụ Mặt trận Tổ quốc.
            </p>
          </div>
        </GlassCard>

        {/* 2 Stretched Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
          
          {/* Card 1: Trợ lý chỉnh sửa văn bản */}
          <GlassCard
            hoverable={true}
            onClick={() => handleOpenLink('https://gemini.google.com/gem/32d145e23e8d?usp=sharing')}
            className="p-6 flex flex-col items-center justify-between text-center gap-5 border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 cursor-pointer group transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 h-full"
          >
            <div className="flex flex-col items-center gap-4 flex-1">
              {/* Icon Container */}
              <div className="p-5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                <FileText className="h-8 w-8" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  TRỢ LÝ CHỈNH SỬA VĂN BẢN
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Hỗ trợ rà soát lỗi chính tả, ngữ pháp, sửa câu từ và kiểm tra thể thức văn bản hành chính theo quy chuẩn Nghị định số 30/2020/NĐ-CP.
                </p>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Bắt đầu chỉnh sửa</span>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </GlassCard>

          {/* Card 2: Trợ lý tham mưu kế hoạch */}
          <GlassCard
            hoverable={true}
            onClick={() => handleOpenLink('https://gemini.google.com/gem/40062a5981cd?usp=sharing')}
            className="p-6 flex flex-col items-center justify-between text-center gap-5 border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 cursor-pointer group transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 h-full"
          >
            <div className="flex flex-col items-center gap-4 flex-1">
              {/* Icon Container */}
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-amber-100/50 dark:border-amber-900/30">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  TRỢ LÝ THAM MƯU KẾ HOẠCH
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Hỗ trợ xây dựng kế hoạch công tác Mặt trận, dự thảo chương trình phối hợp thống nhất hành động và các đề án chính trị xã hội.
                </p>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500">
              <span>Bắt đầu tham mưu</span>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </GlassCard>

        </div>
      </div>
    </PageContainer>
  );
}
