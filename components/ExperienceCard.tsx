"use client";

import React from "react";
import { ExperienceItem } from "@/data/portfolio";
import { ArrowUpRight, Briefcase } from "lucide-react";

interface ExperienceCardProps {
  experiences?: ExperienceItem[];
  onSelectExperience: (item: ExperienceItem) => void;
  onOpenAll: () => void;
}

export default function ExperienceCard({
  experiences = [],
  onSelectExperience,
  onOpenAll,
}: ExperienceCardProps) {
  // Show top 2 flagship experiences on the card, with full list in modal
  const displayedExps = experiences.slice(0, 2);

  return (
    <div className="bento-card card-border-exp p-2.5 sm:p-3 flex flex-col justify-between relative group h-full min-h-0 overflow-hidden">
      {/* Watermark text */}
      <span className="watermark-text text-3xl select-none">EXP</span>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-zinc-300" />
              <span>EXP</span>
            </h2>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              TIMELINE
            </span>
          </div>

          <button
            onClick={onOpenAll}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5 hover:border-white/20"
            title="Expand Experience Details"
            aria-label="Expand Experience Details"
          >
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Roles Timeline Track */}
        <div className="space-y-1">
          {displayedExps.map((exp, idx) => {
            const primaryRole = exp.roles?.[0] || {
              title: "Product Lead",
              period: exp.period,
            };
            return (
              <div
                key={exp.id}
                onClick={() => onSelectExperience(exp)}
                className="group/item flex items-start gap-2.5 p-1 -mx-1 rounded-lg transition-colors hover:bg-white/[0.04] cursor-pointer"
              >
                {/* Timeline Axis Column (Guaranteed 100% Co-Axial Center) */}
                <div className="relative flex flex-col items-center flex-shrink-0 w-3.5 self-stretch pt-1">
                  {/* Connecting Spine Segment: extends from this node down to the next node */}
                  {idx < displayedExps.length - 1 && (
                    <div className="absolute top-2 -bottom-2 w-[1.5px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-emerald-400 to-zinc-600 pointer-events-none" />
                  )}

                  {/* Chronological Timeline Node */}
                  <div className="relative z-10 flex items-center justify-center w-3 h-3">
                    {exp.isCurrent ? (
                      <div className="relative flex items-center justify-center w-2.5 h-2.5">
                        <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 border border-black ring-1 ring-emerald-400/60" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#18181b] border border-zinc-500 group-hover/item:border-zinc-300 group-hover/item:bg-zinc-400 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1.5">
                    <h3 className="text-xs font-semibold text-white group-hover/item:text-white transition-colors truncate">
                      {primaryRole.title}
                    </h3>
                    <span className="text-[8.5px] font-mono px-1 py-0.2 rounded bg-white/[0.05] border border-white/10 text-zinc-300 flex-shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-[9px] font-medium text-zinc-400 tracking-wide uppercase leading-tight">
                    {exp.company}
                  </p>

                  <p className="text-[10px] text-zinc-300 line-clamp-1 group-hover/item:text-zinc-200 mt-0.5 leading-tight">
                    {exp.highlight}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-1 pt-1 border-t border-white/5 flex items-center justify-between text-[8.5px] font-mono text-zinc-500">
        <span>Click for P&amp;L metrics, team size &amp; impact</span>
        <button
          onClick={onOpenAll}
          className="text-white hover:text-zinc-300 flex items-center gap-0.5 cursor-pointer"
        >
          <span>view all ({experiences.length})</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
