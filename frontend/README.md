# GLI International - Frontend

Next.js frontend application for the GLI International medical formation platform.

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/fr](http://localhost:3000/fr) in your browser.

## Available Routes

- `/fr` - French homepage (default)
- `/en` - English homepage
- `/ka` - Georgian homepage
- `/fr/formations` - Formations listing
- `/fr/about` - About page
- `/fr/contact` - Contact page
- `/fr/login` - Login page
- `/fr/register` - Registration page

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx    # Root layout with Header/Footer
│   │   └── page.tsx      # Homepage
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Footer
│   └── home/            # Homepage sections
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── FormationsSection.tsx
│       └── ContactSection.tsx
├── lib/
│   └── supabase/        # Supabase client configuration
├── types/               # TypeScript type definitions
└── middleware.ts        # Next.js middleware for i18n
```

## Homepage Sections

The homepage includes:

1. **Hero Section** - Full-width hero with background image
2. **About Section** - Two-column layout with stats
3. **Formations Section** - Featured formations grid
4. **Contact Section** - Contact form and information

## Customization

### Replace Placeholder Images

Currently using Unsplash images. Replace with your own:

1. Upload images to Supabase Storage
2. Update image URLs in components
3. Or replace with local images in `public/` folder

### Update Text Content

Edit translation files in `messages/fr/common.json`:

```json
{
  "home": {
    "hero": {
      "title": "Your Title Here",
      "subtitle": "Your Subtitle",
      "cta": "Button Text"
    }
  }
}
```

### Change Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    // Your brand colors
  }
}
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

See [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for deployment instructions.

## Troubleshooting

### Images not loading

Make sure `next.config.js` includes your image domains in `remotePatterns`.

### Translation not found

Check that translation keys exist in all language files in `messages/` folder.

### Styles not applying

Run `npm run build` to regenerate Tailwind CSS.
