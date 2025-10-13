# Tax Genius Pro - Epic 5 Planning (Referral Growth Engine)

**Date:** October 9, 2025
**Current Status:** Epic 3 Complete (100%), Epic 4 In Planning
**Next Phase:** Epic 5 - Referral Analytics & Commission Automation

**NOTE:** This document was originally titled "Epic 4" but has been renamed to "Epic 5" to avoid confusion with the actual Epic 4 (AI Content Generation, Landing Pages, E-commerce Store, Academy Foundation). Epic 4 must be completed before Epic 5 begins.

---

## 🎯 Current State Summary

### What's Complete ✅

**Epic 1: Core Foundation (100%)**
- Authentication system (Clerk)
- Database schema (PostgreSQL + Prisma)
- User roles (CLIENT, PREPARER, REFERRER, ADMIN)
- Role-based dashboards

**Epic 2: Referrer Engine (95%)**
- Vanity URL system (TaxGeniusPro.tax/YourName)
- Referral tracking
- Commission structure ($50 per completed return)
- Basic analytics dashboard
- Missing: Advanced analytics, commission automation

**Epic 3: Client-Preparer Workflow (100%)**
- Tax questionnaire with auto-save
- Document upload (S3)
- Preparer client management portal
- Automated "Silent Partner" emails:
  - Documents Received (when client submits)
  - Return Filed (when preparer files)
  - Referral Invitation (post-filing conversion)
- Status update API with email triggers

### Production Deployment

**Live Site:** https://taxgeniuspro.tax
**Server:** PM2 on port 3005
**Database:** PostgreSQL
**Auth:** Clerk
**Email:** Resend (API key needs configuration)

---

## ⚠️ Critical Action Required BEFORE Epic 5

### 1. Configure Resend API Key (URGENT)

**Why:** Email automation is built but not sending live emails

**Steps:**
```bash
# 1. Get Resend API key
# Visit: https://resend.com/api-keys
# Create new API key

# 2. Verify domain (if not already done)
# Visit: https://resend.com/domains
# Add DNS records for taxgeniuspro.tax
# Verify SPF, DKIM, DMARC records

# 3. Add to production environment
cd /root/websites/taxgeniuspro
nano .env.local

# Add these lines:
RESEND_API_KEY=re_...your_key_here
RESEND_FROM_EMAIL=noreply@taxgeniuspro.tax
NEXT_PUBLIC_APP_URL=https://taxgeniuspro.tax

# 4. Restart PM2
pm2 restart taxgeniuspro --update-env
```

**Test Email Sending:**
```bash
# Create a test tax return and update status
curl -X PATCH https://taxgeniuspro.tax/api/submissions/[returnId]/status \
  -H "Authorization: Bearer [clerk_token]" \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_REVIEW"}'

# Check PM2 logs for email confirmation
pm2 logs taxgeniuspro --lines 50
```

---

## 🚀 Epic 5: Referral Analytics & Commission Automation

### Overview

**Goal:** Build viral growth mechanisms to acquire referrers and scale client acquisition

**Priority:** HIGH (Required for business model to scale)

**Estimated Effort:** 3-4 weeks

**Prerequisites:** Epic 4 (AI Content, Landing Pages, Store, Academy) must be complete

---

### Story 5.1: Referral Analytics Dashboard

**Status:** Not Started (0%)

**User Story:**
As a **REFERRER**, I want to see detailed analytics about my referrals so I can optimize my marketing efforts.

**Acceptance Criteria:**

1. **Real-Time Dashboard**
   - Total referrals (all-time)
   - Active referrals (in progress)
   - Completed returns (commission earned)
   - Pending commissions (awaiting filing)
   - Total earnings (lifetime)

2. **Performance Charts**
   - Referrals by month (line chart)
   - Conversion funnel (link clicks → signups → returns filed)
   - Top performing channels (social, email, direct)
   - Commission timeline (when payments expected)

3. **Referral Details Table**
   - Client name (first name only for privacy)
   - Signup date
   - Return status (DRAFT, IN_REVIEW, FILED)
   - Commission status (PENDING, EARNED, PAID)
   - Commission amount

4. **Export Functionality**
   - CSV export of referral data
   - Date range filtering
   - Custom reports

**Technical Implementation:**

