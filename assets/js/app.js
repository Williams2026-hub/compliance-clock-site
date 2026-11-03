/* Compliance Clock — home page behaviour
   Filters, views and buttons for the tracker. The HTML comes from
   home-render.js (also used by tools/build.js to pre-render index.html). */
(function () {
  "use strict";

  const { SCHEMES, SECTORS, SIZES, TODAY, $, $$, esc, parse, daysUntil, fmtLong,
    upcoming, horizon, byId, countdown } = window.CC;
  const H = window.CC.home;
  const REGIONS = ["UK", "EU", "Global"];

  /* ---------- State (mirrored in the URL so filtered views can be shared) ---------- */
  const state = { schemes: new Set(), regions: new Set(), sector: "", size: "", window: "all", q: "", view: "list" };

  function readURL() {
    const p = new URLSearchParams(location.search);
    (p.get("scheme") || "").split(",").filter((k) => SCHEMES[k]).forEach((k) => state.schemes.add(k));
    (p.get("region") || "").split(",").filter((r) => REGIONS.includes(r)).forEach((r) => state.regions.add(r));
    if (SECTORS[p.get("sector")]) state.sector = p.get("sector");
    if (SIZES[p.get("size")]) state.size = p.get("size");
    if (["30", "90", "365"].includes(p.get("window"))) state.window = p.get("window");
    state.q = p.get("q") || "";
    if (p.get("view") === "timeline") state.view = "timeline";
  }

  function writeURL() {
    const p = new URLSearchParams();
    if (state.schemes.size) p.set("scheme", [...state.schemes].join(","));
    if (state.regions.size) p.set("region", [...state.regions].join(","));
    if (state.sector) p.set("sector", state.sector);
    if (state.size) p.set("size", state.size);
    if (state.window !== "all") p.set("window", state.window);
    if (state.q) p.set("q", state.q);
    if (state.view !== "list") p.set("view", state.view);
    const qs = p.toString();
    try { history.replaceState(null, "", (qs ? "?" + qs : location.pathname) + location.hash); } catch (e) { /* file:// in some browsers */ }
  }

  function matches(d, { ignoreWindow = false } = {}) {
    if (state.schemes.size && !state.schemes.has(d.scheme)) return false;
    if (state.regions.size && !state.regions.has(d.region)) return false;
    if (state.sector && !(d.sectors.includes("all") || d.sectors.includes(state.sector))) return false;
    if (state.size && !(d.sizes.includes("all") || d.sizes.includes(state.size))) return false;
    if (!ignoreWindow && state.window !== "all" && d.date && daysUntil(d.date) > Number(state.window)) return false;
    if (state.q) {
      const hay = [d.title, d.desc, d.who, SCHEMES[d.scheme].abbr, SCHEMES[d.scheme].name, d.region].join(" ").toLowerCase();
      if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  const activeFilterCount = () =>
    state.schemes.size + state.regions.size + (state.sector ? 1 : 0) + (state.size ? 1 : 0) + (state.window !== "all" ? 1 : 0);

  /* ---------- Hero (refreshed on load so countdowns use today's date) ---------- */
  function renderHero() {
    $("#nextDeadline").innerHTML = H.heroNext();
    $("#nextList").innerHTML = H.nextList();
    const st = H.stats();
    $("#statDeadlines").textContent = st.deadlines;
    $("#statSchemes").textContent = st.schemes;
    $("#statVerified").textContent = st.verified;
    $("#schemeStrip").innerHTML = H.schemeStrip();
  }

  /* ---------- Filters UI ---------- */
  function buildFilters() {
    $("#schemeChips").innerHTML = Object.entries(SCHEMES).map(([k, s]) =>
      `<button type="button" class="chip" data-scheme="${k}" data-filter-scheme="${k}" aria-pressed="false"><span class="dot"></span>${esc(s.abbr)}</button>`).join("");
    $("#regionChips").innerHTML = REGIONS.map((r) =>
      `<button type="button" class="chip" data-filter-region="${r}" aria-pressed="false">${r === "Global" ? "International" : r}</button>`).join("");
    window.CC.selectOptions($("#sectorSelect"), SECTORS);
    window.CC.selectOptions($("#sizeSelect"), SIZES);
    window.CC.selectOptions($("#signupSector"), SECTORS);
    window.CC.selectOptions($("#signupSize"), SIZES);

    $("#schemeChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter-scheme]"); if (!b) return;
      const k = b.dataset.filterScheme;
      state.schemes.has(k) ? state.schemes.delete(k) : state.schemes.add(k);
      update();
    });
    $("#regionChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter-region]"); if (!b) return;
      const r = b.dataset.filterRegion;
      state.regions.has(r) ? state.regions.delete(r) : state.regions.add(r);
      update();
    });
    $("#sectorSelect").addEventListener("change", (e) => { state.sector = e.target.value; update(); });
    $("#sizeSelect").addEventListener("change", (e) => { state.size = e.target.value; update(); });
    $("#windowSelect").addEventListener("change", (e) => { state.window = e.target.value; update(); });
    let t;
    $("#searchInput").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); update(); }, 150); });
    $("#clearFilters").addEventListener("click", () => {
      state.schemes.clear(); state.regions.clear(); state.sector = ""; state.size = ""; state.window = "all"; state.q = "";
      $("#searchInput").value = ""; update();
    });
    $$(".segmented [data-view]").forEach((b) => b.addEventListener("click", () => { state.view = b.dataset.view; update(); }));

    // Mobile bottom sheet
    const open = () => { $("#filters").classList.add("open"); $("#scrim").classList.add("show"); };
    const close = () => { $("#filters").classList.remove("open"); $("#scrim").classList.remove("show"); };
    $("#openFilters").addEventListener("click", open);
    $("#closeFilters").addEventListener("click", close);
    $("#applyFilters").addEventListener("click", close);
    $("#scrim").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function syncFilterUI() {
    $$("[data-filter-scheme]").forEach((b) => b.setAttribute("aria-pressed", state.schemes.has(b.dataset.filterScheme)));
    $$("[data-filter-region]").forEach((b) => b.setAttribute("aria-pressed", state.regions.has(b.dataset.filterRegion)));
    $("#sectorSelect").value = state.sector;
    $("#sizeSelect").value = state.size;
    $("#windowSelect").value = state.window;
    if ($("#searchInput").value.trim() !== state.q) $("#searchInput").value = state.q;
    $$(".segmented [data-view]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === state.view));
    const n = activeFilterCount();
    $("#filterBtnLabel").textContent = n ? `Filters (${n})` : "Filters";
  }

  /* ---------- List view ---------- */
  function renderList(items) {
    $("#listView").innerHTML = H.list(items);
  }

  /* ---------- Timeline view ---------- */
  function renderTimeline(items) {
    const view = $("#timelineView");
    if (!items.length) { view.innerHTML = `<div class="empty"><h3>No deadlines match</h3><p>Try removing a filter.</p></div>`; return; }
    const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    const last = parse(items[items.length - 1].date);
    const end = new Date(Math.max(last.getFullYear(), TODAY.getFullYear() + 1), 11, 31);
    const months = [];
    for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) months.push(new Date(d));
    const span = end - start;
    const pos = (date) => ((date - start) / span) * 100;
    const cols = `repeat(${months.length}, 1fr)`;
    const schemesUsed = Object.keys(SCHEMES).filter((k) => items.some((d) => d.scheme === k));
    const todayLeft = pos(TODAY);

    const head = `
      <div class="tl-row tl-head">
        <div class="tl-label">Scheme</div>
        <div class="tl-track" style="grid-template-columns:${cols}">
          ${months.map((m) => `<div class="tl-month${m.getMonth() === 0 ? " year" : ""}">${m.getMonth() === 0 || m === months[0] ? m.toLocaleString("en-GB", { month: "short", year: "numeric" }) : m.toLocaleString("en-GB", { month: "short" })}</div>`).join("")}
        </div>
      </div>`;
    const rows = schemesUsed.map((k) => `
      <div class="tl-row" data-scheme="${k}">
        <div class="tl-label"><span class="dot"></span>${esc(SCHEMES[k].abbr)}</div>
        <div class="tl-track">
          <div class="tl-gridlines" style="grid-template-columns:${cols}">${months.map(() => "<span></span>").join("")}</div>
          <div class="tl-today" style="left:${todayLeft}%"></div>
          ${items.filter((d) => d.scheme === k).map((d) =>
            `<button type="button" class="tl-marker" style="left:${pos(parse(d.date))}%" data-goto="${d.id}" aria-label="${esc(fmtLong(d.date))}: ${esc(d.title)}"></button>`).join("")}
        </div>
      </div>`).join("");

    view.innerHTML = `
      <div class="timeline">
        <div class="timeline-scroll"><div class="timeline-inner">${head}${rows}</div></div>
        <div class="timeline-legend"><span>Hover or tap a dot for details. Select it to jump to the deadline in the list.</span></div>
      </div>`;
  }

  function wireTimeline() {
    const tip = $("#tlTooltip");
    const show = (el) => {
      const d = byId[el.dataset.goto];
      tip.innerHTML = `<b>${esc(d.title)}</b>${esc(SCHEMES[d.scheme].abbr)} · ${esc(fmtLong(d.date))} · ${countdown(d.date, d.precision).text}<br>${esc(d.who)}`;
      const r = el.getBoundingClientRect();
      tip.classList.add("show");
      const w = tip.offsetWidth;
      tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
      tip.style.top = (r.top - tip.offsetHeight - 10 < 8 ? r.bottom + 10 : r.top - tip.offsetHeight - 10) + "px";
    };
    const hide = () => tip.classList.remove("show");
    const view = $("#timelineView");
    view.addEventListener("mouseover", (e) => { const m = e.target.closest(".tl-marker"); if (m) show(m); });
    view.addEventListener("mouseout", (e) => { if (e.target.closest(".tl-marker")) hide(); });
    view.addEventListener("focusin", (e) => { const m = e.target.closest(".tl-marker"); if (m) show(m); });
    view.addEventListener("focusout", hide);
    view.addEventListener("click", (e) => {
      const m = e.target.closest(".tl-marker"); if (!m) return;
      hide(); state.view = "list"; update();
      const el = document.getElementById(m.dataset.goto);
      if (el) { location.hash = m.dataset.goto; el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- Horizon ---------- */
  function renderHorizon() {
    const items = horizon.filter((d) => matches(d, { ignoreWindow: true }));
    $("#horizon").hidden = !items.length;
    $("#horizonGrid").innerHTML = H.horizon(items);
  }

  /* ---------- Update loop ---------- */
  function update() {
    syncFilterUI();
    writeURL();
    const items = upcoming.filter((d) => matches(d));
    const n = activeFilterCount() + (state.q ? 1 : 0);
    $("#resultCount").innerHTML = H.resultCount(items.length, n > 0);
    $("#listView").hidden = state.view !== "list";
    $("#timelineView").hidden = state.view !== "timeline";
    if (state.view === "list") renderList(items); else renderTimeline(items);
    renderHorizon();
  }

  readURL();
  renderHero();
  buildFilters();
  $("#changesGrid").innerHTML = H.changes();
  $("#schemesGrid").innerHTML = H.schemes();
  window.CC.wireDeadlineActions($("#listView"));
  wireTimeline();
  window.CC.wireSignup($("#signupForm"));
  window.CC.wireChrome(".scheme-card, .change-card, .pack, .partner-card, .alert-band");
  update();

  // Deep link to a deadline (#id) after first render
  if (location.hash.length > 1) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) setTimeout(() => el.scrollIntoView({ block: "center" }), 50);
  }
})();
