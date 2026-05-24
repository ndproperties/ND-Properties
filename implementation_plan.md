# Implementation Plan - Dynamic Admin Panel & Firebase CMS Backend

This plan outlines the architecture, database schema, and components required to build a secure Admin Panel and CMS for **ND Properties**. 

---

## Technical Stack Recommendation
1. **Frontend**: React 19 + TypeScript + Tailwind CSS v4 (matching the current code).
2. **Database (Backend)**: **Firebase Cloud Firestore** (for real-time listings CRUD & global copy management).
3. **Media Storage**: **Firebase Cloud Storage** (for uploading and hosting property images).
4. **Authentication**: **Firebase Authentication** (Email/Password) for a single, pre-configured master admin account.

---

## Database Schemas (Firestore Collections)

### 1. `site_content` Collection
Stores global copy, images, and description texts.
* **Document**: `global`
```json
{
  "heroTitle": "Find Your Dream Residence",
  "heroSubtitle": "Explore elite residential properties, premium villas, and smart studios curated specifically around modern layouts in prime localities.",
  "aboutTitle": "Our Legacy of Excellence",
  "aboutText": "Our multi-national escrow and styling teams stand ready to guide your portfolio expansion...",
  "contactEmail": "hello@ndproperties.com",
  "contactPhone": "+880 1234 567890",
  "contactLoungeBE": "Beverly Hills",
  "contactLoungeZH": "Zurich",
  "contactLoungeDK": "Dhaka"
}
```

### 2. `properties` Collection
Stores property listings.
```json
{
  "title": "Zenith Luxury Penthouse",
  "type": "Penthouse",
  "priceLakhs": 85.0,
  "priceDisplay": "₹85 Lakhs",
  "range": "60-150",
  "beds": 3,
  "baths": 3,
  "sqft": 2200,
  "location": "Indiranagar, Bangalore",
  "images": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
  ],
  "rating": 4.9,
  "features": ["Private Elevator", "Home Theater", "Premium Woodwork"],
  "description": "Exquisite high-rise penthouse featuring panoramic views, floor-to-ceiling glass..."
}
```

---

## Proposed Changes

### 1. Core Firebase Extensions (`src/lib/googleAuth.ts`)
- Add exports for Firebase Storage (`getStorage`) to enable image uploads.
- Provide a helper function to sign in as Admin with Email/Password.

### 2. CMS Copy Fetching & Storage
- Create a configuration init helper that seeds default content to `site_content/global` and copies `INITIAL_PROPERTIES` to the `properties` collection in Firestore if the database is empty.
- Update `src/App.tsx` and UI views (`HomeView`, `ListingsView`, `AboutView`, `ContactView`) to subscribe to Firestore database updates dynamically (meaning any Admin change renders in real-time on client browsers).

### 3. [NEW] [src/components/AdminPanel.tsx](file:///C:/Users/Dipanjan/.gemini/antigravity/scratch/ND-Properties-2026-05-25-a1dbf/src/components/AdminPanel.tsx)
Create a new Admin Panel component containing:
- **Login screen**: Prompts for pre-configured master admin credentials.
- **Copy Editor (CMS)**: Text inputs for hero section copy, about copy, contact details, lounge locations.
- **Properties CRUD Manager**:
  - Add property listing (inputs for title, location, specs, features, description, budget range).
  - Multi-image URL uploader list or direct base64 image asset storage (to render carousels on the frontend).
  - Edit or delete existing properties.
- **Showings/Bookings Viewer**: Displays live scheduled tours in a tabular format.

### 4. Dynamic Image Carousel (`src/components/PropertyDetailModal.tsx`)
- Update the property detail modal to render a sliding image carousel using the array of images saved by the Admin in the Firestore property document, replacing the static single-image layout.

---

## Verification Plan

### Automated Build Verification
- Execute `npm run build` to verify compilation.

### Manual Verification
- Open the application. Go to the Admin route (`#admin` or through a hidden link in the Footer).
- Log in with the pre-set credentials.
- Edit the main heading, save, and check if the home page instantly updates.
- Create a new property listing with multiple image URLs. Verify that the listings view renders it and opening the details modal triggers a functioning image carousel.
