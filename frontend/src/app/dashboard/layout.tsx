import Link from "next/link";
import { BookOpen, Home, BarChart3, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-primary/10 bg-white px-4 py-6 lg:flex">
        <Link href="/" className="mb-10 px-3 font-heading text-2xl font-bold text-primary">
          NKOM
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          <SidebarLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" />
          <SidebarLink href="/dashboard/materials" icon={<BookOpen size={18} />} label="Materials" />
          <SidebarLink href="/dashboard/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
          <SidebarLink href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        <button className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-charcoal/50 hover:bg-neutral">
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 transition hover:bg-neutral hover:text-primary"
    >
      {icon}
      {label}
    </Link>
  );
}
