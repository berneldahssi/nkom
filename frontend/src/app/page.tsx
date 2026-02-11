import Link from "next/link";
import { BookOpen, Brain, Headphones, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl">
            Wisdom that sticks.
          </h1>
          <p className="text-lg text-charcoal/70 sm:text-xl">
            Upload your notes, photos, or audio — NKOM transforms them into
            personalized learning experiences powered by AI and neuroscience.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth"
              className="rounded-lg bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary-600"
            >
              Get started free
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-primary/20 px-8 py-3 font-medium text-primary transition hover:bg-primary-50"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-bold text-primary">
            Your knowledge, your way
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-terracotta" />}
              title="Upload anything"
              description="Photos of notes, audio recordings, PDFs, or text — we handle it all."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-terracotta" />}
              title="AI transforms"
              description="Get summaries, flashcards, quizzes, and practice tests instantly."
            />
            <FeatureCard
              icon={<Headphones className="h-8 w-8 text-terracotta" />}
              title="Learn your way"
              description="Visual, auditory, or hands-on — content adapts to how you learn best."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-terracotta" />}
              title="Remember forever"
              description="Spaced repetition and mnemonics ensure knowledge sticks long-term."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-primary/10 bg-neutral p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-charcoal/60">{description}</p>
    </div>
  );
}
