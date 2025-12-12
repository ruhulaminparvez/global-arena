# Global Arena - Savings Platform

A modern Progressive Web App (PWA) built with Next.js 16, designed for farmers and working people to manage their savings, investments, and loans.

## Features

- ✅ **Next.js 16.0.10** - Latest secure version (CVE-2025-66478 patched)
- ✅ **PWA Support** - Installable as a mobile app
- ✅ **Dual Language** - Bangla (default) and English support
- ✅ **Modern UI** - Beautiful green theme highlighting farmers and working people
- ✅ **Animations** - Smooth animations using Framer Motion
- ✅ **Responsive Design** - Works on all devices
- ✅ **Authentication** - Sign up and Sign in pages
- ✅ **Dashboard** - Card-based navigation with Lucide icons
- ✅ **Clean Architecture** - Senior-level code organization

## Tech Stack

- **Framework**: Next.js 16.0.10
- **React**: 19.2.1
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: next-intl
- **Font**: Hind Siliguri (Google Fonts)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The app will be available at `http://localhost:3000`

- Default language: Bangla (`/bn`)
- English: `/en`
- Sign In: `/bn/signin` or `/en/signin`
- Sign Up: `/bn/signup` or `/en/signup`
- Dashboard: `/bn/dashboard` or `/en/dashboard`

## Project Structure

```
global-arena/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   └── dashboard/     # Dashboard and sub-routes
│   ├── globals.css        # Global styles
│   └── manifest.ts        # PWA manifest
├── components/
│   ├── ui/                # Reusable UI components
│   └── LanguageSwitcher.tsx
├── messages/              # Translation files
│   ├── bn.json           # Bangla translations
│   └── en.json           # English translations
├── utils/
│   ├── constants.ts      # Content constants (routes, stats)
│   └── cn.ts             # Utility functions
├── i18n.ts               # i18n configuration
├── middleware.ts         # Next.js middleware for i18n
└── next.config.ts        # Next.js configuration
```

## Features in Detail

### Authentication
- Sign in page with email/password
- Sign up page with validation
- Password visibility toggle
- Form validation

### Dashboard
- Welcome section
- Statistics cards (Total Savings, Investments, Loans, Income)
- Route cards with icons:
  - Savings
  - Investments
  - Loans
  - Transactions
  - Profile
  - Settings

### Language Support
- Bangla (বাংলা) - Default
- English
- Language switcher in header
- All content from translation files

### PWA Features
- Installable on mobile devices
- Offline support (via service worker)
- App manifest configured
- Theme color: Green (#16a34a)

## Content Management

All content is managed through `utils/constants.ts`:
- Dashboard routes configuration
- Statistics cards data
- Icons and colors
- Localized text objects

## Security

- Using Next.js 16.0.10 (patched for CVE-2025-66478)
- React 19.2.1 (patched for CVE-2025-55182)
- TypeScript for type safety
- Secure authentication flow

## Customization

### Theme Colors
Edit `app/globals.css` to change the green theme colors:
- Primary Green: `#16a34a`
- Accent colors: Various shades of green, emerald, teal, lime

### Adding New Routes
1. Add route configuration to `utils/constants.ts`
2. Create page in `app/[locale]/dashboard/[route]/page.tsx`
3. Add translations to `messages/bn.json` and `messages/en.json`

### Adding New Languages
1. Add locale to `i18n.ts`
2. Create translation file in `messages/[locale].json`
3. Update middleware if needed

## PWA Icons

To add PWA icons:
1. Create `public/icon-192.png` (192x192px)
2. Create `public/icon-512.png` (512x512px)
3. Icons are referenced in `app/manifest.ts`

## License

MIT

## Contributing

This is a private project. For questions or issues, please contact the maintainer.
