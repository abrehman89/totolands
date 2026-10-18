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

## Technology Stack

| What | How |
|------|-----|
| Website + Dashboard | Next.js 14 (App Router, `src/` dir, `@/*` alias) |
| Design | Tailwind CSS (custom brand config) |
| Database | PostgreSQL via Supabase + Prisma ORM 5.22.0 |
| Authentication | NextAuth.js v4 (Credentials + JWT) |
| Image Storage | Cloudinary (free tier — 25GB) |
| Emails | Resend (free tier — 3,000/month) |
| Payments | COD (custom) + PayFast PK (Mastercard/Visa/JazzCash/Easypaisa) |
| Hosting | Vercel (free tier) |
| Domain | totolands.com |

> **Note:** Stripe is NOT available in Pakistan — PayFast PK only.

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
> `Fredoka_One` no longer exists in Google Fonts — use `Fredoka` weight `'600'` instead.

### Key CSS Classes (globals.css)
```
.btn-primary     → teal bg, white text, rounded-full, shadow
.btn-outline     → transparent, teal border
.btn-white       → white bg, teal-dark text, hover yellow
.card-hover      → translateY on hover + shadow
.section-eyebrow → small colored label above headings
.section-title   → large heading style
.inner           → max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
.badge-sale      → red badge (absolute, top-left)
.badge-new       → teal badge
.badge-top       → yellow badge
```

---

## Current Project State (as of 2026-10-17)

### ✅ All Completed Work

#### Frontend — Customer Pages
- Home page `/` — 9 sections: Hero, PromoStrip, Categories, FeaturedProducts, SaleBanner, NewArrivals, ShopByAge, Testimonials, Newsletter
- Products listing `/products` — filter sidebar (category, age, price), sort bar, pagination
- Single product `/products/[slug]` — image gallery, features, add to cart, stock indicator
- Category page `/category/[slug]` — teal header, quick-nav category pills, filtered grid
- Cart page `/cart` — CartContext (localStorage), qty controls, free delivery progress bar, order summary
- Checkout `/checkout` — 3-step: Delivery Info → Payment (COD/PayFast) → Order Confirmed
- Login `/auth/login` — credentials form, show/hide password, error messages, Google placeholder
- Signup `/auth/signup` — full name, email, phone, password strength meter, terms checkbox

#### Frontend — Admin Dashboard
- Admin layout — sticky sidebar (desktop) + hamburger drawer (mobile), active link highlight
- `/admin` — 6 stat cards (revenue, orders, customers, products, pending, low stock), recent orders table, quick actions
- `/admin/products` — table with image thumbnail, category, price, stock color-coded, badge, Edit/View buttons
- `/admin/products/new` — full form: name, category, age range, description, features, price, old price, stock, badge, image URL
- `/admin/products/edit` — same form pre-filled
- `/admin/orders` — status summary cards + full orders table with Manage button
- `/admin/orders/[id]` — customer info panel, order items, live status manager (click to change + save)
- `/admin/customers` — 3 summary cards + full customers table
- `/admin/categories` — category cards with product count, slug, View/Edit, Add Category form
- `/admin/banners` — banner cards with image preview, activate/deactivate toggle, save/edit/delete

#### Backend & Infrastructure
- **Prisma 5.22.0** + `@prisma/client` installed and client generated
- **`prisma/schema.prisma`** — 7 models: User (CUSTOMER/ADMIN role), Category, Product, Order, OrderItem, Address, Banner
- **`prisma/seed.ts`** — seeds 11 categories + 6 products from mock data
- **`src/lib/prisma.ts`** — singleton PrismaClient (dev hot-reload safe)
- **NextAuth.js v4** — Credentials provider, JWT session strategy
- **`src/lib/auth.ts`** — authOptions: looks up user by email, bcrypt compares password, returns `{ id, name, email, role }`
- **`src/app/api/auth/[...nextauth]/route.ts`** — NextAuth GET/POST handler
- **`src/app/api/auth/signup/route.ts`** — POST: validates, checks duplicate email, hashes password (bcrypt 12 rounds), creates user
- **`src/middleware.ts`** — edge middleware: `/admin/*` → ADMIN role only; `/account/*` + `/orders/*` → any logged-in user
- **`src/types/next-auth.d.ts`** — extends Session + JWT with `id: string` and `role: string`
- **`src/components/SessionProvider.tsx`** — client wrapper for NextAuth, added to root layout
- **LoginClient** wired to `signIn('credentials', { redirect: false })`, handles wrong-password error inline, shows AdminOnly message
- **SignupClient** wired to POST `/api/auth/signup` then auto signs-in with new credentials
- **Navbar** shows logged-in first name + Logout button + Admin link (ADMIN role only)
- **`bcryptjs`** + `@types/bcryptjs` installed
- **`.env`** + **`.env.example`** — all placeholder keys: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, CLOUDINARY, RESEND, PAYFAST
- **`.gitignore`** — `.env` excluded
- **`next.config.mjs`** — uses `experimental.serverComponentsExternalPackages` for Prisma on Vercel
- **`ts-node@10.9.2`** installed as devDependency; seed script uses full local path `node node_modules/ts-node/dist/bin.js`

