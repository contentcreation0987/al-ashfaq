/* Al-Ashfaq Enterprises — site behaviour. No framework.
   1. mobile drawer (backdrop, Escape, focus trap, scroll lock)
   2. hero photograph cross-fade
   3. scroll reveal
   4. stat count-up
   5. RFQ form: file name display + local confirmation
   All motion stops under prefers-reduced-motion. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. drawer ----------------------------------------------------------
     The drawer and backdrop are direct children of <body>, NOT of the sticky
     <header>: a sticky element with a z-index creates a stacking context, which
     would trap the drawer behind page content however high its own z-index.
     An inline fallback in the page <head> may already have wired this up (in
     case app.js failed to load); the shared __aaeDrawerInit flag prevents a
     double bind. */
  const drawerAlreadyWired = window.__aaeDrawerInit;
  if (!drawerAlreadyWired) window.__aaeDrawerInit = true;
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const openBtn = document.querySelector('[data-drawer-open]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  let scrollY = 0;
  let isOpen = false;

  const lock = () => {
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = -scrollY + 'px';
    document.body.classList.add('is-locked');
  };
  const unlock = () => {
    document.body.classList.remove('is-locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  };

  const setDrawer = (on) => {
    if (!drawer || on === isOpen) return;
    isOpen = on;
    // Visibility is the [hidden] attribute and nothing else — no class, no timer,
    // no transition to wait on. If the CSS animation never runs, the drawer is
    // still on screen.
    drawer.hidden = !on;
    if (backdrop) backdrop.hidden = !on;
    if (openBtn) openBtn.setAttribute('aria-expanded', String(on));
    if (on) {
      lock();
      if (closeBtn) closeBtn.focus();
    } else {
      unlock();
      if (openBtn && openBtn.offsetParent) openBtn.focus();
    }
  };

  // Bind unless an inline fallback already did (shared __aaeDrawerInit flag).
  if (!drawerAlreadyWired) {
    if (openBtn) openBtn.addEventListener('click', () => setDrawer(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
    if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));
    // a tap on a drawer link should close it before the page changes
    if (drawer) {
      drawer.querySelectorAll('a[href]').forEach((a) => {
        a.addEventListener('click', () => setDrawer(false));
      });
    }
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { setDrawer(false); return; }
      if (e.key !== 'Tab' || !drawer) return;
      const f = [...drawer.querySelectorAll('a[href],button:not([disabled])')]
        .filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // close if the viewport grows into the desktop nav while the drawer is open
    window.matchMedia('(min-width: 1240px)').addEventListener('change', (e) => {
      if (e.matches) setDrawer(false);
    });
  }

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

  /* ---- 4. stat count-up ----
     Years are never animated: counting 0 → 1998 shows "1986" mid-flight, which
     reads as a wrong founding date. Only quantities count up. */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const raw = el.getAttribute('data-count');
    const isYear = /^(19|20)\d{2}$/.test(raw.trim());
    const m = /^(\D*)(\d[\d,]*)(.*)$/.exec(raw);
    if (!m || reduced || isYear) { el.textContent = raw; return; }
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
