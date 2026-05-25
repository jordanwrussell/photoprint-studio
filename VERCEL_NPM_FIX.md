# Vercel NPM Registry Error - Fix Guide

## Problem
Error message in Vercel:
```
https://registry.npmjs.org/@stripe%2fjs is not found
```

This is a network/registry issue with installing Stripe packages.

---

## Solution: Add `.npmrc` Configuration File

### **Step 1: In Your GitHub Repository**

1. **Visit:** https://github.com/jordanwrussell/photoprint-studio

2. **Click "Add file"** → **"Create new file"**

3. **Filename:** `.npmrc` (exactly as shown, with the dot)

4. **Content:** Copy this exactly:
```
registry=https://registry.npmjs.org/
legacy-peer-deps=true
```

5. **Click "Commit new file"**

---

## Solution: Update `package.json`

### **Step 2: Fix Stripe Dependency**

1. **In GitHub, find and edit:** `package.json`

2. **Click the pencil icon** to edit

3. **Find this section:**
```json
"@stripe/react-js": "^2.0.0",
```

4. **Replace with:**
```json
"@stripe/react-stripe-js": "^2.0.0",
```

5. **Also remove this line if present:**
```json
"pdfkit": "^0.13.0",
```

6. **Click "Commit changes"**

---

## Step 3: Redeploy in Vercel

1. **Go to Vercel Dashboard**

2. **Click "Deployments"** tab

3. **Find the failed deployment**

4. **Click the three dots (...)**

5. **Click "Redeploy"**

6. **Wait 5-10 minutes**

7. **You should see:** ✓ Build succeeded

---

## What These Files Do

### **`.npmrc` File**
- Tells npm to use official registry
- Enables legacy peer deps (fixes compatibility)
- Fixes network timeouts

### **`package.json` Update**
- Changes `@stripe/react-js` → `@stripe/react-stripe-js` (correct package name)
- Removes optional `pdfkit` (not needed for MVP)

---

## If Still Getting Errors

### **Option A: Clear Vercel Cache**

1. **In Vercel, click "Settings"**
2. **Click "Git"**
3. **Scroll to "Deploy Hooks" or "Build Cache"**
4. **Click "Clear Cache"**
5. **Go to "Deployments" and redeploy**

### **Option B: Use Yarn Instead**

1. **In GitHub, create file:** `yarn.lock`
   (leave empty, just create it)

2. **This tells Vercel to use Yarn instead of npm**

3. **Redeploy in Vercel**

### **Option C: Contact Vercel Support**

If still failing, this might be account-specific.
- Go to vercel.com/support
- Create a ticket
- Include build logs

---

## Quick Checklist

- [ ] Added `.npmrc` file to GitHub
- [ ] Updated `package.json` (stripe-js package name)
- [ ] Committed both changes
- [ ] Waited 1 minute for GitHub to update
- [ ] Clicked "Redeploy" in Vercel
- [ ] Waited 5-10 minutes for new build
- [ ] Checked for ✓ "Build succeeded"

---

## Expected Result

After redeploy, you should see:
```
✓ Production build succeeded
✓ Your site is live!
```

Then continue testing your app!

---

## Still Not Working?

**Try this order:**

1. Add `.npmrc` file
2. Update `package.json`
3. Clear Vercel cache
4. Redeploy
5. Wait 10 minutes

If still failing after all steps, reach out - we can try alternative approaches.

---

**You've got this!** 🚀

