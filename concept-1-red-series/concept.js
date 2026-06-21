/* ============================================================
   MUSE WAV · CONCEPT A · "RED DRAGON" · orchestration
   Real content from window.MUSEWAV. Motion via shared MW (motion.js).
   Net-new modules (booking, login+release, roster+apply) are all-visual,
   client-side only; submits are stubbed "Preview" per qa placeholder_policy.
   ============================================================ */
(function () {
  "use strict";
  var M = window.MUSEWAV || {};

  /* ---------- tiny DOM helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function on(node, ev, fn) { if (node) node.addEventListener(ev, fn); }

  /* ============================================================
     1. INJECT REAL CONTENT (showcase spine)
     ============================================================ */

  /* --- NAV links (desktop + mobile) --- */
  (function navLinks() {
    var d = $(".nav__links"), m = $(".navmenu__links");
    (M.nav || []).forEach(function (item) {
      if (d) { var a = el("a", "nav__link"); a.href = item.href; a.textContent = item.label; d.appendChild(a); }
      if (m) { var b = document.createElement("a"); b.href = item.href; b.textContent = item.label; m.appendChild(b); }
    });
  })();

  /* --- MARQUEE: services as one repeating phrase --- */
  (function marquee() {
    var track = $(".marquee__track");
    if (!track) return;
    var words = (M.services || []).map(function (s) { return s.title.toUpperCase(); });
    if (!words.length) return;
    function makePhrase() {
      var item = el("span", "marquee__item");
      words.forEach(function (w) {
        item.appendChild(document.createTextNode(w));
        var star = el("span", "marquee__star", "&#x2731;");
        star.setAttribute("aria-hidden", "true");
        item.appendChild(star);
      });
      return item;
    }
    var guard = 0;
    do { track.appendChild(makePhrase()); guard++; }
    while (track.offsetWidth < window.innerWidth * 2 && guard < 12);
  })();

  /* --- SERVICES: numbered editorial rows --- */
  (function services() {
    var list = $(".services__list");
    if (!list) return;
    (M.services || []).forEach(function (s) {
      var li = el("li", "services__item");
      var row = el("div", "services__row");
      row.appendChild(el("span", "services__num", s.n));
      row.appendChild(el("span", "services__name", s.title));
      row.appendChild(el("span", "services__desc", s.desc));
      li.appendChild(row);
      list.appendChild(li);
    });
  })();

  /* --- WORK: editorial grid of autoplay previews; click -> full video --- */
  (function work() {
    var grid = $(".work__grid");
    if (!grid) return;
    var sizes = ["a", "b", "c", "d", "e", "f"];
    var hasMWV = window.MWV && typeof MWV.preview === "function";
    (M.videos || []).forEach(function (v, i) {
      var cell = el("div", "vcell vcell--" + (sizes[i] || "f"));
      var fig = el("figure", "vfacade");

      var media;
      if (hasMWV) {
        media = MWV.preview(v.id, { className: "vfacade__video" });
      } else {
        media = el("img", "vfacade__video");
        media.src = M.ytThumb ? M.ytThumb(v.id) : "";
        media.alt = ""; media.loading = "lazy";
      }

      var shade = el("div", "vfacade__shade"); shade.setAttribute("aria-hidden", "true");

      var play = el("button", "vfacade__play",
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>');
      play.type = "button";
      play.setAttribute("aria-label", "Watch " + v.title + " · MUSE WAV");

      var meta = el("div", "vfacade__meta");
      var metaText = el("div", "vfacade__metatext");
      // Title -> on-site lightbox (plays the real video without leaving the site).
      var title = el("button", "vfacade__title");
      title.type = "button";
      title.textContent = v.title;
      title.setAttribute("aria-label", "Play " + v.title + " in player · MUSE WAV");
      metaText.appendChild(title);
      // Secondary, explicit link OUT to the original YouTube video (not intercepted).
      var yt = el("a", "vfacade__yt");
      yt.href = M.ytWatch ? M.ytWatch(v.id) : "https://www.youtube.com/@MUSEWAV_INC";
      yt.target = "_blank"; yt.rel = "noopener";
      yt.innerHTML = '<span>' + (v.note || "MUSE WAV") + '</span><span class="vfacade__ytlabel">Watch on YouTube &#x2197;</span>';
      yt.setAttribute("aria-label", "Watch " + v.title + " on YouTube (opens a new tab)");
      metaText.appendChild(yt);
      meta.appendChild(metaText);

      fig.appendChild(media); fig.appendChild(shade); fig.appendChild(play); fig.appendChild(meta);
      cell.appendChild(fig);
      grid.appendChild(cell);

      function watch(e) {
        if (!window.MWV || !MWV.lightbox) return;
        if (e) e.preventDefault();
        MWV.lightbox.open(v.id, v.title);
      }
      // play button + title + tile background open the lightbox; the YouTube link is NOT intercepted.
      on(play, "click", watch);
      on(title, "click", watch);
      on(fig, "click", function (e) {
        if (e.target.closest("a, button")) return;   // YouTube <a> + title/play <button> handle themselves
        watch(e);
      });
    });
  })();

  /* --- STUDIO info: address + hours --- */
  (function studio() {
    var addr = $(".studio__addr"), hours = $(".studio__hours");
    var s = M.studio || {};
    if (addr && s.addressLines) addr.innerHTML = s.addressLines.map(function (l) { return "<span>" + l + "</span>"; }).join("");
    if (hours) hours.textContent = s.hours || "";
  })();

  /* --- FOOTER: socials + address + copyright --- */
  (function footer() {
    var soc = $(".footer__socials");
    (M.socials || []).forEach(function (s) {
      var a = el("a", "footer__social");
      a.href = s.href; a.target = "_blank"; a.rel = "noopener";
      a.textContent = s.label;
      a.setAttribute("aria-label", s.label + " · opens in a new tab");
      if (soc) soc.appendChild(a);
    });
    var fa = $(".footer__addr"), fc = $(".footer__copy");
    var st = M.studio || {};
    if (fa && st.addressLines) fa.innerHTML = st.addressLines.map(function (l) { return "<span>" + l + "</span>"; }).join("");
    if (fc) fc.textContent = M.copyright || "";
  })();

  /* --- mobile menu toggle --- */
  (function burger() {
    var nav = $(".nav"), burger = $(".nav__burger"), menu = $("#navmenu");
    if (!burger || !menu) return;
    function close() { nav.classList.remove("is-open"); menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); }
    on(burger, "click", function () {
      var open = menu.classList.toggle("is-open");
      nav.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $all("a", menu).forEach(function (a) { on(a, "click", close); });
  })();

  /* ============================================================
     MODULE DATA (PLACEHOLDER — clearly-marked preview per qa policy)
     No fabricated real-looking artist names / exact prices.
     ============================================================ */
  var PREVIEW = {
    rooms: [
      { name: "Studio A", forr: "Tracking + live room", desc: "Sample flagship room for full-band sessions and vocal tracking.", rate: "$X / hr" },
      { name: "Studio B", forr: "Vocal booth + mix", desc: "Sample room for vocal takes, overdubs and mixing sessions.", rate: "$X / hr" },
      { name: "The Loft", forr: "Writing + content", desc: "Sample creative space for writing camps and social content.", rate: "$X / hr" }
    ],
    slots: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"],
    packages: [
      { name: "Hourly", note: "Pay as you go", price: "$X / hr" },
      { name: "Half-day block", note: "4 hours", price: "$X" },
      { name: "Full-day block", note: "8 hours", price: "$X" },
      { name: "Video + studio", note: "Studio + MV crew", price: "$X" }
    ],
    // Sample roster: PLACEHOLDER stage names (not real signed artists), each with a
    // self-hosted PORTRAIT photo of a fictional person (AI-generated, no real
    // likeness; rights-clean). One open slot stays at the end.
    roster: [
      { name: "NYLA",        tag: "R&B / Soul" },
      { name: "VELL",        tag: "Hip-Hop / Rap" },
      { name: "Saint Aria",  tag: "Alt Pop" },
      { name: "Devon Cross", tag: "Drill" },
      { name: "K. Tanaka",   tag: "Electronic" },
      { name: "Jamal P.",    tag: "Afrobeats" },
      { name: "Cassidy Vale", tag: "Indie Pop" },
      { name: "Theo Mars",   tag: "Trap / Melodic" },
      { name: "Open slot",   tag: "Your name here", open: true }
    ],
    tiers: [
      { name: "Spark", price: "$X", per: "one-time", pop: false, list: ["Sample: A&R review", "Sample: 1 single setup", "Sample: release to stores"] },
      { name: "Rise", price: "$X", per: "per release", pop: true, list: ["Everything in Spark", "Sample: music video credit", "Sample: playlist + social push", "Sample: artist dev session"] },
      { name: "Reign", price: "$X", per: "season", pop: false, list: ["Everything in Rise", "Sample: full campaign", "Sample: tour support", "Sample: priority studio time"] }
    ]
  };

  /* ============================================================
     MOD-1 · STUDIO + BOOKING
     Flow: 1 pick a studio (RIGHT) + 2 pick a date (LEFT calendar)
           -> 3 time slot -> 4 package -> live summary -> action.
     ============================================================ */
  (function booking() {
    var root = $("#studio-booking");
    if (!root) return;

    /* day-of-week header */
    var dow = $(".bk-cal__dow", root);
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(function (d) { dow.appendChild(el("span", null, d)); });

    var grid = $("[data-cal-grid]", root);
    var monthLabel = $("[data-cal-month]", root);
    var state = { view: new Date(), studio: null, day: null, slot: null, pkg: null };
    state.view.setDate(1);
    var today = new Date(); today.setHours(0, 0, 0, 0);

    var roomsWrap = $(".bk-rooms", root);
    var slotsBlock = $("[data-bk-slots-block]", root);
    var slotsWrap = $(".bk-slots", root);
    var dayLabel = $("[data-bk-day]", root);
    var pkgBlock = $("[data-bk-pkg-block]", root);
    var pkgWrap = $(".bk-pkg", root);
    var summary = $("[data-bk-summary]", root);
    var summaryRows = $(".bk-summary__rows", root);
    var emptyState = $("[data-bk-empty]", root);
    var confirmLine = $("[data-bk-confirm]", root);

    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // deterministic "has availability" so the dots are stable (not random each render)
    function hasAvail(d) { return d.getDay() !== 0 && (d.getDate() % 7 !== 3); } // open most days; closed Sundays + every 7th-ish

    function fmtDay(d) {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + " " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate();
    }

    /* --- STEP 1: selectable studio cards (right column) --- */
    PREVIEW.rooms.forEach(function (r) {
      var c = el("button", "bk-room");
      c.type = "button";
      c.setAttribute("role", "radio");
      c.setAttribute("aria-checked", "false");
      c.setAttribute("aria-pressed", "false");
      c.innerHTML =
        '<span class="bk-room__for">' + r.forr + '</span>' +
        '<span class="bk-room__name">' + r.name + '</span>' +
        '<span class="bk-room__desc">' + r.desc + '</span>' +
        '<span class="bk-room__rate"><b>' + r.rate + '</b> · sample rate</span>' +
        '<span class="bk-room__check" aria-hidden="true">Selected</span>';
      on(c, "click", function () {
        state.studio = r;
        $all(".bk-room", roomsWrap).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.setAttribute("aria-checked", "false"); });
        c.setAttribute("aria-pressed", "true"); c.setAttribute("aria-checked", "true");
        updateSummary();
      });
      roomsWrap.appendChild(c);
    });

    function renderMonth() {
      grid.innerHTML = "";
      monthLabel.textContent = MONTHS[state.view.getMonth()] + " " + state.view.getFullYear();
      var first = new Date(state.view.getFullYear(), state.view.getMonth(), 1);
      var startPad = (first.getDay() + 6) % 7; // Monday-first
      var daysIn = new Date(state.view.getFullYear(), state.view.getMonth() + 1, 0).getDate();
      for (var p = 0; p < startPad; p++) grid.appendChild(el("div", "bk-day bk-day--empty"));
      for (var d = 1; d <= daysIn; d++) {
        var date = new Date(state.view.getFullYear(), state.view.getMonth(), d);
        var btn = el("button", "bk-day", String(d));
        btn.type = "button";
        var past = date < today;
        var open = !past && hasAvail(date);
        if (open) btn.classList.add("bk-day--has");
        // keep the currently-chosen day visibly pressed across month re-renders
        var isChosen = state.day && date.getTime() === state.day.getTime();
        btn.disabled = past || !open;
        btn.setAttribute("aria-pressed", isChosen ? "true" : "false");
        btn.setAttribute("aria-label", fmtDay(date) + (open ? " · times available" : " · closed"));
        if (!btn.disabled) {
          (function (date) {
            on(btn, "click", function () { selectDay(date, btn); });
          })(date);
        }
        grid.appendChild(btn);
      }
    }

    function selectDay(date, btn) {
      state.day = date; state.slot = null;
      $all(".bk-day[aria-pressed='true']", grid).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      dayLabel.textContent = "· " + fmtDay(date);
      renderSlots();
      slotsBlock.hidden = false;
      pkgBlock.hidden = false;
      emptyState.hidden = true;
      if (!pkgWrap.children.length) renderPackages();
      updateSummary();
    }

    function renderSlots() {
      slotsWrap.innerHTML = "";
      PREVIEW.slots.forEach(function (t, i) {
        var b = el("button", "bk-slot", t);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        // deterministic "taken" pattern so it feels real but stable
        var taken = ((state.day.getDate() + i) % 5 === 0);
        b.disabled = taken;
        if (taken) b.setAttribute("aria-label", t + " · booked");
        on(b, "click", function () {
          state.slot = t;
          $all(".bk-slot[aria-pressed='true']", slotsWrap).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          updateSummary();
        });
        slotsWrap.appendChild(b);
      });
    }

    function renderPackages() {
      pkgWrap.innerHTML = "";
      PREVIEW.packages.forEach(function (p) {
        var b = el("button", "bk-pkg__opt");
        b.type = "button";
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", "false");
        b.setAttribute("aria-pressed", "false");
        b.innerHTML = '<span class="bk-pkg__name">' + p.name + '<small>' + p.note + '</small></span>' +
                      '<span class="bk-pkg__price">' + p.price + '</span>';
        on(b, "click", function () {
          state.pkg = p;
          $all(".bk-pkg__opt", pkgWrap).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-pressed", "true"); b.setAttribute("aria-checked", "true");
          updateSummary();
        });
        pkgWrap.appendChild(b);
      });
    }

    function updateSummary() {
      // show the summary as soon as the visitor has made ANY choice
      if (!state.studio && !state.day) { summary.hidden = true; emptyState.hidden = false; return; }
      summary.hidden = false;
      emptyState.hidden = true;
      confirmLine.hidden = true;
      var rows = [
        ["Studio", state.studio ? state.studio.name + " · " + state.studio.forr : "Pick a studio"],
        ["Date", state.day ? fmtDay(state.day) : "Pick a date"],
        ["Time", state.slot || (state.day ? "Pick a time" : "Pick a date first")],
        ["Package", state.pkg ? state.pkg.name + " · " + state.pkg.price : "Pick a package"],
        ["Location", "333 Hudson St, Rm 1005"]
      ];
      summaryRows.innerHTML = rows.map(function (r) {
        var pending = /^Pick /.test(r[1]);
        return "<div><dt>" + r[0] + "</dt><dd class='" + (pending ? "is-pending" : "") + "'>" + r[1] + "</dd></div>";
      }).join("");
      var book = $("[data-bk-book]", root);
      var ready = !!(state.studio && state.day && state.slot && state.pkg);
      book.disabled = !ready;
      book.style.opacity = ready ? "1" : ".5";
    }

    on($("[data-cal-prev]", root), "click", function () { state.view.setMonth(state.view.getMonth() - 1); renderMonth(); });
    on($("[data-cal-next]", root), "click", function () { state.view.setMonth(state.view.getMonth() + 1); renderMonth(); });
    on($("[data-bk-book]", root), "click", function () {
      if (!(state.studio && state.day && state.slot && state.pkg)) return;
      confirmLine.hidden = false;
      confirmLine.textContent = "Preview only. No booking was made. In the live site this requests " +
        state.studio.name + " (" + state.pkg.name + ") on " + fmtDay(state.day) + " at " + state.slot + ".";
    });

    renderMonth();
  })();

  /* ============================================================
     MOD-2 · LOGIN + AI RELEASE WINDOW
     ============================================================ */
  (function release() {
    var root = $("#release");
    if (!root) return;

    var loginForm = $("[data-rl-login]", root);
    var wizard = $("[data-rl-wizard]", root);

    function showHint(input, msg) {
      var hint = input.parentElement.querySelector("[data-hint]");
      if (hint) hint.textContent = msg || "";
      return !msg;
    }

    function enterWizard() {
      loginForm.hidden = true;
      wizard.hidden = false;
      buildSplits();
      goStep(0);
      // smooth-scroll the panel into view through Lenis if present
      if (window.MW && MW.lenis) MW.lenis.scrollTo(root, { offset: -40 });
    }

    /* --- login (stubbed) --- */
    on(loginForm, "submit", function (e) {
      e.preventDefault();
      var email = loginForm.email, pass = loginForm.password, ok = true;
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showHint(email, "Enter a valid email"); ok = false; } else showHint(email, "");
      if (!pass.value || pass.value.length < 6) { showHint(pass, "At least 6 characters"); ok = false; } else showHint(pass, "");
      if (ok) enterWizard();
    });
    on($("[data-rl-demo]", root), "click", function () { enterWizard(); });

    /* --- splits --- */
    var splitsWrap = $("[data-rl-splits]", root);
    var splitTotal = $("[data-split-total]", root);
    var splitTotalWrap = splitTotal ? splitTotal.parentElement : null;
    var splitHint = $("[data-split-hint]", root);

    function splitRow(name, pct) {
      var row = el("div", "rl-split");
      var n = el("input", "field__input"); n.placeholder = "Collaborator name"; n.value = name || ""; n.setAttribute("aria-label", "Collaborator name");
      var pctWrap = el("div", "rl-split__pct");
      var p = el("input", "field__input"); p.type = "number"; p.min = "0"; p.max = "100"; p.value = (pct != null ? pct : ""); p.placeholder = "0"; p.setAttribute("aria-label", "Split percent");
      pctWrap.appendChild(p);
      var rm = el("button", "rl-split__rm", "&times;"); rm.type = "button"; rm.setAttribute("aria-label", "Remove collaborator");
      row.appendChild(n); row.appendChild(pctWrap); row.appendChild(rm);
      on(p, "input", recalc);
      on(rm, "click", function () {
        if ($all(".rl-split", splitsWrap).length <= 1) return;
        row.remove(); recalc();
      });
      return row;
    }
    function recalc() {
      var total = 0;
      $all(".rl-split__pct .field__input", splitsWrap).forEach(function (i) { total += parseFloat(i.value) || 0; });
      splitTotal.textContent = total;
      if (splitTotalWrap) splitTotalWrap.classList.toggle("is-ok", total === 100);
      if (splitHint) splitHint.textContent = total === 100 ? "" : (total > 100 ? "Total is over 100%" : "");
    }
    function buildSplits() {
      if (splitsWrap.children.length) return;
      splitsWrap.appendChild(splitRow("", 100));
      recalc();
    }
    on($("[data-split-add]", root), "click", function () { splitsWrap.appendChild(splitRow("", 0)); recalc(); });

    /* --- wizard stepping + validation --- */
    var STEPS = 4;
    var cur = 0;
    var panels = $all("[data-step-panel]", root);
    var dots = $all("[data-step-dot]", root);
    var backBtn = $("[data-step-back]", root);
    var nextBtn = $("[data-step-next]", root);
    var submitBtn = $("[data-step-submit]", root);
    var doneLine = $("[data-rl-done]", root);
    var form = $("[data-rl-form]", root);

    function goStep(i) {
      cur = i;
      panels.forEach(function (p, idx) { p.classList.toggle("is-active", idx === i); });
      dots.forEach(function (d, idx) {
        d.classList.toggle("is-active", idx === i);
        d.classList.toggle("is-done", idx < i);
      });
      backBtn.hidden = i === 0;
      nextBtn.hidden = i === STEPS - 1;
      submitBtn.hidden = i !== STEPS - 1;
      if (i === STEPS - 1) renderReview();
    }

    function validateStep(i) {
      var ok = true;
      if (i === 0) {
        $all("[data-step-panel='0'] [required]", root).forEach(function (input) {
          var bad = !input.value || (input.type === "email" && !/^[^\s@]+@/.test(input.value));
          if (bad) { showHint(input, "Required"); ok = false; } else showHint(input, "");
        });
      }
      if (i === 1) {
        // uploads optional in preview; always pass but surface a soft note via name fields already shown
        ok = true;
      }
      if (i === 2) {
        var total = 0; var hasName = false;
        $all(".rl-split", splitsWrap).forEach(function (rowEl) {
          var nm = rowEl.querySelector(".field__input");
          var pc = rowEl.querySelector(".rl-split__pct .field__input");
          if (nm.value.trim()) hasName = true;
          total += parseFloat(pc.value) || 0;
        });
        if (total !== 100 || !hasName) {
          ok = false;
          if (splitHint) splitHint.textContent = !hasName ? "Add at least one collaborator name" : "Splits must total exactly 100%";
        } else if (splitHint) splitHint.textContent = "";
      }
      return ok;
    }

    on(nextBtn, "click", function () { if (validateStep(cur)) goStep(Math.min(cur + 1, STEPS - 1)); });
    on(backBtn, "click", function () { goStep(Math.max(cur - 1, 0)); });

    function field(name) { var f = form[name]; return f ? f.value : ""; }
    function renderReview() {
      var review = $("[data-rl-review]", root);
      var splits = $all(".rl-split", splitsWrap).map(function (rowEl) {
        var nm = rowEl.querySelector(".field__input").value.trim();
        var pc = rowEl.querySelector(".rl-split__pct .field__input").value;
        return nm ? (nm + " " + (pc || 0) + "%") : null;
      }).filter(Boolean).join(" · ");
      var coverName = ($("[data-upload='cover'] [data-upload-name]", root) || {}).textContent || "";
      var audioName = ($("[data-upload='audio'] [data-upload-name]", root) || {}).textContent || "";
      var rows = [
        ["Track title", field("title")],
        ["Primary artist", field("artist")],
        ["Genre", field("genre")],
        ["Release date", field("date")],
        ["Cover art", coverName || "Not added (optional in preview)"],
        ["Master audio", audioName || "Not added (optional in preview)"],
        ["Splits", splits || "Not set"]
      ];
      review.innerHTML = rows.map(function (r) {
        var empty = !r[1] || /^Not added|^Not set/.test(r[1]);
        return "<div><dt>" + r[0] + "</dt><dd class='" + (empty ? "is-empty" : "") + "'>" + (r[1] || "Not set") + "</dd></div>";
      }).join("");
    }

    /* --- upload UI (names only; nothing leaves the browser) --- */
    $all("[data-upload]", root).forEach(function (u) {
      var input = $("[data-upload-input]", u);
      var nameEl = $("[data-upload-name]", u);
      on(input, "change", function () {
        nameEl.textContent = input.files && input.files[0] ? input.files[0].name : "";
      });
    });

    /* --- submit (stubbed) --- */
    on(form, "submit", function (e) {
      e.preventDefault();
      if (!validateStep(0)) { goStep(0); return; }
      if (!validateStep(2)) { goStep(2); return; }
      submitBtn.hidden = true;
      doneLine.hidden = false;
      doneLine.textContent = "Preview only. Nothing was submitted or published. In the live portal, \"" +
        (field("title") || "your release") + "\" would be sent to the MUSE WAV approval gate.";
    });
  })();

  /* ============================================================
     MOD-4 · ROSTER + APPLY
     ============================================================ */
  (function roster() {
    var root = $("#roster");
    if (!root) return;

    /* roster grid — placeholder stage names with self-hosted PORTRAIT photos of
       fictional people (AI-generated, no real person's likeness; rights-clean).
       Each portrait gets a crimson duotone via CSS so it sits in the palette. */
    var grid = $(".roster__grid", root);
    var photoCount = 0;
    PREVIEW.roster.forEach(function (a, i) {
      var card = el("article", "artist" + (a.open ? " artist--open" : ""));
      if (!a.open) {
        var img = el("img", "artist__photo");
        img.src = "../assets/roster/roster-" + (++photoCount) + ".jpg";
        img.alt = "Sample portrait (placeholder, fictional person)";
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 600; img.height = 800;
        card.appendChild(img);
      } else {
        card.appendChild(el("span", "artist__plus", "+"));
      }
      var body = el("div", "artist__body");
      body.appendChild(el("p", "artist__name", a.name));
      body.appendChild(el("p", "artist__tag", a.tag));
      card.appendChild(body);
      grid.appendChild(card);
    });

    /* tiers */
    var tiersWrap = $(".tiers", root);
    var chosen = null;
    var chosenLine = $("[data-apply-chosen]", root);
    PREVIEW.tiers.forEach(function (t) {
      var b = el("button", "tier");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      b.setAttribute("aria-pressed", "false");
      b.innerHTML =
        (t.pop ? '<span class="tag tag--preview tag--sm tier__pop">Most picked</span>' : "") +
        '<p class="tier__name">' + t.name + '</p>' +
        '<p class="tier__price">' + t.price + ' <small>' + t.per + '</small></p>' +
        '<ul class="tier__list">' + t.list.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul>' +
        '<p class="tier__pick">Choose ' + t.name + '</p>';
      on(b, "click", function () {
        chosen = t;
        $all(".tier", tiersWrap).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.setAttribute("aria-checked", "false"); });
        b.setAttribute("aria-pressed", "true"); b.setAttribute("aria-checked", "true");
        chosenLine.innerHTML = "Selected: <b>" + t.name + "</b> · " + t.price + " " + t.per + " (sample tier)";
      });
      tiersWrap.appendChild(b);
    });

    /* apply form (stubbed) */
    var form = $("[data-apply-form]", root);
    var done = $("[data-apply-done]", root);
    function showHint(input, msg) {
      var hint = input.parentElement.querySelector("[data-hint]");
      if (hint) hint.textContent = msg || "";
      return !msg;
    }
    on(form, "submit", function (e) {
      e.preventDefault();
      var ok = true;
      $all("[required]", form).forEach(function (input) {
        var bad = !input.value ||
          (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) ||
          (input.type === "url" && !/^https?:\/\/.+/.test(input.value));
        if (bad) { showHint(input, input.type === "url" ? "Start with http(s)://" : "Required"); ok = false; }
        else showHint(input, "");
      });
      if (!chosen) { ok = false; chosenLine.innerHTML = "<b>Pick a package above to continue</b>"; }
      if (!ok) return;
      done.hidden = false;
      done.textContent = "Preview only. No application was sent and no payment was taken. In the live site this submits your " +
        chosen.name + " application to MUSE WAV A&R.";
      form.querySelector("[data-apply-pay]").disabled = true;
    });
  })();

  /* Self-contained reveal for the .tier cards (see call-site note). Ends with the
     transform cleared so the cards never overlap the apply-form label below them. */
  function revealTiers() {
    var tiers = $all(".tier");
    if (!tiers.length) return;
    var prefersReduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No GSAP or reduced-motion: just ensure the cards are visible at their real position.
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReduced) {
      tiers.forEach(function (t) { t.style.opacity = "1"; t.style.transform = "none"; });
      return;
    }
    gsap.from(tiers, {
      y: 50, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08,
      immediateRender: false,                     // stop the from-state sticking on ScrollTrigger.refresh()
      scrollTrigger: { trigger: ".tiers", start: "top 90%", once: true },
      onComplete: function () { gsap.set(tiers, { clearProps: "transform,opacity" }); }
    });
  }

  /* ============================================================
     2. MOTION ORCHESTRATION
     Pattern: load -> preloader -> initLenis -> reveals/effects -> refresh
     MW no-ops motion under prefers-reduced-motion automatically.
     ============================================================ */
  window.addEventListener("load", function () {
    MW.preloader(function () {
      MW.initLenis();

      /* line-mask reveals on the big editorial type */
      MW.splitReveal(".hero__title", { y: 120, stagger: 0.12, duration: 1.05 });
      MW.splitReveal(".manifesto__motto", { y: 120, stagger: 0.1 });
      MW.splitReveal(".community__title");
      MW.splitReveal(".cta__title", { y: 120, stagger: 0.1 });

      /* simple fade/slide reveals on supporting copy + groups */
      MW.fadeUp("[data-reveal]");

      /* reveal module blocks with stagger as they enter */
      MW.fadeUp(".services__item", { y: 56, stagger: 0.06, start: "top 90%" });
      MW.fadeUp(".vcell", { y: 60, stagger: 0.08, start: "top 92%" });
      MW.fadeUp(".room", { y: 50, stagger: 0.08, start: "top 90%" });
      MW.fadeUp(".artist", { y: 50, stagger: 0.05, start: "top 92%" });
      /* The tier cards sit directly above the apply-form's first label. The shared
         MW.fadeUp() builds a gsap.from() with immediateRender(default) + once:true;
         when ScrollTrigger.refresh() runs it can leave the .tier stuck at its FROM
         state (translateY 50px) while opacity reaches 1, so the cards slide ~50px
         DOWN over the "Artist / stage name" label and clip it. We own the tier reveal
         here instead: immediateRender:false stops the from-state sticking on refresh,
         and clearProps wipes the transform on completion so the final layout is exact
         (no residual shift, no overlap). Falls back to plain visibility if GSAP absent. */
      revealTiers();
      MW.fadeUp(".book__widget", { y: 40, start: "top 88%" });
      MW.fadeUp(".release__panel", { y: 40, start: "top 86%" });
      MW.fadeUp(".footer__socials", { start: "top 95%" });

      /* infinite crimson marquee */
      MW.marquee("[data-marquee]", { speed: 90 });

      /* NOTE: the shared MW.cursor() (a bone dot with mix-blend-mode:difference) is
         intentionally NOT used on this concept. Concept A alternates ink <-> BONE
         color blocks; on the light bone sections, difference-blending the bone dot
         inverts it to a large near-black circle that reads as a stray "blob" over the
         tier cards / forms. We keep the normal pointer instead. (A belt-and-suspenders
         CSS guard hides .mw-cursor in concept.css in case the engine adds it elsewhere.) */

      /* ---- desktop-only heavy effects ---- */
      MW.desktop(function () {
        MW.parallax("[data-parallax]");           // dragon + soundwave drift
        MW.velocitySkew(".skewable");             // big section headings skew on scroll velocity
        MW.magnetic("[data-magnetic]");           // CTA buttons

        /* HERO scrub: pin briefly, the dragon eases up + the hero title settles */
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
          gsap.to(".hero__inner", {
            yPercent: -8, ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "+=60%", scrub: true, pin: true, pinSpacing: true }
          });
        }
      });

      MW.refresh();
    });
  });

  /* the soundwave canvas can start immediately (it self-sizes + reads scroll velocity) */
  (function heroWave() {
    var c = $(".hero__wave");
    if (c && MW && MW.soundwave) {
      MW.soundwave(c, { color: "#F03535", lines: 64, amp: 0.4, speed: 0.022, thickness: 2.5 });
    }
  })();

})();
