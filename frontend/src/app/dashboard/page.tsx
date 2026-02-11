"use client";

import { BookOpen, Clock, Flame, Target } from "lucide-react";

export default function DashboardPage() {
  // TODO: Fetch real data from API
  const stats = {
    studyStreak: 5,
    materialsCount: 12,
    flashcardsDue: 8,
    totalMinutes: 340,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Good morning! Ready to learn?
      </h1>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="h-6 w-6 text-terracotta" />}
          label="Study streak"
          value={`${stats.studyStreak} days`}
        />
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          label="Materials"
          value={String(stats.materialsCount)}
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-gold" />}
          label="Cards due"
          value={String(stats.flashcardsDue)}
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-primary-300" />}
          label="Study time"
          value={`${Math.round(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="font-heading text-lg font-semibold text-primary">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <ActionButton label="Upload new material" href="/dashboard/upload" />
          <ActionButton label="Review flashcards" href="/dashboard/review" />
          <ActionButton label="Take a quiz" href="/dashboard/quiz" />
        </div>
      </div>

      {/* Recent Materials */}
      <div className="mt-12">
        <h2 className="font-heading text-lg font-semibold text-primary">Recent materials</h2>
        <p className="mt-4 text-sm text-charcoal/50">
          No materials yet. Upload your first study material to get started!
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/10 bg-white p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral">
        {icon}
      </div>
      <div>
        <p className="text-sm text-charcoal/50">{label}</p>
        <p className="font-heading text-xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-xl border border-terracotta/20 bg-terracotta/5 p-5 text-center font-medium text-terracotta transition hover:bg-terracotta/10"
    >
      {label}
    </a>
  );
}
