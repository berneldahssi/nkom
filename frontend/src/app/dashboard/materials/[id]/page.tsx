"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Layers, GraduationCap, Plane, Radio, Trophy, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchMaterial, fetchSections, type Material, type Section } from "@/lib/materials-api";

const EXAM_ICONS: Record<string, React.ReactNode> = {
  PSTAR: <Plane size={28} className="text-terracotta" />,
  "ROC-A": <Radio size={28} className="text-primary" />,
};

function diffBadge(d: string | null) {
  if (!d) return null;
  const cls =
    d === "easy" ? "bg-green-50 text-green-600" :
    d === "hard" ? "bg-red-50 text-red-500" :
    "bg-gold/10 text-amber-700";
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{d}</span>;
}

export default function MaterialPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [material, setMaterial] = useState<Material | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !id) return;
    Promise.all([fetchMaterial(accessToken, id), fetchSections(accessToken, id)])
      .then(([mat, secs]) => { setMaterial(mat); setSections(secs); })
      .catch(() => setError("Could not load material."))
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to materials
        </Link>
        <div className="mt-16 flex justify-center">
          <Loader2 size={32} className="animate-spin text-primary/40" />
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to materials
        </Link>
        <p className="mt-8 text-charcoal/50">{error ?? "Material not found."}</p>
      </div>
    );
  }

  const icon = EXAM_ICONS[material.exam_code ?? ""] ?? <Layers size={28} className="text-primary" />;
  const iconBg = material.exam_code === "PSTAR" ? "bg-terracotta/10" : "bg-primary/10";
  const totalQuestions = sections.reduce((s, sec) => s + sec.question_count, 0);
  const isComingSoon = material.generated_formats?.quiz === "coming_soon";

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
        <ArrowLeft size={16} /> Back to materials
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{material.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-charcoal/40">
            {material.subject && <span className="rounded-full bg-primary/5 px-3 py-0.5">{material.subject}</span>}
            {totalQuestions > 0 && <span>{totalQuestions} questions across {sections.length} sections</span>}
          </div>
          {material.description && (
            <p className="mt-2 text-sm text-charcoal/60">{material.description}</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {!isComingSoon && totalQuestions > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/review"
            className="flex items-center gap-4 rounded-2xl border-2 border-terracotta/25 bg-terracotta/5 p-5 transition hover:border-terracotta/40 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta/15">
              <Layers size={22} className="text-terracotta" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-primary">Review Flashcards</p>
              <p className="text-xs text-charcoal/40">Spaced repetition · all sections</p>
            </div>
            <ArrowRight size={16} className="text-terracotta" />
          </Link>
          <Link
            href="/dashboard/quiz"
            className="flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 transition hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-primary">Full Exam Simulation</p>
              <p className="text-xs text-charcoal/40">
                {material.exam_code === "PSTAR" ? "50 questions · 90% pass mark" : "Full exam mode"}
              </p>
            </div>
            <ArrowRight size={16} className="text-primary" />
          </Link>
        </div>
      )}

      {isComingSoon && (
        <div className="mt-8 rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
          <Trophy size={32} className="mx-auto text-primary/40" />
          <p className="mt-3 font-heading text-lg font-semibold text-primary">Study materials coming soon</p>
          <p className="mt-2 text-sm text-charcoal/50">
            Questions for this exam are being prepared. They'll appear here automatically once ready.
          </p>
        </div>
      )}

      {/* Sections list */}
      {sections.length > 0 && (
        <>
          <p className="mt-8 text-xs font-medium uppercase tracking-wider text-charcoal/30">
            {isComingSoon ? "Sections preview" : `${sections.length} sections`}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {sections.map((sec) => {
              const href = isComingSoon || sec.question_count === 0
                ? "#"
                : `/dashboard/materials/${id}/${sec.id}`;
              return (
                <Link
                  key={sec.id}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl border border-primary/10 bg-white p-4 transition ${
                    href === "#" ? "cursor-default opacity-60" : "hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  {sec.section_number !== null && (
                    <span className="w-6 shrink-0 text-sm font-bold text-terracotta">§{sec.section_number}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{sec.title}</p>
                    <p className="text-xs text-charcoal/40">
                      {sec.question_count > 0 ? `${sec.question_count} questions` : "No questions yet"}
                    </p>
                  </div>
                  {diffBadge(sec.difficulty)}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
