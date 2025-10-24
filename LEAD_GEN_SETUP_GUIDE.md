# 🚀 TaxGeniusPro Lead Generation Landing Pages - Complete Setup Guide

## Overview

This system will automatically generate **600 unique landing pages** across 200 US cities for 3 lead generation campaigns:

1. **Get Tax Filing** (200 pages) - Customer acquisition
2. **Become Tax Preparer** (200 pages) - Hiring tax professionals
3. **Become Affiliate** (200 pages) - Affiliate/referrer recruitment

**Total Pages**: 600 (200 cities × 3 campaigns)
**Cost**: $0 (using free local Ollama LLM)
**Time**: ~18-21 hours total (runs in background)

---

## 🎯 What Each Campaign Does

### Campaign 1: Get Tax Filing (Customer Lead Gen)
**URL Pattern**: `/get-tax-filing/new-york-ny`, `/get-tax-filing/los-angeles-ca`, etc.

**Purpose**: Convert visitors into paying tax filing customers

**Generated Content** (per city):
- 400-word unique intro about tax services in [City]
- 10 benefits of using TaxGeniusPro in [City]
- 15 FAQs tailored to [City] residents
- Lead capture form for free consultation
- Schema.org markup for local SEO
- Complete metadata optimization

**CTA**: "Get Your Free Tax Consultation"

---

### Campaign 2: Become Tax Preparer (Recruiter Lead Gen)
**URL Pattern**: `/become-tax-preparer/new-york-ny`, `/become-tax-preparer/chicago-il`, etc.

**Purpose**: Recruit experienced tax preparers and CPAs

**Generated Content** (per city):
- 400-word unique job opportunity description for [City]
- 10 benefits of working with TaxGeniusPro in [City]
- 15 FAQs about tax preparer careers
- Job application form
- Local job market context
- Salary and benefits information

**CTA**: "Apply Now - Join Our Team"

---

### Campaign 3: Become Affiliate (Affiliate Recruitment)
**URL Pattern**: `/become-affiliate/miami-fl`, `/become-affiliate/houston-tx`, etc.

**Purpose**: Recruit affiliates to refer tax clients

**Generated Content** (per city):
- 400-word unique affiliate opportunity in [City]
- 10 benefits of TaxGeniusPro affiliate program
- 15 FAQs about earning referral income
- Affiliate signup form
- Commission structure
- Marketing materials preview

**CTA**: "Start Earning Today - Sign Up Free"

---

## 📋 Setup Checklist

### ✅ Prerequisites (Already Complete!)

- [x] Database schema extended with SEO models
- [x] LLM integrations created (Ollama, Google AI, OpenAI)
- [x] Campaign generator implemented
- [x] API routes created
- [x] Seeder scripts created

### 🔧 Setup Steps (15 minutes)

#### Step 1: Install NPM Packages (2 min)
```bash
npm install @google/genai openai
```

#### Step 2: Install Ollama (10 min - one time)
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows - Download from https://ollama.ai/download

# Pull the AI model (choose one):
ollama pull qwen2.5:32b  # Best quality (20GB download)
# OR
ollama pull qwen2.5:7b   # Faster setup (4GB download, slightly lower quality)
```

**Verify Ollama is running**:
```bash
ollama list
# Should show qwen2.5 model
```

#### Step 3: Configure Environment (1 min)
Update `.env`:
```bash
# Required (FREE - Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:32b  # or qwen2.5:7b

# Optional (for AI images - ~$0.02 each)
GOOGLE_AI_STUDIO_API_KEY=your_key_here

