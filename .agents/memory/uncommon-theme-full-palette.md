---
name: Uncommon theme full-palette CSS variables
description: Exact CSS variable set a new full-recolor (uncommon) theme must override in style.css
---

## Rule
An "uncommon" (full-recolor) theme is not just an `--accent` swap. It needs two blocks in `style.css` —
`body.theme-<key> { ... }` (light) and `body.dark-mode.theme-<key> { ... }` (dark) — each setting the
full variable set: `--accent, --bg, --bg2, --card, --text, --text2, --text-muted, --border, --card-shadow,
--btn-dark, --btn-dark-t, --diff-bg, --cell, --revealed, --mine, --flag, --flag-w, --sm-color,
--swatch-outline, --n1..--n8` (number-cell colors).

`--accent` inside the body block must exactly match the `accent` value in that theme's `THEMES` entry
(game.js) — the body block's `--accent` wins over the one the JS sets on `<html>`, so a mismatch makes
the accent-driven UI (buttons, active-state borders) disagree with the rest of the palette.

`--accent2` should NOT be redeclared in the body block — omitting it lets it correctly inherit the
JS-set value from `<html>` (see accent2-double-accent.md).

**Why:** Common themes (green/red/blue/etc.) only need `--accent` because they have no body block and
just inherit everything else from `:root`. Uncommon themes (synthwave, spamton, and later danger_zone/
volatile/blueprint/retro_terminal) fully override the palette, so skipping any variable leaves that part
of the UI stuck in the default palette while everything else recolors — an easy-to-miss partial theme.

**How to apply:** When adding a new uncommon theme, copy an existing `body.theme-<key>` +
`body.dark-mode.theme-<key>` pair as a template and only change the color values, keeping every variable
name. Also still needs: entry in `THEMED_DIFF_THEMES` array, 3 diff SVGs, and a
`.theme-card[data-theme-key="<key>"]` CSS block reusing the shared `.uc-particles` system (see
themed-diff-svgs.md) — the card gets `uncommon-card` class automatically from `rarity:'uncommon'` in the
THEMES entry, no HTML/JS changes needed.
