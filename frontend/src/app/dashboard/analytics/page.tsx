"use client";

import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Flame,
  BookOpen,
  Brain,
  Calendar,
  GraduationCap,
} from "lucide-react";

export default function AnalyticsPage() {
  const weeklyData = [
    { day: "Mon", minutes: 45, cards: 12 },
    { day: "Tue", minutes: 70, cards: 20 },
    { day: "Wed", minutes: 55, cards: 15 },
    { day: "Thu", minutes: 90, cards: 28 },
    { day: "Fri", minutes: 65, cards: 18 },
    { day: "Sat", minutes: 30, cards: 8 },
    { day: "Sun", minutes: 80, cards: 22 },
  ];

  const subjectBreakdown = [
    { subject: "Biology", hours: 12, percentage: 35, color: "bg-terracotta" },
    { subject: "Mathematics", hours: 8, percentage: 23, color: "bg-primary" },
    { subject: "History", hours: 6, percentage: 17, color: "bg-gold" },
    { subject: "Chemistry", hours: 5, percentage: 15, color: "bg-green-500" },
    { subject: "Literature", hours: 3, percentage: 10, color: "bg-purple-500" },
  ];

  const recentScores = [
    { quiz: "Cell Biology", score: 90, date: "Feb 10" },
    { quiz: "French Revolution", score: 75, date: "Feb 9" },
    { quiz: "Linear Algebra", score: 65, date: "Feb 8" },
    { quiz: "Organic Chemistry", score: 85, date: "Feb 7" },
    { quiz: "Data Structures", score: 95, date: "Feb 6" },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">Analytics</h1>
      <p className="mt-1 text-sm text-charcoal/50">Track your learning progress and performance</p>

      {/* Overview stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Clock size={20} className="text-primary" />} label="Total study time" value="34h 20m" subtitle="This month" />
        <StatCard icon={<Flame size={20} className="text-terracotta" />} label="Current streak" value="5 days" subtitle="Best: 12 days" />
        <StatCard icon={<Target size={20} className="text-gold" />} label="Avg quiz score" value="82%" subtitle="+5% vs last month" trend="up" />
        <StatCard icon={<Brain size={20} className="text-green-500" />} label="Retention rate" value="76%" subtitle="+8% vs last month" trend="up" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Study time chart */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-primary">Study Time This Week</h2>
            <span className="text-sm text-charcoal/40">Total: 7h 15m</span>
          </div>
          <div className="mt-8 flex items-end gap-3" style={{ height: 180 }}>
            {weeklyData.map((d, i) => {
              const isToday = i === 3;
              const height = (d.minutes / maxMinutes) * 160;
              return (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-charcoal/40">{d.minutes}m</span>
                  <div
                    className={`w-full max-w-[44px] rounded-lg transition ${isToday ? "bg-terracotta" : "bg-primary/15"}`}
                    style={{ height }}
                  />
                  <span className={`text-xs ${isToday ? "font-semibold text-terracotta" : "text-charcoal/40"}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Subject Breakdown</h2>
          <div className="mt-6 space-y-4">
            {subjectBreakdown.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal/70">{s.subject}</span>
                  <span className="text-charcoal/40">{s.hours}h ({s.percentage}%)</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-primary/10">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Quiz scores */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Recent Quiz Scores</h2>
          <div className="mt-4 space-y-3">
            {recentScores.map((q) => (
              <div key={q.quiz} className="flex items-center gap-4 rounded-xl border border-primary/5 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap size={18} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{q.quiz}</p>
                  <p className="text-xs text-charcoal/40">{q.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-primary/10">
                    <div
                      className={`h-full rounded-full ${q.score >= 80 ? "bg-green-500" : q.score >= 60 ? "bg-gold" : "bg-red-400"}`}
                      style={{ width: `${q.score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${q.score >= 80 ? "text-green-500" : q.score >= 60 ? "text-gold" : "text-red-400"}`}>
                    {q.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning insights */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Learning Insights</h2>
          <div className="mt-4 space-y-4">
            <InsightCard
              icon={<TrendingUp size={18} className="text-green-500" />}
              title="Strong in Biology"
              description="Your biology scores have improved by 15% over the last 2 weeks. Keep it up!"
              type="positive"
            />
            <InsightCard
              icon={<Target size={18} className="text-gold" />}
              title="Review Linear Algebra"
              description="Your algebra scores are below average. Consider reviewing Chapter 3 flashcards."
              type="warning"
            />
            <InsightCard
              icon={<Calendar size={18} className="text-primary" />}
              title="Best study time"
              description="You're most productive between 9-11 AM. Try scheduling reviews during this window."
              type="info"
            />
            <InsightCard
              icon={<BookOpen size={18} className="text-terracotta" />}
              title="Flashcard mastery"
              description="You've mastered 47 out of 83 flashcards (57%). Focus on the remaining cards."
              type="info"
            />
          </div>
        </div>
      </div>

      {/* Monthly heatmap */}
      <div className="mt-6 rounded-2xl border border-primary/10 bg-white p-6">
        <h2 className="font-heading text-lg font-semibold text-primary">Study Activity (February 2026)</h2>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs text-charcoal/30 pb-1">{d}</div>
          ))}
          {Array.from({ length: 28 }).map((_, i) => {
            const intensity = [0, 2, 3, 1, 3, 2, 0, 1, 3, 2, 3, 0, 1, 2, 3, 3, 2, 1, 0, 2, 3, 1, 0, 0, 1, 2, 3, 2][i];
            const colors = ["bg-primary/5", "bg-primary/15", "bg-primary/30", "bg-primary/60"];
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${colors[intensity]} transition hover:ring-2 hover:ring-primary/20`}
                title={`Feb ${i + 1}: ${intensity === 0 ? "No" : intensity === 1 ? "Light" : intensity === 2 ? "Moderate" : "Heavy"} activity`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-charcoal/30">
          <span>Less</span>
          {["bg-primary/5", "bg-primary/15", "bg-primary/30", "bg-primary/60"].map((c, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, trend }: {
  icon: React.ReactNode; label: string; value: string; subtitle: string; trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral">{icon}</div>
        {trend === "up" && <TrendingUp size={14} className="text-green-500" />}
      </div>
      <p className="mt-3 font-heading text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-charcoal/50">{label}</p>
      <p className="mt-1 text-xs text-charcoal/30">{subtitle}</p>
    </div>
  );
}

function InsightCard({ icon, title, description, type }: {
  icon: React.ReactNode; title: string; description: string; type: "positive" | "warning" | "info";
}) {
  const borderColor = { positive: "border-l-green-500", warning: "border-l-gold", info: "border-l-primary" };
  return (
    <div className={`rounded-lg border border-primary/5 border-l-4 ${borderColor[type]} p-4`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-charcoal">{title}</p>
      </div>
      <p className="mt-1 text-xs text-charcoal/50">{description}</p>
    </div>
  );
}
