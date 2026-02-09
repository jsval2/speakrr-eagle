# SPKRR Dashboard

A modern dashboard application for managing dental voice agent operations.

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management
- **Recharts** - Chart library for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start on `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── dashboard/  # Dashboard-specific components
│   └── ui/         # shadcn-ui components
├── pages/          # Page components/routes
├── hooks/          # Custom React hooks
└── lib/            # Utility functions
```

## Development

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Path aliases** (`@/` maps to `src/`)
