import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { anthropic, MODEL } from "@/lib/anthropic/client";
import {
  SUMMARIZER_SYSTEM_PROMPT,
  buildDocumentContext,
} from "@/lib/anthropic/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { documentId, sessionId, messages } = await request.json();

  // If documentId provided, include document context
  let systemPrompt = SUMMARIZER_SYSTEM_PROMPT;
  if (documentId) {
    const { data: chunks } = await supabase
      .from("document_chunks")
      .select("content, chunk_index")
      .eq("document_id", documentId)
      .order("chunk_index");

    if (chunks && chunks.length > 0) {
      const context = buildDocumentContext(chunks);
      systemPrompt += `\n\n<document_content>\n${context}\n</document_content>`;
    }
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user" && sessionId) {
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "user",
      content: lastMessage.content,
    });
  }

  const result = streamText({
    model: anthropic(MODEL),
    system: systemPrompt,
    messages,
    onFinish: async ({ text, usage }) => {
      if (sessionId) {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          user_id: user.id,
          role: "assistant",
          content: text,
          input_tokens: usage.promptTokens,
          output_tokens: usage.completionTokens,
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
