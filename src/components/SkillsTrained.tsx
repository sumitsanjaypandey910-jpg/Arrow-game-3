import React from 'react';
import { Timer } from 'lucide-react';

export const SkillsTrained: React.FC = () => {
  return (
    <div className="w-full">
      <div className="text-[11px] font-bold tracking-widest text-indigo-300/80 uppercase mb-3.5 px-1">
        Skills Trained
      </div>

      <div className="space-y-4">
        {/* Skill 1: Concentration */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#35276c]/90 border border-indigo-400/20 flex items-center justify-center shrink-0 shadow-sm">
            {/* Custom 4-way expanding arrow icon matching screenshot */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-indigo-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Top-Left */}
              <path d="M4 8V4h4" />
              <path d="M4 4l5 5" />
              {/* Top-Right */}
              <path d="M20 8V4h-4" />
              <path d="M20 4l-5 5" />
              {/* Bottom-Left */}
              <path d="M4 16v4h4" />
              <path d="M4 20l5-5" />
              {/* Bottom-Right */}
              <path d="M20 16v4h-4" />
              <path d="M20 20l-5-5" />
            </svg>
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              Concentration
            </h3>
            <p className="text-xs sm:text-[13px] text-indigo-200/75 leading-relaxed mt-0.5">
              Boost your ability to focus and filter out distractions
            </p>
          </div>
        </div>

        {/* Skill 2: Visual processing speed */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#35276c]/90 border border-indigo-400/20 flex items-center justify-center shrink-0 shadow-sm">
            <Timer className="w-5 h-5 text-indigo-200" strokeWidth={2.3} />
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              Visual processing speed
            </h3>
            <p className="text-xs sm:text-[13px] text-indigo-200/75 leading-relaxed mt-0.5">
              Boost the speed at which you process and react to visual information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
