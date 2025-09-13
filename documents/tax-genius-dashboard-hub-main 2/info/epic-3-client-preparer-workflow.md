\# Epic 3: Client & Preparer Core Workflow  
\*\*Goal:\*\* To create a seamless and efficient workflow for clients to submit their tax information and for preparers to manage that information, reinforcing the "silent partner" communication strategy.

\---

\#\#\# Story 3.1: Client Document Submission Questionnaire  
\*As a\* Client,  
\*I want\* to follow a step-by-step questionnaire to enter my tax information and securely upload my ID and other documents,  
\*so that\* the process is simple, clear, and I can provide everything my preparer needs.  
\#\#\#\# Acceptance Criteria  
1\.  The client dashboard presents a clear starting point for the tax questionnaire.  
2\.  The questionnaire is broken into logical sections (e.g., Personal Info, Income, Deductions).  
3\.  The form supports various input types, including text fields, dropdowns, and checkboxes.  
4\.  A secure file upload component allows users to upload ID cards and other necessary documents.  
5\.  The user's progress through the questionnaire is saved automatically at each step.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Design and build the multi-step UI for the questionnaire using a state-driven approach.  
\- \[ \] Create reusable, styled input components (text, dropdown, etc.) using \`shadcn/ui\` and \`react-hook-form\`.  
\- \[ \] Implement a file upload component that securely uploads files to Supabase Storage.  
\- \[ \] Create a backend endpoint (or Supabase function) to receive and save questionnaire data to the database, associated with the correct user.  
\- \[ \] Implement frontend logic to automatically save form data upon navigating between steps.

\---

\#\#\# Story 3.2: Two-Step Lead Form Flow  
\*As a\* new prospect from a marketing page,  
\*I want\* to fill out a short lead-gen form first,  
\*so that\* I can express interest without committing to the full tax form immediately.  
\#\#\#\# Acceptance Criteria  
1\.  A simple lead-gen form (e.g., Name, Email, Phone) is displayed on marketing landing pages.  
2\.  Upon submission, the lead's information is saved to the database.  
3\.  The user is redirected to a "Thank You" page that encourages them to proceed to the full questionnaire.  
4\.  If the user proceeds, their lead information is pre-filled in the full questionnaire.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the simple lead-gen UI component.  
\- \[ \] Create a \`leads\` table in the database.  
\- \[ \] Create a public backend endpoint to insert data into the \`leads\` table.  
\- \[ \] Create the "Thank You" UI view.  
\- \[ \] Implement the logic to pass the lead's ID or data to the main questionnaire to pre-populate the fields.

\---

\#\#\# Story 3.3: Preparer Client & Document Portal  
\*As a\* Tax Preparer,  
\*I want\* a secure portal where I can see my list of assigned clients and easily access the documents they have submitted,  
\*so that\* I can begin my work efficiently.  
\#\#\#\# Acceptance Criteria  
1\.  The Preparer Dashboard displays a list of all clients assigned to the logged-in preparer.  
2\.  The list shows the client's name and the status of their submission (e.g., "Incomplete," "Ready for Review").  
3\.  Clicking on a client opens a detailed view of their submitted questionnaire data.  
4\.  The detailed view contains secure, accessible links to all documents uploaded by the client.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the UI for the preparer dashboard, including a client list component.  
\- \[ \] Create a backend endpoint that fetches clients only for the authenticated and authorized preparer.  
\- \[ \] Create the "Client Detail" view component to display the submitted data.  
\- \[ \] Implement logic to generate secure, time-limited download URLs for documents stored in Supabase Storage.  
\- \[ \] Ensure Supabase Row Level Security (RLS) is enabled so preparers can only access their own assigned clients' data.

\---

\#\#\# Story 3.4: "Silent Partner" Automated Emails  
\*As a\* Tax Preparer,  
\*I want\* the system to automatically send key communications to my clients on my behalf,  
\*so that\* my clients feel informed and I save time.  
\#\#\#\# Acceptance Criteria  
1\.  An automated email is sent to the client when their submission is complete ("Documents Received").  
2\.  An automated email is sent when the preparer marks the return as "Filed".  
3\.  The "From" name and signature in the email dynamically use the assigned preparer's name.  
4\.  The email content clearly identifies the preparer as being "from Tax Genius."  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Configure a transactional email service (e.g., Supabase's integration with Twilio SendGrid).  
\- \[ \] Create HTML email templates for each communication type.  
\- \[ \] Implement backend database triggers or functions that are invoked when a submission status changes.  
\- \[ \] The trigger logic must fetch the assigned preparer's details to populate the email template.  
\- \[ \] Test the email sending flow thoroughly.

\---

\#\#\# Story 3.5: Post-Filing Referral Invitation  
\*As a\* Client who just completed their return,  
\*I want\* to receive an automated invitation to the referral program,  
\*so that\* I can easily become a Referrer.  
\#\#\#\# Acceptance Criteria  
1\.  After a preparer marks a client's return as "Filed," an automated email is triggered.  
2\.  The email clearly explains the referral program's benefits, including cash and trip rewards.  
3\.  The email contains a unique link or button that takes the client to the referrer sign-up page.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Implement the "Mark as Filed" status change functionality in the preparer portal.  
\- \[ \] Use the status change as a trigger for the referral invitation email.  
\- \[ \] Create the referral invitation email template.  
\- \[ \] Ensure the link in the email directs the user to the correct page within the PWA to sign up as a Referrer.  
