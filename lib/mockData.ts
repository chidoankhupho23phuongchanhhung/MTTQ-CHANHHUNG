import { NewsItem, FeedbackItem, PublicServiceItem, EventItem, DocumentItem, StaffWorkItem } from './types';

// Mock News Data
export const mockNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'MTTQ phường Chánh Hưng tổ chức Ngày hội Đại đoàn kết toàn dân tộc',
    category: 'activities',
    categoryLabel: 'Hoạt động MTTQ',
    date: '2026-06-15',
    tag: 'Đại Đoàn Kết',
    summary: 'Chào mừng kỷ niệm ngày thành lập Mặt trận Dân tộc Thống nhất Việt Nam, Ủy ban MTTQ Việt Nam phường Chánh Hưng long trọng tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026 tại các khu dân cư.',
    content: 'Ngày hội diễn ra trong không khí ấm áp, thắm tình đoàn kết với sự tham gia của đông đảo bà con nhân dân trên địa bàn phường. Tại ngày hội, các ban công tác mặt trận đã ôn lại truyền thống vẻ vang của Mặt trận, báo cáo kết quả thực hiện cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh". Nhân dịp này, phường cũng trao tặng nhiều phần quà ý nghĩa cho hộ cận nghèo, gia đình khó khăn và tuyên dương các gương người tốt việc tốt.',
    image: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?q=80&w=800&auto=format&fit=crop',
    views: 342
  },
  {
    id: 'news-2',
    title: 'Hội nghị tiếp xúc cử tri định kỳ Quý II năm 2026 của Tổ đại biểu HĐND Quận',
    category: 'policy',
    categoryLabel: 'Chính sách - Pháp luật',
    date: '2026-06-10',
    tag: 'Tiếp xúc cử tri',
    summary: 'Ban Thường trực Ủy ban MTTQ Việt Nam phường Chánh Hưng phối hợp tổ chức hội nghị tiếp xúc cử tri định kỳ nhằm lắng nghe tâm tư, nguyện vọng của cử tri gửi tới HĐND.',
    content: 'Tại hội nghị, đại diện Tổ đại biểu HĐND đã báo cáo với cử tri tình hình kinh tế - xã hội quận trong 6 tháng đầu năm. Cử tri phường Chánh Hưng đã đóng góp nhiều ý kiến tâm huyết liên quan đến tiến độ dự án hạ tầng giao thông, công tác quản lý đô thị, bảo vệ môi trường và cải cách thủ tục hành chính tại địa phương. Đại diện lãnh đạo UBND phường đã giải trình trực tiếp một số kiến nghị thuộc thẩm quyền xử lý.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    views: 215
  },
  {
    id: 'news-3',
    title: 'Ra mắt mô hình "Khu dân cư đoàn kết, nghĩa tình, văn minh" tại Khu phố 4',
    category: 'activities',
    categoryLabel: 'Hoạt động MTTQ',
    date: '2026-06-08',
    tag: 'Đoàn Kết Nghĩa Tình',
    summary: 'Ủy ban MTTQ Việt Nam phường Chánh Hưng vừa cho ra mắt điểm mô hình "Khu dân cư đoàn kết, nghĩa tình, văn minh" nhằm tăng cường tinh thần tương thân tương ái giữa các hộ gia đình.',
    content: 'Mô hình tập trung vào 5 tiêu chí cốt lõi bao gồm: giữ gìn an ninh trật tự, bảo vệ môi trường xanh - sạch - đẹp, hỗ trợ các hộ gia đình có hoàn cảnh đặc biệt khó khăn, xây dựng nếp sống văn minh đô thị và chuyển đổi số cộng đồng. Ban điều hành mô hình gồm các thành viên nòng cốt là cán bộ khu phố, cam kết đồng hành cùng nhân dân xây dựng khu phố ngày một phát triển bền vững.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop',
    views: 450
  },
  {
    id: 'news-4',
    title: 'Tập huấn chuyển đổi số cho cán bộ Ban Công tác Mặt trận và Tổ công nghệ số cộng đồng',
    category: 'activities',
    categoryLabel: 'Hoạt động MTTQ',
    date: '2026-06-05',
    tag: 'Chuyển Đổi Số',
    summary: 'Nhằm xây dựng nền tảng "Mặt trận số thông minh", phường đã tổ chức tập huấn cách thức sử dụng các công cụ số cho đội ngũ cán bộ cơ sở.',
    content: 'Nội dung buổi tập huấn xoay quanh việc hướng dẫn cán bộ sử dụng phần mềm tiếp nhận phản ánh trực tuyến của người dân, quản lý văn bản số, cách thức hỗ trợ người dân thực hiện các dịch vụ công trực tuyến mức độ 3, 4 trên Cổng dịch vụ công Quốc gia. Đây là bước đệm quan trọng giúp tăng tốc chuyển đổi số toàn diện tại phường Chánh Hưng.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    views: 189
  },
  {
    id: 'news-5',
    title: 'Hướng dẫn phân loại rác thải sinh hoạt tại nguồn cho bà con cư dân',
    category: 'society',
    categoryLabel: 'Đời sống - Xã hội',
    date: '2026-06-01',
    tag: 'Môi Trường Xanh',
    summary: 'Ủy ban MTTQ phường phối hợp với Chi hội Cựu chiến binh và Đoàn Thanh niên phát động chương trình hướng dẫn phân loại chất thải rắn sinh hoạt tại nguồn.',
    content: 'Nhân dân được hướng dẫn phân biệt rõ rác hữu cơ dễ phân hủy, rác tái chế có khả năng tái sử dụng và các loại rác thải còn lại. Đồng thời, phường đã tổ chức phát tặng túi rác phân loại tiêu chuẩn cho các hộ gia đình đăng ký thực hiện điểm tại tuyến đường Phạm Hùng và Tạ Quang Bửu, góp phần bảo vệ cảnh quan đô thị lành mạnh.',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop',
    views: 298
  },
  {
    id: 'news-6',
    title: 'Trao tặng 50 suất học bổng Nguyễn Hữu Thọ cho học sinh nghèo vượt khó',
    category: 'welfare',
    categoryLabel: 'An sinh xã hội',
    date: '2026-05-28',
    tag: 'Học bổng Nguyễn Hữu Thọ',
    summary: 'Hoạt động an sinh xã hội chăm lo thế hệ trẻ có hoàn cảnh khó khăn vươn lên trong học tập, chuẩn bị bước vào năm học mới.',
    content: 'Mỗi suất học bổng trị giá từ 1.500.000 đến 3.000.000 đồng kèm theo sách vở, dụng cụ học tập được trao cho các em học sinh cấp tiểu học, trung học cơ sở và trung học phổ thông có hoàn cảnh đặc biệt khó khăn. Kinh phí do Quỹ "Vì người nghèo" phường vận động các mạnh thường quân và doanh nghiệp trên địa bàn đóng góp.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
    views: 310
  }
];

