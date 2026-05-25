# Nuclear Option: Start Fresh Repository

The ZIP/upload issues are persistent. Let's do a completely fresh start with a new repo.

---

## **Step 1: Delete Old Repository**

1. Go to: https://github.com/jordanwrussell/photoprint-studio
2. Click **"Settings"** (top right of repo)
3. Scroll to **"Danger Zone"**
4. Click **"Delete this repository"**
5. Type the repo name to confirm
6. Click **"I understand the consequences, delete this repository"**

**Old repo is now deleted.**

---

## **Step 2: Create Brand New Repository**

1. Go to: https://github.com/new
2. **Repository name:** `photoprint-studio`
3. **Description:** `PhotoMagnet Pro - Photo Printing SaaS`
4. **Public:** Checked
5. **Initialize with README:** Checked
6. Click **"Create repository"**

**New empty repo is created.**

---

## **Step 3: Upload ZIP (Fresh Start)**

1. Click **"Add file"** → **"Upload files"**
2. Drag `photoprint-studio-complete-latest.tar.gz` 
3. Commit: "Fresh PhotoMagnet Pro - v1"
4. **Wait 3-5 minutes** for extraction

---

## **Step 4: Verify All Folders**

Check GitHub for:
- ✅ `app/` folder exists
- ✅ `components/` folder exists
- ✅ **`lib/` folder exists** ← THIS IS KEY
- ✅ `scripts/` folder exists
- ✅ `styles/` folder exists
- ✅ `package.json` exists
- ✅ `.npmrc` exists
- ✅ `jsconfig.json` exists

**If any folder is missing, the upload failed. Re-upload.**

---

## **Step 5: Verify Vercel Connection**

Your Vercel is probably still connected to the OLD repo.

**Re-import:**

1. Go to: https://vercel.com/dashboard
2. Click **"New Project"**
3. GitHub shows `photoprint-studio` (new one)
4. Click it → Click **"Import"**
5. Click **"Deploy"**

OR if it auto-detects and redeploys:
- Just wait for build

---

## **Step 6: Add Environment Variables**

1. Vercel Settings → Environment Variables
2. Add 4 variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = pk_test_...
   - `STRIPE_SECRET_KEY` = sk_test_...
   - `ADMIN_PASSWORD` = admin123
   - `NEXT_PUBLIC_APP_URL` = https://photoprint-studio.vercel.app

---

## **Step 7: Redeploy**

1. Deployments → Latest deployment → "..." → Redeploy
2. Wait 10-15 minutes

---

## **Step 8: Check Build**

You should see:
```
✓ Production build succeeded
```

If yes → **YOU'RE DONE!** 🎉

If no → Tell me the error

---

## **Why This Works**

- Fresh repo = no cached issues
- Fresh Vercel connection = no stale connections
- ZIP extraction one time only
- Clean slate

---

## **Timeline**

- Delete old repo: 1 minute
- Create new repo: 1 minute
- Upload ZIP: 5 minutes
- Verify folders: 1 minute
- Reconnect Vercel: 2 minutes
- Add env vars: 2 minutes
- Redeploy: 1 minute
- Wait for build: 10 minutes

**Total: 23 minutes**

---

**This is the most reliable path forward.**

Do this now! 🚀

