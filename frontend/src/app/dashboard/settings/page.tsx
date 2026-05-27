"use client";

import { useState } from "react";
import {
  User,
  Bell,
  CreditCard,
  Brain,
  Shield,
  Globe,
  Moon,
  Sun,
  Check,
  Eye,
  Headphones,
  BookOpen,
  Pencil,
  Palette,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/Toast";

type SettingsTab = "profile" | "appearance" | "learning" | "notifications" | "subscription" | "privacy";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { theme, toggle } = useTheme();
  const { toast } = useToast();

  const save = (label = "Settings saved") =>
    toast({ title: label, description: "Your changes have been applied.", variant: "success" });

  const tabs: { key: SettingsTab; icon: React.ReactNode; label: string }[] = [
    { key: "profile", icon: <User size={16} />, label: "Profile" },
    { key: "appearance", icon: <Palette size={16} />, label: "Appearance" },
    { key: "learning", icon: <Brain size={16} />, label: "Learning" },
    { key: "notifications", icon: <Bell size={16} />, label: "Notifications" },
    { key: "subscription", icon: <CreditCard size={16} />, label: "Subscription" },
    { key: "privacy", icon: <Shield size={16} />, label: "Privacy" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">Settings</h1>
      <p className="mt-1 text-sm text-charcoal/50">Manage your account and preferences</p>

      {/* Tab navigation */}
      <div className="mt-8 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-primary text-white" : "text-charcoal/50 hover:bg-primary/10 hover:text-charcoal"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Personal Information</h2>
              <div className="mt-6 flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    BD
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-terracotta text-white shadow">
                    <Pencil size={12} />
                  </button>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-primary">Bernel Dahssi</p>
                  <p className="text-sm text-charcoal/50">berneldahssi@gmail.com</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField label="First name" defaultValue="Bernel" />
                <InputField label="Last name" defaultValue="Dahssi" />
                <InputField label="Email" defaultValue="berneldahssi@gmail.com" type="email" />
                <InputField label="Phone" defaultValue="+1 (514) 555-0123" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Country</label>
                  <select className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-[rgb(var(--color-card))]">
                    <option>Canada</option>
                    <option>Cameroon</option>
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>France</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Timezone</label>
                  <select className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-[rgb(var(--color-card))]">
                    <option>America/Montreal (EST)</option>
                    <option>Africa/Douala (WAT)</option>
                    <option>Europe/Paris (CET)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => save("Profile updated")}
                className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                Save changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Theme</h2>
              <p className="mt-1 text-sm text-charcoal/50">Choose how NKOM looks on your device</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => { if (theme !== "dark") toggle(); save("Dark mode enabled"); }}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                    theme === "dark"
                      ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/20"
                      : "border-primary/10 hover:border-primary/20"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    theme === "dark" ? "bg-terracotta/15 text-terracotta" : "bg-primary/10 text-primary"
                  }`}>
                    <Moon size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">Dark mode</p>
                    <p className="text-xs text-charcoal/40">Easier on the eyes at night</p>
                  </div>
                  {theme === "dark" && <Check size={18} className="shrink-0 text-terracotta" />}
                </button>

                <button
                  onClick={() => { if (theme !== "light") toggle(); save("Light mode enabled"); }}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                    theme === "light"
                      ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/20"
                      : "border-primary/10 hover:border-primary/20"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    theme === "light" ? "bg-terracotta/15 text-terracotta" : "bg-primary/10 text-primary"
                  }`}>
                    <Sun size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">Light mode</p>
                    <p className="text-xs text-charcoal/40">Classic bright interface</p>
                  </div>
                  {theme === "light" && <Check size={18} className="shrink-0 text-terracotta" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Learning Style</h2>
              <p className="mt-1 text-sm text-charcoal/50">How do you learn best? This helps us personalize your content.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { key: "visual", icon: <Eye size={20} />, label: "Visual", description: "Diagrams, charts, color-coding", selected: true },
                  { key: "auditory", icon: <Headphones size={20} />, label: "Auditory", description: "Audio recordings, narration", selected: false },
                  { key: "reading", icon: <BookOpen size={20} />, label: "Reading/Writing", description: "Text summaries, notes, lists", selected: false },
                  { key: "kinesthetic", icon: <Brain size={20} />, label: "Kinesthetic", description: "Interactive exercises, practice problems", selected: false },
                ].map((style) => (
                  <button
                    key={style.key}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      style.selected
                        ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/20"
                        : "border-primary/10 hover:border-primary/20"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      style.selected ? "bg-terracotta/15 text-terracotta" : "bg-primary/10 text-primary"
                    }`}>
                      {style.icon}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{style.label}</p>
                      <p className="text-xs text-charcoal/40">{style.description}</p>
                    </div>
                    {style.selected && <Check size={16} className="ml-auto text-terracotta" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Study Preferences</h2>
              <div className="mt-4 space-y-4">
                {[
                  { label: "Daily study goal", sub: "How many minutes per day", options: ["15 minutes", "30 minutes", "45 minutes", "60 minutes", "90 minutes"], default: "45 minutes" },
                  { label: "New cards per day", sub: "Maximum new flashcards to introduce", options: ["5 cards", "10 cards", "15 cards", "20 cards"], default: "15 cards" },
                  { label: "Difficulty level", sub: "Default content difficulty", options: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{pref.label}</p>
                      <p className="text-xs text-charcoal/40">{pref.sub}</p>
                    </div>
                    <select defaultValue={pref.default} className="rounded-lg border border-primary/15 px-3 py-2 text-sm dark:bg-[rgb(var(--color-card))]">
                      {pref.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button
                onClick={() => save("Learning preferences updated")}
                className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Notification Preferences</h2>
            <div className="mt-6 space-y-5">
              {[
                { label: "Review reminders", description: "Get notified when flashcards are due for review", enabled: true },
                { label: "Study streak alerts", description: "Remind you to maintain your daily streak", enabled: true },
                { label: "Weekly progress report", description: "Summary of your weekly learning activity", enabled: true },
                { label: "New feature announcements", description: "Be the first to know about new NKOM features", enabled: false },
                { label: "Study tips", description: "Personalized study tips based on your performance", enabled: true },
                { label: "Marketing emails", description: "Promotions and special offers", enabled: false },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{notif.label}</p>
                    <p className="text-xs text-charcoal/40">{notif.description}</p>
                  </div>
                  <button className={`relative h-6 w-11 rounded-full transition ${notif.enabled ? "bg-primary" : "bg-charcoal/20"}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${notif.enabled ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-gold/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/50">Current plan</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-primary">Free</p>
                  <p className="mt-1 text-sm text-charcoal/50">Free forever</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
                  <CreditCard size={28} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Plan Features</h2>
              <ul className="mt-4 space-y-2">
                {[
                  "5 content uploads/month",
                  "Text summaries",
                  "3 flashcards per material",
                  "Basic quiz questions",
                  "Community support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-charcoal/70">
                    <Check size={14} className="text-terracotta" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Privacy Settings</h2>
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Profile visibility</p>
                    <p className="text-xs text-charcoal/40">Allow others to find you by email</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition">
                    <div className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Learning analytics</p>
                    <p className="text-xs text-charcoal/40">Help improve NKOM with anonymized data</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition">
                    <div className="absolute left-[22px] top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Data Management</h2>
              <div className="mt-4 space-y-3">
                <button className="flex w-full items-center justify-between rounded-xl border border-primary/10 p-4 text-left text-sm transition hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-charcoal/40" />
                    <span>Export my data</span>
                  </div>
                  <span className="text-xs text-charcoal/30">GDPR compliant</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-error/20 p-4 text-left text-sm text-error transition hover:bg-error/5">
                  <span>Delete my account</span>
                  <span className="text-xs">Permanent action</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal/60">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-[rgb(var(--color-card))]"
      />
    </div>
  );
}
