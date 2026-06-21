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

  // preview(): a muted looping clip per tile. ROOT-CAUSE FIX (Codex, real desktop
  // Safari): the old code called play() while the <video> was still DETACHED and
  // used a <source> child, then the IntersectionObserver PAUSED the below-the-fold
  // tile right after insertion — so it fell back to a scripted play() that real
  // Safari refuses (which is why an above-the-fold hero autoplays but these tiles
  // did not). Now: a DIRECT src, attached + loaded only once the tile is observed
  // in view, play() ONLY when the element is CONNECTED, and we NEVER pause
  // off-screen (six tiny muted loops are cheaper than fighting WebKit's resumed play).
  function preview(id, opts) {
    opts = opts || {};
    var v = document.createElement("video");
    v.className = opts.className || "mwv";

    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;
    v.preload = REDUCE ? "none" : "metadata";

    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("aria-hidden", "true");   // the tile's link/button is the real control
    v.tabIndex = -1;
    v.poster = posterSrc(id);

    // Reduced motion: poster only, no playback.
    if (REDUCE) return v;

    var src = clipSrc(id);
    var armed = false;
    var inView = false;

    function ensureLoaded() {
      if (armed) return;
      armed = true;
      v.src = src;             // Safari-reliable: a direct src, not a detached <source>
      v.preload = "auto";
      try { v.load(); } catch (e) {}
    }

    function playConnected() {
      if (!v.isConnected) return;   // never play while detached (that wasted the autoplay before)
      ensureLoaded();
      var p;
      try { p = v.play(); } catch (e) { return; }
      if (p && p.catch) p.catch(function () {});
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.target !== v) return;
          inView = e.isIntersecting;
          if (inView) playConnected();
          // Deliberately do NOT pause off-screen — real Safari is the target bug,
          // and resuming a scripted play() it once paused is exactly what fails.
        });
      }, { threshold: 0.01, rootMargin: "300px 0px" });
      io.observe(v);
    } else {
      window.setTimeout(playConnected, 0);   // old-browser fallback (after the caller inserts the node)
      inView = true;
    }

    // Hover-to-play (desktop): a hover is a user gesture, so the clip starts the
    // moment it is eyed even if load-time autoplay was refused.
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      v.addEventListener("pointerenter", playConnected);
    }

    registerPreview(v, function () { return inView; });  // persistent kick retries any paused in-view tile
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
