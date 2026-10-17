# Totolands.com — Project Documentation

> **AI Assistant:** Always read this file at the start of every session. Update it after every major change.

---

## Project Overview
- **Website:** totolands.com (Kids Toy Shop)
- **Type:** E-commerce website with custom Admin Dashboard
- **Location:** Pakistan-based
- **Built:** From scratch with custom code
- **GitHub:** https://github.com/abrehman89/totolands (main branch)

---

## Final Technology Stack

### Frontend (Customer Website)
- **Next.js 14** (App Router, `src/` directory, `@/*` alias)
- **Tailwind CSS** (custom brand config in `tailwind.config.ts`)

### Backend (API + Logic)
- **Next.js API Routes** (built-in, no separate server needed)

### Admin Dashboard
- **Next.js 14** (custom built)
- **Tailwind CSS**

### Database
- **PostgreSQL** via Supabase (free tier)
- **Prisma ORM** (to interact with DB using simple JS instead of raw SQL)

### Authentication
- **NextAuth.js**
  - Customer login/signup
  - Admin protected dashboard

### Image Storage
- **Cloudinary** (free tier — 25GB)

### Email
- **Resend** (free tier — 3,000 emails/month)

### Payments
- **COD** — Cash on Delivery (custom logic, no gateway)
- **PayFast PK** — Mastercard / Visa / JazzCash / Easypaisa
- **Note:** Stripe is NOT available in Pakistan — use PayFast PK only

### Hosting
- **Vercel** (free tier)

### Domain
- **totolands.com** → connected to Vercel

---

## Monthly Cost
| Service | Cost |
|---------|------|
| Vercel | Free |
| Supabase (PostgreSQL) | Free |
| Cloudinary | Free |
| Resend | Free |
| PayFast PK | Free (% per transaction) |
| totolands.com | Already paid |
| **Total** | **Rs. 0/month** |

---

## Brand & Design

### Colors (from totolands-logo.jpeg)
```
Deep Teal:    #2E6B7A  (navbar, footer, primary buttons)
Teal Dark:    #1E4F5A  (footer bg, hover states)
Yellow:       #F5C842  (hero section bg, highlights)
Yellow Dark:  #E8B820  (hover states)
Leaf Green:   #6AAF3D  (accents, badges, section tints)
Green Dark:   #4F8A2E  (text on green bg)
Green Light:  #E4F3F7  (section backgrounds)
Off White:    #F7FBFD  (page background)
```

### Fonts (Google Fonts via next/font)
```
Fredoka (weight 600) → display font  → CSS var: --font-fredoka  → Tailwind: font-display
Fredoka (300-700)    → heading font  → CSS var: --font-fredoka  → Tailwind: font-heading
Nunito               → body font     → CSS var: --font-nunito   → Tailwind: font-body
```
> Note: `Fredoka_One` no longer exists in Google Fonts — use `Fredoka` weight 600 instead.

### Key CSS Classes (defined in globals.css)
```
.btn-primary   → teal bg, white text, rounded-full
.btn-outline   → transparent, teal border
.btn-white     → white bg, teal-dark text, hover yellow
.card-hover    → translateY on hover + shadow
.section-eyebrow → small colored label above headings
.section-title → large heading style
.inner         → max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
.badge-sale    → red badge
.badge-new     → teal badge
.badge-top     → yellow badge
```

---

## Current Project State (as of 2026-10-17)

