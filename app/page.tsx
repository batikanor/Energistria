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
  Home,
  MapPinned,
  Play,
  Radar,
  Satellite,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { fallbackWaybackReleases, profiles, type CustomerProfile } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";

type WaybackRelease = {
  releaseNum: number;
  releaseDateLabel: string;
  itemTitle: string;
};

type VisionBrief = {
  headline: string;
  confidence: number;
  visualFindings: string[];
  argument: string;
  caution: string;
  nextMove: string;
  generatedBy: string;
};

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(profiles[0].id);
  const [timeline, setTimeline] = useState<WaybackRelease[]>(fallbackWaybackReleases);
  const [timelineSource, setTimelineSource] = useState("fallback");
  const [frameIndex, setFrameIndex] = useState(0);
  const [brief, setBrief] = useState<VisionBrief | null>(null);

  const selected = profiles.find((profile) => profile.id === selectedId) ?? profiles[0];
  const activeRelease = timeline[frameIndex % timeline.length] ?? fallbackWaybackReleases[0];
  const loadingBrief = brief === null;

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
    }, 1600);

    return () => window.clearInterval(interval);
  }, [timeline.length]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/vision-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: selected.id }),
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((data: VisionBrief) => setBrief(data))
      .catch(() => undefined);

    return () => controller.abort();
  }, [selected]);

  function chooseProfile(profileId: string) {
    setSelectedId(profileId);
    setFrameIndex(0);
    setTimeline(fallbackWaybackReleases);
    setTimelineSource("fallback");
    setBrief(null);
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
              <span>Energistria</span>
              <strong>Address to close plan</strong>
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

          <div className="commitPanel">
            <ShieldCheck size={18} />
            <div>
              <strong>Data boundary</strong>
              <span>Public addresses, fictional personas, real Wayback imagery.</span>
            </div>
          </div>
        </aside>

        <section className="mainColumn">
          <header className="topBar">
            <div>
              <p className="eyebrow">Input</p>
              <h1>Customer profile and address.</h1>
            </div>
            <div className="outputTitle">
              <p className="eyebrow">Output</p>
              <h2>Visual evidence, solar argument, next action.</h2>
            </div>
            <a className="sourceLink" href="https://livingatlas.arcgis.com/wayback/" target="_blank">
              ArcGIS Wayback
              <ExternalLink size={15} />
            </a>
          </header>

          <section className="heroGrid">
            <WaybackViewer profile={selected} release={activeRelease} source={timelineSource} />

            <div className="dealPanel">
              <div className="panelHeader">
                <div>
                  <p className="eyebrow">Input record</p>
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
                <Metric icon={<BadgeEuro size={18} />} label="Monthly saving" value={`€${selected.quote.monthlySaving}`} />
                <Metric icon={<Satellite size={18} />} label="PV system" value={`${selected.quote.systemKw} kW`} />
                <Metric icon={<Zap size={18} />} label="Battery" value={`${selected.quote.batteryKwh} kWh`} />
                <Metric icon={<CalendarClock size={18} />} label="Payback" value={`${selected.quote.paybackYears} yrs`} />
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

          <section className="timelineStrip" aria-label="Wayback release timeline">
            <div className="timelineHead">
              <Play size={16} />
              <strong>Imagery frames</strong>
              <span>{timelineSource === "esri-local-changes" ? "Local-change releases from Esri" : "Curated fallback releases"}</span>
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
                  <p className="eyebrow">Output brief</p>
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
                <p className="eyebrow">Output actions</p>
                <h2>Generated follow-up</h2>
              </div>

              <ActionRow label="Email subject" value={selected.outreach.subject} />
              <ActionRow label="Opening line" value={selected.outreach.opener} />
              <ActionRow label="Call coaching" value={selected.outreach.callLine} />
              <ActionRow label="CTA" value={brief?.nextMove ?? selected.outreach.cta} />

              <button className="primaryAction" type="button">
                Generate customer page
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function WaybackViewer({
  profile,
  release,
  source
}: {
  profile: CustomerProfile;
  release: WaybackRelease;
  source: string;
}) {
  const tileGrid = useMemo(() => {
    const center = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
    const tiles = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        const tile = { x: center.x + colOffset, y: center.y + rowOffset, z: center.z };
        tiles.push({
          key: `${tile.x}-${tile.y}-${tile.z}`,
          url: waybackTileUrl(release.releaseNum, tile),
          col: colOffset + 1,
          row: rowOffset + 1
        });
      }
    }
    return tiles;
  }, [profile, release]);

  return (
    <div className="mapPanel">
      <div className="mapChrome">
        <span>
          <Satellite size={16} />
          {release.itemTitle}
        </span>
        <span>{source}</span>
      </div>
      <div className="tileStage">
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
        <div className="targetRing" />
      </div>
      <div className="mapCaption">
        <strong>{profile.address}</strong>
        <span>
          {profile.coordinates.latitude.toFixed(4)}, {profile.coordinates.longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
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
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
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
