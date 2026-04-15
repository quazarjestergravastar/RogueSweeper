# Minesweeper Game

A clean, minimal Minesweeper game with a modern UI.

## Overview

This is a web-based Minesweeper game built with Flask (Python backend) and vanilla HTML/CSS/JS frontend. The design features a clean, minimal aesthetic with support for both light and dark modes.

## Features

- Difficulty selection grid (2×3) replacing width/height sliders
  - Easy (unlocked, green triangle, 10×12, 15 mines)
  - Normal (unlocked, blue square, 12×20, 30 mines)
  - Hard (locked, orange diamond, 16×28, 55 mines — costs 800 points to unlock)
  - 3 "Coming Soon" locked placeholder slots
- Each difficulty shows a popup before starting; Hard shows unlock prompt if locked
- Proportional mine count per difficulty preset
- Toggle between DIG and FLAG modes
- Long-press to perform opposite action (dig in flag mode, flag in dig mode)
- Timer tracking (preserved correctly on continue)
- Remaining mines counter
- Lose detection with modal popup (no win condition)
- Dark mode support (via Settings gear icon)
- Button-based zoom controls (+/- buttons, no pinch-to-zoom)
- Custom icons: green triangle for flags, red circle for mines
- Responsive design for mobile devices
- Settings persistence via localStorage

## UI/UX Design

- "Juicy, bouncy, alive" interface with spring animations and micro-interactions
- Floating background shapes (circles, blobs, shards) that drift and fade
- All buttons have scale-down + bounce-back feedback on tap
- Ripple effects on button interactions
- Touch-safe input: scroll vs tap detection with movement threshold
- Single-finger drag scrolling with inertia
- Scroll bounds: asymmetric clamp (top-left origin), board fills down/right
  - overflowX/Y = max(0, boardSize * zoom - containerSize)
  - scrollX ∈ [-(overflowX + pad), pad], scrollY ∈ [-(overflowY + pad), pad]
- Staggered reveal animations for cells
- Game screen fills full viewport; zoom-container flex-grows to fill remaining space

## Technical Notes

- Board uses `transform-origin: top left` for correct zoom+scroll math
- Cell size fixed at 28px × 28px (min-width ensures grid columns render)
- Timer: `startTimer()` always clears existing interval first (no double-counting)
- Continue flow: `loadSavedGame()` restores `this.timer`, then `startTimer()` continues from saved value
- Points = correctFlags × 10 (flags on real mines at game-over)
- Level up cost = 10 × 2^level (10, 20, 40, 80...)
- Hard unlock stored in localStorage as `ms_hard_unlocked`
- Game-over modal has hide (−) button; restores via floating ⚑ button
- On loss: correctly flagged mines stay green, wrong flags turn red

## Project Structure

```
├── main.py              # Flask server
├── templates/
│   └── index.html       # Game HTML template
├── static/
│   ├── style.css        # Game styling with CSS variables for theming
│   └── game.js          # Game logic with zoom, difficulty grid, and settings
```

## Running the Game

The game runs on port 5000 using Flask:
```bash
python main.py
```

## How to Play

1. Click a difficulty box (Easy / Normal / Hard) to see its details
2. Confirm to start the game
3. Use DIG mode to reveal cells, FLG mode to place flags
4. Long-press for opposite action
5. Use +/- zoom buttons to zoom in/out
6. Drag to scroll the board — all edges are reachable
7. Hit a mine and the game ends; correct flags earn points

## Recent Changes

- April 15, 2026: Replaced sliders with 6-box difficulty grid, fixed board scrolling (asymmetric bounds, transform-origin:top left), fixed timer preservation on continue, added Hard unlock system, kept mines counter and level/XP bar
- April 15, 2026: Added continue feature (save/restore board state via localStorage), points + level system, settings popup, flag removal in dig mode, screen transition animation
- January 29, 2026: Added sliders for grid size, dark mode, zoom controls, custom flag/mine icons
- January 28, 2026: Added menu with difficulty selection, long-press functionality
- January 28, 2026: Initial creation with clean minimal UI matching reference design
