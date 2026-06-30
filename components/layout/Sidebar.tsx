"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, Newspaper, Layers, HeartHandshake, FileText, 
  MessageSquare, Search, Bot, FolderKanban, Calendar, 
  Briefcase, Mail, ShieldAlert, Compass
} from 'lucide-react';

export default function Sidebar() {
  const { currentRoute, setCurrentRoute, viewMode, setViewMode, sidebarOpen, toggleSidebar } = useAppStore();
  const router = useRouter();

  const isStaff = viewMode === 'staff';

  const menuItems = isStaff
    ? [
        // Staff Menu Group
        { group: "Nghiệp vụ cán bộ", items: [
          { id: '/cong-lam-viec-can-bo', label: "Tổng quan điều hành", icon: Briefcase },
          { id: '/tong-dai-ai', label: "Trợ lý Hành chính AI", icon: Bot },
        ]}
      ]
    : [
        // Citizen Menu Group
        { group: "Mặt trận Chánh Hưng", items: [
          { id: '/', label: "Trang chủ", icon: Home },
          { id: '/hoat-dong-mttq', label: "Giới thiệu hoạt động", icon: Layers },
          { id: '/tin-tuc', label: "Tin tức - Sự kiện", icon: Newspaper },
          { id: '/khong-gian-van-hoa-hcm', label: "Không gian VH HCM", icon: Compass },
          { id: '/an-sinh-xa-hoi', label: "An sinh xã hội", icon: HeartHandshake },
          { id: '/dich-vu-cong', label: "Dịch vụ công trực tuyến", icon: FileText },
          { id: '/phan-anh', label: "Phản ánh & Kiến nghị", icon: MessageSquare },
          { id: '/tra-cuu-phan-anh', label: "Tra cứu kết quả", icon: Search },
          { id: '/tong-dai-ai', label: "Tổng đài hỗ trợ AI", icon: Bot },
          { id: '/van-ban-bieu-mau', label: "Văn bản biểu mẫu", icon: FolderKanban },
          { id: '/lich-su-kien', label: "Lịch sự kiện", icon: Calendar },
          { id: '/lien-he', label: "Liên hệ làm việc", icon: Mail },
        ]}
      ];

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    router.push(route);
    toggleSidebar(false); // Auto close drawer menu on navigation!
  };

  return (
    <aside className={cn(
      "animated-sidebar-bg fixed inset-y-0 left-0 z-40 w-64 flex flex-col justify-between p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-white/5 shadow-2xl",
      isStaff ? "xl:translate-x-0 xl:flex" : "md:hidden",
      sidebarOpen ? "translate-x-0 opacity-100 scale-100 flex" : "-translate-x-full opacity-0 scale-95 pointer-events-none md:pointer-events-auto"
    )}>
      {/* Embedded Animated Gradient Style Sheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sidebarGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-sidebar-bg {
          background: linear-gradient(135deg, #07152c, #11284f, #0c172a, #060e1c);
          background-size: 200% 200%;
          animation: sidebarGradientShift 12s ease infinite;
        }
      `}} />

      <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar flex-1">
        {/* Sidebar Header Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1 border-b border-white/10 pb-4">
          <img 
            src="/mttq-logo.png" 
            alt="Logo MTTQ" 
            className="w-8 h-8 object-contain" 
          />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-300">MTTQ Việt Nam</span>
            <span className="text-xs font-black text-white leading-tight uppercase">Phường Chánh Hưng</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-5">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-300 pl-3">
                {group.group}
              </span>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigate(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border",
                          isActive 
                            ? "bg-white/10 text-white font-black border-white/10 shadow-sm" 
                            : "text-slate-200 hover:bg-white/5 hover:text-white border-transparent"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-blue-400" : "text-slate-300")} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Switch Gateway Footer - Rendered only for staff officers */}
      {isStaff && (
        <div className="border-t border-white/10 pt-4 mt-4 flex flex-col gap-2">
          <button
            onClick={() => {
              setViewMode('citizen');
              setCurrentRoute('/');
              router.push('/');
              toggleSidebar(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-all border border-white/5 text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-yellow-400" />
              <span>Quay lại Cổng Dân Cư</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>
      )}
    </aside>
  );
}
