import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { TrackingCodeDashboard } from '@/components/tracking/TrackingCodeDashboard'

export const metadata = {
  title: 'My Tracking Code | Tax Genius Pro',
  description: 'Manage your universal tracking code and view performance',
}

async function checkReferrerAccess() {
  const user = await currentUser()
  if (!user) return { hasAccess: false, userId: null, profileId: null }

  const role = user.publicMetadata?.role as string
  const hasAccess = role === 'referrer'

  // Get profile ID
  let profileId = null
  if (hasAccess && user.id) {
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: user.id },
      select: { id: true }
    })
    profileId = profile?.id || null
  }

  return { hasAccess, userId: user.id, profileId }
}

export default async function ReferrerTrackingPage() {
  const { hasAccess, userId, profileId } = await checkReferrerAccess()

  if (!hasAccess || !userId || !profileId) {
    redirect('/forbidden')
  }

  return <TrackingCodeDashboard userId={userId} profileId={profileId} role="referrer" />
}
