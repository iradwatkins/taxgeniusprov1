# Test Login Credentials

All test users have been created with the password: **Bobby321!**

## 🌐 Sign In URLs
- **Production:** https://taxgeniuspro.tax/auth/signin
- **Alternative:** https://taxgeniuspro.tax/auth/login (redirects to signin)

⚠️ **IMPORTANT:** Always use **taxgeniuspro.tax** in your browser, NOT 0.0.0.0 or localhost.
The server binds to 0.0.0.0:3005 internally, but this address is not accessible from browsers.

## ✨ New Features
- ✅ **Password Visibility Toggle** - Click the eye icon to show/hide your password
- ✅ **Automatic Redirect** - `/auth/login` automatically redirects to `/auth/signin`
- ✅ **Error Handling** - Clear error messages if login fails
- ✅ **Clean Callback URLs** - Redirects use relative paths, no more 0.0.0.0 or localhost in URLs
- ✅ **Global Route Updates** - All 32+ files updated to use consistent `/auth/signin` endpoint

---

## 👥 CLIENT Accounts

| Email | Name | Password |
|-------|------|----------|
| client1@test.com | Sarah Johnson | Bobby321! |
| client2@test.com | Michael Davis | Bobby321! |
| client3@test.com | Emily Martinez | Bobby321! |

**Dashboard:** `/dashboard/client`

---

## 💼 TAX PREPARER Accounts

| Email | Name | Password |
|-------|------|----------|
| taxpreparer1@test.com | David Wilson | Bobby321! |
| taxpreparer2@test.com | Jennifer Anderson | Bobby321! |
| taxpreparer3@test.com | Robert Taylor | Bobby321! |

**Dashboard:** `/dashboard/tax-preparer`

---

## 🤝 AFFILIATE Accounts

| Email | Name | Password |
|-------|------|----------|
| affiliate1@test.com | Jessica Brown | Bobby321! |
| affiliate2@test.com | Christopher Thomas | Bobby321! |
| affiliate3@test.com | Amanda Moore | Bobby321! |

**Dashboard:** `/dashboard/affiliate`

---

## 📋 LEAD Account

| Email | Name | Password |
|-------|------|----------|
| lead1@test.com | Daniel Garcia | Bobby321! |

**Dashboard:** `/dashboard/lead`

---

## 🛡️ ADMIN Account

| Email | Name | Password |
|-------|------|----------|
| admin@test.com | Admin User | Bobby321! |

**Dashboard:** `/dashboard/admin` or `/admin`

---

## ⚙️ SUPER ADMIN Setup

For super admin access, use the setup page:
- **URL:** https://taxgeniuspro.tax/setup-admin
- **Authorized Email:** support@taxgeniuspro.tax

This page only works for the support@taxgeniuspro.tax email address.

---

## 🧪 Testing Instructions

1. **Navigate to:** https://taxgeniuspro.tax/auth/signin
2. **Choose a test account** from the lists above
3. **Enter credentials:**
   - Email: (any from above)
   - Password: Bobby321!
4. **Click Sign In**
5. **You'll be redirected** to the appropriate dashboard based on your role

---

## 🔐 Authentication System

- **Provider:** NextAuth.js v5
- **Session Type:** JWT (30-day expiry)
- **Password Hashing:** bcrypt (cost 12)
- **Database:** PostgreSQL via Prisma

---

## 🚀 Role-Based Access

Each role has different permissions and dashboard access:

- **CLIENT** - View tax returns, upload documents, track status
- **TAX_PREPARER** - Manage clients, prepare returns, access tax forms
- **AFFILIATE** - View leads, track commissions, marketing tools
- **LEAD** - Pending approval, limited access
- **ADMIN** - Full admin panel access, user management
- **SUPER_ADMIN** - Complete system control (via setup-admin page)

---

## 📝 Notes

- All test accounts are created in the production database
- Sessions are stored as JWT tokens
- Roles are enforced via middleware
- All passwords are securely hashed with bcrypt
- Email verification is skipped for test accounts

---

**Last Updated:** October 26, 2025
**Created By:** Test user creation script
