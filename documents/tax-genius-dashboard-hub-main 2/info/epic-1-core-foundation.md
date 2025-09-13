\# Epic 1: Core Platform Foundation & User Onboarding  
\*\*Goal:\*\* To establish the core technical foundation of the Tax Genius PWA, including a secure, multi-faceted authentication system, user profile management with role assignment, and basic dashboard shells for each user type.

\---

\#\#\# Story 1.1: PWA Project Initialization  
\*As a\* developer,  
\*I want\* to set up a new Vite PWA project with the necessary structure and bilingual framework,  
\*so that\* we have a clean, stable foundation to build all future features upon.  
\#\#\#\# Acceptance Criteria  
1\.  A new project is created using the Vite PWA template.  
2\.  A basic file structure for components, views, and services is established, following the architecture document.  
3\.  An internationalization (i18n) library is installed and configured for English and Spanish.  
4\.  The PWA is installable on a mobile device and passes basic Lighthouse checks for PWA criteria.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Initialize a new Vite project with the React \+ TypeScript template.  
\- \[ \] Add and configure the \`vite-plugin-pwa\` module according to the Vite PWA documentation.  
\- \[ \] Create initial directories: \`/src/components/ui\`, \`/src/features\`, \`/src/lib\`, \`/src/routes\`, \`/src/services\`.  
\- \[ \] Install \`i18next\` and \`react-i18next\`.  
\- \[ \] Configure \`i18next\` with initial \`en.json\` and \`es.json\` resource files in the \`/public/locales\` directory.  
\- \[ \] Create a basic "App" component that displays a translated string to verify i18n is working.  
\- \[ \] Verify the PWA installation prompt appears on supported browsers and that the service worker is registered.

\---

\#\#\# Story 1.2: Universal Registration & Login System  
\*As a\* new user,  
\*I want\* to register and log in securely using my choice of email/password, a magic link, or my Google account,  
\*so that\* I can access the platform conveniently.  
\#\#\#\# Acceptance Criteria  
1\.  Registration flow captures user details (name, email, password) and allows for traditional password creation.  
2\.  Users can log in using their email and password.  
3\.  Users can request a one-time magic link sent to their email to log in without a password.  
4\.  Users can sign up and log in using Google OAuth.  
5\.  A secure JWT-based method manages sessions for all login types, using Supabase Auth.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the UI for the main login/registration page with separate components for all three methods.  
\- \[ \] Implement the backend logic using Supabase Auth for creating a user with email and password.  
\- \[ \] Implement the Supabase Auth logic to generate and email a single-use magic link token.  
\- \[ \] Integrate Supabase's Google OAuth 2.0 provider for user registration and login.  
\- \[ \] Implement frontend logic to handle the session object provided by the Supabase client library.  
\- \[ \] Implement logic to attach the Supabase JWT to API requests made to any custom backend services.

\---

\#\#\# Story 1.3: User Profile & Role Management  
\*As a\* user,  
\*I want\* to have a profile where my role (Client, Referrer, or Preparer) is stored,  
\*so that\* the system can provide me with the correct experience.  
\#\#\#\# Acceptance Criteria  
1\.  Upon first registration, a user must select a primary role (Client, Referrer, or Preparer).  
2\.  The selected role is associated with the user's profile in the database (e.g., in a \`profiles\` table linked to the \`auth.users\` table).  
3\.  An API endpoint or client-side service exists to fetch the logged-in user's profile, including their role.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Add a "Role Selection" step to the registration UI component.  
\- \[ \] Create a \`profiles\` table in Supabase with a \`user\_id\` (foreign key to \`auth.users.id\`) and a \`role\` column.  
\- \[ \] Write a Supabase database function or client-side logic that inserts a new row into \`profiles\` upon successful user registration.  
\- \[ \] On the frontend, create a global state or context (using React Context) to store user profile information (including role) after login.

\---

\#\#\# Story 1.4: Role-Based Dashboard Shells  
\*As a\* logged-in user,  
\*I want\* to be directed to a dashboard shell that recognizes my role,  
\*so that\* I have a starting point for my specific journey.  
\#\#\#\# Acceptance Criteria  
1\.  After login, the system redirects the user to a unique URL path (e.g., \`/app/client\`, \`/app/referrer\`, \`/app/preparer\`).  
2\.  A basic dashboard shell with a unique title (e.g., "Client Dashboard") is displayed for each role.  
3\.  The main navigation menu shows different options based on the user's role.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Implement client-side routing using \`react-router-dom\`.  
\- \[ \] Create three basic placeholder components: \`ClientDashboard\`, \`ReferrerDashboard\`, \`PreparerDashboard\`.  
\- \[ \] Implement a protected routing mechanism that reads the user's role from the global state and renders the correct dashboard component.  
\- \[ \] Create a \`Navbar\` component that conditionally renders different sets of links based on the user's role.  
