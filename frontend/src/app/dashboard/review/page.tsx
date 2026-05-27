"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  Brain,
  Plane,
  Keyboard,
  CalendarCheck,
} from "lucide-react";
import { PSTAR_FLASHCARDS } from "@/lib/pstar-data";
import {
  type Rating,
  getDueCards,
  updateCardState,
  previewIntervalLabels,
  getDueCount,
} from "@/lib/sm2";

const SESSION_SIZE = 20;

export default function ReviewPage() {
  const [initialized, setInitialized] = useState(false);
  const [sessionCards, setSessionCards] = useState<typeof PSTAR_FLASHCARDS>([]);
  const [totalDue, setTotalDue] = useState(0);

  // Load due cards client-side (localStorage not available on server)
  useEffect(() => {
    const due = getDueCards(PSTAR_FLASHCARDS, SESSION_SIZE);
    setSessionCards(due);
    setTotalDue(getDueCount(PSTAR_FLASHCARDS));
    setInitialized(true);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<{ id: string; rating: Rating }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showKbHint, setShowKbHint] = useState(false);

  const remaining = sessionCards.length - reviewed.length;
  const currentCard = sessionCards[currentIndex];
  const isDone = initialized && reviewed.length === sessionCards.length;
  const nothingDue = initialized && sessionCards.length === 0;

  // Preview intervals for the current card's rating buttons
  const intervals = useMemo(
    () => (currentCard ? previewIntervalLabels(currentCard.id) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCard?.id, reviewed.length]
  );

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return;
      updateCardState(currentCard.id, rating);
      setReviewed((r) => [...r, { id: currentCard.id, rating }]);
      setFlipped(false);
      setShowHint(false);

      const reviewedIds = new Set([...reviewed.map((r) => r.id), currentCard.id]);
      const nextIndex = sessionCards.findIndex(
        (c, i) => i > currentIndex && !reviewedIds.has(c.id)
      );
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
      } else {
        const firstUnreviewed = sessionCards.findIndex((c) => !reviewedIds.has(c.id));
        if (firstUnreviewed !== -1) setCurrentIndex(firstUnreviewed);
      }
    },
    [currentCard, currentIndex, sessionCards, reviewed]
  );

  useEffect(() => {
    if (isDone || nothingDue) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (flipped) {
        if (e.key === "1") handleRate("again");
        if (e.key === "2") handleRate("hard");
        if (e.key === "3") handleRate("good");
        if (e.key === "4") handleRate("easy");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, isDone, nothingDue, handleRate]);

  // All caught up screen
  if (nothingDue) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CalendarCheck size={40} className="text-success" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">All caught up!</h1>
        <p className="mt-2 text-charcoal/60">No flashcards are due for review right now.</p>
        <p className="mt-1 text-sm text-charcoal/40">
          Come back tomorrow — your next cards will be ready then.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  // Session complete screen
  if (isDone) {
    const ratings = { again: 0, hard: 0, good: 0, easy: 0 };
    reviewed.forEach((r) => ratings[r.rating]++);
    const retained = ratings.good + ratings.easy;
    const retentionPct = Math.round((retained / sessionCards.length) * 100);
    const stillDue = Math.max(0, totalDue - sessionCards.length);

    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Session Complete!</h1>
        <p className="mt-2 text-charcoal/60">You reviewed {sessionCards.length} PSTAR flashcards.</p>
        <p className="mt-1 text-sm font-semibold text-terracotta">{retentionPct}% retention this session</p>
        <div className="mt-8 grid grid-cols-4 gap-3">
          {[
            { label: "Again", count: ratings.again, color: "bg-error/10 text-error" },
            { label: "Hard", count: ratings.hard, color: "bg-warning/10 text-warning" },
            { label: "Good", count: ratings.good, color: "bg-info/10 text-info" },
            { label: "Easy", count: ratings.easy, color: "bg-success/10 text-success" },
          ].map((r) => (
            <div key={r.label} className={`rounded-xl p-4 ${r.color.split(" ")[0]}`}>
              <p className={`font-heading text-2xl font-bold ${r.color.split(" ")[1]}`}>{r.count}</p>
              <p className={`text-xs ${r.color.split(" ")[1]} opacity-70`}>{r.label}</p>
            </div>
          ))}
        </div>
        {stillDue > 0 && (
          <p className="mt-4 text-sm text-charcoal/40">
            {stillDue} more card{stillDue !== 1 ? "s" : ""} still due today.
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          {stillDue > 0 ? (
            <button
              onClick={() => {
                const due = getDueCards(PSTAR_FLASHCARDS, SESSION_SIZE);
                setSessionCards(due);
                setTotalDue(getDueCount(PSTAR_FLASHCARDS));
                setReviewed([]);
                setCurrentIndex(0);
                setFlipped(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
            >
              <RotateCcw size={16} /> Continue ({stillDue} left)
            </button>
          ) : (
            <button
              onClick={() => {
                const due = getDueCards(PSTAR_FLASHCARDS, SESSION_SIZE);
                setSessionCards(due);
                setTotalDue(getDueCount(PSTAR_FLASHCARDS));
                setReviewed([]);
                setCurrentIndex(0);
                setFlipped(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
            >
              <RotateCcw size={16} /> New session
            </button>
          )}
          <Link
            href="/dashboard"
            className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary/5"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (!initialized || !currentCard) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8 animate-pulse">
        <div className="h-8 w-40 rounded-lg bg-primary/10" />
        <div className="mt-8 h-72 rounded-2xl bg-primary/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <button
          onClick={() => setShowKbHint((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-charcoal/30 hover:text-charcoal/60"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard size={14} /> Shortcuts
        </button>
      </div>

      {showKbHint && (
        <div className="mt-3 flex flex-wrap gap-3 rounded-xl border border-primary/10 bg-white p-3 text-xs text-charcoal/50">
          <span><kbd className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">Space</kbd> Flip card</span>
          <span><kbd className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">1</kbd> Again</span>
          <span><kbd className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">2</kbd> Hard</span>
          <span><kbd className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">3</kbd> Good</span>
          <span><kbd className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">4</kbd> Easy</span>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">PSTAR Flashcard Review</h1>
          <p className="text-xs text-charcoal/40">Transport Canada TP 11919E</p>
        </div>
        <span className="rounded-full bg-terracotta/10 px-3 py-1 text-sm font-semibold text-terracotta">
          {remaining} remaining
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-terracotta transition-all"
          style={{ width: `${(reviewed.length / sessionCards.length) * 100}%` }}
        />
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-charcoal/40">
        <Brain size={12} />
        <span>{currentCard.material}</span>
        <span className={`rounded-full px-2 py-0.5 ${
          currentCard.difficulty === "easy" ? "bg-success/10 text-success" :
          currentCard.difficulty === "medium" ? "bg-gold/10 text-amber-700" :
          "bg-error/10 text-error"
        }`}>
          {currentCard.difficulty}
        </span>
        <span className="ml-1 rounded-full bg-primary/5 px-2 py-0.5 font-mono text-primary/50">
          Q {currentCard.id}
        </span>
      </div>

      {/* 3D flip card */}
      <div className="perspective mt-6">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full text-left"
          aria-label={flipped ? "Show question" : "Reveal answer"}
        >
          <div
            className="preserve-3d relative min-h-[280px] transition-transform duration-500"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front face */}
            <div className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-primary/10 bg-white p-8 shadow-card">
              <div className="flex items-center gap-2">
                <Plane size={14} className="text-terracotta" />
                <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Question</p>
              </div>
              <p className="mt-6 flex-1 font-heading text-xl font-semibold text-primary">
                {currentCard.front}
              </p>
              <p className="text-sm text-charcoal/30">
                Press <kbd className="rounded bg-primary/10 px-1 py-0.5 font-mono text-xs text-primary">Space</kbd> or tap to reveal
              </p>
            </div>

            {/* Back face */}
            <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col rounded-2xl border border-success/20 bg-white p-8 shadow-card">
              <p className="text-xs font-medium uppercase tracking-wider text-success">Answer</p>
              <p className="mt-6 flex-1 text-lg font-semibold leading-relaxed text-charcoal/80">
                {currentCard.back}
              </p>
              {showHint && currentCard.hint && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-gold/10 p-3">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="text-sm text-amber-800 dark:text-amber-400">{currentCard.hint}</p>
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {flipped && !showHint && currentCard.hint && (
        <button
          onClick={() => setShowHint(true)}
          className="mt-3 flex items-center gap-2 text-sm text-amber-600 hover:underline"
        >
          <Lightbulb size={14} /> Show mnemonic
        </button>
      )}

      {flipped && (
        <div className="mt-6">
          <p className="mb-3 text-center text-sm text-charcoal/40">How well did you know this?</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { rating: "again" as Rating, label: "Again", key: "1", bg: "bg-error/10 hover:bg-error/20 text-error" },
              { rating: "hard" as Rating, label: "Hard", key: "2", bg: "bg-warning/10 hover:bg-warning/20 text-warning" },
              { rating: "good" as Rating, label: "Good", key: "3", bg: "bg-info/10 hover:bg-info/20 text-info" },
              { rating: "easy" as Rating, label: "Easy", key: "4", bg: "bg-success/10 hover:bg-success/20 text-success" },
            ].map((btn) => (
              <button
                key={btn.rating}
                onClick={() => handleRate(btn.rating)}
                className={`rounded-xl py-3 text-sm font-medium transition ${btn.bg}`}
              >
                <span className="block text-lg font-bold">{btn.key}</span>
                {btn.label}
              </button>
            ))}
          </div>
          {intervals && (
            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs text-charcoal/30">
              <span>{intervals.again}</span>
              <span>{intervals.hard}</span>
              <span>{intervals.good}</span>
              <span>{intervals.easy}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
