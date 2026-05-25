# PhotoMagnet Pro - Vercel Deployment Checklist

## Quick Deploy (15 Minutes)

### **Step 1: Verify GitHub Setup**
Your repository: `https://github.com/jordanwrussell/photoprint-studio`

✅ Check your repo has:
- [ ] `app/` folder
- [ ] `components/` folder
- [ ] `lib/` folder
- [ ] `package.json`
- [ ] `next.config.js`
- [ ] `tailwind.config.js`

If NOT: You need to upload files first (see below)

---

## **IF Files NOT Uploaded to GitHub Yet:**

### **Option A: Upload via GitHub Web (Easiest)**

1. **Visit your repo:**
   https://github.com/jordanwrussell/photoprint-studio

2. **Click "Add file" → "Upload files"**

3. **Drag & drop from `/home/claude/`:**
   - `app/`
   - `components/`
   - `lib/`
   - `scripts/`
   - `styles/`
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `.gitignore`
   - All `.md` files

4. **Commit with message:** "Initial commit - PhotoMagnet Pro"

5. **Wait 2 minutes for upload** ⏳

---

## **IF Files ARE Already Uploaded:**

Skip to Step 2 below ✓

---

## **Step 2: Create Stripe Account (FREE)**

### **Get Payment Processing Keys**

1. **Visit:** https://dashboard.stripe.com/register

2. **Sign up with:**
   - Email: (your email)
   - Password: (secure password)
   - Business name: (your magnet business name)

3. **After signup:**
   - Click **"Developers"** (top right)
   - Click **"API Keys"**
   - You'll see two test keys:
     - **Publishable Key** (starts with `pk_test_`)
     - **Secret Key** (starts with `sk_test_`)

4. **Copy both keys** - you'll use these in Vercel

Example format:
```
pk_test_51H6AV2L5JOy7NJzZ...
sk_test_51H6AV2L5JOy7NJzZ...
```

---

## **Step 3: Create Vercel Account (FREE)**

1. **Visit:** https://vercel.com/signup

2. **Click "Continue with GitHub"**

3. **GitHub asks permission** → Click "Authorize Vercel"

4. **You're now in Vercel Dashboard!** ✓

---

## **Step 4: Deploy to Vercel (1 Click)**

1. **In Vercel Dashboard, click "New Project"**

2. **Find your repository:**
   - You should see `photoprint-studio`
   - Click on it

3. **Click "Import"**

4. **Configure Project:**
   - **Project Name:** `photoprint-studio` (default is fine)
   - **Framework:** Next.js (auto-detected)
   - **Build & Output Settings:** (keep defaults)
   - Click **"Deploy"**

5. **Wait 3-5 minutes** for build...

6. **You should see:**
   ```
   ✓ Production build succeeded
   ✓ Your site is live!
   ```

7. **Your live URL:**
   ```
   https://photoprint-studio.vercel.app
   ```

---

## **Step 5: Add Environment Variables to Vercel**

This is IMPORTANT - without these, payment won't work.

### **In Vercel Dashboard:**

1. **Click your project** ("photoprint-studio")
2. **Click "Settings"** (top menu)
3. **Click "Environment Variables"** (left sidebar)

### **Add Variables (One by One)**

**Variable 1: Stripe Publishable Key**
- **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_XXXXX` (from Stripe dashboard)
- Click **"Save"**

**Variable 2: Stripe Secret Key**
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_XXXXX` (from Stripe dashboard)
- Click **"Save"**

**Variable 3: Admin Password**
- **Name:** `ADMIN_PASSWORD`
- **Value:** `your_secure_password` (pick something strong)
- Click **"Save"**

**Variable 4: App URL**
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://photoprint-studio.vercel.app`
- Click **"Save"**

### **Redeploy with Variables**

1. **Click "Deployments"** tab
2. **Find latest deployment**
3. **Click the three dots (...)** 
4. **Click "Redeploy"**
5. **Wait 2-3 minutes** for redeploy

---

