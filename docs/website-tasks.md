# Website tasks — September 2026

Four tasks, roughly in dependency order. Task 2 is quick and self-contained; task 1 is the
one that changes how the site feels.

Work on a branch. Vercel builds a preview URL per branch — Chance and Ashley review there,
then merge. `main` is live.

---

## 1 · Make the primary color actually carry the page

**The problem, measured.** The palette change landed correctly — the live page serves
`--clr-primary: #0B4F4A`. But Chance couldn't see any difference, and he was right not to.
Painted surface area on the homepage:

| Color | Area |
|---|---|
| Warm ivory `#FAF6EE` | ~18,177k px² |
| White | ~2,317k px² |
| Dark `#06312E` | ~1,755k px² |
| Near-black | ~1,113k px² |
| **Primary `#0B4F4A`, at 5% opacity** | **~84k px²** |
| Gold `#C4A24A` | ~32k px² |

The primary paints roughly **0.4% of the page**, and where it appears it is at five percent
opacity. It is a text color, not a surface. Changing the hex again will not fix this.

**What to do.** Give the primary real surface area. Do not do all of these — build two or
three distinct options on one preview and let them choose:

- A section band in full `--clr-primary` (Philosophy or Why Nautilus) instead of ivory
- Primary-filled buttons instead of the current gold-on-ivory treatment
- Service card overlays graded toward primary rather than `--clr-primary-dark`
- The footer in primary rather than near-black
- A primary hero field, with the photo as a supporting element rather than the ground

**Constraints.** Ivory stays the dominant page ground — this is a luxury spa, not a
colorblock. Gold stays an accent and does not expand to compensate. Every value comes from
a `:root` token.

Present them as genuine alternatives with a named tradeoff each, not five shades of one idea.

---

## 2 · Device photos have a baked-in blurred border

**Diagnosis.** This is not a CSS problem. `images/devices/medidiode.jpg` and
`medispa.jpg` are both 1400×1050, but the real photograph inside each is **portrait**,
centered, with a blurred enlarged copy of itself filling the surrounding area as fake
letterboxing. That blurred halo is the "strange border." Every CSS rule that touches these
already uses `object-fit: cover` — nothing to fix there.

Approximate inner-photo bounds for `medidiode.jpg` (confirm visually before cutting):
left ≈ 378, top ≈ 118, right ≈ 1022, bottom ≈ 930 → about 644×812, portrait.
`medispa.jpg` has a wider inner photo; measure it the same way.

**Fix.** Crop each file down to the real photograph, overwrite in place, and let the
existing `object-fit: cover` fill the frames. No stylesheet change needed. The frames are
landscape (`.service-block__img` 500px tall, `.device-hero__img` 4/3,
`.service-card__img-wrap` 340px tall), so a cropped portrait source will center-crop — check
that the crop doesn't decapitate the device, and adjust `object-position` if it does.

**Raise before shipping.** The MediDiode photo shows the device with a purple
**"MC — Advanced Aesthetic Solutions"** logo lit up on its screen. That is MediCreations'
branding, the supplier, sitting in the middle of Ashley's website. Check `medispa.jpg` for
the same thing. Worth flagging to Chance — retouching it out or reshooting may matter more
than the border does.

---

## 3 · Nautilus shell animation for the Philosophy section

Replace the still-life photo in the Our Philosophy block on `index.html` (around line 96,
`.intro__image`, `images/brand/still-life.jpg`) with an animation.

**Concept.** The nautilus shell drawing itself, revealing the golden-ratio spiral and the
proportional grid it grows on. This is not decoration — the brand guide opens by explaining
that the shell grows according to the golden ratio, and that this is the whole basis of the
name. The section it sits beside is titled *Evolve — Don't Change*. The animation should
make that idea land in about four seconds.

**Direction.**
- Nautilus cross-section, fine-line, elegant — the golden spiral traced out over a
  proportional grid that resolves as the spiral completes
- Palette only: deep teal `#0B4F4A`, dark `#06312E`, warm ivory `#FAF6EE`, gold `#C4A24A`
- Slow, quiet, continuous. Nothing bouncy. Reads as premium, not as a loading spinner
- Must work as a loop, and must read at the container size: `.intro__image` is 100% width
  by **580px tall** — portrait. Generate portrait, not 16:9
- No text in the animation

**Tooling.** The Higgsfield connector is available (Plus plan). If generating video, keep
the file small enough to load without stalling the section — a short silent MP4 or WebM,
`autoplay muted loop playsinline`, with a poster frame. An SVG/CSS-drawn spiral is a
legitimate alternative and would be far lighter; if the generated video is heavy or looks
generic, build it in SVG instead. Judge on the result, not the tool.

---

## 4 · Motion pass

**What exists.** `js/main.js` has an IntersectionObserver adding `.visible` to `.fade-up`
elements, a nav scroll state, and a hero background zoom on load. `css/styles.css` has
`.fade-up` (opacity + 24px translate, 0.75s) and transitions scattered through.

The foundation is fine. It needs refinement, not replacement.

**Do.**
- Stagger reveals within a group (cards, principles, benefits) rather than firing together
- Give the hero a considered entrance — the current zoom is blunt
- Warm up hover states on service cards and buttons
- Consider a gold hairline that draws itself under section titles on reveal

**Do not.** Parallax, scroll-jacking, counters ticking up, anything that delays reading.
The brand voice is *calm and premium*. Motion should feel like the page settling, not
performing.

**Required, and currently missing everywhere:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

There is no `prefers-reduced-motion` guard in the stylesheet today. Add it as part of this
task, and make sure the Philosophy animation honors it too — a looping video needs a
scripted pause, not just a CSS rule.

---

## Checking the work

- View at 390px wide as well as desktop. The stylesheet has breakpoints at 768 and 480.
- Confirm no new hardcoded hex values: `grep -n '#[0-9A-Fa-f]\{6\}' css/styles.css`
  should return only the `:root` block.
- `images/logo.svg` is entirely `#C4A24A` — if the logo ever needs to reverse out, that is
  a separate asset, not a CSS filter.
