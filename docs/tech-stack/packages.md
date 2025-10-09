# Package Versions

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

Complete list of all packages used in the Tax Genius platform, including version numbers and purposes.

---

## Core Dependencies

### Framework & Runtime

```json
{
  "next": "15.5.3",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "^5"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **next** | 15.5.3 | Next.js framework with App Router |
| **react** | 19.1.0 | React library with concurrent features |
| **react-dom** | 19.1.0 | React DOM rendering |
| **typescript** | 5+ | TypeScript compiler and type definitions |

---

## Database & ORM

```json
{
  "@prisma/client": "^6.16.1",
  "prisma": "^6.16.1",
  "ioredis": "^5.7.0"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **@prisma/client** | 6.16.1+ | Type-safe database client |
| **prisma** | 6.16.1+ | Prisma CLI and migrations |
| **ioredis** | 5.7.0+ | Redis client for caching and sessions |

---

## Authentication

```json
{
  "@clerk/nextjs": "latest",
  "lucia": "3.2.2"
}
```

| Package | Version | Status | Purpose |
|---------|---------|--------|---------|
| **@clerk/nextjs** | Latest | 🔄 To add | Clerk authentication for Next.js |
| **lucia** | 3.2.2 | ⚠️ Deprecated | Current auth (being replaced) |
| **@lucia-auth/adapter-prisma** | Latest | ⚠️ To remove | Lucia Prisma adapter |
| **arctic** | Latest | ⚠️ To remove | OAuth provider for Lucia |

---

## Email

```json
{
  "resend": "^6.0.3",
  "@react-email/components": "^0.5.3"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **resend** | 6.0.3+ | Email sending service |
| **@react-email/components** | 0.5.3+ | React-based email templates |

---

## Storage

```json
{
  "@aws-sdk/client-s3": "^3.888.0",
  "@aws-sdk/s3-request-presigner": "^3.888.0"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **@aws-sdk/client-s3** | 3.888.0+ | S3 client (works with MinIO) |
| **@aws-sdk/s3-request-presigner** | 3.888.0+ | Generate presigned URLs |

---

## Payments

```json
{
  "square": "^43.0.2"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **square** | 43.0.2+ | Square payment processing |

---

## State Management

```json
{
  "@tanstack/react-query": "^5.87.4",
  "react-hook-form": "^7.62.0",
  "zod": "^4.1.8"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-query** | 5.87.4+ | Server state management and caching |
| **react-hook-form** | 7.62.0+ | Form state management |
| **zod** | 4.1.8+ | Schema validation |

---

## UI Components & Styling

```json
{
  "tailwindcss": "^4.1.13",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-toast": "latest",
  "@radix-ui/react-tooltip": "latest",
  "lucide-react": "^0.544.0",
  "framer-motion": "^12.23.12"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **tailwindcss** | 4.1.13+ | Utility-first CSS framework |
| **@radix-ui/react-*** | Latest | Unstyled accessible UI primitives |
| **lucide-react** | 0.544.0+ | Icon library |
| **framer-motion** | 12.23.12+ | Animation library |

### Radix UI Components

```json
{
  "@radix-ui/react-alert-dialog": "latest",
  "@radix-ui/react-avatar": "latest",
  "@radix-ui/react-checkbox": "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-label": "latest",
  "@radix-ui/react-popover": "latest",
  "@radix-ui/react-radio-group": "latest",
  "@radix-ui/react-scroll-area": "latest",
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-separator": "latest",
  "@radix-ui/react-slider": "latest",
  "@radix-ui/react-slot": "latest",
  "@radix-ui/react-switch": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-toast": "latest",
  "@radix-ui/react-tooltip": "latest"
}
```

---

## Background Jobs

```json
{
  "bull": "^4.16.5",
  "@bull-board/express": "^6.12.7"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **bull** | 4.16.5+ | Job queue management with Redis |
| **@bull-board/express** | 6.12.7+ | Queue monitoring dashboard |

---

## Real-time Communication

```json
{
  "socket.io": "^4.8.1",
  "web-push": "^3.6.7"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **socket.io** | 4.8.1+ | Real-time bidirectional communication |
| **web-push** | 3.6.7+ | PWA push notifications |

---

## Development Tools

### Code Quality

```json
{
  "eslint": "^9",
  "prettier": "latest",
  "@typescript-eslint/eslint-plugin": "latest",
  "@typescript-eslint/parser": "latest",
  "eslint-config-next": "15.5.3",
  "eslint-config-prettier": "latest"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **eslint** | 9+ | Code linting |
| **prettier** | Latest | Code formatting |
| **@typescript-eslint/eslint-plugin** | Latest | TypeScript ESLint rules |
| **@typescript-eslint/parser** | Latest | TypeScript parser for ESLint |
| **eslint-config-next** | 15.5.3 | Next.js ESLint configuration |
| **eslint-config-prettier** | Latest | Prettier integration for ESLint |

### Testing

```json
{
  "jest": "^30.1.3",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/user-event": "^14.5.2",
  "playwright": "^1.55.0",
  "@playwright/test": "^1.55.0"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **jest** | 30.1.3+ | Unit testing framework |
| **@testing-library/react** | 16.3.0+ | React component testing |
| **@testing-library/jest-dom** | 6.8.0+ | Custom Jest matchers for DOM |
| **@testing-library/user-event** | 14.5.2+ | User interaction simulation |
| **playwright** | 1.55.0+ | E2E testing framework |
| **@playwright/test** | 1.55.0+ | Playwright test runner |

---

## Utilities

```json
{
  "date-fns": "^4.1.0",
  "clsx": "^2.1.1",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.3.1"
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **date-fns** | 4.1.0+ | Date manipulation and formatting |
| **clsx** | 2.1.1+ | Conditional CSS class utility |
| **class-variance-authority** | 0.7.1+ | Component variant management |
| **tailwind-merge** | 3.3.1+ | Merge Tailwind CSS classes intelligently |

---

## AI Services (To Add)

```json
{
  "@google/generative-ai": "latest",
  "@anthropic-ai/sdk": "latest"
}
```

| Package | Version | Status | Purpose |
|---------|---------|--------|---------|
| **@google/generative-ai** | Latest | 📋 To add | Google Gemini API client |
| **@anthropic-ai/sdk** | Latest | 📋 Optional | Claude API client (backup) |

---

## Complete package.json

### Dependencies

```json
{
  "dependencies": {
    "next": "15.5.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "typescript": "^5",

    "@prisma/client": "^6.16.1",
    "ioredis": "^5.7.0",

    "resend": "^6.0.3",
    "@react-email/components": "^0.5.3",

    "@aws-sdk/client-s3": "^3.888.0",
    "@aws-sdk/s3-request-presigner": "^3.888.0",

    "square": "^43.0.2",

    "@tanstack/react-query": "^5.87.4",
    "react-hook-form": "^7.62.0",
    "zod": "^4.1.8",

    "tailwindcss": "^4.1.13",
    "@radix-ui/react-alert-dialog": "latest",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-checkbox": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-popover": "latest",
    "@radix-ui/react-radio-group": "latest",
    "@radix-ui/react-scroll-area": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-slider": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-switch": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-toast": "latest",
    "@radix-ui/react-tooltip": "latest",
    "lucide-react": "^0.544.0",
    "framer-motion": "^12.23.12",

    "bull": "^4.16.5",
    "@bull-board/express": "^6.12.7",

    "socket.io": "^4.8.1",
    "web-push": "^3.6.7",

    "date-fns": "^4.1.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^3.3.1",

    "lucia": "3.2.2",
    "@lucia-auth/adapter-prisma": "latest",
    "arctic": "latest"
  }
}
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "prisma": "^6.16.1",

    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",

    "eslint": "^9",
    "eslint-config-next": "15.5.3",
    "eslint-config-prettier": "latest",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",

    "prettier": "latest",

    "jest": "^30.1.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/user-event": "^14.5.2",
    "jest-environment-jsdom": "^30.1.3",

    "playwright": "^1.55.0",
    "@playwright/test": "^1.55.0",

    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

---

## Installation Commands

### Initial Setup

```bash
# Install all dependencies
npm install

# Install specific dependencies
npm install next@15.5.3 react@19.1.0 react-dom@19.1.0

# Install dev dependencies
npm install -D typescript @types/node @types/react
```

### Adding New Packages

```bash
# Add Clerk authentication
npm install @clerk/nextjs

# Add AI services
npm install @google/generative-ai
# OR
npm install @anthropic-ai/sdk

# Add monitoring (future)
npm install @sentry/nextjs
```

---

## Package Removal (Post-Migration)

### After Clerk Migration

```bash
# Remove Lucia and related packages
npm uninstall lucia @lucia-auth/adapter-prisma arctic
```

### After Resend Activation

```bash
# Remove SendGrid (if previously used)
npm uninstall @sendgrid/mail
```

---

## Package Update Strategy

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update all packages to latest within semver range
npm update

# Update all packages to latest (breaking changes possible)
npm update --latest
```

### Major Version Updates

```bash
# Update Next.js
npm install next@latest react@latest react-dom@latest

# Update Prisma
npm install @prisma/client@latest
npm install -D prisma@latest

# Regenerate Prisma Client
npx prisma generate
```

### Security Updates

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

---

## Bundle Size Optimization

### Analyzing Bundle

```bash
# Build with bundle analyzer
npm run build

# Analyze output
npx @next/bundle-analyzer
```

### Tree Shaking

Ensure packages support tree shaking:
- ✅ lodash-es (tree-shakeable)
- ❌ lodash (not tree-shakeable)

```typescript
// Good - tree shakeable
import { debounce } from 'lodash-es';

// Bad - imports entire library
import _ from 'lodash';
```

### Dynamic Imports

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

---

## Dependency Management Best Practices

### Version Pinning

```json
{
  "dependencies": {
    "next": "15.5.3",        // Exact version
    "react": "^19.1.0",       // Minor updates allowed
    "zod": "~4.1.8"           // Patch updates only
  }
}
```

### Lock File

Always commit `package-lock.json`:
- Ensures consistent installs
- Prevents supply chain attacks
- Enables reproducible builds

### Audit Dependencies

```bash
# Review licenses
npx license-checker

# Check for duplicate packages
npm ls

# Find duplicate dependencies
npx npm-check-duplicates
```

---

## Package Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3005",
    "build": "next build",
    "start": "next start -p 3005",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "prepare": "husky install"
  }
}
```

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Development Workflow](./development.md)
- [Infrastructure Setup](./infrastructure.md)
- [Migration Guide](../migration-guide.md)

---

**Document Status:** ✅ Active
