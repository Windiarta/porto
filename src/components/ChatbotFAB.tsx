"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI portfolio assistant. Ask me anything about Windiarta's background, projects, or AI expertise.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "There was an error reaching the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        aria-label="Chatbot"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-black text-white shadow-xl w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform"
      >
        💬
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 w-[90vw] max-w-[360px] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b font-semibold">AI Assistant</div>
            <div className="p-4 max-h-80 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-block px-3 py-2 rounded-xl " +
                      (m.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900")
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-sm text-gray-500">Thinking…</div>}
              <div ref={endRef} />
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about projects, skills, or experience…"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <button
                onClick={sendMessage}
                className="px-3 py-2 rounded-lg bg-black text-white disabled:opacity-60"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


