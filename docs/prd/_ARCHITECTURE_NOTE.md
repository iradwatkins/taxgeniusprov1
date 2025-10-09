# IMPORTANT: Architecture Change Notice

**Date:** October 9, 2025

## Epic Files Architecture Update

The Epic files in this directory (epic-1 through epic-4) were originally written for a **Vite + React PWA + Supabase** architecture.

### Current Implementation

Tax Genius is now built with:
- **Next.js 15** (App Router) instead of Vite
- **Clerk.com** for authentication instead of Supabase Auth
- **PostgreSQL + Prisma** instead of Supabase Database
- **MinIO** for storage instead of Supabase Storage
- **Resend** for email instead of Supabase Email

### Reading These Epics

When reading the Epic files:
1. **Replace "Vite" with "Next.js App Router"**
2. **Replace "Supabase" with the appropriate service:**
   - Auth → Clerk
   - Database → PostgreSQL + Prisma
   - Storage → MinIO
   - Email → Resend
3. **Component structure** remains similar (React + TypeScript)
4. **Business logic** and user stories remain **100% valid**

### Reference Documents

See the updated architecture in:
- [../architecture-v3-FINAL.md](../architecture-v3-FINAL.md)
- [../tech-stack-v3.md](../tech-stack-v3.md)
- [../migration-guide.md](../migration-guide.md)

---

**The Epic files are still valid for:**
- User stories
- Acceptance criteria
- Feature requirements
- Business logic
- UI/UX specifications

**Only the implementation technology has changed.**
