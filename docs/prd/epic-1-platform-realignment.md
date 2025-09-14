# Epic 1: Platform Realignment & Revenue Foundation

**Epic Goal**: Transform Tax Genius Pro from generic B2B SaaS into urgency-driven consumer platform with authentication, cash advances, and payment processing as primary revenue drivers.

**Integration Requirements**: Preserve existing database, maintain backward compatibility, implement feature flags for gradual rollout

## Story 1.1: Authentication & Core Messaging Transformation

**As a** gig worker,
**I want** to see urgency-driven messaging and easy signup,
**So that** I understand this service can get me cash fast.

### Acceptance Criteria
1. Homepage displays "Get up to $7,000 Today" as primary headline
2. "Need Cash Fast?" messaging replaces "Professional Tax Management"
3. Authentication pages created at /auth/login and /auth/signup
4. Google OAuth and magic link options implemented
5. Bilingual toggle added to header (English/Spanish)
6. Mobile-first responsive design with touch-friendly CTAs
7. Trust signals added (security badges, testimonials)

### Integration Verification
- IV1: Existing referrer dashboard remains accessible
- IV2: Current database users can login with existing credentials
- IV3: Page load time remains under 3 seconds

### Technical Notes
- Use existing Lucia Auth configuration
- Implement with Next.js App Router
- Use Tax Genius theme colors (orange/yellow primary)
- Ensure WCAG AA compliance

---

## Story 1.2: Cash Advance Application Flow

**As a** tax filer needing money,
**I want** to apply for a cash advance quickly on my phone,
**So that** I can get money before my refund arrives.

### Acceptance Criteria
1. Create /apply route with mobile-optimized form
2. Implement step-by-step wizard (Personal Info → Income → Documents → Review)
3. Add document upload with camera capture for mobile
4. Integrate basic OCR for W2/1099 data extraction
5. Calculate estimated advance amount based on income
6. Display approval decision within 30 seconds
7. Store application data in new database tables

### Integration Verification
- IV1: Document upload doesn't conflict with existing storage
- IV2: New database migrations don't break existing schema
- IV3: Form validation follows existing patterns

### Technical Notes
```typescript
// Database schema for advances
CREATE TABLE advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    application_data JSONB,
    decision_data JSONB,
    applied_at TIMESTAMP DEFAULT NOW()
);
```

---

## Story 1.3: Payment Processing Integration

**As a** business owner,
**I want** to process advances and collect payments,
**So that** revenue flows through the platform.

### Acceptance Criteria
1. Integrate Square API for payment processing
2. Support Cash App Pay as payment option
3. Create payment tracking in database
4. Implement commission calculations for preparers
5. Add payment history to client dashboard
6. Create webhook handlers for payment events
7. Implement secure tokenization for payment methods

### Integration Verification
- IV1: Payment data properly encrypted
- IV2: Existing dashboard components updated to show payments
- IV3: API rate limits properly handled

### Technical Notes
- Square SDK integration required
- Environment variables needed: SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID
- Implement idempotency keys for payment safety

---

## Story 1.4: Public Referral System Activation

**As a** satisfied customer,
**I want** to refer friends and earn rewards,
**So that** we both benefit from the service.

### Acceptance Criteria
1. Create public /refer signup page
2. Generate unique referral codes for each user
3. Implement vanity URL system (taxgeniuspro.tax/[username])
4. Add social sharing buttons with pre-filled messages
5. Create referral tracking in database
6. Display referral count and earnings in dashboard
7. Send email notifications for successful referrals

### Integration Verification
- IV1: Existing referrer dashboard data migrates properly
- IV2: URL routing doesn't conflict with existing routes
- IV3: Email system doesn't exceed sending limits

---

## Story 1.5: Email Campaign Infrastructure

**As a** marketing manager,
**I want** automated email campaigns,
**So that** leads are nurtured and converted automatically.

### Acceptance Criteria
1. Integrate SendGrid for transactional and marketing emails
2. Create email templates for key actions (welcome, advance approved, referral earned)
3. Implement drip campaign sequences
4. Add unsubscribe management
5. Track email metrics (opens, clicks)
6. Create admin interface for campaign management
7. Implement email scheduling system

### Integration Verification
- IV1: Email sending doesn't impact application performance
- IV2: Templates follow existing brand guidelines
- IV3: Unsubscribe preferences properly stored

---

## Story 1.6: Mobile PWA Configuration

