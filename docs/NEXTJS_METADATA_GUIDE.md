# Next.js 15 Metadata & Viewport Guide

**Date:** October 24, 2025
**Next.js Version:** 15.5.3

## Overview

This guide explains the correct way to configure metadata and viewport settings in Next.js 15, which changed from previous versions.

---

## Viewport Configuration

### ❌ Old Pattern (Next.js 14 and earlier)

In Next.js 14, viewport and themeColor were part of the metadata export:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'My app description',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ff6b35',
};
```

**This pattern is deprecated in Next.js 15 and will cause build warnings:**

```
⚠ Unsupported metadata viewport is configured in metadata export
⚠ Unsupported metadata themeColor is configured in metadata export
```

---

### ✅ New Pattern (Next.js 15+)

In Next.js 15, viewport settings must be exported separately using the `Viewport` type:

```typescript
import type { Metadata, Viewport } from 'next';

// Viewport export (NEW in Next.js 15)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ff6b35',
};

// Metadata export (viewport and themeColor removed)
export const metadata: Metadata = {
  title: 'My App',
  description: 'My app description',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'My App',
    description: 'My app description',
  },
};
```

---

## Viewport Type Properties

The `Viewport` type supports the following properties:

```typescript
export const viewport: Viewport = {
  // Basic viewport settings
  width: 'device-width' | number,
  height: 'device-height' | number,
  initialScale: number,
  minimumScale: number,
  maximumScale: number,
  userScalable: boolean,

  // Visual settings
  themeColor: string | ThemeColorDescriptor[],
  colorScheme: 'normal' | 'light' | 'dark' | 'light dark',

  // Mobile-specific
  interactiveWidget: 'resizes-visual' | 'resizes-content' | 'overlays-content',
};
```

---

## Common Examples

### Example 1: Basic Mobile-Optimized Viewport

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
```

### Example 2: Viewport with Theme Color

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0070f3',
};
```

### Example 3: Dynamic Theme Color (Dark Mode)

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
```

### Example 4: Full Configuration

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ff6b35',
  colorScheme: 'light dark',
};
```

---

## Layout Hierarchy

### Root Layout (`app/layout.tsx`)

The root layout typically defines the default viewport configuration:

```typescript
// app/layout.tsx
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b35',
};
```

This configuration cascades to all child routes.

### Child Layouts (Override Parent)

Child layouts can override the parent viewport configuration:

```typescript
// app/dashboard/layout.tsx
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0070f3', // Different color for dashboard
};
```

---

## Migration Checklist

When migrating from Next.js 14 to Next.js 15:

- [ ] Import `Viewport` type from 'next'
- [ ] Create separate `viewport` export
- [ ] Move `viewport` string to viewport object properties
- [ ] Move `themeColor` to viewport export
- [ ] Remove `viewport` and `themeColor` from metadata export
- [ ] Test build to verify no warnings

---

## Impact on TaxGeniusPro

**Before Migration:**
- 88 build warnings (44 pages × 2 warnings)
- Deprecated pattern in use

**After Migration:**
- 0 build warnings ✅
- Next.js 15 compliant
- Single change in root layout fixed all pages

**Files Modified:**
- `src/app/layout.tsx` - Root layout updated

---

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Viewport API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

## Quick Reference

```typescript
// ✅ Correct Next.js 15 Pattern
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b35',
};

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

---

**Last Updated:** October 24, 2025
**Maintainer:** DevOps Team
