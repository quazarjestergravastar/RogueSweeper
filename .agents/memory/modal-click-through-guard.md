---
name: Modal click-through guard
description: Global capture-phase listener that blocks any stray pointer/click event landing outside every currently open .modal-overlay.show, to stop taps leaking to the menu/board behind popups.
---

RogueSweeper popups occasionally let a tap "leak through" to whatever is visually behind them (menu buttons, board cells) — a classic ghost-click/mis-timed-DOM-mutation class of bug that's hard to pin to one exact call site.

Fix: a single delegated guard, not per-modal code. In `bindMenuEvents()`, `_bindModalClickGuard()` attaches `pointerdown`/`mousedown`/`touchstart`/`click` listeners on `document` in the **capture** phase. On each event, it checks all `.modal-overlay.show` elements; if the event target isn't inside any of them, it calls `preventDefault` + `stopPropagation`/`stopImmediatePropagation`, so the event never reaches listeners on elements behind the popup.

**Why:** Capture-phase + `document` means it always runs first regardless of where the leaked event would otherwise land, and it's a defense-in-depth guard (matches the intent already encoded in `.modal-overlay.show { pointer-events: all }`) rather than a fix tied to one specific race condition — safe even without being able to reproduce the exact repro steps.
**How to apply:** Any time you add a new modal/popup, no extra wiring is needed as long as it uses the shared `.modal-overlay` + `.show` class convention — the guard covers it automatically. If a future "peek behind the modal" feature (e.g. `bindHoldToHide`) is wired up, this guard would need an explicit bypass while that feature is mid-gesture.
