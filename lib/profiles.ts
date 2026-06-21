export type CustomerProfile = {
  id: string;
  name: string;
  title: string;
  linkedin: string;
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
    outreach: {
      subject: "Sofia, I checked the block around Kollwitzstrasse",
      opener: "A quick visual check suggests your part of Prenzlauer Berg is crossing the point where solar stops feeling experimental.",
      callLine: "I would frame this as a predictability upgrade, not a tech project.",
      cta: "Send a 43-second founder video with the Wayback neighborhood animation."
    }
  },
  {
    id: "vogt",
    name: "Jonas Vogt",
    title: "Angel investor, spreadsheet-first homeowner",
    linkedin: "https://www.linkedin.com/in/jonas-vogt-energy-demo/",
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
      oldFrame: "The older Wayback frame shows stable detached-house roof geometry and mature tree cover.",
      newFrame: "The newer frame keeps the same roof footprint, so the financial model is not fighting major structural uncertainty.",
      neighborhoodShift: "The visible opportunity is not herd behavior; it is unused roof yield in a high-value residential pocket.",
      roofRead: "The address is suited to a bigger system pitch, especially if battery arbitrage and EV charging are included.",
      bestArgument: "This is idle infrastructure. The roof is already there, the surface area is unusually valuable, and the decision should be evaluated like a low-volatility asset with energy-price upside.",
      risk: "Do not use emotional sustainability copy. Show sensitivity ranges, downside payback, and a clean financing comparison."
    },
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
    outreach: {
      subject: "Mara, I think the design objection is solvable",
      opener: "The aerial history makes this look less like a standard solar sale and more like a chance to set the local design precedent.",
      callLine: "I would show two layouts: invisible-from-street and maximum-yield.",
      cta: "Send animation plus a solarized 3D render with two design choices."
    }
  }
];

export const fallbackWaybackReleases = [
  {
    releaseNum: 13161,
    releaseDateLabel: "2018-01-08",
    itemTitle: "World Imagery (Wayback 2018-01-08)"
  },
  {
    releaseNum: 23001,
    releaseDateLabel: "2020-01-08",
    itemTitle: "World Imagery (Wayback 2020-01-08)"
  },
  {
    releaseNum: 42663,
    releaseDateLabel: "2022-01-12",
    itemTitle: "World Imagery (Wayback 2022-01-12)"
  },
  {
    releaseNum: 56102,
    releaseDateLabel: "2023-12-07",
    itemTitle: "World Imagery (Wayback 2023-12-07)"
  }
];
