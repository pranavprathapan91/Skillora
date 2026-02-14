import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env.local." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { text, context } = body as { text: string; context?: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' in body." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional resume and cover letter editor. Improve the given text for clarity, impact, and professionalism. Keep the same length roughly. Do not add placeholders or extra sections. Output only the improved text, no preamble.${context ? ` Context: ${context}` : ""}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      max_tokens: 1500,
    });

    const improved = completion.choices[0]?.message?.content?.trim();
    if (!improved) {
      return NextResponse.json(
        { error: "No response from AI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text: improved });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed." },
      { status: 500 }
    );
  }
}
