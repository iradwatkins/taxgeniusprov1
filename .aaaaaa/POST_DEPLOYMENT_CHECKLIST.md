# Post-Deployment Checklist & Monitoring Guide

**Deployment Date:** 2025-01-16
**Commit Hash:** d0548ed
**Branch Deployed:** epic-6-lead-tracking
**Environment:** Production
**Status:** 🟢 **DEPLOYED**

---

## ✅ Immediate Post-Deployment Tasks (First 30 Minutes)

### 1. Service Health Check
```bash
# Check application is running
pm2 status taxgeniuspro

# Check recent logs for errors
pm2 logs taxgeniuspro --lines 100

# Check for any startup errors
tail -f /root/.pm2/logs/taxgeniuspro-error.log
```

**Expected:** ✅ Application running without errors

---

### 2. Database Connection Verification
```bash
# Verify database is accessible
DATABASE_URL="postgresql://taxgeniuspro_user:TaxGenius2024Secure@localhost:5436/taxgeniuspro_db?schema=public" \
PGPASSWORD=TaxGenius2024Secure psql -h localhost -p 5436 -U taxgeniuspro_user -d taxgeniuspro_db \
-c "SELECT COUNT(*) FROM crm_contacts;"
```

**Expected:** ✅ Query returns successfully (likely 0 contacts initially)

---

### 3. Verify New Schema Columns
```sql
-- Check CRM attribution fields exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'crm_contacts'
  AND column_name IN (
    'referrerUsername',
    'referrerType',
    'commissionRate',
    'commissionRateLockedAt',
    'attributionMethod',
    'attributionConfidence'
  )
ORDER BY column_name;
```

**Expected:** ✅ 6 columns returned with correct data types

---

### 4. Test Navigation (Manual)
**Admin Navigation:**
- [ ] Login as admin user
- [ ] Verify all 9 sections visible
- [ ] Click through each navigation item
- [ ] Verify no 404 errors

**Tax Preparer Navigation:**
- [ ] Login as tax preparer
- [ ] Verify correct items visible
- [ ] Check dashboard tabs work
- [ ] Verify analytics page loads

**Affiliate Navigation:**
- [ ] Login as affiliate
- [ ] Verify marketing section visible
- [ ] Check tracking code page
- [ ] Verify earnings page loads

**Expected:** ✅ All navigation items accessible without errors

---

### 5. Test Lead Submission (Critical)
**Manual Test:**
1. Go to customer lead form: `/start-filing`
2. Fill out form with test data
3. Submit form
4. Check for success message

**Backend Verification:**
```sql
-- Check lead was created
SELECT id, "firstName", "lastName", email, type, status
FROM leads
ORDER BY "createdAt" DESC
LIMIT 5;

-- Check CRM contact was auto-created
SELECT id, "contactType", "firstName", "lastName", email, stage,
       "referrerUsername", "commissionRate", "attributionMethod"
FROM crm_contacts
ORDER BY "createdAt" DESC
LIMIT 5;
```

**Expected:**
- ✅ Lead record created in `leads` table
- ✅ CRM contact auto-created in `crm_contacts` table
- ✅ Attribution fields populated (if cookie/attribution present)

---

## 🔍 First 24 Hours Monitoring

### Error Log Monitoring
```bash
# Monitor error logs in real-time
tail -f /root/.pm2/logs/taxgeniuspro-error.log

# Check for CRM-related errors
grep -i "crm" /root/.pm2/logs/taxgeniuspro-error.log | tail -20

# Check for lead API errors
grep -i "lead" /root/.pm2/logs/taxgeniuspro-error.log | tail -20

# Check for attribution errors
grep -i "attribution" /root/.pm2/logs/taxgeniuspro-error.log | tail -20
```

**Action Items:**
- ⚠️ If errors found: Investigate and fix immediately
- ✅ If no errors: Continue monitoring

---

### Database Performance Monitoring
```sql
-- Monitor CRM contact creation rate
SELECT
  DATE_TRUNC('hour', "createdAt") as hour,
  COUNT(*) as contacts_created,
  COUNT("referrerUsername") as with_attribution
FROM crm_contacts
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', "createdAt")
ORDER BY hour DESC;

-- Monitor lead submission rate
SELECT
  DATE_TRUNC('hour', "createdAt") as hour,
  COUNT(*) as leads_submitted,
  COUNT("referrerUsername") as with_attribution
FROM leads
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', "createdAt")
ORDER BY hour DESC;

-- Check for any failed CRM contact creations
SELECT COUNT(*) as total_leads,
       (SELECT COUNT(*) FROM crm_contacts WHERE "createdAt" > NOW() - INTERVAL '24 hours') as total_crm_contacts,
       COUNT(*) - (SELECT COUNT(*) FROM crm_contacts WHERE "createdAt" > NOW() - INTERVAL '24 hours') as missing_crm_contacts
FROM leads
WHERE "createdAt" > NOW() - INTERVAL '24 hours';
```

