"use client";

import React, { useState } from "react";
import { SkillItem } from "@/data/portfolio";
import { Layers } from "lucide-react";

interface StackCardProps {
  skills?: SkillItem[];
}

export default function StackCard({ skills: propSkills }: StackCardProps) {
  const defaultSkills: SkillItem[] = [
    { prefix: "STR", name: "GTM Strategy" },
    { prefix: "FIN", name: "Pricing & Growth" },
    { prefix: "PRD", name: "Product Strategy" },
    { prefix: "OPS", name: "Business Automations" },
    { prefix: "VEN", name: "Vendor Negotiations" },
    { prefix: "KPI", name: "OKR & Frameworks" },
    { prefix: "AI",  name: "Enterprise AI Agents" },
    { prefix: "ANL", name: "Power BI & SQL" },
    { prefix: "MGT", name: "Program Management" },
    { prefix: "CLD", name: "Cloud Cost Control" },
  ];

  const skills = (propSkills && propSkills.length > 0 ? propSkills.slice(0, 10) : defaultSkills);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const getPrefixColor = (prefix: string) => {
    switch (prefix) {
      case "STR":
      case "FIN":
      case "PRD":
        return "text-amber-400 border-amber-500/20 bg-amber-500/10";
      case "OPS":
      case "VEN":
      case "KPI":
        return "text-sky-400 border-sky-500/20 bg-sky-500/10";
      case "AI":
      case "ANL":
        return "text-purple-400 border-purple-500/20 bg-purple-500/10";
      case "MGT":
      case "D2C":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
      case "CLD":
      case "DES":
        return "text-rose-400 border-rose-500/20 bg-rose-500/10";
      default:
        return "text-slate-400 border-slate-700/40 bg-slate-800/40";
    }
  };

  return (
    <div className="bento-card card-border-stack p-2.5 sm:p-3 flex flex-col justify-between h-full min-h-0 overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <span>STK</span>
            </h2>
            <span className="text-[9px] font-mono text-zinc-500">v2.0</span>
          </div>

          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
            Operator Stack
          </span>
        </div>

        {/* Stack pills */}
        <div className="grid grid-cols-2 gap-1">
          {skills.map((skill, index) => {
            const isHighlighted = !activeFilter || skill.prefix === activeFilter;
            return (
              <button
                key={index}
                onClick={() =>
                  setActiveFilter(activeFilter === skill.prefix ? null : skill.prefix)
                }
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#0e0e11] hover:bg-[#151518] border border-white/5 text-left transition-all duration-200 hover:border-white/20 group/pill cursor-pointer ${
                  isHighlighted ? "opacity-100" : "opacity-40"
                }`}
              >
                <span
                  className={`text-[7.5px] font-mono font-semibold px-1 py-0.2 rounded border flex-shrink-0 ${getPrefixColor(
                    skill.prefix
                  )}`}
                >
                  {skill.prefix}
                </span>
                <span className="text-[9.5px] font-medium text-zinc-300 group-hover/pill:text-white truncate">
                  {skill.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-1 pt-1 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-zinc-500">
        <span>Click prefix to filter</span>
        {activeFilter && (
          <button
            onClick={() => setActiveFilter(null)}
            className="text-white hover:underline cursor-pointer"
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}
