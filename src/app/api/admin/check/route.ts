import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/api-auth'
import { isAdminSession } from '@/lib/admin'

export async function GET() {
  const session = await getAuthSession()
  if (!session) {
    return NextResponse.json({ isAdmin: false, authenticated: false })
  }
  return NextResponse.json({
    authenticated: true,
    isAdmin: isAdminSession(session),
  })
}
