# 🤖 Tax Form Assistant

An AI-powered chat assistant that helps tax preparers answer questions about IRS forms and tax filing procedures.

## Quick Links

- 📘 **[Implementation Summary](./docs/TAX_ASSISTANT_SUMMARY.md)** - What was built
- 🔧 **[Setup Guide](./docs/TAX_ASSISTANT_SETUP.md)** - Complete configuration instructions
- 🌐 **Live Site:** https://taxgeniuspro.tax

---

## Features

✅ **Smart AI Assistant** - Powered by OpenAI GPT-4 with IRS form knowledge base
✅ **Floating Chat Widget** - Always accessible from tax preparer dashboard
✅ **Conversation History** - Resume previous conversations anytime
✅ **Form References** - Automatic extraction of form numbers from responses
✅ **Usage Tracking** - Monitor tokens, costs, and message counts
✅ **Mobile Responsive** - Works on all devices

---

## For Tax Preparers

### How to Access:
1. Log in to your account at https://taxgeniuspro.tax
2. Look for the chat icon (💬) in the bottom-right corner
3. Click to open the assistant
4. Ask your tax form questions!

### Example Questions:
- "Where do I enter mortgage interest on Form 1040?"
- "How do I report self-employment income?"
- "Which schedule do I use for rental income?"
- "Where do I claim the child tax credit?"
- "How do I report cryptocurrency sales?"

---

## For Administrators

### Configuration Files:
- `.env.local` - API keys and configuration
- `prisma/schema.prisma` - Database schema
- `docs/TAX_ASSISTANT_SETUP.md` - Full setup guide

### Database Tables:
- `tax_assistant_threads` - Conversation threads
- `tax_assistant_messages` - Individual messages

### API Endpoints:
```
POST   /api/tax-assistant/threads        - Create conversation
GET    /api/tax-assistant/threads        - List conversations
GET    /api/tax-assistant/threads/[id]   - Get conversation
DELETE /api/tax-assistant/threads/[id]   - Delete conversation
POST   /api/tax-assistant/messages       - Send message
```

---

## Quick Start

### 1. Verify Configuration:
```bash
# Check environment variables
cat .env.local | grep OPENAI
```

### 2. Check Database:
```bash
# Verify tables exist
DATABASE_URL="postgresql://taxgeniuspro_user:TaxGenius2024Secure@localhost:5436/taxgeniuspro_db?schema=public" \
  psql -c "\dt tax_assistant*"
```

### 3. Monitor Usage:
```bash
# View application logs
pm2 logs taxgeniuspro

# Check assistant status
pm2 status
```

---

## OpenAI Configuration

**Assistant ID:** `asst_y6GVeHCSgYL5Sh2rXZwobK4Z`
**Model:** GPT-4 Turbo
**Capabilities:** File Search, Code Interpreter

### Manage Your Assistant:
🔗 https://platform.openai.com/assistants/asst_y6GVeHCSgYL5Sh2rXZwobK4Z

---

## Important Next Step

⚠️ **Upload IRS Forms to Your Assistant**

Your assistant is configured but needs the IRS form knowledge base:

1. Go to: https://platform.openai.com/assistants
2. Select your assistant: `Tax Form Assistant`
3. Click "Files" section
4. Upload these 20 IRS forms (download from IRS.gov):
   - Form 1040, 1040-SR
   - Schedules A, B, C, D, E, SE, 1, 2, 3
   - Forms W-2, 1099-MISC, 1099-NEC
   - Forms 2441, 4562, 8812, 8863, 8949, 8995
   - Instructions for Form 1040

📄 See `/docs/TAX_ASSISTANT_SETUP.md` for direct download links.

---

## Cost Management

**Estimated Costs:**
- ~$0.03 per question
- ~$3/day for 100 questions
- ~$90-100/month typical usage

**Monitor:**
- OpenAI Usage Dashboard: https://platform.openai.com/usage
- Set budget alerts to control spending
- Review usage analytics in database

---

## Support

**Documentation:**
- [Implementation Summary](./docs/TAX_ASSISTANT_SUMMARY.md)
- [Setup Guide](./docs/TAX_ASSISTANT_SETUP.md)

**Troubleshooting:**
- Widget not showing? Check user role is `tax_preparer`
- API errors? Verify OpenAI API key is valid
- Slow responses? Check OpenAI status page

**Contact:**
- Development team for technical issues
- Check server logs: `pm2 logs taxgeniuspro`

---

## Technical Stack

- **AI Platform:** OpenAI Assistants API
- **Backend:** Next.js 15 API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** React with TypeScript
- **UI Components:** shadcn/ui
- **Authentication:** Clerk

---

## Version History

- **v1.0** (Oct 23, 2025) - Initial release
  - OpenAI integration
  - Floating chat widget
  - Conversation management
  - Form reference extraction
  - Usage tracking

---

## License

Proprietary - TaxGeniusPro Internal Use Only

---

**Built with ❤️ for TaxGeniusPro Tax Preparers**

Need help? Contact your system administrator.
