# EventFlow AI

An AI-powered event management platform built with React, TypeScript, and Lovable Cloud. Browse, create, and register for events with intelligent features like AI-generated descriptions and an event chat assistant.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4) ![Vite](https://img.shields.io/badge/Vite-8-646CFF)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Features

- **Event Discovery** — Browse, search, and filter events by category (Conference, Workshop, Networking, Concert)
- **AI Description Generator** — Automatically generate compelling event descriptions using AI
- **Event Chat Widget** — Ask questions about events through an AI-powered chat assistant
- **User Authentication** — Email/password and Google OAuth sign-in
- **Event Registration** — Register for events with multiple ticket types and pricing tiers
- **Organiser Dashboard** — Create and manage events behind a protected route
- **Live Stats** — Real-time statistics for total events, attendees, and organisers
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **SEO Optimised** — Dynamic page titles, meta descriptions, and OpenGraph tags

---

## Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Framework     | React 18 + TypeScript               |
| Build Tool    | Vite 8                              |
| Styling       | Tailwind CSS 3 + shadcn/ui          |
| Routing       | React Router v6                     |
| State/Data    | TanStack React Query                |
| Backend       | Lovable Cloud (Supabase)            |
| Auth          | Supabase Auth + Lovable Cloud OAuth |
| AI            | Supabase Edge Functions             |
| Animations    | Framer Motion                       |
| Deployment    | Vercel / Lovable Publish            |

---

## Project Structure

```
├── public/                  # Static assets (favicon, robots.txt)
├── src/
│   ├── assets/              # Images (event photos)
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (button, card, dialog…)
│   │   ├── Navbar.tsx        # Navigation bar with auth state
│   │   ├── Hero.tsx          # Landing page hero section
│   │   ├── StatsSection.tsx  # Live event/attendee/organiser stats
│   │   ├── FeaturedEvents.tsx# Featured events grid
│   │   ├── EventCard.tsx     # Event card component
│   │   ├── EventCardSkeleton.tsx # Loading skeleton
│   │   ├── EmptyEvents.tsx   # Empty state fallback
│   │   ├── EventChatWidget.tsx   # AI chat widget
│   │   ├── AIDescriptionGenerator.tsx # AI description tool
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ProtectedRoute.tsx# Auth guard wrapper
│   │   └── NavLink.tsx       # Reusable nav link
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context provider
│   ├── hooks/
│   │   ├── usePageMeta.ts    # Dynamic page title/meta hook
│   │   ├── use-mobile.tsx    # Mobile breakpoint hook
│   │   └── use-toast.ts      # Toast notification hook
│   ├── integrations/
│   │   ├── supabase/         # Auto-generated Supabase client & types
│   │   └── lovable/          # Lovable Cloud integration
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn helper)
│   ├── pages/
│   │   ├── Index.tsx         # Landing page
│   │   ├── Events.tsx        # Browse events with search & filters
│   │   ├── EventDetail.tsx   # Single event detail page
│   │   ├── Register.tsx      # Event registration form
│   │   ├── Dashboard.tsx     # Organiser dashboard (protected)
│   │   ├── Login.tsx         # Sign-in page
│   │   ├── Signup.tsx        # Sign-up page
│   │   └── NotFound.tsx      # 404 page
│   ├── App.tsx               # Root component with routes
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles & design tokens
├── supabase/
│   ├── config.toml           # Supabase project configuration
│   ├── migrations/           # Database migration files
│   └── functions/
│       ├── generate-description/  # AI description edge function
│       └── event-chat/            # AI chat edge function
├── vercel.json               # Vercel SPA routing config
├── tailwind.config.ts        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable                          | Description                     |
| --------------------------------- | ------------------------------- |
| `VITE_SUPABASE_URL`              | Supabase project URL            |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | Supabase anon/public key        |
| `VITE_SUPABASE_PROJECT_ID`       | Supabase project ID             |

> **Note:** These are automatically configured when using Lovable Cloud.

---

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start development server           |
| `npm run build`   | Production build                   |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |
| `npm run test`    | Run tests with Vitest              |
| `npm run test:watch` | Run tests in watch mode         |

---

## Database Schema

### `events`
| Column            | Type        | Description                  |
| ----------------- | ----------- | ---------------------------- |
| `id`              | UUID (PK)   | Auto-generated               |
| `title`           | text        | Event title                  |
| `description`     | text        | Event description (nullable) |
| `category`        | text        | Conference, Workshop, etc.   |
| `date`            | timestamptz | Event date and time          |
| `location`        | text        | Event venue/location         |
| `max_capacity`    | integer     | Maximum attendees (default: 100) |
| `organiser_name`  | text        | Organiser display name       |
| `cover_image_url` | text        | Cover image URL (nullable)   |
| `user_id`         | UUID        | Owner's auth user ID         |
| `created_at`      | timestamptz | Creation timestamp           |

### `ticket_types`
| Column               | Type        | Description               |
| -------------------- | ----------- | ------------------------- |
| `id`                 | UUID (PK)   | Auto-generated            |
| `event_id`           | UUID (FK)   | References `events.id`    |
| `name`               | text        | Ticket tier name          |
| `price`              | numeric     | Ticket price (default: 0) |
| `quantity_available`  | integer     | Available quantity        |

### `registrations`
| Column            | Type        | Description                |
| ----------------- | ----------- | -------------------------- |
| `id`              | UUID (PK)   | Auto-generated             |
| `event_id`        | UUID (FK)   | References `events.id`     |
| `ticket_type_id`  | UUID (FK)   | References `ticket_types.id` |
| `attendee_name`   | text        | Registrant's name          |
| `attendee_email`  | text        | Registrant's email         |
| `registered_at`   | timestamptz | Registration timestamp     |

### `profiles`
| Column         | Type        | Description             |
| -------------- | ----------- | ----------------------- |
| `id`           | UUID (PK)   | Auto-generated          |
| `user_id`      | UUID        | Auth user ID            |
| `display_name` | text        | User display name       |
| `avatar_url`   | text        | Profile avatar URL      |
| `created_at`   | timestamptz | Creation timestamp      |
| `updated_at`   | timestamptz | Last update timestamp   |

---

## Edge Functions

### `generate-description`
Generates AI-powered event descriptions based on event details. Called from the Dashboard when creating events.

### `event-chat`
Powers the AI chat widget on event detail pages, answering attendee questions about specific events.

> Both functions have `verify_jwt = false` for public access.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables in Vercel's project settings
5. Deploy

The included `vercel.json` handles SPA client-side routing automatically.

### Lovable Publish

Click **Share → Publish** in the Lovable editor for instant deployment.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).
