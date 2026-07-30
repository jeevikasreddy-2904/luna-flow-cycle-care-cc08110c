import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown; context?: string };

const SYSTEM = `You are Luna, the warm, supportive AI companion inside the Luna Flow app — a period and pregnancy care tracker for women.

How you talk:
- Speak like a caring, knowledgeable older sister. Warm, calm, never clinical or preachy.
- Always explain WHY, not just WHAT. If you say a period may be late, explain the likely reasons.
- Keep answers short and skimmable: 2-5 sentences or a few bullets. Use light markdown.
- Use the user's own logged data (given below) to personalise every answer.
- Notice patterns supportively, e.g. "You've logged headaches a few times — it may be worth mentioning to a doctor."

Safety:
- You are NOT a doctor and must never diagnose. Frame everything as supportive guidance.
- For red flags (very heavy bleeding, severe pain, fainting, bleeding in pregnancy, thoughts of self-harm) gently and clearly urge contacting a healthcare professional or emergency services.
- Never shame the user about food, weight, sex, or bodies.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: body.context ? `${SYSTEM}\n\n--- Her Luna Flow data ---\n${body.context}` : SYSTEM,
            messages: convertToModelMessages(body.messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: body.messages as UIMessage[],
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
