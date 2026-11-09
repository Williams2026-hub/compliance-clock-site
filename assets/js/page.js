/* Compliance Clock — behaviour for content pages (about, methodology, privacy, terms, contact) */
(function () {
  "use strict";

  const { $ } = window.CC;
  window.CC.wireChrome(".person-card, .status-table, .principle");

  /* Contact form: pre-fill from the link (contact.html?topic=error&deadline=<id>) */
  const form = $("#contactForm");
  if (!form) return;
  const p = new URLSearchParams(location.search);
  const topic = $("#topic");
  /* Compare with the real options rather than building a CSS selector from the link,
     so an odd ?topic= value can't throw and stop the rest of this script. */
  const wanted = p.get("topic");
  if (wanted && Array.from(topic.options).some((o) => o.value === wanted)) topic.value = wanted;
  const dl = p.get("deadline");
  if (dl && window.CC.byId[dl]) {
    const d = window.CC.byId[dl];
    const abbr = window.CC.SCHEMES[d.scheme].abbr;
    const title = d.title.startsWith(abbr) ? d.title : `${abbr}: ${d.title}`;
    $("#deadlineRef").value = d.date ? `${title} (${window.CC.fmtLong(d.date)})` : title;
  }
  const showSent = () => form.classList.add("done");
  if (p.get("sent") === "1") showSent();

  /* Netlify Forms handles the real submission on the live site (or a Netlify preview).
     Anywhere else (local preview, a shared preview link) there's nothing to receive it,
     so just show the thank-you message. */
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
    const live = /(^|\.)complianceclock\.co\.uk$|\.netlify\.app$/.test(location.hostname);
    if (!live) { e.preventDefault(); showSent(); }
  });
})();
