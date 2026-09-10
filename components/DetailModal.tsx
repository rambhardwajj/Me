"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: DetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#09090b] border border-white/10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between bg-[#0e0e11] backdrop-blur-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-zinc-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-white/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
