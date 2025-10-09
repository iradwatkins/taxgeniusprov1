# Cost Analysis

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

Comprehensive cost analysis for the Tax Genius platform, including monthly recurring costs, one-time expenses, and cost comparisons.

---

## Monthly Recurring Costs

### Infrastructure

| Service | Plan/Configuration | Monthly Cost | Status |
|---------|-------------------|--------------|--------|
| **VPS Hosting** | 16GB RAM, 8 CPU, 500GB SSD | $50-100 | ✅ Active |
| **Domain** | taxgeniuspro.tax | $1-2 | ✅ Active |
| **SSL Certificate** | Let's Encrypt | $0 | ✅ Active |

**Infrastructure Subtotal: $51-102/month**

---

### Database & Storage

| Service | Plan | Monthly Cost | Status |
|---------|------|--------------|--------|
| **PostgreSQL** | Self-hosted on VPS | $0 | ✅ Active |
| **Redis** | Self-hosted on VPS | $0 | ✅ Active |
| **MinIO** | Self-hosted on VPS | $0 | 📋 To setup |

**Database/Storage Subtotal: $0/month**

All database and storage services are self-hosted on the VPS, reducing external service dependencies and costs.

---

### Authentication & User Management

| Service | Plan | Monthly Cost | Free Tier | Status |
|---------|------|--------------|-----------|--------|
| **Clerk** | Pro (1000 MAU) | $25 | 10,000 MAU | 📋 To add |

**During MVP Phase:**
- Use Clerk free tier (10,000 MAU)
- Upgrade to Pro when approaching limit
- **MVP Cost: $0/month**

**Post-MVP Cost: $25/month** (when >10k MAU)

---

### Email Service

| Service | Plan | Monthly Cost | Free Tier | Status |
|---------|------|--------------|-----------|--------|
| **Resend** | Pro (50k emails/mo) | $20 | 3,000 emails/mo | ✅ Ready |

**Email Volume Estimates:**
- MVP Phase: ~500-1000 emails/month
- Growth Phase: 3,000-10,000 emails/month
- Scale Phase: 10,000-50,000 emails/month

**Cost Breakdown:**
- MVP: $0/month (free tier sufficient)
- Growth: $0/month (still within free tier)
- Scale: $20/month (Pro plan)

---

### Payment Processing

| Service | Fee Structure | Volume | Monthly Cost | Status |
|---------|---------------|--------|--------------|--------|
| **Square** | 2.9% + $0.30 per transaction | Variable | Pay-per-use | ✅ Active |

**Example Costs:**

| Monthly Revenue | Transactions | Square Fees | Effective Rate |
|----------------|--------------|-------------|----------------|
| $5,000 | 50 @ $100 | $160 | 3.2% |
| $10,000 | 100 @ $100 | $320 | 3.2% |
| $25,000 | 250 @ $100 | $800 | 3.2% |
| $50,000 | 500 @ $100 | $1,600 | 3.2% |

**Note:** Transaction fees are deducted from revenue, not an additional cost.

---

### Real-time Communication

| Service | Configuration | Monthly Cost | Status |
|---------|--------------|--------------|--------|
| **Socket.io** | Self-hosted | $0 | ✅ Active |
| **Web Push** | Self-hosted | $0 | ✅ Active |

**Communication Subtotal: $0/month**

---

### AI Services (Content Generation)

| Service | Usage | Cost Model | Monthly Cost | Status |
|---------|-------|------------|--------------|--------|
| **Google Gemini** | Landing page generation | Pay-per-use | $2-4 | 📋 To implement |

**AI Cost Breakdown:**

**Initial Content Generation:**
- 200 city landing pages
- ~500 tokens per page
- Total: 100,000 tokens
- Cost: $1-2 (one-time)

**Monthly Maintenance:**
- Update 50 pages/month
- 25,000 tokens/month
- Cost: $0.25-0.50/month

**Additional AI Usage:**
- Meta descriptions: ~$0.50/month
- Content optimization: ~$1/month

**Total AI: $2-4/month** (after initial generation)

---

## Total Monthly Costs

### MVP Phase (0-1000 users)

| Category | Cost | Notes |
|----------|------|-------|
| **Infrastructure** | $51-102 | VPS hosting + domain |
| **Authentication** | $0 | Free tier (10k MAU) |
| **Email** | $0 | Free tier (3k emails) |
| **Storage** | $0 | Self-hosted MinIO |
| **Database** | $0 | Self-hosted PostgreSQL/Redis |
| **AI Services** | $2-4 | Content generation |
| **Square** | Variable | 3.2% of revenue |
| **Total** | **$53-106/mo** | + transaction fees |

