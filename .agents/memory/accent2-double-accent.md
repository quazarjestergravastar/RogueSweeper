---
name: Double-accent (accent2) system
description: How the two-tone accent system for uncommon themes (e.g. Spamton pink+yellow) is wired up, for consistency if extended to other themes.
---

Themes can define an optional `accent2` in the `THEMES` object (`static/game.js`). `applyTheme`/`previewTheme` write both `--accent` and `--accent2` (falling back to `--accent` when a theme has no second color) onto `document.documentElement`. A global `--accent-grad: linear-gradient(135deg, var(--accent), var(--accent2))` CSS var (defined in `:root`, `static/style.css`) is used instead of `background: var(--accent)` on prominent chrome (primary buttons, toggles, badges, progress/bar fills, notification icons) so themes without `accent2` render an identical flat color (since accent2 defaults to accent), while themes with a real second color (e.g. Spamton: pink + yellow) show a genuine two-tone gradient everywhere, not just on the swatch/accent-tinted bits.

**Why:** the user wanted Spamton's "double accent" (pink+yellow) to visibly run through the whole UI's interactive chrome, not just a single accent-tinted highlight — but doing this safely for every other theme (which only has one accent color) required a fallback that degrades to the old solid-color look with zero visual diff.

**How to apply:** when adding a new theme with two signature colors, just set `accent2` in its `THEMES` entry — no other wiring needed. Only apply `var(--accent-grad)` to large/solid backgrounds (buttons, fills, badges); leave thin borders, box-shadows, `color-mix()` usages, and text colors on plain `var(--accent)` since gradients don't render well there.
