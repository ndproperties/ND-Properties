# Implementation Plan - Real-Time Backend & Deployment for ND Properties

This plan details:
1. Implementing a **Real-Time Backend** using **Firebase Firestore**.
2. Integration of a **Live Schedule Feed** in the UI that updates in real-time across all clients.
3. Steps to push the codebase to **GitHub**.
4. Steps to deploy the project to **Vercel** and connect a **custom domain**.

---

## Backend Approach: Firebase Firestore (Serverless & Real-Time)
Instead of writing a custom node/express backend that requires separate server hosting, we will leverage **Firebase Cloud Firestore**. 
- **Why?** Firestore is serverless, free-tier friendly, integrates with our existing Firebase Auth, and supports native web socket listeners. When a user schedules a property walkthrough, the schedule is instantly written to Firestore, and all other open browser tabs will see the new tour appear in real-time.

---

## User Actions Required

> [!IMPORTANT]
> **Firebase Firestore Setup**: You will need to enable Cloud Firestore in your Firebase Console (under project `spring-dominion-mk9gj`).
> 1. Go to Firebase Console -> Build -> Firestore Database -> Create Database.
> 2. Start in **Test Mode** (or update security rules to allow writes only for authenticated users).

---

## Proposed Changes

### 1. Firebase Initialization (`src/firebase.ts`)
- Initialize Cloud Firestore (`getFirestore`).
- Export database reference (`db`).

### 2. Real-Time UI Integration (`src/App.tsx`)
- Add a new collection `walkthroughs` in Firestore.
- Add a **"Live Tour Feed"** sidebar or panel showing scheduled tours.
- Use Firestore's `onSnapshot` listener to subscribe to walkthrough updates. Whenever any user schedules a tour, it will render in real-time on all clients' screens.
- Replace local state booking simulation with real Firestore writes (`addDoc`).

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify compilation.

### Manual Verification
- Open the app in two separate browser windows (or an incognito tab).
- Sign in on one, schedule a walkthrough, and verify that the other window immediately displays the newly scheduled walkthrough in real-time without reloading.

---

## Step-by-Step Deployment Guide

### Part 1: Uploading to GitHub
You can use the **Sync to GitHub** button inside the AI Studio editor interface, or do it manually via terminal:
1. Open your terminal in the project directory: `C:\Users\Dipanjan\.gemini\antigravity\scratch\ND-Properties-2026-05-25-a1dbf`
2. Run the following Git commands:
   ```powershell
   git init
   git add .
   git commit -m "feat: real-time property listings and google meet walkthroughs"
   ```
3. Create a **new public or private repository** on [github.com](https://github.com/).
4. Link and push the repository:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Part 2: Deploying to Vercel
1. Sign up/Log in on [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project**.
3. Import the GitHub repository you just created.
4. Under **Environment Variables**, add the environment variables from your `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will automatically build the Vite project and host it.

### Part 3: Connecting Your Custom Domain
1. In your Vercel Project Dashboard, go to your project.
2. Navigate to **Settings** -> **Domains**.
3. Enter your custom domain (e.g. `ndproperties.in` or `properties.yourdomain.com`) and click **Add**.
4. Vercel will display the DNS records you need to configure at your domain registrar:
   - If using a subdomain (e.g. `app.domain.com`), add a `CNAME` record pointing to `cname.vercel-dns.com`.
   - If using an apex/root domain (e.g. `domain.com`), add an `A` record pointing to `76.76.21.21`.
5. Once DNS propagates, Vercel will automatically provision a free SSL certificate, and your site will be live on your domain!
