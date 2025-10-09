# Development & Testing Plan

**Version**: 1.0 | **Part**: 5 of 6
**Timeline**: 12 Weeks | **Budget**: $175,000
**Target Launch**: January 15, 2025

[← Previous: UI/UX Design](./04-ui-ux-design.md) | [↑ Index](./README.md) | [Next: Launch & Roadmap →](./06-launch-roadmap.md)

---

## 6. DEVELOPMENT PLAN

### 6.1 Sprint Plan (2-Week Sprints)

#### Sprint 1-2: Foundation (Weeks 1-4)

**Infrastructure Setup**
- [ ] VPS provisioning and Coolify installation
- [ ] PostgreSQL 15 setup with initial schema
- [ ] Redis 7.2 configuration
- [ ] MinIO S3-compatible storage setup
- [ ] SSL certificates via Let's Encrypt
- [ ] Cloudflare DNS configuration

**Project Initialization**
- [ ] Next.js 14 project scaffolding
- [ ] TypeScript configuration (strict mode)
- [ ] Tailwind CSS + shadcn/ui setup
- [ ] Prisma ORM initialization
- [ ] ESLint + Prettier configuration
- [ ] Git repository and branch strategy

**Authentication**
- [ ] Clerk.com integration
- [ ] User signup/login flow
- [ ] Email verification
- [ ] Webhook handler for user sync
- [ ] JWT validation middleware

**CI/CD Pipeline**
- [ ] GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Coolify deployment configuration
- [ ] Database migration automation

**Deliverables**:
- Working dev environment
- Basic auth flow functional
- Automated deployment pipeline
- Initial database schema deployed

---

#### Sprint 3-4: Core Features (Weeks 5-8)

**Preparer Onboarding (Epic 1)**
- [ ] Profile setup form
- [ ] PTIN verification
- [ ] Service area selection
- [ ] Pricing configuration
- [ ] Profile photo upload (MinIO)

**Website Generation (Epic 1)**
- [ ] 3 template designs (Professional, Modern, Classic)
- [ ] Dynamic route generation (`/pro/[slug]`)
- [ ] SEO meta tags
- [ ] Social media preview cards
- [ ] URL slug generation and validation
- [ ] Template preview functionality

**Lead Capture (Epic 2)**
- [ ] Lead intake form component
- [ ] Form validation (Zod schemas)
- [ ] reCAPTCHA v3 integration
- [ ] Lead scoring algorithm
- [ ] Lead routing logic

**Lead Management**
- [ ] Lead dashboard (list view)
- [ ] Lead detail page
- [ ] Status update functionality
- [ ] Search and filter
- [ ] Lead assignment

**Email Notifications**
- [ ] Resend integration
- [ ] React Email templates (Welcome, Lead Notification)
- [ ] Email sending service
- [ ] Email tracking (opens, clicks)

**Deliverables**:
- Preparer can create account and profile
- Preparer website goes live in < 60 seconds
- Lead forms capture and route correctly
- Email notifications working

---

#### Sprint 5-6: Integration & Polish (Weeks 9-12)

**Client Management (Epic 3)**
- [ ] Client database (CRUD operations)
- [ ] Pipeline kanban board (drag-drop with dnd-kit)
- [ ] Client detail view
- [ ] Activity timeline
- [ ] Notes functionality
- [ ] Tags and filtering

**Document Management (Epic 3)**
- [ ] Document upload to MinIO
- [ ] Presigned URL generation
- [ ] File type validation
- [ ] Virus scanning integration (ClamAV)
- [ ] Document viewer/download
- [ ] ZIP download for all documents

**Communication (Epic 4)**
- [ ] PWA setup (manifest, service worker)
- [ ] Push notification subscription
- [ ] Backend push notification sender
- [ ] Notification preferences
- [ ] Appointment booking system
- [ ] Calendar availability management

**Analytics (Epic 5)**
- [ ] Analytics events tracking
- [ ] Dashboard metrics calculation
- [ ] Charts (lead sources, conversion rate)
- [ ] Revenue tracking
- [ ] Export reports (CSV)

