import { NextResponse } from "next/server";
import portfolioData from "@/data/portfolio.json";

export async function GET() {
  // Dynamically attach current server timestamp & status
  const dynamicResponse = {
    ...portfolioData,
    meta: {
      generatedAt: new Date().toISOString(),
      serverTimeIST: new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    },
  };

  return NextResponse.json(dynamicResponse, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
