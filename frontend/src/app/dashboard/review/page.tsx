"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  Brain,
} from "lucide-react";

const flashcards = [
  { id: 1, front: "What is the powerhouse of the cell?", back: "Mitochondria — produces ATP through cellular respiration", hint: "Mighty Mitochondria", material: "Cell Biology", difficulty: "medium" },
  { id: 2, front: "What is the fluid mosaic model?", back: "Describes cell membrane as proteins floating in a fluid phospholipid bilayer", hint: "Sea of lipids with protein islands", material: "Cell Biology", difficulty: "hard" },
  { id: 3, front: "What year did the French Revolution begin?", back: "1789 — the storming of the Bastille on July 14th", hint: "Think: 17-89, flip the digits", material: "French Revolution", difficulty: "easy" },
  { id: 4, front: "What is a determinant in linear algebra?", back: "A scalar value computed from a square matrix, indicates if the matrix is invertible (non-zero = invertible)", hint: "det(A) = ad - bc for 2x2", material: "Linear Algebra", difficulty: "hard" },
  { id: 5, front: "What is the difference between mitosis and meiosis?", back: "Mitosis: 2 identical diploid cells (growth). Meiosis: 4 unique haploid cells (reproduction)", hint: "MITosis = same, MEIosis = unique ME", material: "Cell Biology", difficulty: "medium" },
  { id: 6, front: "Who led the Reign of Terror?", back: "Maximilien Robespierre, head of the Committee of Public Safety (1793-1794)", hint: "Robes-PIERRE = Pierre of Robes", material: "French Revolution", difficulty: "medium" },
  { id: 7, front: "What is an eigenvalue?", back: "A scalar lambda where Av = lambda*v for a non-zero vector v (eigenvector)", hint: "EIGEN = own, the matrix's own special values", material: "Linear Algebra", difficulty: "hard" },
  { id: 8, front: "What does the Golgi apparatus do?", back: "Modifies, packages, and ships proteins and lipids to their destinations", hint: "The cell's post office", material: "Cell Biology", difficulty: "easy" },
];

type Rating = "again" | "hard" | "good" | "easy";

export default function ReviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<{ id: number; rating: Rating }[]>([]);
  const [showHint, setShowHint] = useState(false);

  const remaining = flashcards.length - reviewed.length;
  const currentCard = flashcards[currentIndex];
  const isDone = reviewed.length === flashcards.length;

  const handleRate = (rating: Rating) => {
    setReviewed((r) => [...r, { id: currentCard.id, rating }]);
    setFlipped(false);
    setShowHint(false);
    // Move to next unreviewed card
    const reviewedIds = new Set([...reviewed.map((r) => r.id), currentCard.id]);
    const nextIndex = flashcards.findIndex((c, i) => i > currentIndex && !reviewedIds.has(c.id));
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    } else {
      const firstUnreviewed = flashcards.findIndex((c) => !reviewedIds.has(c.id));
      if (firstUnreviewed !== -1) setCurrentIndex(firstUnreviewed);
    }
  };

  if (isDone) {
    const ratings = { again: 0, hard: 0, good: 0, easy: 0 };
    reviewed.forEach((r) => ratings[r.rating]++);

    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Review Complete!</h1>
        <p className="mt-2 text-charcoal/60">
          You reviewed {flashcards.length} flashcards. Great work!
        </p>
        <div className="mt-8 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-red-50 p-4">
            <p className="font-heading text-2xl font-bold text-red-500">{ratings.again}</p>
            <p className="text-xs text-red-400">Again</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="font-heading text-2xl font-bold text-orange-500">{ratings.hard}</p>
            <p className="text-xs text-orange-400">Hard</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="font-heading text-2xl font-bold text-blue-500">{ratings.good}</p>
            <p className="text-xs text-blue-400">Good</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <p className="font-heading text-2xl font-bold text-green-500">{ratings.easy}</p>
            <p className="text-xs text-green-400">Easy</p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => { setReviewed([]); setCurrentIndex(0); setFlipped(false); }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            <RotateCcw size={16} /> Review again
          </button>
          <Link href="/dashboard" className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary-50">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-primary">Flashcard Review</h1>
        <span className="rounded-full bg-terracotta/10 px-3 py-1 text-sm font-semibold text-terracotta">
          {remaining} remaining
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-terracotta transition-all"
          style={{ width: `${(reviewed.length / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Card info */}
      <div className="mt-2 flex items-center gap-2 text-xs text-charcoal/40">
        <Brain size={12} />
        <span>{currentCard.material}</span>
        <span className={`rounded-full px-2 py-0.5 ${
          currentCard.difficulty === "easy" ? "bg-green-50 text-green-600" :
          currentCard.difficulty === "medium" ? "bg-gold/10 text-gold-700" :
          "bg-red-50 text-red-500"
        }`}>
          {currentCard.difficulty}
        </span>
      </div>

      {/* Flashcard */}
      <div className="mt-6">
        <button onClick={() => setFlipped(!flipped)} className="w-full text-left">
          <div className={`min-h-[280px] rounded-2xl border bg-white p-8 shadow-lg transition-all duration-300 ${
            flipped ? "border-green-200 shadow-green-100" : "border-primary/10"
          }`}>
            {!flipped ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Question</p>
                <p className="mt-6 font-heading text-2xl font-semibold text-primary">
                  {currentCard.front}
                </p>
                <p className="mt-12 text-sm text-charcoal/30">Tap to reveal answer</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-green-600">Answer</p>
                <p className="mt-6 text-lg leading-relaxed text-charcoal/80">
                  {currentCard.back}
                </p>
                {showHint && currentCard.hint && (
                  <div className="mt-6 flex items-start gap-2 rounded-lg bg-gold/10 p-3">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold" />
                    <p className="text-sm text-gold-800">Mnemonic: {currentCard.hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Hint toggle */}
      {flipped && !showHint && currentCard.hint && (
        <button
          onClick={() => setShowHint(true)}
          className="mt-3 flex items-center gap-2 text-sm text-gold hover:underline"
        >
          <Lightbulb size={14} /> Show mnemonic hint
        </button>
      )}

      {/* Rating buttons */}
      {flipped && (
        <div className="mt-6">
          <p className="mb-3 text-center text-sm text-charcoal/40">How well did you know this?</p>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => handleRate("again")} className="rounded-xl bg-red-50 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100">
              <span className="block text-lg">1</span>
              Again
            </button>
            <button onClick={() => handleRate("hard")} className="rounded-xl bg-orange-50 py-3 text-sm font-medium text-orange-600 transition hover:bg-orange-100">
              <span className="block text-lg">2</span>
              Hard
            </button>
            <button onClick={() => handleRate("good")} className="rounded-xl bg-blue-50 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
              <span className="block text-lg">3</span>
              Good
            </button>
            <button onClick={() => handleRate("easy")} className="rounded-xl bg-green-50 py-3 text-sm font-medium text-green-600 transition hover:bg-green-100">
              <span className="block text-lg">4</span>
              Easy
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs text-charcoal/30">
            <span>1 min</span>
            <span>1 day</span>
            <span>3 days</span>
            <span>7 days</span>
          </div>
        </div>
      )}
    </div>
  );
}
