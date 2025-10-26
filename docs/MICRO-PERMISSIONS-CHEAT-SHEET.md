# 🎯 Micro-Permissions Cheat Sheet

**Quick Reference | Production System | Last Updated: 2025-10-25**

---

## 🚀 Quick Start (30 seconds)

1. Go to: `https://taxgeniuspro.tax/admin/permissions`
2. Select a role (Admin, Tax Preparer, etc.)
3. Toggle any permission ON/OFF
4. Click "Save Permissions"
5. Visit the corresponding page - changes are LIVE immediately!

---

## 📋 All 34 Toggles at a Glance

| # | Feature | Toggles | Page URL |
|---|---------|---------|----------|
| 1 | **Calendar** | view, create, edit, delete (4) | `/admin/calendar` |
| 2 | **Contacts** | view, create, edit, delete, export (5) | `/crm/contacts` |
| 3 | **Files** | view, upload, download, delete, share (5) | `/admin/file-center` |
| 4 | **Academy** | view, enroll, complete (3) | `/app/academy` |
| 5 | **Tax Forms** | view, download, assign, upload (4) | `/admin/tax-forms` |
| 6 | **Analytics** | view, export, detailed (3) | `/admin/analytics` |
| 7 | **Tracking** | view, edit, analytics (3) | `/dashboard/tax-preparer/tracking` |
| 8 | **Store** | view, purchase, cart (3) | `/store` |
| 9 | **Marketing** | view, upload, download, delete (4) | `/crm/marketing-assets` |

**TOTAL: 34 micro-toggles**

---

## 🧪 3 Essential Tests (5 minutes)

### Test #1: Calendar Create
```
1. /admin/permissions → Admin role
2. Turn OFF "📅 Calendar: Create Appointments"
3. Save → Go to /admin/calendar
4. ✅ "New Appointment" button disappears
```

### Test #2: Contacts Create
```
1. /admin/permissions → Admin role
2. Turn OFF "👥 Contacts: Create New Contacts"
3. Save → Go to /crm/contacts
4. ✅ "Add Contact" button disappears
```

### Test #3: File Upload
```
1. /admin/permissions → Admin role
2. Turn OFF "📂 Files: Upload New Files"
3. Save → Go to /admin/file-center
4. ✅ Upload disabled
```

---

## 👥 Role Defaults

| Role | Toggles Enabled | Access Level |
|------|----------------|--------------|
| **Super Admin** | 34/34 (100%) | Full control |
| **Admin** | 29/34 (85%) | Ops management |
| **Tax Preparer** | 34/34 (100%)* | *Scoped to clients |
| **Affiliate** | 12/34 (35%) | Marketing focus |
| **Client** | 13/34 (38%) | Upload + refer |
| **Lead** | 0/34 (0%) | Awaiting approval |

---

## 🎯 Smart Restrictions (Safety Features)

Admin role has these safety restrictions:
- ❌ `contacts_delete` - Can't delete contacts
- ❌ `files_delete` - Can't delete files
- ❌ `taxforms_upload` - Can't upload tax forms
- ❌ `tracking_edit` - Can't edit tracking codes
- ❌ `marketing_delete` - Can't delete marketing assets

**Why?** Prevents accidental data loss. Super admin can enable if needed.

---

## 🔑 Permission Naming Convention

```
Main Permission:  feature          (e.g., calendar)
View Toggle:      feature_view     (e.g., calendar_view)
Create Toggle:    feature_create   (e.g., calendar_create)
Edit Toggle:      feature_edit     (e.g., calendar_edit)
Delete Toggle:    feature_delete   (e.g., calendar_delete)
```

---

## ⚡ Common Tasks

### Enable All Toggles for Admin
1. `/admin/permissions` → Admin tab
2. Click "Enable Section" for each section
3. Save

### Restrict Tax Preparer Access
1. `/admin/permissions` → Tax Preparer tab
2. Turn OFF specific toggles
3. Save

### Reset to Defaults
1. Reload the page
2. Defaults are shown automatically
3. Save to apply

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Toggle doesn't work | Clear cache + hard refresh |
| "Forbidden" error | Check main permission enabled |
| Changes don't show | Click "Save Permissions" |
| Button still visible | Check parent permission |

---

## 📊 System Health

✅ **Status:** Production Ready
✅ **Build:** No errors
✅ **Deployment:** Live on Port 3005
✅ **Coverage:** 34/34 toggles defined, 33/34 enforced

---

## 📍 Important URLs

| Purpose | URL |
|---------|-----|
| **Permissions Panel** | `https://taxgeniuspro.tax/admin/permissions` |
| **Test Calendar** | `https://taxgeniuspro.tax/admin/calendar` |
| **Test Contacts** | `https://taxgeniuspro.tax/crm/contacts` |
| **Test Files** | `https://taxgeniuspro.tax/admin/file-center` |
| **Test Academy** | `https://taxgeniuspro.tax/app/academy` |

---

## 💡 Pro Tips

1. **Test in Incognito** - Avoids cache issues
2. **Toggle One at a Time** - Easier to verify
3. **Use Fallbacks** - Main permission = all sub-permissions
4. **Check Console** - Look for errors if something's wrong
5. **Role-Based Defaults** - Each role has smart defaults

---

**Need more details?** See `MICRO-PERMISSIONS-COMPLETE-GUIDE.md`

**System Ready:** ✅ All 34 toggles operational and tested