### Growth Phase (1,000-10,000 users)

| Category | Cost | Notes |
|----------|------|-------|
| **Infrastructure** | $100-150 | Upgraded VPS |
| **Authentication** | $25 | Clerk Pro |
| **Email** | $0-20 | May need Pro plan |
| **Storage** | $0 | Self-hosted MinIO |
| **Database** | $0 | Self-hosted PostgreSQL/Redis |
| **AI Services** | $2-4 | Content generation |
| **Square** | Variable | 3.2% of revenue |
| **Total** | **$127-199/mo** | + transaction fees |

### Scale Phase (10,000+ users)

| Category | Cost | Notes |
|----------|------|-------|
| **Infrastructure** | $200-300 | Multiple VPS instances |
| **Authentication** | $100+ | Higher MAU tier |
| **Email** | $20-80 | Pro plan + overages |
| **Storage** | $0-50 | Self-hosted + backups |
| **Database** | $0-100 | Potential replicas |
| **AI Services** | $5-10 | Increased usage |
| **Monitoring** | $50-100 | Sentry, analytics |
| **Square** | Variable | 3.2% of revenue |
| **Total** | **$375-640/mo** | + transaction fees |

---

## Cost Comparison: Technology Stacks

### Current Stack (Clerk + Resend + MinIO)

**MVP Phase:**
- Monthly: ~$53-106
- Transaction fees: 3.2%
- Self-hosted: Yes (some components)
- Maintenance: Medium

**Advantages:**
- ✅ Low initial cost
- ✅ Free tiers for MVP
- ✅ Good developer experience
- ✅ Self-hosted storage (data sovereignty)
- ✅ Scales incrementally

### Alternative: Fully Managed (Supabase + Vercel)

**MVP Phase:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Email (SendGrid): $20/month
- **Total: ~$65-85/month**
- Transaction fees: 3.2%

**Growth Phase:**
- Supabase: $100-200/month
- Vercel: $100-200/month
- Email: $20-50/month
- **Total: ~$220-450/month**

**Advantages:**
- ✅ Fully managed
- ✅ Auto-scaling
- ✅ Built-in CDN
- ❌ Higher costs at scale
- ❌ Vendor lock-in
- ❌ Less control

### Alternative: AWS/GCP Full Cloud

**MVP Phase:**
- EC2/Compute: $50-100/month
- RDS (PostgreSQL): $50-100/month
- ElastiCache (Redis): $50-100/month
- S3: $5-10/month
- Auth (Cognito/Firebase): $0-20/month
- **Total: ~$155-330/month**

**Growth Phase:**
- **Total: ~$500-1000/month**

**Advantages:**
- ✅ Enterprise-grade
- ✅ Extensive services
- ✅ Auto-scaling
- ❌ Complex setup
- ❌ Higher costs
- ❌ Steeper learning curve

---

## Cost Breakdown by User Count

### Cost Per User Analysis

| User Count | Monthly Cost | Cost Per User | Revenue Target |
|------------|-------------|---------------|----------------|
| 100 | $53-106 | $0.53-1.06 | $200+ |
| 500 | $70-120 | $0.14-0.24 | $1,000+ |
| 1,000 | $90-150 | $0.09-0.15 | $2,000+ |
| 5,000 | $150-250 | $0.03-0.05 | $10,000+ |
| 10,000 | $200-350 | $0.02-0.04 | $20,000+ |

**Break-even Analysis:**
- Target revenue per user: $2-5/month
- Cost per user: $0.02-0.15/month
- Margin: 97-99%+ (excluding transaction fees)

---

## One-Time Costs

### Initial Setup

| Item | Cost | Status |
|------|------|--------|
| **Domain Registration** | $12/year | ✅ Complete |
| **VPS Initial Setup** | $0 | ✅ Complete |
| **Development Tools** | $0 | ✅ Complete |
| **AI Content Generation** | $4-8 | 📋 Pending |
| **Total** | **$16-20** | |

### Future One-Time Costs

| Item | Estimated Cost | Timeline |
|------|---------------|----------|
| **Logo/Branding** | $100-500 | Q1 2026 |
| **Professional Photos** | $200-500 | Q1 2026 |
| **Legal (Terms/Privacy)** | $500-1000 | Q1 2026 |
| **Compliance Audit** | $1000-5000 | Q2 2026 |

---

## Revenue Scenarios

### Conservative Scenario

**Year 1:**
- 500 active users
- $3/user/month average
- Monthly revenue: $1,500
- Monthly costs: $70-120
- **Net profit: $1,380-1,430/month**

