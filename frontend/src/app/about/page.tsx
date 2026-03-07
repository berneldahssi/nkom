"use client";

import Link from "next/link";
import { Brain, Zap, Target, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-neutral">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-heading text-2xl font-bold text-primary">
            NKOM
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">Home</Link>
            <Link href="/about" className="text-sm font-medium text-primary">About</Link>
            <Link href="/#pricing" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">Pricing</Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/auth" className="rounded-lg px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-50">Sign in</Link>
            <Link href="/auth?mode=register" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600">
              Get started free
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-primary/10 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link href="/" className="py-2 text-sm font-medium text-charcoal/70" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/about" className="py-2 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/#pricing" className="py-2 text-sm font-medium text-charcoal/70" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <hr className="border-primary/10" />
              <Link href="/auth" className="py-2 text-sm font-medium text-primary">Sign in</Link>
              <Link href="/auth?mode=register" className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white">
                Get started free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl">
            Learning science, simplified
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70 sm:text-xl">
            We believe retention isn&apos;t about more hours studying. It&apos;s about studying smarter using proven neuroscience principles.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Mission */}
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-primary">Our Mission</h2>
              <p className="text-charcoal/70 leading-relaxed">
                To empower students across Africa to study smarter, retain more, and unlock their full potential through intelligent, science-backed learning tools.
              </p>
            </div>

            {/* Vision */}
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-primary">Our Vision</h2>
              <p className="text-charcoal/70 leading-relaxed">
                A world where effective learning is accessible to everyone, regardless of background. Where technology and neuroscience work together to transform education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-neutral px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold text-primary">Built on Science</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
              Our approach is grounded in neuroscience research and proven learning principles. Every feature is designed around how your brain actually learns.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Personalization */}
            <div className="rounded-2xl border border-primary/20 bg-white p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain size={24} className="text-primary" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold text-primary">Personalized</h3>
              <p className="text-sm text-charcoal/70">
                Your learning adapts to your pace, style, and needs. No two students learn the same way—why should their materials be identical?
              </p>
            </div>

            {/* Interactive */}
            <div className="rounded-2xl border border-primary/20 bg-white p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap size={24} className="text-primary" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold text-primary">Interactive</h3>
              <p className="text-sm text-charcoal/70">
                Passive reading doesn&apos;t stick. We create summaries, flashcards, and quizzes that actively engage your brain.
              </p>
            </div>

            {/* Spaced Repetition */}
            <div className="rounded-2xl border border-primary/20 bg-white p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target size={24} className="text-primary" />
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold text-primary">Spaced Repetition</h3>
              <p className="text-sm text-charcoal/70">
                We remind you to review material at optimal intervals—right before you&apos;d forget. This is backed by decades of memory research.
              </p>
            </div>
          </div>

          {/* Research credits */}
          <div className="mt-12 rounded-2xl border border-primary/10 bg-white p-8 text-center">
            <p className="text-sm font-medium text-charcoal">Grounded in research by:</p>
            <p className="mt-2 text-sm text-charcoal/60">
              <strong>Idriss Aberkane</strong> (neuroscience education) and <strong>Stanislas Dehaene</strong> (learning science & working memory)
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold text-primary">Founded by Students, for Students</h2>
          <div className="mt-12 space-y-6 text-charcoal/70">
            <p>
              NKOM was born from frustration. Our founder struggled with traditional study methods—hours spent reading notes with nothing to show for it. There had to be a better way.
            </p>
            <p>
              After discovering the science behind effective learning, we built NKOM to bridge the gap between what research proves works and what most students actually do. Now thousands of students are studying smarter and retaining more.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-600 p-12 text-center sm:p-16">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Join the smarter learning movement</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              Start using science-backed study methods today. Free forever.
            </p>
            <div className="mt-8">
              <Link
                href="/auth?mode=register"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-medium text-primary shadow-lg transition hover:shadow-xl"
              >
                Get started free
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-charcoal/60">
          <p>&copy; 2026 NKOM. Learning science for everyone.</p>
        </div>
      </footer>
    </main>
  );
}
