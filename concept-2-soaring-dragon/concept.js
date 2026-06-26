/* ════════════════════════════════════════════════════════════════════
   MUSE WAV · CONCEPT 2 · "STREET LABEL"  (direction B)  ·  concept.js
   Content injection + candy/rainbow WebGL hero + cinematic motion +
   current homepage routing: autoplay proof, real service links, booking CTA,
   selected work, idea-to-release banner, studio, contact.
   Depends on globals: THREE, gsap, ScrollTrigger, Lenis, SplitType,
   window.MUSEWAV (content), window.MW (shared motion), window.MWV (video).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var M = window.MUSEWAV || {};
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ───────────────────────────────────────────────────────────────
     PLACEHOLDER DATA (modules only) — obviously not-real, per the
     qa-checklist placeholder_policy. No invented artist names/prices.
     ─────────────────────────────────────────────────────────────── */
  // musewav.com is quote-based with NO published fixed fees → rates shown are
  // an obvious SAMPLE only, paired with a "Request a custom quote" CTA.
  var ROOMS = [
    { id: "a", name: "Studio A", desc: "Tracking + Live Room", price: "$X / hr", shot: "a" },
    { id: "b", name: "Studio B", desc: "Vocal Booth + Mix", price: "$X / hr", shot: "b" },
    { id: "loft", name: "The Loft", desc: "Writing + Content", price: "$X / hr", shot: "c" }
  ];
  var SLOT_TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"];
  // Sample roster: placeholder stage names + self-hosted PORTRAIT photos of
  // fictional people (AI-generated, no real likeness; rights-clean). One "Open
  // slot" tile stays at the end.
  var ROSTER = [
    { name: "NYLA", tag: "R&B" },
    { name: "VELL", tag: "Hip-Hop" },
    { name: "Saint Aria", tag: "Alt R&B" },
    { name: "Devon Cross", tag: "Rap" },
    { name: "K. Tanaka", tag: "Producer" },
    { name: "Jamal P.", tag: "Afrobeats" },
    { name: "Cassidy Vale", tag: "Pop" },
    { name: "Theo Mars", tag: "Electronic" }
  ];
  var TIERS = [
    { id: "dev", name: "Sample Starter", price: "$X", per: "/ one-time", desc: "Demo review, a feedback call, and a development plan." },
    { id: "pro", name: "Sample Pro", price: "$X", per: "/ mo", desc: "Studio hours, a music video, and social rollout support." },
    { id: "elite", name: "Sample Elite", price: "$X", per: "/ mo", desc: "Full artist development, tour service, and platform operations." }
  ];

  /* ───────────────────────────────────────────────────────────────
     1. CONTENT INJECTION (runs immediately · no motion dependency)
     ─────────────────────────────────────────────────────────────── */
  function injectContent() {
    // NAV
    var nav = $(".c2-nav__links");
    var conceptNav = [
      { label: "Home", href: "index.html" },
      { label: "Services", href: "services.html" },
      { label: "Work", href: "#work" },
      { label: "Studio", href: "#studio" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" }
    ];
    if (nav) {
      nav.innerHTML = conceptNav.map(function (n) {
        return '<a href="' + n.href + '">' + esc(n.label) + "</a>";
      }).join("");
    }
    var navCta = $(".c2-nav__cta span");
    if (navCta) navCta.textContent = "Book Now";

    // HERO motto
    var motto = $(".c2-hero__motto");
    if (motto) motto.textContent = "NYC recording studio, label, and music production house for artists, creators, and records that need the full path from sound to release.";

    // MANIFESTO
    var mMotto = $(".c2-manifesto__motto");
    if (mMotto) mMotto.textContent = M.motto || "";
    var mMission = $(".c2-manifesto__mission");
    if (mMission) mMission.textContent = M.mission || "";

    // SERVICES · stacking cards
    var stack = $(".c2-services__stack");
    if (stack && M.services) {
      var arrow = '<span class="c2-card__arc" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
      stack.innerHTML = M.services.map(function (s) {
        return '' +
          '<a class="c2-card" href="services/' + esc(s.slug) + '.html">' +
            '<span class="c2-card__n">' + esc(s.n) + "</span>" +
            '<div class="c2-card__body">' +
              '<h3 class="c2-card__title">' + esc(s.title) + "</h3>" +
              '<p class="c2-card__desc">' + esc(s.desc) + "</p>" +
            "</div>" +
            arrow +
          "</a>";
      }).join("");
    }

    // WORK · autoplay video panels (clip injected by wireWork; title → lightbox)
    var track = $(".c2-work__track");
    if (track && M.videos && M.videos.length) {
      var playSvg = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      var ytSvg = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>';
      track.innerHTML = M.videos.map(function (v, i) {
        var idx = String(i + 1).padStart(2, "0");
        var watch = typeof M.ytWatch === "function" ? M.ytWatch(v.id) : "#";
        return '' +
          '<article class="c2-panel" data-id="' + esc(v.id) + '">' +
            '<div class="c2-panel__media">' +
              '<button class="c2-panel__play" type="button" aria-label="Play ' + esc(v.title) + ' · MUSE WAV">' + playSvg + "</button>" +
              '<a class="c2-panel__yt" href="' + esc(watch) + '" target="_blank" rel="noopener" aria-label="Watch ' + esc(v.title) + ' on YouTube">' + ytSvg + "<span>YouTube</span></a>" +
              '<div class="c2-panel__meta">' +
                '<a class="c2-panel__title" href="' + esc(watch) + '" target="_blank" rel="noopener">' + esc(v.title) + "</a>" +
                '<span class="c2-panel__note">' + esc(v.note || "") + "</span>" +
              "</div>" +
            "</div>" +
            '<p class="c2-panel__idx">' + idx + " / " + String(M.videos.length).padStart(2, "0") + "</p>" +
          "</article>";
      }).join("");
    }
    var credit = $(".c2-work__credit");
    if (credit) credit.textContent = M.trackCredit || "";

    // COMMUNITY body + marquee
    var cBody = $(".c2-community__body");
    if (cBody) cBody.textContent = M.community || "";
    var cmq = $(".c2-community__marquee .marquee__track");
    if (cmq) {
      var words = ["MUSE WAV", "COMMUNITY", "RED SERIES", "NEW YORK", "纽约", "STREET LABEL"];
      cmq.innerHTML = words.map(function (w) { return '<span class="c2-mq-item">' + esc(w) + "</span>"; }).join("");
    }

    // STUDIO
    var addr = $(".c2-studio__address");
    if (addr && M.studio && M.studio.addressLines) {
      addr.innerHTML = M.studio.addressLines.map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("");
    }
    var hours = $(".c2-studio__hours");
    if (hours && M.studio) hours.textContent = M.studio.hours || "";

    // CTA
    var mail = $(".c2-cta__mail span");
    if (mail && M.contact) {
      mail.textContent = M.contact.email || "";
      var mailA = $(".c2-cta__mail");
      if (mailA) mailA.setAttribute("href", "mailto:" + M.contact.email);
    }
    var phone = $(".c2-cta__phone span");
    if (phone && M.contact) {
      phone.textContent = M.contact.phone || "";
      var phoneA = $(".c2-cta__phone");
      if (phoneA) phoneA.setAttribute("href", M.contact.phoneHref || "tel:");
    }

    // FOOTER
    var fMotto = $(".c2-footer__motto");
    if (fMotto) fMotto.textContent = M.motto || "";
    var socials = $(".c2-footer__socials");
    if (socials && M.socials) {
      socials.innerHTML = M.socials.map(function (s) {
        return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="MUSE WAV on ' + esc(s.label) + '">' +
          "<span>" + esc(s.short) + "</span><span>" + esc(s.label) + "</span></a>";
      }).join("");
    }
    var copy = $(".c2-footer__copy");
    if (copy) copy.textContent = M.copyright || "";
    var footerAddress = $(".c2-footer__address");
    if (footerAddress && M.studio && M.studio.addressLines) {
      footerAddress.innerHTML = M.studio.addressLines.map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("");
    }
    var footerHours = $(".c2-footer__hours");
    if (footerHours && M.studio) footerHours.textContent = M.studio.hours || "";

    // ROSTER grid: placeholder stage names + self-hosted portrait photos of
    // fictional people. ("Sample" labelled per placeholder_policy.)
    var rg = $(".c2-roster__grid");
    if (rg) {
      var cards = ROSTER.map(function (a, i) {
        // self-hosted PORTRAIT photo of a fictional person (AI-generated, no real
        // likeness; rights-clean). Candy-tinted via CSS to sit in the palette.
        return '<article class="c2-artist">' +
          '<img class="c2-artist__photo" src="../assets/roster/roster-' + (i + 1) + '.jpg" ' +
            'alt="Sample portrait, placeholder fictional person" loading="lazy" decoding="async" width="600" height="800">' +
          '<span class="c2-artist__pv">Sample</span>' +
          '<div class="c2-artist__body">' +
            '<p class="c2-artist__name">' + esc(a.name) + "</p>" +
            '<p class="c2-artist__tag">' + esc(a.tag) + "</p>" +
          "</div></article>";
      });
      // One "Open slot" tile — an invitation to apply, not a fake signed act.
      cards.push(
        '<a class="c2-artist c2-artist--open" href="#apply">' +
          '<span class="c2-artist__plus" aria-hidden="true">+</span>' +
          '<div class="c2-artist__body">' +
            '<p class="c2-artist__name">Open slot</p>' +
            '<p class="c2-artist__tag">Apply to be represented</p>' +
          "</div></a>"
      );
      rg.innerHTML = cards.join("");
    }

    // TIERS (placeholder pricing)
    var tiersWrap = $(".c2-tiers");
    if (tiersWrap) {
      tiersWrap.innerHTML = TIERS.map(function (t) {
        return '<button class="c2-tier" type="button" role="radio" aria-checked="false" data-tier="' + esc(t.id) + '">' +
          '<span class="c2-tier__top">' +
            '<span class="c2-tier__name">' + esc(t.name) + "</span>" +
            '<span class="c2-tier__price">' + esc(t.price) + " <small>" + esc(t.per) + "</small></span>" +
          "</span>" +
          '<span class="c2-tier__desc">' + esc(t.desc) + "</span>" +
          '<span class="c2-tier__pv">Preview pricing</span>' +
          '<span class="c2-tier__pay">Pay &amp; apply</span>' +
        "</button>";
      }).join("");
    }
  }

  /* ───────────────────────────────────────────────────────────────
     2. WORK PANELS  (inject muted autoplay preview · click → lightbox)
        Reuses the shared MWV engine read-only.
     ─────────────────────────────────────────────────────────────── */
  function wireWork() {
    var hasMWV = window.MWV && typeof MWV.preview === "function";
    $$("[data-video-id]").forEach(function (wrap) {
      var id = wrap.getAttribute("data-video-id");
      if (!id) return;
      var layer;
      if (hasMWV) {
        layer = MWV.preview(id, { className: "c2-inline-video" });
      } else {
        layer = document.createElement("img");
        layer.className = "c2-inline-video";
        layer.src = (typeof M.ytThumb === "function" ? M.ytThumb(id) : "");
        layer.alt = "";
        layer.loading = "lazy";
      }
      wrap.appendChild(layer);
    });

    $$(".c2-panel").forEach(function (panel) {
      var id = panel.getAttribute("data-id");
      var media = $(".c2-panel__media", panel);
      var play = $(".c2-panel__play", panel);
      var title = $(".c2-panel__title", panel);
      if (!media) return;

      var layer;
      if (hasMWV) {
        layer = MWV.preview(id, { className: "c2-panel__thumb c2-panel__video" });
      } else {
        layer = document.createElement("img");
        layer.className = "c2-panel__thumb c2-panel__video";
        layer.src = (typeof M.ytThumb === "function" ? M.ytThumb(id) : "");
        layer.alt = ""; layer.loading = "lazy";
      }
      media.insertBefore(layer, media.firstChild);

      function watch(e) {
        if (!window.MWV || !MWV.lightbox) return;     // no lightbox → the title's href opens YouTube
        if (e) e.preventDefault();
        MWV.lightbox.open(id, title ? title.textContent : "");
      }
      if (play) play.addEventListener("click", watch);
      if (title) title.addEventListener("click", watch);
    });
  }

  function setupInlineMotionToggles() {
    $$(".c2-allwant__media, .c2-footer__motion").forEach(function (wrap) {
      var videos = $$("video", wrap);
      videos.forEach(function (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        v.autoplay = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
  }

  /* ───────────────────────────────────────────────────────────────
     3. WEBGL CANDY FIELD HERO  (three.js r128, desktop + motion-on only)
        Full-viewport plane, custom ShaderMaterial. fBm simplex noise
        warps a BLACK→candy→rainbow field; reactive to mouse (u_mouse).
        Reimplemented from scratch (Ashima public-domain noise + my own
        candy ramp/composition); NOT copied from any reference bundle.
        Returns a teardown handle (dispose + remove resize listener).
     ─────────────────────────────────────────────────────────────── */
  function initCandyGL() {
    if (REDUCE || typeof THREE === "undefined") return null;
    var canvas = $(".c2-hero__gl");
    var hero = $(".c2-hero");
    if (!canvas || !hero) return null;

    // Probe WebGL FIRST on a throwaway canvas, so three.js never logs its own
    // "Error creating WebGL context" on a GPU-less / WebGL-blocked browser.
    // When unavailable we bail silently and the CSS candy fallback stays up.
    try {
      var probe = document.createElement("canvas");
      var pctx = probe.getContext("webgl") || probe.getContext("experimental-webgl");
      if (!pctx) return null;
    } catch (e) { return null; }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (e) { return null; }     // no WebGL → leave the CSS fallback visible
    if (!renderer.getContext()) return null;

    var DPR = Math.min(1.75, window.devicePixelRatio || 1);
    renderer.setPixelRatio(DPR);

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var uniforms = {
      u_time:  { value: 0 },
      u_res:   { value: new THREE.Vector2(1, 1) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      // candy / rainbow ramp (black base → pink → peach → yellow → cyan → violet)
      u_cInk:    { value: new THREE.Color(0x08080a) },
      u_cPink:   { value: new THREE.Color(0xff4fa3) },
      u_cPeach:  { value: new THREE.Color(0xff8a4c) },
      u_cYellow: { value: new THREE.Color(0xffd23f) },
      u_cCyan:   { value: new THREE.Color(0x2fd9ee) },
      u_cViolet: { value: new THREE.Color(0xc77dff) }
    };

    var vert = [
      "varying vec2 v_uv;",
      "void main(){",
      "  v_uv = uv;",
      "  gl_Position = vec4(position.xy, 0.0, 1.0);",
      "}"
    ].join("\n");

    // 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT) + our own fBm.
    var frag = [
      "precision highp float;",
      "varying vec2 v_uv;",
      "uniform float u_time;",
      "uniform vec2  u_res;",
      "uniform vec2  u_mouse;",
      "uniform vec3  u_cInk;",
      "uniform vec3  u_cPink;",
      "uniform vec3  u_cPeach;",
      "uniform vec3  u_cYellow;",
      "uniform vec3  u_cCyan;",
      "uniform vec3  u_cViolet;",
      "",
      "// ---------------------------------------------------------------------",
      "// 2D simplex noise (snoise + mod289/permute helpers below) is the",
      "// webgl-noise primitive by Ashima Arts and Stefan Gustavson.",
      "// Copyright (C) 2011 Ashima Arts. Licensed under the MIT license.",
      "// https://github.com/ashima/webgl-noise  ·  https://github.com/stegu/webgl-noise",
      "// ---------------------------------------------------------------------",
      "vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}",
      "vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}",
      "vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}",
      "float snoise(vec2 v){",
      "  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);",
      "  vec2 i=floor(v+dot(v,C.yy));",
      "  vec2 x0=v-i+dot(i,C.xx);",
      "  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);",
      "  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;",
      "  i=mod289(i);",
      "  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));",
      "  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);",
      "  m=m*m; m=m*m;",
      "  vec3 x=2.0*fract(p*C.www)-1.0;",
      "  vec3 h=abs(x)-0.5;",
      "  vec3 ox=floor(x+0.5);",
      "  vec3 a0=x-ox;",
      "  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);",
      "  vec3 g;",
      "  g.x=a0.x*x0.x+h.x*x0.y;",
      "  g.yz=a0.yz*x12.xz+h.yz*x12.yw;",
      "  return 130.0*dot(m,g);",
      "}",
      "",
      "float fbm(vec2 p){",
      "  float s=0.0; float a=0.55; float f=1.0;",
      "  for(int i=0;i<6;i++){ s+=a*snoise(p*f); f*=2.0; a*=0.5; }",
      "  return s;",
      "}",
      "",
      "// 5-stop candy ramp across t in [0,1]",
      "vec3 candy(float t){",
      "  t=clamp(t,0.0,1.0);",
      "  vec3 c=mix(u_cPink,u_cPeach,smoothstep(0.0,0.28,t));",
      "  c=mix(c,u_cYellow,smoothstep(0.26,0.5,t));",
      "  c=mix(c,u_cCyan,smoothstep(0.48,0.74,t));",
      "  c=mix(c,u_cViolet,smoothstep(0.72,1.0,t));",
      "  return c;",
      "}",
      "",
      "void main(){",
      "  vec2 uv=v_uv;",
      "  float aspect=u_res.x/max(u_res.y,1.0);",
      "  vec2 p=uv; p.x*=aspect;",
      "  float t=u_time*0.05;",
      "",
      "  // domain-warp the field twice → flowing liquid-candy ribbons",
      "  vec2 q=vec2(fbm(p*1.5+vec2(0.0,t)), fbm(p*1.5+vec2(5.2,-t*0.8)));",
      "  vec2 mo=(u_mouse-0.5); mo.x*=aspect;",
      "  vec2 r=vec2(fbm(p*1.8+q*2.4+mo*1.1+vec2(1.7,9.2)+t*0.7),",
      "             fbm(p*1.8+q*2.4-mo*1.1+vec2(8.3,2.8)-t*0.6));",
      "  float n=fbm(p*2.0+r*2.6);",
      "  n=n*0.5+0.5;",                 // → roughly 0..1
      "",
      "  // a flowing diagonal sweep (the 'soaring' band)",
      "  float band=smoothstep(0.1,0.95,n + (uv.y-0.5)*0.5 + length(r)*0.2);",
      "",
      "  // hue position rides the warp so colors flow like the soundwave stripes",
      "  float hue=fract(n*1.3 + length(r)*0.35 + t*0.4 + uv.x*0.2);",
      "  vec3 candyCol=candy(hue);",
      "",
      "  // black base; candy only emerges where the band rises (keeps it street-dark)",
      "  vec3 col=mix(u_cInk, candyCol, smoothstep(0.18,0.75,band));",
      "  // bright crests get a saturated pop",
      "  col=mix(col, candyCol*1.25, smoothstep(0.85,1.0,band));",
      "",
      "  // mouse glow · candy bloom following the cursor",
      "  float md=distance(p, vec2((u_mouse.x)*aspect,u_mouse.y));",
      "  col+=candy(fract(t*0.6))*smoothstep(0.55,0.0,md)*0.16;",
      "",
      "  // vignette so hero text reads; darken bottom for the copy band",
      "  float vig=smoothstep(1.15,0.25,distance(uv,vec2(0.5,0.55)));",
      "  col*=mix(0.4,1.0,vig);",
      "  col*=mix(1.0,0.42,smoothstep(0.55,1.0,uv.y));",
      "",
      "  // subtle film grain to kill banding",
      "  float g=fract(sin(dot(uv*u_res, vec2(12.9898,78.233)))*43758.5453);",
      "  col+=(g-0.5)*0.028;",
      "",
      "  gl_FragColor=vec4(col,1.0);",
      "}"
    ].join("\n");

    var material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag });
    var quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
    scene.add(quad);

    function resize() {
      var w = hero.clientWidth || window.innerWidth;
      var h = hero.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.u_res.value.set(w * DPR, h * DPR);
    }
    resize();
    window.addEventListener("resize", resize);

    var mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
    function onMove(e) {
      var r = hero.getBoundingClientRect();
      tmx = (e.clientX - r.left) / Math.max(r.width, 1);
      tmy = 1.0 - (e.clientY - r.top) / Math.max(r.height, 1);
    }
    window.addEventListener("mousemove", onMove);

    var clock = new THREE.Clock();
    var rafId = null, live = false, running = true;
    function tick() {
      if (!running) { rafId = null; return; }
      rafId = requestAnimationFrame(tick);
      uniforms.u_time.value = clock.getElapsedTime();
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      uniforms.u_mouse.value.set(mx, my);
      // ScrollTrigger.refresh() (fired on resize) re-runs every trigger and can
      // re-enter this RAF / restart the loop, leaving three.js's cached GL
      // program out of sync with the active program — three.js then pushes
      // u_time/u_res/u_mouse against stale locations and WebGL logs
      // "uniformXf: location is not from the associated program". Resetting the
      // renderer's GL state here forces a fresh useProgram (and uniform-location
      // rebind) before every draw, eliminating those warnings.
      if (renderer.state && renderer.state.reset) renderer.state.reset();
      renderer.render(scene, camera);
      if (!live) { live = true; canvas.classList.add("is-live"); }   // reveal once 1st frame is drawn
    }
    // start() guards against ever running two concurrent RAF loops (a second
    // loop is the other way the stale-program warning surfaces).
    function start() { if (running && rafId == null) tick(); }
    tick();

    // Pause the RAF when the hero scrolls fully out of view (perf).
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: hero, start: "top bottom", end: "bottom top",
        onToggle: function (self) {
          if (self.isActive && !running) { running = true; start(); }
          else if (!self.isActive && running) { running = false; cancelAnimationFrame(rafId); rafId = null; }
        }
      });
    }

    return {
      dispose: function () {
        running = false; cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        quad.geometry.dispose(); material.dispose(); renderer.dispose();
      }
    };
  }

  /* ───────────────────────────────────────────────────────────────
     4. MOTION  (hero reveal, work pin, sticky service cards, nav)
     ─────────────────────────────────────────────────────────────── */
  function heroReveal() {
    var lines = $$(".c2-hero__line > span");
    if (REDUCE || typeof gsap === "undefined") { lines.forEach(function (l) { l.style.transform = "none"; }); return; }
    var scrollCue = $(".c2-hero__scroll");
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(lines, { yPercent: 120, duration: 1.1, stagger: 0.12 }, 0)
      .from(".c2-hero__kicker", { y: 24, opacity: 0, duration: 0.8 }, 0.2)
      .from(".c2-hero__tag", { y: 20, opacity: 0, duration: 0.8 }, 0.45)
      .from(".c2-hero__motto", { y: 20, opacity: 0, duration: 0.9 }, 0.6);
    if (scrollCue) tl.from(scrollCue, { y: 16, opacity: 0, duration: 0.8 }, 0.8);
  }

  function navBehavior() {
    var nav = $(".c2-nav");
    if (!nav) return;
    var toggle = $(".c2-nav__toggle", nav);
    var links = $(".c2-nav__links", nav);
    var mobileQuery = window.matchMedia ? window.matchMedia("(max-width: 768px)") : null;
    function syncMobileA11y(open) {
      if (!links) return;
      var mobile = mobileQuery ? mobileQuery.matches : window.innerWidth <= 768;
      if (mobile && !open) {
        links.setAttribute("inert", "");
        links.setAttribute("aria-hidden", "true");
      } else {
        links.removeAttribute("inert");
        links.removeAttribute("aria-hidden");
      }
    }
    syncMobileA11y(false);
    if (mobileQuery && mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", function () {
        syncMobileA11y(nav.classList.contains("is-open"));
      });
    }
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        syncMobileA11y(open);
      });
      $$(".c2-nav__links a", nav).forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          syncMobileA11y(false);
        });
      });
    }
    if (REDUCE || typeof ScrollTrigger === "undefined") return;
    var lastY = 0;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var y = self.scroll();
        nav.classList.toggle("is-solid", y > window.innerHeight * 0.6);
        if (!nav.classList.contains("is-open")) {
          if (y > lastY && y > window.innerHeight) nav.classList.add("is-hidden");
          else nav.classList.remove("is-hidden");
        }
        lastY = y;
      }
    });
  }

  function animateWorkMedia() {
    var track = $(".c2-work__track");
    if (!track || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    $$(".c2-panel").forEach(function (panel) {
      var thumb = $(".c2-panel__thumb", panel);
      if (!thumb) return;
      gsap.to(thumb, {
        scale: 1.05,
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  function servicesStack() {
    var cards = $$(".c2-card");
    if (!cards.length || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    // Cards are position:sticky at the same top, so each one cleanly COVERS the
    // previous as it scrolls up (opaque bg + uniform min-height on desktop, set in
    // concept.css). We deliberately do NOT crossfade the cards: an opacity fade
    // made the covered card show through the covering one, so two headings read at
    // once mid-handoff. Only the active (top) card gets the accent styling.
    cards.forEach(function (card) {
      ScrollTrigger.create({
        trigger: card, start: "top 18%", end: "bottom 18%",
        onToggle: function (self) { card.classList.toggle("is-active", self.isActive); }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE 1 · STUDIO BOOKING  (calendar → slots → room → summary)
     Pure client-side preview. No backend, no real availability.
     ═══════════════════════════════════════════════════════════════ */
  function initBooking() {
    var root = $(".c2-book");
    if (!root) return;
    var daysWrap = $(".c2-book__days", root);
    var monthLabel = $("[data-cal-month]", root);
    var calHint = $("[data-cal-hint]", root);
    var slotsWrap = $(".c2-book__slots", root);
    var roomsWrap = $(".c2-book__rooms", root);
    var summary = $("[data-summary]", root);
    var steps = $$(".c2-book__steps li", root);
    var panels = $$(".c2-book__panels .c2-book__panel", root);
    var backBtn = $("[data-book-back]", root);
    var confirmBtn = $("[data-book-confirm]", root);
    var note = $("[data-book-note]", root);

    // map step number → the panel that should be in view
    var STEP_PANEL = { 1: "day", 2: "slots", 3: "rooms", 4: "summary" };

    var view = new Date(); view.setDate(1);
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var sel = { day: null, time: null, room: null };
    var step = 1;           // the step currently shown
    var reached = 1;        // furthest step unlocked (for back-nav)

    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var fmtDay = function (d) {
      var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
      return dow + " " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate();
    };

    // ---- the flip: show exactly one panel, sync the step bar + back button ----
    function showStep(n, animate) {
      step = n;
      var key = STEP_PANEL[n];
      panels.forEach(function (p) {
        var on = p.getAttribute("data-panel") === key;
        p.hidden = !on;
        if (on && animate !== false && !REDUCE) {
          p.classList.remove("is-flip");
          // force reflow so the animation re-triggers every flip
          void p.offsetWidth;
          p.classList.add("is-flip");
        }
      });
      steps.forEach(function (li) {
        var s = parseInt(li.getAttribute("data-step"), 10);
        li.classList.toggle("is-on", s === n);
        li.classList.toggle("is-done", s < reached && s !== n);
        li.classList.toggle("is-reached", s <= reached);
        var b = li.querySelector("button");
        if (b) b.disabled = s > reached;
      });
      if (backBtn) backBtn.hidden = n <= 1;
    }
    function goReached(n) { if (n > reached) reached = n; showStep(n, true); }

    function renderMonth() {
      monthLabel.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
      var first = view.getDay();
      var dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      var html = "";
      for (var i = 0; i < first; i++) html += '<span class="c2-book__day is-empty" aria-hidden="true"></span>';
      for (var d = 1; d <= dim; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var past = date < today;
        var isSel = sel.day && date.getTime() === sel.day.getTime();
        html += '<button class="c2-book__day' + (isSel ? " is-sel" : "") + '" type="button" data-day="' + d + '"' +
          (past ? " disabled" : "") + ' aria-label="' + fmtDay(date) + '">' + d + "</button>";
      }
      daysWrap.innerHTML = html;
    }

    function renderSlots() {
      slotsWrap.innerHTML = SLOT_TIMES.map(function (tm) {
        return '<button class="c2-book__slot' + (sel.time === tm ? " is-sel" : "") + '" type="button" data-time="' + tm + '">' + tm + "</button>";
      }).join("");
      var selDay = $("[data-sel-day]", root);
      if (selDay && sel.day) selDay.textContent = fmtDay(sel.day);
    }

    // rooms render as gradient cards (the old showcase gradients ARE the choices)
    function renderRooms() {
      roomsWrap.innerHTML = ROOMS.map(function (rm) {
        var sel2 = sel.room && sel.room.id === rm.id;
        return '<button class="c2-book__room c2-book__room--' + esc(rm.shot) + (sel2 ? " is-sel" : "") + '" type="button" data-room="' + esc(rm.id) + '"' +
          ' role="radio" aria-checked="' + (sel2 ? "true" : "false") + '">' +
          '<span class="c2-book__room-grad" aria-hidden="true"></span>' +
          '<span class="c2-book__room-info">' +
            '<span class="c2-book__room-name">' + esc(rm.name) + "</span>" +
            '<span class="c2-book__room-desc">' + esc(rm.desc) + "</span>" +
          "</span>" +
          '<span class="c2-book__room-price">' + esc(rm.price) + ' <small>· sample rate</small></span>' +
          '<span class="c2-book__room-tick" aria-hidden="true">&#x2713;</span></button>';
      }).join("");
    }

    function renderSummary() {
      var sd = $("[data-sum-day]", root), st = $("[data-sum-time]", root),
          sr = $("[data-sum-room]", root), sx = $("[data-sum-total]", root);
      if (sd) sd.textContent = sel.day ? fmtDay(sel.day) : "·";
      if (st) st.textContent = sel.time || "·";
      if (sr) sr.textContent = sel.room ? sel.room.name : "·";
      if (sx) sx.textContent = sel.room ? (sel.room.price + " · sample") : "·";
      var ready = sel.day && sel.time && sel.room;
      if (confirmBtn) confirmBtn.disabled = !ready;
    }

    daysWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".c2-book__day"); if (!btn || btn.disabled || !btn.getAttribute("data-day")) return;
      var d = parseInt(btn.getAttribute("data-day"), 10);
      sel.day = new Date(view.getFullYear(), view.getMonth(), d);
      // a new day resets downstream choices + the unlocked depth
      sel.time = null; sel.room = null; reached = 2;
      renderMonth(); renderSlots(); renderRooms(); renderSummary();
      if (note) { note.textContent = "Sample rates only. Final pricing is quoted per project. No charge, no live calendar."; note.classList.remove("is-done"); }
      if (confirmBtn) confirmBtn.querySelector("span").textContent = "Request this session";
      if (calHint) calHint.textContent = "Picked " + fmtDay(sel.day) + ". Now choose a time on the right.";
      showStep(2, true);   // flip to the time step
    });

    slotsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".c2-book__slot"); if (!btn) return;
      sel.time = btn.getAttribute("data-time");
      renderSlots(); renderSummary();
      goReached(3);        // flip to the room step
    });

    roomsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".c2-book__room"); if (!btn) return;
      var id = btn.getAttribute("data-room");
      sel.room = ROOMS.filter(function (r) { return r.id === id; })[0] || null;
      renderRooms(); renderSummary();
      goReached(4);        // flip to the summary step
    });

    // step-bar buttons = jump back to any reached step
    steps.forEach(function (li) {
      var b = li.querySelector("button"); if (!b) return;
      b.addEventListener("click", function () {
        var n = parseInt(li.getAttribute("data-step"), 10);
        if (n <= reached) showStep(n, true);
      });
    });
    if (backBtn) backBtn.addEventListener("click", function () {
      if (step > 1) showStep(step - 1, true);
    });

    var prev = $("[data-cal-prev]", root), next = $("[data-cal-next]", root);
    if (prev) prev.addEventListener("click", function () { view.setMonth(view.getMonth() - 1); renderMonth(); });
    if (next) next.addEventListener("click", function () { view.setMonth(view.getMonth() + 1); renderMonth(); });

    if (confirmBtn) confirmBtn.addEventListener("click", function () {
      if (confirmBtn.disabled) return;
      confirmBtn.querySelector("span").textContent = "Request sent (Preview)";
      if (note) { note.textContent = "Preview only. In the live site this asks our team for a quote and confirms by email."; note.classList.add("is-done"); }
    });

    renderMonth();
    showStep(1, false);
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE 4 · ROSTER APPLY  (tier select + validated apply form)
     ═══════════════════════════════════════════════════════════════ */
  function initApply() {
    var form = $("[data-apply-form]");
    var tiersWrap = $(".c2-tiers");
    if (!form && !tiersWrap) return;
    var chosenLabel = $("[data-tier-chosen]");
    var status = $("[data-apply-status]");
    var chosenTier = null;

    if (tiersWrap) tiersWrap.addEventListener("click", function (e) {
      var tier = e.target.closest(".c2-tier"); if (!tier) return;
      $$(".c2-tier", tiersWrap).forEach(function (t) { t.classList.remove("is-sel"); t.setAttribute("aria-checked", "false"); });
      tier.classList.add("is-sel"); tier.setAttribute("aria-checked", "true");
      var id = tier.getAttribute("data-tier");
      chosenTier = (TIERS.filter(function (t) { return t.id === id; })[0] || {}).name || id;
      if (chosenLabel) chosenLabel.textContent = chosenTier + " (Preview)";
      if (status) status.textContent = "";
    });

    if (form) {
      // inline validation hints
      $$(".c2-field input, .c2-field textarea", form).forEach(function (input) {
        input.addEventListener("blur", function () { validateField(input); });
        input.addEventListener("input", function () {
          var f = input.closest(".c2-field");
          if (f && f.classList.contains("is-bad")) validateField(input);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$(".c2-field input, .c2-field textarea", form).forEach(function (input) {
          if (!validateField(input)) ok = false;
        });
        if (!chosenTier) {
          if (status) { status.style.color = ""; status.textContent = "Pick a development tier to continue."; }
          ok = false;
        }
        if (!ok) return;
        if (status) status.textContent = "Application received (Preview). We'll be in touch. Nothing was charged.";
        form.reset();
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     MODULE 2 · LOGIN + AI RELEASE WINDOW
     Login (any creds, preview) → 4-step release form with step nav,
     validation hints, file-name echo, live splits total. Submit stubbed.
     ═══════════════════════════════════════════════════════════════ */
  function initRelease() {
    var loginWrap = $("[data-login]");
    var windowWrap = $("[data-window]");
    if (!loginWrap || !windowWrap) return;
    var loginForm = $("[data-login-form]");
    var userEl = $("[data-window-user]");

    // ---- login (preview: any non-empty creds) ----
    if (loginForm) {
      $$(".c2-field input", loginForm).forEach(function (input) {
        input.addEventListener("blur", function () { validateField(input); });
        input.addEventListener("input", function () {
          var f = input.closest(".c2-field");
          if (f && f.classList.contains("is-bad")) validateField(input);
        });
      });
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$(".c2-field input", loginForm).forEach(function (i) { if (!validateField(i)) ok = false; });
        if (!ok) return;
        var email = ($("#lg-email") || {}).value || "artist@musewav.com";
        if (userEl) userEl.textContent = email;
        loginWrap.hidden = true;
        windowWrap.hidden = false;
        rstep = 1; showStep();
        if (typeof MW !== "undefined" && MW.refresh) MW.refresh();
        windowWrap.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
      });
    }
    var logout = $("[data-logout]", windowWrap);
    if (logout) logout.addEventListener("click", function () {
      windowWrap.hidden = true; loginWrap.hidden = false;
      if (typeof MW !== "undefined" && MW.refresh) MW.refresh();
    });

    // ---- step navigation ----
    var rstep = 1;
    var TOTAL = 4;
    var stepLis = $$(".c2-window__steps li", windowWrap);
    var panels = $$(".c2-window__step", windowWrap);
    var backBtn = $("[data-rback]", windowWrap);
    var nextBtn = $("[data-rnext]", windowWrap);

    function showStep() {
      panels.forEach(function (p) { p.hidden = parseInt(p.getAttribute("data-rpanel"), 10) !== rstep; });
      stepLis.forEach(function (li) {
        var s = parseInt(li.getAttribute("data-rstep"), 10);
        li.classList.toggle("is-on", s === rstep);
        li.classList.toggle("is-done", s < rstep);
      });
      if (backBtn) backBtn.hidden = rstep === 1;
      if (nextBtn) nextBtn.querySelector("span").textContent = rstep === TOTAL ? "Done" : "Next";
      if (nextBtn) nextBtn.style.visibility = rstep === TOTAL ? "hidden" : "visible";
      if (rstep === 4) renderReview();
    }

    function validateStep(n) {
      if (n === 1) {
        var ok = true;
        ["#rl-title", "#rl-artist", "#rl-genre", "#rl-date"].forEach(function (sel) {
          var el = $(sel); if (el && !validateField(el)) ok = false;
        });
        return ok;
      }
      if (n === 3) {
        // splits must total 100
        return splitTotal() === 100;
      }
      return true; // files step is optional in the preview
    }

    if (nextBtn) nextBtn.addEventListener("click", function () {
      if (!validateStep(rstep)) {
        if (rstep === 3) flagSplit(true);
        return;
      }
      if (rstep < TOTAL) { rstep++; showStep(); }
    });
    if (backBtn) backBtn.addEventListener("click", function () {
      if (rstep > 1) { rstep--; showStep(); }
    });

    // ---- file upload UI (name echo only, no upload) ----
    $$(".c2-drop", windowWrap).forEach(function (drop) {
      var input = $('input[type="file"]', drop);
      var nameEl = $("[data-file-name]", drop);
      if (input) input.addEventListener("change", function () {
        var f = input.files && input.files[0];
        if (nameEl) nameEl.textContent = f ? f.name : "No file chosen";
        drop.classList.toggle("is-set", !!f);
      });
      // drag visual feedback (no real handling — preview)
      ["dragover", "dragenter"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-over"); });
      });
      drop.addEventListener("drop", function (e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && input) { try { input.files = e.dataTransfer.files; } catch (err) {} if (nameEl) nameEl.textContent = f.name; drop.classList.add("is-set"); }
      });
    });

    // ---- splits ----
    var splitsWrap = $("[data-splits]", windowWrap);
    var splitTotalEl = $("[data-split-total]", windowWrap);
    var splitFlag = $("[data-split-flag]", windowWrap);
    var addBtn = $("[data-split-add]", windowWrap);
    var splitSeed = [["You", "100"]];

    function splitRow(name, pct) {
      return '<div class="c2-split">' +
        '<input type="text" class="c2-split__name" placeholder="Collaborator name" value="' + esc(name || "") + '">' +
        '<span class="c2-split__pct"><input type="number" min="0" max="100" placeholder="0" value="' + esc(pct || "") + '"></span>' +
        '<button class="c2-split__rm" type="button" aria-label="Remove collaborator">&#x2715;</button>' +
        "</div>";
    }
    function renderSplits() {
      if (!splitsWrap) return;
      splitsWrap.innerHTML = splitSeed.map(function (s) { return splitRow(s[0], s[1]); }).join("");
      recalcSplit();
    }
    function splitTotal() {
      var t = 0;
      $$(".c2-split__pct input", splitsWrap).forEach(function (i) { t += parseFloat(i.value) || 0; });
      return Math.round(t * 100) / 100;
    }
    function flagSplit(force) {
      var t = splitTotal();
      if (splitFlag) {
        if (t === 100) { splitFlag.textContent = "Balanced"; splitFlag.className = "c2-splits__flag is-ok"; }
        else if (force || t > 0) { splitFlag.textContent = (t > 100 ? "Over by " : "Short by ") + Math.abs(100 - t) + "%"; splitFlag.className = "c2-splits__flag is-bad"; }
        else { splitFlag.textContent = ""; splitFlag.className = "c2-splits__flag"; }
      }
    }
    function recalcSplit() {
      if (splitTotalEl) splitTotalEl.textContent = splitTotal() + "%";
      flagSplit(false);
    }
    if (splitsWrap) {
      splitsWrap.addEventListener("input", recalcSplit);
      splitsWrap.addEventListener("click", function (e) {
        var rm = e.target.closest(".c2-split__rm"); if (!rm) return;
        var row = rm.closest(".c2-split");
        if (row && splitsWrap.children.length > 1) { row.remove(); recalcSplit(); }
      });
    }
    if (addBtn) addBtn.addEventListener("click", function () {
      if (!splitsWrap) return;
      splitsWrap.insertAdjacentHTML("beforeend", splitRow("", ""));
      recalcSplit();
    });

    // ---- review ----
    function val(sel) { var el = $(sel); return el && el.value ? el.value : ""; }
    function renderReview() {
      var review = $("[data-review]", windowWrap); if (!review) return;
      var splits = $$(".c2-split", splitsWrap).map(function (r) {
        var n = $(".c2-split__name", r), p = $(".c2-split__pct input", r);
        return (n && n.value ? n.value : "·") + " " + (p && p.value ? p.value + "%" : "0%");
      }).join(", ");
      var coverName = (function () { var d = $('[data-drop="cover"] [data-file-name]', windowWrap); return d ? d.textContent : "·"; })();
      var audioName = (function () { var d = $('[data-drop="audio"] [data-file-name]', windowWrap); return d ? d.textContent : "·"; })();
      var rows = [
        ["Title", val("#rl-title")],
        ["Artist", val("#rl-artist")],
        ["Genre", val("#rl-genre")],
        ["Release date", val("#rl-date")],
        ["Cover", coverName],
        ["Audio", audioName],
        ["Splits", splits + (splitTotal() === 100 ? " (100%)" : " (" + splitTotal() + "%)")]
      ];
      review.innerHTML = rows.map(function (r) {
        var missing = !r[1] || r[1] === "No file chosen";
        return '<div class="c2-review__row"><span>' + esc(r[0]) + "</span>" +
          '<b' + (missing ? ' class="is-missing"' : "") + ">" + esc(missing ? "Not set" : r[1]) + "</b></div>";
      }).join("");
    }

    var submitBtn = $("[data-release-submit]", windowWrap);
    var releaseNote = $("[data-release-note]", windowWrap);
    if (submitBtn) submitBtn.addEventListener("click", function () {
      submitBtn.querySelector("span").textContent = "Release queued (Preview)";
      submitBtn.disabled = true;
      if (releaseNote) { releaseNote.textContent = "Preview complete. In the live window this ships to every platform."; releaseNote.classList.add("is-done"); }
    });

    renderSplits();
    showStep();
  }

  /* shared field validator (used by apply, login, release step 1) ----- */
  function validateField(input) {
    var field = input.closest(".c2-field");
    var hint = field ? $("[data-hint]", field) : null;
    var v = (input.value || "").trim();
    var msg = "";
    if (input.hasAttribute("required") || input.tagName === "SELECT" || input.id === "rl-title" || input.id === "rl-artist" || input.id === "rl-genre" || input.id === "rl-date") {
      if (!v) msg = "Required";
    }
    if (!msg && input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email";
    if (!msg && input.type === "url" && v && !/^https?:\/\/.+/i.test(v)) msg = "Start with http:// or https://";
    if (field) {
      field.classList.toggle("is-bad", !!msg);
      field.classList.toggle("is-ok", !msg && !!v);
    }
    if (hint) hint.textContent = msg;
    return !msg;
  }

  /* ───────────────────────────────────────────────────────────────
     5. BOOT
     ─────────────────────────────────────────────────────────────── */
  injectContent();   // content first so motion can measure real DOM
  wireWork();
  setupInlineMotionToggles();

  // module logic is motion-independent → wire it immediately so the page
  // is fully interactive even if a CDN motion lib fails to load.
  initBooking();
  initApply();
  initRelease();

  function boot() {
    MW.preloader(function () {
      MW.initLenis({ duration: 1.5, lerp: 0.08 });   // long, luxurious smooth-scroll

      heroReveal();
      navBehavior();

      // scrubbed / scroll reveals (shared engine)
      MW.splitReveal(".reveal", { y: 120, duration: 1.05, stagger: 0.07 });
      MW.fadeUp("[data-reveal]", { y: 36, duration: 1 });
      MW.velocitySkew("[data-skew]");
      MW.parallax();                       // [data-parallax]
      MW.marquee(".c2-community__marquee", { speed: 70 });

      // soundwave divider · candy reactive ripple
      var waveCanvas = $(".c2-wave__canvas");
      if (waveCanvas) MW.soundwave(waveCanvas, { color: "#FF4FA3", lines: 64, amp: 0.4, thickness: 3 });

      // heavy / desktop-only: WebGL hero + work media motion + sticky stack
      var gl = null;
      MW.desktop(function () {
        gl = initCandyGL();
        animateWorkMedia();
        servicesStack();
        MW.refresh();
      });

      // interaction polish
      MW.cursor();
      MW.magnetic();

      MW.refresh();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { MW.refresh(); });
    });
  }

  if (document.readyState === "complete") { boot(); }
  else { window.addEventListener("load", boot); }
})();
