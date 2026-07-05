---
name: RogueSweeper testing gotcha
description: How to interpret the loading screen when testing via screenshots
---

The `screenshot` tool (app_preview) triggers a fresh navigation/page load every time it's called. RogueSweeper's loading screen takes ~2.2-3s by design (preloads sprites/themes). If you take two screenshots in a row and both show the loading screen at a similar low percentage, that is NOT the app being stuck — it's two independent fresh loads, each captured early.

**Why:** Wasted a debugging cycle assuming a stuck loading screen when the workflow logs showed all assets returning 200 and no console errors — the real cause was that each screenshot reloaded the page from scratch.

**How to apply:** When verifying RogueSweeper loads correctly, check workflow/browser console logs for actual errors first. If logs are clean, trust that the loading screen completes normally rather than repeatedly screenshotting the same early loading state.
