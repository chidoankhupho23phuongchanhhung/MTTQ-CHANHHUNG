"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Send, Trash2, Bot, User, CornerDownLeft, FileSignature } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import TypingIndicator from './TypingIndicator';
import QuickPrompts from './QuickPrompts';
import { cn } from '@/lib/utils';

export default function ChatPanel() {
  const { chatMessages, aiTyping, addChatMessage, setAiTyping, clearChat, setCurrentRoute } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiTyping]);

  const generateAIResponse = (userText: string) => {
    setAiTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      let aiText = '';
      const text = userText.toLowerCase();

      if (text.includes('tạm trú')) {
        aiText = 'Để đăng ký tạm trú trực tuyến tại Phường Chánh Hưng, bà con làm theo các bước sau:\n1. Chuẩn bị hồ sơ (CT01, Hợp đồng thuê nhà hoặc Sổ hồng).\n2. Truy cập Cổng dịch vụ công Bộ Công an bằng tài khoản VNeID cấp độ 2.\n3. Chọn mục "Đăng ký tạm trú", khai báo thông tin và tải ảnh chụp giấy tờ lên.\nThời gian giải quyết là 03 ngày làm việc. Tôi có thể mở hướng dẫn từng bước chi tiết tại mục "Dịch vụ công" cho bà con nhé!';
      } else if (text.includes('tiếng ồn') || text.includes('phản ánh') || text.includes('môi trường')) {
        aiText = 'Tôi ghi nhận bà con đang gặp phiền hà về tiếng ồn hoặc vệ sinh môi trường tại địa bàn. Để giải quyết nhanh chóng, bà con có thể sử dụng tính năng "Gửi phản ánh" của hệ thống.\n\nBà con có thể nhấn nút "Tạo phản ánh từ nội dung chat" ngay bên dưới để tôi tự động điền các thông tin này vào tờ khai phản ánh giúp bà con gửi tới UBND phường!';
      } else if (text.includes('chính sách') || text.includes('an sinh') || text.includes('hỗ trợ')) {
        aiText = 'Hiện tại MTTQ Phường Chánh Hưng đang triển khai nhiều chương trình an sinh xã hội ý nghĩa như: Chăm lo người cao tuổi neo đơn, Học bổng Nguyễn Hữu Thọ cho học sinh nghèo vượt khó, Hỗ trợ xe lăn/thiết bị y tế cho người khuyết tật. Bà con có thể vào mục "An sinh xã hội" để gửi đề xuất hỗ trợ hoặc đăng ký trực tiếp.';
      } else if (text.includes('tiếp xúc cử tri') || text.includes('lịch tiếp dân') || text.includes('sự kiện')) {
        aiText = 'Lịch tiếp xúc cử tri Tổ đại biểu HĐND Quận định kỳ sắp tới sẽ diễn ra vào lúc 08:00 ngày 05/07/2026 tại Hội trường UBND Phường Chánh Hưng. Bà con cử tri được kính mời tham dự đông đủ để đóng góp ý kiến xây dựng địa phương.';
      } else if (text.includes('công chứng') || text.includes('chứng thực') || text.includes('sao y')) {
        aiText = 'Thủ tục sao y chứng thực bản chính được xử lý trực tiếp trong ngày tại Bộ phận Một cửa UBND Phường Chánh Hưng. Lệ phí là 2.000đ/trang cho 2 trang đầu và 1.000đ từ trang thứ 3. Bà con nên đem theo bản chính gốc và bản photo sẵn để rút ngắn thời gian chờ đợi.';
      } else {
        aiText = 'Tôi đã nhận được thông tin từ bà con. MTTQ phường Chánh Hưng luôn sẵn sàng lắng nghe ý kiến đóng góp của cư dân để xây dựng phường nhà văn minh, nghĩa tình. Bà con có thể làm rõ hơn câu hỏi hoặc bấm chọn các gợi ý nhanh phía dưới để tôi tư vấn chính xác nhất!';
      }

      addChatMessage('ai', aiText);
      setAiTyping(false);
    }, 1200);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    addChatMessage('user', userText);
    setInputValue('');
    
    generateAIResponse(userText);
  };

  const handleSelectPrompt = (prompt: string) => {
    addChatMessage('user', prompt);
    generateAIResponse(prompt);
  };

  const handleCreateFeedbackFromChat = () => {
    // Navigate to feedback page
    setCurrentRoute('/phan-anh');
  };

  // Helper to parse line breaks into React elements
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i} className="block min-h-[0.5rem]">{line}</span>
    ));
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-blue-500 text-white animate-pulse-glow">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-none">Tổng đài viên AI</h4>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Trực tuyến 24/7
            </span>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Xóa cuộc trò chuyện"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/20 dark:bg-slate-950/5">
        {chatMessages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                isAI ? "self-start" : "self-end flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-md",
                isAI ? "bg-blue-600 shadow-blue-500/10" : "bg-slate-600 shadow-slate-500/10"
              )}>
                {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1">
                <div className={cn(
                  "p-3 rounded-2xl text-xs sm:text-sm shadow-sm border leading-relaxed",
                  isAI 
                    ? "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tl-none" 
                    : "bg-blue-600 border-blue-500 text-white rounded-tr-none"
                )}>
                  {formatMessageText(msg.text)}
                </div>
                <span className={cn(
                  "text-[9px] text-slate-400 font-medium px-1",
                  isAI ? "text-left" : "text-right"
                )}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div className="flex gap-3 self-start max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/10">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion & Prompt Actions */}
      <div className="p-4 bg-white/20 dark:bg-slate-950/20 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-3">
        {chatMessages.length > 2 && chatMessages.some(m => m.sender === 'user' && (m.text.toLowerCase().includes('tiếng ồn') || m.text.toLowerCase().includes('phản ánh') || m.text.toLowerCase().includes('môi trường') || m.text.toLowerCase().includes('hố ga') || m.text.toLowerCase().includes('đèn đường'))) && (
          <button
            onClick={handleCreateFeedbackFromChat}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl red-gold-gradient text-xs font-bold shadow-md cursor-pointer hover:opacity-95 transition-opacity active:scale-95 w-fit mx-auto"
          >
            <FileSignature className="h-4 w-4" />
            Tạo phản ánh từ nội dung chat
          </button>
        )}
        
        {chatMessages.length <= 2 && (
          <QuickPrompts onSelectPrompt={handleSelectPrompt} />
        )}

        {/* Input bar */}
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Khai báo thông tin, hỏi đáp thủ tục..."
            className="glass-input flex-1 pl-4 pr-12 py-3 text-sm focus:outline-none text-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors cursor-pointer active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
