"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft, BookOpen, Layers, GraduationCap, Loader2,
  Lightbulb, Check, X, ChevronRight, RotateCcw, Plane,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchSection, fetchQuestions, fetchFlashcards,
  type Section, type Question, type Flashcard,
} from "@/lib/materials-api";

type Tab = "summary" | "flashcards" | "quiz";

export default function SectionPage() {
  const { id: materialId, section: sectionId } = useParams<{ id: string; section: string }>();
  const { accessToken } = useAuth();

  const [section, setSection] = useState<Section | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  useEffect(() => {
    if (!accessToken || !materialId || !sectionId) return;
    Promise.all([
      fetchSection(accessToken, materialId, sectionId),
      fetchQuestions(accessToken, materialId, sectionId),
      fetchFlashcards(accessToken, materialId, sectionId),
    ])
      .then(([sec, qs, fcs]) => { setSection(sec); setQuestions(qs); setFlashcards(fcs); })
      .catch(() => setError("Could not load section content."))
      .finally(() => setLoading(false));
  }, [accessToken, materialId, sectionId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href={`/dashboard/materials/${materialId}`} className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to material
        </Link>
        <div className="mt-16 flex justify-center"><Loader2 size={32} className="animate-spin text-primary/40" /></div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href={`/dashboard/materials/${materialId}`} className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to material
        </Link>
        <p className="mt-8 text-charcoal/50">{error ?? "Section not found."}</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "summary", label: "Key Concepts", icon: <BookOpen size={16} /> },
    { key: "flashcards", label: `Flashcards (${flashcards.length})`, icon: <Layers size={16} /> },
    { key: "quiz", label: `Quiz (${questions.length})`, icon: <GraduationCap size={16} /> },
  ];

  const diffBg =
    section.difficulty === "easy" ? "bg-green-50 text-green-600" :
    section.difficulty === "hard" ? "bg-red-50 text-red-500" :
    "bg-gold/10 text-amber-700";

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href={`/dashboard/materials/${materialId}`} className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
        <ArrowLeft size={16} /> Back to material
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Plane size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{section.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-charcoal/40">
            {section.section_number !== null && (
              <span className="rounded-full bg-primary/5 px-3 py-0.5">Section {section.section_number}</span>
            )}
            <span>{questions.length} questions</span>
            {section.difficulty && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diffBg}`}>{section.difficulty}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl bg-primary/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-white text-primary shadow-sm" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "summary" && <SummaryView summary={section.summary} />}
        {activeTab === "flashcards" && <FlashcardView flashcards={flashcards} />}
        {activeTab === "quiz" && <QuizView questions={questions} />}
      </div>
    </div>
  );
}

function SummaryView({ summary }: { summary: string | null }) {
  if (!summary) {
    return <p className="text-sm text-charcoal/40">No summary available for this section.</p>;
  }

  // Parse markdown-style ## headings and bullet points
  const blocks: { heading: string; points: string[] }[] = [];
  let current: { heading: string; points: string[] } | null = null;

  for (const line of summary.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      if (current) blocks.push(current);
      current = { heading: trimmed.slice(3), points: [] };
    } else if (trimmed.startsWith("- ") && current) {
      current.points.push(trimmed.slice(2));
    } else if (trimmed.startsWith("*") && current) {
      current.points.push(trimmed.replace(/^\*+/, "").trim());
    }
  }
  if (current) blocks.push(current);

  if (blocks.length === 0) {
    return <p className="whitespace-pre-wrap text-sm text-charcoal/70">{summary}</p>;
  }

  return (
    <div className="space-y-5">
      {blocks.map((block) => (
        <div key={block.heading} className="rounded-2xl border border-primary/10 bg-white p-6">
          <h3 className="font-heading text-lg font-semibold text-primary">{block.heading}</h3>
          <ul className="mt-3 space-y-2">
            {block.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FlashcardView({ flashcards }: { flashcards: Flashcard[] }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) {
    return <p className="text-sm text-charcoal/40">No flashcards available for this section.</p>;
  }

  const fc = flashcards[current];

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-lg">
        <button onClick={() => setFlipped(!flipped)} className="w-full text-left">
          <div className={`min-h-[260px] rounded-2xl border bg-white p-8 shadow-lg transition-all duration-300 ${
            flipped ? "border-green-200 shadow-green-100" : "border-primary/10"
          }`}>
            {!flipped ? (
              <div>
                <div className="flex items-center gap-2">
                  <Plane size={14} className="text-terracotta" />
                  <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Question</p>
                  {fc.source_ref && (
                    <span className="ml-auto font-mono text-xs text-charcoal/30">Q {fc.source_ref}</span>
                  )}
                </div>
                <p className="mt-6 font-heading text-lg font-semibold leading-snug text-primary">
                  {fc.front_text}
                </p>
                <p className="mt-10 text-sm text-charcoal/30">Tap to reveal answer</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-green-600">Answer</p>
                <p className="mt-4 text-lg font-semibold leading-relaxed text-charcoal/80">{fc.back_text}</p>
                {fc.mnemonic_hint && (
                  <div className="mt-6 flex items-start gap-2 rounded-lg bg-gold/10 p-3">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
                    <p className="text-sm text-amber-800">{fc.mnemonic_hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => { setCurrent(Math.max(0, current - 1)); setFlipped(false); }}
          disabled={current === 0}
          className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
        >
          Previous
        </button>
        <span className="text-sm text-charcoal/40">{current + 1} / {flashcards.length}</span>
        <button
          onClick={() => { setCurrent(Math.min(flashcards.length - 1, current + 1)); setFlipped(false); }}
          disabled={current === flashcards.length - 1}
          className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {flipped && (
        <div className="text-center">
          <p className="text-sm text-charcoal/40">How well did you know this?</p>
          <div className="mt-3 flex justify-center gap-2">
            {[
              { label: "Again", color: "bg-red-100 text-red-600 hover:bg-red-200" },
              { label: "Hard", color: "bg-orange-100 text-orange-600 hover:bg-orange-200" },
              { label: "Good", color: "bg-blue-100 text-blue-600 hover:bg-blue-200" },
              { label: "Easy", color: "bg-green-100 text-green-600 hover:bg-green-200" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => { setCurrent(Math.min(flashcards.length - 1, current + 1)); setFlipped(false); }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizView({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return <p className="text-sm text-charcoal/40">No quiz questions available for this section.</p>;
  }

  const q = questions[current];
  const options = q.options ?? [];
  const correctIdx = options.indexOf(q.correct_answer);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (options[idx] === q.correct_answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 90;
    const targetMet = pct >= 95;
    return (
      <div className="rounded-2xl border border-primary/10 bg-white p-8 text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${targetMet ? "bg-green-50" : passed ? "bg-gold/10" : "bg-red-50"}`}>
          <GraduationCap size={36} className={targetMet ? "text-green-500" : passed ? "text-amber-500" : "text-red-400"} />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-bold text-primary">Section Complete!</h3>
        <p className="mt-2 font-heading text-4xl font-bold text-terracotta">{pct}%</p>
        <p className="mt-1 text-sm text-charcoal/50">{score} of {questions.length} correct</p>
        {targetMet && <p className="mt-2 text-sm font-medium text-green-600">Above 95% — excellent!</p>}
        {passed && !targetMet && <p className="mt-2 text-sm font-medium text-amber-600">Passing mark reached — push toward 95%</p>}
        {!passed && <p className="mt-2 text-sm font-medium text-red-500">Below 90% — review key concepts and retry</p>}
        <button
          onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
        >
          <RotateCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-8">
      <div className="flex items-center justify-between text-sm text-charcoal/40">
        <span>Question {current + 1} of {questions.length}</span>
        {q.source_ref && <span className="font-mono text-xs">Q {q.source_ref}</span>}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-primary">{q.question_text}</h3>
      <div className="mt-6 space-y-3">
        {options.map((opt, idx) => {
          let style = "border-primary/10 hover:border-primary/20 hover:bg-neutral/50";
          if (answered && idx === correctIdx) style = "border-green-500 bg-green-50";
          else if (answered && idx === selected) style = "border-red-400 bg-red-50";
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                answered && idx === correctIdx ? "bg-green-500 text-white" :
                answered && idx === selected ? "bg-red-400 text-white" :
                "bg-primary/10 text-primary"
              }`}>
                {answered && idx === correctIdx ? <Check size={14} /> :
                 answered && idx === selected ? <X size={14} /> :
                 String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && q.hint && (
        <div className="mt-4 rounded-xl bg-gold/10 p-4">
          <p className="text-sm text-amber-800"><span className="font-semibold">Tip: </span>{q.hint}</p>
        </div>
      )}
      {answered && (
        <button onClick={handleNext} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90">
          {current + 1 >= questions.length ? "See Results" : "Next Question"} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
