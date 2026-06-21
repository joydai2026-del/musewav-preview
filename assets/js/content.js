/* MUSE WAV — real content (from brand-research/brand-profile.md). REAL DATA ONLY. */
window.MUSEWAV = {
  name: "MUSE WAV",
  group: "MUSE WAV MUSIC GROUP",
  tagline: "Record Label",
  motto: "A form beyond form. Soaring dragon shaping the heaven and earth, a silent symphony.",
  mottoLoop: "A FORM BEYOND FORM · SOARING DRAGON SHAPING THE HEAVEN AND EARTH · A SILENT SYMPHONY · ",
  mission: "The MUSE WAV RED Series is committed to promoting the best artists and their works through high-quality music video production and social media platform operations.",
  community: "MUSE WAV Community is the way to meet up the music talented from all over the world, sharing resources to make everyone in the community get a better deal.",
  trackCredit: "By Sir Wolfsbane & Jjeramii",

  nav: [
    { label: "Work", href: "#work" },
    { label: "Studio", href: "#studio" },
    { label: "Services", href: "#services" },
    { label: "Community", href: "#community" },
    { label: "Contact", href: "#contact" }
  ],

  services: [
    { n: "01", title: "Recording Studio", desc: "Pro recording in the heart of NYC. Studio is available for service 24/7." },
    { n: "02", title: "Music Video Production", desc: "High-quality music videos that make artists and their work soar." },
    { n: "03", title: "Customized Beats", desc: "Custom beats made for your sound. Contact info@musewav.com to start." },
    { n: "04", title: "Artist Development", desc: "The MUSE WAV Artist Development Program. Apply to grow with us." },
    { n: "05", title: "Music Tour Service", desc: "MUSE WAV Music Tour Service. Take the sound on the road." },
    { n: "06", title: "Social Media Operations", desc: "Platform operations that put the right ears on the right artists." }
  ],

  // Real catalog — YouTube @MUSEWAV_INC. Titles are the real release names.
  // Silent autoplay preview clips built by assets/make-video-previews.sh.
  videos: [
    { id: "IbEKqjRCjxc", title: "Contagious", note: "RED Series" },
    { id: "Ow8O87Xv5HM", title: "Exposing Me", note: "Memo 600" },
    { id: "Xt3TSxI8Uwg", title: "No Friend Zone", note: "MUSE WAV" },
    { id: "cgPTnWgzO9M", title: "过客", note: "MUSE WAV" },
    { id: "k0utfYxGPpM", title: "3a.M. in the Morning", note: "MUSE WAV" },
    { id: "xXxMosop68E", title: "时间电台", note: "MUSE WAV" }
  ],

  studio: {
    addressLines: ["333 Hudson St, Rm 1005", "New York, NY 10013", "纽约 10013 美国"],
    hours: "06:00 – 03:30 · Studio available for service 24/7",
    city: "New York City"
  },

  contact: {
    ctaLabel: "Get your custom project quote here",
    email: "info@musewav.com",
    phone: "+1 (201) 240-1114",
    phoneHref: "tel:+12012401114"
  },

  socials: [
    { label: "Instagram", short: "IG", href: "https://www.instagram.com/musewav/" },
    { label: "YouTube", short: "YT", href: "https://www.youtube.com/@MUSEWAV_INC" },
    { label: "Facebook", short: "FB", href: "https://www.facebook.com/profile.php?id=100093280189343" },
    { label: "Yelp", short: "YE", href: "https://www.yelp.com/biz/muse-wav-new-york" }
  ],

  copyright: "© 2023 MUSE WAV · All Rights Reserved.",

  assets: {
    lockupWhite: "../assets/brand/logo-lockup-white.png",
    lockupCrimson: "../assets/brand/logo-lockup-crimson.png",
    lockupInk: "../assets/brand/logo-lockup-ink.png",
    dragonWhite: "../assets/brand/dragon-white.png",
    dragonCrimson: "../assets/brand/dragon-crimson.png",
    wordmarkWhite: "../assets/brand/wordmark-white.png",
    wordmarkCrimson: "../assets/brand/wordmark-crimson.png",
    soundwaveWhite: "../assets/brand/soundwave-white.png",
    soundwaveCrimson: "../assets/brand/soundwave-crimson.png",
    favicon: "../assets/brand/favicon-256.png"
  },

  // Build a privacy-friendly lazy YouTube thumbnail URL
  ytThumb: function (id) { return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; },
  ytEmbed: function (id) { return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1"; },
  ytWatch: function (id) { return "https://www.youtube.com/watch?v=" + id; },

  // Self-hosted silent preview loops (built from the real videos by
  // assets/make-video-previews.sh). Poster shares the clip's first frame.
  clipBase: "../assets/video/",
  clip:       function (id) { return this.clipBase + id + ".mp4"; },
  clipPoster: function (id) { return this.clipBase + id + ".jpg"; }
};
