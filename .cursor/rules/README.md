# Cursor Rules for Invella E-Invitation PWA

## Project Overview
This is a production-ready e-invitation RSVP PWA built with Next.js 15, Supabase, and TypeScript in a Turborepo monorepo structure. The application allows users to create digital invitations, manage guest lists, and collect RSVPs with offline PWA capabilities.

## Code Style and Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer explicit typing over `any`
- Use proper type imports: `import type { ... } from '...'`
- Define interfaces for all component props and API responses
- Use Zod schemas for validation and type inference

### React/Next.js Patterns
- Use App Router (`app/` directory) for all new routes
- Prefer Server Components when possible, mark Client Components with `'use client'`
- Use React Query (`@tanstack/react-query`) for data fetching
- Implement proper loading states and error handling
- Follow the established file structure and naming conventions

### Component Structure
- Use functional components with hooks
- Implement proper prop interfaces
- Use the established component patterns from `packages/ui`
- Prefer composition over inheritance
- Keep components focused and single-purpose

## File Organization

### Monorepo Structure
```
apps/web/                    # Main Next.js application
├── app/                     # App Router pages
│   ├── (marketing)/         # Landing page
│   ├── auth/               # Authentication flows
│   ├── home/               # Protected dashboard
│   ├── create/             # Invitation creation
│   └── invite/[id]/        # Public invitation pages
├── components/             # Shared components
├── config/                 # Configuration files
└── lib/                    # Utilities and types

packages/features/          # Feature packages
├── invitations/           # Invitation management
├── rsvp/                  # RSVP system
├── auth/                  # Authentication
└── accounts/              # Account management

packages/ui/               # Shared UI components
├── src/shadcn/           # Shadcn UI components
└── src/makerkit/         # Custom components
```

### Naming Conventions
- Use kebab-case for file names: `invitation-card.tsx`
- Use PascalCase for component names: `InvitationCard`
- Use camelCase for variables and functions: `handleCreateInvitation`
- Use SCREAMING_SNAKE_CASE for constants: `MAX_GUESTS_PER_INVITATION`

## Database and Data Fetching

### Supabase Patterns
- Use custom hooks from feature packages for data fetching
- Implement proper error handling and loading states
- Use React Query for caching and synchronization
- Follow RLS (Row Level Security) patterns for data access
- Generate types after schema changes: `pnpm run supabase:web:typegen`

### Database Operations
- Use typed queries with generated types
- Implement proper error handling for database operations
- Use transactions for complex operations
- Follow the established RLS policies

## UI and Styling

### Tailwind CSS
- Use Tailwind CSS v4 for styling
- Follow mobile-first responsive design principles
- Use the established color palette and spacing scale
- Prefer utility classes over custom CSS

### Component Library
- Use Shadcn UI components from `packages/ui/src/shadcn/`
- Extend with custom Makerkit components from `packages/ui/src/makerkit/`
- Follow the established design system patterns
- Ensure accessibility compliance

## Security and Authentication

### Authentication Flow
- Use Supabase Auth for all authentication
- Implement proper session management
- Use middleware for route protection
- Handle MFA flows properly

### Data Security
- Follow RLS policies for data access
- Use proper CSRF protection
- Implement secure guest code generation
- Validate all user inputs with Zod schemas

## PWA Implementation

### Service Worker
- Maintain offline functionality
- Implement background sync for RSVP submissions
- Handle app installation prompts
- Ensure proper caching strategies

### Responsive Design
- Mobile-first approach for all components
- Test on various screen sizes
- Ensure touch-friendly interactions
- Optimize for mobile performance

## Testing and Quality

### Code Quality
- Run type checking: `pnpm run typecheck`
- Use linting: `pnpm run lint`
- Format code: `pnpm run format:fix`
- Write meaningful commit messages

### Testing Strategy
- Use Playwright for E2E tests
- Test critical user flows
- Verify authentication and RSVP flows
- Test PWA functionality

## Development Workflow

### Getting Started
1. Install dependencies: `pnpm install`
2. Start Supabase: `pnpm run supabase:web:start`
3. Run development server: `pnpm run dev`
4. Generate types: `pnpm run supabase:web:typegen`

### Common Commands
- Build: `pnpm run build`
- Type check: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Format: `pnpm run format:fix`
- Test: `pnpm --filter e2e test`

### Database Migrations
- Create migration: `pnpm --filter web supabase migration new <name>`
- Use timestamped names for migrations
- Generate types after schema changes

## Key Features and Patterns

### Invitation System
- Complete CRUD operations for invitations
- Template system with design configurations
- Image support with preview functionality
- Guest management with unique codes

### RSVP System
- Anonymous guest lookup with secure codes
- Comprehensive RSVP forms with validation
- Real-time response tracking
- Plus-one management

### Dashboard
- Real-time statistics and tracking
- Invitation management interface
- Guest list management
- RSVP response monitoring

## Error Handling and Debugging

### Error Patterns
- Use proper error boundaries
- Implement fallback UI states
- Log errors appropriately
- Provide meaningful error messages to users

### Debugging
- Use React DevTools for component debugging
- Use browser network tab for API debugging
- Check Supabase dashboard for database issues
- Use console logging sparingly in production

## Performance Optimization

### Code Splitting
- Use dynamic imports for large components
- Implement proper loading states
- Optimize bundle sizes
- Use React.lazy() for code splitting

### Data Fetching
- Implement proper caching strategies
- Use React Query for data synchronization
- Minimize unnecessary re-renders
- Optimize database queries

## Best Practices

### Code Organization
- Keep components focused and single-purpose
- Use custom hooks for complex logic
- Implement proper separation of concerns
- Follow the established architecture patterns

### Documentation
- Document complex logic with comments
- Keep README files updated
- Document API endpoints and schemas
- Maintain clear commit history

### Collaboration
- Use descriptive commit messages
- Follow the established coding standards
- Review code changes thoroughly
- Maintain backward compatibility when possible

## Environment and Configuration

### Environment Variables
- Use proper environment variable naming
- Document required environment variables
- Use different configs for different environments
- Never commit sensitive information

### Configuration Files
- Keep configuration centralized
- Use TypeScript for configuration when possible
- Document configuration options
- Maintain environment-specific configs

Remember: This is a production-ready application with comprehensive features. When making changes, ensure they align with the established patterns and don't break existing functionality. Always test changes thoroughly, especially authentication and RSVP flows.