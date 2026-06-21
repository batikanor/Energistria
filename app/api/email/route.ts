import { NextRequest, NextResponse } from "next/server";
import { getProfile, installerName } from "@/lib/profiles";
import type { VisionBrief } from "@/lib/vision";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    profileId?: string;
    brief?: VisionBrief;
  } | null;
  const profile = getProfile(body?.profileId ?? "");
  const subject = profile.outreach.subject;
  const text = buildEmailText(profile, body?.brief);

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({
      status: "queued-demo",
      to: profile.email,
      subject,
      text
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? `${installerName} <demo@energistria.vercel.app>`,
      to: profile.email,
      subject,
      text
    })
  });

  if (!response.ok) {
    return NextResponse.json({ status: "failed" }, { status: 502 });
  }

  return NextResponse.json({ status: "sent", to: profile.email });
}

function buildEmailText(profile: ReturnType<typeof getProfile>, brief?: VisionBrief) {
  return [
    `Hi ${profile.name.split(" ")[0]},`,
    "",
    profile.outreach.opener,
    "",
    brief?.argument ?? profile.visualEvidence.bestArgument,
    "",
    `Prepared by ${installerName}.`,
    `Final page: https://energistria.vercel.app/customer/${profile.id}`,
    `Printable envelope: https://energistria.vercel.app/envelope/${profile.id}`
  ].join("\n");
}
