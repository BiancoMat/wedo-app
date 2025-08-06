# Overview

WeDo is a credit-based favor exchange web application that connects users to request and offer favors within their communities. The app features a hippy-themed design with Italian interface and operates on a strict credit system where every favor costs 1 credit to publish. Users can create groups, manage notifications, and track their favor history and completion statistics through an intuitive interface.

## Recent Changes (January 2025)
- Updated Firebase configuration to use real wedo-91064 project credentials
- Implemented strict 1-credit-per-favor publishing rule with suspension logic
- Removed star rating system in favor of simple favor completion counts
- Added data storage abstraction layer for future Firestore migration
- Enhanced credit management with automatic request suspension/reactivation

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18 with TypeScript**: Modern functional components using hooks for state management
- **Vite**: Fast development server and build tool for optimal performance
- **Wouter**: Lightweight client-side routing solution for single-page application navigation
- **TanStack Query**: Server state management for caching and synchronizing data
- **Shadcn/UI**: Component library built on Radix UI primitives for consistent design system
- **Tailwind CSS**: Utility-first CSS framework with custom WeDo color scheme

## State Management
- **React Context API**: Application-wide state management for user data, favors, groups, and notifications
- **Local Storage**: Client-side persistence for user preferences and cached data
- **Custom Hooks**: Reusable logic for authentication, local storage, and mobile responsiveness

## Authentication System
- **Firebase Authentication**: Email/password authentication with automatic session management
- **Protected Routes**: Route-level authentication guards that redirect unauthenticated users
- **User Context**: Centralized user state management with automatic Firebase user synchronization

## Backend Architecture
- **Express.js**: RESTful API server with middleware for logging and error handling
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **In-Memory Storage**: Development storage implementation with interface for easy database migration
- **Modular Storage Interface**: Abstracted storage layer supporting multiple implementations

## Database Schema
- **Users**: Email-based user profiles with credit tracking
- **Favors**: Request/offer system with status tracking, location preferences, and credit values
- **Groups**: Public/private groups with different management types (equal, founder, admin)
- **Group Members**: Role-based membership system
- **Notifications**: Type-based notification system for group requests and favor updates

## Component Design
- **Card-Based UI**: Consistent card components for favors, groups, and notifications
- **Responsive Layout**: Mobile-first design with collapsible sidebar navigation
- **Form Management**: React Hook Form integration with Zod validation
- **Modal Dialogs**: Radix UI-based modal system for forms and confirmations

## Development Environment
- **Hot Module Replacement**: Fast development iteration with Vite HMR
- **TypeScript Strict Mode**: Type safety across frontend and backend
- **ESM Modules**: Modern JavaScript module system throughout the stack
- **Path Aliases**: Clean import statements with @ and @shared prefixes

# External Dependencies

## Authentication & Backend Services
- **Firebase**: User authentication and session management
- **Neon Database**: PostgreSQL database hosting (configured via DATABASE_URL)

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

## Development Tools
- **Vite**: Build tool and development server
- **TanStack React Query**: Server state management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **date-fns**: Date manipulation utilities

## Database & ORM
- **Drizzle ORM**: Type-safe database toolkit
- **Drizzle Kit**: Database migration and schema management
- **PostgreSQL**: Primary database system via Neon serverless driver

## Build & Deployment
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS
- **TSX**: TypeScript execution for development server