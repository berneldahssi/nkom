"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

interface TextInputProps {
  onComplete: (text: string) => void;
  isLoading?: boolean;
}

export default function TextInput({ onComplete, isLoading = false }: TextInputProps) {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 50000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, MAX_CHARS);
    setText(newText);
    setCharCount(newText.length);
  };

  const handlePaste = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      const combinedText = (text + pastedText).slice(0, MAX_CHARS);
      setText(combinedText);
      setCharCount(combinedText.length);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onComplete(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Paste your notes or content
        </label>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your lecture notes, article, or study material here..."
          className="w-full h-64 rounded-xl border border-primary/15 bg-white p-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-charcoal/60">
        <button
          type="button"
          onClick={handlePaste}
          className="text-terracotta hover:underline font-medium"
        >
          Paste from clipboard
        </button>
        <span>
          {charCount} / {MAX_CHARS} characters
        </span>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
      >
        <Upload size={18} />
        {isLoading ? "Processing..." : "Upload & Generate"}
      </button>
    </form>
  );
}
