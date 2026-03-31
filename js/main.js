/* ============================================================
   NAUTILUS AESTHETICS — MAIN JS
   ============================================================ */

/* ---- Navigation scroll state ---------------------------------- */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileDrawer = document.querySelector('.nav__mobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

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

/* ---- Hero background zoom on load ----------------------------- */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) window.addEventListener('load', () => heroBg.classList.add('loaded'));

/* ---- Scroll-triggered fade-up animations ---------------------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

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
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
