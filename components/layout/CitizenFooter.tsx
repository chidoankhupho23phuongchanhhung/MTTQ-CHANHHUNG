"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function CitizenFooter() {
  const { setCurrentRoute } = useAppStore();
  const router = useRouter();

  const links = [
    { label: 'Trang chủ', route: '/' },
    { label: 'Giới thiệu', route: '/hoat-dong-mttq' },
    { label: 'Tin tức - Sự kiện', route: '/tin-tuc' },
    { label: 'An sinh xã hội', route: '/an-sinh-xa-hoi' },
    { label: 'Kiến nghị phản ánh', route: '/phan-anh' },
    { label: 'Không gian VH HCM', route: '/khong-gian-van-hoa-hcm' },
    { label: 'Văn bản mẫu', route: '/van-ban-bieu-mau' },
    { label: 'Liên hệ', route: '/lien-he' }
  ];

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    router.push(route);
  };

  return (
    <footer className="w-full bg-[#07152c]/90 text-white/90 border-t border-white/10 mt-12 py-10 px-4 sm:px-6 relative overflow-hidden backdrop-blur-md">
      {/* Decorative ambient gold glow */}
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-yellow-500/10 filter blur-2xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs sm:text-sm">
        {/* Col 1: Brand & Emblem */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/mttq-logo.png" 
              alt="Logo MTTQ" 
              className="w-8 h-8 object-contain" 
            />
            <div className="flex flex-col text-left">
              <h4 className="font-black uppercase tracking-wider text-xs leading-none">Ủy ban MTTQ Việt Nam</h4>
              <span className="text-[10px] text-yellow-400 font-bold uppercase mt-1">Phường Chánh Hưng, Quận 8</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hệ thống Mặt trận số thông minh - Nền tảng số hóa hỗ trợ công tác quản lý chỉ đạo nghiệp vụ, tiếp nhận phản ánh, đề xuất kiến nghị và bảo trợ an sinh xã hội cho bà con cử dân địa phương.
          </p>
        </div>

        {/* Col 2: Site Map Link Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase text-yellow-400 tracking-wider">Sơ đồ Cổng thông tin</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
            {links.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate(link.route)}
                className="hover:text-yellow-400 transition-colors cursor-pointer text-left font-semibold text-slate-350"
              >
                ➔ {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: Contact Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black uppercase text-yellow-400 tracking-wider">Thông tin liên lạc</h4>
          <div className="flex flex-col gap-2.5 text-[11px] text-slate-350">
            <span className="flex items-start gap-2 leading-relaxed">
              <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>Số 142 Phạm Hùng, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh</span>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span>Điện thoại: (028) 3850 1234 - Hotline: (028) 7101 1234</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span>mttq.chanhhung.q8@tphcm.gov.vn</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom copy row */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-semibold pl-1">
        <span>© 2026 Bản quyền thuộc về Ủy ban MTTQ Việt Nam Phường Chánh Hưng, Quận 8.</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Hệ thống số hóa bảo mật và xác thực công dân liên thông</span>
        </span>
      </div>
    </footer>
  );
}
