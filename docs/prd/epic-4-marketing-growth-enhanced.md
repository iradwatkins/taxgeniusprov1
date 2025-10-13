# Tax Genius Pro - Epic 4: Marketing & Growth Implementation

**Status:** Draft
**Version:** 1.0
**Date:** October 10, 2025
**Epic Owner:** Product Management
**Type:** Brownfield Enhancement PRD

---

## Table of Contents

1. [Intro Project Analysis and Context](#1-intro-project-analysis-and-context)
2. [Requirements](#2-requirements)
3. [User Interface Enhancement Goals](#3-user-interface-enhancement-goals)
4. [Technical Constraints and Integration Requirements](#4-technical-constraints-and-integration-requirements)
5. [Epic and Story Structure](#5-epic-and-story-structure)
6. [Epic 4: Marketing & Growth Implementation](#6-epic-4-marketing--growth-implementation)

---

## 1. Intro Project Analysis and Context

### 1.1 Analysis Source

**IDE-based fresh analysis** - Project files are available and architecture documentation exists at `/docs/architecture/`.

### 1.2 Current Project State

Based on existing architecture documentation ([docs/architecture/01-overview.md](../architecture/01-overview.md)):

**Project Summary:**
Tax Genius Platform is a **SaaS application** connecting tax clients, preparers, and referrers through a comprehensive web platform. Currently deployed as a self-hosted Next.js 15 application with PostgreSQL database, Clerk authentication, MinIO storage, and Resend email service.

**Completed Epics:**
- **Epic 1:** Core Foundation (100%) - Authentication, database, role-based dashboards
- **Epic 2:** Referrer Engine (95%) - Vanity URLs, referral tracking, basic analytics
- **Epic 3:** Client-Preparer Workflow (100%) - Tax questionnaire, document upload, automated emails

**Current Status:**
The platform has a working MVP for core tax preparation workflows. Epic 4 focuses on **marketing & growth capabilities** to scale lead generation and content creation.

### 1.3 Available Documentation Analysis

✅ **Complete Architecture Documentation Available** (from document-project analysis):

- ✅ Tech Stack Documentation ([docs/architecture/01-overview.md](../architecture/01-overview.md))
- ✅ Database Schema ([docs/architecture/02-database-schema.md](../architecture/02-database-schema.md))
- ✅ API Design Patterns ([docs/architecture/03-api-design.md](../architecture/03-api-design.md))
- ✅ Storage Architecture ([docs/architecture/04-storage-minio.md](../architecture/04-storage-minio.md))
- ✅ Authentication ([docs/architecture/05-authentication-clerk.md](../architecture/05-authentication-clerk.md))
- ✅ Email Service ([docs/architecture/06-email-resend.md](../architecture/06-email-resend.md))
- ✅ Security ([docs/architecture/07-security.md](../architecture/07-security.md))
- ✅ Deployment ([docs/architecture/08-deployment.md](../architecture/08-deployment.md))
- ✅ Performance ([docs/architecture/09-performance.md](../architecture/09-performance.md))
- ✅ AI Content ([docs/architecture/10-ai-content.md](../architecture/10-ai-content.md))

**Note:** Using existing comprehensive project analysis from architecture documentation.

### 1.4 Enhancement Scope Definition

**Enhancement Type:**
- ✅ **New Feature Addition** (primary)
- ✅ **Integration with New Systems** (LLM APIs, payment processing)
- ⬜ Major Feature Modification
- ⬜ Performance/Scalability Improvements
- ⬜ UI/UX Overhaul
- ⬜ Technology Stack Upgrade

**Enhancement Description:**

Epic 4 adds **marketing and growth infrastructure** to the Tax Genius Platform, enabling scalable content generation and lead acquisition. This includes: (1) AI-powered content generation for localized landing pages, (2) dynamic routing system for 200+ SEO-optimized city landing pages, (3) e-commerce store for branded merchandise, and (4) Tax Genius Academy foundation for preparer training.

**Impact Assessment:**
- ✅ **Moderate Impact** - Some existing code changes required (routing, admin areas)
- NEW admin-protected routes and components
- NEW database tables (landing_pages, products, training_materials)
- NEW external API integrations (LLM, payment processor)
- Existing public routing will be extended with new dynamic routes

### 1.5 Goals and Background Context

**Goals:**
- Enable marketing team to generate 200+ localized landing pages at scale using AI
- Improve SEO visibility through city-specific content with dynamic metadata
- Create revenue stream through branded merchandise sales
- Establish foundation for preparer certification and training program
- Reduce manual content creation time from days to minutes per page

**Background Context:**

The Tax Genius Platform has successfully completed core workflow functionality (Epics 1-3), establishing a working tax preparation system with referrer tracking and client-preparer communication. However, the current marketing approach relies on manual content creation and lacks scalable lead generation infrastructure.

Epic 4 addresses this gap by introducing AI-powered content generation tools and dynamic landing page systems that enable the marketing team to rapidly deploy localized SEO campaigns. The addition of an e-commerce store supports brand awareness through merchandise, while the Academy foundation sets the stage for a future preparer certification program.

### 1.6 Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|---------|
| Initial PRD Creation | 2025-10-10 | 1.0 | Created brownfield PRD for Epic 4 with comprehensive requirements and integration details | PM Agent (John) |

---

## 2. Requirements

### 2.1 Functional Requirements

**FR1:** The platform shall provide an admin-protected AI content generation tool that accepts city name and keywords as input and returns SEO-optimized content including headline, body copy, and Q&A accordion data.

**FR2:** The AI content generation tool shall integrate with a Large Language Model API (Google Gemini or Claude) using structured prompts to ensure consistent tone, format, and SEO best practices.

**FR3:** The platform shall support dynamic routing for city-specific landing pages using URL patterns like `/locations/[city]` where content is fetched from the database based on the city slug.

**FR4:** Each dynamically generated landing page shall include unique SEO metadata (title tag, meta description, Open Graph tags) populated from database content.

**FR5:** The platform shall provide a product catalog interface displaying branded merchandise (t-shirts, business cards) with images, names, and prices.

**FR6:** The platform shall implement a client-side shopping cart allowing users to add items, view cart contents, and see total pricing before checkout.

**FR7:** The platform shall integrate with a third-party payment processor (Stripe or PayPal) for merchandise checkout, redirecting users to hosted payment pages.

**FR8:** The platform shall provide a role-protected Academy dashboard accessible only to users with PREPARER or TRAINEE roles, displaying available training materials and current certification status.

**FR9:** Generated AI content shall be stored in the database with versioning capability to track content changes over time.

**FR10:** The system shall support batch generation of landing page content for multiple cities to enable efficient scaling to 200+ pages.

### 2.2 Non-Functional Requirements

**NFR1:** AI content generation requests shall complete within 10 seconds or provide clear progress indication to prevent timeout perception.

**NFR2:** Dynamic landing pages shall load with initial content within 2 seconds using server-side rendering and edge caching strategies.

**NFR3:** The AI content generation tool shall implement rate limiting to prevent API quota exhaustion (max 10 requests per minute per admin user).

**NFR4:** All admin-protected routes shall enforce role-based access control through Clerk middleware, denying access to non-admin users with appropriate error messages.

**NFR5:** Payment integration shall use secure, PCI-compliant hosted checkout flows to avoid storing sensitive payment information.

**NFR6:** The shopping cart implementation shall persist across browser sessions using localStorage with secure data serialization.

**NFR7:** Generated landing page content shall maintain consistent brand voice, tone, and messaging as defined in existing marketing guidelines.

**NFR8:** The system shall log all AI content generation requests including input parameters, output summaries, and API costs for audit and optimization purposes.

**NFR9:** Dynamic landing pages shall be crawlable by search engines with proper sitemap generation and robots.txt configuration.

**NFR10:** The Academy portal shall maintain existing performance characteristics, with no degradation to other dashboard load times.

### 2.3 Compatibility Requirements

**CR1: Existing API Compatibility** - All existing API routes (`/api/auth/*`, `/api/referrals/*`, `/api/submissions/*`) shall remain unchanged and continue functioning without modification. New AI content and payment APIs shall follow established Next.js App Router patterns using route handlers.

**CR2: Database Schema Compatibility** - New tables (landing_pages, products, training_materials, preparer_progress) shall be additive only. Existing tables (profiles, tax_returns, referrals) shall not be modified. All new foreign key relationships shall be optional (nullable) to prevent breaking existing records.

**CR3: UI/UX Consistency** - New admin tools, landing pages, store, and Academy interfaces shall use existing shadcn/ui component library, Tailwind CSS design tokens, and established layout patterns (dashboard sidebar, card-based layouts). Color scheme, typography, and spacing shall match existing application styles.

**CR4: Integration Compatibility** - New external integrations (LLM APIs, payment processors) shall not interfere with existing services (Clerk auth, Resend email, MinIO storage). API keys and configuration shall be isolated in environment variables with clear namespacing (e.g., `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`).

---

## 3. User Interface Enhancement Goals

### 3.1 Integration with Existing UI

**Design System Integration:**

All new UI components for Epic 4 shall integrate with the existing Tax Genius Platform design system:

- **Component Library:** Utilize shadcn/ui components (Button, Input, Card, Dialog, Select, Accordion) already installed in the project
- **Styling Framework:** Apply Tailwind CSS classes following existing utility patterns in `/src/app` and `/src/components`
- **Layout Patterns:** Adopt established dashboard layouts with sidebar navigation, header, and content areas used in client/preparer/referrer dashboards
- **Color Palette:** Use existing CSS variables for brand colors (primary, secondary, accent, muted) defined in `globals.css`
- **Typography:** Follow existing font hierarchy (Inter/system font stack) with consistent heading sizes and body text styles
- **Iconography:** Use Lucide React icons matching existing icon usage throughout the application

**Existing Pattern References:**
- Admin routes: Follow `/src/app/admin/*` structure (if exists) or create new protected admin area
- Dashboard cards: Reuse stat card patterns from referrer dashboard
- Form inputs: Apply react-hook-form + Zod validation patterns from tax questionnaire
- File uploads: Reference document upload component patterns from client submission flow

### 3.2 Modified/New Screens and Views

**New Screens:**

1. **AI Content Generator (Admin)** - `/admin/content-generator`
   - Input form with city name, keywords fields
   - "Generate Content" button with loading state
   - Content preview panel with editable text area
   - Q&A accordion preview
   - "Save to Database" button

2. **Dynamic Landing Pages** - `/locations/[city]`
   - Hero section with city-specific headline
   - SEO-optimized body content
   - Q&A accordion section
   - Call-to-action (CTA) button to tax questionnaire
   - Footer with referrer signup link

3. **Merchandise Store** - `/store`
   - Product grid layout (3-4 columns on desktop)
   - Product cards with image, name, price
   - "Add to Cart" buttons
   - Shopping cart icon with item count in header

4. **Shopping Cart View** - `/store/cart`
   - Cart items list with quantity controls
   - Order summary with subtotal, tax, total
   - "Proceed to Checkout" button
   - Empty cart state with "Continue Shopping" link

5. **Tax Genius Academy Dashboard** - `/app/academy`
   - Certification status card (prominent display)
   - Training materials list with resource type icons (PDF, video)
   - Progress indicators for completed materials
   - "Start Training" CTAs for uncompleted resources

**Modified Screens:**

- **Main Navigation:** Add "Store" link to public header navigation
- **Preparer Dashboard:** Add "Academy" link to sidebar navigation (role-conditional)
- **Admin Navigation:** Add "Content Generator" link to admin sidebar

### 3.3 UI Consistency Requirements

**Accessibility:**
- All form inputs shall include proper ARIA labels and error messaging
- Color contrast ratios shall meet WCAG 2.1 AA standards (4.5:1 for text)
- Interactive elements shall have visible focus states for keyboard navigation
- Accordion components shall use proper ARIA expanded/collapsed states

**Responsive Design:**
- All new screens shall be mobile-responsive using Tailwind's responsive breakpoints (sm, md, lg, xl)
- Landing pages shall prioritize mobile-first content hierarchy (hero → CTA → content → accordion)
- Shopping cart shall adapt to single-column layout on mobile
- Admin content generator shall remain desktop-optimized (acceptable for internal tool)

**Loading States:**
- AI content generation shall display skeleton loaders during API requests
- Dynamic landing pages shall use React Suspense with fallback loading states
- Product images shall lazy-load with placeholder images
- Form submissions shall show disabled button states with spinner icons

**Error Handling:**
- Failed API requests shall display user-friendly toast notifications using existing toast library (sonner)
- Form validation errors shall appear inline below input fields with red text and error icons
- Empty states shall provide helpful guidance (e.g., "No products in cart" with "Browse Store" CTA)
- 404 pages for invalid city slugs shall suggest popular locations or return to homepage

**Visual Consistency:**
- Card components shall use consistent shadow depths (`shadow-sm`, `shadow-md`)
- Spacing between sections shall follow 8px grid system (p-4, p-6, p-8)
- Button styles shall match existing primary/secondary/ghost variants
- Hover states shall apply consistent transition durations (150ms-200ms)

---

## 4. Technical Constraints and Integration Requirements

### 4.1 Existing Technology Stack

Based on architecture documentation ([docs/architecture/01-overview.md](../architecture/01-overview.md)):

**Languages:** TypeScript 5+, JavaScript (Node.js 20 LTS)

**Frameworks:**
- Next.js 15.5.3+ (App Router with Server Components)
- React 19.1.0+
- Tailwind CSS 4+

**Database:**
- PostgreSQL 15+ (primary relational database)
- Prisma 6+ (ORM with type-safe client)
- Redis 7+ (session storage & caching via ioredis)

**Infrastructure:**
- Self-hosted VPS (72.60.28.175:3005)
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt SSL

**External Dependencies:**
- Clerk.com (authentication & user management)
- MinIO (S3-compatible object storage)
- Resend (transactional email)
- Socket.io (real-time notifications)

### 4.2 Integration Approach

**Database Integration Strategy:**

New tables shall be created using Prisma migrations following existing schema patterns:

```prisma
// New tables for Epic 4
model LandingPage {
  id            String   @id @default(cuid())
  slug          String   @unique  // e.g., "atlanta", "new-york"
  city          String
  state         String?
  headline      String
  bodyContent   String   @db.Text
  metaTitle     String
  metaDescription String
  qaAccordion   Json     // Array of {question, answer} objects
  generatedBy   String?  // Admin user ID who generated content
  version       Int      @default(1)
  isPublished   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Product {
  id            String   @id @default(cuid())
  name          String
  description   String?
  price         Decimal  @db.Decimal(10, 2)
  imageUrl      String
  category      String   // "apparel", "marketing_materials"
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model TrainingMaterial {
  id            String   @id @default(cuid())
  title         String
  description   String?
  resourceType  String   // "PDF", "VIDEO", "ARTICLE"
  resourceUrl   String
  orderIndex    Int      @default(0)
  isRequired    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PreparerProgress {
  id                    String   @id @default(cuid())
  profileId             String
  profile               Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  trainingMaterialId    String
  trainingMaterial      TrainingMaterial @relation(fields: [trainingMaterialId], references: [id])
  completedAt           DateTime?
  createdAt             DateTime @default(now())

  @@unique([profileId, trainingMaterialId])
}
```

**Migration strategy:** Run `prisma migrate dev` locally, test thoroughly, then deploy with `prisma migrate deploy` on production.

**API Integration Strategy:**

All new API routes shall use Next.js App Router route handlers (`route.ts`) following existing patterns:

```typescript
// /src/app/api/ai-content/generate/route.ts
export async function POST(request: Request) {
  // 1. Authenticate with Clerk
  // 2. Authorize admin role
  // 3. Validate input with Zod
  // 4. Call LLM API (Gemini/Claude)
  // 5. Parse and structure response
  // 6. Return JSON response
}

// /src/app/api/landing-pages/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // 1. Query Prisma for landing page by slug
  // 2. Return 404 if not found or not published
  // 3. Return JSON with page data
}
```

**External API Integration:**
- **LLM API (Google Gemini):** Use `@google/generative-ai` SDK with API key from `GEMINI_API_KEY` env variable
- **Payment Processor (Stripe):** Use `stripe` SDK with `STRIPE_SECRET_KEY`, leverage Checkout Sessions API
- Rate limiting: Implement using `upstash/ratelimit` (already in dependencies)

**Frontend Integration Strategy:**

Server Components shall be used for static content (landing pages, product listings), Client Components for interactive features (cart, content generator form).

**Testing Integration Strategy:**

- Unit tests: Jest + React Testing Library for components
- API tests: Integration tests for new route handlers
- E2E tests: Playwright scenarios for critical user flows (landing page → signup, store → checkout)
- Test database: Use separate PostgreSQL instance or Docker container for test data isolation

### 4.3 Code Organization and Standards

**File Structure Approach:**

```
src/
├── app/
│   ├── admin/
│   │   └── content-generator/
│   │       ├── page.tsx                    # Admin UI for AI content gen
│   │       └── _components/
│   │           ├── ContentForm.tsx
│   │           └── ContentPreview.tsx
│   ├── locations/
│   │   └── [city]/
│   │       └── page.tsx                    # Dynamic landing page
│   ├── store/
│   │   ├── page.tsx                        # Product listing
│   │   ├── cart/
│   │   │   └── page.tsx                    # Cart view
│   │   └── _components/
│   │       ├── ProductCard.tsx
│   │       └── CartItem.tsx
│   ├── app/
│   │   └── academy/
│   │       └── page.tsx                    # Academy dashboard
│   └── api/
│       ├── ai-content/
│       │   └── generate/
│       │       └── route.ts                # AI generation endpoint
│       ├── landing-pages/
│       │   ├── route.ts                    # List all pages
│       │   └── [slug]/
│       │       └── route.ts                # Get page by slug
│       ├── products/
│       │   └── route.ts                    # Product CRUD
│       ├── checkout/
│       │   └── create-session/
│       │       └── route.ts                # Stripe checkout
│       └── academy/
│           ├── materials/
│           │   └── route.ts                # Training materials
│           └── progress/
│               └── route.ts                # Track completion
├── components/
│   ├── landing-page/
│   │   ├── LandingPageTemplate.tsx
│   │   └── QAAccordion.tsx
│   ├── store/
│   │   ├── ProductGrid.tsx
│   │   ├── ShoppingCart.tsx
│   │   └── CheckoutButton.tsx
│   └── academy/
│       ├── CertificationStatus.tsx
│       └── MaterialsList.tsx
└── lib/
    └── services/
        ├── ai-content.service.ts           # LLM integration logic
        ├── payment.service.ts              # Stripe/PayPal wrapper
        └── academy.service.ts              # Training logic
```

**Naming Conventions:**

- **Components:** PascalCase (e.g., `LandingPageTemplate.tsx`)
- **API routes:** kebab-case folders (e.g., `ai-content/generate/route.ts`)
- **Services:** camelCase with `.service.ts` suffix
- **Database models:** PascalCase singular (e.g., `LandingPage`, `Product`)
- **Environment variables:** SCREAMING_SNAKE_CASE (e.g., `GEMINI_API_KEY`)

**Coding Standards:**

- ESLint 9 configuration already in place (enforce before commits)
- Prettier for consistent formatting
- TypeScript strict mode enabled
- All components must have explicit return types
- API handlers must validate inputs with Zod schemas
- Error handling: Use try-catch with appropriate HTTP status codes
- Logging: Use existing logging patterns (console.error for errors, console.log for info)

**Documentation Standards:**

- JSDoc comments for complex business logic functions
- README updates for new environment variables
- API route documentation in OpenAPI format (optional for MVP)
- Inline comments for non-obvious code decisions

### 4.4 Deployment and Operations

**Build Process Integration:**

```bash
# Local development
npm run dev              # Next.js dev server on port 3000

# Production build
npm run build            # Creates optimized .next build
npm run start            # Starts production server

# Database migrations
npx prisma migrate dev   # Development migrations
npx prisma migrate deploy # Production migrations
npx prisma generate      # Regenerate Prisma client
```

**Deployment Strategy:**

1. **Pre-deployment:**
   - Run database migrations on production PostgreSQL
   - Set new environment variables in `.env.local`:
     - `GEMINI_API_KEY` or `ANTHROPIC_API_KEY`
     - `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
   - Test AI content generation in staging environment

2. **Deployment:**
   - Push code to repository
   - SSH to VPS (72.60.28.175)
   - Pull latest code
   - Run `npm install` for new dependencies
   - Run `npm run build`
   - Restart PM2: `pm2 restart taxgeniuspro --update-env`

3. **Post-deployment:**
   - Verify PM2 process is running: `pm2 list`
   - Check logs: `pm2 logs taxgeniuspro --lines 50`
   - Test critical paths: landing page load, AI generation, store checkout

**Monitoring and Logging:**

- **Application logs:** PM2 log files (`~/.pm2/logs/`)
- **Error tracking:** Console errors visible in PM2 logs
- **Performance monitoring:** Use Next.js built-in analytics (`speed-insights` package)
- **API usage tracking:** Log LLM API calls with token counts for cost monitoring
- **Database queries:** Enable Prisma query logging in development (`log: ['query']`)

**Configuration Management:**

Environment variables required for Epic 4:

```bash
# AI Content Generation
GEMINI_API_KEY=xxx                    # Google Gemini API key
# OR
ANTHROPIC_API_KEY=xxx                 # Claude API key (alternative)

# Payment Processing
STRIPE_SECRET_KEY=sk_live_xxx         # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_live_xxx    # Stripe public key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # Client-side access

# Feature Flags (optional)
ENABLE_AI_CONTENT_GEN=true            # Toggle AI feature
ENABLE_STORE=true                     # Toggle store feature
ENABLE_ACADEMY=true                   # Toggle academy feature
```

### 4.5 Risk Assessment and Mitigation

**Technical Risks:**

1. **LLM API Reliability**
   - **Risk:** Google Gemini API downtime or rate limiting could block content generation
   - **Mitigation:** Implement fallback to Claude API, add request queuing, cache successful responses
   - **Rollback:** Manual content creation workflow remains available

2. **Dynamic Route Performance**
   - **Risk:** 200+ landing pages could impact build times and server memory
   - **Mitigation:** Use incremental static regeneration (ISR) with revalidation, implement edge caching
   - **Rollback:** Convert to static generation for top 20 cities only

3. **Payment Integration Security**
   - **Risk:** Improper Stripe integration could expose payment data or create PCI compliance issues
   - **Mitigation:** Use Stripe Checkout Sessions (hosted), never store card data, follow Stripe security best practices
   - **Rollback:** Disable store feature, redirect to external form

**Integration Risks:**

1. **Database Migration Failures**
   - **Risk:** New tables could fail to migrate on production PostgreSQL
   - **Mitigation:** Test migrations on production-like database copy, use transactions, backup before migration
   - **Rollback:** `prisma migrate resolve --rolled-back [migration_name]`

2. **API Key Exposure**
   - **Risk:** LLM or payment API keys could be accidentally committed or exposed
   - **Mitigation:** Use `.env.local` (gitignored), run `git-secrets` pre-commit hook, rotate keys if exposed
   - **Rollback:** Immediately revoke and regenerate exposed keys

3. **Third-Party Service Costs**
   - **Risk:** Uncapped AI API usage could lead to unexpected bills
   - **Mitigation:** Set API quota limits in Google Cloud Console, implement application-level rate limiting, monitor daily usage
   - **Rollback:** Disable AI feature via feature flag

**Deployment Risks:**

1. **PM2 Process Crashes**
   - **Risk:** New dependencies or memory leaks could crash production process
   - **Mitigation:** PM2 auto-restart configured, memory limits monitored, staged rollout
   - **Rollback:** `git revert` and redeploy previous version

2. **Environment Variable Misconfiguration**
   - **Risk:** Missing or incorrect env vars could break features silently
   - **Mitigation:** Startup validation script checks required env vars, fail-fast on missing config
   - **Rollback:** Add missing env vars and restart PM2

3. **Breaking Changes to Existing Features**
   - **Risk:** New routes or middleware could interfere with existing functionality
   - **Mitigation:** Comprehensive regression testing, canary deployment to subset of users, rollback plan
   - **Rollback:** Feature flags allow instant disable without redeployment

**Mitigation Strategies Summary:**

- **Automated testing:** Expand E2E test coverage to include new user flows
- **Feature flags:** Environment variables to toggle Epic 4 features on/off
- **Gradual rollout:** Deploy to production but keep features disabled initially, enable progressively
- **Monitoring:** Set up alerts for API errors, payment failures, and unusual traffic patterns
- **Documentation:** Maintain runbook with rollback procedures for each risk scenario

---

## 5. Epic and Story Structure

### 5.1 Epic Approach

**Epic Structure Decision:** Single comprehensive epic with 4 sequential stories

**Rationale:**

Epic 4 represents a cohesive marketing and growth initiative with four distinct but complementary features. While each story delivers independent functionality, they share common themes:

1. **Shared Goal:** Enable scalable marketing and lead generation
2. **Common Infrastructure:** All features extend the existing Next.js application with new routes and database tables
3. **Minimal Cross-Dependencies:** Stories can be developed sequentially without strict inter-dependencies (AI content generator doesn't require e-commerce to function)
4. **Brownfield Context:** All stories integrate with existing Tax Genius Platform architecture, design system, and deployment infrastructure

**Story Sequencing Strategy:**

The four stories are ordered by business priority and technical dependencies:

1. **Story 4.1 (AI Content Agent)** - Foundation for scalable content creation
2. **Story 4.2 (Dynamic Landing Pages)** - Leverages content from Story 4.1, delivers SEO value
3. **Story 4.3 (E-commerce Store)** - Independent feature, lower priority
4. **Story 4.4 (Academy Foundation)** - Independent feature, foundational for future certification program

This sequencing allows:
- **Early value delivery:** AI content generation and landing pages provide immediate marketing ROI
- **Parallel development potential:** Stories 4.3 and 4.4 can be developed concurrently after 4.2
- **Incremental risk:** Each story is independently testable and deployable
- **Flexibility:** Lower-priority stories (4.3, 4.4) can be deferred if timeline pressures arise

**Alternative Considered:**

**Multi-Epic Approach** (Epic 4a: Content & SEO, Epic 4b: Revenue & Training) was considered but rejected because:
- Adds organizational overhead without clear benefit
- All four stories share similar technical patterns (new routes, new tables, existing design system)
- Business stakeholders view this as a single "Marketing & Growth" initiative
- Brownfield integration approach is consistent across all stories

---

## 6. Epic 4: Marketing & Growth Implementation

**Epic Goal:** Deploy large-scale marketing assets to drive lead generation for all target segments through AI-powered content creation, SEO-optimized landing pages, branded merchandise, and preparer training infrastructure.

**Integration Requirements:**
- Extends existing Next.js App Router with new public routes (`/locations/[city]`, `/store`), protected routes (`/app/academy`), and admin routes (`/admin/content-generator`)
- Adds 4 new database tables (LandingPage, Product, TrainingMaterial, PreparerProgress) without modifying existing schema
- Integrates with external APIs (Google Gemini for AI content, Stripe for payments) while maintaining existing service integrations (Clerk, Resend, MinIO)
- Reuses existing UI components (shadcn/ui), styling (Tailwind CSS), and authentication patterns (Clerk middleware)
- Follows established deployment workflow (Prisma migrations → npm build → PM2 restart)

---

### Story 4.1: AI Content Agent for Landing Pages

**User Story:**
As a **marketing manager**,
I want to use an internal tool powered by an AI agent to generate SEO-optimized content, including Q&A accordions, for our localized landing pages,
so that we can scale our content creation efficiently and maintain high quality.

#### Acceptance Criteria

**AC1: Protected Admin Interface**
- An admin-protected route exists at `/admin/content-generator` accessible only to users with ADMIN role
- Access is enforced via Clerk middleware that redirects non-admin users to 403 error page
- Page renders a form with input fields for: City Name (text), State (dropdown), Keywords (text area)
- Form includes "Generate Content" button with loading spinner during API requests

**AC2: AI Content Generation**
- Clicking "Generate Content" triggers POST request to `/api/ai-content/generate` with form inputs
- Backend validates user has ADMIN role and validates inputs using Zod schema
- Backend constructs structured prompt for LLM API (Google Gemini or Claude) with instructions for:
  - SEO-optimized headline (50-60 characters)
  - Body content (300-500 words, conversational tone, includes city-specific references)
  - 5-7 Q&A pairs formatted as JSON array `[{question: string, answer: string}]`
  - Meta title (50-60 characters, includes city and primary keyword)
  - Meta description (150-160 characters, includes CTA)
- API returns generated content within 10 seconds or returns timeout error with retry option

**AC3: Content Preview and Editing**
- Generated content displays in editable text areas with labels: Headline, Body, Meta Title, Meta Description
- Q&A accordion data displays in interactive preview using shadcn/ui Accordion component
- Admin can edit any generated content before saving
- "Regenerate" button allows re-running AI generation with same inputs
- "Save to Database" button becomes enabled only when all required fields have content

**AC4: Database Persistence**
- Clicking "Save to Database" creates new LandingPage record in database with:
  - Auto-generated slug from city name (lowercase, hyphenated, e.g., "new-york-city" → "new-york-city")
  - All generated content fields populated
  - `generatedBy` field set to current admin user's Clerk ID
  - `version` set to 1
  - `isPublished` set to false (requires manual publish step)
- Success toast notification displays: "Landing page saved for [City]. Set to draft status."
- Form resets to empty state, ready for next generation

**AC5: Error Handling**
- LLM API failures display user-friendly error message: "Content generation failed. Please try again or contact support."
- Rate limit exceeded (>10 requests/min) displays: "Too many requests. Please wait 60 seconds."
- Duplicate slug errors (city already exists) display: "Landing page for [City] already exists. View existing page or archive it first."
- Network errors show retry button with exponential backoff

#### Integration Verification

**IV1: Existing Admin Routes Compatibility**
- If existing admin routes exist at `/admin/*`, new content-generator route follows same auth middleware pattern
- If no admin section exists, create new admin layout component reusing existing dashboard layout patterns
- Existing Clerk authentication flow remains unchanged (same session cookies, same auth checks)

**IV2: Database Schema Compatibility**
- New LandingPage table does not modify any existing tables (profiles, tax_returns, referrals)
- Prisma migration adds new table only, no ALTER TABLE statements for existing tables
- Database seeding scripts (if any) continue to work without modification
- Existing database backup/restore procedures remain valid

**IV3: API Pattern Consistency**
- `/api/ai-content/generate` route follows existing API route structure:
  - Uses Next.js App Router `route.ts` file
  - Implements same error response format as existing APIs (JSON with `error` field)
  - Returns same HTTP status codes (200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error)
  - Logs requests using same logging patterns (console.error for errors)

**IV4: External Service Integration**
- New LLM API integration (Google Gemini) does not interfere with existing external services:
  - Clerk authentication continues to validate sessions
  - Resend email sending remains unaffected
  - MinIO storage operations continue normally
- API key environment variables use clear namespacing (`GEMINI_API_KEY`) to avoid conflicts
- Rate limiting implementation uses same Redis instance as existing session storage (separate key namespace)

#### Technical Implementation Notes

**LLM Integration:**
```typescript
// /src/lib/services/ai-content.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLandingPageContent(input: {
  city: string;
  state?: string;
  keywords: string;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate SEO-optimized landing page content for Tax Genius Pro, targeting "${input.city}${input.state ? ', ' + input.state : ''}" with keywords: ${input.keywords}.

Output JSON format:
{
  "headline": "string (50-60 chars, compelling, includes city)",
  "bodyContent": "string (300-500 words, conversational, mentions local tax deadlines)",
  "metaTitle": "string (50-60 chars, includes primary keyword)",
  "metaDescription": "string (150-160 chars, includes CTA)",
  "qaAccordion": [
    {"question": "string", "answer": "string"},
    // 5-7 Q&A pairs total
  ]
}

Tone: Professional but approachable, empathetic to tax stress, emphasizes ease and expertise.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse JSON from response
  return JSON.parse(text);
}
```

**Rate Limiting:**
```typescript
// /src/app/api/ai-content/generate/route.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  prefix: 'ai-content-gen',
});

export async function POST(request: Request) {
  const { userId } = auth();
  const { success } = await ratelimit.limit(userId);

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Continue with generation...
}
```

**Database Migration:**
```bash
# Create migration
npx prisma migrate dev --name add_landing_pages_table

# Generated migration includes:
CREATE TABLE "LandingPage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "city" TEXT NOT NULL,
  "state" TEXT,
  "headline" TEXT NOT NULL,
  "bodyContent" TEXT NOT NULL,
  "metaTitle" TEXT NOT NULL,
  "metaDescription" TEXT NOT NULL,
  "qaAccordion" JSONB NOT NULL,
  "generatedBy" TEXT,
  "version" INTEGER DEFAULT 1,
  "isPublished" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

#### Definition of Done

- [ ] Admin-protected route at `/admin/content-generator` enforces ADMIN role via Clerk middleware
- [ ] Form accepts city, state, keywords inputs with proper validation
- [ ] LLM API integration generates content within 10 seconds with proper error handling
- [ ] Generated content displays in editable previews with Q&A accordion visualization
- [ ] Content saves to database with correct LandingPage schema and draft status
- [ ] Rate limiting prevents excessive API usage (10 requests/min)
- [ ] All error scenarios display user-friendly messages with retry options
- [ ] Existing admin functionality (if any) remains unaffected
- [ ] Database migration runs successfully on development and production
- [ ] Unit tests cover AI service, API route, and form validation
- [ ] E2E test covers full generation flow (input → generate → preview → save)

---

### Story 4.2: Dynamic Landing Page System

**User Story:**
As a **developer**,
I want to build a system that can generate over 200 unique, localized landing pages from a single template and a data source,
so that we can efficiently target specific cities and keywords for our SEO strategy.

#### Acceptance Criteria

**AC1: Dynamic Routing Configuration**
- Next.js App Router configured with dynamic route at `/src/app/locations/[city]/page.tsx`
- Route accepts city slug as parameter (e.g., `/locations/atlanta`, `/locations/new-york-city`)
- Route uses Server Component for optimal SEO and performance
- Invalid slugs (cities not in database) return custom 404 page with suggestions for popular locations

**AC2: Database-Driven Content Fetching**
- Page component queries Prisma for LandingPage record matching `slug` parameter
- Query filters by `isPublished: true` to exclude draft pages from public view
- Data fetching happens on server (no client-side loading states for SEO)
- Cache strategy uses Next.js ISR with 1-hour revalidation (`revalidate: 3600`)

**AC3: Dynamic Metadata for SEO**
- Page implements `generateMetadata` function to set HTML `<head>` elements:
  - `<title>` set from `metaTitle` field
  - `<meta name="description">` set from `metaDescription` field
  - Open Graph tags (`og:title`, `og:description`, `og:url`) populated for social sharing
  - Canonical URL set to prevent duplicate content penalties
- Metadata is server-rendered (visible to search engine crawlers)

**AC4: Reusable Landing Page Template**
- `LandingPageTemplate` component accepts landing page data as props
- Template structure includes:
  - Hero section with city-specific headline
  - Body content section (markdown or HTML rendered safely)
  - Q&A accordion section using shadcn/ui Accordion component
  - Call-to-action button linking to tax questionnaire (`/auth/signup`)
  - Footer with referrer signup link
- Template follows existing design system (Tailwind classes, shadcn/ui components)
- Template is mobile-responsive (tested on 375px, 768px, 1280px viewports)

**AC5: Static Generation Optimization**
- Implement `generateStaticParams` to pre-render top 50 cities at build time
- Remaining cities use ISR (generated on first request, then cached)
- Sitemap automatically includes all published landing pages (`/sitemap.xml`)
- robots.txt allows crawling of `/locations/*` paths

#### Integration Verification

**IV1: Existing Routing Compatibility**
- New `/locations/[city]` route does not conflict with existing routes:
  - `/auth/*` routes continue to work (login, signup)
  - `/dashboard/*` routes remain protected and functional
  - `/api/*` routes are unaffected
- Middleware that protects dashboard routes does not apply to public `/locations/*` pages
- Navigation components (header, footer) remain functional on all pages

**IV2: SEO and Metadata Integration**
- Existing pages retain their metadata (home page, signup, dashboard pages)
- Root layout `metadata` object is not overridden by dynamic page metadata
- Open Graph images (if configured globally) continue to appear on non-landing pages
- Structured data (JSON-LD) on existing pages remains valid

**IV3: Database Query Performance**
- Landing page queries do not impact existing database operations:
  - Tax return queries maintain same response times
  - Referral tracking queries are unaffected
  - User authentication queries remain fast
- Database connection pool is sufficient for additional query load (monitor connection count)
- Prisma query caching (if enabled) works correctly with new LandingPage model

**IV4: Build and Deployment Process**
- Adding 200+ landing pages does not exceed build time limits:
  - `generateStaticParams` limited to top 50 cities (5-10 min build time)
  - ISR handles remaining pages on-demand (no build time impact)
- Deployment to VPS completes successfully without memory issues
- PM2 process restart handles new routes without downtime
- Nginx reverse proxy correctly routes `/locations/*` requests to Next.js server

#### Technical Implementation Notes

**Dynamic Route Implementation:**
```typescript
// /src/app/locations/[city]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { LandingPageTemplate } from '@/components/landing-page/LandingPageTemplate';

export const revalidate = 3600; // 1 hour ISR

export async function generateMetadata({ params }: { params: { city: string } }) {
  const page = await prisma.landingPage.findUnique({
    where: { slug: params.city, isPublished: true },
  });

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://taxgeniuspro.tax/locations/${params.city}`,
    },
  };
}

export async function generateStaticParams() {
  // Pre-render top 50 cities
  const topCities = await prisma.landingPage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { slug: true },
  });

  return topCities.map(page => ({ city: page.slug }));
}

export default async function CityLandingPage({ params }: { params: { city: string } }) {
  const page = await prisma.landingPage.findUnique({
    where: { slug: params.city, isPublished: true },
  });

  if (!page) {
    notFound();
  }

  return <LandingPageTemplate data={page} />;
}
```

**Landing Page Template Component:**
```typescript
// /src/components/landing-page/LandingPageTemplate.tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LandingPageTemplate({ data }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.headline}
          </h1>
          <Button asChild size="lg">
            <Link href="/auth/signup">Get Started - It's Free</Link>
          </Button>
        </div>
      </section>

      {/* Body Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: data.bodyContent }} />
        </div>
      </section>

      {/* Q&A Accordion */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {data.qaAccordion.map((qa, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>{qa.question}</AccordionTrigger>
                <AccordionContent>{qa.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to file your taxes stress-free?</h3>
          <Button asChild variant="secondary" size="lg">
            <Link href="/auth/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
```

**Sitemap Generation:**
```typescript
// /src/app/sitemap.ts
import { prisma } from '@/lib/db';

export default async function sitemap() {
  const pages = await prisma.landingPage.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  return pages.map(page => ({
    url: `https://taxgeniuspro.tax/locations/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
}
```

#### Definition of Done

- [ ] Dynamic route at `/locations/[city]` renders city-specific landing pages from database
- [ ] Server Component fetches data with ISR caching (1-hour revalidation)
- [ ] `generateMetadata` sets unique title, description, and OG tags per page
- [ ] `generateStaticParams` pre-renders top 50 cities at build time
- [ ] Landing page template uses shadcn/ui components and existing design system
- [ ] Q&A accordion renders correctly with expand/collapse functionality
- [ ] CTA buttons link to signup flow with proper tracking parameters
- [ ] 404 page displays for invalid city slugs with helpful suggestions
- [ ] Sitemap includes all published landing pages
- [ ] Mobile responsiveness tested on 3+ viewport sizes
- [ ] Existing routes and pages remain functional (regression test)
- [ ] Build process completes within acceptable time (<10 minutes)
- [ ] Lighthouse SEO score ≥ 90 for landing pages

---

### Story 4.3: Merchandise E-commerce Store

**User Story:**
As a **Referrer or Preparer**,
I want to browse and purchase branded merchandise like T-shirts and business cards from a simple storefront on the platform,
so that I can represent the Tax Genius brand.

#### Acceptance Criteria

**AC1: Product Catalog Display**
- Public route at `/store` displays grid of available products
- Product grid uses responsive layout (1 column mobile, 3 columns tablet, 4 columns desktop)
- Each product card shows:
  - Product image (loaded from MinIO or external CDN)
  - Product name
  - Price (formatted as USD currency, e.g., "$24.99")
  - "Add to Cart" button
- Products are fetched from database (Product table) and filtered by `isActive: true`

**AC2: Shopping Cart Functionality**
- Clicking "Add to Cart" adds product to client-side cart (React Context or Zustand store)
- Cart icon in header navigation displays item count badge (e.g., "🛒 3")
- Cart persists across page navigation using localStorage
- Cart data structure includes: `{ productId, quantity, name, price, imageUrl }`

**AC3: Cart View and Management**
- Route at `/store/cart` displays cart contents in list format
- Each cart item shows:
  - Product image thumbnail
  - Product name
  - Unit price
  - Quantity selector (increment/decrement buttons)
  - Subtotal (quantity × price)
  - "Remove" button
- Cart totals section shows:
  - Subtotal (sum of all item subtotals)
  - Tax (calculated at 0% for MVP, placeholder for future)
  - Total
- Empty cart state displays message: "Your cart is empty" with "Browse Store" link

**AC4: Checkout Integration**
- "Proceed to Checkout" button in cart view initiates checkout flow
- Button is disabled if cart is empty or user is not authenticated
- Clicking checkout triggers POST request to `/api/checkout/create-session` with cart items
- Backend creates Stripe Checkout Session with line items from cart
- User is redirected to Stripe-hosted checkout page
- After successful payment, Stripe redirects to `/store/success?session_id={id}`
- Success page displays order confirmation and clears cart from localStorage

**AC5: Product Management (Admin)**
- Admin route at `/admin/products` allows CRUD operations on Product table (stretch goal)
- For MVP, products are seeded via Prisma seed script
- Initial product catalog includes:
  - Tax Genius Pro T-shirt ($24.99)
  - Branded business cards - 500 count ($49.99)
  - Referrer welcome kit ($79.99)

#### Integration Verification

**IV1: Existing Navigation Compatibility**
- Adding "Store" link to main navigation does not break existing nav items
- Navigation component updates to include `/store` link in appropriate position
- Mobile navigation menu includes store link without overflow issues
- Existing role-based navigation (dashboard links) remains functional

**IV2: Authentication Flow Integration**
- Unauthenticated users can browse products and add to cart
- Checkout process requires authentication (Clerk sign-in wall)
- After sign-in, user returns to checkout flow with cart intact
- Existing Clerk authentication patterns (redirect handling, session management) work correctly

**IV3: Database and Storage Integration**
- Product images stored in MinIO follow existing object storage patterns
- Product table foreign keys (if any) are optional to avoid breaking constraints
- Existing database queries (tax returns, referrals) are unaffected
- Database connection pool handles additional product queries without performance degradation

**IV4: Payment Service Integration**
- Stripe integration does not interfere with existing payment operations (if any)
- Stripe webhook endpoint (`/api/webhooks/stripe`) handles payment events without affecting other webhooks
- Environment variables for Stripe keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) are clearly namespaced
- Failed payments do not corrupt cart state or user session

#### Technical Implementation Notes

**Cart State Management:**
```typescript
// /src/lib/hooks/useShoppingCart.ts
'use client'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useShoppingCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.productId === item.productId);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'tax-genius-cart' }
  )
);
```

**Stripe Checkout Session Creation:**
```typescript
// /src/app/api/checkout/create-session/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/cart`,
    metadata: {
      userId,
    },
  });

  return NextResponse.json({ sessionUrl: session.url });
}
```

**Product Seeding:**
```typescript
// /prisma/seed.ts (append to existing seed file)
await prisma.product.createMany({
  data: [
    {
      name: 'Tax Genius Pro T-Shirt',
      description: 'Premium cotton t-shirt with Tax Genius Pro logo',
      price: 24.99,
      imageUrl: '/images/products/tshirt.jpg',
      category: 'apparel',
      isActive: true,
    },
    {
      name: 'Branded Business Cards (500)',
      description: 'Professional business cards with your referral link',
      price: 49.99,
      imageUrl: '/images/products/business-cards.jpg',
      category: 'marketing_materials',
      isActive: true,
    },
    {
      name: 'Referrer Welcome Kit',
      description: 'Complete starter kit: t-shirt, business cards, and marketing materials',
      price: 79.99,
      imageUrl: '/images/products/welcome-kit.jpg',
      category: 'bundles',
      isActive: true,
    },
  ],
});
```

#### Definition of Done

- [ ] `/store` route displays product grid with images, names, prices, and "Add to Cart" buttons
- [ ] Shopping cart icon in header shows item count and updates in real-time
- [ ] Cart state persists across page navigation using localStorage
- [ ] `/store/cart` route displays cart items with quantity controls and totals
- [ ] "Proceed to Checkout" button creates Stripe Checkout Session and redirects to Stripe
- [ ] Successful payment redirects to `/store/success` and clears cart
- [ ] Cancelled checkout returns to cart with items intact
- [ ] Empty cart state displays helpful message with link to store
- [ ] Product database seeded with 3 initial products
- [ ] Responsive design tested on mobile, tablet, desktop viewports
- [ ] Unauthenticated users can browse and cart but must sign in for checkout
- [ ] Existing navigation and authentication flows remain unaffected
- [ ] Unit tests cover cart operations (add, remove, update quantity, total calculation)
- [ ] E2E test covers full purchase flow (browse → add to cart → checkout → success)

---

### Story 4.4: Tax Genius Academy Foundation

**User Story:**
As a **new preparer**,
I want to access a basic portal for the "Tax Genius Academy,"
so that I can find initial training materials and see my certification status.

#### Acceptance Criteria

**AC1: Role-Protected Academy Route**
- Protected route at `/app/academy` accessible only to users with `PREPARER` or `TRAINEE` roles
- Access control enforced via Clerk middleware checking user role metadata
- Users with other roles (CLIENT, REFERRER, ADMIN) attempting to access route are redirected to 403 forbidden page
- Route is added to preparer dashboard navigation sidebar with "Academy" link and graduation cap icon

**AC2: Certification Status Display**
- Academy dashboard prominently displays user's current certification status in card component:
  - Status badge (e.g., "TRAINEE", "CERTIFIED", "PENDING_REVIEW")
  - Status description explaining current level and next steps
  - Progress percentage toward certification (e.g., "75% Complete - 2 of 8 modules remaining")
  - Visual progress bar using shadcn/ui Progress component
- Certification status is fetched from user's Profile record (new `certificationStatus` field)

**AC3: Training Materials List**
- Academy dashboard displays list of available training resources in card layout
- Each training material card shows:
  - Resource title
  - Resource type icon (📄 PDF, 🎥 Video, 📝 Article)
  - Brief description (50-100 characters)
  - Completion status (✅ Completed, ⏳ In Progress, ⬜ Not Started)
  - "Start" or "Continue" button based on progress
- Materials are ordered by `orderIndex` field (required materials first, then optional)
- Required materials are visually distinguished (e.g., "REQUIRED" badge)

**AC4: Resource Access**
- Clicking "Start" button on training material opens resource in new tab or modal:
  - PDF resources: Open MinIO-hosted PDF in browser
  - Video resources: Embed video player (YouTube/Vimeo iframe or native HTML5 video)
  - Article resources: Navigate to internal or external article URL
- Accessing a resource automatically marks it as "In Progress" in database (PreparerProgress table)
- "Mark as Complete" button available on resource view (for MVP, manual completion)

**AC5: Progress Tracking**
- Completing a training material updates PreparerProgress record with `completedAt` timestamp
- Academy dashboard updates certification progress percentage in real-time
- When all required materials are completed, certification status updates to "PENDING_REVIEW"
- User receives email notification (via Resend) congratulating on completion and explaining review process

#### Integration Verification

**IV1: Dashboard Navigation Integration**
- Adding "Academy" link to preparer dashboard sidebar does not break existing navigation
- Existing dashboard links (Client List, Analytics, Settings) remain functional
- Navigation component correctly highlights active route when on `/app/academy`
- Mobile drawer navigation includes Academy link in appropriate position

**IV2: Role-Based Access Control Integration**
- Existing Clerk role checks for other protected routes continue to work
- Adding TRAINEE role does not affect existing PREPARER, CLIENT, REFERRER, ADMIN role logic
- User role metadata updates (adding TRAINEE role) work through existing Clerk admin panel
- Existing middleware that protects `/app/*` routes correctly applies to `/app/academy`

**IV3: Database and Storage Integration**
- New TrainingMaterial and PreparerProgress tables do not affect existing tables
- Foreign key relationship (PreparerProgress → Profile) uses existing Profile.id field
- PDF resources stored in MinIO use existing storage service patterns
- Video embeds use existing iframe security policies (CSP headers remain valid)

**IV4: Email Notification Integration**
- New certification completion email uses existing Resend email service
- Email template follows existing email design patterns (React Email components)
- Email sending does not interfere with existing automated emails (documents received, return filed)
- Email service error handling follows existing patterns (logs errors, does not block user flow)

#### Technical Implementation Notes

**Academy Dashboard Component:**
```typescript
// /src/app/app/academy/page.tsx
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { CertificationStatus } from '@/components/academy/CertificationStatus';
import { MaterialsList } from '@/components/academy/MaterialsList';

export default async function AcademyDashboard() {
  const { userId } = auth();

  // Fetch user profile with certification status
  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      certificationStatus: true,
      role: true,
    },
  });

  // Fetch training materials and user progress
  const materials = await prisma.trainingMaterial.findMany({
    orderBy: [
      { isRequired: 'desc' },
      { orderIndex: 'asc' },
    ],
  });

  const progress = await prisma.preparerProgress.findMany({
    where: { profileId: profile.id },
  });

  // Calculate completion percentage
  const requiredCount = materials.filter(m => m.isRequired).length;
  const completedRequired = progress.filter(p =>
    p.completedAt && materials.find(m => m.id === p.trainingMaterialId)?.isRequired
  ).length;
  const progressPercentage = Math.round((completedRequired / requiredCount) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tax Genius Academy</h1>

      <CertificationStatus
        status={profile.certificationStatus}
        progressPercentage={progressPercentage}
      />

      <MaterialsList
        materials={materials}
        userProgress={progress}
      />
    </div>
  );
}
```

**Training Material Seeding:**
```typescript
// /prisma/seed.ts (append)
await prisma.trainingMaterial.createMany({
  data: [
    {
      title: 'Tax Preparation Basics',
      description: 'Introduction to federal tax forms and filing requirements',
      resourceType: 'PDF',
      resourceUrl: '/training/tax-basics.pdf',
      orderIndex: 1,
      isRequired: true,
    },
    {
      title: 'Using the Tax Genius Platform',
      description: 'Video walkthrough of preparer dashboard and client management',
      resourceType: 'VIDEO',
      resourceUrl: 'https://youtube.com/watch?v=example',
      orderIndex: 2,
      isRequired: true,
    },
    {
      title: 'IRS E-filing Guidelines',
      description: 'Official IRS guidance on electronic filing procedures',
      resourceType: 'ARTICLE',
      resourceUrl: 'https://irs.gov/efile-guidelines',
      orderIndex: 3,
      isRequired: true,
    },
    {
      title: 'Advanced Deductions & Credits',
      description: 'Deep dive into common deductions and tax credits',
      resourceType: 'PDF',
      resourceUrl: '/training/advanced-deductions.pdf',
      orderIndex: 4,
      isRequired: false,
    },
  ],
});
```

**Progress Tracking API:**
```typescript
// /src/app/api/academy/progress/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = auth();
  const { materialId, action } = await request.json();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
  });

  if (action === 'start') {
    await prisma.preparerProgress.upsert({
      where: {
        profileId_trainingMaterialId: {
          profileId: profile.id,
          trainingMaterialId: materialId,
        },
      },
      create: {
        profileId: profile.id,
        trainingMaterialId: materialId,
      },
      update: {},
    });
  }

  if (action === 'complete') {
    await prisma.preparerProgress.update({
      where: {
        profileId_trainingMaterialId: {
          profileId: profile.id,
          trainingMaterialId: materialId,
        },
      },
      data: {
        completedAt: new Date(),
      },
    });

    // Check if all required materials completed
    const allProgress = await prisma.preparerProgress.findMany({
      where: { profileId: profile.id, completedAt: { not: null } },
      include: { trainingMaterial: true },
    });

    const completedRequired = allProgress.filter(p => p.trainingMaterial.isRequired);
    const totalRequired = await prisma.trainingMaterial.count({
      where: { isRequired: true },
    });

    if (completedRequired.length === totalRequired) {
      // Update certification status
      await prisma.profile.update({
        where: { id: profile.id },
        data: { certificationStatus: 'PENDING_REVIEW' },
      });

      // Send completion email
      // await EmailService.sendCertificationCompleteEmail(profile.email);
    }
  }

  return NextResponse.json({ success: true });
}
```

#### Definition of Done

- [ ] `/app/academy` route accessible only to PREPARER and TRAINEE roles via Clerk middleware
- [ ] Certification status card displays current status, description, and progress percentage
- [ ] Training materials list shows all resources ordered by required status and index
- [ ] Each material card displays title, type icon, description, and completion status
- [ ] Clicking "Start" button opens resource (PDF/Video/Article) in appropriate viewer
- [ ] Starting a resource creates PreparerProgress record with timestamp
- [ ] Marking resource as complete updates PreparerProgress with completedAt timestamp
- [ ] Completing all required materials updates certification status to PENDING_REVIEW
- [ ] Certification completion triggers email notification (email template created)
- [ ] Academy link appears in preparer dashboard navigation sidebar
- [ ] Role-based access control works correctly (non-preparer roles see 403)
- [ ] Database seeded with 4 initial training materials (3 required, 1 optional)
- [ ] Existing dashboard routes and navigation remain functional
- [ ] Mobile responsiveness tested for academy dashboard
- [ ] Unit tests cover progress tracking logic
- [ ] E2E test covers full academy flow (view → start material → complete → status update)

---

## Document Control

**Document Type:** Brownfield Enhancement PRD
**Created:** October 10, 2025
**Version:** 1.0 Draft
**Status:** Ready for Review
**Next Steps:** Review with development team, obtain stakeholder approval, begin Story 4.1 implementation

---

**End of Epic 4 PRD**
