/**
 * EMERGENCY API: Set iradwatkins@gmail.com as super_admin
 *
 * This endpoint bypasses normal checks and directly sets super_admin role
 * Only works for iradwatkins@gmail.com
 *
 * Visit: https://taxgeniuspro.tax/api/admin/emergency-set-super-admin
 */

import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🚨 EMERGENCY: Setting super_admin role...')

    // Get current user
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in first.' },
        { status: 401 }
      )
    }

    // Check email
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress

    if (email !== 'iradwatkins@gmail.com') {
      return NextResponse.json(
        { error: 'Access denied. This endpoint is only for iradwatkins@gmail.com' },
        { status: 403 }
      )
    }

    console.log(`✅ Email verified: ${email}`)

    // Update Clerk metadata
    console.log('📝 Updating Clerk metadata...')
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'super_admin',
      },
    })
    console.log('✅ Clerk metadata updated to super_admin')

    // Update or create profile in database
    console.log('📝 Updating database profile...')
    try {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
      })

      if (!profile) {
        await prisma.profile.create({
          data: {
            clerkUserId: user.id,
            role: 'SUPER_ADMIN',
            email: email,
            firstName: user.firstName || 'Irad',
            lastName: user.lastName || 'Watkins',
          },
        })
        console.log('✅ Profile created in database with SUPER_ADMIN role')
      } else {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { role: 'SUPER_ADMIN' },
        })
        console.log('✅ Profile updated to SUPER_ADMIN role')
      }
    } catch (dbError) {
      console.error('⚠️  Database update failed (non-critical):', dbError)
    }

    console.log('🎉 SUCCESS! iradwatkins@gmail.com is now super_admin')

    return NextResponse.json({
      success: true,
      message: 'Role set to super_admin successfully!',
      instructions:
        'Please sign out completely and sign back in to see the changes.',
      user: {
        id: user.id,
        email: email,
        role: 'super_admin',
      },
    })
  } catch (error) {
    console.error('❌ Error setting super_admin role:', error)
    return NextResponse.json(
      {
        error: 'Failed to set super_admin role',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
