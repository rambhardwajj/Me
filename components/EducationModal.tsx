"use client";

import React from "react";
import DetailModal from "./DetailModal";
import { GraduationCap, MapPin, Calendar, CheckCircle2 } from "lucide-react";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: any[];
}

export default function EducationModal({
  isOpen,
  onClose,
  education = [],
}: EducationModalProps) {
  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Education & Background"
      subtitle="Academic foundation, specialized business-tech programs, and honors"
    >
      <div className="space-y-4">
        {education.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#0c0c0e] border border-white/5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-zinc-300" />
                  <span>{item.institution}</span>
                </h3>
                <p className="text-xs font-medium text-zinc-300 mt-0.5">
                  {item.degree}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.period}
                </span>
              </div>
            </div>

            <ul className="space-y-1.5 pt-1">
              {item.highlights.map((h: string, hIdx: number) => (
                <li
                  key={hIdx}
                  className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DetailModal>
  );
}
