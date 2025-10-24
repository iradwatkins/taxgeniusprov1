# Permission Matrix - Role Access Control

**Legend**:
- ✅ = GREEN TOGGLE ON (Role can see this)
- ❌ = TOGGLE OFF (Role cannot see this)

---

## CLIENT Role Permissions

### What Clients SHOULD See:
| Permission | Status | Description |
|------------|--------|-------------|
| dashboard | ✅ | Access to client dashboard |
| uploadDocuments | ✅ | Upload tax documents |
| analytics | ✅ | View their own referral stats (if they refer) |
| trackingCode | ✅ | Personal referral link (if they refer) |
| marketing | ✅ | Share/refer tools |

### What Clients SHOULD NOT See:
| Permission | Status | Description |
|------------|--------|-------------|
| settings | ❌ | **REMOVE - Causes System Controls to appear** |
| academy | ❌ | No training access |
| store | ❌ | No marketing materials |
| calendar | ❌ | **No CRM access** |
| addressBook | ❌ | **No CRM access** |
| emails | ❌ | No email management |
| clientFileCenter | ❌ | **No CRM access** |
| users | ❌ | No user management |
| payouts | ❌ | No payout access |
| database | ❌ | No database access |
| adminManagement | ❌ | No admin tools |

---

## AFFILIATE Role Permissions

### What Affiliates SHOULD See:
| Permission | Status | Description |
|------------|--------|-------------|
| dashboard | ✅ | Access to affiliate dashboard |
| store | ✅ | Marketing materials store |
| marketing | ✅ | Professional marketing assets |
| analytics | ✅ | Conversion tracking |
| trackingCode | ✅ | Affiliate tracking codes |

