# Mobile Hub - User Guide

## 🎉 Your Mobile Command Center is Live!

The Mobile Hub is your PWA-optimized homepage for mobile devices, giving users quick access to share links, stats, and Oliver AI assistant.

---

## 📱 Access the Mobile Hub

**URL:** https://taxgeniuspro.tax/mobile-hub

**Who can access:** All logged-in users (role-based content)

---

## ✨ Features by Role

### Tax Preparers See:
- **Share Button: Tax Intake Form** - Share with clients to start filing
- **Share Button: Lead Generation Form** - Capture potential clients
- **Stats Dashboard:** Link clicks, forms started, forms completed
- **Oliver AI Chat** - Full-screen mobile chat for tax questions
- **Quick Links:** Dashboard, Settings, Help, Sign Out

### Affiliates See:
- **Share Button: Referral Link** - Earn commissions on referrals
- **Share Button: Custom Tracking Link** - Track campaigns
- **Stats Dashboard:** Link clicks, referrals, conversions, earnings
- **Oliver AI Chat** - Tax form assistant
- **Quick Links:** Dashboard, Settings, Help, Sign Out

### Clients See:
- **Tax Return Status Card** - Current status with badge
- **Documents Count** - Number of uploaded documents
- **Quick Actions:**
  - Upload Documents
  - Message Preparer
  - Refer & Earn
- **Stats Dashboard:** Documents, messages, status, referrals
- **Quick Links:** Dashboard, Settings, Help, Sign Out

---

## 🚀 Share Features

### Native Share API
- Tap "Share" button on any link card
- Choose from:
  - Native share (iOS/Android)
  - Copy to clipboard
  - SMS
  - WhatsApp
  - Email

### QR Code Generator
- Tap the QR code icon next to share button
- Instant QR code for in-person sharing
- Perfect for business cards, flyers, events

### Tracking
- Every share is tracked automatically
- View stats in real-time
- Analytics updated every 5 minutes

---

## 💬 Oliver AI Chat on Mobile

### Access Methods:
1. **Tap "Oliver" in bottom navigation** (mobile hub)
2. **Tap floating chat button** (all dashboard pages)
3. **Full-screen mode** on mobile devices
4. **Regular popup** on desktop

### Features:
- Full conversation history
- Form references as badges
- Mobile-optimized keyboard
- Swipe to close

---

## 📊 Stats Tracking

### What's Tracked:
- **Link Shares** - When you share a link
- **Link Clicks** - When someone clicks your link
- **Forms Started** - When forms are opened from your links
- **Forms Completed** - When forms are submitted
- **Conversions** - For affiliates (paid referrals)

### Stats Update:
- Real-time for shares
- Recalculated every 5 minutes
- Pull to refresh on mobile

---

## 🎨 Mobile Features

### Bottom Navigation:
- **Home** - Mobile hub
- **Dashboard** - Full dashboard
- **Oliver** - AI chat
- **Profile** - Settings

### PWA Features:
- **Add to Home Screen** - Install as app
- **Offline Capable** - (coming soon)
- **Push Notifications** - (coming soon)
- **Fast Loading** - Optimized for mobile

---

## 🔗 Shareable Links

### Tax Preparer Links:
```
Intake Form: https://taxgeniuspro.tax/start-filing?ref=USER_ID
Lead Form: https://taxgeniuspro.tax/contact?ref=USER_ID
```

### Affiliate Links:
```
Referral: https://taxgeniuspro.tax/ref/USER_ID
Tracking: https://taxgeniuspro.tax/?aff=USER_ID
```

### Custom Messages:
Each link type has pre-populated share messages optimized for conversion.

---

## 📈 Analytics Dashboard

### Database Tables:
- `mobile_hub_link_clicks` - Click tracking
- `mobile_hub_shares` - Share tracking
- `mobile_hub_stats` - Aggregated statistics

### API Endpoints:
- `GET /api/mobile-hub/stats` - Get your stats
- `GET /api/mobile-hub/preparer-links` - Get preparer links
- `GET /api/mobile-hub/affiliate-links` - Get affiliate links
- `GET /api/mobile-hub/client-status` - Get client status
- `POST /api/mobile-hub/track-share` - Track share event

---

## 🎯 Usage Tips

### For Tax Preparers:
1. Share intake link with ALL new clients
2. Use lead form for prospective clients
3. Generate QR code for in-person meetings
4. Track which links perform best

### For Affiliates:
1. Use referral link on social media
2. Use tracking link for paid ads
3. Monitor conversion rates
4. Share QR codes at events

### For Clients:
1. Upload documents immediately after filing
2. Check status regularly
3. Refer friends to earn rewards
4. Use Oliver AI for tax questions

---

## 🔒 Security & Privacy

- All links include unique user tracking IDs
- No PII shared in links
- Links expire after tax season (configurable)
- Analytics are private to each user
- GDPR compliant

---

## 📱 Installing as PWA

### iOS (Safari):
1. Open https://taxgeniuspro.tax
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"
5. Icon appears on home screen

### Android (Chrome):
1. Open https://taxgeniuspro.tax
2. Tap menu (3 dots)
3. Tap "Add to Home screen"
4. Tap "Add"
5. Icon appears on home screen

### Benefits:
- Launch like a native app
- No app store required
- Auto-updates
- Full-screen experience
- Fast loading

---

## 🐛 Troubleshooting

### Stats not updating?
- Pull to refresh
- Wait 5 minutes for recalculation
- Check internet connection

### Share button not working?
- Grant permissions for share/clipboard
- Try manual copy instead
- Check browser compatibility

### Oliver AI not responding?
- Check OpenAI API key is set
- Verify internet connection
- Try creating new conversation

### Links not tracking clicks?
- Ensure JavaScript is enabled
- Check cookie settings
- Verify tracking code is in URL

---

## 🚀 Future Enhancements

Coming soon:
- [ ] Offline mode
- [ ] Push notifications for new leads
- [ ] Advanced analytics dashboard
- [ ] Custom link customization
- [ ] Bulk share to multiple platforms
- [ ] Integration with CRM
- [ ] Automated follow-up messages
- [ ] A/B testing for share messages

---

## 📞 Support

**Issues?** Contact your system administrator

**Feature requests?** Submit via dashboard feedback

**Technical docs:** `/docs/MOBILE_HUB_TECHNICAL.md`

---

**Built with ❤️ for TaxGeniusPro Users**

Version: 1.0
Last Updated: October 23, 2025
Status: ✅ Live in Production
