# Tax Form Assistant - Setup Guide

## Overview

The Tax Form Assistant is an AI-powered chat widget that helps tax preparers answer questions about IRS forms, deductions, credits, and where to enter specific information on tax forms.

**Features:**
- 🤖 Powered by OpenAI Assistants API with file search
- 📄 Knowledge base of top 20 IRS forms
- 💬 Conversation history and thread management
- 📊 Usage tracking and analytics
- 🎯 Available only to tax preparers
- 📱 Mobile-responsive floating chat widget

---

## Setup Instructions

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the API key (starts with `sk-...`)
6. Save it securely - you won't be able to see it again

### Step 2: Create OpenAI Assistant

1. Go to [OpenAI Assistants](https://platform.openai.com/assistants)
2. Click **"Create"**
3. Configure the assistant:

   **Name:** Tax Form Assistant

   **Instructions:**
   ```
   You are a knowledgeable tax preparation assistant. Your role is to help tax preparers understand IRS forms and where to enter specific information.

   When answering questions:
   1. Be specific about form numbers and line numbers
   2. Reference the exact IRS form sections
   3. Provide clear, concise explanations
   4. If unsure, acknowledge limitations and suggest consulting IRS publications
   5. Always prioritize accuracy over speed

   You have access to the top 20 most common IRS tax forms. Use file search to find relevant information.

   Common questions you'll help with:
   - Where to enter specific deductions (mortgage interest, medical expenses, etc.)
   - Which schedule to use for different income types
   - How to report capital gains and losses
   - Where to claim various tax credits
   - Understanding form dependencies
   ```

   **Model:** GPT-4 Turbo (recommended) or GPT-4

   **Tools:**
   - ✅ Enable **File Search**
   - ✅ Enable **Code Interpreter** (optional, helps with calculations)

4. Click **"Save"**
5. Copy the **Assistant ID** (starts with `asst_...`)

### Step 3: Upload IRS Forms

1. Download the following IRS forms (PDF format) from [IRS.gov](https://www.irs.gov/forms-instructions):

   **Individual Forms:**
   - Form 1040 - U.S. Individual Income Tax Return
   - Form 1040-SR - U.S. Tax Return for Seniors
   - Schedule 1 - Additional Income and Adjustments to Income
   - Schedule 2 - Additional Taxes
   - Schedule 3 - Additional Credits and Payments
   - Schedule A - Itemized Deductions
   - Schedule B - Interest and Ordinary Dividends
   - Schedule C - Profit or Loss from Business
   - Schedule D - Capital Gains and Losses
   - Schedule E - Supplemental Income and Loss
   - Schedule SE - Self-Employment Tax

   **Supporting Forms:**
   - Form W-2 - Wage and Tax Statement
   - Form 1099-MISC - Miscellaneous Income
   - Form 1099-NEC - Nonemployee Compensation
   - Form 2441 - Child and Dependent Care Expenses
   - Form 4562 - Depreciation and Amortization
   - Form 8812 - Credits for Qualifying Children
   - Form 8863 - Education Credits
   - Form 8949 - Sales and Other Dispositions of Capital Assets
   - Form 8995 - Qualified Business Income Deduction

   **Instructions:**
   - Instructions for Form 1040 (comprehensive guide)

2. In your OpenAI Assistant, click **"Add Files"**
3. Upload all downloaded PDF files
4. Wait for file processing to complete
5. Verify all files are listed under "Files"

### Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Add your OpenAI credentials:

   ```bash
   # OpenAI API (Tax Assistant)
   OPENAI_API_KEY=sk-your_actual_api_key_here
   OPENAI_ASSISTANT_ID=asst_your_actual_assistant_id_here
   ```

3. **Important:** Do NOT commit `.env.local` to git (it's already in .gitignore)

### Step 5: Run Database Migration

Run the Prisma migration to create the tax assistant tables:

```bash
npx prisma migrate dev --name add_tax_assistant
```

Or if using the production database:

```bash
DATABASE_URL="your_production_db_url" npx prisma db push
```

### Step 6: Generate Prisma Client

```bash
npx prisma generate
```

### Step 7: Restart the Application

```bash
# Development
npm run dev

# Production
pm2 restart taxgeniuspro
```

---

## Testing the Assistant

### Test Questions to Ask:

1. **Deductions:**
   - "Where do I enter mortgage interest on Form 1040?"
   - "How do I report medical expenses?"
   - "Where do I claim charitable contributions?"

2. **Business Income:**
   - "Which schedule do I use for self-employment income?"
   - "Where do I report freelance income on Schedule C?"
   - "How do I calculate self-employment tax?"

3. **Credits:**
   - "Where do I claim the child tax credit?"
   - "How do I report education credits?"
   - "Where is the earned income credit entered?"

4. **Capital Gains:**
   - "How do I report stock sales?"
   - "Where do short-term capital gains go?"
   - "Which form do I use for cryptocurrency sales?"

### Expected Behavior:

- ✅ Assistant responds within 2-10 seconds
- ✅ Includes specific form numbers and line numbers
- ✅ Extracts form references as badges
- ✅ Conversation history is saved
- ✅ Can start multiple conversation threads

---

## Usage for Tax Preparers

### Accessing the Assistant

1. Log in as a tax preparer
2. Navigate to any page in the tax preparer dashboard
3. Look for the floating **chat icon** (💬) in the bottom-right corner
4. Click to open the assistant

### Using the Chat

**Starting a Conversation:**
- Type your question and press Enter or click Send
- The assistant will create a new thread automatically

**Managing Conversations:**
- Click the **+** icon to view all conversations
- Click any previous conversation to resume it
- Start a new conversation with the **New Conversation** button

**Tips for Best Results:**
- Be specific in your questions
- Mention the tax year if relevant (e.g., "2024 Form 1040")
- Ask follow-up questions in the same thread for context

---

## Cost Management

### OpenAI Pricing (as of 2024):

**GPT-4 Turbo:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**File Search:**
- $0.10 per assistant per day (only charged when used)

**Typical Usage:**
- Average question: ~500 input tokens + ~800 output tokens = ~$0.03
- 100 questions/day: ~$3/day + $0.10 file search = ~$3.10/day
- Monthly estimate: ~$93-100

### Monitoring Usage:

1. Check OpenAI dashboard: [Usage](https://platform.openai.com/usage)
2. Set usage limits: [Limits](https://platform.openai.com/account/limits)
3. View in-app stats (coming soon - see database table `tax_assistant_threads`)

---

## Database Schema

### Tables Created:

**tax_assistant_threads:**
- Stores conversation threads
- Tracks token usage and cost per thread
- Links to user (clerkUserId)

**tax_assistant_messages:**
- Individual messages within threads
- Stores message content and form references
- Tracks per-message token usage

### Querying Usage:

```sql
-- Total usage by user
SELECT
  clerkUserId,
  COUNT(*) as total_threads,
  SUM(messageCount) as total_messages,
  SUM(tokensUsed) as total_tokens,
  SUM(costInCents) / 100.0 as total_cost_dollars
FROM tax_assistant_threads
GROUP BY clerkUserId;

-- Most active users
SELECT
  clerkUserId,
  COUNT(*) as thread_count,
  SUM(messageCount) as message_count
FROM tax_assistant_threads
WHERE createdAt >= NOW() - INTERVAL '30 days'
GROUP BY clerkUserId
ORDER BY message_count DESC
LIMIT 10;

-- Most referenced forms
SELECT
  unnest(formReferences) as form_number,
  COUNT(*) as mention_count
FROM tax_assistant_messages
GROUP BY form_number
ORDER BY mention_count DESC
LIMIT 20;
```

---

## Troubleshooting

### Issue: "Failed to create conversation thread"

**Possible Causes:**
1. Invalid or missing `OPENAI_API_KEY`
2. API key doesn't have access to Assistants API
3. Rate limit exceeded

**Solutions:**
- Verify API key in `.env.local`
- Check OpenAI dashboard for API status
- Ensure you have credits/billing set up

### Issue: "Assistant response timeout"

**Possible Causes:**
1. File search is taking too long (large documents)
2. OpenAI API is slow
3. Network connectivity issues

**Solutions:**
- Check OpenAI status page
- Try again in a few moments
- Consider using a faster model (GPT-3.5 Turbo)

### Issue: Widget not appearing

**Possible Causes:**
1. User is not a tax preparer
2. Environment variables not set
3. Build/restart needed

**Solutions:**
- Verify user role is `tax_preparer`
- Check `.env.local` has OpenAI variables
- Restart the development server or PM2

### Issue: Incorrect or irrelevant answers

**Possible Causes:**
1. Forms not properly uploaded
2. Assistant instructions need refinement
3. Question is too vague

**Solutions:**
- Re-upload forms to assistant
- Update assistant instructions
- Provide more specific questions

---

## Security Considerations

### Data Privacy:

- ✅ Conversations are tied to user accounts (Clerk authentication)
- ✅ No PII should be shared in questions
- ✅ API keys are stored in environment variables (not in code)
- ✅ Thread ownership is verified before access

### Best Practices:

1. **Never share client information** with the assistant
2. **Use generic examples** when testing
3. **Rotate API keys** periodically
4. **Monitor usage** for unusual activity
5. **Set spending limits** on OpenAI account

### Compliance:

- IRS forms are public domain (no copyright issues)
- Assistant provides guidance only (not tax advice)
- Tax preparers remain responsible for accuracy

---

## Future Enhancements

Potential improvements:

- [ ] Streaming responses (real-time typing effect)
- [ ] Voice input/output
- [ ] Form preview/display integration
- [ ] Save favorite responses
- [ ] Share conversations with team
- [ ] Export conversation history
- [ ] Analytics dashboard for usage
- [ ] Integration with document review workflow
- [ ] Multi-language support (Spanish)
- [ ] Custom form uploads (state-specific forms)

---

## Support

### Getting Help:

- **Documentation:** `/docs/TAX_ASSISTANT_SETUP.md`
- **API Reference:** [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview)
- **IRS Forms:** [IRS Forms & Publications](https://www.irs.gov/forms-instructions)

### Reporting Issues:

If you encounter problems:

1. Check OpenAI dashboard for API issues
2. Verify environment variables are set
3. Check database migration status
4. Review server logs for errors
5. Contact development team

---

## Appendix: Sample Assistant Configuration

### Complete Assistant Setup (JSON Export)

```json
{
  "name": "Tax Form Assistant",
  "model": "gpt-4-turbo-preview",
  "instructions": "You are a knowledgeable tax preparation assistant helping tax preparers understand IRS forms...",
  "tools": [
    {
      "type": "file_search"
    },
    {
      "type": "code_interpreter"
    }
  ],
  "file_ids": [
    "file-abc123...",
    "file-def456..."
  ],
  "metadata": {
    "purpose": "Tax form assistance",
    "version": "1.0"
  }
}
```

---

**Last Updated:** 2025-10-23
**Version:** 1.0
**Maintained By:** Development Team
