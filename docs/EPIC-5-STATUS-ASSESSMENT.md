# Epic 5: Referral Growth Engine - Status Assessment

**Assessment Date:** October 10, 2025  
**Prerequisite:** Epic 4 - 100% COMPLETE ✅  
**Status:** Ready to Begin

---

## Executive Summary

**Epic 5 (Referral Growth Engine)** is the final epic in the Tax Genius Pro platform. Based on code analysis, **significant portions are already implemented**:

- ✅ Database models exist (Commission, Contest, Referral, etc.)
- ✅ API route directories exist
- ⏳ Full implementation needs verification
- ⏳ Commission automation logic needs activation

**Recommendation:** Follow same pattern as Epic 4 - verify existing code, complete missing pieces, deploy.

---

## Epic 5 Story Breakdown

### Story 5.1: Referral Analytics Dashboard ⏳

**Status:** Partially Implemented  
**Priority:** HIGH  
**Estimated Completion:** 2-3 days

**What Exists:**
- ✅ `/src/app/api/referrers/` directory exists
- ✅ Referral model in database
- ✅ Referrer dashboard route exists

**What Needs Verification:**
- [ ] Analytics aggregation queries
- [ ] Chart data endpoints
- [ ] CSV export functionality
- [ ] Frontend charts (Recharts)

**Files to Check:**
- `/src/app/api/referrers/analytics/route.ts`
- `/src/components/dashboard/ReferralAnalytics.tsx`

---

### Story 5.2: Commission Automation (CRITICAL) ⚠️

**Status:** Models Exist, Logic Needs Activation  
**Priority:** CRITICAL (Business Model Depends On This)  
**Estimated Completion:** 1-2 days

**What Exists:**
- ✅ Commission model in schema
- ✅ `/src/app/api/payments/commission/` directory
- ✅ Status update API exists (`/api/submissions/[id]/status`)

**What Needs Implementation:**
```typescript
// In /src/app/api/submissions/[id]/status/route.ts
// Add after existing email triggers:

if (status === 'FILED') {
  // 1. Find referral for this client
  // 2. Create commission record
  // 3. Update referral status
  // 4. Send commission email
}
```

**Critical Path:**
1. Verify Commission model structure
2. Add commission creation logic to status update API
3. Create commission email template
4. Test end-to-end flow

**Files to Create/Modify:**
- `/src/app/api/submissions/[id]/status/route.ts` (modify)
- `/emails/commission-earned.tsx` (create if missing)
- `/src/app/api/referrers/commissions/route.ts` (verify)

---

### Story 5.3: Contest Leaderboards ⏳

**Status:** Database Models Exist  
**Priority:** MEDIUM  
**Estimated Completion:** 3-4 days

**What Exists:**
- ✅ Contest model in schema
- ✅ ContestLeaderboard model
- ✅ `/src/app/api/contests/` directory

**What Needs Implementation:**
- [ ] Leaderboard calculation logic
- [ ] Contest CRUD endpoints
- [ ] Frontend leaderboard UI
- [ ] Cron job for daily updates

**Technical Debt:**
- Need cron/background job system (Vercel Cron or Bull queue)
- Leaderboard calculations may be CPU intensive

---

### Story 5.4: Social Sharing Tools ⏳

**Status:** Needs Implementation  
**Priority:** HIGH  
**Estimated Completion:** 2-3 days

**What Exists:**
- ✅ Vanity URL system already works
- ✅ `/src/app/api/referrals/` directory

**What Needs Implementation:**
- [ ] Share kit API endpoint
- [ ] QR code generation (install `qrcode` package)
- [ ] Pre-written social posts
- [ ] Marketing asset library
- [ ] UTM parameter tracking

**Dependencies:**
```bash
npm install qrcode @types/qrcode
```

**Design Assets Needed:**
- Social media templates (Canva)
- Printable flyers (PDF)
- Email templates

---

### Story 5.5: Gamification & Achievements ⏳

**Status:** Needs Implementation  
**Priority:** LOW (Nice to Have)  
**Estimated Completion:** 3-4 days

**What Exists:**
- ⏳ Need to check if Achievement models exist

**What Needs Implementation:**
- [ ] Achievement model (if not exists)
- [ ] ProfileAchievement junction table
- [ ] Achievement trigger logic
- [ ] Badge UI components
- [ ] Achievement email notifications

**Design Assets Needed:**
- Badge SVG icons
- Tier graphics (Bronze, Silver, Gold, Platinum)

---

## Overall Epic 5 Status

| Story | Database | API Routes | Frontend | Email | Status |
|-------|----------|-----------|----------|-------|--------|
| **5.1** Analytics | ✅ | ⏳ | ⏳ | N/A | 40% |
| **5.2** Commissions | ✅ | ⏳ | ⏳ | ❌ | 30% |
| **5.3** Contests | ✅ | ⏳ | ❌ | N/A | 20% |
| **5.4** Social Sharing | ✅ | ❌ | ❌ | N/A | 10% |
| **5.5** Gamification | ❌ | ❌ | ❌ | ❌ | 0% |

**Estimated Overall Completion:** ~25%

---

## Recommended Approach

### Phase 1: Commission Automation (CRITICAL - Week 1)

**Days 1-2: Core Commission Logic**
1. Verify Commission model structure
2. Modify `/api/submissions/[id]/status` to create commissions
3. Create commission email template
4. Test with real data

