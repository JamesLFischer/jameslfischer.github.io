const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Art video cards: each video gets its own play/pause toggle that controls only that video.
// Ambient loops (e.g. the Radmin capture): silent, always playing, no toggle.
// Reduced motion: stop and show the poster frame instead.
document.querySelectorAll('video[data-ambient]').forEach((video) => {
  video.muted = true;
  video.defaultMuted = true;
  video.controls = false;
  video.disablePictureInPicture = true;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    video.removeAttribute('autoplay');
    video.autoplay = false;
    video.pause();
    video.load();
  } else {
    // Keep the loop alive: some Chromium/WebView2 builds on Windows (Edge,
    // DuckDuckGo) can stall a video when its card animates, or after the
    // tab is hidden. Re-kick playback on those events and with a watchdog.
    const kick = () => {
      if (document.hidden) return;
      if (video.paused || video.ended) video.play().catch(() => {});
    };
    let last = -1;
    let stuck = 0;
    const watchdog = () => {
      if (document.hidden) return;
      if (!video.paused && video.readyState >= 2) {
        stuck = (video.currentTime === last) ? stuck + 1 : 0;
        if (stuck >= 2) {
          // Frozen frame: nudge the decoder and restart playback.
          const t = video.currentTime;
          video.pause();
          video.currentTime = t + 0.05 < (video.duration || 0) ? t + 0.05 : 0;
          stuck = 0;
        }
      }
      last = video.currentTime;
      kick();
    };
    ['loadeddata', 'canplay', 'pause', 'stalled', 'suspend'].forEach((ev) => video.addEventListener(ev, kick));
    document.addEventListener('visibilitychange', kick);
    window.addEventListener('pageshow', kick);
    window.addEventListener('focus', kick);
    const card = video.closest('.project-card');
    if (card) {
      card.addEventListener('mouseleave', kick);
      card.addEventListener('animationend', kick);
    }
    setInterval(watchdog, 1000);
    kick();
  }
});

// t173u: Graphic Art video cards share one size. Each text block gets the
// min-height of the tallest matching block across all cards, then every card
// the tallest card height, so the grid lines up at every breakpoint.
(() => {
  const cards = [...document.querySelectorAll('.project-card')]
    .filter((c) => c.querySelector('.media-stage-art video:not([data-ambient])'));
  if (cards.length < 2) return;
  cards.forEach((c) => c.classList.add('ga-card'));
  const parts = ['.project-meta', '.project-kicker', 'h3', '.project-content > p:not(.project-kicker)', '.tags'];
  const equalize = () => {
    cards.forEach((c) => { c.style.minHeight = ''; });
    parts.forEach((sel) => {
      const els = cards.map((c) => c.querySelector(sel)).filter(Boolean);
      els.forEach((e) => { e.style.minHeight = ''; });
      const max = Math.max(...els.map((e) => e.scrollHeight));
      els.forEach((e) => { e.style.minHeight = max + 'px'; });
    });
    const tallest = Math.max(...cards.map((c) => c.offsetHeight));
    cards.forEach((c) => { c.style.minHeight = tallest + 'px'; });
  };
  let raf = 0;
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(equalize); };
  equalize();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
})();

document.querySelectorAll('.media-stage-art video:not([data-ambient])').forEach((video) => {
  const stage = video.closest('.venture-media') || video.closest('.media-stage');
  if (!stage || stage.querySelector('.video-toggle')) return;
  video.removeAttribute('controls');
  video.removeAttribute('autoplay');
  video.autoplay = false;
  video.pause();
  video.muted = false;
  video.defaultMuted = false;
  video.removeAttribute('muted');
  video.disablePictureInPicture = true;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'video-toggle';
  stage.appendChild(btn);
  const sync = () => {
    const playing = !video.paused && !video.ended;
    btn.textContent = playing ? '❚❚' : '▶';
    btn.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + (video.getAttribute('aria-label') || 'video'));
    stage.classList.toggle('is-paused', !playing);
  };
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (video.paused) { video.muted = false; video.volume = 1; video.play().catch(sync); } else { video.pause(); }
  };
  btn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
});
