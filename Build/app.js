/* ============================================================
   COLEÇÃO AMOR DE MÃE — app.js
   Vanilla JavaScript — sem dependências externas
   ============================================================ */

// ---- Helpers -----------------------------------------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---- Date / Year -------------------------------------------
(function initDates() {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  const el = $('#today-date');
  if (el) el.textContent = today;

  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// ---- Smooth Scroll (fallback for older browsers) -----------
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---- Carousel ----------------------------------------------
(function initCarousel() {
  const track  = $('#carousel-track');
  const dotsEl = $('#carousel-dots');
  if (!track) return;

  const slides = $$('.carousel-slide', track);
  let current  = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.carousel-dot', dotsEl).forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  $('#carousel-prev')?.addEventListener('click', () => goTo(current - 1));
  $('#carousel-next')?.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Auto-play
  setInterval(() => goTo(current + 1), 4500);
})();

// ---- FAQ Accordion -----------------------------------------
(function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      const answer  = btn.nextElementSibling;

      // Close all
      $$('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

// ---- Popup -------------------------------------------------
(function initPopup() {
  const overlay  = $('#popup-overlay');
  const openBtn  = $('#open-popup-btn');
  const closeBtn = $('#popup-close');
  if (!overlay) return;

  function openPopup()  {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click',  openPopup);
  closeBtn?.addEventListener('click', closePopup);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });
})();

// ---- Scroll-reveal (Intersection Observer) ----------------
(function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = [
    ...$$('.bonus-card'),
    ...$$('.testimonial-card'),
    ...$$('.plan-card'),
    ...$$('.faq-item'),
    ...$$('.benefit-item'),
  ];

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  targets.forEach(el => observer.observe(el));
})();
