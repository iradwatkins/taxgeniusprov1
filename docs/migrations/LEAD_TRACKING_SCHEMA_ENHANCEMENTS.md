# Lead Tracking System - Database Schema Enhancements

**Migration Date:** 2025-10-16
**Purpose:** Add short link generation, 14-day attribution, commission locking, and affiliate bonding

---

## Summary of Changes

### 1. Profile Model Enhancements
**Add short link username fields:**
- `shortLinkUsername` - Unique username for short links (e.g., "irawatkins")
- `shortLinkUsernameChanged` - Boolean to track if username was customized
- `affiliateBondedToPreparerId` - For affiliate→preparer bonding relationship

### 2. Lead Model Enhancements
**Add attribution and commission locking:**
- `referrerUsername` - Username of referrer who brought this lead
- `referrerType` - Type of referrer (TAX_PREPARER, AFFILIATE, CLIENT, ADMIN)
- `commissionRate` - Locked commission rate at lead creation
- `commissionRateLockedAt` - Timestamp when rate was locked
- `attributionMethod` - How attribution was determined (cookie, email_match, direct)
- `attributionCookieId` - Cookie ID used for attribution
- `status` - Enhanced to match Lead→Processing→Completed pipeline

### 3. LinkClick Model Enhancements
**Add email/phone for cross-device matching:**
- `userEmail` - Email entered in form (for device-agnostic attribution)
- `userPhone` - Phone entered in form (for device-agnostic attribution)
- `attributionConfidence` - Score 0-100 indicating attribution certainty

### 4. TaxIntakeLead Model Enhancements
**Add referrer attribution fields:**
- `referrerUsername` - Username who referred this intake
- `referrerType` - Type of referrer
- `attributionMethod` - How we determined the referrer
- `status` - Match Lead status enum (NEW, CONTACTED, QUALIFIED, CONVERTED, DISQUALIFIED)

### 5. New Model: AffiliateBonding
**Track affiliate→preparer relationships:**
```prisma
model AffiliateBonding {
  id                   String   @id @default(cuid())
  affiliateId          String
  affiliate            Profile  @relation("AffiliateBondings", ...)
  preparerId           String
  preparer             Profile  @relation("PreparerBondings", ...)
  bondedAt             DateTime @default(now())
  isActive             Boolean  @default(true)
  commissionStructure  Json?    // Tax preparer's custom commission rates

  @@unique([affiliateId, preparerId])
  @@index([affiliateId, isActive])
  @@index([preparerId, isActive])
}
```

### 6. Commission Model Enhancements
**Add rate locking information:**
- `rateAtCreation` - Commission rate when lead was created
- `calculatedAmount` - Auto-calculated commission amount

---

## Migration SQL

```sql
-- 1. Add short link username to Profile
ALTER TABLE profiles
  ADD COLUMN short_link_username VARCHAR(50) UNIQUE,
  ADD COLUMN short_link_username_changed BOOLEAN DEFAULT FALSE,
  ADD COLUMN affiliate_bonded_to_preparer_id VARCHAR(50);

-- 2. Add commission locking to Lead
ALTER TABLE leads
  ADD COLUMN referrer_username VARCHAR(50),
  ADD COLUMN referrer_type VARCHAR(20),
  ADD COLUMN commission_rate DECIMAL(5,2),
  ADD COLUMN commission_rate_locked_at TIMESTAMP,
  ADD COLUMN attribution_method VARCHAR(20),
  ADD COLUMN attribution_cookie_id VARCHAR(100);

-- 3. Add email/phone to LinkClick for attribution
ALTER TABLE link_clicks
  ADD COLUMN user_email VARCHAR(255),
  ADD COLUMN user_phone VARCHAR(20),
  ADD COLUMN attribution_confidence INTEGER DEFAULT 100;

-- 4. Add referrer fields to TaxIntakeLead
ALTER TABLE tax_intake_leads
  ADD COLUMN referrer_username VARCHAR(50),
  ADD COLUMN referrer_type VARCHAR(20),
  ADD COLUMN attribution_method VARCHAR(20);

-- 5. Create AffiliateBonding table
CREATE TABLE affiliate_bondings (
  id VARCHAR(50) PRIMARY KEY,
  affiliate_id VARCHAR(50) NOT NULL,
  preparer_id VARCHAR(50) NOT NULL,
  bonded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  commission_structure JSONB,

  UNIQUE(affiliate_id, preparer_id),
  FOREIGN KEY (affiliate_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (preparer_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_affiliate_bondings_affiliate ON affiliate_bondings(affiliate_id, is_active);
CREATE INDEX idx_affiliate_bondings_preparer ON affiliate_bondings(preparer_id, is_active);

-- 6. Add indexes for performance
CREATE INDEX idx_profiles_short_link_username ON profiles(short_link_username);
CREATE INDEX idx_leads_referrer_username ON leads(referrer_username);
CREATE INDEX idx_leads_commission_rate_locked_at ON leads(commission_rate_locked_at);
CREATE INDEX idx_link_clicks_user_email ON link_clicks(user_email);
CREATE INDEX idx_link_clicks_user_phone ON link_clicks(user_phone);
CREATE INDEX idx_tax_intake_leads_referrer_username ON tax_intake_leads(referrer_username);
```

