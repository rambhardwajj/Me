import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bhardwajram.com"
  ),
  title: {
    default: "Ram Bhardwaj | Founder-Operator & Product Lead",
    template: "%s | Ram Bhardwaj",
  },
  description:
    "Founder-operator blending strategic diagnosis with technical and business execution. Scaled ventures from $0 to $6K MRR. YC Wingathon Winner.",
  applicationName: "Ram Bhardwaj Portfolio",
  authors: [
    {
      name: "Ram Bhardwaj",
      url: "https://www.linkedin.com/in/bhardwajram",
    },
  ],
  creator: "Ram Bhardwaj",
  publisher: "Ram Bhardwaj",
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
    "TruCost",
    "Tech Lead",
    "Growth Strategy",
    "Product Management",
    "B2B SaaS",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/avatar.png", sizes: "any" },
      { url: "/images/avatar.png", type: "image/png", sizes: "800x800" },
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
    ],
    shortcut: "/images/avatar.png",
    apple: [
      { url: "/images/avatar.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Ram Bhardwaj | Founder-Operator & Product Lead",
    description:
      "Founder-operator blending strategic diagnosis with technical & business execution. Scaled ventures from $0 to $6K MRR. YC Wingathon Winner.",
    url: "/",
    siteName: "Ram Bhardwaj Portfolio",
    images: [
      {
        url: "/images/ram-photo.jpg",
        width: 1200,
        height: 630,
        alt: "Ram Bhardwaj - Founder-Operator & Product Lead",
      },
      {
        url: "/images/avatar.png",
        width: 800,
        height: 800,
        alt: "Ram Bhardwaj Avatar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Bhardwaj | Founder-Operator & Product Lead",
    description:
      "Founder-operator blending strategic diagnosis with technical & business execution. Scaled ventures from $0 to $6K MRR. YC Wingathon Winner.",
    creator: "@bhardwajram",
    site: "@bhardwajram",
    images: ["/images/ram-photo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ram Bhardwaj",
  jobTitle: "Founder-Operator & Product Lead",
  description:
    "Founder-operator blending strategic diagnosis with technical & business execution. Scaled ventures from $0 to $6K MRR. YC Wingathon Winner.",
  url: "https://bhardwajram.com",
  image: "https://bhardwajram.com/images/ram-photo.jpg",
  sameAs: [
    "https://www.linkedin.com/in/bhardwajram",
    "https://github.com/bhardwajram",
    "https://x.com/bhardwajram",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Masters' Union",
    },
    {
      "@type": "EducationalOrganization",
      name: "Amity University",
    },
    {
      "@type": "EducationalOrganization",
      name: "Ramjas College, Delhi University",
    },
  ],
  knowsAbout: [
    "Product Management",
    "GTM Strategy",
    "AI Agents",
    "Next.js",
    "B2B SaaS",
    "Venture Building",
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
