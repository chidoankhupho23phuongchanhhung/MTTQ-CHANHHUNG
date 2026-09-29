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
    id: 'tl-1952',
    year: '1952',
    title: 'Thư gửi Phụ nữ Việt Nam',
    description: 'Bác gửi thư khen ngợi sự đóng góp của phụ nữ trong kháng chiến kiến quốc.',
    photoUrl: '/hcm-letter-women.png',
    category: 'di-san',
    details: 'Nhân ngày kỷ niệm Khởi nghĩa Hai Bà Trưng và ngày Quốc tế Phụ nữ, ngày 8/3/1952 Bác Hồ gửi thư khen ngợi: "Non sông gấm vóc Việt Nam do phụ nữ ta trẻ cũng như già, ra sức dệt thêu mà thêm tốt đẹp, rực rỡ". Người khuyên phụ nữ xóa bỏ tự ti, phấn đấu bình đẳng.'
  },
  {
    id: 'tl-1956',
    year: '1956',
    title: 'Tiếp đại biểu Phụ nữ Thủ đô',
    description: 'Bác nói chuyện thân mật và chia quà kẹo cho các đại biểu tại Phủ Chủ tịch.',
    photoUrl: '/p6.png',
    category: 'di-san',
    details: 'Ngày 26/12/1956, Bác tiếp hơn 300 đại biểu phụ nữ Hà Nội. Bác thân mật dặn ăn bánh kẹo và mang quà về cho con, chồng. Khi mọi người ùa lên chụp ảnh chung, Bác đùa vui kéo bác sĩ Trần Duy Hưng (Chủ tịch Hà Nội) lại bảo: "Ai cũng muốn đứng gần Bác cả thì không có chỗ cho \'bác gái\' đứng à? Bác gái đây!".'
  },
  {
    id: 'tl-1965',
    year: '1965',
    title: 'Bác Hồ với phong trào "Ba Đảm Đang"',
    description: 'Bác Hồ dự Đại hội Phụ nữ và trao tặng huy hiệu cho các gương điển hình xuất sắc.',
    photoUrl: '/hcm-women-movement.png',
    category: 'di-san',
    details: 'Chiều 2/12/1965, Bác cùng Thủ tướng Phạm Văn Đồng đến dự Đại hội Ba Đảm Đang. Bác khen ngợi tinh thần phụ nữ miền Bắc vừa sản xuất vừa chiến đấu. Người đọc báo Thủ đô tìm ra thành tích của 7 nữ công nhân, nông dân, giáo viên xuất sắc và tặng Huy hiệu của Người ngay tại chỗ.'
  },
  {
    id: 'tl-1969',
    year: '1969',
    title: 'Di sản Ngàn năm lưu giữ',
    description: 'Chủ tịch Hồ Chí Minh qua đời, để lại Bản Di chúc thiêng liêng.',
    photoUrl: '/p5.jpg', // Nhà sàn Bác Hồ giản dị
    category: 'di-san',
    details: 'Người thanh thản ra đi lúc 9h47 ngày 2/9/1969. Di chúc của Người là một tác phẩm kết tinh tình yêu Tổ quốc, nhân dân và tư tưởng đại đoàn kết dân tộc sâu sắc, là ngọn đuốc soi đường cho các thế hệ học tập và noi theo.'
  }
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
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
    id: 'arch-duong-kach-menh',
    title: 'Tác phẩm Đường Kách mệnh',
    category: 'tac-pham',
    year: '1927',
    description: 'Tập hợp bài giảng của Nguyễn Ái Quốc tại Châu dạy các chiến sĩ cách mạng trẻ.',
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
    description: 'Mệnh lệnh thiêng liêng cổ vũ toàn dân đứng lên bảo vệ độc lập tự do chống thực dân Pháp.',
    imageUrl: '/p4.jpg', // Chân dung biểu tượng 1946 khơi kháng chiến
    tags: ['Kháng chiến', '1946', 'Hồ Chí Minh', 'Lịch sử'],
    source: 'Lưu trữ Văn phòng Trung ương Đảng',
    dimensions: 'Văn bản viết tay gốc'
  },
  {
    id: 'arch-di-chuc',
    title: 'Di chúc Chủ tịch Hồ Chí Minh',
    category: 'thu-tin',
    year: '1965-1969',
    description: 'Những lời dặn dò cuối cùng chan chứa tình yêu thương gửi lại cho toàn Đảng, toàn dân.',
    imageUrl: '/p5.jpg', // Nơi soạn chúc thư lịch sử
    tags: ['Di cảo', 'Di chúc', 'Phụng sự', 'Tinh hoa'],
    source: 'Ban Chấp hành Trung ương Đảng',
    dimensions: 'Bút tích sửa chữa nhiều năm'
  },
  {
    id: 'arch-thu-khai-truong',
    title: 'Thư gửi học sinh khai trường đầu tiên',
    category: 'thu-tin',
    year: '1945',
    description: 'Bức thư chứa đựng khát vọng vĩ đại gửi gắm tương lai nước nhà vào học sinh học tập.',
    imageUrl: '/p3.jpg', // Bác Hồ với thiếu nhi
    tags: ['Thư gửi', 'Giáo dục', 'Thế hệ trẻ', 'Khát vọng'],
    source: 'Bộ Giáo dục và Đào tạo',
    dimensions: 'In báo Cứu Quốc'
  },
  {
    id: 'arch-bac-ho-phu-nu-thu',
    title: 'Thư gửi Phụ nữ Việt Nam 20/10/1952',
    category: 'thu-tin',
    year: '1952',
    description: 'Bức thư chúc mừng nhân ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam, Bác Hồ khen ngợi sự đóng góp to lớn của phụ nữ trong kháng chiến kiến quốc.',
    imageUrl: '/hcm-letter-women.png',
    tags: ['Bác Hồ', 'Phụ nữ', 'Thư gửi', '1952'],
    source: 'Bảo tàng Phụ nữ Việt Nam',
    dimensions: 'Bản gốc lưu trữ'
  },
  {
    id: 'arch-bac-ho-phu-nu-badamdang',
    title: 'Bác Hồ với phong trào "Phụ nữ Ba Đảm Đang"',
    category: 'sac-lenh',
    year: '1965',
    description: 'Phong trào thi đua yêu nước xuất sắc của phụ nữ miền Bắc được Bác Hồ gửi lời khen ngợi và cổ vũ nồng nhiệt.',
    imageUrl: '/hcm-women-movement.png',
    tags: ['Kháng chiến', 'Ba Đảm Đang', 'Phụ nữ', '1965'],
    source: 'Bảo tàng Phụ nữ Việt Nam',
    dimensions: 'Tư liệu ảnh'
  }
];
