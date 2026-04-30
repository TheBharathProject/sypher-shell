# Design system

The visual language for everything under `sypher.in` — landing, blog, tool marketing pages, tool dashboards. Read this before building any new surface.

## Aesthetic direction

**Calm Sunday-afternoon SaaS.** Read in 8 seconds. Trustworthy, white-collar, conversion-friendly. The reference is `naukriclear.com` — warm cream canvas, centered single-column layout, plain sans body, one serif accent for headlines, restrained iconography.

What this is **not**:

- No dark themes, no near-black canvases
- No decorative layers (grain, radial glows, cipher patterns, terminal aesthetics)
- No mono fonts in body copy (mono is reserved for code blocks and tool slugs)
- No stacked-line poetic headlines with multiple emphases
- No section number prefixes (`// 01 / decode`)
- No fake terminal flourishes (`>` prompts, blinking cursors, `[]` ASCII)
- No more than one accent color
- No purple gradients, no neon, no glitch effects, no gimmicks

If a section needs a flourish to feel "designed," delete the flourish. Trust the type and the spacing.

## Tokens

All canonical tokens live in `app/globals.css` under `@theme`. Use them as Tailwind utility classes (`bg-paper`, `text-ink`, `border-hairline`).

### Color

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#f5f1eb` | Page background. Warm cream. |
| `--color-paper-deep` | `#ede8df` | Alternating section bg for visual rhythm. |
| `--color-card` | `#fdfcf9` | Card surface. Slightly off-white so it pops on cream. |
| `--color-ink` | `#1a1a1a` | Primary text + buttons. Off-black, never pure black. |
| `--color-ink-muted` | `#5a5a5a` | Body copy, secondary. |
| `--color-ink-faint` | `#8a8a8a` | Meta text, fine print, eyebrows. |
| `--color-saffron` | `#e85d04` | Single accent. Italic emphasis, dot indicators, primary action highlights. |
| `--color-saffron-soft` | `#fde8d3` | Selection highlight, soft accent fills. |
| `--color-hairline` | `#e0dbd1` | Borders. 1px, never thicker. |

Rule: never introduce a new color without retiring an existing one. Two accents = no accent.

### Typography

Two families, no more.

| Variable | Family | Use |
|---|---|---|
| `--font-display` | Instrument Serif (400, 400 italic) | Headlines, hero, section titles. |
| `--font-sans` | Geist (400, 500, 600) | Body, UI, buttons, eyebrows, meta. |

**Headline rules:**

- One line, max two if absolutely necessary (use CSS `text-balance`)
- One italic emphasis per headline, not three
- Italic emphasis carries the saffron accent: `<span class="t-display-italic text-saffron">word</span>`
- Sizes use `clamp()`: hero `clamp(36px, 5.4vw, 68px)`, section `clamp(28px, 4vw, 44px)`. Don't go bigger.
- Letter-spacing `-0.02em`, line-height `1.05`

**Body rules:**

- Body copy 15–17px on desktop, 14–16px on mobile
- `line-height` 1.5–1.7 for any block of text
- `text-ink` for primary, `text-ink-muted` for secondary, `text-ink-faint` for meta
- Never bold an entire paragraph. Bold individual words for emphasis at most.

**Eyebrow** (the small uppercase label above a section headline):

- Geist 500, 12px, `letter-spacing: 0.18em`, uppercase, `text-ink-faint`
- Class: `t-eyebrow`
- Examples: "What we believe", "Who it's for", "Questions"

## Layout

### Section wrap

Every top-level section uses `.section-wrap`:

```
max-width: 1100px
padding: 0 24px (mobile) / 0 32px (desktop)
margin: 0 auto
```

Vertical rhythm inside a section: `py-20` (80px) on mobile, `py-28` (112px) on desktop. Hero is the exception (`py-16 md:py-24`). Closing CTA is the other exception (`py-24 md:py-32` to give it weight).

### Section separators

- Background alternation between `bg-paper` (cream) and `bg-deep` (cream-deep)
- 1px `border-hairline` on top/bottom of darker bands
- Never use shadows for separation. Hairline + bg shift only.

### Centered single-column

Default. Hero, principles, tools, audiences, FAQ, closing all use centered max-widths within their `section-wrap`:

| Surface | Max-width | Reason |
|---|---|---|
| Hero headline | `max-w-[820px]` | Two-line max at large sizes |
| Section headline | `max-w-[640px]` | Tight, single line preferred |
| Section sub-paragraph | `max-w-[520-540px]` | Reading line length ~65ch |
| FAQ accordion | `max-w-[720px]` | Wider than reading text |
| Email form | `max-w-[440px]` | One input + button row |

### Card grids

Three-column on desktop (`md:grid-cols-3`), one-column on mobile. Gap is `gap-4` (16px) — not larger. Cards are content-heavy; whitespace lives between sections, not between cards.

Two-column for tool cards (`md:grid-cols-2`) since tool descriptions are longer.

## Components

All defined in `app/globals.css`. Use them by class.

### Button

```html
<a class="btn btn-primary">
  Join the waitlist
  <span class="arrow" aria-hidden>→</span>
</a>

<a class="btn btn-secondary">See what's coming</a>
```

