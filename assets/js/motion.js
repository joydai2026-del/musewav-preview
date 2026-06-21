/* MUSE WAV — shared motion engine (global MW).
   Expects UMD globals loaded first: gsap, ScrollTrigger, Lenis, SplitType.
   File://-friendly (no ES modules). Respects prefers-reduced-motion. See ../../DESIGN.md §4. */
(function (global) {
  "use strict";
  var hasGSAP = typeof gsap !== "undefined";
  var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hasGSAP && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  var MW = {
    reduce: reduce,
    lenis: null,

    /** Smooth scroll via Lenis, tied into GSAP's ticker + ScrollTrigger. */
    initLenis: function (opts) {
      if (reduce || typeof Lenis === "undefined") return null;
      var lenis = new Lenis(Object.assign({ duration: 1.1, lerp: 0.1, smoothWheel: true }, opts || {}));
      MW.lenis = lenis;
      lenis.on("scroll", function () { if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update(); });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
      // anchor links scroll through Lenis
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href"); if (id.length < 2) return;
          var el = document.querySelector(id); if (!el) return;
          e.preventDefault(); lenis.scrollTo(el, { offset: 0, duration: 1.3 });
        });
      });
      return lenis;
    },

    /** Line-by-line masked reveal using SplitType. */
    splitReveal: function (selector, opts) {
      var els = toArr(selector); if (!els.length) return;
      var o = Object.assign({ start: "top 85%", y: 118, stagger: 0.08, duration: 1, ease: "power4.out", once: true }, opts);
      els.forEach(function (el) {
        if (reduce || typeof SplitType === "undefined") { el.style.opacity = 1; return; }
        var split = new SplitType(el, { types: "lines" });
        el.querySelectorAll(".line").forEach(function (line) {
          var inner = document.createElement("span");
          inner.className = "line-inner"; inner.style.display = "block"; inner.style.willChange = "transform";
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner); line.style.overflow = "hidden"; line.style.display = "block";
        });
        gsap.from(el.querySelectorAll(".line-inner"), {
          yPercent: o.y, duration: o.duration, ease: o.ease, stagger: o.stagger,
          scrollTrigger: { trigger: el, start: o.start, once: o.once }
        });
      });
    },

    /** Simple fade/slide reveal for [data-reveal] or a selector. */
    fadeUp: function (selector, opts) {
      var els = toArr(selector || "[data-reveal]"); if (!els.length) return;
      var o = Object.assign({ start: "top 88%", y: 40, duration: 1, ease: "power3.out", stagger: 0.08 }, opts);
      if (reduce) { els.forEach(function (e) { e.style.opacity = 1; }); return; }
      els.forEach(function (el) {
        var group = el.hasAttribute("data-reveal-group") ? el.children : [el];
        gsap.from(group, {
          y: o.y, opacity: 0, duration: o.duration, ease: o.ease, stagger: o.stagger,
          scrollTrigger: { trigger: el, start: o.start, once: true }
        });
      });
    },

    /** Infinite horizontal marquee. Duplicates the track so it loops seamlessly. */
    marquee: function (selector, opts) {
      toArr(selector).forEach(function (root) {
        var track = root.querySelector(".marquee__track") || root.firstElementChild;
        if (!track) return;
        var o = Object.assign({ speed: 60, reverse: false }, opts); // px/sec
        var clone = track.cloneNode(true); clone.setAttribute("aria-hidden", "true");
        root.appendChild(clone);
        if (reduce) return;
        var w = track.offsetWidth, dir = o.reverse ? 1 : -1, x = o.reverse ? -w : 0;
        gsap.ticker.add(function () {
          x += dir * (o.speed / 60);
          if (!o.reverse && x <= -w) x += w;
          if (o.reverse && x >= 0) x -= w;
          track.style.transform = clone.style.transform = "translate3d(" + x + "px,0,0)";
        });
      });
    },

    /** Custom blended cursor. Grows over [data-cursor] elements. */
    cursor: function () {
      if (reduce || matchMedia("(hover:none)").matches || !hasGSAP) return;
      var c = document.createElement("div"); c.className = "mw-cursor"; document.body.appendChild(c);
      var x = gsap.quickTo(c, "x", { duration: 0.35, ease: "power3" });
      var y = gsap.quickTo(c, "y", { duration: 0.35, ease: "power3" });
      global.addEventListener("mousemove", function (e) { x(e.clientX); y(e.clientY); });
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest("a,button,[data-cursor]")) c.classList.add("is-grow");
      });
      document.addEventListener("mouseout", function (e) {
        if (e.target.closest("a,button,[data-cursor]")) c.classList.remove("is-grow");
      });
    },

    /** Skew elements by scroll velocity (settles back to 0). */
    velocitySkew: function (selector) {
      if (reduce || !hasGSAP) return;
      var els = toArr(selector); if (!els.length) return;
      var setters = els.map(function (el) { return gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }); });
      var to;
      ScrollTrigger.create({
        onUpdate: function (self) {
          var v = gsap.utils.clamp(-7, 7, self.getVelocity() / -320);
          setters.forEach(function (s) { s(v); });
          clearTimeout(to); to = setTimeout(function () { setters.forEach(function (s) { s(0); }); }, 110);
        }
      });
    },

    /** Scroll parallax for [data-parallax="0.2"] (fraction of viewport travel). */
    parallax: function (selector) {
      if (reduce || !hasGSAP) return;
      toArr(selector || "[data-parallax]").forEach(function (el) {
        var amt = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        gsap.fromTo(el, { yPercent: -amt * 100 }, {
          yPercent: amt * 100, ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });
    },

    /** Magnetic hover for [data-magnetic] (buttons etc.). */
    magnetic: function (selector) {
      if (reduce || matchMedia("(hover:none)").matches || !hasGSAP) return;
      toArr(selector || "[data-magnetic]").forEach(function (el) {
        var xT = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        var yT = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          xT((e.clientX - (r.left + r.width / 2)) * 0.35);
          yT((e.clientY - (r.top + r.height / 2)) * 0.35);
        });
        el.addEventListener("mouseleave", function () { xT(0); yT(0); });
      });
    },

    /** The brand soundwave — animated warping vertical stripes, amplified by scroll velocity. */
    soundwave: function (canvas, opts) {
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var o = Object.assign({ color: "#B81D24", lines: 54, amp: 0.34, speed: 0.02, thickness: 3 }, opts || {});
      var w = 0, h = 0, dpr = 1, t = 0, vel = 0, raf;
      function size() {
        dpr = Math.min(2, global.devicePixelRatio || 1);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      size(); global.addEventListener("resize", size);
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({ onUpdate: function (s) { vel = Math.min(1, Math.abs(s.getVelocity()) / 2200); } });
      }
      function frame() {
        ctx.clearRect(0, 0, w, h);
        var n = o.lines, step = w / (n - 1), mid = h / 2, amp = h * o.amp * (0.6 + 0.8 * vel);
        ctx.lineWidth = o.thickness; ctx.lineCap = "round"; ctx.strokeStyle = o.color;
        for (var i = 0; i < n; i++) {
          var x = i * step, env = Math.sin((i / (n - 1)) * Math.PI), phase = t + i * 0.27;
          var len = amp * env * (0.5 + 0.5 * Math.sin(phase));
          var warp = Math.sin(phase * 0.6) * 10 * vel;
          ctx.globalAlpha = 0.35 + 0.65 * env;
          ctx.beginPath(); ctx.moveTo(x, mid - len + warp); ctx.lineTo(x, mid + len + warp); ctx.stroke();
        }
        t += o.speed * (1 + vel * 2.4);
        if (!reduce) raf = requestAnimationFrame(frame);
      }
      frame();
      return { stop: function () { cancelAnimationFrame(raf); } };
    },

    /** Preloader: animate out an existing .mw-preloader, then run onDone. */
    preloader: function (onDone) {
      var el = document.querySelector(".mw-preloader");
      if (!el || reduce || !hasGSAP) { if (el) el.remove(); if (onDone) onDone(); return; }
      var mark = el.querySelector(".mw-preloader__mark");
      var tl = gsap.timeline({ onComplete: function () { el.remove(); if (onDone) onDone(); } });
      if (mark) tl.fromTo(mark, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" })
        .to(mark, { opacity: 0, duration: 0.4, delay: 0.35 }, ">");
      tl.to(el, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, mark ? ">-0.1" : 0);
    },

    /** matchMedia desktop-only effects. No-op under reduced motion: the
        per-concept callback wires the pinned/scrubbed hero + parallax, none
        of which should run for prefers-reduced-motion users. */
    desktop: function (fn) {
      if (!hasGSAP || reduce) { return; }
      gsap.matchMedia().add("(min-width: 769px)", fn);
    },

    refresh: function () { if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); }
  };

  function toArr(sel) {
    if (!sel) return [];
    if (typeof sel === "string") return Array.prototype.slice.call(document.querySelectorAll(sel));
    if (sel.length !== undefined && !sel.tagName) return Array.prototype.slice.call(sel);
    return [sel];
  }

  global.MW = MW;
})(window);
