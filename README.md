# SummitFlow

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?logo=opensourceinitiative&logoColor=white)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?logo=git&logoColor=white)](https://github.com/nasimubd/SummitFlow/releases)
[![Conventional Commits](https://img.shields.io/badge/commits-conventional-fe5196.svg)](https://www.conventionalcommits.org/)

**Open-source event operations platform for organisers, communities, conferences, workshops, and ticketed gatherings.**

SummitFlow connects event discovery, organiser workflows, ticket registration, attendee-facing event details, authentication, and operational dashboards in a responsive web application.

Developed and maintained by [MD NASIM](https://github.com/nasimubd).

---

## Why SummitFlow

Event teams need public discovery, reliable registration, and organiser controls to operate from the same source of truth. SummitFlow provides a connected workflow from publishing an event through managing attendance.

```text
                         SummitFlow
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    Discovery             Registration          Operations
        │                     │                     │
 Events · Search         Ticket tiers          Dashboard
 Categories              Attendees             Live statistics
 Event details           Capacity              Authenticated access
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    Event assistance
          Description generation · Attendee chat
```

## Core capabilities

### Event discovery and attendance

* Browse, search, and filter events by category
* Public event-detail pages with location, schedule, and availability
* Multiple ticket types and pricing tiers
* Attendee registration flows
* Responsive interfaces for mobile, tablet, and desktop

### Organiser operations

* Authenticated organiser dashboard
* Event creation and management
* Capacity-aware event configuration
* Live event, attendee, and organiser statistics
* Dynamic page metadata for discoverability

### Event assistance

* Description-generation workflow for event drafting
* Contextual event chat for attendee questions
* Server-side functions for assistance workflows

### Identity and data

* Email/password authentication
* Google OAuth sign-in
* Supabase-backed events, ticket types, registrations, and profiles
* Protected organiser routes

## Architecture

```text
React + TypeScript application
    │
    ├── Public experience
    │   ├── Event discovery
    │   ├── Event details
    │   └── Registration
    │
    ├── Authenticated experience
    │   ├── Authentication
    │   └── Organiser dashboard
    │
    └── Supabase
        ├── PostgreSQL data and row-level policies
        ├── Authentication
        └── Server-side functions
            ├── generate-description
            └── event-chat
```

## Technology

* React 18 and TypeScript
* Vite 8
* Tailwind CSS and shadcn/ui
* React Router and TanStack React Query
* Supabase for data, authentication, and server-side functions
* Framer Motion
* Vitest and Playwright

## Getting started

### Requirements

* Node.js 18 or later
* npm
* A Supabase project with the migrations and functions deployed

### Setup

```bash
git clone https://github.com/nasimubd/SummitFlow.git
cd SummitFlow
npm install
cp .env.example .env
npm run dev
```

Set the following values in `.env` before starting the application:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

The development server is available at `http://localhost:5173`.

## Validation

```bash
npm run lint
npm run test
npm run build
```

## Project structure

```text
src/
├── components/       # Reusable UI, registration, and assistance components
├── contexts/         # Authentication provider
├── integrations/     # Supabase client and generated types
├── pages/            # Discovery, detail, registration, and dashboard routes
└── hooks/            # UI and metadata hooks

supabase/
├── migrations/       # Database schema and access policies
└── functions/        # Description and event-chat functions
```

## Project status

**SummitFlow v0.1.0** is the initial open-source baseline. It includes event discovery, ticket registration, organiser workflows, authentication, and event-assistance features. Review and configure authentication, database policies, environment variables, and server-side functions before any production deployment.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. All commits and pull-request titles follow the [Conventional Commits](https://www.conventionalcommits.org/) doctrine.

## License

SummitFlow is released under the [MIT License](./LICENSE).
