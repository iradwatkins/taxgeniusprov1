# Constants Guide

## Overview

The `/src/lib/constants.ts` module provides centralized constants to eliminate magic numbers throughout the codebase. This improves code maintainability, readability, and reduces the risk of inconsistencies.

## Why Use Constants?

**Before (Magic Numbers):**
```typescript
setTimeout(() => setCopied(false), 2000)
input.maxLength = 100
if (code.length < 3) return
```

**After (Constants):**
```typescript
import { TOAST_DISMISS_DELAY, LINK_METADATA, SHORT_LINK_CODE } from '@/lib/constants'

setTimeout(() => setCopied(false), TOAST_DISMISS_DELAY)
input.maxLength = LINK_METADATA.TITLE_MAX_LENGTH
if (code.length < SHORT_LINK_CODE.MIN_LENGTH) return
```

## Available Constants

### Timing Constants
Delays and timeouts in milliseconds:

```typescript
TOAST_DISMISS_DELAY           // 2000ms - Toast auto-dismiss delay
PWA_INSTALL_PROMPT_DELAY      // 30000ms - PWA install prompt delay
NOTIFICATION_PROMPT_DELAY     // 5000ms - Notification permission prompt delay
SHORT_DELAY                   // 2000ms - Short UI feedback delay
INPUT_DEBOUNCE_DELAY          // 500ms - Debounce for input validation
```

### Form Field Constraints

```typescript
SSN_MAX_LENGTH                // 11 - SSN format (xxx-xx-xxxx)
IRS_PIN_LENGTH                // 6
CUSTOM_NAME_MAX_LENGTH        // 50
VANITY_URL_MAX_LENGTH         // 50

TRACKING_CODE.MIN_LENGTH      // 3
TRACKING_CODE.MAX_LENGTH      // 20

SHORT_LINK_CODE.MIN_LENGTH    // 3
SHORT_LINK_CODE.MAX_LENGTH    // 30
SHORT_LINK_CODE.PATTERN       // Regex: /^[a-z][a-z0-9-]*$/

LINK_METADATA.TITLE_MAX_LENGTH        // 100
LINK_METADATA.DESCRIPTION_MAX_LENGTH  // 500
LINK_METADATA.CAMPAIGN_MAX_LENGTH     // 100
```

### Input Length Standards

```typescript
INPUT_LENGTH.SHORT            // 50
INPUT_LENGTH.MEDIUM           // 100
INPUT_LENGTH.LONG             // 500
INPUT_LENGTH.VERY_LONG        // 1000
```

### UI/UX Constants

```typescript
SKELETON_COUNT                // 5 - Number of skeleton loaders

PAGINATION.DEFAULT_PAGE_SIZE  // 10
PAGINATION.MAX_PAGE_SIZE      // 100
```

### Business Logic

```typescript
MIN_PAYOUT_THRESHOLD          // 5000 cents ($50.00)

COMMISSION_RATES.REFERRER     // 0.1 (10%)
COMMISSION_RATES.AFFILIATE    // 0.15 (15%)
COMMISSION_RATES.TAX_PREPARER // 0.7 (70%)

ADVANCE_LOAN.MIN_PERCENTAGE   // 0.5 (50%)
ADVANCE_LOAN.MAX_PERCENTAGE   // 0.8 (80%)
```

### File Storage

```typescript
FILE_SIZE.MAX_IMAGE           // 5MB
FILE_SIZE.MAX_DOCUMENT        // 10MB
FILE_SIZE.MAX_CSV             // 2MB

ALLOWED_FILE_TYPES.IMAGES     // ['image/jpeg', 'image/png', ...]
ALLOWED_FILE_TYPES.DOCUMENTS  // ['application/pdf', ...]
ALLOWED_FILE_TYPES.CSV        // ['text/csv', ...]
```

### Animation

```typescript
ANIMATION_DURATION.FAST       // 150ms
ANIMATION_DURATION.NORMAL     // 300ms
ANIMATION_DURATION.SLOW       // 500ms
```

### QR Code

```typescript
QR_CODE.SIZE                  // 160
QR_CODE.ERROR_CORRECTION      // 'H'
QR_CODE.INCLUDE_MARGIN        // true
```

### Retry Logic

```typescript
RETRY.MAX_ATTEMPTS            // 3
RETRY.INITIAL_DELAY           // 1000ms
RETRY.MAX_DELAY               // 10000ms
RETRY.BACKOFF_MULTIPLIER      // 2
```

### Cache Durations (seconds)

```typescript
CACHE_DURATION.SHORT          // 60 (1 minute)
CACHE_DURATION.MEDIUM         // 300 (5 minutes)
CACHE_DURATION.LONG           // 3600 (1 hour)
CACHE_DURATION.VERY_LONG      // 86400 (24 hours)
```

### HTTP Status Codes

```typescript
HTTP_STATUS.OK                      // 200
HTTP_STATUS.CREATED                 // 201
HTTP_STATUS.NO_CONTENT              // 204
HTTP_STATUS.BAD_REQUEST             // 400
HTTP_STATUS.UNAUTHORIZED            // 401
HTTP_STATUS.FORBIDDEN               // 403
HTTP_STATUS.NOT_FOUND               // 404
HTTP_STATUS.CONFLICT                // 409
HTTP_STATUS.UNPROCESSABLE_ENTITY    // 422
HTTP_STATUS.INTERNAL_SERVER_ERROR   // 500
HTTP_STATUS.SERVICE_UNAVAILABLE     // 503
```

### Regex Patterns

```typescript
REGEX_PATTERNS.EMAIL          // Email validation
REGEX_PATTERNS.PHONE          // Phone number (US format)
REGEX_PATTERNS.ZIP_CODE       // ZIP code (5 or 9 digits)
REGEX_PATTERNS.SSN            // SSN format (xxx-xx-xxxx)
REGEX_PATTERNS.TRACKING_CODE  // Alphanumeric + underscore/hyphen
REGEX_PATTERNS.SLUG           // URL-safe slug
```

