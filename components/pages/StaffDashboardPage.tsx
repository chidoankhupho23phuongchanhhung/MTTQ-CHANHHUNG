"use client";

import React, { useState, useEffect } from 'react';
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
import GoogleSheetSchedule from '../ui/GoogleSheetSchedule';
import { useAppStore } from '@/store/useAppStore';
import { mockStaffTasks } from '@/lib/mockData';
import {
  ShieldCheck, FilePlus, Hourglass, CheckCircle2, ClipboardList,
  Sparkles, FileText, AlertTriangle, ArrowRight, UserCheck, Bot,
  Award, CornerDownRight, Check, Eye, Briefcase,
  Database, Inbox, BarChart3, Settings, Search, Bell,
  Upload, Download, RefreshCw, Globe, Lock, Save
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { StaffWorkItem, FeedbackItem } from '@/lib/types';

/* ── Tab-section sub-page renderers ── */
function TabQuanLySo() {
  return (
    <PageContainer>
      <SectionTitle title="Quản lý số" subtitle="Quản lý dữ liệu số hoá, kết nối Fanpage, đồng bộ thông tin" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Bài đăng Fanpage" value="184" change="+12%" trend="up" description="tháng này" icon={<Globe className="h-4 w-4 text-blue-500" />} />
        <StatCard title="Lượt tương tác" value="12.4K" change="+28%" trend="up" description="lượt like & share" icon={<Bell className="h-4 w-4 text-purple-500" />} />
        <StatCard title="Dữ liệu đồng bộ" value="98.2%" change="+0.4%" trend="up" description="tỉ lệ đồng bộ" icon={<RefreshCw className="h-4 w-4 text-emerald-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Kết nối Fanpage Facebook</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">Trạng thái: <span className="text-emerald-600 font-bold">Đang chờ cấu hình</span>. Truy cập <a href="/quan-ly-facebook" className="text-blue-600 underline font-bold">Quản lý Facebook</a> để thiết lập.</p>
          <Button onClick={() => window.location.href='/quan-ly-facebook'} size="sm" className="w-fit">Cấu hình ngay</Button>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Xuất / Nhập dữ liệu</h3>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="flex items-center gap-2 w-full justify-center"><Download className="h-3.5 w-3.5" /> Xuất báo cáo Excel</Button>
            <Button size="sm" variant="secondary" className="flex items-center gap-2 w-full justify-center"><Upload className="h-3.5 w-3.5" /> Nhập danh sách CSV</Button>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}

function TabGiaiQuyet({ 
  feedbacks, 
  updateFeedbackStatus, 
  addNotification, 
  tasks, 
  handleToggleTaskStatus 
}: { 
  feedbacks: FeedbackItem[]; 
  updateFeedbackStatus: (...args: any[]) => void; 
  addNotification: (...args: any[]) => void;
  tasks: StaffWorkItem[];
  handleToggleTaskStatus: (id: string) => void;
}) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const pending = feedbacks.filter(f => f.status !== 'Hoàn tất' && f.status !== 'Đã phản hồi');
  const selected = feedbacks.find(f => f.id === selectedId) || pending[0];

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <SectionTitle title="Giải quyết – Tiếp nhận" subtitle="Tiếp nhận, phân loại và xử lý kiến nghị của người dân cùng công việc nội bộ" />
        
        {/* Toggle Mode */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              viewMode === 'list'
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
            )}
          >
            Ý kiến người dân
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              viewMode === 'kanban'
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
            )}
          >
            Bảng công việc cán bộ
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Feedbacks List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Danh sách ý kiến chờ xử lý</h3>
            <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {pending.map(fb => (
                <GlassCard 
                  key={fb.id} 
                  onClick={() => setSelectedId(fb.id)} 
                  className={`p-4 cursor-pointer flex items-center gap-3 text-left transition-all ${
                    selected?.id === fb.id ? 'ring-2 ring-blue-500/40 bg-blue-50/5 dark:bg-blue-950/5' : ''
                  }`}
                >
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{fb.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">{fb.senderName} • {fb.datetime} • {fb.wardGroup}</span>
                  </div>
                  <Badge variant={fb.status === 'Mới tiếp nhận' ? 'info' : 'warning'}>{fb.status}</Badge>
                </GlassCard>
              ))}
              {pending.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-450 italic">Không có ý kiến mới nào cần xử lý.</div>
              )}
            </div>
          </div>

          {/* Details & Action Panel */}
          {selected && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Thông tin xử lý chi tiết</h3>
              <GlassCard hoverable={false} className="p-5 flex flex-col gap-4 text-left border-blue-200/50 dark:border-slate-800">
                <div>
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{selected.feedbackCode}</span>
                  <h3 className="text-xs font-black text-slate-800 dark:text-white mt-1 leading-snug">{selected.title}</h3>
                </div>

                <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-150 dark:border-slate-850 text-[11px] leading-relaxed text-slate-655 dark:text-slate-350">
                  <span className="font-bold text-slate-500 block mb-1">Nội dung phản ánh:</span>
                  {selected.content}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <div><strong>Người gửi:</strong> {selected.senderName}</div>
                  <div><strong>Khu vực:</strong> {selected.wardGroup}</div>
                  <div className="col-span-2"><strong>Địa điểm:</strong> {selected.location}</div>
                </div>

                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <Button 
                    size="sm" 
                    onClick={() => { 
                      updateFeedbackStatus(selected.id, 'Đang xử lý', 'Đã tiếp nhận và chuyển giao cán bộ đô thị khảo sát.', 'Nguyễn Văn An'); 
                      addNotification('Cập nhật', `Đã chuyển "${selected.title}" sang Đang xử lý`, 'success'); 
                    }}
                  >
                    Chuyển Đang xử lý
                  </Button>
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => { 
                      updateFeedbackStatus(selected.id, 'Hoàn tất', 'Đã hoàn tất khắc phục sự cố và phản hồi bà con.', 'Nguyễn Văn An'); 
                      addNotification('Hoàn tất', `Đã giải quyết "${selected.title}"`, 'success'); 
                    }}
                  >
                    Đánh dấu Hoàn tất
                  </Button>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider text-left">
            Bảng điều phối công việc nội bộ (Bấm vào thẻ để chuyển trạng thái tiếp theo)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {['Mới', 'Đang xử lý', 'Chờ duyệt', 'Hoàn thành'].map((colName) => {
              const colTasks = tasks.filter(t => t.status === colName);
              
              return (
                <GlassCard key={colName} hoverable={false} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2.5 min-h-[300px]">
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
                        className="p-2.5 rounded-xl border border-slate-200/40 bg-white dark:border-slate-800/40 dark:bg-slate-900 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer text-left flex flex-col gap-1.5"
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
                    {colTasks.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-[10px] text-slate-400 italic py-6">Trống</div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function TabVanThu() {
  const docs = [
    { id: 1, title: 'Nghị quyết HĐND phường Q8 2026', date: '28/06/2026', type: 'Nghị quyết', status: 'Đã ban hành' },
    { id: 2, title: 'Kế hoạch phòng chống tệ nạn xã hội 2026', date: '20/06/2026', type: 'Kế hoạch', status: 'Dự thảo' },
    { id: 3, title: 'Quyết định thành lập Ban kiểm tra MTTQ', date: '15/06/2026', type: 'Quyết định', status: 'Đã ban hành' },
    { id: 4, title: 'Báo cáo hoạt động tháng 6/2026', date: '01/07/2026', type: 'Báo cáo', status: 'Đang soạn' },
    { id: 5, title: 'Tờ trình xin ý kiến cấp trên về dự án sân thể thao', date: '10/06/2026', type: 'Tờ trình', status: 'Chờ duyệt' },
  ];
  return (
    <PageContainer>
      <SectionTitle title="Văn thư" subtitle="Quản lý hệ thống văn bản đến, văn bản đi và biểu mẫu hành chính" />
      <div className="flex flex-col gap-3">
        {docs.map(doc => (
          <GlassCard key={doc.id} className="flex items-center gap-4 p-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{doc.title}</h4>
              <span className="text-[10px] text-slate-400">{doc.type} • {doc.date}</span>
            </div>
            <Badge variant={doc.status === 'Đã ban hành' ? 'success' : doc.status === 'Chờ duyệt' ? 'warning' : 'info'}>{doc.status}</Badge>
            <Button size="sm" variant="ghost">Xem</Button>
          </GlassCard>
        ))}
      </div>
    </PageContainer>
  );
}

function TabBaoCao({ feedbacks, staffDonutData, barChartData, lineChartData }: { feedbacks: FeedbackItem[]; staffDonutData: any[]; barChartData: any[]; lineChartData: any[] }) {
  const newReportsCount = feedbacks.filter(f => f.status === 'Mới tiếp nhận').length;
  const processingReportsCount = feedbacks.filter(f => f.status === 'Đang xử lý').length;
  const completedReportsCount = feedbacks.filter(f => f.status === 'Hoàn tất' || f.status === 'Đã phản hồi').length;

  return (
    <PageContainer>
      <SectionTitle title="Báo cáo tiến độ" subtitle="Thống kê hiệu suất xử lý kiến nghị, phản ánh và bản đồ mật độ địa bàn" />
      
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tỉ lệ xử lý đúng hạn" value="97.2%" change="+1.2%" trend="up" description="hoàn thành đúng hạn" icon={<BarChart3 className="h-4 w-4 text-emerald-500"/>} />
        <StatCard title="Thời gian TB" value="1.8 ngày" change="-0.4 ngày" trend="up" description="xử lý mỗi phản ánh" icon={<Hourglass className="h-4 w-4 text-amber-500"/>} />
        <StatCard title="Mới tiếp nhận" value={newReportsCount.toString()} trend="up" change="" description="Chờ phân công cán bộ" icon={<FilePlus className="h-4 w-4 text-blue-500"/>} />
        <StatCard title="Đã giải quyết" value={completedReportsCount.toString()} trend="up" change="" description="Số vụ đã hoàn tất" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
            <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest pl-1">Trạng thái xử lý đơn thư</h4>
            <DonutChart data={staffDonutData} />
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
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
    </PageContainer>
  );
}

function TabTuyChinh() {
  return (
    <PageContainer>
      <SectionTitle title="Tuỳ chỉnh" subtitle="Cấu hình hệ thống, phân quyền cán bộ và cài đặt thông báo" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-2"><Lock className="h-4 w-4 text-blue-500"/>Bảo mật & Tài khoản</h3>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Tên cán bộ</span><span className="font-bold text-slate-800 dark:text-white">Nguyễn Văn An</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Chức vụ</span><span className="font-bold text-slate-800 dark:text-white">Chuyên viên MTTQ</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Phân quyền</span><Badge variant="success">Cán bộ chuyên viên</Badge>
            </div>
          </div>
          <Button size="sm" className="flex items-center gap-2 w-fit"><Save className="h-3.5 w-3.5"/> Đổi mật khẩu</Button>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500"/>Thông báo</h3>
          {[['Nhận thông báo phản ánh mới', true],['Email báo cáo tuần', true],['Thông báo SMS khẩn cấp', false],['Thông báo qua Zalo', true]].map(([label, on]) => (
            <div key={label as string} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">{label as string}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${on ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{on ? 'BẬT' : 'TẮT'}</span>
            </div>
          ))}
          <Button size="sm" variant="secondary" className="w-fit">Lưu cài đặt</Button>
        </GlassCard>
        <GlassCard className="p-5 md:col-span-2 flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-2"><Globe className="h-4 w-4 text-indigo-500"/>Tích hợp ngoài</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[{name:'Facebook Fanpage',status:'Chưa kết nối',route:'/quan-ly-facebook'},{name:'Zalo Official Account',status:'Chưa kết nối',route:'#'},{name:'Cổng DVCQG',status:'Đang phát triển',route:'#'}].map(item=>(
              <div key={item.name} className="flex flex-col gap-2 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                <span className="text-xs font-bold text-slate-700 dark:text-white">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.status}</span>
                <Button size="sm" variant="ghost" onClick={()=>window.location.href=item.route}>Cấu hình</Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}

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

  // Read active tab from URL on client-side only
  const [activeTab, setActiveTab] = useState('tong-quan');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTab(params.get('tab') || 'tong-quan');
    const onPop = () => {
      const p = new URLSearchParams(window.location.search);
      setActiveTab(p.get('tab') || 'tong-quan');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Route to sub-tab components
  if (activeTab === 'quan-ly-so') return <TabQuanLySo />;
  if (activeTab === 'giai-quyet') return (
    <TabGiaiQuyet 
      feedbacks={feedbacks} 
      updateFeedbackStatus={updateFeedbackStatus} 
      addNotification={addNotification} 
      tasks={tasks}
      handleToggleTaskStatus={handleToggleTaskStatus}
    />
  );
  if (activeTab === 'van-thu') return <TabVanThu />;
  if (activeTab === 'bao-cao') return (
    <TabBaoCao 
      feedbacks={feedbacks} 
      staffDonutData={staffDonutData} 
      barChartData={barChartData} 
      lineChartData={lineChartData} 
    />
  );
  if (activeTab === 'tuy-chinh') return <TabTuyChinh />;

  // Default: Tổng quan tab (2-column neat layout)
  const urgentFeedbacks = feedbacks
    .filter(f => f.status === 'Mới tiếp nhận' || f.priority === 'Khẩn cấp' || f.priority === 'Cao')
    .slice(0, 3);

  return (
    <PageContainer>
      <SectionTitle
        title="Tổng quan điều hành"
        subtitle="Hệ thống tổng hợp chỉ đạo, tiếp nhận ý kiến phản ánh, quản lý công việc và báo cáo an sinh xã hội nội bộ"
      >
        <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 py-1.5 px-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Nguyễn Văn An — Chuyên viên MTTQ</span>
        </div>
      </SectionTitle>

      {/* 1. Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tổng kiến nghị" value="1.248" change="+18%" trend="up" description="so với tháng trước" icon={<ClipboardList className="h-4.5 w-4.5 text-blue-500" />} />
        <StatCard title="Đang xử lý" value="286" change="+12%" trend="up" description="Đã phân công bộ phận" icon={<Hourglass className="h-4.5 w-4.5 text-amber-500" />} />
        <StatCard title="Đã xử lý" value="892" change="+20%" trend="up" description="Đã giải quyết phản hồi" icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />} />
        <StatCard title="Đúng hạn / Hài lòng" value="96.5%" change="4.8/5 ★" trend="up" description="Đánh giá của bà con" icon={<Award className="h-4.5 w-4.5 text-rose-500" />} />
      </div>

      {/* 2-Column Scientific Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left items-start">
        
        {/* Column Left (2/3 Width) - Weekly Schedule & Urgent Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Lịch công tác tuần */}
          <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <GoogleSheetSchedule />
          </GlassCard>

          {/* Urgent Feedbacks Table */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Kiến nghị khẩn cấp & Phản ánh mới cần duyệt
            </h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
              <Table headers={["Mã số", "Tiêu đề", "Khu vực", "Độ ưu tiên", "Thao tác"]}>
                {urgentFeedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    onClick={() => setSelectedFbId(fb.id)}
                    className={`hover:bg-slate-100/30 dark:hover:bg-slate-800/20 cursor-pointer transition-colors border-b border-slate-200/30 dark:border-slate-800/30 ${
                      selectedFb?.id === fb.id ? "bg-blue-600/5 dark:bg-blue-950/15" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5 font-bold text-xs text-slate-850 dark:text-white tracking-wider">
                      {fb.feedbackCode}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-350 max-w-[240px] truncate">
                      {fb.title}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {fb.wardGroup}
                    </td>
                    <td className="px-6 py-3.5 text-xs">
                      <Badge variant={fb.priority === 'Khẩn cấp' || fb.priority === 'Cao' ? 'danger' : 'info'}>
                        {fb.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFbId(fb.id);
                          setAiSuggestionModal(true);
                        }}
                        size="sm"
                        variant="secondary"
                        className="py-1 px-2.5 text-[10px] bg-blue-600/5 border-blue-200/50 text-blue-600 dark:text-blue-400 dark:bg-blue-950/10 font-bold"
                      >
                        Xử lý nhanh
                      </Button>
                    </td>
                  </tr>
                ))}
                {urgentFeedbacks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-xs text-slate-400 italic">Không có phản ánh khẩn cấp nào cần xử lý hôm nay.</td>
                  </tr>
                )}
              </Table>
            </div>
          </div>
        </div>

        {/* Column Right (1/3 Width) - Pipeline Stepper & Mini-Stats & AI */}
        <div className="flex flex-col gap-6">
          {/* Vertical Stepper: Quy trình xử lý */}
          <GlassCard hoverable={false} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-wider pl-1">
              Tiến độ Quy trình Tiếp nhận
            </h3>
            
            <div className="flex flex-col gap-4">
              {pipelineSteps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-start gap-3 relative">
                    {/* Stepper Line connector */}
                    {idx < pipelineSteps.length - 1 && (
                      <div className="absolute left-4.5 top-9 bottom-[-16px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}

                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 rounded-xl relative shadow-xs flex-shrink-0 z-10">
                      <StepIcon className="h-4.5 w-4.5" />
                      <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 text-left pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-wider">{step.label}</span>
                        <Badge variant="neutral" className="text-[9px] font-bold py-0.5 px-1.5">
                          {step.count} hồ sơ
                        </Badge>
                      </div>
                      <p className="text-[9.5px] text-slate-400 mt-0.5">
                        {idx === 0 && "Kiểm tra thông tin biểu mẫu người dân gửi"}
                        {idx === 1 && "Phân loại theo ban ngành phụ trách đô thị / môi trường"}
                        {idx === 2 && "Chuyển giao cán bộ kỹ thuật kiểm tra hiện địa bàn"}
                        {idx === 3 && "Tiến hành sửa chữa, khắc phục trực tiếp"}
                        {idx === 4 && "Đăng tải biên bản phản hồi trực tiếp lên Cổng số"}
                        {idx === 5 && "Đánh giá sao đo lường độ hài lòng của nhân dân"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* AI Helper tool box */}
          <GlassCard className="p-5 bg-gradient-to-br from-blue-600/5 via-blue-600/[0.02] to-amber-600/[0.02] border-blue-200/50 dark:border-blue-900/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-200/40 pb-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md flex-shrink-0">
                <Bot className="h-4.5 w-4.5 animate-pulse-glow" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Trợ lý AI nhanh</h4>
                <span className="text-[9px] text-slate-400 font-medium">Xử lý ngay văn bản phản hồi</span>
              </div>
            </div>

            {selectedFb ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-1 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đang lựa chọn:</span>
                  <span className="font-bold text-slate-800 dark:text-white truncate">{selectedFb.feedbackCode} - {selectedFb.title}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setAiSummaryModal(true)}
                    variant="secondary"
                    size="sm"
                    className="w-full text-[10px] font-bold justify-start gap-1.5 bg-white/40"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Tóm tắt phản ánh hỏa tốc
                  </Button>
                  <Button
                    onClick={() => setAiSuggestionModal(true)}
                    variant="secondary"
                    size="sm"
                    className="w-full text-[10px] font-bold justify-start gap-1.5 bg-white/40"
                  >
                    <Bot className="h-3.5 w-3.5 text-blue-500" />
                    Gợi ý biên bản phản hồi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-[10px] text-slate-400 italic">
                Lựa chọn phản ánh khẩn bên trái để sử dụng Trợ lý AI.
              </div>
            )}
          </GlassCard>

          {/* Quick Donut Chart (Overview status) */}
          <GlassCard hoverable={false} className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <h4 className="text-[10px] font-black text-slate-500 mb-3.5 uppercase tracking-widest pl-1">Phân bố trạng thái xử lý</h4>
            <div className="h-36">
              <DonutChart data={staffDonutData} />
            </div>
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
            <div className="p-4 rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-950/20 leading-relaxed">
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
