import { NextRequest, NextResponse } from "next/server";
import { fallbackWaybackReleases } from "@/lib/profiles";

type WaybackItem = {
  releaseNum: number;
  releaseDateLabel: string;
  releaseDatetime?: number;
  itemTitle: string;
};

const MIN_FRAME_SPACING_MS = 60 * 24 * 60 * 60 * 1000;

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
      { onlyUseSizeToFilterDuplicates: false }
    )) as WaybackItem[];

    const usefulItems = items
      .filter(isUsableSatelliteFrame)
      .sort((a, b) => getReleaseTime(a) - getReleaseTime(b));

    const selected = pickTimeline(usefulItems);
    return NextResponse.json({
      items: selected.length >= 2 ? selected : fallbackWaybackReleases,
      source: selected.length >= 2 ? "esri-local-changes-exact" : "fallback",
      constraints: {
        chronological: true,
        minimumFrameSpacingDays: 60,
        minimumPixelDifference: 1,
        exactImageDataDeduplication: true,
        localChangeSource: "ArcGIS Wayback tilemap releases"
      }
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
  const spacedItems: WaybackItem[] = [];

  for (const item of items) {
    const previousKept = spacedItems[spacedItems.length - 1];
    if (!previousKept || getReleaseTime(item) - getReleaseTime(previousKept) >= MIN_FRAME_SPACING_MS) {
      spacedItems.push(item);
    }
  }

  if (spacedItems.length <= 4) {
    return spacedItems;
  }

  const first = spacedItems[0];
  const last = spacedItems[spacedItems.length - 1];
  const middleA = spacedItems[Math.floor(spacedItems.length * 0.38)];
  const middleB = spacedItems[Math.floor(spacedItems.length * 0.7)];
  return [first, middleA, middleB, last].filter(Boolean);
}

function isUsableSatelliteFrame(item: WaybackItem) {
  return (
    Boolean(item.releaseNum) &&
    Boolean(item.releaseDateLabel) &&
    Number.isFinite(getReleaseTime(item)) &&
    item.itemTitle.toLowerCase().includes("world imagery")
  );
}

function getReleaseTime(item: WaybackItem) {
  return item.releaseDatetime ?? Date.parse(`${item.releaseDateLabel}T00:00:00.000Z`);
}
