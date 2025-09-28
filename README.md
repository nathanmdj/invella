# Invella - Digital Invitations & RSVP

Create beautiful digital invitations and manage RSVPs effortlessly with this modern PWA web application. 

🎉 **Perfect for any event:**
- Weddings and engagements
- Birthday parties and celebrations
- Corporate events and meetings
- Anniversaries and special occasions

✨ **Key Features:**
- Mobile-first PWA with offline capabilities
- Beautiful template gallery with customization
- Real-time RSVP tracking and guest management
- QR codes and social media sharing
- Anonymous guest access via secure codes
- Professional responsive design

## What's Included

### Core Architecture
- 🏗️ Next.js 15 + Turborepo monorepo with PWA support
- 🎨 Shadcn UI components with TailwindCSS v4
- 🔐 Supabase authentication & invitation database
- 🌐 i18n translations (client + server)
- ✨ Full TypeScript + ESLint v9 + Prettier configuration
- 📱 Service Worker with offline capabilities

### Invitation Features
- 📧 Digital invitation creation with templates
- 👥 Guest list management and CSV import
- 📊 Real-time RSVP tracking and analytics
- 🎨 Beautiful template gallery (wedding, birthday, corporate)
- 📱 QR code generation and sharing
- 🔗 Social media integration (WhatsApp, Facebook, Twitter)
- 💬 Guest messaging and dietary restrictions
- ➕ Plus-one management

### Technical Features
- 👤 User authentication and account management
- ⚙️ User profile & settings
- 🔒 Protected routes with RLS policies
- 🎯 E2E test setup with Playwright
- 🔄 Offline RSVP with background sync
- 📲 PWA installation prompts

### Technologies

Built with modern web technologies for optimal performance and user experience:

