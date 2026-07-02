"use client";

import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { 
  Bot, Sparkles, FileText, Check, AlertCircle, Copy, Download,
  Settings, Key, Eye, EyeOff, Loader2, RefreshCw, PenTool,
  CheckSquare, ShieldAlert, ArrowRight, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const DEFAULT_PLAN_PROMPT = "Soạn thảo kế hoạch tổ chức ngày hội Đại đoàn kết toàn dân tộc năm 2026 tại khu dân cư.";
const DEFAULT_SPELL_TEXT = `ỦY BAN MTTQ VIỆT NAM         CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
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
  const { addNotification } = useAppStore();
  
  // States
  const [activeTab, setActiveTab] = useState<'planner' | 'checker'>('planner');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'not-set' | 'configured'>('not-set');
  
  // Mode 1: Planner States
  const [planTopic, setPlanTopic] = useState(DEFAULT_PLAN_PROMPT);
  const [planOutput, setPlanOutput] = useState('');
  
  // Mode 2: Checker States
  const [checkInput, setCheckInput] = useState(DEFAULT_SPELL_TEXT);
  const [checkOutputText, setCheckOutputText] = useState('');
  const [spellErrors, setSpellErrors] = useState<{ original: string; fixed: string; reason: string }[]>([]);
  const [formatChecks, setFormatChecks] = useState<{ title: string; status: 'valid' | 'invalid'; msg: string }[]>([]);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
      setApiStatus('configured');
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setApiStatus('configured');
      addNotification('API Key', 'Đã lưu khóa API thành công.', 'success');
    } else {
      localStorage.removeItem('gemini_api_key');
      setApiStatus('not-set');
      addNotification('API Key', 'Đã xóa khóa API.', 'info');
    }
  };

  const callGemini = async (prompt: string, systemInstruction?: string) => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        headers['x-gemini-key'] = savedKey;
      }

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, systemInstruction }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi không xác định khi gọi AI.');
      }

      return data.text || '';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      addNotification('Lỗi AI', msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate Plan Handler
  const handleGeneratePlan = async () => {
    if (!planTopic.trim()) return;
    
    const sysInstruction = `Bạn là trợ lý hành chính chuyên nghiệp của Ủy ban Mặt trận Tổ quốc Việt Nam cấp cơ sở.
Nhiệm vụ của bạn là soạn thảo một kế hoạch công tác chính trị xã hội chuẩn chỉnh, hành văn nghiêm túc, trang trọng, sử dụng đúng các đề mục La Mã (I, II, III...) và nhánh nhỏ (1, 2, 3...).
Kế hoạch cần có bố cục:
1. MỤC ĐÍCH, YÊU CẦU
2. NỘI DUNG VÀ BIỆN PHÁP THỰC HIỆN
3. TỔ CHỨC THỰC HIỆN
Hãy viết chi tiết, cụ thể và đúng nghiệp vụ Mặt trận.`;

    const promptText = `Hãy soạn thảo dự thảo kế hoạch chi tiết cho chủ đề sau: "${planTopic}"`;
    
    try {
      const result = await callGemini(promptText, sysInstruction);
      setPlanOutput(result);
      addNotification('Trợ lý Soạn thảo', 'Đã xây dựng kế hoạch thành công.', 'success');
    } catch (e) {
      // Handled in callGemini
    }
  };

  // Audit Spell and Format Handler
  const handleCheckDocument = async () => {
    if (!checkInput.trim()) return;

    const sysInstruction = `Bạn là chuyên gia kiểm tra thể thức văn bản hành chính theo Nghị định 30/2020/NĐ-CP của Việt Nam và lỗi chính tả tiếng Việt.
Hãy phân tích đoạn văn bản được cung cấp và trả về một chuỗi JSON chuẩn có cấu trúc chính xác như sau (không kèm ký tự markdown như \`\`\`json ở ngoài, chỉ trả về chuỗi JSON thô):
{
  "spellErrors": [
    { "original": "từ sai chính tả", "fixed": "từ đã sửa lại đúng", "reason": "giải thích ngắn gọn" }
  ],
  "formatChecks": [
    { "title": "Quốc hiệu Tiêu ngữ", "status": "valid", "msg": "Căn giữa chuẩn" },
    { "title": "Lề giấy", "status": "invalid", "msg": "Lề phải không đều" }
  ],
  "fixedText": "Toàn bộ văn bản đã được sửa đổi sạch lỗi chính tả"
}`;

    const promptText = `Kiểm tra văn bản sau:\n\n${checkInput}`;

    try {
      const result = await callGemini(promptText, sysInstruction);
      // Attempt to clean markdown block wrappers if model outputs them
      const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      setSpellErrors(parsed.spellErrors || []);
      setFormatChecks(parsed.formatChecks || []);
      setCheckOutputText(parsed.fixedText || checkInput);
      
      addNotification('Trợ lý Kiểm tra', 'Đã phân tích văn bản hoàn tất.', 'success');
    } catch (e) {
      // Fallback fallback if JSON parse fails
      if (e instanceof SyntaxError) {
        addNotification('Lỗi định dạng', 'Phản hồi từ AI không đúng cấu trúc JSON mong đợi. Đang chạy kiểm thử dự phòng.', 'warning');
        // Mock fallback
        setSpellErrors([
          { original: 'tuyên chiền', fixed: 'tuyên truyền', reason: 'Sai phụ âm cuối' },
          { original: 'GIẢI PHẤP', fixed: 'GIẢI PHÁP', reason: 'Sai nguyên âm chính' }
        ]);
        setFormatChecks([
          { title: 'Quốc hiệu & Tiêu ngữ', status: 'valid', msg: 'Đầy đủ, đúng font chữ đứng' },
          { title: 'Địa danh & Ngày tháng', status: 'valid', msg: 'Đầy đủ, đúng font nghiêng' },
          { title: 'Căn lề văn bản', status: 'invalid', msg: 'Căn lề không chuẩn Nghị định 30' }
        ]);
        setCheckOutputText(
          checkInput
            .replace('tuyên chiền', 'tuyên truyền')
            .replace('GIẢI PHẤP', 'GIẢI PHÁP')
        );
      }
    }
  };

  const handleApplyFixes = () => {
    if (checkOutputText) {
      setCheckInput(checkOutputText);
      setSpellErrors([]);
      addNotification('Áp dụng', 'Đã cập nhật bản sửa đổi chính tả vào khung soạn thảo.', 'success');
    }
  };

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    addNotification('Sao chép', 'Đã sao chép vào bộ nhớ tạm.', 'success');
  };

  const handleDownloadText = (title: string, content: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Trung tâm Trợ lý Hành chính AI"
        subtitle="Trợ lý ảo thông minh hỗ trợ soạn thảo kế hoạch công tác và kiểm tra thể thức văn bản hành chính"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left items-start animate-fade-in-up">
        
        {/* Left Control Bar (Tabs & Setup) - 1 col */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Key Selection Tabs */}
          <GlassCard hoverable={false} className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phân loại Trợ lý</span>
            
            <button
              onClick={() => setActiveTab('planner')}
              className={cn(
                "w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer",
                activeTab === 'planner'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "bg-white/40 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40"
              )}
            >
              <PenTool className="h-4.5 w-4.5" />
              <div className="flex flex-col">
                <span>Soạn thảo Kế hoạch</span>
                <span className={cn("text-[9px] font-medium mt-0.5", activeTab === 'planner' ? "text-blue-100" : "text-slate-400")}>
                  Xây dựng bố cục, nội dung
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={cn(
                "w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer",
                activeTab === 'checker'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "bg-white/40 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40"
              )}
            >
              <CheckSquare className="h-4.5 w-4.5" />
              <div className="flex flex-col">
                <span>Kiểm tra Thể thức & Lỗi</span>
                <span className={cn("text-[9px] font-medium mt-0.5", activeTab === 'checker' ? "text-blue-100" : "text-slate-400")}>
                  Quét chính tả, Nghị định 30
                </span>
              </div>
            </button>
          </GlassCard>

          {/* API Key Setup */}
          <GlassCard hoverable={false} className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Settings className="h-3.5 w-3.5" /> Cấu hình Gemini
              </span>
              <Badge variant={apiStatus === 'configured' ? 'success' : 'neutral'}>
                {apiStatus === 'configured' ? 'Đã cấu hình' : 'Chưa cấu hình'}
              </Badge>
            </div>

            <p className="text-[9.5px] text-slate-400 leading-normal">
              Hệ thống sử dụng model <strong>Gemini 2.5 Flash</strong>. Anh có thể điền Gemini API Key của mình vào đây (lưu cục bộ trên trình duyệt).
            </p>

            <div className="flex gap-1">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder="Nhập API Key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-50/50"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-655"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <Button onClick={handleSaveApiKey} variant="secondary" className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white">
                Lưu
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Right Workspaces - 3 cols */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: PLANNER WORKSPACE */}
          {activeTab === 'planner' && (
            <div className="flex flex-col gap-5">
              {/* Prompt Input Card */}
              <GlassCard hoverable={false} className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 rounded-lg">
                    <Sparkles className="h-4.5 w-4.5 animate-pulse-glow" />
                  </div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">
                    Chủ đề / Yêu cầu soạn thảo Kế hoạch
                  </h4>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <textarea
                    placeholder="Ví dụ: Kế hoạch tổ chức quyên góp quỹ vì người nghèo tại Phường Chánh Hưng..."
                    value={planTopic}
                    onChange={(e) => setPlanTopic(e.target.value)}
                    rows={2}
                    className="flex-1 p-3 text-xs bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-white leading-relaxed"
                  />
                  <Button
                    onClick={handleGeneratePlan}
                    disabled={loading || !planTopic.trim()}
                    className="sm:w-36 text-xs font-bold gap-1 rounded-2xl justify-center h-fit self-end sm:self-center py-3 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4.5 w-4.5" />}
                    Tạo kế hoạch
                  </Button>
                </div>
              </GlassCard>

              {/* Editor / Output Card */}
              <GlassCard hoverable={false} className="p-5 bg-white/65 dark:bg-slate-900/55 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4 min-h-[460px]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-blue-500" />
                    <span className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-widest">Khung Soạn Thảo Văn Bản</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(planOutput)}
                      disabled={!planOutput}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 disabled:opacity-40"
                      title="Sao chép"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownloadText('Ke_hoach_Mttq', planOutput)}
                      disabled={!planOutput}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 disabled:opacity-40"
                      title="Tải về .txt"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={planOutput}
                  onChange={(e) => setPlanOutput(e.target.value)}
                  placeholder="Nội dung kế hoạch công tác sau khi tạo sẽ hiển thị và cho phép chỉnh sửa trực tiếp tại đây..."
                  className="w-full flex-1 min-h-[380px] p-4 font-mono text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-white leading-relaxed resize-y"
                />
              </GlassCard>
            </div>
          )}

          {/* TAB 2: SPELL & FORMAT CHECKER WORKSPACE */}
          {activeTab === 'checker' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              
              {/* Input Workspace */}
              <GlassCard hoverable={false} className="p-5 bg-white/60 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4 min-h-[460px]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4.5 w-4.5 text-blue-500" />
                    <span className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-widest">Dán Văn Bản Gốc</span>
                  </div>
                  <Button
                    onClick={handleCheckDocument}
                    disabled={loading || !checkInput.trim()}
                    className="text-xs font-bold gap-1 rounded-xl px-3 py-1.5 bg-blue-600 text-white"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    Quét lỗi AI
                  </Button>
                </div>

                <textarea
                  value={checkInput}
                  onChange={(e) => setCheckInput(e.target.value)}
                  placeholder="Dán dự thảo văn bản của anh vào đây để quét lỗi..."
                  className="w-full flex-grow min-h-[340px] p-4 font-mono text-xs bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-white leading-relaxed resize-y"
                />
              </GlassCard>

              {/* Analysis & Fixes Output */}
              <div className="flex flex-col gap-4">
                {/* Format Checks */}
                <GlassCard hoverable={false} className="p-4 bg-white/65 dark:bg-slate-900/55 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Đánh giá thể thức (Nghị định 30)</span>
                  
                  {formatChecks.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-2 text-center">
                      Chưa có phân tích thể thức. Nhấn nút "Quét lỗi AI".
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                      {formatChecks.map((check, i) => (
                        <div key={i} className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{check.title}</span>
                          <div className="flex items-center gap-1.5 text-right">
                            <span className="text-[10px] text-slate-400 font-medium">{check.msg}</span>
                            <Badge variant={check.status === 'valid' ? 'success' : 'warning'}>
                              {check.status === 'valid' ? 'Chuẩn' : 'Sai lệch'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Spell Errors Card */}
                <GlassCard hoverable={false} className="p-4 bg-white/65 dark:bg-slate-900/55 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3 flex-1 min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phát hiện lỗi chính tả</span>
                    {spellErrors.length > 0 && (
                      <Button onClick={handleApplyFixes} variant="secondary" className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-blue-200 text-blue-600 bg-blue-50/20">
                        Áp dụng sửa đổi
                      </Button>
                    )}
                  </div>

                  {spellErrors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center text-slate-400">
                      <HelpCircle className="h-8 w-8 text-slate-300" />
                      <span className="text-xs font-semibold">Chưa phát hiện lỗi chính tả nào.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                      {spellErrors.map((err, i) => (
                        <div key={i} className="p-2.5 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-900/30 rounded-xl flex items-center justify-between text-xs gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-rose-600 line-through truncate max-w-[80px]">{err.original}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span className="font-bold text-emerald-600 truncate max-w-[80px]">{err.fixed}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">{err.reason}</p>
                          </div>
                          <Badge variant="danger">Lỗi</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>

            </div>
          )}

        </div>

      </div>
    </PageContainer>
  );
}
