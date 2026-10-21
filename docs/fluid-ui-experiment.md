# FBS — Fluid UI visual experiment

Branch: `experiment/fluid-ui-hero-codex`  
Scope: Homepage hero, live auction showcase card, and ending-soon carousel.  
Production/main: must remain unchanged. No merge without explicit user approval.

## Baseline
The first experimental commit focused on intrinsic grids and fluid sizes. It was a deliberately conservative CSS-only first pass.

## October 21, 2026 — second visual/UX pass
Guided by the provided `premium-fluid-ui v1.0.0` skill and our review of available-space-driven responsive design, this pass:
- Adds an explicit hero CSS query container. Only use two columns once the **hero itself** has at least 74rem; otherwise give the copy and auction card a comfortable full-width vertical composition. Avoid forcing columns at a viewport breakpoint.
- Removes the forced equal-height/stretched copy+auction-card layout, and uses intrinsic heights with consistent spacing to prevent giant empty gaps at intermediate widths.
- Increases headline leading and subtitle readability, with a stable contrast overlay over animated video. Preserves FBS navy/gold branding and media.
- Uses container-sized ending-soon carousel cards rather than only dynamic viewport units, so card widths respect the section's actual space.
- Makes hero auction auto-rotation slower; pauses on keyboard focus and disables automatic rotation for users requesting reduced motion. Preserves manual interactions.
- Simplifies minor duplicate visual ornaments/badges on compact screens.

## Quality gates: do not infer visual success from a green deployment
- GitHub/Vercel reported a successful deployment for commit `2e126a7ee9deb2887c2ce112599d7890e7467b93` on this branch, meaning publication succeeded.
- Runtime browser access and screenshot comparisons were **not available in this edit session**. This is **not** a verified visual pass.
- Required before acceptance: run `npm run typecheck`, `npm run lint`, `npm run build` and Playwright visual checks in an authorized environment.
- Compare `main` and experiment on identical viewport, zoom, scroll position, font loading, and stable auction data. Wait until hero staged entrance is fully revealed.
- Desktop viewports: 1280, 1440, 1600, 1920 at 100%, 125%, 150%, 200% browser zoom; tablets 600, 768, 820, 1024; phones 320, 360, 390, 430, 480 CSS px.
- Inspect real overflow and clipping, RTL, long prices/plate numbers, text zoom/reflow, focus states, carousel swipe, mouse/keyboard controls, reduced-motion mode, and browser portrait/landscape.
- WCAG 2.2 SC 1.4.10 reflow guidance: preserve legibility and functionality down to 320 CSS pixels (except specialized two-dimensional content).

## Safety
Do not touch `main`, the live custom domain, the other homepage sections, business state, API integrations, authentication, or application routes. Keep this experiment isolated for side-by-side review.