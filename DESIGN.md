# ABC EV PART — Design System & Visual Direction
**Version:** 1.0.0 • **Aesthetic:** Minimal High-Performance Electric • **Platform:** React + Vite + Tailwind CSS v4

---

## 1. Visual Brand Thesis: "Precision Electric Performance"

ABC EV PART serves automotive builders, EV fleet operators, and performance enthusiasts across Nepal. The visual direction replaces typical cluttered e-commerce with **industrial-luxury minimalism**:
- **Zero visual noise**: Elimination of cheap sales banners, blinking tickers, and nested drop shadows.
- **High-contrast technical clarity**: Deep charcoal black (`#090D14` / `#0F172A`) paired with electric signal orange (`#F97316`) against crisp, breathable white and cool-slate surfaces.
- **Engineering credibility**: Monospaced technical specifications, tabular pricing figures, verified VAT badges, and dark studio automotive photography.

---

## 2. Color Palette & Tokens

### Primary Brand: High-Voltage Electric Orange
Symbolizes high-voltage electrical energy, kinetic power, and automotive safety standard.
- `--color-brand-primary`: `#F97316` (Core orange for primary CTAs, active highlights, key glyphs)
- `--color-brand-hover`: `#EA580C` (Darker orange for interactive hover & focus)
- `--color-brand-active`: `#C2410C` (Pressed state / high-contrast accessible text on white)
- `--color-brand-soft`: `#FFF7ED` (5% orange tint for tag backgrounds & active pill states)
- `--color-brand-glow`: `rgba(249, 115, 22, 0.16)` (Subtle halo for focused controls and hero elements)

### Primary Neutral: Charcoal Black & Monochromes
Provides high-contrast structure, technical grounding, and sophisticated editorial elegance.
- `--color-charcoal-deep`: `#090D14` (Deep chassis black for dark sections, header accents, and footers)
- `--color-charcoal-ink`: `#0F172A` (Primary typography color; WCAG AAA compliant on white)
- `--color-charcoal-subtle`: `#334155` (Secondary typography, subheaders, active tab labels)
- `--color-charcoal-muted`: `#64748B` (Technical captions, helper text, empty state icons)
- `--color-charcoal-border`: `#E2E8F0` (Crisp 1px borders, dividers, unselected tab outlines)
- `--color-charcoal-border-hover`: `#94A3B8` (Interactive input & card hover border)
- `--color-surface-card`: `#FFFFFF` (Pristine white card canvas)
- `--color-surface-bg`: `#F8FAFC` (Cool slate-tinted canvas backdrop)

### Semantic & Compliance Status
- `--color-status-success`: `#10B981` (In-stock indicators, verified authentic warranty)
- `--color-status-vat`: `#3B82F6` (Official 13% Nepal Government IRD Tax Compliance)
- `--color-status-warning`: `#F59E0B` (Low inventory threshold, dispatch advisories)
- `--color-status-error`: `#EF4444` (Validation alerts, out of stock)

---

## 3. Typography Hierarchy

### Typefaces
- **Primary Display & Headings:** `Plus Jakarta Sans`, sans-serif (Geometric, confident, modern neo-grotesk with tight letter-spacing)
- **Primary Body & Interface:** `Inter`, sans-serif (Engineered for micro-screens, tall x-height, neutral tone)
- **Technical Specs & Telemetry:** `JetBrains Mono` / `ui-monospace`, monospace (Used for part numbers, voltage, torque, tabular currency)

### Type Scale
| Level | Font Size | Line Height | Weight | Tracking | Application |
|---|---|---|---|---|---|
| Display XL | `48px` (3rem) | `1.1` | 800 Bold | `-0.035em` | Desktop Hero Headline |
| Display LG | `36px` (2.25rem) | `1.15` | 800 Bold | `-0.03em` | Mobile Hero, Section Super-Headers |
| Heading 1 | `28px` (1.75rem) | `1.2` | 700 Bold | `-0.025em` | PDP Titles, Account Headers |
| Heading 2 | `22px` (1.375rem) | `1.3` | 700 Bold | `-0.02em` | Card Titles, Category Headers |
| Heading 3 | `18px` (1.125rem) | `1.4` | 600 SemiBold | `-0.015em` | Spec Group Titles, Modal Headers |
| Body Regular | `15px` (0.9375rem) | `1.6` | 400 Regular | `0` | Product Descriptions, Guides |
| Body Medium | `14px` (0.875rem) | `1.5` | 500 Medium | `0` | Form Inputs, Table Cells, Body Copy |
| Caption / UI | `12px` (0.75rem) | `1.4` | 600 SemiBold | `+0.01em` | Spec Chips, VAT Badges, Button Labels |
| Micro Mono | `11px` (0.6875rem) | `1.3` | 600 SemiBold | `+0.04em` | SKUs, Telemetry, IRD Serial Numbers |

