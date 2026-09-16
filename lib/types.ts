// Core Type Definitions

export interface NewsItem {
  id: string;
  title: string;
  category: 'activities' | 'policy' | 'society' | 'announcements' | 'welfare';
  categoryLabel: string;
  date: string;
  tag: string;
  summary: string;
  content: string;
  image: string;
  views: number;
}

export interface TimelineEvent {
  status: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface FeedbackItem {
  id: string;
  feedbackCode: string;
  title: string;
  type: string; // 'Phản ánh' | 'Đề xuất'
  field: string; // 'Môi trường' | 'Đô thị' | 'An ninh' | 'Xã hội' | 'Khác'
  priority: 'Thấp' | 'Thường' | 'Cao' | 'Khẩn cấp';
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  wardGroup: string; // Khu phố 1 - 5
  content: string;
  location: string;
  datetime: string;
  status: 'Mới tiếp nhận' | 'Đang xử lý' | 'Chờ phản hồi' | 'Đã phản hồi' | 'Hoàn tất' | 'Quá hạn';
  lastUpdate: string;
  officer: string;
  image?: string;
  timeline: TimelineEvent[];
  rating?: number;
}

export interface PublicServiceStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface PublicServiceItem {
  id: string;
  title: string;
  category: 'residence' | 'civil' | 'insurance' | 'land' | 'welfare' | 'notary';
  categoryLabel: string;
  level: 'Mức độ 3' | 'Mức độ 4' | 'Trực tuyến toàn trình';
  processingTime: string;
  agency: string;
  steps: PublicServiceStep[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  organizer: string;
  category: 'mttq' | 'voter' | 'conference' | 'community';
  categoryLabel: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  number: string;
  title: string;
  dateIssued: string;
  category: 'announcement' | 'plan' | 'dispatch' | 'template' | 'guide';
  categoryLabel: string;
  fileType: 'pdf' | 'doc' | 'docx';
  downloadUrl: string;
}

export interface StaffWorkItem {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Hỏa tốc';
  status: 'Mới' | 'Đang xử lý' | 'Chờ duyệt' | 'Hoàn thành';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
