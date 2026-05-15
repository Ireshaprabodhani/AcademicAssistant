import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate, formatFileSize } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentQAPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch document (RLS enforces ownership)
  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (!document) notFound();

  // Ensure or create a chat session for this document
  let sessionId: string;
  const { data: existingSession } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("document_id", id)
    .eq("user_id", user.id)
    .eq("feature", "document_qa")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existingSession) {
    sessionId = existingSession.id;
  } else {
    const { data: newSession } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        document_id: id,
        feature: "document_qa",
        title: `Q&A: ${document.title}`,
      })
      .select("id")
      .single();

    if (!newSession) redirect("/documents");
    sessionId = newSession.id;
  }

  const isReady = document.status === "ready";
  const isProcessing = document.status === "processing";

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/documents"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-base truncate">{document.title}</h1>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.file_size)}
              {document.page_count && ` · ${document.page_count} pages`}
              {document.word_count &&
                ` · ~${document.word_count.toLocaleString()} words`}
              {" · "}{formatDate(document.created_at)}
            </p>
          </div>
        </div>
        <Badge
          variant={
            document.status === "ready"
              ? "success"
              : document.status === "error"
              ? "destructive"
              : "warning"
          }
        >
          {document.status}
        </Badge>
      </div>

      {/* Chat or status */}
      {isReady ? (
        <div className="flex-1 min-h-0">
          <ChatWindow documentId={id} sessionId={sessionId} />
        </div>
      ) : isProcessing ? (
        <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
          <div>
            <p className="font-medium">Processing your document…</p>
            <p className="text-sm mt-1">
              This usually completes in a few seconds. Refresh the page to check.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-destructive">
          <div>
            <p className="font-medium">Failed to process document</p>
            {document.error_message && (
              <p className="text-sm mt-1 text-muted-foreground">
                {document.error_message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
