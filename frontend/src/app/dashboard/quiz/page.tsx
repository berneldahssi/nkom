"use client";

import { useState, useEffect } from "react";
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
  Plane,
} from "lucide-react";
import { PSTAR_SECTIONS, getRandomQuestions, PSTARQuestion } from "@/lib/pstar-data";
import { CircularProgress } from "@/components/ui/Progress";

const FULL_EXAM_ID = "all";
const FULL_EXAM_COUNT = 50;

const quizSets = [
  {
    id: FULL_EXAM_ID,
    title: "Full PSTAR Exam",
    questions: FULL_EXAM_COUNT,
    difficulty: "Mixed" as const,
    subject: "All 14 Sections",
    featured: true,
  },
  ...PSTAR_SECTIONS.map((s) => ({
    id: String(s.number),
    title: s.title,
    questions: s.questions.length,
    difficulty: (s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)) as "Easy" | "Medium" | "Hard",
    subject: `Section ${s.number}`,
    featured: false,
  })),
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizPage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<PSTARQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finalElapsed, setFinalElapsed] = useState(0);

  useEffect(() => {
    if (!selectedQuizId || done) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [selectedQuizId, done]);

  const handleSelectQuiz = (id: string) => {
    const sectionNum = id === FULL_EXAM_ID ? undefined : parseInt(id);
    const count = id === FULL_EXAM_ID ? FULL_EXAM_COUNT : 9999;
    const questions = getRandomQuestions(count, sectionNum);
    setActiveQuestions(questions);
    setSelectedQuizId(id);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
    setElapsed(0);
    setFinalElapsed(0);
  };

  const handleRetry = () => {
    const sectionNum = selectedQuizId === FULL_EXAM_ID ? undefined : parseInt(selectedQuizId!);
    const count = selectedQuizId === FULL_EXAM_ID ? FULL_EXAM_COUNT : 9999;
    setActiveQuestions(getRandomQuestions(count, sectionNum));
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
    setElapsed(0);
    setFinalElapsed(0);
  };

  const selectedSet = quizSets.find((q) => q.id === selectedQuizId);

  if (!selectedQuizId) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
            <Plane size={20} className="text-terracotta" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">PSTAR Practice Quizzes</h1>
            <p className="text-sm text-charcoal/50">Transport Canada TP 11919E — 192 official questions</p>
          </div>
        </div>

        <button
          onClick={() => handleSelectQuiz(FULL_EXAM_ID)}
          className="mt-8 w-full rounded-2xl border-2 border-terracotta/30 bg-gradient-to-r from-terracotta/5 to-gold/5 p-6 text-left transition hover:border-terracotta/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/15">
                <Trophy size={24} className="text-terracotta" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-primary">Full PSTAR Exam Simulation</h3>
                <p className="text-sm text-charcoal/50">50 random questions from all 14 sections · Shuffled each attempt</p>
              </div>
            </div>
            <span className="rounded-full bg-terracotta/15 px-3 py-1 text-sm font-semibold text-terracotta">
              95% target
            </span>
          </div>
        </button>

        <p className="mt-6 text-xs font-medium uppercase tracking-wider text-charcoal/30">Practice by section</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {quizSets.filter((q) => !q.featured).map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleSelectQuiz(quiz.id)}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-5 text-left transition hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-charcoal">{quiz.title}</h3>
                <p className="text-xs text-charcoal/40">{quiz.subject} &middot; {quiz.questions} questions</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                quiz.difficulty === "Easy" ? "bg-success/10 text-success" :
                quiz.difficulty === "Hard" ? "bg-error/10 text-error" :
                "bg-gold/10 text-amber-700"
              }`}>
                {quiz.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const passed = percentage >= 90;
    const targetMet = percentage >= 95;
    const scoreColor = targetMet ? "text-success" : passed ? "text-warning" : "text-error";

    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">Quiz Complete!</h1>

        {/* Circular SVG score */}
        <div className="mt-6 flex justify-center">
          <CircularProgress value={percentage} size={140} strokeWidth={10}>
            <div className="text-center">
              <p className={`font-heading text-3xl font-bold ${scoreColor}`}>{percentage}%</p>
              <p className="text-xs text-charcoal/40">{score}/{activeQuestions.length}</p>
            </div>
          </CircularProgress>
        </div>

        {targetMet && <p className="mt-4 text-sm font-medium text-success">Target met — above 95%!</p>}
        {passed && !targetMet && <p className="mt-4 text-sm font-medium text-warning">Passing mark reached — keep pushing toward 95%</p>}
        {!passed && <p className="mt-4 text-sm font-medium text-error">Below passing mark (90%) — review and retry</p>}

        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-charcoal/40">
          <span className="flex items-center gap-1"><Clock size={14} /> {formatTime(finalElapsed)}</span>
          <span className="flex items-center gap-1"><Brain size={14} /> {activeQuestions.length} questions</span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
          >
            <RotateCcw size={16} /> Retry
          </button>
          <button
            onClick={() => setSelectedQuizId(null)}
            className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary/5"
          >
            All quizzes
          </button>
        </div>
      </div>
    );
  }

  const q = activeQuestions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= activeQuestions.length) {
      setFinalElapsed(elapsed);
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
        onClick={() => setSelectedQuizId(null)}
        className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to quizzes
      </button>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary">{selectedSet?.title}</h1>
          <p className="text-xs text-charcoal/40">{selectedSet?.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-sm text-primary">
            <Clock size={13} /> {formatTime(elapsed)}
          </span>
          <span className="text-sm text-charcoal/40">{score}/{current + (answered ? 1 : 0)} correct</span>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-terracotta transition-all"
          style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-charcoal/30">Question {current + 1} of {activeQuestions.length}</p>

      <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-charcoal/30">Q {q.id}</p>
        <h2 className="mt-2 font-heading text-xl font-semibold text-primary">{q.question}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt, idx) => {
            let style = "border-primary/10 hover:border-primary/20 hover:bg-primary/5";
            if (answered && idx === q.correct) style = "border-success bg-success/10";
            else if (answered && idx === selected) style = "border-error bg-error/10";

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  answered && idx === q.correct ? "bg-success text-white" :
                  answered && idx === selected ? "bg-error text-white" :
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

        {answered && q.hint && (
          <div className="mt-4 rounded-xl bg-gold/10 p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              <span className="font-semibold">Tip: </span>{q.hint}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
          >
            {current + 1 >= activeQuestions.length ? "See Results" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
