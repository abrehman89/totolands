# Totolands.com — Project Documentation

## Project Overview
- **Website:** totolands.com (Kids Toy Shop)
- **Type:** E-commerce website with custom Admin Dashboard
- **Location:** Pakistan-based
- **Built:** From scratch with custom code

---

## Final Technology Stack

### Frontend (Customer Website)
- **Next.js 14** (App Router)
- **Tailwind CSS**

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

## Customer Website Pages
```
/                    → Home page
/products            → All products
/products/[slug]     → Single product page
/category/[slug]     → Products by category
/cart                → Shopping cart
/checkout            → Place order (COD or Card)
/orders              → Customer order history
/account             → Customer profile
/auth/login          → Login
/auth/signup         → Signup
```

---

## Admin Dashboard Pages
```
/admin               → Dashboard (sales overview)
/admin/products      → All products list
/admin/products/new  → Add new product
/admin/products/edit → Edit product
/admin/orders        → All orders
/admin/orders/[id]   → Order detail + status update
/admin/customers     → Customer list
/admin/categories    → Manage categories
/admin/banners       → Homepage banners
```

---

## Database Tables
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

## Project Folder Structure
```
totolands/
├── app/
│   ├── (store)/          → Customer website
│   ├── admin/            → Admin dashboard
│   └── api/              → Backend API routes
├── components/
│   ├── store/            → Customer components
│   └── admin/            → Admin components
├── lib/
│   ├── prisma.ts         → Database client
│   ├── cloudinary.ts     → Image upload
│   └── auth.ts           → Auth config
├── prisma/
│   └── schema.prisma     → Database schema
└── public/               → Static files
```

---

## Build Steps
```
Step 1  → Project Setup & Folder Structure
Step 2  → Database Schema (Prisma + PostgreSQL)
Step 3  → Authentication (NextAuth.js)
Step 4  → Admin Dashboard
Step 5  → Product Management
Step 6  → Category Management
Step 7  → Customer Website (Home, Products, Category pages)
Step 8  → Cart & Checkout
Step 9  → COD Payment Logic
Step 10 → PayFast PK Integration (Mastercard/Visa)
Step 11 → Email Notifications (Resend)
Step 12 → Image Upload (Cloudinary)
Step 13 → Connect totolands.com domain on Vercel
Step 14 → Go Live! 🎉
```

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
