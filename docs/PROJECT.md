# PROJECT.md

## Purpose & Description

`PROJECT.md` serves as the single source of truth for the Totolands.com kids toy shop e-commerce project. This file defines the core business goals — including launching a fully functional online toy store for Pakistani customers — along with the complete project scope covering the customer-facing storefront and the custom admin dashboard. It documents all functional requirements such as product browsing, cart management, COD and Mastercard checkout, order tracking, and admin controls. It also captures non-functional requirements like performance, mobile responsiveness, and security. Any team member or developer joining the project should read this file first to understand what is being built, why it exists, and what success looks like. It prevents scope creep by keeping everyone aligned on agreed deliverables and priorities throughout the entire development lifecycle.

---

## Goals
- Launch a complete kids toy e-commerce website at totolands.com
- Serve Pakistani customers with COD and Mastercard payment options
- Provide a custom admin dashboard for full store management
- Build everything from scratch using Next.js 14 + Tailwind CSS

## Scope
### In Scope
- Customer storefront (Home, Products, Categories, Cart, Checkout, Orders, Account)
- Admin dashboard (Products, Orders, Customers, Categories, Banners)
- COD payment (custom logic)
- PayFast PK integration (Mastercard/Visa)
- Email notifications via Resend
- Image management via Cloudinary
- Authentication via NextAuth.js (customers + admin)

### Out of Scope
- Mobile app (iOS/Android)
- Multi-vendor marketplace
- Affiliate/referral system
- Live chat support

## Functional Requirements
| # | Requirement |
|---|------------|
| FR-01 | Customers can browse products by category |
| FR-02 | Customers can add products to cart |
| FR-03 | Customers can checkout using COD or Mastercard |
| FR-04 | Customers can track their order status |
| FR-05 | Admin can add/edit/delete products |
| FR-06 | Admin can manage orders and update status |
| FR-07 | Admin can manage categories and banners |
| FR-08 | System sends order confirmation emails |
| FR-09 | Product images are stored and served via Cloudinary |

## Non-Functional Requirements
- Mobile responsive (works on all screen sizes)
- Page load under 3 seconds
- Secure authentication (JWT-based sessions)
- HTTPS enforced via Vercel
- Pakistan-optimized (Urdu-friendly fonts if needed)

## Stakeholders
- **Owner:** Abdul Rehman Asif
- **Domain:** totolands.com
- **Target Users:** Pakistani families shopping for kids toys
