"use client";

import React from "react";
import DetailModal from "./DetailModal";
import { Trophy, Star } from "lucide-react";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements?: any[];
  leadership?: any[];
}

export default function AchievementsModal({
  isOpen,
  onClose,
  achievements = [],
  leadership = [],
}: AchievementsModalProps) {
  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Honors, Awards & Leadership"
      subtitle="Competitions, company-wide recognitions, and community initiatives"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-mono mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Honors &amp; Awards</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0c0c0e] border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    {item.organization} • {item.year}
                  </p>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Mentorship */}
        <div className="pt-4 border-t border-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-zinc-400" />
            <span>Leadership &amp; Mentorship</span>
          </h3>

          <div className="space-y-3">
            {leadership.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0c0c0e] border border-white/5"
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-xs font-mono text-zinc-400">
                    {item.organization}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DetailModal>
  );
}