## **Step 6: Test Your Live App**

### **Visit Your App**
```
https://photoprint-studio.vercel.app
```

You should see:
- PhotoPrint Studio header
- Professional design
- Upload form

### **Test Customer Features**

1. **Upload a test photo**
   - Click upload area
   - Select any JPG or PNG
   - See quality score appear (0-100)

2. **Use Image Editor**
   - Click on uploaded photo
   - Try zoom (pinch on mobile, scroll on desktop)
   - Try pan (drag around)
   - See live quality updates

3. **Select a Package**
   - Click package selector
   - Choose a package
   - See price

4. **Try Payment Options**
   - See Stripe option
   - See Local Pickup option

### **Test Admin Portal**

1. **Visit:** `https://photoprint-studio.vercel.app/admin`

2. **Enter password:** (the one you set in `ADMIN_PASSWORD`)

3. **You should see:**
   - Orders tab (empty for now)
   - Packages tab
   - Settings tab
   - Audit Reports tab

### **Test Stripe Payment**

1. **On homepage, click "Continue to Payment"**

2. **Choose "Stripe Payment"**

3. **Use test card:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ```

4. **Complete payment**

5. **You should see:**
   - "Payment successful"
   - Order confirmation page
   - Order number

---

## **Troubleshooting**

### **"Build Failed" Error**

**Solution:**
1. Go to "Deployments" tab
2. Look at build logs
3. Usually missing environment variable
4. Check all 4 variables are set correctly
5. Redeploy

### **App Loads but Features Don't Work**

**Solution:**
1. Press F12 (open browser console)
2. Look for red error messages
3. Usually means environment variable is missing or wrong
4. Check Vercel settings
5. Verify no extra spaces in variables
6. Redeploy

### **Admin Password Doesn't Work**

**Solution:**
1. Check `ADMIN_PASSWORD` variable in Vercel
2. Make sure it's set to correct value
3. No extra spaces
4. Redeploy
5. Try again

### **Stripe Not Working**

**Solution:**
1. Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (should start with `pk_test_`)
2. Check `STRIPE_SECRET_KEY` (should start with `sk_test_`)
3. Keys should be exactly as copied from Stripe
4. No extra spaces or quotes
5. Redeploy
6. Try payment again

---

## **You're Now Live! 🎉**

Your PhotoMagnet Pro app is available at:
```
https://photoprint-studio.vercel.app
```

### **Next Steps:**

1. **Use it for your magnet business**
   - Process real orders
   - Document workflow
   - Note pain points

2. **Document results**
   - Keep metrics:
     - Orders processed
     - Time saved
     - Features used
     - Issues encountered

3. **Share your success**
   - Tell friends/photographers
   - "Check out my new platform"
   - Get feedback

4. **Start thinking about Phase 2**
   - Multi-tenant setup
   - Beta customers
   - Feature improvements

---

## **Important Notes**

### **About Test Mode**
- ✅ Stripe is in TEST mode
- ✅ Test card (4242...) works
- ✅ No real money charged
- ✅ Perfect for development

### **When Ready for Real Money**
- Get live Stripe keys (pk_live_, sk_live_)
- Update environment variables
- Orders will be REAL and charge real cards

### **Domain**
- Your app is at: `photoprint-studio.vercel.app`
- Later you can add custom domain (myprints.com)
- That's a Vercel setting

---

## **Quick Reference**

| Item | Value |
|------|-------|
| **GitHub Repo** | jordanwrussell/photoprint-studio |
| **Live URL** | https://photoprint-studio.vercel.app |
| **Admin URL** | https://photoprint-studio.vercel.app/admin |
| **Test Payment Card** | 4242 4242 4242 4242 |
| **Stripe Keys** | From Stripe Dashboard |

---

## **Celebrate! 🎉**

You just deployed a production-ready photo magnet SaaS platform!

**Next: Start using it for your own magnet business and document the results.**

Questions? Check troubleshooting above or review GITHUB_SETUP_GUIDE.md for more details.

