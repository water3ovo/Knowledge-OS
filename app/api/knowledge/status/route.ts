import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const githubWriteConfigured = Boolean(process.env.GITHUB_WRITE_TOKEN);
  const editorSecretConfigured = Boolean(process.env.KNOWLEDGE_EDITOR_SECRET);

  return NextResponse.json(
    {
      ok: githubWriteConfigured && editorSecretConfigured,
      githubWriteConfigured,
      editorSecretConfigured,
      environment: process.env.VERCEL_ENV ?? "unknown",
    },
    {
      status: githubWriteConfigured && editorSecretConfigured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
