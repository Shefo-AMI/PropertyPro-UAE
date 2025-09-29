# Overview

PropertyPro is a SaaS web platform for property management designed for landlords and property managers. It provides a comprehensive solution for managing properties, tenants, units, maintenance requests, financial tracking, and calendar events. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and integrating AI assistance for user support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with React and TypeScript, using Vite as the build tool. The frontend follows a component-based architecture with:
- **UI Framework**: Custom component library built on top of Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Layout**: Responsive design with collapsible sidebar navigation

## Backend Architecture
The server is built with Express.js and TypeScript, providing:
- **API Structure**: RESTful API endpoints organized by resource type
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **File Structure**: Modular organization with separate route handlers, storage layer, and database configuration

## Database Design
PostgreSQL database with the following core entities:
- **Users**: Authentication and profile information
- **Companies**: Multi-tenant support for property management businesses
- **Properties**: Real estate properties with details and metadata
- **Units**: Individual rental units within properties
- **Tenants**: Tenant information and contact details
- **Tenancies**: Rental agreements linking tenants to units
- **Maintenance Requests**: Work orders and repair tracking
- **Invoices**: Financial records and billing
- **Calendar Events**: Scheduled events and reminders
- **Assistant Logs**: AI interaction history

## AI Integration
OpenAI GPT integration provides:
- **Assistant Widget**: Bottom-right floating chat interface
- **Contextual Help**: Property management specific responses
- **Maintenance Analysis**: Automated categorization and cost estimation
- **Conversation Logging**: Persistent chat history in the database

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting with serverless connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication & Security
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware with OpenID Connect strategy

## AI Services
- **OpenAI API**: GPT-5 model for AI assistant functionality and maintenance request analysis

## UI & Design
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library with Tailwind styling
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

## Development & Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire application
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Backend bundling for production deployment

## Data Validation
- **Zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation