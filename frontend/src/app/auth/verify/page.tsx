"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { confirmEmail, resendCode } = useAuth();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every((d) => d)) handleVerify(next.join(""));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("").map((_, i) => pasted[i] ?? "");
    setCode(next);
    if (pasted.length === 6) handleVerify(pasted);
    else inputRefs.current[pasted.length]?.focus();
  };

  const handleVerify = async (fullCode: string) => {
    setError(null);
    setLoading(true);
    try {
      await confirmEmail(email, fullCode);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(msg.includes("CodeMismatch") ? "Incorrect code. Please check and try again." : msg);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await resendCode(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError("Could not resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral px-6">
      <div className="w-full max-w-md space-y-8">
        <Link href="/auth" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Mail size={32} className="text-primary" />
          </div>
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary">Check your inbox</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            We sent a 6-digit code to <span className="font-medium text-charcoal">{email || "your email"}</span>
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-error/20 bg-error/5 p-3 text-center text-sm text-error">
            {error}
          </div>
        )}

        {resent && (
          <div className="rounded-xl border border-success/20 bg-success/5 p-3 text-center text-sm text-success">
            New code sent!
          </div>
        )}

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className="h-14 w-12 rounded-xl border border-primary/20 bg-white text-center text-xl font-bold text-primary shadow-card transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-charcoal/50">
            <Loader2 size={16} className="animate-spin" /> Verifying…
          </div>
        )}

        <p className="text-center text-sm text-charcoal/60">
          Didn&apos;t get a code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-terracotta hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
      </div>
    </main>
  );
}
