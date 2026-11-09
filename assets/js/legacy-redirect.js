/* Old addresses (scheme.html?s=uk-ets) now forward to the static pages in schemes/.
   Only known scheme slugs are accepted, so this can't redirect anywhere else.
   Kept in a file (not inline) so the Content-Security-Policy can forbid inline scripts. */
(function () {
  "use strict";
  var s = new URLSearchParams(location.search).get("s") || "";
  var c = window.CC_SCHEME_CONTENT || {};
  var key = Object.keys(c).find(function (k) { return c[k].slug === s || k === s; });
  location.replace(key ? "schemes/" + c[key].slug + ".html" + location.hash : "index.html#schemes");
})();
