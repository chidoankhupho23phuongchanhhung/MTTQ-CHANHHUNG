// lib/culturalSpaceData.ts
// Dữ liệu và cấu hình Không gian trưng bày & Hiện vật MTTQ Việt Nam Phường Chánh Hưng

export interface Cabinet {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  defaultImage: string;
  year: string;
  source: string;
  details: string[];
  xrayNote: string;
  infraNote: string;
}

export type Artifact = Cabinet;

export interface WallpaperPreset {
  id: string;
  name: string;
  desc: string;
  backUrl: string;
  sideUrl: string;
  previewBg: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'default-mttq',
    name: 'Mặc định MTTQ & Bác Hồ',
    desc: 'Phông nền đỏ hoa sen, cờ Tổ quốc & biểu trưng Mặt trận',
    backUrl: '/wall-back.png',
    sideUrl: '/wall-side.png',
    previewBg: 'linear-gradient(135deg, #b91c1c, #d97706)'
  },
  {
    id: 'wood-classic',
    name: 'Tường gỗ Bảo tàng Cổ điển',
    desc: 'Tường ốp gỗ sồi phong cách bảo tàng truyền thống',
    backUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop&q=80',
    previewBg: 'linear-gradient(135deg, #78350f, #451a03)'
  },
  {
    id: 'red-velvet',
    name: 'Phông Hội nghị Đỏ Son',
    desc: 'Vải gấm nhung đỏ truyền thống của các kỳ Đại hội',
    backUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    previewBg: 'linear-gradient(135deg, #991b1b, #450a0a)'
  },
  {
    id: 'digital-blue',
    name: 'Không gian Số Hiện đại',
    desc: 'Không gian số hóa công nghệ cao màu xanh sapphire',
    backUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    sideUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    previewBg: 'linear-gradient(135deg, #1e3a8a, #0f172a)'
  }
];

export const DEFAULT_CABINETS: Cabinet[] = [
  {
    id: 'cab-trung-tam', 
    name: 'Tượng đồng Bác Hồ & Khối Đại đoàn kết toàn dân tộc', 
    category: 'Biểu tượng Thiêng liêng',
    description: 'Tượng đồng chân dung Chủ tịch Hồ Chí Minh - Người sáng lập và đặt nền móng cho Mặt trận Dân tộc Thống nhất Việt Nam, người kiến tạo khối Đại đoàn kết toàn dân tộc, cội nguồn sức mạnh bách chiến bách thắng của cách mạng Việt Nam.',
    image: '/cab1.jpg',
    defaultImage: '/cab1.jpg',
    year: 'Thế kỷ XX', 
    source: 'Khu Di tích Phủ Chủ tịch & Bảo tàng MTTQ Việt Nam',
    details: [
      'Tượng đồng đỏ đúc thủ công tinh xảo, thể hiện dung mạo nhân hậu của Người.',
      'Lời căn dặn lịch sử: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công."'
    ],
    xrayNote: 'Cấu trúc đồng đỏ tinh khiết, khắc họa sâu sắc khí phách lãnh tụ kính yêu.',
    infraNote: 'Nhiệt độ bảo tồn chuẩn quốc tế 22°C - 24°C, bảo vệ hiện vật thiêng liêng.'
  },
  {
    id: 'cab-doc-bvat', 
    name: 'Bút tích Bác Hồ & Báo Cứu Quốc', 
    category: 'Kỷ vật Báo chí Mặt trận',
    description: 'Bản thảo bút tích của Bác gửi Đại hội Mặt trận Dân tộc Thống nhất, cùng các số Báo Cứu Quốc - Cơ quan ngôn luận của Tổng bộ Việt Minh (tiền thân Báo Đại Đoàn Kết ngày nay).',
    image: '/cab2.jpg',
    defaultImage: '/cab2.jpg',
    year: '1942 – 1969', 
    source: 'Bảo tàng Lịch sử Quốc gia & Báo Đại Đoàn Kết',
    details: [
      'Bút máy ngòi vàng Bác ký lời kêu gọi đồng bào cả nước đoàn kết kháng chiến kiến quốc.',
      'Các bài báo của Bác kêu gọi củng cố Mặt trận và phát huy quyền làm chủ của nhân dân.'
    ],
    xrayNote: 'Mực viết và sợi giấy cổ lưu giữ nguyên vẹn các nét chữ chuẩn mực của Bác.',
    infraNote: 'Bảo quản kín khí Nitơ khô chống oxy hóa bề mặt giấy.'
  },
  {
    id: 'cab-dep-cao-su', 
    name: 'Kỷ vật Bác tặng Nhân sĩ, Trí thức & Tôn giáo', 
    category: 'Kỷ vật Đại đoàn kết',
    description: 'Những kỷ vật thiêng liêng Bác trao tặng các vị nhân sĩ, trí thức yêu nước, chức sắc tôn giáo và già làng, trưởng bản tiêu biểu tham gia Ủy ban Mặt trận Tổ quốc Việt Nam.',
    image: '/cab3.jpg',
    defaultImage: '/cab3.jpg',
    year: '1945 – 1969', 
    source: 'Bảo tàng Mặt trận Tổ quốc Việt Nam',
    details: [
      'Huy hiệu Bác Hồ và khăn rằn Nam Bộ Bác thân tặng đồng bào và chiến sĩ miền Nam.',
      'Những kỷ vật biểu trưng cho sự gắn kết máu thịt giữa Bác và nhân dân mọi tầng lớp, tôn giáo.'
    ],
    xrayNote: 'Chất liệu vải dệt và kim loại biểu trưng đạt độ bền vượt thời gian.',
    infraNote: 'Giữ nguyên màu sợi tự nhiên và dấu tích lịch sử.'
  },
  {
    id: 'cab-nhat-ky', 
    name: 'Chỉ thị thành lập Mặt trận 18/11/1930', 
    category: 'Văn kiện Lịch sử Lập quốc',
    description: 'Chỉ thị thành lập Hội Phản đế Đồng minh ngày 18/11/1930 và Cương lĩnh Mặt trận Dân tộc Thống nhất qua các thời kỳ (Việt Minh 1941, Liên Việt 1951, MTTQ Việt Nam 1955).',
    image: '/cab4.jpg',
    defaultImage: '/cab4.jpg',
    year: '18/11/1930', 
    source: 'Viện Lưu trữ Lịch sử Trung ương Đảng',
    details: [
      'Văn kiện lịch sử khai sinh hình thức Mặt trận Dân tộc Thống nhất đầu tiên.',
      'Mốc son 18/11/1930 trở thành Ngày hội Đại đoàn kết toàn dân tộc thiêng liêng hàng năm.'
    ],
    xrayNote: 'Chữ in thạch và chữ chép tay trên giấy dó cổ, còn nguyên con dấu cơ mật.',
    infraNote: 'Văn bản bảo quản trong hòm kính cường lực chống tia cực tím.'
  }
];

