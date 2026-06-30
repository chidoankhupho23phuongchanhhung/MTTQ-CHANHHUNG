"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import ChatPanel from '../ai/ChatPanel';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Drawer from '../ui/Drawer';
import { useAppStore } from '@/store/useAppStore';
import { 
  HelpCircle, PhoneCall, ArrowRight, Bot, Sparkles, User, 
  FileText, CheckSquare, SearchCode, ShieldAlert, Check,
  BookOpen, PlusCircle, Upload, Briefcase, FileCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  "Làm thế nào để nộp hồ sơ tạm trú online?",
  "Thời gian giải quyết phản ánh đô thị là bao lâu?",
  "Lịch tiếp công dân của lãnh đạo Mặt trận phường?",
  "Liên hệ cán bộ phụ trách Khu phố 4 như thế nào?",
  "Mức phí công chứng sao y bản chính là bao nhiêu?"
];

const prefilledDraft = `ỦY BAN MTTQ VIỆT NAM         CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
PHƯỜNG CHÁNH HƯNG                  Độc lập - Tự do - Hạnh phúc
------------------                 ---------------------------
                            Chánh Hưng, ngày 30 tháng 6 năm 2026

                              KẾ HOẠCH
                 Công tác Mặt trận quý II năm 2026

I. MỤC ĐÍCH, YÊU CẦU
- Triển khai thực hiện các nhiệm vụ trọng tâm công tác Mặt trận, phát triển đề án đô thị văn minh số.
- Vận động nhân dân địa phương tích cực tham gia các phong trào thi đua yêu nước, đẩy mạnh công tác tuyên chiền thực hiện nếp sống văn minh đô thị.

II. NỘI DUNG VÀ GIẢI PHẤP
1. Công tác tuyên truyền, vận động đại đoàn kết toàn dân tộc.
2. Tổ chức giám sát các công trình hạ tầng đô thị trên tuyến đường Phạm Hùng.`;