**API Endpoints to Create:**
```typescript
GET /api/referrers/analytics
// Returns:
{
  summary: {
    totalReferrals: 45,
    activeReferrals: 12,
    completedReturns: 33,
    totalEarnings: 1650,
    pendingCommissions: 600
  },
  chartData: {
    referralsByMonth: [...],
    conversionFunnel: {...},
    channelPerformance: [...]
  },
  recentReferrals: [...]
}

GET /api/referrers/analytics/export?startDate=2024-01-01&endDate=2024-12-31
// Returns CSV file
```

**Database Queries:**
```typescript
// Aggregation queries needed:
const analytics = await prisma.referral.groupBy({
  by: ['status'],
  where: { referrerId: profile.id },
  _count: true,
  _sum: { commissionEarned: true }
})
```

**UI Components:**
- Recharts for data visualization
- Date range picker (already installed: react-day-picker)
- Export button with CSV generation
- Real-time updates using React Query

**Files to Create:**
- `/src/app/api/referrers/analytics/route.ts`
- `/src/app/api/referrers/analytics/export/route.ts`
- `/src/components/dashboard/ReferralAnalytics.tsx`
- `/src/components/charts/ReferralFunnelChart.tsx`

---

### Story 5.2: Commission Automation System

**Status:** Not Started (0%)

**User Story:**
As a **REFERRER**, I want to automatically earn commissions when my referred clients complete their returns, so I don't have to manually track payments.

**Acceptance Criteria:**

1. **Automatic Commission Creation**
   - When tax return status → FILED
   - Commission record created in database
   - Amount: $50 per completed return
   - Status: PENDING (awaiting payout)

2. **Commission Webhook/Trigger**
   - Integrates with existing status update API
   - Finds referral record by client ID
   - Creates commission entry
   - Updates referral status to COMPLETED
   - Sends commission notification email to referrer

3. **Commission Payout Tracking**
   - Manual payout marking (for MVP)
   - Payout date recorded
   - Commission status → PAID
   - Payment method recorded

4. **Commission History**
   - List all commissions (earned + paid)
   - Filter by status (PENDING, PAID)
   - Total earned vs. total paid
   - Next payout estimate

**Technical Implementation:**

**Enhanced Status Update API:**
```typescript
// In /src/app/api/submissions/[id]/status/route.ts
// Add after email triggers:

if (status === 'FILED') {
  // Find referral for this client
  const referral = await prisma.referral.findFirst({
    where: { clientId: taxReturn.profileId, status: 'ACTIVE' }
  })

  if (referral) {
    // Create commission
    const commission = await prisma.commission.create({
      data: {
        referralId: referral.id,
        referrerId: referral.referrerId,
        amount: 50.00,
        status: 'PENDING',
        taxReturnId: taxReturn.id
      }
    })

    // Update referral status
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'COMPLETED',
        returnFiledDate: new Date(),
        commissionEarned: 50.00
      }
    })

    // Send commission notification email
    await EmailService.sendCommissionEmail(...)
  }
}
```

**New API Endpoints:**
```typescript
GET /api/referrers/commissions
// List all commissions for logged-in referrer

PATCH /api/commissions/[id]/payout
// Admin only: Mark commission as paid
{
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'CHECK',
  paymentReference: string,
  paidDate: Date
}

GET /api/commissions/pending
// Admin dashboard: All pending commissions across all referrers
```

**Database Schema (Already Exists):**
```prisma
model Commission {
  id               String          @id @default(cuid())
  referralId       String
  referral         Referral        @relation(...)
  referrerId       String
  referrer         Profile         @relation(...)
  amount           Decimal
  status           CommissionStatus @default(PENDING)
  earnedDate       DateTime        @default(now())
  paidDate         DateTime?
  paymentMethod    String?
  paymentReference String?
  createdAt        DateTime        @default(now())
}

enum CommissionStatus {
  PENDING
  PAID
  CANCELLED
}
```

**Email Template to Create:**
- `/emails/commission-earned.tsx`
  - Subject: "You've earned $50! 💰"
  - Shows client name (first name only)
  - Commission amount
  - Total earnings to date
  - When to expect payout
  - CTA to view all commissions

**Files to Create/Modify:**
- `/src/app/api/submissions/[id]/status/route.ts` (modify - add commission logic)
- `/src/app/api/referrers/commissions/route.ts` (new)
- `/src/app/api/commissions/[id]/payout/route.ts` (new)
- `/src/app/api/commissions/pending/route.ts` (new - admin)
- `/emails/commission-earned.tsx` (new)
- `/src/lib/services/email.service.ts` (modify - already has sendCommissionEmail method)

---

### Story 5.3: Contest Leaderboards

