# WordPress Plugin Analysis: Pages by User Role
## Integration Plan for TaxGeniusPro

---

## Executive Summary

The "Pages by User Role for WordPress" plugin provides comprehensive role-based access control for WordPress content. This document analyzes its functionality and outlines how to implement equivalent features in the TaxGeniusPro Next.js application.

---

## Plugin Core Features

### 1. Role-Based Access Control
- **Allow/Block by Role**: Restrict or grant access to pages, posts, and custom post types based on WordPress user roles
- **Inverted Mode**: Option to invert the access control logic
- **Non-Logged-In Users**: Configurable setting to allow/disallow non-authenticated users

### 2. Username-Based Access Control (Priority System)
- **Always Allow Usernames**: Comma-separated list of usernames with guaranteed access (highest priority)
- **Always Disallow Usernames**: Comma-separated list of blocked usernames (highest priority)
- **Priority**: Username-based access overrides role-based access

### 3. Content Visibility Controls
- **Hide from Frontend**: Option to hide content from public view while keeping it in admin/REST API
- **Hide from Menus**: Conditional hiding of restricted pages from navigation menus
- **Show in Nav Override**: Option to force showing restricted items in navigation

### 4. Redirect Behavior
- **Custom Redirect URLs**: Set specific redirect URLs per page/post
- **Default Redirect URL**: Global default redirect for unauthorized access
- **Login Redirect**: Redirect non-authenticated users to login page
- **Custom HTML/JavaScript**: Display custom content when access is denied

### 5. Post Type & Archive Restrictions
- **Custom Post Type Access**: Restrict entire post types by role
- **Post Type Archives**: Control access to archive pages by role
- **WooCommerce Integration**: Special handling for Shop, Cart, My Account, Checkout pages

### 6. Taxonomy & Category Restrictions
- **Category Access Control**: Allow/block access based on category assignment
- **Custom Taxonomies**: Support for custom taxonomy terms
- **Term Archive Pages**: Restrict access to category/term archive pages

### 7. Frontend Filtering
- **Query Filtering**: Automatically filter posts from queries based on restrictions
- **Menu Filtering**: Hide restricted items from WordPress menus
- **Comment Filtering**: Optional filtering of comments from restricted posts
- **AJAX Support**: Optional inclusion of restrictions in AJAX requests

### 8. Admin Features
- **Admin Access Control**: Restrict wp-admin access by user role
- **Metabox Visibility**: Control which roles can see the Access Control metabox
- **Visual Composer Support**: Integration with Visual Composer page builder

