# Clerk Dashboard Configuration Guide

## Complete Setup Instructions for Tax Genius Pro

This guide walks you through completing the Clerk dashboard setup to enable all authentication features.

---

## Step 1: Access Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Sign in with your Clerk account
3. Select your **Tax Genius Pro** application

---

## Step 2: Add Production Domain

### Navigate to: **Domains** (in sidebar)

1. Click **"Add domain"**
2. Enter: `taxgeniuspro.tax`
3. Click **"Add domain"**
4. **Verify DNS** (if required):
   - Add CNAME record provided by Clerk to your DNS
   - Wait for verification (can take 5-10 minutes)

### Set as Primary Domain:
- Click the ⋮ menu next to `taxgeniuspro.tax`
- Select **"Make primary"**

✅ **Result**: Users can now sign in at taxgeniuspro.tax

---

## Step 3: Configure Sign-In/Sign-Up URLs

### Navigate to: **Paths** (under Account Portal)

Set the following paths:

| Setting | Value |
|---------|-------|
| **Sign in URL** | `/auth/login` |
| **Sign up URL** | `/auth/signup` |
| **After sign in** | `/dashboard` *(middleware handles role redirect)* |
| **After sign up** | `/auth/select-role` |
| **User profile** | `/dashboard/settings` |

✅ **Result**: Redirects work correctly

---

## Step 4: Enable OAuth Providers

### Navigate to: **SSO & Social** (in sidebar)

### Google OAuth:
1. Click **"Add connection"** → **Google**
2. You'll need Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create a new project or use existing
   - Enable Google OAuth API
   - Create OAuth 2.0 Client ID
   - **Authorized redirect URIs**: Copy from Clerk (looks like `https://accounts.clerk.dev/...`)
3. Copy **Client ID** and **Client Secret** from Google
4. Paste into Clerk
5. Click **"Save"**
6. Toggle **"Enable for sign-up and sign-in"**

### Facebook OAuth (Optional):
1. Click **"Add connection"** → **Facebook**
2. Follow similar process with Facebook Developer Console
3. Get App ID and App Secret
4. Paste into Clerk

✅ **Result**: Users can sign in with Google/Facebook

---

## Step 5: Enable Email Magic Links

### Navigate to: **Email, Phone, Username** (under User & Authentication)

### Email Configuration:
1. Find **"Email verification"** section
2. Toggle **ON** → **"Email verification link"**
3. Select **"At sign-up"** (optional: also "At sign-in")

### Magic Link Sign-In (Optional):
1. Find **"Email address"** section
2. Enable **"Email link"** as a sign-in method
3. Users can now sign in without password

✅ **Result**: Passwordless authentication available

---

## Step 6: Configure Email Sending

### Navigate to: **Emails** (in sidebar)

### Option A: Use Clerk's Built-in Email (Easiest)
- Clerk sends emails from their domain
- **No setup required** ✅
- Limited customization

### Option B: Use Your Own Domain (Resend Integration)
1. Go to **"Email settings"**
2. Select **"Custom SMTP"** or **"Resend"**
3. If using Resend:
   - Enter your Resend API key: `RESEND_API_KEY`
   - Set **From email**: `noreply@taxgeniuspro.tax`
   - Verify domain in Resend dashboard
4. Click **"Save"**

✅ **Result**: Branded emails from your domain

---

## Step 7: Customize Appearance

### Navigate to: **Customization** (in sidebar)

### Theme Settings:
1. **Brand Color**: `#ff6b35` (Tax Genius orange)
2. **Logo**: Upload Tax Genius Pro logo
3. **Background**: Match your website design

### Clerk Components:
```typescript
// Already configured in your code:
<SignIn appearance={{
  elements: {
    rootBox: 'mx-auto',
    card: 'shadow-xl'
  }
}} />
```

✅ **Result**: Branded sign-in experience

---

## Step 8: Set Up Security

### Navigate to: **Attack Protection** (under Security)

Enable recommended settings:
- ✅ **Bot detection**: ON
- ✅ **Email enumeration protection**: ON
- ✅ **Rate limiting**: ON (default limits OK)
- ✅ **CAPTCHA**: ON (for suspicious activity)

### Session Settings:
- **Session timeout**: 7 days (default)
- **Inactivity timeout**: 30 minutes

✅ **Result**: Production-grade security

---

## Step 9: Create Test Users

### Navigate to: **Users** (in sidebar)

Create 3 test users (one per role):

1. **Client Test User**:
   - Email: `client-test@taxgeniuspro.tax`
   - Set role metadata after creation

