# Walkthrough - ND Properties Implementation with Real-Time Supabase Sync

The implementation of the **ND Properties** premium real estate platform has been upgraded to utilize a Supabase backend (PostgreSQL + Auth + Real-Time Sync), optimized mobile layouts, and proper browser branding.

Additionally, we have implemented automated synchronization features so that modifications made in the backend (directly in Supabase, from the Admin Panel, or via other client sessions) are immediately reflected on the frontend.

## Files Created & Modified
All code is located in the project directory [C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/):

- [src/lib/supabaseClient.ts](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/lib/supabaseClient.ts): Configures and exports the Supabase client with fallback credentials for robust startup.
- [src/lib/googleAuth.ts](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/lib/googleAuth.ts) & [public/oauth-callback.html](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/public/oauth-callback.html): Handles Google Calendar integration and OAuth flow using a secure popup window.
- [src/App.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/App.tsx): Parent application that manages app state, implements real-time listeners for bookings/inquiries/properties/site copywriting, and runs a periodic 8-second polling scheduler to pull database updates from the backend without requiring manual page reloads.
- [src/components/AdminPanel.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/AdminPanel.tsx): Exposes management tabs for site copywriting, listings (CRUD operations), and bookings. Employs parent refresh triggers to update the website state instantly on save/delete/create.
- [index.html](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/index.html): Configures custom favicon, custom font typography, titles, descriptions, and Open Graph tags for SEO.
- [src/components/PropertyDetailModal.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/PropertyDetailModal.tsx) & [src/components/BookTodayModal.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/BookTodayModal.tsx): Refactored layouts to resolve mobile viewport overflow and container collapse issues.
- [src/components/HomeView.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/HomeView.tsx) & [src/components/ContactView.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/ContactView.tsx): Removed translation hacks and shadow lines on background pictures, aligning them to the top.
- [src/components/Navbar.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/Navbar.tsx): Removed the inset shadow white line from the header to provide a completely clean layout.

---

## Restructuring & Styling Improvements

### 1. Thin Line & Background Border Fixes
- Removed the inset white line shadow (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`) from the sticky navbar header container.
- Made the top padding of the `<main>` tag conditional in `App.tsx`: for `home` and `contact` tabs, padding-top is `pt-0` and the wrapper is full-bleed, allowing the background skyline pictures to touch the top of the viewport directly.
- Cleared the sticky navbar overlay height by using appropriate padding-top (`pt-32`) inside `HomeView.tsx` hero and `ContactView.tsx` wrapper.
- Removed `shadow-2xl` and translation constraints from backgrounds to prevent thin borders/visible white lines at the edges.

### 2. Contact View Layout Reorder
- Reordered elements in `ContactView.tsx` so that the "Give a call to our representative" call card, Email cards, and Location map block appear at the top.
- The "Get in touch" heading along with the inquiry form (Full Name, Email Address, and Project description textareas) is placed directly below the call section.

---

## Deployment & Verification
- Pushed changes to `main` branch.
- Production build verified using `powershell -ExecutionPolicy Bypass -Command "npm run build"`.
- Runs on Vercel dynamically linked to Supabase.
