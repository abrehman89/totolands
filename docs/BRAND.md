# BRAND.md — Totolands Design System

## Logo Reference
- File: `totolands-logo.jpeg`
- Tagline: *"your littles tiny world"*

---

## Brand Colors

### Primary Palette (extracted from logo)

| Name | Hex | Usage |
|------|-----|-------|
| **Sunshine Yellow** | `#F5C842` | Primary brand color, backgrounds, hero sections, buttons |
| **Toto Orange-Yellow** | `#F0B830` | Hover states, accents, card highlights |
| **Deep Teal** | `#2E6B7A` | Outlines, borders, navbar, footer, headings |
| **Leaf Green** | `#6AAF3D` | Secondary accent, badges, sale tags, success states |
| **Dark Green** | `#4F8A2E` | Green hover states, active states |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Pure White** | `#FFFFFF` | Page background, cards, inputs |
| **Off White** | `#FFF8E7` | Section backgrounds (warm white) |
| **Light Gray** | `#F5F5F5` | Input backgrounds, dividers |
| **Medium Gray** | `#9E9E9E` | Placeholder text, disabled states |
| **Dark Gray** | `#424242` | Body text, descriptions |
| **Pure Black** | `#1A1A1A` | Headings, strong text |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#6AAF3D` | Order confirmed, in stock |
| **Warning** | `#F5C842` | Low stock, pending |
| **Error** | `#E53935` | Out of stock, errors |
| **Info** | `#2E6B7A` | Info messages, tooltips |

---

## Typography

### Font Family

| Role | Font | Source |
|------|------|--------|
| **Display / Logo Style** | `Fredoka One` | Google Fonts |
| **Headings** | `Fredoka` | Google Fonts |
| **Body Text** | `Nunito` | Google Fonts |
| **UI / Buttons / Labels** | `Nunito` | Google Fonts |

> **Why these fonts?**
> - `Fredoka One` — Bubbly, rounded, playful — matches the logo's 3D bubble letter style perfectly
> - `Nunito` — Rounded, friendly, highly readable — perfect for product descriptions and body text
> - Both are free on Google Fonts and work great together

### Font Scale (Tailwind)

```
text-xs    → 12px  — labels, badges
text-sm    → 14px  — captions, secondary text
text-base  → 16px  — body text
text-lg    → 18px  — card titles
text-xl    → 20px  — section subtitles
text-2xl   → 24px  — section headings
text-3xl   → 30px  — page headings
text-4xl   → 36px  — hero headings
text-5xl   → 48px  — display/hero text
```

---

## Tailwind Config

Add this to `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow:     '#F5C842',
          'yellow-dark': '#F0B830',
          teal:       '#2E6B7A',
          'teal-dark':'#1E4F5A',
          green:      '#6AAF3D',
          'green-dark':'#4F8A2E',
          'off-white':'#FFF8E7',
        },
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        heading: ['Fredoka', 'sans-serif'],
        body:    ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Google Fonts Import

Add to `app/layout.tsx`:

```tsx
import { Fredoka_One, Fredoka, Nunito } from 'next/font/google'

const fredokaOne = Fredoka_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fredoka-one',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})
```

---

## Color Usage Guidelines

```
Page Background     → White (#FFFFFF)
Section Background  → Off White (#FFF8E7) or Light Gray (#F5F5F5)
Navbar              → Deep Teal (#2E6B7A) with White text
Footer              → Deep Teal (#2E6B7A) with White text
Primary Button      → Sunshine Yellow (#F5C842) with Teal text
Secondary Button    → Deep Teal (#2E6B7A) with White text
Product Card        → White background, Teal border on hover
Price Text          → Deep Teal (#2E6B7A)
Sale/Discount Badge → Leaf Green (#6AAF3D)
Headings            → Pure Black (#1A1A1A) or Deep Teal (#2E6B7A)
Body Text           → Dark Gray (#424242)
```

---

## Brand Personality
- 🎨 **Colorful** — warm yellows, teals, greens
- 🫧 **Bubbly** — rounded corners everywhere (border-radius: 16px+)
- 😊 **Friendly** — soft shadows, no harsh edges
- 🧸 **Playful** — bouncy fonts, fun illustrations
- ✨ **Clean** — not cluttered, easy for parents to navigate
