"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Type, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AudioRecorder from "@/components/AudioRecorder";
import TextInput from "@/components/TextInput";
import FileUploader from "@/components/FileUploader";
import { useAuth } from "@/context/AuthContext";

type InputMode = "audio" | "text" | "file";

export default function UploadMVPPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [mode, setMode] = useState<InputMode | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToBackend = async (file: File | Blob, originalFilename: string, fileType: string) => {
    if (!accessToken) {
      setError("Not authenticated. Please login first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type", fileType);
      if (originalFilename) {
        formData.append("original_filename", originalFilename);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/content/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Upload failed");
      }

      const data = await response.json();
      // Redirect to materials page or show success
      router.push("/dashboard/materials");
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioComplete = async (blob: Blob, duration: number) => {
    await uploadToBackend(blob, `recording-${Date.now()}.mp3`, "audio");
  };

  const handleTextComplete = async (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    await uploadToBackend(blob, `text-${Date.now()}.txt`, "text");
  };

  const handleFileSelect = async (file: File) => {
    const fileType = file.name.endsWith(".pdf") ? "pdf" : "audio";
    await uploadToBackend(file, file.name, fileType);
  };

  return (
    <main className="min-h-screen bg-neutral px-6 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-primary transition mb-4"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <h1 className="font-heading text-3xl font-bold text-primary">Upload Study Material</h1>
          <p className="mt-2 text-charcoal/60">
            Choose how you want to add content. We&apos;ll transcribe and generate study materials automatically.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Input mode selector */}
        {!mode ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => setMode("audio")}
              className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mic size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-charcoal">Audio Recording</p>
                <p className="text-xs text-charcoal/60">Record a lecture or voice note</p>
              </div>
            </button>

            <button
              onClick={() => setMode("text")}
              className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Type size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-charcoal">Paste Text</p>
                <p className="text-xs text-charcoal/60">Copy and paste your notes</p>
              </div>
            </button>

            <button
              onClick={() => setMode("file")}
              className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-6 transition hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-charcoal">Upload File</p>
                <p className="text-xs text-charcoal/60">Upload MP3 or PDF files</p>
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Back button */}
            <button
              onClick={() => setMode(null)}
              className="mb-6 inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-primary transition"
            >
              <ArrowLeft size={16} /> Choose different input type
            </button>

            {/* Input component */}
            {mode === "audio" && (
              <AudioRecorder onRecordingComplete={handleAudioComplete} isUploading={isUploading} />
            )}

            {mode === "text" && (
              <TextInput onComplete={handleTextComplete} isLoading={isUploading} />
            )}

            {mode === "file" && (
              <FileUploader
                onFileSelect={handleFileSelect}
                isLoading={isUploading}
                acceptedTypes={[".mp3", ".pdf"]}
              />
            )}
          </>
        )}

        {/* Info section */}
        <div className="mt-12 rounded-2xl border border-primary/10 bg-white p-6">
          <h3 className="font-heading text-lg font-bold text-primary mb-4">What happens next?</h3>
          <ul className="space-y-2 text-sm text-charcoal/70">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>We process your content (transcribe audio, extract text from files)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Generate a summary and flashcards for studying</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>You review the material and start learning</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
