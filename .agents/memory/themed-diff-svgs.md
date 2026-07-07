---
name: Themed diff SVG convention
description: How to add diff icons for a new theme
---

## Rule
Every theme that uses the diff-icon system needs:
1. Three SVG files: `static/assets/themes/<key>/diff-{easy,normal,hard}.svg`
2. The key added to the `THEMED_DIFF_THEMES` array in `game.js`
3. A theme entry in the `THEMES` const (with `rarity`, `accent`, `cost`, `diff` color hints)

**SVG format** (40×40 viewBox): `<circle cx="20" cy="20" r="20" fill="<color>"/>` + a white shape (triangle path for easy, rect for normal, diamond path for hard).

**Why:** `Sprites.preload()` fetches all `THEMED_DIFF_THEMES × THEMED_DIFF_LEVELS` combinations in parallel at load time into `Sprites.themedDiff`. Missing files cause silent 404s that result in broken diff icons when the theme is applied.

**Theme card CSS:** Uncommon themes also need `.theme-card[data-theme-key="<key>"]` rules in `style.css` if their swatches would have unreadable text against the card background.
