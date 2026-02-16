"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Upload, X, CheckCircle2, Loader2, FileText, Image, Type, ArrowRight } from "lucide-react";
import Link from "next/link";

type InputMode = "record" | "upload" | "text";

interface UploadState {
  mode: InputMode | null;
  file: File | null;
  text: string;
  processing: boolean;
  done: boolean;
  isRecording: boolean;
  recordingDuration: number;
  recordedBlob: Blob | null;
  title: string;
  subject: string;
}

export default function UnifiedUploadRecorder() {
  const [state, setState] = useState<UploadState>({
    mode: null,
    file: null,
    text: "",
    processing: false,
    done: false,
    isRecording: false,
    recordingDuration: 0,
    recordedBlob: null,
    title: "",
    subject: "",
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const streamRef = useRef<MediaStream | null>(null);

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
        setState((s) => ({ ...s, recordedBlob: blob, isRecording: false }));
        clearTimeout(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setState((s) => ({ ...s, isRecording: true, recordingDuration: 0 }));

      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, recordingDuration: s.recordingDuration + 1 }));
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const clearRecording = () => {
    setState((s) => ({ ...s, recordedBlob: null, recordingDuration: 0, isRecording: false }));
    chunksRef.current = [];
  };

  // File upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setState((s) => ({ ...s, file }));
  };

  // Process content
  const hasContent = state.file || state.text.trim().length > 0 || state.recordedBlob;

  const handleProcess = () => {
    setState((s) => ({ ...s, processing: true }));
    setTimeout(() => setState((s) => ({ ...s, processing: false, done: true })), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Success state
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
            onClick={() => setState({ mode: null, file: null, text: "", processing: false, done: false, isRecording: false, recordingDuration: 0, recordedBlob: null, title: "", subject: "" })}
            className="rounded-xl border border-primary/20 px-6 py-3 font-medium text-primary hover:bg-primary-50"
          >
            Upload another
          </button>
        </div>
      </div>
    );
  }

  // Processing state
  if (state.processing) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Processing your content...</h1>
        <p className="mt-2 text-charcoal/60">
          Our AI is extracting concepts and generating study materials.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-3">
          {[
            { label: "Extracting content", done: true },
            { label: "Identifying key concepts", done: true },
            { label: "Generating materials", done: false },
            { label: "Creating summaries", done: false },
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

  // Mode selection
  if (!state.mode) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Add your learning material</h1>
        <p className="mt-2 text-charcoal/60">
          Choose how you want to share your knowledge.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {/* Record */}
          <button
            onClick={() => setState((s) => ({ ...s, mode: "record" }))}
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-8 text-center transition hover:border-primary hover:bg-primary-50 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10 group-hover:bg-terracotta/20">
              <Mic size={32} className="text-terracotta" />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary">Record</p>
              <p className="mt-1 text-sm text-charcoal/50">Lecture or voice note</p>
            </div>
          </button>

          {/* Upload */}
          <button
            onClick={() => setState((s) => ({ ...s, mode: "upload" }))}
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-8 text-center transition hover:border-primary hover:bg-primary-50 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
              <Upload size={32} className="text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary">Upload</p>
              <p className="mt-1 text-sm text-charcoal/50">Photo, PDF, or file</p>
            </div>
          </button>

          {/* Text */}
          <button
            onClick={() => setState((s) => ({ ...s, mode: "text" }))}
            className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-8 text-center transition hover:border-primary hover:bg-primary-50 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 group-hover:bg-gold/20">
              <Type size={32} className="text-gold" />
            </div>
            <div>
              <p className="font-heading font-semibold text-primary">Text</p>
              <p className="mt-1 text-sm text-charcoal/50">Paste your notes</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Recording mode
  if (state.mode === "record") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          onClick={() => setState((s) => ({ ...s, mode: null, recordedBlob: null, recordingDuration: 0, isRecording: false }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Record your material</h2>
        <p className="mt-2 text-charcoal/60">Record up to 2 hours of audio. We&apos;ll transcribe and analyze it.</p>

        {/* Recording UI */}
        <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-primary/10 bg-white p-12">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full transition ${
            state.isRecording
              ? "bg-red-100 animate-pulse"
              : state.recordedBlob ? "bg-green-100" : "bg-primary/10"
          }`}>
            {state.isRecording ? (
              <div className="h-8 w-8 rounded-full bg-red-500 animate-pulse" />
            ) : state.recordedBlob ? (
              <CheckCircle2 size={48} className="text-green-500" />
            ) : (
              <Mic size={48} className="text-primary" />
            )}
          </div>

          <div className="text-center">
            <p className="font-heading text-lg font-semibold text-charcoal">
              {state.isRecording ? "Recording..." : state.recordedBlob ? "Recording complete" : "Ready to record"}
            </p>
            {(state.isRecording || state.recordedBlob) && (
              <p className="mt-2 font-heading text-3xl font-bold text-primary">
                {formatTime(state.recordingDuration)}
              </p>
            )}
          </div>

          {state.recordedBlob ? (
            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={clearRecording}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary/20 px-6 py-3 font-medium text-charcoal/70 hover:bg-neutral transition"
              >
                <X size={18} /> Discard
              </button>
              <button
                onClick={() => setState((s) => ({ ...s, mode: "upload" }))}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600 transition"
              >
                <ArrowRight size={18} /> Next
              </button>
            </div>
          ) : (
            <button
              onClick={state.isRecording ? stopRecording : startRecording}
              className={`flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold transition ${
                state.isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-primary text-white hover:bg-primary-600"
              }`}
            >
              {state.isRecording ? (
                <>
                  <MicOff size={20} /> Stop Recording
                </>
              ) : (
                <>
                  <Mic size={20} /> Start Recording
                </>
              )}
            </button>
          )}

          <p className="text-center text-xs text-charcoal/40">
            {state.isRecording
              ? "Click stop when done"
              : "Click the button to start recording"}
          </p>
        </div>

        {/* Metadata */}
        {state.recordedBlob && (
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal/60 mb-2">Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Biology Lecture - Chapter 5"
                  value={state.title}
                  onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/60 mb-2">Subject (optional)</label>
                <select
                  value={state.subject}
                  onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
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

            <button
              onClick={handleProcess}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
            >
              <Upload size={18} />
              Process & Generate Materials
            </button>
          </div>
        )}
      </div>
    );
  }

  // Upload mode
  if (state.mode === "upload") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          onClick={() => setState((s) => ({ ...s, mode: null, file: null }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Upload your material</h2>
        <p className="mt-2 text-charcoal/60">Upload photos, PDFs, or audio files.</p>

        {/* File upload area */}
        <div className="mt-8">
          {state.file ? (
            <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                {state.file.type.startsWith("image") ? <Image size={20} className="text-primary" aria-hidden="true" /> : <FileText size={20} className="text-primary" aria-hidden="true" />}
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
                  JPG, PNG, PDF, MP3, WAV • Max 50MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Metadata */}
        {state.file && (
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal/60 mb-2">Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Biology Lecture - Chapter 5"
                  value={state.title}
                  onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/60 mb-2">Subject (optional)</label>
                <select
                  value={state.subject}
                  onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
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

            <button
              onClick={handleProcess}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
            >
              <Upload size={18} />
              Process & Generate Materials
            </button>
          </div>
        )}
      </div>
    );
  }

  // Text mode
  if (state.mode === "text") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          onClick={() => setState((s) => ({ ...s, mode: null, text: "" }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Paste your text</h2>
        <p className="mt-2 text-charcoal/60">Copy and paste your notes or article text.</p>

        <div className="mt-8 space-y-4">
          <label className="block font-heading text-sm font-semibold text-primary">
            Your text content
          </label>
          <textarea
            value={state.text}
            onChange={(e) => setState((s) => ({ ...s, text: e.target.value }))}
            placeholder="Paste your notes, article, or any text content here..."
            className="h-64 w-full rounded-2xl border border-primary/15 bg-white p-6 text-sm leading-relaxed transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-charcoal/30">{state.text.length} characters</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal/60 mb-2">Title (optional)</label>
              <input
                type="text"
                placeholder="e.g., Biology Notes - Photosynthesis"
                value={state.title}
                onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal/60 mb-2">Subject (optional)</label>
              <select
                value={state.subject}
                onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
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

          <button
            onClick={handleProcess}
            disabled={!state.text.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            Process & Generate Materials
          </button>
        </div>
      </div>
    );
  }
}