**Payment Integration (Epic 5)**
- [ ] Square Subscriptions setup
- [ ] Plan selection UI
- [ ] Payment method form
- [ ] Subscription webhook handler
- [ ] Invoice generation
- [ ] Payment history page

**Final Polish**
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Bug fixes
- [ ] Documentation

**Deliverables**:
- Full CRM functionality
- Document management working
- Payment processing functional
- Analytics dashboard complete
- Production-ready application

---

### 6.2 Team Structure

```
Product Manager (1)
├── Frontend Developer (2)
│   ├── UI Components & Pages
│   └── State Management & Forms
├── Backend Developer (2)
│   ├── API Endpoints & Business Logic
│   └── Database & Integrations
├── UI/UX Designer (1)
│   ├── Design System
│   └── User Flows & Wireframes
├── QA Tester (1)
│   ├── Manual Testing
│   └── Test Case Documentation
└── DevOps Engineer (0.5)
    ├── Infrastructure Setup
    └── CI/CD Pipeline

Total: 7.5 FTE
```

#### Role Responsibilities

**Product Manager**
- Sprint planning and prioritization
- Stakeholder communication
- Requirements clarification
- Feature acceptance
- Daily standups facilitation

**Frontend Developers**
- React/Next.js component development
- UI implementation from designs
- Form validation and state management
- API integration
- Performance optimization

**Backend Developers**
- API endpoint development
- Database schema design
- Third-party integrations (Clerk, Square, Resend, MinIO)
- Background jobs
- Security implementation

**UI/UX Designer**
- Wireframes and mockups
- Design system maintenance
- User flow documentation
- Usability testing
- Visual design

**QA Tester**
- Test case creation
- Manual testing
- Bug reporting
- Acceptance testing
- Regression testing

**DevOps Engineer**
- VPS and infrastructure setup
- CI/CD pipeline
- Monitoring setup
- Backup strategy
- Performance monitoring

---

### 6.3 Development Standards

#### Code Quality

**TypeScript**
```typescript
// Use strict mode
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// Prefer interfaces over types for objects
interface User {
  id: string;
  email: string;
  name: string;
}

// Use Zod for runtime validation
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
});
```

**Code Reviews**
- All code must be reviewed before merge
- At least 1 approval required
- PR description includes:
  - What changed
  - Why it changed
  - How to test
  - Screenshots (for UI changes)

**Testing Requirements**
- 80% code coverage minimum
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- All tests must pass before merge

**Linting & Formatting**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Documentation**
- JSDoc comments for public functions
- README for each major feature
- API endpoint documentation
- Environment variables documented

---

### 6.4 Git Workflow

#### Branch Strategy

```
main (production)
  ├── staging (pre-production)
  │   ├── develop (integration)
  │   │   ├── feature/onboarding
  │   │   ├── feature/crm
  │   │   ├── feature/payments
  │   │   └── feature/analytics
  │   └── hotfix/critical-bug
```

#### Branch Naming Convention

```bash
# Feature branches
feature/[ticket-id]-short-description
feature/US-101-account-creation

# Bug fixes
bugfix/[ticket-id]-short-description
bugfix/BUG-42-email-validation

# Hotfixes
hotfix/[ticket-id]-short-description
hotfix/HOTFIX-1-payment-failure
```

#### Commit Message Convention

```bash
# Format
<type>(<scope>): <subject>

# Types
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance

# Examples
feat(auth): Add Clerk.com integration
fix(leads): Correct lead scoring algorithm
docs(api): Add endpoint documentation
test(crm): Add client CRUD tests
```

#### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/US-101-account-creation
   ```

2. **Develop and Commit**
   ```bash
   git add .
   git commit -m "feat(auth): Add account creation flow"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/US-101-account-creation
   # Create PR in GitHub
   ```

4. **Code Review**
   - Address reviewer feedback
   - Ensure all tests pass
   - Get approval

5. **Merge**
   - Squash and merge to `develop`
   - Delete feature branch

6. **Deploy to Staging**
   - Merge `develop` → `staging`
   - Test in staging environment

7. **Deploy to Production**
   - Merge `staging` → `main`
   - Tag release: `v1.0.0`

---

### 6.5 Meeting Schedule

**Daily Standup** (15 min)
- Time: 9:00 AM
- What did you complete yesterday?
- What are you working on today?
- Any blockers?

**Sprint Planning** (2 hours)
- Every 2 weeks (Monday)
- Review sprint goals
- Break down user stories
- Estimate tasks (story points)
- Assign tasks

**Sprint Review** (1 hour)
- Every 2 weeks (Friday)
- Demo completed features
- Stakeholder feedback
- Update product backlog

**Sprint Retrospective** (1 hour)
- Every 2 weeks (Friday)
- What went well?
- What needs improvement?
- Action items for next sprint

**Weekly Sync** (30 min)
- Every Wednesday
- Project status update
- Risk review
- Dependency discussion

---

## 7. TESTING PLAN

### 7.1 Testing Strategy

```
Testing Pyramid
    /\
   /  \     E2E Tests (10%)
  /----\    Critical user flows
 /      \
/--------\  Integration Tests (30%)
/----------\ API endpoints, database
/------------\ Unit Tests (60%)
  Components, utilities, business logic
```

#### Unit Tests (60% coverage target)

**Tools**: Jest + React Testing Library

**What to Test**:
- Component rendering
- User interactions
- Business logic functions
- Utility functions
- Validation schemas

**Example**:
```typescript
// __tests__/lib/lead-scoring.test.ts
import { calculateLeadScore } from '@/lib/lead-scoring';

describe('calculateLeadScore', () => {
  it('should assign base score of 50', () => {
    const lead = {
      urgency: 'no_rush',
      estimated_income: null,
      has_dependents: false,
      owns_home: false,
      has_investments: false,
      phone: null,
    };
    expect(calculateLeadScore(lead)).toBe(50);
  });

  it('should add urgency bonus for urgent leads', () => {
    const lead = {
      urgency: 'urgent',
      // ... other fields
    };
    expect(calculateLeadScore(lead)).toBe(75); // 50 + 25
  });

  it('should cap score at 100', () => {
    const lead = {
      urgency: 'urgent',
      estimated_income: 100000,
      has_dependents: true,
      owns_home: true,
      has_investments: true,
      phone: '5551234567',
    };
    expect(calculateLeadScore(lead)).toBe(100);
  });
});
```

---

#### Integration Tests (30% coverage target)

**Tools**: Supertest + Jest

**What to Test**:
- API endpoints
- Database operations
- Third-party integrations
- Webhook handlers

**Example**:
```typescript
// __tests__/api/leads.test.ts
import request from 'supertest';
import { app } from '@/app';
import { db } from '@/lib/db';

