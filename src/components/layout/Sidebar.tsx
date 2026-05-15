"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  PenLine,
  BarChart2,
  Lightbulb,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "My Documents", icon: FileText },
  { href: "/essay-helper", label: "Essay Helper", icon: PenLine },
  { href: "/summarizer", label: "Summarizer", icon: BarChart2 },
  { href: "/explainer", label: "Concept Explainer", icon: Lightbulb },
  { href: "/planner", label: "Assignment Planner", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 shrink-0 border-r bg-white h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">AcademicAI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t">
        <p className="text-xs text-muted-foreground">AI Academic Assistant</p>
      </div>
    </aside>
  );
}