### Environment Detection

```typescript
ENV.IS_PRODUCTION             // true if NODE_ENV === 'production'
ENV.IS_DEVELOPMENT            // true if NODE_ENV === 'development'
ENV.IS_TEST                   // true if NODE_ENV === 'test'
```

## Usage Examples

### Example 1: Form Validation

```typescript
import { SHORT_LINK_CODE, LINK_METADATA } from '@/lib/constants'

<input
  type="text"
  minLength={SHORT_LINK_CODE.MIN_LENGTH}
  maxLength={SHORT_LINK_CODE.MAX_LENGTH}
  pattern={SHORT_LINK_CODE.PATTERN.source}
  placeholder="my-link"
/>

<input
  type="text"
  maxLength={LINK_METADATA.TITLE_MAX_LENGTH}
  placeholder="Link title"
/>

<textarea
  maxLength={LINK_METADATA.DESCRIPTION_MAX_LENGTH}
  placeholder="Description"
/>
```

### Example 2: Debounced Input

```typescript
import { INPUT_DEBOUNCE_DELAY } from '@/lib/constants'

useEffect(() => {
  const checkAvailability = async () => {
    // API call to check availability
  }

  const timeoutId = setTimeout(checkAvailability, INPUT_DEBOUNCE_DELAY)
  return () => clearTimeout(timeoutId)
}, [inputValue])
```

### Example 3: Toast Notifications

```typescript
import { TOAST_DISMISS_DELAY } from '@/lib/constants'

const showToast = (message: string) => {
  setToastVisible(true)
  setTimeout(() => setToastVisible(false), TOAST_DISMISS_DELAY)
}
```

### Example 4: QR Code Generation

```typescript
import { QR_CODE } from '@/lib/constants'

<QRCodeSVG
  value={url}
  size={QR_CODE.SIZE}
  level={QR_CODE.ERROR_CORRECTION}
  includeMargin={QR_CODE.INCLUDE_MARGIN}
/>
```

### Example 5: HTTP Status Handling

```typescript
import { HTTP_STATUS } from '@/lib/constants'

const response = await fetch('/api/data')

if (response.status === HTTP_STATUS.OK) {
  // Success
} else if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  // Redirect to login
} else if (response.status === HTTP_STATUS.NOT_FOUND) {
  // Show 404 page
}
```

### Example 6: Commission Calculations

```typescript
import { COMMISSION_RATES } from '@/lib/constants'

const referrerCommission = totalAmount * COMMISSION_RATES.REFERRER
const affiliateCommission = totalAmount * COMMISSION_RATES.AFFILIATE
const preparerCommission = totalAmount * COMMISSION_RATES.TAX_PREPARER
```

### Example 7: Regex Validation

```typescript
import { REGEX_PATTERNS } from '@/lib/constants'

const isValidEmail = (email: string) => REGEX_PATTERNS.EMAIL.test(email)
const isValidPhone = (phone: string) => REGEX_PATTERNS.PHONE.test(phone)
const isValidSSN = (ssn: string) => REGEX_PATTERNS.SSN.test(ssn)
```

## Best Practices

### ✅ DO:
- **Use constants for all numeric values** that have business meaning
- **Import only what you need** for better tree-shaking
- **Use semantic constant names** that explain the purpose
- **Group related constants** using nested objects (e.g., `SHORT_LINK_CODE.MIN_LENGTH`)
- **Mark constant objects as `const`** to prevent reassignment

### ❌ DON'T:
- **Don't use magic numbers** directly in components or API routes
- **Don't duplicate constants** - always import from this module
- **Don't modify constants** at runtime (they should be immutable)
- **Don't create local constants** if they apply globally

## Migration Guide

To replace magic numbers in existing code:

1. **Identify the magic number** and its purpose
2. **Check if a constant exists** in `/src/lib/constants.ts`
3. **If it doesn't exist**, add it to the appropriate section
4. **Import and use the constant** in your component/API route
5. **Verify the build** passes after the change

### Example Migration:

**Before:**
```typescript
// src/components/MyComponent.tsx
setTimeout(() => setVisible(false), 2000)

<input maxLength={100} />
```

**After:**
```typescript
// src/components/MyComponent.tsx
import { TOAST_DISMISS_DELAY, LINK_METADATA } from '@/lib/constants'

setTimeout(() => setVisible(false), TOAST_DISMISS_DELAY)

<input maxLength={LINK_METADATA.TITLE_MAX_LENGTH} />
```

## Maintenance

### Adding New Constants

When adding new constants:

1. **Choose the appropriate section** (or create a new one if needed)
2. **Use descriptive names** that explain the value's purpose
3. **Add JSDoc comments** for complex constants
4. **Update this guide** with the new constant and usage examples
5. **Run the build** to ensure no TypeScript errors

### Renaming Constants

When renaming constants:

1. **Search for all usages** of the old constant name
2. **Update all imports** to use the new name
3. **Run the build** to catch any missed references
4. **Update this guide** with the new name

## Files Using Constants

Currently using constants from this module:
- `/src/components/links/ShortLinkCard.tsx`
- `/src/components/links/CreateShortLinkForm.tsx`
- (More files to be migrated)

## Next Steps

Continue migrating magic numbers from:
- API route handlers (`/src/app/api/**/*.ts`)
- Form components (`/src/components/**/*.tsx`)
- Dashboard pages (`/src/app/dashboard/**/*.tsx`)
- Utility functions (`/src/lib/**/*.ts`)

---

**Last Updated:** January 2025
**Maintained By:** Development Team
