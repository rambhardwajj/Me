"use client";

import React from "react";
import { ArrowUpRight, Rocket } from "lucide-react";
import { ProjectItem } from "@/data/portfolio";

interface ProjectsCardProps {
  projects?: ProjectItem[];
  onOpenProjects: (initialProject?: ProjectItem) => void;
}

export default function ProjectsCard({
  projects = [],
  onOpenProjects,
}: ProjectsCardProps) {
  const featured = projects[0] || {
    title: "Synappses",
    metrics: "$0 ➔ $6K MRR",
    subtitle: "AI SaaS LMS Platform",
  };

  const tagList = projects.slice(0, 4).map((p) => p.title);
  return (
    <div
      onClick={() => onOpenProjects(featured)}
      className="bento-card card-border-ventures p-2.5 sm:p-3 flex flex-col justify-between relative group cursor-pointer h-full min-h-0 overflow-hidden"
    >
      {/* Top Header with Icon, Title, and Expand Arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white/[0.1] transition-all">
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white">
              VENTURES
            </h2>
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider">
              &amp; PRO
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenProjects();
          }}
          className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all border border-white/5 group-hover:border-white/20 cursor-pointer"
          title="Explore Ventures"
          aria-label="Explore Ventures"
        >
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Middle Featured Venture Snippet */}
      <div className="my-1 p-1.5 rounded-lg bg-[#0b0b0e] border border-white/10">
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-xs font-semibold text-white truncate">{featured.title}</span>
          <span className="text-[9.5px] font-mono text-emerald-400 font-medium flex-shrink-0">
            {featured.metrics}
          </span>
        </div>
        <p className="text-[9.5px] text-zinc-400 truncate mt-0.5 leading-tight">
          {featured.subtitle}
        </p>
      </div>

      {/* Footer Tags */}
      <div className="flex items-center gap-1 overflow-hidden">
        {tagList.map((tag, i) => (
          <span
            key={i}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#0e0e11] border border-white/5 text-zinc-400 truncate max-w-[80px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
