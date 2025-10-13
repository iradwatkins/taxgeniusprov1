# TAX GENIUS LEAD TRACKING DASHBOARD - COMPLETE DEVELOPMENT BRIEF

## PROJECT OVERVIEW
Build a comprehensive lead generation tracking dashboard for a tax preparation company. The system tracks promotional materials (QR codes, flyers, posters, links) and provides detailed analytics to help users understand which marketing efforts generate the most leads and conversions.

---

## USER ROLES & PERMISSIONS

### 1. SUPER ADMIN
- Full access to all data
- Can view macro (overview) and micro (individual user) analytics
- Manages all users, campaigns, and materials
- Access to financial data (commissions owed/paid)

### 2. TAX PREPARER
- View only their own performance data
- See their referrers and how each is performing
- Track their promotional materials
- No financial commission data (they are employees)

### 3. AFFILIATE
- View only their own performance and campaigns
- See earnings, pending payments, payment history
- Track their promotional materials and conversions
- Focus on ROI and commission tracking

### 4. REFERRER
- View only their own referral performance
- See earnings, pending payments, payment history
- Track their promotional materials
- Focus on conversion rates and commissions

---

## CORE TRACKING REQUIREMENTS

### What We Track:
1. **Promotional Materials** (each with unique tracking code)
   - QR code posters
   - QR code flyers
   - QR code business cards
   - Email links
   - Social media links
   - Digital ad links
   - SMS/WhatsApp links
   - Website referral links

2. **Customer Journey Stages**
   - **Click/Scan** → Someone interacts with material (visits website)
   - **Intake Started** → Begins filling out intake form
   - **Intake Completed** → Successfully submits intake form
   - **Tax Return Completed** → Tax return finished (this is final conversion)

3. **Attribution Data** (tracked via UTM parameters)
   - Who owns the material (user_id)
   - Material type (qr_poster, email_link, social_post, etc.)
   - Campaign name
   - Specific material ID
   - Geographic location (where material was placed/sent)
   - Timestamp of each stage

---

## DATABASE SCHEMA

### Users Table
```sql
users:
  - id (PRIMARY KEY)
  - name
  - email
  - role (super_admin, tax_preparer, affiliate, referrer)
  - created_at
  - active (boolean)
```

### Materials Table
```sql
materials:
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY → users.id)
  - material_type (qr_poster, qr_flyer, qr_card, email_link, social_link, digital_ad, sms_link, website_link)
  - campaign_name
  - unique_tracking_code (generated URL with UTM parameters)
  - qr_code_image_url (if applicable)
  - location_placed (geographic location/description)
  - date_created
  - date_activated
  - status (active, paused, expired)
  - notes
```

### Leads Table
```sql
leads:
  - id (PRIMARY KEY)
  - material_id (FOREIGN KEY → materials.id)
  - user_id (FOREIGN KEY → users.id - who gets credit)
  - utm_source
  - utm_medium
  - utm_campaign
  - utm_content
  - utm_term
  - clicked_at (timestamp of first click)
  - intake_started_at (timestamp - nullable)
  - intake_completed_at (timestamp - nullable)
  - tax_return_completed_at (timestamp - nullable)
  - client_ip
  - client_location (derived from IP)
  - device_type (mobile, desktop, tablet)
  - referrer_url
```

### Commissions Table
```sql
commissions:
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY → users.id)
  - lead_id (FOREIGN KEY → leads.id)
  - amount_owed (decimal)
  - amount_paid (decimal)
  - date_earned
  - date_paid (nullable)
  - status (pending, paid)
```

---

## UTM PARAMETER STRUCTURE

Every tracking link/QR code must include these UTM parameters:

```
https://taxgenius.com/intake?utm_source=[USER_ID]&utm_medium=[MATERIAL_TYPE]&utm_campaign=[CAMPAIGN_NAME]&utm_content=[MATERIAL_ID]&utm_term=[LOCATION]
```

**Example:**
```
https://taxgenius.com/intake?utm_source=tax_prep_john_001&utm_medium=qr_poster&utm_campaign=spring_2025_downtown&utm_content=poster_123&utm_term=miami_coffee_main_st
```

### Material Type Values:
- `qr_poster`
- `qr_flyer`
- `qr_card` (business card)
- `email_link`
- `social_facebook`
- `social_instagram`
- `social_linkedin`
- `digital_ad`
- `sms_link`
- `website_referral`

