/* MUSE WAV dedicated artist / producer profile renderer. */
(function () {
  "use strict";

  var M = window.MUSEWAV || {};
  M.clipBase = "../../assets/video/";

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function videoMarkup(id, className) {
    if (window.MWV && typeof MWV.markup === "function") return MWV.markup(id, className);
    return '<video class="' + esc(className || "") + '" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="' + esc(M.clipPoster(id)) + '" aria-hidden="true" tabindex="-1">' +
      '<source src="' + esc(M.clip(id)) + '" type="video/mp4">' +
    "</video>";
  }
  function external(a, href) {
    a.href = href;
    if (/^https?:\/\//.test(href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  }
  function setText(sel, value) {
    var node = $(sel);
    if (node) node.textContent = value || "";
  }
  function audioCard(item) {
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
    var bar = el("div", "c2-audio-card__bar", '<span></span>');
    top.appendChild(play);
    top.appendChild(bar);
    card.appendChild(top);
    card.appendChild(audio);
    play.addEventListener("click", function () {
      document.querySelectorAll(".c2-audio-card audio").forEach(function (other) {
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
      var fill = bar.querySelector("span");
      if (fill) fill.style.width = (audio.duration ? Math.min(100, audio.currentTime / audio.duration * 100) : 0) + "%";
    });
    return card;
  }

  var slug = document.body.getAttribute("data-profile-slug");
  var profile = M.profiles && M.profiles[slug];
  if (!profile) return;

  document.title = "MUSE WAV · " + profile.name;
  setText("[data-profile-type]", profile.type + " profile");
  setText("[data-profile-name]", profile.name);
  setText("[data-profile-role]", profile.role);
  setText("[data-profile-headline]", profile.headline);
  setText("[data-profile-bio]", profile.bio);

  var portrait = $("[data-profile-image]");
  if (portrait) {
    portrait.src = profile.image;
    portrait.alt = profile.name;
    if (profile.focus) portrait.style.objectPosition = profile.focus;
  }

  var tags = $("[data-profile-tags]");
  if (tags) {
    (profile.tags || []).forEach(function (tag) {
      tags.appendChild(el("span", null, esc(tag)));
    });
  }

  var video = $("[data-profile-video]");
  if (video && profile.youtubeId) {
    video.insertAdjacentHTML("afterbegin", videoMarkup(profile.youtubeId, "c2-profile-video__clip"));
    video.appendChild(el("div", "c2-profile-video__caption", '<strong>' + esc(profile.mvTitle || "Featured video") + '</strong><a href="' + esc(profile.youtubeUrl || M.ytWatch(profile.youtubeId)) + '" target="_blank" rel="noopener">Watch full video</a>'));
    if (window.MWV && typeof MWV.armAutoplay === "function") MWV.armAutoplay(video);
  } else if (video) {
    video.hidden = true;
  }

  var spotify = $("[data-profile-spotify]");
  if (spotify && profile.spotifyId) {
    spotify.innerHTML = '<h3>Latest on Spotify</h3><p>The embedded artist profile updates from Spotify as the artist catalog changes.</p>' +
      '<iframe title="' + esc(profile.name) + ' on Spotify" src="https://open.spotify.com/embed/artist/' + esc(profile.spotifyId) + '?utm_source=generator" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>' +
      '<a href="' + esc(profile.spotifyUrl) + '" target="_blank" rel="noopener">Open Spotify profile</a>';
  } else if (spotify) {
    spotify.hidden = true;
  }

  var beats = $("[data-profile-beats]");
  var beatList = (M.beatPreviews || []).filter(function (item) {
    return profile.beatProducer && item.producer.toLowerCase() === profile.beatProducer.toLowerCase();
  });
  if (beats) {
    if (beatList.length) {
      beatList.forEach(function (item) { beats.appendChild(audioCard(item)); });
    } else if (profile.type === "Artist") {
      var beatSection = beats.closest(".c2-profile-section");
      if (beatSection) beatSection.hidden = true;
    } else {
      beats.appendChild(el("p", "c2-profile-empty", profile.type === "Artist" ? "More music and credits can be added here." : "More beat previews can be added here."));
    }
  }

  var primary = $("[data-profile-primary]");
  if (primary) {
    if (profile.type === "Producer") {
      external(primary, "../book-session.html?service=customized-beats");
      primary.querySelector("span").textContent = "Book Custom Beats";
    } else {
      external(primary, "../book-session.html");
      primary.querySelector("span").textContent = "Book Artist Development";
    }
  }

  window.addEventListener("load", function () {
    MW.preloader(function () {
      MW.initLenis();
      MW.fadeUp("[data-reveal]", { y: 38, stagger: 0.05 });
      MW.magnetic("[data-magnetic]");
      MW.refresh();
    });
  });
})();
