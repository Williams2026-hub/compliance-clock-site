/* Compliance Clock — home page behaviour
   Filters and buttons for the tracker and the year-at-a-glance grid. The HTML comes from
   home-render.js (also used by tools/build.js to pre-render index.html). */
(function () {
  "use strict";

  const { SCHEMES, SECTORS, SIZES, $, $$, esc, daysUntil, upcoming, horizon, byId } = window.CC;
  const H = window.CC.home;
  const REGIONS = ["UK", "EU", "Global"];

  /* ---------- State (mirrored in the URL so filtered views can be shared) ---------- */
  const state = { schemes: new Set(), regions: new Set(), sector: "", size: "", window: "all", q: "" };

  function readURL() {
    const p = new URLSearchParams(location.search);
    (p.get("scheme") || "").split(",").filter((k) => SCHEMES[k]).forEach((k) => state.schemes.add(k));
    (p.get("region") || "").split(",").filter((r) => REGIONS.includes(r)).forEach((r) => state.regions.add(r));
    if (SECTORS[p.get("sector")]) state.sector = p.get("sector");
    if (SIZES[p.get("size")]) state.size = p.get("size");
    if (["30", "90", "365"].includes(p.get("window"))) state.window = p.get("window");
    state.q = p.get("q") || "";
  }

  function writeURL() {
    const p = new URLSearchParams();
    if (state.schemes.size) p.set("scheme", [...state.schemes].join(","));
    if (state.regions.size) p.set("region", [...state.regions].join(","));
    if (state.sector) p.set("sector", state.sector);
    if (state.size) p.set("size", state.size);
    if (state.window !== "all") p.set("window", state.window);
    if (state.q) p.set("q", state.q);
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
    $("#ribbon").innerHTML = H.glance();
  }

  /* ---------- Year at a glance ----------
     Hover/focus/tap a pill → its details in the side panel (a tap doesn't jump away).
     Select a month → that month's deadlines. Select a scheme → filter the tracker to it.
     "Full details" links open the deadline's row in the tracker. */
  function wireGlance() {
    const root = $("#ribbon");
    if (!root) return;
    const detail = () => $("#glanceDetail");
    const clearActive = () => $$(".gl-pill.is-active, .gl-month.is-selected", root).forEach((el) => el.classList.remove("is-active", "is-selected"));
    const showPill = (pill) => {
      const d = byId[pill.dataset.id];
      if (!d || !detail()) return;
      clearActive();
      pill.classList.add("is-active");
      detail().innerHTML = H.glanceDetail(d);
    };
    const showMonth = (btn) => {
      if (!detail()) return;
      clearActive();
      btn.classList.add("is-selected");
      detail().innerHTML = H.glanceMonth(btn.dataset.month);
    };

    root.addEventListener("mouseover", (e) => { const p = e.target.closest(".gl-pill"); if (p) showPill(p); });
    root.addEventListener("focusin", (e) => { const p = e.target.closest(".gl-pill"); if (p) showPill(p); });
    root.addEventListener("click", (e) => {
      const pill = e.target.closest(".gl-pill");
      if (pill) { e.preventDefault(); showPill(pill); return; }
      const month = e.target.closest(".gl-month"); if (month) return showMonth(month);
      const scheme = e.target.closest("[data-filter-to]");
      if (scheme) {
        state.schemes = new Set([scheme.dataset.filterTo]);
        update();
        $("#tracker").scrollIntoView({ behavior: "smooth" });
        return;
      }
      const open = e.target.closest("[data-open]");
      if (open) { e.preventDefault(); showInList(open.dataset.open); }
    });
  }

  /* Show a deadline's row in the tracker, clearing filters that hide it */
  function showInList(id) {
    if (!document.getElementById(id)) {
      clearFilters();
      update();
    }
    history.replaceState(null, "", location.pathname + location.search + "#" + id);
    window.CC.openDeadline(id);
  }

  /* ---------- Filters UI ----------
     A bar of labelled controls above the list (a bottom sheet on phones), a scheme dropdown
     with tick boxes, and removable tags for whatever is active. */
  const regionName = (r) => r === "Global" ? "International" : r;
  const WINDOW_LABEL = { 30: "Next 30 days", 90: "Next 90 days", 365: "Next 12 months" };

  function clearFilters() {
    state.schemes.clear(); state.regions.clear(); state.sector = ""; state.size = ""; state.window = "all"; state.q = "";
  }

  function buildFilters() {
    $("#schemeChips").innerHTML = Object.entries(SCHEMES).map(([k, s]) =>
      `<button type="button" class="dd-option" data-scheme="${k}" data-filter-scheme="${k}" aria-pressed="false">
        <span class="dd-check" aria-hidden="true"></span><span class="dd-key" aria-hidden="true"></span>
        <span class="dd-text"><b>${esc(s.abbr)}</b><small>${esc(s.name)}</small></span>
      </button>`).join("");
    $("#regionChips").innerHTML = REGIONS.map((r) =>
      `<button type="button" data-filter-region="${r}" aria-pressed="false">${regionName(r)}</button>`).join("");
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
    $("#clearFilters").addEventListener("click", () => { clearFilters(); update(); });

    // Active filter tags: × removes that one filter
    $("#activeFilters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]"); if (!b) return;
      const [kind, v] = b.dataset.remove.split(":");
      if (kind === "scheme") state.schemes.delete(v);
      if (kind === "region") state.regions.delete(v);
      if (kind === "sector") state.sector = "";
      if (kind === "size") state.size = "";
      if (kind === "window") state.window = "all";
      if (kind === "q") { state.q = ""; $("#searchInput").value = ""; }
      update();
    });

    // Scheme dropdown
    const dd = $("#schemeDropdown"), toggle = $("#schemeToggle");
    const setOpen = (open) => { dd.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", open); };
    toggle.addEventListener("click", () => setOpen(!dd.classList.contains("is-open")));
    document.addEventListener("click", (e) => { if (!dd.contains(e.target)) setOpen(false); });
    dd.addEventListener("keydown", (e) => { if (e.key === "Escape") { setOpen(false); toggle.focus(); } });

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
    const picked = [...state.schemes];
    $("#schemeToggleLabel").textContent = !picked.length ? "All schemes" : picked.length === 1 ? SCHEMES[picked[0]].abbr : `${picked.length} schemes`;
    $("#schemeToggle").classList.toggle("is-set", picked.length > 0);
    ["sectorSelect", "sizeSelect"].forEach((id) => $("#" + id).classList.toggle("is-set", !!$("#" + id).value));
    $("#windowSelect").classList.toggle("is-set", state.window !== "all");
    const n = activeFilterCount();
    $("#filterBtnLabel").textContent = n ? `Filters (${n})` : "Filters";

    const tag = (remove, text, scheme) =>
      `<button type="button" class="fb-tag" data-remove="${remove}"${scheme ? ` data-scheme="${scheme}"` : ""} aria-label="Remove filter: ${esc(text)}">${scheme ? `<span class="dd-key"></span>` : ""}${esc(text)}<span class="fb-x" aria-hidden="true"></span></button>`;
    const tags = [
      state.sector && tag("sector", SECTORS[state.sector]),
      state.size && tag("size", SIZES[state.size] + " companies"),
      ...picked.map((k) => tag("scheme:" + k, SCHEMES[k].abbr, k)),
      ...[...state.regions].map((r) => tag("region:" + r, regionName(r))),
      state.window !== "all" && tag("window", WINDOW_LABEL[state.window]),
      state.q && tag("q", `“${state.q}”`)
    ].filter(Boolean);
    $("#activeFilters").innerHTML = tags.join("");
    $("#clearFilters").hidden = !tags.length;
  }

  /* ---------- List view ---------- */
  function renderList(items) {
    $("#listView").innerHTML = H.list(items);
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
    renderList(items);
    renderHorizon();
  }

  readURL();
  renderHero();
  buildFilters();
  $("#changesGrid").innerHTML = H.changes();
  $("#schemesGrid").innerHTML = H.schemes();
  window.CC.wireDeadlineActions($("#listView"));
  wireGlance();
  window.CC.wireSignup($("#signupForm"));
  window.CC.wireChrome(".scheme-card, .change-card, .pack, .partner-card, .alert-band");
  update();
})();
