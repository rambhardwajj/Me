import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "bhardwajram";

  try {
    // 1. Attempt to fetch public user details from GitHub
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "NextJS-Portfolio-App",
      },
      next: { revalidate: 3600 },
    });

    let userData: any = null;
    if (userRes.ok) {
      userData = await userRes.json();
    }

    // 2. Fetch live contribution history from the public contributions proxy (used by garvit.xyz & developer portfolios)
    const contribRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (contribRes.ok) {
      const contribData = await contribRes.json();
      return NextResponse.json({
        success: true,
        source: "live_github",
        user: userData,
        contributions: contribData.contributions,
        total: contribData.total?.lastYear || contribData.total?.[new Date().getFullYear()] || 0,
      });
    }

    // Fallback if the user profile contributions proxy is unreachable
    return NextResponse.json({
      success: true,
      source: "fallback",
      user: userData,
      total: 1820,
    });
  } catch (error) {
    console.error("GitHub API fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        total: 1820,
        error: (error as Error).message,
      },
      { status: 200 }
    );
  }
}
