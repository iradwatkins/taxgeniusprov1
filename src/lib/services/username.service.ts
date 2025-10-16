/**
 * Username Service
 *
 * Handles short link username management:
 * - Availability checking
 * - Username generation from names
 * - Intelligent suggestions when taken
 * - One-time change enforcement
 *
 * Part of Epic 6: Lead Tracking Dashboard Enhancement
 */

import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

// ============ Types ============

export interface UsernameCheckResult {
  available: boolean
  username: string
  suggestions?: string[]
  error?: string
}

export interface UsernameClaimResult {
  success: boolean
  username?: string
  shortUrl?: string
  error?: string
  canChange?: boolean
}

// ============ Constants ============

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30
const USERNAME_REGEX = /^[a-z0-9_]+$/ // lowercase, numbers, underscores only
const RESERVED_USERNAMES = [
  'admin', 'api', 'auth', 'dashboard', 'blog', 'help', 'support',
  'contact', 'about', 'terms', 'privacy', 'lead', 'intake', 'preparer',
  'affiliate', 'referral', 'client', 'super', 'root', 'system',
  'test', 'demo', 'example', 'null', 'undefined', 'taxgenius',
  'taxgeniuspro', 'irs', 'refund', 'tax', 'cpa', 'accountant'
]

// ============ Username Validation ============

/**
 * Validate username format
 */
export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  // Check length
  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters`
    }
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be less than ${USERNAME_MAX_LENGTH} characters`
    }
  }

  // Check format (lowercase, numbers, underscores)
  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain lowercase letters, numbers, and underscores'
    }
  }

  // Check for reserved words
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return {
      valid: false,
      error: 'This username is reserved and cannot be used'
    }
  }

  return { valid: true }
}

/**
 * Normalize username (lowercase, remove spaces/special chars)
 */
export function normalizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_') // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_')      // Remove consecutive underscores
    .replace(/^_+|_+$/g, '')     // Remove leading/trailing underscores
    .slice(0, USERNAME_MAX_LENGTH)
}

// ============ Username Generation ============

/**
 * Generate username from first and last name
 */
export function generateUsernameFromName(firstName: string, lastName: string): string {
  const normalized = normalizeUsername(`${firstName}${lastName}`)

  // If result is too short, try firstname + last initial
  if (normalized.length < USERNAME_MIN_LENGTH) {
    return normalizeUsername(`${firstName}${lastName.charAt(0)}`)
  }

  return normalized
}

/**
 * Generate username suggestions when desired username is taken
 */
export async function generateUsernameSuggestions(
  baseUsername: string,
  count: number = 5
): Promise<string[]> {
  const suggestions: string[] = []
  const normalized = normalizeUsername(baseUsername)

  // Strategy 1: Add numbers (johnsmith2, johnsmith3, etc.)
  for (let i = 2; suggestions.length < count && i <= 20; i++) {
    const suggestion = `${normalized}${i}`
    if (await isUsernameAvailable(suggestion)) {
      suggestions.push(suggestion)
    }
  }

  // Strategy 2: Add underscores with numbers (john_smith2, john_smith3)
  if (suggestions.length < count && normalized.length > 6) {
    const parts = normalized.match(/.{1,4}/g) || [normalized] // Split into chunks
    for (let i = 1; suggestions.length < count && i <= 10; i++) {
      const suggestion = `${parts.join('_')}${i}`
      if (suggestion.length <= USERNAME_MAX_LENGTH && await isUsernameAvailable(suggestion)) {
        suggestions.push(suggestion)
      }
    }
  }

  // Strategy 3: Add year (johnsmith2024, johnsmith25)
  if (suggestions.length < count) {
    const year = new Date().getFullYear()
    const shortYear = year % 100

    for (const suffix of [year, shortYear]) {
      const suggestion = `${normalized}${suffix}`
      if (suggestion.length <= USERNAME_MAX_LENGTH && await isUsernameAvailable(suggestion)) {
        suggestions.push(suggestion)
        if (suggestions.length >= count) break
      }
    }
  }

  // Strategy 4: Random 3-digit numbers (johnsmith742)
  while (suggestions.length < count) {
    const randomNum = Math.floor(100 + Math.random() * 900)
    const suggestion = `${normalized}${randomNum}`
    if (suggestion.length <= USERNAME_MAX_LENGTH && await isUsernameAvailable(suggestion)) {
      suggestions.push(suggestion)
    }
  }

  return suggestions.slice(0, count)
}

// ============ Availability Checking ============

/**
 * Check if username is available (not taken, not reserved)
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    // Validate format first
    const validation = validateUsernameFormat(username)
    if (!validation.valid) {
      return false
    }

    // Check if already taken
    const existing = await prisma.profile.findUnique({
      where: { shortLinkUsername: username },
      select: { id: true }
    })

    return !existing
  } catch (error) {
    logger.error('Error checking username availability', { username, error })
    return false
  }
}

/**
 * Check username availability with suggestions
 */