---

## Best Practices Implemented

✅ **Globally Unique Usernames** - `short_link_username` has unique constraint
✅ **One-Time Username Change** - `short_link_username_changed` enforces policy
✅ **Commission Rate Locking** - Rate locked at lead creation, immutable
✅ **First-Touch Attribution** - `attribution_method` tracks how referrer was determined
✅ **Cross-Device Tracking** - Email/phone in LinkClick for device-agnostic matching
✅ **Affiliate Bonding** - Affiliates permanently bonded to tax preparers
✅ **Performance Indexes** - All lookup fields indexed for fast queries

---

## Rollback Plan

```sql
-- Remove added fields (in reverse order)
DROP INDEX IF EXISTS idx_tax_intake_leads_referrer_username;
DROP INDEX IF EXISTS idx_link_clicks_user_phone;
DROP INDEX IF EXISTS idx_link_clicks_user_email;
DROP INDEX IF EXISTS idx_leads_commission_rate_locked_at;
DROP INDEX IF EXISTS idx_leads_referrer_username;
DROP INDEX IF EXISTS idx_profiles_short_link_username;

DROP TABLE IF EXISTS affiliate_bondings;

ALTER TABLE tax_intake_leads
  DROP COLUMN IF EXISTS attribution_method,
  DROP COLUMN IF EXISTS referrer_type,
  DROP COLUMN IF EXISTS referrer_username;

ALTER TABLE link_clicks
  DROP COLUMN IF EXISTS attribution_confidence,
  DROP COLUMN IF EXISTS user_phone,
  DROP COLUMN IF EXISTS user_email;

ALTER TABLE leads
  DROP COLUMN IF EXISTS attribution_cookie_id,
  DROP COLUMN IF EXISTS attribution_method,
  DROP COLUMN IF EXISTS commission_rate_locked_at,
  DROP COLUMN IF EXISTS commission_rate,
  DROP COLUMN IF EXISTS referrer_type,
  DROP COLUMN IF EXISTS referrer_username;

ALTER TABLE profiles
  DROP COLUMN IF EXISTS affiliate_bonded_to_preparer_id,
  DROP COLUMN IF EXISTS short_link_username_changed,
  DROP COLUMN IF EXISTS short_link_username;
```

---

## Testing Checklist

- [ ] Username uniqueness constraint works
- [ ] Short link generation creates proper URLs
- [ ] Cookie attribution persists 14 days
- [ ] Email/phone matching works across devices
- [ ] Commission rate locks at lead creation
- [ ] Affiliate bonding prevents re-bonding
- [ ] All indexes improve query performance
- [ ] Rollback script works without errors

---

**Status:** Ready for Prisma schema update
**Next Step:** Update `prisma/schema.prisma` with these enhancements
