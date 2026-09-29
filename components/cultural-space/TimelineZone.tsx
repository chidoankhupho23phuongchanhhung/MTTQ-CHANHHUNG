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

// Historical events list of Uncle Ho and the Great National Unity Bloc / MTTQ
const timelineData: TimelineEvent[] = [
  {
    id: 'tl-1890',
    year: '1890',
    title: 'Quê hương Làng Sen',
    description: 'Sinh ngày 19/5/1890 tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An, hun đúc lòng yêu nước thương dân sâu sắc.',
    image: '/kim-lien-village.png',
    details: 'Thuở nhỏ Người mang tên Nguyễn Sinh Cung. Mảnh đất xứ Nghệ kiên trung và truyền thống gia đình đã sớm hình thành chí khí cứu nước cứu dân.',
    category: 'tuoi-tre'
  },
  {
    id: 'tl-1911',
    year: '1911',
    title: 'Hành trình tìm đường cứu nước',
    description: 'Người thanh niên Nguyễn Tất Thành rời bến cảng Nhà Rồng trên tàu Latouche-Tréville ra đi tìm đường giải phóng dân tộc.',
    image: '/p2.jpg',
    details: 'Ngày 5/6/1911, với tên gọi Anh Ba, Người mở đầu hành trình bôn ba khắp 4 biển 5 châu tìm ra chân lý cách mạng và ngọn cờ đoàn kết.',
    category: 'cuu-nuoc'
  },
  {
    id: 'tl-1920',
    year: '1920',
    title: 'Tìm thấy Ánh sáng Cách mạng',
    description: 'Bỏ phiếu gia nhập Quốc tế III và đồng sáng lập Đảng Cộng sản Pháp tại Đại hội Tours.',
    image: '/dai-hoi-tours.png',
    details: 'Mốc son chuyển biến từ chủ nghĩa yêu nước chân chính sang chủ nghĩa Mác - Lênin, gắn kết phong trào dân tộc với cách mạng vô sản thế giới.',
    category: 'cuu-nuoc'
  },
  {
    id: 'tl-1930',
    year: '1930',
    title: 'Hội Phản đế Đồng minh 18/11/1930',
    description: 'Thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam.',
    image: '/ho-chi-minh-1930.png',
    details: 'Chỉ thị lịch sử ngày 18/11/1930 đặt nền móng cho Mặt trận Tổ quốc Việt Nam, mốc son Ngày hội Đại đoàn kết toàn dân tộc thiêng liêng hàng năm.',
    category: 'cuu-nuoc'
  },
  {
    id: 'tl-1941',
    year: '1941',
    title: 'Thành lập Mặt trận Việt Minh (Pác Bó)',
    description: 'Sau 30 năm bôn ba, Bác trở về Pác Bó (Cao Bằng) trực tiếp lãnh đạo và thành lập Mặt trận Việt Minh.',
    image: '/pac-bo.png',
    details: 'Ngày 19/5/1941, Mặt trận Việt Minh ra đời, quy tụ toàn thể đồng bào yêu nước tạo nên sức mạnh dời non lấp biển.',
    category: 'doc-lap'
  },
  {
    id: 'tl-1945',
    year: '1945',
    title: 'Tuyên ngôn Độc lập 2/9/1945',
    description: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    image: '/p1.jpg',
    details: 'Đỉnh cao thắng lợi của Cách mạng Tháng Tám, minh chứng cho sức mạnh vô địch của khối Đại đoàn kết toàn dân tộc.',
    category: 'doc-lap'
  },
  {
    id: 'tl-1946',
    year: '1946',
    title: 'Lời kêu gọi Toàn quốc Kháng chiến',
    description: 'Bác hiệu triệu toàn dân không phân biệt già trẻ gái trai, tôn giáo đứng lên kháng chiến cứu quốc.',
    image: '/p4.jpg',
    details: 'Ngày 19/12/1946, Lời kêu gọi thiêng liêng trở thành ngọn cờ tập hợp mọi tầng lớp nhân dân kháng chiến trường kỳ thắng lợi.',
    category: 'doc-lap'
  },
  {
    id: 'tl-1951',
    year: '1951',
    title: 'Đại hội Thống nhất Việt Minh - Liên Việt',
    description: 'Hợp nhất hai mặt trận, Bác đúc kết chân lý: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công".',
    image: '/p6.png',
    details: 'Tháng 3/1951, Đại hội thành lập Mặt trận Liên Việt, củng cố khối sắt thép toàn dân đưa kháng chiến đến chiến thắng Điện Biên Phủ.',
    category: 'di-san'
  },
  {
    id: 'tl-1955',
    year: '1955',
    title: 'Thành lập Mặt trận Tổ quốc Việt Nam',
    description: 'Đại hội Mặt trận Dân tộc Thống nhất quyết định thành lập MTTQ Việt Nam, suy tôn Bác làm Chủ tịch Danh dự.',
    image: '/cab4.jpg',
    details: 'Ngày 10/9/1955, MTTQ Việt Nam đảm đương sứ mệnh củng cố miền Bắc và đấu tranh giải phóng miền Nam, thống nhất non sông.',
    category: 'di-san'
  },
  {
    id: 'tl-1960',
    year: '1960',
    title: 'Mặt trận DTGP Miền Nam Việt Nam',
    description: 'Mặt trận ra đời tại Tây Ninh, lãnh đạo đồng bào miền Nam anh dũng đánh giặc cứu nước.',
    image: '/cab3.jpg',
    details: 'Bác Hồ căn dặn: "Miền Nam là máu của máu Việt Nam, là thịt của thịt Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi".',
    category: 'di-san'
  },
  {
    id: 'tl-1969',
    year: '1969',
    title: 'Di chúc thiêng liêng về Đại đoàn kết',
    description: 'Bác Hồ để lại Bản Di chúc căn dặn gìn giữ sự đoàn kết như giữ gìn con ngươi của mắt mình.',
    image: '/p5.jpg',
    details: 'Di chúc là bảo vật quốc gia kết tinh trọn vẹn tư tưởng đại đoàn kết toàn dân tộc và đoàn kết quốc tế, soi đường cho MTTQ Việt Nam mãi mãi.',
    category: 'di-san'
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

