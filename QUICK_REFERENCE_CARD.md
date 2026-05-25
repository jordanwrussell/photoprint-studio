# PhotoMagnet Pro - Quick Reference Card

## Your Complete Setup Path

---

## **BEFORE YOU START** ✅

Make sure you have:
- [ ] Git installed (`git --version`)
- [ ] Node.js LTS installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Stripe account (https://stripe.com)
- [ ] Your Stripe test keys

---

## **5-MINUTE SETUP** ⚡

### **1. Clone Repository**
```bash
git clone https://github.com/jordanwrussell/photoprint-studio.git
cd photoprint-studio
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Create `.env.local` File**
Create file in project root with:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_PATH=./data/app.db
```

### **4. Initialize Database**
```bash
npm run db:setup
```

### **5. Start Development Server**
```bash
npm run dev
```

### **6. Open in Browser**
Visit: `http://localhost:3000`

---

## **ESSENTIAL COMMANDS**

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start local server (http://localhost:3000) |
| `npm run db:setup` | Initialize database |
| `npm install` | Install all dependencies |
| `git status` | See what changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes locally |
| `git push origin main` | Upload to GitHub |
| `git pull origin main` | Download from GitHub |

---

## **PROJECT STRUCTURE**

```
photoprint-studio/
├── app/                    # Pages & API
├── components/            # React components
├── lib/                   # Utilities & helpers
├── styles/               # CSS
├── package.json          # Dependencies
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind styles
└── .env.local            # Your secrets (CREATE THIS)
```

---

## **YOUR GITHUB REPO**

```
https://github.com/jordanwrussell/photoprint-studio
```

Commands to sync with GitHub:
```bash
# Download latest
git pull origin main

# Upload your changes
git add .
git commit -m "Your message"
git push origin main
```

---

## **LOCAL DEVELOPMENT WORKFLOW**

1. **Edit a file** → Save
2. **Browser auto-refreshes** → See changes instantly
3. **Keep terminal open** with `npm run dev` running
4. **When ready to deploy:**
   ```bash
   git add .
   git commit -m "Feature name"
   git push origin main
   ```

---

## **TEST DATA**

### **Admin Login**
- URL: `http://localhost:3000/admin`
- Password: `admin123` (or your `.env.local` password)

### **Test Payment**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- **No real money charged** (test mode)

---

## **COMMON ISSUES**

| Problem | Solution |
|---------|----------|
| "npm: command not found" | Install Node.js from nodejs.org |
| "Port 3000 already in use" | `npm run dev -- -p 3001` |
| ".env.local not found" | Create it in root folder |
| "Database error" | `rm data/app.db && npm run db:setup` |
| "Module not found" | `rm -rf node_modules && npm install` |

---

## **DEPLOYMENT TO VERCEL**

When ready to deploy:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to Vercel**: https://vercel.com

3. **Import your repo** `photoprint-studio`

4. **Add Environment Variables:**
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL`

5. **Deploy** → Your app is live!

---

## **KEY FILES TO UNDERSTAND**

| File | Purpose |
|------|---------|
| `app/page.js` | Customer homepage |
| `app/admin/page.js` | Admin dashboard |
| `app/api/orders/route.js` | Order API |
| `components/ImageEditor.js` | Photo editor |
| `lib/db.js` | Database helpers |
| `lib/image-validation.js` | Quality scoring |
| `.env.local` | Secret keys (CREATE THIS) |

---

## **YOU'RE READY TO:**

✅ **Run locally** - `npm run dev`
✅ **Test features** - Upload photos, edit, payment
✅ **Make changes** - Edit code, see instant updates
✅ **Deploy** - Push to GitHub, Vercel auto-deploys
✅ **Use for business** - Process real magnet orders

---

## **NEXT STEPS**

1. Follow LOCAL_SETUP_COMPLETE.md for detailed setup
2. Run the app locally (`npm run dev`)
3. Test all features
4. Use for your magnet business
5. Document workflow & metrics
6. Deploy to Vercel when ready

---

## **HELP**

- **Setup issues?** → LOCAL_SETUP_COMPLETE.md
- **Vercel deployment?** → VERCEL_DEPLOYMENT_CHECKLIST.md
- **Business strategy?** → PHOTOMAGNET_SAAS_STRATEGY.md
- **Technical details?** → SAAS_ARCHITECTURE_GUIDE.md

---

**You've got this!** 🚀

Start with: `git clone https://github.com/jordanwrussell/photoprint-studio.git`

