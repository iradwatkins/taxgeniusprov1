# Tax Genius Platform - Migration Overview

**Version:** 1.0
**Date:** October 9, 2025
**Estimated Timeline:** 4-6 weeks

---

## Migration Progress

| Migration | Status | Complexity | Duration | Risk | Completed Date |
|-----------|--------|------------|----------|------|----------------|
| [SendGrid → Resend](./01-resend-email.md) | ✅ Complete | 🟢 Low | 1-2 days | Low | Oct 9, 2025 |
| [AWS S3/R2 → MinIO](./02-minio-storage.md) | ⏳ Pending | 🟡 Medium | 2-3 days | Medium | - |
| [Lucia → Clerk](./03-clerk-auth.md) | ⏳ Pending | 🔴 High | 5-7 days | High | - |

**Legend:**
- ✅ Complete - Migration finished and live in production
- 🔄 In Progress - Currently being implemented
- ⏳ Pending - Not yet started

---

## Overview

This directory contains focused migration guides for upgrading Tax Genius from its current tech stack to the v3 architecture defined in [Architecture Overview](../architecture/README.md).

### Migration Priorities

**Priority 1: SendGrid → Resend** ✅ COMPLETED
- **Status:** Live in production since October 9, 2025
- **Complexity:** Low
- **Why First:** Non-critical service, easy rollback, minimal user impact

**Priority 2: AWS S3/R2 → MinIO** ⏳ PENDING
- **Status:** Ready to implement
- **Complexity:** Medium
- **Why Second:** Requires data migration but isolated from auth system

**Priority 3: Lucia → Clerk** ⏳ PENDING
- **Status:** Planned for Week 3+
- **Complexity:** High
- **Why Last:** Most complex, affects all users, requires careful migration

---

## Timeline

```
Week 1:  ✅ SendGrid → Resend (COMPLETED - Oct 9, 2025)
Week 2:  ⏳ MinIO setup + S3 migration
Week 3:  ⏳ Clerk implementation + testing
Week 4:  ⏳ User data migration
Week 5:  ⏳ Parallel auth support (Lucia + Clerk)
Week 6:  ⏳ Deprecate Lucia, go-live with Clerk
```

---

## Migration Documents

### Core Migrations

1. **[01-resend-email.md](./01-resend-email.md)** - Email Service Migration
   - SendGrid → Resend
   - React Email templates
   - Production deployment steps
   - Status: ✅ COMPLETED (Oct 9, 2025)

2. **[02-minio-storage.md](./02-minio-storage.md)** - Object Storage Migration
   - AWS S3/Cloudflare R2 → MinIO
   - Self-hosted on VPS
   - Data migration scripts
   - Status: ⏳ PENDING

3. **[03-clerk-auth.md](./03-clerk-auth.md)** - Authentication Migration
   - Lucia → Clerk
   - User data migration
   - Parallel auth support
   - Cutover strategy
   - Status: ⏳ PENDING

### Supporting Documents

4. **[testing-validation.md](./testing-validation.md)** - Testing Strategy
   - Test environments
   - Validation checklists
   - Performance testing
   - Load testing

5. **[rollback-procedures.md](./rollback-procedures.md)** - Emergency Procedures
   - Rollback steps for each migration
   - Decision criteria
   - Impact assessment

---

## Quick Start

### For Email Migration (COMPLETED)
✅ Already live in production. See [01-resend-email.md](./01-resend-email.md) for documentation.

### For Storage Migration (NEXT)
```bash
# See detailed instructions in:
# docs/migrations/02-minio-storage.md
```

### For Auth Migration (FUTURE)
```bash
# See detailed instructions in:
# docs/migrations/03-clerk-auth.md
```

---

## Architecture References

- [Architecture Overview](../architecture/README.md) - Target architecture
- [Tech Stack Overview](../tech-stack/README.md) - New technology choices
- [Infrastructure](../tech-stack/infrastructure.md) - VPS configuration

---

## Risk Assessment

### Low Risk ✅
- **Email Migration (Resend):** Already completed successfully
  - Easy rollback to SendGrid if needed
  - No user-facing changes
  - Independent service

### Medium Risk 🟡
- **Storage Migration (MinIO):**
  - Requires data migration
  - Needs careful testing
  - Gradual rollout possible
  - Files remain accessible during migration

### High Risk 🔴
- **Auth Migration (Clerk):**
  - Affects all users
  - Requires user data migration
  - Complex cutover process
  - Parallel auth support recommended

---

## Support & Resources

### Monitoring
```bash
# Application logs
pm2 logs taxgeniuspro

# System resources
htop

# Disk usage
df -h
```

### External Dashboards
- **Resend:** https://resend.com/emails
- **MinIO Console:** https://minio-console.taxgeniuspro.tax (after setup)
- **Clerk Dashboard:** https://dashboard.clerk.com (after setup)

### Getting Help
- Check migration-specific troubleshooting sections
- Review [rollback-procedures.md](./rollback-procedures.md) for emergencies
- Monitor application logs for errors

---

## Post-Migration Cleanup

After each successful migration (1-2 weeks of stable operation):

1. **Remove old dependencies**
2. **Clean up environment variables**
3. **Update documentation**
4. **Archive old code**

See individual migration guides for specific cleanup steps.

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** Development Team
