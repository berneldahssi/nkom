"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Mic,
  FileText,
  Type,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  Image,
  ArrowRight,
} from "lucide-react";

type InputMode = "photo" | "audio" | "pdf" | "text";

interface UploadState {
  mode: InputMode | null;
  file: File | null;
  text: string;
  processing: boolean;
  done: boolean;
}

export default function UploadPage() {
  const [state, setState] = useState<UploadState>({
    mode: null,
    file: null,
    text: "",
    processing: false,
    done: false,
  });

  const inputModes: { key: InputMode; icon: React.ReactNode; label: string; description: string; accept?: string }[] = [
    { key: "photo", icon: <Camera size={24} />, label: "Photo / Image", description: "Snap or upload photos of handwritten notes", accept: "image/*" },
    { key: "audio", icon: <Mic size={24} />, label: "Audio Recording", description: "Upload a lecture recording or voice note", accept: "audio/*" },
    { key: "pdf", icon: <FileText size={24} />, label: "PDF Document", description: "Upload textbook chapters or PDF notes", accept: ".pdf" },
    { key: "text", icon: <Type size={24} />, label: "Paste Text", description: "Copy and paste text directly" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setState((s) => ({ ...s, file }));
  };

  const handleProcess = () => {
    setState((s) => ({ ...s, processing: true }));
    // Simulate AI processing
    setTimeout(() => setState((s) => ({ ...s, processing: false, done: true })), 3000);
  };

  const hasContent = state.file || state.text.trim().length > 0;

  if (state.done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Material processed!</h1>
        <p className="mt-2 text-charcoal/60">
          Your content has been analyzed and study materials are ready.
        </p>
        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 text-left">
          <h3 className="font-heading font-semibold text-primary">Generated materials</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Summary", "Flashcards (12)", "Quiz (8 questions)", "Key Concepts (5)"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg bg-neutral p-3 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard/materials/1"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            View material <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => setState({ mode: null, file: null, text: "", processing: false, done: false })}
            className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary-50"
          >
            Upload another
          </button>
        </div>
      </div>
    );
  }

  if (state.processing) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Processing your content...</h1>
        <p className="mt-2 text-charcoal/60">
          Our AI is extracting key concepts and generating study materials. This may take a moment.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-3">
          {[
            { label: "Extracting text", done: true },
            { label: "Identifying key concepts", done: true },
            { label: "Generating flashcards", done: false },
            { label: "Creating quiz questions", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-white p-3">
              {step.done ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <Loader2 size={18} className="animate-spin text-primary/40" />
              )}
              <span className={`text-sm ${step.done ? "text-charcoal" : "text-charcoal/40"}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-primary">Upload new material</h1>
      <p className="mt-1 text-sm text-charcoal/50">
        Choose how you want to add your learning material. Our AI will process it and generate personalized study tools.
      </p>

      {/* Input mode selector */}
      {!state.mode ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {inputModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setState((s) => ({ ...s, mode: mode.key }))}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-6 text-left transition hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {mode.icon}
              </div>
              <div>
                <p className="font-heading font-semibold text-primary">{mode.label}</p>
                <p className="mt-1 text-sm text-charcoal/50">{mode.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          {/* Back button */}
          <button
            onClick={() => setState({ mode: null, file: null, text: "", processing: false, done: false })}
            className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
          >
            <X size={16} /> Change input method
          </button>

          {/* Content area */}
          {state.mode === "text" ? (
            <div className="space-y-4">
              <label className="block font-heading text-sm font-semibold text-primary">
                Paste your text content
              </label>
              <textarea
                value={state.text}
                onChange={(e) => setState((s) => ({ ...s, text: e.target.value }))}
                placeholder="Paste your notes, article, or any text content here..."
                className="h-64 w-full rounded-2xl border border-primary/15 bg-white p-6 text-sm leading-relaxed transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-charcoal/30">{state.text.length} characters</p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block font-heading text-sm font-semibold text-primary">
                {state.mode === "photo" ? "Upload an image" : state.mode === "audio" ? "Upload audio" : "Upload PDF"}
              </label>
              {state.file ? (
                <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {state.mode === "photo" ? <Image size={20} className="text-primary" aria-label="Image file" /> :
                     state.mode === "audio" ? <Mic size={20} className="text-primary" aria-label="Audio file" /> :
                     <FileText size={20} className="text-primary" aria-label="PDF file" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-charcoal">{state.file.name}</p>
                    <p className="text-xs text-charcoal/40">{(state.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => setState((s) => ({ ...s, file: null }))} className="text-charcoal/30 hover:text-charcoal/60">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-12 text-center transition hover:border-primary/40 hover:bg-primary-50/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Click to upload or drag and drop</p>
                    <p className="mt-1 text-sm text-charcoal/40">
                      {state.mode === "photo" ? "JPG, PNG up to 10MB" :
                       state.mode === "audio" ? "MP3, WAV, M4A up to 50MB" :
                       "PDF up to 25MB"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept={inputModes.find((m) => m.key === state.mode)?.accept}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Subject and title */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Title (optional)</label>
              <input
                type="text"
                placeholder="e.g., Biology Chapter 5 Notes"
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal/60">Subject (optional)</label>
              <select className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select subject</option>
                <option>Biology</option>
                <option>Mathematics</option>
                <option>History</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Literature</option>
                <option>Computer Science</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Output format selection */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-medium text-charcoal/60">Generate (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {["Summary", "Flashcards", "Quiz", "Audio Podcast"].map((format) => (
                <label key={format} className="flex cursor-pointer items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary">
                  <input type="checkbox" defaultChecked className="hidden" />
                  <CheckCircle2 size={14} />
                  {format}
                </label>
              ))}
            </div>
          </div>

          {/* Process button */}
          <button
            onClick={handleProcess}
            disabled={!hasContent}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-medium text-white transition hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            Process with AI
          </button>
        </div>
      )}
    </div>
  );
}
