# RogueSweeper

A web-based "MineSweeper Gone Rogue" game with Flask backend and vanilla HTML/CSS/JS frontend. Features a roguelike progression system across 8 sequential boards per run.

## Overview

Flask (Python) serves a single-page app. All game logic runs in the browser via `static/game.js`. State is persisted in `localStorage`.

## Features

### Menu
- Title "RogueSweeper" with subtitle "MineSweeper Gone Rogue"
- Settings button (gear icon, top-right) opens dark-mode toggle modal
- Level / XP bar with LEVEL UP button (cost = 10 × 2^level)
- 2×3 Difficulty grid:
  - Easy (green triangle, always unlocked)
  - Normal (blue square, always unlocked)
  - Hard (orange diamond, locked — costs 800pts to unlock; unlock popup)
  - 3 Coming Soon slots (greyed out, popup on click)
- Board carousel (8 cards, 3 visible, center card larger):
  - Swipe left/right or tap dots to navigate
  - Board 1 always unlocked; subsequent boards unlock through run progression
  - Locked boards show "LOCKED" text and dimmed appearance
  - Completed boards show green border
  - Card colors/band match selected difficulty
- W / H / MINES counters (reflect carousel-selected board's config)
- Play row (mutually exclusive states):
  - No run active: "START" button (greyed when locked board selected)
  - Run paused: "CONTINUE" (green) + "ABORT" (red) buttons
- Extra and Feats buttons (side by side, both show "Coming Soon" popup)

### Roguelike Run System
- Each run = 8 boards, played sequentially
- Difficulty selection determines all 8 boards' dimensions and mine counts (via BOARD_CONFIGS)
- Completing a board → "Board Complete!" popup → Continue to next or Return to Menu
- Completing board 8 → "Run Complete!" popup, progression resets
- Hitting a mine → "Run Over" popup, run state cleared
- Returning to menu mid-run pauses the run (boardState saved); Continue/Abort shown on return
- Abort clears run state and resets to board 1

### BOARD_CONFIGS (progressive scaling per difficulty)
- Easy: 8 boards scaling from 8×10/10mines to 12×14/30mines
- Normal: 8 boards scaling from 12×14/26mines to 16×22/65mines
- Hard: 8 boards scaling from 16×18/50mines to 22×28/115mines

### Game Screen
- Header: MINES remaining | BOARD N/8 | TIME elapsed
- DIG / FLG mode toggle
- Scrollable board (drag, with inertia; transform-origin: top left)
- Asymmetric scroll clamp: scrollX/Y ∈ [-(overflow+pad), pad]
- Zoom in/out buttons (50%–250%, 25% steps)
- MENU button pauses run and returns to main menu

### Gameplay
- First click never reveals a mine (safe zone 3×3 around click)
- Cascade reveal on zero cells
- Long-press (400ms) performs opposite mode action
- Right-click toggles flag
- Correct flags earn 10pts each on run over

### UI/UX
- Floating background shapes (circles, blobs, shards)
- Spring animations on buttons (scale-down on press)
- Screen transition animation (slide down/up)
- Dark mode via CSS variables + `body.dark-mode`
- Carousel dots indicate active/unlocked/completed boards

## Technical Notes

- Board uses `transform-origin: top left` for correct scroll math
- Cell size fixed at 28×28px
- Timer: `startTimer()` clears existing interval before starting (no double-counting)
- Run state stored in `localStorage` as `ms_run_state` JSON
- Other keys: `ms_points`, `ms_level`, `ms_hard_unlocked`, `darkMode`
- Win detection: `checkWin()` checks all non-mine cells are revealed
- Game over (mine hit): reveals mines with staggered 35ms delay, wrong flags with 25ms delay

## Project Structure

```
├── main.py              # Flask server (port 5000)
├── templates/
│   └── index.html       # Game HTML
├── static/
│   ├── style.css        # CSS with variables for light/dark theme
│   └── game.js          # All game logic (FloatingBackground + Minesweeper classes)
```

## Running

```bash
python main.py
```

## Recent Changes

- April 16, 2026: Redesigned as "RogueSweeper" with roguelike 8-board run system, board carousel, Continue/Abort flow, Extra/Feats buttons replacing Shop, win detection, Board Finished modal, Run Over modal
- April 15, 2026: Replaced sliders with difficulty grid, asymmetric scroll bounds, Hard unlock, timer fix on continue
- April 15, 2026: Added continue feature, points + level system, settings popup, screen transition
