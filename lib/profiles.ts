export const installerName = "DEMO INSTALLER A.G.";

export type CustomerProfile = {
  id: string;
  name: string;
  title: string;
  linkedin: string;
  email: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  archetype: string;
  status: string;
  quote: {
    systemKw: number;
    batteryKwh: number;
    monthlySaving: number;
    paybackYears: number;
  };
  signals: {
    label: string;
    value: string;
    tone: "green" | "amber" | "blue" | "red";
  }[];
  visualEvidence: {
    oldFrame: string;
    newFrame: string;
    neighborhoodShift: string;
    roofRead: string;
    bestArgument: string;
    risk: string;
  };
  fallbackAnnotations: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    tone: "green" | "amber" | "blue" | "red";
  }[];
  outreach: {
    subject: string;
    opener: string;
    callLine: string;
    cta: string;
  };
};

export const profiles: CustomerProfile[] = [
  {
    id: "keller",
    name: "Sofia Keller",
    title: "Head of People, climate-aware family buyer",
    linkedin: "https://www.linkedin.com/in/sofia-keller-energy-demo/",
    email: "sofia.keller@example.energy",
    address: "Kollwitzstrasse 52, 10405 Berlin",
    coordinates: {
      latitude: 52.5367,
      longitude: 13.4176
    },
    archetype: "Family reassurance",
    status: "Quote sent 9 days ago",
    quote: {
      systemKw: 9.8,
      batteryKwh: 10,
      monthlySaving: 184,
      paybackYears: 8.4
    },
    signals: [
      { label: "Likely objection", value: "Will it disrupt family routines?", tone: "amber" },
      { label: "Street narrative", value: "Solar becoming normal nearby", tone: "green" },
      { label: "Best channel", value: "Founder video + WhatsApp reminder", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "2018 aerial layer shows mostly untreated roof surfaces around the block.",
      newFrame: "Recent imagery has more bright rectangular roof signatures and renovated courtyards.",
      neighborhoodShift: "Frame comparison supports a social-proof angle: the area is moving from early adopters to visible mainstream adoption.",
      roofRead: "The roof massing is regular enough for a conservative starter array without making the home look industrial.",
      bestArgument: "Your neighborhood is already quietly moving in this direction. This is the low-drama family version: predictable bills, backup storage, and a system sized so it disappears into the roofline.",
      risk: "Avoid an investor-style ROI pitch. Lead with calm, reliability, and the fact that installation does not turn the home into a construction site."
    },
    fallbackAnnotations: [
      { x: 0.45, y: 0.47, width: 0.22, height: 0.16, label: "target roof", tone: "green" },
      { x: 0.12, y: 0.18, width: 0.18, height: 0.12, label: "nearby PV-like rectangles", tone: "blue" },
      { x: 0.62, y: 0.28, width: 0.2, height: 0.13, label: "similar roof geometry", tone: "amber" }
    ],
    outreach: {
      subject: "Sofia, I checked the block around Kollwitzstrasse",
      opener: "A quick visual check suggests your part of Prenzlauer Berg is crossing the point where solar stops feeling experimental.",
      callLine: "I would frame this as a predictability upgrade, not a tech project.",
      cta: "Send a 43-second founder video with the neighborhood animation."
    }
  },
  {
    id: "vogt",
    name: "Jonas Vogt",
    title: "Angel investor, spreadsheet-first homeowner",
    linkedin: "https://www.linkedin.com/in/jonas-vogt-energy-demo/",
    email: "jonas.vogt@example.energy",
    address: "Miquelstrasse 86, 14195 Berlin",
    coordinates: {
      latitude: 52.4597,
      longitude: 13.2932
    },
    archetype: "Investor ROI",
    status: "Opened quote twice",
    quote: {
      systemKw: 13.2,
      batteryKwh: 15,
      monthlySaving: 261,
      paybackYears: 7.1
    },
    signals: [
      { label: "Likely objection", value: "Show me the downside case", tone: "red" },
      { label: "Street narrative", value: "Large roofs remain under-monetized", tone: "amber" },
      { label: "Best channel", value: "PDF model + call from senior rep", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "The older archive frame shows stable detached-house roof geometry and mature tree cover.",
      newFrame: "The newer frame keeps the same roof footprint, so the financial model is not fighting major structural uncertainty.",
      neighborhoodShift: "The visible opportunity is not herd behavior; it is unused roof yield in a high-value residential pocket.",
      roofRead: "The address is suited to a bigger system pitch, especially if battery arbitrage and EV charging are included.",
      bestArgument: "This is idle infrastructure. The roof is already there, the surface area is unusually valuable, and the decision should be evaluated like a low-volatility asset with energy-price upside.",
      risk: "Do not use emotional sustainability copy. Show sensitivity ranges, downside payback, and a clean financing comparison."
    },
    fallbackAnnotations: [
      { x: 0.34, y: 0.34, width: 0.3, height: 0.2, label: "large usable roof plane", tone: "green" },
      { x: 0.13, y: 0.56, width: 0.22, height: 0.17, label: "tree shade risk", tone: "amber" },
      { x: 0.61, y: 0.2, width: 0.19, height: 0.13, label: "comparable roof", tone: "blue" }
    ],
    outreach: {
      subject: "Your roof is behaving like an idle asset",
      opener: "I modelled the address as an asset problem rather than a green purchase.",
      callLine: "The conservative case still clears the threshold; the upside case is driven by battery and EV load.",
      cta: "Attach ROI one-pager and offer a 12-minute technical call."
    }
  },
  {
    id: "hartmann",
    name: "Mara Hartmann",
    title: "Architect, design-sensitive early adopter",
    linkedin: "https://www.linkedin.com/in/mara-hartmann-energy-demo/",
    email: "mara.hartmann@example.energy",
    address: "Muskauer Strasse 24, 10997 Berlin",
    coordinates: {
      latitude: 52.4993,
      longitude: 13.4351
    },
    archetype: "Aesthetic first-mover",
    status: "No reply after proposal",
    quote: {
      systemKw: 7.4,
      batteryKwh: 7.5,
      monthlySaving: 143,
      paybackYears: 9.2
    },
    signals: [
      { label: "Likely objection", value: "Panels will look ugly", tone: "red" },
      { label: "Street narrative", value: "Be the visible first mover", tone: "green" },
      { label: "Best channel", value: "Solarized home render", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Earlier imagery reads as dense urban roofscape with almost no obvious residential PV signatures.",
      newFrame: "The recent frame still looks under-adopted, which makes the first-mover story stronger than social proof.",
      neighborhoodShift: "There is no need to pretend everyone nearby has solar. The visual argument is leadership: make the first tasteful installation in the micro-area.",
      roofRead: "Design anxiety is the central blocker. The pitch should show low-profile black panels, not mention maximum panel count first.",
      bestArgument: "This is the rare case where being first is the point. A restrained black-on-roof system lets the customer set the visual standard for the block while still cutting the bill.",
      risk: "Do not start with savings. Start with a generated visual and give her control over panel layout."
    },
    fallbackAnnotations: [
      { x: 0.39, y: 0.39, width: 0.25, height: 0.18, label: "design-sensitive roof", tone: "green" },
      { x: 0.1, y: 0.22, width: 0.22, height: 0.15, label: "low visible PV density", tone: "red" },
      { x: 0.63, y: 0.52, width: 0.18, height: 0.12, label: "quiet installation zone", tone: "blue" }
    ],
    outreach: {
      subject: "Mara, I think the design objection is solvable",
      opener: "The aerial history makes this look less like a standard solar sale and more like a chance to set the local design precedent.",
      callLine: "I would show two layouts: invisible-from-street and maximum-yield.",
      cta: "Send animation plus a solarized 3D render with two design choices."
    }
  },
  {
    id: "schneider",
    name: "Paul Schneider",
    title: "Detached-home owner, EV-ready commuter",
    linkedin: "https://www.linkedin.com/in/paul-schneider-energy-demo/",
    email: "paul.schneider@example.energy",
    address: "Argentinische Allee 32, 14163 Berlin",
    coordinates: {
      latitude: 52.4379,
      longitude: 13.2447
    },
    archetype: "EV upsell",
    status: "Asked about charger",
    quote: {
      systemKw: 11.6,
      batteryKwh: 12.5,
      monthlySaving: 232,
      paybackYears: 7.6
    },
    signals: [
      { label: "Likely objection", value: "Will the EV load be covered?", tone: "amber" },
      { label: "Street narrative", value: "Detached roofs with clear upgrade path", tone: "green" },
      { label: "Best channel", value: "EV charging scenario", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Older imagery shows stable detached-house plots with large roof surfaces.",
      newFrame: "Recent imagery keeps roof geometry readable and shows more residential upgrades nearby.",
      neighborhoodShift: "The story is not just solar; it is the home becoming an energy station for mobility.",
      roofRead: "The roof and driveway context make PV plus EV charging an intuitive bundle.",
      bestArgument: "This is the car-to-roof case. The address can be framed around turning commute costs into locally produced electricity.",
      risk: "Do not lead with climate. Lead with car charging, predictable mobility cost, and backup."
    },
    fallbackAnnotations: [
      { x: 0.39, y: 0.4, width: 0.28, height: 0.2, label: "main roof", tone: "green" },
      { x: 0.58, y: 0.62, width: 0.18, height: 0.16, label: "driveway context", tone: "blue" },
      { x: 0.18, y: 0.27, width: 0.22, height: 0.14, label: "similar homes", tone: "amber" }
    ],
    outreach: {
      subject: "Paul, your EV case changes the solar math",
      opener: "The roof story gets stronger once the car is part of the load profile.",
      callLine: "Anchor the call around monthly mobility savings, not just household electricity.",
      cta: "Send EV charging scenario with battery-backed evening charging."
    }
  },
  {
    id: "richter",
    name: "Clara Richter",
    title: "Small apartment-building owner",
    linkedin: "https://www.linkedin.com/in/clara-richter-energy-demo/",
    email: "clara.richter@example.energy",
    address: "Rykestrasse 19, 10405 Berlin",
    coordinates: {
      latitude: 52.5349,
      longitude: 13.4211
    },
    archetype: "Landlord ROI",
    status: "Waiting for board approval",
    quote: {
      systemKw: 18.4,
      batteryKwh: 20,
      monthlySaving: 418,
      paybackYears: 6.9
    },
    signals: [
      { label: "Likely objection", value: "Tenant split and approvals", tone: "red" },
      { label: "Street narrative", value: "Dense block with visible roof precedent", tone: "green" },
      { label: "Best channel", value: "Board packet", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Earlier imagery shows a dense roofscape with many comparable flat and pitched sections.",
      newFrame: "Recent imagery makes the block-level energy transition more visible.",
      neighborhoodShift: "This is a committee-sale case: evidence should reduce perceived risk for multiple stakeholders.",
      roofRead: "The address suits a building-owner packet with roof precedent and a conservative financial case.",
      bestArgument: "This is a low-risk board decision if it is presented as neighborhood precedent plus tenant-facing cost stability.",
      risk: "Do not make it a one-person lifestyle pitch. Package it like a board memo."
    },
    fallbackAnnotations: [
      { x: 0.36, y: 0.36, width: 0.28, height: 0.18, label: "building roof", tone: "green" },
      { x: 0.61, y: 0.22, width: 0.22, height: 0.14, label: "roof precedent", tone: "blue" },
      { x: 0.17, y: 0.48, width: 0.2, height: 0.13, label: "dense block", tone: "amber" }
    ],
    outreach: {
      subject: "Clara, I made this board-ready",
      opener: "The useful frame here is not a sales email; it is a short decision packet for co-owners.",
      callLine: "Show the roof precedent first, then the conservative payback.",
      cta: "Send printable board packet and one-page tenant benefit summary."
    }
  },
  {
    id: "weber",
    name: "Nina Weber",
    title: "Heat-pump candidate, gas-price sensitive",
    linkedin: "https://www.linkedin.com/in/nina-weber-energy-demo/",
    email: "nina.weber@example.energy",
    address: "Waldemarstrasse 92, 10997 Berlin",
    coordinates: {
      latitude: 52.5011,
      longitude: 13.4245
    },
    archetype: "Heating transition",
    status: "Clicked heat-pump FAQ",
    quote: {
      systemKw: 8.6,
      batteryKwh: 10,
      monthlySaving: 205,
      paybackYears: 8.1
    },
    signals: [
      { label: "Likely objection", value: "Does solar help heating?", tone: "amber" },
      { label: "Street narrative", value: "Urban retrofit, not suburban luxury", tone: "green" },
      { label: "Best channel", value: "Winter bill explanation", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Older imagery shows dense inner-city roofs with limited obvious PV adoption.",
      newFrame: "Recent imagery keeps the case interesting because retrofit pressure is rising while visible adoption remains uneven.",
      neighborhoodShift: "This is a practical retrofit story: solar supports the broader electrification plan.",
      roofRead: "The pitch should connect PV to heat-pump operating cost instead of treating solar as a standalone product.",
      bestArgument: "The customer is not buying panels; they are buying a lower-risk path away from gas exposure.",
      risk: "Avoid overpromising winter self-sufficiency. Explain annual savings and shoulder-season benefit clearly."
    },
    fallbackAnnotations: [
      { x: 0.42, y: 0.39, width: 0.24, height: 0.17, label: "retrofit roof", tone: "green" },
      { x: 0.11, y: 0.31, width: 0.22, height: 0.15, label: "urban density", tone: "blue" },
      { x: 0.64, y: 0.24, width: 0.2, height: 0.13, label: "shade check", tone: "amber" }
    ],
    outreach: {
      subject: "Nina, this is really about gas exposure",
      opener: "The solar case becomes more convincing when it is tied to the heating plan.",
      callLine: "Talk annual risk reduction, not winter magic.",
      cta: "Send heat-pump operating cost page with PV scenario."
    }
  },
  {
    id: "braun",
    name: "Thomas Braun",
    title: "Skeptical engineer, wants proof",
    linkedin: "https://www.linkedin.com/in/thomas-braun-energy-demo/",
    email: "thomas.braun@example.energy",
    address: "Dahlemer Weg 150, 14167 Berlin",
    coordinates: {
      latitude: 52.4268,
      longitude: 13.2918
    },
    archetype: "Technical skeptic",
    status: "Asked for assumptions",
    quote: {
      systemKw: 12.4,
      batteryKwh: 15,
      monthlySaving: 247,
      paybackYears: 7.4
    },
    signals: [
      { label: "Likely objection", value: "Assumption quality", tone: "red" },
      { label: "Street narrative", value: "Large roof, measurable case", tone: "green" },
      { label: "Best channel", value: "Assumption appendix", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Archive imagery gives a stable baseline for roof and tree context.",
      newFrame: "Recent imagery keeps the roof readable enough to discuss assumptions explicitly.",
      neighborhoodShift: "This customer will respect the model only if uncertainty is visible.",
      roofRead: "The best sales artifact is an annotated assumptions page, not a glossy pitch.",
      bestArgument: "The system wins by showing what it does not know, then making the remaining case robust.",
      risk: "Do not hide uncertainty. Give ranges, caveats, and a clean path to final survey."
    },
    fallbackAnnotations: [
      { x: 0.31, y: 0.34, width: 0.3, height: 0.19, label: "roof plane", tone: "green" },
      { x: 0.56, y: 0.55, width: 0.23, height: 0.18, label: "tree line", tone: "amber" },
      { x: 0.17, y: 0.18, width: 0.19, height: 0.13, label: "survey check", tone: "blue" }
    ],
    outreach: {
      subject: "Thomas, I included the assumptions instead of hiding them",
      opener: "This version is built to be challenged: roof, shade, tariff, and sensitivity ranges are separated.",
      callLine: "Invite the objection and show the downside case.",
      cta: "Send technical appendix with conservative and upside cases."
    }
  },
  {
    id: "kruger",
    name: "Elena Kruger",
    title: "High-income homeowner, aesthetic objection",
    linkedin: "https://www.linkedin.com/in/elena-kruger-energy-demo/",
    email: "elena.kruger@example.energy",
    address: "Pacelliallee 29, 14195 Berlin",
    coordinates: {
      latitude: 52.4591,
      longitude: 13.2854
    },
    archetype: "Premium aesthetics",
    status: "Asked for visual mockup",
    quote: {
      systemKw: 10.8,
      batteryKwh: 12,
      monthlySaving: 221,
      paybackYears: 8.7
    },
    signals: [
      { label: "Likely objection", value: "Roof appearance", tone: "red" },
      { label: "Street narrative", value: "Premium homes adopting quietly", tone: "green" },
      { label: "Best channel", value: "Envelope with renders", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Older imagery shows large high-value homes with generous roof surfaces.",
      newFrame: "Recent imagery supports a premium, low-visibility installation story.",
      neighborhoodShift: "The customer needs permission to see solar as tasteful, not merely rational.",
      roofRead: "The case should prioritize design variants and print-quality imagery.",
      bestArgument: "This can be sold as a premium home upgrade if the first asset is a beautiful visual packet.",
      risk: "Do not lead with discount language. Lead with discretion, resilience, and design control."
    },
    fallbackAnnotations: [
      { x: 0.4, y: 0.35, width: 0.28, height: 0.18, label: "premium roof", tone: "green" },
      { x: 0.18, y: 0.55, width: 0.2, height: 0.14, label: "tree privacy", tone: "blue" },
      { x: 0.64, y: 0.23, width: 0.19, height: 0.13, label: "low visibility", tone: "amber" }
    ],
    outreach: {
      subject: "Elena, I prepared the visual version first",
      opener: "The right next step is not another savings paragraph; it is seeing the installation as a design choice.",
      callLine: "Offer two roof layouts and let her choose the trade-off.",
      cta: "Send printed-style envelope with design render and discreet layout."
    }
  },
  {
    id: "ozdemir",
    name: "Leyla Ozdemir",
    title: "Shop owner with mixed-use building",
    linkedin: "https://www.linkedin.com/in/leyla-ozdemir-energy-demo/",
    email: "leyla.ozdemir@example.energy",
    address: "Karl-Marx-Strasse 112, 12043 Berlin",
    coordinates: {
      latitude: 52.4774,
      longitude: 13.4399
    },
    archetype: "Small business resilience",
    status: "Opened proposal after hours",
    quote: {
      systemKw: 14.1,
      batteryKwh: 18,
      monthlySaving: 336,
      paybackYears: 7.8
    },
    signals: [
      { label: "Likely objection", value: "Cash flow disruption", tone: "amber" },
      { label: "Street narrative", value: "Mixed-use load makes battery useful", tone: "green" },
      { label: "Best channel", value: "Business continuity packet", tone: "blue" }
    ],
    visualEvidence: {
      oldFrame: "Older imagery shows dense mixed-use roofs and limited obvious solar adoption.",
      newFrame: "Recent imagery makes this a business resilience case rather than a lifestyle case.",
      neighborhoodShift: "The address is compelling because daytime business load improves the economics.",
      roofRead: "The sales story should combine bill reduction, outage resilience, and visible local leadership.",
      bestArgument: "This is not just a household upgrade; it is a small business margin and continuity story.",
      risk: "Do not frame it as a luxury retrofit. Keep it operational and monthly-cash-flow oriented."
    },
    fallbackAnnotations: [
      { x: 0.38, y: 0.41, width: 0.3, height: 0.19, label: "mixed-use roof", tone: "green" },
      { x: 0.14, y: 0.23, width: 0.22, height: 0.15, label: "commercial load", tone: "blue" },
      { x: 0.64, y: 0.55, width: 0.19, height: 0.14, label: "roof clutter", tone: "amber" }
    ],
    outreach: {
      subject: "Leyla, this version is about business continuity",
      opener: "The strongest case is not just cheaper power; it is protecting the shop from volatile monthly costs.",
      callLine: "Use monthly cash flow and backup as the anchor.",
      cta: "Send business continuity envelope with monthly savings page."
    }
  }
];

export const fallbackWaybackReleases = [
  {
    releaseNum: 13161,
    releaseDateLabel: "2018-01-08",
    itemTitle: "World Imagery 2018-01-08"
  },
  {
    releaseNum: 23001,
    releaseDateLabel: "2020-01-08",
    itemTitle: "World Imagery 2020-01-08"
  },
  {
    releaseNum: 42663,
    releaseDateLabel: "2022-01-12",
    itemTitle: "World Imagery 2022-01-12"
  },
  {
    releaseNum: 56102,
    releaseDateLabel: "2023-12-07",
    itemTitle: "World Imagery 2023-12-07"
  }
];

export function getProfile(profileId: string) {
  return profiles.find((profile) => profile.id === profileId) ?? profiles[0];
}