🛠️ **Technology Stack**:
- [Next.js 15](https://nextjs.org/): React framework with App Router and PWA support
- [Tailwind CSS v4](https://tailwindcss.com/): Utility-first CSS framework for responsive design
- [Supabase](https://supabase.com/): Backend with authentication, database, and real-time subscriptions
- [TypeScript](https://www.typescriptlang.org/): Type-safe development with strict configuration
- [Turborepo](https://turborepo.org/): Monorepo management with caching and parallel execution
- [Shadcn UI](https://shadcn.com/): Beautiful, accessible components built with Radix UI
- [React Query](https://tanstack.com/query/v5): Data fetching, caching, and synchronization
- [React Hook Form](https://react-hook-form.com/): Performant forms with easy validation
- [Zod](https://github.com/colinhacks/zod): Runtime type validation and schema parsing
- [date-fns](https://date-fns.org/): Modern date utility library
- [Playwright](https://playwright.dev/): End-to-end testing framework

🎨 **Design Features**:
- Responsive mobile-first design
- Dark/light mode support
- Beautiful animations and transitions
- Accessible components (WCAG compliant)
- Print-friendly QR codes

## Use Cases

Perfect for event organizers, wedding planners, and anyone hosting gatherings:

**Personal Events:**
- Wedding invitations with RSVP tracking
- Birthday party planning and coordination
- Anniversary celebrations
- Baby showers and housewarming parties

**Professional Events:**
- Corporate meeting invitations
- Conference and workshop registration
- Team building events
- Product launch parties

**Features in Development:**
- 📧 Email invitation sending
- 📱 SMS notifications and reminders
- 📊 Advanced analytics and insights
- 💳 Premium template marketplace
- 👥 Multi-user event management
- 🔔 Real-time notification system
- 📤 Bulk guest import improvements
- 🎨 Custom branding options

## Getting Started

### Prerequisites

- Node.js 18.x or later (preferably the latest LTS version)
- Docker
- PNPM

Please make sure you have a Docker daemon running on your machine. This is required for the Supabase CLI to work.

### Installation

#### 1. Clone this repository

```bash
git clone <repository-url>
cd invella
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Start Supabase

Please make sure you have a Docker daemon running on your machine.

Then run the following command to start Supabase:

```bash
pnpm run supabase:web:start
```

Once the Supabase server is running, please access the Supabase Dashboard using the port in the output of the previous command. Normally, you find it at [http://localhost:54323](http://localhost:54323).

You will also find all the Supabase services printed in the terminal after the command is executed.

##### Stopping Supabase

To stop the Supabase server, run the following command:

```bash
pnpm run supabase:web:stop
```

##### Resetting Supabase

To reset the Supabase server, run the following command:

```bash
pnpm run supabase:web:reset
```

##### More Supabase Commands

For more Supabase commands, see the [Supabase CLI documentation](https://supabase.com/docs/guides/cli).

```
# Create new migration
pnpm --filter web supabase migration new <name>

# Link to Supabase project
pnpm --filter web supabase link

# Push migrations
pnpm --filter web supabase db push
```

#### 4. Start the Next.js application

```bash
pnpm run dev
```

The application will be available at http://localhost:3000.

#### 5. Code Health (linting, formatting, etc.)

To format your code, run the following command:

```bash
pnpm run format:fix
```

To lint your code, run the following command:

```bash
pnpm run lint
```

To validate your TypeScript code, run the following command:

```bash
pnpm run typecheck
```

Turborepo will cache the results of these commands, so you can run them as many times as you want without any performance impact.

## Project Structure

The project is organized into the following folders:

```
apps/
├── web/                  # Next.js application
│   ├── app/             # App Router pages
│   │   ├── (marketing)/ # Public marketing pages
│   │   ├── auth/        # Authentication pages
│   │   └── home/        # Protected app pages
│   ├── supabase/        # Database & migrations
│   └── config/          # App configuration
│
packages/
├── ui/                  # Shared UI components
└── features/           # Core feature packages
    ├── auth/           # Authentication logic
    └── ...
```

For more information about this project structure, see the article [Next.js App Router: Project Structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure).

### Environment Variables

You can configure the application by setting environment variables in the `.env.local` file.

Here are the available variables:

| Variable Name | Description | Default Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The URL of your invitation app | `http://localhost:3000` |
| `NEXT_PUBLIC_PRODUCT_NAME` | The name of your app | `Invella` |
| `NEXT_PUBLIC_SITE_TITLE` | The title of your app | `Invella - Digital Invitations & RSVP` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | The description of your app | `Create beautiful digital invitations and manage RSVPs effortlessly` |
| `NEXT_PUBLIC_DEFAULT_THEME_MODE` | The default theme mode | `light` |
| `NEXT_PUBLIC_THEME_COLOR` | The default theme color | `#6366f1` |
| `NEXT_PUBLIC_THEME_COLOR_DARK` | The theme color in dark mode | `#4f46e5` |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anon key of your Supabase project | '' |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key of your Supabase project | '' |

## Architecture

Invella uses a modern monorepo architecture for scalability and maintainability:

```
apps/
├── web/                    # Next.js PWA application
│   ├── app/               # App Router pages
│   │   ├── (marketing)/   # Public pages
│   │   ├── auth/          # Authentication
│   │   ├── home/create/   # Multi-step invitation creation form
│   │   ├── invite/        # Full-screen invitation display with template rendering
│   │   ├── dashboard/     # Admin dashboard for invitation management
│   │   ├── home/          # Main user dashboard with statistics
│   │   └── offline/       # PWA offline page
│   ├── supabase/          # Database schema & migrations
│   ├── public/            # Static assets & PWA files
│   └── components/        # App-specific components
│
├── e2e/                   # End-to-end tests
│
packages/
├── features/              # Feature packages
│   ├── invitations/       # Invitation management
│   ├── rsvp/             # RSVP system
│   ├── auth/             # Authentication
│   └── accounts/         # User accounts
├── ui/                    # Shared UI components
├── supabase/             # Database client & types
├── shared/               # Shared utilities
└── i18n/                 # Internationalization
```

### Key Features & Packages

**@kit/invitations Package:**
- Complete invitation CRUD operations with multi-step creation flow
- Template system with visual frames and customization
- Guest list management with bulk operations and status tracking
- Real-time invitation analytics and statistics
- Share functionality with QR codes and social media integration
- Image upload and management for invitation backgrounds

**@kit/rsvp Package:**
- Anonymous guest lookup by secure codes with validation
- Comprehensive RSVP forms with dietary restrictions and plus-ones
- Public invitation viewing with full-screen template rendering
- Offline RSVP with background sync for PWA support
- Real-time response tracking and status management

**Authentication & Routes:**
- Complete Supabase authentication with `@kit/auth` and MFA support
- Protected dashboard pages for invitation management and analytics
- Public invitation and RSVP pages with anonymous access
- Mobile-first responsive design with PWA capabilities
- Multi-factor authentication with challenge verification
- Account management with profile updates and security settings

### Database Schema

The invitation database includes:

**Core Tables:**
- `invitations` - Event details, templates, and metadata
- `guests` - Guest lists with unique access codes
- `rsvp_responses` - Guest responses with preferences
- `invitation_templates` - Reusable design templates
- `accounts` - User accounts (inherited from auth system)

**Key Features:**
- Row Level Security (RLS) for data protection
- Guest codes for secure anonymous RSVP access
- Real-time subscriptions for live updates
- Storage buckets for invitation images

#### Database Commands

Create a new migration:
```bash
pnpm --filter web supabase migration new <migration-name>
```

Apply migrations and reset database:
```bash
pnpm run supabase:web:reset
```

Generate TypeScript types:
```bash
pnpm run supabase:web:typegen
```

#### Linking the Supabase database

Linking the local Supabase database to the Supabase project is done by running the following command:

```bash
pnpm --filter web supabase db link
```

This command will link the local Supabase database to the Supabase project.

#### Pushing the migration to the Supabase project

After you have made changes to the migration, you can push the migration to the Supabase project by running the following command:

```bash
pnpm --filter web supabase db push
```

This command will push the migration to the Supabase project. You can now apply the migration to the Supabase database.

## Going to Production

#### 1. Create a Supabase project

To deploy your application to production, you will need to create a Supabase project.

#### 2. Push the migration to the Supabase project

After you have made changes to the migration, you can push the migration to the Supabase project by running the following command:

```bash
pnpm --filter web supabase db push
```

This command will push the migration to the Supabase project.

#### 3. Set the Supabase Callback URL

When working with a remote Supabase project, you will need to set the Supabase Callback URL.

Please set the callback URL in the Supabase project settings to the following URL:

`<url>/auth/callback`

Where `<url>` is the URL of your application.

#### 4. Deploy to Vercel or any other hosting provider

You can deploy your application to any hosting provider that supports Next.js.

#### 5. Deploy to Cloudflare

The configuration should work as is, but you need to set the runtime to `edge` in the root layout file (`apps/web/app/layout.tsx`).

```tsx
export const runtime = 'edge';
```

Remember to enable Node.js compatibility in the Cloudflare dashboard.

## Development Status

**✅ Completed Features:**
- PWA configuration with offline support and service worker
- Complete database schema with RLS policies and real-time subscriptions
- Full invitation management system with creation, editing, and sharing
- Anonymous RSVP system with guest code lookup
- Real-time dashboard with live statistics and tracking
- Template system with visual frames and customization
- Mobile-first responsive design with beautiful UI
- Guest management with bulk operations and status tracking
- Public invitation pages with full-screen template rendering
- Complete authentication system with MFA support

**🚧 In Development:**
- Email and SMS notifications
- Advanced analytics and reporting
- Template customization tools
- Mobile app (React Native)

## Contributing

Contributions are welcome! Please open an issue first to discuss your ideas before making a pull request.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes following existing patterns
4. Run tests: `pnpm run test`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Roadmap

**Short Term:**
- Complete web page implementation
- Email invitation delivery
- Advanced template customization
- Mobile app (React Native)

**Long Term:**
- Multi-language support
- Premium template marketplace
- Event analytics dashboard
- Integration with calendar apps
