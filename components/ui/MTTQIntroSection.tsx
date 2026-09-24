"use client";

import React, { useState, useEffect } from "react";
import {
  Info, Users, GitFork, Building2, ShieldCheck, Scale, Globe2,
  Sparkles, Flame, Briefcase, Heart, Award, ChevronDown, ChevronUp,
  Clock, Shield, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  IntroSettings,
  LeaderItem,
  DEFAULT_INTRO_SETTINGS,
  DEFAULT_HISTORY_CONTENT,
  getCachedIntroSettings
} from "@/lib/introSettings";

type IntroTabId = "lich-su" | "co-cau" | "ban-thuong-truc";

interface DepartmentItem {
  id: string;
  number: string;
  name: string;
  category: "chuyen-mon" | "doan-the";
  categoryLabel: string;
  icon: React.ElementType;
  badgeColor: string;
  summary: string;
  content: string;
}

const DEPARTMENTS: DepartmentItem[] = [
  {
    id: "van-phong", number: "(1)", name: "Bộ phận Văn phòng",
    category: "chuyen-mon", categoryLabel: "Bộ phận Chuyên môn",
    icon: Building2, badgeColor: "text-blue-600",
    summary: "Tham mưu, tổng hợp, hành chính quản trị, hậu cần và chuyển đổi số cơ sở dữ liệu Mặt trận.",
    content: "Có chức năng tham mưu, giúp việc, tổ chức phục vụ các hoạt động và công tác chỉ đạo, điều hành của Đảng ủy, Ủy ban, Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường. Tham mưu xây dựng chương trình làm việc và phối hợp tổ chức thực hiện chương trình làm việc của Ủy ban, Ban Thường trực và Cơ quan. Tổ chức ứng dụng triển khai chuyển đổi số, phát triển quản lý các nền tảng số về các cơ sở dữ liệu đoàn viên, hội viên, thành viên của Mặt trận Tổ quốc Việt Nam phường."
  },
  {
    id: "to-chuc-kiem-tra", number: "(2)", name: "Bộ phận Tổ chức, Kiểm tra",
    category: "chuyen-mon", categoryLabel: "Bộ phận Chuyên môn",
    icon: ShieldCheck, badgeColor: "text-amber-600",
    summary: "Tổ chức cán bộ, quản lý biên chế, thi đua khen thưởng và kiểm tra giám sát Điều lệ.",
    content: "Có chức năng tham mưu, giúp việc cho Ủy ban, Ban Thường trực Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường về công tác tổ chức, quản lý, phát triển thành viên; hướng dẫn và tổ chức các hoạt động, nghiệp vụ, thực hiện quản lý biên chế, tổ chức cán bộ; công tác kiểm tra, giám sát thi hành Điều lệ."
  },
  {
    id: "dan-chu-giam-sat", number: "(3)", name: "Bộ phận Dân chủ, Giám sát và Phản biện xã hội",
    category: "chuyen-mon", categoryLabel: "Bộ phận Chuyên môn",
    icon: Scale, badgeColor: "text-emerald-600",
    summary: "Thực hiện dân chủ, dân nguyện, pháp luật, giám sát và phản biện xã hội đối với chủ trương, chính sách.",
    content: "Có chức năng tham mưu, giúp việc chung cho Ủy ban, Ban Thường trực và các tổ chức chính trị - xã hội phường tổ chức và thực hiện về công tác dân chủ, dân nguyện, công tác pháp luật, công tác giám sát và phản biện xã hội đối với các chủ trương của Đảng, chính sách, pháp luật Nhà nước."
  },
  {
    id: "dan-toc-ton-giao", number: "(4)", name: "Bộ phận Dân tộc và Tôn giáo",
    category: "chuyen-mon", categoryLabel: "Bộ phận Chuyên môn",
    icon: Globe2, badgeColor: "text-cyan-600",
    summary: "Công tác dân tộc, tín ngưỡng, tôn giáo, đối ngoại Nhân dân và người Việt Nam ở nước ngoài.",
    content: "Có chức năng, nhiệm vụ tham mưu, giúp việc cho Ủy ban Mặt trận Tổ quốc Việt Nam phường và các tổ chức chính trị - xã hội phường về công tác dân tộc và tín ngưỡng, tôn giáo; công tác đối ngoại Nhân dân; công tác đối với người Việt Nam ở nước ngoài."
  },
  {
    id: "cong-tac-xa-hoi", number: "(5)", name: "Bộ phận Công tác xã hội",
    category: "chuyen-mon", categoryLabel: "Bộ phận Chuyên môn",
    icon: Sparkles, badgeColor: "text-purple-600",
    summary: "Phong trào thi đua, an sinh xã hội, đền ơn đáp nghĩa, cứu trợ từ thiện, quản lý quỹ và tuyên giáo.",
    content: "Có chức năng, nhiệm vụ tham mưu, giúp việc cho Đảng ủy Ủy ban Mặt trận Tổ quốc Việt Nam phường, Ban Thường trực về công tác xã hội: tổ chức các cuộc vận động, phong trào thi đua yêu nước, an sinh xã hội. Công tác tuyên giáo: tuyên truyền, lý luận chính trị, bảo vệ nền tảng tư tưởng của Đảng."
  },
  {
    id: "doan-thanh-nien", number: "(6)", name: "Đoàn TNCS Hồ Chí Minh phường",
    category: "doan-the", categoryLabel: "Tổ chức CT-XH",
    icon: Flame, badgeColor: "text-green-600",
    summary: "Tập hợp, giáo dục lý tưởng cách mạng cho thanh thiếu nhi, các phong trào hành động cách mạng tuổi trẻ.",
    content: "Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ, trực tiếp trong tập hợp, vận động đoàn viên, thanh niên tích cực học tập, lao động, nâng cao trình độ; giáo dục lý tưởng cách mạng, đạo đức, lối sống văn hóa cho thanh, thiếu nhi."
  },
  {
    id: "cong-doan", number: "(7)", name: "Công đoàn phường",
    category: "doan-the", categoryLabel: "Tổ chức CT-XH",
    icon: Briefcase, badgeColor: "text-blue-700",
    summary: "Bảo vệ quyền và lợi ích hợp pháp của công nhân, người lao động, an toàn vệ sinh lao động.",
    content: "Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Công đoàn phường trong tập hợp, vận động đoàn viên, công nhân phát huy quyền làm chủ, tích cực lao động, học tập nâng cao trình độ."
  },
  {
    id: "phu-nu", number: "(8)", name: "Hội Liên hiệp Phụ nữ phường",
    category: "doan-the", categoryLabel: "Tổ chức CT-XH",
    icon: Heart, badgeColor: "text-rose-600",
    summary: "Đại diện phụ nữ, xây dựng gia đình hạnh phúc, bình đẳng giới và bảo vệ quyền phụ nữ, trẻ em.",
    content: "Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Hội Liên hiệp Phụ nữ phường trong tập hợp, vận động hội viên, phụ nữ phát huy nội lực; đại diện các tầng lớp phụ nữ tham gia xây dựng Đảng, Nhà nước và khối đại đoàn kết toàn dân tộc."
  },
  {
    id: "cuu-chien-binh", number: "(9)", name: "Hội Cựu chiến binh phường",
    category: "doan-the", categoryLabel: "Tổ chức CT-XH",
    icon: Award, badgeColor: "text-amber-700",
    summary: "Giữ gìn bản chất Bộ đội Cụ Hồ, tham gia bảo vệ Đảng, chính quyền, hỗ trợ đồng đội.",
    content: "Tham mưu, giúp việc cho Ban Chấp hành, Ban Thường vụ Hội Cựu chiến binh phường trong công tác tập hợp, đoàn kết, vận động hội viên, Cựu chiến binh giữ gìn phẩm chất, đạo đức cách mạng, nâng cao bản lĩnh chính trị."
  }
];

