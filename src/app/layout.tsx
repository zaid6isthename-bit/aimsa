import type { Metadata, Viewport } from "next";
import { Syne, Playfair_Display, Inter, Caveat, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E6E1D7",
};

export const metadata: Metadata = {
  title: "AIMSA — Artificial Intelligence & Machine Learning Students' Association",
  description: "Official website of AIMSA. The living heart of the AI & ML student community — People, Events, Culture, Hackathons, Sports, Memories, and Identity.",
  keywords: ["AIMSA", "AI ML Association", "Student Association", "AI Hackathons", "College Community", "Machine Learning"],
  authors: [{ name: "AIMSA Creative & Tech Team" }],
  openGraph: {
    title: "AIMSA — AI & ML Students' Association",
    description: "Where Artificial Intelligence Meets Human Emotion. Discover our people, hackathons, sports, cultural events, and memories.",
    type: "website",
    locale: "en_US",
    siteName: "AIMSA Official",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${playfair.variable} ${inter.variable} ${caveat.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className="bg-[#E6E1D7] text-[#121110] paper-crumpled-bg font-sans antialiased selection:bg-[#D92525] selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Grain overlay */}
        <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.035] bg-repeat noise-bg" />
        
        {children}
      </body>
    </html>
  );
}
