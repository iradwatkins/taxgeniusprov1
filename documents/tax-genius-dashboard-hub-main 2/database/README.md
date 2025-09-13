# Tax Genius Database Setup

This directory contains the database schema and security policies for the Tax Genius PWA.

## Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Environment Variables**: Set up your `.env` file with Supabase credentials

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update `.env` with your Supabase project details:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Schema Setup

In your Supabase project dashboard:

1. **Go to SQL Editor**
2. **Run the migration files in order:**

#### Step 1: Create Profiles Table
```sql
-- Copy and paste contents of: database/migrations/001_create_profiles_table.sql
```

#### Step 2: Set Up Security Policies  
```sql
-- Copy and paste contents of: database/policies/002_profiles_rls_policies.sql
```

### 3. Authentication Configuration

In your Supabase dashboard:

1. **Go to Authentication → Settings**
2. **Configure Auth Providers:**
   - **Email**: Enable email/password authentication
   - **Magic Links**: Enable email magic links
   - **Google OAuth**: 
     - Enable Google provider
     - Add your Google OAuth credentials
     - Set redirect URLs: `http://localhost:8080/dashboard` (dev), `https://yourdomain.com/dashboard` (prod)

### 4. Test the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration:**
   - Go to `http://localhost:8080/login`
   - Try registering with different roles
   - Verify profiles are created in the database

3. **Test authentication methods:**
   - Email/password login
   - Magic link login
   - Google OAuth (if configured)

## Database Schema

### Tables

#### `public.profiles`
- **Purpose**: Stores user profile information and role assignments
- **Key Fields**:
  - `user_id`: References `auth.users.id`
  - `role`: User role (`client`, `referrer`, `preparer`)
  - `vanity_slug`: Custom URL for referrers (e.g., `TaxGenius.com/YourName`)
- **Security**: Row Level Security enabled, users can only access their own profiles

### Security Policies

- **User Access**: Users can view, insert, and update only their own profiles
- **Profile Protection**: Users cannot delete their profiles
- **Referrer Visibility**: Referrers can view other referrers' public data for leaderboards
- **Admin Access**: Service role has full access for administrative functions

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env` file exists and contains correct Supabase URL and anon key
   - Restart development server after adding environment variables

2. **Authentication not working**
   - Verify Supabase project is active
   - Check authentication settings in Supabase dashboard
   - Ensure redirect URLs are configured correctly

3. **Profile creation fails**
   - Verify the profiles table was created successfully
   - Check that RLS policies are applied correctly
   - Look for constraint violations in the Supabase logs

### Database Queries for Testing

```sql
-- View all profiles (as service role)
SELECT * FROM public.profiles;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- View current user's profile (as authenticated user)
SELECT * FROM public.profiles WHERE user_id = auth.uid();
```

## Next Steps

After database setup is complete, the application will support:

- ✅ User registration with role selection
- ✅ Secure authentication (email, magic link, Google)
- ✅ Profile management with role-based access
- ✅ Foundation for role-based dashboards (Story 1.4)

Continue with **Story 1.4: Role-Based Dashboard Shells** to implement the dashboard routing system.