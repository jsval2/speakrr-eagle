# CLAUDE.md - SPKRR Dashboard

Demo dashboard for a dental voice agent system (ElevenLabs AI). This is a presentation-ready demo, not a production application.

## Quick Start

```bash
npm run dev    # Start dev server on port 8080
npm run build  # Production build
npm run lint   # Run ESLint
```

## Tech Stack

- **Vite + React 18 + TypeScript** - Core framework
- **Tailwind CSS + shadcn/ui** - 48 pre-built Radix UI components in `src/components/ui/`
- **React Query** - Data fetching with 2-second polling for real-time updates
- **React Router v6** - Client-side routing
- **React Hook Form + Zod** - Form handling
- **Recharts** - Charts
- **Supabase** - Backend (limited use, mainly ElevenLabs API)

## Project Structure

```
src/
├── components/
│   ├── dashboard/    # Layout components (Sidebar, DashboardLayout, KPICard, etc.)
│   └── ui/           # shadcn/ui components (DO NOT manually edit)
├── pages/            # 13 page components
├── hooks/            # useConversations, use-mobile, use-toast
├── lib/
│   ├── elevenlabs.ts       # ElevenLabs API client (MAIN DATA SOURCE)
│   ├── conversationUtils.ts # Data transformation helpers
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # cn() helper for Tailwind classes
├── App.tsx           # Router config
├── main.tsx          # Entry point
└── index.css         # Global styles + CSS variables
```

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `Index.tsx` | Dashboard overview - KPIs, call chart, active calls |
| `/live-calls` | `LiveCalls.tsx` | Real-time call monitoring |
| `/call-history` | `CallHistory.tsx` | Last 30 days of calls with transcripts |
| `/calendar` | `Calendar.tsx` | Appointment calendar view |
| `/customers` | `Customers.tsx` | Customer database |
| `/ai-config` | `AIConfiguration.tsx` | Agent settings (UI only) |
| `/analytics` | `Analytics.tsx` | Charts + AI insights |
| `/alerts` | `Alerts.tsx` | Alert management |
| `/settings` | `Settings.tsx` | Account settings |

### Auth Pages (Not Active)
These pages exist but are not linked from the dashboard. Kept for future use:
- `/login` - Login page (no backend)
- `/signup` - Signup page (no backend)
- `/forgot-password` - Password recovery (no backend)

## Data Source

All call/conversation data comes from **ElevenLabs API**, not Supabase.

Agent ID: `agent_2101ke1rkdp6e0g9x1gyge1fmdns`

```typescript
// src/lib/elevenlabs.ts
fetchConversations()        // List all conversations
fetchConversation(id)       // Get full transcript + details
getConversationAudioUrl(id) // Audio playback URL
```

### Environment Variables
```
VITE_ELEVENLABS_API_KEY=<required>
VITE_SUPABASE_URL=https://vzcxqxbvqfmqzfswjyiy.supabase.co
VITE_SUPABASE_ANON_KEY=<key>
```

## Design System

### Industrial Minimalist Theme
- **Zero border radius** - All elements have sharp corners
- **Primary color**: Electric blue `#0000ff`
- **Font**: DM Sans (body), JetBrains Mono (code)
- **Dark mode**: Supported via class toggle

### Color Tokens (defined in index.css)
- `--background`, `--foreground`
- `--primary`, `--secondary`, `--tertiary`
- `--success`, `--warning`, `--destructive`
- `--border`, `--muted`

### Component Usage
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
```

## Patterns & Conventions

### Data Fetching
```tsx
// React Query with polling
const { data, isLoading } = useQuery({
  queryKey: ['conversations'],
  queryFn: fetchConversations,
  refetchInterval: 2000,  // Poll every 2s
  staleTime: 1000,
});
```

### Path Aliases
```tsx
import { something } from "@/lib/utils";  // @/ = src/
```

### Utility Classes
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", conditional && "extra-class")} />
```

## Important Files

| File | What It Does |
|------|--------------|
| `src/App.tsx` | All route definitions |
| `src/lib/elevenlabs.ts` | ElevenLabs API calls + types |
| `src/lib/conversationUtils.ts` | Transform API data → UI format |
| `src/hooks/useConversations.ts` | React Query hooks for calls data |
| `src/components/dashboard/Sidebar.tsx` | Main navigation |
| `tailwind.config.ts` | Theme colors + custom tokens |
| `src/index.css` | CSS variables for theming |

## Adding New Pages

1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav item in `src/components/dashboard/Sidebar.tsx` (in the `navigation` array)

## Adding UI Components

shadcn/ui components are already installed. If you need a new one:
```bash
npx shadcn-ui@latest add <component-name>
```

## What's Real vs Mock Data

| Feature | Data Source |
|---------|-------------|
| Call data, transcripts | **LIVE** - ElevenLabs API |
| Dashboard KPIs | **LIVE** - Calculated from ElevenLabs |
| Customer list | Mock/static data |
| Calendar appointments | Mock data |
| AI Configuration | UI only (doesn't save) |
| Analytics insights | Pre-written text |

## Don't Touch

- `src/components/ui/*` - Auto-generated shadcn components
- Supabase schema - Not actively used
