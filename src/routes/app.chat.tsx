import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Moon, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { buildLunaContext } from "@/lib/luna-context";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Ask Luna — your AI cycle companion" },
      {
        name: "description",
        content:
          "Chat with Luna, the Luna Flow AI companion that remembers your cycle day, symptoms, meals and pregnancy week.",
      },
      { property: "og:title", content: "Ask Luna — your AI cycle companion" },
      {
        property: "og:description",
        content: "A warm AI companion that knows your cycle, meals and symptoms — and answers instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "lunaflow_chat_v1";

const SUGGESTIONS = [
  "Why is my period late this month?",
  "What should I eat today for cramps?",
  "Am I getting enough protein?",
  "Give me a gentle 5-minute routine for today",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function textOf(m: UIMessage) {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function ChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, context: buildLunaContext() },
        }),
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "luna-single-chat",
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message || "Luna couldn't reply right now."),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* quota — ignore */
    }
  }, [messages]);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) taRef.current?.focus();
  }, [busy]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    void sendMessage({ text: t });
  };

  const clear = () => {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="space-y-4">
      <div className="glass shadow-soft rounded-[2rem] p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center shadow-soft shrink-0">
            <Moon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold">Ask Luna 💬</h1>
            <p className="text-sm text-muted-foreground">
              She remembers your cycle, symptoms and meals — ask her anything.
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="rounded-full bg-white/70 hover:bg-white px-3 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="glass shadow-soft rounded-[2rem] overflow-hidden flex flex-col h-[64vh]">
        <Conversation className="flex-1">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Hi love, I'm Luna 🌸"
                description="Ask me about your cycle, cramps, food, mood or pregnancy — I'll answer with your own logs in mind."
              />
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                  <MessageContent
                    className={
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl px-4 py-2.5"
                        : "bg-transparent p-0 text-foreground"
                    }
                  >
                    <MessageResponse>{textOf(m)}</MessageResponse>
                  </MessageContent>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => speak(textOf(m))}
                      aria-label="Hear this answer"
                      className="self-end mb-1 rounded-full bg-white/70 hover:bg-white p-2 shrink-0"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </Message>
              ))
            )}
            {status === "submitted" && (
              <Shimmer className="text-sm font-semibold">Luna is thinking…</Shimmer>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {messages.length === 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full bg-white/70 hover:bg-white text-xs font-semibold px-3 py-1.5 shadow-soft"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-border/40">
          <PromptInput
            onSubmit={(_, e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              ref={taRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Luna anything about your body…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