// Mock Feedback Data (Realtime Simulation & Tracking)
export const mockFeedbacks: FeedbackItem[] = [
  {
    id: 'fb-1',
    feedbackCode: 'PA2606-0012',
    title: 'Đèn đường không sáng tại đầu hẻm đường Phạm Hùng',
    type: 'Phản ánh',
    field: 'Đô thị',
    priority: 'Thường',
    senderName: 'Trần Văn Hùng',
    senderPhone: '0908123456',
    senderAddress: '142/5 Phạm Hùng, Phường Chánh Hưng',
    wardGroup: 'Khu phố 3',
    content: 'Hiện nay bóng đèn cao áp chiếu sáng công cộng tại đoạn đầu hẻm 142 đường Phạm Hùng đã bị hỏng hơn một tuần qua, khiến khu vực này rất tối vào ban đêm, gây nguy hiểm cho người tham gia giao thông và tạo điều kiện cho các tệ nạn xã hội. Kính mong cơ quan chức năng kiểm tra và sửa chữa giúp bà con.',
    location: 'Hẻm 142 Phạm Hùng',
    datetime: '2026-06-29T08:30:00Z',
    status: 'Đang xử lý',
    lastUpdate: '2026-06-30T02:15:00Z',
    officer: 'Nguyễn Văn An (Chuyên viên Quản lý Đô thị)',
    image: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?q=80&w=800&auto=format&fit=crop',
    timeline: [
      { status: 'Mới tiếp nhận', time: '2026-06-29 08:30', description: 'Hệ thống đã tự động tiếp nhận và cấp mã phản ánh trực tuyến.', completed: true },
      { status: 'Phân công xử lý', time: '2026-06-29 10:15', description: 'Đã chuyển thông tin phản ánh đến bộ phận Quản lý Đô thị phường xác minh.', completed: true },
      { status: 'Đang xác minh', time: '2026-06-30 02:15', description: 'Cán bộ kỹ thuật đang tiến hành khảo sát thực địa và chuẩn bị vật tư thay thế.', completed: true },
      { status: 'Đã phản hồi', time: '', description: 'Chờ cập nhật phản hồi từ bộ phận kỹ thuật.', completed: false },
      { status: 'Hoàn tất', time: '', description: 'Chờ nghiệm thu kết quả xử lý.', completed: false }
    ],
    rating: undefined
  },
  {
    id: 'fb-2',
    feedbackCode: 'PA2606-0015',
    title: 'Rác thải sinh hoạt không được thu gom đúng lịch trình quy định',
    type: 'Phản ánh',
    field: 'Môi trường',
    priority: 'Cao',
    senderName: 'Lê Thị Mai',
    senderPhone: '0912345678',
    senderAddress: 'Căn hộ B4-02 Chung cư Chánh Hưng',
    wardGroup: 'Khu phố 5',
    content: 'Đơn vị thu gom rác thường xuyên bỏ chuyến thu gom vào ngày Thứ Ba và Thứ Năm tại trục đường số 5 xung quanh chung cư. Việc này dẫn đến lượng rác tồn đọng bốc mùi hôi thối, ruồi muỗi phát sinh ảnh hưởng lớn đến sức khỏe cư dân và cảnh quan đô thị. Kính đề nghị MTTQ giám sát đơn vị dịch vụ công ích quận.',
    location: 'Chung cư Chánh Hưng, Đường số 5',
    datetime: '2026-06-28T14:20:00Z',
    status: 'Đã phản hồi',
    lastUpdate: '2026-06-30T09:30:00Z',
    officer: 'Trần Thị Mai (Phó Chủ tịch UBND Phường)',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop',
    timeline: [
      { status: 'Mới tiếp nhận', time: '2026-06-28 14:20', description: 'Tiếp nhận phản ánh từ cư dân.', completed: true },
      { status: 'Phân công xử lý', time: '2026-06-28 16:00', description: 'Lãnh đạo UBND giao tổ trật tự đô thị làm việc với đơn vị thu gom rác.', completed: true },
      { status: 'Đang xác minh', time: '2026-06-29 09:00', description: 'Đã lập biên bản ghi nhận thực tế rác tồn đọng và nhắc nhở đơn vị thu gom.', completed: true },
      { status: 'Đã phản hồi', time: '2026-06-30 09:30', description: 'UBND phường phản hồi: Đã yêu cầu công ty công ích thu gom bù ngay trong ngày. Đơn vị cam kết sẽ thu gom đúng lịch từ tuần này.', completed: true },
      { status: 'Hoàn tất', time: '2026-06-30 11:00', description: 'Cư dân xác nhận rác đã được dọn sạch.', completed: true }
    ],
    rating: 5
  },
  {
    id: 'fb-3',
    feedbackCode: 'PA2606-0007',
    title: 'Nắp hố ga bị bể vỡ nguy hiểm tại ngã tư Tạ Quang Bửu',
    type: 'Phản ánh',
    field: 'Đô thị',
    priority: 'Khẩn cấp',
    senderName: 'Phạm Minh Đức',
    senderPhone: '0987654321',
    senderAddress: '45 Tạ Quang Bửu, Phường Chánh Hưng',
    wardGroup: 'Khu phố 2',
    content: 'Một nắp hố ga nằm ngay giữa giao lộ Tạ Quang Bửu và đường số 3 bị vỡ nát hoàn toàn, lộ ra hố sâu rất nguy hiểm cho xe cộ đi lại, đặc biệt là lúc trời mưa ngập nước dễ xảy ra tai nạn chết người. Bà con phải tạm thời lấy cành cây cắm vào để cảnh báo. Đề nghị sửa chữa hỏa tốc!',
    location: 'Ngã tư Tạ Quang Bửu - Đường số 3',
    datetime: '2026-06-25T10:05:00Z',
    status: 'Hoàn tất',
    lastUpdate: '2026-06-26T07:20:00Z',
    officer: 'Lê Hoàng Nam (Chuyên viên Quản lý Đô thị)',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
    timeline: [
      { status: 'Mới tiếp nhận', time: '2026-06-25 10:05', description: 'Hệ thống tự động ghi nhận phản ánh khẩn cấp.', completed: true },
      { status: 'Phân công xử lý', time: '2026-06-25 10:30', description: 'Lãnh đạo phường cử tổ công tác đô thị xuống rào chắn khẩn cấp.', completed: true },
      { status: 'Đang xác minh', time: '2026-06-25 11:15', description: 'Đã thực hiện dựng rào chắn tạm và liên hệ đơn vị hạ tầng đô thị quận thay nắp mới.', completed: true },
      { status: 'Đã phản hồi', time: '2026-06-25 17:00', description: 'Nắp hố ga mới làm bằng gang đúc chịu lực đã được lắp đặt thay thế thành công.', completed: true },
      { status: 'Hoàn tất', time: '2026-06-26 07:20', description: 'Cán bộ kỹ thuật kiểm tra hiện trường lần cuối và bàn giao thông thoáng mặt đường.', completed: true }
    ],
    rating: 5
  },
  {
    id: 'fb-4',
    feedbackCode: 'PA2606-0009',
    title: 'Tiếng ồn xây dựng karaoke tự phát ảnh hưởng khu dân cư ban đêm',
    type: 'Phản ánh',
    field: 'An ninh',
    priority: 'Thường',
    senderName: 'Nguyễn Thị Hoa',
    senderPhone: '0938333444',
    senderAddress: '88/12 Đường số 10, Phường Chánh Hưng',
    wardGroup: 'Khu phố 4',
    content: 'Một hộ dân tại số 88/10 thường xuyên tổ chức ăn uống hát karaoke loa kéo công suất lớn tại vỉa hè từ lúc chiều tối cho tới 11-12 giờ đêm, âm thanh quá lớn khiến các hộ xung quanh không thể ngủ được, các cháu nhỏ không tập trung học bài được. Đã nhắc nhở nhưng hộ này không hợp tác.',
    location: 'Trước số nhà 88/10 Đường số 10',
    datetime: '2026-06-20T19:45:00Z',
    status: 'Mới tiếp nhận',
    lastUpdate: '2026-06-20T19:45:00Z',
    officer: 'Nguyễn Trọng Nghĩa (Công an Phường Chánh Hưng)',
    timeline: [
      { status: 'Mới tiếp nhận', time: '2026-06-20 19:45', description: 'Phản ánh được gửi trực tuyến vào hệ thống.', completed: true },
      { status: 'Phân công xử lý', time: '', description: 'Chờ Công an phường tiếp nhận xử lý.', completed: false },
      { status: 'Đang xác minh', time: '', description: '', completed: false },
      { status: 'Đã phản hồi', time: '', description: '', completed: false },
      { status: 'Hoàn tất', time: '', description: '', completed: false }
    ],
    rating: undefined
  },
  {
    id: 'fb-5',
    feedbackCode: 'PA2606-0005',
    title: 'Đề xuất hỗ trợ mua xe lăn cho cụ già tàn tật neo đơn',
    type: 'Đề xuất',
    field: 'Xã hội',
    priority: 'Thường',
    senderName: 'Lâm Văn Minh',
    senderPhone: '0907555666',
    senderAddress: 'Khu phố 4, Phường Chánh Hưng',
    wardGroup: 'Khu phố 4',
    content: 'Gia đình bà Nguyễn Thị Tám (82 tuổi) thuộc diện hộ cận nghèo, sống một mình tại phòng trọ nhỏ thuộc khu phố 4. Cụ bị liệt nửa người sau tai biến, hiện không đi lại được. Rất mong MTTQ phường và các nhà hảo tâm hỗ trợ tặng cụ một chiếc xe lăn cũ hoặc mới để cụ có thể tự di chuyển nhẹ trong nhà.',
    location: 'Khu dân cư khu phố 4',
    datetime: '2026-06-18T09:00:00Z',
    status: 'Hoàn tất',
    lastUpdate: '2026-06-22T08:00:00Z',
    officer: 'Bùi Thị Hà (Chuyên viên MTTQ Phường)',
    timeline: [
      { status: 'Mới tiếp nhận', time: '2026-06-18 09:00', description: 'Hệ thống tiếp nhận đề nghị hỗ trợ an sinh xã hội.', completed: true },
      { status: 'Phân công xử lý', time: '2026-06-18 10:00', description: 'Giao Ban Công tác Mặt trận khu phố 4 xác minh hoàn cảnh cụ Tám.', completed: true },
      { status: 'Đang xác minh', time: '2026-06-19 14:00', description: 'Cán bộ xuống tận nhà trọ xác minh. Đúng thực trạng hoàn cảnh khó khăn neo đơn và cụ rất cần xe lăn.', completed: true },
      { status: 'Đã phản hồi', time: '2026-06-21 08:30', description: 'MTTQ phường đã trích từ Quỹ An sinh xã hội mua mới 01 chiếc xe lăn và trao tặng tận tay cụ Nguyễn Thị Tám.', completed: true },
      { status: 'Hoàn tất', time: '2026-06-22 08:00', description: 'Công tác chăm lo hoàn tất tốt đẹp, có hình ảnh lưu hồ sơ.', completed: true }
    ],
    rating: 5
  }
];

