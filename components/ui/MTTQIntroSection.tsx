"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users2, ShieldCheck, Scale, Globe2,
  Sparkles, Flame, Briefcase, Heart, Award,
  ChevronDown, CheckCircle2, Layers, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IntroDepartment {
  id: string;
  number: string;
  name: string;
  category: 'chuyen-mon' | 'doan-the';
  categoryLabel: string;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
  accentGradient: string;
  summary: string;
  content: string;
}

export const MTTQ_DEPARTMENTS: IntroDepartment[] = [
  {
    id: 'van-phong',
    number: '(1)',
    name: 'Bộ phận Văn phòng',
    category: 'chuyen-mon',
    categoryLabel: '05 Bộ phận Chuyên môn',
    icon: Building2,
    color: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    accentGradient: 'from-blue-600 to-indigo-600',
    summary: 'Tham mưu, tổng hợp, hành chính quản trị, hậu cần và chuyển đổi số cơ sở dữ liệu Mặt trận.',
    content: `Có chức năng tham mưu, giúp việc, tổ chức phục vụ các hoạt động và công tác chỉ đạo, điều hành của Đảng ủy, Ủy ban, Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường. Tham mưu xây dựng chương trình làm việc và phối hợp tổ chức thực hiện chương trình làm việc của Ủy ban, Ban Thường trực và Cơ quan; theo dõi, tổng hợp tình hình thực hiện để phục vụ công tác chỉ đạo, điều hành hoạt động. Thực hiện các nhiệm vụ về công tác tham mưu, tổng hợp; hành chính, quản trị, tài vụ; văn thư, lưu trữ, bảo vệ bí mật nhà nước; công tác quản lý, điều hành, điều phối các mối quan hệ phối hợp trong Cơ quan Mặt trận Tổ quốc Việt Nam phường; bảo đảm hậu cần phục vụ hoạt động của Ủy ban Mặt trận Tổ quốc Việt Nam phường. Tổ chức ứng dụng triển khai chuyển đổi số, phát triển quản lý các nền tảng số về các cơ sở dữ liệu đoàn viên, hội viên, thành viên của Mặt trận Tổ quốc Việt Nam phường và thực hiện hợp tác nghiên cứu ứng dụng công nghệ số trong hệ thống Mặt trận Tổ quốc Việt Nam phường.`
  },
  {
    id: 'to-chuc-kiem-tra',
    number: '(2)',
    name: 'Bộ phận Tổ chức, Kiểm tra',
    category: 'chuyen-mon',
    categoryLabel: '05 Bộ phận Chuyên môn',
    icon: ShieldCheck,
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    accentGradient: 'from-amber-600 to-orange-600',
    summary: 'Tổ chức cán bộ, quản lý biên chế, thi đua khen thưởng và kiểm tra giám sát Điều lệ.',
    content: `Có chức năng tham mưu, giúp việc cho Ủy ban, Ban Thường trực Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường về công tác tổ chức, quản lý, phát triển thành viên; hướng dẫn và tổ chức các hoạt động, nghiệp vụ, thực hiện quản lý biên chế, tổ chức cán bộ; công tác kiểm tra, giám sát thi hành Điều lệ; công tác thi đua, khen thưởng theo quy định của Đảng, pháp luật của Nhà nước và các quy định có liên quan; theo dõi, quản lý, hướng dẫn các Hội quần chúng do Đảng, Nhà nước giao nhiệm vụ ở phường.`
  },
  {
    id: 'dan-chu-giam-sat',
    number: '(3)',
    name: 'Bộ phận Dân chủ, Giám sát và Phản biện xã hội',
    category: 'chuyen-mon',
    categoryLabel: '05 Bộ phận Chuyên môn',
    icon: Scale,
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    accentGradient: 'from-emerald-600 to-teal-600',
    summary: 'Thực hiện dân chủ, dân nguyện, pháp luật, giám sát và phản biện xã hội đối với chủ trương, chính sách.',
    content: `Có chức năng tham mưu, giúp việc chung cho Ủy ban, Ban Thường trực và các tổ chức chính trị - xã hội phường tổ chức và thực hiện về công tác dân chủ, dân nguyện, công tác pháp luật, công tác giám sát và phản biện xã hội đối với các chủ trương của Đảng, chính sách, pháp luật Nhà nước.`
  },
  {
    id: 'dan-toc-ton-giao',
    number: '(4)',
    name: 'Bộ phận Dân tộc và Tôn giáo',
    category: 'chuyen-mon',
    categoryLabel: '05 Bộ phận Chuyên môn',
    icon: Globe2,
    color: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    accentGradient: 'from-cyan-600 to-blue-600',
    summary: 'Công tác dân tộc, tín ngưỡng, tôn giáo, đối ngoại Nhân dân và người Việt Nam ở nước ngoài.',
    content: `Có chức năng, nhiệm vụ tham mưu, giúp việc cho Ủy ban Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường về công tác dân tộc và tín ngưỡng, tôn giáo; công tác đối ngoại Nhân dân; công tác đối với người Việt Nam ở nước ngoài.`
  },
  {
    id: 'cong-tac-xa-hoi',
    number: '(5)',
    name: 'Bộ phận Công tác xã hội',
    category: 'chuyen-mon',
    categoryLabel: '05 Bộ phận Chuyên môn',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    accentGradient: 'from-purple-600 to-pink-600',
    summary: 'Phong trào thi đua, an sinh xã hội, đền ơn đáp nghĩa, cứu trợ từ thiện, quản lý quỹ và tuyên giáo.',
    content: `Có chức năng, nhiệm vụ tham mưu, giúp việc cho Đảng ủy Ủy ban Mặt trận Tổ quốc Việt Nam phường, Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường về công tác xã hội: tổ chức hoặc phối hợp với cơ quan nhà nước tổ chức các cuộc vận động, các phong trào thi đua yêu nước, các hoạt động xã hội mang tính toàn dân; tham gia xây dựng và thực hiện chính sách an sinh xã hội của Nhà nước, công tác đền ơn đáp nghĩa, các hoạt động cứu trợ đồng bào bị thiên tai và các hoạt động xã hội, từ thiện khác. Là đầu mối giúp Ban Thường trực Ủy ban MTTQ Việt Nam phường quản lý các loại quỹ do Mặt trận, các tổ chức chính trị - xã hội phường phát động. Công tác tuyên giáo: tuyên truyền, lý luận chính trị, bảo vệ nền tảng tư tưởng của Đảng, báo chí, văn hóa, văn nghệ, thông tin đối ngoại.`
  },
  {
    id: 'doan-thanh-nien',
    number: '(6)',
    name: 'Đoàn TNCS Hồ Chí Minh phường',
    category: 'doan-the',
    categoryLabel: '04 Tổ chức Chính trị - Xã hội',
    icon: Flame,
    color: 'text-green-600 dark:text-green-400',
    badgeBg: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    accentGradient: 'from-emerald-600 to-green-600',
    summary: 'Tập hợp, giáo dục lý tưởng cách mạng cho thanh thiếu nhi, các phong trào hành động cách mạng.',
    content: `Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ, trực tiếp trong tập hợp, vận động đoàn viên, thanh niên tích cực học tập, lao động, nâng cao trình độ, năng lực về mọi mặt; giáo dục lý tưởng cách mạng, đạo đức, lối sống văn hóa cho thanh, thiếu nhi. Triển khai các phong trào hành động cách mạng, các chương trình đồng hành với thanh thiếu nhi; công tác mở rộng mặt trận đoàn kết tập hợp, bảo vệ quyền và lợi ích hợp pháp của thanh niên; xây dựng, phát triển Hội Liên hiệp Thanh niên Việt Nam Thành phố; công tác Đoàn trong trường học và phong trào học sinh, sinh viên, giáo viên, giảng viên và trí thức trẻ; Công tác Hội và phong trào thanh niên; Công tác xây dựng Đội Thiếu niên Tiền phong Hồ Chí Minh Thành phố. Hướng dẫn, triển khai chương trình kiểm tra thực hiện Điều lệ Đoàn, công tác xây dựng tổ chức của Đoàn và bồi dưỡng, phát triển đoàn viên ưu tú giới thiệu vào Đảng.`
  },
  {
    id: 'cong-doan',
    number: '(7)',
    name: 'Công đoàn phường',
    category: 'doan-the',
    categoryLabel: '04 Tổ chức Chính trị - Xã hội',
    icon: Briefcase,
    color: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    accentGradient: 'from-blue-700 to-indigo-700',
    summary: 'Bảo vệ quyền và lợi ích hợp pháp của công nhân, người lao động, an toàn vệ sinh lao động và phúc lợi.',
    content: `Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Công đoàn phường trong tập hợp, vận động đoàn viên, công nhân phát huy quyền làm chủ, tích cực lao động, học tập nâng cao trình độ, năng lực về mọi mặt; phát động phong trào công nhân và các tổ chức công đoàn, nâng cao chất lượng nguồn nhân lực lao động. Công tác phúc lợi đoàn viên và phát triển việc làm cho người lao động; tham gia xây dựng quan hệ lao động, bảo vệ quyền lợi đoàn viên; bảo đảm an ninh trong công nhân, giữ mối quan hệ với tổ chức của người lao động tại doanh nghiệp; thẩm định và rà soát hệ thống văn bản của tổ chức công đoàn; công tác an toàn, vệ sinh lao động và công tác nữ công. Tham gia xây dựng chính sách, pháp luật về lao động, việc làm, bảo hiểm xã hội, tiền lương. Công tác tài chính, tài sản theo phân cấp và quản lý đơn vị sự nghiệp công lập, doanh nghiệp của tổ chức công đoàn; công tác kiểm tra tài chính công đoàn theo quy định. Hướng dẫn, triển khai chương trình kiểm tra thực hiện Điều lệ Công đoàn, công tác xây dựng tổ chức Công đoàn và bồi dưỡng, phát triển đội ngũ cán bộ Công đoàn.`
  },
  {
    id: 'phu-nu',
    number: '(8)',
    name: 'Hội Liên hiệp phụ nữ phường',
    category: 'doan-the',
    categoryLabel: '04 Tổ chức Chính trị - Xã hội',
    icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    accentGradient: 'from-rose-600 to-pink-600',
    summary: 'Đại diện phụ nữ, xây dựng gia đình hạnh phúc, bình đẳng giới và bảo vệ quyền phụ nữ, trẻ em.',
    content: `Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Hội Liên hiệp Phụ nữ phường trong tập hợp, vận động hội viên, phụ nữ phát huy nội lực, tích cực học tập nâng cao trình độ, năng lực; đại diện các tầng lớp phụ nữ tham gia xây dựng Đảng, Nhà nước và khối đại đoàn kết toàn dân tộc. Tổ chức các phong trào phụ nữ, xây dựng gia đình hạnh phúc, nâng cao vị thế của phụ nữ trong hệ thống chính trị. Tham gia xây dựng chính sách, pháp luật về bình đẳng giới, quyền phụ nữ, bảo vệ quyền lợi phụ nữ và trẻ em. Hướng dẫn, triển khai chương trình kiểm tra thực hiện Điều lệ Hội Phụ nữ Việt Nam, công tác xây dựng tổ chức Hội và bồi dưỡng, phát triển đội ngũ cán bộ nữ.`
  },
  {
    id: 'cuu-chien-binh',
    number: '(9)',
    name: 'Hội Cựu chiến binh phường',
    category: 'doan-the',
    categoryLabel: '04 Tổ chức Chính trị - Xã hội',
    icon: Award,
    color: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    accentGradient: 'from-amber-700 to-yellow-600',
    summary: 'Giữ gìn bản chất Bộ đội Cụ Hồ, tham gia bảo vệ Đảng, chính quyền, hỗ trợ đồng đội và giáo dục truyền thống.',
    content: `Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Hội Cựu chiến binh phường trong công tác tập hợp, đoàn kết, vận động hội viên, Cựu chiến binh giữ gìn phẩm chất, đạo đức cách mạng, nâng cao bản lĩnh chính trị, gương mẫu thực hiện các nhiệm vụ chính trị - xã hội của cách mạng; tham gia xây dựng, bảo vệ Đảng, chính quyền, chế độ XHCN, bảo vệ Nhân dân; tổ chức phong trào Cựu Chiến binh; hỗ trợ Cựu chiến binh sản xuất, kinh doanh, khởi nghiệp; hỗ trợ đồng đội khó khăn. Tham gia xây dựng chính sách, pháp luật liên quan đến Cựu chiến binh, người có công với cách mạng, bảo vệ quyền và lợi ích hợp pháp chính đáng của hội viên và Cựu chiến binh. Hướng dẫn, triển khai chương trình kiểm tra, thực hiện Điều lệ Hội Cựu chiến binh Việt Nam, công tác xây dựng tổ chức của Hội và bồi dưỡng, phát triển đội ngũ cán bộ Hội Cựu chiến binh. Phát huy vai trò của Cựu chiến binh trong giáo dục tinh thần yêu nước, truyền thống cách mạng cho thế hệ trẻ.`
  }
];

