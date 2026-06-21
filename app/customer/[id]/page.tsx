/* eslint-disable @next/next/no-img-element */

import {
  ArrowLeft,
  BadgeEuro,
  BatteryCharging,
  CalendarClock,
  CheckCircle2,
  Mail,
  PanelsTopLeft,
  ShieldCheck,
  SunMedium
} from "lucide-react";
import Link from "next/link";
import { fallbackWaybackReleases, getProfile, installerName } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = getProfile(id);
  const center = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
  const frames = fallbackWaybackReleases.map((release) => ({
    ...release,
    tileUrl: waybackTileUrl(release.releaseNum, center)
  }));
  const latestFrame = frames[frames.length - 1];
  const frameNotes = [
    profile.visualEvidence.oldFrame,
    profile.visualEvidence.oldFrame,
    profile.visualEvidence.neighborhoodShift,
    profile.visualEvidence.newFrame
  ];

  return (
    <main className="customerPage">
      <Link className="backLink" href="/">
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      <section className="customerHero">
        <div>
          <p>{installerName}</p>
          <h1>{profile.name}</h1>
          <span>{profile.address}</span>
        </div>
        <div className="customerHeroActions">
          <a className="printButton" href={`/envelope/${profile.id}`}>
            Printable envelope
          </a>
          <a className="customerCta compact" href={`mailto:${profile.email}?subject=${encodeURIComponent(profile.outreach.subject)}`}>
            <Mail size={18} />
            Send final email
          </a>
        </div>
      </section>

      <section className="customerFeature">
        <div className="customerFeatureImage">
          <img alt="" src={latestFrame.tileUrl} />
          <span>{latestFrame.releaseDateLabel}</span>
        </div>
        <div className="customerFeatureCopy">
          <span>{profile.archetype}</span>
          <h2>{profile.visualEvidence.bestArgument}</h2>
          <p>{profile.visualEvidence.neighborhoodShift}</p>
          <div className="customerMetrics">
            <Metric icon={<BadgeEuro />} label="Monthly saving" value={`€${profile.quote.monthlySaving}`} />
            <Metric icon={<PanelsTopLeft />} label="PV system" value={`${profile.quote.systemKw} kW`} />
            <Metric icon={<BatteryCharging />} label="Battery" value={`${profile.quote.batteryKwh} kWh`} />
            <Metric icon={<CalendarClock />} label="Payback" value={`${profile.quote.paybackYears} yrs`} />
          </div>
          <div className="customerSignalGrid">
            {profile.signals.map((signal) => (
              <article className={signal.tone} key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="customerSection">
        <div className="customerSectionHead">
          <span>Address evidence</span>
          <h2>What changed around the property</h2>
        </div>
        <div className="customerFrameGrid">
          {frames.map((frame, index) => (
            <article className="customerFrame" key={frame.releaseNum}>
              <img alt="" src={frame.tileUrl} />
              <div>
                <strong>{frame.releaseDateLabel}</strong>
                <p>{frameNotes[index]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="customerSection split">
        <div className="customerSectionHead">
          <span>Proposal shape</span>
          <h2>Built around {profile.name.split(" ")[0]}&apos;s likely decision path</h2>
        </div>
        <div className="customerProposalList">
          <article>
            <span>1</span>
            <p>Lead with the imagery and the household-specific reason to act, not a generic panel brochure.</p>
          </article>
          <article>
            <span>2</span>
            <p>Use the quote as the concrete option: {profile.quote.systemKw} kW PV with {profile.quote.batteryKwh} kWh storage.</p>
          </article>
          <article>
            <span>3</span>
            <p>Close on the next small commitment: {profile.outreach.cta}</p>
          </article>
        </div>
      </section>

      <section className="customerTwoColumn">
        <article className="customerNarrative">
          <SunMedium size={22} />
          <span>Why this is not generic</span>
          <h2>{profile.visualEvidence.roofRead}</h2>
          <p>{profile.visualEvidence.bestArgument}</p>
        </article>

        <article className="customerNarrative muted">
          <ShieldCheck size={22} />
          <span>Honest caveat</span>
          <h2>What we still verify before installation</h2>
          <p>{profile.visualEvidence.risk}</p>
        </article>
      </section>

      <section className="customerSection">
        <div className="customerSectionHead">
          <span>Recommended close</span>
          <h2>How we should talk to {profile.name.split(" ")[0]}</h2>
        </div>
        <div className="customerPlan">
          <Step label="Opening" value={profile.outreach.opener} />
          <Step label="Call coaching" value={profile.outreach.callLine} />
          <Step label="Next action" value={profile.outreach.cta} />
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Step({ label, value }: { label: string; value: string }) {
  return (
    <article>
      <CheckCircle2 size={18} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
