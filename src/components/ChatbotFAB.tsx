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
                      "inline-block px-3 py-2 rounded-xl max-w-[85%] " +
                      (m.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900")
                    }
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    ) : (
                      <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Custom styling for different markdown elements
                            p: ({ children }) => <span className="block mb-1 last:mb-0">{children}</span>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                              ) : (
                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                            a: ({ children, href }) => (
                              <a 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {children}
                              </a>
                            ),
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-gray-300 pl-2 italic text-gray-600 my-1">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-2">
                                <table className="min-w-full border border-gray-300 text-xs">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                            tbody: ({ children }) => <tbody>{children}</tbody>,
                            tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
                            th: ({ children }) => (
                              <th className="px-2 py-1 text-left font-semibold border-r border-gray-300">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-2 py-1 border-r border-gray-300">
                                {children}
                              </td>
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


