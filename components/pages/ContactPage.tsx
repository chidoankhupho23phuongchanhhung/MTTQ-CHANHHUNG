"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const { addNotification } = useAppStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      addNotification(
        'Thư liên hệ mới',
        `Cư dân ${name} vừa gửi thư liên hệ với chủ đề: "${subject || 'Liên hệ làm việc'}"`,
        'info'
      );

      // Clear form
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Liên hệ làm việc"
        subtitle="Thông tin địa chỉ trụ sở, thời gian làm việc chính thức và kênh tiếp nhận góp ý của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Left Column: Contact details & Map (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard hoverable={false} className="p-5 bg-white/40 dark:bg-slate-900/30 flex gap-4 items-start">
              <div className="p-3 bg-blue-50 text-blue-500 dark:bg-blue-950/40 rounded-xl flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Địa chỉ trụ sở:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-normal">
                  Số 142 Đường Phạm Hùng, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh
                </span>
              </div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-5 bg-white/40 dark:bg-slate-900/30 flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 rounded-xl flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Giờ làm việc:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-normal">
                  Sáng: 07:30 – 11:30 | Chiều: 13:30 – 17:00<br />
                  Từ thứ Hai đến thứ Sáu (Thứ Bảy, CN nghỉ)
                </span>
              </div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-5 bg-white/40 dark:bg-slate-900/30 flex gap-4 items-start">
              <div className="p-3 bg-amber-50 text-amber-500 dark:bg-amber-950/40 rounded-xl flex-shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Điện thoại bàn:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-normal">
                  (028) 3850 1234 - Văn phòng MTTQ<br />
                  (028) 7101 1234 - Hotline 24/7
                </span>
              </div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-5 bg-white/40 dark:bg-slate-900/30 flex gap-4 items-start">
              <div className="p-3 bg-purple-50 text-purple-500 dark:bg-purple-950/40 rounded-xl flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Hòm thư điện tử:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-normal">
                  mttq.chanhhung.q8@tphcm.gov.vn<br />
                  support.chanhhungso@gmail.com
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Interactive Map placeholder */}
          <GlassCard hoverable={false} className="p-0 overflow-hidden bg-white/40 dark:bg-slate-900/30 h-72 sm:h-96 relative">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center gap-2.5">
              <div className="p-4 bg-blue-500 text-white rounded-full animate-float shadow-lg shadow-blue-500/20">
                <MapPin className="h-7 w-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Bản đồ vị trí Ủy ban MTTQ Phường Chánh Hưng</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm leading-normal">
                Bản đồ tương tác đang tải. Địa chỉ tại giao lộ đường Phạm Hùng và đường Tạ Quang Bửu, đối diện Trung tâm Văn hóa Thể thao Quận.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Gửi thư liên hệ nhanh</h3>
          
          <GlassCard className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8 gap-3 animate-fade-in-up">
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full animate-bounce">
                  <CheckCircle className="h-9 w-9" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Gửi thư thành công!</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
                  Ý kiến góp ý, thư liên hệ của bà con đã được gửi đi thành công. Văn phòng MTTQ sẽ phản hồi sớm nhất.
                </p>
                <Button onClick={() => setSubmitted(false)} size="sm" className="mt-2 text-xs font-bold">
                  Gửi thư khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Họ và tên của bạn *"
                  placeholder="Nhập họ và tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                
                <Input
                  label="Số điện thoại *"
                  placeholder="Nhập số điện thoại"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                
                <Input
                  label="Hòm thư Email (Không bắt buộc)"
                  placeholder="Nhập địa chỉ email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Chủ đề liên hệ"
                  placeholder="Ví dụ: Liên hệ lịch họp, Góp ý..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <Textarea
                  label="Nội dung thư liên hệ *"
                  placeholder="Nhập nội dung thư liên hệ..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <Button type="submit" loading={submitting} className="w-full font-bold text-xs mt-2">
                  <Send className="h-4 w-4" /> Gửi thư liên hệ
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
