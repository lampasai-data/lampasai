// Loaded synchronously from <head>, before the app. Kept out of index.html so
// the Content-Security-Policy can forbid every inline script.

// Theme chosen (src/lib/theme.ts), applied before the first paint to avoid a
// light flash when dark is selected.
try {
  var t = localStorage.getItem("lampasai-theme") || localStorage.getItem("lampasai-admin-theme");
  if (t === "dark") {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
} catch (e) {}

// Restore the real path after the GitHub Pages SPA redirect (see public/404.html).
(function () {
  var search = window.location.search;
  if (search[1] === "/") {
    var decoded = search
      .slice(1)
      .split("&")
      .map(function (s) {
        return s.replace(/~and~/g, "&");
      })
      .join("?");
    window.history.replaceState(
      null,
      "",
      window.location.pathname.slice(0, -1) + decoded + window.location.hash
    );
  }
})();
