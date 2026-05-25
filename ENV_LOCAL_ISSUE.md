# The `.env.local` File Issue

## Problem
`.env.local` contains your SECRET keys and should NEVER be in GitHub!

If it's in your GitHub repo, that's a security issue.

---

## Why This Matters

`.env.local` contains:
- ❌ STRIPE_SECRET_KEY (your payment processor secret!)
- ❌ ADMIN_PASSWORD
- ❌ Other sensitive data

**If it's in GitHub, anyone can see it!**

---

## Solution: Remove `.env.local` from GitHub

### **Step 1: Delete from GitHub**
1. Go to: https://github.com/jordanwrussell/photoprint-studio
2. Find `.env.local` file
3. Click it
4. Click trash icon (delete)
5. Confirm deletion

### **Step 2: Make Sure `.gitignore` Exists**

The file `.gitignore` tells Git to IGNORE `.env.local`

Check your repo for `.gitignore` file:
1. Look in your repo file list
2. Should have a file named `.gitignore`
3. It should contain:
```
.env.local
.env.*.local
node_modules/
.next/
out/
.vercel/
```

If `.gitignore` doesn't exist, create it:
1. Click "Add file" → "Create new file"
2. Filename: `.gitignore`
3. Paste the content above
4. Commit

---

## How Vercel Gets Environment Variables

`.env.local` should NOT be in GitHub!

Instead:
1. **GitHub** has your code (NO secrets!)
2. **Vercel** has your environment variables in Settings
3. Vercel uses those variables during build

---

## The Correct Workflow

### **GitHub (PUBLIC)**
- Contains: app code, components, config files
- Does NOT contain: `.env.local`

### **Vercel (PRIVATE)**
- Settings → Environment Variables
- Contains: STRIPE keys, ADMIN_PASSWORD, etc.
- Never visible publicly

---

## Quick Fix

1. **Delete `.env.local`** from GitHub (if it's there)
2. **Create/update `.gitignore`** (if missing)
3. **Verify Vercel has env vars** in Settings
4. **Redeploy** in Vercel

---

## To Check if `.env.local` is in GitHub

Go to: https://github.com/jordanwrussell/photoprint-studio

Look for `.env.local` in the file list. If you see it, DELETE IT!

---

## Security Note

If `.env.local` was in GitHub with your STRIPE_SECRET_KEY:

1. ⚠️ Rotate your Stripe test keys immediately
2. Get new test keys from Stripe dashboard
3. Update Vercel environment variables with new keys
4. Redeploy

---

**Check if `.env.local` is in your GitHub repo right now!**

If yes, delete it immediately! 🔒

