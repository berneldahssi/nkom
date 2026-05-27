"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-success" />,
  error: <AlertCircle size={16} className="text-error" />,
  info: <Info size={16} className="text-info" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/20 bg-success/5",
  error: "border-error/20 bg-error/5",
  info: "border-info/20 bg-info/5",
  warning: "border-warning/20 bg-warning/5",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const variant = toast.variant ?? "info";
  return (
    <div
      className={cn(
        "flex w-80 items-start gap-3 rounded-xl border p-4 shadow-dropdown backdrop-blur animate-fade-in",
        "bg-white dark:bg-[rgb(var(--color-card))]",
        variantStyles[variant]
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[variant]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-charcoal/60">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-0.5 text-charcoal/40 hover:text-charcoal transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 4000;
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