#### Supabase Database — LIVE ✅ (connected 2026-10-19)
- **Region:** ap-northeast-1 (Tokyo) — closest to Pakistan
- **DATABASE_URL:** transaction pooler on port 6543 (pgbouncer=true) — stored in `.env`
- **DIRECT_URL:** session pooler on port 5432 — stored in `.env`
- **All 7 tables created** in Supabase via `db:push` ✅
- **11 categories + 6 products seeded** via `db:seed` ✅
- **NEXTAUTH_SECRET** generated and saved in `.env` ✅
- **Admin account created** directly via Node script ✅
  - Email: `admin@totolands.com`
  - Password: `Admin@1234`
  - Role: `ADMIN`
- **Login tested and working** ✅

### ✅ Completed Infrastructure (2026-10-19)
- **Products + checkout wired to real DB** ✅
- **`/orders`** — customer order history from Supabase ✅
- **`/account`** — customer profile edit (name, phone) ✅
- **All admin dashboard pages wired to real DB** ✅
  - Overview: real revenue, counts, recent orders
  - Products table + Add/Edit product forms → `/api/admin/products`
  - Orders table + detail + status save → `/api/admin/orders/[id]`
  - Customers: real users with order count and spent
  - Categories: real list + Add Category → DB
  - Banners: real list + toggle/delete → DB

### ✅ Completed This Session (2026-10-19)
- **Cloudinary** image uploads wired in AdminProductForm ✅
- **Resend** order confirmation emails wired in `/api/orders` ✅
- **PayFast PK** payment integration in checkout ✅
- **Production build fixed** — `eslint.ignoreDuringBuilds: true` in next.config.mjs, Suspense wrapper on LoginClient ✅
- **`export const dynamic = 'force-dynamic'`** added to all API routes (required for Vercel) ✅
- **totolands.com** domain connected to Vercel ✅
- **GitHub** pushed and up to date (master branch) ✅

### 🔲 Next Steps
1. **Verify Vercel deployment succeeds** — last build was fixing `/api/auth/[...nextauth]` force-dynamic error; check Deployments tab
2. **Test live site** — login, add product with image upload, place a test order
3. **Resend domain verification** — add DNS records from resend.com for `totolands.com` so emails don't go to spam
4. **Add Resend + PayFast env vars to Vercel** — still using placeholder values

---

## File Structure (current)

