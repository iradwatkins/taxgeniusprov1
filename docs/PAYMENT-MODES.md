# Payment Modes Configuration

The e-commerce store supports multiple payment modes. Configure via the `PAYMENT_MODE` environment variable.

## Available Modes

### 1. Test Mode (Default)
**Best for:** Development, testing, demos

```bash
PAYMENT_MODE=test
```

**How it works:**
- No payment processor required
- Orders created immediately without payment
- Redirects directly to success page
- Orders marked as `COMPLETED` in database
- Session IDs prefixed with `test_session_`

**Advantages:**
- ✅ Works immediately without API keys
- ✅ Test full checkout flow
- ✅ No payment processor setup needed
- ✅ Perfect for development

**Testing:**
1. Browse store at `/store`
2. Add products to cart
3. Click "Proceed to Checkout"
4. Automatically creates order and shows success page
5. Order appears in database with `COMPLETED` status

---

### 2. Stripe Mode
**Best for:** Production, real payments

```bash
PAYMENT_MODE=stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How it works:**
- Uses Stripe Checkout for payment processing
- Redirects to Stripe-hosted checkout page
- Webhook creates order after payment confirmation
- Secure payment signature verification

**Setup Required:**
1. Get API keys from https://dashboard.stripe.com/test/apikeys
2. Configure webhook at https://dashboard.stripe.com/test/webhooks
   - URL: `https://taxgeniuspro.tax/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy webhook secret
3. Add all 3 keys to `.env.local`

**Testing:**
- Test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

**Production:**
- Switch to live mode keys in Stripe Dashboard
- Update webhook endpoint to production URL
- Test thoroughly in test mode first

---

### 3. Square Mode
**Best for:** Alternative to Stripe (coming soon)

```bash
PAYMENT_MODE=square
SQUARE_ACCESS_TOKEN=your_access_token
SQUARE_LOCATION_ID=your_location_id
```

**Status:** 🚧 Not yet implemented

**Planned Features:**
- Square Checkout API integration
- Support for Square Reader (in-person payments)
- Square invoicing
- Inventory sync with Square

**Implementation:** Coming in future release

---

## Switching Between Modes

### Development → Test Mode
```bash
# .env.local
PAYMENT_MODE=test
# No other payment variables needed
```

### Test Mode → Stripe
```bash
# .env.local
PAYMENT_MODE=stripe
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Stripe Test → Stripe Production
```bash
# .env.local (production)
PAYMENT_MODE=stripe
STRIPE_SECRET_KEY=sk_live_51...  # Live key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...  # Live key
STRIPE_WEBHOOK_SECRET=whsec_...  # Production webhook secret
```

**Important:** Update webhook URL to production before going live!

---

## Security Notes

### Test Mode
- ⚠️ **DO NOT use in production** - creates orders without payment
- Safe for development/demos only
- Orders marked with `test_session_` prefix for easy identification

### Stripe Mode
- ✅ PCI-compliant hosted checkout
- ✅ Webhook signature verification (prevents fraud)
- ✅ Server-side price validation (prevents tampering)
- ✅ No credit card data touches your server

### Square Mode
- 🚧 Coming soon
- Will follow same security standards as Stripe

---

## Troubleshooting

### "Payment mode not configured" error
```bash
# Add to .env.local
PAYMENT_MODE=test
```

### Stripe checkout fails
1. Check API keys are set correctly
2. Verify keys are for test mode (start with `sk_test_` and `pk_test_`)
3. Check Stripe Dashboard for errors

### Webhook not creating orders
1. Verify `STRIPE_WEBHOOK_SECRET` is set
2. Check webhook endpoint is configured in Stripe Dashboard
3. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3005/api/webhooks/stripe
   ```

### Order shows "Processing" forever
- Webhook may not be configured
- Check Stripe Dashboard → Webhooks → Event Logs
- Verify webhook secret matches

---

## API Response Differences

### Test Mode Response
```json
{
  "url": "https://taxgeniuspro.tax/store/success?session_id=test_session_123",
  "mode": "test",
  "orderId": "cm4abc123"
}
```

### Stripe Mode Response
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_abc123",
  "mode": "stripe"
}
```

### Square Mode Response
```json
{
  "error": "Square integration coming soon",
  "message": "Switch to PAYMENT_MODE=test or PAYMENT_MODE=stripe"
}
```

---

## Feature Comparison

| Feature | Test Mode | Stripe Mode | Square Mode |
|---------|-----------|-------------|-------------|
| **Payment Processing** | ❌ Simulated | ✅ Real | 🚧 Coming |
| **Setup Required** | None | API keys + webhook | TBD |
| **Production Ready** | ❌ No | ✅ Yes | 🚧 No |
| **Cost** | Free | 2.9% + $0.30 | TBD |
| **International** | N/A | ✅ Yes | TBD |
| **Refunds** | Manual DB update | Stripe Dashboard | TBD |
| **Analytics** | Database only | Stripe Dashboard | TBD |

---

## Recommendations

**For Development:**
```bash
PAYMENT_MODE=test
```

**For Staging:**
```bash
PAYMENT_MODE=stripe
# Use Stripe test mode keys
```

**For Production:**
```bash
PAYMENT_MODE=stripe
# Use Stripe live mode keys
# Configure production webhook
```

**For Demos/Testing:**
```bash
PAYMENT_MODE=test
# Quick setup, no external dependencies
```

---

## Future Enhancements

- [ ] PayPal integration
- [ ] Square integration
- [ ] Cryptocurrency payments
- [ ] Apple Pay / Google Pay
- [ ] Buy Now Pay Later (Klarna, Afterpay)

---

## Support

Need help configuring payment modes?
- Email: support@taxgeniuspro.tax
- Docs: `/docs/stories/4.3.ecommerce-store.md`
- Stripe Support: https://support.stripe.com
- Square Support: https://squareup.com/help

---

**Last Updated:** 2025-10-10
**Version:** 1.0
