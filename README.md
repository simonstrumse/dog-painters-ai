# Dog Painters AI – AI Dog Portraits 🎨🐕

> **v2.0 - Enhanced Design & Stability!** ✨

Upload photos of your dog and generate AI-stylized portraits in famous artist styles using OpenAI's powerful image generation API. Now with improved design, enhanced error handling, and rock-solid production stability.

## 🚀 Live Demo

**Production App**: https://dog-painters-739kpxmea-simonstrumses-projects.vercel.app

> 🆕 **What's New in v2.0**: Enhanced UI design patterns, bulletproof SSR support, improved authentication flow, and production-grade error handling.

## ✨ Features

- 🖼️ **Upload multiple dog photos** for batch processing
- 🎨 **20+ Artist styles** with 80+ sub-styles (Picasso, Van Gogh, Monet, Warhol, etc.)
- 🤖 **AI-powered transformations** using OpenAI Images API (gpt-image-1)
- 🔐 **Firebase Authentication** (Google + Email/Password)
- 📱 **Mobile responsive** design with Tailwind CSS
- 💾 **Firebase Storage** for generated images
- 🖥️ **Real-time progress** tracking during generation
- 📋 **Personal gallery** for authenticated users
- ⬇️ **HD downloads** of generated portraits
- 🛡️ **Enhanced error handling** with graceful fallbacks
- 🏗️ **Server-side rendering** safe Firebase integration
- ✨ **Improved design patterns** from museum branch integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **AI**: OpenAI Images API
- **Deployment**: Vercel

## 🚨 Requirements

**⚠️ Important: You need a verified OpenAI API account with billing enabled to use this app.**

- OpenAI API access with image generation capabilities
- Verified OpenAI account (required for image APIs)
- Firebase project with Authentication, Firestore, and Storage enabled
- Vercel deployment (or similar hosting)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/simonstrumse/dog-painters-ai.git
   cd dog-painters-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   **Required Environment Variables:**
   ```env
   # OpenAI API (REQUIRED - must have verified billing account)
   OPENAI_API_KEY=sk-proj-...
   
   # Firebase Client Config
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   
   # Firebase Admin (Server-side)
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   FIREBASE_STORAGE_BUCKET=...
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🎨 Dog Art Style Library

The app includes a comprehensive library of **20+ artists** with **80+ sub-styles**:

- **Pablo Picasso**: Blue Period, Rose Period, Analytical Cubism, Synthetic Cubism, Line Sketches
- **Vincent van Gogh**: Starry Night, Sunflowers, Arles Portraits, Early Dutch, Japanese-Inspired
- **Salvador Dalí**: Classic Surrealism, Paranoiac-Critical, Religious Phase, Animal Hybrids
- **Andy Warhol**: Marilyn Silkscreens, Commercial Flat, Sketches
- **Claude Monet**: Water Lilies, Haystacks, Urban Impressionism
- **And many more!** See `src/lib/styles.ts` for the complete library.

## 🏗️ Architecture

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── generate/   # Main image generation
│   │   │   └── my-gallery/ # User gallery
│   │   ├── gallery/        # Public gallery page
│   │   └── my/             # User's personal gallery
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AuthButtons.tsx # Authentication
│   │   ├── StylePicker.tsx # Artist style selection
│   │   └── UploadDropzone.tsx # File upload
│   ├── lib/               # Utilities
│   │   ├── firebaseClient.ts  # Client Firebase config
│   │   ├── firebaseAdmin.ts   # Server Firebase config
│   │   ├── firebaseStorage.ts # Storage utilities
│   │   └── styles.ts          # Complete style library
│   └── types.ts           # TypeScript definitions
├── firebase.json          # Firebase configuration
└── firestore.indexes.json # Required Firestore indexes
```

## 🔧 Firebase Setup

1. **Create Firebase Project**
   ```bash
   firebase projects:create your-project-name
   ```

2. **Enable Services**
   - Authentication (Google + Email providers)
   - Firestore Database (production mode)  
   - Storage (default bucket)

3. **Create Web App & Service Account**
   ```bash
   firebase apps:create web "Your App Name"
   gcloud iam service-accounts create firebase-admin
   gcloud iam service-accounts keys create firebase-key.json --iam-account=firebase-admin@your-project.iam.gserviceaccount.com
   ```

## 🚀 Deployment

**Vercel (Recommended)**
```bash
vercel --prod
# Add all environment variables via Vercel CLI or dashboard
```

**Environment Variables Required:**
- All Firebase config variables (see `.env.example`)
- `OPENAI_API_KEY` (with verified billing account)

**Add Authorized Domains:**
Add your Vercel domain to Firebase Auth authorized domains in the Firebase Console.

## 🔒 Security Rules

**Firestore Rules:**
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /gallery/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📝 Usage Notes

- Generation takes ~30–60 seconds with real-time progress tracking
- Select multiple sub-styles across artists for variety
- Results include base64 previews + Firebase Storage URLs
- HD downloads available for all generated images
- Personal gallery requires authentication

## 📈 Version History

### v2.0 - Enhanced Design & Stability (Current)
- ✨ **Improved UI design patterns** from museum branch integration
- 🛡️ **Enhanced error handling** with null-safe Firebase client
- 🏗️ **Server-side rendering** safe Firebase integration
- 🔧 **Production stability** improvements
- 🚀 **Bulletproof deployment** process with Vercel

### v1.0 - Production Ready
- 🎯 **Core functionality** complete with 20+ artist styles
- 🔥 **Firebase integration** (Auth, Firestore, Storage)
- 🤖 **OpenAI Images API** integration
- 📱 **Mobile responsive** design
- 🚀 **Vercel deployment** setup

## 🔮 Future Enhancements

- **Style bundles**: Pre-defined style combinations
- **Public gallery**: Community sharing features  
- **Batch processing**: Multiple dogs in one session
- **Custom styles**: User-defined style training

## 📞 Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/simonstrumse/dog-painters-ai/issues).

---

**Built with ❤️ using Claude Code and the power of AI** 🤖✨