// Mock Public Services Guide Data
export const mockPublicServices: PublicServiceItem[] = [
  {
    id: 'ps-1',
    title: 'Đăng ký tạm trú trực tuyến',
    category: 'residence',
    categoryLabel: 'Cư trú',
    level: 'Mức độ 4',
    processingTime: '03 ngày làm việc',
    agency: 'Công an Phường Chánh Hưng',
    steps: [
      {
        stepNumber: 1,
        title: 'Chuẩn bị hồ sơ pháp lý',
        description: 'Tờ khai thay đổi thông tin cư trú (Mẫu CT01); Giấy tờ chứng minh chỗ ở hợp pháp (Hợp đồng thuê nhà, sổ hồng hoặc cam kết đồng ý của chủ hộ).'
      },
      {
        stepNumber: 2,
        title: 'Nộp hồ sơ trực tuyến',
        description: 'Truy cập Cổng dịch vụ công Quốc gia hoặc Cổng dịch vụ công Bộ Công an, đăng nhập tài khoản định danh VNeID cấp độ 2, chọn mục Đăng ký tạm trú và tải lên bản quét/ảnh chụp các giấy tờ cần thiết.'
      },
      {
        stepNumber: 3,
        title: 'Theo dõi tiến trình xử lý',
        description: 'Nhận tin nhắn hoặc email thông báo tình trạng hồ sơ. Nếu thiếu giấy tờ, hệ thống yêu cầu bổ sung trực tuyến trong vòng 24 giờ.'
      },
      {
        stepNumber: 4,
        title: 'Nhận kết quả số hóa',
        description: 'Kết quả giải quyết sẽ được cấp dưới dạng văn bản điện tử thông báo kết quả giải quyết cư trú (CT08) gửi trực tiếp vào ví giấy tờ VNeID hoặc email.'
      }
    ]
  },
  {
    id: 'ps-2',
    title: 'Xác nhận thông tin cư trú (CT07)',
    category: 'residence',
    categoryLabel: 'Cư trú',
    level: 'Trực tuyến toàn trình',
    processingTime: '01 ngày làm việc',
    agency: 'Công an Phường Chánh Hưng',
    steps: [
      {
        stepNumber: 1,
        title: 'Khai báo thông tin',
        description: 'Nhập thông tin cá nhân của người đề nghị và các thành viên hộ gia đình nếu muốn xác nhận chung hộ.'
      },
      {
        stepNumber: 2,
        title: 'Chọn cơ quan thực hiện',
        description: 'Chọn Công an Phường Chánh Hưng để gửi trực tiếp hồ sơ xử lý nhanh chóng.'
      },
      {
        stepNumber: 3,
        title: 'Nhận kết quả bản điện tử',
        description: 'Hệ thống gửi file PDF có ký số hợp lệ của Trưởng Công an phường về tài khoản dịch vụ công cá nhân.'
      }
    ]
  },
  {
    id: 'ps-3',
    title: 'Cấp bản sao trích lục hộ tịch (Khai sinh, Khai tử, Kết hôn)',
    category: 'civil',
    categoryLabel: 'Hộ tịch',
    level: 'Mức độ 3',
    processingTime: '01 ngày làm việc',
    agency: 'Ủy ban nhân dân Phường Chánh Hưng (Bộ phận Một cửa)',
    steps: [
      {
        stepNumber: 1,
        title: 'Nộp yêu cầu',
        description: 'Điền thông tin vào mẫu đơn xin cấp bản sao trích lục trực tuyến trên hệ thống một cửa của thành phố.'
      },
      {
        stepNumber: 2,
        title: 'Đóng lệ phí trực tuyến',
        description: 'Thanh toán lệ phí trích lục (khoảng 8.000đ/bản sao) qua các cổng ví điện tử Momo, thẻ ngân hàng trực tuyến.'
      },
      {
        stepNumber: 3,
        title: 'Nhận bản giấy',
        description: 'Nhận bản sao có đóng dấu đỏ trực tiếp tại UBND phường hoặc đăng ký dịch vụ chuyển phát bưu điện về tận nhà.'
      }
    ]
  },
  {
    id: 'ps-4',
    title: 'Chứng thực bản sao từ bản chính (Sao y công chứng)',
    category: 'notary',
    categoryLabel: 'Chứng thực',
    level: 'Mức độ 3',
    processingTime: 'Trong ngày',
    agency: 'Bộ phận Tư pháp - Hộ tịch UBND Phường Chánh Hưng',
    steps: [
      {
        stepNumber: 1,
        title: 'Đặt lịch hẹn trước (Khuyên dùng)',
        description: 'Đặt giờ nộp hồ sơ trực tuyến qua ứng dụng quận để không phải xếp hàng chờ đợi.'
      },
      {
        stepNumber: 2,
        title: 'Mang bản chính đối chiếu',
        description: 'Đem các giấy tờ gốc kèm bản photo cần sao y tới gặp cán bộ tiếp nhận tại quầy Tư pháp UBND Phường.'
      },
      {
        stepNumber: 3,
        title: 'Nhận kết quả và ký biên nhận',
        description: 'Ký sổ chứng thực, nộp phí và nhận lại toàn bộ bản sao công chứng có chữ ký lãnh đạo và đóng dấu hợp pháp.'
      }
    ]
  },
  {
    id: 'ps-5',
    title: 'Đăng ký khai sinh trực tuyến',
    category: 'civil',
    categoryLabel: 'Hộ tịch',
    level: 'Mức độ 4',
    processingTime: '03 ngày làm việc',
    agency: 'Ủy ban nhân dân Phường Chánh Hưng',
    steps: [
      {
        stepNumber: 1,
        title: 'Khai sinh liên thông',
        description: 'Nộp hồ sơ liên thông gồm Khai sinh + Đăng ký thường trú cho trẻ + Cấp thẻ Bảo hiểm y tế.'
      },
      {
        stepNumber: 2,
        title: 'Tải giấy chứng sinh',
        description: 'Đính kèm tệp tin scan/ảnh chụp Giấy chứng sinh do bệnh viện cấp và Giấy đăng ký kết hôn của cha mẹ.'
      },
      {
        stepNumber: 3,
        title: 'Nhận giấy khai sinh và thẻ BHYT',
        description: 'Nhận bản cứng giấy khai sinh tại phường và thẻ BHYT gửi qua bưu điện hoàn toàn miễn phí.'
      }
    ]
  }
];

