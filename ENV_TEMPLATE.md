# Environment Variables Template

## 🔧 Backend Environment Variables (.env)

Create a file `backend/.env` with these variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tour?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-generate-a-random-string
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app
```

### How to Generate JWT_SECRET:
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎨 Frontend Environment Variables (.env)

Create a file `frontend/.env` with:

```env
# Backend API URL
REACT_APP_API_URL=https://tour-backend-xxxx.onrender.com
```

### For Local Development:
Create `frontend/.env.development`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### For Production:
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://tour-backend-xxxx.onrender.com
```

---

## 📝 Render Environment Variables

When deploying to Render, add these in the dashboard:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generated secret from above |
| `JWT_EXPIRE` | `30d` |
| `PORT` | `5000` |
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://your-app.vercel.app`) |

---

## 🚀 Vercel Environment Variables

When deploying to Vercel, add these in the dashboard:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | Your Render backend URL (e.g., `https://tour-backend-xxxx.onrender.com`) |

**Important**: Apply to all environments (Production, Preview, Development)

---

## 🔒 Security Notes

1. **Never commit `.env` files** to GitHub (already in `.gitignore`)
2. **Use strong JWT secrets** (at least 32 characters)
3. **Keep MongoDB credentials secure**
4. **Whitelist only necessary IPs** in MongoDB Atlas (or use 0.0.0.0/0 for Render)

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] JWT secret generated
- [ ] Backend `.env` file created locally
- [ ] Frontend `.env` file created locally
- [ ] Environment variables added to Render dashboard
- [ ] Environment variables added to Vercel dashboard
- [ ] Tested backend health endpoint
- [ ] Tested frontend connection to backend
