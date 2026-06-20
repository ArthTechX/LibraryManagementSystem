# 🚀 LMS Live Deployment Guide

## Architecture
- **Backend**: Spring Boot 3.2.5 (Java 21) → **Railway.app** (free)  
- **Frontend**: React 16 → **Vercel** (free)  
- **Database**: Railway PostgreSQL (free tier) or H2 in-memory

---

## Step 1: Deploy Backend to Railway

### 1a. Push code to GitHub
```bash
git add .
git commit -m "Fix: Spring Boot 3 upgrade, jakarta migration, production config"
git push origin main
```

### 1b. Create Railway project
1. Go to [railway.app](https://railway.app) → Login with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `library-management-system` repo
4. Set **Root Directory** to: `back-end/services/user-service`
5. Railway will auto-detect the Dockerfile

### 1c. Add PostgreSQL database
1. In your Railway project, click **"+ New Service"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-provisions the DB and sets `DATABASE_URL` env var

### 1d. Set Environment Variables in Railway
Click your service → **Variables** tab → Add:

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | `YourSuperSecretJWTKey2024AtLeast32CharsLong!` |
| `DATABASE_URL` | *(auto-set by Railway when you add PostgreSQL)* |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` *(set after Vercel deploy)* |

### 1e. Get your Railway URL
After deploy, Railway gives you a URL like:  
`https://user-service-production-xxxx.up.railway.app`

**Test it**: `https://your-railway-url.railway.app/api/books`

---

## Step 2: Deploy Frontend to Vercel

### 2a. Update production env
Edit `front-end/lms-client/.env.production`:
```
REACT_APP_API_URL=https://your-railway-url.up.railway.app
```

Commit and push:
```bash
git add front-end/lms-client/.env.production
git commit -m "Set production API URL"
git push
```

### 2b. Create Vercel project
1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. Click **"Add New Project"** → Import your repo
3. Set **Root Directory** to: `front-end/lms-client`
4. Set **Framework Preset**: `Create React App`
5. Add **Environment Variables**:
   - `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app`
6. Click **Deploy**

### 2c. Update Railway CORS
After Vercel gives you a URL (e.g. `https://lms-client.vercel.app`):
1. Go back to Railway → Your service → Variables
2. Set `ALLOWED_ORIGINS` = `https://lms-client.vercel.app`
3. Railway auto-redeploys

---

## Step 3: Verify Live Deployment

| Check | URL |
|-------|-----|
| Backend health | `https://your-railway-url/actuator/health` |
| Books API | `https://your-railway-url/api/books` |
| Frontend | `https://your-app.vercel.app` |

### Test credentials
- **Admin**: `admin` / `admin123`
- **Register** a new user account

---

## Local Development

### Start backend
```powershell
cd back-end\services\user-service
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
.\mvnw spring-boot:run
# API at http://localhost:5001
```

### Start frontend
```powershell
cd front-end\lms-client
npm start
# App at http://localhost:3000
```
