import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NKOM — Wisdom that sticks",
  description:
    "AI-powered personalized learning platform. Upload your notes, get personalized study experiences powered by AI and neuroscience.",
  keywords: ["learning", "AI", "study", "flashcards", "spaced repetition", "education", "NKOM"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