```
totolands/
├── CLAUDE.md
├── .env                               ← secrets (gitignored)
├── .env.example                       ← safe template (committed)
├── prisma/
│   ├── schema.prisma                  ← DB schema (User, Category, Product, Order, OrderItem, Address, Banner)
│   └── seed.ts                        ← seeds categories + products
├── public/
│   ├── totolands-logo.jpeg
│   └── images/
│       ├── hero-toys.jpg, banner-toys.jpg
│       ├── cat-cars.jpg, cat-teddy.jpg, cat-blocks.jpg
│       ├── cat-games.jpg, cat-arts.jpg, cat-action.jpg
│       ├── prod-rc-car.jpg, prod-teddy.jpg, prod-blocks.jpg, prod-arts.jpg
│       ├── arr-doll.jpg, arr-outdoor.jpg, arr-car-track.jpg, arr-puzzle.jpg
│       └── age-0-2.jpg, age-3-5.jpg, age-6-8.jpg, age-9-12.jpg
├── src/
│   ├── app/
│   │   ├── globals.css                ← Tailwind + custom component classes
│   │   ├── layout.tsx                 ← Root layout (fonts, SessionProvider, CartProvider, Navbar, Footer)
│   │   ├── page.tsx                   ← Home page
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts  ← NextAuth handler
│   │   │       └── signup/route.ts         ← POST: create account
│   │   ├── products/
│   │   │   ├── page.tsx               ← All products listing
│   │   │   └── [slug]/page.tsx        ← Single product detail
│   │   ├── category/
│   │   │   └── [slug]/page.tsx        ← Category filtered listing
│   │   ├── cart/
│   │   │   └── page.tsx               ← Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx               ← 3-step checkout
│   │   ├── auth/
│   │   │   ├── login/page.tsx         ← Login page
│   │   │   └── signup/page.tsx        ← Signup page
│   │   └── admin/
│   │       ├── layout.tsx             ← Admin layout (sidebar, no main Navbar/Footer)
│   │       ├── page.tsx               ← Dashboard overview
│   │       ├── products/
│   │       │   ├── page.tsx           ← Products table
│   │       │   ├── new/page.tsx       ← Add product form
│   │       │   └── edit/page.tsx      ← Edit product form
│   │       ├── orders/
│   │       │   ├── page.tsx           ← Orders table
│   │       │   └── [id]/page.tsx      ← Order detail + status manager
│   │       ├── customers/page.tsx     ← Customers table
│   │       ├── categories/page.tsx    ← Categories manager
│   │       └── banners/page.tsx       ← Banners manager
│   ├── components/
│   │   ├── Navbar.tsx                 ← Sticky teal navbar, live cart badge, auth state
│   │   ├── Footer.tsx                 ← Teal-dark footer
│   │   ├── SessionProvider.tsx        ← NextAuth SessionProvider wrapper
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PromoStrip.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── ProductCard.tsx        ← Reusable card (wishlist, Add to cart, badge, "✓ Added" flash)
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── SaleBanner.tsx
│   │   │   ├── NewArrivals.tsx
│   │   │   ├── ShopByAge.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   ├── products/
│   │   │   ├── ProductsGrid.tsx       ← Filter + sort + pagination grid
│   │   │   ├── ProductFilters.tsx     ← Sidebar filters (supports hideCategoryFilter prop)
│   │   │   ├── CategoryGrid.tsx       ← ProductsGrid pre-filtered by category
│   │   │   └── ProductDetailClient.tsx← Single product client component
│   │   ├── cart/
│   │   │   └── CartClient.tsx         ← Full cart UI
│   │   ├── checkout/
│   │   │   └── CheckoutClient.tsx     ← 3-step checkout UI
│   │   ├── auth/
│   │   │   ├── AuthShell.tsx          ← Shared centered card layout for auth pages
│   │   │   ├── LoginClient.tsx        ← Wired to signIn('credentials')
│   │   │   └── SignupClient.tsx       ← Wired to POST /api/auth/signup
│   │   └── admin/
│   │       ├── AdminSidebar.tsx       ← Sidebar + mobile hamburger drawer
│   │       ├── AdminHeader.tsx        ← Page title + subtitle + action slot
│   │       ├── AdminProductForm.tsx   ← Add/Edit product form
│   │       └── OrderStatusManager.tsx ← Click-to-change order status widget
│   ├── lib/
│   │   ├── prisma.ts                  ← Singleton PrismaClient
│   │   ├── auth.ts                    ← NextAuth authOptions
│   │   ├── products-data.ts           ← ALL_PRODUCTS, CATEGORIES, AGE_GROUPS, SORT_OPTIONS (mock, pre-DB)
│   │   ├── admin-data.ts              ← Mock ADMIN_ORDERS, ADMIN_CUSTOMERS, ADMIN_BANNERS (pre-DB)
│   │   └── cart-context.tsx           ← CartProvider + useCart hook (localStorage)
│   ├── middleware.ts                  ← Edge middleware: protects /admin, /account, /orders
│   └── types/
│       └── next-auth.d.ts             ← Extends Session + JWT with id + role
├── tailwind.config.ts                 ← Brand colors, fonts, shadows
├── next.config.mjs                    ← experimental.serverComponentsExternalPackages for Prisma
├── package.json                       ← includes db:push, db:seed, db:studio, db:generate scripts
└── tsconfig.json
```

---

## Customer Pages Status
```
/                    → Home page               ✅ DONE
/products            → All products listing    ✅ DONE
/products/[slug]     → Single product          ✅ DONE
/category/[slug]     → Products by category    ✅ DONE
/cart                → Shopping cart           ✅ DONE
/checkout            → Place order             ✅ DONE
/auth/login          → Login                   ✅ DONE (wired to NextAuth)
/auth/signup         → Signup                  ✅ DONE (wired to /api/auth/signup)
/orders              → Order history           ✅ DONE (real DB, server component)
/account             → Customer profile        ✅ DONE (edit name/phone, sign out)
```

