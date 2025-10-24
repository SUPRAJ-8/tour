# 🚀 Free Deployment Guide: Vercel + Render

This guide will help you migrate from your paid VPS to **100% FREE** hosting using:
- **Vercel** for Frontend (React)
- **Render** for Backend (Node.js/Express)
- **MongoDB Atlas** for Database (Free Tier)

---

## 📋 Prerequisites

1. **GitHub Account** (to connect with Vercel & Render)
2. **MongoDB Atlas Account** (free tier)
3. Your code pushed to a GitHub repository

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Free Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free
3. Create a new **FREE** cluster (M0 Sandbox - 512MB)

### 1.2 Get Your Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/tour?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual database password
5. Replace `tour` with your database name (or keep it as `tour`)

### 1.3 Whitelist IP Addresses
1. Go to **Network Access** in Atlas
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Push Your Code to GitHub
```bash
# If not already done
git init
git add .
git commit -m "Prepare for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2.2 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

### 2.3 Configure Backend Service
1. **Connect Repository**: Select your GitHub repo
2. **Name**: `tour-backend` (or any name you prefer)
3. **Region**: Oregon (Free)
4. **Branch**: `main`
5. **Root Directory**: Leave empty (or `backend` if you want)
6. **Runtime**: Node
7. **Build Command**: 
   ```
   cd backend && npm install
   ```
8. **Start Command**: 
   ```
   cd backend && npm start
   ```
9. **Plan**: **Free**

### 2.4 Add Environment Variables on Render
Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/tour` |
| `JWT_SECRET` | Random secret string (generate one) | `your-super-secret-jwt-key-12345` |
| `JWT_EXPIRE` | `30d` | `30d` |
| `PORT` | `5000` | `5000` |
| `FRONTEND_URL` | Your Vercel URL (add after Step 3) | `https://your-app.vercel.app` |

**To generate JWT_SECRET**, run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy Backend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your backend URL (e.g., `https://tour-backend-xxxx.onrender.com`)

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**

### 3.2 Import Your Repository
1. Select your GitHub repository
2. Click **"Import"**

### 3.3 Configure Frontend Build Settings
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: 
   ```
   npm run build
   ```
4. **Output Directory**: `build`
5. **Install Command**: 
   ```
   npm install
   ```

### 3.4 Add Environment Variables on Vercel
Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_URL` | Your Render backend URL | All (Production, Preview, Development) |

**Example**: `https://tour-backend-xxxx.onrender.com`

### 3.5 Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your Vercel URL (e.g., `https://your-tour-app.vercel.app`)

---

## 🔄 Step 4: Update Backend with Frontend URL

1. Go back to **Render Dashboard**
2. Select your `tour-backend` service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
Visit: `https://tour-backend-xxxx.onrender.com/health`

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 5.2 Test Frontend
Visit: `https://your-tour-app.vercel.app`

Your site should load and connect to the backend!

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- **Solution**: Check Render logs. Backend might be sleeping (cold start). Wait 30-60 seconds.

**Problem**: "MongoDB connection failed"
- **Solution**: 
  1. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
  2. Verify `MONGODB_URI` is correct in Render environment variables
  3. Check MongoDB Atlas cluster is running

**Problem**: CORS errors
- **Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)

### Frontend Issues

**Problem**: "Failed to fetch" or API errors
- **Solution**: 
  1. Check `REACT_APP_API_URL` in Vercel environment variables
  2. Make sure it points to your Render backend URL
  3. Redeploy frontend after changing env variables

**Problem**: 404 errors on refresh
- **Solution**: Already handled by `vercel.json` routing configuration

---

## 🔄 How to Redeploy

### Backend (Render)
- **Automatic**: Push to GitHub `main` branch
- **Manual**: Go to Render dashboard → Click "Manual Deploy" → "Deploy latest commit"

### Frontend (Vercel)
- **Automatic**: Push to GitHub `main` branch
- **Manual**: Go to Vercel dashboard → Click "Redeploy"

---

## ⚡ Performance Notes

### Cold Starts (Render Free Tier)
- Backend spins down after **15 minutes** of inactivity
- First request after idle: **30-60 seconds** delay
- Subsequent requests: **Fast** (normal speed)

### Solutions for Cold Starts:
1. **Use a Ping Service** (Recommended):
   - [cron-job.org](https://cron-job.org) (free)
   - Set up a cron job to ping `https://tour-backend-xxxx.onrender.com/health` every 14 minutes
   
2. **Accept the cold starts** (fine for low-traffic sites)

3. **Upgrade to Render Starter Plan** ($7/month - always on)

---

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Free Forever | 100GB bandwidth/month |
| **Render** | ✅ Free Forever | 750 hours/month, cold starts after 15min idle |
| **MongoDB Atlas** | ✅ Free Forever | 512MB storage, 100 connections |
| **Total** | **$0/month** | Perfect for small-medium projects |

---

## 🎯 Next Steps

1. ✅ Set up custom domain on Vercel (optional, free)
2. ✅ Set up MongoDB backups (Atlas has automatic backups)
3. ✅ Monitor your app performance
4. ✅ Set up cron job to prevent cold starts (optional)

---

## 📝 Important Files Created

- ✅ `vercel.json` - Vercel configuration for frontend
- ✅ `render.yaml` - Render configuration for backend (optional, can use dashboard)
- ✅ `.gitignore` - Updated to exclude sensitive files

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

## 🎉 Congratulations!

You've successfully migrated from a paid VPS to **100% FREE** hosting! 

Your app is now:
- ✅ Hosted on global CDN (Vercel)
- ✅ Auto-deployed on every push
- ✅ Using cloud MongoDB
- ✅ Completely FREE

**Frontend**: https://your-tour-app.vercel.app  
**Backend**: https://tour-backend-xxxx.onrender.com
