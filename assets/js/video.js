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

  // Persistent "kick". Some browsers (Safari with Auto-Play = Never, Low Power
  // Mode / battery saver, strict data-saver) refuse muted autoplay on load, but
  // DO allow play() invoked from a real user gesture. We register every preview
  // and, on EVERY user interaction, re-attempt play() on any registered clip
  // that is currently paused AND intersecting the viewport. We keep listening
  // until ALL registered previews are confirmed playing, so a single rejected
  // attempt (or a clip that wasn't ready yet) never leaves a tile frozen on its
  // poster. Already-playing clips are skipped, so the handler stays cheap.
  var PREVIEWS = [];                 // { v: <video>, seen: fn() -> bool intersecting }
  var KICK_ARMED = false;
  var KICK_EVENTS = ["pointerdown", "touchstart", "keydown", "click", "wheel", "scroll"];
  var KICK_OPTS = { passive: true, capture: true };

  function allPlaying() {
    for (var i = 0; i < PREVIEWS.length; i++) {
      var v = PREVIEWS[i].v;
      if (v.paused || v.ended) return false;
    }
    return PREVIEWS.length > 0;
  }
  function fireKick() {
    PREVIEWS.forEach(function (p) {
      var v = p.v;
      if (!v.paused && !v.ended) return;          // already running -> skip (cheap)
      if (p.seen && !p.seen()) return;            // off-screen -> leave paused (CPU/battery)
      try {
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      } catch (e) {}
    });
  }
  function disarmKick() {
    KICK_EVENTS.forEach(function (ev) { window.removeEventListener(ev, kickHandler, KICK_OPTS); });
    KICK_ARMED = false;
  }
  function kickHandler() {
    fireKick();
    // Only stop listening once every registered preview is confirmed playing;
    // otherwise stay armed so the next interaction retries the stragglers.
    if (allPlaying()) disarmKick();
  }
  // Register a preview so the persistent kick can retry it. `seen` reports
  // whether the clip is currently in (or near) the viewport.
  function registerPreview(v, seen) {
    PREVIEWS.push({ v: v, seen: seen });
    if (KICK_ARMED) return;
    KICK_ARMED = true;
    KICK_EVENTS.forEach(function (ev) { window.addEventListener(ev, kickHandler, KICK_OPTS); });
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

    var inView = true;   // assume visible until the observer says otherwise
    var tryPlay = function () {
      if (!inView) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});   // blocked: poster holds; the kick / hover will start it later
    };

    if ("IntersectionObserver" in window) {
      // Start a touch before it scrolls in; pause once well off-screen (CPU/battery).
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          inView = e.isIntersecting;
          if (inView) tryPlay();
          else { try { v.pause(); } catch (e2) {} }
        });
      }, { threshold: 0.01, rootMargin: "200px 0px" });
      io.observe(v);
    }

    // Hover-to-play: entering a tile plays its clip. Works in Chrome AND default
    // Safari (a hover is a user gesture), so a clip starts the moment it's eyed
    // even when load-time autoplay was refused. Listen on the video itself; the
    // pointer is inside the tile so the clip is by definition in view.
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      v.addEventListener("pointerenter", function () {
        if (v.paused || v.ended) tryPlay();
      });
    }

    tryPlay();                                     // best-effort immediate start (works wherever autoplay is allowed)
    registerPreview(v, function () { return inView; });  // persistent retry on every interaction until it plays
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
