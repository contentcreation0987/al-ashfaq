# Al-Ashfaq Enterprises — deployable website

Plain static site. No build step, no framework, no React. Upload this folder and it works.

```
site/
├── index.html          Home
├── about.html          About
├── capability.html     Capability & plant
├── projects.html       Project references (no photographs, by design)
├── hse.html            HSE & worker welfare
├── equipment-hire.html Air compressor hire (PDS 655 / PDS 390)
├── rfq.html            Request a quotation
├── contact.html        Contact (same form + contact block)
├── 404.html            Not found
├── services/
│   ├── index.html      Services hub — 6 cards + equipment-hire band
│   ├── surface-protection.html
│   ├── insulation.html
│   ├── deck-covering.html
│   ├── fabrication.html
│   ├── cable-tray.html
│   └── scaffolding.html
├── styles.css          One stylesheet (design-system tokens + components, flattened)
├── app.js              Drawer, hero cross-fade, scroll reveal, stat count-up, form
├── vercel.json         Clean URLs + asset caching
└── assets/             Logo + photographs
```

## Deploying to Vercel

**Option A — drag and drop.** Vercel dashboard → your project → Deployments →
**Create Deployment** → drag the **contents of this `site/` folder** (not the folder
itself) → Deploy → then **Promote to Production**.

**Option B — GitHub.** Copy the contents of `site/` to the root of your repo, commit,
push. In Vercel → Settings → Build & Development Settings: Framework Preset **Other**,
Build Command **empty**, Output Directory **empty** (or `.`), Root Directory **empty**.

**If the old site still shows after deploying:**
1. Deployments list — is there a new deployment, and is it marked **Production**? If it says
   Preview, use `…` → Promote to Production.
2. Hard reload (Ctrl+Shift+R) or open in incognito. The old site may have registered a
   service worker; check DevTools → Application → Service Workers → Unregister.
3. Check Settings → Domains: your custom domain must point at *this* project, not the old one.
4. Delete the old project in Vercel once the new one is live, so there is no confusion
   between the two URLs.

## QA performed

Checked on the built pages, not assumed:

- **Mobile menu** — opens, slides in, backdrop dims, tapping the backdrop / Escape / the close
  button / any drawer link all close it; body scroll locks and the scroll position is restored
  exactly on close; focus moves to the close button and Tab is trapped inside the drawer; the
  WhatsApp button hides while the drawer is open; the drawer closes by itself if the window is
  widened into the desktop nav.
  *The bug that was reported:* the drawer used to sit inside `<header>`, and a `position:sticky`
  header with a `z-index` creates a stacking context — the drawer was trapped behind the page
  however high its own `z-index`. It is now a direct child of `<body>` on all 16 pages.
- **Internal links** — all 17 relative link targets resolve to files that exist. No 404s.
- **Images** — every `<img>` carries an `alt` attribute; none fail to load. The three
  non-first hero frames carry `alt=""` deliberately (decorative duplicates of the first).
- **Tap targets** — every button, input, nav item and footer link is ≥ 44px on mobile. The one
  remaining exception is an inline link inside a sentence, which cannot be 44px without
  wrecking the line height.
- **Horizontal overflow** — none; document scroll width never exceeds the viewport.
- **RFQ form** — blocks an empty submit, shows the confirmation only on a valid one, file name
  displays on attach, no control under 44px.
- **Icons** — all 27 render; no unreplaced placeholders left in the DOM.
- **Console** — clean, no errors on any page.

## Before you go live

- **Cache busting.** `styles.css` and `app.js` are referenced with `?v=3`. If you edit either
  file, bump that number on every page (find-and-replace `?v=3` → `?v=4`) or returning visitors
  will keep the old cached copy. This is exactly what caused a "my changes aren't showing"
  problem during the build.

- **The RFQ form does not send anywhere yet.** It validates and shows a confirmation on the
  page only. Wire it to a handler — Formspree, Web3Forms or a Vercel serverless function — by
  setting `action` and `method` on `<form data-rfq>` and removing the `e.preventDefault()`
  block in `app.js`. Until then the phone/WhatsApp/email links are the working channels.
- **Project references are illustrative.** Customer names are real; the scopes, years and
  reference numbers in `projects.html` and on the home page are placeholders. Replace them
  with real records before publishing.
- **Insulation and cable-tray photographs are still missing.** The v2 image pack's two
  insulation photos are CC BY-SA 4.0 (attribution required), so they are deliberately NOT
  wired in — the pack's own README advises against them and an attribution line on a
  contractor's service page reads badly. Those slots, plus the cable-tray, scaffolding-hero,
  capability-plant and compressor slots, render as clearly-marked dashed placeholders at the
  correct aspect ratio. Drop a real file in at the named path and the layout does not change.
- **Icons load from a CDN** (`unpkg.com/lucide@0.544.0`). For reliable performance on 4G in
  Pakistan, download that file into `assets/` and change the `<script src>` on every page.
- **Fonts load from Google Fonts** (Archivo, Inter, IBM Plex Mono) via the `@import` at the
  top of `styles.css`. Self-hosting WOFF2 subsets will cut first-paint time noticeably.
- **No HSE certification is claimed** anywhere, and no client logos are shown. Keep it that
  way unless you hold the certificate or have written permission.
