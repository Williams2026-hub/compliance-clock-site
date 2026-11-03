/* Compliance Clock — deadline data
   ------------------------------------------------------------------
   One record per deadline. Edit this file to add or change a deadline,
   then add an entry to CHANGES below so the "What changed" log stays honest.

   date       ISO date (YYYY-MM-DD). For year/month/tbc precision, use the
              first day of the period, or null for "tbc".
   precision  "day" | "month" | "year" | "tbc" | "rolling"
   status     "confirmed" | "verify" | "expected" | "changed" | "watch"
   sectors    keys from SECTORS, or "all"
   sizes      "small" | "medium" | "large", or "all"

   STARTER DATA (3 Nov 2026): built from desk research. Every record must be
   checked against the primary regulator source before launch.
*/

window.CC_SCHEMES = {
  ukets:  { abbr: "UK ETS",  name: "UK Emissions Trading Scheme", region: "UK",
            blurb: "Cap-and-trade for power, heavy industry, aviation and, since July 2026, domestic shipping." },
  euets:  { abbr: "EU ETS",  name: "EU Emissions Trading System", region: "EU",
            blurb: "The EU carbon market: installations, aviation and shipping. ETS2 for fuels starts in 2028." },
  fueleu: { abbr: "FuelEU",  name: "FuelEU Maritime", region: "EU",
            blurb: "Caps the greenhouse gas intensity of energy used by ships calling at EU/EEA ports." },
  corsia: { abbr: "CORSIA",  name: "Carbon Offsetting & Reduction Scheme for International Aviation", region: "Global",
            blurb: "ICAO scheme: airlines offset growth in international aviation emissions." },
  cbam:   { abbr: "CBAM",    name: "Carbon Border Adjustment Mechanism (UK & EU)", region: "UK & EU",
            blurb: "A carbon price on imports of steel, aluminium, cement, fertiliser, hydrogen and more." },
  esos:   { abbr: "ESOS",    name: "Energy Savings Opportunity Scheme", region: "UK",
            blurb: "Mandatory energy audits and action plans for large UK undertakings, every four years." },
  secr:   { abbr: "SECR",    name: "Streamlined Energy & Carbon Reporting", region: "UK",
            blurb: "Energy use and emissions disclosed in the annual report of large and quoted companies." },
  cca:    { abbr: "CCA",     name: "Climate Change Agreements", region: "UK",
            blurb: "Voluntary efficiency targets in exchange for a big discount on the Climate Change Levy." }
};

window.CC_SECTORS = {
  maritime:  "Maritime",
  aviation:  "Aviation",
  power:     "Power & heat",
  industry:  "Heavy industry & manufacturing",
  importers: "Importers",
  property:  "Commercial & property",
  fuel:      "Fuel suppliers",
  waste:     "Waste",
  removals:  "Carbon removals"
};

window.CC_SIZES = {
  small:  "Small / micro",
  medium: "Medium",
  large:  "Large"
};

const SRC = {
  ukets:      "https://www.gov.uk/government/publications/participating-in-the-uk-ets",
  uketsMar:   "https://www.dnv.com/news/2026/the-uk-ets-expands-to-maritime-from-1-july-2026/",
  uketsScope: "https://icapcarbonaction.com/en/news/uk-government-confirms-major-uk-ets-expansions-maritime-waste-and-carbon-removals-be-phased",
  uketsWaste: "https://www.letsrecycle.com/news/uk-delays-expansion-of-ets-to-waste-incineration/",
  euets:      "https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets_en",
  ets2:       "https://carbon-pulse.com/452878/",
  fueleu:     "https://www.lr.org/en/expertise/maritime-energy-transition/fueleu-regulation/timetable-for-compliance",
  corsia:     "https://www.icao.int/environmental-protection/CORSIA",
  eucbam:     "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en",
  ukcbam:     "https://www.techuk.org/resource/government-confirms-introduction-of-a-uk-cbam-in-2027.html",
  esos:       "https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/how-to-comply-with-the-energy-savings-opportunity-scheme-esos-phase-4",
  secr:       "https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance",
  cca:        "https://www.gov.uk/guidance/climate-change-agreements--2",
  ccaManage:  "https://www.gov.uk/managing-your-climate-change-agreement-cca",
  corsiaUK:   "https://www.gov.uk/guidance/corsia-how-to-comply"
};

const VERIFIED = "2026-11-03";

