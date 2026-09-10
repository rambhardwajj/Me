"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface PhotoCardProps {
  photoUrl?: string;
  photoDate?: string;
  badge?: string;
}

export default function PhotoCard({
  photoUrl = "/images/ram-photo.jpg",
  photoDate,
  badge = "FOUNDER-OPERATOR",
}: PhotoCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bento-card card-border-photo p-2 relative group w-full h-full min-h-[240px] md:min-h-0 flex flex-col overflow-hidden">
      <div className="relative w-full flex-1 min-h-[224px] md:min-h-0 rounded-xl overflow-hidden bg-black border border-white/10">
        {!imgError ? (
          <Image
            src={photoUrl}
            alt="Ram Bhardwaj"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center filter saturate-[1.05] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black p-2 text-center text-zinc-400">
            <Camera className="w-6 h-6 mb-1 text-zinc-500" />
            <p className="text-[10px] font-mono text-zinc-400">/public/images/ram-photo.jpg</p>
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

        {/* Dynamic date stamp tag */}
        <div className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[9px] font-mono tracking-wider text-zinc-300">
          {photoDate || "SEP 10, 2026"}
        </div>

        {/* MBA / Founder status badge */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[8px] font-mono text-zinc-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{badge}</span>
        </div>
      </div>
    </div>
  );
}
