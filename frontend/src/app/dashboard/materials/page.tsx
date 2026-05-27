"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  Layers,
  GraduationCap,
  Clock,
  MoreVertical,
  Plane,
  Trophy,
} from "lucide-react";
import { PSTAR_SECTIONS } from "@/lib/pstar-data";

type Difficulty = "mixed" | "easy" | "medium" | "hard";

const allMaterial = {
  id: "all",
  title: "Full PSTAR Question Bank",
  subject: "All 14 Sections",
  difficulty: "mixed" as Difficulty,
  meta: "TC TP 11919E · 7th Edition",
  formats: ["flashcards", "quiz"],
  progress: 0,
  cards: 192,
  featured: true,
};

const sectionMaterials = PSTAR_SECTIONS.map((s) => ({
  id: String(s.number),
  title: s.title,
  subject: `Section ${s.number}`,
  difficulty: s.difficulty as Difficulty,
  meta: `${s.questions.length} questions`,
  formats: ["flashcards", "quiz"],
  progress: 0,
  cards: s.questions.length,
  featured: false,
}));

const materials = [allMaterial, ...sectionMaterials];

const filterTabs = ["All", "Easy", "Medium", "Hard"];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Easy" && m.difficulty === "easy") ||
      (activeFilter === "Medium" && m.difficulty === "medium") ||
      (activeFilter === "Hard" && m.difficulty === "hard");
    return matchesSearch && matchesFilter;
  });

  const nonFeatured = filtered.filter((m) => !m.featured);
  const featuredVisible = filtered.find((m) => m.featured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">PSTAR Study Materials</h1>
          <p className="mt-1 text-sm text-charcoal/50">
            Transport Canada TP 11919E — {materials.length - 1} sections + full question bank
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus size={16} /> Add material
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
        <input
          type="text"
          placeholder="Search sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === tab
                ? "bg-primary text-white"
                : "bg-white text-charcoal/50 hover:bg-neutral hover:text-charcoal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured: Full PSTAR Bank */}
      {featuredVisible && (
        <Link
          href="/dashboard/materials/all"
          className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-terracotta/25 bg-gradient-to-r from-terracotta/5 to-gold/5 p-6 transition hover:border-terracotta/40 hover:shadow-md"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-terracotta/15">
            <Trophy size={26} className="text-terracotta" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-primary">{allMaterial.title}</h3>
            <p className="mt-0.5 text-sm text-charcoal/50">{allMaterial.subject} · {allMaterial.cards} questions · {allMaterial.meta}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            {allMaterial.formats.map((f) => (
              <span key={f} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-charcoal/50 shadow-sm">
                {f === "flashcards" ? <Layers size={11} /> : <GraduationCap size={11} />}
                {f}
              </span>
            ))}
          </div>
        </Link>
      )}

      {/* Section grid */}
      {nonFeatured.length > 0 && (
        <>
          {featuredVisible && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-charcoal/30">Practice by section</p>
          )}
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonFeatured.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/materials/${m.id}`}
                className="group flex flex-col rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Plane size={20} className="text-primary" />
                  </div>
                  <button
                    className="rounded-lg p-1 text-charcoal/20 hover:bg-neutral hover:text-charcoal/50"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h3 className="mt-4 font-heading font-semibold text-primary group-hover:text-primary-600">
                  {m.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-charcoal/40">
                  <span className="rounded-full bg-primary/5 px-2 py-0.5">{m.subject}</span>
                  <span className={`rounded-full px-2 py-0.5 ${
                    m.difficulty === "easy" ? "bg-green-50 text-green-600" :
                    m.difficulty === "hard" ? "bg-red-50 text-red-500" :
                    "bg-gold/10 text-amber-700"
                  }`}>
                    {m.difficulty}
                  </span>
                </div>

                <div className="mt-4 flex gap-1.5">
                  {m.formats.map((f) => (
                    <span key={f} className="flex items-center gap-1 rounded-md bg-neutral px-2 py-1 text-xs text-charcoal/50">
                      {f === "flashcards" ? <Layers size={10} /> : <GraduationCap size={10} />}
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-primary/10">
                    <div className="h-full w-0 rounded-full bg-terracotta" />
                  </div>
                  <span className="text-xs font-medium text-charcoal/40">New</span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-charcoal/30">
                  <Clock size={10} /> {m.cards} questions
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-charcoal/40">No sections match your search.</p>
        </div>
      )}
    </div>
  );
}
