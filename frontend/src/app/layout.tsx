import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NKOM — Wisdom that sticks",
  description:
    "AI-powered personalized learning platform. Upload your notes, get personalized study experiences.",
  keywords: ["learning", "AI", "study", "flashcards", "spaced repetition", "education"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-neutral">{children}</body>
    </html>
  );
}