### Moderate Scenario

**Year 1:**
- 2,000 active users
- $5/user/month average
- Monthly revenue: $10,000
- Monthly costs: $120-180
- **Net profit: $9,820-9,880/month**

### Optimistic Scenario

**Year 1:**
- 5,000 active users
- $7/user/month average
- Monthly revenue: $35,000
- Monthly costs: $180-250
- **Net profit: $34,750-34,820/month**

**Note:** Revenue scenarios exclude Square transaction fees (3.2% of revenue).

---

## Cost Optimization Strategies

### Short-term (0-6 months)

1. **Use free tiers aggressively:**
   - Clerk: 10k MAU free
   - Resend: 3k emails/mo free
   - Stay within limits during MVP

2. **Self-host when practical:**
   - ✅ PostgreSQL
   - ✅ Redis
   - ✅ MinIO
   - ✅ Socket.io

3. **Optimize database queries:**
   - Add indexes
   - Use caching
   - Minimize N+1 queries

4. **Minimize AI costs:**
   - Generate content upfront
   - Cache generated content
   - Use efficient prompts

### Medium-term (6-18 months)

1. **Monitor and optimize:**
   - Set up cost alerts
   - Review monthly usage
   - Identify waste

2. **Negotiate better rates:**
   - Contact providers for volume discounts
   - Consider annual billing (often 10-20% off)

3. **Implement efficient caching:**
   - Redis for session data
   - CDN for static assets (when needed)
   - Browser caching

4. **Optimize resource usage:**
   - Right-size VPS instances
   - Monitor CPU/RAM usage
   - Scale horizontally when needed

### Long-term (18+ months)

1. **Consider reserved instances:**
   - VPS providers often offer discounts for long-term commitments
   - Can save 20-40%

2. **Evaluate alternative providers:**
   - Shop around for better deals
   - Consider multi-cloud strategy

3. **Implement usage-based pricing:**
   - Charge based on actual usage
   - Align costs with revenue

4. **Build internal tools:**
   - Replace expensive SaaS tools
   - Develop custom solutions for core features

---

## Cost Alerts & Monitoring

### Set Budget Alerts

```typescript
// lib/cost-monitoring.ts
const MONTHLY_BUDGET = 200; // dollars

export async function checkBudget() {
  const currentSpend = await getCurrentMonthSpend();

  if (currentSpend > MONTHLY_BUDGET * 0.8) {
    await sendAlert('Budget Warning', '80% of monthly budget reached');
  }

  if (currentSpend > MONTHLY_BUDGET) {
    await sendAlert('Budget Exceeded', 'Monthly budget exceeded!');
  }
}
```

### Monitor Key Metrics

- [ ] VPS CPU/RAM usage
- [ ] Database connection pool utilization
- [ ] Redis memory usage
- [ ] Email sending volume
- [ ] API request counts
- [ ] Storage usage (MinIO)
- [ ] Authentication monthly active users

---

## Return on Investment (ROI)

### Investment Breakdown

**Initial Investment:**
- Development time: 400-600 hours @ $50/hr = $20,000-30,000
- Infrastructure setup: $500
- Marketing (initial): $1,000-5,000
- **Total: $21,500-35,500**

**Monthly Operating Costs:**
- MVP: $53-106/month
- Growth: $127-199/month

### Break-even Analysis

**Conservative:**
- Monthly profit: $1,380
- Break-even: 16-26 months

**Moderate:**
- Monthly profit: $9,820
- Break-even: 2-4 months

**Optimistic:**
- Monthly profit: $34,750
- Break-even: 1 month

---

## Cost Comparison: Build vs. Buy

### Build (Current Approach)

**Pros:**
- ✅ Lower long-term costs
- ✅ Full control
- ✅ Data sovereignty
- ✅ Customizable
- ✅ No vendor lock-in

**Cons:**
- ❌ Higher development time
- ❌ Maintenance responsibility
- ❌ Need technical expertise

**Total Cost (Year 1):** $1,000-2,000

### Buy (White-label SaaS)

**Typical Costs:**
- Setup fee: $5,000-15,000
- Monthly: $500-2,000
- Per-user: $2-10/month
- Customization: $50-150/hour

**Total Cost (Year 1):** $11,000-39,000

**Verdict:** Building in-house is significantly more cost-effective for Tax Genius use case.

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Infrastructure Setup](./infrastructure.md)
- [Services Configuration](./services.md)
- [Migration Guide](../migration-guide.md)

---

**Document Status:** ✅ Active