**Days 3-4: Commission Dashboard**
1. Build `/api/referrers/commissions` endpoint
2. Create commission list UI
3. Add payout tracking (admin)
4. Test end-to-end

**Acceptance:** Referrers automatically earn $50 when returns are filed

---

### Phase 2: Analytics & Visibility (Week 2)

**Days 1-3: Analytics Dashboard**
1. Build aggregation queries
2. Create chart data endpoints
3. Implement Recharts visualizations
4. Add CSV export

**Days 4-5: Social Sharing**
1. Install QR code library
2. Create share kit API
3. Build share buttons UI
4. Track UTM parameters

**Acceptance:** Referrers can see performance and share links easily

---

### Phase 3: Engagement Tools (Week 3 - Optional)

**Days 1-3: Contests**
1. Build contest CRUD APIs
2. Implement leaderboard calculation
3. Create leaderboard UI
4. Set up cron job

**Days 4-5: Gamification**
1. Create Achievement models
2. Build trigger logic
3. Design badge UI
4. Send achievement emails

**Acceptance:** Referrers compete in contests and earn badges

---

## Critical Dependencies

### 1. Email Service (URGENT)

**Status:** ⚠️ RESEND_API_KEY not configured

**Required For:**
- Commission notifications
- Achievement unlocked
- Contest winner announcements

**Action:**
```bash
# Get Resend API key: https://resend.com
echo 'RESEND_API_KEY=re_...' >> .env.local
pm2 restart taxgeniuspro --update-env
```

### 2. Background Jobs (Week 3)

**Required For:**
- Daily leaderboard updates
- Monthly contest winner selection
- Achievement batch processing

**Options:**
- Vercel Cron (simplest for Next.js)
- Bull Queue (if heavy processing)
- GitHub Actions (cron workflows)

### 3. Payment Processing (Week 2-3)

**Required For:**
- Commission payouts to referrers

**Options:**
- Stripe Connect (automated)
- PayPal Mass Payouts (batch)
- Manual ACH (MVP)

---

## Success Criteria

**Epic 5 Complete When:**

✅ **Story 5.2 (CRITICAL):**
- Referrers automatically earn $50 commissions
- Commission records created when returns filed
- Email notifications sent
- Payout tracking functional

✅ **Story 5.1 (HIGH):**
- Analytics dashboard shows referral performance
- Charts display trends (monthly, funnel)
- CSV export works
- Real-time updates

✅ **Story 5.4 (HIGH):**
- Share kit with QR codes, social posts
- UTM tracking functional
- Marketing assets available

⏳ **Story 5.3 (MEDIUM - Optional):**
- Contests can be created
- Leaderboards update daily
- Winners declared monthly

⏳ **Story 5.5 (LOW - Optional):**
- Achievements unlock automatically
- Badges display on profile
- Gamification drives engagement

---

## Risk Assessment

### High Risk Items

1. **Commission Logic Bugs**
   - Risk: Double commissions, missing commissions
   - Mitigation: Idempotency checks, thorough testing
   - Test with multiple scenarios

2. **Email Delivery Failures**
   - Risk: Commission emails not sent
   - Mitigation: Queue system, retry logic
   - Monitor Resend dashboard

3. **Leaderboard Performance**
   - Risk: Slow aggregation queries
   - Mitigation: Database indexes, caching
   - Consider materialized views

### Medium Risk Items

4. **Cron Job Reliability**
   - Risk: Leaderboard not updating
   - Mitigation: Monitoring, manual trigger option
   - Use Vercel Cron with webhooks

5. **Payout Processing**
   - Risk: Manual errors, delays
   - Mitigation: Clear admin UI, audit logs
   - Consider automation (Stripe Connect)

---

## Next Steps

**Immediate Actions:**

1. **Configure Resend API Key** (5 minutes)
   ```bash
   cd /root/websites/taxgeniuspro
   echo 'RESEND_API_KEY=re_...' >> .env.local
   pm2 restart taxgeniuspro --update-env
   ```

2. **Verify Existing Epic 5 Code** (30 minutes)
   - Check `/src/app/api/referrers/`
   - Check `/src/app/api/payments/commission/`
   - Check `/src/app/api/contests/`
   - Document what exists vs. what needs building

3. **Start with Story 5.2** (2 days)
   - Implement commission creation logic
   - Create commission email template
   - Test end-to-end flow
   - Deploy to production

**Estimated Total Time for Epic 5:**
- **Minimum Viable:** 1 week (Stories 5.2, 5.1 only)
- **Recommended:** 2-3 weeks (Add Stories 5.4, 5.3)
- **Complete:** 3-4 weeks (All 5 stories)

---

## Conclusion

**Epic 5 is ~25% complete based on existing infrastructure.**

**Critical Path:**
1. Configure Resend API (5 min)
2. Verify existing code (30 min)
3. Build commission automation (2 days) ← **START HERE**
4. Build analytics dashboard (3 days)
5. Add social sharing (2 days)
6. (Optional) Contests & gamification (7 days)

**BMAD Agent Recommendation:**
Start with **Story 5.2 (Commission Automation)** immediately. This is CRITICAL for the business model and likely already 60-70% built (models + API routes exist).

**Estimated Deployment:**
- Phase 1 (Critical): 1 week
- Phase 2 (High Priority): 2 weeks total
- Phase 3 (Optional): 3-4 weeks total

---

*Epic 5 Status Assessment*  
*Generated: October 10, 2025*  
*BMAD Agent - Tax Genius Pro Implementation*  
*Ready to proceed with Epic 5!*
