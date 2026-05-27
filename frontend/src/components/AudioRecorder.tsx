"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Upload, X } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  isUploading?: boolean;
}

export default function AudioRecorder({
  onRecordingComplete,
  isUploading = false,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const streamRef = useRef<MediaStream | null>(null);

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
        setRecordedBlob(blob);
        setIsRecording(false);
        clearTimeout(timerRef.current);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const clearRecording = () => {
    setRecordedBlob(null);
    setDuration(0);
    chunksRef.current = [];
  };

  const handleUpload = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-white p-6">
      {recordedBlob ? (
        <>
          {/* Recorded state */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mic size={32} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">Recording saved</p>
              <p className="text-2xl font-bold text-primary">{formatTime(duration)}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={clearRecording}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-medium text-charcoal/70 transition hover:bg-neutral disabled:opacity-60"
              disabled={isUploading}
            >
              <X size={18} /> Discard
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
            >
              <Upload size={18} />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Recording state */}
          <div className={`flex h-20 w-20 items-center justify-center rounded-full transition ${
            isRecording
              ? "bg-red-100 animate-pulse"
              : "bg-primary/10"
          }`}>
            {isRecording ? (
              <div className="h-8 w-8 rounded-full bg-red-500 animate-pulse" />
            ) : (
              <Mic size={40} className={isRecording ? "text-red-500" : "text-primary"} />
            )}
          </div>

          <div>
            <p className="text-center text-sm font-medium text-charcoal">
              {isRecording ? "Recording..." : "Ready to record"}
            </p>
            {isRecording && (
              <p className="text-center text-2xl font-bold text-red-500 mt-1">
                {formatTime(duration)}
              </p>
            )}
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-white hover:bg-primary-600"
            }`}
          >
            {isRecording ? (
              <>
                <MicOff size={20} /> Stop Recording
              </>
            ) : (
              <>
                <Mic size={20} /> Start Recording
              </>
            )}
          </button>

          <p className="text-center text-xs text-charcoal/50">
            {isRecording
              ? "Click stop when done. Maximum 2 hours per recording."
              : "Click the microphone icon to start recording"}
          </p>
        </>
      )}
    </div>
  );
}
