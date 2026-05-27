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
  Check,
  Eye,
  Headphones,
  BookOpen,
  Pencil,
} from "lucide-react";

type SettingsTab = "profile" | "learning" | "notifications" | "subscription" | "privacy";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { key: SettingsTab; icon: React.ReactNode; label: string }[] = [
    { key: "profile", icon: <User size={16} />, label: "Profile" },
    { key: "learning", icon: <Brain size={16} />, label: "Learning" },
    { key: "notifications", icon: <Bell size={16} />, label: "Notifications" },
    { key: "subscription", icon: <CreditCard size={16} />, label: "Subscription" },
    { key: "privacy", icon: <Shield size={16} />, label: "Privacy" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">Settings</h1>
      <p className="mt-1 text-sm text-charcoal/50">Manage your account and preferences</p>

      {/* Saved indicator */}
      {saved && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg animate-fade-in">
          <Check size={16} /> Settings saved
        </div>
      )}

      {/* Tab navigation */}
      <div className="mt-8 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-primary text-white" : "text-charcoal/50 hover:bg-neutral hover:text-charcoal"
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
                  <p className="text-sm text-charcoal/50">bernel@example.com</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField label="First name" defaultValue="Bernel" />
                <InputField label="Last name" defaultValue="Dahssi" />
                <InputField label="Email" defaultValue="bernel@example.com" type="email" />
                <InputField label="Phone" defaultValue="+1 (514) 555-0123" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Country</label>
                  <select className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Canada</option>
                    <option>Cameroon</option>
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>France</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Timezone</label>
                  <select className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>America/Montreal (EST)</option>
                    <option>Africa/Douala (WAT)</option>
                    <option>Europe/Paris (CET)</option>
                  </select>
                </div>
              </div>
              <button onClick={showSaved} className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-600">
                Save changes
              </button>
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
                  { key: "reading", icon: <BookOpen size={20} />, label: "Reading/Writing", description: "Text summaries, notes, lists" },
                  { key: "kinesthetic", icon: <Brain size={20} />, label: "Kinesthetic", description: "Interactive exercises, practice problems" },
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Daily study goal</p>
                    <p className="text-xs text-charcoal/40">How many minutes per day</p>
                  </div>
                  <select className="rounded-lg border border-primary/15 px-3 py-2 text-sm">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option selected>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">New cards per day</p>
                    <p className="text-xs text-charcoal/40">Maximum new flashcards to introduce</p>
                  </div>
                  <select className="rounded-lg border border-primary/15 px-3 py-2 text-sm">
                    <option>5 cards</option>
                    <option>10 cards</option>
                    <option selected>15 cards</option>
                    <option>20 cards</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-charcoal">Difficulty level</p>
                    <p className="text-xs text-charcoal/40">Default content difficulty</p>
                  </div>
                  <select className="rounded-lg border border-primary/15 px-3 py-2 text-sm">
                    <option>Beginner</option>
                    <option selected>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <button onClick={showSaved} className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-600">
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

            <div className="rounded-2xl border border-primary/10 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-primary">Payment Method</h2>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/10 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Visa ending in 4242</p>
                  <p className="text-xs text-charcoal/40">Expires 12/2027</p>
                </div>
                <button className="ml-auto text-sm text-terracotta hover:underline">Update</button>
              </div>
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
                <button className="flex w-full items-center justify-between rounded-xl border border-primary/10 p-4 text-left text-sm transition hover:bg-neutral">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-charcoal/40" />
                    <span>Export my data</span>
                  </div>
                  <span className="text-xs text-charcoal/30">GDPR compliant</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-red-200 p-4 text-left text-sm text-red-500 transition hover:bg-red-50">
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
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
