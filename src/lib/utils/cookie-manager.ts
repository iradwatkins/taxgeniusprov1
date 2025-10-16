/**
 * Cookie Manager Utility
 *
 * Handles secure cookie operations for UTM attribution tracking.
 * Part of Epic 6: Lead Tracking Dashboard Enhancement
 */

import { cookies } from 'next/headers'
import type { UTMAttribution } from '../services/utm-tracking.service'
import { logger } from '@/lib/logger'

// Cookie configuration
export const UTM_COOKIE_NAME = '__tgp_utm'
export const UTM_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

/**
 * Set UTM attribution cookie (server-side)
 */
export async function setUTMCookie(attribution: UTMAttribution): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(UTM_COOKIE_NAME, JSON.stringify(attribution), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: UTM_COOKIE_MAX_AGE,
    path: '/',
  })
}

/**
 * Get UTM attribution from cookie (server-side)
 */
export async function getUTMCookie(): Promise<UTMAttribution | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(UTM_COOKIE_NAME)

  if (!cookie?.value) {
    return null
  }

  try {
    const attribution = JSON.parse(cookie.value) as UTMAttribution

    // Validate required fields
    if (!attribution.trackingCode || !attribution.firstTouch || !attribution.lastTouch) {
      return null
    }

    // Check if expired (30-day window)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
    const now = Date.now()
    if ((now - attribution.firstTouch) > thirtyDaysInMs) {
      return null
    }

    return attribution
  } catch (error) {
    logger.error('Failed to parse UTM cookie:', error)
    return null
  }
}

/**
 * Delete UTM attribution cookie (server-side)
 */
export async function deleteUTMCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(UTM_COOKIE_NAME)
}

/**
 * Client-side: Get UTM attribution from document.cookie
 */
export function getUTMCookieClient(): UTMAttribution | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split(';')
  const utmCookie = cookies.find(c => c.trim().startsWith(`${UTM_COOKIE_NAME}=`))

  if (!utmCookie) {
    return null
  }

  try {
    const value = utmCookie.split('=')[1]
    const attribution = JSON.parse(decodeURIComponent(value)) as UTMAttribution

    // Validate required fields
    if (!attribution.trackingCode || !attribution.firstTouch || !attribution.lastTouch) {
      return null
    }

    // Check if expired (30-day window)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
    const now = Date.now()
    if ((now - attribution.firstTouch) > thirtyDaysInMs) {
      return null
    }

    return attribution
  } catch (error) {
    logger.error('Failed to parse UTM cookie (client):', error)
    return null
  }
}

/**
 * Client-side: Set UTM attribution via API
 * (Note: Cannot set httpOnly cookies from client, must use API route)
 */
export async function setUTMCookieClient(attribution: UTMAttribution): Promise<boolean> {
  try {
    const response = await fetch('/api/tracking/set-utm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attribution),
    })

    return response.ok
  } catch (error) {
    logger.error('Failed to set UTM cookie via API:', error)
    return false
  }
}
