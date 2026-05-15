"use client";

import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";

interface ChatWindowProps {
  documentId: string;
  sessionId: string;
  apiRoute?: string;
  placeholder?: string;
  initialSystemMessage?: string;
}

export function ChatWindow({
  documentId,
  sessionId,
  apiRoute = "/api/chat",
  placeholder,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, isLoading, error, handleSubmit } = useChat({
    api: apiRoute,
    body: { documentId, sessionId },
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <Bot className="h-10 w-10 mb-3 text-primary/40" />
            <p className="text-sm font-medium">Ask anything about your document</p>
            <p className="text-xs mt-1">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role as "user" | "assistant"} content={msg.content} />
        ))}

        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-white border rounded-xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </ScrollArea>

      {error && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border-t">
          {error.message}
        </div>
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
        placeholder={placeholder}
      />
    </div>
  );
}
