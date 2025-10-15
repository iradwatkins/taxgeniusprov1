# Universal Tracking Code System - Integration Guide

## Overview

The Universal Tracking Code System provides every user (Tax Preparers, Affiliates, Referrers) with a unique tracking code that follows them across all marketing materials, campaigns, and attribution touchpoints.

## System Architecture

### Components

1. **Profile-level Tracking Code** (`/src/lib/services/tracking-code.service.ts`)
   - Auto-generated on signup (format: `TGP-XXXXXX`)
   - One-time customizable by user
   - QR code auto-generation
   - Database schema in Profile model

2. **API Endpoints**
   - `GET /api/profile/tracking-code` - Get user's tracking data
   - `PATCH /api/profile/tracking-code` - Customize tracking code (one-time)
   - `POST /api/profile/tracking-code/check-availability` - Check custom code availability

3. **User Dashboard** (`/src/app/dashboard/[role]/tracking/page.tsx`)
   - View tracking code and QR code
   - Customize tracking code (one-time)
   - Download QR code
   - View performance metrics (coming soon)

4. **Admin Dashboard** (`/src/app/admin/tracking-codes/page.tsx`)
   - View all tracking codes
   - Monitor customization rates
   - Track aggregate performance

5. **Google Analytics Integration** (`/src/components/GoogleAnalytics.tsx`)
   - Custom dimension for tracking codes
   - Event tracking functions (clicks, scans, conversions, revenue)

## Integration with Marketing Materials

### 1. MarketingLink System Integration

When creating a `MarketingLink`, always include the user's universal tracking code:

```typescript
import { buildMarketingLinkUrl } from '@/lib/utils/tracking-integration'
import { getUserTrackingCode } from '@/lib/services/tracking-code.service'

// Get user's tracking code
const trackingData = await getUserTrackingCode(profileId)

// Build marketing link with universal tracking
const marketingUrl = buildMarketingLinkUrl(
  'https://taxgeniuspro.tax/start-filing',
  trackingData.activeCode,
  marketingLink.code, // MarketingLink's specific code
  marketingLink.linkType
)
```

**Schema Consideration**: The `MarketingLink.code` is material-specific, while `Profile.trackingCode` is user-specific. Both should be included in URLs:
- `?ref=TGP-123456` - Universal tracking code (user attribution)
- `&link=atlanta-flyer-2025` - Material-specific code (campaign tracking)

### 2. URL Parameter Structure

**Standard Format:**
```
https://taxgeniuspro.tax/start-filing?ref=<TRACKING_CODE>&link=<LINK_CODE>&utm_source=<SOURCE>&utm_medium=<MEDIUM>&utm_campaign=<CAMPAIGN>
```

**Example:**
```
https://taxgeniuspro.tax/start-filing?ref=TGP-123456&link=atlanta-flyer-2025&utm_source=flyer&utm_medium=print&utm_campaign=tax-season-2025
```

**Parameters:**
- `ref` - Universal tracking code (required)
- `link` - Marketing link code (optional, for material-specific tracking)
- `utm_source` - Traffic source
- `utm_medium` - Marketing medium
- `utm_campaign` - Campaign name
- `utm_content` - Content variant (for A/B testing)
- `utm_term` - Keyword term

### 3. QR Code Generation

QR codes should always point to URLs with tracking parameters:

```typescript
import { buildTrackingUrl } from '@/lib/utils/tracking-integration'
import { generateTrackingQRCode } from '@/lib/services/tracking-code.service'

// Build tracking URL
const trackingUrl = buildTrackingUrl('https://taxgeniuspro.tax/start-filing', {
  trackingCode: 'TGP-123456',
  source: 'flyer',
  medium: 'qr-code',
  campaign: 'tax-season-2025'
})

// Generate QR code
const qrCodeDataUrl = await generateTrackingQRCode(trackingUrl)
```

### 4. Client-Side Tracking

Use Google Analytics tracking functions on the client side:

```typescript
// Track when user clicks a referral link
if (window.trackReferralClick) {
  window.trackReferralClick('TGP-123456', 'FLYER')
}

// Track when user scans a QR code
if (window.trackQRScan) {
  window.trackQRScan('TGP-123456', 'Atlanta Office')
}

// Track lead generation
if (window.trackLeadGeneration) {
  window.trackLeadGeneration('TGP-123456', 'CUSTOMER')
}

// Track conversion
if (window.trackConversion) {
  window.trackConversion('TGP-123456', 'INTAKE_FORM', 0)
}

// Track revenue
if (window.trackRevenue) {
  window.trackRevenue('TGP-123456', 250.00, 'tax_prep_fee')
}
```

### 5. Server-Side Attribution

When processing intake forms, appointments, or conversions:

```typescript
import { getUserByTrackingCode } from '@/lib/services/tracking-code.service'
import { extractTrackingCode } from '@/lib/utils/tracking-integration'

// Extract tracking code from URL
const trackingCode = extractTrackingCode(request.headers.get('referer') || '')

if (trackingCode) {
  // Get user who owns this tracking code
  const user = await getUserByTrackingCode(trackingCode)

  if (user) {
    // Attribute lead/conversion to this user
    await createLead({
      ...leadData,
      referredBy: user.id,
      sourceTrackingCode: trackingCode
    })
  }
}
```

## Database Schema Integration

### Current Schema

The `Profile` model includes:
```prisma
model Profile {
  trackingCode        String?  @unique // Auto-generated (TGP-123456)
  customTrackingCode  String?  @unique // Custom code
  trackingCodeChanged Boolean  @default(false)
  trackingCodeQRUrl   String?  @db.Text
}
```

### Recommended Schema Updates

For full MarketingLink integration, consider adding:

1. **Add creatorTrackingCode to MarketingLink:**
```prisma
model MarketingLink {
  // ... existing fields
  creatorTrackingCode String? // Universal tracking code of creator

  @@index([creatorTrackingCode])
}
```

2. **Add tracking code to Lead:**
```prisma
model Lead {
  // ... existing fields
  sourceTrackingCode String? // Universal tracking code that brought this lead

  @@index([sourceTrackingCode])
}
```

3. **Add tracking code to ClientIntake:**
```prisma
model ClientIntake {
  // ... existing fields
  sourceTrackingCode String? // Universal tracking code

  @@index([sourceTrackingCode])
}
```

4. **Add tracking code to LinkClick:**
```prisma
model LinkClick {
  // ... existing fields
  trackingCode String? // Universal tracking code from URL

  @@index([trackingCode])
}
```

## Performance Analytics Integration

### Aggregating Performance by Tracking Code

To show a user their performance across all marketing materials:

```typescript
import { prisma } from '@/lib/prisma'

async function getTrackingCodePerformance(trackingCode: string) {
  // Get all marketing links using this tracking code
  const links = await prisma.marketingLink.findMany({
    where: {
      OR: [
        { url: { contains: `ref=${trackingCode}` } },
        { creatorTrackingCode: trackingCode }
      ]
    }
  })

  // Aggregate performance
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0)
  const totalReturns = links.reduce((sum, link) => sum + link.returns, 0)

  return {
    trackingCode,
    totalClicks,
    totalConversions,
    totalReturns,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
  }
}
```

### Google Analytics Custom Dimension

The tracking code is sent to Google Analytics as a custom dimension:

```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
  tracking_code: 'TGP-123456',
  custom_map: { 'dimension1': 'tracking_code' }
})
```

You can then query Google Analytics for:
- Page views by tracking code
- Conversions by tracking code
- Revenue by tracking code
- User journey by tracking code

## Migration Guide

### For Existing Users

Run the backfill script to assign tracking codes to existing users:

```bash
npx tsx scripts/backfill-tracking-codes.ts
```

### For Existing MarketingLinks

Update existing marketing links to include creator's tracking code:

```typescript
import { prisma } from '@/lib/prisma'
import { getUserTrackingCode } from '@/lib/services/tracking-code.service'

async function migrateMarketingLinks() {
  const links = await prisma.marketingLink.findMany()

  for (const link of links) {
    // Get creator's tracking code
    const trackingData = await getUserTrackingCode(link.creatorId)

    if (trackingData) {
      // Update URL to include tracking code
      const url = new URL(link.url)
      url.searchParams.set('ref', trackingData.activeCode)

      await prisma.marketingLink.update({
        where: { id: link.id },
        data: {
          url: url.toString(),
          creatorTrackingCode: trackingData.activeCode
        }
      })
    }
  }
}
```

## Best Practices

### 1. Always Use Tracking Codes

Every marketing material should include the creator's universal tracking code:
- ✅ Flyers with QR codes
- ✅ Business cards with QR codes
- ✅ Social media posts
- ✅ Email campaigns
- ✅ Landing pages
- ✅ Digital ads

### 2. Consistent Parameter Naming

Always use:
- `ref` for universal tracking code
- `link` for material-specific code
- `utm_*` for campaign parameters

### 3. QR Code Best Practices

- Generate QR codes with full tracking URLs
- Test QR codes before printing
- Include tracking code in QR code filename
- Store QR codes in database for re-download

### 4. Attribution Windows

Consider implementing attribution windows:
- **First-touch attribution**: Credit first tracking code in user journey
- **Last-touch attribution**: Credit last tracking code before conversion
- **Multi-touch attribution**: Credit all tracking codes in journey

### 5. Privacy Compliance

- Don't track PII in tracking codes
- Follow GDPR/CCPA requirements
- Allow users to opt out of tracking
- Include privacy notice in materials

## Testing

### Test Tracking Code URLs

```bash
# Test auto-generated code
https://taxgeniuspro.tax/start-filing?ref=TGP-123456

# Test custom code
https://taxgeniuspro.tax/start-filing?ref=john-atlanta-tax

# Test with full UTM parameters
https://taxgeniuspro.tax/start-filing?ref=TGP-123456&utm_source=flyer&utm_medium=qr-code&utm_campaign=tax-season-2025
```

### Verify in Google Analytics

1. Open Google Analytics
2. Go to Real-time → Events
3. Trigger a test click with tracking code
4. Verify event appears with correct `tracking_code` dimension

### Verify in Database

```sql
-- Check tracking code assignments
SELECT
  "trackingCode",
  "customTrackingCode",
  "trackingCodeChanged",
  "role"
FROM profiles
WHERE "trackingCode" IS NOT NULL
ORDER BY "createdAt" DESC;

-- Check link attribution
SELECT
  COUNT(*) as total_links,
  "creatorId"
FROM marketing_links
WHERE url LIKE '%ref=%'
GROUP BY "creatorId";
```

## Troubleshooting

### Issue: Tracking code not appearing in GA

**Solution**: Verify GoogleAnalytics component is rendered with `trackingCode` prop:
```tsx
<GoogleAnalytics trackingCode={user.trackingCode} />
```

### Issue: QR code not generating

**Solution**: Check QR code service is installed:
```bash
npm install qrcode
```

### Issue: Custom code already taken

**Solution**: Use the availability check API before showing error to user.

### Issue: Tracking code not found in URL

**Solution**: Ensure URL builder is using `ref` parameter correctly.

## Future Enhancements

### Planned Features

1. **Real-time Performance Dashboard**
   - Live click tracking
   - Conversion funnel visualization
   - Revenue attribution charts

2. **A/B Testing**
   - Test different marketing materials
   - Track performance by variant
   - Auto-optimize based on results

3. **Predictive Analytics**
   - Predict conversion probability
   - Recommend best-performing materials
   - Seasonal trend analysis

4. **Advanced Attribution**
   - Multi-touch attribution models
   - Attribution decay modeling
   - Cross-device tracking

5. **Automated Reporting**
   - Weekly performance emails
   - Monthly analytics reports
   - Custom report builder

## Support

For questions or issues with the tracking code system:
- Check API logs: `/root/.pm2/logs/taxgeniuspro-error.log`
- Review database: Check `profiles` table for tracking code data
- Test API endpoints with Postman/curl
- Contact development team

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Author**: Claude Code
