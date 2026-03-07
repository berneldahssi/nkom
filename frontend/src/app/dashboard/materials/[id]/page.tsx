"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  GraduationCap,
  Brain,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Lightbulb,
} from "lucide-react";

type Tab = "summary" | "flashcards" | "quiz";

export default function MaterialDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const material = {
    title: "Introduction to Cell Biology",
    subject: "Biology",
    date: "Feb 10, 2026",
    summary: [
      { heading: "Cell Structure", points: ["All living organisms are composed of cells", "Cells are the basic structural and functional units of life", "Two main types: prokaryotic (no nucleus) and eukaryotic (with nucleus)"] },
      { heading: "Cell Membrane", points: ["Phospholipid bilayer with embedded proteins", "Selectively permeable — controls what enters/exits", "Fluid mosaic model describes its structure"] },
      { heading: "Organelles", points: ["Nucleus: contains DNA, controls cell activities", "Mitochondria: powerhouse, produces ATP via cellular respiration", "Endoplasmic Reticulum: protein (rough) and lipid (smooth) synthesis", "Golgi Apparatus: packages and ships proteins"] },
      { heading: "Cell Division", points: ["Mitosis: growth and repair (identical daughter cells)", "Meiosis: sexual reproduction (genetically unique cells)", "Cell cycle: G1 → S → G2 → M phase"] },
    ],
    flashcards: [
      { front: "What is the powerhouse of the cell?", back: "Mitochondria — responsible for producing ATP through cellular respiration", hint: "Think: Mighty Mitochondria" },
      { front: "What is the fluid mosaic model?", back: "A model describing cell membrane structure as a mosaic of proteins floating in a fluid phospholipid bilayer", hint: "Imagine a sea of lipids with protein islands" },
      { front: "What are the two main types of cells?", back: "Prokaryotic (no nucleus, e.g., bacteria) and Eukaryotic (with nucleus, e.g., animal/plant cells)", hint: "Pro = primitive, Eu = true" },
      { front: "What is the difference between mitosis and meiosis?", back: "Mitosis produces 2 identical diploid cells (growth). Meiosis produces 4 unique haploid cells (reproduction).", hint: "MITosis = MITigation (same), MEIosis = ME-I (unique)" },
      { front: "What does the Golgi Apparatus do?", back: "Modifies, packages, and ships proteins and lipids to their destinations", hint: "Think of it as the cell's post office" },
    ],
    quizQuestions: [
      { question: "Which organelle is responsible for ATP production?", options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"], correct: 1 },
      { question: "The cell membrane is composed primarily of:", options: ["Carbohydrates", "Proteins only", "Phospholipid bilayer", "DNA"], correct: 2 },
      { question: "Mitosis results in:", options: ["4 haploid cells", "2 diploid cells", "1 diploid cell", "4 diploid cells"], correct: 1 },
    ],
  };

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: "summary", icon: <BookOpen size={16} />, label: "Summary" },
    { key: "flashcards", icon: <Layers size={16} />, label: `Flashcards (${material.flashcards.length})` },
    { key: "quiz", icon: <GraduationCap size={16} />, label: `Quiz (${material.quizQuestions.length})` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <Link href="/dashboard/materials" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
        <ArrowLeft size={16} /> Back to materials
      </Link>
      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Brain size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{material.title}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-charcoal/40">
            <span className="rounded-full bg-primary/5 px-3 py-0.5">{material.subject}</span>
            <span>{material.date}</span>
            <span>{material.flashcards.length} flashcards</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl bg-primary/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setFlipped(false); setCurrentCard(0); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.key ? "bg-white text-primary shadow-sm" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "summary" && (
          <div className="space-y-6">
            {material.summary.map((section) => (
              <div key={section.heading} className="rounded-2xl border border-primary/10 bg-white p-6">
                <h3 className="font-heading text-lg font-semibold text-primary">{section.heading}</h3>
                <ul className="mt-3 space-y-2">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            {/* Flashcard */}
            <div className="perspective mx-auto max-w-lg">
              <button
                onClick={() => setFlipped(!flipped)}
                className="w-full text-left"
              >
                <div className={`relative min-h-[250px] rounded-2xl border border-primary/10 bg-white p-8 shadow-lg transition-all duration-500 ${flipped ? "bg-primary-50" : ""}`}>
                  {!flipped ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-terracotta">Question</p>
                      <p className="mt-4 font-heading text-xl font-semibold text-primary">
                        {material.flashcards[currentCard].front}
                      </p>
                      <p className="mt-8 text-sm text-charcoal/30">Tap to reveal answer</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-green-600">Answer</p>
                      <p className="mt-4 text-lg text-charcoal/80">
                        {material.flashcards[currentCard].back}
                      </p>
                      {material.flashcards[currentCard].hint && (
                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-gold/10 p-3">
                          <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold" />
                          <p className="text-sm text-gold-800">{material.flashcards[currentCard].hint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }}
                disabled={currentCard === 0}
                className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm text-charcoal/40">
                {currentCard + 1} / {material.flashcards.length}
              </span>
              <button
                onClick={() => { setCurrentCard(Math.min(material.flashcards.length - 1, currentCard + 1)); setFlipped(false); }}
                disabled={currentCard === material.flashcards.length - 1}
                className="rounded-xl border border-primary/15 px-4 py-2 text-sm font-medium text-charcoal/50 transition hover:bg-neutral disabled:opacity-30"
              >
                Next
              </button>
            </div>

            {/* Difficulty rating (spaced repetition) */}
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
                      onClick={() => { setCurrentCard(Math.min(material.flashcards.length - 1, currentCard + 1)); setFlipped(false); }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "quiz" && <QuizView questions={material.quizQuestions} />}
      </div>
    </div>
  );
}

function QuizView({ questions }: { questions: { question: string; options: string[]; correct: number }[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].correct) setScore((s) => s + 1);
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
    return (
      <div className="rounded-2xl border border-primary/10 bg-white p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <GraduationCap size={36} className="text-green-500" />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-bold text-primary">Quiz Complete!</h3>
        <p className="mt-2 text-4xl font-bold text-terracotta">{score}/{questions.length}</p>
        <p className="mt-1 text-sm text-charcoal/50">
          {score === questions.length ? "Perfect score! Amazing work!" : score >= questions.length / 2 ? "Good job! Keep practicing." : "Keep studying, you'll get there!"}
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
        >
          <RotateCcw size={16} /> Retry Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-8">
      <div className="flex items-center justify-between text-sm text-charcoal/40">
        <span>Question {current + 1} of {questions.length}</span>
        <span>{score} correct</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-primary">{q.question}</h3>
      <div className="mt-6 space-y-3">
        {q.options.map((opt, idx) => {
          let style = "border-primary/10 hover:border-primary/20";
          if (answered && idx === q.correct) style = "border-green-500 bg-green-50";
          else if (answered && idx === selected) style = "border-red-400 bg-red-50";
          else if (selected === idx) style = "border-primary bg-primary-50";

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${style}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                answered && idx === q.correct ? "bg-green-500 text-white" :
                answered && idx === selected ? "bg-red-400 text-white" :
                "bg-primary/10 text-primary"
              }`}>
                {answered && idx === q.correct ? <Check size={14} /> :
                 answered && idx === selected ? <X size={14} /> :
                 String.fromCharCode(65 + idx)}
              </div>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button onClick={handleNext} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600">
          {current + 1 >= questions.length ? "See Results" : "Next Question"} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
