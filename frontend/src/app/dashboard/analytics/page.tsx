"use client";

import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Brain,
  Calendar,
  GraduationCap,
  Plane,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

export default function AnalyticsPage() {
  const weeklyData = [
    { day: "Wed", minutes: 45, cards: 12 },
    { day: "Thu", minutes: 35, cards: 10 },
    { day: "Fri", minutes: 0, cards: 0 },
    { day: "Sat", minutes: 0, cards: 0 },
    { day: "Sun", minutes: 40, cards: 12 },
    { day: "Mon", minutes: 55, cards: 18 },
    { day: "Tue", minutes: 25, cards: 8 },
  ];

  const sectionBreakdown = [
    { section: "§3 Communications", questions: 29, percentage: 100, color: "bg-terracotta" },
    { section: "§6 Pilot Responsibilities", questions: 23, percentage: 79, color: "bg-primary" },
    { section: "§12 Navigation & Airspace", questions: 21, percentage: 72, color: "bg-gold" },
    { section: "§11 Meteorology", questions: 17, percentage: 59, color: "bg-green-500" },
    { section: "§7 Wake Turbulence", questions: 15, percentage: 52, color: "bg-blue-500" },
  ];

  const recentSections = [
    { section: "§1 Collision Avoidance", status: "Not attempted" },
    { section: "§2 Visual Signals", status: "Not attempted" },
    { section: "§3 Communications", status: "Not attempted" },
    { section: "§4 Aerodromes", status: "Not attempted" },
    { section: "§5 Equipment", status: "Not attempted" },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

  // May 2026: 31 days, starts Friday (offset 5 from Sunday). 42 cells total.
  // day = index - 4; isReal when day >= 1 && day <= 31
  // 3-day streak: May 24 (Sun), May 25 (Mon), May 26 (Tue = today)
  const heatmapIntensity = [
    0,0,0,0,0, 0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0, 0,0,0,1,1,0,0,
    1,2,2,0,0,0,0, 0,0,0,0,0,0,0,
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">PSTAR Analytics</h1>
      <p className="mt-1 text-sm text-charcoal/50">Track your progress toward the Transport Canada student pilot exam</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Clock size={20} className="text-primary" />} label="Study time" value="3h 20m" subtitle="This week" />
        <StatCard icon={<Flame size={20} className="text-terracotta" />} label="Study streak" value="3 days" subtitle="Keep it going!" />
        <StatCard icon={<Target size={20} className="text-gold" />} label="Quiz average" value="—" subtitle="Target: 95%" />
        <StatCard icon={<Brain size={20} className="text-green-500" />} label="Flashcard retention" value="—" subtitle="Not enough data yet" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-primary">Study Time This Week</h2>
            <span className="flex items-center gap-1 text-sm text-charcoal/40">
              <BarChart3 size={14} /> 3h 20m this week
            </span>
          </div>
          <div className="mt-8 flex items-end gap-3" style={{ height: 180 }}>
            {weeklyData.map((d, i) => {
              const isToday = i === weeklyData.length - 1;
              const isActive = d.minutes > 0;
              const height = Math.max((d.minutes / maxMinutes) * 160, isActive ? 6 : 0);
              return (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  {d.minutes > 0 && (
                    <span className="text-xs font-medium text-charcoal/40">{d.minutes}m</span>
                  )}
                  <div className="flex w-full max-w-[44px] flex-1 items-end">
                    <div
                      className={`w-full rounded-lg transition ${isToday && isActive ? "bg-terracotta" : isActive ? "bg-primary/40" : "bg-primary/10"}`}
                      style={{ height: isActive ? height : 6 }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? "font-semibold text-terracotta" : isActive ? "text-charcoal/50" : "text-charcoal/30"}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Question Bank</h2>
          <p className="mt-1 text-xs text-charcoal/40">Top sections by question count</p>
          <div className="mt-5 space-y-4">
            {sectionBreakdown.map((s) => (
              <div key={s.section}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal/70">{s.section}</span>
                  <span className="text-charcoal/40">{s.questions}q</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-primary/10">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-charcoal/30">192 total questions across 14 sections</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Section Practice</h2>
          <div className="mt-4 space-y-3">
            {recentSections.map((item) => (
              <div key={item.section} className="flex items-center gap-4 rounded-xl border border-primary/5 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Plane size={18} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{item.section}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/5 px-2.5 py-1 text-xs text-charcoal/40">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Study Insights</h2>
          <div className="mt-4 space-y-4">
            <InsightCard
              icon={<GraduationCap size={18} className="text-primary" />}
              title="Section 3 has the most questions"
              description="Communications accounts for 15% of the question bank (29 questions). Strong here means a reliable 15% of your exam score."
              type="info"
            />
            <InsightCard
              icon={<AlertTriangle size={18} className="text-gold" />}
              title="Hard sections ahead"
              description="Sections 6 (Pilot Responsibilities) and 12 (Navigation & Airspace) are rated Hard. Prioritize these early."
              type="warning"
            />
            <InsightCard
              icon={<TrendingUp size={18} className="text-green-500" />}
              title="Start with easy wins"
              description="Sections 2, 4, 8, and 14 are rated Easy. Build early momentum by mastering these first."
              type="positive"
            />
            <InsightCard
              icon={<BookOpen size={18} className="text-terracotta" />}
              title="Exam format"
              description="50 questions drawn randomly from all 192. Pass mark: 90% (45/50). Your personal target: 95% (48/50)."
              type="info"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-primary">Study Activity (May 2026)</h2>
          <Calendar size={18} className="text-charcoal/30" />
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="pb-1 text-center text-xs text-charcoal/30">{d}</div>
          ))}
          {heatmapIntensity.map((intensity, i) => {
            const day = i - 4;
            const isReal = day >= 1 && day <= 31;
            const colors = ["bg-primary/5", "bg-primary/15", "bg-primary/35", "bg-primary/65"];
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm transition hover:ring-2 hover:ring-primary/20 ${isReal ? colors[intensity] : "bg-transparent"}`}
                title={isReal ? `May ${day}: ${intensity === 0 ? "No" : intensity === 1 ? "Light" : intensity === 2 ? "Moderate" : "Active"} study` : ""}
              />
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-charcoal/30">
          <span>Less</span>
          {["bg-primary/5", "bg-primary/15", "bg-primary/35", "bg-primary/65"].map((c, i) => (
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
