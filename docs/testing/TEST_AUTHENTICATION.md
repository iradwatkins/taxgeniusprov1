# Test Authentication System

## Overview

TaxGeniusPro includes a **classic email/password authentication system** specifically designed for testing and development. This system runs alongside Clerk (production authentication) and provides a simple way to test role-based access control and authentication flows.

## 🚨 Important

⚠️ **This is for DEVELOPMENT/TESTING ONLY**
⚠️ **DO NOT use in production**
⚠️ The test login endpoint is automatically disabled in production

---

## Quick Start

### Access Test Login Page

1. Visit: `http://localhost:3005/auth/test-login`
2. Or from the main login page (development mode only), click "Use Test Login (Email/Password)"

### Test Accounts

The system includes 5 pre-configured test accounts for different roles:

| Role | Email | Password | Dashboard Redirect |
|------|-------|----------|-------------------|
| **Super Admin** | admin@test.com | admin123 | /dashboard/admin |
| **Tax Preparer** | preparer@test.com | preparer123 | /dashboard/tax-preparer |
| **Affiliate** | affiliate@test.com | affiliate123 | /dashboard/affiliate |
| **Client** | client@test.com | client123 | /dashboard/client |
| **Lead** | lead@test.com | lead123 | /dashboard/lead |

---

## Features

### 1. Classic Email/Password Login
- Simple form-based authentication
- No OAuth dependencies
- Perfect for automated testing

### 2. Role-Based Testing
- Test all user roles without creating real accounts
- Quick account switching via UI buttons
- Each role redirects to its specific dashboard

### 3. Development-Only Access
- Automatically hidden in production
- GET endpoint blocked in production
- Clear visual indicators that it's for testing

### 4. Comprehensive Test Coverage
- 15 unit tests covering all authentication scenarios
- Input validation testing
- Error handling verification
- Security best practices validation

---

## API Endpoints

### POST `/api/auth/test-login`

Authenticate with email and password.

**Request:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "email": "admin@test.com",
    "name": "Test Admin",
    "role": "super_admin",
    "clerkUserId": null
  },
  "redirectUrl": "/dashboard/admin",
  "message": "Successfully authenticated as super_admin"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password",
  "message": "Check test accounts or use valid credentials"
}
```

**Validation Error (400):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### GET `/api/auth/test-login`

Get list of available test accounts (development only).

**Success Response (200):**
```json
{
  "message": "Test authentication accounts",
  "accounts": [
    {
      "email": "admin@test.com",
      "role": "super_admin",
      "name": "Test Admin",
      "passwordHint": "Use the password shown in the test login UI"
    }
  ],
  "note": "⚠️ These are test accounts for development only"
}
```

**Production Response (404):**
```json
{
  "error": "Not available in production"
}
```

---

## Running Tests

### Run Authentication Tests
```bash
# Run all authentication tests
npm test -- __tests__/auth/

# Run specific test file
npm test -- __tests__/auth/test-login.test.ts

# Run tests in watch mode
npm test -- __tests__/auth/ --watch

# Run with coverage
npm test -- __tests__/auth/ --coverage
```

### Test Coverage

✅ **15/15 Unit Tests Passing**

Test Suite Coverage:
- ✅ Admin authentication
- ✅ Tax preparer authentication
- ✅ Affiliate authentication
- ✅ Client authentication
- ✅ Lead authentication
- ✅ Email validation
- ✅ Password length validation
- ✅ Wrong password handling
- ✅ Non-existent user handling
- ✅ Missing field validation
- ✅ Empty body handling
- ✅ GET endpoint (development)
- ✅ Password security (no exposure)
- ✅ Production blocking

---

## Usage Examples

### Manual Testing

```bash
# Test admin login
curl -X POST http://localhost:3005/api/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Get test accounts list
curl http://localhost:3005/api/auth/test-login
```

### Automated Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should work for admin users', async () => {
    // Login as admin
    const authResponse = await fetch('/api/auth/test-login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    });

    const { user } = await authResponse.json();
    expect(user.role).toBe('super_admin');

    // Now test your feature with admin permissions
    // ...
  });
});
```

### Frontend Integration

```typescript
// React component example
const TestLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/test-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(data.redirectUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

---

## Security Considerations

### What This System Does ✅
- Validates email format
- Enforces minimum password length (6 characters)
- Returns generic error messages (doesn't reveal if email exists)
- Blocks access in production environment
- Logs all authentication attempts

### What This System Does NOT Do ❌
- Does not hash passwords (plaintext comparison)
- Does not create real sessions/cookies
- Does not implement rate limiting
- Does not store data in database
- Does not integrate with Clerk

### Why It's Safe for Development
1. **Only works in development** - Automatically disabled in production
2. **No real user data** - Uses hardcoded test accounts
3. **No session management** - Returns user info directly (no cookies)
4. **Clearly marked** - Visual indicators that it's for testing
5. **Separate from production auth** - Doesn't interfere with Clerk

---

## Integration with Production Auth (Clerk)

The test authentication system works **alongside** Clerk, not as a replacement:

### Test Login
- URL: `/auth/test-login`
- Uses: Email/password
- For: Development and testing
- Creates: No real sessions

### Production Login (Clerk)
- URL: `/auth/login`
- Uses: OAuth (Google, GitHub, etc.)
- For: Production users
- Creates: Real sessions with Clerk

### When to Use Each

**Use Test Login when:**
- Writing automated tests
- Testing role-based access control
- Debugging authentication flows
- Developing new features locally
- Need quick account switching

**Use Clerk Login when:**
- Testing production authentication
- Testing OAuth flows
- Need real user sessions
- Testing Clerk-specific features
- Deploying to production

---

## Troubleshooting

### Test login page not showing
- Check that `NODE_ENV=development`
- Clear browser cache
- Check `/auth/login` for the test login link at the bottom

### Tests failing
```bash
# Clear test cache
npm test -- --clearCache

# Re-run tests
npm test -- __tests__/auth/ --run
```

### API returns 404 in production
- This is expected behavior
- Use Clerk authentication in production

### Wrong dashboard redirect
- Check that test account role matches expected role
- Verify middleware role mapping in `src/middleware.ts`

---

## File Locations

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx              # Main login (Clerk)
│   │   └── test-login/page.tsx         # Test login (Email/Password)
│   └── api/
│       └── auth/
│           └── test-login/route.ts     # Test auth API
__tests__/
└── auth/
    ├── test-login.test.ts              # Unit tests (15 tests)
    └── authentication-flow.test.ts     # Integration tests
docs/
└── testing/
    └── TEST_AUTHENTICATION.md          # This file
```

---

## Next Steps

### For Development
1. Use test accounts to develop features
2. Write tests using the test auth API
3. Test role-based access control
4. Verify middleware permissions

### For Production
1. Ensure test endpoints are disabled
2. Use Clerk for all authentication
3. Remove or comment out test account references
4. Implement proper session management

---

## Related Documentation

- [Authentication Architecture](../architecture/05-authentication-clerk.md)
- [Security Documentation](../architecture/07-security.md)
- [Testing Guide](../testing/TESTING_GUIDE.md)
- [Middleware Configuration](../architecture/middleware.md)

---

## Support

If you encounter issues with the test authentication system:

1. Check this documentation first
2. Review test files in `__tests__/auth/`
3. Check logs in terminal for error messages
4. Verify `NODE_ENV` is set to `development`

---

**Last Updated:** 2025-01-19
**Version:** 1.0.0
**Status:** ✅ Fully Functional (15/15 tests passing)
