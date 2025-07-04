# TypeScript Rules

## Type Safety
- Use strict TypeScript configuration
- Prefer explicit typing over `any`
- Use proper type imports: `import type { ... } from '...'`
- Define interfaces for all component props and API responses
- Use Zod schemas for validation and type inference

## Database Types
- Always use generated types from Supabase: `pnpm run supabase:web:typegen`
- Import database types from `@kit/supabase/database.types`
- Use proper typing for database queries and responses
- Implement type-safe database operations

## Component Typing
- Define proper prop interfaces for all components
- Use generic types for reusable components
- Type event handlers correctly
- Use proper typing for React hooks (useState, useEffect, etc.)

## API and Data Fetching
- Type all API responses and requests
- Use typed React Query hooks
- Implement proper error type handling
- Type custom hooks with proper return types