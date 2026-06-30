import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimelineEvent } from '@/lib/types';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({
  events,
  className
}: TimelineProps) {
  return (
    <div className={cn("flow-root", className)}>
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const isLast = eventIdx === events.length - 1;
          
          return (
            <li key={eventIdx}>
              <div className="relative pb-8">
                {/* Connecting Line */}
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-[2px] bg-slate-200 dark:bg-slate-800"
                    aria-hidden="true"
                  />
                )}
                
                <div className="relative flex space-x-3 items-start">
                  {/* Icon Circle */}
                  <div>
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-900",
                        event.completed 
                          ? "bg-emerald-500 text-white" 
                          : eventIdx === events.findIndex(e => !e.completed) 
                            ? "bg-blue-500 text-white animate-pulse-glow"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}
                    >
                      {event.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : eventIdx === events.findIndex(e => !e.completed) ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Circle className="h-4 w-4 stroke-[3px]" />
                      )}
                    </span>
                  </div>
                  
                  {/* Content Panel */}
                  <div className="flex-1 min-w-0 pt-1.5 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                    <div>
                      <p className={cn(
                        "text-sm font-bold",
                        event.completed ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-500"
                      )}>
                        {event.status}
                      </p>
                      {event.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                          {event.description}
                        </p>
                      )}
                    </div>
                    {event.time && (
                      <div className="text-right text-xs whitespace-nowrap text-slate-400 dark:text-slate-500 mt-1 sm:mt-1.5 font-medium">
                        {event.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