2. **Preparer Test User**:
   - Email: `preparer-test@taxgeniuspro.tax`

3. **Referrer Test User**:
   - Email: `referrer-test@taxgeniuspro.tax`

### Set User Metadata:
1. Click on user
2. Go to **"Metadata"** tab
3. Add to **Public Metadata**:
```json
{
  "role": "client"
}
```
4. Replace with: `"preparer"` or `"referrer"` for other users

✅ **Result**: Test users ready for QA

---

## Step 10: Configure Webhooks (Advanced)

### Navigate to: **Webhooks** (in sidebar)

Create webhook for profile syncing:

1. Click **"Add endpoint"**
2. **Endpoint URL**: `https://taxgeniuspro.tax/api/webhooks/clerk`
3. **Events to listen for**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
4. Copy **Signing secret**
5. Add to `.env.local`:
```bash
CLERK_WEBHOOK_SECRET="whsec_..."
```

✅ **Result**: Automatic profile creation on signup

---

## Step 11: Enable Multi-Factor Authentication (Optional)

### Navigate to: **Multi-factor** (under User & Authentication)

1. Toggle **ON** → **SMS code**
2. Or **Authenticator app (TOTP)**
3. Set as **Optional** or **Required**

✅ **Result**: Extra security for users

---

## Step 12: Set Up Organizations (Future Feature)

### Navigate to: **Organizations** (in sidebar)

For future multi-preparer firms:
- Enable organizations
- Preparers can create firms
- Invite team members

⚠️ **Note**: Not needed for MVP, plan for future

---

## Verification Checklist

After completing setup, test these flows:

### ✅ Test Sign-Up Flow:
1. Go to https://taxgeniuspro.tax/auth/signup
2. Sign up with test email
3. Verify email verification works
4. Complete role selection
5. Land on correct dashboard

### ✅ Test Sign-In Flow:
1. Go to https://taxgeniuspro.tax/auth/login
2. Sign in with email/password
3. Verify redirect to dashboard

### ✅ Test OAuth Flow:
1. Click "Sign in with Google"
2. Authorize with Google account
3. Complete role selection (first time)
4. Verify dashboard access

### ✅ Test Magic Link Flow:
1. Request magic link at login
2. Check email
3. Click link
4. Verify auto sign-in

### ✅ Test Protected Routes:
1. Sign out
2. Try to access https://taxgeniuspro.tax/dashboard/client
3. Should redirect to `/auth/login`
4. Sign in
5. Should redirect to correct dashboard based on role

### ✅ Test Role-Based Access:
1. Sign in as Client
2. Try to access `/dashboard/referrer`
3. Should be blocked or redirected

---

## Production Deployment Checklist

Before going live:

- [ ] Production domain added and verified
- [ ] SSL certificate active (Let's Encrypt)
- [ ] Google OAuth credentials (production, not dev)
- [ ] Email sending configured (Resend recommended)
- [ ] Webhooks endpoint live and tested
- [ ] Test users created for each role
- [ ] All auth flows tested end-to-end
- [ ] Rate limiting enabled
- [ ] Bot protection enabled
- [ ] Session timeouts configured
- [ ] Error pages customized
- [ ] Support email set up for auth issues

---

## Environment Variables Summary

Ensure these are set in `.env.local` (production):

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."  # Change to live key
CLERK_SECRET_KEY="sk_live_..."                    # Change to live key
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signup"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/auth/select-role"

# Clerk Webhooks
CLERK_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@taxgeniuspro.tax"
```

---

## Support & Troubleshooting

### Common Issues:

**"Clerk not loading"**
- Check publishable key is correct
- Verify domain is added to Clerk
- Clear browser cache

**"OAuth not working"**
- Verify redirect URIs match exactly
- Check OAuth provider credentials
- Ensure OAuth consent screen configured

**"Emails not sending"**
- Check Resend API key
- Verify domain in Resend dashboard
- Check spam folder

**"Role not being set"**
- Check `/auth/select-role` page loads
- Verify middleware allows role selection route
- Check Clerk metadata structure

### Need Help?
- Clerk Docs: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Tax Genius Support: support@taxgeniuspro.tax

---

## Status: Configuration Required

**Current Status**: ⚠️ **MANUAL SETUP NEEDED**

**Estimated Time**: 30-45 minutes for complete setup

**Priority**: HIGH - Required for production authentication

**Assigned To**: Platform Administrator

**Deadline**: Before public launch

---

Once completed, update Story 1.1 acceptance criteria:
- [x] AC7: OAuth providers configured
- [x] AC8: Magic link authentication available
- [x] AC9: Cross-browser testing (post-setup)
