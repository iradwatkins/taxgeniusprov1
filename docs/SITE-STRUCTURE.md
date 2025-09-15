# Tax Genius Pro - Complete Site Structure & Navigation

## 📍 Page Directory & Routes

### Public Pages
| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Homepage | `/` | Landing page with hero, features, testimonials | ✅ Active |
| About | `/about` | Company info, team, mission | ✅ Active |
| Services | `/services` | Tax services catalog | ✅ Active |
| Pricing | `/pricing` | Service pricing & plans | ✅ Active |
| Contact | `/contact` | Contact form & info | ✅ Active |
| Apply | `/apply` | Client application form | ✅ Active |
| Refer | `/refer` | Referral program info | ✅ Active |
| WordPress Landing | `/wordpress-landing` | Migrated WordPress content | ✅ Active |

### Authentication Pages
| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Login | `/auth/login` | User authentication | ✅ Active |
| Sign Up | `/auth/signup` | New user registration | ✅ Active |
| Verify | `/auth/verify` | Email/phone verification | ✅ Active |
| Forgot Password | `/auth/forgot-password` | Password reset | 🔄 Planned |
| Reset Password | `/auth/reset-password` | Password update | 🔄 Planned |

### Dashboard Pages (Protected)
| Page | Route | Description | Access |
|------|-------|-------------|--------|
| Client Dashboard | `/dashboard/client` | Document upload, tax status | Client Role |
| Preparer Dashboard | `/dashboard/preparer` | Client management, tax prep | Preparer Role |
| Referrer Dashboard | `/dashboard/referrer` | Referral tracking, commissions | Referrer Role |
| Admin Dashboard | `/dashboard/admin` | System management | Admin Role |

### Dynamic Routes
| Page | Route Pattern | Description | Example |
|------|---------------|-------------|---------|
| Referrer Profile | `/[username]` | Vanity URLs for referrers | `/johndoe` |
| Service Detail | `/services/[service]` | Individual service pages | `/services/individual` |
| Tax Year | `/dashboard/client/[year]` | Year-specific tax returns | `/dashboard/client/2024` |

### Legal & Support Pages
| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Terms of Service | `/terms` | Legal terms | 🔄 Planned |
| Privacy Policy | `/privacy` | Privacy information | 🔄 Planned |
| Help Center | `/help` | Support documentation | 🔄 Planned |
| FAQ | `/faq` | Frequently asked questions | 🔄 Planned |
| Blog | `/blog` | Tax tips & news | 🔄 Planned |

## 🧭 Navigation Menus

### Main Navigation (Public)
```
Logo | Services | About | Pricing | Contact | Login | Get Started
```

### Mobile Navigation
```
☰ Menu
├── Home
├── Services
├── About
├── Pricing
├── Contact
├── Login
└── Get Started
```

### Dashboard Navigation (Client)
```
Dashboard
├── Overview
├── Tax Returns
│   ├── Current Year
│   ├── Previous Years
│   └── Start New Return
├── Documents
│   ├── Upload Documents
│   ├── View Documents
│   └── Document Vault
├── Payments
│   ├── Payment History
│   ├── Make Payment
│   └── Payment Methods
├── Messages
├── Profile Settings
└── Logout
```

### Dashboard Navigation (Preparer)
```
Dashboard
├── Overview
├── Clients
│   ├── Active Clients
│   ├── Pending Reviews
│   └── Completed Returns
├── Tax Preparation
│   ├── New Return
│   ├── In Progress
│   └── Tools & Calculators
├── Documents
│   ├── Client Documents
│   └── Templates
├── Schedule
├── Reports
├── Profile Settings
└── Logout
```

### Dashboard Navigation (Referrer)
```
Dashboard
├── Overview
├── Referrals
│   ├── Active Referrals
│   ├── Pending Referrals
│   └── Referral History
├── Commissions
│   ├── Earnings
│   ├── Payout History
│   └── Payment Settings
├── Marketing
│   ├── Materials
│   ├── Referral Links
│   └── Campaign Tracking
├── Contests
│   ├── Active Contests
│   └── Leaderboard
├── Profile Settings
└── Logout
```

