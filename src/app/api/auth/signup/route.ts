import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, password } = await req.json()

    // Basic validation
    if (!fullName?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already in use
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name:     fullName.trim(),
        email:    normalizedEmail,
        phone:    phone?.trim() || null,
        password: hashedPassword,
        role:     'CUSTOMER',
      },
    })

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