**Expected:**
- ✅ All leads have corresponding CRM contacts (missing_crm_contacts = 0)
- ✅ Attribution populated for 60%+ of leads

---

### Application Performance
```bash
# Check memory usage
pm2 describe taxgeniuspro | grep -i memory

# Check CPU usage
pm2 describe taxgeniuspro | grep -i cpu

# Check restart count (should be 0 or minimal)
pm2 list | grep taxgeniuspro
```

**Thresholds:**
- ⚠️ Memory > 1GB: Investigate memory leak
- ⚠️ CPU > 80%: Investigate performance bottleneck
- ⚠️ Restarts > 3: Investigate crash cause

---

## 📊 Week 1 Validation (Days 1-7)

### 1. Attribution Data Quality Check
```sql
-- Attribution method distribution
SELECT
  "attributionMethod",
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM crm_contacts
WHERE "createdAt" > NOW() - INTERVAL '7 days'
  AND "attributionMethod" IS NOT NULL
GROUP BY "attributionMethod"
ORDER BY count DESC;
```

**Expected Distribution:**
- Cookie: 60-75%
- Email match: 15-25%
- Phone match: 5-10%
- Direct: 5-10%

**Action Items:**
- ⚠️ If cookie attribution < 50%: Check cookie tracking implementation
- ⚠️ If direct > 30%: Investigate attribution service

---

### 2. Commission Rate Locking Validation
```sql
-- Verify commission rates are locked at creation
SELECT
  contact_type,
  COUNT(*) as total,
  COUNT("commissionRate") as with_rate,
  COUNT("commissionRateLockedAt") as with_lock_time,
  ROUND(AVG("commissionRate"), 2) as avg_rate
FROM crm_contacts
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY contact_type;
```

**Expected:**
- ✅ with_rate = with_lock_time (all rates have lock timestamp)
- ✅ avg_rate matches configured commission tiers

---

### 3. Lead-to-CRM Sync Success Rate
```sql
-- Calculate sync success rate
WITH lead_counts AS (
  SELECT COUNT(*) as total_leads
  FROM leads
  WHERE "createdAt" > NOW() - INTERVAL '7 days'
),
crm_counts AS (
  SELECT COUNT(*) as total_crm_contacts
  FROM crm_contacts
  WHERE "createdAt" > NOW() - INTERVAL '7 days'
    AND "userId" IS NULL -- Leads don't have user accounts yet
)
SELECT
  l.total_leads,
  c.total_crm_contacts,
  ROUND(c.total_crm_contacts::numeric / NULLIF(l.total_leads, 0) * 100, 2) as sync_success_rate
FROM lead_counts l, crm_counts c;
```

**Expected:** ✅ sync_success_rate >= 99%

**Action Items:**
- ⚠️ If < 99%: Check error logs for failed CRM contact creations
- ⚠️ Investigate missing CRM contacts

---

### 4. Navigation Usage Analytics
**Manual Review:**
- Check Google Analytics for navigation click events
- Verify no 404 errors in navigation paths
- Check bounce rate on dashboard pages

**Expected:**
- ✅ No 404 errors from navigation clicks
- ✅ Dashboard bounce rate < 20%

---

### 5. User Feedback
**Collect Feedback From:**
- Admin users: Navigation makes sense?
- Tax preparers: Can find client management tools?
- Affiliates: Can access marketing materials?

**Action Items:**
- Document any confusion or issues
- Plan UI/UX improvements if needed

---

## 🚨 Known Issues & Workarounds

### Issue #1: Empty Database (Currently)
**Status:** Expected behavior
**Description:** Database has minimal data (1 SUPER_ADMIN profile)
**Workaround:** As real users sign up, data will populate
**Action:** Monitor as user base grows

---

### Issue #2: GA4 Events Not Visible Yet
**Status:** Expected delay
**Description:** GA4 events take 24-48 hours to appear in dashboard
**Workaround:** Check browser console for event firing
**Action:** Check GA4 dashboard after 48 hours

---

### Issue #3: Backfill Script Not Run Yet
**Status:** Intentional - no data to backfill
**Description:** Backfill script will be needed when migrating existing data
**Workaround:** Run script when real data exists
**Action:** Schedule backfill when data migration is needed

---

## ✅ Success Criteria Validation

### Immediate (First 24 Hours)
- [x] Application deployed without errors
- [ ] No database errors in logs
- [ ] Lead submission works end-to-end
- [ ] CRM contacts auto-created for new leads
- [ ] Navigation accessible on all pages

### Week 1
- [ ] 100% lead-to-CRM sync success rate
- [ ] Attribution data populated (60%+ of leads)
- [ ] No navigation-related 404 errors
- [ ] Commission rates locked correctly
- [ ] Zero CRM-related crashes

### Week 2-4
- [ ] 80%+ tax preparers use new navigation
- [ ] GA4 events visible in dashboard
- [ ] Attribution reporting accurate
- [ ] Performance metrics within thresholds

