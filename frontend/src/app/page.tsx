"use client";

import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Sparkles,
  Upload,
  Zap,
  BarChart3,
  ArrowRight,
  Check,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  Brain,
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
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Wisdom that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-terracotta">sticks</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 rounded bg-terracotta/15" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70 sm:text-xl">
            Record your class. Upload your notes. Get personalized study materials instantly.
            <strong className="text-primary"> Retain 90% of what you study</strong> — not 10%.
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
          <p className="mt-4 text-sm text-charcoal/40">Free forever plan. No credit card required.</p>
        </div>

        {/* Hero visual */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-primary/10 bg-white p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-xl bg-neutral p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-terracotta/40" />
                <div className="h-3 w-3 rounded-full bg-gold/40" />
                <div className="h-3 w-3 rounded-full bg-primary/20" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/10">
                    <Upload size={20} className="text-terracotta" />
                  </div>
                  <div className="mb-2 h-3 w-24 rounded bg-primary/15" />
                  <div className="h-2 w-full rounded bg-primary/8" />
                </div>
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain size={20} className="text-primary" />
                  </div>
                  <div className="mb-2 h-3 w-28 rounded bg-primary/15" />
                  <div className="h-2 w-full rounded bg-primary/8" />
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

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">Your knowledge, your way</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              Upload ANY material and get personalized study tools instantly.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<Zap className="h-6 w-6" />} color="gold" title="Record Lectures"
              description="One-tap recording with automatic transcription. Capture every explanation." />
            <FeatureCard icon={<Upload className="h-6 w-6" />} color="terracotta" title="Upload Anything"
              description="Photos, audio, PDFs, text — upload what works for you." />
            <FeatureCard icon={<Brain className="h-6 w-6" />} color="primary" title="AI-Powered Materials"
              description="Summaries, flashcards, podcasts, quizzes — all generated instantly." />
            <FeatureCard icon={<Sparkles className="h-6 w-6" />} color="terracotta" title="Learn Your Way"
              description="Personalized formats for how YOUR brain learns best." />
            <FeatureCard icon={<BarChart3 className="h-6 w-6" />} color="gold" title="Smart Repetition"
              description="Remember more with scientifically-timed review schedules." />
            <FeatureCard icon={<Headphones className="h-6 w-6" />} color="primary" title="Track Progress"
              description="See what you're mastering. Celebrate wins. Improve continuously." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">From class to mastery in 3 steps</h2>
          </div>
          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            <StepCard step={1} title="Record or Upload" description="Tap to record. Or upload photos, audio, PDFs, text." icon={<Upload size={24} />} color="gold" />
            <StepCard step={2} title="AI Transforms" description="Our AI extracts concepts and generates study materials you need." icon={<Brain size={24} />} color="primary" />
            <StepCard step={3} title="Learn & Master" description="Review smarter with spaced repetition. Watch your retention soar." icon={<BarChart3 size={24} />} color="gold" />
          </div>
        </div>
      </section>

      {/* Output formats */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">Learn in the format that works for you</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal/60">
              From a single upload, get everything you need.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormatCard icon={<BookOpen size={28} />} title="Summaries" description="Key concepts organized clearly" />
            <FormatCard icon={<Headphones size={28} />} title="Podcasts" description="Listen on the go" />
            <FormatCard icon={<Sparkles size={28} />} title="Flashcards" description="Active recall cards" />
            <FormatCard icon={<GraduationCap size={28} />} title="Quizzes" description="Test your knowledge" />
          </div>
        </div>
      </section>

      {/* Science foundation (minimalist) */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-primary">Built on learning science</h2>
          <p className="mx-auto mt-6 max-w-2xl text-charcoal/70 leading-relaxed">
            NKOM is grounded in neuroscience research and proven learning principles. Your brain learns best when content is <strong>personalized</strong>, <strong>interactive</strong>, and <strong>spaced over time</strong>. That's exactly how NKOM works.
          </p>
          <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6">
            <p className="text-sm text-charcoal/60">
              Based on research by Idriss Aberkane (neuroscience) and Stanislas Dehaene (learning science)
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">Simple, fair pricing</h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal/60">
              Start free. Upgrade when you're ready.
            </p>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            <PricingCard tier="Free" price="$0" period="forever" description="Get started with the basics"
              features={["5 uploads/month", "Summaries & flashcards", "Progress tracking"]}
              cta="Get started" href="/auth?mode=register" />
            <PricingCard tier="Student" price="$8" period="/month" description="Everything you need"
              features={["Unlimited uploads", "All output formats", "Audio podcasts", "Spaced repetition", "Analytics"]}
              cta="Start free trial" href="/auth?mode=register&plan=student" highlighted />
            <PricingCard tier="Pro" price="$15" period="/month" description="For serious learners"
              features={["Everything in Student", "Advanced analytics", "Skill tracking", "Export materials", "Priority support"]}
              cta="Start free trial" href="/auth?mode=register&plan=pro" />
            <PricingCard tier="Family" price="$25" period="/month" description="Multiple learners"
              features={["4 accounts included", "Parent dashboard", "Shared materials", "All Pro features"]}
              cta="Start free trial" href="/auth?mode=register&plan=family" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-600 p-12 text-center sm:p-16">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Ready to study smarter?</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              Join students across Africa who are learning more effectively and retaining more of what they study.
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
              <strong>Free forever</strong> plan • No credit card required
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
                From Scientia to Sapientia. Wisdom meets science.
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
                <li><span className="cursor-pointer transition hover:text-primary">Privacy</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">Terms</span></li>
                <li><span className="cursor-pointer transition hover:text-primary">GDPR</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-primary/10 pt-6 text-center text-sm text-charcoal/40">
            &copy; {new Date().getFullYear()} NKOM. All rights reserved.
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
    <div className="group rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-primary/20 hover:shadow-lg">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg[color]} ${text[color]}`}>{icon}</div>
      <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description, icon, color = "primary" }: { step: number; title: string; description: string; icon: React.ReactNode; color?: "primary" | "terracotta" | "gold" }) {
  const bgColors = { primary: "bg-primary", terracotta: "bg-terracotta", gold: "bg-gold" };
  const shadowColors = { primary: "shadow-primary/25", terracotta: "shadow-terracotta/25", gold: "shadow-gold/25" };

  return (
    <div className="relative text-center">
      <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${bgColors[color]} text-white shadow-lg ${shadowColors[color]}`}>{icon}</div>
      <div className="mb-2 text-sm font-semibold text-charcoal/50">Step {step}</div>
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
