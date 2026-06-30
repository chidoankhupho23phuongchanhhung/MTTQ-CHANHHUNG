"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import DonutChart from '../charts/DonutChart';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import HeatMapMock from '../charts/HeatMapMock';
import { useAppStore } from '@/store/useAppStore';
import { mockStaffTasks } from '@/lib/mockData';
import { 
  ShieldCheck, FilePlus, Hourglass, CheckCircle2, ClipboardList,
  Sparkles, FileText, AlertTriangle, ArrowRight, UserCheck, Bot,
  Award, CornerDownRight, Check, Eye, Briefcase
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { StaffWorkItem, FeedbackItem } from '@/lib/types';

export default function StaffDashboardPage() {
  const { feedbacks, updateFeedbackStatus, addNotification } = useAppStore();
  const [selectedFbId, setSelectedFbId] = useState<string | null>(null);
  
  // AI assist states
  const [aiSummaryModal, setAiSummaryModal] = useState(false);
  const [aiSuggestionModal, setAiSuggestionModal] = useState(false);
  const [suggestionApplied, setSuggestionApplied] = useState(false);

  // Local task list state to allow interactive toggle
  const [tasks, setTasks] = useState<StaffWorkItem[]>(mockStaffTasks);

  // 6-step pipeline definition from mockup slide
  const pipelineSteps = [
    { id: 'p1', label: 'Tiếp nhận', count: 128, icon: FilePlus },
    { id: 'p2', label: 'Phân loại', count: 156, icon: ClipboardList },
    { id: 'p3', label: 'Luân chuyển', count: 92, icon: CornerDownRight },
    { id: 'p4', label: 'Xử lý', count: 286, icon: Briefcase },
    { id: 'p5', label: 'Phản hồi', count: 198, icon: CheckCircle2 },
    { id: 'p6', label: 'Theo dõi', count: 388, icon: Eye }
  ];

  // Pending feedbacks (not completed yet)
  const pendingFeedbacks = feedbacks.filter(f => f.status !== 'Hoàn tất' && f.status !== 'Đã phản hồi').slice(0, 4);
  const selectedFb = feedbacks.find(f => f.id === selectedFbId) || feedbacks[0];

  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const statusCycle: ('Mới' | 'Đang xử lý' | 'Chờ duyệt' | 'Hoàn thành')[] = ['Mới', 'Đang xử lý', 'Chờ duyệt', 'Hoàn thành'];
      const nextIdx = (statusCycle.indexOf(t.status) + 1) % statusCycle.length;
      return { ...t, status: statusCycle[nextIdx] };
    }));
  };

  const handleApplyAISuggestion = () => {
    if (!selectedFb) return;
    
    // Simulate applying feedback status to 'Đã phản hồi'
    updateFeedbackStatus(
      selectedFb.id,
      'Đã phản hồi',
      'Ủy ban MTTQ phường đã tiếp nhận ý kiến, giao đội quản lý khảo sát và khắc phục hoàn tất.',
      'Nguyễn Văn An (Chuyên viên Quản lý Đô thị)'
    );
    
    setAiSuggestionModal(false);
    setSuggestionApplied(true);
    setTimeout(() => setSuggestionApplied(false), 3000);
  };

  // Compute live stats for dashboard cards
  const newReportsCount = feedbacks.filter(f => f.status === 'Mới tiếp nhận').length;
  const processingReportsCount = feedbacks.filter(f => f.status === 'Đang xử lý').length;
  const completedReportsCount = feedbacks.filter(f => f.status === 'Hoàn tất' || f.status === 'Đã phản hồi').length;

  const staffDonutData = [
    { name: 'Mới tiếp nhận', value: newReportsCount || 1, color: '#3b82f6' },
    { name: 'Đang xử lý', value: processingReportsCount || 1, color: '#f59e0b' },
    { name: 'Đã hoàn tất', value: completedReportsCount || 1, color: '#10b981' }
  ];

  const lineChartData = [
    { name: 'T2', submissions: 24, resolved: 18 },
    { name: 'T3', submissions: 35, resolved: 28 },
    { name: 'T4', submissions: 42, resolved: 36 },
    { name: 'T5', submissions: 58, resolved: 52 },
    { name: 'T6', submissions: 68, resolved: 60 }
  ];

  const barChartData = [
    { name: 'Đô thị', value: feedbacks.filter(f => f.field === 'Đô thị').length || 8 },
    { name: 'Môi trường', value: feedbacks.filter(f => f.field === 'Môi trường').length || 6 },
    { name: 'An ninh', value: feedbacks.filter(f => f.field === 'An ninh').length || 4 },
    { name: 'Xã hội', value: feedbacks.filter(f => f.field === 'Xã hội').length || 3 },
    { name: 'Lĩnh vực khác', value: feedbacks.filter(f => f.field === 'Khác').length || 1 }
  ];

  return (
    <PageContainer>
      <SectionTitle
        title="Cổng làm việc cán bộ - Chuyên viên"
        subtitle="Hệ thống tổng hợp chỉ đạo, tiếp nhận ý kiến phản ánh, quản lý công việc và báo cáo an sinh xã hội nội bộ"
      >
        <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 py-1.5 px-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Phiên đăng nhập cán bộ</span>
        </div>
      </SectionTitle>

      {/* 1. Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tổng kiến nghị" value="1.248" change="+18%" trend="up" description="so với tháng trước" icon={<ClipboardList className="h-4.5 w-4.5 text-blue-500" />} />
        <StatCard title="Đang xử lý" value="286" change="+12%" trend="up" description="Đã phân công bộ phận" icon={<Hourglass className="h-4.5 w-4.5 text-amber-500" />} />
        <StatCard title="Đã xử lý" value="892" change="+20%" trend="up" description="Đã giải quyết phản hồi" icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />} />
        <StatCard title="Đúng hạn / Hài lòng" value="96.5%" change="4.8/5 ★" trend="up" description="Đánh giá của bà con" icon={<Award className="h-4.5 w-4.5 text-rose-500" />} />
      </div>

      {/* 2. Quy trình xử lý kiến nghị 6 bước */}
      <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 mb-6">
        <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
          Sơ đồ quy trình xử lý kiến nghị thông minh (6 Bước)
        </h3>
        <div className="flex flex-row items-center justify-start xl:justify-between gap-3 py-2 overflow-x-auto no-scrollbar w-full min-w-0">
          {pipelineSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 min-w-[100px] flex-shrink-0 xl:flex-1">
                  <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 rounded-xl relative shadow-xs">
                    <StepIcon className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                      {step.count}
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{`0${idx+1} ${step.label}`}</span>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="text-slate-350 dark:text-slate-700 font-extrabold text-sm select-none flex-shrink-0">➔</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 text-left">
        {/* Left Side: Pending feedbacks table & Kanban (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Table of pending reports */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Ý kiến cử dân chờ tiếp nhận & xử lý
            </h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
              <Table headers={["Mã số", "Tiêu đề", "Khu vực", "Độ ưu tiên", "Thao tác"]}>
                {pendingFeedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    onClick={() => setSelectedFbId(fb.id)}
                    className={`hover:bg-slate-100/30 dark:hover:bg-slate-800/20 cursor-pointer transition-colors border-b border-slate-200/30 dark:border-slate-800/30 ${
                      selectedFb?.id === fb.id ? "bg-blue-600/5 dark:bg-blue-950/15" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-xs text-slate-850 dark:text-white tracking-wider">
                      {fb.feedbackCode}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350 max-w-[200px] truncate">
                      {fb.title}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {fb.wardGroup}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <Badge variant={fb.priority === 'Khẩn cấp' || fb.priority === 'Cao' ? 'danger' : 'neutral'}>
                        {fb.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFbId(fb.id);
                          setAiSuggestionModal(true);
                        }}
                        size="sm"
                        variant="secondary"
                        className="py-1.5 px-3 text-xs bg-blue-600/5 border-blue-200/50 text-blue-600 dark:text-blue-400 dark:bg-blue-950/10 font-bold"
                      >
                        Xử lý
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          </div>

          {/* Kanban mini layout */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Bảng quản lý công việc Ban chỉ đạo (Click để cập nhật nhanh)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {['Mới', 'Đang xử lý', 'Chờ duyệt', 'Hoàn thành'].map((colName) => {
                const colTasks = tasks.filter(t => t.status === colName);
                
                return (
                  <GlassCard key={colName} hoverable={false} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2 min-h-[160px]">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{colName}</span>
                      <span className="text-[10px] font-bold bg-slate-200/50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 rounded-md">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 flex-grow">
                      {colTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleToggleTaskStatus(t.id)}
                          className="p-2.5 rounded-xl border border-slate-200/40 bg-white/80 dark:border-slate-800/40 dark:bg-slate-900/60 shadow-xs hover:border-blue-500/50 transition-all cursor-pointer text-left flex flex-col gap-1.5"
                          title="Click để chuyển trạng thái"
                        >
                          <span className="text-[11px] font-bold text-slate-850 dark:text-white leading-snug line-clamp-2">{t.title}</span>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold mt-1">
                            <span>{t.assignee.split(' ')[2]}</span>
                            <span className={t.priority === 'Cao' || t.priority === 'Hỏa tốc' ? 'text-rose-500' : 'text-slate-400'}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant for Officers & Stats */}
        <div className="flex flex-col gap-6 text-left">
          {/* AI Helper tool box */}
          <GlassCard className="p-5 bg-gradient-to-br from-blue-600/5 via-blue-600/[0.02] to-amber-600/[0.02] border-blue-200/50 dark:border-blue-900/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-200/40 pb-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                <Bot className="h-5 w-5 animate-pulse-glow" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Trợ lý AI cho Cán bộ</h4>
                <span className="text-[9px] text-slate-400 font-medium">Trực quan phân tích & xử lý phản ánh</span>
              </div>
            </div>

            {selectedFb ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-1.5 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đang lựa chọn phản ánh:</span>
                  <span className="font-bold text-slate-800 dark:text-white truncate">{selectedFb.feedbackCode} - {selectedFb.title}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setAiSummaryModal(true)}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-bold justify-start gap-2 bg-white/40"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Tóm tắt phản ánh hỏa tốc
                  </Button>
                  <Button
                    onClick={() => setAiSuggestionModal(true)}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-bold justify-start gap-2 bg-white/40"
                  >
                    <Bot className="h-4 w-4 text-blue-500" />
                    Gợi ý biên bản phản hồi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-450">
                Hãy lựa chọn một phản ánh bên danh sách để sử dụng các tính năng Trợ lý AI xử lý văn bản.
              </div>
            )}
          </GlassCard>

          {/* Right sidebar no longer has the small donut chart to avoid clutter */}
        </div>
      </div>

      {/* 4. Analytics & Charts Section (Google Material 3 design spec with scroll animation reveals) */}
      <div className="mt-8 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 animate-fade-in-up">
        <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 mb-6 uppercase tracking-wider pl-1">
          Báo cáo số liệu & Phân tích chuyên sâu
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Trends line chart (2 cols) */}
          <div className="lg:col-span-2">
            <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
              <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest pl-1">Xu hướng tiếp nhận & giải quyết kiến nghị</h4>
              <LineChart data={lineChartData} />
            </GlassCard>
          </div>
          
          {/* Status Donut (1 col) */}
          <div>
            <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
              <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest pl-1">Phân bố trạng thái đơn thư</h4>
              <DonutChart data={staffDonutData} />
            </GlassCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 text-left">
          {/* Category Bar Chart */}
          <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest pl-1">Thống kê số lượng theo lĩnh vực</h4>
            <BarChart data={barChartData} />
          </GlassCard>

          {/* Neighborhood Heatmap grid */}
          <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest pl-1">Mật độ kiến nghị tại các khu phố</h4>
            <HeatMapMock />
          </GlassCard>
        </div>
      </div>

      {/* AI Summary Modal */}
      <Modal
        isOpen={aiSummaryModal}
        onClose={() => setAiSummaryModal(false)}
        title={`AI Tóm tắt phản ánh: ${selectedFb?.feedbackCode}`}
        size="sm"
      >
        {selectedFb && (
          <div className="flex flex-col gap-4 text-left text-xs sm:text-sm">
            <p className="font-bold text-slate-800 dark:text-white">Ý chính phản ánh:</p>
            <div className="p-4 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-950/20 leading-relaxed leading-normal">
              - **Đối tượng**: Người dân {selectedFb.senderName} ({selectedFb.senderPhone}).<br />
              - **Địa bàn**: {selectedFb.wardGroup} (Vị trí: {selectedFb.location}).<br />
              - **Sự việc**: {selectedFb.title}.<br />
              - **Nguyện vọng**: Đề xuất kiểm tra thực địa, khắc phục sự cố hỏng hóc hạ tầng kỹ thuật hoặc rác thải bừa bãi.<br />
              - **Độ ưu tiên**: Mức độ {selectedFb.priority} (Cần kiểm tra xác minh ngay).
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-150 dark:border-slate-800">
              <Button onClick={() => setAiSummaryModal(false)} size="sm">Đồng ý</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Suggestion Modal */}
      <Modal
        isOpen={aiSuggestionModal}
        onClose={() => setAiSuggestionModal(false)}
        title={`AI Gợi ý phản hồi biên bản: ${selectedFb?.feedbackCode}`}
        size="sm"
      >
        {selectedFb && (
          <div className="flex flex-col gap-4 text-left text-xs sm:text-sm">
            <p className="font-bold text-slate-800 dark:text-white">Nội dung đề xuất phản hồi số hóa:</p>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/10 dark:border-blue-900/40 dark:bg-slate-950/20 leading-relaxed font-medium">
              "Kính chào bà con cử dân {selectedFb.senderName}. Ủy ban Mặt trận Tổ quốc phối hợp với Ủy ban Nhân dân Phường Chánh Hưng đã tiếp nhận phản ánh về sự việc: \"{selectedFb.title}\". Chúng tôi đã cử cán bộ kỹ thuật của tổ Quản lý đô thị xuống khảo sát thực địa hiện trường và phối hợp khắc phục trong vòng 2 ngày tới. Cảm ơn ý kiến đóng góp kịp thời của bà con để xây dựng phường nhà."
            </div>
            
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-150 dark:border-slate-800">
              <Button onClick={handleApplyAISuggestion} variant="gradient" size="sm" className="flex-1 font-bold text-xs gap-1.5">
                <Check className="h-4 w-4" /> Áp dụng phản hồi này
              </Button>
              <Button onClick={() => setAiSuggestionModal(false)} variant="secondary" size="sm" className="text-xs font-bold">
                Bỏ qua
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
