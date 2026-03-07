"use client";

import Link from "next/link";
import { Check, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";

const plans = [
  {
    tier: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "5 content uploads/month",
      "Text summaries",
      "3 flashcards per material",
      "Basic quiz questions",
      "Community support",
    ],
    cta: "Get started",
    href: "/auth?mode=register",
  },
  {
    tier: "Student",
    price: "$8",
    period: "/month",
    description: "Everything you need to excel",
    features: [
      "Unlimited content uploads",
      "Full summaries, flashcards & quizzes",
      "Spaced repetition system",
      "Full progress tracking",
      "Unlimited flashcards",
      "Email support",
    ],
    highlighted: true,
    cta: "Start 7-day free trial",
    href: "/auth?mode=register&plan=student",
  },
  {
    tier: "Pro",
    price: "$15",
    period: "/month",
    description: "For serious learners",
    features: [
      "Everything in Student",
      "Advanced analytics",
      "Export materials",
      "Priority support",
    ],
    cta: "Start 7-day free trial",
    href: "/auth?mode=register&plan=pro",
  },
];

const faqs = [
  { q: "Can I switch plans at any time?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and mobile money (MTN, Orange) for African users." },
  { q: "Can I cancel anytime?", a: "Absolutely. There are no contracts or cancellation fees. You can cancel from your settings page at any time." },
  { q: "Do you offer special pricing for Africa?", a: "Yes! We offer 50% discounted pricing for users in African countries to make quality education accessible." },
  { q: "Is there a free trial?", a: "All paid plans come with a 7-day free trial. No credit card required to start." },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-neutral">
      {/* Nav */}
      <nav className="border-b border-primary/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-primary">NKOM</Link>
          <Link href="/auth" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600">
            Get started
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mt-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-700">
            <Sparkles size={14} /> 7-day free trial on all paid plans
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary sm:text-5xl">Plans for every learner</h1>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/60">
            Start free, upgrade when you&apos;re ready. Special pricing available for African students.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-terracotta bg-white shadow-xl shadow-terracotta/10 ring-1 ring-terracotta/20"
                  : "border-primary/10 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-terracotta px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="font-heading text-lg font-bold text-primary">{plan.tier}</h3>
              <p className="mt-1 text-sm text-charcoal/50">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-sm text-charcoal/40">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-charcoal/70">
                    <Check size={16} className="mt-0.5 shrink-0 text-terracotta" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${
                  plan.highlighted
                    ? "bg-terracotta text-white hover:bg-terracotta-600"
                    : "border border-primary/20 text-primary hover:bg-primary-50"
                }`}
              >
                {plan.cta} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center font-heading text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-primary/10 bg-white p-6">
                <h3 className="font-heading font-semibold text-primary">{faq.q}</h3>
                <p className="mt-2 text-sm text-charcoal/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
