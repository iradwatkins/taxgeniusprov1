\# Epic 2: The Referrer Engine & Gamification  
\*\*Goal:\*\* To build the complete, engaging, and rewarding experience for our 'Referrers', providing them with all the tools they need to be successful brand ambassadors, including vanity links, marketing tools, and gamified contests.

\---

\#\#\# Story 2.1: Referrer Dashboard & Analytics  
\*As a\* Referrer,  
\*I want\* to see a dashboard with my key performance stats like link clicks, sign-ups, completed returns, and earnings,  
\*so that\* I can track my success and motivation.  
\#\#\#\# Acceptance Criteria  
1\.  The Referrer Dashboard displays key statistics in clear, easy-to-read "stat cards".  
2\.  Statistics must include: Total Referrals, Completed Returns, and Contest Rank.  
3\.  A simple chart displays referral performance over the last 30 days.  
4\.  Data on the dashboard is refreshed upon login or with a manual refresh button.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Design and create the main \`ReferrerDashboard\` UI component.  
\- \[ \] Create a reusable \`StatCard\` component that accepts a title and a value.  
\- \[ \] Implement a backend endpoint (or Supabase function) to calculate and return a referrer's core statistics.  
\- \[ \] Implement a frontend service using React Query to fetch the dashboard data.  
\- \[ \] Integrate a lightweight charting library (e.g., Recharts) to display referral history.

\---

\#\#\# Story 2.2: Vanity Link Management  
\*As a\* Referrer,  
\*I want\* to create and manage my own custom vanity link (e.g., TaxGenius.com/MyName),  
\*so that\* I can have a professional, memorable link to share.  
\#\#\#\# Acceptance Criteria  
1\.  The dashboard has a section for vanity link management.  
2\.  An input field allows the user to suggest a custom URL path.  
3\.  The system checks if the path is available in real-time.  
4\.  Once set, the user's unique vanity link is displayed with a "copy to clipboard" button.  
5\.  A user can only set their vanity link once.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the UI component for vanity link creation within the dashboard.  
\- \[ \] Add a \`vanity\_slug\` column to the \`profiles\` table in the database, ensuring it is unique.  
\- \[ \] Create a secure backend endpoint (or Supabase function) that allows a user to claim a vanity slug.  
\- \[ \] Implement frontend logic to call the endpoint, provide real-time feedback on availability, and handle success/error states.  
\- \[ \] Implement the "copy to clipboard" functionality.

\---

\#\#\# Story 2.3: Marketing Materials Hub  
\*As a\* Referrer,  
\*I want\* to access a library of pre-made promotional materials (images, ad copy),  
\*so that\* I can market effectively and easily.  
\#\#\#\# Acceptance Criteria  
1\.  A dedicated "Marketing Hub" section is available on the Referrer Dashboard.  
2\.  The hub displays a gallery of approved ad images and corresponding text.  
3\.  Each marketing item has a one-click "Share to X/Twitter" and "Share to Facebook" button.  
4\.  Each marketing item has a "Copy Text" button for the ad copy.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the UI for the Marketing Hub, displaying items in a grid or list format.  
\- \[ \] Store placeholder marketing content (image URLs, text) in the Supabase database.  
\- \[ \] Create a backend endpoint to fetch the available marketing materials.  
\- \[ \] Implement frontend logic to display the materials.  
\- \[ \] Use a library like \`react-share\` or simple \`window.open\` calls to implement social sharing functionality.

\---

\#\#\# Story 2.4: QR Code Poster Generator  
\*As a\* Referrer,  
\*I want\* to generate a downloadable marketing poster with my unique QR code on it,  
\*so that\* I can promote the service offline in local businesses.  
\#\#\#\# Acceptance Criteria  
1\.  The user can select from at least two different poster design templates.  
2\.  The system generates a QR code that points to the user's unique referral link (or vanity link if set).  
3\.  The selected template is populated with the user's name and unique QR code.  
4\.  The final poster can be downloaded as a print-quality PDF file.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Design 2 simple poster templates using HTML and Tailwind CSS.  
\- \[ \] Install and configure a client-side QR code generation library (e.g., \`qrcode.react\`).  
\- \[ \] Install client-side PDF generation libraries (e.g., \`jspdf\` and \`html2canvas\`).  
\- \[ \] Create the UI for template selection.  
\- \[ \] Implement the logic to render the selected HTML template to an off-screen canvas, including the generated QR code.  
\- \[ \] Implement the button functionality to convert the canvas content into a downloadable PDF.

\---

\#\#\# Story 2.5: Gamified Contest & Leaderboard System  
\*As a\* Referrer,  
\*I want\* to view active contests and track my ranking on a leaderboard,  
\*so that\* I am motivated to participate and compete.  
\#\#\#\# Acceptance Criteria  
1\.  A "Contests" view displays the rules and duration for the current active contest(s) (e.g., "Most Completed Returns this Week").  
2\.  A leaderboard displays the Top 10 referrers for the active contest.  
3\.  If the logged-in user is on the leaderboard, their entry is highlighted.  
4\.  If the logged-in user is not in the Top 10, their current rank is displayed separately (e.g., "Your Rank: \#42").  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Design the database schema to store contest definitions and track user progress.  
\- \[ \] Create backend logic (e.g., a scheduled Supabase function) to calculate and store leaderboard rankings periodically.  
\- \[ \] Create a backend endpoint to fetch the current contest details and leaderboard data.  
\- \[ \] Create the UI components to display the contest rules and the leaderboard list.

\---

\#\#\# Story 2.6: Trip Reward Integration  
\*As a\* Referrer or Client who has earned a trip,  
\*I want\* the system to automatically notify me and provide clear instructions on how to claim my reward,  
\*so that\* the reward fulfillment process is seamless and exciting.  
\#\#\#\# Acceptance Criteria  
1\.  The system correctly identifies when a user has earned a trip reward (either via contest or post-filing).  
2\.  A notification is prominently displayed on the user's dashboard.  
3\.  The notification provides details about the trip and a "Claim Your Trip" button.  
4\.  Clicking the button initiates the fulfillment process with the third-party provider (MarketingBoost.com).  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Add a \`notifications\` table to the database.  
\- \[ \] Implement backend logic to create a notification when a trip reward condition is met.  
\- \[ \] Create a backend endpoint for fetching and marking notifications as "read" or "actioned".  
\- \[ \] Create a persistent notification UI element in the main dashboard layout.  
\- \[ \] Implement the "Claim Your Trip" button to make a server-side API call to the MarketingBoost.com API (using a placeholder for the actual API call until it is available).  
