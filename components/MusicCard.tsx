"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface MusicCardProps {
  nowPlaying?: {
    title: string;
    artist: string;
    albumArt: string;
    audioUrl?: string;
    status: string;
    trackDuration: string;
  };
}

export default function MusicCard({ nowPlaying }: MusicCardProps) {
  const track = nowPlaying || {
    title: "Golden Hour (Ambient)",
    artist: "JVKE",
    albumArt: "/images/album-art.jpg",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    status: "FOCUS AUDIO",
    trackDuration: "2:40",
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Audio play prevented:", e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="bento-card card-border-music relative group overflow-hidden h-full min-h-0 flex flex-col justify-end p-2.5 sm:p-3">
      {/* Hidden HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        loop
      />

      {/* Background Image / Album Art */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <Image
            src={track.albumArt}
            alt={track.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 filter brightness-75 contrast-105 ${
              isPlaying ? "scale-105" : "group-hover:scale-105"
            }`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 pointer-events-none" />
      </div>

      {/* Top row with status badge and audio controls */}
      <div className="relative z-10 flex items-center justify-between mb-auto">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[8.5px] font-mono tracking-wider text-zinc-300">
          <Music className="w-2.5 h-2.5 text-zinc-300" />
          <span>{isPlaying ? "LIVE AUDIO" : "FOCUS MODE"}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/75 backdrop-blur-md hover:bg-black/90 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-2.5 h-2.5 text-rose-400" />
            ) : (
              <Volume2 className="w-2.5 h-2.5" />
            )}
          </button>

          <button
            onClick={togglePlay}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-zinc-200 backdrop-blur-md border border-white flex items-center justify-center text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            title={isPlaying ? "Pause Track" : "Play Track"}
            aria-label={isPlaying ? "Pause Track" : "Play Track"}
          >
            {isPlaying ? (
              <Pause className="w-2.5 h-2.5 fill-current" />
            ) : (
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Playback progress bar */}
      <div className="relative z-10 w-full bg-white/15 h-0.5 rounded-full my-1 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom Track info + Animated Equalizer */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white drop-shadow-md">
            {track.artist}
          </h3>
          <p className="text-[10px] font-medium text-zinc-300 drop-shadow-sm flex items-center gap-1 mt-0.5">
            <span className="truncate max-w-[110px]">{track.title}</span>
            <span className="text-[8.5px] text-zinc-400 font-mono">
              • {track.trackDuration}
            </span>
          </p>
        </div>

        {/* Dynamic Equalizer Wave Bars */}
        <div className="flex items-end gap-0.5 h-5 pb-0.5">
          <span
            className={`w-0.5 rounded-full bg-white transition-all ${
              isPlaying ? "eq-bar-1" : "h-1 opacity-50"
            }`}
          />
          <span
            className={`w-0.5 rounded-full bg-zinc-300 transition-all ${
              isPlaying ? "eq-bar-2" : "h-2 opacity-50"
            }`}
          />
          <span
            className={`w-0.5 rounded-full bg-white transition-all ${
              isPlaying ? "eq-bar-3" : "h-1 opacity-50"
            }`}
          />
          <span
            className={`w-0.5 rounded-full bg-zinc-300 transition-all ${
              isPlaying ? "eq-bar-4" : "h-1.5 opacity-50"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
