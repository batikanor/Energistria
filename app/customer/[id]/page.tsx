/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, BadgeEuro, BatteryCharging, CalendarClock, Mail, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { fallbackWaybackReleases, getProfile, installerName } from "@/lib/profiles";
import { lonLatToTile, waybackTileUrl } from "@/lib/tiles";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = getProfile(id);
  const release = fallbackWaybackReleases[fallbackWaybackReleases.length - 1];
  const center = lonLatToTile(profile.coordinates.longitude, profile.coordinates.latitude, 16);
  const tileUrl = waybackTileUrl(release.releaseNum, center);

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
        <a className="printButton" href={`/envelope/${profile.id}`}>
          Printable envelope
        </a>
      </section>

      <section className="customerGrid">
        <div className="customerImage">
          <img alt="" src={tileUrl} />
          <span>{release.releaseDateLabel}</span>
        </div>
        <div className="customerOffer">
          <h2>{profile.visualEvidence.bestArgument}</h2>
          <div className="customerMetrics">
            <Metric icon={<BadgeEuro />} label="Monthly saving" value={`€${profile.quote.monthlySaving}`} />
            <Metric icon={<PanelsTopLeft />} label="PV system" value={`${profile.quote.systemKw} kW`} />
            <Metric icon={<BatteryCharging />} label="Battery" value={`${profile.quote.batteryKwh} kWh`} />
            <Metric icon={<CalendarClock />} label="Payback" value={`${profile.quote.paybackYears} yrs`} />
          </div>
          <a className="customerCta" href={`mailto:${profile.email}?subject=${encodeURIComponent(profile.outreach.subject)}`}>
            <Mail size={18} />
            Send final email
          </a>
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
