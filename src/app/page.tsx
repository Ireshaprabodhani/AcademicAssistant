import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  PenLine,
  BarChart2,
  Lightbulb,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Document Q&A",
    description:
      "Upload your lecture notes or papers as PDFs and ask any question. Get precise, cited answers instantly.",
  },
  {
    icon: PenLine,
    title: "Essay Helper",
    description:
      "Paste your draft essay and receive specific, actionable feedback on structure, argument, and style.",
  },
  {
    icon: BarChart2,
    title: "Paper Summarizer",
    description:
      "Condense lengthy research papers into structured summaries with key findings and conclusions.",
  },
  {
    icon: Lightbulb,
    title: "Concept Explainer",
    description:
      "Struggling with a complex topic? Get clear, intuitive explanations with real-world examples.",
  },
  {
    icon: ClipboardList,
    title: "Assignment Planner",
    description:
      "Break down any assignment into actionable steps with time guidance so you never feel overwhelmed.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AcademicAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <BookOpen className="h-3.5 w-3.5" />
          Built for university students
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
          Your AI study partner
          <br />
          <span className="text-primary">for every assignment</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Upload lecture notes, get essay feedback, summarize research papers, and
          understand complex concepts — all powered by Claude AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          Everything you need to study smarter
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>AcademicAI — Powered by Claude</p>
      </footer>
    </div>
  );
}
