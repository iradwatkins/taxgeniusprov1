# Frontend Technologies

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

## Styling & UI Components

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Tailwind CSS** | 4.1.13 | ✅ Active | Utility-first styling, excellent DX |
| **shadcn/ui** | Latest | ✅ Active | Accessible, customizable components |
| **Radix UI** | Latest | ✅ Active | Unstyled accessible primitives |
| **Lucide React** | 0.544.0+ | ✅ Active | Beautiful, consistent icons |
| **Framer Motion** | 12.23.12+ | ✅ Active | Smooth animations |

## Component Architecture

### Directory Structure
```
components/
├── ui/                     # shadcn/ui styled components
│   ├── button.tsx         # Button component
│   ├── input.tsx          # Input component
│   ├── dialog.tsx         # Dialog/modal component
│   ├── card.tsx           # Card component
│   ├── dropdown-menu.tsx  # Dropdown component
│   └── ...                # Other UI primitives
├── features/              # Feature-specific components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-provider.tsx
│   ├── dashboard/         # Dashboard components
│   │   ├── stats-card.tsx
│   │   ├── recent-activity.tsx
│   │   └── quick-actions.tsx
│   └── referrals/         # Referral system components
│       ├── referral-link.tsx
│       ├── referral-stats.tsx
│       └── referral-list.tsx
├── layout/                # Layout components
│   ├── header.tsx         # Site header
│   ├── footer.tsx         # Site footer
│   ├── sidebar.tsx        # Dashboard sidebar
│   └── nav.tsx            # Navigation
└── shared/                # Shared utility components
    ├── loading-spinner.tsx
    ├── error-boundary.tsx
    ├── empty-state.tsx
    └── pagination.tsx
```

## State Management

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **@tanstack/react-query** | 5.87.4+ | ✅ Active | Server state management, caching |
| **React Context** | Built-in | ✅ Active | Global client state (minimal) |
| **React Hook Form** | 7.62.0+ | ✅ Active | Form state management |
| **Zod** | 4.1.8+ | ✅ Active | Schema validation |

### State Management Strategy

**1. Server State → React Query**
```typescript
// app/dashboard/hooks/use-referrals.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const res = await fetch('/api/referrals');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in component
function ReferralsList() {
  const { data, isLoading, error } = useReferrals();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ReferralsTable data={data} />;
}
```

**2. Form State → React Hook Form + Zod**
```typescript
// components/features/auth/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
```

**3. Global UI State → React Context**
```typescript
// app/providers/theme-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**4. URL State → Next.js Routing**
```typescript
// app/dashboard/referrals/page.tsx
import { redirect } from 'next/navigation';

export default function ReferralsPage({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const filter = searchParams.filter || 'all';

  // Use search params for pagination/filtering
  return <ReferralsList page={page} filter={filter} />;
}
```

## Routing & Navigation

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Next.js App Router** | Built-in | ✅ Active | File-based routing, layouts |
| **next/navigation** | Built-in | ✅ Active | Programmatic navigation |

### Routing Structure
```
app/
├── (marketing)/              # Marketing pages (no auth required)
│   ├── page.tsx             # Homepage
│   ├── pricing/page.tsx     # Pricing
│   ├── about/page.tsx       # About us
│   └── layout.tsx           # Marketing layout
├── auth/                     # Authentication pages
│   ├── sign-in/page.tsx     # Login
│   ├── sign-up/page.tsx     # Registration
│   └── verify/page.tsx      # Email verification
├── dashboard/                # Protected dashboards
│   ├── layout.tsx           # Dashboard layout
│   ├── client/              # Client dashboard
│   │   ├── page.tsx         # Overview
│   │   ├── documents/       # Document management
│   │   └── settings/        # Client settings
│   ├── preparer/            # Tax preparer dashboard
│   │   ├── page.tsx         # Overview
│   │   ├── clients/         # Client list
│   │   └── calendar/        # Appointments
│   └── referrer/            # Referrer dashboard
│       ├── page.tsx         # Overview
│       ├── stats/           # Statistics
│       └── payouts/         # Payout history
├── locations/                # Dynamic landing pages
│   └── [city]/              # City-specific pages
│       └── page.tsx         # /locations/houston
└── admin/                    # Admin area
    ├── layout.tsx           # Admin layout
    ├── users/               # User management
    └── analytics/           # Analytics
```

### Navigation Examples

**1. Link Component**
```typescript
import Link from 'next/link';

export function Nav() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/referrals">Referrals</Link>
      <Link href="/pricing">Pricing</Link>
    </nav>
  );
}
```

**2. Programmatic Navigation**
```typescript
'use client';

import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    // Login logic
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>Log in</button>;
}
```

**3. Dynamic Routes**
```typescript
// app/locations/[city]/page.tsx
export default function CityPage({
  params,
}: {
  params: { city: string };
}) {
  return <h1>Tax Services in {params.city}</h1>;
}
```

## Styling with Tailwind CSS

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Styling Pattern
```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

## Animations with Framer Motion

```typescript
'use client';

import { motion } from 'framer-motion';

export function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// Page transitions
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## Form Validation Examples

### Complex Form with Nested Validation
```typescript
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: addressSchema,
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN format: XXX-XX-XXXX'),
});

type UserFormData = z.infer<typeof userSchema>;
```

## Responsive Design

### Tailwind Breakpoints
```typescript
// Mobile-first responsive design
<div className="
  w-full          // Mobile: full width
  md:w-1/2        // Tablet: half width
  lg:w-1/3        // Desktop: one-third width
  xl:w-1/4        // Large: one-quarter width
">
  Content
</div>
```

### Mobile Navigation Example
```typescript
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="md:hidden">
          {/* Mobile menu items */}
        </div>
      )}
    </>
  );
}
```

## Performance Best Practices

### 1. Code Splitting
```typescript
import dynamic from 'next/dynamic';

// Only load chart on client
const Chart = dynamic(() => import('@/components/chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
```

### 2. Image Optimization
```typescript
import Image from 'next/image';

export function ProfileImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="rounded-full"
      priority // For above-the-fold images
    />
  );
}
```

### 3. Suspense Boundaries
```typescript
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsLoading />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<ActivityLoading />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

## Related Documentation

- [Core Technologies](./core.md)
- [Backend Stack](./backend.md)
- [Development Workflow](./development.md)
- [Performance Optimization](./performance.md)

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** Development Team
