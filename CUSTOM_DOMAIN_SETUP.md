# 🌐 Custom Domain Setup: zyphertours.com

This guide will help you set up your custom domain `zyphertours.com` with Vercel.

---

## 📋 Prerequisites

- Domain registered: `zyphertours.com`
- Access to your domain registrar (GoDaddy, Namecheap, etc.)
- Vercel account with your app deployed

---

## 🚀 Step 1: Deploy to Vercel First

Follow the `QUICK_START.md` guide to deploy your frontend to Vercel first. You'll get a temporary URL like:
```
https://your-tour-app.vercel.app
```

---

## 🌐 Step 2: Add Custom Domain in Vercel

### 2.1 Go to Vercel Dashboard
1. Open your project in Vercel
2. Click **"Settings"** tab
3. Click **"Domains"** in the sidebar

### 2.2 Add Your Domain
1. Enter: `zyphertours.com`
2. Click **"Add"**
3. Vercel will show you DNS records to add

### 2.3 Add www Subdomain (Optional but Recommended)
1. Also add: `www.zyphertours.com`
2. Click **"Add"**

---

## 🔧 Step 3: Configure DNS Records

Vercel will provide you with DNS records. Go to your domain registrar and add these:

### Option A: Using A Records (Recommended)
Add these **A Records**:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Option B: Using CNAME (Alternative)
| Type | Name | Value |
|------|------|-------|
| CNAME | @ | `cname.vercel-dns.com` |
| CNAME | www | `cname.vercel-dns.com` |

**Note**: The exact values will be shown in your Vercel dashboard. Use those!

---

## ⏱️ Step 4: Wait for DNS Propagation

- DNS changes take **5 minutes to 48 hours** to propagate
- Usually works within **15-30 minutes**
- Check status in Vercel dashboard (will show ✅ when ready)

---

## 🔒 Step 5: Enable HTTPS

Vercel automatically provisions SSL certificates:
1. Once DNS is verified, Vercel will auto-generate SSL
2. Your site will be available at:
   - `http://zyphertours.com` (redirects to HTTPS)
   - `https://zyphertours.com` ✅
   - `https://www.zyphertours.com` ✅

---

## 🔄 Step 6: Update Backend Configuration

### 6.1 Update Render Environment Variables
Go to Render dashboard → Your backend service → Environment:

```
FRONTEND_URL=https://zyphertours.com
```

**Important**: Use `https://` (not `http://`) after SSL is enabled!

### 6.2 Verify CORS Configuration
Your backend is already configured to accept:
- ✅ `http://zyphertours.com`
- ✅ `https://zyphertours.com`
- ✅ `http://www.zyphertours.com`
- ✅ `https://www.zyphertours.com`

---

## ✅ Step 7: Test Your Domain

### 7.1 Test Frontend
Visit: `https://zyphertours.com`

Should load your tour website!

### 7.2 Test API Connection
Open browser console (F12) and check for:
- ✅ No CORS errors
- ✅ API calls working
- ✅ Data loading correctly

---

## 🔧 Troubleshooting

### Domain Not Working?
**Check DNS Propagation**:
- Use [whatsmydns.net](https://www.whatsmydns.net)
- Enter `zyphertours.com` and check if it points to Vercel

**Common Issues**:
1. **DNS not updated**: Wait longer or check registrar settings
2. **Wrong DNS records**: Verify records match Vercel's instructions
3. **Cloudflare/Proxy**: If using Cloudflare, disable proxy (orange cloud)

### CORS Errors?
1. Make sure `FRONTEND_URL` in Render is set to `https://zyphertours.com`
2. Redeploy backend after changing env variables
3. Clear browser cache

### SSL Certificate Not Working?
1. Wait 10-15 minutes after DNS verification
2. Vercel auto-provisions SSL (Let's Encrypt)
3. Check Vercel dashboard for SSL status

---

## 📝 DNS Configuration Examples

### GoDaddy
1. Go to DNS Management
2. Add A Record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

### Namecheap
1. Go to Advanced DNS
2. Add A Record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

### Cloudflare
1. Go to DNS settings
2. Add A Record: `@` → `76.76.21.21` (Proxy OFF)
3. Add CNAME: `www` → `cname.vercel-dns.com` (Proxy OFF)

---

## 🎯 Final Checklist

- [ ] Domain added in Vercel
- [ ] DNS records configured at registrar
- [ ] DNS propagation complete (check Vercel dashboard)
- [ ] SSL certificate active (https:// works)
- [ ] `FRONTEND_URL` updated in Render backend
- [ ] Backend redeployed with new env variable
- [ ] Website loads at `https://zyphertours.com`
- [ ] API calls working (no CORS errors)

---

## 🎉 Success!

Your tour website is now live at:
- **Main**: https://zyphertours.com
- **WWW**: https://www.zyphertours.com

Both HTTP and HTTPS work, with automatic redirect to HTTPS! 🔒

---

## 📚 Additional Resources

- [Vercel Custom Domains Docs](https://vercel.com/docs/concepts/projects/domains)
- [DNS Propagation Checker](https://www.whatsmydns.net)
- [SSL Certificate Info](https://www.ssllabs.com/ssltest/)
