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
    const {
      companyName,
      jobTitle,
      hiringManager,
      jobDescription,
      resumeSummary,
      resumeExperience,
    } = body as {
      companyName: string;
      jobTitle: string;
      hiringManager?: string;
      jobDescription?: string;
      resumeSummary?: string;
      resumeExperience?: string;
    };

    if (!companyName || !jobTitle) {
      return NextResponse.json(
        { error: "companyName and jobTitle are required." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional cover letter writer. Write a compelling, concise cover letter (3–4 short paragraphs) that:
- Addresses the company and role by name
- Highlights relevant experience without repeating the resume verbatim
- Shows enthusiasm and fit for the role
- Ends with a clear call to action
Do not use placeholders like [Your Name]. Use "I" and "my" as the candidate. Output only the cover letter body, no subject line or headers.`;

    const userContent = [
      `Company: ${companyName}`,
      `Role: ${jobTitle}`,
      hiringManager ? `Hiring manager: ${hiringManager}` : null,
      jobDescription ? `Job description:\n${jobDescription}` : null,
      resumeSummary ? `Candidate summary:\n${resumeSummary}` : null,
      resumeExperience ? `Relevant experience:\n${resumeExperience}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed." },
      { status: 500 }
    );
  }
}
