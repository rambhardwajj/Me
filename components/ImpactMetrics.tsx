"use client";

import React from "react";
import { TrendingUp, DollarSign, Award, Target } from "lucide-react";

interface ImpactMetricsProps {
  metrics?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  onOpenAchievements?: () => void;
  onOpenEducation?: () => void;
}

export default function ImpactMetrics({
  metrics = [],
  onOpenAchievements,
  onOpenEducation,
}: ImpactMetricsProps) {
  const defaultMetrics = [
    {
      label: "ARR / MRR Traction",
      value: "$0 ➔ $6K",
      detail: "Scaled Synappses & Newral",
    },
    {
      label: "Direct P&L Impact",
      value: "50% Cost Cut",
      detail: "Cloud vendor renegotiation",
    },
    {
      label: "D2C Revenue",
      value: "₹11.2 Lakhs",
      detail: "Masters' Union Challenge",
    },
    {
      label: "Global Honors",
      value: "Top 4 / 14,000",
      detail: "Ciena Customer's First Award",
    },
  ];

  const items = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div className="bento-card card-border-metrics p-1.5 sm:p-2 flex items-center justify-between min-h-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
        {items.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-[#0c0c0e] border border-white/5 hover:border-white/15 transition-colors"
          >
            <div className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/10">
              {idx === 0 && <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />}
              {idx === 1 && <DollarSign className="w-2.5 h-2.5 text-zinc-200" />}
              {idx === 2 && <Target className="w-2.5 h-2.5 text-amber-400" />}
              {idx === 3 && <Award className="w-2.5 h-2.5 text-zinc-200" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[11px] font-bold text-white font-mono truncate">
                  {m.value}
                </span>
                <span className="text-[7.5px] font-mono text-zinc-500 uppercase truncate">
                  {m.label}
                </span>
              </div>
              <p className="text-[8.5px] text-zinc-400 truncate leading-none mt-0.5">
                {m.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
