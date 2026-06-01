"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Step = "email" | "code";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, confirmForgotPassword } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("code");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset code.";
      setError(msg.includes("UserNotFoundException") ? "No account found with this email." : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await confirmForgotPassword(email, code, newPassword);
      router.push("/auth?reset=1");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password.";
      if (msg.includes("CodeMismatch")) setError("Incorrect code. Please check and try again.");
      else if (msg.includes("InvalidPasswordException")) setError("Password must be 8+ characters with uppercase, lowercase, numbers, and symbols.");
      else if (msg.includes("ExpiredCode")) setError("Code has expired. Please request a new one.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral px-6">
      <div className="w-full max-w-md space-y-8">
        <Link href="/auth" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-primary">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {step === "email" ? "Forgot your password?" : "Set a new password"}
          </h1>
          <p className="mt-2 text-sm text-charcoal/60">
            {step === "email"
              ? "Enter your email and we'll send you a reset code."
              : `We sent a code to ${email}. Enter it below along with your new password.`}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-error/20 bg-error/5 p-3 text-sm text-error">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-white py-3 pl-10 pr-4 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Sending code…
                </span>
              ) : "Send reset code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-primary/15 bg-white py-3 px-4 text-center font-mono text-lg tracking-widest transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              autoFocus
              maxLength={6}
            />
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-white py-3 pl-10 pr-10 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full rounded-xl bg-primary py-3.5 font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Resetting…
                </span>
              ) : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("email"); setCode(""); setError(null); }}
              className="w-full text-center text-sm text-charcoal/50 hover:text-primary"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
