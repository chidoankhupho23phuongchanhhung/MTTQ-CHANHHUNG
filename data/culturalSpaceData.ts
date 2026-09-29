import { TimelineNode, ArchiveItem } from '@/types/cultural-space';

export const TIMELINE_NODES: TimelineNode[] = [
  {
    id: 'tl-1890',
    year: '1890',
    title: 'Nơi sinh ra vị Lãnh tụ vĩ đại',
    description: 'Sinh ngày 19/5/1890 tại Làng Sen, Kim Liên, Nam Đàn, Nghệ An.',
    photoUrl: '/kim-lien-village.png', // Quê nội Làng Sen thân thương
    category: 'tuoi-tre',
    details: 'Thuở nhỏ Người mang tên Nguyễn Sinh Cung. Lớn lên trong một gia dịch nhà nho yêu nước, tại mảnh đất Nghệ An giàu truyền thống văn hóa và đấu tranh cách mạng, Người đã sớm hình thành tinh thần yêu nước và chí khí cứu nước.'
  },
  {
    id: 'tl-1911',
    year: '1911',
    title: 'Hành trình vạn dặm cứu nước',
    description: 'Ra đi tìm đường cứu nước từ Cảng Nhà Rồng trên tàu Amiral Latouche-Tréville.',
    photoUrl: '/p2.jpg', // Bến Nhà Rồng - Bảo tàng HCM
    category: 'cuu-nuoc',
    details: 'Ngày 5/6/1911, với tên gọi Văn Ba, người thanh niên yêu nước Nguyễn Tất Thành chính thức lên tàu ra đi hải ngoại. Quyết định dũng cảm này mở đầu cho hành trình 30 năm bôn ba khắp 4 biển 5 châu để tìm ra con đường tự do cho dân tộc.'
  },
  {
    id: 'tl-1920',
    year: '1920',
    title: 'Tìm thấy Ánh sáng Cách mạng',
    description: 'Tham gia Đại hội Tours và đồng sáng lập Đảng Cộng sản Pháp.',
    photoUrl: '/dai-hoi-tours.png', // Đại hội Tours 1920
    category: 'cuu-nuoc',
    details: 'Tại Đại hội đại biểu toàn quốc lần thứ XVIII của Đảng Xã hội Pháp ở Tours, Nguyễn Ái Quốc bỏ phiếu tán thành gia nhập Quốc tế thứ ba, trở thành một trong những người sáng lập Đảng Cộng sản Pháp. Sự kiện này ghi dấu mốc chuyển biến từ chủ nghĩa yêu nước chân chính sang chủ nghĩa cộng sản.'
  },
  {
    id: 'tl-1930',
    year: '1930',
    title: 'Hội nghị thành lập Đảng',
    description: 'Hợp nhất các tổ chức cộng sản thành Đảng Cộng sản Việt Nam tại Hương Cảng.',
    photoUrl: '/ho-chi-minh-1930.png', // Chân dung Lãnh tụ lịch sử
    category: 'cuu-nuoc',
    details: 'Chủ trì Hội nghị hợp nhất tại bán đảo Cửu Long (Hương Cảng), Nguyễn Ái Quốc đã xóa bỏ rời rạc của 3 tổ chức cộng sản Đông Dương, thống nhất lực lượng tiên phong độc lập dưới tên gọi Đảng Cộng sản Việt Nam.'
  },
  {
    id: 'tl-1941',
    year: '1941',
    title: 'Trở về quê hương Tổ quốc',
    description: 'Về nước trực tiếp lãnh đạo đấu tranh tại Hang Pác Bó, Cao Bằng.',
    photoUrl: '/pac-bo.png', // Suối Lê-nin, Pác Bó
    category: 'doc-lap',
    details: 'Tháng 2/1941, sau 30 năm bôn ba vạn dặm xa xứ, Người vượt biên giới Việt - Trung ở cột mốc 108 trở về nước. Người sống và làm việc tại hang Cốc Bó (Pác Bó, Cao Bằng), đặt tên dòng suối trước cửa hang là Suối Lê-nin và ngọn núi sừng sững là Núi Các-Mác.'
  },
  {
    id: 'tl-1945',
    year: '1945',
    title: 'Khai sinh nước Việt Nam mới',
    description: 'Đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình.',
    photoUrl: '/p1.jpg', // Đọc Tuyên Ngôn Độc Lập
    category: 'doc-lap',
    details: 'Ngày 2/9/1945, trước hàng vạn đồng bào tập trung tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, trịnh trọng tuyên bố với quốc dân và thế giới về sự ra đời của nước Việt Nam Dân chủ Cộng hòa.'
  },
  {
    id: 'tl-1946',
    year: '1946',
    title: 'Lời kêu gọi Toàn quốc Kháng chiến',
    description: 'Hiệu triệu toàn thể dân tộc không phân biệt tôn giáo, già trẻ, gái trai đứng lên kháng chiến cứu nước.',
    photoUrl: '/p4.jpg',
    category: 'doc-lap',
    details: 'Đêm 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: "Bất kỳ đàn ông, đàn bà, bất kỳ người già, người trẻ, không chia tôn giáo, đảng phái, dân tộc. Hễ là người Việt Nam thì phải đứng lên đánh thực dân Pháp để cứu Tổ quốc". Sức mạnh đại đoàn kết đã làm nên chiến thắng Điện Biên Phủ lừng lẫy năm châu.'
  },
  {
    id: 'tl-1951',
    year: '1951',
    title: 'Đại hội Thống nhất Việt Minh - Liên Việt',
    description: 'Hợp nhất hai mặt trận, Bác đúc kết chân lý: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công".',
    photoUrl: '/p6.png',
    category: 'di-san',
    details: 'Tháng 3/1951, Đại hội toàn quốc thống nhất Việt Minh và Hội Liên Việt thành Mặt trận Liên Việt được tổ chức trọng thể. Bác khẳng định sự thống nhất này tạo thành một khối sắt thép vô địch đưa kháng chiến đến thắng lợi hoàn toàn.'
  },
  {
    id: 'tl-1955',
    year: '1955',
    title: 'Thành lập Mặt trận Tổ quốc Việt Nam',
    description: 'Đại hội Mặt trận Dân tộc Thống nhất quyết định thành lập MTTQ Việt Nam, suy tôn Bác làm Chủ tịch Danh dự.',
    photoUrl: '/cab4.jpg',
    category: 'di-san',
    details: 'Ngày 10/9/1955, Đại hội đại biểu Mặt trận Dân tộc Thống nhất toàn quốc họp tại Hà Nội quyết định thành lập Mặt trận Tổ quốc Việt Nam nhằm củng cố khối đại đoàn kết toàn dân tộc xây dựng miền Bắc và đấu tranh thống nhất nước nhà.'
  },
  {
    id: 'tl-1960',
    year: '1960',
    title: 'Mặt trận DTGP Miền Nam Việt Nam',
    description: 'Thành lập Mặt trận Dân tộc Giải phóng miền Nam, tập hợp đồng bào miền Nam anh dũng đánh giặc cứu nước.',
    photoUrl: '/cab3.jpg',
    category: 'di-san',
    details: 'Ngày 20/12/1960, Mặt trận Dân tộc Giải phóng miền Nam Việt Nam ra đời. Bác Hồ luôn hướng về tiền tuyến lớn: "Miền Nam là máu của máu Việt Nam, là thịt của thịt Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi".'
  },
  {
    id: 'tl-1969',
    year: '1969',
    title: 'Di chúc thiêng liêng về Đại đoàn kết',
    description: 'Chủ tịch Hồ Chí Minh để lại Bản Di chúc căn dặn gìn giữ sự đoàn kết như giữ gìn con ngươi của mắt mình.',
    photoUrl: '/p5.jpg',
    category: 'di-san',
    details: 'Người thanh thản ra đi lúc 9h47 ngày 2/9/1969. Di chúc của Người là bảo vật quốc gia vô giá, kết tinh trọn vẹn tư tưởng đại đoàn kết toàn dân tộc và đoàn kết quốc tế, soi đường cho Mặt trận Tổ quốc Việt Nam qua mọi thời đại.'
  }
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'arch-sach-dai-doan-ket',
    title: 'Sách: Hồ Chí Minh về Đại đoàn kết toàn dân tộc',
    category: 'tac-pham',
    year: 'Nhiều thời kỳ',
    description: 'Tác phẩm tập hợp những lời dạy kinh điển của Bác về vai trò sống còn của Mặt trận Dân tộc Thống nhất và khối đại đoàn kết toàn dân.',
    imageUrl: '/cab2.jpg',
    tags: ['Đại đoàn kết', 'Mặt trận', 'Hồ Chí Minh', 'Lý luận'],
    source: 'NXB Chính trị Quốc gia Sự thật',
    dimensions: 'Ấn phẩm sách lý luận'
  },
  {
    id: 'arch-tuyen-ngon',
    title: 'Bản Tuyên ngôn Độc lập',
    category: 'tac-pham',
    year: '1945',
    description: 'Văn kiện pháp lý lịch sử tuyên bố độc lập chủ quyền quốc gia của Việt Nam.',
    imageUrl: '/p1.jpg',
    tags: ['Tuyên ngôn', 'Độc lập', '1945', 'Văn kiện'],
    source: 'Bảo tàng Lịch sử Quốc gia',
    dimensions: '32cm x 45cm'
  },
  {
    id: 'arch-uoc-nguyen',
    title: 'Tập thơ Nhật ký trong tù',
    category: 'tac-pham',
    year: '1942-1943',
    description: 'Tác phẩm văn học kiệt xuất bao gồm 133 bài thơ bằng chữ Hán viết trong nhà lao Quảng Tây.',
    imageUrl: '/nhat-ky-trong-tu.png',
    tags: ['Thơ ca', 'Nhà lao', 'Chữ Hán', 'Bảo vật Quốc gia'],
    source: 'Bảo tàng Hồ Chí Minh',
    dimensions: 'Bản viết tay khổ nhỏ'
  },
  {
    id: 'arch-chi-thi-18-11',
    title: 'Chỉ thị thành lập Hội Phản đế Đồng minh 18/11/1930',
    category: 'sac-lenh',
    year: '1930',
    description: 'Văn kiện khai sinh hình thức Mặt trận Dân tộc Thống nhất đầu tiên, mốc son Ngày truyền thống MTTQ Việt Nam.',
    imageUrl: '/ho-chi-minh-1930.png',
    tags: ['Mặt trận', '18/11/1930', 'Đại đoàn kết', 'Văn kiện Đảng'],
    source: 'Lưu trữ Văn phòng Trung ương Đảng',
    dimensions: 'Văn bản in thạch lưu trữ'
  },
  {
    id: 'arch-duong-kach-menh',
    title: 'Tác phẩm Đường Kách mệnh',
    category: 'tac-pham',
    year: '1927',
    description: 'Tập hợp bài giảng của Nguyễn Ái Quốc tại Quảng Châu dạy các chiến sĩ cách mạng trẻ.',
    imageUrl: '/duong-kach-menh.png',
    tags: ['Lý luận', 'Đường lối', 'Quảng Châu', '1927'],
    source: 'Bảo tàng Cách mạng Việt Nam',
    dimensions: 'Khổ in thô sơ đá'
  },
  {
    id: 'arch-loi-keu-goi',
    title: 'Lời kêu gọi Toàn quốc Kháng chiến',
    category: 'sac-lenh',
    year: '1946',
    description: 'Mệnh lệnh thiêng liêng cổ vũ toàn dân đoàn kết đứng lên bảo vệ độc lập tự do chống thực dân Pháp.',
    imageUrl: '/p4.jpg',
    tags: ['Kháng chiến', '1946', 'Hồ Chí Minh', 'Lịch sử'],
    source: 'Lưu trữ Văn phòng Trung ương Đảng',
    dimensions: 'Văn bản viết tay gốc'
  },
  {
    id: 'arch-di-chuc',
    title: 'Di chúc Chủ tịch Hồ Chí Minh',
    category: 'thu-tin',
    year: '1965-1969',
    description: 'Những lời dặn dò cuối cùng chan chứa tình yêu thương gửi lại cho toàn Đảng, toàn dân và căn dặn về khối đại đoàn kết.',
    imageUrl: '/p5.jpg',
    tags: ['Di cảo', 'Di chúc', 'Phụng sự', 'Tinh hoa'],
    source: 'Ban Chấp hành Trung ương Đảng',
    dimensions: 'Bút tích sửa chữa nhiều năm'
  },
  {
    id: 'arch-bao-cuu-quoc',
    title: 'Báo Cứu Quốc - Cơ quan Tổng bộ Việt Minh',
    category: 'tac-pham',
    year: '1942',
    description: 'Tờ báo cơ quan ngôn luận của Mặt trận Việt Minh (tiền thân Báo Đại Đoàn Kết ngày nay).',
    imageUrl: '/cab4.jpg',
    tags: ['Báo Cứu Quốc', 'Việt Minh', 'Đại Đoàn Kết', 'Báo chí'],
    source: 'Báo Đại Đoàn Kết',
    dimensions: 'Khổ báo in thạch'
  }
];
