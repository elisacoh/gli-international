# System Architecture

## Overview

GLI International is a multilingual e-learning platform built with a modern, scalable architecture. The system follows a **client-server architecture** with clear separation between frontend, backend, and data layers.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │         │
│  │   Browser    │  │   Browser    │  │   Browser    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js App)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Server-Side Rendering (SSR)                           │  │
│  │  • Static Site Generation (SSG)                          │  │
│  │  • Client-Side Rendering (CSR)                           │  │
│  │  • Internationalization (next-intl)                      │  │
│  │  • Authentication (Supabase Auth)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
              │                              │
              │ REST API                     │ Direct (Supabase Client)
              ▼                              ▼
┌──────────────────────────┐   ┌────────────────────────────────┐
│   Backend (FastAPI)      │   │     Supabase Services          │
│  ┌────────────────────┐  │   │  ┌──────────────────────────┐ │
│  │  API Endpoints     │  │   │  │  Authentication          │ │
│  │  • Auth            │  │   │  │  • Email                 │ │
│  │  • Formations      │  │   │  │  • Google OAuth          │ │
│  │  • Users           │  │   │  │  • Apple OAuth           │ │
│  │  • Admin           │  │   │  └──────────────────────────┘ │
│  │  • Payments        │  │   │  ┌──────────────────────────┐ │
│  └────────────────────┘  │   │  │  PostgreSQL Database     │ │
│  ┌────────────────────┐  │   │  │  • RLS enabled           │ │
│  │  Business Logic    │  │   │  │  • Auto-backups          │ │
│  │  • Services        │  │   │  └──────────────────────────┘ │
│  │  • Validation      │  │   │  ┌──────────────────────────┐ │
│  │  • Authorization   │  │   │  │  Storage                 │ │
│  └────────────────────┘  │   │  │  • Images                │ │
│  ┌────────────────────┐  │   │  │  • Videos                │ │
│  │  Integrations      │  │   │  │  • Documents             │ │
│  │  • BOG Payment API │  │   │  └──────────────────────────┘ │
│  │  • Email Service   │  │   │                                │
│  └────────────────────┘  │   └────────────────────────────────┘
└──────────────────────────┘
              │
              │ HTTPS
              ▼
┌────────────────────────────────────────┐
│    External Services                    │
│  ┌──────────────────────────────────┐  │
│  │  Bank of Georgia Payment API     │  │
│  │  • OAuth2 / Basic Auth           │  │
│  │  • Payment Processing            │  │
│  │  • Webhooks                      │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

## Component Details

### Frontend Layer (Next.js)

**Technology:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- next-intl for i18n

**Key Features:**
1. **Server-Side Rendering (SSR)**
   - Dynamic pages rendered on server
   - Better SEO for formation listings
   - Faster initial page load

2. **Static Site Generation (SSG)**
   - Pre-render public pages at build time
   - Reduced server load
   - Ultra-fast page delivery via CDN

3. **Client-Side Rendering (CSR)**
   - Interactive components
   - Real-time updates
   - Rich user interactions

4. **Internationalization**
   - URL-based locale routing (`/fr/`, `/en/`, `/ka/`)
   - Automatic locale detection
   - Translation management via JSON files

5. **Authentication**
   - Supabase Auth integration
   - Social login (Google, Apple)
   - Session management
   - Protected routes

**Folder Structure:**
```
frontend/src/
├── app/
│   └── [locale]/          # Internationalized routes
│       ├── (auth)/        # Auth pages (login, register)
│       ├── (public)/      # Public pages
│       ├── (protected)/   # Protected pages (requires auth)
│       └── admin/         # Admin dashboard
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── styles/                # Global styles
```

### Backend Layer (FastAPI)

**Technology:**
- Python 3.11+
- FastAPI (async framework)
- SQLAlchemy (ORM)
- Pydantic (validation)
- Alembic (migrations)

**Key Features:**
1. **RESTful API**
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - JSON request/response
   - Automatic API documentation (Swagger/ReDoc)

2. **Authentication & Authorization**
   - JWT token validation
   - Role-based access control (RBAC)
   - Supabase token verification

3. **Business Logic**
   - Formation management
   - Enrollment processing
   - Payment handling
   - User management

