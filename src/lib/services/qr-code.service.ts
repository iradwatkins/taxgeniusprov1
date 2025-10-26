/**
 * QR Code Generation Service
 *
 * Generates QR codes for marketing materials and uploads them to storage.
 * Part of Epic 6: Lead Tracking Dashboard Enhancement - Story 6.2
 */

import QRCode from 'qrcode';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export interface GenerateQROptions {
  url: string;
  materialId: string;
  format?: 'PNG' | 'SVG';
  size?: number;
  brandColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  withLogo?: boolean; // Add Tax Genius logo in center
  userId?: string; // User ID to check for custom photo preference
}

export interface QRCodeResult {
  dataUrl: string; // Base64 data URL for immediate display
  format: 'PNG' | 'SVG';
  size: number;
}

/**
 * Generate QR code and return as base64 data URL
 * For storage, we'll use public/qr-codes directory (can be upgraded to R2/S3 later)
 */
export async function generateQRCode(options: GenerateQROptions): Promise<QRCodeResult> {
  const {
    url,
    format = 'PNG',
    size = 512,
    brandColor = '#000000',
    errorCorrectionLevel = 'H', // High error correction for print materials
    withLogo = false,
    userId,
  } = options;

  const qrOptions = {
    width: size,
    margin: 2,
    color: {
      dark: brandColor,
      light: '#FFFFFF',
    },
    errorCorrectionLevel,
  };

  try {
    let dataUrl: string;

    if (format === 'SVG') {
      // SVG doesn't support logo overlay (use PNG for logo version)
      const svgString = await QRCode.toString(url, {
        ...qrOptions,
        type: 'svg',
      });
      dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
    } else {
      // Generate PNG
      let qrBuffer = await QRCode.toBuffer(url, {
        ...qrOptions,
        type: 'png',
      });

      // Add logo if requested
      if (withLogo) {
        // Check if user wants to use their profile photo in QR codes
        let customLogoUrl: string | undefined;
        if (userId) {
          const userProfile = await prisma.profile.findFirst({
            where: {
              OR: [
                { id: userId },
                { clerkUserId: userId }
              ]
            },
            select: {
              usePhotoInQRCodes: true,
              avatarUrl: true,
            },
          });

          if (userProfile?.usePhotoInQRCodes && userProfile?.avatarUrl) {
            customLogoUrl = userProfile.avatarUrl;
            logger.info('Using custom photo for QR code', { userId, avatarUrl: customLogoUrl });
          }
        }

        qrBuffer = await addLogoToQRCode(qrBuffer, size, customLogoUrl);
      }

      // Convert to data URL
      dataUrl = `data:image/png;base64,${qrBuffer.toString('base64')}`;
    }

    return {
      dataUrl,
      format,
      size,
    };
  } catch (error) {
    logger.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as buffer (for downloads)
 */
export async function generateQRBuffer(options: GenerateQROptions): Promise<Buffer> {
  const {
    url,
    format = 'PNG',
    size = 512,
    brandColor = '#000000',
    errorCorrectionLevel = 'H',
    withLogo = false,
    userId,
  } = options;

  const qrOptions = {
    width: size,
    margin: 2,
    color: {
      dark: brandColor,
      light: '#FFFFFF',
    },
    errorCorrectionLevel,
  };

  try {
    if (format === 'SVG') {
      // SVG doesn't support logo overlay
      const svgString = await QRCode.toString(url, {
        ...qrOptions,
        type: 'svg',
      });
      return Buffer.from(svgString, 'utf-8');
    } else {
      let qrBuffer = await QRCode.toBuffer(url, {
        ...qrOptions,
        type: 'png',
      });

      // Add logo if requested
      if (withLogo) {
        // Check if user wants to use their profile photo in QR codes
        let customLogoUrl: string | undefined;
        if (userId) {
          const userProfile = await prisma.profile.findFirst({
            where: {
              OR: [
                { id: userId },
                { clerkUserId: userId }
              ]
            },
            select: {
              usePhotoInQRCodes: true,
              avatarUrl: true,
            },
          });

          if (userProfile?.usePhotoInQRCodes && userProfile?.avatarUrl) {
            customLogoUrl = userProfile.avatarUrl;
          }
        }

        qrBuffer = await addLogoToQRCode(qrBuffer, size, customLogoUrl);
      }

      return qrBuffer;
    }
  } catch (error) {
    logger.error('QR code buffer generation failed:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Validate QR code size (should be < 50KB for optimal performance)
 */
export function validateQRSize(buffer: Buffer): { valid: boolean; size: number } {
  const sizeInKB = buffer.length / 1024;
  return {
    valid: sizeInKB < 50,
    size: sizeInKB,
  };
}

/**
 * Add Tax Genius logo overlay to QR code
 * Logo will be centered and sized to ~20% of QR code (safe with H error correction)
 */
async function addLogoToQRCode(qrBuffer: Buffer, qrSize: number, customLogoUrl?: string): Promise<Buffer> {
  try {
    let logoBuffer: Buffer;

    // Use custom logo URL if provided (from preparer profile)
    if (customLogoUrl) {
      try {
        const response = await fetch(customLogoUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          logoBuffer = Buffer.from(arrayBuffer);
        } else {
          throw new Error('Failed to fetch custom logo');
        }
      } catch (error) {
        logger.warn('Failed to fetch custom logo, using default:', error);
        // Fall through to default logo
        customLogoUrl = undefined;
      }
    }

    // If no custom logo or custom logo failed, use default Tax Genius logo
    if (!customLogoUrl) {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'tax-genius-logo.png');

      try {
        logoBuffer = await fs.readFile(logoPath);
      } catch {
        // Fallback to icon if logo not found
        const iconPath = path.join(process.cwd(), 'public', 'icon-512x512.png');
        logoBuffer = await fs.readFile(iconPath);
      }
    }

    // Calculate logo size (20% of QR code size for optimal scanning)
    const logoSize = Math.floor(qrSize * 0.2);
    const padding = Math.floor(logoSize * 0.15); // White padding around logo
    const totalLogoSize = logoSize + (padding * 2);

    // Resize and add white background to logo
    const processedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Composite logo onto QR code center
    const qrWithLogo = await sharp(qrBuffer)
      .composite([{
        input: processedLogo,
        gravity: 'center'
      }])
      .png()
      .toBuffer();

    return qrWithLogo;
  } catch (error) {
    logger.error('Failed to add logo to QR code:', error);
    // Return original QR code if logo overlay fails
    return qrBuffer;
  }
}

/**
 * Generate tracking URL with UTM parameters
 */
export function generateTrackingURL(params: {
  baseUrl: string;
  userId: string;
  materialId: string;
  materialType: string;
  campaignName?: string;
  location?: string;
}): string {
  const url = new URL(params.baseUrl);

  // Add UTM parameters
  url.searchParams.set('utm_source', params.userId);
  url.searchParams.set('utm_medium', params.materialType.toLowerCase().replace(/_/g, '-'));

  if (params.campaignName) {
    url.searchParams.set('utm_campaign', params.campaignName.toLowerCase().replace(/\s+/g, '-'));
  }

  url.searchParams.set('utm_content', params.materialId);

  if (params.location) {
    url.searchParams.set('utm_term', params.location.toLowerCase().replace(/\s+/g, '-'));
  }

  // Add ref parameter for backward compatibility
  url.searchParams.set('ref', params.materialId);

  return url.toString();
}

/**
 * Generate unique tracking code for material
 */
export function generateMaterialTrackingCode(params: {
  userSlug?: string;
  materialType: string;
}): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const typeSlug = params.materialType.toLowerCase().replace(/_/g, '-');

  if (params.userSlug) {
    return `${params.userSlug}_${typeSlug}_${random}`;
  }

  return `material_${typeSlug}_${timestamp}_${random}`;
}