window.CC_DEADLINES = [
  {
    id: "esos-p3-progress-2026", scheme: "esos", region: "UK", date: "2026-12-05", precision: "day",
    title: "ESOS Phase 3: annual action plan progress update",
    desc: "Report progress against the energy-saving actions in your Phase 3 action plan through the MESOS reporting system.",
    who: "Large UK undertakings that complied with ESOS Phase 3",
    sectors: ["all"], sizes: ["large"], status: "confirmed", source: SRC.esos, verified: VERIFIED
  },
  {
    id: "esos-p4-qualification", scheme: "esos", region: "UK", date: "2026-12-31", precision: "day",
    title: "ESOS Phase 4 qualification date",
    desc: "Your size on this date decides whether you are in Phase 4. Check headcount, turnover and balance sheet for the whole UK group.",
    who: "UK companies with 250+ staff, or turnover over £44m and balance sheet over £38m",
    sectors: ["all"], sizes: ["large"], status: "confirmed", source: SRC.esos, verified: VERIFIED
  },
  {
    id: "cca-tp1-end", scheme: "cca", region: "UK", date: "2026-12-31", precision: "day",
    title: "End of CCA target period 7 (2026)",
    desc: "The first target period of the new Climate Change Agreements scheme ends. Energy and output data for the year is due on 1 May 2027.",
    who: "Facilities in eligible energy-intensive sectors holding a CCA",
    sectors: ["industry"], sizes: ["all"], status: "confirmed", source: SRC.ccaManage, verified: VERIFIED
  },
  {
    id: "ukcbam-start", scheme: "cbam", region: "UK", date: "2027-01-01", precision: "day",
    title: "UK CBAM starts",
    desc: "Liability begins on imports of aluminium, cement, fertiliser, hydrogen, and iron & steel. Keep records of embedded emissions from day one.",
    who: "UK importers bringing in £50k+ of CBAM goods over 12 months",
    sectors: ["importers", "industry"], sizes: ["all"], status: "confirmed", source: SRC.ukcbam, verified: VERIFIED
  },
  {
    id: "fueleu-report-2026", scheme: "fueleu", region: "EU", date: "2027-01-31", precision: "day",
    title: "Submit 2026 FuelEU report to your verifier",
    desc: "Ship-by-ship report of energy used, fuels and GHG intensity for the 2026 reporting period.",
    who: "Companies operating ships of 5,000 GT+ calling at EU/EEA ports",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.fueleu, verified: VERIFIED
  },
  {
    id: "eucbam-cert-sales", scheme: "cbam", region: "EU", date: "2027-02-01", precision: "month",
    title: "EU CBAM certificates go on sale",
    desc: "Authorised declarants can start buying certificates on the central platform to cover 2026 imports.",
    who: "Authorised CBAM declarants in the EU",
    sectors: ["importers"], sizes: ["all"], status: "verify",
    note: "Sources point to 1 February 2027. Confirm with the Commission.",
    source: SRC.eucbam, verified: VERIFIED
  },
  {
    id: "ukets-maritime-report-2026", scheme: "ukets", region: "UK", date: "2027-03-31", precision: "day", featured: true,
    title: "First UK ETS maritime emissions report",
    desc: "Verified report covering 1 July – 31 December 2026, the first period for shipping in the UK ETS.",
    who: "Operators of ships of 5,000 GT+ on UK domestic voyages and at berth in UK ports",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.uketsMar, verified: VERIFIED
  },
  {
    id: "ukets-report-2026", scheme: "ukets", region: "UK", date: "2027-03-31", precision: "day",
    title: "UK ETS verified 2026 emissions report",
    desc: "Annual verified emissions report. Installations receiving free allocation also submit activity level change reports.",
    who: "UK ETS installations and aircraft operators",
    sectors: ["power", "industry", "aviation"], sizes: ["all"], status: "confirmed", source: SRC.ukets, verified: VERIFIED
  },
  {
    id: "euets-report-2026", scheme: "euets", region: "EU", date: "2027-03-31", precision: "day",
    title: "EU ETS verified 2026 emissions report",
    desc: "Annual verified emissions report, including company-level aggregated emissions for shipping companies.",
    who: "EU ETS installations, aircraft operators and shipping companies",
    sectors: ["power", "industry", "aviation", "maritime"], sizes: ["all"], status: "confirmed", source: SRC.euets, verified: VERIFIED
  },
  {
    id: "fueleu-verification-2026", scheme: "fueleu", region: "EU", date: "2027-03-31", precision: "day",
    title: "FuelEU verification completed",
    desc: "Verifier checks your 2026 FuelEU report and records it in the FuelEU database.",
    who: "Companies operating ships of 5,000 GT+ calling at EU/EEA ports",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.fueleu, verified: VERIFIED
  },
  {
    id: "ukets-surrender-2026", scheme: "ukets", region: "UK", date: "2027-04-30", precision: "day",
    title: "UK ETS: surrender allowances for 2026",
    desc: "Surrender allowances equal to your verified 2026 emissions. Shortfalls attract a civil penalty per tonne.",
    who: "UK ETS installations and aircraft operators",
    sectors: ["power", "industry", "aviation"], sizes: ["all"], status: "confirmed", source: SRC.ukets, verified: VERIFIED
  },
  {
    id: "fueleu-balance-2026", scheme: "fueleu", region: "EU", date: "2027-04-30", precision: "day",
    title: "FuelEU banking, borrowing and pooling recorded",
    desc: "Record any banking, borrowing or pooling. Verifier records the final compliance balance.",
    who: "Companies operating ships of 5,000 GT+ calling at EU/EEA ports",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.fueleu, verified: VERIFIED
  },
  {
    id: "corsia-report-2026", scheme: "corsia", region: "Global", date: "2027-04-30", precision: "day",
    title: "CORSIA verified 2026 emissions report",
    desc: "Submit your verified emissions report for international flights to your administering state.",
    who: "Operators emitting over 10,000 t CO₂ a year on international flights (aircraft over 5,700 kg)",
    sectors: ["aviation"], sizes: ["all"], status: "confirmed", source: SRC.corsiaUK, verified: VERIFIED
  },
  {
    id: "cca-tp7-data", scheme: "cca", region: "UK", date: "2027-05-01", precision: "day",
    title: "Submit CCA target period data for 2026",
    desc: "Report energy use and output for target period 7 so performance against your facility target can be assessed. Any shortfall means a buy-out fee.",
    who: "Facilities holding a Climate Change Agreement",
    sectors: ["industry"], sizes: ["all"], status: "confirmed", source: SRC.ccaManage, verified: VERIFIED
  },
  {
    id: "fueleu-doc-2026", scheme: "fueleu", region: "EU", date: "2027-06-30", precision: "day",
    title: "FuelEU penalty payment and Document of Compliance",
    desc: "Pay any FuelEU penalty. Ships without a deficit receive a FuelEU Document of Compliance, which must be carried on board.",
    who: "Companies operating ships of 5,000 GT+ calling at EU/EEA ports",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.fueleu, verified: VERIFIED
  },
  {
    id: "euets-surrender-2026", scheme: "euets", region: "EU", date: "2027-09-30", precision: "day",
    title: "EU ETS: surrender allowances for 2026",
    desc: "Surrender allowances for 2026 emissions. Shipping companies surrender for 100% of 2026 emissions, up from 70%.",
    who: "All EU ETS installations, aircraft operators and shipping companies",
    sectors: ["power", "industry", "aviation", "maritime"], sizes: ["all"], status: "confirmed", source: SRC.euets, verified: VERIFIED
  },
  {
    id: "eucbam-declaration-2026", scheme: "cbam", region: "EU", date: "2027-09-30", precision: "day", featured: true,
    title: "First annual EU CBAM declaration and certificate surrender",
    desc: "Declare embedded emissions in 2026 imports and surrender the matching number of CBAM certificates. The 2025 CBAM Omnibus moved this deadline from 31 May to 30 September.",
    who: "EU importers of more than 50 tonnes a year of CBAM goods",
    sectors: ["importers"], sizes: ["all"], status: "confirmed", source: SRC.eucbam, verified: VERIFIED
  },
  {
    id: "esos-p4-compliance", scheme: "esos", region: "UK", date: "2027-12-05", precision: "day", featured: true,
    title: "ESOS Phase 4 compliance date",
    desc: "Complete your energy audit, notify the Environment Agency and submit your action plan.",
    who: "Large UK undertakings that qualified on 31 December 2026",
    sectors: ["all"], sizes: ["large"], status: "confirmed", source: SRC.esos, verified: VERIFIED
  },
  {
    id: "corsia-cancel-phase1", scheme: "corsia", region: "Global", date: "2028-01-31", precision: "day",
    title: "CORSIA: cancel offsetting units for the first phase",
    desc: "Cancel eligible emissions units to cover your offsetting requirement for 2024–2026.",
    who: "CORSIA aeroplane operators with offsetting requirements",
    sectors: ["aviation"], sizes: ["all"], status: "confirmed", source: SRC.corsia, verified: VERIFIED
  },
  {
    id: "ukcbam-register-2027", scheme: "cbam", region: "UK", date: "2028-01-31", precision: "day",
    title: "Register for UK CBAM with HMRC",
    desc: "If you became liable during 2027, register by this date.",
    who: "UK importers over the £50k CBAM threshold in 2027",
    sectors: ["importers", "industry"], sizes: ["all"], status: "verify",
    note: "Set by the UK CBAM transitional rules, according to several guides. Confirm on GOV.UK once HMRC publishes final guidance.",
    source: SRC.ukcbam, verified: VERIFIED
  },
  {
    id: "ukets-maritime-report-2027", scheme: "ukets", region: "UK", date: "2028-03-31", precision: "day",
    title: "UK ETS maritime: verified 2027 emissions report",
    desc: "Second maritime report, covering the full 2027 calendar year.",
    who: "Operators of ships of 5,000 GT+ on UK domestic voyages",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.uketsMar, verified: VERIFIED
  },
  {
    id: "ukets-maritime-surrender", scheme: "ukets", region: "UK", date: "2028-04-30", precision: "day", featured: true,
    title: "UK ETS maritime: first surrender (2026 and 2027 together)",
    desc: "One-off concession: surrender allowances for both 2026 and 2027 maritime emissions in one go.",
    who: "Operators of ships of 5,000 GT+ on UK domestic voyages",
    sectors: ["maritime"], sizes: ["all"], status: "confirmed", source: SRC.uketsMar, verified: VERIFIED
  },
  {
    id: "corsia-cancel-report", scheme: "corsia", region: "Global", date: "2028-04-30", precision: "day",
    title: "CORSIA emissions unit cancellation report",
    desc: "Report the units you cancelled for the first phase to your administering state.",
    who: "CORSIA aeroplane operators with offsetting requirements",
    sectors: ["aviation"], sizes: ["all"], status: "verify", source: SRC.corsia, verified: VERIFIED
  },
  {
    id: "ukcbam-return-2027", scheme: "cbam", region: "UK", date: "2028-05-31", precision: "day",
    title: "First UK CBAM return and payment",
    desc: "Annual return and payment covering CBAM goods imported from 1 January to 31 December 2027.",
    who: "UK importers registered for CBAM",
    sectors: ["importers", "industry"], sizes: ["all"], status: "verify",
    note: "Set by the UK CBAM transitional rules, according to several guides. Confirm on GOV.UK once HMRC publishes final guidance.",
    source: SRC.ukcbam, verified: VERIFIED
  },

  /* ---- On the horizon (no exact date yet) ---- */
  {
    id: "ets2-start", scheme: "euets", region: "EU", date: "2028-01-01", precision: "year",
    title: "EU ETS2 starts for buildings and road-transport fuels",
    desc: "Separate carbon market covering fuel supplied for buildings and road transport.",
    who: "Fuel suppliers (upstream). Households and SMEs feel it through prices.",
    sectors: ["fuel"], sizes: ["all"], status: "changed", was: "2027", source: SRC.ets2, verified: VERIFIED
  },
  {
    id: "ukets-waste", scheme: "ukets", region: "UK", date: null, precision: "tbc",
    title: "Waste incineration and energy-from-waste join UK ETS",
    desc: "Planned 2028 start has been delayed. A new date is expected.",
    who: "Operators of energy-from-waste and incineration plants",
    sectors: ["waste"], sizes: ["all"], status: "changed", was: "2028", source: SRC.uketsWaste, verified: VERIFIED
  },
  {
    id: "ukets-ggr", scheme: "ukets", region: "UK", date: "2029-01-01", precision: "year",
    title: "Greenhouse gas removals join UK ETS",
    desc: "Engineered removals such as DACCS and BECCS can earn UK ETS allowances.",
    who: "Greenhouse gas removal project developers",
    sectors: ["removals"], sizes: ["all"], status: "expected", source: SRC.uketsScope, verified: VERIFIED
  },
  {
    id: "secr-annual", scheme: "secr", region: "UK", date: null, precision: "rolling",
    title: "SECR disclosure in your annual report",
    desc: "Energy use, emissions, an intensity ratio and efficiency actions, published with your accounts.",
    who: "Quoted companies and large unquoted companies and LLPs",
    sectors: ["all"], sizes: ["large"], status: "confirmed", source: SRC.secr, verified: VERIFIED
  }
];

/* "What changed" log — newest first */
window.CC_CHANGES = [
  {
    date: "2026-08-27", scheme: "ukets",
    title: "UK ETS expansion to waste incineration delayed",
    body: "The government will not bring energy-from-waste into the UK ETS in 2028 as planned. A new start date is expected.",
    was: "2028", now: "To be confirmed", source: SRC.uketsWaste
  },
  {
    date: "2026-07-17", scheme: "euets",
    title: "Commission proposes a targeted EU ETS revision",
    body: "The proposal now goes through Parliament and Council. In October, EU leaders also asked for an updated ETS2 assessment.",
    was: null, now: "Proposal under negotiation", source: SRC.euets
  },
  {
    date: "2026-07-01", scheme: "ukets",
    title: "Shipping joins the UK ETS",
    body: "Domestic maritime is now covered. First verified report due 31 March 2027; first surrender, covering both 2026 and 2027, due 30 April 2028.",
    was: null, now: "Live from 1 July 2026", source: SRC.uketsMar
  }
];