4. **Payment Integration**
   - Bank of Georgia API client
   - OAuth2 / Basic Auth
   - Webhook handling
   - Transaction logging

**Folder Structure:**
```
backend/app/
├── api/
│   └── v1/
│       ├── endpoints/     # API route handlers
│       └── deps.py        # Dependencies (auth, db)
├── core/                  # Core functionality
│   ├── config.py         # Configuration
│   └── security.py       # Security utilities
├── models/                # SQLAlchemy models
├── schemas/               # Pydantic schemas
├── services/              # Business logic
│   └── payment/          # Payment service
└── main.py               # FastAPI app
```

### Data Layer (Supabase + PostgreSQL)

**Components:**
1. **PostgreSQL Database**
   - Primary data store
   - ACID compliance
   - JSONB for multilingual content
   - Full-text search capabilities

2. **Supabase Auth**
   - User authentication
   - OAuth providers (Google, Apple)
   - Email verification
   - Password reset

3. **Supabase Storage**
   - File storage (images, videos, documents)
   - CDN delivery
   - Access control
   - Automatic optimization

4. **Row Level Security (RLS)**
   - Database-level security
   - User-specific data access
   - Policy-based permissions

## Data Flow

### 1. User Registration Flow

```
User → Frontend → Supabase Auth → Database
                      ↓
                  Create Profile
                      ↓
                  Backend API (optional verification)
                      ↓
                  Email Service → User
```

### 2. Formation Browsing Flow

```
User → Frontend → Backend API
                      ↓
                  Query Database (RLS filters)
                      ↓
                  Return Formations (with locale filtering)
                      ↓
                  Frontend → User (rendered page)
```

### 3. Enrollment + Payment Flow

```
User → Frontend (Select Formation)
         ↓
     Backend API (Create Enrollment - status: pending)
         ↓
     Backend API (Initiate Payment)
         ↓
     BOG Payment API (OAuth2 auth)
         ↓
     Return Payment URL
         ↓
     Redirect User → BOG Payment Page
         ↓
     User Completes Payment
         ↓
     BOG Webhook → Backend API
         ↓
     Verify Signature
         ↓
     Update Payment Status
         ↓
     Update Enrollment Status (active)
         ↓
     Send Confirmation Email
         ↓
     User Access Formation
```

### 4. Admin Formation Management Flow

```
Admin → Frontend (Admin Dashboard)
          ↓
      Auth Check (role: admin)
          ↓
      Backend API (admin endpoints)
          ↓
      Create/Update Formation
          ↓
      Upload Images → Supabase Storage
          ↓
      Save to Database
          ↓
      Audit Log Entry
          ↓
      Return Success → Admin
```

## Security Architecture

### Authentication
1. **Supabase Auth** handles user authentication
2. **JWT tokens** for session management
3. **HTTP-only cookies** for secure token storage
4. **Token refresh** mechanism

### Authorization
1. **Role-Based Access Control (RBAC)**
   - User roles: `user`, `admin`, `super_admin`
   - Endpoint-level authorization
   - Resource-level permissions

2. **Row Level Security (RLS)**
   - Database-level access control
   - Automatic filtering of queries
   - Prevents unauthorized data access

### Data Security
1. **HTTPS only** for all communications
2. **Encrypted passwords** (bcrypt)
3. **Encrypted database** (Supabase)
4. **Input validation** (Pydantic schemas)
5. **SQL injection prevention** (ORM)
6. **XSS prevention** (React automatic escaping)
7. **CSRF protection** (SameSite cookies)

### Payment Security
1. **PCI DSS compliance** (via Bank of Georgia)
2. **No credit card storage** (tokenization)
3. **Webhook signature verification**
4. **Transaction logging** for audit

## Internationalization (i18n) Architecture

### Content Storage
- **Frontend**: JSON translation files
- **Database**: JSONB columns with language keys
  ```json
  {
    "fr": "Formation en implantologie",
    "en": "Implantology Training",
    "ka": "იმპლანტოლოგიის ტრენინგი"
  }
  ```

### Locale Detection
1. URL path (`/fr/`, `/en/`, `/ka/`)
2. Accept-Language header
3. User preference (saved in profile)
4. Default to French

