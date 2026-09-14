/* ============================================================
   NAUTILUS AESTHETICS — MAIN JS
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---- Navigation scroll state ---------------------------------- */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileDrawer = document.querySelector('.nav__mobile');

const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---- Mobile nav toggle ---------------------------------------- */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    const [top, mid, bot] = hamburger.querySelectorAll('span');
    if (isOpen) {
      top.style.transform = 'rotate(42deg) translateY(5px)';
      mid.style.opacity = '0';
      bot.style.transform = 'rotate(-42deg) translateY(-5px)';
    } else {
      top.style.transform = mid.style.opacity = bot.style.transform = '';
    }
  });

  // Close on link click
  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });
}

/* ---- Hero entrance -------------------------------------------- */
// Copy settles in order straight away; the photo fades up once it has actually loaded.
const hero = document.querySelector('.hero');
if (hero) {
  hero.querySelectorAll('.hero__content > *').forEach((el, i) => el.style.setProperty('--i', i));
  requestAnimationFrame(() => hero.classList.add('is-ready'));

  const heroBg = hero.querySelector('.hero__bg');
  if (heroBg) {
    const reveal = () => heroBg.classList.add('loaded');
    const url = getComputedStyle(heroBg).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (url) {
      const img = new Image();
      img.onload = img.onerror = reveal;
      img.src = url[1];
      setTimeout(reveal, 2500); // never leave the hero without its photo
    } else {
      reveal();
    }
  }
}

document.querySelectorAll('.page-hero').forEach(pageHero => {
  pageHero.querySelectorAll('.page-hero__content > *').forEach((el, i) => el.style.setProperty('--i', i));
  requestAnimationFrame(() => pageHero.classList.add('is-ready'));
});

/* ---- Scroll-triggered reveals --------------------------------- */
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    obs.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

// Groups reveal their children in sequence instead of all at once.
const STAGGER_GROUPS = [
  '.principles', '.device-grid', '.services__grid', '.why__cards', '.service-block__benefits',
  '.modality-grid', '.method__steps', '.spec-strip', '.about-mission__grid'
].join(', ');
const REVEAL_CLASSES = ['fade-up', 'delay-1', 'delay-2', 'delay-3', 'delay-4'];

document.querySelectorAll(STAGGER_GROUPS).forEach(group => {
  group.classList.remove(...REVEAL_CLASSES);
  [...group.children].forEach((child, i) => {
    child.classList.remove(...REVEAL_CLASSES);
    child.style.setProperty('--i', i);
  });
  group.classList.add('stagger');
  observer.observe(group);
});

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ---- Philosophy: the nautilus shell drawing itself ------------ */
// Timings come from data-t / data-d (seconds) on the SVG elements; one looping
// timeline, played only while the shell is on screen and the tab is visible.
const shell = document.querySelector('.shell');
if (shell && typeof shell.animate === 'function') {
  const LOOP = parseFloat(shell.dataset.loop) * 1000;
  const at = seconds => Math.min(1, Math.max(0, (seconds * 1000) / LOOP));
  const EASE = 'cubic-bezier(0.45, 0, 0.2, 1)';
  const timing = { duration: LOOP, iterations: Infinity };
  let anims = [];
  let inView = false;

  const draw = (el, t, d, easing = EASE) => el.animate([
    { offset: 0, strokeDashoffset: 1 },
    { offset: at(t), strokeDashoffset: 1, easing },
    { offset: at(t + d), strokeDashoffset: 0 },
    { offset: 1, strokeDashoffset: 0 }
  ], timing);

  const opacity = (el, from, t, d, to) => el.animate([
    { offset: 0, opacity: from },
    { offset: at(t), opacity: from, easing: EASE },
    { offset: at(t + d), opacity: to },
    { offset: 1, opacity: to }
  ], timing);

  const build = () => {
    shell.querySelectorAll('.shell__draw').forEach(el => {
      el.style.strokeDasharray = '1';
      const spiral = el.classList.contains('shell__spiral');
      anims.push(draw(el, +el.dataset.t, +el.dataset.d, spiral ? 'cubic-bezier(0.3, 0, 0.25, 1)' : EASE));
    });
    shell.querySelectorAll('.shell__grid, .shell__eye').forEach(el => {
      anims.push(opacity(el, 0, +el.dataset.t, +el.dataset.d, 1));
    });
    // the construction grid recedes once the spiral has completed
    const spiral = shell.querySelector('.shell__spiral');
    const complete = +spiral.dataset.t + +spiral.dataset.d;
    anims.push(opacity(shell.querySelector('.shell__squares'), 1, complete, 1.4, 0.35));
    // hold the finished drawing, then fade out before the loop restarts
    anims.push(opacity(shell.querySelector('.shell__art'), 1, LOOP / 1000 - 2.8, 2, 0));
  };

  const sync = () => anims.forEach(a => (inView && !document.hidden ? a.play() : a.pause()));
  const shellObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0.2 });

  const start = () => {
    if (anims.length) return;
    build();
    sync();
    shellObserver.observe(shell);
  };
  const stop = () => {
    shellObserver.unobserve(shell);
    anims.forEach(a => a.cancel());
    anims = [];
    shell.querySelectorAll('.shell__draw').forEach(el => { el.style.strokeDasharray = ''; });
  };

  const applyMotionPreference = () => (reduceMotion.matches ? stop() : start());
  applyMotionPreference();
  reduceMotion.addEventListener('change', applyMotionPreference);
  document.addEventListener('visibilitychange', sync);
}

/* ---- Contact form feedback ------------------------------------ */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.cssText = 'background:var(--clr-primary);color:var(--clr-white);pointer-events:none';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.cssText = '';
      contactForm.reset();
    }, 4000);
  });
}

/* ---- Smooth anchor scroll (for #book etc.) -------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href.length < 2) return; // placeholder links like href="#"
  anchor.addEventListener('click', e => {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  });
});
