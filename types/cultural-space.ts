export interface TimelineNode {
  id: string;
  year: string;
  title: string;
  description: string;
  photoUrl: string;
  details?: string;
  category: 'tuoi-tre' | 'cuu-nuoc' | 'doc-lap' | 'di-san';
}

export interface ArchiveItem {
  id: string;
  title: string;
  category: 'tac-pham' | 'sac-lenh' | 'thu-tin' | 'hinh-anh';
  year: string;
  description: string;
  imageUrl: string;
  tags: string[];
  dimensions?: string;
  source?: string;
}
