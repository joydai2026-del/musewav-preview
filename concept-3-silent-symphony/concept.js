/* ============================================================
   MUSE WAV · Concept 3 "HEAVEN & EARTH" · behaviour
   Quiet luxury, content-forward. team.design personality. Native scroll (no Lenis).
   Real content from window.MUSEWAV. Motion via shared MW. Video via shared MWV.
   Net-new modules (all client-side, stubbed): booking, login + AI release, roster + apply.
   Placeholder data is clearly marked "Preview" / "Sample" per qa-checklist placeholder_policy.
   ============================================================ */
(function () {
  "use strict";
  var M = window.MUSEWAV || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

  /* ============================================================
     PLACEHOLDER DATA (stubbed modules). Clearly sample, never real-looking.
     ============================================================ */
  var ROOMS = [
    { name: "Studio A",  tag: "Tracking + Live Room", rate: "$X / hr · sample rate", desc: "Tracking room with a full live room for bands and ensembles. Sample rate for preview." },
    { name: "Studio B",  tag: "Vocal Booth + Mix",    rate: "$X / hr · sample rate", desc: "Vocal booth paired with a mixing suite. Sample rate for preview." },
    { name: "The Loft",  tag: "Writing + Content",    rate: "$X / hr · sample rate", desc: "Writing room and content space for sessions and shoots. Sample rate for preview." }
  ];
  var SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  // Sample roster: placeholder stage names (NOT real artists). Each gets a
  // self-hosted PORTRAIT photo of a fictional person (AI-generated, no real
  // likeness; rights-clean) + a sample genre tag. One open slot kept at the end.
  var ROSTER = [
    { name: "NYLA",        role: "R&B · sample" },
    { name: "VELL",        role: "Hip-Hop · sample" },
    { name: "Saint Aria",  role: "Alt-Pop · sample" },
    { name: "Devon Cross", role: "Soul · sample" },
    { name: "K. Tanaka",   role: "Electronic · sample" },
    { name: "Jamal P.",    role: "Rap · sample" },
    { name: "Cassidy Vale",role: "Indie · sample" },
    { name: "Theo Mars",   role: "Pop · sample" },
    { name: "Open slot",   role: "Apply below", open: true }
  ];
  var TIERS = [
    { name: "Discovery", price: "Sample · $X", desc: "Single-track review and feedback. Placeholder tier." },
    { name: "Development", price: "Sample · $XX", desc: "EP development and release support. Placeholder tier." },
    { name: "Full Roster", price: "Sample · $XXX", desc: "Label representation and tour support. Placeholder tier." }
  ];

  /* ============================================================
     1 · CONTENT INJECTION (real data from content.js)
     ============================================================ */
  function fillText(sel, val) { var e = $(sel); if (e && val != null) e.textContent = val; }

  function buildNav() {
    var links = (M.nav || []).slice();
    // add module anchors so the new sections are reachable from the nav
    var withModules = [
      { label: "Book", href: "#booking" }
    ].concat(links).concat([
      { label: "Roster", href: "#roster" },
      { label: "Portal", href: "#portal" }
    ]);
    var d = $(".ss-nav__links"), m = $(".ss-menu__links");
    var html = withModules.map(function (n) { return '<a href="' + n.href + '">' + n.label + "</a>"; }).join("");
    if (d) d.innerHTML = html;
    if (m) m.innerHTML = html;
  }

  function buildVideos() {
    var grid = $("#work-grid");
    if (!grid || !M.videos) return;
    var hasMWV = window.MWV && typeof MWV.preview === "function";

    (M.videos || []).forEach(function (v, i) {
      var num = String(i + 1).padStart(2, "0");
      var item  = el("li", "ss-grid__item");
      var media = el("div", "ss-grid__media");

      // autoplay muted preview (shared engine: poster + gesture-kick + reduced-motion safe)
      if (hasMWV) {
        media.appendChild(MWV.preview(v.id, { className: "mwv" }));
      } else {
        var img = el("img", "mwv"); img.src = M.clipPoster ? M.clipPoster(v.id) : ""; img.alt = ""; img.loading = "lazy";
        media.appendChild(img);
      }
      var veil = el("span", "ss-grid__veil"); veil.setAttribute("aria-hidden", "true");
      var play = el("button", "ss-grid__play",
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>');
      play.type = "button";
      play.setAttribute("aria-label", "Play " + v.title + " with sound · " + (v.note || "MUSE WAV"));
      media.appendChild(veil); media.appendChild(play);

      var cap   = el("div", "ss-grid__caption");
      var titleWrap = el("div", "ss-grid__titlewrap");
      var title = el("button", "ss-grid__title", v.title);   // clickable title -> lightbox
      title.type = "button";
      title.setAttribute("aria-label", "Play " + v.title + " with sound");
      // explicit link to the ORIGINAL video on YouTube (opens in a new tab)
      var yt = el("a", "ss-grid__yt",
        'Watch on YouTube <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>');
      yt.href = M.ytWatch ? M.ytWatch(v.id) : "https://www.youtube.com/@MUSEWAV_INC";
      yt.target = "_blank"; yt.rel = "noopener";
      yt.setAttribute("aria-label", "Watch " + v.title + " on YouTube (opens a new tab)");
      titleWrap.appendChild(title);
      titleWrap.appendChild(yt);
      cap.appendChild(titleWrap);
      cap.appendChild(el("span", "ss-grid__num", num + " / " + (v.note || "MUSE WAV")));

      item.appendChild(media); item.appendChild(cap);
      grid.appendChild(item);

      // full video WITH sound, in the on-site lightbox (never leaves the page)
      function watch(e) {
        if (e) e.preventDefault();
        if (window.MWV && MWV.lightbox) MWV.lightbox.open(v.id, v.title);
        else window.open(M.ytWatch ? M.ytWatch(v.id) : "#", "_blank", "noopener");
      }
      play.addEventListener("click", watch);
      title.addEventListener("click", watch);
      // clicking the media opens the lightbox, EXCEPT on the YouTube link / buttons
      media.addEventListener("click", function (e) { if (e.target.closest("button,a")) return; watch(e); });
    });
  }

  function buildServices() {
    var list = $("#services-list");
    if (!list || !M.services) return;
    list.innerHTML = (M.services).map(function (s) {
      return '<div class="ss-service" data-reveal>' +
        '<span class="ss-service__num">' + s.n + "</span>" +
        '<h3 class="ss-service__title">' + s.title + "</h3>" +
        '<p class="ss-service__desc">' + s.desc + "</p></div>";
    }).join("");
  }

  function buildStudio() {
    var addr = $("[data-studio-address]");
    if (addr && M.studio && M.studio.addressLines) {
      addr.innerHTML = M.studio.addressLines.map(function (l) { return "<span>" + l + "</span>"; }).join("");
    }
    if (M.studio && M.studio.hours) fillText("[data-studio-hours]", M.studio.hours);
  }

  function buildSocials() {
    var wrap = $(".ss-footer__socials");
    if (!wrap || !M.socials) return;
    wrap.innerHTML = (M.socials).map(function (s) {
      return '<a href="' + s.href + '" target="_blank" rel="noopener" aria-label="MUSE WAV on ' + s.label + '">' + s.label + "</a>";
    }).join("");
  }

  function fillStrings() {
    if (M.group)   fillText("[data-hero-group]", M.group);
    if (M.tagline) fillText("[data-hero-tagline]", M.tagline);
    if (M.motto)   { fillText("[data-hero-motto]", M.motto); fillText("[data-footer-motto]", M.motto); }
    if (M.mission) fillText("[data-mission]", M.mission);
    if (M.community) fillText("[data-community]", M.community);
    if (M.trackCredit) fillText("[data-credit]", M.trackCredit.replace(/\.?$/, "."));
    if (M.copyright) fillText("[data-copyright]", M.copyright);

    if (M.contact) {
      var c = M.contact;
      var em = $("[data-contact-email]"), ph = $("[data-contact-phone]"), mt = $("[data-contact-mailto]");
      if (em && c.email) { em.href = "mailto:" + c.email; var v = $(".ss-cta__link-val", em); if (v) v.textContent = c.email; }
      if (ph && c.phone) { ph.href = c.phoneHref || "tel:" + c.phone.replace(/[^\d+]/g, ""); var pv = $(".ss-cta__link-val", ph); if (pv) pv.textContent = c.phone; }
      if (mt && c.email) { mt.href = "mailto:" + c.email; if (c.ctaLabel) mt.textContent = c.ctaLabel; }
    }
  }

  /* ============================================================
     2 · THEME TOGGLE (gold seals read on both worlds, no src swap needed)
     ============================================================ */
  function initToggle() {
    var btn = $(".ss-toggle");
    if (!btn) return;
    var html = document.documentElement, labelEl = $("[data-toggle-label]");
    function setTheme(theme) {
      html.setAttribute("data-theme", theme);
      var light = theme === "light";
      btn.setAttribute("aria-checked", light ? "true" : "false");
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      if (labelEl) labelEl.textContent = light ? "Light" : "Dark";
    }
    btn.addEventListener("click", function () {
      setTheme(html.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
    setTheme(html.getAttribute("data-theme") === "light" ? "light" : "dark");
  }

  /* nav hairline + mobile menu */
  function initNav() {
    var nav = $(".ss-nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 24); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    }
    var burger = $(".ss-burger"), menu = $("#ss-menu");
    if (burger && menu && nav) {
      function closeMenu() { nav.classList.remove("is-menu"); menu.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); }
      burger.addEventListener("click", function () {
        var open = !nav.classList.contains("is-menu");
        nav.classList.toggle("is-menu", open);
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    }
  }

  /* native smooth anchors */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ============================================================
     MOD-1 · STUDIO + BOOKING
     ============================================================ */
  function initBooking() {
    var calGrid = $("#booking-cal");
    if (!calGrid) return;
    var monthEl = $("[data-cal-month]");
    var slotsWrap = $("#booking-slots");
    var sumDay = $("[data-sum-day]"), sumTime = $("[data-sum-time]"), sumRoom = $("[data-sum-room]"), sumRate = $("[data-sum-rate]");
    var goBtn = $("[data-book-go]"), confirmEl = $("[data-book-confirm]"), dayTag = $("[data-book-day]");
    var steps = $$("[data-bstep]"), rail = $$(".ss-book-rail__item");

    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var state = { day: null, time: null, room: null };
    var bstep = 0;

    // populate the studio cards (the "Studio" step — selectable)
    var roomsWrap = $("#booking-rooms");
    if (roomsWrap) roomsWrap.innerHTML = ROOMS.map(function (r, i) {
      return '<button class="ss-room" type="button" role="radio" aria-checked="false" data-room="' + i + '">' +
        '<span class="ss-room__name">' + r.name + '</span>' +
        '<span class="ss-room__rate">' + r.rate + '</span>' +
        '<span class="ss-room__tag">' + r.tag + '</span>' +
        '<span class="ss-room__desc">' + r.desc + '</span></button>';
    }).join("");

    // show one step at a time, smoothly; update the rail
    function showStep(n) {
      bstep = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (p, i) { p.classList.toggle("is-active", i === bstep); });
      rail.forEach(function (it, i) {
        it.classList.toggle("is-active", i === bstep);
        it.classList.toggle("is-done", i < bstep);
      });
    }

    function fmtDay(d) { return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear(); }

    function renderMonth() {
      monthEl.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
      // Monday-first weekday index
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var lead = (first.getDay() + 6) % 7;
      var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      var cells = [];
      for (var i = 0; i < lead; i++) cells.push('<span class="ss-day ss-day--empty" aria-hidden="true"></span>');
      for (var d = 1; d <= days; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var past = date < today;
        var sel = state.day && date.getTime() === state.day.getTime();
        cells.push(
          '<button class="ss-day' + (sel ? " is-selected" : "") + '" type="button" data-d="' + d + '"' +
          (past ? " disabled" : "") + ' aria-label="' + fmtDay(date) + '">' + d +
          (past ? "" : '<span class="ss-day__dot" aria-hidden="true"></span>') + "</button>"
        );
      }
      calGrid.innerHTML = cells.join("");
    }

    function refreshSummary() {
      sumDay.textContent  = state.day  ? fmtDay(state.day) : "Not set";
      sumTime.textContent = state.time || "Not set";
      sumRoom.textContent = state.room != null ? ROOMS[state.room].name : "Not set";
      sumRate.textContent = state.room != null ? ROOMS[state.room].rate : "Not set";
      var ready = state.day && state.time && state.room != null;
      goBtn.disabled = !ready;
      if (confirmEl && !confirmEl.hidden) { confirmEl.hidden = true; confirmEl.textContent = ""; }
    }

    function buildSlots() {
      // deterministically mark a couple of slots taken so it feels live (still placeholder)
      var seed = state.day ? state.day.getDate() : 0;
      slotsWrap.innerHTML = SLOTS.map(function (t, i) {
        var taken = ((seed + i) % 4) === 0;
        return '<button class="ss-slot" type="button" role="option" aria-selected="false" data-t="' + t + '"' +
          (taken ? " disabled aria-disabled=\"true\"" : "") + '>' + t + "</button>";
      }).join("");
    }

    calGrid.addEventListener("click", function (e) {
      var b = e.target.closest(".ss-day"); if (!b || b.disabled || b.classList.contains("ss-day--empty")) return;
      state.day = new Date(view.getFullYear(), view.getMonth(), parseInt(b.getAttribute("data-d"), 10));
      state.time = null;
      $$(".ss-day", calGrid).forEach(function (x) { x.classList.remove("is-selected"); x.removeAttribute("aria-current"); });
      b.classList.add("is-selected"); b.setAttribute("aria-current", "date");
      if (dayTag) dayTag.textContent = "· " + fmtDay(state.day);
      buildSlots();
      refreshSummary();
      showStep(1); // advance to the time step
    });

    slotsWrap.addEventListener("click", function (e) {
      var b = e.target.closest(".ss-slot"); if (!b || b.disabled) return;
      state.time = b.getAttribute("data-t");
      $$(".ss-slot", slotsWrap).forEach(function (x) { x.classList.remove("is-selected"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-selected"); b.setAttribute("aria-selected", "true");
      refreshSummary();
      showStep(2); // advance to the studio step
    });

    // selecting a studio
    function selectRoom(idx) {
      state.room = idx;
      if (roomsWrap) $$("[data-room]", roomsWrap).forEach(function (x) {
        var on = parseInt(x.getAttribute("data-room"), 10) === idx;
        x.classList.toggle("is-selected", on);
        x.setAttribute("aria-checked", on ? "true" : "false");
      });
      refreshSummary();
      showStep(3); // advance to the confirm/summary step
    }
    if (roomsWrap) roomsWrap.addEventListener("click", function (e) {
      var b = e.target.closest(".ss-room"); if (!b) return;
      selectRoom(parseInt(b.getAttribute("data-room"), 10));
    });

    // back buttons step the panel backwards
    $$("[data-bstep-back]").forEach(function (btn) {
      btn.addEventListener("click", function () { showStep(bstep - 1); });
    });

    $("[data-cal-prev]").addEventListener("click", function () {
      var min = new Date(today.getFullYear(), today.getMonth(), 1);
      var prev = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      if (prev < min) return;
      view = prev; renderMonth();
    });
    $("[data-cal-next]").addEventListener("click", function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth();
    });

    goBtn.addEventListener("click", function () {
      if (goBtn.disabled) return;
      confirmEl.hidden = false;
      confirmEl.textContent = "Preview: session held for " + fmtDay(state.day) + " at " + state.time +
        " · " + ROOMS[state.room].name + ". No booking is sent in this preview.";
    });

    renderMonth();
  }

  /* ============================================================
     MOD-4 · ROSTER + APPLY
     ============================================================ */
  function initRoster() {
    var grid = $("#roster-grid");
    if (grid) grid.innerHTML = ROSTER.map(function (a, i) {
      var open = !!a.open;
      // self-hosted PORTRAIT photo of a fictional person (AI-generated, no real
      // likeness; rights-clean). Sepia/gold-graded via CSS for the quiet-luxury look.
      var art = open
        ? '<div class="ss-roster__art ss-roster__art--open"><span class="ss-roster__plus" aria-hidden="true">+</span></div>'
        : '<div class="ss-roster__art" style="--seat:' + i + '">' +
            '<img class="ss-roster__photo" src="../assets/roster/roster-' + (i + 1) + '.jpg" ' +
              'alt="Sample portrait, placeholder fictional person" loading="lazy" decoding="async" width="600" height="800">' +
          '</div>';
      return '<li class="ss-roster__card' + (open ? ' is-open' : '') + '">' + art +
        '<div class="ss-roster__body"><p class="ss-roster__name">' + a.name + '</p>' +
        '<p class="ss-roster__role">' + a.role + '</p></div></li>';
    }).join("");

    // tiers
    var tiersWrap = $("#apply-tiers"), priceEl = $("[data-apply-price]");
    var chosen = null;
    if (tiersWrap) {
      tiersWrap.innerHTML = TIERS.map(function (t, i) {
        return '<button class="ss-tier" type="button" role="radio" aria-checked="false" data-tier="' + i + '">' +
          '<span class="ss-tier__name">' + t.name + '</span>' +
          '<span class="ss-tier__price">' + t.price + '</span>' +
          '<span class="ss-tier__desc">' + t.desc + '</span></button>';
      }).join("");
      tiersWrap.addEventListener("click", function (e) {
        var b = e.target.closest(".ss-tier"); if (!b) return;
        chosen = parseInt(b.getAttribute("data-tier"), 10);
        $$(".ss-tier", tiersWrap).forEach(function (x) { x.classList.remove("is-selected"); x.setAttribute("aria-checked", "false"); });
        b.classList.add("is-selected"); b.setAttribute("aria-checked", "true");
        if (priceEl) priceEl.innerHTML = "Deposit: <strong>" + TIERS[chosen].price + "</strong> · " + TIERS[chosen].name;
      });
    }

    // apply form (client-side validation; pay stubbed)
    var form = $("#apply-form"), confirmEl = $("[data-apply-confirm]");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = validateForm(form);
      if (chosen == null) {
        ok = false;
        if (priceEl) { priceEl.innerHTML = "<strong>Select a tier to continue</strong>"; }
      }
      if (!ok) return;
      confirmEl.hidden = false;
      confirmEl.textContent = "Preview: application received for the " + TIERS[chosen].name +
        " tier. Payment is stubbed in this preview, nothing is charged.";
      form.reset();
      $$(".ss-tier", tiersWrap).forEach(function (x) { x.classList.remove("is-selected"); x.setAttribute("aria-checked", "false"); });
      chosen = null;
      if (priceEl) priceEl.textContent = "Select a tier";
    });
  }

  /* ============================================================
     MOD-2 · LOGIN + AI RELEASE WINDOW
     ============================================================ */
  function initPortal() {
    var login = $("#portal-login"), release = $("#portal-release");
    if (!login || !release) return;

    login.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm(login)) return;
      var email = (login.querySelector('[name="email"]') || {}).value || "artist";
      login.hidden = true;
      release.hidden = false;
      var who = $("[data-release-who]"); if (who) who.textContent = "as " + email;
      release.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    var out = $("[data-release-out]");
    if (out) out.addEventListener("click", function () {
      release.hidden = true; login.hidden = false;
      login.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });

    initReleaseFlow();
  }

  function initReleaseFlow() {
    var form = $("#release-form");
    if (!form) return;
    var panels = $$(".ss-panel", form);
    var stepItems = $$(".ss-steps__item");
    var back = $("[data-step-back]"), next = $("[data-step-next]"), submit = $("[data-step-submit]");
    var confirmEl = $("[data-release-confirm]");
    var step = 0;

    /* file drops */
    $$(".ss-drop", form).forEach(function (drop) {
      var input = $(".ss-drop__input", drop), out = $("[data-drop-file]", drop);
      function open() { input.click(); }
      drop.addEventListener("click", function (e) { if (e.target !== input) open(); });
      drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      input.addEventListener("change", function () {
        if (input.files && input.files[0]) { drop.classList.add("has-file"); out.textContent = input.files[0].name; }
        else { drop.classList.remove("has-file"); out.textContent = ""; }
      });
    });

    /* splits */
    var splitsWrap = $("#release-splits"), totalEl = $("[data-split-total]"), splitHint = $("[data-split-hint]");
    function splitRow(name, pct) {
      var row = el("div", "ss-split");
      row.innerHTML =
        '<input class="ss-field__input" type="text" placeholder="Collaborator name" value="' + (name || "") + '">' +
        '<span class="ss-split__pct"><input class="ss-field__input" type="number" min="0" max="100" value="' + (pct != null ? pct : 0) + '"></span>' +
        '<button class="ss-split__rm" type="button" aria-label="Remove collaborator">&times;</button>';
      return row;
    }
    function recalcSplits() {
      var total = 0;
      $$(".ss-split", splitsWrap).forEach(function (r) {
        total += parseFloat($('input[type="number"]', r).value) || 0;
      });
      totalEl.textContent = total;
      var bad = total !== 100;
      totalEl.parentNode.classList.toggle("is-bad", bad);
      if (splitHint) splitHint.textContent = bad ? "Splits must total 100% (currently " + total + "%)." : "";
      return !bad;
    }
    if (splitsWrap) {
      splitsWrap.appendChild(splitRow("Primary artist", 100));
      splitsWrap.addEventListener("input", recalcSplits);
      splitsWrap.addEventListener("click", function (e) {
        if (e.target.closest(".ss-split__rm")) {
          if ($$(".ss-split", splitsWrap).length <= 1) return;
          e.target.closest(".ss-split").remove(); recalcSplits();
        }
      });
      var add = $("[data-split-add]");
      if (add) add.addEventListener("click", function () { splitsWrap.appendChild(splitRow("", 0)); recalcSplits(); });
      recalcSplits();
    }

    function showStep(n) {
      step = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach(function (p, i) { p.classList.toggle("is-active", i === step); });
      stepItems.forEach(function (it, i) {
        it.classList.toggle("is-active", i === step);
        it.classList.toggle("is-done", i < step);
      });
      back.hidden = step === 0;
      next.hidden = step === panels.length - 1;
      submit.hidden = step !== panels.length - 1;
      if (step === panels.length - 1) buildReview();
    }

    function panelValid(n) {
      var panel = panels[n];
      // step 2 (splits) has its own rule
      if (n === 2) return recalcSplits();
      return validateForm(form, panel);
    }

    function buildReview() {
      var review = $("#release-review");
      if (!review) return;
      var data = collect(form);
      var rows = [
        ["Title", data.title], ["Primary artist", data.primary], ["Genre", data.genre],
        ["Release date", data.date || "Not set"],
        ["Cover art", coverName("cover")], ["Master audio", coverName("audio")],
        ["Splits", splitSummary()]
      ];
      review.innerHTML = rows.map(function (r) {
        return '<div class="ss-review__row"><dt>' + r[0] + '</dt><dd>' + (r[1] || "Not set") + '</dd></div>';
      }).join("");
    }
    function coverName(which) {
      var drop = $('.ss-drop[data-drop="' + which + '"]', form);
      var out = drop ? $("[data-drop-file]", drop).textContent : "";
      return out || "Not added";
    }
    function splitSummary() {
      return $$(".ss-split", form).map(function (r) {
        var nm = $('input[type="text"]', r).value || "Unnamed";
        var pc = $('input[type="number"]', r).value || "0";
        return nm + " " + pc + "%";
      }).join(" · ");
    }

    next.addEventListener("click", function () { if (panelValid(step)) showStep(step + 1); });
    back.addEventListener("click", function () { showStep(step - 1); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var agree = form.querySelector('[name="agree"]');
      if (!recalcSplits()) { showStep(2); return; }
      if (agree && !agree.checked) { agree.focus(); return; }
      confirmEl.hidden = false;
      confirmEl.textContent = "Preview: release submitted to the MUSE WAV queue. This is a demo, nothing is distributed.";
      submit.disabled = true; submit.textContent = "Submitted";
    });

    showStep(0);
  }

  /* ---- shared form helpers (validation + collect) ---- */
  function validateForm(form, scope) {
    var root = scope || form;
    var fields = $$("input[required], textarea[required], select[required]", root);
    var ok = true, firstBad = null;
    fields.forEach(function (input) {
      var wrap = input.closest(".ss-field");
      var valid = input.checkValidity() && String(input.value).trim() !== "";
      if (wrap) {
        wrap.classList.toggle("is-invalid", !valid);
        var hint = $("[data-hint]", wrap);
        if (hint) hint.textContent = valid ? "" : (input.validationMessage || "This field is required.");
      }
      if (!valid && !firstBad) firstBad = input;
      if (!valid) ok = false;
    });
    if (firstBad) firstBad.focus();
    return ok;
  }
  function collect(form) {
    var o = {};
    $$("input[name], select[name], textarea[name]", form).forEach(function (f) {
      if (f.type === "file" || f.closest(".ss-split")) return;
      o[f.name] = f.value;
    });
    return o;
  }

  /* ============================================================
     3 · BOOT
     ============================================================ */
  buildNav();
  buildVideos();
  buildServices();
  buildStudio();
  buildSocials();
  fillStrings();
  initToggle();
  initNav();
  initAnchors();
  initBooking();
  initRoster();
  initPortal();

  /* gentle reveals on native scroll */
  function runReveals() {
    if (!window.MW) return;
    MW.splitReveal("[data-split]", { y: 90, stagger: 0.07, duration: 1.05 });
    MW.fadeUp("[data-reveal]", { y: 34, duration: 1, stagger: 0.08 });
    var wave = $(".ss-hero__wave");
    if (wave) MW.soundwave(wave, { color: "#E8A33D", lines: 60, amp: 0.18, speed: 0.014, thickness: 2 });
    MW.refresh();
    setTimeout(function () { MW.refresh(); }, 350);
  }

  window.addEventListener("load", function () {
    if (window.MW && typeof MW.preloader === "function") {
      MW.preloader(runReveals);
    } else {
      var pre = $(".mw-preloader"); if (pre) pre.remove();
      runReveals();
    }
  });
})();