### Translation Management
- **Frontend**: `messages/[locale]/common.json`
- **Backend**: Language-specific queries
- **Fallback**: Default to primary language if translation missing

## Scalability Considerations

### Horizontal Scaling
1. **Frontend**: Stateless Next.js instances
2. **Backend**: Multiple FastAPI instances
3. **Database**: Supabase auto-scaling

### Caching Strategy
1. **Static assets**: CDN caching
2. **API responses**: Redis caching (optional)
3. **Database queries**: Supabase connection pooling

### Performance Optimization
1. **Code splitting**: Next.js automatic
2. **Image optimization**: Next.js Image component
3. **Database indexes**: All foreign keys and common queries
4. **Lazy loading**: Frontend components

## Deployment Architecture

### Recommended Hosting

**Frontend (Next.js)**
- **Platform**: Vercel
- **Features**:
  - Automatic deployments from Git
  - Edge network CDN
  - Serverless functions
  - Preview deployments

**Backend (FastAPI)**
- **Platform**: Railway / Render / DigitalOcean
- **Features**:
  - Auto-deploy from Git
  - Environment variable management
  - Automatic HTTPS
  - Health checks

**Database & Storage**
- **Platform**: Supabase
- **Features**:
  - Managed PostgreSQL
  - Automatic backups
  - CDN for storage
  - Built-in monitoring

### CI/CD Pipeline

```
Git Push → GitHub
    ↓
GitHub Actions (CI)
    ↓
Run Tests (Frontend + Backend)
    ↓
Build Frontend
    ↓
Build Backend Docker Image
    ↓
Deploy to Staging
    ↓
Integration Tests
    ↓
Manual Approval (for production)
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Success / Rollback
```

## Monitoring & Logging

### Application Monitoring
- **Frontend**: Vercel Analytics
- **Backend**: Application logs
- **Database**: Supabase Dashboard

### Error Tracking
- **Sentry** (recommended)
- Capture frontend and backend errors
- User context and breadcrumbs
- Performance monitoring

### Logging Strategy
- **Info**: Normal operations
- **Warning**: Recoverable errors
- **Error**: Failures requiring attention
- **Critical**: System-wide failures

### Metrics to Monitor
1. **Performance**
   - Page load times
   - API response times
   - Database query times

2. **Business**
   - User registrations
   - Formation enrollments
   - Payment success rate
   - Revenue

3. **System**
   - CPU usage
   - Memory usage
   - Disk space
   - Network bandwidth

## Future Enhancements

### Phase 4: Advanced Features
- Video streaming with progress tracking
- Live webinars integration
- Discussion forums
- Certificate generation (PDF)
- Email notifications
- Push notifications

### Phase 5: Analytics
- User behavior tracking
- Formation analytics
- Conversion funnel analysis
- A/B testing framework

### Phase 6: Mobile Apps
- React Native apps (iOS & Android)
- Native mobile experience
- Offline mode
- Push notifications

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14+ | React framework with SSR |
| Frontend | TypeScript | Type safety |
| Frontend | Tailwind CSS | Styling |
| Frontend | next-intl | Internationalization |
| Backend | FastAPI | Python web framework |
| Backend | SQLAlchemy | ORM |
| Backend | Pydantic | Data validation |
| Database | PostgreSQL | Primary database |
| Database | Supabase | Database + Auth + Storage |
| Payment | Bank of Georgia API | Payment processing |
| Hosting | Vercel | Frontend hosting |
| Hosting | Railway/Render | Backend hosting |
| CI/CD | GitHub Actions | Automation |

## Development Workflow

1. **Local Development**
   ```bash
   # Start frontend
   cd frontend && npm run dev

   # Start backend
   cd backend && uvicorn app.main:app --reload
   ```

2. **Feature Development**
   - Create feature branch
   - Implement changes
   - Write tests
   - Submit pull request
   - Code review
   - Merge to main

3. **Deployment**
   - Automatic deployment on merge
   - Staging environment testing
   - Production deployment
   - Health check verification

## Questions & Support

For questions about the architecture or implementation:
1. Check this documentation
2. Review the main README.md
3. Check the API documentation (`/docs`)
4. Contact the development team
