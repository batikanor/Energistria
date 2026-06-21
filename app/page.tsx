"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeEuro,
  Brain,
  CalendarClock,
  CircleHelp,
  ExternalLink,
  Grid2X2,
  Home,
  Mail,
  MapPinned,
  PackageOpen,
  Play,
  Radar,
  Satellite,
  Sparkles,
  Zap
} from "lucide-react";
import { fallbackWaybackReleases, profiles, type CustomerProfile } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";
import type { FrameAnalysis, ImageAnnotation, VisionBrief } from "@/lib/vision";

type WaybackRelease = {
  releaseNum: number;
  releaseDateLabel: string;
  itemTitle: string;
};

type ViewMode = "compare" | "animate";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(profiles[0].id);
  const [timeline, setTimeline] = useState<WaybackRelease[]>(fallbackWaybackReleases);
  const [timelineSource, setTimelineSource] = useState("fallback");
  const [frameIndex, setFrameIndex] = useState(0);
  const [brief, setBrief] = useState<VisionBrief | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compare");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "queued" | "error">("idle");

  const selected = profiles.find((profile) => profile.id === selectedId) ?? profiles[0];
  const activeRelease = timeline[frameIndex % timeline.length] ?? fallbackWaybackReleases[0];
  const loadingBrief = brief === null;
  const visibleReleases = useMemo(() => timeline.slice(0, 4), [timeline]);
  const hasExactArchiveFrames = timelineSource.startsWith("esri-local-changes");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      lat: String(selected.coordinates.latitude),
      lon: String(selected.coordinates.longitude),
      zoom: "16"
    });

    fetch(`/api/wayback?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { items?: WaybackRelease[]; source?: string }) => {
        if (data.items?.length) {
          setTimeline(data.items);
          setTimelineSource(data.source ?? "esri");
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [selected]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % Math.max(timeline.length, 1));
    }, 720);

    return () => window.clearInterval(interval);
  }, [timeline.length]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/vision-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: selected.id, releases: visibleReleases }),
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((data: VisionBrief) => setBrief(data))
      .catch(() => undefined);

    return () => controller.abort();
  }, [selected, visibleReleases]);

  function chooseProfile(profileId: string) {
    setSelectedId(profileId);
    setFrameIndex(0);
    setTimeline(fallbackWaybackReleases);
    setTimelineSource("fallback");
    setBrief(null);
    setEmailStatus("idle");
  }

  async function sendEmail() {
    setEmailStatus("sending");
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: selected.id, brief })
      });
      const data = (await response.json()) as { status?: string };
      setEmailStatus(response.ok ? (data.status === "sent" ? "sent" : "queued") : "error");
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <main className="shell">
      <section className="workspace">
        <aside className="leadRail">
          <div className="brand">
            <div className="brandMark">
              <Zap size={21} />
            </div>
            <div>
              <strong>Energistria</strong>
            </div>
          </div>

          <div className="railLabel">Sample customers</div>
          <div className="profileStack">
            {profiles.map((profile) => (
              <button
                className={`profileCard ${profile.id === selected.id ? "active" : ""}`}
                key={profile.id}
                onClick={() => chooseProfile(profile.id)}
                type="button"
              >
                <span className="profileName">{profile.name}</span>
                <span>{profile.title}</span>
                <span className="profileAddress">
                  <MapPinned size={14} />
                  {profile.address}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="mainColumn">
          <header className="topBar">
            <div className="identityBar">
              <strong>{selected.name}</strong>
              <span>{selected.address}</span>
            </div>
            <div className="viewControls" aria-label="Imagery view">
              <button
                className={viewMode === "compare" ? "active" : ""}
                onClick={() => setViewMode("compare")}
                title="Four archive frames side by side"
                type="button"
              >
                <Grid2X2 size={17} />
              </button>
              <button
                className={viewMode === "animate" ? "active" : ""}
                onClick={() => setViewMode("animate")}
                title="Fast archive animation"
                type="button"
              >
                <Play size={17} />
              </button>
            </div>
            <a className="sourceLink" href="https://livingatlas.arcgis.com/wayback/" target="_blank">
              Satellite archive
              <ExternalLink size={15} />
            </a>
          </header>

          <section className="heroGrid">
            <WaybackViewer
              activeRelease={activeRelease}
              frames={brief?.frames ?? []}
              mode={viewMode}
              profile={selected}
              releases={visibleReleases}
              source={timelineSource}
            />

            <div className="dealPanel">
              <div className="panelHeader">
                <div>
                  <h2>{selected.name}</h2>
                </div>
                <span className="statusPill">{selected.status}</span>
              </div>

              <div className="leadFacts">
                <span>
                  <Home size={16} />
                  {selected.address}
                </span>
                <a href={selected.linkedin} target="_blank">
                  LinkedIn profile
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="quoteGrid">
                <Metric
                  detail="Derived from the sample installer quote: estimated self-consumption, current bill assumption, and financing schedule."
                  icon={<BadgeEuro size={18} />}
                  label="Monthly saving"
                  value={`€${selected.quote.monthlySaving}`}
                />
                <Metric
                  detail="Sample quote input from the installer. Satellite imagery is used to sanity-check the roof story, not to certify engineering yield."
                  icon={<Satellite size={18} />}
                  label="PV system"
                  value={`${selected.quote.systemKw} kW`}
                />
                <Metric
                  detail="Sample package configuration used for the follow-up strategy and battery/backup story."
                  icon={<Zap size={18} />}
                  label="Battery"
                  value={`${selected.quote.batteryKwh} kWh`}
                />
                <Metric
                  detail="Derived estimate from system cost, savings, and financing assumptions in the sample quote."
                  icon={<CalendarClock size={18} />}
                  label="Payback"
                  value={`${selected.quote.paybackYears} yrs`}
                />
              </div>
              <div className="quoteSource">
                Quote inputs + estimate
                <InfoTip text="Story: the installer already has a quote or CRM estimate. The satellite archive explains why this customer should believe and act on that quote." />
              </div>

              <div className="signalStack">
                {selected.signals.map((signal) => (
                  <div className={`signal ${signal.tone}`} key={signal.label}>
                    <span>{signal.label}</span>
                    <strong>{signal.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="timelineStrip" aria-label="Satellite archive timeline">
            <div className="timelineHead">
              <Satellite size={16} />
              <strong>Archive</strong>
              <span>{hasExactArchiveFrames ? "Changed satellite frames" : "Prepared archive frames"}</span>
            </div>
            <div className="timelineButtons">
              {timeline.map((release, index) => (
                <button
                  className={index === frameIndex ? "active" : ""}
                  key={`${release.releaseNum}-${release.releaseDateLabel}`}
                  onClick={() => setFrameIndex(index)}
                  type="button"
                >
                  {release.releaseDateLabel}
                </button>
              ))}
            </div>
          </section>

          <section className="bottomGrid">
            <div className="visionPanel">
              <div className="panelHeader">
                <div>
                  <h2>{loadingBrief ? "Reading frames..." : brief?.headline}</h2>
                </div>
                <span className="confidence">
                  <Brain size={16} />
                  {brief?.confidence ?? "--"}%
                </span>
              </div>

              <div className="findingList">
                {(brief?.visualFindings ?? []).map((finding) => (
                  <div className="finding" key={finding}>
                    <Radar size={16} />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>

              <div className="argumentBox">
                <Sparkles size={17} />
                <p>{brief?.argument}</p>
                <InfoTip text="Verbal line: this is where we explain why the same imagery can create social proof, ROI pressure, or first-mover status depending on what the visual model sees." />
              </div>

              <div className="cautionBox">
                <strong>Constraint</strong>
                <span>{brief?.caution}</span>
              </div>
            </div>

            <div className="outreachPanel">
              <div>
                <h2>Generated follow-up</h2>
              </div>

              <ActionRow label="Email subject" value={selected.outreach.subject} />
              <ActionRow label="Opening line" value={selected.outreach.opener} />
              <ActionRow label="Call coaching" value={selected.outreach.callLine} />
              <ActionRow label="CTA" value={brief?.nextMove ?? selected.outreach.cta} />

              <a className="primaryAction" href={`/customer/${selected.id}`} target="_blank">
                Final customer page
                <ArrowRight size={18} />
              </a>
              <a className="secondaryAction" href={`/envelope/${selected.id}`} target="_blank">
                Generate customer envelope
                <PackageOpen size={18} />
              </a>
              <button className="secondaryAction" disabled={emailStatus === "sending"} onClick={sendEmail} type="button">
                {emailStatus === "sending"
                  ? "Sending..."
                  : emailStatus === "sent"
                    ? "Email sent"
                    : emailStatus === "queued"
                      ? "Email queued"
                    : emailStatus === "error"
                      ? "Email failed"
                      : "Email"}
                <Mail size={18} />
              </button>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function WaybackViewer({
  activeRelease,
  frames,
  mode,
  profile,
  releases,
  source
}: {
  activeRelease: WaybackRelease;
  frames: FrameAnalysis[];
  mode: ViewMode;
  profile: CustomerProfile;
  releases: WaybackRelease[];
  source: string;
}) {
  const displayed = mode === "compare" ? releases : [activeRelease];
  const sourceLabel = source.startsWith("esri-local-changes") ? "Exact changes" : "Curated";

  return (
    <div className={`mapPanel ${mode}`}>
      <div className="mapChrome">
        <span>
          <Satellite size={16} />
          {mode === "compare" ? "4 frames" : `Frame ${activeRelease.releaseDateLabel}`}
        </span>
        <span>{sourceLabel}</span>
      </div>
      {mode === "compare" ? (
        <div className="compareGrid">
          {displayed.map((release) => (
            <div className="frameCard" key={release.releaseNum}>
              <TileMosaic
                annotations={findFrame(frames, release.releaseNum)?.annotations ?? profile.fallbackAnnotations}
                compact
                profile={profile}
                release={release}
              />
              <div className="frameMeta">
                <strong>{release.releaseDateLabel}</strong>
                <span>{findFrame(frames, release.releaseNum)?.summary ?? release.itemTitle}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TileMosaic
          annotations={
            findFrame(frames, activeRelease.releaseNum)?.annotations ?? profile.fallbackAnnotations
          }
          profile={profile}
          release={activeRelease}
        />
      )}
      <div className="mapCaption">
        <strong>{profile.address}</strong>
        <span>
          {profile.coordinates.latitude.toFixed(4)}, {profile.coordinates.longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

function TileMosaic({
  annotations,
  compact = false,
  profile,
  release
}: {
  annotations: ImageAnnotation[];
  compact?: boolean;
  profile: CustomerProfile;
  release: WaybackRelease;
}) {
  const tileGrid = useMemo(() => getTileGrid(profile, release), [profile, release]);

  return (
    <div className={`tileStage ${compact ? "compact" : ""}`}>
      {tileGrid.map((tile) => (
        <img
          alt=""
          className="waybackTile"
          key={tile.key}
          src={tile.url}
          style={{
            gridColumn: tile.col + 1,
            gridRow: tile.row + 1
          }}
        />
      ))}
      <AnnotationOverlay annotations={annotations} />
      <div className="targetRing" />
    </div>
  );
}

function AnnotationOverlay({ annotations }: { annotations: ImageAnnotation[] }) {
  return (
    <div className="annotationLayer">
      {annotations.map((annotation) => {
        const left = ((1 + annotation.x) / 3) * 100;
        const top = ((1 + annotation.y) / 3) * 100;
        const width = (annotation.width / 3) * 100;
        const height = (annotation.height / 3) * 100;

        return (
          <span
            className={`annotationBox ${annotation.tone}`}
            key={`${annotation.label}-${left}-${top}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`
            }}
          >
            <em>{annotation.label}</em>
          </span>
        );
      })}
    </div>
  );
}

function getTileGrid(profile: CustomerProfile, release: WaybackRelease) {
  const center = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
  const tiles = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      const tile = { x: center.x + colOffset, y: center.y + rowOffset, z: center.z };
      tiles.push({
        key: `${release.releaseNum}-${tile.x}-${tile.y}-${tile.z}`,
        url: waybackTileUrl(release.releaseNum, tile),
        col: colOffset + 1,
        row: rowOffset + 1
      });
    }
  }
  return tiles;
}

function findFrame(frames: FrameAnalysis[], releaseNum: number) {
  return frames.find((frame) => frame.releaseNum === releaseNum);
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="infoTip" tabIndex={0}>
      <CircleHelp size={16} aria-hidden="true" />
      <span className="tipBubble">{text}</span>
    </span>
  );
}

function Metric({
  detail,
  icon,
  label,
  value
}: {
  detail: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric" title={detail}>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ActionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="actionRow">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
