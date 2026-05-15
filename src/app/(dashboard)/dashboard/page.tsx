import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  FileText,
  PenLine,
  BarChart2,
  Lightbulb,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const features = [
  {
    href: "/documents",
    icon: FileText,
    title: "Document Q&A",
    description: "Upload lecture notes or papers and ask questions",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/essay-helper",
    icon: PenLine,
    title: "Essay Helper",
    description: "Get detailed feedback to improve your writing",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    href: "/summarizer",
    icon: BarChart2,
    title: "Summarizer",
    description: "Summarize research papers in seconds",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    href: "/explainer",
    icon: Lightbulb,
    title: "Concept Explainer",
    description: "Understand complex topics with clear explanations",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    href: "/planner",
    icon: ClipboardList,
    title: "Assignment Planner",
    description: "Break assignments into clear, actionable steps",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch recent documents
  const { data: recentDocs } = await supabase
    .from("documents")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Good to see you, {firstName}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          What would you like to work on today?
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {features.map(({ href, icon: Icon, title, description, color, bg }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-5">
                <div
                  className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent documents */}
      {recentDocs && recentDocs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base">Recent documents</h2>
            <Link
              href="/documents"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={doc.status === "ready" ? `/documents/${doc.id}` : "/documents"}
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium flex-1 truncate">
                      {doc.title}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(doc.created_at)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
