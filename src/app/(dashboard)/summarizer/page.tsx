"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, BarChart2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function SummarizerPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  const { messages, input, setInput, isLoading, handleSubmit } = useChat({
    api: "/api/summarize",
    body: { sessionId },
  });

  const startSession = async () => {
    setInitializing(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, feature: "summarizer" })
        .select("id")
        .single();

      if (data) setSessionId(data.id);
    } catch {
      toast({ title: "Failed to start session", variant: "destructive" });
    } finally {
      setInitializing(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart2 className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Paper Summarizer</h1>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Paste a research paper or article and get a structured summary with key
          findings, methodology, and conclusions.
        </p>
        <Button onClick={startSession} disabled={initializing}>
          {initializing ? "Starting…" : "Start summarizer"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
          <BarChart2 className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h1 className="font-semibold">Paper Summarizer</h1>
          <p className="text-xs text-muted-foreground">
            Paste text or ask for a summary
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-gray-50 rounded-xl border overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
              <Bot className="h-10 w-10 mb-3 text-green-300" />
              <p className="text-sm font-medium">Paste your paper or article</p>
              <p className="text-xs mt-1">You&apos;ll get a structured academic summary</p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={msg.content}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
              <div className="bg-white border rounded-xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 p-4 border-t bg-white"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the paper text or abstract here…"
            disabled={isLoading}
            rows={3}
            className="resize-none flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) handleSubmit(e as never);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
