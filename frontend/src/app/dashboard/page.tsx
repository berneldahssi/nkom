"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  Flame,
  Target,
  Upload,
  Layers,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Calendar,
  Brain,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const stats = {
    studyStreak: 5,
    materialsCount: 12,
    flashcardsDue: 8,
    totalMinutes: 340,
    quizAvg: 82,
    conceptsMastered: 47,
  };

  const recentMaterials = [
    { id: "1", title: "Introduction to Cell Biology", subject: "Biology", date: "2 hours ago", formats: ["summary", "flashcards", "quiz"], progress: 75 },
    { id: "2", title: "French Revolution Notes", subject: "History", date: "Yesterday", formats: ["summary", "podcast", "flashcards"], progress: 45 },
    { id: "3", title: "Linear Algebra - Ch. 3", subject: "Mathematics", date: "2 days ago", formats: ["summary", "flashcards"], progress: 90 },
  ];

  const upcomingReviews = [
    { title: "Cell Biology Flashcards", cards: 12, due: "Now" },
    { title: "French Revolution Quiz", cards: 8, due: "In 2 hours" },
    { title: "Algebra Practice", cards: 5, due: "Tomorrow" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Good morning, Bernel!
          </h1>
          <p className="mt-1 text-sm text-charcoal/50">
            You have {stats.flashcardsDue} flashcards due for review today.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          <Upload size={16} />
          Upload new material
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Flame className="h-5 w-5 text-terracotta" />} label="Study streak" value={`${stats.studyStreak} days`} change="+2 this week" positive />
        <StatCard icon={<BookOpen className="h-5 w-5 text-primary" />} label="Materials" value={String(stats.materialsCount)} change="3 new this week" positive />
        <StatCard icon={<Target className="h-5 w-5 text-gold" />} label="Concepts mastered" value={String(stats.conceptsMastered)} change="+8 this week" positive />
        <StatCard icon={<Clock className="h-5 w-5 text-primary-300" />} label="Study time" value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`} change="Total this month" />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column — Quick actions + Recent materials */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick actions */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QuickAction icon={<Upload size={20} />} label="Upload material" description="Photo, audio, PDF, or text" href="/dashboard/upload" color="terracotta" />
              <QuickAction icon={<Layers size={20} />} label="Review flashcards" description={`${stats.flashcardsDue} cards due`} href="/dashboard/review" color="primary" />
              <QuickAction icon={<GraduationCap size={20} />} label="Take a quiz" description="Test your knowledge" href="/dashboard/quiz" color="gold" />
            </div>
          </div>

          {/* Recent materials */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-primary">Recent materials</h2>
              <Link href="/dashboard/materials" className="flex items-center gap-1 text-sm font-medium text-terracotta hover:underline">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentMaterials.map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/materials/${m.id}`}
                  className="flex items-center gap-4 rounded-xl border border-primary/5 p-4 transition hover:border-primary/15 hover:bg-neutral/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Brain size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-charcoal">{m.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-charcoal/40">
                      <span>{m.subject}</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {m.formats.map((f) => (
                      <span key={f} className="rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary/60">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-primary/10">
                      <div className="h-full rounded-full bg-terracotta" style={{ width: `${m.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-charcoal/40">{m.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly progress chart placeholder */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Weekly study activity</h2>
            <div className="mt-6 flex items-end gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const heights = [45, 70, 55, 90, 65, 30, 80];
                const isToday = i === 3;
                return (
                  <div key={day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative w-full">
                      <div
                        className={`mx-auto w-full max-w-[40px] rounded-lg transition ${
                          isToday ? "bg-terracotta" : "bg-primary/15"
                        }`}
                        style={{ height: heights[i] }}
                      />
                    </div>
                    <span className={`text-xs ${isToday ? "font-semibold text-terracotta" : "text-charcoal/40"}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column — Reviews + Goals */}
        <div className="space-y-6">
          {/* Due for review */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-primary">Due for review</h2>
              <Calendar size={18} className="text-charcoal/30" />
            </div>
            <div className="mt-4 space-y-3">
              {upcomingReviews.map((r) => (
                <div key={r.title} className="flex items-center gap-3 rounded-xl border border-primary/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracotta/10">
                    <Layers size={16} className="text-terracotta" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{r.title}</p>
                    <p className="text-xs text-charcoal/40">{r.cards} cards</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    r.due === "Now" ? "bg-terracotta/10 text-terracotta" : "bg-primary/5 text-charcoal/50"
                  }`}>
                    {r.due}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/review"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-terracotta/10 py-2.5 text-sm font-medium text-terracotta transition hover:bg-terracotta/15"
            >
              Start review session
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Performance */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Performance</h2>
            <div className="mt-4 space-y-4">
              <PerformanceRow label="Quiz average" value={`${stats.quizAvg}%`} percentage={stats.quizAvg} color="terracotta" />
              <PerformanceRow label="Retention rate" value="76%" percentage={76} color="primary" />
              <PerformanceRow label="Consistency" value="85%" percentage={85} color="gold" />
            </div>
          </div>

          {/* Learning style */}
          <div className="rounded-2xl border border-terracotta/20 bg-gradient-to-br from-terracotta/5 to-gold/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/15">
                <Sparkles size={20} className="text-terracotta" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-primary">Your learning style</p>
                <p className="text-xs text-charcoal/50">Visual learner</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/50">
              Content is optimized for visual learning with diagrams, charts, and color-coded materials.
            </p>
            <Link href="/dashboard/settings" className="mt-3 inline-block text-xs font-medium text-terracotta hover:underline">
              Update preferences
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, positive }: {
  icon: React.ReactNode; label: string; value: string; change?: string; positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral">{icon}</div>
        {positive && <TrendingUp size={14} className="text-green-500" />}
      </div>
      <p className="mt-3 font-heading text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-charcoal/50">{label}</p>
      {change && <p className="mt-1 text-xs text-charcoal/30">{change}</p>}
    </div>
  );
}

function QuickAction({ icon, label, description, href, color }: {
  icon: React.ReactNode; label: string; description: string; href: string; color: "terracotta" | "primary" | "gold";
}) {
  const bgMap = { terracotta: "bg-terracotta/10 text-terracotta", primary: "bg-primary/10 text-primary", gold: "bg-gold/10 text-gold" };
  const hoverMap = { terracotta: "hover:border-terracotta/20", primary: "hover:border-primary/20", gold: "hover:border-gold/20" };
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl border border-primary/5 p-4 transition ${hoverMap[color]} hover:shadow-sm`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgMap[color]}`}>{icon}</div>
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-xs text-charcoal/40">{description}</p>
      </div>
    </Link>
  );
}

function PerformanceRow({ label, value, percentage, color }: {
  label: string; value: string; percentage: number; color: "terracotta" | "primary" | "gold";
}) {
  const barColor = { terracotta: "bg-terracotta", primary: "bg-primary", gold: "bg-gold" };
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal/60">{label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-primary/10">
        <div className={`h-full rounded-full ${barColor[color]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
