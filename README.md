# Doha Wellness — Premium Spa & Wellness Booking Marketplace

Doha Wellness is a Fresha-inspired full-stack wellness marketplace where customers can discover, search, filter, and book spa/salon appointments in Doha, and professionals can list their wellness businesses and manage incoming booking schedules.

Restructured as a **unified full-stack Next.js application** directly at the workspace root, eliminating separate client/server structures.

---

## 🛠️ Technology Stack
- **Frontend + Backend API**: Next.js 14/16 (App Router)
- **Database & ORM**: MongoDB Atlas + Mongoose
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **Email Dispatcher**: Resend API
- **Styling**: Tailwind CSS v4 + Lucide Icons

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js**: `v20.x` or higher (`v24.x` recommended)
- **MongoDB**: A running MongoDB Atlas instance or local MongoDB URI.
- **Resend**: An active Resend account and API key.
- **Google Cloud Console**: OAuth credentials client ID and secret.

### 2. Configure Environment Variables
Create a file named `.env.local` in the root directory:
```env
# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/doha-wellness?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any_32_character_hex_secret     # generate with: openssl rand -base64 32
JWT_SECRET=any_32_character_hex_secret          # can be same as NEXTAUTH_SECRET

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Integration (Resend API)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev                # default sandbox sender

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
Run from the root directory:
```bash
npm install --legacy-peer-deps
```

### 4. Seed the Database
Populate your MongoDB database with pre-configured mock data (including professional accounts, beauty salons, services menus, and ratings):
```bash
npx tsx seed.ts
```

**Seeded Accounts for Testing:**
- **Professional 1**: `elena@dohawellness.com` (Password: `password123`)
- **Professional 2**: `ahmed@dohawellness.com` (Password: `password123`)
- **Customer / Guest**: `guest@dohawellness.com` (Password: `password123`)

---

## 💻 Running the ProjectNEXTAUTH_SECRET=your_secret   # openssl rand -base64 32
JWT_SECRET=your_jwt_secret    # can be same value as NEXTAUTH_SECRET
To run the serverless full-stack app in development mode:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to browse, search by location/keyword, select category pills, check out salon details, book time slots, and write reviews!

---

## 💾 Git Commit Strategy
We have consolidated the entire backend/frontend logic into the root directory of this repository. The subdirectories `client` and `server` are **deprecated** and excluded from the build pipeline.

When committing:
1. **Commit only the root files and folders** (`app/`, `components/`, `lib/`, `models/`, `middleware.ts`, `package.json`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts`, `components.json`, `.gitignore`, `seed.ts`, `README.md`).
2. Keep the modified folders `client/` and `server/` out of staging unless you are deleting them completely.

To add and commit only the active full-stack workspace:
```bash
# Add only the root files and folders
git add app/ components/ lib/ models/ middleware.ts package.json package-lock.json tsconfig.json postcss.config.mjs next.config.ts components.json .gitignore seed.ts README.md

# Commit
git commit -m "Restructure: Consolidated project into root Next.js full-stack app"
```

---

## 🌐 Production Deployment: Vercel & Render

Previously, this project was set up as a split architecture (Express server on Render + Next.js client on Vercel). By unifying the application into a full-stack Next.js project, **you can deploy the entire app to Vercel in a single action.**

### Vercel Deployment Instructions (Recommended)

Next.js APIs are natively supported on Vercel as serverless functions.
1. Connect your GitHub repository to **Vercel** (`vercel.com`).
2. Set the **Build Command** to: `npm run build`
3. Set the **Output Directory** to default: `.next`
4. Set the **Root Directory** to: `./` (root of project, **not** `client`).
5. Configure the **Environment Variables** in Vercel matching your `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (Set this to your Vercel deployment URL, e.g. `https://doha-wellness.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` (Set this to your Vercel deployment URL)
6. Trigger the deployment. Your site and APIs are now live together!

### Render Deployment Instructions (If using Render instead of Vercel)

Next.js can be deployed on Render as a Web Service (running node server).
1. Create a new **Web Service** on Render and connect your repository.
2. Select **Runtime** as `Node`.
3. Set **Build Command** to: `npm run build`
4. Set **Start Command** to: `npm run start`
5. Configure the environment variables matching the `.env.local` keys under Render's Env Settings. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Render Web Service URL (e.g. `https://doha-wellness.onrender.com`).
6. Deploy the service.
