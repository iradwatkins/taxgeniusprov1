/**
 * Clerk Webhook Handler
 *
 * Handles user lifecycle events from Clerk:
 * - user.created: Auto-generate tracking code on signup
 * - user.updated: Sync user data
 * - user.deleted: Handle user deletion
 */

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { assignTrackingCodeToUser } from '@/lib/services/tracking-code.service'

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set in environment variables')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing Svix headers' },
      { status: 400 }
    )
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt)
        break

      case 'user.updated':
        await handleUserUpdated(evt)
        break

      case 'user.deleted':
        await handleUserDeleted(evt)
        break

      default:
        console.log(`Unhandled Clerk webhook event: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error handling Clerk webhook (${eventType}):`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle user.created event
 * Auto-generate tracking code for new users
 */
async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== 'user.created') return

  const { id: clerkUserId, email_addresses, first_name, last_name } = evt.data

  console.log(`🆕 New user created: ${clerkUserId}`)

  try {
    // Check if profile already exists
    let profile = await prisma.profile.findUnique({
      where: { clerkUserId },
    })

    if (!profile) {
      // Profile doesn't exist yet - it will be created by the select-role page
      // We'll wait for that to happen, then assign tracking code
      console.log(`Profile not yet created for ${clerkUserId}, waiting for role selection...`)
      return
    }

    // Profile exists but no tracking code
    if (!profile.trackingCode) {
      console.log(`Assigning tracking code to ${clerkUserId}...`)

      await assignTrackingCodeToUser(
        profile.id,
        process.env.NEXT_PUBLIC_APP_URL || 'https://taxgeniuspro.tax'
      )

      console.log(`✅ Tracking code assigned to ${clerkUserId}`)
    }
  } catch (error) {
    console.error(`Error in handleUserCreated for ${clerkUserId}:`, error)
    throw error
  }
}

/**
 * Handle user.updated event
 * Sync user data if needed
 */
async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== 'user.updated') return

  const { id: clerkUserId } = evt.data

  console.log(`🔄 User updated: ${clerkUserId}`)

  try {
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId },
    })

    if (!profile) {
      console.log(`Profile not found for ${clerkUserId}, skipping update`)
      return
    }

    // Assign tracking code if missing
    if (!profile.trackingCode) {
      console.log(`Assigning missing tracking code to ${clerkUserId}...`)

      await assignTrackingCodeToUser(
        profile.id,
        process.env.NEXT_PUBLIC_APP_URL || 'https://taxgeniuspro.tax'
      )

      console.log(`✅ Tracking code assigned to ${clerkUserId}`)
    }
  } catch (error) {
    console.error(`Error in handleUserUpdated for ${clerkUserId}:`, error)
    throw error
  }
}

/**
 * Handle user.deleted event
 * Clean up user data
 */
async function handleUserDeleted(evt: WebhookEvent) {
  if (evt.type !== 'user.deleted') return

  const { id: clerkUserId } = evt.data

  console.log(`🗑️  User deleted: ${clerkUserId}`)

  try {
    // Profile will be cascaded and deleted by Prisma relations
    // Just log for now
    console.log(`Profile and related data will be deleted via cascade for ${clerkUserId}`)
  } catch (error) {
    console.error(`Error in handleUserDeleted for ${clerkUserId}:`, error)
    throw error
  }
}
