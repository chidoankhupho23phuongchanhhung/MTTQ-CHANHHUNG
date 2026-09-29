"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchiveItem } from '@/types/cultural-space';
import { Library, Search, Layers, X, Eye, ExternalLink, Calendar } from 'lucide-react';

interface Artifact {
  id: string;
  name: string;
  category: string;
  description: string;
  imgUrl: string;
  year?: string;
  dimensions?: string;
  source?: string;
}

// Complete rich digitized historical artifacts and MTTQ books database
const artifactsData: Artifact[] = [
  {
    id: 'art-sach-dai-doan-ket',
    name: 'Sách: Hồ Chí Minh về Đại đoàn kết toàn dân tộc',
    category: 'Sách & Văn kiện',
    description: 'Công trình tập hợp các bài nói, bài viết kinh điển của Chủ tịch Hồ Chí Minh khẳng định chân lý bất hủ: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công" - kim chỉ nam hành động của Mặt trận Tổ quốc Việt Nam qua mọi thời kỳ.',
    imgUrl: '/cab2.jpg',
    year: 'Nhiều thời kỳ',
    dimensions: 'NXB Chính trị Quốc gia Sự thật',
    source: 'Ủy ban Trung ương MTTQ Việt Nam'
  },
  {
    id: 'art-bao-cuu-quoc',
    name: 'Báo Cứu Quốc (Cơ quan Tổng bộ Việt Minh)',
    category: 'Báo chí Mặt trận',
    description: 'Cơ quan ngôn luận và hiệu triệu của Tổng bộ Việt Minh xuất bản từ năm 1942 (tiền thân trực tiếp của Báo Đại Đoàn Kết ngày nay). Tờ báo là ngọn cờ tập hợp các tầng lớp nhân dân nổi dậy giành chính quyền trong Cách mạng Tháng Tám 1945.',
    imgUrl: '/cab4.jpg',
    year: '1942',
    dimensions: 'Khổ in thạch cơ mật chiến khu',
    source: 'Báo Đại Đoàn Kết & Bảo tàng Lịch sử'
  },
  {
    id: 'art-chi-thi-18-11-1930',
    name: 'Chỉ thị thành lập Hội Phản đế Đồng minh 18/11/1930',
    category: 'Sách & Văn kiện',
    description: 'Chỉ thị lịch sử thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam. Ngày 18/11/1930 đã trở thành Ngày truyền thống Mặt trận Tổ quốc Việt Nam và Ngày hội Đại đoàn kết toàn dân tộc thiêng liêng hàng năm.',
    imgUrl: '/ho-chi-minh-1930.png',
    year: '18/11/1930',
    dimensions: 'Văn kiện Đảng lưu trữ',
    source: 'Cục Lưu trữ Văn phòng Trung ương Đảng'
  },
  {
    id: 'art-khan-ran-bac-tang',
    name: 'Kỷ vật Bác tặng Nhân sĩ, Trí thức & Miền Nam',
    category: 'Kỷ vật Mặt trận',
    description: 'Những kỷ vật thiêng liêng gồm khăn rằn Nam Bộ và Huy hiệu Bác Hồ gửi tặng đồng bào miền Nam và các vị nhân sĩ trí thức, chức sắc tôn giáo tiêu biểu trong Ủy ban Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.',
    imgUrl: '/cab3.jpg',
    year: '1960 - 1969',
    dimensions: 'Hiện vật lưu giữ nguyên bản',
    source: 'Bảo tàng Mặt trận Tổ quốc Việt Nam'
  },
  {
    id: 'art-dep-cao-su',
    name: 'Đôi dép cao su lịch sử của Bác Hồ',
    category: 'Kỷ vật thiêng liêng',
    description: 'Đôi dép cao su huyền thoại được chế tạo từ chiếc lốp máy bay quân sự năm 1947, đồng hành bên Bác từ chiến khu Việt Bắc kháng chiến, về thăm các kỳ Đại hội Mặt trận cho đến các chuyến công tác thăm đồng bào khắp mọi miền đất nước.',
    imgUrl: '/dep-cao-su.png',
    year: '1947',
    dimensions: 'Kích cỡ chân của Bác, chế tác thủ công',
    source: 'Bảo tàng Hồ Chí Minh'
  },
  {
    id: 'art-may-chu',
    name: 'Chiếc máy chữ Hermes di động của Bác',
    category: 'Kỷ vật thiêng liêng',
    description: 'Chiếc máy chữ xách tay hiệu Hermes được Bác giữ bên mình tại chiến khu và nhà sàn để trực tiếp soạn thảo các Lời kêu gọi đoàn kết, sắc lệnh và thư gửi đồng bào các giới, nhân sĩ tôn giáo trong Mặt trận.',
    imgUrl: '/may-chu.png',
    year: 'Thế kỷ XX',
    dimensions: 'Trọng lượng cầm tay di động',
    source: 'Khu Di tích Phủ Chủ tịch'
  },
  {
    id: 'art-tuyen-ngon-doc-lap',
    name: 'Bản thảo Tuyên ngôn Độc lập (2/9/1945)',
    category: 'Sách & Văn kiện',
    description: 'Bản văn kiện pháp lý mang giá trị lập quốc thiêng liêng khai sinh nước Việt Nam Dân chủ Cộng hòa, đỉnh cao thắng lợi của sức mạnh khối Đại đoàn kết toàn dân tộc dưới ngọn cờ Mặt trận Việt Minh.',
    imgUrl: '/p1.jpg',
    year: '1945',
    dimensions: 'Văn bản in thô có dấu ấn bút tích sửa đổi',
    source: 'Cục Lưu trữ Văn phòng Trung ương Đảng'
  },
  {
    id: 'art-uoc-nguyen',
    name: 'Tập thơ Nhật ký trong tù',
    category: 'Sách & Văn kiện',
    description: 'Bảo vật Quốc gia gồm 133 bài thơ chữ Hán sáng tác trong ngục tù Quảng Tây (1942-1943), thể hiện tinh thần gang thép, ý chí độc lập tự do và niềm tin tất thắng của vị Lãnh tụ vĩ đại.',
    imgUrl: '/nhat-ky-trong-tu.png',
    year: '1942 - 1943',
    dimensions: 'Bút ký gốc chữ Hán',
    source: 'Bảo tàng Lịch sử Quốc gia'
  },
  {
    id: 'art-dai-hoi-mttq-1955',
    name: 'Văn kiện Đại hội Mặt trận Tổ quốc VN lần thứ I',
    category: 'Sách & Văn kiện',
    description: 'Tài liệu Đại hội Mặt trận Dân tộc Thống nhất toàn quốc họp tháng 9/1955 tại Hà Nội, quyết định thành lập Mặt trận Tổ quốc Việt Nam, suy tôn Chủ tịch Hồ Chí Minh làm Chủ tịch Danh dự.',
    imgUrl: '/p4.jpg',
    year: '1955',
    dimensions: 'Tài liệu đại hội lưu trữ',
    source: 'Bảo tàng MTTQ Việt Nam'
  },
  {
    id: 'art-di-chuc-doan-ket',
    name: 'Di chúc Bác Hồ về khối Đại đoàn kết',
    category: 'Kỷ vật Mặt trận',
    description: 'Bản thảo Di chúc thiêng liêng kết tinh tư tưởng đại đoàn kết của Bác: "Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta... Phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình".',
    imgUrl: '/p5.jpg',
    year: '1965 - 1969',
    dimensions: 'Bút tích sửa đổi qua nhiều năm',
    source: 'Ban Chấp hành Trung ương Đảng'
  }
];