---

## 📈 Performance Benchmarks

### Current Baseline (Production)
- **Database Size:** Minimal (1 profile)
- **Lead Submission Rate:** 0/day (new deployment)
- **CRM Contact Count:** 0

### Expected After 30 Days
- **Database Size:** 100-500 profiles
- **Lead Submission Rate:** 5-20/day
- **CRM Contact Count:** 150-600

### Performance Thresholds
- **Database Query Time:** < 500ms
- **Lead API Response Time:** < 2 seconds
- **Dashboard Load Time:** < 3 seconds
- **CRM Contact Creation:** < 1 second

---

## 🔧 Rollback Plan (If Needed)

### When to Rollback
- ⚠️ Critical: Application crashes repeatedly
- ⚠️ Critical: Database corruption detected
- ⚠️ Critical: Lead submissions failing consistently
- ⚠️ High: Performance degradation > 3x baseline

### Rollback Procedure
```bash
# 1. Stop current application
pm2 stop taxgeniuspro

# 2. Checkout previous commit
git checkout 2bdaf6c  # Commit before d0548ed

# 3. Restore dependencies
npm install

# 4. Rollback database migration
npx prisma migrate resolve --rolled-back 20250116_add_crm_attribution

# 5. Restart application
pm2 restart taxgeniuspro

# 6. Verify application health
pm2 logs taxgeniuspro --lines 50
```

### Database Rollback (If Needed)
```sql
-- Remove attribution columns (ONLY if rollback needed)
ALTER TABLE crm_contacts
  DROP COLUMN IF EXISTS "referrerUsername",
  DROP COLUMN IF EXISTS "referrerType",
  DROP COLUMN IF EXISTS "commissionRate",
  DROP COLUMN IF EXISTS "commissionRateLockedAt",
  DROP COLUMN IF EXISTS "attributionMethod",
  DROP COLUMN IF EXISTS "attributionConfidence";
```

**Note:** Rollback should only be used in critical situations. Most issues can be fixed with forward patches.

---

## 📞 Contact & Escalation

### For Issues Found:
1. **Check Error Logs:** Review logs for specific error messages
2. **Check This Document:** See if issue is listed in Known Issues
3. **Review Documentation:** Check implementation docs in `.aaaaaa/`
4. **Database Backup:** Ensure recent backup exists before fixes

### Critical Issue Response:
- **Application Down:** Rollback immediately
- **Data Corruption:** Restore from backup, investigate cause
- **Performance Degradation:** Scale resources, optimize queries
- **Security Issue:** Patch immediately, notify users if needed

---

## 📝 Daily Checklist (First Week)

### Morning Check (9 AM)
- [ ] Review overnight error logs
- [ ] Check database for new CRM contacts
- [ ] Verify lead-to-CRM sync still working
- [ ] Check application uptime (pm2 list)

### Afternoon Check (3 PM)
- [ ] Monitor real-time error logs
- [ ] Check for any user-reported issues
- [ ] Verify attribution data quality

### Evening Check (8 PM)
- [ ] Review daily statistics
- [ ] Check sync success rate
- [ ] Plan fixes for any issues found

---

## 🎯 Week 1 Goals

### Stability
- [ ] Zero application crashes
- [ ] Zero database errors
- [ ] 99%+ lead-to-CRM sync rate

### Functionality
- [ ] All navigation items accessible
- [ ] Lead forms working correctly
- [ ] CRM contacts created with attribution

### Performance
- [ ] Query times < 500ms
- [ ] Dashboard loads < 3 seconds
- [ ] No memory leaks detected

---

## 📊 Metrics Dashboard (Manual Monitoring)

### Daily Metrics to Track
```sql
-- Daily summary query
SELECT
  DATE_TRUNC('day', "createdAt") as date,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN "referrerUsername" IS NOT NULL THEN 1 END) as leads_with_attribution,
  ROUND(AVG(CASE WHEN "commissionRate" IS NOT NULL THEN "commissionRate" END), 2) as avg_commission_rate
FROM leads
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', "createdAt")
ORDER BY date DESC;
```

### Weekly Review Metrics
- Total leads submitted
- Total CRM contacts created
- Attribution coverage %
- Average commission rate
- Navigation 404 errors
- Application uptime %

---

## ✅ Post-Deployment Status

**Deployment Status:** 🟢 **DEPLOYED TO PRODUCTION**

**Next Steps:**
1. ⏳ Complete immediate post-deployment checks (this document)
2. ⏳ Monitor for first 24 hours
3. ⏳ Run validation queries after 1 week
4. ⏳ Schedule GA4 review after 48 hours
5. ⏳ Plan backfill script run (when data exists)

---

**Deployment Date:** 2025-01-16
**Deployed By:** System Administrator
**Monitoring Start:** 2025-01-16
**First Review Date:** 2025-01-17 (24 hours)
**First Week Review:** 2025-01-23 (7 days)

🎉 **Production Deployment Complete - Monitoring Active**