export default function AIAssistantPage() {
  const { addChatMessage, setAiTyping, addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'citizen' | 'staff'>('citizen');
  
  // Staff Mode States
  const [editorText, setEditorText] = useState(prefilledDraft);
  const [editorTitle, setEditorTitle] = useState('Kế hoạch công tác Mặt trận Quý II/2026');
  const [spellCheckModal, setSpellCheckModal] = useState(false);
  const [formatCheckModal, setFormatCheckModal] = useState(false);
  const [aiWorking, setAiWorking] = useState<string | null>(null);

  // FAQ handles
  const handleFAQClick = (faq: string) => {
    addChatMessage('user', faq);
    setAiTyping(true);
    setTimeout(() => {
      let aiText = '';
      const text = faq.toLowerCase();

      if (text.includes('tạm trú')) {
        aiText = 'Để đăng ký tạm trú trực tuyến tại Phường Chánh Hưng, bà con làm theo các bước sau:\n1. Chuẩn bị hồ sơ (CT01, Hợp đồng thuê nhà hoặc Sổ hồng).\n2. Truy cập Cổng dịch vụ công Bộ Công an bằng tài khoản VNeID cấp độ 2.\n3. Chọn mục "Đăng ký tạm trú", khai báo thông tin và tải ảnh chụp giấy tờ lên.\nThời gian giải quyết là 03 ngày làm việc. Tôi có thể mở hướng dẫn từng bước chi tiết tại mục "Dịch vụ công" cho bà con nhé!';
      } else if (text.includes('thời gian giải quyết') || text.includes('phản ánh')) {
        aiText = 'Thời gian giải quyết phản ánh đô thị tùy thuộc vào mức độ ưu tiên:\n- Khẩn cấp (Hố ga mất nắp, rò rỉ khí độc): xử lý rào chắn trong 2 giờ và hoàn tất trong ngày.\n- Tiêu chuẩn (Đèn hỏng, rác tồn): xử lý hoàn tất trong 3 - 5 ngày làm việc.\nBà con có thể theo dõi tiến độ chi tiết bằng mã phản ánh tại trang "Tra cứu phản ánh".';
      } else if (text.includes('lịch tiếp công dân')) {
        aiText = 'Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hưng tiếp công dân định kỳ vào ngày thứ Năm hàng tuần từ 08:00 - 11:30 sáng và 14:00 - 17:00 chiều tại Phòng Tiếp dân UBND Phường (đầu cầu thang trệt). Ngoài ra, Chủ tịch MTTQ phường sẽ tiếp đột xuất khi có yêu cầu khẩn cấp của cử dân.';
      } else if (text.includes('khu phố 4')) {
        aiText = 'Cán bộ phụ trách Ban Công tác Mặt trận Khu phố 4 là bà Nguyễn Thị Tuyết (SĐT liên lạc: 0903.888.xxx). Văn phòng Ban điều hành Khu phố 4 nằm tại địa chỉ số 142/24 Phạm Hùng. Bà Tuyết thường trực tiếp dân vào 18h00 thứ Hai đầu tháng.';
      } else if (text.includes('công chứng') || text.includes('sao y')) {
        aiText = 'Thủ tục sao y chứng thực bản chính được xử lý trực tiếp trong ngày tại Bộ phận Một cửa UBND Phường Chánh Hưng. Lệ phí là 2.000đ/trang cho 2 trang đầu và 1.000đ từ trang thứ 3. Bà con nên đem theo bản chính gốc và bản photo sẵn để rút ngắn thời gian chờ đợi.';
      } else {
        aiText = 'Tôi có thể hỗ trợ giải đáp trực tiếp thủ tục này. Xin mời bà con gửi thêm các câu hỏi liên quan.';
      }

      addChatMessage('ai', aiText);
      setAiTyping(false);
    }, 1000);
  };

  // Staff AI trigger simulation
  const triggerAIAction = (actionType: 'spell' | 'format' | 'template') => {
    setAiWorking(actionType);
    setTimeout(() => {
      setAiWorking(null);
      if (actionType === 'spell') {
        setSpellCheckModal(true);
      } else if (actionType === 'format') {
        setFormatCheckModal(true);
      } else if (actionType === 'template') {
        // chèn nhanh bộ khung mới
        const expandedTemplate = prefilledDraft + `\n\nIII. TỔ CHỨC THỰC HIỆN\n- Giao Ban Công tác Mặt trận 5 khu phố phổ biến kế hoạch.\n- Tổ chức giám sát định kỳ hàng tháng.\n- Tổng hợp báo cáo về Thường trực trước ngày 25 hàng tháng.`;
        setEditorText(expandedTemplate);
        addNotification('Trợ lý AI', 'Đã gợi ý lập kế hoạch và chèn phần III. Tổ chức thực hiện', 'success');
      }
    }, 1200);
  };

  const applySpellFix = () => {
    const fixedText = editorText
      .replace('tuyên chiền', 'tuyên truyền')
      .replace('GIẢI PHẤP', 'GIẢI PHÁP');
    setEditorText(fixedText);
    setSpellCheckModal(false);
    addNotification('Trợ lý AI', 'Đã tự động sửa các lỗi chính tả được phát hiện.', 'success');
  };

  return (
    <PageContainer>
      <SectionTitle
        title={activeTab === 'citizen' ? 'Tổng đài viên AI thông minh' : 'Trợ lý Hành chính AI cho Cán bộ'}
        subtitle={activeTab === 'citizen' ? 'Trợ lý ảo hỗ trợ tư vấn thủ tục hành chính, giải đáp kiến nghị đô thị 24/7' : 'Công cụ hỗ trợ chuyên viên soạn thảo, kiểm tra thể thức văn bản hành chính'}
      >
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setActiveTab('citizen')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === 'citizen'
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <User className="h-3.5 w-3.5" /> Người dân
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              activeTab === 'staff'
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Bot className="h-3.5 w-3.5" /> Cán bộ (AI Soạn thảo)
          </button>
        </div>
      </SectionTitle>

      {activeTab === 'citizen' ? (
        // CITIZEN CHAT VIEW
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="lg:col-span-2">
            <ChatPanel />
          </div>

          <div className="flex flex-col gap-6 text-left">
            <GlassCard className="p-5 bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-4.5 w-4.5 text-blue-500" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Câu hỏi thường gặp</h4>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFAQClick(faq)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-500/50 hover:bg-blue-50/5 text-slate-700 hover:text-blue-600 dark:border-slate-800/50 dark:hover:border-blue-500/30 dark:text-slate-350 dark:hover:text-blue-400 text-xs font-semibold text-left transition-all cursor-pointer leading-normal"
                  >
                    <span className="line-clamp-2 flex-1 pr-2">{faq}</span>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5 bg-rose-600/5 border-red-200/40 dark:bg-red-950/10 dark:border-red-900/30 flex gap-4 items-start">
              <div className="p-2.5 bg-rose-500 text-white rounded-xl flex-shrink-0 shadow-md">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Tổng đài hỗ trợ 24/7</h4>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">(028) 7101 1234</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Đường dây nóng của UBND & Mặt trận phường tiếp nhận khẩn cấp các vụ việc đe dọa an toàn hoặc sạt lở.</p>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        // STAFF AI DOCUMENT EDITOR WORKSPACE
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fade-in-up">
          {/* Main Document Editor (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <GlassCard hoverable={false} className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
              
              {/* Draft Info Header */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex-1 w-full min-w-0">
                  <Input
                    placeholder="Nhập tiêu đề dự thảo văn bản..."
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    className="font-bold text-sm bg-transparent border-none py-1 px-0 shadow-none focus:ring-0 dark:text-white"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="primary">Đang soạn thảo</Badge>
                </div>
              </div>

              {/* Editor formatting toolbar mock */}
              <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-150 dark:border-slate-900 text-slate-500 text-xs font-bold items-center select-none">
                <select className="bg-transparent font-bold border-none focus:ring-0 text-[11px] cursor-pointer text-slate-700 dark:text-slate-300 mr-2">
                  <option>Times New Roman - 14px</option>
                  <option>Arial - 12px</option>
                </select>
                <div className="h-4 w-[1px] bg-slate-250 dark:bg-slate-800 mx-1" />
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer font-extrabold px-2.5">B</button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer italic px-2.5">I</button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer underline px-2.5">U</button>
                <div className="h-4 w-[1px] bg-slate-250 dark:bg-slate-800 mx-1" />
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer px-2">Căn trái</button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer px-2">Căn giữa</button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer px-2">Căn đều</button>
              </div>

              {/* Editable Text Area */}
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full min-h-[360px] p-4 font-mono text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 focus:outline-none focus:border-blue-500/50 text-slate-850 dark:text-white leading-relaxed resize-y"
              />

              {/* Bottom Quick Action buttons */}
              <div className="flex flex-wrap gap-2.5 border-t border-slate-100 dark:border-slate-850 pt-4 mt-1">
                <Button variant="secondary" size="sm" className="text-[10px] font-bold gap-1 px-3">
                  <PlusCircle className="h-3.5 w-3.5 text-blue-500" /> Tạo văn bản mới
                </Button>
                <Button variant="secondary" size="sm" className="text-[10px] font-bold gap-1 px-3">
                  <Upload className="h-3.5 w-3.5 text-slate-400" /> Tải lên tài liệu
                </Button>
                <Button variant="secondary" size="sm" className="text-[10px] font-bold gap-1 px-3">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Mẫu văn bản
                </Button>
                <Button variant="secondary" size="sm" className="text-[10px] font-bold gap-1 px-3">
                  <FileCode className="h-3.5 w-3.5 text-slate-400" /> Tra cứu VBPL
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: AI Assistant for Drafting */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Trợ lý AI biên tập văn bản</h3>

            <GlassCard hoverable={false} className="p-5 bg-gradient-to-br from-blue-600/5 via-blue-600/[0.02] to-amber-600/[0.02] border-blue-200/50 dark:border-blue-900/30 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-200/30 pb-3">
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse-glow" />
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Tính năng trợ lý AI</span>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => triggerAIAction('template')}
                  loading={aiWorking === 'template'}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-bold justify-start gap-2 bg-white/50"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Gợi ý xây dựng kế hoạch
                </Button>

                <Button
                  onClick={() => triggerAIAction('format')}
                  loading={aiWorking === 'format'}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-bold justify-start gap-2 bg-white/50"
                >
                  <CheckSquare className="h-4 w-4 text-blue-500" />
                  Kiểm tra thể thức văn bản
                </Button>

                <Button
                  onClick={() => triggerAIAction('spell')}
                  loading={aiWorking === 'spell'}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-bold justify-start gap-2 bg-white/50"
                >
                  <SearchCode className="h-4 w-4 text-rose-500" />
                  Phát hiện lỗi chính tả & trình bày
                </Button>
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-200/30 dark:border-slate-800/40 text-[11px] text-slate-400 leading-normal">
                <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Mẹo nghiệp vụ:</span>
                Các dự thảo văn bản lưu trữ dưới dạng chuẩn. Trợ lý AI giúp tối ưu hóa từ ngữ, chuẩn hóa thể thức trước khi trình lãnh đạo Mặt trận ký số điện tử.
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Spellcheck suggestions Modal */}
      <Modal
        isOpen={spellCheckModal}
        onClose={() => setSpellCheckModal(false)}
        title="AI phát hiện lỗi chính tả & trình bày"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-left text-xs sm:text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-350">
            Trợ lý AI quét được 2 lỗi chữ và đề xuất thay thế:
          </p>

          <div className="flex flex-col gap-2">
            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-200/50 dark:border-rose-900/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Từ gốc phát hiện:</span>
                <span className="font-bold text-rose-600">tuyên chiền</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400">Gợi ý sửa đổi:</span>
                <span className="font-bold text-emerald-600">tuyên truyền</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-200/50 dark:border-rose-900/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">Từ gốc phát hiện:</span>
                <span className="font-bold text-rose-600 uppercase">GIẢI PHẤP</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400">Gợi ý sửa đổi:</span>
                <span className="font-bold text-emerald-600 uppercase">GIẢI PHÁP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={applySpellFix} variant="gradient" size="sm" className="flex-1 font-bold text-xs gap-1">
              <Check className="h-4 w-4" /> Áp dụng tất cả sửa đổi
            </Button>
            <Button onClick={() => setSpellCheckModal(false)} variant="secondary" size="sm" className="text-xs font-bold">
              Bỏ qua
            </Button>
          </div>
        </div>
      </Modal>

      {/* Format checklist Modal */}
      <Modal
        isOpen={formatCheckModal}
        onClose={() => setFormatCheckModal(false)}
        title="AI kiểm tra thể thức văn bản"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-left text-xs sm:text-sm">
          <p className="font-semibold text-slate-700 dark:text-slate-350">
            Kết quả đánh giá thể thức dự thảo theo quy chuẩn Nghị định 30/2020/NĐ-CP:
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-semibold">Quốc hiệu & Tiêu ngữ</span>
              <Badge variant="success">Hợp lệ (Căn giữa)</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-semibold">Địa danh & Ngày tháng ban hành</span>
              <Badge variant="success">Hợp lệ</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-semibold">Định dạng lề giấy (Margin)</span>
              <Badge variant="warning">Chưa chuẩn (Lề phải 12mm)</Badge>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="font-semibold">Bố cục và Tên loại văn bản</span>
              <Badge variant="success">Hợp lệ</Badge>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={() => setFormatCheckModal(false)} size="sm">
              Đồng ý
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