// Mock Events Calendar Data
export const mockEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Hội nghị tiếp xúc cử tri Tổ đại biểu HĐND Quận định kỳ',
    date: '2026-07-05',
    time: '08:00 - 11:30',
    location: 'Hội trường UBND Phường Chánh Hưng',
    organizer: 'Ủy ban MTTQ Việt Nam Phường Chánh Hưng',
    category: 'voter',
    categoryLabel: 'Tiếp xúc cử tri',
    description: 'Lắng nghe phản ánh, kiến nghị của cử tri phường về công tác quản lý đô thị và hạ tầng giao thông.'
  },
  {
    id: 'evt-2',
    title: 'Ngày hội Đại đoàn kết toàn dân tộc khu phố 3 điểm sáng',
    date: '2026-07-12',
    time: '18:00 - 21:00',
    location: 'Văn phòng Ban điều hành KP3',
    organizer: 'Ban công tác Mặt trận Khu phố 3',
    category: 'mttq',
    categoryLabel: 'Hoạt động MTTQ',
    description: 'Ngày hội văn hóa thể thao kết hợp tổng kết phong trào thi đua yêu nước và phát quà từ thiện.'
  },
  {
    id: 'evt-3',
    title: 'Ra quân Ngày Chủ nhật xanh xóa quảng cáo bẩn, dọn dẹp vệ sinh',
    date: '2026-07-19',
    time: '07:00 - 10:00',
    location: 'Toàn bộ các tuyến đường chính trong phường Chánh Hưng',
    organizer: 'Đoàn Thanh niên phối hợp MTTQ Phường',
    category: 'community',
    categoryLabel: 'Hoạt động cộng đồng',
    description: 'Ra quân bóc gỡ biển quảng cáo khoan cắt bê tông bẩn, dọn rác tuyến hẻm và trồng thêm cây xanh.'
  },
  {
    id: 'evt-4',
    title: 'Tập huấn hướng dẫn chuyển đổi số, làm dịch vụ công cho cư dân',
    date: '2026-07-22',
    time: '14:00 - 16:30',
    location: 'Phòng họp lầu 1 UBND Phường',
    organizer: 'Tổ công nghệ số cộng đồng phường Chánh Hưng',
    category: 'conference',
    categoryLabel: 'Hội nghị tập huấn',
    description: 'Hướng dẫn bà con cách mở tài khoản dịch vụ công, nộp hồ sơ tạm trú qua ứng dụng VNeID.'
  }
];

