# PhotoMagnet Pro - Complete Local Development Setup

## Your Goal
Download PhotoMagnet Pro from GitHub to your computer and run it locally.

---

## **Prerequisites (What You Need on Your Computer)**

### **1. Git** (for cloning repositories)
- **Mac:** `brew install git`
- **Windows:** Download from https://git-scm.com/download/win
- **Linux:** `sudo apt-get install git`

**Verify:** Open terminal/command prompt and run:
```bash
git --version
```
Should show version number if installed ✓

### **2. Node.js & npm** (for running the app)
- Download from: https://nodejs.org/
- Get the **LTS (Long Term Support)** version
- This installs both Node.js and npm

**Verify:** Open terminal/command prompt and run:
```bash
node --version
npm --version
```
Both should show version numbers ✓

---

## **Step 1: Clone Repository from GitHub**

### **Open Terminal/Command Prompt**

**Mac/Linux:**
- Applications → Utilities → Terminal

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

### **Navigate to Where You Want the Project**

Example: Downloads folder
```bash
cd ~/Downloads
```

Or create a new folder first:
```bash
mkdir projects
cd projects
```

### **Clone Your Repository**

```bash
git clone https://github.com/jordanwrussell/photoprint-studio.git
```

You should see:
```
Cloning into 'photoprint-studio'...
Receiving objects: 100% (XX/XX)...
```

### **Navigate into Project**

```bash
cd photoprint-studio
```

### **Verify Files Downloaded**

```bash
ls
```

You should see:
- `app/`
- `components/`
- `lib/`
- `package.json`
- `next.config.js`
- etc.

If you see these folders → ✅ Success!

---

## **Step 2: Install Dependencies**

While still in the `photoprint-studio` folder:

```bash
npm install
```

This will:
- Download all required packages
- Takes 2-5 minutes
- Creates a `node_modules` folder

You'll see lots of text scrolling - this is normal!

When done, you should see:
```
added XXX packages in XXs
```

---

## **Step 3: Create `.env.local` File**

This file stores your secret keys.

### **Option A: Using Terminal**

In the `photoprint-studio` folder, create the file:

**Mac/Linux:**
```bash
nano .env.local
```

**Windows:**
Use Notepad or your code editor (see Option B)

### **Option B: Using Code Editor (Easier)**

1. Open your code editor (VS Code, Sublime, etc.)
2. Open the `photoprint-studio` folder
3. Create new file: `.env.local`
4. Paste this content:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51H6AV2L5JOy7NJzZ_XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_51H6AV2L5JOy7NJzZ_XXXXXXXXXXXXXXXXXXXXXXXX
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token_here
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/12345
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_PATH=./data/app.db
```

### **Add Your Stripe Keys**

1. Go to https://dashboard.stripe.com
2. Click "Developers" (top right)
3. Click "API Keys"
4. Copy your test keys:
   - `pk_test_...` → Replace in `.env.local`
   - `sk_test_...` → Replace in `.env.local`

### **Save the File**

Make sure it's named exactly: `.env.local`
- Not `.env.local.txt`
- Not `env.local`
- Just `.env.local`

---

## **Step 4: Initialize Database (First Time Only)**

```bash
npm run db:setup
```

This creates your SQLite database with tables.

You should see:
```
✓ Database initialized
✓ Tables created
```

---

## **Step 5: Start Development Server**

```bash
npm run dev
```

You should see:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in XXXX ms
```

---

## **Step 6: Open in Browser**

Visit: `http://localhost:3000`

You should see:
- PhotoMagnet Pro header
- Upload form
- Professional design

✅ **It's working!**

---

## **Step 7: Test Features Locally**

### **Customer Features**
1. Upload a test photo (JPG or PNG)
2. See quality score appear
3. Try image editor (zoom, pan)
4. Select packages
5. Try payment options

### **Admin Portal**
1. Visit: `http://localhost:3000/admin`
2. Enter password: `admin123` (or your password)
3. You should see dashboard tabs

---

## **Common Issues & Fixes**

### **"npm: command not found"**
**Solution:**
- Node.js not installed
- Download from https://nodejs.org/
- Restart terminal after install

### **"Port 3000 already in use"**
**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### **".env.local not found"**
**Solution:**
- Make sure file is in root `photoprint-studio` folder
- Make sure it's named exactly `.env.local`
- Check it has no `.txt` extension
- Restart dev server after creating

