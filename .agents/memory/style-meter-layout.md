---
name: Style meter layout fix
description: How to prevent the style meter from shifting when trigger text of varying widths appears
---

## Rule
`.style-meter` must have an explicit fixed `width: 64px`. `.style-trigger-stack` must be `position: absolute; top: calc(100% + 4px); left: 50%; transform: translateX(-50%)` to float below the meter without affecting its flex dimensions.

**Why:** `.style-meter` is `position:absolute` but uses flex layout. Without a fixed width, when a `.style-trigger-stack` child gets wide text (e.g., "Mine armed (dormant)"), the flex container expands to fit → all flex children re-center within the wider box → the rank-wrap appears to shift rightward even though the container's `left:14px` pin stays fixed.

**How to apply:** Any time trigger text is added/removed as a child of `.style-meter`, ensure the parent has a fixed width or the text container is absolutely positioned outside the flex flow.