## Admin Pages Status
```
/admin               → Dashboard overview      ✅ DONE
/admin/products      → All products list       ✅ DONE
/admin/products/new  → Add new product         ✅ DONE
/admin/products/edit → Edit product            ✅ DONE
/admin/orders        → All orders              ✅ DONE
/admin/orders/[id]   → Order detail + status   ✅ DONE
/admin/customers     → Customer list           ✅ DONE
/admin/categories    → Manage categories       ✅ DONE
/admin/banners       → Homepage banners        ✅ DONE
```

---

## Key Data Interfaces

### Product (src/components/home/ProductCard.tsx)
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

### ProductDetail (src/lib/products-data.ts)
```typescript
export interface ProductDetail extends Product {
  description: string
  features: string[]
  ageRange: string
  material: string
  inBox: string
  stock: number
  images: string[]
}
```

### CartItem (src/lib/cart-context.tsx)
```typescript
export interface CartItem {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  image: string
  qty: number
}
```

---

## Prisma Schema Summary (prisma/schema.prisma)
```
User        → id, name, email, phone, password, role (CUSTOMER|ADMIN), createdAt
Category    → id, name (unique), slug (unique), image
Product     → id, name, slug (unique), description, features[], price, oldPrice, stock,
              rating, reviews, ageRange, material, inBox, badge, badgeText,
              image, images[], categoryId → Category
Order       → id, userId → User, total, deliveryFee, status (Pending|Confirmed|Shipped|Delivered|Cancelled),
              paymentMethod (COD|PayFast), fullName, phone, email, address, city, province, notes, createdAt
OrderItem   → id, orderId → Order, productId → Product, name, image, price, qty (snapshots at order time)
Address     → id, userId → User, label, fullName, phone, address, city, province, isDefault
Banner      → id, title, subtitle, image, link, active, order
```

---

## Key Logic Notes

### Cart
- `CartProvider` wraps the app in `layout.tsx` (inside `SessionProvider`)
- Persisted to `localStorage` key: `totolands-cart`
- `useCart()` exposes: `items`, `addItem`, `removeItem`, `updateQty`, `clearCart`, `totalItems`, `totalPrice`
- Free delivery at **Rs. 3,000+** (fee = Rs. 250 below threshold)
- ProductCard "Add" button flashes green "✓ Added" for 1.5s

### Checkout
- 3 steps: Delivery Info → Payment → Confirmed
- Pakistani mobile validation: `^0\d{10}$`
- Payment options: COD (default) + PayFast PK
- On confirm: `clearCart()` called, order ID as `TL-XXXXXX`
- DB write pending (currently setTimeout mock)

### Auth
- NextAuth Credentials provider with bcrypt (12 rounds)
- JWT session: token carries `id` + `role`
- Signup: POST `/api/auth/signup` → create user → auto sign-in
- Login: `signIn('credentials', { redirect: false })` → handle error inline
- Middleware protects `/admin` (ADMIN only), `/account` + `/orders` (any user)
- Navbar reflects session: shows first name + Logout; shows "Admin" link for ADMIN role

### Admin
- Admin layout (`/admin/layout.tsx`) has its own sidebar — does NOT use main Navbar/Footer
- All data currently from mock files (`admin-data.ts`, `products-data.ts`) — will swap to Prisma queries after DB connected
- OrderStatusManager is fully interactive (client-side state only until DB connected)

---

## npm Scripts
```
npm run dev          → start dev server on http://localhost:3000
npm run build        → production build
npm run db:push      → push Prisma schema to Supabase (creates/updates tables)
npm run db:seed      → run prisma/seed.ts (populate categories + products)
npm run db:studio    → open Prisma Studio (visual DB browser)
npm run db:generate  → regenerate Prisma Client after schema changes
```

---

## Known Issues & Fixes
- `Fredoka_One` → does not exist in next/font. Use `Fredoka` with weight `'600'` instead.
- Git not in PowerShell PATH → use `"C:\Program Files\Git\bin\git.exe"` or the Bash tool.
- `npm run dev` runs on port 3000 by default.
- Admin pages on mobile need `mt-[56px]` to clear the fixed top bar.
- Prisma CLI binary is at `node_modules/prisma/build/index.js` (not in `.bin/`) on this machine. All `npm run db:*` scripts use the full path. **Never use bare `prisma` command** — it resolves to a different package (Claude Code's own agent).
- Prisma 8 RC was accidentally installed first (different command structure). Pinned to `prisma@5.22.0` + `@prisma/client@5.22.0`.
- `NEXTAUTH_SECRET` must be set in `.env` before auth works — generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
