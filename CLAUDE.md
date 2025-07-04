# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Standard Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Overview

This is an e-invitation RSVP PWA web application built with Next.js 15 and Supabase, using a Turborepo monorepo structure. The application allows users to create beautiful digital invitations, manage guest lists, and collect RSVPs in real-time. It features a mobile-first design with offline capabilities.

## Development Commands

### Setup & Installation
```bash
# Install dependencies
pnpm install

# Start Supabase (requires Docker)
pnpm run supabase:web:start

# Start development server
pnpm run dev
```

### Build & Deploy
```bash
# Build all packages
pnpm run build

# Build for production
turbo build

# Type check
pnpm run typecheck
```

### Code Quality
```bash
# Lint all packages
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format:fix

# Check formatting
pnpm run format
```

### Testing
```bash
# Run E2E tests
pnpm --filter e2e test

# Run E2E tests with UI
pnpm --filter e2e test:ui

# Show test report
pnpm --filter e2e report
```

### Database Operations
```bash
# Generate TypeScript types from Supabase
pnpm run supabase:web:typegen

# Create new migration
pnpm --filter web supabase migration new <name>

# Reset database with seed data
pnpm run supabase:web:reset

# Stop Supabase
pnpm run supabase:web:stop
```

## Project Architecture

### Monorepo Structure
The project uses Turborepo with workspace packages:

- `apps/web/` - Main Next.js application
- `apps/e2e/` - Playwright E2E tests
- `packages/features/` - Feature-specific packages (auth, accounts)
- `packages/ui/` - Shared UI components (Shadcn UI + custom components)
- `packages/supabase/` - Supabase client and utilities
- `packages/i18n/` - Internationalization utilities
- `packages/next/` - Next.js specific utilities
- `packages/shared/` - Shared utilities and hooks

### Key Patterns

#### Authentication Flow
- Authentication is handled by `@kit/auth` package
- Routes are protected via middleware (`apps/web/middleware.ts`)
- User session management through Supabase Auth
- MFA support with challenge verification

#### Route Structure
- Marketing pages: `apps/web/app/(marketing)/`
- Auth pages: `apps/web/app/auth/`
- Protected app pages: `apps/web/app/home/`
- Route configuration: `apps/web/config/paths.config.ts`

#### Navigation
- Navigation configuration: `apps/web/config/navigation.config.tsx`
- Dynamic navigation based on user authentication state
- Sidebar navigation with collapsible support

#### Data Fetching
- React Query (`@tanstack/react-query`) for client-side data fetching
- Server actions for mutations
- Custom hooks in feature packages for data management

#### UI Components
- Shadcn UI components in `packages/ui/src/shadcn/`
- Custom Makerkit components in `packages/ui/src/makerkit/`
- Consistent theming with Tailwind CSS v4

#### Database
- Supabase for authentication and e-invitation data
- Schema includes: invitations, guests, rsvp_responses, invitation_templates
- Migrations in `apps/web/supabase/migrations/` (use timestamped names)
- Type generation: `pnpm run supabase:web:typegen`
- Row Level Security (RLS) policies following account-based patterns
- Guest codes for anonymous RSVP access
- Storage buckets for invitation images

### Environment Configuration
The application uses multiple environment files:
- `.env.local` - Local development
- `.env.test` - Testing environment

Key environment variables are defined in `turbo.json` globalEnv section.

## Development Notes

### Package Management
- Uses pnpm with workspace protocol (`workspace:*`)
- Dependency management through `@manypkg/cli`
- Turborepo caching for build optimization

## E-Invitation Features

### Core Packages
- `@kit/invitations` - Invitation creation, management, templates, and sharing
- `@kit/rsvp` - Guest lookup, RSVP forms, and response tracking
- `@kit/auth` - Authentication and user management
- `@kit/accounts` - Account management and settings

### Key Features
- **Invitation Creation**: Form-based invitation creation with template selection
- **Guest Management**: Add guests manually or via CSV import, track RSVP status
- **Template System**: Beautiful pre-designed templates for weddings, birthdays, corporate events
- **Sharing**: QR codes, social media integration, direct link sharing
- **RSVP System**: Anonymous guest lookup via codes, real-time response tracking
- **PWA Support**: Offline capabilities, installable app, background sync

### TypeScript Configuration
- Strict TypeScript configuration across all packages
- Shared TypeScript config in `packages/typescript/`
- Path aliases configured for clean imports

### Testing Strategy
- E2E tests with Playwright for critical user flows
- Component testing through feature packages
- Authentication flow testing with page objects

### Security Features
- CSRF protection via `@edge-csrf/nextjs`
- Request ID correlation for tracing
- Secure cookie handling
- Server action protection

When working with this codebase, always:
1. Run `pnpm run typecheck` after making changes
2. Use the established patterns for new features
3. Follow the existing package structure when adding new functionality
4. Test authentication flows when modifying auth-related code
5. Use proper migration commands: `pnpm --filter web supabase migration new <name>`
6. Test RSVP flows with guest codes for anonymous access
7. Ensure mobile-first responsive design in all new components
8. Follow PWA best practices for offline functionality