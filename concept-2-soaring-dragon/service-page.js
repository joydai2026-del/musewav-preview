/* MUSE WAV Concept 2 service page renderer. */
(function () {
  "use strict";

  var M = window.MUSEWAV || {};
  M.clipBase = "../../assets/video/";

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function videoMarkup(id, className) {
    if (window.MWV && typeof MWV.markup === "function") return MWV.markup(id, className);
    var src = M.clip ? M.clip(id) : "../../assets/video/" + id + ".mp4";
    return '<video class="' + esc(className || "") + '" autoplay muted loop playsinline webkit-playsinline preload="auto" aria-hidden="true" tabindex="-1">' +
      '<source src="' + esc(src) + '" type="video/mp4">' +
    "</video>";
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function text(sel, value) {
    var node = $(sel);
    if (node) node.textContent = value || "";
  }
  function serviceHref(slug) { return slug + ".html"; }
  function ytWatch(id) { return M.ytWatch ? M.ytWatch(id) : "https://www.youtube.com/watch?v=" + id; }
  function setHead(wrap, heading, intro) {
    if (!wrap) return;
    var section = wrap.closest(".c2-service-section");
    var h = section && section.querySelector(".c2-service-head h2");
    var p = section && section.querySelector(".c2-service-head p");
    if (h && heading) h.textContent = heading;
    if (p && intro) p.textContent = intro;
  }
  var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var HERO_VIDEO_BY_SERVICE = {
    "recording-studio": "Ow8O87Xv5HM",
    "music-video-production": "IbEKqjRCjxc",
    "customized-beats": "Xt3TSxI8Uwg",
    "artist-development": "cgPTnWgzO9M",
    "music-tour-service": "k0utfYxGPpM",
    "marketing-agency": "xXxMosop68E",
    "music-publishing": "cgPTnWgzO9M"
  };

  function setupMotionToggles() {
    $all(".c2-service-hero__media, .c2-service-card").forEach(function (wrap) {
      var videos = $all("video", wrap);
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

  var slug = document.body.getAttribute("data-service-slug");
  var page = M.servicePages && M.servicePages[slug];
  if (!page) return;

  document.title = "MUSE WAV · " + page.title;
  text("[data-service-eyebrow]", page.eyebrow);
  text("[data-service-title]", page.title);
  text("[data-service-copy]", page.heroCopy);
  text("[data-service-cta]", page.cta);
  var cta = $("[data-service-cta]");
  if (cta) cta.href = "../book-session.html?service=" + encodeURIComponent(slug);
  var endCta = $(".c2-service-cta__actions .btn");
  if (endCta) {
    endCta.href = "../book-session.html?service=" + encodeURIComponent(slug);
    var endText = endCta.querySelector("span");
    if (endText) endText.textContent = "Book This Service Now";
  }

  (function heroVideo() {
    var frame = $(".c2-service-hero__media");
    if (!frame) return;
    var id = HERO_VIDEO_BY_SERVICE[slug] || ((M.videos && M.videos[0] && M.videos[0].id) || "");
    if (!id) return;
    var existing = frame.querySelector("video,img");
    if (existing) existing.remove();
    frame.insertAdjacentHTML("afterbegin", videoMarkup(id, "c2-service-hero__video"));
  })();

  (function nav() {
    var links = $(".c2-service-nav__links");
    if (!links) return;
    links.innerHTML = "";
    var home = el("a", "c2-service-nav__home", "Home");
    home.href = "../index.html";
    links.appendChild(home);
    var all = el("a", "c2-service-nav__all", "Services");
    all.href = "../services.html";
    links.appendChild(all);
    var switcher = el("details", "c2-service-nav__switcher");
    var summary = el("summary", null, esc(page.title) + '<span aria-hidden="true">⌄</span>');
    switcher.appendChild(summary);
    var menu = el("div", "c2-service-nav__menu");
    (M.services || []).forEach(function (s) {
      var a = el("a", s.slug === slug ? "is-active" : "", esc(s.title));
      a.href = serviceHref(s.slug);
      if (s.slug === slug) a.setAttribute("aria-current", "page");
      menu.appendChild(a);
    });
    switcher.appendChild(menu);
    links.appendChild(switcher);
    var book = el("a", "c2-service-nav__book", "Book");
    book.href = "../book-session.html?service=" + encodeURIComponent(slug);
    links.appendChild(book);
  })();

  (function strip() {
    var track = $(".marquee__track");
    if (!track) return;
    (M.services || []).forEach(function (s) {
      track.appendChild(el("span", "c2-service-marquee__item", esc(s.title)));
    });
  })();

  function renderGallery(wrap) {
    (page.media || []).forEach(function (item, i) {
      var src = typeof item === "string" ? item : item.src;
      var labelText = typeof item === "string" ? page.title + " material" : item.label;
      var card = el("figure", "c2-service-card " + (i === 0 ? "c2-service-card--large" : (i < 3 ? "c2-service-card--mid" : "c2-service-card--small")));
      var img = el("img");
      img.src = src;
      img.alt = labelText || page.title + " material";
      img.loading = "eager";
      img.decoding = "async";
      if (item.focus) img.style.objectPosition = item.focus;
      card.appendChild(img);
      card.appendChild(el("figcaption", "c2-service-card__label", esc(labelText || page.title)));
      wrap.appendChild(card);
    });
  }

  function renderVideos(wrap) {
    (M.videos || []).forEach(function (v, i) {
      var card = el("figure", "c2-service-card c2-service-video-card " + (i === 0 ? "c2-service-card--large" : (i < 3 ? "c2-service-card--mid" : "c2-service-card--small")));
      card.insertAdjacentHTML("afterbegin", videoMarkup(v.id, "vfacade__video"));
      var label = el("figcaption", "c2-service-card__label", '<a href="' + esc(ytWatch(v.id)) + '" target="_blank" rel="noopener">' + esc(v.title) + "</a>");
      card.appendChild(label);
      wrap.appendChild(card);
    });
  }

  function renderAudio(wrap) {
    (M.beatPreviews || []).forEach(function (item) {
      var card = el("article", "c2-audio-card");
      var top = el("div", "c2-audio-card__top");
      card.appendChild(el("p", "c2-audio-card__meta", esc(item.producer)));
      card.appendChild(el("h3", "c2-audio-card__title", esc(item.title)));
      card.appendChild(el("p", "c2-audio-card__tags", esc(item.tags)));
      var audio = el("audio");
      audio.preload = "metadata";
      audio.src = item.src;
      var play = el("button", "c2-audio-card__play", '<span class="c2-audio-card__icon" aria-hidden="true"></span><span>Listen</span>');
      play.type = "button";
      play.setAttribute("aria-label", "Listen to " + item.title + " by " + item.producer);
      var bar = el("div", "c2-audio-card__bar", '<span></span>');
      top.appendChild(play);
      top.appendChild(bar);
      card.appendChild(top);
      card.appendChild(audio);
      play.addEventListener("click", function () {
        $all(".c2-audio-card audio").forEach(function (other) {
          if (other !== audio) other.pause();
        });
        if (audio.paused) {
          var p = audio.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          audio.pause();
        }
      });
      audio.addEventListener("play", function () {
        card.classList.add("is-playing");
        play.querySelector("span:last-child").textContent = "Pause";
      });
      audio.addEventListener("pause", function () {
        card.classList.remove("is-playing");
        play.querySelector("span:last-child").textContent = "Listen";
      });
      audio.addEventListener("timeupdate", function () {
        var pct = audio.duration ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0;
        var fill = bar.querySelector("span");
        if (fill) fill.style.width = pct + "%";
      });
      wrap.appendChild(card);
    });
  }

  function renderPending(wrap) {
    ["Project proof", "Case study", "Press and platform reach", "Campaign notes"].forEach(function (title) {
      var card = el("article", "c2-service-card c2-service-card--small c2-pending-card");
      card.appendChild(el("p", "c2-pending-card__top", "Coming soon"));
      card.appendChild(el("h3", "c2-pending-card__title", title));
      card.appendChild(el("p", "c2-pending-card__body", "More examples will be added as the project library grows."));
      wrap.appendChild(card);
    });
  }

  function renderRoster(wrap) {
    (M.roster || []).forEach(function (item) {
      var card = el("article", "c2-roster-card");
      var img = el("img");
      img.src = item.image;
      img.alt = item.name;
      img.loading = "eager";
      img.decoding = "async";
      if (item.focus) img.style.objectPosition = item.focus;
      card.appendChild(img);
      card.appendChild(el("p", "c2-roster-card__role", esc(item.role)));
      card.appendChild(el("h3", "c2-roster-card__name", esc(item.name)));
      card.appendChild(el("p", "c2-roster-card__bio", esc(item.bio)));
      wrap.appendChild(card);
    });
  }

  function renderStrategy(wrap) {
    (M.marketingLanes || []).forEach(function (item, i) {
      var card = el("article", "c2-strategy-card");
      card.appendChild(el("p", "c2-strategy-card__n", esc(item.icon || String(i + 1).padStart(2, "0"))));
      card.appendChild(el("h3", "c2-strategy-card__title", esc(item.title)));
      card.appendChild(el("p", "c2-strategy-card__body", esc(item.body)));
      if (item.channels && item.channels.length) {
        var chips = el("div", "c2-strategy-card__chips");
        item.channels.forEach(function (channel) {
          chips.appendChild(el("span", null, esc(channel)));
        });
        card.appendChild(chips);
      }
      wrap.appendChild(card);
    });
  }

  function renderEquipment(list) {
    if (!page.equipment || !M.studioEquipment) return;
    var row = el("article", "c2-service-detail c2-service-detail--gear");
    row.appendChild(el("h3", null, "Studio equipment"));
    var grid = el("div", "c2-gear-grid");
    M.studioEquipment.forEach(function (group) {
      var card = el("div", "c2-gear-card");
      card.appendChild(el("h4", null, esc(group.group)));
      var ul = el("ul");
      (group.items || []).forEach(function (item) {
        ul.appendChild(el("li", null, esc(item)));
      });
      card.appendChild(ul);
      grid.appendChild(card);
    });
    row.appendChild(grid);
    list.appendChild(row);
  }

  function renderPath(wrap) {
    (M.publishingPath || []).forEach(function (item, i) {
      var card = el("article", "c2-path-card");
      card.appendChild(el("span", "c2-path-card__step", String(i + 1)));
      card.appendChild(el("h3", "c2-path-card__title", esc(item.title)));
      card.appendChild(el("p", "c2-path-card__body", esc(item.body)));
      wrap.appendChild(card);
    });
  }

  function renderRates(grid) {
    (M.studioRates || []).forEach(function (rate) {
      var card = el("article", "c2-rate-card");
      card.appendChild(el("h3", "c2-rate-card__label", esc(rate.label)));
      card.appendChild(el("p", "c2-rate-card__price", esc(rate.price)));
      card.appendChild(el("p", "c2-rate-card__note", esc(rate.note)));
      grid.appendChild(card);
    });
  }

  (function visual() {
    var wrap = $("[data-service-visual]");
    if (!wrap) return;
    setHead(wrap, page.visualHeading, page.visualIntro);
    wrap.className = page.visualType === "audio"
      ? "c2-audio-grid"
      : page.visualType === "roster"
        ? "c2-roster-grid"
        : page.visualType === "strategy"
          ? "c2-strategy-grid"
          : page.visualType === "path"
            ? "c2-path-grid"
            : "c2-service-" + (page.visualType === "video-grid" ? "video-grid" : page.visualType === "placeholder" ? "placeholder-grid" : "gallery");
    if (page.visualType === "gallery") renderGallery(wrap);
    else if (page.visualType === "video-grid") renderVideos(wrap);
    else if (page.visualType === "audio") renderAudio(wrap);
    else if (page.visualType === "roster") renderRoster(wrap);
    else if (page.visualType === "strategy") renderStrategy(wrap);
    else if (page.visualType === "path") renderPath(wrap);
    else renderPending(wrap);
  })();

  (function details() {
    var list = $("[data-service-details]");
    if (!list) return;
    (page.sections || []).forEach(function (section) {
      var row = el("article", "c2-service-detail");
      row.appendChild(el("h3", null, esc(section.title)));
      row.appendChild(el("p", null, esc(section.body)));
      list.appendChild(row);
    });
    renderEquipment(list);
  })();

  (function facts() {
    var grid = $("[data-service-facts]");
    if (!grid) return;
    setHead(grid, page.factsHeading || "Service details", page.factsIntro || "");
    if (page.factsType === "rates") {
      grid.className = "c2-rate-grid";
      renderRates(grid);
      return;
    }
    (page.facts || []).forEach(function (fact) {
      grid.appendChild(el("div", "c2-service-fact", esc(fact)));
    });
  })();

  window.addEventListener("load", function () {
    MW.preloader(function () {
      MW.initLenis();
      setupMotionToggles();
      MW.fadeUp("[data-reveal]");
      MW.marquee(".c2-service-marquee", { speed: 78 });
      MW.desktop(function () {
        MW.velocitySkew(".skewable");
        MW.magnetic("[data-magnetic]");
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
          gsap.to(".c2-service-hero__media", {
            yPercent: -9,
            ease: "none",
            scrollTrigger: { trigger: ".c2-service-hero", start: "top top", end: "+=70%", scrub: true }
          });
        }
      });
      MW.refresh();
    });
  });
})();
