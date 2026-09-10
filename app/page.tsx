"use client";

import React, { useState } from "react";
import InfoCard from "@/components/InfoCard";
import PhotoCard from "@/components/PhotoCard";
import StackCard from "@/components/StackCard";
import ExperienceCard from "@/components/ExperienceCard";
import SocialDock from "@/components/SocialDock";
import ProjectsCard from "@/components/ProjectsCard";
import MusicCard from "@/components/MusicCard";
import ImpactMetrics from "@/components/ImpactMetrics";
import ExperienceModal from "@/components/ExperienceModal";
import ProjectsModal from "@/components/ProjectsModal";
import AchievementsModal from "@/components/AchievementsModal";
import EducationModal from "@/components/EducationModal";
import { ExperienceItem, ProjectItem } from "@/data/portfolio";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Trophy, GraduationCap, FileText, Sun, Moon } from "lucide-react";

export default function Home() {
  const { data, currentISTTime, todayDateFormatted } = usePortfolioData();

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  const [selectedProj, setSelectedProj] = useState<ProjectItem | null>(null);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);

  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  // Initialize theme from storage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio_theme", nextTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(nextTheme);
  };

  const handleSelectExperience = (exp: ExperienceItem) => {
    setSelectedExp(exp);
    setIsExpModalOpen(true);
  };

  const handleOpenAllExperiences = () => {
    setSelectedExp(null);
    setIsExpModalOpen(true);
  };

  const handleOpenProjects = (proj?: ProjectItem) => {
    setSelectedProj(proj || null);
    setIsProjModalOpen(true);
  };

  return (
    <main className="portfolio-shell iso-grid-bg text-zinc-100 relative selection:bg-white/20 selection:text-white transition-colors duration-300">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-44 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Main Square/Mobile Bento Grid Container */}
      <div className="portfolio-square-frame mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-1 text-xs text-zinc-400 font-mono flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-semibold tracking-wide">
              {data.personal.name}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-300 font-medium hidden sm:inline">
              MBA @ Masters&apos; Union
            </span>
            {currentISTTime && (
              <span className="text-zinc-500 hidden md:inline">
                • {currentISTTime} IST
              </span>
            )}
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white transition-all border border-white/10 hover:border-white/25 text-[10px] cursor-pointer"
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span className="font-mono">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-indigo-500" />
                  <span className="font-mono">Dark</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAchievementsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all border border-white/10 hover:border-white/25 text-[10px] cursor-pointer"
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Honors &amp; Awards</span>
            </button>

            <button
              onClick={() => setIsEducationOpen(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all border border-white/10 hover:border-white/25 text-[10px] cursor-pointer"
            >
              <GraduationCap className="w-3 h-3 text-zinc-300" />
              <span>Education</span>
            </button>

            <a
              href={data.personal.socials.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 text-[10px]"
            >
              <FileText className="w-3 h-3" />
              <span>Resume PDF</span>
            </a>
          </div>
        </div>

        {/* Bento Grid Body (Square on Desktop/Zoom-out, Fluid stack on Mobile/Zoom-in) */}
        <div className="portfolio-bento-body">
          {/* Row 1: Info Card (2 cols) + Photo Card (1 col) */}
          <div className="portfolio-row-1">
            <div className="portfolio-card-item">
              <InfoCard
                personal={data.personal}
                currentISTTime={currentISTTime}
                onOpenAchievements={() => setIsAchievementsOpen(true)}
                onOpenEducation={() => setIsEducationOpen(true)}
              />
            </div>
            <div className="portfolio-photo-wrap">
              <PhotoCard
                photoUrl={data.personal.photo}
                photoDate={todayDateFormatted}
                badge={data.personal.photoBadge || "FOUNDER-OPERATOR"}
              />
            </div>
          </div>

          {/* Row 2: STK Card (1 col) + EXP Card (2 cols) */}
          <div className="portfolio-row-2">
            <div className="portfolio-card-item">
              <StackCard skills={data.skills} />
            </div>
            <div className="portfolio-card-item">
              <ExperienceCard
                experiences={data.experiences as ExperienceItem[]}
                onSelectExperience={handleSelectExperience}
                onOpenAll={handleOpenAllExperiences}
              />
            </div>
          </div>

          {/* Row 3: Connect Card (1 col) + Ventures Card (1 col) + Music Card (1 col) */}
          <div className="portfolio-row-3">
            <div className="portfolio-card-item">
              <SocialDock socials={data.personal.socials} />
            </div>
            <div className="portfolio-card-item">
              <ProjectsCard
                projects={data.projects as ProjectItem[]}
                onOpenProjects={handleOpenProjects}
              />
            </div>
            <div className="portfolio-card-item">
              <MusicCard nowPlaying={data.nowPlaying} />
            </div>
          </div>

          {/* Row 4: Executive Impact & P&L Metrics Bar */}
          <div className="portfolio-row-4">
            <ImpactMetrics
              metrics={data.metrics}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              onOpenEducation={() => setIsEducationOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Minimal Indicator */}
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-500 flex-shrink-0">
          <span>Ram Bhardwaj • Founder-Operator &amp; Product Leader</span>
          <span className="hidden sm:inline">PGP @ Masters&apos; Union • One-Page Bento</span>
        </div>
      </div>

      {/* Modals for Deep-Dive */}
      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        selectedExp={selectedExp}
        experiences={data.experiences as ExperienceItem[]}
      />

      <ProjectsModal
        isOpen={isProjModalOpen}
        onClose={() => setIsProjModalOpen(false)}
        selectedProject={selectedProj}
        projects={data.projects as ProjectItem[]}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={data.achievements}
        leadership={data.leadership}
      />

      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
        education={data.education}
      />
    </main>
  );
}