interface ArchiveGridProps {
  onItemSelect?: (item: ArchiveItem) => void;
  selectedItemId?: string | null;
}

export default function ArchiveGrid({ onItemSelect, selectedItemId }: ArchiveGridProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories extraction
  const categories = ['Tất cả', 'Sách & Văn kiện', 'Kỷ vật Mặt trận', 'Báo chí Mặt trận', 'Kỷ vật thiêng liêng'];

  const filteredArtifacts = artifactsData.filter((art) => {
    const matchesCat = selectedCategoryFilter === 'Tất cả' || art.category === selectedCategoryFilter;
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Top Header Row from the Bold Typography Theme */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-6 bg-white/30" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">THƯ VIỆN KỶ VẬT</span>
          </div>
          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/20">
            {filteredArtifacts.length} di vật số hóa
          </span>
        </div>
        <h3 className="text-base md:text-lg font-extrabold tracking-tight text-white mb-1">
          THƯ VIỆN DI SẢN KỸ THUẬT SỐ
        </h3>
        <p className="text-[11px] text-slate-400 font-sans mb-3 leading-relaxed">
          Nghiên cứu các tác phẩm kinh điển, báo chí Mặt trận và kỷ vật thiêng liêng về Chủ tịch Hồ Chí Minh cùng khối Đại đoàn kết toàn dân tộc.
        </p>

        {/* Dynamic Interactive Input search */}
        <div className="relative mb-3.5">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm kỷ vật lịch sử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-amber-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none transition-colors backdrop-blur-sm"
          />
        </div>

        {/* Category Pills filtering */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-300 cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetric Exhibition Grid of Showcases */}
      <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredArtifacts.map((item, index) => {
            // Re-enforce asymmetric dimensions styling matching requested layout spacing & filters
            const isWideItem = index % 3 === 0;

            return (
              <div 
                key={item.id}
                onClick={() => {
                  setSelectedArtifact(item);
                  if (onItemSelect) {
                    onItemSelect({
                      id: item.id,
                      title: item.name,
                      category: 'tac-pham', // fallback map type
                      year: item.year || '1945',
                      description: item.description,
                      imageUrl: item.imgUrl,
                      tags: [item.category]
                    });
                  }
                }}
                className={`cursor-pointer group relative backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 overflow-hidden transition-all duration-500 hover:border-amber-500/40 hover:bg-white/[0.05] flex flex-col justify-between ${
                  isWideItem ? 'sm:col-span-2 md:col-span-2 h-[220px]' : 'h-[190px]'
                }`}
              >
                {/* Specular glass reflection layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/[0.02] group-hover:to-amber-500/[0.04] transition-all duration-500" />
                
                {/* Visual Style: Grayscale / mix-blend-luminosity holding historic feel, turning colored upon hover */}
                <div className="h-2/3 w-full rounded-lg overflow-hidden border border-white/5 relative bg-slate-950">
                  <img 
                    src={item.imgUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-95" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Digital Grid Scan line effect underlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                </div>

                {/* Artifact Details bottom row inside glass block */}
                <div className="mt-2.5 flex flex-col justify-end">
                  <div className="flex items-center gap-1 text-[9px] text-amber-400 font-mono uppercase tracking-wider">
                    <Layers className="w-2.5 h-2.5" />
                    <span>{item.category}</span>
                  </div>
                  <div className="text-xs font-bold truncate text-white group-hover:text-amber-300 transition-colors duration-300 mt-0.5">
                    {item.name}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredArtifacts.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs">
              Mẫu kỷ vật đang tìm kiếm hiện đang được bổ sung sắp tới.
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETAILED EXHIBITION (Opens upon selecting artifact card to zoom close details) */}
      <AnimatePresence>
        {selectedArtifact && (
          <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 relative shadow-2xl shadow-amber-500/5 text-left"
            >
              {/* Close Button top-right corner wrapper */}
              <button 
                onClick={() => setSelectedArtifact(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-full duration-200 cursor-pointer flex items-center gap-1 text-xs font-medium"
              >
                <X className="w-4 h-4" /> Đóng
              </button>

              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono">
                {selectedArtifact.category}
              </span>

              <h2 className="text-lg font-bold text-amber-400 mt-3 flex items-center gap-2">
                <Library className="w-5 h-5 text-amber-400 animate-pulse" />
                {selectedArtifact.name}
              </h2>

              <div className="w-full h-52 my-4 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner">
                <img 
                  src={selectedArtifact.imgUrl} 
                  alt={selectedArtifact.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-103" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-justify">
                  {selectedArtifact.description}
                </p>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5 space-y-1.5 font-mono text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Thời đại xuất phát:</span>
                    <span className="text-white font-sans font-bold">{selectedArtifact.year || 'Chưa rõ'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kích thước hiện vật:</span>
                    <span className="text-white font-sans">{selectedArtifact.dimensions || 'Bản gốc trưng bày'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đơn vị lưu giữ chính thức:</span>
                    <span className="text-amber-200 font-sans font-medium">{selectedArtifact.source}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs duration-200 cursor-pointer"
                >
                  Hoàn tất quan sát
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