---

## KEY METRICS TO CALCULATE

### For Each User (Tax Preparer, Affiliate, Referrer):

1. **Total Clicks** - How many people clicked their links/scanned their QR codes
2. **Intake Started Rate** - (Intake Started / Total Clicks) × 100
3. **Intake Completed Rate** - (Intake Completed / Total Clicks) × 100
4. **Tax Return Completed Rate** - (Tax Returns Done / Total Clicks) × 100
5. **Drop-off Analysis**:
   - Clicked but didn't start intake
   - Started intake but didn't complete
   - Completed intake but didn't finish tax return

### Top 15 Rankings:
Each user sees their **Top 15 highest performing materials** ranked by:
- Most clicks
- Highest completion rate
- Best conversion rate (click → completed tax return)

### For Affiliates & Referrers Only:
- Total earnings to date
- Pending commissions
- Payment history
- ROI per material

---

## DASHBOARD REQUIREMENTS

### SUPER ADMIN DASHBOARD

**MACRO VIEW:**
Display in a grid/card layout:

1. **Top 15 Tax Preparers** (by completed tax returns)
2. **Top 15 Affiliates** (by completed tax returns)
3. **Top 15 Referrers** (by completed tax returns)
4. **Top 15 Materials Overall** (all users combined)
5. **Top 15 Geographic Locations** (by performance)
6. **Top 15 Material Types** (which type works best: posters vs email vs social, etc.)

**Performance Overview Cards:**
- Total clicks across all users (today, this week, this month, all time)
- Total intake forms started
- Total intake forms completed
- Total tax returns completed
- Overall conversion rate
- Total commissions owed
- Total commissions paid

**MICRO VIEW (Drill-Down):**
- Click on any Tax Preparer → See their full dashboard
- Click on any Affiliate → See their full dashboard
- Click on any Referrer → See their full dashboard
- Click on any Material → See detailed analytics for that specific material
- Geographic heat map showing performance by location

**Filters:**
- Date range selector (today, last 7 days, last 30 days, last 90 days, custom)
- User type filter
- Material type filter
- Location filter

---

### TAX PREPARER DASHBOARD

**Overview Cards:**
- Total Clients (all time)
- New Clicks (this period)
- Intake Forms Completed (this period)
- Tax Returns Completed (this period)
- Conversion Rate (click → completed return)

**Top 15 My Materials:**
Display table with columns:
1. Material Name/Campaign
2. Material Type (poster, email, social, etc.)
3. Location Placed
4. Total Clicks
5. Intake Started
6. Intake Completed
7. Tax Returns Done
8. Conversion Rate %
9. Last Click Date
10. Status (Active/Paused)

**Source Breakdown:**
Pie chart or bar chart showing:
- Leads from my own materials
- Leads from my referrers
- Leads from affiliates assigned to me
- Direct website leads

**Performance Trends:**
Line graph showing clicks and conversions over time (selectable time period)

**Material Management:**
- Create new tracking link/QR code
- View/download QR codes
- Edit material details
- Pause/activate materials
- See distribution log (when/where materials were placed)

---

### AFFILIATE DASHBOARD

**Overview Cards:**
- Total Clicks Generated
- Intake Forms Completed
- Tax Returns Completed
- Conversion Rate
- **Total Earned ($$)**
- **Pending Payment ($$)**
- **Paid to Date ($$)**

**Top 15 My Campaigns:**
Display table with columns:
1. Campaign Name
2. Material Type
3. Location/Channel
4. Total Clicks
5. Intake Completed
6. Tax Returns Done
7. Conversion Rate %
8. Commission Earned ($)
9. Commission Status (Pending/Paid)
10. Actions (View/Edit)

**Financial Summary:**
- Earnings by month (bar chart)
- Payment history table (date, amount, status)
- Pending payments breakdown

**Campaign Performance:**
- Best performing material types
- Best performing locations
- Best performing time periods
- Click trends over time

**Material Manager:**
- Create new campaigns
- Generate tracking links/QR codes
- Upload/download promotional materials
- A/B test different materials
- Distribution tracker (where materials are placed)

---

### REFERRER DASHBOARD

**Overview Cards:**
- Total Referrals Sent (clicks)
- Intake Forms Completed
- Tax Returns Completed
- Conversion Rate
- **Total Earned ($$)**
- **Pending Payment ($$)**
- **Paid to Date ($$)**

