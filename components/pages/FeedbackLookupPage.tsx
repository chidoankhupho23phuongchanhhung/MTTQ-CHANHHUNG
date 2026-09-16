"use client";

import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Table from '../ui/Table';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Timeline from '../ui/Timeline';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { Search, MapPin, Calendar, Clock, User, ShieldAlert, Sparkles, Star, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { FeedbackItem } from '@/lib/types';

export default function FeedbackLookupPage() {
  const { feedbacks, activeFeedbackId, setActiveFeedbackId, updateFeedbackStatus, addFeedbackRating, addNotification } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKP, setFilterKP] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);

  // Active feedback detail
  const activeFeedback = feedbacks.find(fb => fb.id === activeFeedbackId);

  // Simulate real-time updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Find a feedback that can be advanced in status
      const eligibleFeedbacks = feedbacks.filter(
        fb => fb.status === 'Mới tiếp nhận' || fb.status === 'Đang xử lý'
      );

      if (eligibleFeedbacks.length > 0) {
        // Pick random eligible feedback
        const randomFB = eligibleFeedbacks[Math.floor(Math.random() * eligibleFeedbacks.length)];
        
        setIsUpdating(true);
        setTimeout(() => {
          if (randomFB.status === 'Mới tiếp nhận') {
            updateFeedbackStatus(
              randomFB.id, 
              'Đang xử lý', 
              'Cán bộ kỹ thuật Đô thị đã bắt đầu khảo sát thực địa hiện trường.', 
              'Lê Hoàng Nam (Chuyên viên Quản lý Đô thị)'
            );
          } else if (randomFB.status === 'Đang xử lý') {
            updateFeedbackStatus(
              randomFB.id, 
              'Đã phản hồi', 
              'UBND phường đã giải quyết xong sự việc và phản hồi kết quả xử lý chi tiết.', 
              'Trần Thị Mai (Phó Chủ tịch UBND Phường)'
            );
          }
          setIsUpdating(false);
        }, 1500);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [feedbacks, updateFeedbackStatus]);

  // Filtering
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch = fb.feedbackCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fb.senderPhone.includes(searchQuery) ||
                          fb.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fb.status === filterStatus;
    const matchesKP = filterKP === 'all' || fb.wardGroup === filterKP;
    const matchesField = filterField === 'all' || fb.field === filterField;

    return matchesSearch && matchesStatus && matchesKP && matchesField;
  });

  const handleRating = (ratingValue: number) => {
    if (activeFeedback) {
      addFeedbackRating(activeFeedback.id, ratingValue);
    }
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Tra cứu phản ánh trực tuyến"
        subtitle="Theo dõi tiến độ giải quyết phản ánh và biên bản phản hồi của chính quyền phường Chánh Hưng theo thời gian thực"
      >
        {isUpdating && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 rounded-xl text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Đang cập nhật...</span>
          </div>
        )}
      </SectionTitle>

      {/* Filter panel */}
      <GlassCard hoverable={false} className="p-4 mb-6 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Nhập mã phản ánh (ví dụ: PA2606-0012) hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <Select
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Mới tiếp nhận', label: 'Mới tiếp nhận' },
              { value: 'Đang xử lý', label: 'Đang xử lý' },
              { value: 'Đã phản hồi', label: 'Đã phản hồi' },
              { value: 'Hoàn tất', label: 'Hoàn tất' }
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />

          <Select
            options={[
              { value: 'all', label: 'Tất cả khu phố' },
              { value: 'Khu phố 1', label: 'Khu phố 1' },
              { value: 'Khu phố 2', label: 'Khu phố 2' },
              { value: 'Khu phố 3', label: 'Khu phố 3' },
              { value: 'Khu phố 4', label: 'Khu phố 4' },
              { value: 'Khu phố 5', label: 'Khu phố 5' }
            ]}
            value={filterKP}
            onChange={(e) => setFilterKP(e.target.value)}
          />

          <Select
            options={[
              { value: 'all', label: 'Tất cả lĩnh vực' },
              { value: 'Đô thị', label: 'Quản lý Đô thị' },
              { value: 'Môi trường', label: 'Bảo vệ Môi trường' },
              { value: 'An ninh', label: 'An ninh trật tự' },
              { value: 'Xã hội', label: 'Chính sách xã hội' }
            ]}
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Results table */}
      {filteredFeedbacks.length === 0 ? (
        <EmptyState
          title="Không tìm thấy phản ánh nào"
          description="Vui lòng thử lại với từ khóa tìm kiếm khác hoặc thay đổi bộ lọc trạng thái địa bàn."
        />
      ) : (
        <div className="animate-fade-in-up text-left">
          <Table headers={["Mã số", "Tiêu đề phản ánh", "Địa bàn", "Ngày gửi", "Trạng thái", "Cập nhật cuối"]}>
            {filteredFeedbacks.map((fb) => (
              <tr
                key={fb.id}
                onClick={() => setActiveFeedbackId(fb.id)}
                className="hover:bg-slate-100/30 dark:hover:bg-slate-800/20 cursor-pointer transition-colors border-b border-slate-200/30 dark:border-slate-800/30"
              >
                <td className="px-6 py-4 font-bold text-xs text-slate-800 dark:text-white tracking-wider">
                  {fb.feedbackCode}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[240px] truncate">
                  {fb.title}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {fb.wardGroup}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {formatDate(fb.datetime.split('T')[0])}
                </td>
                <td className="px-6 py-4">
                  <Badge>{fb.status}</Badge>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {fb.lastUpdate.includes('T') ? formatDate(fb.lastUpdate.split('T')[0]) : fb.lastUpdate.split(' ')[0]}
                </td>
              </tr>
            ))}
          </Table>
          
          <div className="mt-4 text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold pl-1">
              Hiển thị {filteredFeedbacks.length} phản ánh trên địa bàn Phường Chánh Hưng
            </span>
          </div>
        </div>
      )}

      {/* Detail Slide-out Drawer */}
      <Drawer
        isOpen={!!activeFeedbackId}
        onClose={() => setActiveFeedbackId(null)}
        title={activeFeedback ? `Chi tiết phản ánh: ${activeFeedback.feedbackCode}` : ''}
        size="md"
      >
        {activeFeedback && (
          <div className="flex flex-col gap-6 text-left pb-12">
            {/* Header info card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">{activeFeedback.type}</span>
                <Badge>{activeFeedback.status}</Badge>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mt-1 leading-snug">{activeFeedback.title}</h4>
              <div className="flex flex-col gap-1.5 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" /> Vị trí: <span className="font-bold text-slate-700 dark:text-slate-200">{activeFeedback.location} ({activeFeedback.wardGroup})</span></span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> Ngày gửi: <span className="font-bold text-slate-700 dark:text-slate-200">{activeFeedback.datetime.replace('T', ' ').substring(0, 16)}</span></span>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-slate-400" /> Cán bộ xử lý: <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{activeFeedback.officer}</span></span>
              </div>
            </div>

            {/* Content text */}
            <div className="flex flex-col gap-2">
              <h5 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Nội dung chi tiết</h5>
              <div className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {activeFeedback.content}
              </div>
            </div>

            {/* Photo Attachment if present */}
            {activeFeedback.image && (
              <div className="flex flex-col gap-2">
                <h5 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Hình ảnh hiện trường</h5>
                <div className="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 h-44 sm:h-56">
                  <img src={activeFeedback.image} alt="Hiện trường" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Timeline of processing */}
            <div className="flex flex-col gap-4">
              <h5 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Lịch trình xử lý 24/24</h5>
              <div className="p-4 py-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
                <Timeline events={activeFeedback.timeline} />
              </div>
            </div>

            {/* Satisfaction Rating (Only show if resolved: status is 'Đã phản hồi' or 'Hoàn tất') */}
            {(activeFeedback.status === 'Đã phản hồi' || activeFeedback.status === 'Hoàn tất') && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-200/40 dark:bg-emerald-950/10 dark:border-emerald-900/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Đánh giá mức độ hài lòng</h5>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">UBND phường đã giải quyết xong phản ánh này. Sự phản hồi, đánh giá sao của bà con sẽ giúp nâng cao thái độ phục vụ của cán bộ.</p>
                
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const activeRating = activeFeedback.rating || 0;
                    return (
                      <button
                        key={val}
                        onClick={() => handleRating(val)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-400 cursor-pointer transition-colors"
                      >
                        <Star className="h-6 w-6" fill={val <= activeRating ? "currentColor" : "none"} />
                      </button>
                    );
                  })}
                  {activeFeedback.rating && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">Đã đánh giá: {activeFeedback.rating}/5 sao</span>
                  )}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <Button onClick={() => setActiveFeedbackId(null)} variant="secondary" size="sm">
                Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
}
