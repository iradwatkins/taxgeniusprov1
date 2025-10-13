# Story 4.3: E-commerce Store - Deployment Quick Start

## Status: READY FOR DEPLOYMENT

**Date:** 2025-10-10
**QA Gate:** ✅ PASS (98/100)

---

## 1. Environment Variables (REQUIRED)

Add these to your `.env.local` file:

```bash
# Stripe API Keys - Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret - CRITICAL - See section 2 below
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=https://taxgeniuspro.tax
```

---

## 2. Stripe Webhook Setup (MANDATORY - 5 minutes)

**⚠️ CRITICAL:** Without this, orders will NOT be created!

### Steps:

1. **Go to Stripe Dashboard:**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```

2. **Click "Add endpoint"**

3. **Configure:**
   ```
   Endpoint URL: https://taxgeniuspro.tax/api/webhooks/stripe
   Description: Tax Genius Pro Store Orders
   ```

4. **Select Events:**
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`

5. **Click "Add endpoint"**

6. **Copy Webhook Secret:**
   - Click "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_`)
   - Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

7. **Test Webhook (Optional but Recommended):**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks to local server
   stripe listen --forward-to localhost:3005/api/webhooks/stripe

   # In another terminal, trigger test
   stripe trigger checkout.session.completed
   ```

---

## 3. Database (Already Done ✅)

- ✅ Schema updated with Product and Order models
- ✅ Migration applied with `npx prisma db push`
- ✅ Database seeded with 3 products

To verify:
```sql
SELECT * FROM products;
SELECT * FROM orders;
```

---

## 4. Build & Deploy

```bash
# 1. Build
npm run build

# 2. Restart server
pm2 restart taxgeniuspro

# 3. Check logs
pm2 logs taxgeniuspro --lines 50
```

---

## 5. Verify Deployment (5 minutes)

### Quick Test:
```bash
# 1. Check store loads
curl https://taxgeniuspro.tax/store

# 2. Check products API
curl https://taxgeniuspro.tax/api/products

# 3. Check webhook endpoint exists (should return 400 for GET)
curl -X POST https://taxgeniuspro.tax/api/webhooks/stripe
```

### Full Test Purchase:
1. Navigate to: https://taxgeniuspro.tax/store
2. Add item to cart
3. Sign in (if needed)
4. Proceed to checkout
5. Use test card: **4242 4242 4242 4242**
6. Complete payment
7. Verify success page shows order confirmation
8. Check database for order:
   ```sql
   SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT 1;
   ```
9. Check Stripe Dashboard → Webhooks → Events for webhook delivery

---

## 6. Replace Placeholder Images (Optional but Recommended)

Current images are Unsplash placeholders. To use branded images:

1. **Upload images to MinIO or CDN**
2. **Update database:**
   ```sql
   UPDATE products SET "imageUrl" = 'https://yourdomain.com/images/tshirt.jpg' WHERE id = 'tshirt-tax-genius-pro';
   UPDATE products SET "imageUrl" = 'https://yourdomain.com/images/business-cards.jpg' WHERE id = 'business-cards-500';
   UPDATE products SET "imageUrl" = 'https://yourdomain.com/images/welcome-kit.jpg' WHERE id = 'referrer-welcome-kit';
   ```

---

## 7. Switch to Production Mode (When Ready)

1. **Get Production Stripe Keys:**
   ```
   https://dashboard.stripe.com/apikeys
   ```

2. **Update .env.local:**
   ```bash
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Create Production Webhook:**
   - Same process as test mode webhook
   - Use production keys
   - Update `STRIPE_WEBHOOK_SECRET` with production secret

4. **Test Thoroughly First:**
   - ⚠️ DO NOT go live without testing in test mode first
   - Complete at least 3 test purchases
   - Verify all webhooks deliver successfully
   - Verify orders create correctly

---

## 8. Monitoring After Deployment

```bash
# Check for Stripe-related errors
pm2 logs taxgeniuspro | grep -i stripe

# Check recent orders
psql $DATABASE_URL -c "SELECT id, status, total, \"createdAt\" FROM orders ORDER BY \"createdAt\" DESC LIMIT 10;"

# Check webhook delivery in Stripe Dashboard
# https://dashboard.stripe.com/test/webhooks → Events tab
```

---

## 9. Common Issues & Solutions

### Issue: "STRIPE_SECRET_KEY is not set" error
**Solution:** Add Stripe keys to `.env.local` and restart server

### Issue: Webhook not triggering
**Solution:**
1. Check webhook endpoint created in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Check PM2 logs for webhook errors
4. Test with Stripe CLI

### Issue: Order not created after payment
**Solution:**
1. Check webhook delivered successfully in Stripe Dashboard
2. Check PM2 logs for errors during webhook processing
3. Verify database connection healthy
4. Verify `stripeSessionId` matches between Stripe and database

### Issue: Price validation failing
**Solution:**
1. Check product prices in database match expected values
2. Verify cart prices not tampered in localStorage
3. Check PM2 logs for specific validation errors

---

## 10. Security Checklist

- [x] ✅ Webhook signature verification implemented (AC22)
- [x] ✅ Order persistence in database (AC23)
- [x] ✅ Server-side price validation (AC24)
- [x] ✅ Stripe keys stored in environment variables (not in code)
- [x] ✅ Webhook secret kept secure
- [x] ✅ Database queries use parameterized queries (Prisma)
- [x] ✅ Authentication required for checkout

---

## Support Resources

- **Implementation Report:** `docs/STORY-4.3-IMPLEMENTATION-REPORT.md`
- **Story Documentation:** `docs/stories/4.3.ecommerce-store.md`
- **QA Gate:** `docs/qa/gates/4.3-ecommerce-store.yml`
- **Stripe Documentation:** https://stripe.com/docs/payments/checkout
- **Webhook Testing:** https://stripe.com/docs/webhooks/test

---

## Rollback Plan (If Needed)

If issues occur after deployment:

```bash
# 1. Revert to previous commit
git log --oneline | head -5  # Find previous commit
git revert HEAD

# 2. Rebuild and restart
npm run build
pm2 restart taxgeniuspro

# 3. Database rollback (if needed)
npx prisma migrate resolve --rolled-back add_products_and_orders_tables
```

---

**Estimated Deployment Time:** 15 minutes (excluding testing)
**Estimated Testing Time:** 10 minutes

**Next Steps After Deployment:**
1. Complete test purchase
2. Verify webhook delivery
3. Check database for order
4. Monitor logs for 24 hours
5. Consider adding email notifications (future enhancement)

---

*Last Updated: 2025-10-10*
