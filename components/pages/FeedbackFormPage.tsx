"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import PageContainer from '../layout/PageContainer';
import Button from '../ui/Button';
import UploadBox from '../ui/UploadBox';
import Modal from '../ui/Modal';
import GlassCard from '../ui/GlassCard';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, MapPin, Send, Info, ShieldAlert, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Zod Validation Schema matching Slide 4 mobile requirements
const feedbackSchema = z.object({
  title: z.string().min(5, { message: "Tiêu đề cần ghi rõ từ 5 ký tự" }),
  content: z.string().min(15, { message: "Nội dung cần mô tả chi tiết từ 15 ký tự" }),
  field: z.string().min(1, { message: "Vui lòng chọn lĩnh vực" }),
  location: z.string().min(5, { message: "Vui lòng nhập địa điểm xảy ra" }),
  senderPhone: z.string().optional(),
  senderName: z.string().optional()
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackFormPage() {
  const { addFeedback, setCurrentRoute, setActiveFeedbackId } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Kiến nghị' | 'Góp ý' | 'Phản ánh'>('Kiến nghị');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdFeedbackCode, setCreatedFeedbackCode] = useState('');
  const [createdFeedbackId, setCreatedFeedbackId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      field: 'Đô thị',
      senderPhone: '',
      senderName: ''
    }
  });

  const onSubmit = (data: FeedbackFormValues) => {
    // Fill optional data defaults if empty
    const submission = {
      senderName: data.senderName || "Người dân ẩn danh",
      senderPhone: data.senderPhone || "Không cung cấp",
      senderAddress: "Phường Chánh Hưng",
      wardGroup: "Khu phố 3",
      type: activeTab,
      field: data.field,
      priority: "Thường" as const,
      title: data.title,
      content: data.content,
      location: data.location,
      datetime: new Date().toISOString().substring(0, 16),
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop'
    };

    const inserted = addFeedback(submission);
    setCreatedFeedbackCode(inserted.feedbackCode);
    setCreatedFeedbackId(inserted.id);
    setSuccessModalOpen(true);
  };

  const handleLookupNow = () => {
    setSuccessModalOpen(false);
    setActiveFeedbackId(createdFeedbackId);
    setCurrentRoute('/tra-cuu-phan-anh');
    window.location.href = '/tra-cuu-phan-anh';
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    reset();
  };

  return (
    <PageContainer>
      
      {/* Unified grid matching both desktop full-width and mobile stack without empty spaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left main form section (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Blue Header Banner matching Slide 4 header cards */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8 rounded-3xl shadow-md text-left flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              Gửi ý kiến phản ánh / đề xuất kiến nghị
            </h2>
            <p className="text-[10px] sm:text-xs text-white/80 mt-1 leading-normal italic">
              "Chung tay xây dựng phường Chánh Hưng văn minh - hiện đại - nghĩa tình"
            </p>
          </div>

          {/* Interactive tab switcher (Material design pills style) */}
          <div className="bg-white/70 dark:bg-slate-950/40 p-1.5 rounded-full flex gap-1 border border-slate-200/50 dark:border-slate-850/40">
            {(['Kiến nghị', 'Góp ý', 'Phản ánh'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 text-center py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Core Input Form container */}
          <GlassCard hoverable={false} className="p-6 text-left flex flex-col gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              
              {/* Tiêu đề input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-350">Tiêu đề {activeTab.toLowerCase()} *</label>
                <input
                  type="text"
                  placeholder={`Nhập tiêu đề ${activeTab.toLowerCase()}...`}
                  className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                  {...register('title')}
                />
                {errors.title && (
                  <span className="text-[10px] text-rose-500 font-semibold pl-1">{errors.title.message}</span>
                )}
              </div>

              {/* Nội dung textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-350">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  placeholder={`Nhập nội dung chi tiết ${activeTab.toLowerCase()}...`}
                  className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl resize-none"
                  {...register('content')}
                />
                {errors.content && (
                  <span className="text-[10px] text-rose-500 font-semibold pl-1">{errors.content.message}</span>
                )}
              </div>

              {/* Lĩnh vực select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-350">Lĩnh vực phản ánh *</label>
                  <select
                    className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl appearance-none bg-white dark:bg-slate-900"
                    {...register('field')}
                  >
                    <option value="Đô thị">Quản lý Đô thị / Xây dựng</option>
                    <option value="Môi trường">Vệ sinh Môi trường / Rác thải</option>
                    <option value="An ninh">An ninh trật tự / Tiếng ồn</option>
                    <option value="Xã hội">Chính sách / An sinh xã hội</option>
                    <option value="Khác">Lĩnh vực khác</option>
                  </select>
                </div>

                {/* Địa điểm xảy ra */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-350">Địa điểm xảy ra sự việc *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Số nhà, ngách hẻm hoặc tên đường..."
                      className="glass-input w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl"
                      {...register('location')}
                    />
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-450" />
                  </div>
                  {errors.location && (
                    <span className="text-[10px] text-rose-500 font-semibold pl-1">{errors.location.message}</span>
                  )}
                </div>
              </div>

              {/* Hình ảnh upload đính kèm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-350">Hình ảnh / Tài liệu minh chứng</label>
                <UploadBox label="Chọn tệp hoặc chụp ảnh trực tiếp (JPG, PNG, PDF tối đa 10MB)" />
              </div>

              {/* Thông tin liên hệ (Tùy chọn) */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-4 mt-2 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-500" /> Thông tin liên hệ xác minh (Tùy chọn)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400">Số điện thoại:</span>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại của bạn..."
                      className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                      {...register('senderPhone')}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400">Họ và tên:</span>
                    <input
                      type="text"
                      placeholder="Nhập họ tên của bạn..."
                      className="glass-input w-full px-3.5 py-2.5 text-xs rounded-xl"
                      {...register('senderName')}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none py-3 rounded-xl font-black text-xs uppercase tracking-widest mt-4 shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Gửi {activeTab.toLowerCase()}
              </Button>

            </form>
          </GlassCard>

        </div>

        {/* Right Sidebar instruction panel (1 col) - Fills the PC layout width */}
        <div className="flex flex-col gap-6">
          
          <GlassCard hoverable={false} className="p-5 text-left flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase text-yellow-500 dark:text-yellow-400 tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BookOpen className="h-4.5 w-4.5" /> Hướng dẫn gửi phản ánh
            </h3>
            
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              <p>
                <strong>Bước 1:</strong> Lựa chọn loại nội dung phù hợp (Kiến nghị, Góp ý hoặc Phản ánh trật tự đô thị).
              </p>
              <p>
                <strong>Bước 2:</strong> Nhập đầy đủ tiêu đề và nội dung chi tiết. Điền rõ địa chỉ vị trí xảy ra sự việc để cán bộ chuyên viên xuống kiểm tra thực địa.
              </p>
              <p>
                <strong>Bước 3:</strong> Đính kèm hình ảnh hiện trạng thực tế để tăng tốc độ xác minh và xử lý hồ sơ.
              </p>
              <p>
                <strong>Bước 4:</strong> Cung cấp số điện thoại (tùy chọn) để hệ thống gửi SMS tự động báo tiến độ xử lý hoặc chuyên viên liên hệ bổ sung thông tin.
              </p>
            </div>
          </GlassCard>

          <GlassCard hoverable={false} className="p-5 text-left flex flex-col gap-3.5 bg-gradient-to-br from-blue-50/10 to-indigo-50/5 border-blue-200/30">
            <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest flex items-center gap-2">
              <Clock className="h-4.5 w-4.5" /> Thời gian giải quyết
            </h3>
            
            <div className="flex flex-col gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-2">
                <span>Khẩn cấp (Hạ tầng, sạt lở)</span>
                <span className="font-bold text-rose-500">Dưới 12h</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-2">
                <span>Vệ sinh môi trường, rác thải</span>
                <span className="font-bold text-amber-500">Dưới 24h</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span>Kiến nghị, Trật tự đô thị khác</span>
                <span className="font-bold text-blue-500">2 - 3 Ngày làm việc</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard hoverable={false} className="p-5 text-left flex flex-col gap-3 bg-red-50/5 dark:bg-slate-950/20 border-red-500/10">
            <h4 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5" /> Cam kết bảo mật danh tính
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Ủy ban Mặt trận Tổ quốc Phường Chánh Hưng cam kết giữ bí mật tuyệt đối thông tin cá nhân của người phản ánh, hỗ trợ xác minh trung thực, khách quan và không làm ảnh hưởng đến đời sống cử dân.
            </p>
          </GlassCard>

        </div>

      </div>

      {/* Success Notification Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={handleCloseSuccessModal}
        title="Gửi phản ánh thành công!"
        size="sm"
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
            <p className="font-bold text-slate-800 dark:text-white">
              Hệ thống đã tiếp nhận {activeTab.toLowerCase()}
            </p>
            <p className="text-slate-500 leading-normal">
              Mã hồ sơ tra cứu của bà con là:
            </p>
            <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 py-1.5 px-3 rounded-lg text-sm border border-blue-200/30">
              {createdFeedbackCode}
            </span>
            <p className="text-[11px] text-slate-450 leading-relaxed mt-2">
              Ý kiến của bà con đã được luân chuyển trực tiếp đến Chuyên viên Quản lý Đô thị & An sinh để giải quyết.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button onClick={handleLookupNow} variant="gradient" className="w-full font-bold text-xs">
              Theo dõi tiến độ ngay
            </Button>
            <Button onClick={handleCloseSuccessModal} variant="secondary" className="w-full text-xs font-bold">
              Gửi tiếp ý kiến khác
            </Button>
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
}
