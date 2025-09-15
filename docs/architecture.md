

\#\#\# \`architecture.md\`

\`\`\`\`markdown  
\# Tax Genius Architecture Document

\#\# 1\. Introduction

This document outlines the overall project architecture for the Tax Genius platform, including the frontend application, backend services, and core technology stack. Its primary goal is to serve as the guiding architectural blueprint for development, ensuring consistency and adherence to the chosen patterns and technologies outlined in the PRD and Technical Preferences.

\#\# 2\. High-Level Overview

The Tax Genius platform will be developed using a \*\*Polyrepo approach\*\*, with two primary repositories to start: one for the frontend application and one for any potential custom backend services.

The core service architecture is \*\*Backend-as-a-Service (BaaS)-first\*\*, leveraging \*\*Supabase\*\* for its integrated PostgreSQL database, authentication, object storage, and serverless functions. This approach maximizes development speed and reduces infrastructure management overhead. Any complex business logic not suitable for serverless functions will be built as a separate, modular monolith service.

\`\`\`mermaid  
graph TD  
    subgraph "User Devices"  
        A\[Browser on Mobile/Desktop\]  
    end

    subgraph "Frontend Repository (Vercel/Netlify)"  
        B(React/Vite PWA)  
    end

    subgraph "Backend-as-a-Service"  
        C(Supabase)  
        C \--- C1(Auth)  
        C \--- C2(PostgreSQL DB)  
        C \--- C3(Storage)  
        C \--- C4(Edge Functions)  
    end  
      
    subgraph "Custom Backend Repo (Optional)"  
        D(Node.js/Express Service)  
    end

    A \-- Interacts with \--\> B  
    B \-- Calls API / Connects to \--\> C  
    B \-- Calls API (if needed) \--\> D  
    D \-- Interacts with \--\> C  
\`\`\`\`

\#\# 3\\. Project Structure (Polyrepo)

\#\#\#\# 3.1. Frontend Repository (\`tax-genius-frontend\`)

This repository contains the Vite \+ React PWA.

\`\`\`plaintext  
/  
├── public/  
├── src/  
│   ├── components/  
│   │   ├── core/         \# Foundational, unstyled logic (e.g., from Radix)  
│   │   └── ui/           \# Styled components using shadcn/ui pattern  
│   ├── core/  
│   │   ├── hooks/  
│   │   └── providers/  
│   ├── features/         \# Feature-based modules (e.g., auth, referrals)  
│   ├── lib/              \# Utility functions (e.g., date-fns, clsx)  
│   ├── routes/           \# Route components for React Router  
│   └── services/         \# Data fetching logic (e.g., React Query hooks)  
├── .eslintrc.cjs  
├── .gitignore  
├── index.html  
├── package.json  
├── postcss.config.js  
├── tailwind.config.js  
└── vite.config.ts  
\`\`\`

\#\#\#\# 3.2. Custom Backend Repository (\`tax-genius-backend\` \- if needed)

This repository contains the Node.js/Express modular monolith.

\`\`\`plaintext  
/  
├── src/  
│   ├── api/              \# Route definitions  
│   ├── config/           \# Environment config  
│   ├── core/             \# Core business logic  
│   ├── middleware/       \# Express middleware  
│   └── services/         \# Services connecting to Supabase or other APIs  
├── test/  
├── .gitignore  
├── package.json  
└── tsconfig.json  
\`\`\`

\#\# 4\\. Definitive Tech Stack Selections

This table represents the single source of truth for the technology stack, based on the provided technical preferences.

| Category | Technology | Version / Details | Purpose |  
| :--- | :--- | :--- | :--- |  
| \*\*Framework (Frontend)\*\* | React | Latest Stable | Primary UI Framework |  
| \*\*Build Tool (Frontend)\*\* | Vite | Latest Stable | Dev Server & Build Tool |  
| \*\*Language\*\* | TypeScript | Latest Stable | For both Frontend & Backend |  
| \*\*Backend-as-a-Service\*\*| Supabase | Cloud Hosted | Auth, Database (Postgres), Storage, Functions |  
| \*\*Framework (Backend)\*\* | Node.js w/ Express.js | Latest LTS | For custom backend services, if needed |  
| \*\*Styling\*\* | Tailwind CSS | Latest Stable | Utility-First CSS Framework |  
| \*\*UI Components\*\* | Shadcn/UI & Radix UI | Latest Stable | Accessible, unstyled component primitives |  
| \*\*Icons\*\* | Lucide React | Latest Stable | Icon Library |  
| \*\*Routing (Frontend)\*\* | React Router DOM | Latest Stable | Client-Side Routing |  
| \*\*Server State\*\* | React Query | Latest Stable | Data Fetching, Caching, Server State |  
| \*\*Form State\*\* | React Hook Form | Latest Stable | Form State Management |  
| \*\*Client State\*\* | React Context / Zustand | Latest Stable | Global Client-Side State |  
| \*\*Schema Validation\*\* | Zod | Latest Stable | Data Validation |  
| \*\*Testing\*\* | Vitest & React Testing Library | Latest Stable | Unit/Integration Testing |  
| \*\*E2E Testing\*\* | Playwright / Cypress | Latest Stable | End-to-End Testing |  
| \*\*CI/CD\*\* | GitHub Actions | N/A | Continuous Integration & Deployment |  
| \*\*Hosting (Frontend)\*\* | Vercel / Netlify | N/A | Frontend Hosting Platform |

\#\# 5\\. API Design

The primary API will be provided by the \*\*Supabase\*\* client library for database operations, authentication, and storage. All interactions should utilize the Supabase JS library according to its documentation.

Any custom backend services created in the backend repository must expose a \*\*RESTful API\*\* with clear versioning (e.g., \`/api/v1/...\`).

\#\# 6\\. Infrastructure and Deployment

  \* \*\*Frontend:\*\* The Vite PWA will be deployed via a CI/CD pipeline using \*\*GitHub Actions\*\* to a modern hosting platform like \*\*Vercel or Netlify\*\*. These platforms will handle build, deployment, and CDN distribution.  
  \* \*\*Backend:\*\* The backend is managed by \*\*Supabase\*\*. Any serverless functions will be deployed via the Supabase CLI, integrated into a GitHub Actions workflow. Custom Node.js services, if built, will be containerized using Docker and deployed to a suitable cloud environment.

\#\# 7\\. Testing Strategy

  \* \*\*Unit/Integration:\*\* Frontend components and logic will be tested using \*\*Vitest\*\* and \*\*React Testing Library\*\*.  
  \* \*\*End-to-End (E2E):\*\* Key user flows will be tested using \*\*Playwright or Cypress\*\*.  
  \* \*\*Code Quality:\*\* Code will be statically analyzed and formatted using \*\*ESLint and Prettier\*\*.

\<\!-- end list \--\>

\`\`\`  
\*\*\*  
