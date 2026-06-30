"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Select from '../ui/Select';
import { Calendar, User, MapPin, Tag, Image as ImageIcon, Flame, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  type: 'meeting' | 'voter' | 'festival' | 'policy' | 'welfare';
  typeLabel: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Hội nghị sơ kết công tác Mặt trận 6 tháng đầu năm 2026',
    type: 'meeting',
    typeLabel: 'Hội nghị',
    date: '2026-06-25',
    time: '08:00 - 11:30',
    location: 'Hội trường Lầu 2 UBND Phường Chánh Hưng',
    organizer: 'Thường trực Ủy ban MTTQ Phường',
    description: 'Đánh giá kết quả thực hiện các cuộc vận động, phong trào thi đua yêu nước 6 tháng đầu năm, đề ra phương hướng nhiệm vụ trọng tâm 6 tháng cuối năm 2026. Tuyên dương khen thưởng các tập thể cá nhân xuất sắc.'
  },
  {
    id: 'act-2',
    title: 'Tiếp xúc cử tri chuyên đề về Công tác chỉnh trang đô thị tại KP3',
    type: 'voter',
    typeLabel: 'Tiếp xúc cử tri',
    date: '2026-06-22',
    time: '14:00 - 17:00',
    location: 'Văn phòng Ban Điều hành KP3',
    organizer: 'MTTQ phối hợp Thường trực HĐND Phường',
    description: 'Lắng nghe ý kiến đóng góp trực tiếp của cư dân khu phố 3 về các công trình hẻm tự quản, hệ thống thoát nước hẻm và lắp đặt đèn chiếu sáng ngõ phố.'
  },
  {
    id: 'act-3',
    title: 'Ngày hội Đại đoàn kết toàn dân tộc điểm sáng tại khu dân cư KP4',
    type: 'festival',
    typeLabel: 'Ngày hội Đại đoàn kết',
    date: '2026-06-18',
    time: '18:00 - 21:00',
    location: 'Văn phòng Ban Điều hành KP4',
    organizer: 'Ban Công tác Mặt trận Khu phố 4',
    description: 'Tổng kết cuộc vận động xây dựng đời sống văn hóa, tổ chức các trò chơi dân gian, liên hoan văn nghệ quần chúng và trao quà khuyến học cho học sinh.'
  },
  {
    id: 'act-4',
    title: 'Tuyên truyền Luật Thực hiện Dân chủ ở cơ sở cho cán bộ, nhân dân',
    type: 'policy',
    typeLabel: 'Tuyên truyền chính sách',
    date: '2026-06-12',
    time: '08:30 - 11:00',
    location: 'Hội trường UBND Phường Chánh Hưng',
    organizer: 'Ban Thường trực MTTQ Phường',
    description: 'Tập huấn các quy định mới về quyền dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng tại khu phố, đẩy mạnh thực hiện quy chế dân chủ.'
  },
  {
    id: 'act-5',
    title: 'Chăm lo an sinh xã hội: Tặng thẻ BHYT tự nguyện cho hộ khó khăn',
    type: 'welfare',
    typeLabel: 'Chăm lo an sinh',
    date: '2026-06-05',
    time: '09:00 - 10:30',
    location: 'Văn phòng Ủy ban MTTQ Phường',
    organizer: 'Ban Vận động Quỹ Vì người nghèo Phường',
    description: 'Trao tặng 30 thẻ Bảo hiểm y tế tự nguyện thời hạn 1 năm cho người lao động nghèo, lao động tự do không ổn định trên địa bàn phường, giảm gánh nặng viện phí.'
  }
];

