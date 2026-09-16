"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Drawer from '../ui/Drawer';
import Tooltip from '../ui/Tooltip';
import Skeleton from '../ui/Skeleton';
import StatCard from '../ui/StatCard';
import Stepper from '../ui/Stepper';
import Timeline from '../ui/Timeline';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Bot, Info, ShieldAlert, Check } from 'lucide-react';

export default function DesignSystemPage() {
  const { addNotification } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const colors = [
    { label: "Blue Primary (Chính)", value: "#3b82f6", class: "bg-blue-600" },
    { label: "Blue Dark (Navy)", value: "#07152c", class: "bg-[#07152c]" },
    { label: "Red Accent (Chính trị)", value: "#be123c", class: "bg-rose-700" },
    { label: "Gold Highlight (Ngôi sao)", value: "#ca8a04", class: "bg-yellow-600" },
    { label: "White Glass (Kính)", value: "rgba(255,255,255,0.58)", class: "bg-white/60 border border-slate-200" }
  ];

  const handleTriggerToast = () => {
    addNotification(
      'Mẫu thông báo Toast',
      'Đã kích hoạt thông báo mẫu từ trang Design System thành công.',
      'success'
    );
  };

  const timelineEvents = [
    { status: 'Mới tiếp nhận', time: '10:00', description: 'Ghi nhận phản ánh từ cư dân.', completed: true },
    { status: 'Đang xử lý', time: '11:15', description: 'Đang giao cán bộ đô thị khảo sát.', completed: true },
    { status: 'Đã phản hồi', time: '', description: 'Chờ cập nhật phản hồi kỹ thuật.', completed: false }
  ];

  return (
    <PageContainer>
      <SectionTitle
        title="Design System & Components"
        subtitle="Bản tổng hợp phong cách thiết kế Glassmorphism, mã màu thương hiệu và thư viện các component UI được thiết kế đồng bộ"
      />

      <div className="flex flex-col gap-8 text-left">
        {/* 1. Color Palette */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">1. Bảng màu thương hiệu (Color Palette)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {colors.map((color, idx) => (
              <GlassCard key={idx} className="p-4 flex flex-col gap-3">
                <div className={`h-16 rounded-xl w-full ${color.class}`} />
                <div className="flex flex-col text-left text-xs gap-0.5">
                  <span className="font-bold text-slate-800 dark:text-white leading-tight">{color.label}</span>
                  <span className="text-slate-400 font-mono mt-0.5">{color.value}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 2. Interactive Buttons */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">2. Các loại nút bấm (Buttons)</h3>
          <GlassCard className="p-6 bg-white/40 dark:bg-slate-900/30">
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Nút Primary</Button>
              <Button variant="secondary">Nút Secondary</Button>
              <Button variant="ghost">Nút Ghost</Button>
              <Button variant="danger">Nút Danger</Button>
              <Button variant="gradient">Nút Gradient Đỏ Vàng</Button>
              <Button variant="primary" loading>Đang tải...</Button>
              <Button variant="primary" disabled>Bị vô hiệu</Button>
            </div>
          </GlassCard>
        </section>

        {/* 3. Input fields */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">3. Trường dữ liệu nhập (Inputs & Dropdowns)</h3>
          <GlassCard className="p-6 bg-white/40 dark:bg-slate-900/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input label="Họ tên người dân" placeholder="Nhập chữ..." />
              <Select
                label="Lựa chọn khu phố"
                options={[
                  { value: 'kp1', label: 'Khu phố 1' },
                  { value: 'kp2', label: 'Khu phố 2' }
                ]}
              />
              <Textarea label="Nội dung kiến nghị" placeholder="Nhập mô tả chi tiết..." />
            </div>
          </GlassCard>
        </section>

        {/* 4. Badges */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">4. Nhãn trạng thái (Status Badges)</h3>
          <GlassCard className="p-6 bg-white/40 dark:bg-slate-900/30">
            <div className="flex flex-wrap gap-3">
              <Badge>Mới tiếp nhận</Badge>
              <Badge>Đang xử lý</Badge>
              <Badge>Chờ phản hồi</Badge>
              <Badge>Đã phản hồi</Badge>
              <Badge>Hoàn tất</Badge>
              <Badge>Quá hạn</Badge>
              <Badge variant="gradient">Nổi bật</Badge>
            </div>
          </GlassCard>
        </section>

        {/* 5. Indicators and Loaders */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">5. Tiến độ Stepper & Lịch trình Timeline</h3>
            <GlassCard className="p-5 flex flex-col gap-6 bg-white/40 dark:bg-slate-900/30">
              <Stepper steps={[{ number: 1, label: "Bước 1" }, { number: 2, label: "Bước 2" }]} currentStep={1} />
              <Timeline events={timelineEvents} />
            </GlassCard>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">6. Skeleton Loaders & Tooltips</h3>
            <GlassCard className="p-5 flex flex-col gap-5 bg-white/40 dark:bg-slate-900/30 justify-between">
              <div className="flex flex-col gap-3">
                <Skeleton variant="text" />
                <div className="flex gap-3">
                  <Skeleton variant="circular" className="h-10 w-10" />
                  <Skeleton variant="rectangular" className="h-10 flex-1" />
                </div>
              </div>

              <div className="flex gap-4 items-center mt-2 border-t border-slate-150 pt-4">
                <Tooltip content="Mẫu tooltip giải thích" position="top">
                  <span className="text-xs font-bold text-blue-600 hover:underline cursor-help">Di chuột vào tôi xem Tooltip</span>
                </Tooltip>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 6. Modals, Drawers & Toasts playground */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">7. Hộp thoại & Thông báo (Overlays & Alerts)</h3>
          <GlassCard className="p-6 bg-white/40 dark:bg-slate-900/30">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setModalOpen(true)} variant="secondary">
                Mở Modal mẫu
              </Button>
              <Button onClick={() => setDrawerOpen(true)} variant="secondary">
                Mở Drawer mẫu
              </Button>
              <Button onClick={handleTriggerToast} variant="primary">
                Kích hoạt Toast mẫu
              </Button>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Modal demo */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Hộp thoại Modal mẫu" size="sm">
        <div className="flex flex-col gap-3 text-left">
          <p className="text-xs sm:text-sm text-slate-655 leading-relaxed">
            Đây là giao diện Modal popup với hiệu ứng mượt mà và khả năng làm mờ lớp nền (backdrop-blur). Rất phù hợp cho các hướng dẫn thủ tục hoặc đọc bài viết.
          </p>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={() => setModalOpen(false)} size="sm">Đồng ý</Button>
          </div>
        </div>
      </Modal>

      {/* Drawer demo */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Thanh Drawer trượt mẫu" size="sm">
        <div className="flex flex-col gap-4 text-left">
          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/40 dark:border-blue-900/30 flex gap-2.5 items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">Thanh Drawer trượt từ cạnh phải màn hình thường dùng để xem biên bản, chi tiết phản ánh cử tri mà không mất ngữ cảnh bảng bên dưới.</span>
          </div>
          <Button onClick={() => setDrawerOpen(false)} variant="secondary" size="sm" className="w-full">
            Đóng thanh trượt
          </Button>
        </div>
      </Drawer>
    </PageContainer>
  );
}
