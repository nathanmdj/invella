# React and Next.js Rules

## App Router Patterns
- Use App Router (`app/` directory) for all new routes
- Prefer Server Components when possible
- Mark Client Components with `'use client'` directive
- Use proper file naming: `page.tsx`, `layout.tsx`, `loading.tsx`

## Component Patterns
- Use functional components with hooks
- Implement proper prop interfaces
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use custom hooks for complex logic

## Data Fetching
- Use React Query (`@tanstack/react-query`) for client-side data fetching
- Implement proper loading states and error handling
- Use custom hooks from feature packages
- Handle loading, error, and success states properly

## State Management
- Use React Query for server state
- Use React hooks for local component state
- Use context for shared state when necessary
- Avoid prop drilling with proper state management

## Performance
- Use React.memo() for expensive components
- Implement proper key props for lists
- Use dynamic imports for code splitting
- Optimize re-renders with proper dependency arrays