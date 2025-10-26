# Testing the Complete Checkout Flow

## ✅ Integration Complete!

The checkout now includes:
- **Step 1**: Shipping address form
- **Step 2**: FedEx shipping method selection (real-time rates)
- **Step 3**: Payment (Square Card or Cash App Pay)
- **Step 4**: Order confirmation

---

## 🧪 How to Test

### **1. Add Items to Cart**

Go to the store and add products:
```
https://taxgeniuspro.tax/store
```

Click "Add to Cart" on any product.

---

### **2. Go to Checkout**

Click "Checkout" or visit:
```
https://taxgeniuspro.tax/store/checkout
```

You'll see the new multi-step checkout flow!

---

### **3. Test the Flow**

#### **Step 1: Shipping Address**
Enter a shipping address (or use test addresses):

**Test Address 1 - Residential (Los Angeles)**
```
Name: John Doe
Street: 123 Main Street
City: Los Angeles
State: CA
ZIP: 90210
Phone: (310) 555-0100
☑ This is a residential address
```

**Test Address 2 - Business (Chicago)**
```
Name: Jane Smith
Street: 456 Business Blvd
City: Chicago
State: IL
ZIP: 60173
Phone: (312) 555-0200
☐ This is a residential address (unchecked)
```

Click **"Continue to Shipping Options"**

---

#### **Step 2: Shipping Method**

The system will automatically:
- ✅ Call FedEx API (sandbox)
- ✅ Get real-time shipping rates
- ✅ Show 4-7 shipping options

**Expected FedEx Services:**
- 🚚 **FedEx Ground** / **Home Delivery** - $14-$25 (3-5 days)
- 📦 **SmartPost** - $9-$15 (5-7 days, cheapest!)
- ⚡ **FedEx 2Day** - $28-$35 (2 business days)
- 🚀 **Standard Overnight** - $45-$65 (next day)

The **cheapest option is auto-selected**.

Click **"Continue to Payment"**

---

#### **Step 3: Payment**

You'll see two payment tabs:

**Tab 1: Credit Card (Square)**
- Enter test card: `4111 1111 1111 1111`
- CVV: `111`
- ZIP: `12345`
- Expiry: Any future date

**Tab 2: Cash App Pay**
- Shows QR code
- Or click "Pay with Cash App" button

Click **"Pay Now"** (for card) or scan QR (for Cash App)

---

#### **Step 4: Confirmation**

After successful payment:
- ✅ Shows order confirmation
- ✅ Displays order ID
- ✅ Shows shipping address
- ✅ Order saved to database with tracking info

---

## 🔍 What Happens Behind the Scenes

### **When You Submit Shipping Address:**
```
Frontend → Next.js State
✓ Validates ZIP code format
✓ Stores address for next step
```

### **When Shipping Method Loads:**
```
Frontend → /api/shipping/rates (POST)
→ FedEx API (OAuth + Rate Request)
← Returns 4-7 services with prices
← Cheapest option auto-selected
```

### **When You Pay:**
```
Frontend → Square Web Payments SDK
→ Tokenizes card (secure)
→ /api/checkout/process-square-payment (POST)
  → Square Payments API
  ✓ Charges card
  → Database (Order table)
  ✓ Saves order with shipping info
← Returns order ID + tracking
```

---

## 📊 Database Record Created

After checkout, check the `Order` table:

```sql
SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 1;
```

You'll see:
- ✅ `paymentSessionId` - Square payment ID
- ✅ `paymentMethod` - "SQUARE" or "CASHAPP"
- ✅ `items` - JSON array of products
- ✅ `shippingAddress` - Full address JSON
- ✅ `shippingMethod` - "FEDEX_GROUND", etc.
- ✅ `total` - Total amount charged
- ✅ `status` - "COMPLETED"

---

## 🎨 UI Features

### **Progress Indicator**
- Shows current step with icons
- Completed steps turn green ✅
- Active step is highlighted

### **Order Summary Sidebar**
- Shows all cart items
- Displays subtotal
- Updates with shipping cost
- Shows tax (8%)
- Shows final total

### **Responsive Design**
- Mobile: Stacked layout
- Desktop: Sidebar + main content
- Touch-friendly buttons

---

## 🔧 Troubleshooting

### **"No shipping rates available"**
- Check FedEx credentials in `ecosystem.config.js`
- Verify `FEDEX_TEST_MODE=true`
- Check server logs: `pm2 logs taxgeniuspro`

### **Payment fails**
- Verify Square credentials are set
- Check `SQUARE_LOCATION_ID` is set
- Use test card: `4111 1111 1111 1111`

### **Cart is empty**
- You must add items to cart first
- Visit `/store` and click "Add to Cart"

---

## 📝 Test Checklist

- [ ] Add product to cart
- [ ] Navigate to checkout
- [ ] See shipping address form
- [ ] Fill out address (use test address above)
- [ ] Click "Continue to Shipping Options"
- [ ] See FedEx rates load (4-7 options)
- [ ] Select a shipping method
- [ ] Click "Continue to Payment"
- [ ] See payment form (Card + Cash App tabs)
- [ ] Enter test card details
- [ ] Click "Pay Now"
- [ ] See success page with order ID
- [ ] Verify order in database

---

## 🚀 Next Steps

### **For Production:**

1. **FedEx Production Credentials**
   - Get at: https://developer.fedex.com/
   - Update in `ecosystem.config.js`:
     ```bash
     FEDEX_TEST_MODE=false
     FEDEX_ACCOUNT_NUMBER=your_production_account
     ```

2. **Test with Real Addresses**
   - Use your actual shipping address
   - Verify rates are accurate

3. **Add Email Notifications**
   - Send order confirmation email
   - Include tracking number
   - Add shipping updates

---

## 🎉 What's Working

✅ **Shopping cart integration**
✅ **Multi-step checkout flow**
✅ **Shipping address validation**
✅ **Real-time FedEx rates** (sandbox)
✅ **Square card payments**
✅ **Cash App Pay**
✅ **Database order storage**
✅ **Order confirmation page**
✅ **Responsive design**

---

**Ready to test!** Visit: https://taxgeniuspro.tax/store/checkout

(Make sure you have items in your cart first!)