**Status:** Not Started (0%)

**User Story:**
As a **REFERRER**, I want to see how I rank against other referrers in monthly contests, so I can compete for prizes like trips and bonuses.

**Acceptance Criteria:**

1. **Active Contest Display**
   - Show current month's contest
   - Contest type (Most Referrals, Most Returns Filed, Highest Earnings)
   - Prize description (e.g., "Free trip to Hawaii!")
   - Contest end date
   - Time remaining

2. **Leaderboard Rankings**
   - Top 10 referrers displayed
   - Current user's rank highlighted
   - Metrics shown: referrals, returns, earnings (based on contest type)
   - Real-time updates

3. **Contest Rules**
   - Clear eligibility criteria
   - How winner is determined
   - Prize details
   - Past contest winners

4. **Admin Contest Management**
   - Create new contest
   - Set start/end dates
   - Define contest type and prize
   - Close contest and declare winner
   - Archive past contests

**Technical Implementation:**

**Database Schema (Already Exists):**
```prisma
model Contest {
  id               String     @id @default(cuid())
  title            String
  description      String?
  startDate        DateTime
  endDate          DateTime
  contestType      ContestType
  prizeDescription String?
  isActive         Boolean    @default(true)

  participants     ContestParticipant[]
  leaderboard      ContestLeaderboard[]
}

enum ContestType {
  MOST_REFERRALS
  MOST_RETURNS
  HIGHEST_EARNINGS
}

model ContestLeaderboard {
  id         String   @id @default(cuid())
  contestId  String
  contest    Contest  @relation(...)
  profileId  String
  profile    Profile  @relation(...)
  rank       Int
  score      Decimal
  prize      String?
}
```

**API Endpoints to Create:**
```typescript
GET /api/contests/active
// Returns current active contest(s)

GET /api/contests/[id]/leaderboard
// Returns top 10 + current user's rank
{
  contest: {...},
  leaderboard: [
    { rank: 1, name: "Sarah J.", score: 25, earnings: 1250 },
    { rank: 2, name: "Mike T.", score: 22, earnings: 1100 },
    ...
  ],
  userRank: {
    rank: 15,
    score: 12,
    earnings: 600
  }
}

// Admin endpoints:
POST /api/contests (create new contest)
PATCH /api/contests/[id] (update contest)
POST /api/contests/[id]/close (close and calculate winners)
```

**Leaderboard Calculation Logic:**
```typescript
// Automated calculation (runs daily via cron)
async function updateLeaderboard(contestId: string) {
  const contest = await prisma.contest.findUnique({ where: { id: contestId }})

  let query = {}
  switch (contest.contestType) {
    case 'MOST_REFERRALS':
      query = {
        groupBy: ['referrerId'],
        _count: { id: true },
        where: {
          signupDate: { gte: contest.startDate, lte: contest.endDate }
        },
        orderBy: { _count: { id: 'desc' }}
      }
      break

    case 'MOST_RETURNS':
      query = {
        groupBy: ['referrerId'],
        _count: { id: true },
        where: {
          returnFiledDate: { gte: contest.startDate, lte: contest.endDate },
          status: 'COMPLETED'
        },
        orderBy: { _count: { id: 'desc' }}
      }
      break

    case 'HIGHEST_EARNINGS':
      query = {
        groupBy: ['referrerId'],
        _sum: { commissionEarned: true },
        where: {
          returnFiledDate: { gte: contest.startDate, lte: contest.endDate }
        },
        orderBy: { _sum: { commissionEarned: 'desc' }}
      }
      break
  }

  const results = await prisma.referral.groupBy(query)

  // Update leaderboard table
  await prisma.contestLeaderboard.createMany({
    data: results.map((r, idx) => ({
      contestId,
      profileId: r.referrerId,
      rank: idx + 1,
      score: r._count?.id || r._sum?.commissionEarned
    }))
  })
}
```

**UI Components:**
- Leaderboard table with animated rankings
- Contest countdown timer
- "You are ranked #X" highlight
- Prize display with imagery
- Past winners showcase

**Files to Create:**
- `/src/app/api/contests/active/route.ts`
- `/src/app/api/contests/[id]/leaderboard/route.ts`
- `/src/app/api/contests/route.ts` (admin CRUD)
- `/src/app/api/contests/[id]/close/route.ts` (admin)
- `/src/components/contests/Leaderboard.tsx`
- `/src/components/contests/ContestCard.tsx`
- `/src/lib/cron/update-leaderboards.ts` (background job)

