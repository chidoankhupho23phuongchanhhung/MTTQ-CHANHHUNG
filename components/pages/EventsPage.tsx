"use client";

import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { mockEvents } from '@/lib/mockData';
import { Calendar as CalendarIcon, Clock, MapPin, User, Info, CalendarDays } from 'lucide-react';
import { EventItem } from '@/lib/types';

export default function EventsPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [localActiveId, setLocalActiveId] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Tất cả sự kiện' },
    { value: 'mttq', label: 'Sự kiện MTTQ' },
    { value: 'voter', label: 'Tiếp xúc cử tri' },
    { value: 'conference', label: 'Hội nghị tập huấn' },
    { value: 'community', label: 'Hoạt động cộng đồng' }
  ];

  const filteredEvents = mockEvents.filter((item) => {
    return filterCategory === 'all' || item.category === filterCategory;
  });

  const selectedEvent = mockEvents.find(e => e.id === localActiveId);

  // Calendar render config: July 2026 (Starts Wednesday, 31 days)
  const daysInMonth = 31;
  const startDayOffset = 2; // Wednesday starts index 2 (Mon=0, Tue=1, Wed=2)
  const calendarSlots = Array.from({ length: daysInMonth + startDayOffset });

  // Map events to day numbers (July 2026)
  const getEventForDay = (day: number) => {
    return mockEvents.filter(e => {
      const parts = e.date.split('-');
      return parseInt(parts[0]) === 2026 && parseInt(parts[1]) === 7 && parseInt(parts[2]) === day;
    });
  };

  return (
    <PageContainer>
      <SectionTitle
        title="Lịch sự kiện & Công tác"
        subtitle="Quản lý thời gian, địa điểm các buổi hội họp tiếp dân, ngày hội đại đoàn kết và hoạt động tập huấn của Phường Chánh Hưng"
      >
        <Select
          options={categories}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-48 py-1.5"
        />
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4 text-left">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="h-4.5 w-4.5 text-slate-400" />
            Tháng 7 / 2026
          </h3>
          
          <GlassCard hoverable={false} className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            {/* Calendar header days */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-2">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span>CN</span>
            </div>
            
            {/* Calendar slots */}
            <div className="grid grid-cols-7 gap-2">
              {calendarSlots.map((_, idx) => {
                const dayNumber = idx - startDayOffset + 1;
                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                const dayEvents = isValidDay ? getEventForDay(dayNumber) : [];
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (hasEvents) {
                        setLocalActiveId(dayEvents[0].id);
                      }
                    }}
                    className={`min-h-[72px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${
                      isValidDay 
                        ? hasEvents
                          ? "bg-blue-600/5 border-blue-500/30 dark:border-blue-400/40 hover:bg-blue-600/10 cursor-pointer"
                          : "bg-white/20 dark:bg-slate-900/20 border-slate-200/20 dark:border-slate-800/20"
                        : "bg-transparent border-transparent pointer-events-none"
                    }`}
                  >
                    {isValidDay && (
                      <span className={`text-xs font-extrabold ${hasEvents ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {dayNumber}
                      </span>
                    )}
                    
                    {/* Event indicators inside grid cell */}
                    {hasEvents && (
                      <div className="flex flex-col gap-0.5 mt-1.5">
                        {dayEvents.map(evt => (
                          <span
                            key={evt.id}
                            className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider truncate block text-white ${
                              evt.category === 'voter' ? 'bg-amber-600' : 'bg-blue-600'
                            }`}
                            title={evt.title}
                          >
                            {evt.categoryLabel.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Events list details */}
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Danh sách sự kiện tháng 7</h3>
          
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="Không có sự kiện"
              description="Hiện tại chưa cập nhật sự kiện nào trùng khớp với bộ lọc."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredEvents.map((evt) => (
                <GlassCard
                  key={evt.id}
                  onClick={() => setLocalActiveId(evt.id)}
                  className="p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer hover:border-blue-500/50 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      {evt.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{evt.date}</span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white line-clamp-1 leading-snug">
                    {evt.title}
                  </h4>
                  
                  <div className="flex flex-col gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {evt.time}</span>
                    <span className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5" /> {evt.location}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!localActiveId}
        onClose={() => setLocalActiveId(null)}
        title={selectedEvent?.title}
        size="sm"
      >
        {selectedEvent && (
          <div className="flex flex-col gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/25 border border-blue-200/40 dark:border-blue-900/30 flex items-start gap-3">
              <CalendarIcon className="h-9 w-9 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-grow min-w-0 flex flex-col gap-1 text-xs">
                <span className="text-[9px] uppercase font-bold text-slate-400">Đơn vị chủ trì:</span>
                <span className="font-bold text-slate-800 dark:text-white leading-normal">{selectedEvent.organizer}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Thời gian:</span>
                <span className="text-slate-850 dark:text-white">{selectedEvent.time} ngày {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Địa điểm:</span>
                <span className="text-slate-850 dark:text-white truncate">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <User className="h-4 w-4 text-slate-400" />
                <span>Phân loại:</span>
                <Badge variant="primary">{selectedEvent.categoryLabel}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <h5 className="text-xs font-black text-slate-500 pl-1 uppercase tracking-wider">Mô tả chương trình</h5>
              <p className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-350 leading-relaxed leading-normal">
                {selectedEvent.description}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button onClick={() => setLocalActiveId(null)} variant="secondary" size="sm">
                Đóng lại
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