# Optional (for translations)
OPENAI_API_KEY=sk-your_key_here
```

#### Step 4: Seed Cities Database (2 min)
```bash
npx tsx scripts/seed-cities.ts
```

**Output**:
```
🌆 Seeding 200 US Cities...
  ✅ Created: New York, NY (rank #1, pop: 8,336,817)
  ✅ Created: Los Angeles, CA (rank #2, pop: 3,979,576)
  ...
✨ City seeding complete!
   Created: 200
   Total: 200
```

---

## 🚀 Running the Campaigns

### Option A: Automated Setup (Recommended)

**Step 1: Create Campaigns**
```bash
npx tsx scripts/start-lead-gen-campaigns.ts
```

This creates 3 campaign queue entries in the database.

**Step 2: Trigger Generation**
```bash
# Make sure server is running first:
pm2 restart taxgeniuspro

# Then trigger campaigns:
npx tsx scripts/trigger-campaigns.ts
```

**Output**:
```
🚀 Triggering Campaign Generation...

Found 3 pending campaigns:

📋 Get Your Taxes Done by TaxGeniusPro - 200 Cities
   ID: campaign-xxx
   Service Type: get-tax-filing
   ✅ Campaign started successfully!
   Message: Generation will take 6-7 hours...

📋 Join Our Team - Tax Preparer Jobs - 200 Cities
   ID: campaign-yyy
   ✅ Campaign started successfully!

📋 Earn Extra Money as a Tax Genius Affiliate - 200 Cities
   ID: campaign-zzz
   ✅ Campaign started successfully!

✅ All campaigns triggered!
```

### Option B: Manual API Calls

```bash
# Campaign 1: Get Tax Filing
curl -X POST http://localhost:3005/api/seo-brain/start-campaign \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "get-tax-filing",
    "serviceName": "Get Your Taxes Done by TaxGeniusPro",
    "description": "Professional tax prep with maximum refunds",
    "price": 199,
    "features": [
      "IRS-certified preparers",
      "Maximum refund guarantee",
      "Audit protection included",
      "Year-round support"
    ],
    "keywords": ["tax filing", "tax prep"],
    "generateImages": false
  }'

# Repeat for other 2 campaigns...
```

---

## 📊 Monitoring Progress

### Check Campaign Status
```bash
curl "http://localhost:3005/api/seo-brain/campaign-status?campaignId=CAMPAIGN_ID"
```

**Response**:
```json
{
  "success": true,
  "campaign": {
    "id": "campaign-xxx",
    "campaignName": "Get Your Taxes Done - 200 Cities",
    "serviceType": "get-tax-filing",
    "status": "GENERATING",
    "progress": 45,
    "citiesGenerated": 90,
    "totalCities": 200,
    "estimatedTimeRemaining": "3h 15m",
    "generationStartedAt": "2025-10-23T19:00:00Z"
  }
}
```

### View Generated Pages in Database
```bash
# Count generated pages
DATABASE_URL="postgresql://taxgeniuspro_user:TaxGenius2024Secure@localhost:5436/taxgeniuspro_db" \
  npx prisma studio

# Navigate to SeoLandingPage table
# Filter by serviceType: 'get-tax-filing', 'become-tax-preparer', 'become-affiliate'
```

---

## 📈 Expected Results

### Timeline
- **Per Campaign**: 6-7 hours (200 cities)
- **All 3 Campaigns**: 18-21 hours total
- **Runs in background** - server stays responsive

### Generated Content Per Page
- ✅ **400 unique words** - No duplicate content
- ✅ **10 city-specific benefits**
- ✅ **15 SEO-optimized FAQs**
- ✅ **Complete schema.org markup** (LocalBusiness, Service, FAQPage)
- ✅ **Metadata** (title, description, keywords)
- ✅ **Performance tracking** (views, clicks, conversions)

### Database Records Created
```
Cities: 200
SeoLandingPages: 600 (200 × 3 campaigns)
ProductCampaignQueue: 3
```

---

## 🎨 Page Examples

### Example 1: New York Tax Filing Page
**URL**: `/get-tax-filing/new-york-ny`

**Title**: "Get Your Taxes Done by TaxGeniusPro in New York, NY | Professional Tax Services"

**H1**: "Professional Tax Filing in New York, New York"

**Intro** (400 words):
> "Finding the right tax preparation service in New York City can be overwhelming with countless options available. At TaxGeniusPro, we specialize in providing New York residents and businesses with expert tax filing services that maximize your refund while ensuring full IRS compliance..."

**Benefits** (10):
1. "IRS-certified tax preparers with 10+ years serving New York clients..."
2. "Maximum refund guarantee - we find every deduction available to NY taxpayers..."
3. ...

**FAQs** (15):
- Q: "How much does tax preparation cost in New York?"
  - A: "Our New York tax preparation services start at $199..."
- Q: "Do I need to visit your New York office in person?"
  - A: "No, we offer both virtual and in-person consultations for NY clients..."
- ...

**CTA**: Lead form → "Get Your Free Tax Consultation"

---

### Example 2: Chicago Tax Preparer Job Page
**URL**: `/become-tax-preparer/chicago-il`

**Title**: "Tax Preparer Jobs in Chicago, IL | Join TaxGeniusPro"

**Intro**:
> "Are you an experienced tax professional looking for rewarding career opportunities in Chicago? TaxGeniusPro is expanding our Illinois team and seeking talented tax preparers and CPAs..."

**Benefits**:
1. "Competitive Chicago market salary plus performance bonuses..."
2. "Work from home or our Chicago office locations..."
- ...

**CTA**: Application form → "Apply Now"

---

### Example 3: Los Angeles Affiliate Page
**URL**: `/become-affiliate/los-angeles-ca`

**Title**: "Earn Money Referring Tax Clients in Los Angeles, CA"

**Intro**:
> "Looking to earn extra income in Los Angeles? Join TaxGeniusPro's affiliate program and earn generous commissions referring clients who need tax preparation services..."

**Benefits**:
1. "Earn $50-$200 per successful referral in the LA market..."
2. "No experience required - we provide marketing materials..."
- ...

**CTA**: Signup form → "Start Earning Today"

---

## 💰 Cost Analysis

### Using Free Ollama (Recommended)
- **Text Generation**: $0 (runs locally)
- **600 pages**: $0
- **Unlimited regeneration**: $0
- **Total**: $0

### Optional Add-ons
- **Google Imagen (AI Images)**: ~$0.02 per image
  - 600 images: $12 total
- **OpenAI Translations**: ~$0.01 per page
  - 600 pages × 13 languages: ~$78

**Maximum Cost (all features)**: ~$90
**Compare to Manual**: $600 pages × $50 = $30,000

**Savings**: 99.7%

---

## 🔧 Troubleshooting

### Issue: "Ollama connection failed"
**Solution**:
```bash
# Check if Ollama is running
ollama list

# If not running, start it:
ollama serve

# Test connection:
curl http://localhost:11434/api/tags
```

### Issue: "Model not found"
**Solution**:
```bash
# Pull the model
ollama pull qwen2.5:32b

# Verify
ollama list
```

### Issue: "Cities not seeded"
**Solution**:
```bash
# Run city seeder
npx tsx scripts/seed-cities.ts

# Verify in database
DATABASE_URL="..." npx prisma studio
# Check City table
```

### Issue: "Server not responding"
**Solution**:
```bash
# Check server status
pm2 status

# Restart if needed
pm2 restart taxgeniuspro

# Check logs
pm2 logs taxgeniuspro
```

### Issue: "Generation too slow"
**Solution**:
- Use smaller model: `ollama pull qwen2.5:7b`
- Update `.env`: `OLLAMA_MODEL=qwen2.5:7b`
- Restart campaigns

---

## 📁 File Structure Created

```
/scripts/
├── seed-cities.ts                  ✅ Seeds 200 US cities
├── start-lead-gen-campaigns.ts     ✅ Creates 3 campaign queues
└── trigger-campaigns.ts            ✅ Triggers API to start generation

/src/lib/seo-llm/
├── integrations/
│   ├── ollama/ollama-client.ts     ✅ Local LLM
│   ├── google-imagen/              ✅ AI images (optional)
│   └── openai/auto-translate.ts    ✅ Translations (optional)
├── campaign-generator/
│   ├── city-content-prompts.ts     ✅ Content generation
│   └── city-page-generator.ts      ✅ Page builder
└── metadata/
    └── metadata-generator.ts       ✅ SEO metadata

/src/app/api/seo-brain/
├── start-campaign/route.ts         ✅ Campaign API
└── campaign-status/route.ts        ✅ Progress tracking

/prisma/schema.prisma               ✅ Extended with SEO models
```

---

## 🎯 Quick Start Commands

```bash
# 1. Install packages
npm install @google/genai openai

# 2. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull qwen2.5:32b

# 3. Seed cities
npx tsx scripts/seed-cities.ts

# 4. Create campaigns
npx tsx scripts/start-lead-gen-campaigns.ts

# 5. Start generation
pm2 restart taxgeniuspro
npx tsx scripts/trigger-campaigns.ts

# 6. Monitor progress
pm2 logs taxgeniuspro --lines 50
```

**Done!** 🎉

In 18-21 hours you'll have **600 unique, SEO-optimized landing pages** ready to drive leads!

---

## 📞 Support

**Check Ollama**: https://ollama.ai/docs
**Check Logs**: `pm2 logs taxgeniuspro`
**Database**: `npx prisma studio`

---

**Last Updated**: October 23, 2025
**System Version**: v1.0
**Status**: Production Ready

🚀 **Ready to generate 600 lead generation landing pages!**