### What Affiliates SHOULD NOT See:
| Permission | Status | Description |
|------------|--------|-------------|
| settings | ❌ | **REMOVE - Causes System Controls to appear** |
| academy | ❌ | No training (they're external marketers) |
| calendar | ❌ | **No CRM access** |
| addressBook | ❌ | **No CRM access** |
| emails | ❌ | No email management |
| clientFileCenter | ❌ | **No CRM access** |
| clients | ❌ | No client list |
| documents | ❌ | No document access |

---

## TAX PREPARER Role Permissions

### What Tax Preparers SHOULD See:
| Permission | Status | Description |
|------------|--------|-------------|
| dashboard | ✅ | Access to preparer dashboard |
| clients | ✅ | **Their assigned clients only** |
| documents | ✅ | **Their clients' documents only** |
| clientFileCenter | ✅ | **Their clients' files only** |
| calendar | ✅ | **CRM: Manage appointments** |
| addressBook | ✅ | **CRM: Manage contacts (scoped)** |
| store | ✅ | Purchase marketing materials |
| academy | ✅ | Training and certification |
| analytics | ✅ | Their own performance stats |
| trackingCode | ✅ | Personal referral code |

### What Tax Preparers SHOULD NOT See:
| Permission | Status | Description |
|------------|--------|-------------|
| settings | ❌ | **REMOVE - Causes System Controls to appear** |
| users | ❌ | No user management |
| payouts | ❌ | No payout management |
| database | ❌ | No database access |
| adminManagement | ❌ | No admin tools |
| emails | ❌ | No system email management |
| clientsStatus | ❌ | No system-wide client status |
| referralsStatus | ❌ | No system-wide referrals |

---

## ADMIN Role Permissions

### What Admins SHOULD See:
| Permission | Status | Description |
|------------|--------|-------------|
| dashboard | ✅ | Access to admin dashboard |
| users | ✅ | User management |
| payouts | ✅ | Payout management |
| contentGenerator | ✅ | Content tools |
| analytics | ✅ | System analytics |
| settings | ✅ | System settings |
| clientsStatus | ✅ | Client management |
| referralsStatus | ✅ | Referral management |
| emails | ✅ | Email management |
| calendar | ✅ | **CRM: Calendar** |
| addressBook | ✅ | **CRM: Contacts** |
| clientFileCenter | ❌ | **SUPER ADMIN ONLY - Sensitive files** |
| googleAnalytics | ❌ | **SUPER ADMIN ONLY - API access** |
| referralsAnalytics | ✅ | Referral reports |
| marketingHub | ✅ | Marketing tools |
| store | ✅ | Store management |
| academy | ✅ | Training access |

### What Admins SHOULD NOT See:
| Permission | Status | Description |
|------------|--------|-------------|
| adminManagement | ❌ | **SUPER ADMIN ONLY - Permissions** |
| database | ❌ | **SUPER ADMIN ONLY - Database** |
| alerts | ❌ | **SUPER ADMIN ONLY - Phone alerts** |

---

## SUPER ADMIN Role Permissions

### What Super Admins SHOULD See:
| Permission | Status | Description |
|------------|--------|-------------|
| **ALL PERMISSIONS** | ✅ | Full system access |
| adminManagement | ✅ | Manage permissions |
| database | ✅ | Database access |
| alerts | ✅ | Phone alerts |
| clientFileCenter | ✅ | All client files |
| googleAnalytics | ✅ | GA integration |
| routeAccessControl | ✅ | Route restrictions |

---

## THE PROBLEM: "settings" Permission

### Current Issue:
```
client: {
  settings: true  ❌ THIS IS THE PROBLEM
}

affiliate: {
  settings: true  ❌ THIS IS THE PROBLEM
}

tax_preparer: {
  settings: true  ❌ THIS IS THE PROBLEM
}
```

### Why This Causes Issues:
1. "System Controls" section contains `settings` permission
2. Sidebar shows section if ANY permission is enabled
3. Since `settings: true` for clients, they see "System Controls"

### Solutions:

#### Option 1: Remove settings permission entirely ✅ RECOMMENDED
- Clients don't need a settings page
- They can update preferences inline on dashboard
- Removes System Controls visibility issue

#### Option 2: Create user-level settings permission
- Rename current `settings` to `systemSettings`
- Create new `userSettings` permission for profile updates
- Update section mapping

#### Option 3: Better section filtering (already implemented)
- Keep role-based section hiding
- Ensure Settings is in separate section

---

## Proposed Changes

### CLIENT - Remove settings permission:
```typescript
client: {
  dashboard: true,        ✅
  uploadDocuments: true,  ✅
  analytics: true,        ✅
  trackingCode: true,     ✅
  marketing: true,        ✅
  // settings: false      ❌ REMOVE
}
```

### AFFILIATE - Remove settings permission:
```typescript
affiliate: {
  dashboard: true,   ✅
  store: true,       ✅
  marketing: true,   ✅
  analytics: true,   ✅
  trackingCode: true,✅
  // settings: false ❌ REMOVE
}
```

### TAX PREPARER - Remove settings permission:
```typescript
tax_preparer: {
  dashboard: true,        ✅
  clients: true,          ✅
  documents: true,        ✅
  clientFileCenter: true, ✅
  addressBook: true,      ✅
  calendar: true,         ✅
  store: true,            ✅
  academy: true,          ✅
  analytics: true,        ✅
  trackingCode: true,     ✅
  // settings: false      ❌ REMOVE
}
```

---

## CRM Access by Role

| Feature | Client | Affiliate | Tax Preparer | Admin | Super Admin |
|---------|--------|-----------|--------------|-------|-------------|
| Calendar | ❌ | ❌ | ✅ (their appointments) | ✅ (all) | ✅ (all) |
| Contacts/Address Book | ❌ | ❌ | ✅ (their contacts) | ✅ (all) | ✅ (all) |
| File Center | ❌ | ❌ | ✅ (their clients) | ❌ | ✅ (all) |
| Email Management | ❌ | ❌ | ❌ | ✅ | ✅ |
| Support System | ✅ (create tickets) | ✅ (create tickets) | ✅ (manage tickets) | ✅ (all) | ✅ (all) |

---

## Action Items

1. ✅ Remove `settings: true` from client, affiliate, tax_preparer roles
2. ✅ Verify clients can't see CRM (calendar, addressBook, clientFileCenter)
3. ✅ Verify affiliates can't see CRM
4. ✅ Test that System Controls disappears for non-admins
5. ✅ Create profile settings UI directly on dashboard (no separate settings page needed)

**Generated with Claude Code** 🤖
