export interface LeaderItem {
  id: string;
  salutation: string;
  name: string;
  title: string;
  photoUrl: string;
  level: 'city' | 'ward';
}

export interface HistorySectionItem {
  id: string;
  title: string;
  content: string;
  badge: string;
}

export interface IntroSettings {
  slogan: string;
  introText: string;
  introSubtext: string;
  historyContent: string;
  leaders: LeaderItem[];
  historySections?: HistorySectionItem[];
}

export const DEFAULT_LEADERS: LeaderItem[] = [
  {
    id: "loc",
    salutation: "Ông",
    name: "Nguyễn Phước Lộc",
    title: "Ủy viên Ban Chấp hành Trung ương Đảng, Phó Bí thư Thành ủy, Chủ tịch Ủy ban Mặt trận Tổ quốc Việt Nam Thành phố Hồ Chí Minh",
    photoUrl: "/leaders/nguyen-phuoc-loc.png",
    level: "city",
  },
  {
    id: "hanh",
    salutation: "Bà",
    name: "Trương Thị Bích Hạnh",
    title: "Ủy viên Ban Thường vụ Thành ủy, Phó Chủ tịch Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam Thành phố Hồ Chí Minh",
    photoUrl: "/leaders/truong-thi-bich-hanh.png",
    level: "city",
  },
  {
    id: "ward-ct",
    salutation: "Đồng chí",
    name: "Chủ tịch Ủy ban MTTQ Phường",
    title: "Ủy viên Ban Thường vụ Đảng ủy, Chủ tịch Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng",
    photoUrl: "/mttq-logo.png",
    level: "ward",
  },
  {
    id: "ward-pct",
    salutation: "Đồng chí",
    name: "Phó Chủ tịch Ủy ban MTTQ Phường",
    title: "Phó Chủ tịch Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng",
    photoUrl: "/mttq-logo.png",
    level: "ward",
  },
  {
    id: "ward-uvtt",
    salutation: "Đồng chí",
    name: "Ủy viên Thường trực MTTQ Phường",
    title: "Ủy viên Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng",
    photoUrl: "/mttq-logo.png",
    level: "ward",
  },
];

export const DEFAULT_SLOGAN = "ĐOÀN KẾT - DÂN CHỦ - ĐỔI MỚI - SÁNG TẠO - PHÁT TRIỂN";

export const DEFAULT_INTRO_TEXT = "Cơ quan Ủy ban Mặt trận Tổ quốc Việt Nam phường có chức năng tham mưu, giúp Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường quản lý, hướng dẫn hoạt động của các tổ chức chính trị - xã hội, hội quần chúng và tổ chức thành viên khác của Mặt trận Tổ quốc Việt Nam thực hiện các quy định của Đảng, Nhà nước, Điều lệ Mặt trận Tổ quốc Việt Nam và điều lệ của các tổ chức; đồng thời, là cơ quan chuyên môn, nghiệp vụ công tác Mặt trận và công tác đoàn thể, hội.";

export const DEFAULT_INTRO_SUBTEXT = "Được cơ cấu tổ chức theo 05 bộ phận chuyên môn và 04 tổ chức chính trị - xã hội, các hội do Đảng, Nhà nước giao nhiệm vụ, có tính đến những chức năng, nhiệm vụ chung, quan trọng, đặc thù.";

export const DEFAULT_HISTORY_CONTENT = `Ngày 18 tháng 11 năm 1930, Ban Thường vụ Trung ương Đảng Cộng sản Đông Dương ra chỉ thị thành lập Hội Phản đế Đồng minh - hình thức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam. Suốt chặng đường lịch sử vẻ vang gần một thế kỷ, Mặt trận đã không ngừng được củng cố và lớn mạnh qua các thời kỳ: Hội Phản đế Đồng minh (1930), Mặt trận Việt Minh (1941), Mặt trận Liên Việt (1951), Mặt trận Dân tộc Giải phóng miền Nam Việt Nam (1960), và Mặt trận Tổ quốc Việt Nam (từ 1977 đến nay).

Kế thừa và phát huy cao độ truyền thống vẻ vang đó, Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng luôn giữ vững vai trò là trung tâm khối đại đoàn kết toàn dân, là cầu nối vững chắc, tin cậy giữa Đảng bộ, chính quyền và các tầng lớp nhân dân. Dưới sự lãnh đạo trực tiếp của Đảng ủy phường, MTTQ phường luôn chủ động đổi mới nội dung, phương thức hoạt động, gắn bó mật thiết với nhân dân; đồng thời đẩy mạnh các cuộc vận động thi đua yêu nước, phát huy tinh thần tương thân tương ái, chăm lo an sinh xã hội cho nhân dân trên địa bàn.

Bước vào kỷ nguyên mới, Ủy ban MTTQ Việt Nam Phường Chánh Hưng tiên phong ứng dụng công nghệ thông tin và chuyển đổi số, xây dựng Cổng Thông tin Mặt trận số nhằm nâng cao hiệu quả giám sát, phản biện xã hội, tiếp nhận và xử lý ý kiến phản ánh của cử tri nhanh chóng, công khai, minh bạch; chung sức xây dựng Phường Chánh Hưng ngày càng văn minh, hiện đại, nghĩa tình.`;

export const DEFAULT_INTRO_SETTINGS: IntroSettings = {
  slogan: DEFAULT_SLOGAN,
  introText: DEFAULT_INTRO_TEXT,
  introSubtext: DEFAULT_INTRO_SUBTEXT,
  historyContent: DEFAULT_HISTORY_CONTENT,
  leaders: DEFAULT_LEADERS,
};

export const getCachedIntroSettings = (): IntroSettings => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('mttq_intro_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          slogan: parsed.slogan || DEFAULT_SLOGAN,
          introText: parsed.introText || DEFAULT_INTRO_TEXT,
          introSubtext: parsed.introSubtext || DEFAULT_INTRO_SUBTEXT,
          historyContent: parsed.historyContent || (parsed.historySections ? parsed.historySections.map((s: any) => s.content).join('\n\n') : DEFAULT_HISTORY_CONTENT),
          leaders: parsed.leaders && parsed.leaders.length > 0 ? parsed.leaders : DEFAULT_LEADERS,
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc intro settings từ localStorage', e);
    }
  }
  return DEFAULT_INTRO_SETTINGS;
};
