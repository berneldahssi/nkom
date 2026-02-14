"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Brain,
  Search,
  Filter,
  Plus,
  BookOpen,
  Headphones,
  Layers,
  GraduationCap,
  Clock,
  MoreVertical,
} from "lucide-react";

const materials = [
  { id: "1", title: "Introduction to Cell Biology", subject: "Biology", date: "Feb 10, 2026", formats: ["summary", "flashcards", "quiz"], progress: 75, cards: 12 },
  { id: "2", title: "French Revolution Notes", subject: "History", date: "Feb 9, 2026", formats: ["summary", "podcast", "flashcards"], progress: 45, cards: 15 },
  { id: "3", title: "Linear Algebra - Chapter 3", subject: "Mathematics", date: "Feb 8, 2026", formats: ["summary", "flashcards"], progress: 90, cards: 8 },
  { id: "4", title: "Organic Chemistry Reactions", subject: "Chemistry", date: "Feb 7, 2026", formats: ["summary", "flashcards", "quiz"], progress: 60, cards: 20 },
  { id: "5", title: "Shakespeare's Hamlet Analysis", subject: "Literature", date: "Feb 6, 2026", formats: ["summary", "podcast"], progress: 30, cards: 0 },
  { id: "6", title: "Data Structures & Algorithms", subject: "Computer Science", date: "Feb 5, 2026", formats: ["summary", "flashcards", "quiz"], progress: 85, cards: 18 },
  { id: "7", title: "Macroeconomics Principles", subject: "Economics", date: "Feb 4, 2026", formats: ["summary", "flashcards"], progress: 20, cards: 10 },
  { id: "8", title: "Human Anatomy - Nervous System", subject: "Biology", date: "Feb 3, 2026", formats: ["summary", "flashcards", "quiz", "podcast"], progress: 55, cards: 25 },
];

const subjects = ["All", "Biology", "History", "Mathematics", "Chemistry", "Literature", "Computer Science", "Economics"];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  const filtered = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = activeSubject === "All" || m.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const formatIcon = (f: string) => {
    switch (f) {
      case "summary": return <BookOpen size={12} />;
      case "podcast": return <Headphones size={12} />;
      case "flashcards": return <Layers size={12} />;
      case "quiz": return <GraduationCap size={12} />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Study Materials</h1>
          <p className="mt-1 text-sm text-charcoal/50">{materials.length} materials in your library</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus size={16} /> Add material
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm text-charcoal/60 hover:bg-neutral sm:hidden">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Subject tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeSubject === s
                ? "bg-primary text-white"
                : "bg-white text-charcoal/50 hover:bg-neutral hover:text-charcoal"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Materials grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/materials/${m.id}`}
            className="group flex flex-col rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Brain size={20} className="text-primary" />
              </div>
              <button className="rounded-lg p-1 text-charcoal/20 hover:bg-neutral hover:text-charcoal/50" onClick={(e) => e.preventDefault()}>
                <MoreVertical size={16} />
              </button>
            </div>
            <h3 className="mt-4 font-heading font-semibold text-primary group-hover:text-primary-600">{m.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-charcoal/40">
              <span className="rounded-full bg-primary/5 px-2 py-0.5">{m.subject}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {m.date}</span>
            </div>

            {/* Formats */}
            <div className="mt-4 flex gap-1.5">
              {m.formats.map((f) => (
                <span key={f} className="flex items-center gap-1 rounded-md bg-neutral px-2 py-1 text-xs text-charcoal/50">
                  {formatIcon(f)} {f}
                </span>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-primary/10">
                <div
                  className={`h-full rounded-full ${m.progress >= 80 ? "bg-green-500" : m.progress >= 50 ? "bg-gold" : "bg-terracotta"}`}
                  style={{ width: `${m.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-charcoal/40">{m.progress}%</span>
            </div>
            {m.cards > 0 && (
              <p className="mt-2 text-xs text-charcoal/30">{m.cards} flashcards</p>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-charcoal/40">No materials match your search.</p>
        </div>
      )}
    </div>
  );
}