### ✅ Completed
- Next.js 14 project scaffolded at `C:\Users\sh\Desktop\Abdul Rehman Asif\totolands\`
- Tailwind CSS configured with full brand colors, fonts, shadows
- `src/app/globals.css` — custom component classes
- `src/app/layout.tsx` — root layout with fonts + Navbar + Footer
- `src/app/page.tsx` — home page assembling 9 sections
- All home page components built (see components list below)
- Logo copied to `public/totolands-logo.jpeg`
- All placeholder toy images saved to `public/images/`
- Dev server tested: `npm run dev` → http://localhost:3000 (Status 200 ✅)
- Git initialized, all code pushed to GitHub main branch
- Products listing page `/products` — filter sidebar, sort bar, pagination (Status 200 ✅)

### 🔲 Next Steps (in order)
1. Single product page (`/products/[slug]`)
2. Single product page (`/products/[slug]`)
3. Category page (`/category/[slug]`)
4. Cart page (`/cart`)
5. Checkout page (`/checkout`)
6. Auth pages (`/auth/login`, `/auth/signup`)
7. Admin Dashboard pages
8. Supabase PostgreSQL + Prisma schema setup
9. NextAuth.js authentication
10. Cloudinary image upload
11. Resend email notifications
12. PayFast PK payment integration
13. Deploy to Vercel + connect totolands.com

---

## File Structure (current)

```
totolands/
├── CLAUDE.md                          ← This file
├── docs/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── PROGRESS.md
│   └── BRAND.md
├── public/
│   ├── totolands-logo.jpeg            ← Brand logo
│   └── images/
│       ├── hero-toys.jpg
│       ├── banner-toys.jpg
│       ├── cat-cars.jpg, cat-teddy.jpg, cat-blocks.jpg
│       ├── cat-games.jpg, cat-arts.jpg, cat-action.jpg
│       ├── prod-rc-car.jpg, prod-teddy.jpg, prod-blocks.jpg, prod-arts.jpg
│       ├── arr-doll.jpg, arr-outdoor.jpg, arr-car-track.jpg, arr-puzzle.jpg
│       └── age-0-2.jpg, age-3-5.jpg, age-6-8.jpg, age-9-12.jpg
├── src/
│   ├── app/
│   │   ├── globals.css                ← Tailwind + custom component classes
│   │   ├── layout.tsx                 ← Root layout (fonts, Navbar, Footer)
│   │   └── page.tsx                   ← Home page
│   └── components/
│       ├── Navbar.tsx                 ← Sticky teal navbar, category bar
│       ├── Footer.tsx                 ← Teal-dark footer
│       └── home/
│           ├── HeroSection.tsx        ← Yellow hero, stats, floating badges
│           ├── PromoStrip.tsx         ← 3 promo cards (delivery/COD/returns)
│           ├── CategoriesSection.tsx  ← 6-col category grid
│           ├── ProductCard.tsx        ← Reusable product card (wishlist, badge)
│           ├── FeaturedProducts.tsx   ← 4 featured products
│           ├── SaleBanner.tsx         ← Gradient banner with stats
│           ├── NewArrivals.tsx        ← 4 new arrival cards
│           ├── ShopByAge.tsx          ← 4 age group cards
│           ├── Testimonials.tsx       ← 3 parent reviews
│           └── Newsletter.tsx         ← Email signup form
├── tailwind.config.ts                 ← Brand colors, fonts, shadows
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## Customer Website Pages
```
/                    → Home page          ✅ DONE
/products            → All products       ✅ DONE
/products/[slug]     → Single product     🔲 TODO
/category/[slug]     → Products by cat    🔲 TODO
/cart                → Shopping cart      🔲 TODO
/checkout            → Place order        🔲 TODO
/orders              → Order history      🔲 TODO
/account             → Customer profile   🔲 TODO
/auth/login          → Login              🔲 TODO
/auth/signup         → Signup             🔲 TODO
```

---

## Admin Dashboard Pages
```
/admin               → Dashboard overview        🔲 TODO
/admin/products      → All products list         🔲 TODO
/admin/products/new  → Add new product           🔲 TODO
/admin/products/edit → Edit product              🔲 TODO
/admin/orders        → All orders                🔲 TODO
/admin/orders/[id]   → Order detail + status     🔲 TODO
/admin/customers     → Customer list             🔲 TODO
/admin/categories    → Manage categories         🔲 TODO
/admin/banners       → Homepage banners          🔲 TODO
```

---

## Database Tables (Prisma schema — not yet created)
```
Users          → id, name, email, password, role
Products       → id, name, price, description, images, stock
Categories     → id, name, slug, image
Orders         → id, userId, total, status, paymentMethod
OrderItems     → id, orderId, productId, qty, price
Addresses      → id, userId, city, address, phone
Banners        → id, image, title, link
```

---

## ProductCard Interface
```typescript
export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: 'sale' | 'new' | 'top'
  badgeText?: string
}
```

---

## Known Issues & Fixes
- `Fredoka_One` → does not exist in next/font. Use `Fredoka` with weight `'600'` instead.
- Git is not in PowerShell PATH → use `"C:\Program Files\Git\bin\git.exe"` or the Bash tool.
- `npm run dev` runs on port 3000 by default.

---

## Technology Role Summary
| What | How |
|------|-----|
| Website + Dashboard | Next.js 14 |
| Design | Tailwind CSS |
| Database | PostgreSQL + Prisma |
| Login | NextAuth.js |
| Images | Cloudinary |
| Emails | Resend |
| Payments | COD (custom) + PayFast PK |
| Live Hosting | Vercel |
| Domain | totolands.com |
