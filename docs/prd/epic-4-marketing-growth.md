\# Epic 4: Marketing & Growth Implementation  
\*\*Goal:\*\* To deploy the large-scale, public-facing marketing assets required to drive lead generation for all target segments, including the AI-powered landing page system and the e-commerce store.

\---

\#\#\# Story 4.1: AI Content Agent for Landing Pages  
\*As a\* marketing manager,  
\*I want\* to use an internal tool powered by an AI agent to generate SEO-optimized content, including Q\&A accordions, for our localized landing pages,  
\*so that\* we can scale our content creation efficiently and maintain high quality.  
\#\#\#\# Acceptance Criteria  
1\.  An internal, password-protected admin view exists for content generation.  
2\.  The interface allows the user to input a target city and keywords (e.g., "tax preparer jobs atlanta").  
3\.  The tool makes an API call to a large language model (like Gemini or Claude) with a structured prompt.  
4\.  The AI-generated content is returned and displayed in a text editor for review and approval.  
5\.  The AI is prompted to create a set of relevant questions and answers, which are formatted into an accordion component.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create a new protected route and view for the "AI Content Generation" tool.  
\- \[ \] Design the UI with input fields for city, keywords, and a "Generate" button.  
\- \[ \] Implement a secure backend function (e.g., Supabase Edge Function) that takes the inputs and makes an API call to the chosen LLM.  
\- \[ \] Develop a robust prompt template that instructs the AI on tone, structure, SEO best practices, and the Q\&A accordion format.  
\- \[ \] Implement the frontend logic to display the generated text and allow it to be copied or saved to the landing page database.  
\- \[ \] Create the accordion UI component using \`shadcn/ui\`.

\---

\#\#\# Story 4.2: Dynamic Landing Page System  
\*As a\* developer,  
\*I want\* to build a system that can generate over 200 unique, localized landing pages from a single template and a data source,  
\*so that\* we can efficiently target specific cities and keywords for our SEO strategy.  
\#\#\#\# Acceptance Criteria  
1\.  A single, reusable landing page template component is created in React.  
2\.  The application routing is configured to handle dynamic slugs, such as \`/locations/:city\`.  
3\.  The content for each page (headings, text, images, Q\&A) is fetched from a database based on the URL slug.  
4\.  The page's HTML metadata (title tag, meta description) is also dynamically populated for SEO.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create a new database table in Supabase to store the content for each landing page, including a \`slug\` column for the city.  
\- \[ \] Build a generic \`LandingPage\` component in React that accepts content as props.  
\- \[ \] Configure \`react-router-dom\` to include a route like \`/locations/:city\`.  
\- \[ \] In the page component for that route, use React Query to fetch the content from the database based on the \`:city\` URL parameter.  
\- \[ \] Use a library like \`react-helmet-async\` to dynamically update the page's \`\<head\>\` with the fetched SEO metadata.

\---

\#\#\# Story 4.3: Merchandise E-commerce Store  
\*As a\* Referrer or Preparer,  
\*I want\* to browse and purchase branded merchandise like T-shirts and business cards from a simple storefront on the platform,  
\*so that\* I can represent the Tax Genius brand.  
\#\#\#\# Acceptance Criteria  
1\.  A dedicated "Store" page displays a list of available products with images, names, and prices.  
2\.  Users can add items to a simple shopping cart.  
3\.  The cart view displays the selected items and a total price.  
4\.  A "Checkout" button redirects the user to a third-party payment processor (e.g., Stripe Checkout or PayPal) to handle the transaction. The MVP does not require a fully integrated, custom checkout flow.  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create a \`products\` table in the database with item details.  
\- \[ \] Build the \`StorePage\` UI to fetch and display products.  
\- \[ \] Create a \`ProductCard\` component.  
\- \[ \] Implement a simple client-side cart using React Context or Zustand to manage state.  
\- \[ \] Build the \`CartView\` component.  
\- \[\_Stretch\_\] Create a backend function to securely generate a checkout session with a payment provider like Stripe when the user clicks "Checkout".

\---

\#\#\# Story 4.4: Tax Genius Academy Foundation  
\*As a\* new preparer,  
\*I want\* to access a basic portal for the "Tax Genius Academy,"  
\*so that\* I can find initial training materials and see my certification status.  
\#\#\#\# Acceptance Criteria  
1\.  A protected route (e.g., \`/app/academy\`) is accessible only to users with a "Preparer" or "Trainee" role.  
2\.  The page displays a list of available training resources (e.g., links to PDFs, video tutorials).  
3\.  The page clearly displays the user's current certification status (e.g., "Trainee," "Certified").  
\#\#\#\# Tasks / Subtasks  
\- \[ \] Create the UI for the \`AcademyDashboard\` component.  
\- \[ \] Implement the protected route to restrict access.  
\- \[ \] Create a \`training\_materials\` table and a \`preparer\_progress\` table in the database.  
\- \[ \] Implement the frontend logic to fetch and display the list of materials.  
\- \[ \] Implement the logic to fetch and display the user's status from their profile.  
