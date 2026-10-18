import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Convert File to base64 data URI for Cloudinary upload_stream
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder:          'totolands/products',
      transformation:  [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    })

    return NextResponse.json({ url: result.secure_url }, { status: 200 })
  } catch (err: any) {
    console.error('POST /api/admin/upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
