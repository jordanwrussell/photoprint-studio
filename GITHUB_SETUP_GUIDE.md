# PhotoPrint Studio - GitHub Setup Guide (Easy 10-Minute Deploy)

## Overview
This guide walks you through uploading your PhotoPrint Studio code to GitHub, then deploying to Vercel. **No command line needed!**

---

## Step 1: Create GitHub Account (FREE)

### 1.1 Visit GitHub
Go to: https://github.com/signup

### 1.2 Sign Up
Fill in:
- **Username:** `yourname` (can be anything)
- **Email:** Your email address
- **Password:** Strong password (8+ characters)

Click **"Create account"**

### 1.3 Verify Email
- GitHub sends verification email
- Click verification link
- Done! ✓

---

## Step 2: Create New Repository

### 2.1 Go to Repositories
Once logged in, click your profile icon (top right) → **"Your repositories"**

Or go directly to: https://github.com/new

### 2.2 Create Repository
Fill in:
- **Repository name:** `photoprint-studio`
- **Description:** `Professional photo printing app with quality control`
- **Public:** ✓ (checked - anyone can see it)
- **Initialize with README:** ✓ (checked)

**Click "Create repository"**

### 2.3 Success!
You now have an empty repository at:
```
https://github.com/YOUR_USERNAME/photoprint-studio
```

---

## Step 3: Prepare Project Files

### 3.1 Create Project ZIP
We need to prepare all project files as a ZIP file.

**On your computer:**
1. Go to `/home/claude/` folder
2. Select ALL files and folders:
   - `app/`
   - `components/`
   - `lib/`
   - `public/`
   - `scripts/`
   - `styles/`
   - `package.json`
   - `tailwind.config.js`
   - `next.config.js`
   - `postcss.config.js`
   - `.gitignore`
   - All documentation files (*.md)
3. Right-click → **"Compress"** (Mac) or **"Send to" → "Compressed folder"** (Windows)
4. Name it: `photoprint-studio-files.zip`

### 3.2 Extract ZIP (if needed)
When ready to upload, extract the ZIP file so you have individual files ready.

---

## Step 4: Upload Files to GitHub (Easy Web Method)

### 4.1 Open Your Repository
Visit: `https://github.com/YOUR_USERNAME/photoprint-studio`

### 4.2 Add Files
1. Click **"Add file"** (green button, top right)
2. Click **"Upload files"**

### 4.3 Drag & Drop
1. Either:
   - **Drag files** from your computer into the upload area
   - **Click** to select files to browse

2. Select all files from the ZIP extraction

### 4.4 Commit Files
1. At bottom, in "Commit changes" section:
   - **Branch:** `main` (default)
   - **Message:** `Initial commit - PhotoPrint Studio`
2. Click **"Commit changes"**

### 4.5 Wait for Upload
GitHub uploads files (usually takes 1-2 minutes)

**Your repository now contains all project files!** ✓

---

## Step 5: Create `.env.local` File in GitHub

### 5.1 Create New File
In your repository:
1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `.env.local`

### 5.2 Add Configuration
Copy this into the file:

```env
# Stripe Keys (Replace with YOUR keys from https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Shopify (Optional - leave as is if not using)
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token_here
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/12345
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Admin Settings
ADMIN_PASSWORD=change_me_to_secure_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_PATH=./data/app.db
```

### 5.3 Commit File
Click **"Commit new file"**

⚠️ **Note:** This `.env.local` is for local development only. For production (Vercel), you'll add variables differently (we'll do that next).

---

## Step 6: Create `.gitignore` File

### 6.1 Create File
1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `.gitignore`

### 6.2 Add Content
```
# Dependencies
node_modules/
.next/

# Environment variables (local development only)
.env.local
.env.*.local

# Build output
out/
.vercel/

# Logs
npm-debug.log*
yarn-debug.log*

# Database
data/app.db
data/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 6.3 Commit
Click **"Commit new file"**

---

## Step 7: Get Stripe Test Keys

### 7.1 Create Stripe Account
Visit: https://dashboard.stripe.com/register

### 7.2 Sign Up
Fill in business info (you can use personal info for testing)

### 7.3 Get Test Keys
1. In Stripe Dashboard, click **"Developers"** (top right)
2. Click **"API Keys"**
3. You see two keys:
   - **Publishable key:** Starts with `pk_test_`
   - **Secret key:** Starts with `sk_test_`
4. Copy both (you'll use these in Vercel)

---

## Step 8: Create Vercel Account

### 8.1 Visit Vercel
Go to: https://vercel.com/signup

### 8.2 Sign Up with GitHub
Click **"Continue with GitHub"**
- GitHub asks permission
- Click **"Authorize Vercel"**

### 8.3 Success
You're now in Vercel dashboard!

---

## Step 9: Deploy to Vercel

### 9.1 Import Repository
1. In Vercel Dashboard, click **"New Project"**
2. Under "Import Git Repository", you should see your GitHub repo
3. Click on **"photoprint-studio"**
4. Click **"Import"**

### 9.2 Configure Project
1. **Project name:** `photoprint-studio` (default is fine)
2. **Framework:** `Next.js` (auto-detected)
3. Click **"Deploy"**

Vercel now builds your app (takes 2-5 minutes)

### 9.3 Wait for Deployment
You'll see:
```
✓ Production build succeeded
✓ Your app is live!
```

**Your app is now live at:** `https://photoprint-studio.vercel.app`

