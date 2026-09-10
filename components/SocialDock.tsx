"use client";

import React, { useState } from "react";
import { Mail, FileText, Check, Copy } from "lucide-react";

interface SocialDockProps {
  socials?: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    twitter: string;
    resume: string;
  };
}

export default function SocialDock({ socials: propSocials }: SocialDockProps) {
  const defaultSocials = {
    email: "ram.bhardwaj2027@mastersunion.org",
    phone: "+91 8433239806",
    linkedin: "https://www.linkedin.com/in/bhardwajram",
    github: "https://github.com/bhardwajram",
    twitter: "https://x.com/bhardwajram",
    resume: "/resume.pdf",
  };

  const socials = propSocials || defaultSocials;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      name: "LinkedIn",
      href: socials.linkedin,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
      color: "hover:text-white hover:border-white/30",
    },
    {
      name: "Email",
      href: `mailto:${socials.email}`,
      icon: <Mail className="w-4 h-4" />,
      color: "hover:text-white hover:border-white/30",
    },
    {
      name: "Resume",
      href: socials.resume,
      icon: <FileText className="w-4 h-4" />,
      color: "hover:text-white hover:border-white/30",
    },
    {
      name: "X",
      href: socials.twitter,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:text-white hover:border-white/30",
    },
    {
      name: "GitHub",
      href: socials.github,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      color: "hover:text-white hover:border-white/30",
    },
  ];

  return (
    <div className="bento-card card-border-connect p-2.5 sm:p-3 flex flex-col justify-between h-full min-h-0 overflow-hidden">
      {/* Top quick contact status */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-[9.5px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXECUTIVE CONNECT</span>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1 text-[8.5px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/10"
            title="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-zinc-200 font-medium truncate">
          {socials.email}
        </p>
        <p className="text-[9.5px] font-mono text-zinc-400 mt-0.5">
          {socials.phone} • Gurugram / Noida
        </p>
      </div>

      {/* Social Links Row */}
      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/5">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center p-1.5 rounded-lg bg-[#0e0e11] hover:bg-[#18181c] border border-white/5 text-zinc-400 transition-all duration-200 hover:scale-105 group ${link.color}`}
            title={link.name}
            aria-label={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