**Top 15 My Referral Materials:**
Display table with columns:
1. Material Name
2. Type
3. Location/Method
4. Clicks
5. Conversions
6. Conversion Rate %
7. Commission Earned ($)
8. Status (Pending/Paid)
9. Last Activity Date

**Financial Dashboard:**
- Commission breakdown by material
- Payment history
- Pending payments with expected dates

**Referral Sources Analysis:**
- Which of my materials work best?
- Where should I focus my efforts?
- Time-based performance (best days/times)

**Link Manager:**
- Generate new referral links
- Create QR codes for print materials
- Track link distribution
- Performance by channel (email vs social vs printed materials)

---

## TECHNICAL IMPLEMENTATION REQUIREMENTS

### Frontend Requirements:
1. **Responsive Design** - Must work on mobile, tablet, desktop
2. **Real-time Updates** - Dashboard should refresh automatically or have manual refresh button
3. **Interactive Charts** - Use a charting library (Chart.js, Recharts, or D3.js)
4. **Data Tables** - Sortable, filterable tables for top 15 lists
5. **Date Range Picker** - Allow users to filter by custom date ranges
6. **Export Functionality** - Allow users to export their data to CSV/PDF

### Backend Requirements:
1. **REST API** or **GraphQL API** for data access
2. **Authentication & Authorization** - Secure login, role-based access control
3. **UTM Parameter Tracking** - Capture and store UTM data from all incoming traffic
4. **Event Tracking** - Track 4 key events:
   - Click/Scan (page visit)
   - Intake form started
   - Intake form completed
   - Tax return completed
5. **Commission Calculation Engine** - Calculate commissions based on business rules
6. **QR Code Generation** - Auto-generate QR codes for materials
7. **Google Analytics Integration** - Send events to GA4

### Google Analytics 4 Integration:
1. **Track Custom Events:**
   - `material_click` (with all UTM parameters)
   - `intake_started` (with user_id and material_id)
   - `intake_completed` (with user_id and material_id)
   - `tax_return_completed` (with user_id and material_id)

2. **Custom Dimensions to Set Up in GA4:**
   - User ID (who owns the material)
   - User Role (tax_preparer, affiliate, referrer)
   - Material Type
   - Campaign Name
   - Material ID
   - Location

3. **Goals/Conversions to Track:**
   - Intake form completion
   - Tax return completion

### Database Requirements:
- Use PostgreSQL, MySQL, or MongoDB
- Index frequently queried fields (user_id, material_id, timestamps)
- Create views for common aggregations (top performers, conversion rates)
- Set up automated backups

### QR Code Requirements:
1. Generate dynamic QR codes (can update destination URL without reprinting)
2. Use a QR code library (qrcode.js, node-qrcode, or similar)
3. Store QR code images (upload to cloud storage like AWS S3, Cloudflare R2)
4. QR codes should link to branded short URLs for tracking

### Security Requirements:
1. **Authentication** - JWT tokens or session-based auth
2. **Authorization** - Users can only see their own data (except Super Admin)
3. **Data Privacy** - Encrypt sensitive data (commissions, personal info)
4. **Rate Limiting** - Prevent abuse of API endpoints
5. **SQL Injection Prevention** - Use parameterized queries
6. **XSS Prevention** - Sanitize all user inputs

---

## DASHBOARD UI/UX SPECIFICATIONS

### Color Scheme:
- **Super Admin:** Purple/Pink gradient
- **Tax Preparer:** Blue gradient
- **Affiliate:** Green/Teal gradient
- **Referrer:** Orange/Yellow gradient

### Layout Structure:
```
┌─────────────────────────────────────────────┐
│  Header: Logo | User Name | Notifications   │
├─────────────────────────────────────────────┤
│  Sidebar Navigation:                         │
│  - Dashboard (Home)                          │
│  - My Materials                              │
│  - Analytics                                 │
│  - Financial (if affiliate/referrer)         │
│  - Settings                                  │
├──────────┬──────────────────────────────────┤
│          │  MAIN CONTENT AREA               │
│          │                                   │
│  Sidebar │  Overview Cards (4-6 metrics)    │
│          │                                   │
│          │  Top 15 Materials Table           │
│          │                                   │
│          │  Performance Charts               │
│          │                                   │
│          │  Detailed Analytics               │
└──────────┴──────────────────────────────────┘
```