---

## Step 10: Add Environment Variables to Vercel

### 10.1 Go to Settings
1. In Vercel dashboard, click your project
2. Click **"Settings"** (top tab)
3. Click **"Environment Variables"** (left menu)

### 10.2 Add Variables
For each variable, click **"Add New"**:

**Variable 1: Stripe Publishable Key**
- **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_YOUR_KEY_FROM_STRIPE`
- Click **"Save"**

**Variable 2: Stripe Secret Key**
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_YOUR_KEY_FROM_STRIPE`
- Click **"Save"**

**Variable 3: Admin Password**
- **Name:** `ADMIN_PASSWORD`
- **Value:** `your_secure_password_here`
- Click **"Save"**

**Variable 4: App URL**
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://photoprint-studio.vercel.app`
- Click **"Save"**

### 10.3 Redeploy
1. Click **"Deployments"** tab
2. Click the three dots on latest deployment
3. Click **"Redeploy"**

Your app redeploys with the new environment variables!

---

## Step 11: Test Your Live App

### 11.1 Visit Your App
Go to: `https://photoprint-studio.vercel.app`

You should see:
- PhotoPrint Studio header
- Upload form
- Professional design

### 11.2 Test Customer Features
1. Upload a test photo (JPG or PNG)
2. See quality score appear
3. Edit photo (zoom/pan)
4. Try selecting a package
5. See payment options

### 11.3 Test Admin
Visit: `https://photoprint-studio.vercel.app/admin`
- **Password:** Whatever you set in `ADMIN_PASSWORD`
- You should see Orders, Packages, Settings tabs

### 11.4 Test Stripe
1. Click "Stripe Payment" on checkout
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC
5. Complete payment

---

## Troubleshooting

### "Build failed" Error
**Solution:** 
1. Check Vercel build logs (Deployments tab)
2. Likely missing environment variable
3. Add missing variable and redeploy

### App loads but features don't work
**Solution:**
1. Check browser console (F12)
2. Check Vercel logs
3. Likely environment variable issue
4. Verify all variables are set correctly

### Admin password not working
**Solution:**
1. Check `ADMIN_PASSWORD` in Vercel env vars
2. Make sure it's set to correct value
3. Redeploy app
4. Try again

### Stripe not working
**Solution:**
1. Verify keys in Vercel environment variables
2. Keys should start with `pk_test_` and `sk_test_`
3. No extra spaces
4. Redeploy

---

## Next Steps

### Update Code Later
When you make changes locally:

1. **Edit files locally** (on your computer)
2. **Upload to GitHub:**
   - Go to GitHub repo
   - Click file → Click pencil icon
   - Edit content
   - Click "Commit changes"
3. **Vercel auto-redeploys** (usually within 1 minute)

### Add Custom Domain
To use your own domain (example.com):

1. **Buy domain** from:
   - GoDaddy
   - Namecheap
   - Google Domains
   - Any registrar

2. **Add to Vercel:**
   - Vercel Settings → Domains
   - Enter your domain
   - Update DNS records (Vercel shows instructions)

3. **Wait 24 hours** for DNS to propagate

### Enable Production Features
- Create privacy policy page
- Create terms page
- Switch to live Stripe keys (pk_live_, sk_live_)
- Enable more payment methods
- Set up email notifications

---

## GitHub & Vercel Features

### GitHub Features (Free)
✓ Version control
✓ See all changes/history
✓ Collaborate with team
✓ Backup of code
✓ Issue tracking

### Vercel Features (Free)
✓ Automatic deployments
✓ Global CDN (fast worldwide)
✓ HTTPS/SSL certificate (automatic)
✓ Environment variables
✓ Logs and monitoring
✓ Free tier for personal projects

---

## Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| GitHub | Free | Unlimited repos |
| Vercel | Free | Limited to 100 deployments/month |
| Stripe | Free | 2.9% + $0.30 per transaction |
| Domain | $10-15/year | Optional |

---

## Security Notes

✅ **Good:**
- GitHub is public (code is open-source)
- Vercel has enterprise security
- Stripe handles payment PCI compliance
- Environment variables kept secret

⚠️ **Important:**
- Never commit real Stripe live keys to GitHub
- Admin password in Vercel env vars (not in code)
- Use strong admin password
- Enable HTTPS (Vercel does this automatically)

---

## Support & Help

### GitHub Help
- Docs: https://docs.github.com
- Tutorials: https://github.com/skills

### Vercel Help
- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com

### Stripe Help
- Docs: https://stripe.com/docs
- Dashboard: https://dashboard.stripe.com

---

## Summary Checklist

- [ ] Create GitHub account
- [ ] Create GitHub repository
- [ ] Upload all project files
- [ ] Create `.env.local` file
- [ ] Create `.gitignore` file
- [ ] Create Stripe account
- [ ] Get Stripe test keys
- [ ] Create Vercel account
- [ ] Import repo to Vercel
- [ ] Add environment variables
- [ ] App deploys successfully
- [ ] Test customer features
- [ ] Test admin panel
- [ ] Test Stripe payment

---

**Your PhotoPrint Studio is now live on the internet!** 🎉

Share the link: `https://photoprint-studio.vercel.app`

Any issues? Check the troubleshooting section above. You've got this! 🚀