describe('POST /api/leads', () => {
  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should create a new lead', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        urgency: 'urgent',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.score).toBeGreaterThan(0);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: 'John Doe',
        // Missing email
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email');
  });
});
```

---

#### E2E Tests (10% coverage target)

**Tools**: Playwright

**What to Test**:
- Complete user flows
- Multi-page interactions
- Form submissions
- Payment flows

**Example**:
```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('preparer can complete onboarding', async ({ page }) => {
  // Navigate to signup
  await page.goto('/sign-up');

  // Fill registration form
  await page.fill('[name="email"]', 'preparer@example.com');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.click('button[type="submit"]');

  // Should redirect to profile setup
  await expect(page).toHaveURL('/onboarding/profile');

  // Complete profile
  await page.fill('[name="name"]', 'John Tax Pro');
  await page.fill('[name="phone"]', '5551234567');
  await page.fill('[name="bio"]', 'CPA with 10 years experience');
  await page.click('button[type="submit"]');

  // Should redirect to website builder
  await expect(page).toHaveURL('/onboarding/website');

  // Select template
  await page.click('[data-template="professional"]');
  await page.click('button:has-text("Publish Website")');

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome, John');
});
```

---

### 7.2 Test Scenarios (Critical Path)

#### Scenario 1: Complete Preparer Onboarding

**Steps**:
1. Navigate to sign-up page
2. Register with email/password
3. Verify email (click link in test email)
4. Complete profile setup
   - Name, phone, bio
   - Credentials (CPA, EA)
   - Service areas (zip codes)
   - Pricing structure
5. Choose website template
6. Customize website (name, colors)
7. Publish website

**Expected Result**:
- Account created in database
- Profile saved with all fields
- Website live at `/pro/[slug]`
- Redirect to dashboard
- Welcome email sent

**Test Data**:
```json
{
  "email": "test-preparer-1@example.com",
  "password": "TestPassword123!",
  "name": "Test Preparer",
  "phone": "5551234567",
  "bio": "Test bio",
  "credentials": ["CPA"],
  "service_areas": ["30301", "30302"],
  "pricing": {
    "1040": 150,
    "1040_schedule_c": 250
  }
}
```

---

#### Scenario 2: Lead Submission & Routing

**Steps**:
1. Navigate to preparer website `/pro/test-preparer`
2. Fill out lead form
   - Name, email, phone
   - Tax situation (W-2, dependents)
   - Urgency (urgent)
3. Submit form
4. Verify lead created in database
5. Check preparer received email
6. Check preparer received push notification
7. Verify lead appears in preparer dashboard

**Expected Result**:
- Lead stored in database with correct preparer_id
- Lead score calculated correctly
- Email sent to preparer
- Push notification sent
- Confirmation email sent to client
- Lead visible in dashboard

---

#### Scenario 3: Document Upload & Download

**Steps**:
1. Log in as preparer
2. Navigate to client detail page
3. Upload document (PDF, 2MB)
4. Wait for virus scan
5. Verify document appears in list
6. Click download button
7. Verify file downloads correctly
8. Delete document

**Expected Result**:
- File uploaded to MinIO
- Virus scan completes (status: clean)
- Document record in database
- Download URL expires after 1 hour
- File deleted from MinIO

---

#### Scenario 4: Subscription Management

**Steps**:
1. Log in as preparer
2. Navigate to settings → billing
3. Click "Upgrade to Professional"
4. Enter payment details (Square test card)
5. Submit payment
6. Verify subscription activated
7. Check features unlocked
8. View invoice

**Expected Result**:
- Square subscription created
- Subscription record in database
- Status: active
- Professional features enabled
- Invoice generated and emailed

---

#### Scenario 5: Client Pipeline

**Steps**:
1. Convert lead to client
2. Move client through pipeline stages
   - New → Contacted
   - Contacted → Documents
   - Documents → Preparing
   - Preparing → Complete
3. At each stage:
   - Add notes
   - Upload document
   - Send email
4. Verify activity timeline updated
5. Check stage timestamps recorded

**Expected Result**:
- Client moves through all stages
- Activity logged for each action
- Timestamps recorded
- Notes saved
- Emails tracked

---

### 7.3 Acceptance Testing

#### Beta Testing Program

**Timeline**: December 16-29, 2024 (2 weeks)

**Participants**: 10 beta preparers
- 5 from Atlanta, GA
- 3 from surrounding areas
- 2 from tax professional network

**Criteria**:
- Active tax preparer with PTIN
- Tech-savvy (can provide feedback)
- Available for daily check-ins
- Willing to use real data (non-production)

**Testing Focus**:
- Complete onboarding flow
- Create and customize website
- Capture test leads
- Manage test clients
- Upload documents
- Use communication features
- Set up subscription (test mode)

**Feedback Collection**:
- Daily 15-minute check-ins
- End-of-day survey (5 questions)
- Bug reporting via GitHub Issues
- Feature requests via Canny
- Exit interview (30 min)

**Success Criteria**:
- All beta testers complete onboarding
- Average satisfaction score: 4.0+/5.0
- < 5 critical bugs reported
- < 20 major bugs reported
- 8/10 testers would recommend

---

### 7.4 Performance Testing

**Tools**: K6 (load testing)

**Load Test Scenarios**:

1. **Concurrent Users**
   - 100 preparers browsing dashboard
   - 500 clients submitting leads
   - Target: < 2s response time (p95)

2. **Document Upload**
   - 50 concurrent uploads (5MB each)
   - Target: < 10s upload time
   - Target: No failures

3. **Database Queries**
   - 1000 queries/second
   - Target: < 100ms response time (p95)

**Example K6 Script**:
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 100 }, // Stay at 100
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% < 2s
  },
};

export default function () {
  const res = http.get('https://app.taxgenius.com/dashboard');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

---

### 7.5 Security Testing

**OWASP Top 10 Checklist**:

- [ ] **SQL Injection**: Prisma parameterized queries only
- [ ] **XSS**: React auto-escaping + CSP headers
- [ ] **CSRF**: Token-based protection
- [ ] **Authentication**: Clerk.com handles auth
- [ ] **Sensitive Data**: Encryption at rest and in transit
- [ ] **Access Control**: Role-based permissions
- [ ] **Security Misconfiguration**: Hardened nginx config
- [ ] **Vulnerable Components**: Snyk dependency scanning
- [ ] **Logging**: No sensitive data in logs
- [ ] **API Security**: Rate limiting + validation

**Tools**:
- **OWASP ZAP**: Automated security scanning
- **Snyk**: Dependency vulnerability scanning
- **npm audit**: Check for known vulnerabilities
- **Lighthouse**: Security audit

**Penetration Testing**:
- Professional pen test before launch
- Budget: $5,000
- Focus areas:
  - Authentication bypass
  - Authorization flaws
  - Data exposure
  - Payment security

---

### 7.6 Test Environments

#### Development
- **URL**: http://localhost:3005
- **Database**: Local PostgreSQL
- **Storage**: Local MinIO
- **Purpose**: Local development

#### Staging
- **URL**: https://staging.taxgenius.com
- **Database**: Staging PostgreSQL
- **Storage**: Staging MinIO
- **Purpose**: Pre-production testing

#### Production
- **URL**: https://app.taxgenius.com
- **Database**: Production PostgreSQL
- **Storage**: Production MinIO
- **Purpose**: Live application

---

### 7.7 Launch Criteria

**GO if**:
- ✅ All P0 features working
- ✅ < 10 critical bugs
- ✅ Payment processing 100% functional
- ✅ 10+ beta users satisfied (NPS >40)
- ✅ Performance targets met (page load < 2s)
- ✅ Security audit passed
- ✅ 99% uptime in staging for 1 week
- ✅ All tests passing (80% coverage)
- ✅ Documentation complete

**NO-GO if**:
- ❌ Security vulnerabilities discovered
- ❌ > 20% payment failure rate
- ❌ Page load > 5 seconds
- ❌ Data loss incidents
- ❌ Legal/compliance concerns unresolved
- ❌ Negative feedback from > 50% of beta users

---

## Summary

### Development Timeline
- **Weeks 1-4**: Infrastructure + Auth
- **Weeks 5-8**: Core features (Onboarding, Leads, CRM)
- **Weeks 9-12**: Integrations + Polish (Payments, Docs, Analytics)
- **Week 13**: Launch (January 15, 2025)

### Testing Coverage
- **Unit Tests**: 60% (Jest + RTL)
- **Integration Tests**: 30% (Supertest)
- **E2E Tests**: 10% (Playwright)
- **Total Coverage Target**: 80%

### Team Size
- 7.5 FTE (1 PM, 2 FE, 2 BE, 1 Designer, 1 QA, 0.5 DevOps)

### Quality Gates
- Code review required
- All tests passing
- 80% coverage minimum
- Security audit passed
- Performance targets met

---

[← Previous: UI/UX Design](./04-ui-ux-design.md) | [↑ Index](./README.md) | [Next: Launch & Roadmap →](./06-launch-roadmap.md)

**Document Status**: ✅ Development Plan Approved
**Last Updated**: 2025-10-09
