# Security Rules

## Authentication Security
- Use Supabase Auth for all authentication flows
- Implement proper session management and validation
- Handle MFA flows securely
- Use middleware for route protection
- Never expose sensitive authentication tokens

## Data Security
- Follow RLS (Row Level Security) policies for all data access
- Validate all user inputs with Zod schemas
- Implement proper CSRF protection
- Use secure guest code generation for anonymous access
- Never log sensitive information

## Input Validation
- Validate all user inputs on both client and server
- Use Zod schemas for consistent validation
- Sanitize user-generated content
- Implement rate limiting where appropriate
- Handle file uploads securely

## API Security
- Protect all API endpoints appropriately
- Use proper HTTP methods and status codes
- Implement request validation
- Handle errors securely without exposing sensitive information
- Use HTTPS for all communications

## Database Security
- Use parameterized queries to prevent SQL injection
- Implement proper RLS policies
- Audit database access patterns
- Use least privilege principles for database access
- Regularly review and update security policies