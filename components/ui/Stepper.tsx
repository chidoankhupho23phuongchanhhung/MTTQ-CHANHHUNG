"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function Stepper({
  steps,
  currentStep,
  className
}: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full max-w-2xl mx-auto px-4", className)}>
      {steps.map((step, idx) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            {/* Step Node */}
            <div className="flex flex-col items-center gap-2 relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2",
                  isCompleted && "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20",
                  isActive && "bg-white dark:bg-slate-900 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 ring-4 ring-blue-500/10 scale-110",
                  !isCompleted && !isActive && "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[3px]" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold whitespace-nowrap text-center max-w-[80px]",
                  isActive && "text-blue-600 dark:text-blue-400 font-bold",
                  isCompleted && "text-slate-700 dark:text-slate-300",
                  !isCompleted && !isActive && "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-[2px] mx-4 -mt-6 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-blue-600 transition-all duration-300 ease-in-out",
                    isCompleted ? "w-full" : isActive ? "w-1/2" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
