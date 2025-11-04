-- GLI International Medical Formation Platform
-- Database Schema for PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSONB functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- Users Table (extends Supabase Auth)
-- ============================================
-- Note: Supabase Auth handles the main auth.users table
-- This table extends it with additional profile information

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for role-based queries
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON public.user_profiles(is_active);

-- ============================================
-- Formations Table
-- ============================================

CREATE TABLE public.formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Multilingual content stored as JSONB
    title JSONB NOT NULL, -- {"fr": "...", "en": "...", "ka": "..."}
    description JSONB NOT NULL,
    short_description JSONB NOT NULL,

    -- Pricing
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'GEL',

    -- Formation details
    duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,

    -- Media
    image_url TEXT,
    video_url TEXT,

    -- Additional metadata
    syllabus JSONB, -- Multilingual course syllabus
    prerequisites JSONB, -- Multilingual prerequisites
    learning_outcomes JSONB, -- Multilingual learning outcomes

    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,

    -- Tracking
    enrollment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.user_profiles(id),
    updated_by UUID REFERENCES public.user_profiles(id)
);

-- Indexes for formations
CREATE INDEX idx_formations_is_published ON public.formations(is_published);
CREATE INDEX idx_formations_category ON public.formations(category);
CREATE INDEX idx_formations_level ON public.formations(level);
CREATE INDEX idx_formations_created_at ON public.formations(created_at DESC);

-- Full-text search index for multilingual content
CREATE INDEX idx_formations_title_gin ON public.formations USING GIN (title);
CREATE INDEX idx_formations_description_gin ON public.formations USING GIN (description);

-- ============================================
-- Enrollments Table
-- ============================================

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Timestamps
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- Additional data
    notes TEXT,

    -- Unique constraint: user can only enroll once per formation
    UNIQUE(user_id, formation_id)
);

-- Indexes for enrollments
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_formation_id ON public.enrollments(formation_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_enrollments_enrolled_at ON public.enrollments(enrolled_at DESC);

-- ============================================
-- Payments Table
-- ============================================

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,

    -- Payment details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'GEL',

    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),

    -- Payment method
    payment_method TEXT NOT NULL DEFAULT 'bog' CHECK (payment_method IN ('bog', 'manual', 'free')),

    -- Bank of Georgia integration
    transaction_id TEXT UNIQUE,
    payment_url TEXT,
    bog_order_id TEXT,

    -- Callback data
    callback_data JSONB,
    error_message TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for payments
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_formation_id ON public.payments(formation_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- ============================================
-- Formation Categories Table
-- ============================================

CREATE TABLE public.formation_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- Multilingual category name
    slug TEXT UNIQUE NOT NULL,
    description JSONB,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_formation_categories_slug ON public.formation_categories(slug);
CREATE INDEX idx_formation_categories_is_active ON public.formation_categories(is_active);

-- ============================================
-- Formation Progress Table (for tracking lesson completion)
-- ============================================

CREATE TABLE public.formation_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL, -- Can reference a lessons table if you have one
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX idx_formation_progress_enrollment_id ON public.formation_progress(enrollment_id);

-- ============================================
-- Audit Log Table
-- ============================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'create', 'update', 'delete'
    entity_type TEXT NOT NULL, -- e.g., 'formation', 'user', 'payment'
    entity_id UUID,
    changes JSONB, -- Store old and new values
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================
-- Triggers for updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON public.formations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formation_categories_updated_at BEFORE UPDATE ON public.formation_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formation_progress_updated_at BEFORE UPDATE ON public.formation_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Supabase uses RLS for security

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Formations policies (public can view published formations)
CREATE POLICY "Anyone can view published formations"
    ON public.formations FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Admins can manage formations"
    ON public.formations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
    ON public.enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Formation categories (public read)
CREATE POLICY "Anyone can view active categories"
    ON public.formation_categories FOR SELECT
    USING (is_active = TRUE);

-- Progress tracking
CREATE POLICY "Users can view their own progress"
    ON public.formation_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE id = enrollment_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own progress"
    ON public.formation_progress FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE id = enrollment_id AND user_id = auth.uid()
        )
    );

-- ============================================
-- Initial Data / Seed Data
-- ============================================

-- Insert default formation categories
INSERT INTO public.formation_categories (name, slug, description) VALUES
    (
        '{"fr": "Implantologie", "en": "Implantology", "ka": "იმპლანტოლოგია"}',
        'implantology',
        '{"fr": "Formations en implantologie dentaire", "en": "Dental implantology training", "ka": "სტომატოლოგიური იმპლანტოლოგიის ტრენინგი"}'
    ),
    (
        '{"fr": "Orthodontie", "en": "Orthodontics", "ka": "ორთოდონტია"}',
        'orthodontics',
        '{"fr": "Formations en orthodontie", "en": "Orthodontics training", "ka": "ორთოდონტიის ტრენინგი"}'
    ),
    (
        '{"fr": "Chirurgie", "en": "Surgery", "ka": "ქირურგია"}',
        'surgery',
        '{"fr": "Formations en chirurgie dentaire", "en": "Dental surgery training", "ka": "სტომატოლოგიური ქირურგიის ტრენინგი"}'
    ),
    (
        '{"fr": "Médecine Générale", "en": "General Medicine", "ka": "ზოგადი მედიცინა"}',
        'general-medicine',
        '{"fr": "Formations en médecine générale", "en": "General medicine training", "ka": "ზოგადი მედიცინის ტრენინგი"}'
    );
