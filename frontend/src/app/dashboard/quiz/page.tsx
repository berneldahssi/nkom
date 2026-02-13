"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  Clock,
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Trophy,
  Brain,
} from "lucide-react";

const quizSets = [
  { id: "1", title: "Cell Biology", questions: 10, bestScore: 80, difficulty: "Medium", subject: "Biology" },
  { id: "2", title: "French Revolution", questions: 8, bestScore: null, difficulty: "Easy", subject: "History" },
  { id: "3", title: "Linear Algebra", questions: 12, bestScore: 65, difficulty: "Hard", subject: "Mathematics" },
  { id: "4", title: "Organic Chemistry", questions: 10, bestScore: 90, difficulty: "Hard", subject: "Chemistry" },
];

const sampleQuestions = [
  { question: "Which organelle is responsible for ATP production?", options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Ribosome"], correct: 1 },
  { question: "The cell membrane is described by which model?", options: ["Lock and Key", "Fluid Mosaic", "Double Helix", "Central Dogma"], correct: 1 },
  { question: "During which phase does DNA replication occur?", options: ["G1 Phase", "S Phase", "G2 Phase", "M Phase"], correct: 1 },
  { question: "Prokaryotic cells lack which structure?", options: ["Cell membrane", "Ribosomes", "Nucleus", "DNA"], correct: 2 },
  { question: "What is the function of the rough ER?", options: ["Lipid synthesis", "Protein synthesis", "ATP production", "Cell division"], correct: 1 },
];

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  if (!selectedQuiz) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="font-heading text-2xl font-bold text-primary">Practice Quizzes</h1>
        <p className="mt-1 text-sm text-charcoal/50">
          Test your knowledge with AI-generated quizzes based on your study materials.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {quizSets.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz.id)}
              className="flex flex-col rounded-2xl border border-primary/10 bg-white p-6 text-left transition hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap size={24} className="text-primary" />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  quiz.difficulty === "Easy" ? "bg-green-50 text-green-600" :
                  quiz.difficulty === "Medium" ? "bg-gold/10 text-gold-700" :
                  "bg-red-50 text-red-500"
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-primary">{quiz.title}</h3>
              <p className="mt-1 text-xs text-charcoal/40">{quiz.subject} &middot; {quiz.questions} questions</p>
              {quiz.bestScore !== null ? (
                <div className="mt-4 flex items-center gap-2">
                  <Trophy size={14} className="text-gold" />
                  <span className="text-sm font-medium text-charcoal/60">Best: {quiz.bestScore}%</span>
                </div>
              ) : (
                <p className="mt-4 text-sm text-terracotta font-medium">Not attempted yet</p>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const percentage = Math.round((score / sampleQuestions.length) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
          percentage >= 80 ? "bg-green-50" : percentage >= 50 ? "bg-gold/10" : "bg-red-50"
        }`}>
          {percentage >= 80 ? (
            <Trophy size={44} className="text-green-500" />
          ) : (
            <GraduationCap size={44} className={percentage >= 50 ? "text-gold" : "text-red-400"} />
          )}
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Quiz Complete!</h1>
        <p className="mt-4 font-heading text-5xl font-bold text-terracotta">{percentage}%</p>
        <p className="mt-1 text-charcoal/50">
          {score} out of {sampleQuestions.length} correct
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-charcoal/40">
          <span className="flex items-center gap-1"><Clock size={14} /> {minutes}m {seconds}s</span>
          <span className="flex items-center gap-1"><Brain size={14} /> {sampleQuestions.length} questions</span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            <RotateCcw size={16} /> Retry
          </button>
          <button
            onClick={() => { setSelectedQuiz(null); setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}
            className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary-50"
          >
            All quizzes
          </button>
        </div>
      </div>
    );
  }

  const q = sampleQuestions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= sampleQuestions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={() => { setSelectedQuiz(null); setCurrent(0); setSelected(null); setAnswered(false); setScore(0); }}
        className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to quizzes
      </button>

      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-primary">Cell Biology Quiz</h1>
        <span className="text-sm text-charcoal/40">{score}/{current + (answered ? 1 : 0)} correct</span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / sampleQuestions.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs text-charcoal/30">Question {current + 1} of {sampleQuestions.length}</p>

      <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-8">
        <h2 className="font-heading text-xl font-semibold text-primary">{q.question}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt, idx) => {
            let style = "border-primary/10 hover:border-primary/20 hover:bg-neutral/50";
            if (answered && idx === q.correct) style = "border-green-500 bg-green-50";
            else if (answered && idx === selected) style = "border-red-400 bg-red-50";

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  answered && idx === q.correct ? "bg-green-500 text-white" :
                  answered && idx === selected ? "bg-red-400 text-white" :
                  "bg-primary/10 text-primary"
                }`}>
                  {answered && idx === q.correct ? <Check size={14} /> :
                   answered && idx === selected ? <X size={14} /> :
                   String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            {current + 1 >= sampleQuestions.length ? "See Results" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
