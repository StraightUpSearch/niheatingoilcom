# 🚀 Deploy to Railway NOW (5 Minutes)

## ✅ Preparation Complete!

I've already configured everything for deployment:
- ✅ Added Railway configuration (`railway.json`, `Procfile`)
- ✅ Fixed server to bind to `0.0.0.0` for production
- ✅ Added CORS headers for `niheatingoil.com`
- ✅ Committed changes to git

---

## 📋 Deploy Steps (Follow These)

### Step 1: Sign Up / Login to Railway

1. **Visit**: https://railway.app/
2. **Click "Login"** (top right)
3. **Sign in with GitHub** (easiest - connects your repo automatically)

---

### Step 2: Create New Project

1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository**: `StraightUpSearch/niheatingoilcom`
4. **Select the branch**: `main`

---

### Step 3: Configure Build

Railway will automatically detect your Node.js project. It will:
- Run `npm install`
- Build with `npm run build`
- Start with `NODE_ENV=production node dist/index.js`

✅ All configured in `railway.json` and `Procfile` I created!

---

### Step 4: Add PostgreSQL Database

1. **In your project**, click **"+ New"**
2. **Select "Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a database and set `DATABASE_URL`

⚠️ **IMPORTANT**: Copy the `DATABASE_URL` - you'll need it!

---

### Step 5: Set Environment Variables

1. **Click on your service** (not the database)
2. **Go to "Variables" tab**
3. **Click "+ New Variable"**

Add these variables:

```
NODE_ENV=production
SESSION_SECRET=your_random_256_char_secret_string_here
```

**Optional (for full functionality):**
```
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@niheatingoil.com
ADMIN_ALERT_EMAIL=admin@niheatingoil.com
GETADDRESS_API_KEY=your_getaddress_key
OPENAI_API_KEY=your_openai_key
```

4. **Click "Add"** for each variable

---

### Step 6: Deploy!

1. **Railway will auto-deploy** after you add variables
2. **Watch the logs** in the "Deployments" tab
3. **Wait for**: ✅ "Build successful" → ✅ "Deployed"

---

### Step 7: Get Your API URL

1. **In your service**, go to **"Settings" tab**
2. **Scroll to "Domains"**
3. **Click "Generate Domain"**
4. **Copy the URL**: `https://your-project-name.up.railway.app`

---

### Step 8: Test Backend

**Open in browser:**
```
https://your-project-name.up.railway.app/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T...",
  "environment": "production"
}
```

**Test API:**
```
https://your-project-name.up.railway.app/api/suppliers
```

**Expected**: JSON array of suppliers (if you have data)

---

### Step 9: Update WordPress Config

**SSH into your production WordPress server:**

```bash
ssh user@your-server
nano /path/to/wp-config.php
```

**Find this line** (around line 83):
```php
define('NI_HEATING_OIL_API_URL', 'http://localhost:5000');
```

**Change to:**
```php
define('NI_HEATING_OIL_API_URL', 'https://your-project-name.up.railway.app');
```

**Save**: `Ctrl+X`, then `Y`, then `Enter`

---

### Step 10: Upload Database Data

**Option A: Use Railway Console**

1. **In Railway**, click on your **PostgreSQL database**
2. **Go to "Data" tab**
3. **Click "Query"**

**Run this to create tables:**
```sql
-- Copy the SQL from your create-tables.js and convert to PostgreSQL syntax
-- Or use Drizzle migration: npm run db:push (need to configure DATABASE_URL locally first)
```

**Option B: Import from Local SQLite**

1. **Export local data:**
```bash
sqlite3 heating-oil.db .dump > backup.sql
```

2. **Convert to PostgreSQL format** (or use pgloader)

3. **Import to Railway:**
```bash
# Get DATABASE_URL from Railway
psql your_database_url < backup-postgres.sql
```

---

### Step 11: Test Production Site

1. **Visit**: `https://niheatingoil.com`
2. **Open browser console** (F12)
3. **Check for errors**: Should see NO 404s on `/api/*`
4. **Go to "Compare" page**
5. **Search for a postcode**: e.g., `BT1`
6. **Verify**: Suppliers and prices appear!

---

## 🎯 Quick Verification Checklist

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Deployment successful (green checkmark)
- [ ] Domain generated
- [ ] Health check returns 200 OK
- [ ] `/api/suppliers` returns JSON
- [ ] `wp-config.php` updated with Railway URL
- [ ] Site loads without 404 errors
- [ ] Search returns supplier results

---

## 🚨 Troubleshooting

### Build Fails

**Check Railway logs:**
- Look for npm install errors
- Check for TypeScript compilation errors
- Verify all dependencies are in `package.json`

**Common fixes:**
```bash
# Locally test production build
npm run build
NODE_ENV=production node dist/index.js
```

### Database Connection Fails

**Check:**
- `DATABASE_URL` is set in Railway variables
- Database is running (check Railway dashboard)
- Connection string format is correct

**Test connection:**
```bash
# In Railway console
psql $DATABASE_URL -c "SELECT 1;"
```

### CORS Errors

**Check:**
- `https://niheatingoil.com` is in allowed origins (server/index.ts line 28)
- No extra redirects (www vs non-www)

**Fix if needed:**
```typescript
// Add to allowedOrigins array
'https://www.niheatingoil.com',
```

Redeploy after changes.

---

## 📊 Expected Results

**Before Deployment:**
```
❌ /api/suppliers → 404
❌ /api/prices → 404
❌ Site shows "£0.00" and "0 suppliers"
```

**After Deployment:**
```
✅ /api/suppliers → 200 OK (JSON)
✅ /api/prices → 200 OK (JSON)
✅ Site shows real prices and suppliers
✅ Search works
✅ All features functional
```

---

## 🎉 Success!

Once deployed, your site will be:
- ✅ Fully functional
- ✅ Serving real data
- ✅ Accessible worldwide
- ✅ Auto-scaling with Railway
- ✅ SSL/HTTPS enabled
- ✅ Monitored and logged

---

## 📞 Need Help?

**Railway Docs**: https://docs.railway.app/
**Railway Discord**: https://discord.gg/railway
**Check Logs**: Railway Dashboard → Your Service → Deployments → View Logs

---

**Estimated Time**: 5-10 minutes
**Difficulty**: Easy (mostly point-and-click)
**Cost**: Free tier available (upgradeable if needed)

**Let's get your site live! 🚀**
