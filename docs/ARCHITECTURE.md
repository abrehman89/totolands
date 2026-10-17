# ARCHITECTURE.md

## Purpose & Description

`ARCHITECTURE.md` documents the complete system design and technical structure of Totolands.com. This file explains how all the individual technologies — Next.js, PostgreSQL, Cloudinary, Resend, PayFast, and Vercel — connect and interact with each other to form a working e-commerce platform. It serves as a technical blueprint that helps developers understand data flow, API boundaries, authentication layers, and deployment topology before writing a single line of code. Without this document, developers risk building components that conflict with each other or making architectural decisions that are difficult to reverse. It is essential for onboarding new developers, debugging system-level issues, and making informed decisions when scaling or extending the platform in the future.

---

## System Architecture Diagram

```
                        ┌─────────────────────────────────┐
                        │          totolands.com           │
                        │        Hosted on Vercel          │
                        └────────────┬────────────────────┘
                                     │
                    ┌────────────────┼─────────────────┐
                    │                │                  │
           ┌────────▼───────┐ ┌──────▼──────┐ ┌───────▼──────┐
           │  Customer Site  │ │    Admin    │ │   API Routes  │
           │  Next.js 14     │ │  Dashboard  │ │  /api/*       │
           │  (app/store)    │ │  Next.js 14 │ │  Next.js      │
           └────────┬───────┘ └──────┬──────┘ └───────┬──────┘
                    │                │                  │
                    └────────────────┼──────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                       │
     ┌────────▼────────┐   ┌────────▼────────┐   ┌─────────▼────────┐
     │    Supabase      │   │   Cloudinary    │   │      Resend      │
     │  PostgreSQL DB   │   │  Image Storage  │   │  Email Service   │
     │  + Prisma ORM    │   │                 │   │                  │
     └─────────────────┘   └─────────────────┘   └──────────────────┘
                                     │
                        ┌────────────┴────────────┐
                        │       PayFast PK         │
                        │  Mastercard/Visa/COD     │
                        └─────────────────────────┘
```

---

## Technology Stack Details

### Frontend & Backend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 14 (App Router) | Pages + API routes |
| Styling | Tailwind CSS | 3.x | UI design |
| Language | TypeScript | 5.x | Type safety |

### Database
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | PostgreSQL | Data storage |
| Hosting | Supabase | DB hosting (free) |
| ORM | Prisma | DB queries in JS |

### External Services
| Service | Provider | Purpose |
|---------|---------|---------|
| Authentication | NextAuth.js | Login sessions |
| Images | Cloudinary | Product photos |
| Email | Resend | Order notifications |
| Payments | PayFast PK | Card payments |
| Hosting | Vercel | App deployment |

---

## Data Flow

### Customer Places Order (COD)
```
1. Customer fills checkout form
2. Next.js API validates data
3. Order saved to PostgreSQL via Prisma
4. Resend sends confirmation email to customer
5. Admin sees new order in dashboard
6. Admin updates order status manually
```

### Customer Places Order (Mastercard)
```
1. Customer fills checkout form
2. Next.js redirects to PayFast PK payment page
3. Customer pays on PayFast
4. PayFast sends webhook to /api/payfast/webhook
5. Next.js verifies webhook and marks order as paid
6. Order saved to PostgreSQL
7. Resend sends confirmation email
```

### Admin Uploads Product Image
```
1. Admin selects image in dashboard
2. Next.js API sends image to Cloudinary
3. Cloudinary returns secure image URL
4. URL saved in PostgreSQL product record
5. Customer website loads image from Cloudinary CDN
```

---

## Authentication Flow

```
Customer Auth:
- NextAuth.js Credentials Provider
- Email + Password login
- JWT session stored in cookie
- Protected routes: /orders, /account, /checkout

Admin Auth:
- Separate NextAuth.js session
- Role-based: role = "ADMIN" in DB
- Protected routes: /admin/*
- Middleware checks role on every /admin request
```

---

## Folder Structure
```
totolands/
├── app/
│   ├── (store)/              → Customer-facing pages
│   │   ├── page.tsx          → Home
│   │   ├── products/         → Product listing + detail
│   │   ├── category/         → Category pages
│   │   ├── cart/             → Cart page
│   │   ├── checkout/         → Checkout page
│   │   ├── orders/           → Order history
│   │   └── account/          → Customer profile
│   ├── admin/                → Admin dashboard pages
│   │   ├── page.tsx          → Dashboard overview
│   │   ├── products/         → Product management
│   │   ├── orders/           → Order management
│   │   ├── customers/        → Customer list
│   │   ├── categories/       → Category management
│   │   └── banners/          → Banner management
│   └── api/                  → Backend API routes
│       ├── auth/             → NextAuth endpoints
│       ├── products/         → Product CRUD
│       ├── orders/           → Order management
│       ├── upload/           → Cloudinary upload
│       └── payfast/          → Payment webhook
├── components/
│   ├── store/                → Customer UI components
│   └── admin/                → Admin UI components
├── lib/
│   ├── prisma.ts             → Prisma client singleton
│   ├── cloudinary.ts         → Cloudinary config
│   ├── auth.ts               → NextAuth config
│   └── utils.ts              → Helper functions
├── prisma/
│   └── schema.prisma         → DB schema
├── public/                   → Static assets
├── CLAUDE.md                 → AI assistant context
├── PROJECT.md                → Goals & requirements
├── ARCHITECTURE.md           → This file
├── RULES.md                  → Coding standards
└── PROGRESS.md               → Build progress
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  orders    Order[]
  addresses Address[]
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  price       Float
  description String
  images      String[]
  stock       Int
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  image    String?
  products Product[]
}

model Order {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  total         Float
  status        OrderStatus @default(PENDING)
  paymentMethod PaymentMethod
  address       String
  phone         String
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

model Address {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id])
  name    String
  phone   String
  city    String
  address String
}

model Banner {
  id      String  @id @default(cuid())
  image   String
  title   String?
  link    String?
  active  Boolean @default(true)
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  COD
  CARD
}
```
