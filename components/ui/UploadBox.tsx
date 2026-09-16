"use client";

import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  label?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  accept?: string;
  className?: string;
}

export default function UploadBox({
  label,
  onChange,
  error,
  accept = "image/*,application/pdf",
  className
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (onChange) onChange(file);

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 pl-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "w-full min-h-[140px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-5 cursor-pointer transition-all bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm",
          isDragActive ? "border-blue-500 bg-blue-50/10" : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700",
          error && "border-rose-500",
          selectedFile && "border-solid border-slate-200 dark:border-slate-800"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center gap-4 w-full p-2">
            {previewUrl ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200/50 flex-shrink-0">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 flex-shrink-0">
                <File className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-full text-blue-500">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Kéo thả hoặc nhấp để tải tệp lên</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Định dạng JPG, PNG, PDF tối đa 10MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-rose-500 dark:text-rose-400 pl-1">{error}</span>
      )}
    </div>
  );
}
