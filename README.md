# Medical Formation Platform

A multilingual e-learning platform for dentists and doctors to access professional training courses.

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-intl** - Internationalization (i18n)
- **Supabase Client** - Database and auth integration
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Python 3.11+**
- **FastAPI** - Modern API framework
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **python-jose** - JWT tokens
- **httpx** - HTTP client for Bank of Georgia API

### Database & Services
- **Supabase (PostgreSQL)** - Primary database
- **Supabase Auth** - Authentication (Google, Apple, Email)
- **Supabase Storage** - Image and file storage
- **Redis** (optional) - Caching and sessions

### Payment Integration (Future)
- **Bank of Georgia API** - Payment processing
  - OAuth2 authentication
  - HTTP Basic Auth fallback

## Project Structure

```
gli-international/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── [locale]/   # Internationalized routes
│   │   │   │   ├── (auth)/ # Auth pages (login, register)
│   │   │   │   ├── (public)/ # Public pages
│   │   │   │   ├── (protected)/ # User dashboard
│   │   │   │   └── admin/  # Admin interface
│   │   │   └── api/        # API routes (if needed)
│   │   ├── components/      # React components
│   │   │   ├── ui/         # UI components
│   │   │   ├── forms/      # Form components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   └── formations/ # Formation-related components
│   │   ├── lib/            # Utilities
│   │   │   ├── supabase/   # Supabase client
│   │   │   ├── api/        # API client for backend
│   │   │   └── utils/      # Helper functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   │   └── locales/        # Translation files
│   │       ├── fr/         # French translations
│   │       ├── en/         # English translations
│   │       └── ka/         # Georgian translations (future)
│   ├── messages/           # i18n messages (alternative location)
│   ├── .env.local.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py        # Authentication
│   │   │   │   │   ├── formations.py  # Formation CRUD
│   │   │   │   │   ├── users.py       # User management
│   │   │   │   │   ├── admin.py       # Admin operations
│   │   │   │   │   └── payments.py    # Payment integration (future)
│   │   │   │   └── api.py  # API router
│   │   │   └── deps.py     # Dependencies
│   │   ├── core/           # Core functionality
│   │   │   ├── config.py   # Configuration
│   │   │   ├── security.py # Security utilities
│   │   │   └── i18n.py     # Backend i18n support
│   │   ├── db/             # Database
│   │   │   ├── base.py     # SQLAlchemy base
│   │   │   └── session.py  # Database session
│   │   ├── models/         # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── formation.py
│   │   │   ├── enrollment.py
│   │   │   └── payment.py  # For future payment tracking
│   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── formation.py
│   │   │   ├── enrollment.py
│   │   │   └── payment.py
│   │   ├── services/       # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── formation_service.py
│   │   │   ├── user_service.py
│   │   │   └── payment/    # Payment service (future)
│   │   │       ├── __init__.py
│   │   │       ├── bog_client.py  # Bank of Georgia client
│   │   │       └── payment_processor.py
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── main.py         # FastAPI app
│   ├── alembic/            # Database migrations
│   ├── tests/              # Tests
│   ├── .env.example
│   ├── requirements.txt
│   └── pyproject.toml
│
├── database/               # Database documentation
│   ├── schema.sql         # Database schema
│   ├── migrations/        # Manual migrations (if needed)
│   └── README.md          # Database documentation
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── API.md            # API documentation
│   ├── DEPLOYMENT.md     # Deployment guide
│   └── I18N.md           # Internationalization guide
│
├── .github/              # GitHub workflows (CI/CD)
│   └── workflows/
│       ├── frontend.yml
│       └── backend.yml
│
├── docker-compose.yml    # Local development setup
├── .gitignore
└── README.md             # This file
```

## Features

### Current Phase (Skeleton)
- Project structure setup
- Configuration files
- Documentation

### Phase 1 (MVP)
- User authentication (Email, Google, Apple via Supabase Auth)
- Multi-language support (French first, then English, Georgian)
- Formation listing and details
- Basic user profiles
- Responsive design (mobile, tablet, desktop)

### Phase 2 (Admin)
- Admin dashboard
- Formation management (CRUD operations)
- Image upload and management
- User management
- Content moderation

### Phase 3 (Payment)
- Bank of Georgia payment integration
- Formation enrollment with payment
- Order history
- Payment status tracking
- Invoice generation

## Key Design Decisions

### Multi-language Architecture
- **next-intl** for frontend translations
- Translations stored in JSON files (`/messages` or `/public/locales`)
- Database stores multilingual content in JSONB columns:
  ```json
  {
    "fr": "Formation en implantologie",
    "en": "Implantology Training",
    "ka": "იმპლანტოლოგიის ტრენინგი"
  }
  ```
- URL structure: `/{locale}/path` (e.g., `/fr/formations`, `/en/formations`)

### Authentication Strategy
- **Primary**: Supabase Auth (handles Google, Apple, Email)
- **Backend**: Validates Supabase JWT tokens
- **User roles**: `user`, `admin`, `super_admin`
- Session management via HTTP-only cookies

### Payment Integration (Future)
- Backend handles all payment logic
- Separate service for Bank of Georgia API
- OAuth2 for secure authentication
- Webhook support for payment status updates
- Transaction logging for audit trail

### Image Management
- **Supabase Storage** for all media
- Organized buckets: `formations`, `profiles`, `content`
- Image optimization on upload
- CDN for fast delivery
- Multiple sizes for responsive images

### Admin Interface
- Protected routes with role-based access control (RBAC)
- Separate admin section in Next.js (`/admin`)
- Rich text editor for formation descriptions
- Drag-and-drop image upload
- Bulk operations support

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

### Backend (.env)
```
# Database
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Bank of Georgia (Future)
BOG_CLIENT_ID=your-client-id
BOG_CLIENT_SECRET=your-client-secret
BOG_API_URL=https://api.bog.ge
BOG_OAUTH_URL=https://oauth.bog.ge

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gli-international
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   uvicorn app.main:app --reload
   ```

4. **Database Setup**
   - Create a Supabase project
   - Run migrations (instructions in `/database/README.md`)
   - Configure Supabase Auth providers

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Supabase Studio: Your Supabase dashboard

## API Documentation

Once the backend is running, access interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Frontend
```bash
cd frontend
npm run test
npm run test:e2e
```

### Backend
```bash
cd backend
pytest
pytest --cov=app tests/
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Recommended Hosting
- **Frontend**: Vercel (seamless Next.js deployment)
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: Supabase (managed PostgreSQL)
- **Media Storage**: Supabase Storage

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please contact [your-email]