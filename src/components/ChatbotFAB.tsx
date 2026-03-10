"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

// Function to clean up malformed table content
function cleanTableContent(content: string): string {
  // Replace <br> tags with line breaks
  let cleaned = content.replace(/<br\s*\/?>/gi, '\n');

  // Fix common table formatting issues
  cleaned = cleaned.replace(/\|\s*\n\s*\|/g, '|\n|');

  // Handle the specific case from the user's example
  // Look for patterns like "| Category | Tools / Technologies | Typical Use |"
  const tablePattern = /\|.*\|.*\|.*\|/;
  if (tablePattern.test(cleaned)) {
    const lines = cleaned.split('\n');
    const tableStartIndex = lines.findIndex(line => tablePattern.test(line));

    if (tableStartIndex !== -1) {
      // Find where the table ends
      let tableEndIndex = tableStartIndex;
      for (let i = tableStartIndex; i < lines.length; i++) {
        if (lines[i].trim().includes('|')) {
          tableEndIndex = i;
        } else if (lines[i].trim() === '') {
          break;
        }
      }

      // Extract table lines
      const tableLines = lines.slice(tableStartIndex, tableEndIndex + 1);

      // Check if we need to add a header separator
      const hasHeaderSeparator = tableLines.some(line =>
        line.trim().match(/^\|[\s\-:]+\|[\s\-:]+\|[\s\-:]+\|$/)
      );

      if (!hasHeaderSeparator && tableLines.length >= 2) {
        // Count columns from the first row
        const firstRow = tableLines[0];
        const columnCount = (firstRow.match(/\|/g) || []).length - 1;
        const separator = '|' + '---|'.repeat(columnCount);

        // Reconstruct the content with proper table formatting
        const beforeTable = lines.slice(0, tableStartIndex);
        const afterTable = lines.slice(tableEndIndex + 1);

        const newTableLines = [
          tableLines[0],
          separator,
          ...tableLines.slice(1)
        ];

        return [...beforeTable, ...newTableLines, ...afterTable].join('\n');
      }
    }
  }

  return cleaned;
}

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
        className="rounded-full bg-accent text-white shadow-2xl shadow-accent/20 w-16 h-16 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-3xl relative z-10 group-hover:rotate-12 transition-transform">🤖</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[90vw] max-w-[400px] bg-black border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-accent/5 flex flex-col max-h-[600px]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-bold tracking-tight uppercase italic text-sm">AI Portfolio Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-hide min-h-0">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      "px-5 py-3.5 rounded-3xl max-w-[90%] text-sm leading-relaxed " +
                      (m.role === "user"
                        ? "bg-accent text-white font-medium rounded-tr-none shadow-lg shadow-accent/10"
                        : "glass border border-white/5 text-foreground/80 rounded-tl-none")
                    }
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-foreground underline decoration-accent/30 underline-offset-2">{children}</strong>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-[12px] font-mono text-accent-secondary">{children}</code>
                              ) : (
                                <pre className="bg-white/5 p-4 rounded-2xl text-[11px] overflow-x-auto my-3 border border-white/10">
                                  <code className="text-foreground/80">{children}</code>
                                </pre>
                              );
                            },
                            ul: ({ children }) => <ul className="list-none space-y-2 my-2">{children}</ul>,
                            li: ({ children }) => (
                              <li className="flex gap-2">
                                <span className="text-accent">•</span>
                                <span>{children}</span>
                              </li>
                            ),
                            a: ({ children, href }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold transition-all">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {cleanTableContent(m.content)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="glass px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all placeholder:text-foreground/20 pr-16"
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-2 p-2.5 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


