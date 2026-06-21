/* ============================================================================
   MUSE WAV — shared video layer (used by every concept)
   1) MWV.preview(id)  → a muted, looping, in-view-gated <video> preview built
      from the self-hosted silent clip. Decorative; the tile's own link/button
      carries the label. Honors prefers-reduced-motion (poster only, no play).
   2) MWV.lightbox.open(id, title) → full YouTube video WITH sound, in an
      on-site modal (so a click never yanks the visitor off to youtube.com).
   Depends on window.MUSEWAV (content.js). No build step; plain UMD-free IIFE.
   ============================================================================ */
(function () {
  "use strict";
  var M = window.MUSEWAV || {};
  var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function clipSrc(id)   { return M.clip       ? M.clip(id)       : "../assets/video/" + id + ".mp4"; }
  function posterSrc(id) { return M.clipPoster ? M.clipPoster(id) : "../assets/video/" + id + ".jpg"; }

  /* ---- 1. autoplay preview <video> --------------------------------------- */

  // One-time "kick". Some browsers (Safari with Auto-Play = Never, Low Power
  // Mode / battery saver, strict data-saver) refuse muted autoplay on load, but
  // DO allow play() invoked from a real user gesture. We collect every preview
  // and start them all on the first interaction, so the loops never stay frozen
  // on a still poster. The listeners remove themselves after the first gesture.
  var KICK_FNS = [], KICK_ARMED = false;
  var KICK_EVENTS = ["pointerdown", "touchstart", "keydown", "click", "wheel", "scroll"];
  var KICK_OPTS = { passive: true, capture: true };
  function armKick(fn) {
    KICK_FNS.push(fn);
    if (KICK_ARMED) return;
    KICK_ARMED = true;
    var fire = function () {
      KICK_FNS.forEach(function (f) { try { f(); } catch (e) {} });
      KICK_EVENTS.forEach(function (ev) { window.removeEventListener(ev, fire, KICK_OPTS); });
    };
    KICK_EVENTS.forEach(function (ev) { window.addEventListener(ev, fire, KICK_OPTS); });
  }

  function preview(id, opts) {
    opts = opts || {};
    var v = document.createElement("video");
    v.className = opts.className || "mwv";
    // muted + inline are required for autoplay across browsers (esp. iOS Safari)
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.poster = posterSrc(id);
    v.setAttribute("aria-hidden", "true");   // the tile's link/button is the real control
    v.tabIndex = -1;
    var s = document.createElement("source");
    s.src = clipSrc(id); s.type = "video/mp4";
    v.appendChild(s);

    // Reduced motion: never autoplay; the poster frame stands in for the loop.
    if (REDUCE) { v.preload = "none"; return v; }

    // Declarative autoplay (with muted + inline) is the most reliable trigger.
    // Browsers honor the attribute more permissively than a scripted play()
    // alone. preload "auto" keeps the short clip buffered so it can start the
    // instant it is seen.
    v.autoplay = true; v.setAttribute("autoplay", "");
    v.preload = "auto";

    var tryPlay = function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});   // blocked: poster holds; the kick will start it on first interaction
    };

    if ("IntersectionObserver" in window) {
      // Start a touch before it scrolls in; pause once well off-screen (CPU/battery).
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) tryPlay();
          else { try { v.pause(); } catch (e2) {} }
        });
      }, { threshold: 0.01, rootMargin: "200px 0px" });
      io.observe(v);
    }

    tryPlay();          // best-effort immediate start (works wherever autoplay is allowed)
    armKick(tryPlay);   // guaranteed start on the first user interaction otherwise
    return v;
  }

  /* ---- 2. lightbox (full video, with sound) ------------------------------ */
  var box = null, frame = null, cap = null, lastFocus = null;

  function build() {
    if (box) return;
    box = document.createElement("div");
    box.className = "mwv-lb";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Video player");
    box.innerHTML =
      '<div class="mwv-lb__backdrop" data-close></div>' +
      '<div class="mwv-lb__stage">' +
        '<button class="mwv-lb__close" type="button" aria-label="Close video" data-close>&#x2715;</button>' +
        '<div class="mwv-lb__frame"></div>' +
        '<p class="mwv-lb__cap"></p>' +
      '</div>';
    document.body.appendChild(box);
    frame = box.querySelector(".mwv-lb__frame");
    cap   = box.querySelector(".mwv-lb__cap");
    box.addEventListener("click", function (e) {
      if (e.target && e.target.hasAttribute("data-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape" || e.key === "Esc") { close(); return; }
      // Focus trap: Tab / Shift+Tab cycle only within the modal so focus can
      // never reach the page behind it. Focusables are the close button and
      // the video iframe (in DOM order).
      if (e.key === "Tab" || e.keyCode === 9) {
        var focusables = box.querySelectorAll(
          'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) { e.preventDefault(); return; }
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        var active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || !box.contains(active)) { e.preventDefault(); last.focus(); }
        } else {
          if (active === last || !box.contains(active)) { e.preventDefault(); first.focus(); }
        }
      }
    });
  }

  function open(id, title) {
    build();
    lastFocus = document.activeElement;
    var url = "https://www.youtube-nocookie.com/embed/" + id +
              "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    var t = title ? (title + " · MUSE WAV") : "MUSE WAV";
    frame.innerHTML =
      '<iframe src="' + url + '" title="' + t + '" loading="lazy" ' +
      'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    cap.textContent = t;
    box.classList.add("is-open");
    document.documentElement.classList.add("mwv-lock");
    var c = box.querySelector(".mwv-lb__close"); if (c) c.focus();
  }

  function close() {
    if (!box) return;
    box.classList.remove("is-open");
    document.documentElement.classList.remove("mwv-lock");
    frame.innerHTML = "";   // tearing down the iframe stops playback
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.MWV = {
    preview: preview,
    clipSrc: clipSrc,
    posterSrc: posterSrc,
    lightbox: { open: open, close: close }
  };
})();
