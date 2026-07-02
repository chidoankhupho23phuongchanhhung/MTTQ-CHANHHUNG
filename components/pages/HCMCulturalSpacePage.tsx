"use client";

import React, { useState, useEffect } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { 
  Compass, Hammer, Calendar, Mail, Send, Award, 
  CheckCircle2, Loader2, Sparkles, Lightbulb, Map
} from 'lucide-react';

interface DevelopmentPhase {
  title: string;
  desc: string;
  status: 'completed' | 'in-progress' | 'planned';
  date: string;
}

const devPhases: DevelopmentPhase[] = [
  {
    title: "1. Thu thập & Phân loại tư liệu",
    desc: "Tổng hợp các tác phẩm, hình ảnh tư liệu lịch sử, di sản tinh thần của Chủ tịch Hồ Chí Minh liên quan đến địa bàn và Mặt trận.",
    status: "completed",
    date: "Tháng 04/2026"
  },
  {
    title: "2. Thiết kế Mỹ thuật & Không gian 3D",
    desc: "Dựng hình chi tiết các gian phòng trưng bày ảo, thiết lập ánh sáng nghệ thuật và vị trí đặt tượng đài trung tâm.",
    status: "completed",
    date: "Tháng 05/2026"
  },
  {
    title: "3. Lập trình tương tác VR 360°",
    desc: "Tích hợp công nghệ hình ảnh Panorama 360, gắn các điểm nóng (Hotspots) thông tin và tối ưu hóa trải nghiệm di động.",
    status: "in-progress",
    date: "Tháng 06 - 07/2026"
  },
  {
    title: "4. Kiểm thử chất lượng & Ra mắt",
    desc: "Kiểm tra tương thích trên kính VR, thiết bị di động của bà con nhân dân và chính thức mở cổng tham quan ảo.",
    status: "planned",
    date: "Tháng 08/2026"
  }
];

export default function HCMCulturalSpacePage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const { getFirestore } = await import('@/lib/firebase');
      const db = await getFirestore();
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'hcm_notifications'), {
        email,
        timestamp: new Date().toISOString()
      });
      setSubmittedEmail(true);
      setEmail('');
    } catch (err) {
      console.error("Lỗi gửi thông báo:", err);
      alert("Đã xảy ra lỗi khi gửi đăng ký. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    setSubmitting(true);
    try {
      const { getFirestore } = await import('@/lib/firebase');
      const db = await getFirestore();
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'hcm_feedbacks'), {
        feedback,
        timestamp: new Date().toISOString()
      });
      setSubmittedFeedback(true);
      setFeedback('');
    } catch (err) {
      console.error("Lỗi gửi hiến kế:", err);
      alert("Đã xảy ra lỗi khi gửi đóng góp. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Không gian văn hóa Hồ Chí Minh số"
        subtitle="Hệ thống học tập, nghiên cứu tư liệu di sản lịch sử số hóa của Bác Hồ và tham quan không gian thực tế ảo 3D"
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-left animate-fade-in-up">
        {/* Under Construction Banner */}
        <GlassCard hoverable={false} className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-red-950/40 via-red-900/10 to-transparent border border-red-500/20 rounded-3xl shadow-xl flex flex-col items-center text-center gap-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.06),transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 right-0 technical-grid opacity-10 pointer-events-none w-full h-full" />

          {/* Icon Badge */}
          <div className="relative">
            <div className="p-4 bg-red-600/15 border border-red-500/30 text-red-500 dark:text-red-400 rounded-3xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <Hammer className="h-8 w-8 animate-bounce" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-500"></span>
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/35 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest mx-auto">
              <Sparkles className="h-3 w-3" /> Đang xây dựng & phát triển số
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase mt-1 leading-tight tracking-tight">
              Không gian đang được hoàn thiện
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Gian triển lãm ảo 3D VR, số hóa các kỷ vật lịch sử quý giá và tư liệu di sản Hồ Chí Minh đang được chúng tôi tích cực lập trình và biên tập mỹ thuật để đem lại trải nghiệm sống động nhất cho bà con nhân dân.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-650 dark:text-slate-350">
              <span className="flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />
                Tiến độ lập trình hệ thống
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">75% Hoàn tất</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-1000"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </GlassCard>

        {/* 2 columns: Phases & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Phases timeline */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
              Lộ trình triển khai số hóa
            </h3>
            
            <div className="flex flex-col gap-3">
              {devPhases.map((phase, idx) => (
                <GlassCard key={idx} hoverable={false} className="p-4 bg-white/40 dark:bg-slate-900/30 flex gap-3.5 items-start">
                  <div className="mt-0.5">
                    {phase.status === 'completed' ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    ) : phase.status === 'in-progress' ? (
                      <Loader2 className="h-4.5 w-4.5 text-yellow-500 animate-spin" />
                    ) : (
                      <Calendar className="h-4.5 w-4.5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${
                        phase.status === 'completed' ? 'text-slate-700 dark:text-slate-350' : 'text-slate-850 dark:text-white'
                      }`}>
                        {phase.title}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold flex-shrink-0">{phase.date}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Interactive forms */}
          <div className="flex flex-col gap-6">
            {/* Notify Me Form */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                Đăng ký trải nghiệm sớm
              </h3>
              <GlassCard hoverable={false} className="p-5 bg-white/60 dark:bg-slate-900/40 flex flex-col gap-3">
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Để lại email để nhận thông báo tự động và đường link trải nghiệm không gian 3D VR ngay khi cổng mở cửa thử nghiệm.
                </p>

                {submittedEmail ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>Đăng ký nhận tin thành công! Chúng tôi sẽ gửi thông báo cho bà con sớm nhất.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Nhập địa chỉ email của bạn..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="py-2.5 text-xs bg-slate-50/50"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="primary" 
                      disabled={submitting} 
                      className="px-4 text-xs font-bold gap-1 rounded-xl"
                    >
                      {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                      Đăng ký
                    </Button>
                  </form>
                )}
              </GlassCard>
            </div>

            {/* Suggestion Form */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                Đóng góp ý tưởng & tư liệu
              </h3>
              <GlassCard hoverable={false} className="p-5 bg-white/60 dark:bg-slate-900/40 flex flex-col gap-3">
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Mặt trận số luôn chào đón ý kiến hiến kế hoặc các hình ảnh kỷ vật lịch sử về Bác Hồ của bà con để làm giàu thêm không gian số.
                </p>

                {submittedFeedback ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>Cảm ơn ý kiến hiến kế của bà con. Ban chỉ đạo sẽ xem xét và phản hồi!</span>
                  </div>
                ) : (
                  <form onSubmit={handleFeedback} className="flex flex-col gap-2">
                    <textarea
                      placeholder="Ý kiến hiến kế hoặc thông tin tư liệu muốn đóng góp..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-3 text-xs bg-slate-50/50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-white"
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="secondary" 
                      disabled={submitting} 
                      className="w-full text-xs font-bold gap-1 rounded-xl justify-center bg-blue-600/5 border border-blue-200/50 text-blue-600 hover:bg-blue-600/10"
                    >
                      {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      Gửi ý kiến hiến kế
                    </Button>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
