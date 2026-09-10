"use client";

import React, { useState } from "react";
import DetailModal from "./DetailModal";
import { ExperienceItem } from "@/data/portfolio";
import { Briefcase, MapPin, Calendar, CheckCircle2, TrendingUp, Sparkles, Building2 } from "lucide-react";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExp?: ExperienceItem | null;
  experiences?: ExperienceItem[];
}

export default function ExperienceModal({
  isOpen,
  onClose,
  selectedExp,
  experiences = [],
}: ExperienceModalProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Filter items or show all
  const filteredExps = activeFilter === "ALL" 
    ? experiences 
    : experiences.filter((e) => e.id === activeFilter);

  // If a specific item was opened directly, ensure it's selected or visible
  const displayItems = selectedExp && activeFilter === "ALL"
    ? [selectedExp, ...experiences.filter((e) => e.id !== selectedExp.id)]
    : filteredExps;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Career Timeline & Leadership Track"
      subtitle="Chronological progression across Product Leadership, Commercial Strategy, and Enterprise Engineering"
    >
      <div className="space-y-6">
        {/* Timeline Quick Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0d0d10] border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300">
              CHRONOLOGICAL TRACK RECORD
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              All Milestones
            </button>
            {experiences.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveFilter(exp.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeFilter === exp.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {exp.shortName || exp.company.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Career Timeline */}
        <div className="relative pl-10 sm:pl-12 space-y-10 py-2">
          {/* Continuous Timeline Spine (centered at 20px on mobile, 24px on sm+) */}
          <div className="absolute left-[20px] sm:left-[24px] -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-400 via-zinc-600 to-zinc-800 pointer-events-none" />

          {displayItems.map((exp, expIdx) => (
            <div key={exp.id} className="relative group">
              {/* Major Timeline Milestone Node (spans 0-40px on mobile, 0-48px on sm+, perfectly centered at 20px / 24px) */}
              <div className="absolute -left-10 sm:-left-12 w-10 sm:w-12 top-5 flex items-center justify-center">
                {exp.isCurrent ? (
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#0a0a0c] border border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                    <span className="absolute w-6 h-6 rounded-full bg-emerald-400/20 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#121215] border border-zinc-500/80 group-hover:border-zinc-300 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                )}
              </div>

              {/* Company Timeline Milestone Card */}
              <div
                className={`rounded-2xl border transition-all ${
                  selectedExp?.id === exp.id
                    ? "bg-[#111114] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                    : "bg-[#0b0b0e] border-white/10 hover:border-white/20"
                } p-4 sm:p-6`}
              >
                {/* Milestone Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white flex-shrink-0">
                        <Building2 className="w-4 h-4 text-zinc-300" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {exp.company}
                      </h3>
                      {exp.isCurrent ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE LEADERSHIP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 flex-shrink-0">
                          PREVIOUS TRACK
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2 font-mono">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {exp.period}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Impact Summary Tag */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300 md:max-w-xs flex-shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="line-clamp-2">{exp.highlight}</span>
                  </div>
                </div>

                {/* Sub-Timeline of Roles within Organization */}
                <div className="mt-5 relative pl-4 sm:pl-6 space-y-6">
                  {/* Role sub-spine if multiple roles */}
                  {exp.roles.length > 1 && (
                    <div className="absolute left-[7px] sm:left-[11px] top-3 bottom-3 w-[1.5px] bg-zinc-800" />
                  )}

                  {exp.roles.map((role, rIdx) => (
                    <div key={rIdx} className="relative group/role">
                      {/* Sub-branch node */}
                      {exp.roles.length > 1 && (
                        <div className="absolute -left-[21px] sm:-left-[29px] top-1.5 w-3 h-3 rounded-full bg-[#18181b] border border-zinc-600 flex items-center justify-center group-hover/role:border-zinc-300">
                          <div className="w-1 h-1 rounded-full bg-zinc-400" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                            <span>{role.title}</span>
                          </h4>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 w-fit">
                            {role.period}
                          </span>
                        </div>

                        {role.subtitle && (
                          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                            {role.subtitle}
                          </p>
                        )}

                        <ul className="space-y-2 mt-3 pt-1">
                          {role.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed group-hover/role:text-zinc-200"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DetailModal>
  );
}