---

### Story 5.4: Social Sharing & Marketing Tools

**Status:** Not Started (0%)

**User Story:**
As a **REFERRER**, I want easy-to-use sharing tools so I can promote my referral link on social media and via email.

**Acceptance Criteria:**

1. **Share Button Toolkit**
   - Pre-written social media posts
   - One-click share to Facebook, Twitter/X, LinkedIn, Instagram
   - Copy link button
   - QR code generator for offline sharing

2. **Marketing Assets Library**
   - Branded social media graphics (1080x1080, 1200x628)
   - Email templates for personal outreach
   - Text message templates
   - Printable flyers (PDF)
   - Digital business cards

3. **Tracking Links**
   - UTM parameters auto-added to shared links
   - Track which channel performs best
   - A/B test different messaging

4. **Referral Link Customization**
   - Vanity URL: TaxGeniusPro.tax/[YourName]
   - Custom landing page with referrer's photo/bio
   - Personalized testimonial

**Technical Implementation:**

**Share API Endpoint:**
```typescript
GET /api/referrers/share-kit
// Returns:
{
  referralUrl: "https://taxgeniuspro.tax/sarah",
  qrCode: "data:image/png;base64,...",
  socialPosts: [
    {
      platform: "facebook",
      text: "Just filed my taxes and got a $2,500 refund! 🎉 If you need help with your taxes...",
      url: "https://taxgeniuspro.tax/sarah?utm_source=facebook&utm_medium=social"
    },
    {
      platform: "twitter",
      text: "Tax season doesn't have to be stressful! I use @TaxGeniusPro and...",
      url: "https://taxgeniuspro.tax/sarah?utm_source=twitter&utm_medium=social"
    }
  ],
  emailTemplate: "...",
  assets: [
    { type: "image", size: "1080x1080", url: "/assets/social-square.png" },
    { type: "pdf", name: "Printable Flyer", url: "/assets/flyer.pdf" }
  ]
}
```

**QR Code Generation:**
```typescript
import QRCode from 'qrcode'

const qrCodeDataUrl = await QRCode.toDataURL(
  `https://taxgeniuspro.tax/${vanitySlug}`,
  { width: 300, margin: 2 }
)
```

**Analytics Tracking:**
```typescript
// Track share events
POST /api/referrals/track
{
  referrerId: "...",
  eventType: "LINK_SHARED",
  platform: "facebook",
  metadata: { utm_source: "facebook", utm_medium: "social" }
}

// Track clicks with UTM parameters
// Middleware in middleware.ts captures utm_* params and logs to ReferralAnalytics
```

**Marketing Assets:**
- Create Canva templates with Tax Genius Pro branding
- Store in `/public/assets/marketing/`
- Provide download links in Share Kit API
- Include customizable fields (referrer name, photo)

**Files to Create:**
- `/src/app/api/referrers/share-kit/route.ts`
- `/src/components/sharing/ShareButton.tsx`
- `/src/components/sharing/QRCodeDisplay.tsx`
- `/src/components/sharing/MarketingAssets.tsx`
- `/public/assets/marketing/` (design files)
- `/src/middleware.ts` (modify to track UTM params)

---

### Story 5.5: Gamification & Achievements

**Status:** Not Started (0%)

**User Story:**
As a **REFERRER**, I want to unlock badges and achievements as I hit milestones, so I feel motivated to keep referring.

**Acceptance Criteria:**

1. **Achievement Badges**
   - First Referral 🎯
   - 10 Referrals 🌟
   - 50 Referrals 💎
   - $1,000 Earned 💰
   - $5,000 Earned 🏆
   - Contest Winner 🥇
   - Top 10 Monthly 🔥

2. **Progress Tracking**
   - Visual progress bars to next milestone
   - "X more referrals until next badge"
   - Estimated earnings to next tier

3. **Public Profile Display**
   - Showcase earned badges on profile
   - Share achievements on social media
   - "Verified Top Performer" badge

4. **Reward Tiers**
   - Bronze: 1-9 referrals (5% bonus)
   - Silver: 10-49 referrals (10% bonus)
   - Gold: 50+ referrals (15% bonus)
   - Platinum: 100+ referrals (20% bonus + free trip)

**Technical Implementation:**

**Database Schema:**
```prisma
model Achievement {
  id          String   @id @default(cuid())
  name        String
  description String
  icon        String
  threshold   Int
  type        String   // REFERRAL_COUNT, EARNINGS, CONTEST
  createdAt   DateTime @default(now())

  earned      ProfileAchievement[]
}