---

## 4. Spacing, Layout Grid & Elevation

- **Baseline Unit:** `4px` / `8px`
- **Spacing Scale:**
  - `space-1`: 4px (micro gaps between badge dot and text)
  - `space-2`: 8px (compact chip padding, icon-text gap)
  - `space-3`: 12px (form control horizontal padding)
  - `space-4`: 16px (card inner padding on mobile, standard grid gap)
  - `space-6`: 24px (desktop card padding, module separation)
  - `space-8`: 32px (section sub-group separation)
  - `space-12`: 48px (section vertical padding on mobile)
  - `space-16`: 64px (section vertical padding on desktop)
  - `space-24`: 96px (major hero / transition section padding)
- **Container Max-Width:** `1320px` with responsive gutters (`16px` on mobile, `24px` on tablet, `32px` on desktop).
- **Elevation Philosophy:** Border-first architecture. Instead of heavy blurry shadows, use crisp `1px solid var(--color-charcoal-border)` with soft ambient contact shadow:
  - Base Card: `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);`
  - Floating / Hover: `box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.08);`

---

## 5. Buttons & Interactive Controls

1. **Primary Button (Electric Orange):**
   - Background: `#F97316` | Text: `#FFFFFF` (SemiBold 14px)
   - Height: `48px` (desktop), `44px` (compact) | Radius: `12px`
   - Hover: Background `#EA580C`, subtle transform `translateY(-1px)`
   - Focus: Outline `2px solid #F97316`, offset `2px`, halo `rgba(249, 115, 22, 0.2)`
2. **Secondary Button (Charcoal Industrial):**
   - Background: `#0F172A` | Text: `#FFFFFF`
   - Used for administrative triggers, checkout progressions, dark accents.
3. **Outline / Neutral Button:**
   - Background: `#FFFFFF` | Border: `1.5px solid #CBD5E1` | Text: `#1E293B`
   - Hover: Background `#F8FAFC`, Border `#94A3B8`
4. **Ghost / Action Link:**
   - Transparent background, Charcoal text, underline micro-animation on hover, paired with animated directional arrow (`ArrowRight`).

---

## 6. Cards & Structural Elements

- **Product Card Architecture:**
  - Aspect ratio: 4:3 image container with `#F8FAFC` slate backdrop.
  - Image: Clean industrial product cutout with soft dynamic reflection.
  - Floating Status: Pill at top-left (`In Stock` / `800V Architecture`).
  - Spec Matrix: 2-column micro-grid displaying 2 core technical metrics (e.g. `Power: 720 kW`, `Torque: 1,150 Nm`).
  - Pricing & VAT: Bold display price in NPR with small gray label: `13% Nepal VAT Included`.
  - Action: Full-width primary orange CTA button or quick-view trigger.
- **Trust / Logistics Card:**
  - Flat white canvas, `1.5px` border in `#E2E8F0`, rounded-2xl (`16px`).
  - Electric orange circular icon container (`44px` diameter with `#FFF7ED` fill).
  - Step counter watermark (`01`, `02`, `03`, `04`) in subtle `#CBD5E1`.

---

## 7. Navigation Architecture

### Desktop Navigation
- **Height:** 72px pinned sticky header with subtle backdrop blur (`bg-white/95 backdrop-blur-md`).
- **Brand Mark:** Minimalist lightning bolt icon inside orange square + `ABC EV PART` in charcoal bold and orange uppercase.
- **Search System:** Centered search pill (`max-w-md`) with search icon, placeholder `"Search powertrains, battery cells, or inverters..."`, and keyboard shortcut chip (`⌘K`).
- **Direct Actions:**
  - Wishlist / Garage icon button with badge counter.
  - Cart button with item counter chip and preview flyout.
  - Account pill (with user avatar or role indicator: Customer / Store Owner).
- **Sub-Header Category Bar:** Clean horizontal scrollable list of core systems with subtle indicator line for the active category.

### Mobile Navigation
- **Top Header (56px):** Brand logo on left, quick search icon trigger, and cart drawer trigger with counter badge.
- **Bottom Navigation Bar (64px):** Fixed ergonomic thumb-zone bar with 5 primary touchpoints:
  1. Home (`Home` icon)
  2. Catalog (`Grid` icon)
  3. Garage / Wishlist (`Zap` or `Heart` icon)
  4. Cart (`ShoppingBag` icon with dynamic counter)
  5. Account (`User` icon)

