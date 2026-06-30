"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Tooltip from '../ui/Tooltip';
import { 
  Compass, Eye, Play, BookOpen, Clock, Heart, Award, 
  MapPin, Milestone, ChevronRight, HelpCircle, RefreshCw
} from 'lucide-react';

interface ExhibitRoom {
  id: string;
  name: string;
  desc: string;
  image: string;
  hotspots: { x: number; y: number; title: string; content: string }[];
}

const exhibitRooms: ExhibitRoom[] = [
  {
    id: 'room-1',
    name: 'Phòng thờ & Tượng đài Bác Hồ',
    desc: 'Không gian tôn nghiêm trưng bày Tượng đài Chủ tịch Hồ Chí Minh và biểu tượng ngôi sao vàng lấp lánh.',
    image: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      { x: 50, y: 40, title: 'Tượng đài Chủ tịch Hồ Chí Minh', content: 'Tượng đúc đồng nguyên khối khắc họa chân dung Bác Hồ ngồi làm việc uy nghiêm.' },
      { x: 75, y: 30, title: 'Họa tiết Trống đồng Đông Sơn', content: 'Lớp nền họa tiết trống đồng tượng trưng cho bản sắc văn hóa và dòng chảy lịch sử Việt Nam.' },
      { x: 20, y: 60, title: 'Bàn thờ tổ quốc', content: 'Nơi nhân dân và cán bộ dâng hương tưởng niệm Bác Hồ cùng các anh hùng liệt sĩ.' }
    ]
  },
  {
    id: 'room-2',
    name: 'Di tích Nhà sàn Bác Hồ',
    desc: 'Tái hiện không gian nhà sàn gỗ giản dị nơi Bác sinh sống và làm việc tại Phủ Chủ tịch.',
    image: 'https://images.unsplash.com/photo-1596497173244-b5f7e71f547c?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      { x: 45, y: 50, title: 'Bộ bàn ghế mây của Bác', content: 'Nơi Bác từng ngồi đọc sách, soạn thảo văn bản chỉ đạo cách mạng.' },
      { x: 60, y: 25, title: 'Cửa sổ hướng vườn cây', content: 'Không gian mở hướng ra vườn xoài và ao cá Bác nuôi.' }
    ]
  },
  {
    id: 'room-3',
    name: 'Phòng trưng bày hiện vật lịch sử',
    desc: 'Lưu trữ các hiện vật số hóa 3D như đôi dép cao su, bộ quần áo kaki bạc màu, chiếc vali mây.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      { x: 30, y: 45, title: 'Chiếc Vali Mây lịch sử', content: 'Đồng hành cùng Bác trong những năm tháng hoạt động cách mạng ở nước ngoài.' },
      { x: 70, y: 55, title: 'Đôi dép cao su', content: 'Biểu tượng của sự giản dị, đôi dép làm từ lốp máy bay đã cùng Bác đi khắp chiến dịch.' }
    ]
  }
];

