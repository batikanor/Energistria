import { NextRequest, NextResponse } from "next/server";
import { fallbackWaybackReleases } from "@/lib/profiles";

type WaybackItem = {
  releaseNum: number;
  releaseDateLabel: string;
  itemTitle: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lon"));
  const zoom = Number(searchParams.get("zoom") ?? 16);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ items: fallbackWaybackReleases, source: "fallback" });
  }

  try {
    const { getWaybackItemsWithLocalChanges } = await import("@esri/wayback-core");
    const items = (await getWaybackItemsWithLocalChanges(
      { latitude, longitude },
      zoom,
      { onlyUseSizeToFilterDuplicates: true }
    )) as WaybackItem[];

    const usefulItems = items
      .filter((item) => item.releaseNum && item.releaseDateLabel)
      .sort((a, b) => a.releaseNum - b.releaseNum);

    const selected = pickTimeline(usefulItems);
    return NextResponse.json({
      items: selected.length >= 2 ? selected : fallbackWaybackReleases,
      source: selected.length >= 2 ? "esri-local-changes" : "fallback"
    });
  } catch (error) {
    return NextResponse.json({
      items: fallbackWaybackReleases,
      source: "fallback",
      error: error instanceof Error ? error.message : "Wayback lookup failed"
    });
  }
}

function pickTimeline(items: WaybackItem[]) {
  if (items.length <= 4) {
    return items;
  }

  const first = items[0];
  const last = items[items.length - 1];
  const middleA = items[Math.floor(items.length * 0.38)];
  const middleB = items[Math.floor(items.length * 0.7)];
  return [first, middleA, middleB, last].filter(Boolean);
}
