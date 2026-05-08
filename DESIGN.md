# Santino B2B — Stitch Design System (v1.0)

This document defines the core design language for the Santino B2B Web Order platform. It is inspired by Google's Stitch principles: **Fluidity**, **Personalization**, and **High-End Aesthetics**.

## 1. Visual Foundation

### Color Palette (Premium Minimalist)
| Token | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--primary` | `#18181b` (Charcoal) | `#fafafa` (Snow) | Core text, primary buttons, headers |
| `--accent` | `#FBBF24` (Gold) | `#FBBF24` (Gold) | Active states, branding, focus highlights |
| `--tertiary` | `#1A1A1D` (Dark Grey) | `#27272a` (Zinc 800) | Secondary surfaces, borders, dividers |
| `--neutral` | `#F3F4F6` (Cool Grey) | `#18181b` (Zinc 900) | Form backgrounds, empty states |
| `--bg` | `#f4f4f5` (Zinc) | `#09090b` (Deep Black) | Main application background |
| `--surface` | `#ffffff` (Pure White) | `#18181b` (Dark Zinc) | Cards, Modals, Sidebar, Tooltips |

### Typography
- **Primary Font**: `Plus Jakarta Sans`, sans-serif.
- **Scale**: Multiplier based (`--text-scale`) to ensure readability on mobile.
- **Headings**: Extra-bold (`800`) with tight letter-spacing (`-0.03em`).

### Shapes & Radii (The "Soft-Sharp" Balance)
- **Base Radius (`--radius`)**: `8px`. Used for Buttons, Inputs, Navigation items.
- **Large Radius (`--radius-lg`)**: `12px`. Used for Cards, Modals, Tables.
- **Input Border**: `1.5px` solid to provide professional weight.

---

## 2. Motion & Interaction (The "Woa" Factor)

### Transitions
- **Standard**: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Fluid Expansion**: `0.35s cubic-bezier(0.2, 0.8, 0.2, 1)`. (Used for Modals and Search dropdowns).

### Micro-Interactions
- **Hover**: Subtle `transform: translateY(-1px)` and background darkening/lightening using `color-mix`.
- **Focus**: `box-shadow` rings using `15%` opacity of the primary color.
- **Success Glow**: Inputs with data emit a soft `10px` glow using the success color.

---

## 3. Component Architecture

### Sidebar Navigation
- **Active State**: Soft background overlay (color-mix) + Icon scaling.
- **Hover**: Subtle slide-right (`translateX(4px)`) to provide feedback.

### Order Matrix
- **Header**: Sticky to top, ensuring sizes are always visible.
- **Actions**: Sticky to bottom of search results, allowing instant additions without scrolling.

### Mobile Navigation (Bottom Bar)
- **Concept**: A floating "Island" at the bottom of the screen.
- **Structure**: Pill-shaped background (`--surface`) with active indicators.
- **Interaction**: Haptic-like feedback on tap (subtle scale).

### Floating Action Buttons (FAB)
- **Style**: Circular buttons with high elevation (`--shadow-lg`).
- **Placement**: Bottom-right corner for quick actions (e.g., Save Order).

---

## 4. Maintenance Guidelines
- Always use CSS variables (`var(--token)`) instead of hardcoded hex values.
- Maintain `color-mix` for dynamic transparency to ensure theme-agnostic styling.
- Run `.\build.ps1` after every style change to sync the production bundle.
