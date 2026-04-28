# RogueSweeper

A roguelike take on classic Minesweeper, served by Flask and rendered with vanilla JavaScript. Build a loadout of special mines, chase a style meter, unlock themes, and run the gauntlet across boards of escalating difficulty.

## Features

- **Roguelike runs** — clear successive boards, earn points, and graduate to harder layouts.
- **Special mines** — Mine Mine, Trench Mine, Grenade Mine, and Totem Mine, each with their own placement rules and effects.
- **Style meter** — chains of efficient digs and flags push your rank from D up to S+ for bonus points.
- **Mine market** — spend points between runs on charges, themes, and cosmetics.
- **Themes** — light/dark variants plus unlockables like Synthwave, all driven by CSS custom properties.
- **Mobile-friendly** — touch swipe, two-finger flag, auto-switch-to-flag-on-empty-tap, and a centered HUD that never overflows.
- **Settings** — SFX volume, particle amount, style meter position, dark mode, auto-flag toggle.

## Running locally

Requirements: Python 3.11+ and Flask.

```bash
pip install flask
python main.py
```

The server listens on `http://0.0.0.0:5000`. Open it in a browser and you're playing.

## Project layout

```
.
├── main.py                 # Flask server (serves index + static)
├── templates/index.html    # Single-page UI shell
├── static/
│   ├── game.js             # All game logic (rendering, input, state, audio)
│   ├── style.css           # Themes, layout, animations
│   ├── text.json           # All user-facing strings
│   ├── sprites/            # Reusable SVG icons (cell, mine, feat, particle)
│   └── sounds/             # SFX
└── replit.md               # Internal architecture notes
```

All reusable iconography lives in `static/sprites/` as standalone SVG files. They are fetched in parallel during the loading screen by the `Sprites` loader at the top of `game.js` and accessed by key (e.g. `Sprites.flag`, `Sprites.mine_mine`). Icons that should pick up the parent's text color use `currentColor`.

## License

MIT — see [LICENSE](LICENSE).
