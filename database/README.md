# Database Documentation

## Overview

The GLI International platform uses **PostgreSQL** via **Supabase**, which provides:
- Managed PostgreSQL database
- Built-in authentication (Supabase Auth)
- Row Level Security (RLS)
- File storage
- Real-time subscriptions
- RESTful API

## Database Schema

### Core Tables

#### 1. user_profiles
Extends Supabase's `auth.users` table with additional profile information.

**Columns:**
- `id` (UUID, PK) - References auth.users
- `full_name` (TEXT)
- `phone` (TEXT)
- `bio` (TEXT)
- `avatar_url` (TEXT)
- `role` (TEXT) - 'user', 'admin', or 'super_admin'
- `is_active` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

#### 2. formations
Stores all training courses with multilingual support.

**Columns:**
- `id` (UUID, PK)
- `title` (JSONB) - Multilingual: {"fr": "...", "en": "...", "ka": "..."}
- `description` (JSONB) - Multilingual
- `short_description` (JSONB) - Multilingual
- `price` (DECIMAL)
- `currency` (TEXT) - Default: 'GEL'
- `duration_hours` (INTEGER)
- `level` (TEXT) - 'beginner', 'intermediate', 'advanced'
- `category` (TEXT)
- `image_url` (TEXT)
- `video_url` (TEXT)
- `syllabus` (JSONB) - Multilingual
- `prerequisites` (JSONB) - Multilingual
- `learning_outcomes` (JSONB) - Multilingual
- `is_published` (BOOLEAN)
- `published_at` (TIMESTAMP)
- `enrollment_count` (INTEGER)
- `view_count` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)
- `created_by`, `updated_by` (UUID) - References user_profiles

#### 3. enrollments
Tracks user enrollments in formations.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References user_profiles
- `formation_id` (UUID, FK) - References formations
- `status` (TEXT) - 'pending', 'active', 'completed', 'cancelled'
- `progress` (INTEGER) - 0-100
- `enrolled_at` (TIMESTAMP)
- `started_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)
- `cancelled_at` (TIMESTAMP)
- `notes` (TEXT)

**Constraints:**
- UNIQUE(user_id, formation_id) - User can only enroll once per formation

#### 4. payments
Tracks all payment transactions.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References user_profiles
- `formation_id` (UUID, FK) - References formations
- `enrollment_id` (UUID, FK) - References enrollments
- `amount` (DECIMAL)
- `currency` (TEXT)
- `status` (TEXT) - 'pending', 'processing', 'completed', 'failed', 'refunded'
- `payment_method` (TEXT) - 'bog', 'manual', 'free'
- `transaction_id` (TEXT, UNIQUE) - From Bank of Georgia
- `payment_url` (TEXT)
- `bog_order_id` (TEXT)
- `callback_data` (JSONB)
- `error_message` (TEXT)
- `created_at`, `updated_at`, `completed_at`, `failed_at` (TIMESTAMP)

#### 5. formation_categories
Organizes formations into categories.

**Columns:**
- `id` (UUID, PK)
- `name` (JSONB) - Multilingual
- `slug` (TEXT, UNIQUE)
- `description` (JSONB) - Multilingual
- `icon` (TEXT)
- `order_index` (INTEGER)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

#### 6. formation_progress
Tracks detailed progress within formations (lesson-level).

**Columns:**
- `id` (UUID, PK)
- `enrollment_id` (UUID, FK) - References enrollments
- `lesson_id` (TEXT)
- `status` (TEXT) - 'not_started', 'in_progress', 'completed'
- `time_spent_seconds` (INTEGER)
- `completed_at` (TIMESTAMP)
- `created_at`, `updated_at` (TIMESTAMP)

#### 7. audit_logs
Tracks all important actions for security and compliance.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References user_profiles
- `action` (TEXT) - 'create', 'update', 'delete'
- `entity_type` (TEXT) - 'formation', 'user', 'payment', etc.
- `entity_id` (UUID)
- `changes` (JSONB) - Old and new values
- `ip_address` (INET)
- `user_agent` (TEXT)
- `created_at` (TIMESTAMP)

## Multilingual Content

All user-facing content is stored in JSONB format with language codes:

```json
{
  "fr": "Texte en français",
  "en": "Text in English",
  "ka": "ტექსტი ქართულად"
}
```

This approach allows:
- Easy addition of new languages
- Efficient querying with GIN indexes
- Flexible content structure
- Single source of truth

## Row Level Security (RLS)

Supabase RLS policies ensure data security:

### User Profiles
- Users can view and update their own profile
- Admins can view all profiles

### Formations
- Anyone can view published formations
- Only admins can create/update/delete formations

### Enrollments
- Users can only view and create their own enrollments
- Admins can view all enrollments

### Payments
- Users can only view their own payments
- Admins can view all payments

### Progress Tracking
- Users can only view and update their own progress

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Run Schema Migration

```bash
# Option 1: Using Supabase SQL Editor
# Copy contents of schema.sql and paste into Supabase SQL Editor
# Execute the SQL

# Option 2: Using psql (if you have direct access)
psql -h your-db-host -U postgres -d postgres -f database/schema.sql
```

### 3. Configure Authentication Providers

In your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Email authentication
3. Enable Google OAuth:
   - Add Google Client ID and Secret
   - Configure redirect URLs
4. Enable Apple OAuth:
   - Add Apple credentials
   - Configure redirect URLs

### 4. Set up Storage Buckets

Create storage buckets for media:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('formations', 'formations', true),
  ('profiles', 'profiles', true),
  ('content', 'content', true);

-- Set up RLS policies for storage
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('formations', 'profiles', 'content'));

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('formations', 'profiles', 'content')
  AND auth.role() = 'authenticated'
);
```

## Indexes

The schema includes indexes on:
- Foreign keys (for JOIN performance)
- Status fields (for filtering)
- Timestamps (for sorting)
- JSONB fields (GIN indexes for multilingual content search)

## Triggers

Auto-updating triggers are set up for:
- `updated_at` timestamp on all tables
- Future: Enrollment count update on formations
- Future: Progress calculation on enrollments

## Backup and Maintenance

### Supabase Automatic Backups
- Daily automatic backups (on paid plans)
- Point-in-time recovery available

### Manual Backup
```bash
# Backup entire database
pg_dump -h your-db-host -U postgres -F c -b -v -f backup_$(date +%Y%m%d).backup postgres

# Restore from backup
pg_restore -h your-db-host -U postgres -d postgres -v backup_20240101.backup
```

## Migration Strategy

For future schema changes:

1. Create a new migration file in `database/migrations/`
2. Name it with timestamp: `YYYYMMDD_description.sql`
3. Test on development database
4. Apply to production via Supabase dashboard

Example migration file:
```sql
-- database/migrations/20250102_add_formation_ratings.sql
CREATE TABLE public.formation_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID NOT NULL REFERENCES public.formations(id),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns are indexed
2. **JSONB**: GIN indexes enable fast full-text search on multilingual content
3. **Partitioning**: Consider partitioning audit_logs table if it grows large
4. **Connection Pooling**: Use Supabase's built-in connection pooling

## Security Best Practices

1. Always use RLS policies
2. Never expose service role key on frontend
3. Use anon key for public access
4. Validate all user input in backend
5. Use prepared statements to prevent SQL injection
6. Regularly audit the audit_logs table

## Monitoring

Monitor these metrics:
- Database size
- Query performance (slow queries)
- Connection count
- RLS policy effectiveness
- Storage usage

Supabase provides built-in monitoring in the dashboard.
