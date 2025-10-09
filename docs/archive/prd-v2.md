# Tax Genius Pro - Brownfield Enhancement PRD v2.0

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
- IDE-based fresh analysis of deployed Next.js application
- Review of original project brief and marketing strategy documents
- Analysis of partially implemented features

#### Current Project State
Tax Genius Pro is currently deployed as a generic B2B SaaS tax management platform built with Next.js, shadcn/ui, and TypeScript. The implementation has deviated significantly from its original vision as a consumer-focused, urgency-driven tax preparation ecosystem targeting gig workers and cash-based businesses. Core revenue drivers (cash advances, viral referral system) are missing or not public-facing.

### Available Documentation Analysis

#### Available Documentation
- ✅ Tech Stack Documentation (Next.js, TypeScript, Tailwind)
- ✅ Source Tree/Architecture (partial)
- ⚠️ Coding Standards (implicit from codebase)
- ✅ API Documentation (basic routes documented)
- ❌ External API Documentation (Square, SendGrid not integrated)
- ❌ UX/UI Guidelines (generic shadcn, not aligned with target market)
- ✅ Technical Debt Documentation (implementation status tracked)

### Enhancement Scope Definition

#### Enhancement Type
- ✅ Major Feature Modification
- ✅ Integration with New Systems
- ✅ UI/UX Overhaul
- ✅ New Feature Addition

#### Enhancement Description
Realign Tax Genius Pro with its original vision by transforming it from a generic B2B platform into an urgency-driven, mobile-first tax preparation ecosystem focused on gig workers, with cash advances as the primary hook and viral referral-based growth.

#### Impact Assessment
- ✅ Major Impact (architectural changes required)
- Significant changes to messaging, user flows, and core features
- New integrations with payment and marketing systems
- Complete UI/UX redesign for mobile-first experience

### Goals and Background Context

#### Goals
- Scale to 1,000+ clients through urgency-driven messaging and cash advances
- Build viral referral engine with gamification and rewards
- Create "business-in-a-box" platform for tax preparers
- Implement mobile-first PWA for gig workers and cash economy
- Enable bilingual support for English/Spanish speakers
- Establish foundation for future franchising model

#### Background Context
The tax preparation market has a critical gap: traditional services don't serve the urgent financial needs of gig workers and cash-based businesses who need money fast during tax season. These users don't care about "professional tax management" - they need cash advances, quick refunds, and trust from their community. The current implementation completely misses this market opportunity by positioning as a generic B2B SaaS instead of an urgency-driven financial lifeline.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-01-14 | 2.0 | Complete realignment PRD | Mary (Analyst) |
| 2024-09-12 | 1.0 | Initial implementation | Previous Team |

## Requirements

### Functional Requirements

- **FR1**: System must offer cash advances up to $7,000 based on expected tax refunds
- **FR2**: Cash advance application must be completable on mobile in under 5 minutes
- **FR3**: System must support photo capture and OCR for W2/1099 document upload
- **FR4**: Referral system must generate unique tracking codes and vanity URLs for each user
- **FR5**: Referral rewards must include both cash payouts and trip incentives (MarketingBoost.com)
- **FR6**: System must support bilingual interface (English/Spanish) with one-click toggle
- **FR7**: Homepage must display urgency messaging ("Need Cash Today?") prominently
- **FR8**: System must support QR code generation for offline referral tracking
- **FR9**: Preparer portal must include client queue management and document review
- **FR10**: System must integrate with Square for payment processing including Cash App Pay
- **FR11**: Email campaigns must trigger based on user actions (drip sequences)
- **FR12**: System must generate 200+ localized landing pages for SEO
- **FR13**: Contest/leaderboard system must update in real-time for referrers
- **FR14**: Mobile app must work offline and sync when connected
- **FR15**: System must support appointment scheduling with calendar integration
- **FR16**: Chat system must connect clients with assigned preparers
- **FR17**: Document storage must use end-to-end encryption
- **FR18**: System must calculate and display refund estimates instantly
- **FR19**: Preparers must have tiered access levels (Junior/Senior/Master)
- **FR20**: Tax Genius Academy must track training progress and certifications