// Mock Document Files Data
export const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    number: '12/KH-MTTQ-CH',
    title: 'Kế hoạch tổ chức các hoạt động chào mừng Ngày hội Đại đoàn kết toàn dân tộc năm 2026',
    dateIssued: '2026-06-10',
    category: 'plan',
    categoryLabel: 'Kế hoạch',
    fileType: 'pdf',
    downloadUrl: '#'
  },
  {
    id: 'doc-2',
    number: '45/TB-MTTQ-CH',
    title: 'Thông báo lịch tiếp công dân và tiếp nhận ý kiến cử tri của thường trực Ủy ban MTTQ',
    dateIssued: '2026-06-05',
    category: 'announcement',
    categoryLabel: 'Thông báo',
    fileType: 'pdf',
    downloadUrl: '#'
  },
  {
    id: 'doc-3',
    number: '78/CV-MTTQ-CH',
    title: 'Công văn vận động đóng góp Quỹ vì người nghèo ủng hộ đồng bào khó khăn',
    dateIssued: '2026-05-20',
    category: 'dispatch',
    categoryLabel: 'Công văn',
    fileType: 'doc',
    downloadUrl: '#'
  },
  {
    id: 'doc-4',
    number: 'BM-PA-01',
    title: 'Mẫu phiếu phản ánh kiến nghị của cử tri gửi Mặt trận Tổ quốc Phường Chánh Hưng',
    dateIssued: '2026-01-15',
    category: 'template',
    categoryLabel: 'Biểu mẫu',
    fileType: 'docx',
    downloadUrl: '#'
  },
  {
    id: 'doc-5',
    number: 'HD-DVC-03',
    title: 'Tài liệu hướng dẫn đăng ký định danh điện tử VNeID và thực hiện dịch vụ công trực tuyến',
    dateIssued: '2026-03-12',
    category: 'guide',
    categoryLabel: 'Hướng dẫn',
    fileType: 'pdf',
    downloadUrl: '#'
  }
];

