# PhotoMagnet Pro - GitHub to Vercel Deployment Guide

## Your Path: GitHub + Vercel (No Local Setup Needed!)

This is perfect because:
✅ No command line on your computer
✅ Everything in the cloud
✅ GitHub stores your code
✅ Vercel auto-deploys on every GitHub change
✅ Live in 15 minutes

---

## **Step 1: Upload Your Code to GitHub** (5 minutes)

Your repo is ready: `https://github.com/jordanwrussell/photoprint-studio`

### **Option A: Upload via GitHub Web (EASIEST)**

1. **Visit your GitHub repo:**
   ```
   https://github.com/jordanwrussell/photoprint-studio
   ```

2. **Click "Add file"** (green button, top right)

3. **Click "Upload files"**

4. **Drag & drop the ZIP file** you downloaded earlier
   - Or click to browse and select `photoprint-studio.tar.gz`

5. **In "Commit changes" box:**
   - Message: `Initial commit - PhotoMagnet Pro`
   - Select: "Commit directly to the main branch"

6. **Click "Commit changes"**

7. **Wait 2-3 minutes** for files to upload

8. **Verify success:**
   - Refresh page
   - Should see `app/`, `components/`, `lib/` folders

---

## **Step 2: Create `.env.local` File in GitHub** (2 minutes)

This tells Vercel your secret keys.

### **In GitHub Repository:**

1. **Click "Add file"** (green button)

2. **Click "Create new file"**

3. **Filename:** `.env.local`

4. **Content:** Copy this exactly:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER
   STRIPE_SECRET_KEY=sk_test_PLACEHOLDER
   SHOPIFY_STORE_URL=https://your-store.myshopify.com
   SHOPIFY_STOREFRONT_TOKEN=your_token_here
   SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/12345
   SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
   ADMIN_PASSWORD=admin123
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_PATH=./data/app.db
   ```

5. **DO NOT EDIT YET** - We'll update in Vercel next

6. **Click "Commit new file"**

---

## **Step 3: Create Stripe Account** (5 minutes)

Get your payment processor keys.

### **Create Free Stripe Account:**

1. **Visit:** https://dashboard.stripe.com/register

2. **Sign up with:**
   - Email: (your email)
   - Password: (strong password)
   - Business name: (your magnet business name)

3. **After signup:**
   - Click **"Developers"** (top right)
   - Click **"API Keys"**

4. **You'll see:**
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

5. **Copy both keys** - you'll use these next in Vercel

Example:
```
pk_test_51H6AV2L5JOy7NJzZ_abcdef123456...
sk_test_51H6AV2L5JOy7NJzZ_abcdef123456...
```

---

## **Step 4: Create Vercel Account** (2 minutes)

Deploy platform.

### **Create Free Vercel Account:**

1. **Visit:** https://vercel.com/signup

2. **Click "Continue with GitHub"**

3. **GitHub asks permission** → Click "Authorize Vercel"

4. **You're in Vercel Dashboard!** ✓

---

## **Step 5: Deploy to Vercel** (5 minutes)

One-click deployment.

### **Import Your GitHub Repository:**

1. **In Vercel Dashboard, click "New Project"**

2. **Under "Import Git Repository":**
   - You should see `photoprint-studio`
   - Click on it

3. **Click "Import"**

4. **Configure Project:**
   - **Project Name:** `photoprint-studio` (default)
   - **Framework:** Next.js (auto-detected ✓)
   - **Build & Output Settings:** (keep defaults)
   - Click **"Deploy"**

5. **Vercel builds your app** (takes 3-5 minutes)

6. **You should see:**
   ```
   ✓ Production build succeeded
   ✓ Your site is live!
   ```

7. **Your Live URL:**
   ```
   https://photoprint-studio.vercel.app
   ```

---

## **Step 6: Add Environment Variables to Vercel** (3 minutes)

Connect your Stripe keys.

### **In Vercel Dashboard:**

1. **Click your project** ("photoprint-studio")

2. **Click "Settings"** (top menu)

3. **Click "Environment Variables"** (left sidebar)

4. **Add Variable 1: Stripe Publishable Key**
   - **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Value:** `pk_test_YOUR_KEY_FROM_STRIPE`
   - Click **"Save"**

5. **Add Variable 2: Stripe Secret Key**
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_YOUR_KEY_FROM_STRIPE`
   - Click **"Save"**

6. **Add Variable 3: Admin Password**
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** `admin123` (or your custom password)
   - Click **"Save"**

7. **Add Variable 4: App URL**
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://photoprint-studio.vercel.app`
   - Click **"Save"**

### **Redeploy with Variables:**

1. **Click "Deployments"** tab

2. **Find the latest deployment** (top of list)

3. **Click the three dots (...)** on the right

4. **Click "Redeploy"**

5. **Wait 2-3 minutes** for redeploy

---

## **Step 7: Test Your Live App** (5 minutes)

Verify everything works.

### **Visit Your App**

Open browser to:
```
https://photoprint-studio.vercel.app
```

