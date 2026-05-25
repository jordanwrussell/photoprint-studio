# Vercel "npm install" Error - Complete Fix Guide

## Problem
```
Command "npm install" exited with 1
```

This means npm can't install dependencies. Usually caused by:
- Missing `.npmrc` file
- Bad `package.json` syntax
- Stripe package conflicts
- Network issues

---

## Solution: Complete Clean Setup

### **Step 1: Delete Everything and Start Fresh**

1. **Go to GitHub:** https://github.com/jordanwrussell/photoprint-studio

2. **Delete ALL files except `.git`:**
   - Click each file/folder
   - Click trash icon
   - Repeat for all

3. **Leave only:** `.git` (invisible)

---

### **Step 2: Upload Fresh Files**

1. **Click "Add file"** → **"Upload files"**

2. **Drag & drop your ZIP file** again
   - `photoprint-studio.tar.gz`

3. **Commit:** "Clean install - PhotoMagnet Pro"

4. **Wait 2 minutes**

---

### **Step 3: Add Critical Config Files**

These 2 files MUST be in your repo root:

#### **File 1: `.npmrc`**

1. Click "Add file" → "Create new file"
2. Filename: `.npmrc`
3. Content:
```
registry=https://registry.npmjs.org/
legacy-peer-deps=true
fetch-timeout=120000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
```
4. Commit

#### **File 2: `package.json`**

Use the corrected version - make sure it has:

```json
{
  "name": "photo-print-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:setup": "node scripts/db-setup.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "stripe": "^14.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "@stripe/js": "^3.0.0",
    "sqlite3": "^5.1.6",
    "sharp": "^0.33.0",
    "axios": "^1.6.0",
    "uuid": "^9.0.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

**Key differences:**
- ✅ `@stripe/react-stripe-js` (NOT `@stripe/react-js`)
- ✅ Removed `pdfkit` line
- ✅ No extra dependencies

---

### **Step 4: Redeploy in Vercel**

1. **Go to Vercel Dashboard**

2. **Click your project** (photoprint-studio)

3. **Click "Deployments"**

4. **Click the failed deployment**

5. **Scroll to bottom, click "Redeploy"**

6. **Wait 10-15 minutes**

7. **Watch the build logs** for errors

---

## Alternative: Complete GitHub Reset

If above doesn't work, try **nuclear option**:

### **1. Delete GitHub Repo**
- Go to repo Settings
- Scroll to "Danger Zone"
- Click "Delete this repository"
- Confirm deletion

### **2. Create New Repo**
- Go to https://github.com/new
- Name: `photoprint-studio`
- Description: PhotoMagnet Pro
- Public: checked
- Click "Create"

### **3. Upload Fresh**
- Click "Upload files"
- Drag your ZIP
- Commit

### **4. Add Config Files**
- Create `.npmrc` (see above)
- Create/verify `package.json` (see above)
- Commit both

### **5. Deploy to Vercel**
- Go to Vercel
- Click "New Project"
- Import `photoprint-studio` (new one)
- Deploy
- Add environment variables
- Redeploy

---

## Quick Checklist

- [ ] GitHub repo clean and fresh
- [ ] All project files uploaded
- [ ] `.npmrc` file created with correct content
- [ ] `package.json` has correct dependencies (see above)
- [ ] No `@stripe/react-js` (wrong name)
- [ ] No `pdfkit` in dependencies
- [ ] All files committed to main branch
- [ ] Waited 2 minutes for GitHub to sync
- [ ] Clicked "Redeploy" in Vercel
- [ ] Waited 10-15 minutes for new build
- [ ] Checked logs for specific errors

---

## Debug: Check Vercel Build Logs

To see EXACTLY what's failing:

1. **In Vercel, click failed deployment**
2. **Click "Build & Deployments"** tab
3. **Scroll down to see full log**
4. **Look for lines with "ERROR" or "ERR!"**
5. **Copy the error message**
6. **Tell me the error**

Common errors:
```
ERR! 404 Not Found - GET
ERR! network socket hang up
ERR! ERESOLVE unable to resolve dependency tree
```

---

## If Still Failing

**Try in order:**

1. ✅ Clean install (delete & reupload)
2. ✅ Verify `.npmrc` exists
3. ✅ Verify `package.json` syntax (use JSON validator)
4. ✅ Clear Vercel cache → redeploy
5. ✅ Try GitHub repo reset (nuclear option)
6. ✅ Check build logs for specific error

---

## The Essential Files (Copy Exactly)

### `.npmrc`
```
registry=https://registry.npmjs.org/
legacy-peer-deps=true
fetch-timeout=120000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
```

### `package.json`
```json
{
  "name": "photo-print-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:setup": "node scripts/db-setup.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "stripe": "^14.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "@stripe/js": "^3.0.0",
    "sqlite3": "^5.1.6",
    "sharp": "^0.33.0",
    "axios": "^1.6.0",
    "uuid": "^9.0.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## Next Steps

1. **Try the clean install approach first**
2. **Add `.npmrc` and correct `package.json`**
3. **Redeploy in Vercel**
4. **Wait for build to complete**
5. **If still fails, check Vercel build logs**
6. **Tell me the specific error from logs**

We'll get this working! 🚀

