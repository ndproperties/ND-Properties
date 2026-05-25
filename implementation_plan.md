# Implementation Plan - Transition from Firebase to Supabase

This plan details the migration of the **ND Properties** real estate platform's backend from **Firebase (Firestore + Auth)** to **Supabase (PostgreSQL + Auth + Realtime)**.

---

## User Review Required

> [!IMPORTANT]
> **Supabase Configuration & Credentials Required**:
> The user must provide a Supabase project URL and anon API key. These should be placed in environment variables:
> - `VITE_SUPABASE_URL`
> - `VITE_SUPABASE_ANON_KEY`
>
> **Supabase Auth Setup**:
> For admin panel authentication, the user should create the master admin account (`admin@ndproperties.com` / `AdminND2026!`) in the Supabase Dashboard: **Authentication -> Users -> Add User**.
>
> **Google OAuth Configuration**:
> To generate Google Meet links for showing walkthroughs, the user must configure Google OAuth inside their Supabase Dashboard (**Authentication -> Providers -> Google**) with the Client ID and Secret obtained from their Google Cloud Console, and add the callback URL provided by Supabase.

---

## Database Schemas (Supabase / PostgreSQL)

Run the following SQL queries in the **Supabase SQL Editor** to create the required tables and enable real-time replication:

```sql
-- 1. Create tables

-- Site Copy Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "aboutTitle" TEXT,
    "aboutText" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactLoungeBE" TEXT,
    "contactLoungeZH" TEXT,
    "contactLoungeDK" TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    "numericPrice" BIGINT NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    beds INTEGER DEFAULT 1,
    baths NUMERIC DEFAULT 1,
    sqft INTEGER DEFAULT 1000,
    featured BOOLEAN DEFAULT false,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    range TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    notes TEXT,
    "isMeetRequested" BOOLEAN DEFAULT false,
    "meetLink" TEXT,
    timestamp TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    "propertyId" TEXT,
    "propertyName" TEXT,
    timestamp TEXT NOT NULL,
    "createdAt" BIGINT NOT NULL
);

-- 2. Enable Realtime Replication for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
```

---

## Proposed Changes

### Configuration & Dependency Setup

#### [MODIFY] [package.json](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/package.json)
- Add `@supabase/supabase-js` dependency.
- Remove `firebase` dependency.

#### [NEW] [supabaseClient.ts](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/lib/supabaseClient.ts)
- Create a Supabase Client helper utilizing environment variables or a configuration JSON.

#### [NEW] [oauth-callback.html](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/public/oauth-callback.html)
- Create a static callback page in the `public` directory to receive Supabase OAuth parameters via URL hash, post them back to the parent window, and close the popup window.

### Code & Component Migrations

#### [MODIFY] [googleAuth.ts](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/lib/googleAuth.ts)
- Replace Firebase Auth methods with Supabase Auth:
  - `adminSignIn`: sign in using `supabase.auth.signInWithPassword`.
  - `googleSignIn`: opens `supabase.auth.signInWithOAuth` in a popup, listens to the postMessage event, sets the session, and returns the Google access token.
  - `logout`: signs out from Supabase auth.

#### [MODIFY] [dbSeeder.ts](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/lib/dbSeeder.ts)
- Replace Firestore batch writing and document getters with Supabase relational selects and bulk inserts.

#### [MODIFY] [App.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/App.tsx)
- Initialize database seeding on load.
- Sync global copywriting, listings, bookings, and inquiries in real-time by subscribing to Supabase Realtime Postgres channels.
- Replace Firestore insertions with `supabase.from().insert()`.

#### [MODIFY] [AdminPanel.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/AdminPanel.tsx)
- Re-route CMS settings saves to `supabase.from('site_content').upsert(...)`.
- Update property publishes/updates/deletes to Supabase API calls.

---

## Verification Plan

### Build Verification
- Execute `npm run build` using `npm.cmd` to confirm clean compilation and type safety.

### Functional Verification
- Navigate to `#admin` and login using your credentials.
- Update global titles and verify that home/about/contact views render changed strings instantly.
- Test adding, editing, and deleting listings, verifying database updates and carousel renders.
- Schedule a showings private tour, request a Google Meet space, authorize with Google (via popup), and verify that the virtual showing persists in the database.
