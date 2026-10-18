import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/lib/auth'
import { prisma }                    from '@/lib/prisma'
import { resend }                    from '@/lib/resend'
import { buildOrderConfirmationEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body    = await req.json()

    const {
      fullName, phone, email, address, city, province, notes,
      paymentMethod, items, total, deliveryFee,
    } = body

    // Basic validation
    if (!fullName || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create order + order items in a single transaction
    const order = await prisma.order.create({
      data: {
        userId:        session?.user?.id ?? null,
        fullName,
        phone,
        email:         email || null,
        address,
        city,
        province:      province || null,
        notes:         notes   || null,
        paymentMethod: paymentMethod === 'payfast' ? 'PayFast' : 'COD',
        total,
        deliveryFee,
        status:        'Pending',
        items: {
          create: items.map((item: {
            id: string; dbId?: string; name: string; image: string; price: number; qty: number
          }) => ({
            productId: item.dbId ?? item.id,
            name:      item.name,
            image:     item.image,
            price:     item.price,
            qty:       item.qty,
          })),
        },
      },
      include: { items: true },
    })

    // Send confirmation email — fire and forget (don't block the response)
    const toEmail = email || session?.user?.email
    if (toEmail) {
      const html = buildOrderConfirmationEmail({
        orderId:       order.id,
        fullName:      order.fullName,
        phone:         order.phone,
        address:       order.address,
        city:          order.city,
        province:      order.province,
        paymentMethod: order.paymentMethod,
        total:         order.total,
        deliveryFee:   order.deliveryFee,
        items:         order.items.map(i => ({
          name:  i.name,
          image: i.image,
          price: i.price,
          qty:   i.qty,
        })),
      })

      resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'orders@totolands.com',
        to:      toEmail,
        subject: `🎉 Order Confirmed — #${order.id.slice(-8).toUpperCase()} | Totolands`,
        html,
      }).catch(err => console.error('Resend email error:', err))
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })

  } catch (err: any) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
