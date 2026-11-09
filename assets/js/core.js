/* Compliance Clock — shared helpers used by every page.
   Exposes window.CC. Load after deadlines.js and before page scripts. */
(function () {
  "use strict";

  const SCHEMES = window.CC_SCHEMES;
  const SECTORS = window.CC_SECTORS;
  const SIZES = window.CC_SIZES;
  const ALL = window.CC_DEADLINES;
  const DAY = 86400000;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* The id in the address bar after "#", or "" if it's missing or malformed (e.g. "#%E0") */
  const hashId = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return ""; } };

  /* ---------- Dates ---------- */
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const TODAY = startOfDay(new Date());
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const daysUntil = (iso) => Math.round((parse(iso) - TODAY) / DAY);
  const fmt = (iso, opts) => new Intl.DateTimeFormat("en-GB", opts).format(parse(iso));
  const fmtLong = (iso) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });
  const fmtShort = (iso) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });

  const isDated = (d) => d.precision === "day" || d.precision === "month";
  const dated = ALL.filter(isDated).sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = dated.filter((d) => daysUntil(d.date) >= 0);
  const horizon = ALL.filter((d) => !isDated(d));
  const byId = Object.fromEntries(ALL.map((d) => [d.id, d]));

  function countdown(iso, precision) {
    const n = daysUntil(iso);
    if (n < 0) return { text: "Passed", cls: "past" };
    if (precision === "month") return { text: n < 31 ? "This month" : `in ~${n} days`, cls: n <= 30 ? "soon" : "" };
    if (n === 0) return { text: "Today", cls: "soon" };
    if (n === 1) return { text: "Tomorrow", cls: "soon" };
    return { text: `in ${n} days`, cls: n <= 30 ? "soon" : "" };
  }

  const STATUS_LABEL = { confirmed: "Confirmed", verify: "Date to verify", expected: "Expected", changed: "Changed", watch: "Watch" };

  /* ---------- Scheme pages ---------- */
  /* Static pages live in site/schemes/<slug>.html (built by tools/build.js).
     base: "schemes/" from the site root, "" from inside site/schemes/. */
  const schemeUrl = (k, base = "schemes/") => `${base}${(window.CC_SCHEME_CONTENT && window.CC_SCHEME_CONTENT[k] && window.CC_SCHEME_CONTENT[k].slug) || k}.html`;

  /* ---------- Fragments ---------- */
  const schemeBadge = (k) => `<span class="badge" data-scheme="${k}"><span class="dot"></span>${esc(SCHEMES[k].abbr)}</span>`;
  const statusBadge = (s) => `<span class="badge status-${s}">${STATUS_LABEL[s]}</span>`;
  const sectorTags = (d) => d.sectors.includes("all")
    ? `<span class="tag">All sectors</span>`
    : d.sectors.map((s) => `<span class="tag">${esc(SECTORS[s])}</span>`).join("");
  const sizeTag = (d) => d.sizes.includes("all") ? "" : `<span class="tag">${d.sizes.map((s) => esc(SIZES[s])).join(", ")} companies</span>`;

  /* One deadline as a compact row: date, title, who it affects and time left at a glance.
     Opening the row shows the detail, source and calendar/copy-link buttons. */
  function deadlineRow(d) {
    const dt = parse(d.date);
    const cd = countdown(d.date, d.precision);
    const approx = d.precision === "month";
    const date = approx
      ? `<span class="dl-date approx"><span class="day">${fmt(d.date, { month: "short" })}</span><span class="mon">Day TBC</span></span>`
      : `<span class="dl-date"><span class="day num">${dt.getDate()}</span><span class="mon">${fmt(d.date, { month: "short" })} · ${fmt(d.date, { weekday: "short" })}</span></span>`;
    const note = d.note ? `<div class="deadline-note ${d.status === "verify" ? "verify" : ""}"><b>${d.status === "verify" ? "Check:" : "Note:"}</b> ${esc(d.note)}</div>` : "";
    return `
      <details class="dl-row" id="${d.id}" data-scheme="${d.scheme}">
        <summary>
          ${date}
          <span class="dl-main">
            <span class="dl-title">${esc(d.title)}</span>
            <span class="dl-who"><span class="dl-scheme">${esc(SCHEMES[d.scheme].abbr)}</span><span class="sr-only">Who it affects: </span>${esc(d.who)}</span>
          </span>
          <span class="dl-side">${d.status !== "confirmed" ? statusBadge(d.status) : ""}<span class="countdown num ${cd.cls}">${cd.text}</span></span>
          <span class="dl-chevron" aria-hidden="true"></span>
        </summary>
        <div class="dl-more">
          <p class="deadline-desc">${esc(d.desc)}</p>
          ${note}
          <div class="deadline-meta">
            <span class="tags">${schemeBadge(d.scheme)}<span class="badge badge-plain">${esc(d.region)}</span>${sectorTags(d)}${sizeTag(d)}</span>
          </div>
          <div class="dl-foot">
            <span class="dl-checked">Checked ${fmtShort(d.verified)} · <a href="${esc(d.source)}" target="_blank" rel="noopener">Official source ↗</a></span>
            <span class="deadline-actions">
              <button class="btn btn-secondary btn-sm" type="button" data-ics="${d.id}" aria-label="Add “${esc(d.title)}” to calendar"><svg width="16" height="16" aria-hidden="true"><use href="#i-cal"/></svg> Add to calendar</button>
              <button class="btn btn-ghost btn-sm" type="button" data-share="${d.id}" aria-label="Copy link to this deadline"><svg width="16" height="16" aria-hidden="true"><use href="#i-share"/></svg> Copy link</button>
            </span>
          </div>
        </div>
      </details>`;
  }

  /* ---------- Calendar (.ics) ---------- */
  const ymd = (dt) => `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}`;
  const icsEsc = (s) => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => "\\" + c).replace(/\n/g, "\\n");

  function icsEvent(d, stamp) {
    const start = parse(d.date);
    const end = new Date(start.getTime() + DAY);
    return [
      "BEGIN:VEVENT",
      `UID:${d.id}@complianceclock`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(start)}`, `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${icsEsc(SCHEMES[d.scheme].abbr + ": " + d.title)}`,
      `DESCRIPTION:${icsEsc(d.desc + "\n\nWho it affects: " + d.who + "\n\nSource: " + d.source + "\n\nInformation, not advice. Always confirm with your regulator.")}`,
      `URL:${d.source}`,
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(d.title)}`, "TRIGGER:-P7D", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(d.title)}`, "TRIGGER:-P30D", "END:VALARM",
      "END:VEVENT"
    ];
  }

  function downloadIcs(list, filename) {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Compliance Clock//Deadlines//EN", "CALSCALE:GREGORIAN",
      ...list.flatMap((d) => icsEvent(d, stamp)), "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400);
  }


  /* Open a deadline row (by id) and bring it into view. Returns false if it isn't on the page. */
  function openDeadline(id, smooth = true) {
    const el = document.getElementById(id);
    if (!el || el.tagName !== "DETAILS") return false;
    el.open = true;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
    return true;
  }

  /* Calendar and copy-link buttons on deadline rows inside `container`; #id links open their row */
  function wireDeadlineActions(container) {
    container.addEventListener("click", async (e) => {
      const cal = e.target.closest("[data-ics]");
      if (cal) {
        const d = byId[cal.dataset.ics];
        downloadIcs([d], `${d.id}.ics`);
        toast("Calendar file downloaded");
        return;
      }
      const sh = e.target.closest("[data-share]");
      if (sh) {
        const link = location.href.split("#")[0] + "#" + sh.dataset.share;
        try { await navigator.clipboard.writeText(link); toast("Link copied"); }
        catch (err) { history.replaceState(null, "", "#" + sh.dataset.share); toast("Link is in the address bar"); }
      }
    });
    const fromHash = (smooth) => { const id = hashId(); return id && openDeadline(id, smooth); };
    window.addEventListener("hashchange", () => fromHash(true));
    setTimeout(() => fromHash(false), 50);
  }

  /* ---------- Signup (placeholder until the email provider is connected) ---------- */
  function wireSignup(form) {
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("input[type=email]", form);
      if (!email.value || !email.checkValidity()) { email.focus(); email.style.borderColor = "#F58A7E"; return; }
      form.classList.add("done");
    });
  }

  /* ---------- Theme, menu, footer year, reveal motion ---------- */
  function wireChrome(revealSelector) {
    const root = document.documentElement;
    const btn = $("#themeToggle");
    const isDark = () => root.dataset.theme === "dark"; /* light is the default; dark only by choice */
    const paint = () => { btn.innerHTML = `<svg><use href="#i-${isDark() ? "sun" : "moon"}"/></svg>`; btn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme"); };
    try { const saved = localStorage.getItem("cc-theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
    if (btn) {
      paint();
      btn.addEventListener("click", () => {
        root.dataset.theme = isDark() ? "light" : "dark";
        try { localStorage.setItem("cc-theme", root.dataset.theme); } catch (e) {}
        paint();
      });
    }

    const nav = $("#nav"), mt = $("#menuToggle");
    if (nav && mt) {
      mt.addEventListener("click", () => { const o = nav.classList.toggle("open"); mt.setAttribute("aria-expanded", o); });
      nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); mt.setAttribute("aria-expanded", false); } });
    }

    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    if (revealSelector && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
      $$(revealSelector).forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
    }
  }

  function selectOptions(select, obj) {
    if (select) select.insertAdjacentHTML("beforeend", Object.entries(obj).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join(""));
  }

  window.CC = {
    SCHEMES, SECTORS, SIZES, ALL, DAY, TODAY,
    $, $$, esc, hashId, parse, daysUntil, fmt, fmtLong, fmtShort,
    isDated, dated, upcoming, horizon, byId, countdown, STATUS_LABEL,
    schemeUrl, schemeBadge, statusBadge, deadlineRow, openDeadline,
    downloadIcs, toast, wireDeadlineActions, wireSignup, wireChrome, selectOptions
  };
})();