// Mock Staff Tasks Data for Officer Dashboard
export const mockStaffTasks: StaffWorkItem[] = [
  {
    id: 'task-1',
    title: 'Xử lý phản ánh đèn đường không sáng tại hẻm Phạm Hùng (PA2606-0012)',
    assignee: 'Nguyễn Văn An',
    deadline: '2026-07-02',
    priority: 'Cao',
    status: 'Đang xử lý'
  },
  {
    id: 'task-2',
    title: 'Liên hệ mạnh thường quân hỗ trợ xe lăn cho cụ Tám (PA2606-0005)',
    assignee: 'Bùi Thị Hà',
    deadline: '2026-06-25',
    priority: 'Trung bình',
    status: 'Hoàn thành'
  },
  {
    id: 'task-3',
    title: 'Chuẩn bị văn bản báo cáo tiếp xúc cử tri HĐND Quận Quý II',
    assignee: 'Trần Minh Trí',
    deadline: '2026-07-04',
    priority: 'Cao',
    status: 'Mới'
  },
  {
    id: 'task-4',
    title: 'Duyệt kế hoạch Ngày hội Đại đoàn kết của Khu phố 3 gửi lên',
    assignee: 'Nguyễn Văn An',
    deadline: '2026-07-05',
    priority: 'Trung bình',
    status: 'Chờ duyệt'
  },
  {
    id: 'task-5',
    title: 'Khảo sát thực địa rác thải tồn đọng quanh Chung cư Chánh Hưng (PA2606-0015)',
    assignee: 'Lê Hoàng Nam',
    deadline: '2026-06-30',
    priority: 'Cao',
    status: 'Hoàn thành'
  }
];