You should see:
- ✅ PhotoMagnet Pro header
- ✅ Professional design
- ✅ Photo upload form

### **Test Customer Features**

1. **Upload a test photo**
   - Click upload area
   - Select any JPG or PNG
   - See quality score appear (0-100)

2. **Test Image Editor**
   - Click uploaded photo
   - Zoom in/out
   - Pan around
   - See quality update live

3. **Select a Package**
   - Click package selector
   - Choose a package
   - See price

4. **See Payment Options**
   - Click "Continue to Payment"
   - See Stripe and Local Pickup options

### **Test Admin Portal**

1. **Visit:** `https://photoprint-studio.vercel.app/admin`

2. **Enter password:** `admin123` (or your password)

3. **You should see:**
   - ✅ Orders tab
   - ✅ Packages tab
   - ✅ Settings tab
   - ✅ Audit Reports tab

### **Test Stripe Payment**

1. **On homepage, upload photo → Click "Continue to Payment"**

2. **Choose "Stripe Payment"**

3. **Use test card:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ```

4. **Click "Pay Now"**

5. **You should see success!**
   - ✅ "Payment successful" message
   - ✅ Order confirmation page
   - ✅ Order number created

**No real money charged!** (Test mode only)

---

## **Troubleshooting**

### **"Build Failed" in Vercel**

**Solution:**
1. Click "Deployments" tab
2. Click failed deployment
3. Scroll to see build errors
4. Usually missing environment variable
5. Add missing variable and redeploy

### **App Loads but Features Don't Work**

**Solution:**
1. Press F12 (open browser console)
2. Look for red error messages
3. Usually environment variable issue
4. Check all 4 variables are set correctly in Vercel
5. Click redeploy in Vercel

### **Admin Password Doesn't Work**

**Solution:**
1. Check `ADMIN_PASSWORD` in Vercel → Settings → Environment Variables
2. Make sure it matches what you set
3. No extra spaces
4. Click redeploy in Vercel
5. Try again

### **Stripe Not Working**

**Solution:**
1. Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`
2. Check `STRIPE_SECRET_KEY` starts with `sk_test_`
3. No extra spaces or quotes
4. Keys copied exactly from Stripe dashboard
5. Click redeploy in Vercel
6. Try payment again

---

## **After Deployment**

### **Your App is Now Live!**

Share your link:
```
https://photoprint-studio.vercel.app
```

### **Every Time You Push to GitHub...**

Vercel auto-deploys! Here's how to update:

1. **In GitHub repo, edit a file:**
   - Click file name
   - Click pencil icon (edit)
   - Make changes
   - Scroll down to "Commit changes"
   - Click "Commit changes"

2. **Vercel automatically:**
   - Detects the change
   - Rebuilds your app
   - Deploys to production
   - Takes 2-5 minutes

3. **Your live app updates!** ✓

### **Update Code Workflow**

```
Edit in GitHub → Vercel sees change → Auto-deploys → Your app updates
```

No need to touch Vercel or terminal - it's all automatic!

---

## **Use Your App for Your Business**

Now that it's live, start using it!

### **Process Real Magnet Orders**

1. **Upload your magnet photos**
2. **Set up magnet products** (in Admin)
3. **Share the link with customers**
4. **Process real orders**
5. **Document everything**
   - How many orders?
   - Time saved?
   - What works?
   - What needs improvement?

### **Collect Success Metrics**

Track:
- Orders processed per week
- Average order value
- Time to process an order
- Customer feedback
- Feature requests

This becomes your **case study** for selling to other photographers!

---

## **Next Steps (What's Coming)**

### **Phase 1: Your Own Business** (NOW - Weeks 1-4)
- ✅ Live app on Vercel
- Use for your magnet business
- Document results
- Build case study

### **Phase 2: Multi-Tenant System** (Weeks 5-8)
- Add ability for other photographers
- White-label customization
- Payment processor selection
- Ready for beta customers

### **Phase 3: Beta Customers** (Weeks 9-12)
- Invite 10 photographers
- Free trial
- Collect testimonials
- Proof of concept

### **Phase 4: Launch & Scale** (Months 4-6+)
- Public launch
- Marketing
- Growth to 100+ customers
- Revenue generation

---

## **Quick Reference**

| Item | Value |
|------|-------|
| **GitHub Repo** | https://github.com/jordanwrussell/photoprint-studio |
| **Live App** | https://photoprint-studio.vercel.app |
| **Admin Login** | /admin (password: admin123) |
| **Test Card** | 4242 4242 4242 4242 |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Vercel Dashboard** | https://vercel.com |

---

## **You're Done!** 🎉

You now have:
✅ Code on GitHub
✅ App live on Vercel
✅ Stripe payment processing
✅ Admin dashboard working
✅ Production-ready platform

**Next:** Start using it for your magnet business and document the results!

---

**Questions during setup?** 
Check the troubleshooting section above.

**Ready to scale to other photographers?**
We'll build Phase 2 (multi-tenant) after you document success with Phase 1.

Happy selling! 📸💰

