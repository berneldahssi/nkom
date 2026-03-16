import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "NKOM — Wisdom that sticks",
  description:
    "AI-powered personalized learning platform. Upload your notes, get personalized study experiences powered by AI and neuroscience.",
  keywords: ["learning", "AI", "study", "flashcards", "spaced repetition", "education", "NKOM"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><rect width='128' height='128' fill='%238B5CF6'/><text x='64' y='80' font-size='60' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'>NK</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
