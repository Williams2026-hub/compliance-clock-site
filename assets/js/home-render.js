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
    const { fmt, deadlineCard } = CC;
    if (!items.length) return `<div class="empty"><h3>No deadlines match</h3><p>Try removing a filter or widening the time window.</p></div>`;
    const groups = new Map();
    items.forEach((d) => { const k = d.date.slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(d); });
    return [...groups].map(([k, g]) => `
      <section class="month-group" aria-label="${fmt(k + "-01", { month: "long", year: "numeric" })}">
        <h3 class="month-label">${fmt(k + "-01", { month: "long", year: "numeric" })}<small>${g.length} ${g.length === 1 ? "deadline" : "deadlines"}</small></h3>
        <div class="deadline-list">${g.map(deadlineCard).join("")}</div>
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

  /* "Next 12 months" ribbon: one column per month, one coloured block per deadline */
  function ribbon() {
    const { SCHEMES, TODAY, esc, fmt, fmtLong, upcoming } = CC;
    const months = [];
    for (let i = 0; i < 12; i++) months.push(new Date(TODAY.getFullYear(), TODAY.getMonth() + i, 1));
    const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const inRange = upcoming.filter((d) => months.some((m) => d.date.startsWith(key(m))));
    const cols = months.map((m) => {
      const k = key(m);
      const items = inRange.filter((d) => d.date.startsWith(k));
      const label = m.toLocaleString("en-GB", { month: "short" });
      const year = m.getMonth() === 0 || m === months[0] ? `<small>${m.getFullYear()}</small>` : "";
      return `<li class="rb-col${items.length ? "" : " is-empty"}">
        <div class="rb-stack">${items.map((d) =>
          `<a class="rb" href="#${d.id}" data-scheme="${d.scheme}" title="${esc(SCHEMES[d.scheme].abbr)}: ${esc(d.title)} (${esc(fmtLong(d.date))})"><span class="sr-only">${esc(SCHEMES[d.scheme].abbr)}: ${esc(d.title)}, ${esc(fmtLong(d.date))}</span></a>`).join("")}</div>
        <span class="rb-count num">${items.length || ""}</span>
        <span class="rb-month">${label}${year}</span>
      </li>`;
    }).join("");
    const used = Object.keys(SCHEMES).filter((k) => inRange.some((d) => d.scheme === k));
    return `
      <div class="ribbon" aria-label="Deadlines over the next 12 months">
        <div class="ribbon-head">
          <span class="eyebrow">Next 12 months</span>
          <span class="ribbon-total"><strong class="num">${inRange.length}</strong> deadlines from ${fmt(key(months[0]) + "-01", { month: "long" })} to ${fmt(key(months[11]) + "-01", { month: "long", year: "numeric" })}</span>
        </div>
        <ol class="rb-cols">${cols}</ol>
        <ul class="rb-legend">${used.map((k) => `<li data-scheme="${k}"><span class="rb-key"></span>${esc(SCHEMES[k].abbr)}</li>`).join("")}</ul>
      </div>`;
  }

  /* "Compliance clock" dial: the next 12 months as a circle. Each deadline is a dot at its date,
     coloured by scheme; the hand marks today. Hovering or tapping a dot shows it in the detail
     panel; selecting a month lists that month's deadlines there (wired up in app.js). */
  function dialWindow() {
    const { TODAY, parse, upcoming } = CC;
    const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    const end = new Date(TODAY.getFullYear(), TODAY.getMonth() + 12, 1);
    const months = [];
    for (let i = 0; i <= 12; i++) months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    const items = upcoming.filter((d) => parse(d.date) < end);
    const mkey = (m) => `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
    return { start, end, months, items, mkey };
  }

  /* Detail panel: one deadline */
  function dialDetail(d, heading) {
    const { SCHEMES, esc, fmt, countdown, schemeBadge } = CC;
    if (!d) return `<p class="dial-hint">No deadlines in the next 12 months.</p>`;
    const cd = countdown(d.date, d.precision);
    return `
      <span class="dial-detail-label">${esc(heading || "Selected deadline")}</span>
      <div class="dial-detail-top">${schemeBadge(d.scheme)}<span class="countdown num ${cd.cls}">${cd.text}</span></div>
      <h3 class="dial-detail-title">${esc(d.title)}</h3>
      <p class="dial-detail-date">${fmt(d.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      <p class="dial-detail-who">${esc(d.who)}</p>
      <a class="dial-detail-link" href="#${d.id}">View deadline <span aria-hidden="true">→</span></a>`;
  }

  /* Detail panel: one month */
  function dialMonth(key) {
    const { SCHEMES, esc, fmt, countdown } = CC;
    const { items } = dialWindow();
    const list = items.filter((d) => d.date.startsWith(key));
    const name = fmt(key + "-01", { month: "long", year: "numeric" });
    if (!list.length) return `<span class="dial-detail-label">${esc(name)}</span><p class="dial-hint">No deadlines this month.</p>`;
    return `
      <span class="dial-detail-label">${esc(name)} · ${list.length} ${list.length === 1 ? "deadline" : "deadlines"}</span>
      <ul class="dial-month-list">${list.map((d) => `
        <li data-scheme="${d.scheme}"><a href="#${d.id}" data-id="${d.id}">
          <span class="dml-day num">${fmt(d.date, { day: "numeric" })}</span>
          <span class="dml-text"><span class="dml-scheme">${esc(SCHEMES[d.scheme].abbr)}</span>${esc(d.title)}</span>
          <span class="dml-cd num">${countdown(d.date, d.precision).text}</span>
        </a></li>`).join("")}</ul>`;
  }

  function dial() {
    const { SCHEMES, TODAY, esc, fmtLong, parse, daysUntil } = CC;
    const { start, end, months, items, mkey } = dialWindow();
    const span = end - start;
    const C = 220, R_OUT = 184, R_IN = 100, R_LABEL = 203;
    const ang = (t) => -Math.PI / 2 + 2 * Math.PI * ((t - start) / span);
    const pt = (r, a) => [(C + r * Math.cos(a)).toFixed(1), (C + r * Math.sin(a)).toFixed(1)];
    const counts = months.slice(0, 12).map((m) => items.filter((d) => d.date.startsWith(mkey(m))).length);
    const max = Math.max(1, ...counts);

    const monthGroups = months.slice(0, 12).map((m, i) => {
      const a0 = ang(m), a1 = ang(months[i + 1]), am = (a0 + a1) / 2;
      const [x0, y0] = pt(R_OUT, a0), [x1, y1] = pt(R_OUT, a1), [x2, y2] = pt(R_IN, a1), [x3, y3] = pt(R_IN, a0);
      const [lx, ly] = pt(R_LABEL, am);
      const name = m.toLocaleString("en-GB", { month: "short" }) + (m.getMonth() === 0 ? ` ’${String(m.getFullYear()).slice(2)}` : "");
      const full = m.toLocaleString("en-GB", { month: "long", year: "numeric" });
      const op = counts[i] ? (0.05 + 0.1 * (counts[i] / max)).toFixed(3) : "0.02";
      return `<g class="dial-month-g${i === 0 ? " is-now" : ""}" data-month="${mkey(m)}" tabindex="0" role="button" aria-label="${esc(full)}: ${counts[i]} ${counts[i] === 1 ? "deadline" : "deadlines"}">
        <path class="dial-sector" d="M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z" fill-opacity="${op}"/>
        <text class="dial-month${counts[i] ? " has" : ""}" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central">${name}${counts[i] ? ` <tspan class="dial-count">${counts[i]}</tspan>` : ""}</text>
      </g>`;
    }).join("");
    const ticks = months.slice(0, 12).map((m) => {
      const a = ang(m); const [x0, y0] = pt(R_IN, a), [x1, y1] = pt(R_OUT, a);
      return `<line class="dial-tick" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
    }).join("");

    // Dots: deadlines within ~6° of an earlier one step inwards so they never overlap
    const placed = [];
    const dots = items.map((d) => {
      const a = ang(parse(d.date));
      const near = placed.filter((p) => Math.abs(p - a) < 0.105).length;
      placed.push(a);
      const [x, y] = pt(166 - near * 19, a);
      const label = `${SCHEMES[d.scheme].abbr}: ${d.title} (${fmtLong(d.date)})`;
      return `<a class="dial-dot" href="#${d.id}" data-id="${d.id}" data-scheme="${d.scheme}" data-month="${d.date.slice(0, 7)}" aria-label="${esc(label)}"><title>${esc(label)}</title><circle class="hit" cx="${x}" cy="${y}" r="15"/><circle class="core" cx="${x}" cy="${y}" r="8"/></a>`;
    }).join("");

    const [hx, hy] = pt(R_OUT - 2, ang(TODAY));
    const next = items[0];
    const centre = next ? `
      <circle class="dial-centre" cx="${C}" cy="${C}" r="${R_IN - 12}"/>
      <text class="dial-n" x="${C}" y="${C - 6}" text-anchor="middle">${daysUntil(next.date)}</text>
      <text class="dial-n-label" x="${C}" y="${C + 22}" text-anchor="middle">days to next</text>
      <text class="dial-n-label" x="${C}" y="${C + 38}" text-anchor="middle">deadline</text>` : "";

    const used = Object.keys(SCHEMES).map((k) => [k, items.filter((d) => d.scheme === k).length]).filter(([, c]) => c);
    const busiest = counts.indexOf(Math.max(...counts));

    return `
      <div class="dial-panel">
        <figure class="dial-figure">
          <svg class="dial" viewBox="0 0 440 440" role="group" aria-label="Compliance clock: ${items.length} deadlines over the next 12 months">
            <circle class="dial-rim" cx="${C}" cy="${C}" r="${R_OUT + 10}"/>
            ${monthGroups}${ticks}
            <line class="dial-hand" x1="${C}" y1="${C}" x2="${hx}" y2="${hy}"/>
            <circle class="dial-hand-tip" cx="${hx}" cy="${hy}" r="4"/>
            ${centre}
            ${dots}
          </svg>
          <figcaption class="dial-caption">Today is marked by the hand. Busiest: <strong>${esc(months[busiest].toLocaleString("en-GB", { month: "long", year: "numeric" }))}</strong> (${counts[busiest]}).</figcaption>
        </figure>
        <div class="dial-side">
          <span class="eyebrow">The compliance clock</span>
          <h2 class="dial-title">Your next 12 months at a glance</h2>
          <p class="dial-intro">Hover or tap a dot to see the deadline. Select a month to list everything due that month.</p>
          <div class="dial-detail" id="dialDetail" aria-live="polite">${dialDetail(next, "Next deadline")}</div>
          <ul class="dial-legend" aria-label="Schemes">${used.map(([k, c]) => `<li data-scheme="${k}" tabindex="0"><span class="dial-key"></span>${esc(SCHEMES[k].abbr)}<b class="num">${c}</b></li>`).join("")}</ul>
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
      ribbon: dial(), /* the hero diagram slot (marker kept as "ribbon") */
      resultCount: resultCount(CC.upcoming.length, false),
      listView: list(CC.upcoming),
      horizonGrid: horizon(CC.horizon),
      changesGrid: changes(),
      schemesGrid: schemes()
    };
  }

  CC.home = { heroNext, nextList, stats, schemeStrip, ribbon, dial, dialDetail, dialMonth, resultCount, list, horizon, changes, schemes, all };
})();
