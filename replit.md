# Minesweeper Game

A clean, minimal Minesweeper game with a modern UI.

## Overview

This is a web-based Minesweeper game built with Flask (Python backend) and vanilla HTML/CSS/JavaScript frontend. The design features a clean, minimal aesthetic with support for both light and dark modes.

## Features

- Customizable grid size with width/height sliders
- Proportional mine count (15% of total cells)
- Toggle between DIG and FLAG modes
- Long-press to perform opposite action (dig in flag mode, flag in dig mode)
- Timer tracking
- Remaining mines counter
- Win/lose detection with modal popup
- Dark mode support
- Button-based zoom controls (+/- buttons only, no pinch-to-zoom)
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
- Soft scroll bounds with elastic overscroll (can't scroll board off-screen)
- Staggered reveal animations for cells

## Project Structure

```
├── main.py              # Flask server
├── templates/
│   └── index.html       # Game HTML template
├── static/
│   ├── style.css        # Game styling with CSS variables for theming
│   └── game.js          # Game logic with zoom and settings
```

## Running the Game

The game runs on port 5000 using Flask:
```bash
python main.py
```

## How to Play

1. Adjust WIDTH and HEIGHT sliders to set grid size
2. MINES count updates automatically (proportional to grid size)
3. Toggle Dark Mode if desired
4. Click PLAY to start
5. Use DIG mode to reveal cells, FLG mode to place flags
6. Long-press for opposite action
7. Use zoom controls or pinch to zoom in/out
8. Reveal all non-mine cells to win

## Recent Changes

- April 15, 2026: Added continue feature (save/restore board state via localStorage), points + level system, settings popup, flag removal in dig mode, screen transition animation, removed win condition (no winning, only losing)
- January 29, 2026: Added sliders for grid size, dark mode, zoom controls, custom flag/mine icons
- January 28, 2026: Added menu with difficulty selection, long-press functionality
- January 28, 2026: Initial creation with clean minimal UI matching reference design
