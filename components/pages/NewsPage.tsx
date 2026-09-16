"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Tabs from '../ui/Tabs';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Pagination from '../ui/Pagination';
import EmptyState from '../ui/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { mockNews } from '@/lib/mockData';
import { Search, Eye, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { NewsItem } from '@/lib/types';

export default function NewsPage() {
  const { activeNewsId, setActiveNewsId } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'activities', label: 'Hoạt động MTTQ' },
    { id: 'policy', label: 'Chính sách - Pháp luật' },
    { id: 'society', label: 'Đời sống - Xã hội' },
    { id: 'welfare', label: 'An sinh xã hội' }
  ];

  // Filter news
  const filteredNews = mockNews.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedNews = mockNews.find(n => n.id === activeNewsId);

  // Big highlight news item (first in current list)
  const spotlightNews = filteredNews[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Tin tức - Cập nhật"
        subtitle="Cập nhật nhanh nhất các thông tin, kế hoạch hoạt động và chính sách tại địa phương Phường Chánh Hưng"
      >
        <div className="relative w-64 max-w-full">
          <Input
            placeholder="Tìm kiếm tin bài..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            icon={<Search className="h-4 w-4" />}
            className="py-2"
          />
        </div>
      </SectionTitle>

      {/* Category Tabs */}
      <Tabs
        options={categories}
        activeId={activeTab}
        onChange={handleTabChange}
        className="mb-6"
      />

      {filteredNews.length === 0 ? (
        <EmptyState
          title="Không tìm thấy tin tức nào"
          description="Bà con vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chọn danh mục khác."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Spotlight article & Side list */}
          {currentPage === 1 && spotlightNews && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Spotlight Card (Big left block) */}
              <GlassCard
                onClick={() => setActiveNewsId(spotlightNews.id)}
                className="lg:col-span-2 p-0 overflow-hidden flex flex-col cursor-pointer bg-white/50 dark:bg-slate-900/40 text-left hover:border-blue-500/50"
              >
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img src={spotlightNews.image} alt={spotlightNews.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                      {spotlightNews.tag}
                    </span>
                    <h3 className="text-base sm:text-xl font-bold line-clamp-2 leading-tight">
                      {spotlightNews.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {spotlightNews.date}</span>
                    <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {spotlightNews.views} lượt xem</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {spotlightNews.summary}
                  </p>
                  <Button size="sm" className="w-fit text-xs font-bold gap-1 bg-transparent border-none text-blue-600 dark:text-blue-400 p-0 shadow-none hover:bg-transparent">
                    Xem chi tiết <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>

              {/* Sidebar List (Right block) */}
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Tin tức xem nhiều</h3>
                {mockNews.slice(0, 3).map((item) => (
                  <GlassCard
                    key={item.id}
                    onClick={() => setActiveNewsId(item.id)}
                    className="p-3 bg-white/40 dark:bg-slate-900/30 flex gap-3.5 cursor-pointer hover:border-blue-500/50"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <span className="text-[9px] bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider w-fit">
                        {item.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 mt-1 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 mt-1">{item.date}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Grid news feed */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 pl-1 mb-4 uppercase tracking-wider text-left">Danh sách tin bài</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedNews.map((news) => (
                <GlassCard
                  key={news.id}
                  onClick={() => setActiveNewsId(news.id)}
                  className="flex flex-col sm:flex-row gap-4 p-0 overflow-hidden bg-white/50 dark:bg-slate-900/40 cursor-pointer hover:border-blue-500/50 text-left"
                >
                  <div className="w-full sm:w-44 h-44 sm:h-auto overflow-hidden flex-shrink-0">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="p-5 flex flex-col gap-2 justify-between flex-1 min-w-0">
                    <div>
                      <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                        {news.categoryLabel}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 mt-2 leading-snug">
                        {news.title}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <span className="text-[10px] text-slate-400">{news.date}</span>
                      <Button size="sm" className="text-xs py-1.5 px-3 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white shadow-none hover:bg-slate-100 dark:hover:bg-slate-850">
                        Đọc tiếp
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Pagination controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8 border-t border-slate-200/50 dark:border-slate-800/50 pt-4"
            />
          </div>
        </div>
      )}

      {/* Detail News Modal */}
      <Modal
        isOpen={!!activeNewsId}
        onClose={() => setActiveNewsId(null)}
        title={selectedNews?.title}
        size="lg"
      >
        {selectedNews && (
          <div className="flex flex-col gap-4 text-left">
            <div className="relative h-60 sm:h-80 w-full rounded-2xl overflow-hidden mb-2">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Ngày ban hành: {selectedNews.date}</span>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {selectedNews.views} lượt xem</span>
              <span className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">
                {selectedNews.categoryLabel}
              </span>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1 italic text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
              {selectedNews.summary}
            </div>
            
            <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-900 pt-4 flex flex-col gap-3">
              {selectedNews.content}
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button onClick={() => setActiveNewsId(null)} variant="secondary" size="sm">
                Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
