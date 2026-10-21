# FBS — Premium Fluid UI test branch

Scope: Homepage cinematic hero, its auction card, and the adjacent ending-soon carousel.
Branch: experiment/fluid-ui-hero-codex. DO NOT merge without explicit review.
Based on user-supplied premium-fluid-ui v1.0.0.

## Engineering changes
- Hero now uses intrinsic auto-fit/minmax grid instead of forcing two columns at 1024 CSS pixels.
- Fluid heading typography, button wrapping, narrow-screen card/header reflow.
- Small viewport minimum for mobile; dynamic viewport minimum on desktop.
- Ending-soon section has bounded fluid gutters, spacing, typography, card widths and responsive controls.
- Brand palette, content, URLs, state, behavior, and background video were intentionally preserved.

## QA / publication status
Static code review only. No build, typecheck, real browser zoom or screenshot testing was performed in this GitHub-only session. No development server was started. Publishing depends on the project's Vercel GitHub preview integration.

## Before/after QA acceptance
Use the same content, viewport, zoom and scroll position on production main and branch Preview.
Check desktop CSS widths 1280, 1440, 1600, 1920 at 100%, 125%, 150%, 200% browser zoom; tablets 600, 768, 820, 1024; mobile 320, 360, 390, 430, 480.
Check no accidental page horizontal overflow, clipped text, squeezed controls, hidden prices, RTL issues, carousel swipe/arrows/pause, keyboard focus, and text enlargement.
Run npm run typecheck, npm run lint, npm run build, and Playwright visual QA in an authorized environment before approving.
