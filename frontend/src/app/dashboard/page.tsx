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
  ChevronRight,
  Plane,
} from "lucide-react";

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = {
    studyStreak: 3,
    materialsCount: 14,
    flashcardsDue: 20,
    totalMinutes: 120,
    quizAvg: 74,
    conceptsMastered: 0,
  };

  const recentMaterials = [
    {
      id: "1",
      title: "PSTAR Full Question Bank",
      subject: "All 14 Sections",
      date: "Active",
      formats: ["flashcards", "quiz"],
      progress: 0,
    },
    {
      id: "2",
      title: "Collision Avoidance & Visual Signals",
      subject: "Sections 1–2",
      date: "Start here",
      formats: ["flashcards", "quiz"],
      progress: 0,
    },
    {
      id: "3",
      title: "Communications & Aerodromes",
      subject: "Sections 3–4",
      date: "Next up",
      formats: ["flashcards", "quiz"],
      progress: 0,
    },
  ];

  const upcomingReviews = [
    { title: "PSTAR Flashcard Session", cards: 20, due: "Now" },
    { title: "Full PSTAR Exam Simulation", cards: 50, due: "Today" },
    { title: "Wake Turbulence — Section 7", cards: 15, due: "Tomorrow" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {greeting}, Bernel!
          </h1>
          <p className="mt-1 text-sm text-charcoal/50">
            PSTAR target: 95%+ · {stats.flashcardsDue} flashcards ready to review.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          <Upload size={16} />
          Upload material
        </Link>
      </div>

      {/* PSTAR readiness banner */}
      <Link
        href="/dashboard/quiz"
        className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-5 text-white shadow-card transition hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Plane size={24} className="-rotate-12 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">Ready for your PSTAR?</p>
            <p className="text-sm text-white/70">Take a full 50-question exam simulation — target 95%+</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium sm:flex">
          Start exam <ArrowRight size={14} />
        </div>
      </Link>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5 text-terracotta" />}
          label="Study streak"
          value={`${stats.studyStreak} days`}
          change="Keep it going!"
          positive
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          label="PSTAR sections"
          value={`${stats.materialsCount} / 14`}
          change="Full question bank loaded"
          positive
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-gold" />}
          label="Quiz average"
          value={stats.quizAvg > 0 ? `${stats.quizAvg}%` : "—"}
          change={stats.quizAvg >= 95 ? "Target met!" : "Target: 95%"}
          positive={stats.quizAvg >= 95}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-primary-300" />}
          label="Study time"
          value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
          change="Total this week"
        />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick actions */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QuickAction
                icon={<Layers size={20} />}
                label="Review flashcards"
                description={`${stats.flashcardsDue} cards ready`}
                href="/dashboard/review"
                color="terracotta"
              />
              <QuickAction
                icon={<GraduationCap size={20} />}
                label="Take a quiz"
                description="Full exam or by section"
                href="/dashboard/quiz"
                color="primary"
              />
              <QuickAction
                icon={<Upload size={20} />}
                label="Upload material"
                description="PDF, audio, photo"
                href="/dashboard/upload"
                color="gold"
              />
            </div>
          </div>

          {/* PSTAR sections */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-primary">PSTAR study materials</h2>
              <Link
                href="/dashboard/materials"
                className="flex items-center gap-1 text-sm font-medium text-terracotta hover:underline"
              >
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
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta/10">
                    <Plane size={20} className="text-terracotta" />
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
                      <span
                        key={f}
                        className="rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary/60"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-terracotta"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-charcoal/40">
                      {m.progress > 0 ? `${m.progress}%` : "New"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section progress */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">PSTAR sections overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { num: 1, label: "Collision Avoidance", q: 10 },
                { num: 2, label: "Visual Signals", q: 8 },
                { num: 3, label: "Communications", q: 29 },
                { num: 4, label: "Aerodromes", q: 10 },
                { num: 5, label: "Equipment", q: 11 },
                { num: 6, label: "Pilot Responsibilities", q: 23 },
                { num: 7, label: "Wake Turbulence", q: 15 },
                { num: 8, label: "Aeromedical", q: 13 },
              ].map((s) => (
                <Link
                  key={s.num}
                  href="/dashboard/quiz"
                  className="flex flex-col rounded-xl border border-primary/5 p-3 transition hover:border-primary/15 hover:bg-neutral/50"
                >
                  <span className="text-xs font-semibold text-terracotta">§{s.num}</span>
                  <span className="mt-1 text-xs font-medium text-charcoal leading-tight">{s.label}</span>
                  <span className="mt-2 text-xs text-charcoal/30">{s.q} questions</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Due for review */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-primary">Study queue</h2>
              <Calendar size={18} className="text-charcoal/30" />
            </div>
            <div className="mt-4 space-y-3">
              {upcomingReviews.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center gap-3 rounded-xl border border-primary/5 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracotta/10">
                    <Layers size={16} className="text-terracotta" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{r.title}</p>
                    <p className="text-xs text-charcoal/40">{r.cards} cards</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      r.due === "Now" ? "bg-terracotta/10 text-terracotta" : "bg-primary/5 text-charcoal/50"
                    }`}
                  >
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
            <h2 className="font-heading text-lg font-semibold text-primary">Target tracker</h2>
            <div className="mt-4 space-y-4">
              <PerformanceRow label="Quiz average" value={stats.quizAvg > 0 ? `${stats.quizAvg}%` : "—"} percentage={stats.quizAvg} color="terracotta" />
              <PerformanceRow label="Pass mark (TC)" value="90%" percentage={90} color="primary" />
              <PerformanceRow label="Personal target" value="95%" percentage={95} color="gold" />
            </div>
          </div>

          {/* PSTAR info card */}
          <div className="rounded-2xl border border-terracotta/20 bg-gradient-to-br from-terracotta/5 to-gold/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/15">
                <Plane size={20} className="text-terracotta" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-primary">PSTAR Exam</p>
                <p className="text-xs text-charcoal/50">Transport Canada · Student Pilot Permit</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/50">
              50 questions from 192 in the TC question bank. Pass mark: 90%. Your target: <strong>95%+</strong>.
            </p>
            <Link
              href="/dashboard/quiz"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:underline"
            >
              Start full exam simulation <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
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

function QuickAction({
  icon,
  label,
  description,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: "terracotta" | "primary" | "gold";
}) {
  const bgMap = {
    terracotta: "bg-terracotta/10 text-terracotta",
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/10 text-gold",
  };
  const hoverMap = {
    terracotta: "hover:border-terracotta/20",
    primary: "hover:border-primary/20",
    gold: "hover:border-gold/20",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl border border-primary/5 p-4 transition ${hoverMap[color]} hover:shadow-sm`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-xs text-charcoal/40">{description}</p>
      </div>
    </Link>
  );
}

function PerformanceRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: string;
  percentage: number;
  color: "terracotta" | "primary" | "gold";
}) {
  const barColor = { terracotta: "bg-terracotta", primary: "bg-primary", gold: "bg-gold" };
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal/60">{label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-primary/10">
        <div
          className={`h-full rounded-full ${barColor[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