---

## 8. Image & Photography Art Direction

- **Subject Matter:** Isolated high-voltage powertrain assemblies, axial flux stators, silicon carbide inverter heatsinks, liquid cooling jackets, and high-discharge pouch cells.
- **Lighting:** Dark technical automotive studio style with directional rim lighting (cool white or subtle 5500K daylight) highlighting machined aluminum, copper stator coils, and carbon fiber textures.
- **Backgrounds:** Clean neutral studio tones (`#0F172A` deep charcoal or `#F8FAFC` soft slate), avoiding distracting cluttered outdoor backgrounds.
- **Ratios:**
  - Hero Dynamic Showcase: `16:9`
  - Catalog Grid Cards: `4:3`
  - Component Quick-View & Thumbnails: `1:1` square

---

## 9. Homepage Layout Blueprint

### Desktop Layout
1. **Header (72px):** Sticky, clean white with subtle border bottom.
2. **Hero Section (Asymmetrical Split):**
   - **Left (55%):**
     - Eyebrow badge: `● NEPAL'S AUTHORIZED HIGH-PERFORMANCE EV HUB` in orange pill.
     - Headline: **Nepal's Premier EV Store. Delivered Nationwide.**
     - Body: Concise, 2-line technical proposition emphasizing transparent 13% IRD VAT and doorstep courier across all 7 provinces.
     - Action Row: Primary `Explore Catalog →` button (orange) + Secondary `Browse Powertrains` outline button.
   - **Right (45%):**
     - Hero Dyno Card: High-resolution showcase of the `Apex-900 Dual Axial Flux Motor` on a test stand. Floating glass-morphism spec badges (`720 kW / 1,150 Nm`, `800V Architecture`, `Liquid-Glycol Cooled`).
3. **Component Architecture Strip:** Horizontal category carousel featuring the 6 primary hardware divisions.
4. **Flagship Performance Showcase Grid:** 4-column product grid featuring top-selling powertrain, battery, and inverter units.
5. **How Buying Works in Nepal (The 4-Step Trust Protocol):**
   - 01: Select & Configure Specification
   - 02: Insured Nepal Doorstep Delivery
   - 03: Easy Domestic Payment (Fonepay QR, eSewa, COD)
   - 04: 100% Genuine with 13% IRD VAT Tax Receipt
6. **Footer:** Dark charcoal footer (`#090D14`) with company credentials, Kathmandu headquarters address, support hotline, and VAT registration certificate number.

### Mobile Layout
1. **Header (56px):** Logo, search trigger, cart badge.
2. **Hero Section (Vertical Stack):**
   - Punchy headline (`32px`), 1-line sub-copy, full-width primary CTA.
   - Compact hero hardware card with swipeable telemetry specs.
3. **Category Pills:** Horizontal scrollable chip bar for instant 1-touch filtering.
4. **Featured Grid:** 2-column compact hardware cards with prominent NPR pricing.
5. **Trust Protocol:** Accordion or swipeable cards for the 4 Nepal delivery steps.
6. **Ergonomic Bottom Bar:** Persistent 5-tab navigation.

---

## 10. Reusable CSS Design Tokens

```css
@theme {
  /* Brand Primary Orange */
  --color-brand: #f97316;
  --color-brand-hover: #ea580c;
  --color-brand-active: #c2410c;
  --color-brand-soft: #fff7ed;
  --color-brand-glow: rgba(249, 115, 22, 0.18);

  /* Charcoal Black & Neutrals */
  --color-charcoal-950: #090d14;
  --color-charcoal-900: #0f172a;
  --color-charcoal-800: #1e293b;
  --color-charcoal-600: #475569;
  --color-charcoal-400: #94a3b8;
  --color-charcoal-200: #e2e8f0;
  --color-charcoal-100: #f1f5f9;
  --color-charcoal-50: #f8fafc;

  /* Typography */
  --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border Radii */
  --radius-button: 0.75rem;     /* 12px */
  --radius-card: 1.125rem;      /* 18px */
  --radius-badge: 9999px;       /* Pill */
  --radius-modal: 1.5rem;       /* 24px */

  /* Shadows */
  --shadow-subtle: 0 1px 3px rgba(15, 23, 42, 0.05);
  --shadow-card: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
  --shadow-floating: 0 20px 40px -6px rgba(15, 23, 42, 0.12);
}
```

