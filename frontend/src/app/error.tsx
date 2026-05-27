"use client";

import { useEffect } from "react";
import { TriangleAlert, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-error/10">
        <TriangleAlert size={44} className="text-error" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-2 max-w-xs text-sm text-charcoal/50">
          An unexpected error occurred. Your progress is safe — try again below.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-charcoal/30">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}
