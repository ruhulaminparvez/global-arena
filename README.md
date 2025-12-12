# Global Arena

A modern saving money platform for working people, built with Next.js, TypeScript, Framer Motion, and Tailwind CSS.

## Features

- 🎨 Modern, responsive UI with smooth animations
- 💰 Savings-focused platform for working professionals
- 🌿 Green farmer theme with working people focus
- 📱 Mobile-first design
- 🔐 Secure authentication pages (Login & Registration)
- ✨ Beautiful animations powered by Framer Motion
- 🎯 Clean, maintainable code structure

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Hind Siliguri** - Bengali font support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
global-arena/
├── app/
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── layout.tsx      # Root layout with font configuration
│   └── globals.css     # Global styles
├── components/
│   ├── animations.tsx  # Reusable animation components
│   ├── button.tsx      # Button component
│   └── input.tsx       # Input component
└── lib/
    └── utils.ts        # Utility functions
```

## Pages

- `/` - Redirects to login
- `/login` - User login page
- `/register` - User registration page

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Primary Green**: Used for main actions and branding
- **Accent Yellow**: Used for highlights and secondary actions
- **Gradient Backgrounds**: Soft green-to-yellow gradients

### Typography
- **Font**: Hind Siliguri (supports Bengali and Latin characters)
- **Weights**: 300, 400, 500, 600, 700

## License

MIT

