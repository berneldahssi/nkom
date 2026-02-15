'use client';

import React, { useState } from 'react';
import { Mic, StopCircle, Pause, Play, Upload, Download, Trash2, Clock, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped' | 'uploading' | 'complete' | 'error';

interface RecordingSession {
  id: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  fileName: string;
  startTime: Date;
  status: RecordingStatus;
  transcription?: string;
}

export interface RecordingUIProps {
  onRecordingComplete?: (recording: RecordingSession) => void;
  maxDuration?: number; // in seconds, default 7200 (2 hours)
  autoUpload?: boolean;
  privacyMode?: boolean;
}

/**
 * Complete Recording UI Component
 * Features:
 * - Record up to 2 hours continuously
 * - Visual waveform and timer
 * - Pause/Resume functionality
 * - Post-recording options (upload, save locally, discard)
 * - Privacy-first design
 */
export const RecordingUI: React.FC<RecordingUIProps> = ({
  onRecordingComplete,
  maxDuration = 7200,
  autoUpload = false,
  privacyMode = false,
}) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [currentRecording, setCurrentRecording] = useState<RecordingSession | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [showPostRecordingOptions, setShowPostRecordingOptions] = useState(false);
  const [battery, setBattery] = useState(87);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Simulate waveform data
  const generateWaveformBars = () => {
    const bars = Array.from({ length: 20 }, () => Math.random() * 100);
    setWaveformBars(bars);
  };

  const handleStartRecording = () => {
    setStatus('recording');
    setDuration(0);
    setFileSize(0);
    setShowPostRecordingOptions(false);
    generateWaveformBars();

    // Simulate duration and file size increase
    const interval = setInterval(() => {
      setDuration((prev) => {
        if (prev >= maxDuration) {
          clearInterval(interval);
          handleStopRecording();
          return prev;
        }
        const newDuration = prev + 1;
        // Estimate file size: ~50KB per minute at 128kbps
        setFileSize(Math.floor(newDuration * 833));
        return newDuration;
      });
    }, 1000);
  };

  const handlePauseRecording = () => {
    setStatus('paused');
  };

  const handleResumeRecording = () => {
    setStatus('recording');
    generateWaveformBars();
  };

  const handleStopRecording = () => {
    setStatus('stopped');
    setShowPostRecordingOptions(true);
    setCurrentRecording({
      id: `recording_${Date.now()}`,
      duration,
      fileSize,
      fileName: `Lecture_${new Date().toLocaleTimeString()}.m4a`,
      startTime: new Date(),
      status: 'stopped',
    });
  };

  const handleUpload = () => {
    setStatus('uploading');
    // Simulate upload
    setTimeout(() => {
      setStatus('complete');
      onRecordingComplete?.(currentRecording!);
    }, 2000);
  };

  const handleDiscard = () => {
    setStatus('idle');
    setDuration(0);
    setFileSize(0);
    setCurrentRecording(null);
    setShowPostRecordingOptions(false);
  };

  // Main Recording Screen
  if (status === 'recording' || status === 'paused') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-primary/10 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary">Recording Class</h2>
          <p className="text-sm text-charcoal/60 mt-2">Your audio is saved locally & will be encrypted</p>
        </div>

        {/* Recording Indicator */}
        {status === 'recording' && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-red-500">RECORDING</span>
          </div>
        )}

        {status === 'paused' && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">PAUSED</span>
          </div>
        )}

        {/* Timer */}
        <div className="mb-6 text-center">
          <div className="text-5xl font-heading font-bold text-primary">{formatTime(duration)}</div>
          <p className="text-sm text-charcoal/60 mt-2">Max: {formatTime(maxDuration)}</p>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-6 h-16 flex items-end justify-center gap-1 bg-primary/5 rounded-lg p-4">
          {waveformBars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary to-gold rounded-sm transition-all"
              style={{
                height: status === 'recording' ? `${bar}%` : '20%',
                opacity: status === 'paused' ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        {/* Recording Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-neutral p-3 rounded-lg">
            <Clock size={18} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-charcoal/60">Duration</p>
            <p className="text-sm font-semibold text-primary">{formatTime(duration)}</p>
          </div>
          <div className="bg-neutral p-3 rounded-lg">
            <HardDrive size={18} className="text-terracotta mx-auto mb-1" />
            <p className="text-xs text-charcoal/60">File Size</p>
            <p className="text-sm font-semibold text-terracotta">{formatFileSize(fileSize)}</p>
          </div>
          <div className="bg-neutral p-3 rounded-lg">
            <span className="text-lg text-primary mx-auto block mb-1">🔋</span>
            <p className="text-xs text-charcoal/60">Battery</p>
            <p className="text-sm font-semibold text-primary">{battery}%</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          {status === 'recording' ? (
            <>
              <button
                onClick={handlePauseRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-600 px-4 py-3 rounded-xl font-medium transition hover:bg-yellow-500/20"
              >
                <Pause size={18} />
                Pause
              </button>
              <button
                onClick={handleStopRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-600 px-4 py-3 rounded-xl font-medium transition hover:bg-red-500/20"
              >
                <StopCircle size={18} />
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleResumeRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-600 px-4 py-3 rounded-xl font-medium transition hover:bg-green-500/20"
              >
                <Play size={18} />
                Resume
              </button>
              <button
                onClick={handleStopRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-600 px-4 py-3 rounded-xl font-medium transition hover:bg-red-500/20"
              >
                <StopCircle size={18} />
                Stop
              </button>
            </>
          )}
        </div>

        {/* Privacy Note */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-charcoal/70 text-center">
          <p>✓ Recording saved locally on your device</p>
          <p>✓ Encrypted in transit to our servers</p>
          <p>✓ Never shared without your consent</p>
        </div>
      </div>
    );
  }

  // Post-Recording Options Screen
  if (showPostRecordingOptions && currentRecording) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-primary/10 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-primary">Recording Saved!</h2>
          <p className="text-sm text-charcoal/60 mt-2">{currentRecording.fileName}</p>
        </div>

        {/* Recording Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral rounded-lg">
          <div>
            <p className="text-xs text-charcoal/60 uppercase tracking-wide">Duration</p>
            <p className="text-lg font-semibold text-primary">{formatTime(currentRecording.duration)}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/60 uppercase tracking-wide">File Size</p>
            <p className="text-lg font-semibold text-primary">{formatFileSize(currentRecording.fileSize)}</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-between bg-primary text-white px-4 py-3 rounded-xl font-medium transition hover:bg-primary-600"
          >
            <div className="flex items-center gap-2">
              <Upload size={18} />
              Generate Materials Now
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Instant</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-charcoal/60">or</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-between bg-charcoal/5 text-charcoal px-4 py-3 rounded-xl font-medium transition hover:bg-charcoal/10">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gold" />
              Upload Later
            </div>
            <span className="text-xs text-charcoal/60">Auto-sync</span>
          </button>

          <button className="w-full flex items-center justify-between bg-charcoal/5 text-charcoal px-4 py-3 rounded-xl font-medium transition hover:bg-charcoal/10">
            <div className="flex items-center gap-2">
              <Download size={18} className="text-terracotta" />
              Save Locally Only
            </div>
            <span className="text-xs text-charcoal/60">Private</span>
          </button>
        </div>

        {/* Discard */}
        <button
          onClick={handleDiscard}
          className="w-full flex items-center justify-center gap-2 text-charcoal/60 px-4 py-2 rounded-xl font-medium transition hover:text-charcoal hover:bg-charcoal/5"
        >
          <Trash2 size={16} />
          Discard Recording
        </button>
      </div>
    );
  }

  // Upload Progress Screen
  if (status === 'uploading') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-primary/10 p-8 shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-spin">
            <Upload size={32} className="text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-primary">Uploading...</h2>
          <p className="text-sm text-charcoal/60 mt-2">Creating your study materials</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-charcoal/10 rounded-full h-2 overflow-hidden mb-4">
          <div className="bg-primary h-full w-2/3 rounded-full animate-pulse" />
        </div>
        <p className="text-xs text-charcoal/60">Transcribing audio... 67%</p>
      </div>
    );
  }

  // Complete Screen
  if (status === 'complete') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-primary/10 p-8 shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-primary">Materials Ready!</h2>
          <p className="text-sm text-charcoal/60 mt-2">Your 7 study formats have been generated</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 text-left">
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-xs text-charcoal/60">📝 Summary</p>
            <p className="text-sm font-semibold text-primary">Ready</p>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-xs text-charcoal/60">🎙️ Podcast</p>
            <p className="text-sm font-semibold text-primary">Ready</p>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-xs text-charcoal/60">🗂️ Flashcards</p>
            <p className="text-sm font-semibold text-primary">Ready</p>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-xs text-charcoal/60">❓ Quiz</p>
            <p className="text-sm font-semibold text-primary">Ready</p>
          </div>
        </div>

        <button className="w-full bg-primary text-white px-4 py-3 rounded-xl font-medium transition hover:bg-primary-600">
          Start Learning →
        </button>
      </div>
    );
  }

  // Idle State - Start Button
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-primary/10 p-8 shadow-lg text-center">
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Mic size={32} className="text-gold" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-primary">Record Your Class</h2>
        <p className="text-sm text-charcoal/60 mt-3">
          Record your lecture up to 2 hours. We'll transcribe it and generate study materials instantly.
        </p>
      </div>

      <ul className="text-left space-y-2 mb-6 text-sm text-charcoal/70">
        <li className="flex gap-2">
          <span className="text-gold">✓</span>
          <span>One-tap recording</span>
        </li>
        <li className="flex gap-2">
          <span className="text-gold">✓</span>
          <span>Automatic transcription</span>
        </li>
        <li className="flex gap-2">
          <span className="text-gold">✓</span>
          <span>Background upload</span>
        </li>
        <li className="flex gap-2">
          <span className="text-gold">✓</span>
          <span>7 study formats</span>
        </li>
      </ul>

      <button
        onClick={handleStartRecording}
        className="w-full bg-gold text-white px-6 py-4 rounded-xl font-bold transition hover:bg-gold-600 flex items-center justify-center gap-2 text-lg"
      >
        <Mic size={20} />
        Start Recording
      </button>

      <p className="text-xs text-charcoal/40 mt-4">
        🔒 Your recording is always private. Choose to upload or keep locally.
      </p>
    </div>
  );
};

export default RecordingUI;
