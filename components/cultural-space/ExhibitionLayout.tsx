"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Clock, 
  Library, 
  MessageSquare, 
  Send, 
  Heart, 
  Award, 
  Sparkles, 
  Info, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  X,
  User,
  Quote
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import TimelineZone from './TimelineZone';
import ArchiveGrid from './ArchiveGrid';
import VirtualMuseumGame from './VirtualMuseumGame';
import { TimelineNode, ArchiveItem } from '@/types/cultural-space';

export default function ExhibitionLayout() {
  // Navigation tabs or active views (specifically for responsive mobile screens, but also highlights areas on desktop)
  const [activeTab, setActiveTab] = useState<'hanh-trinh' | 'tuong-tac'>('tuong-tac');
  
  // Custom interactive viewport states
  const [centerViewMode, setCenterViewMode] = useState<'3d' | 'books' | 'timeline' | 'plaquet'>('3d');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Interactive detail states
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  const [selectedArchiveItem, setSelectedArchiveItem] = useState<ArchiveItem | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionAuthor, setReflectionAuthor] = useState('');
  const [reflections, setReflections] = useState([
    { id: 1, text: 'Vô cùng cảm động trước hành trình tìm đường cứu nước đầy gian khổ và ý chí sắt đá của Người.', author: 'Hoàng Minh', date: '21/05/2026' },
    { id: 2, text: 'Di sản Hồ Chí Minh mãi là kim chỉ nam cho thanh niên Việt Nam học tập, rèn luyện.', author: 'Khánh An', date: '20/05/2026' },
    { id: 3, text: 'Một không gian triển lãm số rất trực quan, giàu tính giáo dục truyền thống cách mạng.', author: 'Thầy Thanh', date: '19/05/2026' }
  ]);
  
  // AI Virtual Curator chat states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'curator', text: string }>>([
    { sender: 'curator', text: 'Xin chào quý khách! Tôi là Hướng dẫn viên ảo Không gian Văn hóa Hồ Chí Minh - Ủy ban MTTQ Việt Nam Phường Chánh Hưng. Quý khách có câu hỏi nào về cuộc đời, sự nghiệp của Bác Hồ và lịch sử Mặt trận Dân tộc Thống nhất, khối Đại đoàn kết toàn dân tộc không?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Dynamic bronze lighting tracking
  const plaqueRef = useRef<HTMLDivElement>(null);
  const [plaqueLight, setPlaqueLight] = useState({ x: 50, y: 50 });

  const handleMouseMovePlaque = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!plaqueRef.current) return;
    const rect = plaqueRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlaqueLight({ x, y });
  };

  const handleMouseLeavePlaque = () => {
    setPlaqueLight({ x: 50, y: 50 });
  };

  const handleSwitchToBooks = React.useCallback(() => {
    setCenterViewMode('books');
  }, []);

  const handleOpenChat = React.useCallback(() => {
    setIsChatOpen(true);
  }, []);

  // Chat request using server-side Gemini endpoint or high-quality smart curated responses
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Call the server API
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'curator', text: data.reply }]);
      } else {
        // Fallback intelligent responses based on keyword queries in context
        setTimeout(() => {
          let response = 'Cảm ơn quý khách đã quan tâm. Chủ tịch Hồ Chí Minh là hiện thân của tinh thần Đại đoàn kết toàn dân tộc. Quý khách có thể khám phá thêm tại các khu vực Không gian trưng bày 3D, Tủ sách & Di vật và Biên niên sử.';
          const lower = userMsg.toLowerCase();
          if (lower.includes('mặt trận') || lower.includes('mat tran') || lower.includes('18/11') || lower.includes('đại đoàn kết')) {
            response = 'Mặt trận Dân tộc Thống nhất Việt Nam (nay là MTTQ Việt Nam) được thành lập ngày 18/11/1930 theo sáng kiến của Lãnh tụ Nguyễn Ái Quốc. Bác khẳng định: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công" - cội nguồn sức mạnh bách chiến bách thắng của dân tộc ta.';
          } else if (lower.includes('cứu quốc') || lower.includes('báo')) {
            response = 'Báo Cứu Quốc là cơ quan ngôn luận của Tổng bộ Việt Minh xuất bản từ năm 1942, tiền thân trực tiếp của Báo Đại Đoàn Kết ngày nay. Tờ báo đã hoàn thành xuất sắc sứ mệnh lịch sử hiệu triệu toàn dân vùng lên khởi nghĩa Tháng Tám năm 1945.';
          } else if (lower.includes('nhà rồng') || lower.includes('nha rong') || lower.includes('1911')) {
            response = 'Cảng Nhà Rồng là nơi Nguyễn Tất Thành xuống tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước ngày 5/6/1911. Đây là bước ngoặt vĩ đại thay đổi vận mệnh lịch sử dân tộc Việt Nam.';
          } else if (lower.includes('pác bó') || lower.includes('pac bo') || lower.includes('1941')) {
            response = 'Đầu năm 1941, sau 30 năm bôn ba, Chủ tịch Hồ Chí Minh trở về Pác Bó (Cao Bằng) trực tiếp chỉ đạo cuộc kháng chiến giành độc lập, đặt tên suối Lê-nin, núi Các-Mác và thành lập Mặt trận Việt Minh ngày 19/5/1941.';
          } else if (lower.includes('tuyên ngôn') || lower.includes('độc lập') || lower.includes('1945')) {
            response = 'Ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử, Bác Hồ đọc bản Tuyên ngôn Độc lập vĩ đại khai sinh nước Việt Nam Dân chủ Cộng hòa, đỉnh cao sức mạnh đại đoàn kết toàn dân tộc.';
          } else if (lower.includes('nhật ký trong tù') || lower.includes('nhật ký')) {
            response = 'Tập thơ Nhật ký trong tù gồm 133 bài thơ bằng chữ Hán sáng tác tại Quảng Tây năm 1942-1943. Đây là bảo vật quốc gia thể hiện ý chí gang thép và niềm tin tất thắng của vị Lãnh tụ yêu nước.';
          }
          setChatMessages(prev => [...prev, { sender: 'curator', text: response }]);
        }, 1000);
      }
    } catch {
      // Graceful error fallback
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'curator', text: 'Hệ thống có chút gián đoạn. Tuy nhiên tôi có thể giải thích rằng di sản tinh thần của Người luôn tỏa sáng rực rỡ qua các giai đoạn 1890 - 1969.' }]);
      }, 800);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    const newReflection = {
      id: Date.now(),
      text: reflectionText.trim(),
      author: reflectionAuthor.trim() || 'Người viếng thăm ẩn danh',
      date: new Date().toLocaleDateString('vi-VN')
    };

    setReflections(prev => [newReflection, ...prev]);
    setReflectionText('');
    setReflectionAuthor('');
  };

  return (
    <div className="relative h-screen overflow-hidden text-slate-100 flex flex-col font-sans select-none selection:bg-amber-500/30">
      {/* Background Layer */}
      <ParticleBackground />

      {/* Dynamic Ambient Background Aura lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/30 via-slate-800/80 to-[#0f172a] pointer-events-none z-0" />

      {/* Decorative Gold Header Rail */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-600/10 via-amber-400 to-amber-600/10 z-50 shadow-[0_1px_15px_rgba(245,158,11,0.5)]" />

      {/* Elegant Header */}
      <header className="relative w-full z-40 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Crest & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center">
            <img src="/mttq-logo.png" alt="Logo MTTQ" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase mb-0.5 whitespace-nowrap">
              Ủy ban MTTQ Việt Nam Phường Chánh Hưng
            </div>
            <h1 className="font-sans font-bold text-base md:text-lg text-white tracking-widest uppercase flex items-center gap-1.5 leading-tight">
              Không Gian Văn Hóa Hồ Chí Minh
            </h1>
            <p className="text-[10px] md:text-xs text-amber-400/80 font-mono tracking-widest uppercase mt-0.5">
              Học tập và làm theo tấm gương đạo đức, phong cách Hồ Chí Minh
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-6 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-green-500 relative" />
            <span>KỸ THUẬT SỐ CHUYÊN SÂU</span>
          </div>
          <div className="hidden sm:block text-slate-500">|</div>
          <div className="hidden sm:block">
            <span>MÚI GIỜ: UTC+7</span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-4 py-4 relative z-30 flex flex-col">
        <div className="flex-1 min-h-0 h-full">
          <section className="flex flex-col h-full w-full gap-4">
            {/* Sub-tab selection indicator to switch view in central core */}
            <div className="flex bg-slate-950/90 p-1.5 rounded-full border border-white/10 shrink-0 font-bold tracking-wider max-w-xl w-full mx-auto shadow-inner">
              <button 
                onClick={() => setCenterViewMode('3d')}
                className={`flex-1 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.08em] transition-all duration-300 cursor-pointer ${
                  centerViewMode === '3d' 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                KHÔNG GIAN TRƯNG BÀY 3D
              </button>
              <button 
                onClick={() => setCenterViewMode('books')}
                className={`flex-1 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.08em] transition-all duration-300 cursor-pointer ${
                  centerViewMode === 'books' 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TỦ SÁCH & DI VẬT
              </button>
              <button 
                onClick={() => setCenterViewMode('timeline')}
                className={`flex-1 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.08em] transition-all duration-300 cursor-pointer ${
                  centerViewMode === 'timeline' 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BIÊN NIÊN SỬ
              </button>
              <button 
                onClick={() => setCenterViewMode('plaquet')}
                className={`flex-1 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.08em] transition-all duration-300 cursor-pointer ${
                  centerViewMode === 'plaquet' 
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BẢN TIN
              </button>
            </div>

            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {centerViewMode === '3d' ? (
                  <motion.div
                    key="3d"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <VirtualMuseumGame 
                      onOpenChat={handleOpenChat}
                      onSwitchToBooks={handleSwitchToBooks}
                    />
                  </motion.div>
                ) : centerViewMode === 'books' ? (
                  <motion.div
                    key="books"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col overflow-y-auto"
                  >
                    <ArchiveGrid 
                      onItemSelect={(item) => setSelectedArchiveItem(item)}
                      selectedItemId={selectedArchiveItem?.id}
                    />
                  </motion.div>
                ) : centerViewMode === 'timeline' ? (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col"
                  >
                    <TimelineZone 
                      onNodeSelect={(node) => setSelectedNode(node)}
                      selectedNodeId={selectedNode?.id}
                    />
                  </motion.div>
                ) : (
                  /* Central Glassmorphic Portal Welcome Box */
                  <motion.div
                    key="plaquet"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar text-center relative group max-w-2xl mx-auto"
                  >
                    {/* Header typography inside glass panel */}
                    <div className="w-full">
                      <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-amber-400 font-bold mb-3">Triển Lãm Kỹ Thuật Số</h2>
                      <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                        KHÔNG GIAN VĂN HÓA<br/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-extrabold tracking-wide uppercase">HỒ CHÍ MINH</span>
                      </h1>
                      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mt-2" />
                    </div>

                    {/* EMBOSSED BRONZE RELIEF PLAQUE (with mouse dynamic tracking light mimicking copper metallic response) */}
                    <div 
                      ref={plaqueRef}
                      onMouseMove={handleMouseMovePlaque}
                      onMouseLeave={handleMouseLeavePlaque}
                      className="my-4 relative w-40 h-40 md:w-44 md:h-44 rounded-full p-[3px] shadow-[0_15px_30px_rgba(0,0,0,0.6)] cursor-crosshair shrink-0 transition-transform duration-300 hover:scale-[1.05]"
                      style={{
                        background: `conic-gradient(from 180deg at 50% 50%, #d97706, #b45309, #78350f, #b45309, #f59e0b, #d97706)`
                      }}
                    >
                      {/* Inner bronze metal face */}
                      <div 
                        className="w-full h-full rounded-full flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300"
                        style={{
                          background: `radial-gradient(circle at ${plaqueLight.x}% ${plaqueLight.y}%, #b45309 0%, #78350f 65%, #451a03 100%)`
                        }}
                      >
                        {/* Dynamic specular lighting gleam */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-all duration-300"
                          style={{
                            background: `radial-gradient(circle 80px at ${plaqueLight.x}% ${plaqueLight.y}%, rgba(251, 191, 36, 0.4) 0%, transparent 100%)`
                          }}
                        />

                        {/* Fine circular rim marks */}
                        <div className="absolute inset-2 border border-amber-600/40 rounded-full pointer-events-none" />
                        <div className="absolute inset-3 border border-amber-500/20 rounded-full pointer-events-none" />

                        {/* EMBOSSED PORTRAIT VECTOR REPRESENTATION (Beautiful detailed gold silhouette in high-contrast) */}
                        <div className="relative z-10 flex flex-col items-center justify-center select-none">
                          {/* Highly polished dynamic gold embossed layout of President Ho Chi Minh */}
                          <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-300 filter drop-shadow-[1px_2px_4px_rgba(0,0,0,0.9)] opacity-90 transition-transform duration-300 group-hover:scale-102">
                            {/* Circle base */}
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
                            {/* Outer star motif representing National Flag & guidance */}
                            <polygon points="50,12 53,24 65,24 55,31 59,43 50,35 41,43 45,31 35,24 47,24" fill="rgba(245, 158, 11, 0.08)" />
                            
                            {/* Portrait Embossed Line Art (Respectful, iconic silhouette lines of Uncle Ho) */}
                            <path 
                              d="M 50,22 
                                 C 52,22 54,23 54.5,25 
                                 C 55,27 55,30 53,32 
                                 C 51,34 49,36 49.5,38 
                                 C 50,40 52.5,39.5 53.5,41 
                                 C 54.5,42.5 54,45 52,47 
                                 C 50,49 46.5,49 45,51 
                                 C 43.5,53 43.5,56 42.5,58 
                                 C 41.5,60 38.5,62 37,65
                                 C 35.5,68 34,72 34,75" 
                              fill="none" 
                              stroke="#fbbf24" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              className="transition-all"
                            />
                            
                            {/* Gentle face, eye brow and beard line representation */}
                            <path 
                              d="M 44.5,33 C 45.2,34.5 46.8,35.2 48,35" 
                              fill="none" 
                              stroke="#fcd34d" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                            />
                            {/* Beard contours */}
                            <path 
                              d="M 49.5,43 L 50,56 M 48,44 L 46.5,54 M 51.5,44 L 54,55 M 50,47 L 49,58 M 50.5,50 L 52,57" 
                              fill="none" 
                              stroke="#fef08a" 
                              strokeWidth="1.8" 
                              strokeLinecap="round" 
                            />
                            {/* Base dress suit collar */}
                            <path 
                              d="M 34,75 C 38,72 43,71 45.5,74 C 47,76 47,79 48,81 M 48.5,73 C 50.5,71 52.5,70 54,72" 
                              fill="none" 
                              stroke="#f59e0b" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                            />
                          </svg>
                          
                          {/* Small gold label at the bottom rim of the circular plaque */}
                          <div className="mt-1 text-[8px] font-sans font-bold tracking-widest text-amber-200/80 uppercase">
                            CHỦ TỊCH HỒ CHÍ MINH
                          </div>
                        </div>
                      </div>

                      {/* Subtitle/Tooltip under medallion */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded text-[8px] font-mono text-amber-300 uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Hiệu ứng ánh sáng chạm xoay
                      </div>
                    </div>

                    {/* Core quote block */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3 text-left w-full mt-2 relative">
                      <Quote className="w-5 h-5 text-amber-400/30 absolute left-2 top-2" />
                      <p className="text-[11px] italic text-amber-100 leading-relaxed pl-5 font-sans">
                        "Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành."
                      </p>
                      <div className="text-right text-[10px] text-amber-400 font-bold mt-1.5 font-mono">
                        — Hồ Chí Minh
                      </div>
                    </div>

                    {/* Quick stats or summary */}
                    <div className="w-full grid grid-cols-2 gap-2 text-left mt-3">
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
                        <div className="text-base font-mono font-bold text-amber-300">30 NĂM</div>
                        <div className="text-[9px] text-slate-400">Bôn ba tìm lối cứu Tổ quốc</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center">
                        <div className="text-base font-mono font-bold text-amber-300">BẢO VẬT</div>
                        <div className="text-[9px] text-slate-400">Quốc gia tư liệu lưu truyền</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* AI Curator chatbot modal (Opened directly by clicking the 3D Robot) */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-slate-900/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl w-[320px] sm:w-[380px] h-[380px] shadow-[0_15px_50px_rgba(0,0,0,0.85)] p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      ROBOT HƯỚNG DẪN VIÊN AI
                    </h4>
                    <span className="text-[9px] text-slate-400">Không gian Văn hóa Hồ Chí Minh</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  title="Đóng hội thoại"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-[11px] mb-2">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl p-2.5 border ${
                      msg.sender === 'user' 
                        ? 'bg-amber-500/15 border-amber-500/25 text-right ml-8 rounded-tr-none' 
                        : 'bg-white/5 border-white/10 text-left mr-8 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line text-slate-100">{msg.text}</p>
                    <span className="text-[8px] text-slate-500 font-mono block mt-1">
                      {msg.sender === 'user' ? 'Quý khách' : '🤖 Robot AI'}
                    </span>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-[10px] text-amber-400/80 italic flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Robot đang soạn câu trả lời...</span>
                  </div>
                )}
              </div>

              {/* Question input form */}
              <form onSubmit={handleSendChat} className="flex gap-2 bg-slate-950/90 p-1.5 rounded-xl border border-white/10">
                <input
                  type="text"
                  required
                  placeholder="Hỏi Robot về bảo vật, lịch sử..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder-slate-500 min-w-0"
                />
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center shrink-0 cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Gửi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Detailed Viewer Overlay (Portal Modal for Node selections or Archives) */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-[0_20px_50px_rgba(245,158,11,0.3)] relative"
            >
              <button 
                onClick={() => setSelectedNode(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-full duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                NĂM {selectedNode.year}
              </span>

              <h3 className="text-lg font-bold text-white mt-2.5 border-b border-white/10 pb-2 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-400" />
                {selectedNode.title}
              </h3>

              <div className="my-4 rounded-xl overflow-hidden border border-white/10 h-44 sm:h-64 bg-slate-950">
                <img 
                  src={selectedNode.photoUrl} 
                  alt={selectedNode.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line text-justify">
                {selectedNode.details || selectedNode.description}
              </p>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs duration-200 cursor-pointer"
                >
                  Hoàn tất tra cứu
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedArchiveItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
            >
              <button 
                onClick={() => setSelectedArchiveItem(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-full duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-2 items-center text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Chi tiết ấn văn độc lập</span>
              </div>

              <h3 className="text-base font-bold text-white mt-1.5 border-b border-white/10 pb-2.5">
                {selectedArchiveItem.title}
              </h3>

              <div className="my-4 w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center relative">
                <img 
                  src={selectedArchiveItem.imageUrl} 
                  alt={selectedArchiveItem.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <p className="text-slate-300 font-sans leading-relaxed text-left">
                  {selectedArchiveItem.description}
                </p>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px] text-slate-400">
                  <div>
                    <span>Năm tác thành:</span> <span className="text-white font-sans">{selectedArchiveItem.year}</span>
                  </div>
                  <div>
                    <span>Lưu trữ chính:</span> <span className="text-white font-sans truncate">{selectedArchiveItem.source}</span>
                  </div>
                  <div>
                    <span>Kích khổ:</span> <span className="text-white font-sans">{selectedArchiveItem.dimensions || 'Gốc bản thảo'}</span>
                  </div>
                  <div>
                    <span>Từ khóa phân loại:</span> <span className="text-amber-400 font-sans">{selectedArchiveItem.tags.slice(0, 3).join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button 
                  onClick={() => setSelectedArchiveItem(null)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs duration-200 cursor-pointer"
                >
                  Đóng tài tư liệu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER NAVIGATION MENU */}
      <footer className="relative w-full z-40 bg-slate-950/50 backdrop-blur-xl border-t border-white/5 py-4 px-6 flex flex-col items-center gap-3 mt-auto shadow-2xl">
        {/* Footnote attribution requested by user */}
        <div className="text-[10px] md:text-xs text-amber-500/80 font-sans tracking-wide text-center uppercase font-medium">
          Thực hiện bởi Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng
        </div>
      </footer>

      {/* Frame Border Detail from Bold Typography Theme */}
      <div className="fixed inset-0 border-[12px] border-[#0f172a] pointer-events-none z-50"></div>
      <div className="fixed top-3.5 left-3.5 w-12 h-12 border-l border-t border-amber-500/35 pointer-events-none z-50"></div>
      <div className="fixed top-3.5 right-3.5 w-12 h-12 border-r border-t border-amber-500/35 pointer-events-none z-50"></div>
      <div className="fixed bottom-3.5 left-3.5 w-12 h-12 border-l border-b border-amber-500/35 pointer-events-none z-50"></div>
      <div className="fixed bottom-3.5 right-3.5 w-12 h-12 border-r border-b border-amber-500/35 pointer-events-none z-50"></div>
    </div>
  );
}

