"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Plus, Layers, GraduationCap, Clock, MoreVertical, Plane, Trophy, Radio, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMaterials, type Material } from "@/lib/materials-api";

const EXAM_ICONS: Record<string, React.ReactNode> = {
  PSTAR: <Plane size={20} className="text-terracotta" />,
  "ROC-A": <Radio size={20} className="text-primary" />,
};

const EXAM_COLORS: Record<string, string> = {
  PSTAR: "bg-terracotta/10",
  "ROC-A": "bg-primary/10",
};

function difficultyBadge(d: string | null) {
  if (!d) return null;
  const cls =
    d === "easy" ? "bg-green-50 text-green-600" :
    d === "hard" ? "bg-red-50 text-red-500" :
    "bg-gold/10 text-amber-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{d}</span>;
}

function materialHref(m: Material) {
  if (m.exam_code) return `/dashboard/materials/${m.id}`;
  return `/dashboard/materials/${m.id}`;
}

export default function MaterialsPage() {
  const { accessToken } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!accessToken) return;
    fetchMaterials(accessToken)
      .then(setMaterials)
      .catch(() => setError("Could not load materials. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch = m.title.toLowerCase().includes(q) || (m.subject ?? "").toLowerCase().includes(q);
    const matchesFilter =
      activeFilter === "All" ||
      (m.difficulty_level !== null &&
        ((activeFilter === "Easy" && m.difficulty_level === 1) ||
         (activeFilter === "Medium" && m.difficulty_level === 2) ||
         (activeFilter === "Hard" && m.difficulty_level === 3)));
    return matchesSearch && matchesFilter;
  });

  const preset = filtered.filter((m) => m.material_type === "preset");
  const uploaded = filtered.filter((m) => m.material_type !== "preset");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">My Study Materials</h1>
          <p className="mt-1 text-sm text-charcoal/50">
            {loading ? "Loading…" : `${materials.length} material${materials.length !== 1 ? "s" : ""} in your library`}
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus size={16} /> Add material
        </Link>
      </div>

      <div className="mt-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
        <input
          type="text"
          placeholder="Search materials…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-primary/15 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-4 flex gap-2">
        {["All", "Easy", "Medium", "Hard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === tab ? "bg-primary text-white" : "bg-white text-charcoal/50 hover:bg-neutral hover:text-charcoal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-primary/40" />
          <p className="text-sm text-charcoal/40">Loading your materials…</p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Preset exam materials */}
          {preset.length > 0 && (
            <>
              <p className="mt-8 text-xs font-medium uppercase tracking-wider text-charcoal/30">Exam materials</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {preset.map((m) => (
                  <Link
                    key={m.id}
                    href={materialHref(m)}
                    className="group flex items-center gap-4 rounded-2xl border-2 border-primary/10 bg-white p-5 transition hover:border-primary/25 hover:shadow-md"
                  >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${EXAM_COLORS[m.exam_code ?? ""] ?? "bg-primary/10"}`}>
                      {EXAM_ICONS[m.exam_code ?? ""] ?? <Layers size={20} className="text-primary" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-semibold text-primary group-hover:text-primary/80">{m.title}</h3>
                      <p className="mt-0.5 truncate text-xs text-charcoal/50">{m.subject}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {difficultyBadge(m.difficulty_level === 1 ? "easy" : m.difficulty_level === 3 ? "hard" : "medium")}
                        <span className="flex items-center gap-1 text-xs text-charcoal/40">
                          <GraduationCap size={11} /> quiz
                        </span>
                        <span className="flex items-center gap-1 text-xs text-charcoal/40">
                          <Layers size={11} /> flashcards
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* User-uploaded materials */}
          {uploaded.length > 0 && (
            <>
              <p className="mt-8 text-xs font-medium uppercase tracking-wider text-charcoal/30">Uploaded materials</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {uploaded.map((m) => (
                  <Link
                    key={m.id}
                    href={materialHref(m)}
                    className="group flex flex-col rounded-2xl border border-primary/10 bg-white p-5 transition hover:border-primary/20 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Layers size={20} className="text-primary" />
                      </div>
                      <button className="rounded-lg p-1 text-charcoal/20 hover:bg-neutral hover:text-charcoal/50" onClick={(e) => e.preventDefault()}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h3 className="mt-4 font-heading font-semibold text-primary group-hover:text-primary/80">{m.title}</h3>
                    <p className="mt-1 text-xs text-charcoal/40">{m.subject}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs text-charcoal/30">
                      <Clock size={10} /> {m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-charcoal/40">
                {materials.length === 0
                  ? "No materials yet — log out and log back in to provision your library."
                  : "No materials match your search."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
