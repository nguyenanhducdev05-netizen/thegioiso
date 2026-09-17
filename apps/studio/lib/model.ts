import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI, openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export function getModel(): LanguageModel {
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    return groq(process.env.GROQ_MODEL ?? "openai/gpt-oss-120b");
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514");
  }

  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
    return openrouter(process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4");
  }

  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.OPENAI_MODEL ?? "gpt-4o");
  }

  throw new Error(
    "Thiếu API key. Đặt GROQ_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY hoặc OPENROUTER_API_KEY trong apps/studio/.env.local",
  );
}
