# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: This project operates in PRODUCTION MODE ONLY**

- **Start development server**: `npm run dev` (runs on localhost:8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

**Database Configuration**: Uses production Supabase instance only - no development/staging environments.

## Tech Stack & Architecture

This is a React TypeScript application built with Vite, using shadcn/ui components and Tailwind CSS. The project follows a modern React architecture with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query for server state, localStorage for auth
- **Routing**: React Router DOM with role-based routing
- **Forms**: React Hook Form with Zod validation

## Project Structure

- `src/pages/` - Main application pages with role-based dashboards
- `src/components/ui/` - Reusable shadcn/ui components
- `src/components/` - Custom application components (Sidebar, StatCard)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions (primarily utils.ts for cn() helper)

## Role-Based Dashboard System

The application implements a multi-role dashboard system:

1. **Authentication Flow**: Users select role on login, stored in localStorage
2. **Role Types**: `client`, `referrer`, `preparer` (defined in Sidebar.tsx:20)
3. **Dashboard Routing**: Main Dashboard component (Dashboard.tsx) routes to role-specific dashboards
4. **Navigation**: Sidebar component dynamically generates navigation based on user role

## Key Configuration

- **Path Aliases**: `@/` maps to `src/` directory
- **Port**: Development server runs on port 8080
- **TypeScript**: Relaxed config with noImplicitAny: false and strictNullChecks: false
- **ESLint**: Standard React/TypeScript rules with unused vars disabled
- **Lovable Integration**: Uses lovable-tagger for development mode component tagging

## Component Patterns

- shadcn/ui components are used throughout for consistent design
- Custom components follow the shadcn pattern with forwardRef and className merging
- Role-based conditional rendering is handled in the Sidebar component
- React Query is set up globally in App.tsx for data fetching