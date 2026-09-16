"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import Select from '../ui/Select';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import DonutChart from '../charts/DonutChart';
import HeatMapMock from '../charts/HeatMapMock';
import { BarChart3, TrendingUp, CheckCircle2, Clock, ShieldAlert, Award } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function AnalyticsPage() {
  const { feedbacks } = useAppStore();
  const [timeRange, setTimeRange] = useState('30');

  // live stats from store feedbacks
  const total = feedbacks.length;
  const completed = feedbacks.filter(f => f.status === 'Hoàn tất' || f.status === 'Đã phản hồi').length;
  const resolutionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '100';

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

  const donutChartData = [
    { name: 'Mới tiếp nhận', value: feedbacks.filter(f => f.status === 'Mới tiếp nhận').length || 1, color: '#3b82f6' },
    { name: 'Đang xử lý', value: feedbacks.filter(f => f.status === 'Đang xử lý').length || 1, color: '#f59e0b' },
    { name: 'Đã hoàn tất', value: completed || 1, color: '#10b981' }
  ];

  return (
    <PageContainer>
      <SectionTitle
        title="Báo cáo thống kê - Phân tích"
        subtitle="Báo cáo số liệu phản ánh trật tự đô thị, kết quả giải quyết kiến nghị của cư dân và đo lường chỉ số hài lòng tại Phường Chánh Hưng"
      >
        <Select
          options={[
            { value: '7', label: '7 ngày qua' },
            { value: '30', label: '30 ngày qua' },
            { value: '90', label: 'Quý này' },
            { value: '365', label: 'Năm nay' }
          ]}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-40 py-1.5"
        />
      </SectionTitle>

      {/* 1. KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tổng số phản ánh" value={total} change="+18%" trend="up" description="so với kỳ trước" icon={<BarChart3 className="h-4.5 w-4.5 text-blue-500" />} />
        <StatCard title="Tỷ lệ giải quyết" value={`${resolutionRate}%`} change="+2.4%" trend="up" description="Tốc độ tăng trưởng" icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />} />
        <StatCard title="Thời gian xử lý TB" value="1.8 ngày" change="-0.5 ngày" trend="up" description="Rút ngắn thời gian" icon={<Clock className="h-4.5 w-4.5 text-blue-500" />} />
        <StatCard title="Chỉ số hài lòng" value="96.5%" change="+0.8%" trend="up" description="Người dân đánh giá" icon={<Award className="h-4.5 w-4.5 text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 text-left">
        {/* Left Side: Trends and Categories (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Line Chart: Submissions & Resolved */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Biểu đồ xu hướng tiếp nhận & xử lý phản ánh theo tháng
            </h3>
            <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-4">
              <LineChart data={lineChartData} />
            </GlassCard>
          </div>

          {/* Bar Chart: Sectors */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Thống kê số lượng phản ánh theo lĩnh vực
            </h3>
            <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-4">
              <BarChart data={barChartData} />
            </GlassCard>
          </div>
        </div>

        {/* Right Side: Status Distribution & Heatmap */}
        <div className="flex flex-col gap-6 text-left">
          {/* Status Donut */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Tỷ lệ trạng thái giải quyết hồ sơ
            </h3>
            <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-4">
              <DonutChart data={donutChartData} />
            </GlassCard>
          </div>

          {/* Neighborhood Heatmap grid */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Mật độ phản ánh tại các khu phố
            </h3>
            <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-5">
              <HeatMapMock />
            </GlassCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
