import { NextRequest, NextResponse } from "next/server";

// Vercel serverless: 4.5MB request body limit, 50MB on Pro
// Free tier safe limit: ~4MB per entry, max 50 entries in memory (~200MB total)
const MAX_TEXT_SIZE = 500000; // 500K characters (~500KB)
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel free tier limit)
const MAX_ENTRIES = 50;
const TTL = 10 * 60 * 1000; // 10 minutes

interface ClipEntry {
  type: "text" | "file";
  text?: string;
  fileName?: string;
  fileType?: string;
  fileData?: string; // base64
  fileSize?: number;
  expires: number;
}

const store = new Map<string, ClipEntry>();

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function cleanup() {
  const now = Date.now();
  for (const [key, val] of store) {
    if (val.expires < now) store.delete(key);
  }
  // If still too many entries, remove oldest
  if (store.size > MAX_ENTRIES) {
    const sorted = [...store.entries()].sort((a, b) => a[1].expires - b[1].expires);
    for (let i = 0; i < sorted.length - MAX_ENTRIES; i++) {
      store.delete(sorted[i][0]);
    }
  }
}

function getUniqueCode(): string {
  let code = generateCode();
  let attempts = 0;
  while (store.has(code) && attempts < 100) {
    code = generateCode();
    attempts++;
  }
  return code;
}

export async function POST(request: NextRequest) {
  cleanup();

  const body = await request.json();
  const { type, text, fileName, fileType, fileData } = body;

  if (type === "file") {
    // File sharing
    if (!fileData || !fileName) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check base64 size (~4/3 of original)
    const estimatedSize = Math.ceil(fileData.length * 0.75);
    if (estimatedSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB` },
        { status: 400 }
      );
    }

    const code = getUniqueCode();
    store.set(code, {
      type: "file",
      fileName,
      fileType: fileType || "application/octet-stream",
      fileData,
      fileSize: estimatedSize,
      expires: Date.now() + TTL,
    });

    return NextResponse.json({
      code,
      expiresIn: "10 minutes",
      fileName,
      fileSize: estimatedSize,
    });
  } else {
    // Text sharing
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > MAX_TEXT_SIZE) {
      return NextResponse.json(
        { error: `Text too long. Max: ${(MAX_TEXT_SIZE).toLocaleString()} characters` },
        { status: 400 }
      );
    }

    const code = getUniqueCode();
    store.set(code, {
      type: "text",
      text: text.trim(),
      expires: Date.now() + TTL,
    });

    return NextResponse.json({
      code,
      expiresIn: "10 minutes",
      charCount: text.trim().length,
    });
  }
}

export async function GET(request: NextRequest) {
  cleanup();

  const code = request.nextUrl.searchParams.get("code");

  if (!code || code.length !== 4) {
    return NextResponse.json({ error: "Invalid code. Enter a 4-digit code." }, { status: 400 });
  }

  const entry = store.get(code);

  if (!entry) {
    return NextResponse.json(
      { error: "Code not found or expired. Codes expire after 10 minutes." },
      { status: 404 }
    );
  }

  if (entry.type === "file") {
    return NextResponse.json({
      type: "file",
      fileName: entry.fileName,
      fileType: entry.fileType,
      fileData: entry.fileData,
      fileSize: entry.fileSize,
    });
  }

  return NextResponse.json({
    type: "text",
    text: entry.text,
  });
}