export async function checkUsernameAvailability(username: string): Promise<UsernameCheckResult> {
  try {
    const normalized = normalizeUsername(username)

    // Validate format
    const validation = validateUsernameFormat(normalized)
    if (!validation.valid) {
      return {
        available: false,
        username: normalized,
        error: validation.error
      }
    }

    // Check availability
    const available = await isUsernameAvailable(normalized)

    if (available) {
      return {
        available: true,
        username: normalized
      }
    }

    // Generate suggestions if taken
    const suggestions = await generateUsernameSuggestions(normalized)

    return {
      available: false,
      username: normalized,
      suggestions,
      error: 'This username is already taken'
    }
  } catch (error) {
    logger.error('Error checking username availability', { username, error })
    return {
      available: false,
      username,
      error: 'Failed to check username availability'
    }
  }
}

// ============ Username Management ============

/**
 * Claim username for a user profile
 */
export async function claimUsername(
  profileId: string,
  username: string
): Promise<UsernameClaimResult> {
  try {
    const normalized = normalizeUsername(username)

    // Validate format
    const validation = validateUsernameFormat(normalized)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        shortLinkUsername: true,
        shortLinkUsernameChanged: true,
        role: true
      }
    })

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found'
      }
    }

    // Check if user has already changed username (one-time change policy)
    if (profile.shortLinkUsernameChanged && profile.shortLinkUsername !== null) {
      return {
        success: false,
        error: 'Username can only be changed once. Please contact support if you need assistance.',
        canChange: false
      }
    }

    // Check if username is available (unless it's their current username)
    if (profile.shortLinkUsername !== normalized) {
      const available = await isUsernameAvailable(normalized)
      if (!available) {
        const suggestions = await generateUsernameSuggestions(normalized)
        return {
          success: false,
          error: 'This username is already taken',
          canChange: true
        }
      }
    }

    // Claim username
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        shortLinkUsername: normalized,
        shortLinkUsernameChanged: true
      }
    })

    // Generate short URLs
    const leadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/lead/${normalized}`
    const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/intake/${normalized}`

    logger.info('Username claimed', {
      profileId,
      username: normalized,
      role: profile.role
    })

    return {
      success: true,
      username: normalized,
      shortUrl: leadUrl,
      canChange: false // Can no longer change after claiming
    }
  } catch (error) {
    logger.error('Error claiming username', { profileId, username, error })
    return {
      success: false,
      error: 'Failed to claim username. Please try again.'
    }
  }
}

/**
 * Get username info for a profile
 */
export async function getUsernameInfo(profileId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        shortLinkUsername: true,
        shortLinkUsernameChanged: true,
        role: true
      }
    })

    if (!profile) {
      return null
    }

    const hasUsername = profile.shortLinkUsername !== null
    const canChange = !profile.shortLinkUsernameChanged || profile.shortLinkUsername === null

    return {
      username: profile.shortLinkUsername,
      hasUsername,
      canChange,
      leadUrl: hasUsername
        ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/lead/${profile.shortLinkUsername}`
        : null,
      intakeUrl: hasUsername
        ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/intake/${profile.shortLinkUsername}`
        : null
    }
  } catch (error) {
    logger.error('Error getting username info', { profileId, error })
    return null
  }
}

/**
 * Generate default username for new user (from Clerk data)
 */
export async function generateDefaultUsername(
  firstName: string,
  lastName: string
): Promise<string> {
  const base = generateUsernameFromName(firstName, lastName)

  // Check if base is available
  if (await isUsernameAvailable(base)) {
    return base
  }

  // Generate suggestions and return first available
  const suggestions = await generateUsernameSuggestions(base, 1)
  return suggestions[0] || `${base}${Math.floor(Math.random() * 9999)}`
}

// ============ Username Analytics ============

/**
 * Get username usage statistics
 */
export async function getUsernameStats() {
  try {
    const [total, claimed, unclaimed, byRole] = await Promise.all([
      // Total profiles
      prisma.profile.count(),

      // Profiles with username
      prisma.profile.count({
        where: {
          shortLinkUsername: { not: null }
        }
      }),

      // Profiles without username
      prisma.profile.count({
        where: {
          shortLinkUsername: null
        }
      }),

      // Breakdown by role
      prisma.profile.groupBy({
        by: ['role'],
        where: {
          shortLinkUsername: { not: null }
        },
        _count: true
      })
    ])

    return {
      total,
      claimed,
      unclaimed,
      claimRate: total > 0 ? (claimed / total) * 100 : 0,
      byRole: Object.fromEntries(
        byRole.map(r => [r.role, r._count])
      )
    }
  } catch (error) {
    logger.error('Error getting username stats', { error })
    return null
  }
}