### **"Database error"**
**Solution:**
```bash
# Delete old database
rm data/app.db

# Recreate
npm run db:setup
```

### **"Module not found"**
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## **Useful Commands**

### **Start Development Server**
```bash
npm run dev
```
Visit: http://localhost:3000

### **Stop Server**
Press `Ctrl + C` in terminal

### **Initialize Database**
```bash
npm run db:setup
```

### **Clear Database**
```bash
rm data/app.db
npm run db:setup
```

### **Update Code from GitHub**
```bash
git pull origin main
```

### **See All Available Commands**
```bash
cat package.json
```
Look for `"scripts"` section

---

## **Project Structure**

```
photoprint-studio/
├── app/                    # Next.js pages & API routes
│   ├── page.js            # Homepage
│   ├── admin/             # Admin portal
│   ├── checkout/          # Payment page
│   └── api/               # API endpoints
├── components/            # React components
│   ├── ImageEditor.js
│   ├── LocalPickupForm.js
│   └── ...
├── lib/                   # Utilities
│   ├── db.js             # Database helpers
│   ├── image-validation.js
│   └── order-numbering.js
├── styles/               # CSS
├── scripts/              # Setup scripts
├── package.json          # Dependencies
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind config
├── .env.local            # Your secret keys (CREATE THIS)
└── data/
    └── app.db            # SQLite database (auto-created)
```

---

## **Development Workflow**

### **1. Make Changes**
Edit any file in `app/`, `components/`, `lib/`, etc.

### **2. Auto-Reload**
Save file → Browser auto-refreshes
(No need to restart server)

### **3. See Changes**
Visit http://localhost:3000 → See updates

### **4. When Ready to Deploy**
```bash
git add .
git commit -m "Your message"
git push origin main
```
Then redeploy in Vercel

---

## **Next Steps**

### **Option A: Test Locally**
1. Run `npm run dev`
2. Test all features locally
3. Process test magnet orders
4. Document workflow

### **Option B: Deploy to Vercel**
1. Push to GitHub (`git push`)
2. Vercel auto-deploys
3. Your app is live!

### **Option C: Both**
1. Test locally first
2. Make improvements
3. Deploy to Vercel
4. Use both versions

---

## **Recommended Code Editors**

### **VS Code** (Free, Recommended)
- Download: https://code.visualstudio.com/
- Extensions: ES7+ React, Tailwind CSS IntelliSense
- Built-in terminal (perfect for npm commands)

### **Other Options**
- WebStorm (paid, very smart)
- Sublime Text (lightweight)
- Vim/Neovim (advanced)

---

## **Git Workflow (Important)**

### **Pull Latest from GitHub**
```bash
git pull origin main
```

### **See Your Changes**
```bash
git status
```

### **Save Your Changes to GitHub**
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Describe your changes"

# Push to GitHub
git push origin main
```

---

## **Pro Tips**

### **Keep Terminal Open**
Leave `npm run dev` running while you work
- Makes development faster
- See errors in real-time

### **Use .gitignore**
Already configured in your repo
- Won't upload `node_modules/`
- Won't upload `.env.local`
- Won't upload `data/app.db`
(These are auto-created)

### **Database is Local**
Every time you run `npm run db:setup`:
- Fresh database
- All test data cleared
- Perfect for testing

### **Test Payment Card**
Use locally and in Vercel:
```
4242 4242 4242 4242
```
Any future date, any CVC

---

## **Troubleshooting Checklist**

- [ ] Git installed? (`git --version`)
- [ ] Node.js installed? (`node --version`)
- [ ] npm installed? (`npm --version`)
- [ ] Repository cloned? (Check folders exist)
- [ ] Dependencies installed? (`npm install` worked)
- [ ] `.env.local` created? (In root folder)
- [ ] Stripe keys added? (To `.env.local`)
- [ ] Database initialized? (`npm run db:setup`)
- [ ] Dev server started? (`npm run dev`)
- [ ] App loads? (http://localhost:3000)

---

## **You're All Set!**

You now have PhotoMagnet Pro running locally on your computer.

**Next Steps:**
1. Explore the app
2. Test features
3. Process magnet orders
4. Document results
5. Deploy to Vercel when ready

**Questions?** Check the troubleshooting section above or review INSTALLATION_GUIDE_LOCAL.md for more details.

Happy coding! 🚀

