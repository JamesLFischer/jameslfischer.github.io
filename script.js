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
document.querySelectorAll('.media-stage-art video').forEach((video) => {
  const stage = video.closest('.venture-media') || video.closest('.media-stage');
  if (!stage || stage.querySelector('.video-toggle')) return;
  video.removeAttribute('controls');
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
    if (video.paused) { video.muted = true; video.play().catch(sync); } else { video.pause(); }
  };
  btn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
});
