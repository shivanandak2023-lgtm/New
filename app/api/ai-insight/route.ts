import { NextRequest, NextResponse } from "next/server";
import { getAIInsight } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { toolName, summary, question } = await request.json();

    if (!toolName || !summary) {
      return NextResponse.json(
        { error: "Missing toolName or summary" },
        { status: 400 }
      );
    }

    const insight = await getAIInsight(toolName, summary, question);

    return NextResponse.json(
      { insight },
      { headers: { "Cache-Control": "private, max-age=300" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}
