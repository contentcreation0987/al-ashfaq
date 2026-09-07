/* Al-Ashfaq Enterprises — site behaviour. No framework.
   1. mobile drawer (backdrop, Escape, scroll lock)
   2. hero photograph cross-fade
   3. scroll reveal
   4. stat count-up
   5. RFQ form: file name display + local confirmation
   All motion stops under prefers-reduced-motion. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. drawer ---- */
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const openBtn = document.querySelector('[data-drawer-open]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  const setDrawer = (on) => {
    if (!drawer) return;
    drawer.hidden = !on;
    if (backdrop) backdrop.hidden = !on;
    document.body.classList.toggle('is-locked', on);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(on));
    if (on && closeBtn) closeBtn.focus();
    else if (!on && openBtn) openBtn.focus();
  };
  if (openBtn) openBtn.addEventListener('click', () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });

  /* ---- 2. hero cross-fade ---- */
  const media = document.querySelector('[data-hero-rotate]');
  if (media && !reduced) {
    const slides = [...media.querySelectorAll('img')];
    if (slides.length > 1) {
      let i = 0;
      setInterval(() => {
        slides[i].classList.remove('is-active');
        slides[i].setAttribute('aria-hidden', 'true');
        i = (i + 1) % slides.length;
        slides[i].classList.add('is-active');
        slides[i].removeAttribute('aria-hidden');
      }, 6000);
    }
  }

  /* ---- 3. scroll reveal ---- */
  if (!reduced) {
    const targets = new Set(document.querySelectorAll('[data-reveal]'));
    document.querySelectorAll('.aae-section > .aae-container > *').forEach((el) => targets.add(el));
    targets.forEach((el) => el.classList.add('aae-reveal'));
    const check = () => {
      const h = window.innerHeight || 800;
      document.querySelectorAll('.aae-reveal:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < h * 0.92) el.classList.add('is-visible');
      });
    };
    check();
    document.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    window.addEventListener('load', check);
  }

  /* ---- 4. stat count-up ---- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const raw = el.getAttribute('data-count');
    const m = /^(\D*)(\d[\d,]*)(.*)$/.exec(raw);
    if (!m || reduced) { el.textContent = raw; return; }
    const target = Number(m[2].replace(/,/g, ''));
    const grouped = m[2].includes(',');
    const fmt = (v) => (grouped ? v.toLocaleString('en-US') : String(v));
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now(), dur = 1100;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = m[1] + fmt(v) + m[3];
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
  });

  /* ---- 5. RFQ form ---- */
  const file = document.querySelector('[data-file]');
  if (file) {
    file.addEventListener('change', () => {
      const name = document.querySelector('[data-file-name]');
      if (name) name.textContent = file.files && file.files[0] ? file.files[0].name : 'No file selected';
    });
  }
  const form = document.querySelector('[data-rfq]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const ok = document.querySelector('[data-rfq-ok]');
      form.hidden = true;
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  }

  /* icons */
  const drawIcons = () => { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); };
  drawIcons();
  window.addEventListener('load', drawIcons);
})();
