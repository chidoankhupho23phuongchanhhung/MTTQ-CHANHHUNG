"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineNode } from '@/types/cultural-space';
import { Clock, HelpCircle, Eye, Compass } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  details?: string;
  category: 'tuoi-tre' | 'cuu-nuoc' | 'doc-lap' | 'di-san';
}

// Exact historical events list as requested
const timelineData: TimelineEvent[] = [
  {
    id: 'tl-1911',
    year: '1911',
    title: 'Hành trình tìm đường cứu nước',
    description: 'Người thanh niên Nguyễn Tất Thành rời bến cảng Nhà Rồng trên con tàu Đô đốc Latouche-Tréville, bắt đầu cuộc hành trình vĩ đại tìm lối đi cho độc lập dân tộc.',
    image: '/p2.jpg',
    details: 'Ngày 5/6/1911, với tên gọi Anh Ba, người thanh niên yêu nước quyết chí bôn ba muôn nơi để tìm lấy tự do chân chính và giải phóng đồng bào lầm than.',
    category: 'cuu-nuoc'
  },
  {
    id: 'tl-1941',
    year: '1941',
    title: 'Trở về Tổ Quốc (Pác Bó)',
    description: 'Sau 30 năm bôn ba hải ngoại, Lãnh tụ Nguyễn Ái Quốc trở về nước trực tiếp lãnh đạo phong trào cách mạng tại hang Pác Bó, Cao Bằng.',
    image: '/pac-bo.png',
    details: 'Người sống và làm việc cực nhọc trong hang đá hiểm trở, tự tay đặt tên cho Suối Lê-nin hiền hòa và Núi Các-Mác sừng sững kỳ vĩ.',
    category: 'doc-lap'
  },
  {
    id: 'tl-1945',
    year: '1945',
    title: 'Tuyên ngôn Độc lập',
    description: 'Tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
    image: '/p1.jpg',
    details: 'Bản tuyên ngôn hùng hồn kết tinh khát vọng ngàn năm độc lập vững bền, là mốc son chói lọi trong lịch sử thế kỷ của dân tộc Việt Nam.',
    category: 'doc-lap'
  }
];

interface TimelineZoneProps {
  onNodeSelect?: (node: TimelineNode) => void;
  selectedNodeId?: string | null;
}

export default function TimelineZone({ onNodeSelect, selectedNodeId }: TimelineZoneProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Header Row */}
      <div className="mb-6 px-1 shrink-0">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-[1px] w-6 bg-amber-500/50" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">BIÊN NIÊN SỬ DI SẢN</span>
        </div>
        <h3 className="text-base md:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
          THEO DẤU CHÂN BÁC
        </h3>
        <p className="text-[11px] text-slate-400 font-sans mt-1">
          Dấu ấn các mốc lịch sử cốt lõi trong sự nghiệp của Người. Kéo lướt ngang để xem các sự kiện và hình ảnh trưng bày.
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative flex-1 w-full pb-2 min-h-0">
        {/* Lớp gradient mờ ở 2 bên để báo hiệu có thể cuộn */}
        <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-slate-950/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-slate-950/80 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-x-auto gap-5 pb-6 h-full snap-x snap-mandatory custom-scrollbar items-center px-4">
          {timelineData.map((event) => {
            const isHovered = hoveredId === event.id;
            const isSelected = selectedNodeId === event.id;
            const isActive = isHovered || isSelected;

            return (
              <div
                key={event.id}
                className="relative snap-center shrink-0 w-[260px] sm:w-[300px] h-full max-h-[380px] cursor-pointer group"
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (onNodeSelect) {
                    onNodeSelect({
                      id: event.id,
                      year: event.year,
                      title: event.title,
                      description: event.description,
                      photoUrl: event.image,
                      details: event.details || event.description,
                      category: event.category
                    });
                  }
                }}
              >
                {/* Card Container */}
                <div className={`w-full h-full rounded-2xl flex flex-col overflow-hidden backdrop-blur-md border transition-all duration-500 transform ${isActive ? 'bg-amber-900/40 border-amber-500/80 scale-[1.03] shadow-[0_15px_40px_rgba(245,158,11,0.3)] -translate-y-2' : 'bg-slate-900/60 border-white/10 hover:bg-slate-800/80 hover:border-amber-500/40 hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)]'}`}>
                  
                  {/* Image Display Area (luôn hiển thị) */}
                  <div className="h-[45%] w-full relative overflow-hidden bg-slate-950 shrink-0 border-b border-white/10">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-110 grayscale-0 opacity-100' : 'grayscale opacity-70 group-hover:grayscale-[30%] group-hover:opacity-95 group-hover:scale-105'}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3">
                       <span className={`text-xs font-black tracking-widest font-mono px-2 py-1 rounded-md shadow-lg border transition-colors ${isActive ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-slate-900/80 text-amber-500 border-amber-500/30'}`}>
                        NĂM {event.year}
                       </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`text-sm md:text-base font-bold text-white transition-colors duration-300 ${isActive ? 'text-amber-400' : ''}`}>
                      {event.title}
                    </h3>
                    <div className="h-[1px] w-8 bg-amber-500/30 my-3" />
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans text-justify line-clamp-4">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <span className="text-[9px] uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-500" />
                        BẢO TỒN SỐ
                      </span>
                      <span className={`text-[10px] font-mono transition-opacity duration-300 flex items-center gap-1 ${isActive ? 'text-amber-400 opacity-100' : 'text-slate-500 opacity-0'}`}>
                        <Eye className="w-3 h-3" /> CHI TIẾT
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