export default function MTTQIntroSection({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<IntroTabId>("ban-thuong-truc");
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState<"all" | "chuyen-mon" | "doan-the">("all");

  const [settings, setSettings] = useState<IntroSettings>(DEFAULT_INTRO_SETTINGS);

  // Sync settings from cache and server API
  const loadSettings = async () => {
    const cached = getCachedIntroSettings();
    setSettings(cached);

    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.intro && Object.keys(data.intro).length > 0) {
          setSettings(prev => ({
            ...prev,
            ...data.intro,
            historyContent: data.intro.historyContent || (data.intro.historySections ? data.intro.historySections.map((s: any) => s.content).join('\n\n') : prev.historyContent),
            leaders: data.intro.leaders && data.intro.leaders.length > 0 ? data.intro.leaders : prev.leaders,
          }));
        }
      }
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    loadSettings();
    const handleUpdate = () => loadSettings();
    window.addEventListener("intro-settings-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("intro-settings-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredDepts = DEPARTMENTS.filter(d => {
    if (deptFilter === "all") return true;
    return d.category === deptFilter;
  });

  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* CỘT TRÁI: SIDEBAR 3 MỤC */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-5 bg-red-600 rounded-full flex-shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-red-600 tracking-wide uppercase">
              Giới thiệu về chúng tôi
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("lich-su")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer border",
                activeTab === "lich-su"
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}
            >
              <Info className={cn("w-4 h-4 flex-shrink-0", activeTab === "lich-su" ? "text-white" : "text-slate-500")} />
              <span>Lịch sử hình thành</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("co-cau")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer border",
                activeTab === "co-cau"
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}
            >
              <GitFork className={cn("w-4 h-4 flex-shrink-0", activeTab === "co-cau" ? "text-white" : "text-slate-500")} />
              <span>Cơ cấu tổ chức</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ban-thuong-truc")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer border",
                activeTab === "ban-thuong-truc"
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              )}
            >
              <Users className={cn("w-4 h-4 flex-shrink-0", activeTab === "ban-thuong-truc" ? "text-white" : "text-slate-500")} />
              <span>Ban thường trực</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7">

            {/* TAB: BAN THƯỜNG TRỰC */}
            {activeTab === "ban-thuong-truc" && (
              <div>
                <h3 className="text-base sm:text-lg font-black text-red-600 uppercase tracking-wide mb-1.5">
                  Danh sách Ban Thường trực
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Danh sách các đồng chí lãnh đạo Ban Thường trực Ủy ban Mặt trận Tổ quốc Việt Nam
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#205493] text-white text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 text-center w-28 sm:w-32 border-r border-blue-700/50">Chân dung</th>
                        <th className="py-3 px-4 w-44 sm:w-52 border-r border-blue-700/50">Họ và Tên</th>
                        <th className="py-3 px-4">Chức vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                      {settings.leaders.map((leader) => (
                        <tr key={leader.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 text-center align-middle border-r border-slate-200 dark:border-slate-800">
                            <div className="w-20 h-24 mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              {leader.photoUrl.endsWith(".svg") || leader.photoUrl.includes("mttq-logo") ? (
                                <img src={leader.photoUrl} alt={leader.name} className="w-12 h-12 object-contain" />
                              ) : (
                                <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover object-top" />
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-middle border-r border-slate-200 dark:border-slate-800">
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">{leader.salutation}</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white block">{leader.name}</span>
                          </td>
                          <td className="py-3.5 px-4 align-middle text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {leader.title}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-[11px] text-slate-400 italic">
                  * Dữ liệu nhân sự Ban Thường trực được cập nhật đồng bộ từ Cổng thông tin chính thức của Ủy ban Mặt trận Tổ quốc Việt Nam.
                </div>
              </div>
            )}

            {/* TAB: CƠ CẤU TỔ CHỨC */}
            {activeTab === "co-cau" && (
              <div>
                <h3 className="text-base sm:text-lg font-black text-red-600 uppercase tracking-wide mb-4">
                  Cơ cấu tổ chức và Chức năng nhiệm vụ
                </h3>

                {/* Box tóm tắt: Ghi rõ ràng 05 bộ phận chuyên môn và các tổ chức chính trị - xã hội */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-3.5">
                  <p className="text-justify leading-relaxed">
                    {settings.introText}
                  </p>
                  
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-2.5">
                    <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-blue-700 dark:text-blue-400 block mb-1">
                        🔹 05 Bộ phận Chuyên môn:
                      </span>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        (1) Bộ phận Văn phòng &bull; (2) Bộ phận Tổ chức, Kiểm tra &bull; (3) Bộ phận Dân chủ, Giám sát và Phản biện xã hội &bull; (4) Bộ phận Dân tộc và Tôn giáo &bull; (5) Bộ phận Công tác xã hội.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                        🔹 04 Tổ chức Chính trị - Xã hội và các Hội:
                      </span>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        (6) Đoàn TNCS Hồ Chí Minh phường &bull; (7) Công đoàn phường &bull; (8) Hội Liên hiệp Phụ nữ phường &bull; (9) Hội Cựu chiến binh phường.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {(["all", "chuyen-mon", "doan-the"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDeptFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                        deptFilter === f
                          ? f === "all" ? "bg-red-600 text-white border-red-600"
                            : f === "chuyen-mon" ? "bg-blue-600 text-white border-blue-600"
                            : "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {f === "all" ? "Tất cả (09 đơn vị)" : f === "chuyen-mon" ? "05 Bộ phận Chuyên môn" : "04 Tổ chức CT-XH"}
                    </button>
                  ))}
                </div>

                {/* Các box: ĐÃ BỎ THẺ GHIM PHÍA TRÊN MỖI BOX */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredDepts.map((dept) => {
                    const Icon = dept.icon;
                    const isExpanded = expandedDeptId === dept.id;
                    return (
                      <div key={dept.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                          {/* Tiêu đề & Icon trực tiếp - Không còn thẻ ghim */}
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className={cn("p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0", dept.badgeColor)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {dept.number} {dept.name}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            {dept.summary}
                          </p>
                        </div>

                        <div>
                          {isExpanded && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify mb-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg">
                              {dept.content}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? "Thu gọn" : "Xem chi tiết chức năng nhiệm vụ"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: LỊCH SỬ HÌNH THÀNH (1 NỘI DUNG DÀI XUYÊN SUỐT DUY NHẤT) */}
            {activeTab === "lich-su" && (
              <div>
                <h3 className="text-base sm:text-lg font-black text-red-600 uppercase tracking-wide mb-2">
                  Lịch sử hình thành và phát triển
                </h3>

                {/* Khẩu hiệu */}
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 mb-5 flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">
                    &quot;{settings.slogan}&quot;
                  </p>
                </div>

                {/* 1 NỘI DUNG DÀI XUYÊN SUỐT DUY NHẤT */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-6 sm:p-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-2xs space-y-4 text-justify">
                  {(settings.historyContent || DEFAULT_HISTORY_CONTENT).split(/\n\n+/).map((para, idx) => (
                    <p key={idx} className="leading-relaxed indent-4">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
