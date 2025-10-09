# Development Tools & Workflow

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

The Tax Genius platform uses modern development tools for code quality, testing, and efficient workflows.

---

## Code Quality Tools

### ESLint

| Feature | Details |
|---------|---------|
| **Version** | 9+ |
| **Purpose** | Code linting and style enforcement |
| **Status** | ✅ Active |

**Configuration:**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Usage:**
```bash
# Lint all files
npm run lint

# Lint and fix
npm run lint:fix

# Lint specific directory
npx eslint src/
```

### Prettier

| Feature | Details |
|---------|---------|
| **Version** | Latest |
| **Purpose** | Code formatting |
| **Status** | ✅ Active |

**Configuration:**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Ignore patterns:**
```
// .prettierignore
node_modules
.next
out
build
dist
coverage
*.min.js
```

**Usage:**
```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific files
npx prettier --write "src/**/*.{ts,tsx}"
```

### TypeScript

| Feature | Details |
|---------|---------|
| **Version** | 5+ |
| **Purpose** | Type checking |
| **Status** | ✅ Active |

**Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "dom", "dom.iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Usage:**
```bash
# Type check
npm run type-check

# Watch mode
npx tsc --noEmit --watch
```

---

## Testing Tools

### Jest

| Feature | Details |
|---------|---------|
| **Version** | 30.1.3+ |
| **Purpose** | Unit testing framework |
| **Status** | ✅ Active |

**Configuration:**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Setup:**
```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

**Usage:**
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.ts
```

### React Testing Library

| Feature | Details |
|---------|---------|
| **Version** | 16.3.0+ |
| **Purpose** | Component testing |
| **Status** | ✅ Active |

**Example Test:**
```typescript
// src/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Playwright

| Feature | Details |
|---------|---------|
| **Version** | 1.55.0+ |
| **Purpose** | End-to-end testing |
| **Status** | ✅ Active |

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example Test:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign in successfully', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

**Usage:**
```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

---

## Testing Strategy

### Test Types

| Test Type | Purpose | Coverage Target | Tool |
|-----------|---------|-----------------|------|
| **Unit Tests** | Business logic, utilities | 80%+ | Jest |
| **Integration Tests** | API routes, services | 70%+ | Jest |
| **Component Tests** | UI components | 70%+ | Testing Library |
| **E2E Tests** | Critical user flows | Key paths | Playwright |

### Critical User Flows to Test

1. **Authentication:**
   - Sign up
   - Sign in
   - Sign out
   - Password reset

2. **Client Workflow:**
   - Upload documents
   - View tax return status
   - Download completed returns
   - Make payments

3. **Preparer Workflow:**
   - View assigned clients
   - Update tax return status
   - Upload completed returns

4. **Referrer Workflow:**
   - Generate referral link
   - View referral statistics
   - Track commissions

---

## Development Utilities

### Date Handling

| Package | Version | Purpose |
|---------|---------|---------|
| **date-fns** | 4.1.0+ | Date manipulation |

**Usage:**
```typescript
import { format, addDays, isBefore } from 'date-fns';

// Format date
const formatted = format(new Date(), 'MMM dd, yyyy');

// Add days
const nextWeek = addDays(new Date(), 7);

// Compare dates
const isPast = isBefore(new Date('2024-01-01'), new Date());
```

### Class Management

| Package | Version | Purpose |
|---------|---------|---------|
| **clsx** | 2.1.1+ | Conditional classes |
| **class-variance-authority** | 0.7.1+ | Component variants |
| **tailwind-merge** | 3.3.1+ | Merge Tailwind classes |

**Usage:**
```typescript
import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// Conditional classes
const className = clsx('base-class', {
  'active-class': isActive,
  'error-class': hasError,
});

// Component variants
const buttonVariants = cva(
  'rounded font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Utility function combining clsx and twMerge
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
```

---

## Local Development Workflow

### Environment Setup

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/taxgeniuspro.git
cd taxgeniuspro
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taxgeniuspro"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Storage
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Email
RESEND_API_KEY="re_..."

# Payments
SQUARE_ACCESS_TOKEN="sq0atp-..."
SQUARE_ENVIRONMENT="sandbox"
```

4. **Run database migrations:**
```bash
npx prisma migrate dev
```

5. **Seed database (optional):**
```bash
npm run db:seed
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Format code
npm run format

# Type check
npm run type-check

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema changes
npx prisma db seed         # Seed database
```

### Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Next.js | 3005 | Main application |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache/sessions |
| MinIO | 9000 | Object storage API |
| MinIO Console | 9001 | Storage admin UI |

### Hot Reload

Next.js supports hot module replacement (HMR):
- Edit files and see changes instantly
- No need to restart server
- State preservation during development

---

## Git Workflow

### Branch Strategy

```
main (production)
  ↓
develop (staging)
  ↓
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (urgent fixes)
```

### Commit Conventions

Follow Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or tooling changes

**Examples:**
```bash
git commit -m "feat(auth): add Clerk authentication"
git commit -m "fix(payments): resolve Square webhook issue"
git commit -m "docs(readme): update installation instructions"
```

### Pre-commit Hooks

Install Husky for Git hooks:

```bash
npm install -D husky lint-staged

# Initialize Husky
npx husky install
```

**Configuration:**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Create pre-commit hook:**
```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## IDE Configuration

### VS Code

**Recommended Extensions:**
```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

**Workspace Settings:**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

---

## Debugging

### Browser DevTools

1. **React DevTools:**
   - Install React DevTools extension
   - Inspect component tree
   - View props and state

2. **Network Tab:**
   - Monitor API requests
   - Check request/response payloads
   - Identify slow requests

3. **Console:**
   - View console logs
   - Debug JavaScript errors

### VS Code Debugging

**Configuration:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3005"
    }
  ]
}
```

### Database Debugging

```bash
# Open Prisma Studio
npx prisma studio

# View database logs
tail -f /var/log/postgresql/postgresql-14-main.log

# Check database connections
SELECT * FROM pg_stat_activity;
```

---

## Performance Profiling

### React Profiler

```typescript
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Chrome DevTools Performance

1. Open DevTools
2. Go to Performance tab
3. Click Record
4. Perform actions
5. Stop recording
6. Analyze timeline

---

## Documentation

### JSDoc Comments

```typescript
/**
 * Uploads a file to MinIO storage
 *
 * @param file - The file to upload
 * @param bucket - The target bucket name
 * @param folder - Optional folder prefix
 * @returns The storage key of the uploaded file
 * @throws Error if upload fails
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string> {
  // Implementation
}
```

### Component Documentation

Use Storybook for component documentation (optional):

```bash
npm install -D @storybook/react @storybook/addon-essentials
npx storybook@latest init
```

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Infrastructure Setup](./infrastructure.md)
- [Testing Strategy](../testing/README.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

**Document Status:** ✅ Active
