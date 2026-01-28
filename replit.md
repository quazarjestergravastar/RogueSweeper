# Minesweeper Game

A clean, minimal Minesweeper game with a modern UI.

## Overview

This is a web-based Minesweeper game built with Flask (Python backend) and vanilla HTML/CSS/JavaScript frontend. The design features a clean, minimal white/gray aesthetic.

## Features

- 10x16 grid with 24 mines
- Toggle between DIG and FLAG modes
- Timer tracking
- Remaining mines counter
- Win/lose detection with modal popup
- Responsive design for mobile devices

## Project Structure

```
├── main.py              # Flask server
├── templates/
│   └── index.html       # Game HTML template
├── static/
│   ├── style.css        # Game styling
│   └── game.js          # Game logic
```

## Running the Game

The game runs on port 5000 using Flask:
```bash
python main.py
```

## How to Play

1. Click "DIG" mode to reveal cells
2. Click "FLG" mode to place/remove flags on suspected mines
3. Reveal all non-mine cells to win
4. Hitting a mine ends the game

## Recent Changes

- January 28, 2026: Initial creation with clean minimal UI matching reference design
