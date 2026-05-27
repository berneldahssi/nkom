import Link from "next/link";
import { Plane, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
        <Plane size={44} className="-rotate-45 text-primary" />
      </div>
      <div>
        <p className="font-heading text-7xl font-bold text-primary/20">404</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-primary">Off course</h1>
        <p className="mt-2 max-w-xs text-sm text-charcoal/50">
          This page doesn&apos;t exist. Let&apos;s get you back on the flight plan.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
      >
        <Home size={16} />
        Back to dashboard
      </Link>
    </div>
  );
}