model ProfileAchievement {
  id            String      @id @default(cuid())
  profileId     String
  profile       Profile     @relation(...)
  achievementId String
  achievement   Achievement @relation(...)
  earnedDate    DateTime    @default(now())

  @@unique([profileId, achievementId])
}
```

**Achievement Trigger Logic:**
```typescript
// After commission creation, check achievements
async function checkAchievements(referrerId: string) {
  const stats = await prisma.referral.groupBy({
    by: ['referrerId'],
    where: { referrerId, status: 'COMPLETED' },
    _count: { id: true },
    _sum: { commissionEarned: true }
  })

  const totalReferrals = stats[0]._count.id
  const totalEarnings = stats[0]._sum.commissionEarned

  const achievements = await prisma.achievement.findMany()

  for (const achievement of achievements) {
    const alreadyEarned = await prisma.profileAchievement.findUnique({
      where: {
        profileId_achievementId: {
          profileId: referrerId,
          achievementId: achievement.id
        }
      }
    })

    if (!alreadyEarned) {
      let shouldEarn = false

      if (achievement.type === 'REFERRAL_COUNT' && totalReferrals >= achievement.threshold) {
        shouldEarn = true
      }
      if (achievement.type === 'EARNINGS' && totalEarnings >= achievement.threshold) {
        shouldEarn = true
      }

      if (shouldEarn) {
        await prisma.profileAchievement.create({
          data: { profileId: referrerId, achievementId: achievement.id }
        })

        // Send achievement notification email
        await EmailService.sendAchievementEmail(referrerId, achievement)
      }
    }
  }
}
```

**Files to Create:**
- `/src/app/api/achievements/route.ts` (list all achievements)
- `/src/app/api/referrers/achievements/route.ts` (user's earned achievements)
- `/src/components/gamification/AchievementBadge.tsx`
- `/src/components/gamification/ProgressBar.tsx`
- `/emails/achievement-unlocked.tsx`
- `/public/assets/badges/` (SVG badge icons)

---

## 📊 Epic 5 Summary

| Story | Effort | Priority | Dependencies |
|-------|--------|----------|--------------|
| 5.1 Analytics Dashboard | 5 days | HIGH | None |
| 5.2 Commission Automation | 3 days | CRITICAL | 5.1 (optional) |
| 5.3 Contest Leaderboards | 4 days | MEDIUM | 5.2 |
| 5.4 Social Sharing Tools | 3 days | HIGH | None |
| 5.5 Gamification | 4 days | LOW | 5.2 |

**Total Estimated Time:** 19 days (3.8 weeks)

**Recommended Order:**
1. **Story 5.2** - Commission Automation (CRITICAL - business model depends on it)
2. **Story 5.1** - Analytics Dashboard (HIGH - referrers need visibility)
3. **Story 5.4** - Social Sharing (HIGH - enables growth)
4. **Story 5.3** - Contests (MEDIUM - engagement driver)
5. **Story 5.5** - Gamification (LOW - nice to have)

---

## 🛠️ Technical Prerequisites

### Required Integrations

1. **Resend Email** (URGENT)
   - Get API key: https://resend.com
   - Verify domain: taxgeniuspro.tax
   - Add to `.env.local`: `RESEND_API_KEY=re_...`

2. **Payment Processing** (Story 4.2)
   - Stripe Connect for commission payouts
   - OR PayPal Mass Payouts
   - OR Manual ACH transfers

3. **Cron Jobs** (Story 4.3)
   - Leaderboard updates (daily)
   - Commission calculations (on status change)
   - Contest winner selection (end of month)
   - Options: Vercel Cron, GitHub Actions, or Bull queue

4. **File Storage** (Story 4.4)
   - Marketing assets storage
   - Already using S3 for documents
   - Reuse same bucket or create `/marketing/` folder

---

## 🎨 Design Assets Needed

For Story 4.4 (Social Sharing):
- Facebook post template (1200x628)
- Instagram post template (1080x1080)
- Twitter/X header (1500x500)
- Email signature graphic
- Printable flyer (8.5x11 PDF)
- Digital business card

For Story 4.5 (Gamification):
- Achievement badge icons (SVG)
- Progress bar designs
- Tier level graphics (Bronze, Silver, Gold, Platinum)

**Tool:** Canva with Tax Genius Pro brand colors (#ff6b35, etc.)

---

## 📈 Success Metrics (Epic 5)

After Epic 5 completion, we should be able to track:

1. **Referrer Engagement:**
   - Active referrers (logged in last 30 days)
   - Average referrals per referrer
   - Referrer retention rate

2. **Conversion Funnel:**
   - Link clicks → Signups → Returns filed
   - Conversion rate at each stage
   - Drop-off points

3. **Revenue Metrics:**
   - Commission payout rate
   - Average earnings per referrer
   - Total platform GMV (Gross Merchandise Value)

4. **Viral Coefficient:**
   - K-factor (average referrals per user)
   - Time to first referral
   - Referrer lifecycle value

5. **Contest Performance:**
   - Participation rate
   - Winners' average performance
   - Prize ROI

---

## 🚨 Known Issues to Address

### From Epic 3:

1. **Resend API Key Missing**
   - Emails built but not sending
   - Need to configure in production
   - Test email flow end-to-end

2. **User Migration Path**
   - Epic 1 AC6 (Lucia → Clerk migration)
   - Not implemented yet
   - Low priority (no Lucia users in production)

### Database Performance:

3. **Index Optimization**
   - Add indexes for leaderboard queries
   - Optimize referral analytics aggregations
   - Consider materialized views for complex queries

4. **Rate Limiting**
   - Add rate limiting to public APIs
   - Prevent abuse of referral tracking
   - Use upstash-ratelimit (already in deps)

---

## 💡 Quick Wins (Can be done in parallel)

While working on Epic 5, these small improvements can be made:

1. **Add Error Boundary Components**
   - Graceful error handling in dashboards
   - User-friendly error messages

2. **Improve Loading States**
   - Skeleton loaders for dashboard data
   - Optimistic UI updates

3. **Add Toast Notifications**
   - Success messages for actions
   - Error notifications
   - Already have `sonner` installed

4. **SEO Optimization**
   - Meta tags for referral landing pages
   - Open Graph images
   - Sitemap generation

5. **Mobile Responsive Fixes**
   - Test all dashboards on mobile
   - Fix any layout issues
   - Optimize touch interactions

---

## 📋 Handoff Checklist

Before starting Epic 5, ensure:

- [ ] Resend API key configured and tested
- [ ] Epic 4 completed (AI Content, Landing Pages, Store, Academy)
- [ ] All Epic 3 emails sending successfully
- [ ] Database indexes reviewed and optimized
- [ ] PM2 process stable and monitored
- [ ] Git repository clean (commit Epic 4 work)
- [ ] Documentation updated (this handoff doc)
- [ ] Team briefed on Epic 5 scope
- [ ] Design assets requested from designer
- [ ] Payment processor chosen (Stripe/PayPal)
- [ ] Cron job strategy decided

---

## 🔗 Useful Resources

**Documentation:**
- Epic 3 Completion: `/docs/EPIC-3-COMPLETE.md`
- Epic 4 PRD: `/docs/prd/epic-4-marketing-growth-enhanced.md`
- Architecture: `/docs/architecture/`
- Epic 5 PRD: To be created when Epic 4 is complete

**Codebase:**
- Email Templates: `/emails/`
- API Routes: `/src/app/api/`
- Components: `/src/components/`
- Database: `/prisma/schema.prisma`

**External:**
- Resend Docs: https://resend.com/docs
- Stripe Connect: https://stripe.com/docs/connect
- Recharts: https://recharts.org
- React Query: https://tanstack.com/query

---

## 🎯 Final Note

Epic 5 is where the **viral growth engine** comes to life. Stories 5.2 (Commission Automation) and 5.4 (Social Sharing) are **critical path** items that directly enable the business model.

Focus on getting commission automation working first, then build visibility and engagement tools around it.

**Estimated completion:** 3-4 weeks with focused development

**Recommended approach:**
1. Week 1: Commission automation + basic analytics
2. Week 2: Social sharing tools + advanced analytics
3. Week 3: Contest system + leaderboards
4. Week 4: Gamification + polish + testing

---

**Questions?** Review Epic 4 PRD ([docs/prd/epic-4-marketing-growth-enhanced.md](prd/epic-4-marketing-growth-enhanced.md)) or check existing code patterns in `/src/app/api/` for reference implementations.

**Ready to start?** Begin with Epic 4 completion first, then move to Epic 5 Story 5.2 (Commission Automation) - it's the foundation for the referral engine.

---

*Last Updated: October 10, 2025 (Renamed from Epic 4 to Epic 5)*
*Tax Genius Pro - Epic 5 Planning Document*
