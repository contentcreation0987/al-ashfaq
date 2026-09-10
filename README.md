# Al-Ashfaq Enterprises — deployable website

Plain static site. No build step, no framework, no React. Every page is fully
self-contained: the CSS and JS are inlined into each HTML file, so there is nothing
for the server to 404.

## Service sequence

The nine trades are ordered by **ship-repair execution sequence**, not alphabetically.
Insulation is phase 06-07 because it is the closing phase of a docking, not the first:

| # | Service | Page |
|---|---|---|
| 01 | Grit blasting / abrasive blasting (underwater hull & deck) | services/grit-blasting.html |
| 02 | Bilges & tank cleaning and painting | services/tank-cleaning.html |
| 03 | De-rusting & painting | services/de-rusting.html |
| 04 | Erection / dismantling scaffolding (with enclosure cloth) | services/scaffolding.html |
| 05 | Steel renewal & fabrication | services/steel-renewal.html |
| 06 | Stud welding & insulation | services/stud-welding.html |
| 07 | Insulation cladding on exhaust | services/exhaust-cladding.html |
| 08 | Cable tray fitting | services/cable-tray.html |
| 09 | Deck covering & anti-skid coating | services/deck-covering.html |

The three old service URLs (surface-protection, insulation, fabrication) are kept as
redirect pages so any link already shared keeps working.

## Photography

The photographs are the ones you supplied, now all in use.

Seven carry a visible stock-library watermark (Adobe Stock, getty images, iStock,
123RF). You asked for them to be used, so they are in place — but a procurement
buyer reading a pre-qualification site does notice a watermark, so replacing these
with your own site photographs is still the single highest-value change you can make:

- tank-entry-01 (Adobe Stock) — tank manhole entry · used on the home page, services index and HSE page
- tank-collage-01 — tank internals before/after · tank cleaning page
- paint-hull-02 (getty images) — hull spray painting · held in assets, not currently placed
- scaf-ship-01 / 02 / 03 (iStock) — ship scaffolding · home hero, services index, scaffolding page, projects page
- deck-chip-01 (123RF) — deck chipping tool · deck covering page

Two files are still held back, because they carry another company's advertising
rather than a watermark, and publishing them would put a competitor's phone number
on your site:

- "Stud Welding Products 800-252-1919" printed across the stud-welding photo
- "4½\" & 7\" Flap Discs available" printed across the de-rusting photo

Both slots are filled with clean alternatives from your own upload. Send replacements
for those two subjects and they will drop straight in at the same aspect ratio.

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

## Why the menu broke on Vercel, and why it can't again

`app.js` and `styles.css` were not being served on the live site. Rather than keep
fighting the host's asset resolution, **every page is now fully self-contained**:

- The stylesheet is inlined in a `<style>` block in each page's `<head>`.
- The script is inlined in a `<script>` block at the end of each page's `<body>`.
- No page references `styles.css` or `app.js` externally any more. Verified: zero
  external references to either file across all 16 pages.

There is now nothing for the server to 404. Each page is 51–64 KB of HTML and needs
no CSS or JS request at all, which is also fewer round trips on 4G.

`styles.css` and `app.js` are still in the folder as the editable source. **If you
change either one you must re-inline it into the pages** — otherwise your edit will
have no effect, because the pages no longer load those files. Ask me and I will
re-run the inlining.

Images still load from `assets/`, and icons still come from the Lucide CDN. If the
icon CDN ever fails the menu button still reads "Menu" in text, so it stays usable.

## The menu bug, and the actual root cause

Three things were wrong, fixed in this order:

1. **Stacking context.** The drawer sat inside `<header>`, and a `position:sticky`
   header with a `z-index` creates a stacking context — the drawer was trapped
   behind the page whatever its own `z-index`. It is now a direct child of `<body>`.
2. **Assets not served.** `styles.css` and `app.js` were 404ing on the host, so the
   button had nothing wired to it and the top bar lost its styling. Both files are
   now **inlined into every page**, so there is nothing left to 404.
3. **Visibility depended on a CSS class.** This was the one that kept the bug alive.
   The drawer was parked off-screen with `transform:translateX(100%)` and only slid
   in when JS added an `is-open` class. If that class or its transition did not take
   effect, the scroll lock still applied — the scrollbar vanished — but the panel
   stayed off-screen. That is exactly the symptom that was reported.

   **The drawer's visibility is now the `hidden` attribute and nothing else.** No
   class, no timer, no transition to wait on. The slide-in is a decorative CSS
   animation on appearance. Tested with every animation and transition forcibly
   disabled: the drawer still appears on screen, is the topmost element, and closes
   on the button, the backdrop and Escape.

## Before you go live

- **Cache busting.** Not needed any more — the CSS and JS live inside each HTML file, so a
  page update carries its own styling and behaviour. If a visitor sees an old page, it is
  ordinary HTML caching; a hard reload clears it.

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