### Non-Functional Requirements

- **NFR1**: Mobile page load time must be under 3 seconds on 4G networks
- **NFR2**: System must handle 10,000+ concurrent users during peak tax season
- **NFR3**: Cash advance approval decision must be returned within 30 seconds
- **NFR4**: System must maintain 99.9% uptime during tax season (Jan-April)
- **NFR5**: All financial data must be encrypted at rest and in transit
- **NFR6**: System must be WCAG AA compliant for accessibility
- **NFR7**: Push notifications must have <5 second delivery time
- **NFR8**: Document upload must support files up to 50MB
- **NFR9**: System must auto-save form progress every 30 seconds
- **NFR10**: Referral tracking must be accurate to prevent fraud

### Compatibility Requirements

- **CR1**: Existing database schema must be migrated without data loss
- **CR2**: Current user sessions must remain valid during migration
- **CR3**: Existing API endpoints must continue working with deprecation warnings
- **CR4**: UI components must progressively enhance from current desktop-first to mobile-first

## User Interface Enhancement Goals

### Integration with Existing UI
New mobile-first components will be built alongside existing shadcn/ui components, with progressive replacement. Urgency-driven design language (red/orange CTAs, countdown timers) will overlay current professional aesthetic during transition period.

### Modified/New Screens and Views
- Homepage - Complete redesign with urgency messaging
- `/apply` - New cash advance application flow
- `/refer` - New public referral signup
- `/dashboard/client` - Mobile-optimized client portal
- `/dashboard/referrer` - Enhanced with public-facing features
- `/dashboard/preparer` - Simplified mobile workflow
- `/academy` - New Tax Genius Academy
- `/auth/*` - New authentication pages

### UI Consistency Requirements
- Maintain consistent navigation patterns during transition
- Use existing color variables but add urgency colors (red/orange)
- Keep current font stack but increase mobile sizes
- Preserve component structure while adding mobile variants

## Technical Constraints and Integration Requirements

### Existing Technology Stack
**Languages**: TypeScript, JavaScript
**Frameworks**: Next.js 15.5.3, React 19.1.0
**Database**: PostgreSQL via Prisma
**Infrastructure**: PM2 deployment on port 3005
**External Dependencies**: Partially configured (Redis, R2 planned but not active)

