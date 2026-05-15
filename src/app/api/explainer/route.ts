import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { anthropic, MODEL } from "@/lib/anthropic/client";
import { EXPLAINER_SYSTEM_PROMPT } from "@/lib/anthropic/prompts";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { sessionId, messages } = await request.json();

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
    system: EXPLAINER_SYSTEM_PROMPT,
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
