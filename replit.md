# RogueSweeper

A web-based "MineSweeper Gone Rogue" game with Flask backend and vanilla HTML/CSS/JS frontend. Features a roguelike progression system across 8 sequential boards per run.

## Overview

Flask (Python) serves a single-page app. All game logic runs in the browser via `static/game.js`. State is persisted in `localStorage`.

## Features

### Menu
- Title "RogueSweeper" with subtitle "MineSweeper Gone Rogue"
- Settings button (gear icon, top-right) opens settings modal with dark-mode, style meter position, SFX volume, save files, and fun code
- Level / XP bar with LEVEL UP button (cost = 100 + level*30 + level²*3, smooth scaling from 100)
- 2×3 Difficulty grid:
  - Easy (green triangle, always unlocked)
  - Normal (blue square, always unlocked)
  - Hard (orange diamond, locked — costs 800pts to unlock; unlock popup)
  - 3 Coming Soon slots (greyed out, popup on click)
- Board carousel (8 cards, 3 visible, center card larger):
  - Swipe left/right or tap dots to navigate
  - Smooth slide-in animation on navigation
  - Board 1 always unlocked; subsequent boards unlock through run progression
  - Locked boards show "LOCKED" text and dimmed appearance
  - Completed boards show visible rounded-square rank badges; most recently completed board is colored by its achieved rank
  - Card colors/band match selected difficulty