### Components Needed:
1. **Stat Cards** - Display key metrics (clicks, conversions, earnings)
2. **Data Table** - Top 15 materials with sorting/filtering
3. **Line Chart** - Trends over time
4. **Pie/Donut Chart** - Source breakdown
5. **Bar Chart** - Comparison of materials or campaigns
6. **Heat Map** - Geographic performance
7. **Date Picker** - Filter by date range
8. **Material Card** - Display individual material with QR code preview
9. **Payment History Table** - For affiliates/referrers
10. **Create Material Modal** - Form to create new tracking materials

---

## CRITICAL TRACKING WORKFLOW

### Step-by-Step Process:

1. **User Creates Material:**
   - User fills out form: campaign name, material type, location
   - System generates unique tracking code with UTM parameters
   - System generates QR code image (if applicable)
   - Material saved to database with status "active"

2. **Customer Interacts with Material:**
   - Customer scans QR code or clicks link
   - They arrive at: `taxgenius.com/intake?utm_source=...&utm_medium=...`
   - **CRITICAL:** Capture UTM parameters immediately
   - Store in session/cookie so they persist throughout journey
   - Create lead record with `clicked_at` timestamp
   - Send `material_click` event to Google Analytics

3. **Customer Starts Intake Form:**
   - When form loads, capture event
   - Update lead record with `intake_started_at` timestamp
   - Send `intake_started` event to Google Analytics
   - UTM data still attached to this lead

4. **Customer Completes Intake Form:**
   - When form submitted successfully
   - Update lead record with `intake_completed_at` timestamp
   - Send `intake_completed` event to Google Analytics
   - If user is affiliate/referrer, calculate pending commission

5. **Tax Return Completed:**
   - When tax preparer marks return as complete
   - Update lead record with `tax_return_completed_at` timestamp
   - Send `tax_return_completed` event to Google Analytics
   - If commission applicable, update status from pending to owed
   - All dashboards update automatically

---

## REPORTING & ANALYTICS FEATURES

### Reports Users Can Generate:

1. **Performance Report** (all users)
   - Date range selector
   - Shows all materials, clicks, conversions
   - Exportable to CSV/PDF

2. **Material Comparison Report**
   - Compare 2+ materials side by side
   - See which performed better

3. **Geographic Performance Report**
   - Performance by city/region
   - Map visualization

4. **Time Analysis Report**
   - Best performing days of week
   - Best performing times of day
   - Seasonal trends

5. **Financial Report** (affiliates/referrers only)
   - Earnings by period
   - Payment history
   - Tax documents (1099 info)

6. **Drop-off Analysis Report** (Super Admin)
   - Where are people dropping off?
   - Click → Start: X% drop-off
   - Start → Complete: Y% drop-off
   - Complete → Tax Done: Z% drop-off

---

## ALERTS & NOTIFICATIONS

### Real-Time Notifications:
1. **High Performance Alert** - "Your poster at Main St Coffee just got 20 clicks today!"
2. **Material Needs Attention** - "No clicks in 7 days on your Spring Campaign"
3. **Payment Processed** - "Commission of $500 has been paid"
4. **New Lead** - "Someone just completed intake from your QR code!"
5. **Goal Achieved** - "Congratulations! You hit 100 conversions!"

### Email Digest Options:
- Daily summary
- Weekly summary
- Monthly summary

---

## MATERIAL CREATION FLOW

### Form Fields for Creating New Material:

```
Campaign Name: [text input]
Material Type: [dropdown]
  - QR Code Poster
  - QR Code Flyer
  - QR Code Business Card
  - Email Link
  - Social Media Link
  - Digital Ad
  - SMS Link
  - Website Referral

Location/Placement: [text input]
  Example: "Downtown Coffee Shop - Main Street"

Notes: [textarea]
  Example: "Posted on community bulletin board, renewed monthly"

[Generate Tracking Link Button]
[Generate QR Code Button]
```

### After Creation:
- Display unique tracking URL
- Display QR code (downloadable)
- Show preview of material
- Provide embed code (for websites)
- Add to "My Materials" list

---

## ADMIN MANAGEMENT FEATURES

### Super Admin Can:
1. **User Management**
   - Add/edit/deactivate users
   - Assign user roles
   - Reset passwords
   - View user activity logs

2. **Commission Management**
   - Set commission rates per user
   - Approve/reject commission claims
   - Process payments
   - Generate payment reports

