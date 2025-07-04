# Supabase and Database Rules

## Database Operations
- Use typed queries with generated types
- Implement proper error handling for all database operations
- Use transactions for complex operations that need atomicity
- Follow RLS (Row Level Security) policies for data access

## Query Patterns
- Use React Query for data fetching and caching
- Implement proper loading states and error handling
- Use custom hooks from feature packages
- Cache queries appropriately with React Query

## Authentication
- Use Supabase Auth for all authentication flows
- Implement proper session management
- Handle MFA flows correctly
- Use middleware for route protection

## RLS Policies
- Follow established RLS patterns
- Ensure data isolation between accounts
- Test RLS policies thoroughly
- Document security requirements

## Type Generation
- Run `pnpm run supabase:web:typegen` after schema changes
- Use generated types for all database operations
- Keep types synchronized with schema changes
- Import types from the correct packages

## Migrations
- Use timestamped migration names
- Create migrations with: `pnpm --filter web supabase migration new <name>`
- Test migrations thoroughly
- Document migration purpose and effects