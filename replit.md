# Overview

SystemOS is a gamified habit tracker application that transforms daily routine management into an RPG-like experience. Users create accounts, complete daily missions (like brushing teeth, exercising, taking showers), earn XP, level up, and allocate stat points to character attributes. The application features a Hunter x Hunter anime-inspired UI theme with cyberpunk aesthetics, providing an engaging way to build and maintain healthy habits through game mechanics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18 + TypeScript**: Component-based UI with strong typing
- **Vite**: Build tool and development server for fast hot module replacement
- **Wouter**: Lightweight client-side routing (no React Router dependency)
- **TanStack Query**: Server state management with caching and background updates
- **Shadcn/ui + Radix UI**: Modern component library with accessibility features
- **Tailwind CSS**: Utility-first styling with custom cyberpunk theme variables
- **Font Integration**: Google Fonts (Orbitron, Inter, JetBrains Mono) for futuristic aesthetics

## Backend Architecture
- **Express.js**: RESTful API server with middleware support
- **TypeScript**: Full-stack type safety with shared schema definitions
- **Session-based Authentication**: Express-session with memory store for user sessions
- **Bcrypt**: Password hashing for secure authentication
- **In-memory Storage**: Custom storage implementation for development (easily replaceable with database)
- **Shared Schema**: Common type definitions between client and server using Zod validation

## Data Storage Solutions
- **Development**: In-memory storage with predefined missions and user data
- **Production Ready**: Drizzle ORM configured for PostgreSQL with Neon Database support
- **Local Persistence**: Browser localStorage for offline functionality and data resilience
- **Session Management**: Server-side sessions with configurable expiration

## Authentication and Authorization
- **Registration/Login**: Username/password authentication with duplicate checking
- **Session Management**: HTTP-only sessions with 24-hour expiration
- **Route Protection**: Middleware-based authentication for protected API endpoints
- **Password Security**: Bcrypt hashing with salt rounds for password storage

## User Experience Features
- **Progressive Enhancement**: Works offline with localStorage fallback
- **Responsive Design**: Mobile-first approach with adaptive navigation
- **Real-time Feedback**: Toast notifications for user actions and errors
- **Theme Consistency**: Custom CSS variables for cohesive visual experience
- **Accessibility**: Radix UI components ensure keyboard navigation and screen reader support

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **drizzle-kit**: Database migration and schema management tools

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library with React components

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management with caching, background updates, and error handling
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Form validation resolvers for schema integration

## Development and Build Tools
- **vite**: Fast build tool with HMR and optimized production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for server-side build process
- **tsx**: TypeScript execution for development server

## Authentication and Security
- **bcrypt**: Password hashing library with configurable salt rounds
- **express-session**: Session middleware for Express.js
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

## Date and Utility Libraries
- **date-fns**: Modern date utility library for date manipulation
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: URL-safe unique string ID generator