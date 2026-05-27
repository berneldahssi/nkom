"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Upload,
  Layers,
  GraduationCap,
  Menu,
  X,
  Bell,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload" },
  { href: "/dashboard/materials", icon: BookOpen, label: "Materials" },
  { href: "/dashboard/review", icon: Layers, label: "Flashcards" },
  { href: "/dashboard/quiz", icon: GraduationCap, label: "Quizzes" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-neutral">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-primary/10 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-primary/5 px-6 py-5">
          <Link href="/" className="font-heading text-2xl font-bold text-primary">
            NKOM
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-charcoal/40" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-charcoal/60 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.label === "Flashcards" && (
                  <span className="ml-auto rounded-full bg-terracotta/10 px-2 py-0.5 text-xs font-semibold text-terracotta">
                    8
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-primary/5 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              B
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-charcoal">Bernel Dahssi</p>
              <p className="truncate text-xs text-charcoal/40">Free plan</p>
            </div>
          </div>
          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-charcoal/40 transition hover:bg-primary/10 hover:text-charcoal/60">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-primary/5 bg-white px-6 py-3">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} className="text-charcoal/60" />
          </button>
          <div className="flex-1" />

          {/* Dark / Light mode toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-charcoal/40 transition hover:bg-primary/10 hover:text-charcoal/70"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="relative rounded-lg p-2 text-charcoal/40 transition hover:bg-primary/10 hover:text-charcoal/60">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" />
          </button>
          <div className="hidden items-center gap-2 rounded-lg border border-primary/10 px-3 py-1.5 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              B
            </div>
            <span className="text-sm font-medium text-charcoal/70">Bernel</span>
            <ChevronDown size={14} className="text-charcoal/30" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
