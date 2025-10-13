# 🧪 E-commerce Store - Test Mode Quickstart

**Ready to test the store immediately without payment setup!**

## Current Status

✅ **Build Successful** - Store is ready to test
✅ **Test Mode Active** - No payment processor needed
✅ **Database Ready** - Products seeded
✅ **All Security Features** - Price validation, order persistence

---

## Quick Test (5 minutes)

### 1. Start the Server (if not running)

```bash
cd /root/websites/taxgeniuspro
npm run dev
# OR for production
npm run build && pm2 restart taxgeniuspro
```

### 2. Test the Store Flow

**Browse Products:**
```
http://localhost:3005/store
```

You'll see 3 products:
- Tax Genius Pro T-Shirt ($24.99)
- Branded Business Cards ($49.99)
- Referrer Welcome Kit ($79.99)

**Add to Cart:**
1. Click "Add to Cart" on any product
2. See cart icon update in header
3. Click cart icon or go to `/store/cart`

**Test Checkout:**
1. Click "Proceed to Checkout" in cart
2. **In test mode:** Instantly redirected to success page
3. Order created in database automatically
4. Cart cleared

**Success Page:**
```
/store/success?session_id=test_session_xxx
```

Shows:
- Order confirmation
- Order ID from database
- Blue banner: "Test Mode - No payment processed"
- Order items and total

---

## What Happens in Test Mode?

```
User clicks "Checkout"
    ↓
Price validation (server-side)
    ↓
Order created IMMEDIATELY in database
    ↓
Redirect to success page
    ↓
Cart cleared
    ↓
Done! (no payment processor)
```

**Test Session IDs:** `test_session_1234567890_user_xyz`

---

## Verify Database Orders

```bash
# SSH to VPS or run locally
psql $DATABASE_URL

# Check orders
SELECT id, total, status, email, "stripeSessionId"
FROM "Order"
WHERE "stripeSessionId" LIKE 'test_session_%';

# Check products
SELECT id, name, price, "isActive" FROM "Product";
```

**Expected Results:**
- ✅ Order exists with `COMPLETED` status
- ✅ Order total matches cart total
- ✅ Session ID starts with `test_session_`

---

## Switch to Real Payments

### Option 1: Stripe (Recommended)

**Step 1: Get Stripe Keys**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" (starts with `pk_test_`)
3. Copy "Secret key" (starts with `sk_test_`)

**Step 2: Configure Webhook**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://taxgeniuspro.tax/api/webhooks/stripe`
4. Events: Select `checkout.session.completed` and `checkout.session.expired`
5. Copy webhook signing secret (starts with `whsec_`)

**Step 3: Update Environment**
```bash
# Edit .env.local
nano .env.local

# Change these lines:
PAYMENT_MODE=stripe
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

**Step 4: Restart**
```bash
pm2 restart taxgeniuspro
```

**Step 5: Test with Stripe**
```
Card: 4242 4242 4242 4242
Expiry: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any valid)
```

Order will be created by webhook after payment.

---

### Option 2: Square (Coming Soon)

```bash
PAYMENT_MODE=square
# Not yet implemented - returns 501 error
```

---

## Troubleshooting

### ❌ "Product not found" error
**Cause:** Products not seeded
**Fix:**
```bash
npx prisma db seed
```

### ❌ Can't add to cart
**Cause:** Cart state not initialized
**Fix:** Refresh page, check browser console

### ❌ Cart doesn't persist
**Cause:** localStorage disabled
**Fix:** Enable cookies/localStorage in browser

### ❌ Checkout button disabled
**Causes:**
1. Cart is empty → Add products
2. Not authenticated → Sign in first

### ❌ Build fails
**Cause:** TypeScript errors
**Fix:**
```bash
npm run build 2>&1 | grep "error"
```

---

## Environment Variables

**Minimal (Test Mode):**
```bash
PAYMENT_MODE=test
# That's it! No payment keys needed
```

**With Stripe:**
```bash
PAYMENT_MODE=stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**With Square (Future):**
```bash
PAYMENT_MODE=square
SQUARE_ACCESS_TOKEN=...
SQUARE_LOCATION_ID=...
```

---

## Testing Checklist

- [ ] Store page loads (`/store`)
- [ ] 3 products visible
- [ ] Product images load
- [ ] Add to cart works
- [ ] Cart icon shows count
- [ ] Cart page displays items (`/store/cart`)
- [ ] Quantity +/- buttons work
- [ ] Remove item works
- [ ] Empty cart shows empty state
- [ ] Checkout requires authentication
- [ ] Checkout creates order
- [ ] Success page shows order details
- [ ] Success page shows "Test Mode" banner
- [ ] Cart clears after checkout
- [ ] Order appears in database

---

## Production Checklist

Before switching to `PAYMENT_MODE=stripe` in production:

- [ ] Get production Stripe keys (not test keys)
- [ ] Configure production webhook endpoint
- [ ] Test in Stripe test mode first
- [ ] Complete at least 3 test purchases
- [ ] Verify webhook triggered for each purchase
- [ ] Verify orders created in database
- [ ] Check webhook logs in Stripe Dashboard
- [ ] Test failed payment scenarios
- [ ] Test cancelled checkout
- [ ] Monitor for 24 hours after launch

---

## Support

**Test Mode Issues:**
- Check: Database seeded?
- Check: Server running?
- Check: Products active?

**Stripe Issues:**
- Check: API keys correct?
- Check: Webhook configured?
- Check: Webhook secret matches?
- Test webhook: `stripe listen --forward-to localhost:3005/api/webhooks/stripe`

**General Issues:**
- Logs: `pm2 logs taxgeniuspro`
- Database: Check Order and Product tables
- Browser: Check console for errors

---

## Next Steps

1. ✅ Test store in test mode (right now!)
2. ⏳ Get Stripe test keys (when ready)
3. ⏳ Configure webhook
4. ⏳ Test with Stripe test mode
5. ⏳ Switch to production Stripe keys

---

**Current Mode:** 🧪 TEST MODE
**Payment Required:** ❌ NO
**Ready to Test:** ✅ YES
**Production Ready:** ⏳ AFTER STRIPE SETUP

---

**Last Updated:** 2025-10-10
**Status:** TEST MODE ACTIVE - READY FOR IMMEDIATE TESTING
