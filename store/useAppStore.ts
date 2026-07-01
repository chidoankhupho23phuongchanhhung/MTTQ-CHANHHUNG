import { create } from 'zustand';
import { FeedbackItem, ChatMessage, NewsItem } from '../lib/types';
import { mockFeedbacks } from '../lib/mockData';

interface AppState {
  // Navigation & UI Modes
  currentRoute: string;
  viewMode: 'citizen' | 'staff';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Data States
  feedbacks: FeedbackItem[];
  activeFeedbackId: string | null;
  activeNewsId: string | null;
  activePublicServiceId: string | null;
  activeEventId: string | null;
  
  // AI Chat States
  chatMessages: ChatMessage[];
  aiTyping: boolean;
  
  // Notifications
  notifications: {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
  }[];
  
  // Actions
  setCurrentRoute: (route: string) => void;
  setViewMode: (mode: 'citizen' | 'staff') => void;
  toggleTheme: () => void;
  toggleSidebar: (open?: boolean) => void;
  
  // Feedback Actions
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'feedbackCode' | 'status' | 'lastUpdate' | 'timeline' | 'officer'>) => FeedbackItem;
  updateFeedbackStatus: (id: string, status: FeedbackItem['status'], description: string, officerName?: string) => void;
  addFeedbackRating: (id: string, rating: number) => void;
  setActiveFeedbackId: (id: string | null) => void;
  
  // Modal/Drawer Actions
  setActiveNewsId: (id: string | null) => void;
  setActivePublicServiceId: (id: string | null) => void;
  setActiveEventId: (id: string | null) => void;
  
  // AI Chat Actions
  addChatMessage: (sender: 'user' | 'ai', text: string) => void;
  setAiTyping: (typing: boolean) => void;
  clearChat: () => void;
  
  // Notification Actions
  addNotification: (title: string, description: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  markNotificationsAsRead: () => void;

  // Facebook Feed Configuration
  fbPageId: string;
  fbAccessToken: string;
  setFacebookConfig: (pageId: string, accessToken: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial states
  currentRoute: '/',
  viewMode: 'citizen',
  theme: 'light',
  sidebarOpen: false,

  // Facebook Feed Config (persisted via localStorage key 'fb-config')
  fbPageId: typeof window !== 'undefined' ? (localStorage.getItem('fb-page-id') || '') : '',
  fbAccessToken: typeof window !== 'undefined' ? (localStorage.getItem('fb-access-token') || '') : '',
  
  feedbacks: mockFeedbacks,
  activeFeedbackId: null,
  activeNewsId: null,
  activePublicServiceId: null,
  activeEventId: null,
  
  chatMessages: [
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Thông minh của Mặt trận Tổ quốc Phường Chánh Hưng. Tôi có thể hỗ trợ bà con giải đáp thắc mắc về thủ tục hành chính, dịch vụ công trực tuyến, chính sách an sinh xã hội hoặc ghi nhận các phản ánh, kiến nghị đô thị. Bà con cần hỗ trợ gì hôm nay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ],
  aiTyping: false,
  
  notifications: [
    {
      id: 'notif-1',
      title: 'Phản ánh mới tiếp nhận',
      description: 'Hệ thống đã tự động ghi nhận phản ánh hố ga mất nắp của ông Phạm Minh Đức.',
      time: '15 phút trước',
      read: false,
      type: 'info'
    },
    {
      id: 'notif-2',
      title: 'Cập nhật tình hình xử lý',
      description: 'Phản ánh mã PA2606-0012 đầu hẻm Phạm Hùng đã chuyển sang trạng thái "Đang xác minh".',
      time: '1 giờ trước',
      read: false,
      type: 'success'
    },
    {
      id: 'notif-3',
      title: 'Lịch tiếp xúc cử tri sắp tới',
      description: 'Hội nghị tiếp xúc cử tri Tổ đại biểu HĐND Quận sẽ diễn ra lúc 8h00 ngày 05/07.',
      time: 'Hôm nay',
      read: true,
      type: 'warning'
    }
  ],
  
  // Navigation & Theme
  setCurrentRoute: (route) => set({ currentRoute: route, sidebarOpen: false }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),
  toggleSidebar: (open) => set((state) => ({ sidebarOpen: open !== undefined ? open : !state.sidebarOpen })),
  
  // Feedback
  addFeedback: (feedbackData) => {
    const count = get().feedbacks.length + 1;
    const padding = count.toString().padStart(4, '0');
    const feedbackCode = `PA2606-${padding}`;
    const id = `fb-${count}`;
    const nowStr = new Date().toISOString();
    const timeStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    const newFeedback: FeedbackItem = {
      ...feedbackData,
      id,
      feedbackCode,
      status: 'Mới tiếp nhận',
      lastUpdate: nowStr,
      officer: 'Đang phân công cán bộ phụ trách',
      timeline: [
        {
          status: 'Mới tiếp nhận',
          time: timeStr,
          description: 'Hệ thống đã tự động tiếp nhận phản ánh trực tuyến của công dân.',
          completed: true
        },
        {
          status: 'Phân công xử lý',
          time: '',
          description: 'Chờ chuyển tin phản ánh tới bộ phận chuyên môn.',
          completed: false
        },
        {
          status: 'Đang xác minh',
          time: '',
          description: '',
          completed: false
        },
        {
          status: 'Đã phản hồi',
          time: '',
          description: '',
          completed: false
        },
        {
          status: 'Hoàn tất',
          time: '',
          description: '',
          completed: false
        }
      ]
    };
    
    set((state) => ({
      feedbacks: [newFeedback, ...state.feedbacks]
    }));
    
    get().addNotification(
      'Phản ánh mới được gửi',
      `Người dân ${newFeedback.senderName} vừa gửi phản ánh về: "${newFeedback.title}"`,
      'info'
    );
    
    return newFeedback;
  },
  
  updateFeedbackStatus: (id, status, description, officerName) => {
    const timeStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    set((state) => ({
      feedbacks: state.feedbacks.map((fb) => {
        if (fb.id !== id) return fb;
        
        // Update timeline status
        const updatedTimeline = fb.timeline.map((step) => {
          if (step.status === status) {
            return { ...step, time: timeStr, description, completed: true };
          }
          // Mark all previous steps as completed
          const stepOrder = ['Mới tiếp nhận', 'Phân công xử lý', 'Đang xác minh', 'Đã phản hồi', 'Hoàn tất'];
          const targetIndex = stepOrder.indexOf(status);
          const currentIndex = stepOrder.indexOf(step.status);
          if (currentIndex < targetIndex && !step.completed) {
            return { ...step, completed: true, time: step.time || timeStr };
          }
          return step;
        });
        
        return {
          ...fb,
          status,
          lastUpdate: new Date().toISOString(),
          officer: officerName || fb.officer,
          timeline: updatedTimeline
        };
      })
    }));
    
    // Notify about status updates
    const targetFeedback = get().feedbacks.find(f => f.id === id);
    if (targetFeedback) {
      get().addNotification(
        'Cập nhật trạng thái phản ánh',
        `Phản ánh ${targetFeedback.feedbackCode} đã chuyển sang trạng thái "${status}".`,
        'success'
      );
    }
  },
  
  addFeedbackRating: (id, rating) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((fb) => fb.id === id ? { ...fb, rating } : fb)
    }));
  },
  
  setActiveFeedbackId: (activeFeedbackId) => set({ activeFeedbackId }),
  setActiveNewsId: (activeNewsId) => set({ activeNewsId }),
  setActivePublicServiceId: (activePublicServiceId) => set({ activePublicServiceId }),
  setActiveEventId: (activeEventId) => set({ activeEventId }),
  
  // AI Chat
  addChatMessage: (sender, text) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, newMessage]
    }));
  },
  
  setAiTyping: (aiTyping) => set({ aiTyping }),
  clearChat: () => set((state) => ({
    chatMessages: [
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Xin chào! Tôi là Trợ lý AI Thông minh của Mặt trận Tổ quốc Phường Chánh Hưng. Tôi có thể hỗ trợ bà con giải đáp thắc mắc về thủ tục hành chính, dịch vụ công trực tuyến, chính sách an sinh xã hội hoặc ghi nhận các phản ánh, kiến nghị đô thị. Bà con cần hỗ trợ gì hôm nay?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })),
  
  // Notifications
  addNotification: (title, description, type = 'info') => {
    const newNotif = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      time: 'Vừa xong',
      read: false,
      type
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },
  
  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  setFacebookConfig: (pageId: string, accessToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fb-page-id', pageId);
      localStorage.setItem('fb-access-token', accessToken);
    }
    set({ fbPageId: pageId, fbAccessToken: accessToken });
  }
}));
