/* Compliance Clock — scheme page content
   ------------------------------------------------------------------
   One entry per scheme, keyed like CC_SCHEMES in deadlines.js.
   The page at scheme.html?s=<slug> is built from this file plus the
   matching deadlines and changes in deadlines.js.

   slug        used in the page address
   summary     2–3 plain-English sentences: what it is and why it exists
   regulator   who you deal with
   inScope     "You're probably in if…" bullets (thresholds in plain words)
   outScope    common exemptions / "You're probably out if…"
   cycle       the yearly routine: { when, what }
   facts       key numbers: [label, value]
   tip         one practical tip from experience
   links       official sources: { label, url }
   checklist   the matching paid checklist, if any
   related     other scheme keys people in this scheme often also face

   DRAFT CONTENT (3 Nov 2026): written from desk research and experience.
   Every fact must be checked against the primary source before launch.
*/

window.CC_SCHEME_CONTENT = {
  ukets: {
    slug: "uk-ets",
    since: "2021",
    summary: "The UK Emissions Trading Scheme puts a cap on emissions from power, heavy industry, aviation and, since 1 July 2026, domestic shipping. Each year you report your verified emissions and hand back (surrender) one allowance for every tonne. You get allowances free, buy them at auction or trade them.",
    regulator: "Environment Agency (England), SEPA (Scotland), Natural Resources Wales, NIEA (Northern Ireland), OPRED (offshore). Aviation and maritime: the regulator for your administering nation. Policy is set by the UK ETS Authority.",
    inScope: [
      "You run an installation burning fuel with a total rated thermal input above 20 MW, or carry out another listed activity (steel, cement, refining, chemicals, glass, paper and more)",
      "You operate flights within the UK, from the UK to the EEA, or to Gibraltar and Switzerland, above the de minimis thresholds",
      "You operate ships of 5,000 GT or more on UK domestic voyages, including emissions at berth in UK ports (from 1 July 2026)"
    ],
    outScope: [
      "Hospitals and small emitters on the UK ETS Authority's opt-out list for 2026–2030 follow lighter rules instead of the full scheme",
      "Ultra-small emitters (under 2,500 t CO₂e a year) on the Authority's list only need to monitor their emissions",
      "Waste incineration is not yet in. Its 2028 start has been delayed"
    ],
    cycle: [
      { when: "All year", what: "Monitor emissions under your approved monitoring plan" },
      { when: "28 Feb", what: "Free allocation issued to eligible installations" },
      { when: "31 Mar", what: "Submit your verified emissions report (and activity level report, if you receive free allocation)" },
      { when: "30 Apr", what: "Surrender allowances equal to last year's verified emissions" }
    ],
    facts: [
      ["Penalty for not surrendering", "£100 per missing allowance (index-linked), and you must still surrender"],
      ["First maritime report", "31 March 2027, for 1 July to 31 December 2026"],
      ["First maritime surrender", "30 April 2028, covering both 2026 and 2027"],
      ["Coming next", "Greenhouse gas removals from 2029; waste incineration date to be confirmed"]
    ],
    tip: "Book your verifier early. Verifiers are busiest in February and March, and new maritime operators are all chasing the same few firms for the first 31 March deadline.",
    links: [
      { label: "GOV.UK: Participating in the UK ETS", url: "https://www.gov.uk/government/publications/participating-in-the-uk-ets" },
      { label: "DNV: UK ETS maritime from 1 July 2026", url: "https://www.dnv.com/news/2026/the-uk-ets-expands-to-maritime-from-1-july-2026/" }
    ],
    checklist: { title: "UK ETS Maritime: First Report", price: "£29" },
    related: ["euets", "fueleu", "cbam"]
  },

  euets: {
    slug: "eu-ets",
    since: "2005",
    summary: "The EU Emissions Trading System is the EU's carbon market. It covers power stations, industry, flights within Europe and, since 2024, shipping. Shipping now surrenders for 100% of its emissions. A second market, ETS2, for fuel used in buildings and road transport, starts in 2028.",
    regulator: "The national competent authority in each EU/EEA country. Shipping companies and aircraft operators are each assigned one administering member state.",
    inScope: [
      "You run an installation in the EU/EEA with combustion above 20 MW or another listed industrial activity",
      "You operate flights within the EEA, or from the EEA to Switzerland or the UK",
      "You operate ships of 5,000 GT or more carrying cargo or passengers to or from EU/EEA ports: 100% of voyages within the EU and at berth, 50% of voyages into or out of the EU",
      "Northern Ireland electricity generators remain in the EU ETS under the Windsor Framework"
    ],
    outScope: [
      "General cargo and offshore ships of 400–5,000 GT report under EU MRV from 2025 but don't surrender allowances. Whether they join the ETS is part of the 2026 review",
      "ETS2 obligations fall on fuel suppliers, not on households or small businesses directly"
    ],
    cycle: [
      { when: "All year", what: "Monitor emissions under your approved monitoring plan" },
      { when: "31 Mar", what: "Submit your verified emissions report (shipping: company-level data)" },
      { when: "30 Sep", what: "Surrender allowances for last year's emissions" }
    ],
    facts: [
      ["Penalty for not surrendering", "€100 per tonne (index-linked), and you must still surrender"],
      ["Shipping phase-in", "40% of 2024 emissions, 70% of 2025, 100% from 2026"],
      ["Shipping gases", "Methane and nitrous oxide are included from 2026"],
      ["ETS2", "Delayed one year to 2028; politically contested"]
    ],
    tip: "The EU surrender date moved from 30 April to 30 September in 2024. If you are also in the UK ETS, don't let the two surrender dates blur together.",
    links: [
      { label: "European Commission: EU ETS", url: "https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets_en" },
      { label: "Carbon Pulse: ETS2 delayed to 2028", url: "https://carbon-pulse.com/452878/" }
    ],
    checklist: null,
    related: ["ukets", "fueleu", "cbam"]
  },

  fueleu: {
    slug: "fueleu-maritime",
    since: "2025",
    summary: "FuelEU Maritime limits how carbon-intensive the energy used by ships can be. The limit tightens every five years. Ships that beat it can bank or pool their surplus. Ships that miss it pay a penalty. It applies alongside the EU ETS, not instead of it.",
    regulator: "Your administering EU member state, with independent verifiers who check reports and issue the FuelEU Document of Compliance.",
    inScope: [
      "You are responsible for ships of 5,000 GT or more carrying cargo or passengers for commercial purposes",
      "The ship calls at EU/EEA ports. Covered: 100% of energy on voyages within the EU and at berth, 50% on voyages into or out of the EU"
    ],
    outScope: [
      "Ships under 5,000 GT",
      "Fishing vessels, warships and non-commercial government ships"
    ],
    cycle: [
      { when: "All year", what: "Monitor energy use and fuels under your FuelEU monitoring plan" },
      { when: "31 Jan", what: "Submit last year's FuelEU report to your verifier" },
      { when: "31 Mar", what: "Verification completed and recorded in the FuelEU database" },
      { when: "30 Apr", what: "Record banking, borrowing or pooling; final compliance balance" },
      { when: "30 Jun", what: "Pay any penalty; carry the FuelEU Document of Compliance on board" }
    ],
    facts: [
      ["Reduction target vs 2020", "2% from 2025, 6% from 2030, 14.5% from 2035, rising to 80% by 2050"],
      ["Penalty", "€2,400 per tonne of VLSFO-equivalent energy shortfall, rising 10% for each consecutive year"],
      ["Flexibility", "Bank a surplus, borrow a limited amount from next year (capped at 2% of the limit, paid back with a 10% uplift), or pool ships together"],
      ["Shore power", "Container and passenger ships must use shore power at major EU ports from 2030"]
    ],
    tip: "Pooling is where the money is. A ship running on biofuel or LNG can carry a surplus that offsets other ships in your fleet, or a partner's, so look at pooling before you pay penalties.",
    links: [
      { label: "Lloyd's Register: FuelEU timetable", url: "https://www.lr.org/en/expertise/maritime-energy-transition/fueleu-regulation/timetable-for-compliance" }
    ],
    checklist: null,
    related: ["euets", "ukets"]
  },

  corsia: {
    slug: "corsia",
    since: "2019 (monitoring), 2021 (offsetting)",
    summary: "CORSIA is the UN aviation body's scheme to cap the growth of international aviation emissions. Airlines on covered routes must offset emissions above a baseline by buying approved carbon credits, or reduce them by using sustainable aviation fuel. The first phase (2024–2026) settles in January 2028.",
    regulator: "Your administering state, under ICAO rules. In the UK it's set by the Air Navigation (CORSIA) Order 2021: the Environment Agency (England), SEPA, Natural Resources Wales or NIEA. Operators already in the UK ETS keep their UK ETS regulator. Reports go through the METS system.",
    inScope: [
      "You emit more than 10,000 t CO₂ a year from international flights with aeroplanes over 5,700 kg maximum take-off mass",
      "Offsetting applies on routes between states that take part. Monitoring and reporting apply to all your international flights"
    ],
    outScope: [
      "Humanitarian, medical and firefighting flights",
      "Domestic flights (covered instead by national schemes such as UK ETS and EU ETS)"
    ],
    cycle: [
      { when: "All year", what: "Monitor fuel use and CO₂ under your emissions monitoring plan" },
      { when: "30 Apr", what: "Submit your verified emissions report for the previous year to your state" },
      { when: "End of phase", what: "Cancel eligible emissions units to meet your offsetting requirement" }
    ],
    facts: [
      ["Baseline", "85% of 2019 CO₂ emissions (from 2024)"],
      ["First phase", "2024–2026; cancel units by 31 January 2028"],
      ["Second phase", "2027–2035; participation becomes mandatory for most states"],
      ["Reducing your bill", "CORSIA eligible fuels (SAF) reduce your offsetting requirement"]
    ],
    tip: "Eligible credits for the first phase are scarce because they need host-country authorisation. Lock in supply well before the January 2028 deadline.",
    links: [
      { label: "ICAO: CORSIA", url: "https://www.icao.int/environmental-protection/CORSIA" },
      { label: "GOV.UK: CORSIA, how to comply", url: "https://www.gov.uk/guidance/corsia-how-to-comply" },
      { label: "Normec: CORSIA first phase explained", url: "https://certification.normecgroup.com/news/navigating-icaos-corsia-in-the-first-phase" }
    ],
    checklist: null,
    related: ["ukets", "euets"]
  },

  cbam: {
    slug: "cbam",
    since: "EU 2026, UK 2027",
    summary: "A Carbon Border Adjustment Mechanism charges importers for the carbon in certain goods, so they pay the same carbon price as local producers. The EU's CBAM has charged since 1 January 2026. The UK's starts on 1 January 2027 and works differently: it's a tax collected by HMRC.",
    regulator: "EU: national CBAM authorities and the Commission's CBAM Registry. UK: HM Revenue & Customs.",
    inScope: [
      "EU: you import more than 50 tonnes a year of iron and steel, aluminium, cement, fertilisers, hydrogen or electricity into the EU, and need authorised declarant status",
      "UK: you import aluminium, cement, fertiliser, hydrogen or iron and steel worth £50,000 or more over 12 months (or expect to within 30 days)"
    ],
    outScope: [
      "EU: importers under the 50-tonne annual threshold",
      "UK: importers under £50,000 a year of CBAM goods. Glass and ceramics were dropped from the UK scope"
    ],
    cycle: [
      { when: "All year", what: "Collect embedded-emissions data from your non-UK/EU suppliers" },
      { when: "EU · from Feb 2027", what: "Buy CBAM certificates on the central platform" },
      { when: "EU · 30 Sep", what: "Annual CBAM declaration and certificate surrender for last year's imports (moved from 31 May by the 2025 CBAM Omnibus)" },
      { when: "UK · 31 Jan 2028", what: "Register with HMRC if you became liable during 2027" },
      { when: "UK · 31 May 2028", what: "First return and payment, covering 2027 imports" }
    ],
    facts: [
      ["EU certificate price", "Linked to the EU ETS auction price"],
      ["Carbon paid abroad", "Can be deducted from what you owe, if you can prove it"],
      ["Default values", "Used when suppliers can't give real data. Usually more expensive"],
      ["UK first return", "31 May 2028, covering 2027. Later returns come round more often, so check HMRC guidance"]
    ],
    tip: "Start asking suppliers for installation-level emissions data now. Without it you pay on default values, which are set high on purpose.",
    links: [
      { label: "European Commission: CBAM", url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en" },
      { label: "techUK: UK CBAM confirmed for 2027", url: "https://www.techuk.org/resource/government-confirms-introduction-of-a-uk-cbam-in-2027.html" }
    ],
    checklist: { title: "UK CBAM Readiness", price: "£29" },
    related: ["ukets", "euets"]
  },

  esos: {
    slug: "esos",
    since: "2014",
    summary: "The Energy Savings Opportunity Scheme makes large UK organisations audit their energy use every four years and find ways to save. Since Phase 3 you must also publish an action plan and report progress against it every year. Phase 4 runs to 5 December 2027.",
    regulator: "Environment Agency (UK scheme administrator), with SEPA, Natural Resources Wales and NIEA. Submissions go through the MESOS reporting system.",
    inScope: [
      "Your UK group has 250 or more employees, or",
      "Turnover above £44 million and balance sheet above £38 million",
      "Size is measured across your whole UK corporate group on the qualification date (31 December 2026 for Phase 4)"
    ],
    outScope: [
      "Small and medium-sized groups below both thresholds",
      "Public bodies, with some exceptions"
    ],
    cycle: [
      { when: "Qualification date", what: "Check whether your group is large on 31 December 2026" },
      { when: "Before compliance date", what: "Measure energy use, audit it, get lead assessor and board sign-off" },
      { when: "5 Dec 2027", what: "Notify compliance and submit your action plan" },
      { when: "Each 5 Dec after", what: "Report progress against your action plan" }
    ],
    facts: [
      ["Penalties", "No audit: up to £50,000, plus up to £500 per working day for up to 80 working days. Failing to notify: up to £5,000"],
      ["Sign-off", "Board-level directors and an approved lead assessor"],
      ["Phase 4 thresholds", "Unchanged from Phase 3"],
      ["Overlap", "Many ESOS companies also report under SECR"]
    ],
    tip: "Reuse your SECR energy data for ESOS. It saves weeks, but check the coverage periods line up.",
    links: [
      { label: "GOV.UK: How to comply with ESOS Phase 4", url: "https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/how-to-comply-with-the-energy-savings-opportunity-scheme-esos-phase-4" }
    ],
    checklist: { title: "ESOS Phase 4", price: "£19" },
    related: ["secr", "cca"]
  },

  secr: {
    slug: "secr",
    since: "2019",
    summary: "Streamlined Energy and Carbon Reporting requires large and quoted UK companies to publish their energy use and emissions in their annual report. There's no separate filing or deadline. It's due when your accounts are due.",
    regulator: "Companies House (filed with your accounts). The Financial Reporting Council oversees quality for larger companies.",
    inScope: [
      "Quoted companies: global scope 1 and 2 emissions, an intensity ratio and energy-efficiency actions",
      "Large unquoted companies and LLPs meeting two of: more than 250 employees, turnover over £36 million, balance sheet over £18 million"
    ],
    outScope: [
      "Companies using 40 MWh or less of energy in the UK in the year (they state this instead)",
      "Small and medium-sized companies"
    ],
    cycle: [
      { when: "Financial year", what: "Collect energy and fuel data (gas, electricity, transport)" },
      { when: "Year end", what: "Calculate emissions using the government conversion factors" },
      { when: "With your accounts", what: "Publish in the directors' report. Private companies: 9 months after year end; public companies: 6 months" }
    ],
    facts: [
      ["What to report", "UK energy use, related emissions, at least one intensity ratio, efficiency actions"],
      ["Thresholds", "SECR kept its original £36m / £18m thresholds. The April 2025 Companies Act increases didn't change them"],
      ["Coming", "UK Sustainability Reporting Standards may replace or extend SECR"],
      ["Overlap", "Data can feed ESOS audits"]
    ],
    tip: "Use the same conversion-factor year as your reporting year, and say so. It's the most common thing auditors query.",
    links: [
      { label: "GOV.UK: Environmental reporting guidelines", url: "https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance" },
      { label: "ICAS: Size thresholds and SECR", url: "https://icas.com/news-insights-events/news/charities/spotlight-on-the-companies-act-size-threshold-and-non-financial-reporting-changes/" }
    ],
    checklist: null,
    related: ["esos", "cca"]
  },

  cca: {
    slug: "climate-change-agreements",
    since: "2001 (new scheme from 2026)",
    summary: "Climate Change Agreements are voluntary deals for energy-intensive businesses: hit an energy-efficiency target and you pay much less Climate Change Levy on your energy bills. A new scheme started in 2026, with targets set for each facility rather than for groups.",
    regulator: "Environment Agency as scheme administrator. Your sector association holds the umbrella agreement for your sector.",
    inScope: [
      "Your facility carries out an eligible energy-intensive process (listed by sector, from food and drink to chemicals and metals)",
      "You joined the new scheme. Existing participants had to reapply, with an application window in 2025"
    ],
    outScope: [
      "Sites not in an eligible sector",
      "Old-scheme participants who did not reapply for the new scheme"
    ],
    cycle: [
      { when: "Target periods", what: "TP7: 2026 (the first of the new scheme) · TP8: 2027–2028 · TP9: 2029–2030" },
      { when: "1 May after each period", what: "Submit your target period data: 1 May 2027 for 2026, then 1 May 2029 and 1 May 2031" },
      { when: "After assessment", what: "Pay a buy-out fee for any shortfall against target, or lose your discount" },
      { when: "Mid-period", what: "Light-touch annual data reporting in two-year periods" }
    ],
    facts: [
      ["The prize", "92% off the Climate Change Levy on electricity and 89% off gas (2026 rates)"],
      ["Discount runs to", "31 March 2033"],
      ["Targets", "Set for each facility, not grouped"],
      ["Missed target", "Pay a buy-out fee per tonne CO₂e. If you don't pay, the agreement is decertified and you lose the discount"]
    ],
    tip: "Check your metering covers exactly the eligible process. Energy for non-eligible activities on the same site can push you over target.",
    links: [
      { label: "GOV.UK: Climate Change Agreements", url: "https://www.gov.uk/guidance/climate-change-agreements--2" },
      { label: "GOV.UK: Managing your CCA (target periods)", url: "https://www.gov.uk/managing-your-climate-change-agreement-cca" },
      { label: "GOV.UK: Climate Change Levy rates", url: "https://www.gov.uk/guidance/climate-change-levy-rates" }
    ],
    checklist: null,
    related: ["esos", "ukets"]
  }
};