- `btn-primary` — black background, cream text, slight lift on hover, arrow translates right
- `btn-secondary` — card-bg, hairline border, ink border on hover
- Padding 14×22, radius 10, 15px medium
- **Never use saffron as a button background.** Saffron is for emphasis text and dot indicators only.

### Pill (status / eyebrow chip above hero)

```html
<span class="pill">
  <span class="pill-dot" aria-hidden></span>
  Free for the first 100 · No spam
</span>
```

Saffron dot, hairline border, card surface, 13px sans. One per page max — pre-hero positioning only.

### Card

```html
<article class="card">
  ...
</article>
```

- 28px padding, 14px radius, hairline border, card surface
- Add `card-hover` for cards that link out (border-darkens + slight Y translate on hover)
- Inside cards: 18px semibold title (`tracking-tight`), 14px muted body, optional border-top divider above meta footer

### Input

```html
<input type="email" class="input-line" placeholder="you@inbox.in" />
```

Card surface, hairline border, 10px radius, 14px×16px padding, ink border on focus. Pair with `btn-primary` in a form row.

## Section patterns (recipes)

### Hero

```
[pill]
[serif headline, one italic word, optional saffron emphasis]
[1-3 sentence sub-paragraph in ink-muted]
[primary button] [secondary button]
[fine print in ink-faint]
```

Centered. Vertical breathing room above/below.

### Eyebrow + Headline + Sub + Grid

The default section pattern. Used by Principles, Tools, Audiences, FAQ.

```
<eyebrow>What we believe</eyebrow>
<h2 class="t-display">Sharp tools for <span class="t-display-italic">specific</span> problems.</h2>
<p>Sub-paragraph explaining context.</p>
<div class="grid">
  ...cards...
</div>
```

### Card with icon

For principles or features. Small 10×10 stroke SVG in a `paper-deep` rounded square, then 18px semibold title, then 14px muted body. No marketing-speak — direct sentences.

### Card with quote

For audiences or testimonials. Title, body, then a saffron-bordered italic quote at the bottom (`border-l-2 border-saffron pl-3`).

### FAQ accordion

Native `<details>` + `<summary>` for accessibility (no JS needed). The summary uses `cursor-pointer list-none gap-6` and contains the question + a `+` icon that rotates 45° to `×` when `[open]`. The answer is a 14px muted paragraph.

### Closing CTA

A bigger version of the hero pattern — large serif headline, sub, form row (input + button), opt-out fine print. Used to convert at the end of the page.

## Iconography

When icons are used (Principles section, FAQ `+`, tool meta arrows), use:

- Inline SVG, 16–20px
- `stroke="currentColor"`, `stroke-width="1.5"`, no fill
- Linecap/linejoin "round"
- Single-path or two-path glyphs only — no complex iconography

Never use icon fonts, emoji as decoration, or 3D illustrated icons.

## Motion

- `transition: 180ms ease` on color, border, background
- `transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)` on transforms
- One micro-interaction per element (button lift OR arrow translate, not both stacked)
- `prefers-reduced-motion: reduce` disables all transitions globally (already wired in `globals.css`)
- No scroll-driven animations, parallax, or staggered reveals on the calm-SaaS surfaces

## What "applying this to a new tool" looks like

When you build `sypher-tool-<slug>`:

1. Copy the same Tailwind v4 theme tokens (or import `globals.css`-style variables) so the tool's marketing page matches the shell
2. Use Instrument Serif + Geist via `next/font/google`
3. Marketing page (`app/page.tsx` with basePath `/<slug>`) follows the section recipe: hero → 3-card features → CTA → footer
4. Dashboard pages can break this — pick a more functional layout — but must still use the same color tokens and font families so it feels like the same product
5. CTAs link back to `sypher.in` and to the shell's auth/billing endpoints

## When to deviate

You can deviate from this guide only when:

- Building a tool dashboard (UI-density needs override marketing aesthetics, but tokens stay the same)
- A specific tool's brand requires a different feel (rare; flag this as a one-off in the tool's repo, don't change the shell)
- A blog post wants custom layout for a specific story (the blog has its own scoped styles in `app/blog/blog.css` for exactly this reason — light cream bg, Georgia body for reading-mode)

If you find yourself deviating in marketing surfaces, you're probably solving a copy problem with design. Fix the copy.

## Anti-patterns we've already learned to avoid

| Anti-pattern | Why it failed | What to do instead |
|---|---|---|
| Stacked-line headlines with 3+ italic emphases | Looks designed but slows reading; user couldn't skim | One headline, one italic word |
| Section markers (`// 01 / decode`) | Reads as code, not editorial | Simple eyebrow ("What we believe") |
| JetBrains Mono in body | Reads as terminal output, not text | Geist for body, mono only for code |
| Cipher seal hatching, terminal cursors | Decoration without function | Clean cards, hairline borders |
| Decode-yellow as accent | Too aggressive against any palette | Saffron for emphasis, ink for action |
| "Mumbai → world" / "Built quietly. Shipped fast." slogans | Reads as fluff, not info | Concrete claims with numbers (₹99/mo, first 100 users) |

These were all real iterations on `sypher.in`. The current design is what's left after cutting them.
