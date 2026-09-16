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
import BarChart from '../charts/BarChart';
import { useAppStore } from '@/store/useAppStore';
import { HeartHandshake, UserPlus, FileText, CheckCircle, BarChart3, HelpCircle } from 'lucide-react';

interface WelfareProgram {
  id: string;
  title: string;
  desc: string;
  status: 'Đang nhận hồ sơ' | 'Đang xét duyệt' | 'Đã hoàn thành';
  beneficiary: string;
  quota: string;
}

const mockPrograms: WelfareProgram[] = [
  {
    id: 'pr-1',
    title: 'Học bổng Nguyễn Hữu Thọ niên học 2026 - 2027',
    desc: 'Chăm lo cho các em học sinh thuộc hộ nghèo, cận nghèo, hộ có hoàn cảnh đặc biệt khó khăn trên địa bàn phường Chánh Hưng.',
    status: 'Đang nhận hồ sơ',
    beneficiary: 'Học sinh cấp 1, 2, 3 và sinh viên khó khăn',
    quota: '50 suất học bổng'
  },
  {
    id: 'pr-2',
    title: 'Chăm lo quà tặng người cao tuổi neo đơn, bệnh tật',
    desc: 'MTTQ trích quỹ mua tặng sữa dinh dưỡng, thuốc men bổ trợ cho các cụ già yếu không có người phụ dưỡng tại khu phố 1 và 4.',
    status: 'Đang xét duyệt',
    beneficiary: 'Cụ già từ 80 tuổi trở lên neo đơn',
    quota: '30 cụ được bảo trợ'
  },
  {
    id: 'pr-3',
    title: 'Hỗ trợ xe lăn y tế phục hồi chức năng tự lập',
    desc: 'Trao tặng phương tiện đi lại cho người khuyết tật, liệt chi nhằm hỗ trợ cuộc sống mưu sinh và sinh hoạt tự lập trong gia đình.',
    status: 'Đã hoàn thành',
    beneficiary: 'Người khuyết tật chi dưới chưa có xe lăn',
    quota: '05 chiếc xe lăn đúc'
  }
];

export default function SocialSupportPage() {
  const { addNotification } = useAppStore();
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wardGroup, setWardGroup] = useState('Khu phố 1');
  const [address, setAddress] = useState('');
  const [program, setProgram] = useState('pr-1');
  const [detail, setDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Support volume chart mock data (Recharts)
  const chartData = [
    { name: 'Quý I', value: 84 },
    { name: 'Quý II', value: 120 },
    { name: 'Quý III', value: 95 },
    { name: 'Quý IV', value: 160 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !detail) return;

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Send global notification
      addNotification(
        'Đăng ký an sinh xã hội mới',
        `Cư dân ${name} vừa nộp hồ sơ xin hỗ trợ chương trình an sinh trực tuyến.`,
        'success'
      );
      
      // Reset form
      setName('');
      setPhone('');
      setAddress('');
      setDetail('');
    }, 1500);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="An sinh xã hội"
        subtitle="Thông tin các chương trình cứu trợ, bảo trợ và tiếp nhận hồ sơ chăm lo an sinh xã hội trực tuyến tại phường Chánh Hưng"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
        {/* Left column: Welfare Programs list & Statistics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active programs cards */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider">
              Chương trình an sinh đang triển khai
            </h3>
            <div className="flex flex-col gap-4">
              {mockPrograms.map((pr) => (
                <GlassCard key={pr.id} className="p-5 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-tight">
                      {pr.title}
                    </h4>
                    <Badge>{pr.status}</Badge>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3">
                    {pr.desc}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      Đối tượng: <span className="font-bold text-slate-800 dark:text-white truncate">{pr.beneficiary}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      Chỉ tiêu dự kiến: <span className="font-bold text-slate-800 dark:text-white">{pr.quota}</span>
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Bar Chart section */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-slate-400" />
              Lượt chăm lo hỗ trợ trong năm (Quý)
            </h3>
            <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-4">
              <BarChart data={chartData} color="#10b981" />
            </GlassCard>
          </div>
        </div>

        {/* Right column: Application Registration Form */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">
            Form đề xuất hỗ trợ an sinh
          </h3>
          
          <GlassCard className="p-5 bg-white/60 dark:bg-slate-900/50 border border-blue-200/50 dark:border-blue-900/30 flex flex-col gap-4">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full animate-bounce">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Gửi hồ sơ thành công!</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">Hồ sơ đề xuất an sinh xã hội của bà con đã được gửi tới MTTQ Phường Chánh Hưng để xét duyệt.</p>
                <Button onClick={() => setSubmitted(false)} size="sm" className="mt-2 text-xs font-bold">
                  Nộp hồ sơ khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Họ và tên người cần hỗ trợ *"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                
                <Input
                  label="Số điện thoại liên lạc *"
                  placeholder="Nhập số điện thoại"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Khu phố"
                    options={[
                      { value: 'Khu phố 1', label: 'Khu phố 1' },
                      { value: 'Khu phố 2', label: 'Khu phố 2' },
                      { value: 'Khu phố 3', label: 'Khu phố 3' },
                      { value: 'Khu phố 4', label: 'Khu phố 4' },
                      { value: 'Khu phố 5', label: 'Khu phố 5' }
                    ]}
                    value={wardGroup}
                    onChange={(e) => setWardGroup(e.target.value)}
                  />
                  
                  <Select
                    label="Chương trình đăng ký"
                    options={mockPrograms.map(p => ({ value: p.id, label: p.title }))}
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                  />
                </div>

                <Input
                  label="Địa chỉ cụ thể *"
                  placeholder="Nhập số nhà, tên đường"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <Textarea
                  label="Mô tả cụ thể hoàn cảnh khó khăn *"
                  placeholder="Bà con vui lòng nhập chi tiết hoàn cảnh hiện tại và nhu cầu hỗ trợ cụ thể..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  required
                />

                <div className="flex items-start gap-2.5 mt-2">
                  <input type="checkbox" required id="welfare-agree" className="mt-1 cursor-pointer" />
                  <label htmlFor="welfare-agree" className="text-[10px] text-slate-400 leading-normal select-none cursor-pointer">
                    Tôi cam kết cung cấp thông tin hoàn cảnh đúng sự thật và tự chịu trách nhiệm pháp lý.
                  </label>
                </div>

                <Button type="submit" loading={isSubmitting} className="w-full mt-2 font-bold text-xs">
                  Gửi hồ sơ đề xuất
                </Button>
              </form>
            )}
          </GlassCard>

          {/* Guidelines notes */}
          <GlassCard className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 flex gap-3 text-left">
            <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Thông tin lưu ý</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Hồ sơ an sinh trực tuyến được xác minh thực địa bởi Ban Công tác Mặt trận khu phố trong vòng 5 ngày làm việc kể từ lúc nhận đơn trực tuyến. Kết quả duyệt sẽ phản hồi về số điện thoại đăng ký.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
