# 🚀 Quick Start - Deploy in 15 Minutes

Follow these steps to deploy your tour app to Vercel + Render for **FREE**.

---

## ⚡ Step-by-Step Deployment

### 1️⃣ MongoDB Atlas Setup (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create FREE account → Create FREE cluster (M0)
3. Click **"Connect"** → **"Connect your application"**
4. Copy connection string:
   ```
   mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/tour
   ```
5. Go to **"Network Access"** → **"Add IP"** → **"Allow from Anywhere"** (0.0.0.0/0)

✅ **Save your MongoDB connection string!**

---

### 2️⃣ Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

### 3️⃣ Deploy Backend to Render (5 minutes)

1. Go to [Render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your repository
4. Configure:
   - **Name**: `tour-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: **Free**

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRE=30d
   PORT=5000
   ```

6. Click **"Create Web Service"**
7. ✅ **Copy your backend URL**: `https://tour-backend-xxxx.onrender.com`

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 4️⃣ Deploy Frontend to Vercel (3 minutes)

1. Go to [Vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository
4. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL=<your-render-backend-url>
   ```
   Example: `https://tour-backend-xxxx.onrender.com`

6. Click **"Deploy"**
7. ✅ **Copy your frontend URL**: `https://your-app.vercel.app`

---

### 5️⃣ Update Backend with Frontend URL (1 minute)

1. Go back to Render dashboard
2. Select your `tour-backend` service
3. Go to **"Environment"** tab
4. Add/Update:
   ```
   FRONTEND_URL=<your-vercel-url>
   ```
   Example: `https://your-app.vercel.app`
5. Save → Render will auto-redeploy

---

## ✅ Verify Deployment

**Backend Health Check**:
```
https://tour-backend-xxxx.onrender.com/health
```
Should return: `{"status":"ok","message":"Server is running"}`

**Frontend**:
```
https://your-app.vercel.app
```
Should load your tour website!

---

## 🎉 Done!

Your app is now:
- ✅ **100% FREE** hosting
- ✅ **Auto-deployed** on every git push
- ✅ **Global CDN** (Vercel)
- ✅ **Cloud database** (MongoDB Atlas)

---

## ⚠️ Important Notes

### Cold Starts (Render Free Tier)
- Backend sleeps after 15 minutes of inactivity
- First request after sleep: 30-60 seconds delay
- **Solution**: Use [cron-job.org](https://cron-job.org) to ping your backend every 14 minutes

### Environment Variables
- Never commit `.env` files to GitHub
- Always use environment variables in Vercel/Render dashboards
- Update `FRONTEND_URL` in Render after deploying to Vercel

---

## 📚 Need More Details?

See the full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🆘 Troubleshooting

**CORS Errors?**
- Check `FRONTEND_URL` in Render matches your Vercel URL exactly

**API Not Working?**
- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify backend is running: visit `/health` endpoint

**MongoDB Connection Failed?**
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Verify `MONGODB_URI` is correct in Render

---

**Questions?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting!
