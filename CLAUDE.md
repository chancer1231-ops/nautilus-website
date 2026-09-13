# Nautilus Aesthetics — Website

Static marketing site for Nautilus Aesthetics, an advanced esthetics studio in Las Vegas.
Owner/operator: Ashley. No build step, no framework, no package manager.

## Stack and layout

Plain HTML, one stylesheet, one script.

```
index.html  about.html  services.html  contact.html
medispa.html  medidiode.html  jett-plasma.html
css/styles.css   (~1400 lines — all styling)
js/main.js       (~74 lines — nav, mobile drawer, IntersectionObserver fade-ups, form)
images/brand/  images/devices/  images/logo.svg
```

Open `index.html` in a browser to work locally. There is nothing to install or compile.

## Deploy

Vercel, connected to this repo. **`main` auto-deploys to production** at
`nautilus-website.vercel.app`. Any other branch gets its own Vercel preview URL.

There is no custom domain yet. GitHub Pages is intentionally disabled — do not enable it;
it would publish a second copy of the site from the same repo.

**Work on a branch.** Pushing to `main` publishes immediately to the live site.

## Brand

Palette decided September 2026. All colors live in the `:root` block at the top of
`css/styles.css`. **Never hardcode a hex anywhere else** — the stylesheet's own header
says the same thing, and it has held up.

| Token | Value | Role |
|---|---|---|
| `--clr-primary` | `#0B4F4A` | Deep teal — headers, CTAs, logo |
| `--clr-primary-dark` | `#06312E` | Backgrounds, panels |
| `--clr-accent` | `#C4A24A` | Brush gold. Flat only — a brushed/metallic finish was explored and rejected |
| `--clr-ivory` | `#FAF6EE` | Page background. Never pure white |
| `--clr-text` | `#1A1A17` | Body copy. Never pure black |

Keep `--clr-primary-rgb` and `--clr-primary-dark-rgb` in sync with the hex values — several
gradients and overlays use them via `rgba(var(--clr-primary-rgb), …)`.

**If you find `#1E6655`, `#1D5C52` or `#1D5C25` anywhere, it is stale.** Those were three
competing values for the same "primary" across the brand guide and this stylesheet before
September 2026. All are now `#0B4F4A`.

Fonts: **Cormorant Garamond** (display) and **DM Sans** (body), both free Google Fonts,
loaded by `@import` at the top of the stylesheet. Tokens: `--font-display`, `--font-body`.

Full brand guide: `~/Desktop/nautilus-assets/01_Brand/Nautilus_Aesthetics_Brand_Guide.docx`

## Voice

From the brand guide: sophisticated, warm, expert, approachable, empowering, precise.

Use: enhance · reveal · refine · restore · elevate · precision · artistry · rejuvenation
Avoid: fix · correct · erase · anti-aging · cheap · quick fix · discount · medical jargon

Tagline: *Revealed. Refined. Radiant.*

## Compliance — these are not style preferences

- **"Permanent hair reduction," never "permanent hair removal."** The second is a claim
  the device is not cleared for.
- **No guaranteed outcomes** anywhere in copy.
- **The medical director's name, credentials, and license number must not appear on this
  site** — not in copy, not in a bio, not in a photo caption — without his prior written
  approval. This is §4.5 of the signed agreement, not a nicety.
- Advertising a specific monthly financing payment triggers disclosure requirements
  (term, APR, down payment). If a "$X/mo" figure goes on a page, the full Cherry footnote
  goes with it. Text is in
  `~/Desktop/nautilus-assets/03_Pricing_and_Offers/Nautilus_Service_Menu_LAUNCH.md`.

## Services at launch

MediDiode (laser hair reduction) and MediSpa (facials) only. **Jett Plasma is deferred a
few months** — `jett-plasma.html` exists and is linked from the homepage and services page.
Confirm with Chance whether it should stay visible before launch.

Facial tiers: The Reveal $175 · The Refine $265 · The Evolve $350.
Membership: The Nautilus Circle, $149/mo.
Full pricing: `~/Desktop/nautilus-assets/03_Pricing_and_Offers/Nautilus_Service_Menu_LAUNCH.md`

## Current work

See `docs/website-tasks.md`.
