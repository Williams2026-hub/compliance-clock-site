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
      resultCount: resultCount(CC.upcoming.length, false),
      listView: list(CC.upcoming),
      horizonGrid: horizon(CC.horizon),
      changesGrid: changes(),
      schemesGrid: schemes()
    };
  }

  CC.home = { heroNext, nextList, stats, schemeStrip, resultCount, list, horizon, changes, schemes, all };
})();
