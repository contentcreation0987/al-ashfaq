# Al-Ashfaq Enterprises — deployable website

Plain static site. No build step, no framework, no React. Upload this folder and it works.

```
site/
├── index.html          Home
├── about.html          About
├── capability.html     Capability & plant
├── projects.html       Project references
├── hse.html            HSE & worker welfare
├── rfq.html            Request a quotation
├── contact.html        Contact (same form + contact block)
├── 404.html            Not found
├── services/
│   ├── index.html      Services index
│   ├── insulation.html
│   ├── surface-protection.html
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

## Before you go live

- **The RFQ form does not send anywhere yet.** It validates and shows a confirmation on the
  page only. Wire it to a handler — Formspree, Web3Forms or a Vercel serverless function — by
  setting `action` and `method` on `<form data-rfq>` and removing the `e.preventDefault()`
  block in `app.js`. Until then the phone/WhatsApp/email links are the working channels.
- **Project references are illustrative.** Customer names are real; the scopes, years and
  reference numbers in `projects.html` and on the home page are placeholders. Replace them
  with real records before publishing.
- **Icons load from a CDN** (`unpkg.com/lucide@0.544.0`). For reliable performance on 4G in
  Pakistan, download that file into `assets/` and change the `<script src>` on every page.
- **Fonts load from Google Fonts** (Archivo, Inter, IBM Plex Mono) via the `@import` at the
  top of `styles.css`. Self-hosting WOFF2 subsets will cut first-paint time noticeably.
- **No HSE certification is claimed** anywhere, and no client logos are shown. Keep it that
  way unless you hold the certificate or have written permission.
