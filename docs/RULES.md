# RULES.md

## Purpose & Description

`RULES.md` establishes the coding standards, conventions, and hard constraints that every developer must follow when contributing to Totolands.com. This file ensures that all code written across the project — whether for the customer storefront, admin dashboard, or API routes — looks and behaves consistently, making it easier to read, review, debug, and maintain over time. It covers naming conventions, folder organization, TypeScript usage, API design patterns, security rules, and UI consistency guidelines. Without agreed standards, different parts of the codebase can become inconsistent and hard to understand. These rules protect the project from technical debt and ensure that even a solo developer maintains discipline across long development sessions.

---

## General Rules

- ✅ Always use **TypeScript** — no plain `.js` files
- ✅ All components must be in **PascalCase** (e.g. `ProductCard.tsx`)
- ✅ All files/folders must be in **kebab-case** (e.g. `product-card.tsx`)
- ✅ Never commit secrets or API keys — use `.env.local` always
- ✅ Always validate user input on **both** frontend and API
- ❌ Never use `any` type in TypeScript
- ❌ Never hardcode prices, IDs, or URLs in components

---

## Folder Rules

```
- All customer pages → app/(store)/
- All admin pages   → app/admin/
- All API routes    → app/api/
- All reusable UI   → components/
- All DB/API utils  → lib/
- All types         → types/
```

---

## Component Rules

- One component per file
- Props must be typed with TypeScript interfaces
- Use `'use client'` only when necessary (forms, state, events)
- Default to **Server Components** for performance
- Keep components small — max ~100 lines per file
- Extract repeated UI into reusable components

```tsx
// ✅ Correct
interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (...)
}

// ❌ Wrong
export default function ProductCard({ id, name, price, image }: any) {
  return (...)
}
```

---

## API Route Rules

- All API routes live in `app/api/`
- Always return proper HTTP status codes
- Always wrap handlers in try/catch
- Validate request body before processing
- Never expose passwords or sensitive fields in responses

```ts
// ✅ Correct API Route Pattern
export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || !body.price) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }
    const product = await prisma.product.create({ data: body })
    return Response.json(product, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

---

## Database Rules

- Always use **Prisma** — never raw SQL
- Never delete records permanently — add `isDeleted` flag if needed
- Always use `cuid()` for IDs
- Migrations must be reviewed before running on production
- Never expose the full DB object — select only needed fields

---

## Tailwind CSS Rules

- Never write custom CSS unless absolutely necessary
- Use Tailwind utility classes only
- Use consistent color palette (kids-friendly: bright, warm colors)
- All pages must be **mobile-first** responsive
- Use `sm:`, `md:`, `lg:` breakpoints consistently

```tsx
// ✅ Correct
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ Wrong — avoid inline styles
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
```

---

## Security Rules

- All admin routes must be protected by middleware role check
- Never trust client-side data — always validate on server
- Passwords must be hashed with **bcrypt** before storing
- Use **HTTPS** only (enforced by Vercel)
- PayFast webhook must verify signature before processing
- Environment variables must never be logged

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Pages | lowercase | `page.tsx` |
| API routes | lowercase | `route.ts` |
| Hooks | camelCase with `use` | `useCart.ts` |
| Types/Interfaces | PascalCase | `ProductType` |
| Constants | UPPER_SNAKE_CASE | `MAX_CART_ITEMS` |
| DB tables | PascalCase (Prisma) | `Product`, `Order` |

---

## Git Rules

- Branch naming: `feature/feature-name`, `fix/bug-name`
- Commit messages must be descriptive
- Never push directly to `main`
- Test before committing

```
✅ Good commit: "Add product listing page with category filter"
❌ Bad commit:  "fix stuff" / "update" / "asdf"
```

---

## Environment Variables

All secrets go in `.env.local` — never committed to git:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
```
