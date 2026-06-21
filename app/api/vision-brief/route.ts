import { NextRequest, NextResponse } from "next/server";
import { profiles } from "@/lib/profiles";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { profileId?: string } | null;
  const profile = profiles.find((item) => item.id === body?.profileId) ?? profiles[0];

  const brief = {
    headline:
      profile.id === "hartmann"
        ? "Be the first tasteful solar home on the block"
        : profile.id === "vogt"
          ? "Convert an idle roof into a priced energy asset"
          : "Join the neighborhood shift without adding household risk",
    confidence: profile.id === "vogt" ? 86 : profile.id === "hartmann" ? 79 : 83,
    visualFindings: [
      profile.visualEvidence.oldFrame,
      profile.visualEvidence.newFrame,
      profile.visualEvidence.neighborhoodShift,
      profile.visualEvidence.roofRead
    ],
    argument: profile.visualEvidence.bestArgument,
    caution: profile.visualEvidence.risk,
    nextMove: profile.outreach.cta,
    generatedBy: "Vision brief fallback. Swap this route for a multimodal LLM call when an API key is available."
  };

  return NextResponse.json(brief);
}
