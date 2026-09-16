import { LucideIcon, Shield, Flower2, FileText } from 'lucide-react';

export interface PhongTraoItem {
  id: string;
  label: string;
  shortLabel: string;
  tag: string;
  desc: string;
  iconName: 'Shield' | 'Flower2' | 'FileText';
  accent: string;
  defaultBg: string;
  route: string;
  presets: string[];
}

export const DEFAULT_PHONG_TRAO: PhongTraoItem[] = [
  {
    id: 'antq',
    label: 'Toàn dân Bảo vệ ANTQ',
    shortLabel: 'Bảo vệ ANTQ',
    tag: 'Phong trào 01',
    desc: 'Xây dựng thế trận an ninh nhân dân vững chắc, giữ vững trật tự an toàn xã hội trên địa bàn',
    iconName: 'Shield',
    accent: 'from-slate-800/90 via-slate-900/85 to-slate-950/95',
    defaultBg: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
    route: '/hoat-dong-mttq',
    presets: [
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'muonsachoa',
    label: 'Thành phố Muôn Sắc Hoa',
    shortLabel: 'Muôn Sắc Hoa',
    tag: 'Phong trào 02',
    desc: 'Chỉnh trang đô thị xanh - sạch - đẹp, tạo mảng xanh môi trường sống văn minh, thân thiện',
    iconName: 'Flower2',
    accent: 'from-pink-800/90 via-rose-900/85 to-rose-950/95',
    defaultBg: 'https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=800&auto=format&fit=crop&q=80',
    route: '/hoat-dong-mttq',
    presets: [
      'https://images.unsplash.com/photo-1490750967868-88df5691cc52?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'lam-loi',
    label: 'Quản lý, giáo dục, giúp đỡ người lầm lỗi trên địa bàn phường Chánh Hưng trong tình hình mới',
    shortLabel: 'Giúp đỡ người lầm lỗi',
    tag: 'Phong trào 03',
    desc: 'Đồng hành, hỗ trợ tái hòa nhập cộng đồng, tạo việc làm và xây dựng cuộc sống mới ấm no',
    iconName: 'FileText',
    accent: 'from-violet-800/90 via-purple-900/85 to-purple-950/95',
    defaultBg: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
    route: '/an-sinh-xa-hoi',
    presets: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const getPhongTraoIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'Shield':
      return Shield;
    case 'Flower2':
      return Flower2;
    case 'FileText':
    default:
      return FileText;
  }
};

export const getPhongTraoBg = (id: string, defaultBg: string): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`phongtrao_bg_${id}`) || defaultBg;
  }
  return defaultBg;
};

export const setPhongTraoBg = (id: string, bg: string): void => {
  if (typeof window !== 'undefined') {
    try {
      if (bg) {
        localStorage.setItem(`phongtrao_bg_${id}`, bg);
      } else {
        localStorage.removeItem(`phongtrao_bg_${id}`);
      }
    } catch (e) {
      console.warn('localStorage quota exceeded, saving to memory/fallback', e);
    }
    window.dispatchEvent(new Event('phongtrao-bg-updated'));
  }
};

export const resetPhongTraoBg = (id: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`phongtrao_bg_${id}`);
    } catch (e) {
      console.warn('localStorage remove error', e);
    }
    window.dispatchEvent(new Event('phongtrao-bg-updated'));
  }
};