### Footer Navigation
```
Company
├── About Us
├── Services
├── Pricing
├── Contact

Resources
├── Help Center
├── Blog
├── Tax Calculator
├── Forms Library

Legal
├── Terms of Service
├── Privacy Policy
├── Security
├── Compliance

Connect
├── Facebook
├── Twitter
├── LinkedIn
├── Instagram
```

## 🎯 Quick Actions Menu

### For Clients
- Start Tax Return
- Upload Documents
- Check Status
- Make Payment
- Schedule Appointment

### For Preparers
- New Client
- Review Queue
- Tax Calculator
- Document Templates
- Generate Reports

### For Referrers
- Generate Referral Link
- View Commissions
- Download Materials
- Track Performance
- Contest Standings

## 📱 Mobile App Navigation (PWA)

### Bottom Tab Navigation
```
┌─────┬─────┬─────┬─────┬─────┐
│Home │Docs │Status│Chat │More │
└─────┴─────┴─────┴─────┴─────┘
```

## 🔗 API Endpoints Structure

### Public API
- `GET /api/services` - List services
- `GET /api/pricing` - Get pricing
- `POST /api/contact` - Submit contact form
- `POST /api/apply` - Submit application

### Authentication API
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/verify` - Verify email/phone
- `POST /api/auth/logout` - End session
- `POST /api/auth/magic-link` - Request magic link

### Protected API (Requires Auth)
- `/api/dashboard/*` - Dashboard data
- `/api/documents/*` - Document management
- `/api/payments/*` - Payment processing
- `/api/referrals/*` - Referral tracking
- `/api/tax-returns/*` - Tax return management

## 🎨 UI Components Library

### Shared Components
- Header
- Footer
- Sidebar
- Navigation Menu
- Breadcrumbs
- User Menu
- Notification Bell
- Search Bar
- Theme Toggle

### Page Components
- Hero Section
- Service Grid
- Pricing Table
- Contact Form
- Testimonial Carousel
- FAQ Accordion
- Feature Cards
- CTA Sections

## 🚀 Deployment URLs

### Production
- Main Site: `https://taxgenius.tax`
- Client Portal: `https://taxgenius.tax/dashboard/client`
- Preparer Portal: `https://taxgenius.tax/dashboard/preparer`
- Referrer Portal: `https://taxgenius.tax/dashboard/referrer`
- API: `https://taxgenius.tax/api`

### Development
- Local: `http://localhost:3005`
- VPS: `http://your-vps-ip:3005`

## 📊 Site Map Priority

### High Priority (1.0)
- Homepage
- Services
- Pricing
- Login
- Dashboard (role-based)

### Medium Priority (0.8)
- About
- Contact
- Apply
- Individual service pages

### Low Priority (0.5)
- Legal pages
- Help/Support
- Blog posts

## 🔐 Access Control Matrix

| Page/Feature | Public | Client | Preparer | Referrer | Admin |
|--------------|--------|--------|----------|----------|-------|
| Homepage | ✅ | ✅ | ✅ | ✅ | ✅ |
| Services | ✅ | ✅ | ✅ | ✅ | ✅ |
| Client Dashboard | ❌ | ✅ | ❌ | ❌ | ✅ |
| Preparer Dashboard | ❌ | ❌ | ✅ | ❌ | ✅ |
| Referrer Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ✅ |
| Document Upload | ❌ | ✅ | ✅ | ❌ | ✅ |
| Commission Tracking | ❌ | ❌ | ❌ | ✅ | ✅ |
| Tax Preparation | ❌ | ❌ | ✅ | ❌ | ✅ |

---

*Last Updated: September 2025*
*Version: 1.0*