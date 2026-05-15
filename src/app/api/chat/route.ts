import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { anthropic, MODEL } from "@/lib/anthropic/client";
import {
  DOCUMENT_QA_SYSTEM_PROMPT,
  buildDocumentContext,
} from "@/lib/anthropic/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { documentId, sessionId, messages: clientMessages } =
    await request.json();

  if (!documentId || !sessionId) {
    return new Response("Missing documentId or sessionId", { status: 400 });
  }

  // 2. Fetch document chunks (RLS enforces ownership)
  const { data: chunks, error: chunksError } = await supabase
    .from("document_chunks")
    .select("content, chunk_index")
    .eq("document_id", documentId)
    .order("chunk_index");

  if (chunksError || !chunks || chunks.length === 0) {
    return new Response("Document not found or not yet processed", {
      status: 404,
    });
  }

  // 3. Build full document context
  const documentContext = buildDocumentContext(chunks);

  // 4. The last message is the new user message — save it to DB
  const lastMessage = clientMessages[clientMessages.length - 1];
  if (lastMessage?.role === "user") {
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "user",
      content: lastMessage.content,
    });
  }

  // 5. Stream response from Claude
  try {
    const result = streamText({
      model: anthropic(MODEL),
      system: `${DOCUMENT_QA_SYSTEM_PROMPT}\n\n<document_content>\n${documentContext}\n</document_content>`,
      messages: clientMessages,
      onFinish: async ({ text, usage }) => {
        // 6. Save assistant response after stream completes
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          user_id: user.id,
          role: "assistant",
          content: text,
          input_tokens: usage.promptTokens,
          output_tokens: usage.completionTokens,
        });
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        const message = error instanceof Error ? error.message : "AI service error";
        console.error("[chat] Stream error:", message);
        return message;
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI service error";
    console.error("[chat] streamText error:", message);
    return new Response(message, { status: 500 });
  }
}
