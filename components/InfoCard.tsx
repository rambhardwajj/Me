"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Award, Clock, GraduationCap } from "lucide-react";

interface InfoCardProps {
  personal?: any;
  currentISTTime?: string;
  onOpenAchievements?: () => void;
  onOpenEducation?: () => void;
}

export default function InfoCard({
  personal,
  currentISTTime,
  onOpenAchievements,
  onOpenEducation,
}: InfoCardProps) {
  const p = personal || {
    name: "Ram Bhardwaj",
    handle: "@bhardwajram",
    headline: "Founder-operator blending strategic diagnosis with technical & business execution.",
    subline: "PGP in Tech & Business Management at Masters' Union. Experienced in GTM strategy, product leadership, vendor negotiations, and scaling ventures from $0 to $6K MRR across B2B & D2C.",
    currentFocus: "PGP in Tech & Business @ Masters' Union",
    location: "Gurugram / Noida, India",
    avatar: "/images/avatar.png",
  };

  const [imgError, setImgError] = useState(false);

  return (
    <div className="bento-card card-border-hero p-2.5 sm:p-3 flex flex-col justify-between relative group h-full min-h-0">
      {/* Subtle watermark */}
      <span className="watermark-text text-4xl select-none">INFO</span>

      <div>
        {/* Profile Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.06)] flex-shrink-0 bg-black">
            {!imgError ? (
              <Image
                src={p.avatar}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 56px, 64px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-white/10 text-white font-bold text-base">
                RB
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center">
                {p.name}
                <span className="text-zinc-400 text-lg leading-none ml-0.5">.</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] font-medium text-zinc-400">{p.handle}</p>
              {currentISTTime && (
                <div className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <Clock className="w-2 h-2" />
                  <span>{currentISTTime} IST</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio tagline */}
        <p className="text-zinc-200 text-xs md:text-[12.5px] leading-snug font-normal">
          Founder-operator blending{" "}
          <span className="text-white font-medium underline underline-offset-2 decoration-white/40">
            strategic diagnosis
          </span>{" "}
          with business execution &amp; product leadership.
        </p>

        <p className="text-zinc-400 text-[10.5px] mt-0.5 line-clamp-2 leading-relaxed">
          {p.subline}
        </p>
      </div>

      {/* Quick Status / Badges */}
      <div className="mt-1.5 pt-1.5 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[9.5px]">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-zinc-200 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
          <span>{p.currentFocus}</span>
        </div>

        <button
          onClick={onOpenAchievements}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 font-medium transition-colors cursor-pointer"
        >
          <Award className="w-2.5 h-2.5" />
          <span>YC Wingathon Winner &apos;26</span>
        </button>

        <button
          onClick={onOpenEducation}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 transition-colors cursor-pointer"
        >
          <GraduationCap className="w-2.5 h-2.5 text-zinc-400" />
          <span>{p.location}</span>
        </button>
      </div>
    </div>
  );
}