### Integration Approach
**Database Integration Strategy**: Extend existing Prisma schema with new models for advances, contests, and academy. Use migrations to preserve data.
**API Integration Strategy**: Add /api/v2/* routes for new features while maintaining /api/* for compatibility
**Frontend Integration Strategy**: Create mobile-first components in /components/mobile/* and progressively replace desktop components
**Testing Integration Strategy**: Add Playwright tests for critical user flows, especially payment paths

### Code Organization and Standards
**File Structure Approach**: Feature-based organization under /features/* for new code
**Naming Conventions**: Continue camelCase for functions, PascalCase for components
**Coding Standards**: TypeScript strict mode, ESLint configuration already in place
**Documentation Standards**: JSDoc for new APIs, README updates for new features

### Deployment and Operations
**Build Process Integration**: Existing Next.js build process, add PWA compilation
**Deployment Strategy**: Blue-green deployment with PM2, feature flags for gradual rollout
**Monitoring and Logging**: Add Sentry for error tracking, Google Analytics for conversions
**Configuration Management**: Environment variables for service credentials, feature flags

### Risk Assessment and Mitigation
**Technical Risks**: Next.js instead of Vite may impact mobile performance
**Integration Risks**: Missing service credentials (Square, SendGrid, Redis, R2)
**Deployment Risks**: Single PM2 process could cause downtime during updates
**Mitigation Strategies**: Implement caching layer, progressive enhancement, feature flags, obtain all service credentials before launch

## Epic and Story Structure

### Epic Approach
**Epic Structure Decision**: Single comprehensive epic broken into 6 phases due to interdependencies and need for coordinated migration from B2B to B2C focus. This ensures we maintain system integrity while fundamentally repositioning the product.

## Epic 1: Platform Realignment & Revenue Foundation

**Epic Goal**: Transform Tax Genius Pro from generic B2B SaaS into urgency-driven consumer platform with authentication, cash advances, and payment processing as primary revenue drivers.

**Integration Requirements**: Preserve existing database, maintain backward compatibility, implement feature flags for gradual rollout

### Story 1.1: Authentication & Core Messaging Transformation
As a gig worker,
I want to see urgency-driven messaging and easy signup,
so that I understand this service can get me cash fast.

#### Acceptance Criteria
1. Homepage displays "Get up to $7,000 Today" as primary headline
2. "Need Cash Fast?" messaging replaces "Professional Tax Management"
3. Authentication pages created at /auth/login and /auth/signup
4. Google OAuth and magic link options implemented
5. Bilingual toggle added to header (English/Spanish)
6. Mobile-first responsive design with touch-friendly CTAs
7. Trust signals added (security badges, testimonials)

#### Integration Verification
- IV1: Existing referrer dashboard remains accessible
- IV2: Current database users can login with existing credentials
- IV3: Page load time remains under 3 seconds

### Story 1.2: Cash Advance Application Flow
As a tax filer needing money,
I want to apply for a cash advance quickly on my phone,
so that I can get money before my refund arrives.

#### Acceptance Criteria
1. Create /apply route with mobile-optimized form
2. Implement step-by-step wizard (Personal Info → Income → Documents → Review)
3. Add document upload with camera capture for mobile
4. Integrate basic OCR for W2/1099 data extraction
5. Calculate estimated advance amount based on income
6. Display approval decision within 30 seconds
7. Store application data in new database tables

#### Integration Verification
- IV1: Document upload doesn't conflict with existing storage
- IV2: New database migrations don't break existing schema
- IV3: Form validation follows existing patterns

### Story 1.3: Payment Processing Integration
As a business owner,
I want to process advances and collect payments,
so that revenue flows through the platform.

#### Acceptance Criteria
1. Integrate Square API for payment processing
2. Support Cash App Pay as payment option
3. Create payment tracking in database
4. Implement commission calculations for preparers
5. Add payment history to client dashboard
6. Create webhook handlers for payment events
7. Implement secure tokenization for payment methods

#### Integration Verification
- IV1: Payment data properly encrypted
- IV2: Existing dashboard components updated to show payments
- IV3: API rate limits properly handled

### Story 1.4: Public Referral System Activation
As a satisfied customer,
I want to refer friends and earn rewards,
so that we both benefit from the service.

#### Acceptance Criteria
1. Create public /refer signup page
2. Generate unique referral codes for each user
3. Implement vanity URL system (taxgeniuspro.tax/[username])
4. Add social sharing buttons with pre-filled messages
5. Create referral tracking in database
6. Display referral count and earnings in dashboard
7. Send email notifications for successful referrals

#### Integration Verification
- IV1: Existing referrer dashboard data migrates properly
- IV2: URL routing doesn't conflict with existing routes
- IV3: Email system doesn't exceed sending limits

### Story 1.5: Email Campaign Infrastructure
As a marketing manager,
I want automated email campaigns,
so that leads are nurtured and converted automatically.

#### Acceptance Criteria
1. Integrate SendGrid for transactional and marketing emails
2. Create email templates for key actions (welcome, advance approved, referral earned)
3. Implement drip campaign sequences
4. Add unsubscribe management
5. Track email metrics (opens, clicks)
6. Create admin interface for campaign management
7. Implement email scheduling system

#### Integration Verification
- IV1: Email sending doesn't impact application performance
- IV2: Templates follow existing brand guidelines
- IV3: Unsubscribe preferences properly stored

### Story 1.6: Mobile PWA Configuration
As a mobile user,
I want the app to work like a native mobile app,
so that I have a seamless experience on my phone.

#### Acceptance Criteria
1. Configure PWA manifest with app icons
2. Implement service worker for offline functionality
3. Add install prompt for add-to-homescreen
4. Enable push notifications for Web Push API
5. Implement offline data sync
6. Cache critical resources for offline access
7. Add update notifications for new versions

#### Integration Verification
- IV1: PWA doesn't break existing desktop experience
- IV2: Service worker doesn't interfere with API calls
- IV3: Caching strategy doesn't serve stale data

### Story 1.7: Contest & Gamification System
As a referrer,
I want to compete in contests and see leaderboards,
so that I'm motivated to refer more people.

#### Acceptance Criteria
1. Create contest management system in database
2. Build real-time leaderboard with WebSocket updates
3. Implement point/reward calculation system
4. Add contest banners to referrer dashboard
5. Create winner notification system
6. Integrate MarketingBoost.com for trip rewards
7. Add historical contest archive

#### Integration Verification
- IV1: WebSocket connections properly managed
- IV2: Real-time updates don't overload server
- IV3: Points calculation is accurate and fraud-resistant

### Story 1.8: Preparer Platform Foundation
As a tax preparer,
I want tools to manage my clients efficiently,
so that I can build my business through the platform.

#### Acceptance Criteria
1. Create preparer onboarding flow
2. Build client assignment algorithm
3. Implement document review interface
4. Add status update capabilities
5. Create performance metrics dashboard
6. Implement tier system (Junior/Senior/Master)
7. Add training module placeholders

#### Integration Verification
- IV1: Preparer assignments don't conflict with existing data
- IV2: Document access properly secured
- IV3: Performance metrics accurately calculated

### Story 1.9: Localized Landing Pages
As a SEO manager,
I want location-specific landing pages,
so that we rank for local tax preparation searches.

#### Acceptance Criteria
1. Create dynamic route for /[city]-[state] pages
2. Build template system for location pages
3. Integrate with geocoding API for accurate locations
4. Generate initial 50 high-priority city pages
5. Implement schema markup for local SEO
6. Add city-specific testimonials and preparers
7. Create sitemap for search engines

#### Integration Verification
- IV1: Dynamic routes don't conflict with existing paths
- IV2: Page generation doesn't slow build process
- IV3: SEO markup validates properly

### Story 1.10: Analytics & Monitoring
As a product manager,
I want comprehensive analytics,
so that I can track platform performance and user behavior.

#### Acceptance Criteria
1. Integrate Google Analytics 4 with conversion tracking
2. Implement custom events for key actions
3. Add Sentry for error monitoring
4. Create performance monitoring dashboard
5. Implement A/B testing framework
6. Add heatmap tracking for mobile interactions
7. Create daily automated reports

#### Integration Verification
- IV1: Analytics doesn't impact page performance
- IV2: User privacy properly protected
- IV3: Data retention policies followed

## Checklist Results Report

### Requirements Coverage
- ✅ All functional requirements addressed across stories
- ✅ Non-functional requirements integrated into acceptance criteria
- ✅ Compatibility requirements included in verification steps

### Technical Readiness
- ⚠️ Service credentials needed: Square, SendGrid, Redis, R2, MarketingBoost
- ✅ Database migrations planned
- ✅ API versioning strategy defined
- ⚠️ Performance optimization needed for mobile

### Risk Assessment
- High: Missing service integrations could delay launch
- Medium: Mobile performance with Next.js vs. requested Vite
- Low: Data migration with proper backups

## Next Steps

### UX Expert Prompt
Please create the comprehensive UX/UI specification for Tax Genius Pro based on this PRD, focusing on mobile-first design patterns, urgency-driven UI elements, and simplified user flows optimized for gig workers who need fast cash advances.

### Architect Prompt
Please create the technical architecture document for implementing this brownfield enhancement PRD, detailing the migration strategy from current B2B SaaS to urgency-driven B2C platform, including service integrations, API design, and performance optimizations for mobile users.