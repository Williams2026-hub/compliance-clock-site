/* Compliance Clock — style guide page: colour swatches and the theme toggle.
   Kept in a file (not inline) so the Content-Security-Policy can forbid inline scripts. */
(function () {
  "use strict";
  const core = [["--bg","Background"],["--surface","Surface"],["--surface-2","Surface 2"],["--ink","Ink"],["--ink-2","Ink 2"],["--muted","Muted"],["--line","Line"],["--navy","Navy"],["--accent","Blue 60 (interactive)"],["--accent-soft","Green soft"],["--urgent","Urgent"],["--changed","Changed"],["--verify","Verify"],["--sponsor","Sponsor"]];
  const schemes = [["--s-ukets","UK ETS"],["--s-euets","EU ETS"],["--s-fueleu","FuelEU"],["--s-corsia","CORSIA"],["--s-cbam","CBAM"],["--s-esos","ESOS"],["--s-secr","SECR"],["--s-cca","CCA"]];
  const paint = () => {
    const cs = getComputedStyle(document.documentElement);
    const sw = (list) => list.map(([v, n]) => `<div class="swatch"><div style="background:var(${v})"></div><p><b>${n}</b>${v} · ${cs.getPropertyValue(v).trim()}</p></div>`).join("");
    document.getElementById("core").innerHTML = sw(core);
    document.getElementById("schemes").innerHTML = sw(schemes);
  };
  paint();
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const toggle = document.getElementById("sgThemeToggle");
  if (toggle) toggle.addEventListener("click", () => {
    const r = document.documentElement;
    r.dataset.theme = r.dataset.theme === "dark" ? "light" : "dark";
  });
})();
