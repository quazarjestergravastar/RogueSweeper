---
  name: Hold-to-confirm UI pattern
  description: How RogueSweeper's press-and-hold confirmation on menu buttons is designed, and the pointer-capture trick that prevents a release from leaking onto newly-rendered UI.
  ---

  When adding a "hold to confirm" interaction gate on top of many existing click handlers (rather than rewriting each handler), implement it as a single delegated, capture-phase system rather than touching per-button code:

  - Attach pointerdown/pointerup/click listeners on `document` in the capture phase, and select target buttons via a CSS class + an exclusion list (e.g. exclude real-time/gameplay controls that must stay instant).
  - On pointerdown, call `el.setPointerCapture(pointerId)` on the pressed element immediately. This is the key fix for "quick tap opens a menu, and the same release event immediately fires a click on whatever rendered underneath" — captured pointer events keep targeting the original element even after the DOM changes mid-gesture, so the stray release can never bubble into new UI.
  - Block the browser's native 'click' for gated elements by default (capture-phase click listener calling preventDefault/stopImmediatePropagation), and only allow it through via a one-shot allow-flag set immediately before you dispatch a synthetic `el.click()` once the hold duration elapses.
  - Add a short (~250ms) global "swallow window" after firing a confirmed action, during which stray pointerdown/click events anywhere are suppressed — an extra safety net for browsers where pointer-capture compatibility events aren't fully redirected.

  **Why:** Retrofitting a hold gesture across dozens of existing onclick-based buttons without this pattern requires touching every handler and still leaves a race where a tap-release can register on a freshly-opened modal/menu.
  **How to apply:** Reuse this pattern any time a similar "require deliberate long-press" gate needs to be added over an existing click-driven UI without rewriting each button's logic.
  