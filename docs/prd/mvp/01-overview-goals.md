# MVP Overview & Goals

**Version**: 1.0 | **Part**: 1 of 6
**Timeline**: 12 Weeks | **Budget**: $175,000
**Target Launch**: January 15, 2025

[↑ Index](./README.md) | [Next: User Stories →](./02-user-stories.md)

---

## 1. MVP OVERVIEW

### 1.1 MVP Definition
The Minimum Viable Product delivers core functionality that enables tax preparers to establish professional online presence, capture leads, and manage clients - validating our core value proposition with minimal investment.

### 1.2 MVP Goals
- **Validate Market Fit**: Prove preparers will pay for integrated platform
- **Generate Revenue**: Achieve $50K MRR within 90 days
- **Gather Feedback**: Learn from 100 early adopters
- **Technical Foundation**: Build scalable core architecture
- **Quick to Market**: Launch before tax season peak

### 1.3 Success Criteria
- 100 paying preparers by March 31, 2025
- 2,500 qualified leads generated
- 60% preparer activation rate
- 4.0+ user satisfaction score
- $50K MRR achieved

### 1.4 Core Value Proposition
**"Get a professional website and start receiving tax clients in 60 seconds"**

---

## 2. MVP SCOPE

### 2.1 IN SCOPE ✅

#### Core Features (MUST HAVE)
1. **Preparer Website** - Template-based professional site
2. **Lead Capture** - Intake forms with routing
3. **Client Management** - Basic CRM functionality
4. **Communication** - Email/PWA push notifications
5. **Analytics** - Basic performance metrics

#### Critical Capabilities
- User authentication & security (Clerk.com)
- Payment processing (Square)
- Mobile-responsive design
- SEO optimization
- Document upload (MinIO)
- Appointment booking

### 2.2 OUT OF SCOPE ❌

#### Deferred to Post-MVP
- Marketing content library
- Physical marketing store
- Advanced analytics
- Native mobile app (iOS/Android)
- Team management
- API access
- White-label options
- AI features
- Automation workflows
- Video consultations
- SMS notifications (using PWA push instead)

---

## Key Decisions

### Why These Features?
These features were selected because they:
1. **Address Core Pain Point**: Tax preparers struggle to get online and capture leads
2. **Provide Immediate Value**: Preparer can start marketing within 60 seconds
3. **Generate Revenue**: Subscription model validated through market research
4. **Build Foundation**: Architecture supports planned post-MVP features
5. **Minimize Risk**: Proven technologies reduce technical complexity

### Why Self-Hosted?
- **Cost Control**: Predictable infrastructure costs
- **Data Sovereignty**: Appeals to privacy-conscious preparers
- **Customization**: Full control over platform
- **Margins**: Higher profit margins vs. cloud platforms

See [Technical Specifications](./03-technical-specs.md) for architecture details.

---

## Success Metrics

### Week 1 Targets
- 200 signups
- 50 websites created
- 100 leads generated
- 20 paying customers
- 95% uptime

### Month 1 Targets
- 500 total signups
- 100 paying customers
- 1,000 leads generated
- $10K MRR

### Month 3 Targets (Launch Success)
- 1,000 total signups
- 200 paying customers
- 5,000 leads generated
- $20K MRR
- 60% activation rate

See [Launch & Roadmap](./06-launch-roadmap.md#11-success-metrics) for complete metrics.

---

## Timeline Overview

```
Week 1-4:   Foundation (Infrastructure, Auth, Basic UI)
Week 5-8:   Core Features (Onboarding, Leads, CRM)
Week 9-12:  Integration & Polish (Payments, Email, Testing)
Week 13:    Public Launch (January 15, 2025)
```

See [Development Plan](./05-development-testing.md#6-development-plan) for detailed sprint breakdown.

---

## Budget Summary

| Category | Amount | Percentage |
|----------|--------|------------|
| Personnel | $122,500 | 70% |
| Infrastructure | $26,250 | 15% |
| Marketing | $17,500 | 10% |
| Buffer | $8,750 | 5% |
| **TOTAL** | **$175,000** | **100%** |

See [Budget Breakdown](./06-launch-roadmap.md#12-budget-breakdown) for complete details.

---

## Assumptions

1. Preparers will pay for convenience and lead generation
2. Tax season (Jan-Apr) drives urgency and signups
3. Professional appearance significantly matters to clients
4. Lead generation is the primary pain point for preparers
5. Simple beats feature-rich for tax preparer market
6. Self-hosted model appeals to privacy-conscious preparers
7. 60% of traffic will be mobile
8. Average preparer handles 100-200 returns/year
9. 25% lead-to-client conversion rate is achievable
10. Referral program will drive organic growth

---

## Competitive Positioning

| Feature | Tax Genius | TaxDome | Canopy |
|---------|-----------|---------|--------|
| Setup time | 60 seconds | 2 hours | 1 hour |
| Price | $49-149 | $200+ | $150+ |
| Website included | Yes | No | No |
| Lead generation | Yes | Limited | No |
| Learning curve | 30 min | 2 days | 1 day |
| Self-hosted option | Yes | No | No |

---

## Next Steps

1. **Review User Stories**: [See all user stories →](./02-user-stories.md)
2. **Understand Technical Stack**: [View technical specifications →](./03-technical-specs.md)
3. **Review Design System**: [See UI/UX specifications →](./04-ui-ux-design.md)

---

[↑ Index](./README.md) | [Next: User Stories →](./02-user-stories.md)

**Document Status**: ✅ Approved for Development
**Last Updated**: 2025-10-09
