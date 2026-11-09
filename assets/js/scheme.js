/* Compliance Clock — scheme page behaviour (site/schemes/<slug>.html)
   The page arrives pre-rendered by tools/build.js. On load we render it again
   with today's date so countdowns are current, then wire up the buttons. */
(function () {
  "use strict";

  const { $, downloadIcs, toast, upcoming } = window.CC;
  const key = document.body.dataset.scheme;
  if (!key || !window.CC_SCHEME_CONTENT[key]) return;

  const page = window.CC.renderScheme(key, { root: "../", schemeBase: "" });
  $("#schemeSwitcher").innerHTML = page.switcher;
  $("#schemePage").innerHTML = page.html;

  window.CC.wireDeadlineActions($("#schemeDeadlines"));
  window.CC.wireSignup($("#signupForm"));
  window.CC.wireChrome(".scope-card, .change-card, .aside-card, .alert-band");

  const all = $("#icsAll");
  if (all) all.addEventListener("click", () => {
    const items = upcoming.filter((d) => d.scheme === key);
    downloadIcs(items, `${page.slug}-deadlines.ics`);
    toast(`Calendar file downloaded (${items.length} deadlines)`);
  });

  const id = window.CC.hashId();
  if (id) {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ block: "center" }), 50);
  }
})();
