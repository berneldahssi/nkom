"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Headphones,
  BookOpen,
  Brain,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";

interface Question {
  question: string;
  options: { label: string; style: "visual" | "auditory" | "reading" | "kinesthetic" }[];
}

const questions: Question[] = [
  {
    question: "When learning something new, I prefer to...",
    options: [
      { label: "See diagrams, charts, or videos", style: "visual" },
      { label: "Listen to a lecture or podcast", style: "auditory" },
      { label: "Read a textbook or article", style: "reading" },
      { label: "Try it hands-on with practice", style: "kinesthetic" },
    ],
  },
  {
    question: "When studying for an exam, I usually...",
    options: [
      { label: "Create mind maps or color-coded notes", style: "visual" },
      { label: "Record and replay key points", style: "auditory" },
      { label: "Rewrite notes and make lists", style: "reading" },
      { label: "Do practice problems and exercises", style: "kinesthetic" },
    ],
  },
  {
    question: "I remember things best when I...",
    options: [
      { label: "Can picture them in my mind", style: "visual" },
      { label: "Hear someone explain them", style: "auditory" },
      { label: "Write them down multiple times", style: "reading" },
      { label: "Physically interact with them", style: "kinesthetic" },
    ],
  },
  {
    question: "When giving directions, I tend to...",
    options: [
      { label: "Draw a map or use landmarks", style: "visual" },
      { label: "Explain verbally step by step", style: "auditory" },
      { label: "Write out the directions", style: "reading" },
      { label: "Walk through the route physically", style: "kinesthetic" },
    ],
  },
  {
    question: "In my free time, I enjoy...",
    options: [
      { label: "Watching videos or looking at art", style: "visual" },
      { label: "Listening to music or podcasts", style: "auditory" },
      { label: "Reading books or articles", style: "reading" },
      { label: "Sports, crafts, or building things", style: "kinesthetic" },
    ],
  },
  {
    question: "When someone explains a concept, I...",
    options: [
      { label: "Want to see a visual representation", style: "visual" },
      { label: "Listen carefully and ask questions", style: "auditory" },
      { label: "Take detailed notes while listening", style: "reading" },
      { label: "Want to try an example right away", style: "kinesthetic" },
    ],
  },
  {
    question: "My ideal study material would be...",
    options: [
      { label: "Infographics and illustrated guides", style: "visual" },
      { label: "Audio summaries I can listen to anywhere", style: "auditory" },
      { label: "Well-structured written summaries", style: "reading" },
      { label: "Interactive quizzes and exercises", style: "kinesthetic" },
    ],
  },
  {
    question: "When I need to memorize something, I...",
    options: [
      { label: "Visualize it as a picture or scene", style: "visual" },
      { label: "Say it out loud repeatedly", style: "auditory" },
      { label: "Write it out several times", style: "reading" },
      { label: "Associate it with a physical action", style: "kinesthetic" },
    ],
  },
  {
    question: "I find it easiest to follow...",
    options: [
      { label: "Video tutorials with demonstrations", style: "visual" },
      { label: "Audio instructions or explanations", style: "auditory" },
      { label: "Written step-by-step guides", style: "reading" },
      { label: "Hands-on workshops", style: "kinesthetic" },
    ],
  },
  {
    question: "If I could choose one NKOM feature, it would be...",
    options: [
      { label: "Visual manga/comic learning", style: "visual" },
      { label: "AI-generated study podcasts", style: "auditory" },
      { label: "Detailed text summaries", style: "reading" },
      { label: "Interactive flashcard drills", style: "kinesthetic" },
    ],
  },
];

const styleInfo = {
  visual: { icon: <Eye size={32} />, label: "Visual Learner", color: "terracotta", description: "You learn best through images, diagrams, charts, and visual representations. NKOM will prioritize visual content, color-coded materials, and manga-style explanations for you." },
  auditory: { icon: <Headphones size={32} />, label: "Auditory Learner", color: "primary", description: "You learn best by listening. NKOM will prioritize audio podcasts, narrated summaries, and verbal explanations for your study sessions." },
  reading: { icon: <BookOpen size={32} />, label: "Reading/Writing Learner", color: "gold", description: "You learn best through reading and writing. NKOM will prioritize detailed text summaries, structured notes, and written exercises for you." },
  kinesthetic: { icon: <Brain size={32} />, label: "Kinesthetic Learner", color: "primary", description: "You learn best through hands-on practice. NKOM will prioritize interactive exercises, practice problems, and flashcard drills for you." },
};

export default function OnboardingPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleAnswer = (style: string) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);
    if (currentQ + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrentQ((c) => c + 1);
    }
  };

  const getResult = () => {
    const counts = { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };
    answers.forEach((a) => counts[a as keyof typeof counts]++);
    return Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as keyof typeof styleInfo;
  };

  if (done) {
    const result = getResult();
    const info = styleInfo[result];
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-terracotta/10">
            <Sparkles size={36} className="text-terracotta" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-primary">Your Learning Style</h1>
          <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {info.icon}
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-terracotta">{info.label}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{info.description}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-primary/5 bg-white p-4">
            <p className="text-xs text-charcoal/40">Score breakdown</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(Object.entries({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 }).map(([key]) => {
                const count = answers.filter((a) => a === key).length;
                return (
                  <div key={key} className="text-center">
                    <p className="font-heading text-lg font-bold text-primary">{count}</p>
                    <p className="text-xs text-charcoal/40 capitalize">{key === "reading" ? "Read/Write" : key}</p>
                  </div>
                );
              }))}
            </div>
          </div>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-medium text-white hover:bg-primary-600"
          >
            Start learning <ArrowRight size={18} />
          </Link>
          <p className="mt-3 text-xs text-charcoal/40">
            You can always change this in Settings.
          </p>
        </div>
      </main>
    );
  }

  const q = questions[currentQ];

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold text-primary">NKOM</Link>
          <h1 className="mt-4 font-heading text-2xl font-bold text-primary">
            Discover your learning style
          </h1>
          <p className="mt-2 text-sm text-charcoal/50">
            Answer these {questions.length} questions so we can personalize your experience.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs text-charcoal/40">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(((currentQ) / questions.length) * 100)}% complete</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-primary/10">
            <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-primary">{q.question}</h2>
          <div className="mt-6 space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.style)}
                className="flex w-full items-center gap-3 rounded-xl border border-primary/10 bg-white p-4 text-left text-sm transition hover:border-primary/20 hover:bg-primary-50/30 hover:shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {opt.style === "visual" ? <Eye size={16} className="text-primary" /> :
                   opt.style === "auditory" ? <Headphones size={16} className="text-primary" /> :
                   opt.style === "reading" ? <BookOpen size={16} className="text-primary" /> :
                   <Brain size={16} className="text-primary" />}
                </div>
                <span className="font-medium text-charcoal/70">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Back button */}
        {currentQ > 0 && (
          <button
            onClick={() => { setCurrentQ((c) => c - 1); setAnswers((a) => a.slice(0, -1)); }}
            className="mt-6 flex items-center gap-2 text-sm text-charcoal/40 hover:text-primary"
          >
            <ArrowLeft size={14} /> Previous question
          </button>
        )}
      </div>
    </main>
  );
}