export const PAINTING_SLOTS = [
  { 
    id: 'p1', title: 'Bác Hồ bắt nhịp bài ca Kết đoàn', color: 0xc8860a, accent: 0x8b5e00, x: -6.2, y: 5.2, z: -9.5, w: 2.5, h: 1.85, defaultImage: '/p2.jpg',
    description: 'Bức ảnh lịch sử bất hủ ghi lại khoảnh khắc Chủ tịch Hồ Chí Minh bắt nhịp bài ca "Kết đoàn" tại Đại hội Mặt trận Tổ quốc và Đại hội Đảng toàn quốc. Bài ca đã trở thành giai điệu hào hùng, hiệu triệu toàn thể đồng bào Việt Nam cùng chung sức một lòng.'
  },
  { 
    id: 'p2', title: 'Tuyên ngôn Độc lập 2/9/1945', color: 0x1a3a6c, accent: 0x0f2347, x: -1.8, y: 5.35, z: -9.5, w: 2.15, h: 1.65, defaultImage: '/p1.jpg',
    description: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình lịch sử, khai sinh nước Việt Nam Dân chủ Cộng hòa - thành quả vĩ đại của sức mạnh đại đoàn kết toàn dân tộc dưới ngọn cờ Mặt trận Việt Minh.'
  },
  { 
    id: 'p3', title: 'Hội Phản đế Đồng minh 18/11/1930', color: 0x7a1c1c, accent: 0x4a0e0e, x: 2.2, y: 5.35, z: -9.5, w: 2.3, h: 1.85, defaultImage: '/ho-chi-minh-1930.png',
    description: 'Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng ra chỉ thị thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam. Ngày 18/11 đã trở thành Ngày truyền thống vẻ vang của Mặt trận Tổ quốc Việt Nam và Ngày hội Đại đoàn kết toàn dân tộc.'
  },
  { 
    id: 'p4', title: 'Đại hội Thống nhất Việt Minh - Liên Việt (1951)', color: 0x1a4a1a, accent: 0x0d2e0d, x: 6.2, y: 5.2, z: -9.5, w: 2.15, h: 1.65, defaultImage: '/p3.jpg',
    description: 'Chủ tịch Hồ Chí Minh tại Đại hội toàn quốc thống nhất Việt Minh - Liên Việt tháng 3/1951. Tại đây Người khẳng định: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công." - chân lý sáng ngời của cách mạng Việt Nam.'
  },
  { 
    id: 'p5', title: 'Bác Hồ với Đồng bào & Chiến sĩ Miền Nam', color: 0x3a1a5c, accent: 0x220e38, x: -9.45, y: 5.0, z: -3.5, w: 1.85, h: 2.0, rotY: Math.PI / 2, defaultImage: '/cab1.jpg',
    description: 'Bác Hồ luôn khẳng định "Miền Nam là máu của máu Việt Nam, là thịt của thịt Việt Nam". Bức ảnh ghi lại tình cảm sâu nặng của Người khi đón tiếp các anh hùng, dũng sĩ diệt Mỹ và phái đoàn Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.'
  },
  { 
    id: 'p6', title: 'Bác Hồ với Nhân sĩ, Trí thức & Tôn giáo', color: 0x6b2800, accent: 0x421800, x: 9.45, y: 5.0, z: -3.5, w: 1.85, h: 2.0, rotY: -Math.PI / 2, defaultImage: '/p4.jpg',
    description: 'Chủ tịch Hồ Chí Minh luôn trân trọng, đoàn kết và phát huy mọi nguồn lực trí tuệ của các tầng lớp nhân sĩ, trí thức, đồng bào các tôn giáo và đồng bào các dân tộc thiểu số trong Mặt trận Tổ quốc, tạo nên khối đại đoàn kết toàn dân vững chắc.'
  }
];
