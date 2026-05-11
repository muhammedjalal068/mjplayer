# Mj Player Pro — Design Brief

## Tone & Direction
Luxurious restraint. Premium dark tech + glassmorphism. Brutalist depth with refined blue accents. Exclusive, responsive, slightly futuristic without gimmickry. High-end media UI where every element is intentional.

## Visual Hierarchy & Focal Points
Center play button (large, glowing blue). Top header with logo, navigation, file controls. Bottom control overlay (glassmorphic, gradient fade). Progress bar (blue fill, custom thumb) as primary interaction. Sidebar library (when expanded) as secondary.

## Color Palette (OKLCH)
| Role | L C H | Purpose |
| --- | --- | --- |
| Background | 0.08 0 0 | Deep pure black |
| Foreground | 0.95 0 0 | Near-white text |
| Primary (Blue) | 0.54 0.21 262 | #3b82f6 equivalent |
| Accent (Cyan) | 0.63 0.25 200 | #00E1FF equivalent |
| Muted | 0.20 0.01 0 | Subtle grays |
| Card | 0.12 0.02 260 | Blue-tint panels |
| Border | 0.22 0.02 260 | Subtle lines |
| Destructive | 0.62 0.25 25 | Red accent |

## Typography
| Element | Font | Size | Weight |
| --- | --- | --- | --- |
| Display | GeneralSans | 24-28px | 700 |
| Body | GeneralSans | 14-16px | 400-500 |
| Mono | JetBrainsMono | 12-14px | 400 |
| Labels | GeneralSans | 11-12px | 600 |

## Shape Language
| Element | Radius |
| --- | --- |
| Cards | 12px |
| Buttons | 8px |
| Thumbs | 50% |
| Modals | 16px |

## Structural Zones
| Zone | Treatment |
| --- | --- |
| Header | Glass panel + blue border |
| Content | Deep black background |
| Controls | Gradient glass overlay |
| Sidebar | Intense glass blur |
| Modals | Black/60% glass |

## Component Patterns
- Primary: Blue button + glow, white text
- Secondary: White/10 glass, hover white/20
- Progress: 4px blue fill, custom thumb
- Volume: Inline, hidden until hover
- Menus: Hover bg-white/10

## Spacing
- Padding: 16px headers, 24px content, 8px buttons
- Gaps: 8-16px controls
- Density: Packed footer

## Motion
| Animation | Duration | Easing |
| --- | --- | --- |
| fade-in | 300ms | ease-out |
| slide-up | 300ms | ease-out |
| Auto-hide | 2.5s | smooth |
| Hover glow | 200ms | ease |

## Glassmorphism
- Panels: rgba(0,0,0,0.4) + blur-xl
- Intense: rgba(0,0,0,0.6) + blur-2xl
- Overlay: Gradient black to transparent

## Signature Detail
MJ Logo: SVG gradient wave (#00E1FF to #0055FF) + white play triangle with drop-shadow glow.

## Customizations
- Scrollbar: 6px, rgba(255,255,255,0.15)
- Fonts: Inter (CDN), GeneralSans (WOFF2)
- Icons: Font Awesome 6.4.0
- Shadows: subtle, elevated, glow

## Constraints
All colors via OKLCH. Strategic gradients only. Max blur-2xl. 3-4 animations per lifecycle. AA+ contrast.