**As a** mobile user,
**I want** the app to work like a native mobile app,
**So that** I have a seamless experience on my phone.

### Acceptance Criteria
1. Configure PWA manifest with app icons
2. Implement service worker for offline functionality
3. Add install prompt for add-to-homescreen
4. Enable push notifications for Web Push API
5. Implement offline data sync
6. Cache critical resources for offline access
7. Add update notifications for new versions

### Integration Verification
- IV1: PWA doesn't break existing desktop experience
- IV2: Service worker doesn't interfere with API calls
- IV3: Caching strategy doesn't serve stale data

### Technical Notes
```javascript
// Service Worker Configuration
const CACHE_NAME = 'tax-genius-v2';
const urlsToCache = [
  '/',
  '/apply',
  '/manifest.json',
  '/offline.html'
];
```

---

## Story 1.7: Contest & Gamification System

**As a** referrer,
**I want** to compete in contests and see leaderboards,
**So that** I'm motivated to refer more people.

### Acceptance Criteria
1. Create contest management system in database
2. Build real-time leaderboard with WebSocket updates
3. Implement point/reward calculation system
4. Add contest banners to referrer dashboard
5. Create winner notification system
6. Integrate MarketingBoost.com for trip rewards
7. Add historical contest archive

### Integration Verification
- IV1: WebSocket connections properly managed
- IV2: Real-time updates don't overload server
- IV3: Points calculation is accurate and fraud-resistant

---

## Story 1.8: Preparer Platform Foundation

**As a** tax preparer,
**I want** tools to manage my clients efficiently,
**So that** I can build my business through the platform.

### Acceptance Criteria
1. Create preparer onboarding flow
2. Build client assignment algorithm
3. Implement document review interface
4. Add status update capabilities
5. Create performance metrics dashboard
6. Implement tier system (Junior/Senior/Master)
7. Add training module placeholders

### Integration Verification
- IV1: Preparer assignments don't conflict with existing data
- IV2: Document access properly secured
- IV3: Performance metrics accurately calculated

---

## Story 1.9: Localized Landing Pages

**As a** SEO manager,
**I want** location-specific landing pages,
**So that** we rank for local tax preparation searches.

### Acceptance Criteria
1. Create dynamic route for /[city]-[state] pages
2. Build template system for location pages
3. Integrate with geocoding API for accurate locations
4. Generate initial 50 high-priority city pages
5. Implement schema markup for local SEO
6. Add city-specific testimonials and preparers
7. Create sitemap for search engines

### Integration Verification
- IV1: Dynamic routes don't conflict with existing paths
- IV2: Page generation doesn't slow build process
- IV3: SEO markup validates properly

---

## Story 1.10: Analytics & Monitoring

**As a** product manager,
**I want** comprehensive analytics,
**So that** I can track platform performance and user behavior.

### Acceptance Criteria
1. Integrate Google Analytics 4 with conversion tracking
2. Implement custom events for key actions
3. Add Sentry for error monitoring
4. Create performance monitoring dashboard
5. Implement A/B testing framework
6. Add heatmap tracking for mobile interactions
7. Create daily automated reports

### Integration Verification
- IV1: Analytics doesn't impact page performance
- IV2: User privacy properly protected
- IV3: Data retention policies followed

---

## Definition of Done

### For All Stories:
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests for critical paths
- [ ] Documentation updated
- [ ] Mobile responsive tested on iOS/Android
- [ ] Accessibility tested (WCAG AA)
- [ ] Performance metrics met
- [ ] Security review passed
- [ ] Feature flag configured
- [ ] Monitoring in place

## Epic Success Metrics

- **Conversion Rate**: >5% visitor to signup
- **Mobile Performance**: <3s page load
- **Advance Applications**: 100+ in first week
- **Referral Activations**: 20% of users
- **Email Open Rate**: >25%
- **PWA Installs**: >10% of mobile users

## Dependencies

### External Services Required:
- Square API credentials
- SendGrid API key
- Google OAuth credentials
- MarketingBoost API access
- OCR service (Textract/Vision API)

### Infrastructure:
- Redis for caching
- PostgreSQL database
- R2/S3 for document storage
- WebSocket server for real-time

## Risk Mitigation

1. **Payment Processing Delays**: Have manual approval backup
2. **OCR Failures**: Implement manual data entry fallback
3. **Email Deliverability**: Monitor sender reputation closely
4. **Mobile Performance**: Progressive enhancement approach
5. **Database Migration**: Full backup before deployment