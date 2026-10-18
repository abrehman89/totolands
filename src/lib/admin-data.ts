// Mock data — will be replaced by real DB queries once Prisma + Supabase is set up

export interface AdminOrder {
  id: string
  customer: string
  phone: string
  city: string
  items: number
  total: number
  payment: 'COD' | 'PayFast'
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  date: string
}

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  orders: number
  spent: number
  joined: string
}

export interface AdminBanner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  active: boolean
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'TL-A1B2C3', customer: 'Ahmed Ali',     phone: '03001234567', city: 'Karachi',   items: 3, total: 8700,  payment: 'COD',     status: 'Pending',   date: '2026-10-17' },
  { id: 'TL-D4E5F6', customer: 'Sara Khan',      phone: '03211234567', city: 'Lahore',    items: 1, total: 2800,  payment: 'PayFast',  status: 'Confirmed', date: '2026-10-17' },
  { id: 'TL-G7H8I9', customer: 'Bilal Mahmood',  phone: '03451234567', city: 'Islamabad', items: 2, total: 5300,  payment: 'COD',     status: 'Shipped',   date: '2026-10-16' },
  { id: 'TL-J1K2L3', customer: 'Ayesha Siddiqui',phone: '03001239876', city: 'Karachi',   items: 4, total: 12400, payment: 'PayFast',  status: 'Delivered', date: '2026-10-15' },
  { id: 'TL-M4N5O6', customer: 'Usman Raza',     phone: '03211239876', city: 'Faisalabad',items: 1, total: 3200,  payment: 'COD',     status: 'Cancelled', date: '2026-10-14' },
  { id: 'TL-P7Q8R9', customer: 'Hira Baig',      phone: '03451239876', city: 'Multan',    items: 2, total: 4500,  payment: 'COD',     status: 'Delivered', date: '2026-10-13' },
  { id: 'TL-S1T2U3', customer: 'Zaid Hussain',   phone: '03331234567', city: 'Rawalpindi',items: 1, total: 1700,  payment: 'PayFast',  status: 'Shipped',   date: '2026-10-12' },
  { id: 'TL-V4W5X6', customer: 'Nadia Iqbal',    phone: '03001230000', city: 'Lahore',    items: 3, total: 6900,  payment: 'COD',     status: 'Confirmed', date: '2026-10-11' },
]

export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  { id: 'C001', name: 'Ahmed Ali',      email: 'ahmed@example.com',   phone: '03001234567', city: 'Karachi',    orders: 5,  spent: 24300, joined: '2026-08-01' },
  { id: 'C002', name: 'Sara Khan',      email: 'sara@example.com',    phone: '03211234567', city: 'Lahore',     orders: 3,  spent: 11200, joined: '2026-08-15' },
  { id: 'C003', name: 'Bilal Mahmood',  email: 'bilal@example.com',   phone: '03451234567', city: 'Islamabad',  orders: 2,  spent: 8100,  joined: '2026-09-01' },
  { id: 'C004', name: 'Ayesha Siddiqui',email: 'ayesha@example.com',  phone: '03001239876', city: 'Karachi',    orders: 8,  spent: 41600, joined: '2026-07-20' },
  { id: 'C005', name: 'Usman Raza',     email: 'usman@example.com',   phone: '03211239876', city: 'Faisalabad', orders: 1,  spent: 3200,  joined: '2026-10-10' },
  { id: 'C006', name: 'Hira Baig',      email: 'hira@example.com',    phone: '03451239876', city: 'Multan',     orders: 4,  spent: 15700, joined: '2026-09-12' },
  { id: 'C007', name: 'Zaid Hussain',   email: 'zaid@example.com',    phone: '03331234567', city: 'Rawalpindi', orders: 2,  spent: 5400,  joined: '2026-09-25' },
  { id: 'C008', name: 'Nadia Iqbal',    email: 'nadia@example.com',   phone: '03001230000', city: 'Lahore',     orders: 6,  spent: 28900, joined: '2026-08-08' },
]

export const ADMIN_BANNERS: AdminBanner[] = [
  { id: 'B001', title: 'Eid Sale — Up to 30% Off!',  subtitle: 'Shop our biggest sale of the year',    image: '/images/hero-toys.jpg',   link: '/products', active: true  },
  { id: 'B002', title: 'New Arrivals Just Landed',   subtitle: 'Fresh toys for every age group',       image: '/images/banner-toys.jpg', link: '/products', active: true  },
  { id: 'B003', title: 'Free Delivery Over Rs. 3000', subtitle: 'Order more, pay less on shipping',   image: '/images/hero-toys.jpg',   link: '/products', active: false },
]

export const STATUS_COLORS: Record<AdminOrder['status'], string> = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:   'bg-purple-100 text-purple-700 border-purple-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}