### 9. Forced Login Features
- **Site-Wide Forced Login**: Make entire website private (requires login)
- **Whitelist URLs**: Allow specific URLs without login (wildcard /* support)
- **Whitelist Content**: Mark specific pages/posts as public (always visible)
- **Separate Homepages**: Different homepage for logged-in vs logged-out users

---

## Current TaxGeniusPro Architecture

### Authentication System
- **Clerk Authentication**: Full-featured auth with session management
- **User Roles**: `super_admin`, `admin`, `tax_preparer`, `affiliate`, `lead`, `client`
- **Public Metadata**: Roles and permissions stored in Clerk `publicMetadata`

### Permission System
- **Granular Permissions**: 38+ specific permissions per role
- **Section-Based Grouping**: Permissions organized into 9 logical sections
- **Custom Permissions**: Admins can customize permissions per user
- **Default Permissions**: Baseline permissions per role

### Current Route Protection
- **Middleware-Based**: Routes protected in `src/middleware.ts`
- **Pattern Matching**: Uses `createRouteMatcher` for public routes
- **Role-Based Redirects**: Automatic redirects based on user role
- **Admin View-As**: Admins can preview as different roles

---

## Integration Strategy

### Phase 1: Database Schema (Prisma)
Add new models for content restrictions:

```prisma
model PageRestriction {
  id                    String   @id @default(cuid())
  routePath             String   @unique
  allowedRoles          String[] // ['super_admin', 'admin', ...]
  blockedRoles          String[] // Roles to explicitly block
  allowedUsernames      String[] // Always allow these usernames
  blockedUsernames      String[] // Always block these usernames
  redirectUrl           String?  // Custom redirect URL
  hideFromNav           Boolean  @default(false)
  hideFromFrontend      Boolean  @default(false)
  showInNavOverride     Boolean  @default(false)
  allowNonLoggedIn      Boolean  @default(false)
  customHtmlOnBlock     String?  // Custom HTML to show when blocked
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ContentRestriction {
  id                    String   @id @default(cuid())
  contentType           String   // 'page', 'post', 'section', 'component'
  contentIdentifier     String   // Unique identifier for the content
  allowedRoles          String[]
  blockedRoles          String[]
  allowedUsernames      String[]
  blockedUsernames      String[]
  hideConditions        Json?    // Complex hiding conditions
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@unique([contentType, contentIdentifier])
}

model RouteConfig {
  id                    String   @id @default(cuid())
  routePattern          String   @unique // '/admin/*', '/dashboard/client'
  requiresAuth          Boolean  @default(true)
  allowedRoles          String[]
  redirectOnUnauth      String?  // Where to redirect if unauthorized
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Phase 2: Core Utility Functions
Create `src/lib/content-restriction.ts`:

```typescript
// Core access control functions
- checkPageAccess(userId, role, pagePath)
- checkContentAccess(userId, role, contentId)
- isUserBlocked(username, restrictions)
- isUserAllowed(username, restrictions)
- getRedirectUrl(restrictions, defaultUrl)
- filterVisibleContent(contents, userId, role)
```

### Phase 3: Enhanced Middleware
Extend `src/middleware.ts` to support:
- Dynamic route restrictions from database
- Username-based allow/block lists
- Custom redirect URLs per route
- Content filtering for API routes

### Phase 4: React Components
Create reusable components:

```typescript
// Component to restrict content by role
<RestrictedContent allowedRoles={['admin', 'super_admin']}>
  <AdminOnlyContent />
</RestrictedContent>

// Component to hide from specific roles
<HiddenForRoles blockedRoles={['client', 'lead']}>
  <InternalTooling />
</HiddenForRoles>

// Component with custom fallback
<RestrictedSection
  allowedRoles={['tax_preparer']}
  fallback={<UpgradePrompt />}
>
  <PreparerTools />
</RestrictedSection>
```

### Phase 5: Admin UI
Create admin interface at `/admin/content-restrictions`:
- Manage route restrictions
- Configure role-based access rules
- Set username allow/block lists
- Configure redirect URLs
- Test access rules

### Phase 6: API Routes
Create API endpoints:
- `POST /api/restrictions/route` - Create route restriction
- `GET /api/restrictions/route?path=` - Get restrictions for route
- `PUT /api/restrictions/route/:id` - Update restriction
- `DELETE /api/restrictions/route/:id` - Remove restriction
- `POST /api/restrictions/content` - Create content restriction
- `GET /api/restrictions/check` - Check if user has access

---

## Key Differences from WordPress Plugin

### What TaxGeniusPro Already Has
✅ **Role-based permissions** - Comprehensive system with 38+ permissions
✅ **Route protection** - Middleware-based with pattern matching
✅ **Admin view-as** - Admins can preview as different roles
✅ **Redirect handling** - Role-based automatic redirects
✅ **Public routes** - Extensive list of public routes defined

### What Needs to be Added
🔨 **Username-based access** - Allow/block specific usernames
🔨 **Content-level restrictions** - Not just routes, but page sections
🔨 **Dynamic restrictions** - Database-driven rules (not hardcoded)
🔨 **Hide from navigation** - Conditional menu item hiding
🔨 **Custom redirects** - Per-page/route custom redirect URLs
🔨 **Content filtering** - Filter lists/queries by user access
🔨 **Admin UI** - Interface to manage restrictions visually

### What Doesn't Apply
❌ **WordPress-specific features** - wp_query, post_meta, taxonomies
❌ **Inverted mode** - Not needed with Clerk's architecture
❌ **Comment filtering** - No comment system in Next.js app
❌ **Visual Composer integration** - Not applicable

---

## Implementation Priority

### High Priority (Core Features)
1. ✅ Database schema for restrictions
2. ✅ Username-based allow/block lists
3. ✅ Content restriction utility functions
4. ✅ Middleware enhancements for dynamic restrictions
5. ✅ React components for content restriction

### Medium Priority (Enhanced UX)
6. Custom redirect URLs per route
7. Hide from navigation functionality
8. Admin UI for managing restrictions
9. API routes for restriction management
10. Content filtering utilities

### Low Priority (Nice to Have)
11. Custom HTML/JavaScript on block
12. Analytics for blocked access attempts
13. Temporary access grants (time-limited)
14. IP-based restrictions
15. Bulk restriction management

---

## Migration Path

### Step 1: Add Database Models
```bash
# Add models to prisma/schema.prisma
npx prisma migrate dev --name add_content_restrictions
```

### Step 2: Create Core Utilities
```bash
# Create new file
touch src/lib/content-restriction.ts
touch src/lib/username-access.ts
```

### Step 3: Create Components
```bash
# Create component directory
mkdir src/components/access-control
touch src/components/access-control/RestrictedContent.tsx
touch src/components/access-control/HiddenForRoles.tsx
```

### Step 4: Enhance Middleware
```typescript
// Update src/middleware.ts
import { checkRouteAccess } from '@/lib/content-restriction';
```

### Step 5: Create Admin UI
```bash
# Create admin pages
mkdir src/app/admin/content-restrictions
touch src/app/admin/content-restrictions/page.tsx
```

---

## Security Considerations

### Critical Security Points
1. **Username validation**: Case-insensitive matching, trim whitespace
2. **Priority order**: Username rules > Role rules > Default rules
3. **Database checks**: Always check database for latest restrictions
4. **Session validation**: Verify user session before granting access
5. **Admin-only management**: Only super_admin can modify restrictions

### Best Practices
- Store restrictions in database, not environment variables
- Cache restrictions with short TTL (5 minutes max)
- Log unauthorized access attempts
- Validate all user inputs for username lists
- Use server-side checks (never trust client-side)

---

## Testing Strategy

### Unit Tests
- Username matching (case-insensitive, trimming)
- Role checking logic
- Priority ordering (username > role > default)
- Redirect URL generation

### Integration Tests
- Middleware route protection
- API endpoint access control
- Component rendering based on permissions
- Database query filtering

### E2E Tests
- User cannot access blocked routes
- Custom redirects work correctly
- Username allow list grants access
- Username block list denies access
- Admin UI creates valid restrictions

---

## Success Metrics

### Functionality
- ✅ All routes can be dynamically restricted
- ✅ Username-based access control works correctly
- ✅ Content sections can be hidden by role
- ✅ Custom redirects function properly
- ✅ Navigation items conditionally hide

### Performance
- ⚡ Access checks complete in < 50ms
- ⚡ Middleware overhead < 10ms per request
- ⚡ Database queries optimized with indexing
- ⚡ Restrictions cached when possible

### Security
- 🔒 No bypassing restrictions via client-side manipulation
- 🔒 All checks happen server-side
- 🔒 Unauthorized access logged
- 🔒 Only super_admins can manage restrictions

---

## Next Steps

1. **Review this analysis** with the team
2. **Approve database schema** changes
3. **Create utility functions** for core access control
4. **Build React components** for content restriction
5. **Enhance middleware** with dynamic restrictions
6. **Create admin UI** for restriction management
7. **Write tests** for all new functionality
8. **Deploy to production** with feature flags

---

## Files to Create

### Utilities
- `src/lib/content-restriction.ts` - Core access control logic
- `src/lib/username-access.ts` - Username-based allow/block
- `src/lib/route-restriction.ts` - Dynamic route restrictions
- `src/lib/content-filter.ts` - Filter content by access

### Components
- `src/components/access-control/RestrictedContent.tsx`
- `src/components/access-control/HiddenForRoles.tsx`
- `src/components/access-control/RestrictedSection.tsx`
- `src/components/access-control/AccessGate.tsx`

### API Routes
- `src/app/api/restrictions/route/route.ts`
- `src/app/api/restrictions/content/route.ts`
- `src/app/api/restrictions/check/route.ts`

### Admin Pages
- `src/app/admin/content-restrictions/page.tsx`
- `src/app/admin/content-restrictions/[id]/page.tsx`

### Database
- `prisma/migrations/XXX_add_content_restrictions.sql`

---

## Conclusion

The WordPress "Pages by User Role" plugin provides robust content restriction features that can be adapted to TaxGeniusPro's Next.js architecture. The proposed implementation leverages existing Clerk authentication and permission systems while adding:

1. **Username-based access control** (high priority)
2. **Dynamic route restrictions** (database-driven)
3. **Content-level permissions** (beyond just routes)
4. **Enhanced middleware** (with custom redirects)
5. **Admin management UI** (for non-technical configuration)

This system will provide granular control over content visibility and access while maintaining security and performance standards.
