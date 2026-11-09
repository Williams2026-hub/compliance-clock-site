/* Compliance Clock — home page renderer (no DOM access)
   HTML builders for the home page. Used by tools/build.js to pre-render
   index.html (between <!-- build:NAME --> markers) and by app.js in the browser. */
(function () {
  "use strict";

  const CC = window.CC;

  function heroNext() {
    const { esc, fmt, daysUntil, upcoming, schemeBadge } = CC;
    const next = upcoming[0];
    if (!next) return `<p>No upcoming deadlines.</p>`;
    const n = daysUntil(next.date);
    const C = 2 * Math.PI * 27;
    return `<div data-scheme="${next.scheme}">
      <svg class="clock-ring" viewBox="0 0 64 64" aria-hidden="true">
        <circle class="track" cx="32" cy="32" r="27"/>
        <circle class="progress" cx="32" cy="32" r="27" stroke-dasharray="${C}" stroke-dashoffset="${C * Math.min(n, 365) / 365}"/>
      </svg>
      <span class="eyebrow">Next deadline</span>
      <div class="clock-days"><strong class="num">${n}</strong><span>${n === 1 ? "day" : "days"} to go</span></div>
      <h2 class="clock-title"><a href="#${next.id}" style="text-decoration:none">${esc(next.title)}</a></h2>
      <div class="clock-meta">${schemeBadge(next.scheme)}<span class="date">${fmt(next.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div>
    </div>`;
  }

  function nextList() {
    const { SCHEMES, esc, fmt, upcoming, countdown } = CC;
    return upcoming.slice(1, 4).map((d) => `
      <li data-scheme="${d.scheme}"><a href="#${d.id}">
        <span class="bar"></span>
        <span><span class="t">${esc(d.title)}</span><br><span class="s">${esc(SCHEMES[d.scheme].abbr)} · ${esc(d.region)}</span></span>
        <span class="d num">${fmt(d.date, { day: "numeric", month: "short" })}<br><span class="s">${countdown(d.date, d.precision).text}</span></span>
      </a></li>`).join("");
  }

  function stats() {
    const { SCHEMES, ALL, fmt, upcoming } = CC;
    return {
      deadlines: String(upcoming.length),
      schemes: String(Object.keys(SCHEMES).length),
      verified: fmt(ALL.map((d) => d.verified).sort().pop(), { day: "numeric", month: "short" })
    };
  }

  function schemeStrip() {
    const { SCHEMES, esc, schemeUrl } = CC;
    return Object.entries(SCHEMES).map(([k, s]) => `<a href="${schemeUrl(k)}" data-scheme="${k}">${esc(s.abbr)}</a>`).join("");
  }

  function resultCount(shown, filtered) {
    return `Showing <strong>${shown}</strong> of ${CC.upcoming.length} upcoming deadlines${filtered ? "" : " across all schemes"}`;
  }

  function list(items) {
    const { fmt, deadlineRow } = CC;
    if (!items.length) return `<div class="empty"><h3>No deadlines match</h3><p>Try removing a filter or widening the time window.</p></div>`;
    const groups = new Map();
    items.forEach((d) => { const k = d.date.slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(d); });
    return [...groups].map(([k, g]) => `
      <section class="month-group" aria-label="${fmt(k + "-01", { month: "long", year: "numeric" })}">
        <h3 class="month-label">${fmt(k + "-01", { month: "long", year: "numeric" })}<small>${g.length} ${g.length === 1 ? "deadline" : "deadlines"}</small></h3>
        <div class="deadline-list">${g.map(deadlineRow).join("")}</div>
      </section>`).join("");
  }

  function horizon(items) {
    const { esc, schemeBadge, statusBadge } = CC;
    const when = (d) => d.precision === "year" ? d.date.slice(0, 4) : d.precision === "tbc" ? "Date TBC" : "Every year";
    return items.map((d) => `
      <article class="horizon-item" data-scheme="${d.scheme}" id="${d.id}">
        <div class="when num">${when(d)}</div>
        <div class="what">${esc(d.title)}</div>
        <div class="who">${esc(d.who)}</div>
        <div class="badges">${schemeBadge(d.scheme)}${d.status !== "confirmed" ? statusBadge(d.status) : ""}${d.was ? `<span class="badge badge-plain">Was ${esc(d.was)}</span>` : ""}</div>
      </article>`).join("");
  }

  function changes() {
    const { esc, fmtLong, schemeBadge } = CC;
    return window.CC_CHANGES.map((c) => `
      <article class="change-card" data-scheme="${c.scheme}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><time datetime="${c.date}">${fmtLong(c.date)}</time>${schemeBadge(c.scheme)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.body)}</p>
        <dl class="was-now">
          ${c.was ? `<dt>Was</dt><dd class="was">${esc(c.was)}</dd>` : ""}
          <dt>Now</dt><dd>${esc(c.now)}</dd>
        </dl>
        <a href="${esc(c.source)}" target="_blank" rel="noopener" style="font-size:var(--fs-sm);font-weight:600;margin-top:auto">Source ↗</a>
      </article>`).join("");
  }

  function schemes() {
    const { SCHEMES, esc, fmt, upcoming, schemeUrl } = CC;
    return Object.entries(SCHEMES).map(([k, s]) => {
      const n = upcoming.filter((d) => d.scheme === k).length;
      const next = upcoming.find((d) => d.scheme === k);
      return `
        <a class="scheme-card" data-scheme="${k}" href="${schemeUrl(k)}">
          <span class="abbr">${esc(s.abbr)}</span>
          <span class="full">${esc(s.name)} · ${esc(s.region)}</span>
          <p>${esc(s.blurb)}</p>
          <span class="foot"><span><strong class="num">${n}</strong> upcoming</span><span class="num">${next ? "Next: " + fmt(next.date, { day: "numeric", month: "short", year: "2-digit" }) : "Rolling"}</span></span>
        </a>`;
    }).join("");
  }

  /* "Year at a glance": the next 12 months as a grid, one row per scheme and one column per month.
     Each deadline is a pill showing its day; the line marks today. Hovering or tapping a pill shows it
     in the detail panel, selecting a month lists that month, and a scheme name filters the tracker
     (wired up in app.js). On phones the same deadlines show as a month-by-month list. */
  function glanceWindow() {
    const { TODAY, parse, upcoming } = CC;
    const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    const end = new Date(TODAY.getFullYear(), TODAY.getMonth() + 12, 1);
    const months = [];
    for (let i = 0; i < 12; i++) months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    const items = upcoming.filter((d) => parse(d.date) < end);
    const mkey = (m) => `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
    return { months, items, mkey };
  }

  /* Detail panel: one deadline */
  function glanceDetail(d, heading) {
    const { esc, fmt, countdown, schemeBadge } = CC;
    if (!d) return `<p class="gl-hint">No deadlines in the next 12 months.</p>`;
    const cd = countdown(d.date, d.precision);
    const when = d.precision === "month" ? fmt(d.date, { month: "long", year: "numeric" }) + " (day to be confirmed)"
      : fmt(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return `
      <span class="gl-detail-label">${esc(heading || "Selected deadline")}</span>
      <div class="gl-detail-top">${schemeBadge(d.scheme)}<span class="countdown num ${cd.cls}">${cd.text}</span></div>
      <h3 class="gl-detail-title">${esc(d.title)}</h3>
      <p class="gl-detail-date">${when}</p>
      <p class="gl-detail-who"><strong>Who it affects:</strong> ${esc(d.who)}</p>
      <a class="gl-detail-link" href="#${d.id}" data-open="${d.id}">Full details <span aria-hidden="true">↓</span></a>`;
  }

  /* Detail panel: one month */
  function glanceMonth(key) {
    const { SCHEMES, esc, fmt, countdown } = CC;
    const list = glanceWindow().items.filter((d) => d.date.startsWith(key));
    const name = fmt(key + "-01", { month: "long", year: "numeric" });
    if (!list.length) return `<span class="gl-detail-label">${esc(name)}</span><p class="gl-hint">Nothing due this month.</p>`;
    return `
      <span class="gl-detail-label">${esc(name)} · ${list.length} ${list.length === 1 ? "deadline" : "deadlines"}</span>
      <ul class="gl-month-list">${list.map((d) => `
        <li data-scheme="${d.scheme}"><a href="#${d.id}" data-open="${d.id}">
          <span class="gml-day num">${d.precision === "month" ? "TBC" : fmt(d.date, { day: "numeric" })}</span>
          <span class="gml-text"><span class="gml-scheme">${esc(SCHEMES[d.scheme].abbr)}</span>${esc(d.title)}</span>
          <span class="gml-cd num">${countdown(d.date, d.precision).text}</span>
        </a></li>`).join("")}</ul>`;
  }

  function glance() {
    const { SCHEMES, TODAY, esc, fmt, fmtLong, parse } = CC;
    const { months, items, mkey } = glanceWindow();
    const inMonth = (list, m) => list.filter((d) => d.date.startsWith(mkey(m)));
    const counts = months.map((m) => inMonth(items, m).length);
    const used = Object.keys(SCHEMES).filter((k) => items.some((d) => d.scheme === k));
    const daysInMonth = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
    const todayPct = (((TODAY.getDate() - 0.5) / daysInMonth) * 100).toFixed(1);
    const label = (d) => `${SCHEMES[d.scheme].abbr}: ${d.title}, ${d.precision === "month" ? fmt(d.date, { month: "long", year: "numeric" }) : fmtLong(d.date)}`;
    const day = (d) => d.precision === "month" ? "TBC" : String(parse(d.date).getDate());

    const head = months.map((m, i) => {
      const year = i === 0 || m.getMonth() === 0 ? `<span class="gl-year">${m.getFullYear()}</span>` : "";
      const full = m.toLocaleString("en-GB", { month: "long", year: "numeric" });
      return `<button type="button" class="gl-month${i === 0 ? " is-now" : ""}${counts[i] >= 3 ? " is-busy" : ""}" data-month="${mkey(m)}" aria-label="${esc(full)}: ${counts[i]} ${counts[i] === 1 ? "deadline" : "deadlines"}">
          ${year}<span class="gl-mname">${m.toLocaleString("en-GB", { month: "short" })}</span><span class="gl-mcount num">${counts[i] || "–"}</span>
        </button>`;
    }).join("");

    const rows = used.map((k) => {
      const mine = items.filter((d) => d.scheme === k);
      const cells = months.map((m, i) => `<div class="gl-cell${i === 0 ? " is-now" : ""}">${inMonth(mine, m).map((d) =>
        `<a class="gl-pill" href="#${d.id}" data-id="${d.id}" data-scheme="${k}" aria-label="${esc(label(d))}" title="${esc(label(d))}">${day(d)}</a>`).join("")}</div>`).join("");
      return `<div class="gl-row" data-scheme="${k}">
          <button type="button" class="gl-scheme" data-filter-to="${k}" title="Show only ${esc(SCHEMES[k].abbr)} deadlines in the tracker"><span class="gl-key"></span>${esc(SCHEMES[k].abbr)}<b class="num">${mine.length}</b></button>
          ${cells}
        </div>`;
    }).join("");

    const agenda = months.map((m, i) => {
      const list = inMonth(items, m);
      if (!list.length) return "";
      return `<li><span class="gl-ag-month">${m.toLocaleString("en-GB", { month: "short" })}${i === 0 || m.getMonth() === 0 ? ` ${m.getFullYear()}` : ""}</span>
          <ul>${list.map((d) => `<li data-scheme="${d.scheme}"><a href="#${d.id}" data-open="${d.id}"><span class="num">${day(d)}</span><span><span class="gl-ag-scheme">${esc(SCHEMES[d.scheme].abbr)}</span><span class="gl-ag-title">${esc(d.title)}</span></span></a></li>`).join("")}</ul>
        </li>`;
    }).join("");

    const next = items[0];
    return `
      <div class="glance">
        <div class="glance-head">
          <div>
            <span class="eyebrow">Year at a glance</span>
            <h2 class="glance-title">The next 12 months, scheme by scheme</h2>
          </div>
          <p class="glance-intro">Each pill is a deadline, showing its day of the month. Hover or tap one for details, pick a month to list it, or pick a scheme to filter the tracker.</p>
        </div>
        <div class="glance-body">
          <div class="gl-grid" style="--today:${todayPct}%" role="group" aria-label="${items.length} deadlines over the next 12 months, by scheme and month">
            <div class="gl-row gl-head"><span class="gl-corner">Scheme</span>${head}</div>
            ${rows}
            <p class="gl-key-note">The line marks today, ${TODAY.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Months with 3 or more deadlines are in bold.</p>
          </div>
          <ol class="gl-agenda" aria-label="Deadlines by month">${agenda}</ol>
          <div class="gl-detail" id="glanceDetail" aria-live="polite">${glanceDetail(next, "Next deadline")}</div>
        </div>
      </div>`;
  }

  /* Everything the build writes into index.html, keyed by marker name */
  function all() {
    const st = stats();
    return {
      nextDeadline: heroNext(),
      nextList: nextList(),
      statDeadlines: st.deadlines,
      statSchemes: st.schemes,
      statVerified: st.verified,
      schemeStrip: schemeStrip(),
      ribbon: glance(), /* the hero diagram slot (marker kept as "ribbon") */
      resultCount: resultCount(CC.upcoming.length, false),
      listView: list(CC.upcoming),
      horizonGrid: horizon(CC.horizon),
      changesGrid: changes(),
      schemesGrid: schemes()
    };
  }

  CC.home = { heroNext, nextList, stats, schemeStrip, glance, glanceDetail, glanceMonth, resultCount, list, horizon, changes, schemes, all };
})();
