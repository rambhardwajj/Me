import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ram Bhardwaj | Founder-Operator & Product Lead",
  description:
    "Founder-operator blending strategic diagnosis with technical and business execution. Scaled ventures from $0 to $6K MRR. YC Wingathon Winner.",
  keywords: [
    "Ram Bhardwaj",
    "Product Lead",
    "Founder Operator",
    "Masters' Union",
    "AI Agents",
    "GTM Strategy",
    "Ciena",
    "Newral",
    "Synappses",
  ],
  authors: [{ name: "Ram Bhardwaj" }],
  openGraph: {
    title: "Ram Bhardwaj | Founder-Operator & Product Lead",
    description:
      "Founder-operator blending strategic diagnosis with technical & business execution.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
