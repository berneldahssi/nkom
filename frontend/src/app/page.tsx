"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Headphones,
  Sparkles,
  Upload,
  Zap,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
  ChevronRight,
  Globe,
  GraduationCap,
  Layers,
  Home,
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
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
            <a href="#features" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-charcoal/70 transition hover:text-primary">Testimonials</a>
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
              <a href="#features" className="py-2 text-sm font-medium text-charcoal/70" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="py-2 text-sm font-medium text-charcoal/70" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" className="py-2 text-sm font-medium text-charcoal/70" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
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
          <div className="absolute right-0 top-1/2 h-[300px] w-[400px] rounded-full bg-terracotta/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-700">
            <Sparkles size={14} />
            African Wisdom + Modern Neuroscience
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Wisdom that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-terracotta">sticks</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 rounded bg-terracotta/15" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70 sm:text-xl">
            Record your class. Upload your notes. Get 7 study formats instantly.
            <strong className="text-primary"> Retain 90% of what you study</strong> — not 10%.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-charcoal/60">
            NKOM isn&apos;t just AI. It&apos;s grounded in 7 neuroscience principles and 4 peer-reviewed learning pillars.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth?mode=register"
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-medium text-white shadow-lg shadow-primary/25 transition hover:bg-primary-600 hover:shadow-xl hover:shadow-primary/30"
            >
              Start learning smarter
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-primary/20 px-8 py-4 font-medium text-primary transition hover:bg-primary-50"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-charcoal/40">Free forever plan available. No credit card required.</p>
        </div>

        {/* Hero visual */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-primary/10 bg-white p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-xl bg-neutral p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-terracotta/40" />
                <div className="h-3 w-3 rounded-full bg-gold/40" />
                <div className="h-3 w-3 rounded-full bg-primary/20" />
                <div className="ml-4 h-6 w-64 rounded bg-primary/10" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/10">
                    <Upload size={20} className="text-terracotta" />
                  </div>
                  <div className="mb-2 h-3 w-24 rounded bg-primary/15" />
                  <div className="h-2 w-full rounded bg-primary/8" />
                  <div className="mt-1 h-2 w-3/4 rounded bg-primary/8" />
                </div>
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain size={20} className="text-primary" />
                  </div>
                  <div className="mb-2 h-3 w-28 rounded bg-primary/15" />
                  <div className="h-2 w-full rounded bg-primary/8" />
                  <div className="mt-1 h-2 w-2/3 rounded bg-primary/8" />
                </div>
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <BarChart3 size={20} className="text-gold" />
                  </div>
                  <div className="mb-2 h-3 w-20 rounded bg-primary/15" />
                  <div className="mt-3 flex gap-1">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-primary/15" style={{ height: h * 0.6 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-primary/5 bg-white px-6 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-charcoal/40">
            Designed for students across Africa and the diaspora
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-charcoal/30">
            <div className="flex items-center gap-2"><GraduationCap size={20} /><span className="text-sm font-medium">University of Douala</span></div>
            <div className="flex items-center gap-2"><GraduationCap size={20} /><span className="text-sm font-medium">Yaound&eacute; I</span></div>
            <div className="flex items-center gap-2"><Globe size={20} /><span className="text-sm font-medium">Cameroon</span></div>
            <div className="flex items-center gap-2"><Globe size={20} /><span className="text-sm font-medium">Canada</span></div>
            <div className="flex items-center gap-2"><Globe size={20} /><span className="text-sm font-medium">Nigeria</span></div>
          </div>
        </div>
      </section>

      {/* Science Foundation */}
      <section className="border-y border-primary/5 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Grounded in Neuroscience</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">Why NKOM Actually Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              NKOM isn&apos;t just AI. It&apos;s grounded in 7 neuroscience principles by Idriss Aberkane and peer-reviewed research by Stanislas Dehaene.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-white p-8">
              <h3 className="font-heading text-xl font-bold text-primary">7 Aberkane Principles</h3>
              <p className="mt-3 text-sm text-charcoal/60">
                From &quot;Libérez votre cerveau&quot; — adapted for NKOM:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Neuroergonomics:</strong> Content adapts to your brain</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Mental Handles:</strong> Complex ideas become graspable</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Play as Learning:</strong> Gamification = brain&apos;s natural mode</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Wonder:</strong> Curiosity &gt; compliance</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Joy:</strong> Learning feels good, not obligatory</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Memory Palaces:</strong> Spatial memory = retention</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-terracotta">→</span>
                  <span><strong>Knowledge Economy:</strong> Teaching deepens learning</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-8">
              <h3 className="font-heading text-xl font-bold text-primary">4 Dehaene Pillars</h3>
              <p className="mt-3 text-sm text-charcoal/60">
                From &quot;How We Learn&quot; — neuroscience research:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">✓</span>
                  <span><strong>Attention:</strong> 25-min focused sessions, curiosity hooks</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">✓</span>
                  <span><strong>Active Engagement:</strong> You produce answers, not just read</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">✓</span>
                  <span><strong>Error Feedback:</strong> Mistakes become growth opportunities</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">✓</span>
                  <span><strong>Consolidation:</strong> Spaced repetition + sleep-aware scheduling</span>
                </li>
              </ul>
              <p className="mt-6 rounded-lg bg-primary/5 p-3 text-xs text-primary">
                <strong>Result:</strong> You retain 90% of what you study, not 10%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Features</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">Your knowledge, your way</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              Upload ANY material, instantly transformed into personalized study tools powered by neuroscience.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<Zap className="h-6 w-6" />} color="gold" title="Instant Recording"
              description="Record your class with one tap. We transcribe it automatically and generate study materials instantly." />
            <FeatureCard icon={<Upload className="h-6 w-6" />} color="terracotta" title="Multimodal Upload"
              description="Photos, audio recordings, PDFs, text — upload anything and our AI extracts the knowledge." />
            <FeatureCard icon={<Brain className="h-6 w-6" />} color="primary" title="7-Format AI Transformation"
              description="Get summaries, flashcards, podcasts, quizzes, concept maps, memory palaces, and practice problems." />
            <FeatureCard icon={<Sparkles className="h-6 w-6" />} color="terracotta" title="Personalized Learning"
              description="VARK-adapted output: visual, auditory, reading, kinesthetic. Content matches how YOUR brain learns." />
            <FeatureCard icon={<BarChart3 className="h-6 w-6" />} color="gold" title="Spaced Repetition + Analytics"
              description="SuperMemo-2 algorithm schedules reviews at optimal times. See your forgetting curves and mastery %" />
            <FeatureCard icon={<Headphones className="h-6 w-6" />} color="primary" title="Gamification & Community"
              description="XP, streaks, achievements. Learn solo or join study groups. Teach others, deepen your own knowledge." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">How it works</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">From class to mastery in 4 steps</h2>
          </div>
          <div className="mt-16 grid gap-12 lg:grid-cols-4">
            <StepCard step={1} title="Record or Upload" description="Tap to record your class. Or upload photos, audio, PDFs, text. Any format works." icon={<Upload size={24} />} color="gold" />
            <StepCard step={2} title="AI Gets Context" description="Tell us: what's your role, level, exam type (BAC/GCE/SAT)? AI learns how YOU learn." icon={<Brain size={24} />} color="primary" />
            <StepCard step={3} title="Instant Transformation" description="GPT-4 generates 7 study formats: summary, flashcards, podcast, quiz, manga, memory palace, problems." icon={<Sparkles size={24} />} color="terracotta" />
            <StepCard step={4} title="Master & Remember" description="Review with spaced repetition. Gamification keeps you engaged. Retention soars to 90%." icon={<BarChart3 size={24} />} color="gold" />
          </div>

          {/* Recording feature highlight */}
          <div className="mt-20 rounded-3xl border-2 border-gold/30 bg-gold/5 p-12">
            <div className="flex gap-8 items-start">
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary">🎙️ Instant Recording: MVP Feature</h3>
                <p className="mt-3 text-charcoal/70">
                  Recording is <strong>easier than photos</strong> and <strong>more complete than notes</strong>. You get your entire lecture plus teacher&apos;s explanations.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                  <li>✓ <strong>One-tap recording</strong> — Record up to 2 hours continuously</li>
                  <li>✓ <strong>Automatic transcription</strong> — Whisper AI converts audio to text</li>
                  <li>✓ <strong>Background upload</strong> — Syncs when you&apos;re on WiFi</li>
                  <li>✓ <strong>Instant materials</strong> — Generate all 7 study formats from transcript</li>
                  <li>✓ <strong>Privacy first</strong> — Record locally only, or auto-upload (your choice)</li>
                </ul>
              </div>
              <div className="shrink-0 hidden lg:block">
                <div className="rounded-xl bg-white p-6 border border-primary/10 text-center">
                  <p className="text-4xl">🎤</p>
                  <p className="mt-2 text-sm font-semibold text-primary">TAP TO RECORD</p>
                  <div className="mt-4 text-xs text-charcoal/60">
                    <p>Lecture: 47 min</p>
                    <p className="text-gold font-semibold mt-1">Materials in 60 sec</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Output formats */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Output Formats</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">7 ways to master the material</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              From a single upload, NKOM generates everything you need. Pick what works for your brain.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormatCard icon={<BookOpen size={28} />} title="Summaries" description="Structured hierarchical breakdowns with mental handles" />
            <FormatCard icon={<Headphones size={28} />} title="Podcasts" description="AI-generated audio you can listen during commute" />
            <FormatCard icon={<Layers size={28} />} title="Flashcards" description="Active recall cards with mnemonics built-in" />
            <FormatCard icon={<GraduationCap size={28} />} title="Quizzes" description="Adaptive difficulty that adjusts to your level" />
            <FormatCard icon={<Brain size={28} />} title="Concept Maps" description="Visual networks showing how ideas connect" />
            <FormatCard icon={<Home size={28} />} title="Memory Palaces" description="Spatial technique for permanent retention" />
            <FormatCard icon={<Sparkles size={28} />} title="Manga Stories" description="Visual narratives embedding concepts" />
            <FormatCard icon={<Zap size={28} />} title="Practice Problems" description="Real-world scenarios to apply knowledge" />
          </div>
        </div>
      </section>

      {/* Aberkane Principles Section */}
      <section className="bg-gradient-to-b from-white to-primary/5 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">The Science Behind NKOM</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">7 Neuroscience Principles</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              Every feature in NKOM implements one of Idriss Aberkane&apos;s 7 principles from &quot;Libérez votre cerveau.&quot;
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            <div className="rounded-2xl border border-primary/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-heading text-sm font-bold">1</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Neuroergonomics</h3>
              <p className="mt-2 text-sm text-charcoal/60">Content adapts to YOUR brain, not the other way around. One-size-fits-all is dead.</p>
            </div>

            <div className="rounded-2xl border border-terracotta/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white font-heading text-sm font-bold">2</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Mental Handles</h3>
              <p className="mt-2 text-sm text-charcoal/60">Complex ideas get analogies, stories, and mnemonics your brain can grab.</p>
            </div>

            <div className="rounded-2xl border border-gold/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white font-heading text-sm font-bold">3</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Play as Learning</h3>
              <p className="mt-2 text-sm text-charcoal/60">Gamification (XP, streaks, achievements) makes your brain WANT to study.</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-heading text-sm font-bold">4</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Wonder</h3>
              <p className="mt-2 text-sm text-charcoal/60">Curiosity is the engine of learning. We spark it with &quot;Did you know?&quot; hooks.</p>
            </div>

            <div className="rounded-2xl border border-terracotta/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white font-heading text-sm font-bold">5</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Joy, Not Suffering</h3>
              <p className="mt-2 text-sm text-charcoal/60">Learning should feel good. No punishment, only celebration of progress.</p>
            </div>

            <div className="rounded-2xl border border-gold/10 bg-white p-6 hover:shadow-lg transition">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white font-heading text-sm font-bold">6</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Memory Palaces</h3>
              <p className="mt-2 text-sm text-charcoal/60">Ancient technique: spatial memory is 100x more powerful than rote memorization.</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6 hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-heading text-sm font-bold">7</div>
              <h3 className="mt-3 font-heading text-lg font-bold text-primary">Knowledge Economy</h3>
              <p className="mt-2 text-sm text-charcoal/60">Teaching deepens your own learning. Community sharing creates positive-sum growth.</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border-2 border-terracotta/20 bg-terracotta/5 p-8 text-center">
            <p className="text-sm text-charcoal/70">
              <strong>The Result:</strong> Unlike ChatGPT (which answers once and forgets), NKOM tracks your learning journey,
              predicts what you&apos;ll forget, and schedules reviews at scientifically optimal times. That&apos;s why you&apos;ll retain 90% of what you study.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Pricing</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">Plans for every learner</h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal/60">
              Start free, upgrade when you&apos;re ready. Special pricing for African students.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            <PricingCard tier="Free" price="$0" period="forever" description="Get started with the basics"
              features={["5 content uploads/month", "Basic summaries", "3 flashcards per material", "Limited quiz questions"]}
              cta="Get started" href="/auth?mode=register" />
            <PricingCard tier="Student" price="$8" period="/month" description="Everything you need to excel"
              features={["Unlimited uploads", "All output formats", "Audio podcasts", "Spaced repetition", "Progress tracking"]}
              cta="Start free trial" href="/auth?mode=register&plan=student" highlighted />
            <PricingCard tier="Pro" price="$15" period="/month" description="For serious learners"
              features={["Everything in Student", "Visual/manga generation", "Exam simulation (BAC/GCE)", "Skill transformation", "Priority support"]}
              cta="Start free trial" href="/auth?mode=register&plan=pro" />
            <PricingCard tier="Family" price="$25" period="/month" description="Support your family"
              features={["4 accounts included", "Parent dashboard", "Shared materials", "Progress monitoring", "All Pro features"]}
              cta="Start free trial" href="/auth?mode=register&plan=family" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Testimonials</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">Students love NKOM</h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="I used to spend hours re-reading my notes. With NKOM, I upload them once and get flashcards and quizzes that actually help me remember."
              name="Sarah K." role="Medicine student, University of Douala" rating={5} />
            <TestimonialCard
              quote="The podcast feature is a game-changer. I listen to my study material during my commute and it feels like having a personal tutor."
              name="Emmanuel O." role="Engineering student, Yaound&eacute;" rating={5} />
            <TestimonialCard
              quote="As a parent in Canada, I can now track my daughter's progress and send her study materials. NKOM bridges the distance."
              name="David M." role="IT Professional, Montreal" rating={5} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-600 p-12 text-center sm:p-16">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Ready to learn like your brain was designed to?</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              NKOM isn&apos;t just another AI tool. It&apos;s a complete learning science system grounded in African wisdom and neuroscience.
              Your brain is unique. Your study tools should be too.
            </p>
            <div className="mt-8">
              <Link
                href="/auth?mode=register"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-medium text-primary shadow-lg transition hover:bg-neutral"
              >
                Start your free trial
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              <strong>Free forever</strong> plan • 5 uploads/month • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="font-heading text-xl font-bold text-primary">NKOM</span>
              <p className="mt-3 text-sm text-charcoal/50">
                From Scientia to Sapientia. African wisdom meets modern neuroscience.
                <br />
                <span className="text-xs text-charcoal/40 mt-2 block">Built with ❤️ from Cameroon</span>
              </p>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/50">
                <li><a href="#features" className="transition hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="transition hover:text-primary">Pricing</a></li>
                <li><a href="#how-it-works" className="transition hover:text-primary">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/50">
                <li><span className="cursor-pointer transition hover:text-primary">About</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">Blog</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">Careers</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-primary">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/50">
                <li><span className="cursor-pointer transition hover:text-primary">Privacy Policy</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">Terms of Service</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">GDPR</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-primary/10 pt-6 text-center text-sm text-charcoal/40">
            &copy; {new Date().getFullYear()} NKOM. All rights reserved. Built with wisdom from Cameroon.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Sub-components ─── */

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode; title: string; description: string; color: "primary" | "terracotta" | "gold";
}) {
  const bg = { primary: "bg-primary/10", terracotta: "bg-terracotta/10", gold: "bg-gold/10" };
  const text = { primary: "text-primary", terracotta: "text-terracotta", gold: "text-gold" };
  return (
    <div className="group rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg[color]} ${text[color]}`}>{icon}</div>
      <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description, icon, color = "primary" }: { step: number; title: string; description: string; icon: React.ReactNode; color?: "primary" | "terracotta" | "gold" }) {
  const bgColors = { primary: "bg-primary", terracotta: "bg-terracotta", gold: "bg-gold" };
  const shadowColors = { primary: "shadow-primary/25", terracotta: "shadow-terracotta/25", gold: "shadow-gold/25" };
  const textColors = { primary: "text-primary", terracotta: "text-terracotta", gold: "text-gold" };

  return (
    <div className="relative text-center">
      <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${bgColors[color]} text-white shadow-lg ${shadowColors[color]}`}>{icon}</div>
      <div className={`mb-2 text-sm font-semibold ${textColors[color]}`}>Step {step}</div>
      <h3 className="font-heading text-xl font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-charcoal/60">{description}</p>
    </div>
  );
}

function FormatCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-white p-6 text-center transition hover:border-terracotta/20 hover:shadow-md">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">{icon}</div>
      <h3 className="font-heading font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-charcoal/50">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, period, description, features, cta, href, highlighted = false }: {
  tier: string; price: string; period: string; description: string; features: string[]; cta: string; href: string; highlighted?: boolean;
}) {
  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 ${highlighted ? "border-terracotta bg-white shadow-xl shadow-terracotta/10 ring-1 ring-terracotta/20" : "border-primary/10 bg-white"}`}>
      {highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-terracotta px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
      <h3 className="font-heading text-lg font-bold text-primary">{tier}</h3>
      <p className="mt-1 text-sm text-charcoal/50">{description}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-heading text-4xl font-bold text-primary">{price}</span>
        <span className="text-sm text-charcoal/40">{period}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-charcoal/70">
            <Check size={16} className="mt-0.5 shrink-0 text-terracotta" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${highlighted ? "bg-terracotta text-white hover:bg-terracotta-600" : "border border-primary/20 text-primary hover:bg-primary-50"}`}>
        {cta}<ChevronRight size={16} />
      </Link>
    </div>
  );
}

function TestimonialCard({ quote, name, role, rating }: { quote: string; name: string; role: string; rating: number }) {
  return (
    <div className="flex flex-col rounded-2xl border border-primary/10 bg-white p-6">
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-gold text-gold" />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-charcoal/70">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">{name.charAt(0)}</div>
        <div>
          <p className="text-sm font-semibold text-primary">{name}</p>
          <p className="text-xs text-charcoal/40">{role}</p>
        </div>
      </div>
    </div>
  );
}