export default function MTTQIntroSection({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'all' | 'chuyen-mon' | 'doan-the'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = MTTQ_DEPARTMENTS.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className={cn("relative flex flex-col gap-6", className)}>
      {/* ── Header Introduction Card ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-red-900/90 via-red-800/80 to-amber-900/90 text-white shadow-xl border border-red-500/30">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/mttq-logo.png"
            alt="Logo MTTQ"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-lg flex-shrink-0"
          />

          <div className="flex-1 text-center md:text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-yellow-300 text-[11px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Chức năng & Nhiệm vụ Cơ quan Ủy ban MTTQ Việt Nam
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">
              Cơ quan Ủy ban Mặt trận Tổ quốc Việt Nam
              <span className="block text-yellow-300 font-extrabold text-lg sm:text-xl md:text-2xl mt-0.5">
                Phường Chánh Hưng
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed text-justify md:text-left">
              Cơ quan Ủy ban Mặt trận Tổ quốc Việt Nam phường có chức năng tham mưu, giúp Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường quản lý, hướng dẫn hoạt động của các tổ chức chính trị - xã hội, hội quần chúng và tổ chức thành viên khác của Mặt trận Tổ quốc Việt Nam thực hiện các quy định của Đảng, Nhà nước, Điều lệ Mặt trận Tổ quốc Việt Nam và điều lệ của các tổ chức; đồng thời, là cơ quan chuyên môn, nghiệp vụ công tác Mặt trận và công tác đoàn thể, hội.
            </p>

            <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/10 text-xs text-yellow-100/90 leading-relaxed">
              <strong className="text-yellow-300">Về tổ chức bộ máy:</strong> Được cơ cấu tổ chức theo <strong>05 bộ phận</strong> chuyên môn và <strong>04 tổ chức chính trị - xã hội</strong>, các hội do Đảng, Nhà nước giao nhiệm vụ, có tính đến những chức năng, nhiệm vụ chung, quan trọng, đặc thù.
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              activeTab === 'all'
                ? "bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            Tất cả (09 cơ cấu)
          </button>
          <button
            onClick={() => setActiveTab('chuyen-mon')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              activeTab === 'chuyen-mon'
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            05 Bộ phận Chuyên môn
          </button>
          <button
            onClick={() => setActiveTab('doan-the')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              activeTab === 'doan-the'
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            04 Tổ chức Chính trị - Xã hội
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Hiển thị <strong>{filteredItems.length}</strong> đơn vị bộ máy
        </span>
      </div>

      {/* ── 9 Department & Organization Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className={cn(
                "relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-150",
                "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs hover:shadow-lg group",
                isExpanded ? "ring-2 ring-red-500/30 border-red-500/40" : "border-slate-200 dark:border-slate-800"
              )}
            >
              {/* Accent top gradient line */}
              <div className={cn("absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r", item.accentGradient)} />

              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-2xl border shadow-xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className={cn("h-5 w-5", item.color)} />
                  </div>

                  <span className={cn("text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wide", item.badgeBg)}>
                    {item.number} {item.category === 'chuyen-mon' ? 'Chuyên môn' : 'Đoàn thể'}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase leading-snug tracking-tight">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              {/* Expandable Full Content */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 mb-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                        <strong className="block text-slate-900 dark:text-white mb-1.5 uppercase font-bold text-[11px]">
                          Chức năng, nhiệm vụ chi tiết:
                        </strong>
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Thu gọn nội dung' : 'Xem toàn bộ chức năng nhiệm vụ'}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