const timelineMilestones = [
  { year: '1890', title: 'Ngày sinh Bác Hồ', detail: 'Ngày 19/5/1890, Nguyễn Sinh Cung (Bác Hồ) sinh ra tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An.', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
  { year: '1911', title: 'Ra đi tìm đường cứu nước', detail: 'Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành rời bến cảng Nhà Rồng trên con tàu Amiral Latouche-Tréville ra đi tìm chân lý cứu quốc.', icon: Compass, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
  { year: '1945', title: 'Tuyên ngôn độc lập', detail: 'Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.', icon: Award, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20' },
  { year: '1969', title: 'Di chúc lịch sử', detail: 'Ngày 2/9/1969, Bác Hồ đi xa, để lại bản Di chúc thiêng liêng - tài sản tinh thần vô giá hướng dẫn thế hệ sau giữ vững độc lập tự chủ.', icon: Clock, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }
];

export default function HCMCulturalSpacePage() {
  const [activeRoomId, setActiveRoomId] = useState('room-1');
  const [activeSpot, setActiveSpot] = useState<{ title: string; content: string } | null>(null);
  const [activeYearIdx, setActiveYearIdx] = useState(2); // Default to 1945
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const activeRoom = exhibitRooms.find(r => r.id === activeRoomId) || exhibitRooms[0];
  const activeMilestone = timelineMilestones[activeYearIdx];

  const handleRotate = () => {
    setIsRotating(true);
    const interval = setInterval(() => {
      setRotationAngle(prev => {
        if (prev >= 360) {
          clearInterval(interval);
          setIsRotating(false);
          return 0;
        }
        return prev + 15;
      });
    }, 50);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Không gian văn hóa Hồ Chí Minh số"
        subtitle="Trải nghiệm tham quan thực tế ảo 360°, nghiên cứu tư liệu lịch sử số hóa và nâng cao tinh thần học tập theo gương Bác"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left mb-8">
        {/* 1. VR 360 Viewer (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-blue-500 animate-spin-slow" />
              Mô phỏng thực tế ảo VR 360° trưng bày
            </h3>
            <div className="flex gap-2">
              {exhibitRooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoomId(r.id);
                    setActiveSpot(null);
                  }}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                    activeRoomId === r.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white/40 border-slate-200 text-slate-500 dark:bg-slate-900/30 dark:border-slate-800'
                  }`}
                >
                  {r.name.split(' ')[0] + ' ' + (r.name.split(' ')[1] || '')}
                </button>
              ))}
            </div>
          </div>

          {/* Panoramic Screen */}
          <GlassCard hoverable={false} className="p-0 overflow-hidden relative border-blue-200/50 dark:border-slate-800 h-[380px] bg-slate-950">
            {/* Visual rotation layer */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform"
              style={{ 
                transform: `rotateY(${rotationAngle}deg)`, 
                transition: isRotating ? 'none' : 'transform 0.5s ease-out',
                backgroundImage: `url(${activeRoom.image})`
              }}
            />

            {/* Dark overlay & grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
            <div className="absolute inset-0 technical-grid opacity-10 pointer-events-none" />

            {/* Hotspots */}
            {!isRotating && activeRoom.hotspots.map((spot, idx) => (
              <div
                key={idx}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                <Tooltip content={spot.title} position="top">
                  <button
                    onClick={() => setActiveSpot({ title: spot.title, content: spot.content })}
                    className="h-7 w-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse-glow"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
              </div>
            ))}

            {/* VR Control Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-white z-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-350">Đang tham quan:</span>
                <span className="text-xs font-black">{activeRoom.name}</span>
              </div>
              <Button
                onClick={handleRotate}
                loading={isRotating}
                variant="ghost"
                size="sm"
                className="py-1 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[10px] font-bold rounded-lg gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} />
                Xoay 360° góc nhìn
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* 2. Side Panel: Interactive Historical Timeline (1 col) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider flex items-center gap-1.5">
            <Milestone className="h-4.5 w-4.5 text-slate-400" />
            Dòng thời gian lịch sử Hồ Chí Minh
          </h3>

          <GlassCard hoverable={false} className="p-5 bg-white/40 dark:bg-slate-900/30 flex flex-col gap-4">
            {/* Year buttons slider */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100/50 dark:bg-slate-950/20 p-1.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
              {timelineMilestones.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => setActiveYearIdx(idx)}
                  className={`py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeYearIdx === idx
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>

            {/* Selected Milestone Detail Card */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-blue-200/40 bg-blue-50/10 dark:border-blue-900/30 dark:bg-slate-950/20 animate-fade-in-up">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl ${activeMilestone.color}`}>
                  <activeMilestone.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Mốc lịch sử:</span>
                  <span className="text-xs sm:text-sm font-black text-slate-850 dark:text-white leading-tight">
                    {activeMilestone.title}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                {activeMilestone.detail}
              </p>
            </div>

            <div className="text-[10px] text-slate-400 leading-normal pl-1 flex items-start gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-350 flex-shrink-0" />
              <span>Bà con có thể nhấn vào các mốc năm ở trên để thay đổi sự kiện tư liệu lịch sử Hồ Chí Minh hiển thị bên dưới.</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 3. Thư viện tư liệu số hóa */}
      <div className="text-left flex flex-col gap-4 mb-6">
        <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Thư viện số hóa học tập theo gương Bác</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassCard className="p-4 bg-white/40 dark:bg-slate-900/30 flex items-start gap-4 hover:border-blue-500/40">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-grow min-w-0 flex flex-col gap-1 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Ấn phẩm sách số:</span>
              <h4 className="font-bold text-slate-800 dark:text-white truncate">Di chúc của Chủ tịch Hồ Chí Minh</h4>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Đọc trực tuyến bản thảo có bút tích</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-white/40 dark:bg-slate-900/30 flex items-start gap-4 hover:border-blue-500/40">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
              <Play className="h-6 w-6" />
            </div>
            <div className="flex-grow min-w-0 flex flex-col gap-1 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Thư viện video:</span>
              <h4 className="font-bold text-slate-800 dark:text-white truncate">Phóng sự "Hồ Chí Minh - Chân dung một con người"</h4>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Tư liệu lịch sử quý giá của Hãng phim tài liệu</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-white/40 dark:bg-slate-900/30 flex items-start gap-4 hover:border-blue-500/40">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div className="flex-grow min-w-0 flex flex-col gap-1 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Gương điển hình:</span>
              <h4 className="font-bold text-slate-800 dark:text-white truncate">Học tập và làm theo gương Bác</h4>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Tuyên dương gương điển hình dân vận khéo phường</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Hotspot details Modal */}
      <Modal
        isOpen={!!activeSpot}
        onClose={() => setActiveSpot(null)}
        title={activeSpot ? `Thông tin hiện vật: ${activeSpot.title}` : ''}
        size="sm"
      >
        {activeSpot && (
          <div className="flex flex-col gap-3 text-left">
            <p className="text-xs sm:text-sm text-slate-655 leading-relaxed leading-normal">
              {activeSpot.content}
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
              <Button onClick={() => setActiveSpot(null)} size="sm">Đồng ý</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
