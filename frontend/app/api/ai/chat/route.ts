import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  buildSystemPrompt,
  sanitizeMessages,
  generateLocalFallbackResponse,
  AssistantRequestContext,
} from "@/lib/ai/prompt-builder";
import { SupportedLanguage } from "@/lib/ai/translations";

export async function POST(request: NextRequest) {
  // 1. Sliding-window rate limit: max 20 AI requests per minute per IP
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "ai_chat",
    maxRequests: 20,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "AI assistant is receiving too many requests. Please wait a few seconds before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds ?? 10),
        },
      }
    );
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
  }

  const { messages, language = "en", context } = body as {
    messages?: Array<{ role: string; content: string }>;
    language?: SupportedLanguage;
    context?: AssistantRequestContext["activeResult"];
    currentPath?: string;
  };

  const selectedLanguage: SupportedLanguage = language === "ur" ? "ur" : "en";
  const sanitized = sanitizeMessages(messages || []);

  if (sanitized.length === 0) {
    return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
  }

  const latestUserMessage = sanitized[sanitized.length - 1].content;

  const assistantContext: AssistantRequestContext = {
    language: selectedLanguage,
    activeResult: context && typeof context === "object" && "testType" in context ? context : null,
  };

  // 3. Check for Groq API Key
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey || groqApiKey.trim().length === 0 || groqApiKey.includes("your_groq_api_key_here")) {
    // Graceful intelligent fallback mode when key is unconfigured
    const fallbackResponse = generateLocalFallbackResponse(
      latestUserMessage,
      assistantContext
    );

    return NextResponse.json({
      role: "assistant",
      content: fallbackResponse,
      configured: false,
      notice: "Running in local guide mode. Add GROQ_API_KEY to .env.local to activate live Groq models.",
    });
  }

  // 4. Submit to official Groq Chat Completions API
  const systemPrompt = buildSystemPrompt(assistantContext);

  // Model cascade: try user-configured model first, then known active models on Groq
  const candidateModels = [
    process.env.GROQ_MODEL,
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
  ].filter((m): m is string => Boolean(m && m.trim().length > 0));

  let lastErrorStatus: number | null = null;
  let successfulReply: string | null = null;
  let modelUsed: string | null = null;

  for (const model of candidateModels) {
    try {
      const groqPayload = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitized,
        ],
        temperature: 0.5,
        max_tokens: 650,
        top_p: 0.9,
      };

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify(groqPayload),
        signal: AbortSignal.timeout(18000), // 18-second timeout
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) {
          successfulReply = content;
          modelUsed = model;
          break;
        }
      } else {
        lastErrorStatus = groqResponse.status;
        // If rate-limited on Groq API, return 429
        if (groqResponse.status === 429) {
          return NextResponse.json(
            {
              error:
                selectedLanguage === "ur"
                  ? "AI اسسٹنٹ اس وقت مصروف ہے۔ براہ کرم چند سیکنڈ بعد دوبارہ کوشش کریں۔"
                  : "The Groq AI service is currently experiencing high load. Please try again in a moment.",
            },
            { status: 429 }
          );
        }
        // If 404/400 (model not found), loop will try the next candidate model
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "TimeoutError") {
        break; // Timeout reached, fall back
      }
    }
  }

  if (successfulReply && modelUsed) {
    return NextResponse.json({
      role: "assistant",
      content: successfulReply,
      configured: true,
      model: modelUsed,
    });
  }

  // Graceful fallback if all remote models failed or timed out
  const fallbackResponse = generateLocalFallbackResponse(
    latestUserMessage,
    assistantContext
  );

  return NextResponse.json({
    role: "assistant",
    content: fallbackResponse,
    configured: true,
    fallback: true,
    notice:
      lastErrorStatus === 401
        ? "Invalid Groq API key provided."
        : "Live AI temporarily unavailable. Providing local guidance.",
  });
}
