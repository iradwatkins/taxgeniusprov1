/**
 * QR Code Generation Service
 *
 * Generates QR codes for marketing materials and uploads them to storage.
 * Part of Epic 6: Lead Tracking Dashboard Enhancement - Story 6.2
 */

import QRCode from 'qrcode';
import { logger } from '@/lib/logger';

export interface GenerateQROptions {
  url: string;
  materialId: string;
  format?: 'PNG' | 'SVG';
  size?: number;
  brandColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
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
      // Generate SVG
      const svgString = await QRCode.toString(url, {
        ...qrOptions,
        type: 'svg',
      });
      // Convert SVG to data URL
      dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
    } else {
      // Generate PNG as data URL
      dataUrl = await QRCode.toDataURL(url, {
        ...qrOptions,
        type: 'image/png',
      });
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
      const svgString = await QRCode.toString(url, {
        ...qrOptions,
        type: 'svg',
      });
      return Buffer.from(svgString, 'utf-8');
    } else {
      return await QRCode.toBuffer(url, {
        ...qrOptions,
        type: 'png',
      });
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
