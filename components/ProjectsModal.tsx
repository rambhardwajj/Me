"use client";

import React from "react";
import DetailModal from "./DetailModal";
import { ProjectItem } from "@/data/portfolio";
import { Rocket, CheckCircle2, Tag } from "lucide-react";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: ProjectItem | null;
  projects?: ProjectItem[];
}

export default function ProjectsModal({
  isOpen,
  onClose,
  selectedProject,
  projects = [],
}: ProjectsModalProps) {
  const displayProjects = selectedProject
    ? [selectedProject, ...projects.filter((p) => p.id !== selectedProject.id)]
    : projects;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ventures & Flagship Projects"
      subtitle="Startups, commercial ventures, and product engineering"
    >
      <div className="space-y-6">
        {displayProjects.map((proj) => (
          <div
            key={proj.id}
            className={`p-5 md:p-6 rounded-xl border transition-all ${
              selectedProject?.id === proj.id
                ? "bg-[#111114] border-white/20 shadow-[0_0_24px_rgba(255,255,255,0.06)]"
                : "bg-[#0c0c0e] border-white/5"
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                    <Rocket className="w-4 h-4 text-zinc-200" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {proj.title}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-200 border border-white/20">
                    {proj.role}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{proj.subtitle}</p>
              </div>

              {/* Metrics Badge */}
              <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                {proj.metrics}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-zinc-300 mt-4 leading-relaxed">
              {proj.description}
            </p>

            {/* Bullets */}
            <ul className="space-y-2 mt-4">
              {proj.bullets.map((b, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-3 border-t border-white/5">
              <Tag className="w-3 h-3 text-zinc-500" />
              {proj.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141418] text-zinc-400 border border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DetailModal>
  );
}
