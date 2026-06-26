/* Shared Concept 2 footer. Keeps address/contact consistent across pages. */
(function () {
  "use strict";
  var M = window.MUSEWAV || {};
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function base() {
    return location.pathname.indexOf("/services/") >= 0 ? "../" : "./";
  }
  function assetBase() {
    return location.pathname.indexOf("/services/") >= 0 ? "../../assets/" : "../assets/";
  }
  function socialIcon(label) {
    var key = String(label || "").toLowerCase();
    if (key.indexOf("instagram") >= 0) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>';
    }
    if (key.indexOf("youtube") >= 0) {
      return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>';
    }
    if (key.indexOf("facebook") >= 0) {
      return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.1 8.7V6.9c0-.9.6-1.1 1-1.1h2.6V1.9L14.1 1.9c-4 0-4.9 3-4.9 4.9v1.9H6v4h3.2v9.4h4.2v-9.4h3.5l.5-4h-4z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>';
  }
  function footerMarkup() {
    var conceptBase = base();
    var assets = assetBase();
    return '' +
      '<div class="c2-footer__motion" aria-hidden="true">' +
        '<div class="c2-footer__preview">' +
          '<video autoplay muted loop playsinline preload="auto" poster="' + assets + 'video/ttohufZuv9Y.jpg">' +
            '<source src="' + assets + 'video/ttohufZuv9Y.mp4?v=20" type="video/mp4">' +
          '</video>' +
        '</div>' +
      '</div>' +
      '<div class="container c2-footer__grid">' +
        '<div class="c2-footer__brand">' +
          '<p class="c2-footer__lockup">' +
            '<img src="' + conceptBase + 'badge-candy.png" alt="" aria-hidden="true" width="56" height="56">' +
            '<span class="c2-footer__word">muse wav</span>' +
          '</p>' +
          '<p class="c2-footer__motto"></p>' +
        '</div>' +
        '<div class="c2-footer__hours-block">' +
          '<p class="c2-footer__hours-kicker">Studio hours</p>' +
          '<p class="c2-footer__hours-main">06:00–03:30</p>' +
          '<p class="c2-footer__hours-note"></p>' +
          '<address class="c2-footer__hours-address"></address>' +
          '<p class="c2-footer__hours-contact"></p>' +
        '</div>' +
        '<div class="c2-footer__social-contact">' +
          '<nav class="c2-footer__socials" aria-label="Social media"></nav>' +
          '<div class="c2-footer__meta">' +
            '<p class="c2-footer__copy"></p>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
  function ensureBackTop() {
    var existing = document.querySelector(".c2-backtop");
    if (existing) return;
    var a = document.createElement("a");
    a.className = "c2-backtop";
    a.href = "#top";
    a.setAttribute("aria-label", "Back to top");
    a.textContent = "↑";
    a.addEventListener("click", function (event) {
      event.preventDefault();
      if (window.MW && MW.lenis && typeof MW.lenis.scrollTo === "function") {
        MW.lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.setTimeout(function () {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 80);
    });
    document.body.appendChild(a);
  }
  function playFooterVideo(video) {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    var start = function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };
    start();
    window.setTimeout(start, 0);
    window.setTimeout(start, 500);
    window.setTimeout(start, 1200);
    window.setInterval(function () {
      if (video.paused || video.ended || video.readyState < 2) start();
    }, 1800);
  }
  function populate(footer) {
    var motto = footer.querySelector(".c2-footer__motto");
    if (motto) motto.textContent = M.motto || "";
    var socials = footer.querySelector(".c2-footer__socials");
    if (socials && M.socials) {
      socials.innerHTML = M.socials.map(function (s) {
        return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="MUSE WAV on ' + esc(s.label) + '">' +
          socialIcon(s.label) + '<span>' + esc(s.label) + '</span></a>';
      }).join("");
    }
    var address = footer.querySelector(".c2-footer__hours-address");
    if (address && M.studio && M.studio.addressLines) {
      address.textContent = M.studio.addressLines.join(" · ");
    }
    var hours = footer.querySelector(".c2-footer__hours-note");
    if (hours && M.studio) hours.textContent = "Studio access available 24/7 by service";
    var contact = footer.querySelector(".c2-footer__hours-contact");
    if (contact && M.contact) contact.textContent = (M.contact.phone || "") + " · " + (M.contact.email || "");
    var copy = footer.querySelector(".c2-footer__copy");
    if (copy) {
      var lines = String(M.copyright || "").split(/\n+/).filter(Boolean);
      copy.innerHTML = lines.map(function (line) { return "<span>" + esc(line) + "</span>"; }).join("");
    }
    var motion = footer.querySelector(".c2-footer__motion");
    var video = motion && motion.querySelector("video");
    if (motion && video) playFooterVideo(video);
    ensureBackTop();
  }
  window.MWConceptFooter = {
    mount: function () {
      var footer = document.querySelector(".c2-footer");
      if (!footer) {
        footer = document.createElement("footer");
        footer.className = "c2-footer";
        footer.id = "studio";
        footer.setAttribute("aria-label", "Footer");
        document.body.appendChild(footer);
      }
      footer.innerHTML = footerMarkup();
      populate(footer);
    }
  };
  window.MWConceptFooter.mount();
})();
