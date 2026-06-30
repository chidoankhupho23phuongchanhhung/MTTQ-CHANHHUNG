"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Tabs from '../ui/Tabs';
import Input from '../ui/Input';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { mockDocuments } from '@/lib/mockData';
import { Search, Download, FileText, Eye, Check } from 'lucide-react';
import { DocumentItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'announcement', label: 'Thông báo' },
    { id: 'plan', label: 'Kế hoạch' },
    { id: 'dispatch', label: 'Công văn' },
    { id: 'template', label: 'Biểu mẫu' },
    { id: 'guide', label: 'Hướng dẫn' }
  ];

  // Filter documents
  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesTab = activeTab === 'all' || doc.category === activeTab;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Đang chuẩn bị tải về: ${title}`);
    }, 1000);
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Văn bản - Biểu mẫu mẫu"
        subtitle="Hệ thống lưu trữ công văn, thông báo hành chính, kế hoạch hoạt động và biểu mẫu mẫu của MTTQ Việt Nam Phường Chánh Hưng"
      >
        <div className="relative w-64 max-w-full">
          <Input
            placeholder="Tìm theo số hiệu, tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="py-2"
          />
        </div>
      </SectionTitle>

      {/* Tabs */}
      <Tabs
        options={categories}
        activeId={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {filteredDocs.length === 0 ? (
        <EmptyState
          title="Không tìm thấy văn bản nào"
          description="Vui lòng thử lại với mã hiệu khác hoặc thay đổi bộ lọc loại văn bản."
        />
      ) : (
        <div className="animate-fade-in-up text-left">
          <Table headers={["Số hiệu", "Tên văn bản", "Ngày ban hành", "Định dạng", "Hành động"]}>
            {filteredDocs.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-colors border-b border-slate-200/30 dark:border-slate-800/30"
              >
                <td className="px-6 py-4 font-bold text-xs text-slate-850 dark:text-white tracking-wider">
                  {doc.number}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350 max-w-[320px] truncate">
                  {doc.title}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(doc.dateIssued)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={doc.fileType === 'pdf' ? 'danger' : 'primary'}>
                    {doc.fileType.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Button
                    onClick={() => setPreviewDoc(doc)}
                    size="sm"
                    variant="ghost"
                    className="p-2 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Xem chi tiết văn bản"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </Button>
                  <Button
                    onClick={() => handleDownload(doc.id, doc.title)}
                    loading={downloadingId === doc.id}
                    size="sm"
                    variant="secondary"
                    className="p-2 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850"
                    title="Tải văn bản về"
                  >
                    {!downloadingId && <Download className="h-4 w-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>

          <div className="mt-4 text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold pl-1">
              Danh sách bao gồm {filteredDocs.length} tệp tài liệu số hóa hợp lệ
            </span>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc ? `Thông tin văn bản: ${previewDoc.number}` : ''}
        size="md"
      >
        {previewDoc && (
          <div className="flex flex-col gap-4 text-left">
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/25 border border-blue-200/40 dark:border-blue-900/30 flex items-start gap-3">
              <FileText className="h-10 w-10 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1 text-xs">
                <span className="text-[9px] uppercase font-bold text-slate-400">Tên văn bản chính thức:</span>
                <span className="font-bold text-slate-800 dark:text-white leading-normal">{previewDoc.title}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">Số hiệu:</span>
                <span className="text-slate-800 dark:text-white">{previewDoc.number}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">Ngày ban hành:</span>
                <span className="text-slate-800 dark:text-white">{formatDate(previewDoc.dateIssued)}</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-slate-400">Loại văn bản:</span>
                <span className="text-slate-800 dark:text-white">{previewDoc.categoryLabel}</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-slate-400">Định dạng file:</span>
                <span className="text-slate-800 dark:text-white uppercase">{previewDoc.fileType}</span>
              </div>
            </div>

            {/* Mock document preview screen */}
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden bg-slate-100 dark:bg-slate-950 h-56 flex flex-col items-center justify-center p-6 text-center gap-2">
              <FileText className="h-10 w-10 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Hỗ trợ đọc trực tiếp (PDF Preview)</span>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">Hệ thống đang tích hợp bộ đọc tài liệu số trực tiếp. Bà con có thể bấm tải về file để xem đầy đủ nội dung chữ ký số.</p>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button
                onClick={() => handleDownload(previewDoc.id, previewDoc.title)}
                variant="gradient"
                size="sm"
                className="flex-1 text-xs font-bold gap-1.5"
              >
                <Download className="h-4 w-4" /> Tải tệp văn bản này
              </Button>
              <Button
                onClick={() => setPreviewDoc(null)}
                variant="secondary"
                size="sm"
                className="text-xs font-bold"
              >
                Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
