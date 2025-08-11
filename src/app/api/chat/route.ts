import { NextRequest } from "next/server";
import { openRouterChat } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const systemPrompt = {
      role: "system",
      content:
        "You are a helpful portfolio assistant for a Full Stack Developer and AI Engineer named Windiarta. Answer concisely and in a friendly tone. If asked about projects or experience, you can reference the portfolio content and typical expertise: Next.js, TypeScript, Node.js, Python, FastAPI, LangChain, vector databases, RAG, LLM fine-tuning, MLOps.",
    };
    const completion = await openRouterChat([systemPrompt, ...messages]);
    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}


