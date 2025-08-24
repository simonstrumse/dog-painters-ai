# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Architecture Overview

This is a Next.js 14 App Router application that generates AI-stylized dog portraits using OpenAI's image API. The app uses Firebase for authentication, database, and storage.

### Key Components Structure
- **Client Firebase**: `src/lib/firebaseClient.ts` - Client-side Firebase config for auth, Firestore, and storage
- **Admin Firebase**: `src/lib/firebaseAdmin.ts` - Server-side Firebase Admin SDK for secure operations  
- **Style Library**: `src/lib/styles.ts` - Modular artist style definitions and prompt mappings
- **API Routes**: 
  - `src/app/api/generate/route.ts` - Main image generation endpoint
  - `src/app/api/my-gallery/route.ts` - User gallery management

### Authentication & Storage
- Firebase Auth with Google provider configured
- Firebase Storage for image hosting with public URLs
- Firestore for gallery metadata and user data
- Admin SDK operations use service account credentials

### Image Generation Flow
1. Client uploads dog photo via `UploadDropzone` component
2. API route processes image with selected artist styles
3. OpenAI Images API (gpt-image-1) performs image-to-image stylization
4. Results stored in configured storage backend(s)
5. Gallery displays generated portraits with download options

## Environment Variables Required

### Firebase Client (all NEXT_PUBLIC_*)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID  
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)

### Firebase Admin
- FIREBASE_SERVICE_ACCOUNT (stringified JSON of service account key)
- FIREBASE_STORAGE_BUCKET

### Other APIs
- OPENAI_API_KEY