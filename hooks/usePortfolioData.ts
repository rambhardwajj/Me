"use client";

import { useState, useEffect } from "react";
import initialData from "@/data/portfolio.json";

export type PortfolioData = typeof initialData;

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);
  const [currentISTTime, setCurrentISTTime] = useState<string>("");
  const [todayDateFormatted, setTodayDateFormatted] = useState<string>("");

  useEffect(() => {
    // 1. Fetch live portfolio data from API
    async function loadData() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.warn("Could not fetch from /api/portfolio, using local JSON fallback", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // 2. Set up dynamic live clock (IST timezone Asia/Kolkata)
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentISTTime(timeString);

      const dateString = now
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();
      setTodayDateFormatted(dateString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    data,
    loading,
    currentISTTime,
    todayDateFormatted: todayDateFormatted || "SEP 10, 2026",
  };
}
