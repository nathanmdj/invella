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

This is a fully-featured e-invitation RSVP PWA web application built with Next.js 15 and Supabase, using a Turborepo monorepo structure. The application is production-ready with complete invitation management, anonymous RSVP functionality, and real-time tracking capabilities. It features a mobile-first design with offline PWA capabilities, elegant UI, and comprehensive security implementations.

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

- `apps/web/` - Main Next.js application with complete invitation management
- `apps/e2e/` - Playwright E2E tests
- `packages/features/` - Feature-specific packages:
  - `invitations/` - Complete invitation management system
  - `rsvp/` - Guest lookup and RSVP response handling
  - `auth/` - Authentication and user management
  - `accounts/` - Account management and settings
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
- Marketing pages: `apps/web/app/(marketing)/` - Landing page with elegant design
- Auth pages: `apps/web/app/auth/` - Authentication flows
- Protected app pages: `apps/web/app/home/` - Main dashboard and invitation management
- Invitation creation: `apps/web/app/create/` - Invitation creation form
- Public invitation view: `apps/web/app/invite/[id]/` - Public invitation display
- RSVP submission: `apps/web/app/invite/[id]/rsvp/` - Anonymous RSVP form
- Offline support: `apps/web/app/offline/` - PWA offline page
- Route configuration: `apps/web/config/paths.config.ts`

#### Navigation
- Navigation configuration: `apps/web/config/navigation.config.tsx`
- Dynamic navigation based on user authentication state
- Sidebar navigation with collapsible support

#### Data Fetching
- **Server Components by Default**: Always create pages as server components for optimal performance
- **Server Actions First**: Prioritize server actions over Next.js API routes for data mutations and fetching
- **Hooks for Client-Side Only**: Use React Query hooks only when client-side data fetching is necessary (real-time updates, user interactions)
- **Navigation Optimization**: Use Next.js Link component instead of buttons for navigation with prefetching enabled

#### UI Components
- Shadcn UI components in `packages/ui/src/shadcn/`
- Custom Makerkit components in `packages/ui/src/makerkit/`
- Consistent theming with Tailwind CSS v4

#### Database
- Supabase for authentication and e-invitation data
- Complete schema with tables: invitations, guests, rsvp_responses, invitation_templates
- Migrations in `apps/web/supabase/migrations/` (use timestamped names)
- Type generation: `pnpm run supabase:web:typegen`
- Comprehensive Row Level Security (RLS) policies for data protection
- Anonymous guest access system with secure guest codes
- Storage buckets for invitation images
- Real-time RSVP tracking and statistics

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

### Key Features (Fully Implemented)
- **Invitation Creation**: Complete form-based invitation creation with template selection, event details, and image support
- **Guest Management**: Add guests manually, auto-generate guest codes, track RSVP status with comprehensive statistics
- **Template System**: Infrastructure for beautiful invitation templates with design configurations
- **Sharing**: Direct link sharing with public invitation pages
- **RSVP System**: Anonymous guest lookup via secure codes, comprehensive RSVP forms with dietary restrictions and plus-one support
- **PWA Support**: Full offline capabilities, installable app, background sync for RSVP submissions
- **Real-time Dashboard**: Live RSVP tracking, guest statistics, and invitation management
- **Elegant UI**: Beautiful, responsive design with gradient styling and mobile-first approach

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

## Current Implementation Status

The application is **production-ready** with all core features fully implemented:

### ✅ Completed Features
- **Authentication System**: Complete Supabase Auth with MFA support and session management
- **Landing Page**: Beautiful, modern design with gradient styling and feature showcase
- **Dashboard**: Real-time invitation management with statistics and RSVP tracking
- **Invitation Creation**: Full CRUD operations with form validation and image support
- **Guest Management**: Guest list creation, unique code generation, and status tracking
- **RSVP System**: Anonymous guest lookup, comprehensive RSVP forms, and real-time updates
- **PWA Functionality**: Service worker, offline support, and installable app capabilities
- **Database Schema**: Complete schema with RLS policies and type generation
- **Security**: CSRF protection, anonymous access controls, and secure guest codes
- **Responsive Design**: Mobile-first approach with beautiful UI components

### 🔄 Areas for Future Enhancement
- **Template Gallery**: Pre-built invitation templates with themes
- **Email Integration**: Automated invitation sending and reminders
- **Advanced Analytics**: Detailed event metrics and reporting
- **Social Media Integration**: Enhanced sharing capabilities
- **Multi-language Support**: I18n for global use
- **Advanced Customization**: Theme and color customization options

## Development Guidelines

When working with this codebase, always:
1. Run `pnpm run typecheck` after making changes
2. Use the established patterns for new features
3. Follow the existing package structure when adding new functionality
4. Test authentication flows when modifying auth-related code
5. Use proper migration commands: `pnpm --filter web supabase migration new <name>`
6. Test RSVP flows with guest codes for anonymous access
7. Ensure mobile-first responsive design in all new components
8. Follow PWA best practices for offline functionality
9. Maintain comprehensive type safety throughout the application
10. **Create server components by default** - Only use client components when necessary (interactivity, hooks, browser APIs)
11. **Use server actions instead of API routes** - Prioritize server actions for data operations and mutations
12. **Optimize navigation** - Use Next.js Link with prefetching for all navigation, avoid buttons for page transitions
13. **Minimize client-side data fetching** - Use React Query hooks only when server-side data fetching is not sufficient