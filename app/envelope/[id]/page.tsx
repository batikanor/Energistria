/* eslint-disable @next/next/no-img-element */

import { BadgeEuro, BatteryCharging, CalendarClock, PanelsTopLeft } from "lucide-react";
import { fallbackWaybackReleases, getProfile, installerName } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";
import { PrintButton } from "./PrintButton";

export default async function EnvelopePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = getProfile(id);
  const release = fallbackWaybackReleases[fallbackWaybackReleases.length - 1];
  const center = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
  const tileUrl = waybackTileUrl(release.releaseNum, center);

  return (
    <main className="envelopePage">
      <PrintButton />
      <section className="envelopeScene">
        <div className="envelope">
          <span>{installerName}</span>
          <strong>{profile.name}</strong>
          <em>{profile.address}</em>
        </div>
        <article className="paper paperOne">
          <h1>{profile.name}</h1>
          <p>{profile.visualEvidence.bestArgument}</p>
          <img alt="" src={tileUrl} />
        </article>
        <article className="paper paperTwo">
          <h2>Quote</h2>
          <div className="paperMetrics">
            <Metric icon={<BadgeEuro />} label="Monthly saving" value={`€${profile.quote.monthlySaving}`} />
            <Metric icon={<PanelsTopLeft />} label="PV system" value={`${profile.quote.systemKw} kW`} />
            <Metric icon={<BatteryCharging />} label="Battery" value={`${profile.quote.batteryKwh} kWh`} />
            <Metric icon={<CalendarClock />} label="Payback" value={`${profile.quote.paybackYears} yrs`} />
          </div>
        </article>
        <article className="paper paperThree">
          <h2>Recommended follow-up</h2>
          <p>{profile.outreach.opener}</p>
          <p>{profile.outreach.callLine}</p>
          <strong>{profile.outreach.cta}</strong>
        </article>
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
