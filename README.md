Dog Painters – AI Dog Portraits

Overview
- Upload one or multiple photos of your dog and generate AI-stylized portraits in famous artist sub-styles.
- Built with Next.js (App Router), React, Tailwind.
- OpenAI Images API (gpt-image-1 via images/edits) for image-to-image stylization.
- Optional Supabase Storage for hosting generated images.

Getting Started
1) Install deps
   npm install

2) Configure env
   cp .env.example .env
   - Set OPENAI_API_KEY
   - Optionally set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) and SUPABASE_BUCKET

3) Run dev server
   npm run dev

Build & Deploy (Vercel)
- Add the following env vars in Vercel Project Settings → Environment Variables:
  - OPENAI_API_KEY
  - NEXT_PUBLIC_SUPABASE_URL (optional)
  - SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)
  - SUPABASE_BUCKET (optional, default: dog-painters)
- Deploy via Git integration or `vercel` CLI.

Firebase Setup
- Create a Firebase project and enable:
  - Authentication: Google (and/or Email) provider
  - Firestore: production mode
  - Storage: default bucket
- Create a Web App in Firebase console; copy client config into env:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- Create a service account (Firebase Admin SDK), generate a JSON key, and set env:
  - `FIREBASE_SERVICE_ACCOUNT` = raw JSON contents (stringified)
  - `FIREBASE_STORAGE_BUCKET` = your bucket, e.g. `your-project-id.appspot.com`

Recommended Security Rules (adjust for your needs)
- Firestore: allow read on `gallery`, restrict write to authenticated users.
  service cloud.firestore {
    match /databases/{database}/documents {
      match /gallery/{docId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
- Storage: files are made public by the server after upload. You can keep default rules restricting write to server only (via admin). Client does not upload generated images directly.

Notes
- Generation can take ~30–60 seconds. The UI shows a loading message.
- You can select multiple sub-styles across artists. The API will produce all combinations per uploaded image.
- Results are returned as base64 data URLs for immediate preview and download. When Supabase is configured, results are also uploaded to a public bucket and a `publicUrl` is returned.

Dog Art Style Library
- See src/lib/styles.ts for the modular library and prompt mappings.
- Add new artists or sub-styles by extending the array; the UI renders dynamically.

Security & Production
- The API route runs on Node.js runtime and calls OpenAI Images Edits endpoint.
- Validate and limit input in production (e.g., file size, allowed MIME types, concurrency limits).
- Consider adding authentication (Supabase Auth) to restrict usage and add a gallery; store job records and metadata in your DB.

Stretch Ideas
- Style bundles: pre-define selection sets on the client.
- Public gallery: save records with original hash, selection set, generated URLs.
- Batch mode: allow multiple dogs and queue jobs in a background worker or long-running function.