3. **Material Management**
   - View all materials across all users
   - Deactivate problematic materials
   - See most/least effective materials company-wide

4. **System Settings**
   - Configure commission rules
   - Set up automated payment schedules
   - Manage integrations (Google Analytics, payment processor)

5. **Audit Logs**
   - Track all system changes
   - User login history
   - Commission changes
   - Material creation/deletion

---

## SUCCESS CRITERIA

The dashboard is successful when:

1. ✅ Users can create tracking materials in under 2 minutes
2. ✅ Users can see their top 15 performing materials instantly
3. ✅ Users understand where their leads come from
4. ✅ Users can identify which materials to invest more in
5. ✅ Affiliates/Referrers can see accurate commission data
6. ✅ Super Admin can identify top performers across the company
7. ✅ 100% of customer journeys are accurately tracked (click → completion)
8. ✅ QR codes work on all devices
9. ✅ Dashboards load in under 2 seconds
10. ✅ Data is always accurate and up-to-date

---

## DEVELOPMENT PHASES

### Phase 1: Core Infrastructure (Week 1-2)
- Database setup
- User authentication
- Basic UTM tracking
- Lead capture system

### Phase 2: Material Management (Week 2-3)
- Material creation flow
- QR code generation
- Link tracking
- Google Analytics integration

### Phase 3: Dashboards (Week 3-5)
- Super Admin dashboard
- Tax Preparer dashboard
- Affiliate dashboard
- Referrer dashboard

### Phase 4: Analytics & Reporting (Week 5-6)
- Top 15 rankings
- Performance charts
- Export functionality
- Drop-off analysis

### Phase 5: Financial Features (Week 6-7)
- Commission calculations
- Payment tracking
- Financial reports
- Payment processing integration

### Phase 6: Polish & Testing (Week 7-8)
- UI/UX refinements
- Mobile optimization
- Performance testing
- Security audit
- User acceptance testing

---

## TECHNICAL STACK RECOMMENDATIONS

**Frontend:**
- React.js or Next.js
- TailwindCSS for styling
- Recharts or Chart.js for visualizations
- Axios for API calls
- React Router for navigation
- React Query for data fetching

**Backend:**
- Node.js with Express.js OR Python with Django/Flask
- PostgreSQL database
- Redis for caching
- JWT for authentication
- Bull/Queue for background jobs

**Infrastructure:**
- Deploy on Vercel, AWS, or DigitalOcean
- Use Cloudflare for DNS and CDN
- AWS S3 or Cloudflare R2 for file storage (QR codes)
- Use environment variables for all secrets

**Third-Party Services:**
- Google Analytics 4
- QR code generation library
- Email service (SendGrid, Mailgun)
- Payment processor (Stripe, PayPal) for commission payments

---

## FINAL NOTES

**MOST IMPORTANT ASPECTS:**

1. **Accurate Tracking** - UTM parameters must be captured and persisted throughout the entire customer journey. Do not lose this data.

2. **Clear Attribution** - Always know which material/user gets credit for each lead. One lead = one source.

3. **Top 15 Rankings** - This is the #1 feature users care about. Make it prominent, accurate, and sortable.

4. **Conversion Funnel** - Users need to see: Clicks → Intake Started → Intake Completed → Tax Return Done. Show drop-offs clearly.

5. **Real-Time Data** - Dashboards should update as close to real-time as possible. Users want to see results immediately.

6. **Mobile-First** - Many users will check their dashboard on phones. Prioritize mobile UX.

7. **Simple Material Creation** - Creating a new QR code or link should be dead simple. 3 clicks maximum.

---

## QUESTIONS TO ANSWER DURING DEVELOPMENT

1. What triggers a commission? (Intake completed? Tax return completed?)
2. What is the commission structure? (Fixed amount? Percentage? Tiered?)
3. How often are commissions paid? (Weekly? Monthly? On-demand?)
4. Can one lead have multiple sources? (How do we handle attribution conflicts?)
5. How long do QR codes/links remain active? (Forever? Expire after campaign?)
6. Can users share the same campaign? (Or are all campaigns user-specific?)
7. Who can see other users' data? (Can tax preparers see each other's performance?)
8. What happens if someone visits from multiple sources? (First touch? Last touch? Both?)

---

# LET'S BUILD THIS! 🚀

Please implement this system step-by-step, starting with the database schema, then authentication, then the core tracking mechanism, and finally the dashboards. Ask questions as you go if anything is unclear.