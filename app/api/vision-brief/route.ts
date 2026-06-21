import { NextRequest, NextResponse } from "next/server";
import { profiles } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";
import type { FrameAnalysis, ImageAnnotation, VisionBrief } from "@/lib/vision";

type ReleaseInput = {
  releaseNum: number;
  releaseDateLabel?: string;
  itemTitle?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    profileId?: string;
    releases?: ReleaseInput[];
  } | null;
  const profile = profiles.find((item) => item.id === body?.profileId) ?? profiles[0];
  const releases = (body?.releases?.length ? body.releases : []).slice(0, 4);
  const fallback = buildFallbackBrief(profile, releases);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || releases.length === 0) {
    return NextResponse.json(fallback);
  }

  const tile = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
  const frames = releases.map((release, index) => ({
    ...release,
    index: index + 1,
    imageUrl: waybackTileUrl(release.releaseNum, tile)
  }));

  try {
    const prompt = [
      `Customer: ${profile.name}`,
      `Address: ${profile.address}`,
      `Archetype: ${profile.archetype}`,
      "Inspect the aerial imagery frames. Return strict JSON only.",
      "Find visual evidence useful for a solar installer follow-up: existing solar-panel-like rectangles nearby, target roof planes, shading risk, neighborhood adoption, or first-mover opportunity.",
      "For each frame, return annotations in normalized coordinates within that single square image: x, y, width, height from 0 to 1.",
      "Use labels of 2 to 5 words. Use tone green for strong pro-solar evidence, blue for context, amber for risk/uncertainty, red for missing adoption or blocker.",
      "Schema: {\"headline\":\"string\",\"confidence\":0-100,\"visualFindings\":[\"string\"],\"argument\":\"string\",\"caution\":\"string\",\"nextMove\":\"string\",\"frames\":[{\"releaseNum\":number,\"summary\":\"string\",\"annotations\":[{\"x\":number,\"y\":number,\"width\":number,\"height\":number,\"label\":\"string\",\"tone\":\"green|amber|blue|red\"}]}]}"
    ].join("\n");

    const content = [
      { type: "text", text: prompt },
      ...frames.flatMap((frame) => [
        {
          type: "text",
          text: `Frame ${frame.index}: releaseNum=${frame.releaseNum}, date=${frame.releaseDateLabel ?? "unknown"}`
        },
        {
          type: "image_url",
          image_url: {
            url: frame.imageUrl
          }
        }
      ])
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://energistria.vercel.app",
        "X-Title": "Energistria"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a visual analyst for residential solar sales. Return concise, grounded JSON. Do not invent private personal facts."
          },
          {
            role: "user",
            content
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1400
      })
    });

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const parsed = parseJson(data.choices?.[0]?.message?.content ?? "");
    return NextResponse.json(normalizeBrief(parsed, fallback, releases));
  } catch {
    return NextResponse.json(fallback);
  }
}

function buildFallbackBrief(
  profile: (typeof profiles)[number],
  releases: ReleaseInput[]
): VisionBrief {
  const selectedReleases = releases.length ? releases : [{ releaseNum: 0, releaseDateLabel: "current" }];

  return {
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
    frames: selectedReleases.map((release, index) => ({
      releaseNum: release.releaseNum,
      summary:
        index === selectedReleases.length - 1
          ? profile.visualEvidence.newFrame
          : profile.visualEvidence.oldFrame,
      annotations: profile.fallbackAnnotations
    })),
    generatedBy: "fallback"
  };
}

function parseJson(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(cleaned) as Partial<VisionBrief>;
}

function normalizeBrief(
  parsed: Partial<VisionBrief>,
  fallback: VisionBrief,
  releases: ReleaseInput[]
): VisionBrief {
  return {
    headline: typeof parsed.headline === "string" ? parsed.headline : fallback.headline,
    confidence:
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.confidence)))
        : fallback.confidence,
    visualFindings: normalizeStrings(parsed.visualFindings, fallback.visualFindings).slice(0, 5),
    argument: typeof parsed.argument === "string" ? parsed.argument : fallback.argument,
    caution: typeof parsed.caution === "string" ? parsed.caution : fallback.caution,
    nextMove: typeof parsed.nextMove === "string" ? parsed.nextMove : fallback.nextMove,
    frames: releases.map((release) => {
      const frame = parsed.frames?.find((item) => item.releaseNum === release.releaseNum);
      const fallbackFrame =
        fallback.frames.find((item) => item.releaseNum === release.releaseNum) ?? fallback.frames[0];

      return {
        releaseNum: release.releaseNum,
        summary: typeof frame?.summary === "string" ? frame.summary : fallbackFrame.summary,
        annotations: normalizeAnnotations(frame?.annotations, fallbackFrame.annotations)
      };
    }),
    generatedBy: "openrouter"
  };
}

function normalizeStrings(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const strings = value.filter((item): item is string => typeof item === "string" && item.length > 0);
  return strings.length ? strings : fallback;
}

function normalizeAnnotations(value: unknown, fallback: ImageAnnotation[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const annotations = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const annotation = item as Partial<ImageAnnotation>;
      if (
        typeof annotation.x !== "number" ||
        typeof annotation.y !== "number" ||
        typeof annotation.width !== "number" ||
        typeof annotation.height !== "number" ||
        typeof annotation.label !== "string"
      ) {
        return null;
      }

      return {
        x: clamp(annotation.x),
        y: clamp(annotation.y),
        width: clamp(annotation.width, 0.05, 0.6),
        height: clamp(annotation.height, 0.05, 0.6),
        label: annotation.label.slice(0, 36),
        tone: isTone(annotation.tone) ? annotation.tone : "blue"
      };
    })
    .filter((item): item is ImageAnnotation => Boolean(item));

  return annotations.length ? annotations.slice(0, 5) : fallback;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function isTone(value: unknown): value is ImageAnnotation["tone"] {
  return value === "green" || value === "amber" || value === "blue" || value === "red";
}
