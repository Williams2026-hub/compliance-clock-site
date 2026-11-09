/* Compliance Clock — scheme page renderer (no DOM access)
   Builds the HTML for one scheme page from CC_SCHEME_CONTENT (schemes.js)
   and the matching deadlines/changes in deadlines.js.
   Used twice: by tools/build.js to write the static pages in site/schemes/,
   and by scheme.js in the browser to refresh countdowns on page load. */
(function () {
  "use strict";

  /* key:  scheme key, e.g. "ukets"
     opts: { root: path back to the site root ("../" from site/schemes/),
             schemeBase: prefix for links to other scheme pages ("" from site/schemes/) } */
  function renderScheme(key, opts) {
    const { SCHEMES, esc, fmt, fmtLong, daysUntil, upcoming, horizon, countdown,
      schemeUrl, schemeBadge, statusBadge, deadlineRow } = window.CC;
    const root = opts.root;
    const href = (k) => schemeUrl(k, opts.schemeBase);
    const s = SCHEMES[key];
    const c = window.CC_SCHEME_CONTENT[key];
    const items = upcoming.filter((d) => d.scheme === key);
    const later = horizon.filter((d) => d.scheme === key);
    const changes = window.CC_CHANGES.filter((ch) => ch.scheme === key);
    const next = items[0];

    const list = (arr, icon) => `<ul class="scope-list">${arr.map((t) => `<li><svg aria-hidden="true"><use href="#i-${icon}"/></svg><span>${esc(t)}</span></li>`).join("")}</ul>`;

    function nextCard() {
      if (!next) {
        return `<div class="clock-card-top"><span class="eyebrow">Next deadline</span>
          <div class="clock-title" style="margin-top:12px">No fixed date</div>
          <p style="color:var(--muted);font-size:var(--fs-sm);margin-top:8px">${later.length ? esc(later[0].title) : "This obligation recurs with your own reporting cycle."}</p></div>`;
      }
      const n = daysUntil(next.date);
      const C = 2 * Math.PI * 27;
      return `
        <div class="clock-card-top" data-scheme="${key}">
          <svg class="clock-ring" viewBox="0 0 64 64" aria-hidden="true">
            <circle class="track" cx="32" cy="32" r="27"/>
            <circle class="progress" cx="32" cy="32" r="27" stroke-dasharray="${C}" stroke-dashoffset="${C * Math.min(n, 365) / 365}"/>
          </svg>
          <span class="eyebrow">Next ${esc(s.abbr)} deadline</span>
          <div class="clock-days"><strong class="num">${n}</strong><span>${n === 1 ? "day" : "days"} to go</span></div>
          <h2 class="clock-title"><a href="#${next.id}" style="text-decoration:none">${esc(next.title)}</a></h2>
          <div class="clock-meta"><span class="date">${fmt(next.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div>
        </div>
        ${items.length > 1 ? `<div class="clock-next"><h3>Then</h3><ol>${items.slice(1, 3).map((d) => `
          <li data-scheme="${key}"><a href="#${d.id}"><span class="bar"></span>
            <span><span class="t">${esc(d.title)}</span></span>
            <span class="d num">${fmt(d.date, { day: "numeric", month: "short" })}<br><span class="s">${countdown(d.date, d.precision).text}</span></span>
          </a></li>`).join("")}</ol></div>` : ""}`;
    }

    const horizonHtml = later.length ? `
      <div class="horizon-grid" style="margin-top:16px">${later.map((d) => `
        <article class="horizon-item" data-scheme="${d.scheme}" id="${d.id}">
          <div class="when num">${d.precision === "year" ? d.date.slice(0, 4) : d.precision === "tbc" ? "Date TBC" : "Every year"}</div>
          <div class="what">${esc(d.title)}</div>
          <div class="who">${esc(d.who)}</div>
          <div class="badges">${d.status !== "confirmed" ? statusBadge(d.status) : ""}${d.was ? `<span class="badge badge-plain">Was ${esc(d.was)}</span>` : ""}</div>
        </article>`).join("")}</div>` : "";

    const changesHtml = changes.length
      ? `<div class="changes-grid two">${changes.map((ch) => `
          <article class="change-card" data-scheme="${key}">
            <time datetime="${ch.date}">${fmtLong(ch.date)}</time>
            <h3>${esc(ch.title)}</h3>
            <p>${esc(ch.body)}</p>
            <dl class="was-now">${ch.was ? `<dt>Was</dt><dd class="was">${esc(ch.was)}</dd>` : ""}<dt>Now</dt><dd>${esc(ch.now)}</dd></dl>
            <a href="${esc(ch.source)}" target="_blank" rel="noopener" style="font-size:var(--fs-sm);font-weight:600;margin-top:auto">Source ↗</a>
          </article>`).join("")}</div>`
      : `<p class="muted-note">No changes logged for ${esc(s.abbr)} yet. When a date or rule moves, it will appear here and in the monthly email.</p>`;

    const checklistHtml = c.checklist ? `
      <div class="aside-card pack" data-scheme="${key}">
        <div class="pack-cover"><small>Checklist · ${esc(s.abbr)}</small><strong>${esc(c.checklist.title)}</strong></div>
        <p style="font-size:var(--fs-sm);color:var(--ink-2)">Step-by-step tasks, the evidence you need, and a deadline worksheet.</p>
        <div class="pack-foot"><span class="price">${esc(c.checklist.price)} <small>one-off</small></span><a class="btn btn-primary btn-sm" href="${root}index.html#checklists">Get the checklist</a></div>
      </div>` : "";

    const switcher = Object.entries(SCHEMES).map(([k, sc]) =>
      `<a class="chip" data-scheme="${k}" href="${href(k)}"${k === key ? ' aria-current="page" aria-pressed="true"' : ""}><span class="dot"></span>${esc(sc.abbr)}</a>`).join("");

    const html = `
      <section class="scheme-hero" data-scheme="${key}">
        <div class="container">
          <div>
            <a class="crumb" href="${root}index.html#schemes"><svg aria-hidden="true"><use href="#i-back"/></svg> All schemes</a>
            <div class="scheme-hero-badges">${schemeBadge(key)}<span class="badge badge-plain">${esc(s.region)}</span><span class="badge badge-plain">Since ${esc(c.since)}</span></div>
            <h1>${esc(s.abbr)}</h1>
            <p class="scheme-fullname">${esc(s.name)}</p>
            <p class="hero-lede">${esc(c.summary)}</p>
            <div class="hero-cta">
              <a class="btn btn-primary" href="#alerts">Get ${esc(s.abbr)} alerts</a>
              ${items.length ? `<button class="btn btn-secondary" type="button" id="icsAll"><svg width="16" height="16"><use href="#i-cal"/></svg> Add all ${items.length} to calendar</button>` : ""}
            </div>
          </div>
          <aside class="clock-card" aria-label="Next deadline">${nextCard()}</aside>
        </div>
      </section>

      <div class="container">
        <p class="draft-note"><b>Draft guide.</b> We're checking this page against official sources before launch. Always confirm with your regulator.</p>
      </div>

      <div class="container scheme-layout">
        <div class="scheme-main">
          <section class="sp-section" id="scope">
            <span class="eyebrow">Step 1</span>
            <h2>Are you in scope?</h2>
            <div class="scope-grid">
              <div class="scope-card in"><h3>You're probably in if…</h3>${list(c.inScope, "check")}</div>
              <div class="scope-card out"><h3>You're probably out if…</h3>${list(c.outScope, "minus")}</div>
            </div>
            <p class="regulator"><b>Who regulates it:</b> ${esc(c.regulator)}</p>
          </section>

          <section class="sp-section" id="routine">
            <span class="eyebrow">Step 2</span>
            <h2>Your yearly routine</h2>
            <ol class="cycle">${c.cycle.map((st) => `<li><span class="when">${esc(st.when)}</span><span class="what">${esc(st.what)}</span></li>`).join("")}</ol>
          </section>

          <section class="sp-section" id="deadlines">
            <span class="eyebrow">Step 3</span>
            <h2>Upcoming ${esc(s.abbr)} deadlines <small class="num">${items.length}</small></h2>
            <div class="deadline-list" id="schemeDeadlines">${items.length ? items.map(deadlineRow).join("") : `<p class="muted-note">No fixed-date deadlines. See below.</p>`}</div>
            ${horizonHtml}
          </section>

          <section class="sp-section" id="facts">
            <h2>Key facts</h2>
            <dl class="facts">${c.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
            <aside class="tip"><svg aria-hidden="true"><use href="#i-bulb"/></svg><div><b>Practical tip</b><p>${esc(c.tip)}</p></div></aside>
          </section>

          <section class="sp-section" id="changes">
            <h2>Recent changes</h2>
            ${changesHtml}
          </section>
        </div>

        <aside class="scheme-aside">
          <nav class="aside-card toc" aria-label="On this page">
            <h3>On this page</h3>
            <a href="#scope">Are you in scope?</a>
            <a href="#routine">Your yearly routine</a>
            <a href="#deadlines">Upcoming deadlines</a>
            <a href="#facts">Key facts</a>
            <a href="#changes">Recent changes</a>
          </nav>
          ${checklistHtml}
          <div class="aside-card partner-slot">
            <span class="badge sponsored-label">Partner slot</span>
            <h3>Need help with ${esc(s.abbr)}?</h3>
            <p>One verified partner per scheme can feature here. Verifiers and consultants can reach operators at the moment they're looking for help.</p>
            <a class="btn btn-secondary btn-sm" href="${root}index.html#partners">Become the ${esc(s.abbr)} partner</a>
          </div>
          <div class="aside-card">
            <h3>Official sources</h3>
            <ul class="source-list">${c.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} <svg aria-hidden="true"><use href="#i-ext"/></svg></a></li>`).join("")}</ul>
          </div>
          <div class="aside-card">
            <h3>Often goes with</h3>
            <div class="related">${c.related.map((r) => `<a class="chip" data-scheme="${r}" href="${href(r)}"><span class="dot"></span>${esc(SCHEMES[r].abbr)}</a>`).join("")}</div>
          </div>
        </aside>
      </div>`;

    return {
      slug: c.slug,
      title: `${s.abbr}: deadlines and plain-English guide | Compliance Clock`,
      description: `${s.name}: who's in scope, the yearly routine and every upcoming deadline, in plain English.`,
      alertsTitle: `Get ${s.abbr} changes by email`,
      switcher,
      html,
      count: items.length
    };
  }

  window.CC.renderScheme = renderScheme;
})();