const mockGallery = [
  { url: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?q=80&w=600&auto=format&fit=crop', caption: 'Ngày hội Đại đoàn kết Khu phố 4' },
  { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop', caption: 'Hội nghị tiếp xúc cử tri Tổ đại biểu HĐND' },
  { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop', caption: 'Trao quà an sinh xã hội định kỳ' },
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop', caption: 'Tập huấn công nghệ số cán bộ ban ngành' }
];

export default function ActivitiesPage() {
  const [filterType, setFilterType] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');

  const filteredActivities = mockActivities.filter((act) => {
    const matchesType = filterType === 'all' || act.type === filterType;
    const matchesMonth = filterMonth === 'all' || act.date.split('-')[1] === filterMonth;
    return matchesType && matchesMonth;
  });

  return (
    <PageContainer>
      <SectionTitle
        title="Hoạt động Mặt trận Tổ quốc"
        subtitle="Lịch sử và tiến trình tổ chức các phong trào, hội nghị, chăm lo cộng đồng của Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng"
      />

      {/* Filter panel */}
      <GlassCard hoverable={false} className="p-4 mb-8 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Loại hoạt động"
            options={[
              { value: 'all', label: 'Tất cả hoạt động' },
              { value: 'meeting', label: 'Hội nghị - Giao ban' },
              { value: 'voter', label: 'Tiếp xúc cử tri' },
              { value: 'festival', label: 'Ngày hội Đại đoàn kết' },
              { value: 'policy', label: 'Tuyên truyền chính sách' },
              { value: 'welfare', label: 'Chăm lo an sinh xã hội' }
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
          <Select
            label="Lọc theo tháng"
            options={[
              { value: 'all', label: 'Tất cả các tháng' },
              { value: '06', label: 'Tháng 6' },
              { value: '05', label: 'Tháng 5' }
            ]}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <div className="flex flex-col justify-end">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-1 pl-1">Tổng kết kết quả</span>
            <div className="py-2.5 px-4 bg-blue-600/5 border border-blue-200/40 dark:border-blue-900/30 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 text-center">
              Tìm thấy {filteredActivities.length} sự kiện hoạt động
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Dynamic Activity Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Tiến trình hoạt động thực tế</h3>
          
          <div className="relative border-l-2 border-slate-200/50 dark:border-slate-800/50 pl-5 ml-4 flex flex-col gap-8">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative">
                {/* Timeline node icon */}
                <div className="absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-blue-600 bg-white dark:bg-slate-900 shadow-md" />
                
                <GlassCard className="bg-white/50 dark:bg-slate-900/40 p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      {act.typeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {act.date}
                    </span>
                  </div>
                  
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-tight">
                    {act.title}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {act.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 border-t border-slate-100 dark:border-slate-900 pt-3 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {act.time}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="h-3.5 w-3.5" />
                      {act.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {act.organizer}
                    </span>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Photo Gallery and Featured */}
        <div className="flex flex-col gap-6 text-left">
          {/* Photo Gallery Carousel */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-4.5 w-4.5 text-slate-400" />
              Thư viện ảnh hoạt động
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
              {mockGallery.map((img, idx) => (
                <div key={idx} className="flex-shrink-0 w-64 snap-start rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 relative group bg-slate-150">
                  <img src={img.url} alt={img.caption} className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-3.5">
                    <span className="text-xs font-bold text-white line-clamp-1 leading-none">{img.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Highlights */}
          <div>
            <h3 className="text-xs font-black text-slate-500 pl-1 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-4.5 w-4.5 text-rose-500" />
              Điểm sáng phong trào trong tháng
            </h3>
            <GlassCard className="bg-red-600/5 border-red-200/40 dark:bg-red-950/10 dark:border-red-900/30 flex flex-col gap-3">
              <span className="bg-red-600 text-white font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded w-fit">
                Khen thưởng thi đua
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                Ủy ban MTTQ Phường Chánh Hưng đạt thành tích xuất sắc trong Chiến dịch "Mặt trận số vì dân".
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Được Ủy ban MTTQ Việt Nam Quận tặng bằng khen xuất sắc dẫn đầu khối thi đua về công tác ứng dụng chuyển đổi số trong xử lý ý kiến phản ánh cử tri nhanh chóng và tỷ lệ hài lòng đạt trên 96%.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