- W / H / MINES counters (reflect carousel-selected board's config)
- Play row (mutually exclusive states):
  - No run active: "START" button (greyed when locked board selected)
  - Active/paused run: "CONTINUE" (green) + "ABORT" (red) buttons; difficulty switching and replaying completed boards are blocked until the run ends
- Store and Feats buttons (side by side)

### Roguelike Run System
- Each run = 8 boards, played sequentially
- Difficulty selection determines all 8 boards' dimensions and mine counts (via BOARD_CONFIGS)
- Completing a board → "Board Complete!" popup → Continue to next or Return to Menu
- Completing board 8 → "Run Complete!" popup, progression resets
- Hitting a mine → "Run Over" popup, run state cleared
- Returning to menu mid-run pauses the run (boardState saved); Continue/Abort shown on return
- Abort clears run state and resets to board 1
- Active runs are forward-only: completed boards cannot be replayed in the same run, and the selected difficulty remains locked until win/loss/abort

### BOARD_CONFIGS (progressive scaling per difficulty)
- Easy: 8 boards scaling from 8×10/10mines to 12×14/30mines
- Normal: 8 boards scaling from 12×14/26mines to 16×22/65mines
- Hard: 8 boards scaling from 16×18/50mines to 22×28/115mines

### Game Screen
- Header: MINES remaining | BOARD N/8 | TIME elapsed
- DIG / FLG mode toggle: positioned at bottom center of screen above controls, large thumb-friendly buttons (72×48px)
- Style meter: compact soft-card meter beneath the mines counter by default; settings can move it to the right side
- Scrollable board (drag, with inertia; transform-origin: top left)
- Asymmetric scroll clamp: scrollX/Y ∈ [-(overflow+pad), pad]
- Zoom in/out buttons (50%–250%, 25% steps)
- Numbers on board scale dynamically with zoom level for readability
- MENU button pauses run and returns to main menu

### Gameplay
- First click never reveals a mine (safe zone 3×3 around click)
- Cascade reveal on zero cells
- Long-press (400ms) performs opposite mode action
- Right-click toggles flag
- Correct flags earn 10pts each on run over
- Board completion requires all non-mine tiles revealed and all required mine flags placed correctly
- Placing the full mine count with any incorrect flag immediately loses the run

### Store
- Themes tab with horizontally scrollable tab bar
- Theme cards show swatches; selection indicated by colored border + glow
- Long-press card to preview theme
- Dark mode: swatches use appropriate dark tones; very dark swatches auto-lightened; accent color unaffected by dark mode CSS
- Color swatches have mode-aware outlines (white-ish in dark, dark-ish in light)
- Particles tinted with active theme accent color

### Feats (Feeds)
- 4 tabs: Boards, Score, Level, Collection (horizontally scrollable)
- Collection tab contains: "Color Collector" (purchase all themes)
- All icons replaced with clean geometric SVGs (no emoji)
- Lock icon shown for incomplete feats

### Settings
- Dark Mode toggle
- SFX Volume slider (0–100%, persisted to localStorage)
- Save Files button
- Redeem Code: inline input + Apply button in single row (no toggle)
  - "123ABC" = true infinite coins (no point cap)
  - "edgelord" unlocks the secret "it's just a phase" feat and free Black Theme

### Save System (3 slots)
- Save slots show level bar (mini XP bar) instead of numeric level
- Switching saves correctly transfers infiniteCoins flag
- ∞ display only shows when cheat is active for that save

### Themes
- green, red, blue, yellow, purple, plus secret black
- Themes affect: accent color, UI highlights, progress bars, particles
- Dark mode uses JS-applied accent (no hardcoded green override in CSS)

### Particles (FloatingBackground)
- 8 shape types: circle, blob, shard, ring, roundsq, cross, tri, dot
- Colors tinted by active theme accent with low opacity
- Subtle, varied, non-repetitive background

## Technical Notes

- Board uses `transform-origin: top left` for correct scroll math
- Cell size fixed at 28×28px; font-size scales via `--cell-font-size` CSS var
- Timer: `startTimer()` clears existing interval before starting (no double-counting)
- Run state stored in `localStorage` as `ms_run_state` JSON
- Other keys: `ms_points`, `ms_level`, `ms_hard_unlocked`, `darkMode`, `ms_infinite_coins`, `ms_sfx_volume`, `ms_style_meter_right`, `ms_save_slot`, `ms_save_0/1/2`
- Win detection: `checkWin()` delegates to `isBoardSolved()` requiring safe tiles revealed plus correct full flagging
- Editable UI copy is stored in `static/text.json` and reloaded in-game with no-cache polling
- Game over (mine hit): reveals mines with staggered 35ms delay, wrong flags with 25ms delay

## Project Structure

```
├── main.py              # Flask server (port 5000)
├── templates/
│   └── index.html       # Game HTML
├── static/
│   ├── style.css        # CSS with variables for light/dark theme
│   ├── text.json        # Live-editable UI text strings
│   └── game.js          # All game logic (FloatingBackground + Minesweeper classes)
```

## Running

```bash
python main.py
```

## Recent Changes

- April 20, 2026: Major game update:
  - **RPTS/PTS split**: Run Points (RPTS) are now strictly separate from main Points (PTS). Flag bonuses on mid-run boards go to RPTS; only flush on win/loss/abort
  - **Loading screen**: Replaced spinning circle with rotating square card that cycles through mine icons + horizontal progress bar (ease-in fill)
  - **Mine Market redesign**: Full-row layout (no gradients). Scratch card and Slot Machine now have separate BUY and USE buttons (purchase-gated flow). New MENU button pauses run (pausedInMarket state) and CONTINUE button at footer
  - **Abort confirmation**: Clicking ABORT now shows a confirmation modal ("All RPTS will be lost") before actually aborting
  - **Slot machine redesign**: Removed drag lever. New SPIN button starts all reels; STOP button stops reels left-to-right one at a time. Each reel starts at staggered offset to show different mines. Faster spin speed (28ms interval). Stop indicators appear per reel
  - **Feat rename**: "ultrakill" feat renamed to "Progression is Dead" (desc: "Points are fuel / Boards are full")
  - **Removed**: "There Is No Game" (ting) easter egg, ting modal, _triggerTING, _trackSaveSwitch
  - **Store tabs**: Changed from Common/??? to Common/Uncommon (empty Uncommon tab)
  - **Carousel indicators**: #mm-car-ind-l and #mm-car-ind-r highlight when paused in Mine Market
  - **SFX overhaul**: All sounds remade with richer layered tones and improved dynamics
  - **continueRun**: Now handles pausedInMarket flag — reopens Mine Market directly

- April 18, 2026: Refined gameplay UI/state:
  - Board completion now requires placing all mine flags; correct full flagging clears the board, incorrect full flagging loses the run
  - Style meter made smaller and aligned with the dig/flag control row
  - Style meter progression rebalanced so higher ranks are harder to maintain and S/Z are much harder to reach
  - Board carousel now resets to Board 1 after a loss or after clearing all 8 boards
  - Style meter now constantly decays while active with rank-based speeds and no grace period; higher ranks drain faster
  - Removed outer glow/flame effects from the style meter
  - Board win popup now includes a large square overall-rank badge using the same D→Z rank scale
  - Style meter redesigned as compact rounded box with rank/score and smooth rounded progress outline
  - Style meter decay now runs continuously after rank-specific grace periods to prevent idle exploitation
  - Feats notifications clear from the menu/tab indicators when viewed; unlocked feats now show individual per-item markers
  - Feats tab renamed to Secrets, with horizontal-scroll hint and a Boards divider between streak and board-clear achievements
  - Secret achievement state and notification markers are now saved per save slot
  - Save files can be deleted from the save menu with confirmation
  - Not Enough Points feedback is layered above store/purchase modals
  - Board cards use non-clipping inset styling and run-end carousel position is preserved
  - Flag icon changed to a rounded triangle
- April 18, 2026: Major UI/UX pass:
  - Store OK/action buttons changed to square border-radius (8px)
  - Board carousel smooth slide animation (slideInLeft/Right keyframes)
  - Tab bars horizontally scrollable with constrained overflow
  - Feats: added "Collection" tab, moved "Color Collector" (was "Collector") there
  - Redeem code: inline input+apply button instead of toggle+hidden field
  - Save slot switching: correctly persists infiniteCoins; no phantom ∞ display
  - 123ABC redeem code: true infinite coins (no 999999 cap)
  - Level cost formula: smooth scaling from 100 (100 + 30L + 3L²)
  - Save slot UI: shows compact level bar instead of numeric level
  - Feat icons: all emoji replaced with geometric SVG icons
  - Flag cells: more rounded pennant-style SVG flag icon
  - Dark mode: removed hardcoded accent green; all accents use active theme
  - Theme store: dark-mode-aware swatches, proper outline borders, lightened dark previews, active selection border+glow
  - Particles: 8 shape varieties, tinted with active theme accent color
  - Dig/Flag toggle: moved to bottom center of game screen, larger (72×48px)
  - Settings: added SFX volume slider (0-100%, persisted)
  - Number scaling: board numbers scale with zoom via --cell-font-size CSS variable
- April 16, 2026: Redesigned as "RogueSweeper" with roguelike 8-board run system, board carousel, Continue/Abort flow, Extra/Feats buttons replacing Shop, win detection, Board Finished modal, Run Over modal
- April 15, 2026: Replaced sliders with difficulty grid, asymmetric scroll bounds, Hard unlock, timer fix on continue
- April 15, 2026: Added continue feature, points + level system, settings popup, screen transition
