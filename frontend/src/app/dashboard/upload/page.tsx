"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Upload, X, CheckCircle2, Loader2, FileText, Image, Type, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type InputMode = "record" | "upload" | "text";

interface UploadState {
  mode: InputMode | null;
  file: File | null;
  text: string;
  processing: boolean;
  done: boolean;
  error: string | null;
  isRecording: boolean;
  recordingDuration: number;
  recordedBlob: Blob | null;
}

export default function UploadPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [state, setState] = useState<UploadState>({
    mode: null,
    file: null,
    text: "",
    processing: false,
    done: false,
    error: null,
    isRecording: false,
    recordingDuration: 0,
    recordedBlob: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
        setState((s) => ({ ...s, recordedBlob: blob, isRecording: false }));
        clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setState((s) => ({ ...s, isRecording: true, recordingDuration: 0, error: null }));

      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, recordingDuration: s.recordingDuration + 1 }));
      }, 1000);
    } catch {
      setState((s) => ({ ...s, error: "Unable to access microphone. Please check permissions." }));
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

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setState((s) => ({ ...s, file, error: null }));
  };

  // Upload to backend API
  const uploadToBackend = async (file: File | Blob, originalFilename: string, fileType: string) => {
    if (!accessToken) {
      setState((s) => ({ ...s, error: "Not authenticated. Please login first." }));
      return;
    }

    setState((s) => ({ ...s, processing: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", fileType);
      if (originalFilename) {
        formData.append("original_filename", originalFilename);
      }

      const response = await fetch(`${API_URL}/api/v1/content/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Upload failed");
      }

      setState((s) => ({ ...s, processing: false, done: true }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setState((s) => ({ ...s, processing: false, error: message }));
    }
  };

  // Process & upload content
  const handleProcess = async () => {
    if (state.recordedBlob) {
      await uploadToBackend(state.recordedBlob, `recording-${Date.now()}.mp3`, "audio");
    } else if (state.file) {
      const ext = state.file.name.split(".").pop()?.toLowerCase();
      const fileType = ext === "pdf" ? "pdf" : ["mp3", "wav", "m4a"].includes(ext || "") ? "audio" : "image";
      await uploadToBackend(state.file, state.file.name, fileType);
    } else if (state.text.trim()) {
      const blob = new Blob([state.text], { type: "text/plain" });
      await uploadToBackend(blob, `text-${Date.now()}.txt`, "text");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetState = () => {
    setState({
      mode: null, file: null, text: "", processing: false, done: false, error: null,
      isRecording: false, recordingDuration: 0, recordedBlob: null,
    });
  };

  // Success state
  if (state.done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Material uploaded!</h1>
        <p className="mt-2 text-charcoal/60">
          Your content has been uploaded and is being processed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard/materials"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            View materials <ArrowRight size={16} />
          </Link>
          <button
            onClick={resetState}
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
        <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Uploading your content...</h1>
        <p className="mt-2 text-charcoal/60">
          Please wait while we upload and process your material.
        </p>
      </div>
    );
  }

  // Error banner
  const errorBanner = state.error ? (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {state.error}
    </div>
  ) : null;

  // Mode selection
  if (!state.mode) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Add your learning material</h1>
        <p className="mt-2 text-charcoal/60">
          Choose how you want to share your knowledge.
        </p>

        {errorBanner}

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setState((s) => ({ ...s, mode: "record", error: null }))}
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

          <button
            onClick={() => setState((s) => ({ ...s, mode: "upload", error: null }))}
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

          <button
            onClick={() => setState((s) => ({ ...s, mode: "text", error: null }))}
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
          onClick={() => setState((s) => ({ ...s, mode: null, recordedBlob: null, recordingDuration: 0, isRecording: false, error: null }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Record your material</h2>
        <p className="mt-2 text-charcoal/60">Record up to 2 hours of audio. We&apos;ll transcribe and analyze it.</p>

        {errorBanner}

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
                onClick={handleProcess}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary-600 transition"
              >
                <Upload size={18} /> Upload
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
              : state.recordedBlob
              ? "Upload to process your recording"
              : "Click the button to start recording"}
          </p>
        </div>
      </div>
    );
  }

  // Upload mode
  if (state.mode === "upload") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          onClick={() => setState((s) => ({ ...s, mode: null, file: null, error: null }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Upload your material</h2>
        <p className="mt-2 text-charcoal/60">Upload photos, PDFs, or audio files.</p>

        {errorBanner}

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
                  JPG, PNG, PDF, MP3, WAV - Max 25MB
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

        {state.file && (
          <div className="mt-8">
            <button
              onClick={handleProcess}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
            >
              <Upload size={18} />
              Upload & Process
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
          onClick={() => setState((s) => ({ ...s, mode: null, text: "", error: null }))}
          className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary"
        >
          <X size={16} /> Back
        </button>

        <h2 className="font-heading text-2xl font-bold text-primary">Paste your text</h2>
        <p className="mt-2 text-charcoal/60">Copy and paste your notes or article text.</p>

        {errorBanner}

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

          <button
            onClick={handleProcess}
            disabled={!state.text.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            Upload & Process
          </button>
        </div>
      </div>
    );
  }

  return null;
}
