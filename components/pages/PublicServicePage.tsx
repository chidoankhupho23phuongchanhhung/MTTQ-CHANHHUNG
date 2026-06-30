"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { mockPublicServices } from '@/lib/mockData';
import { Search, Clock, ShieldCheck, HelpCircle, Bot, BookOpen, ChevronRight, Check } from 'lucide-react';
import { PublicServiceItem } from '@/lib/types';

export default function PublicServicePage() {
  const { activePublicServiceId, setActivePublicServiceId, setCurrentRoute, addChatMessage } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'residence', label: 'Cư trú' },
    { id: 'civil', label: 'Hộ tịch' },
    { id: 'notary', label: 'Chứng thực' }
  ];

  // Filter public services
  const filteredServices = mockPublicServices.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedService = mockPublicServices.find(s => s.id === activePublicServiceId);

  const handleAskAIAboutService = (serviceTitle: string) => {
    // Add prompt message to chat
    addChatMessage('user', `Hướng dẫn thủ tục: ${serviceTitle}`);
    
    // Set AI status to typing and reply after timeout
    setCurrentRoute('/tong-dai-ai');
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Dịch vụ công trực tuyến"
        subtitle="Tra cứu quy trình chuẩn, hồ sơ cần chuẩn bị và hướng dẫn thực hiện dịch vụ công mức độ 3, 4"
      >
        <div className="relative w-64 max-w-full">
          <Input
            placeholder="Tìm kiếm thủ tục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="py-2"
          />
        </div>
      </SectionTitle>

      {/* Tabs */}
      <Tabs
        options={categories}
        activeId={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {filteredServices.length === 0 ? (
        <EmptyState
          title="Không tìm thấy dịch vụ nào"
          description="Vui lòng thử lại với từ khóa khác hoặc chuyển đổi danh mục."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredServices.map((service) => (
            <GlassCard
              key={service.id}
              className="flex flex-col justify-between bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {service.categoryLabel}
                  </span>
                  <Badge variant={service.level.includes('4') || service.level.includes('toàn trình') ? 'primary' : 'secondary'}>
                    {service.level}
                  </Badge>
                </div>
                
                <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-snug">
                  {service.title}
                </h4>
                
                <div className="flex flex-col gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Thời gian: <span className="font-bold text-slate-700 dark:text-slate-200">{service.processingTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    Cơ quan: <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{service.agency.split(' (')[0]}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-3 border-t border-slate-100 dark:border-slate-900">
                <Button
                  onClick={() => setActivePublicServiceId(service.id)}
                  size="sm"
                  className="flex-1 text-xs font-bold gap-1"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Xem hướng dẫn
                </Button>
                
                <Button
                  onClick={() => handleAskAIAboutService(service.title)}
                  variant="secondary"
                  size="sm"
                  title="Hỏi AI tư vấn"
                  className="px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                >
                  <Bot className="h-4.5 w-4.5" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Guidance Steps Modal */}
      <Modal
        isOpen={!!activePublicServiceId}
        onClose={() => setActivePublicServiceId(null)}
        title={selectedService?.title}
        size="md"
      >
        {selectedService && (
          <div className="flex flex-col gap-5 text-left">
            <div className="flex items-center justify-between p-3.5 bg-blue-50/50 dark:bg-blue-950/25 border border-blue-200/40 dark:border-blue-900/30 rounded-2xl">
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="text-slate-400 font-medium">Cơ quan phụ trách:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedService.agency}</span>
              </div>
              <Badge variant="primary">{selectedService.level}</Badge>
            </div>

            {/* Stepper listing guide steps */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Các bước thực hiện</h4>
              
              <div className="flex flex-col gap-4 relative pl-3 border-l border-slate-200 dark:border-slate-800 ml-4">
                {selectedService.steps.map((step) => (
                  <div key={step.stepNumber} className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-slate-900">
                      {step.stepNumber}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{step.title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button
                onClick={() => handleAskAIAboutService(selectedService.title)}
                variant="gradient"
                size="sm"
                className="w-full sm:flex-1 text-xs font-bold"
              >
                <Bot className="h-4 w-4" />
                Hỏi Trợ lý AI thêm thông tin
              </Button>
              <Button
                onClick={() => setActivePublicServiceId(null)}
                variant="secondary"
                size="sm"
                className="w-full sm:w-fit text-xs font-bold"
              >
                Đóng hướng dẫn
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
