# PhotoPrint Studio - Local Installation Guide (Windows/Mac/Linux)

## System Requirements

### Minimum Requirements
- **OS:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM:** 4GB (8GB recommended)
- **Storage:** 2GB free space
- **Node.js:** 18.0.0 or higher
- **npm:** 8.0.0 or higher

### Optional
- Git (for version control)
- Docker (for containerization)
- SQLite Browser (for database inspection)

---

## Step 1: Install Node.js & npm

### Windows
1. Visit https://nodejs.org/
2. Download "LTS" version (recommended)
3. Run installer
4. Follow installation wizard (keep default settings)
5. Restart your computer
6. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### macOS
Using Homebrew (recommended):
```bash
brew install node
```

Or download from https://nodejs.org/

Verify:
```bash
node --version
npm --version
```

### Linux (Ubuntu)
```bash
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

---

## Step 2: Download Project Files

### Option A: Download ZIP (No Git)
1. Download project files as ZIP
2. Extract to folder (e.g., `C:\Users\YourName\photoprint-studio`)
3. Open terminal/command prompt in that folder

### Option B: Clone with Git
```bash
git clone https://github.com/yourrepo/photoprint-studio.git
cd photoprint-studio
```

---

## Step 3: Install Dependencies

In your project directory:
```bash
npm install
```

This downloads all required packages (~400MB):
- Next.js
- React
- Stripe SDK
- SQLite
- Tailwind CSS
- And more...

**Wait time:** 3-10 minutes depending on internet speed

---

## Step 4: Configure Environment Variables

### Create `.env.local` file
In your project root folder, create a file named `.env.local`

**Windows:** 
- Right-click in folder → New → Text Document
- Rename to `.env.local`

**Mac/Linux:**
```bash
touch .env.local
```

### Add Configuration
Copy this into `.env.local`:
```env
# Stripe Keys (get from https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Shopify (optional)
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

### Get Stripe Keys (Free)
1. Visit https://dashboard.stripe.com
2. Create free account
3. Click "Developers" → "API Keys"
4. Copy test keys (start with `pk_test_` and `sk_test_`)
5. Paste into `.env.local`

---

## Step 5: Set Up Database

```bash
npm run db:setup
```

This creates:
- `data/` folder
- `data/app.db` (SQLite database file)
- All tables (users, orders, packages, etc.)

**Output should show:**
```
✓ Database initialized successfully
```

---

## Step 6: Start Development Server

```bash
npm run dev
```

**Output should show:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Step 7: Access the Application

### Customer Interface
Visit: http://localhost:3000

You should see:
- PhotoPrint Studio header
- Upload form
- "Premium Photo Prints" description

### Admin Dashboard
Visit: http://localhost:3000/admin

Login with:
- Password: (whatever you set in `.env.local` as ADMIN_PASSWORD)

---

## Testing the Application

### Test Upload
1. Go to http://localhost:3000
2. Upload a test photo (JPG, PNG, or WebP)
3. See quality score in editor
4. Edit photo (zoom/pan)
5. Select a package
6. Choose payment method (Stripe or Local Pickup)

### Test Admin
1. Go to http://localhost:3000/admin
2. Enter admin password
3. Click "Orders" tab to see submitted orders
4. Click "Packages" tab to create new packages
5. Click "Settings" to configure payment options

### Test Stripe Payment (Sandbox)
Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

## Project Structure (Local)

```
photoprint-studio/
├── app/                          # Next.js app directory
│   ├── page.js                  # Home page
│   ├── admin/page.js            # Admin dashboard
│   ├── checkout/                # Payment pages
│   └── api/                     # API routes
├── components/                   # React components
├── lib/                         # Utility functions
├── styles/                      # CSS files
├── public/
│   └── uploads/                 # Customer photos stored here
├── data/
│   └── app.db                  # SQLite database (created by db:setup)
├── scripts/
│   └── db-setup.js             # Database initialization
├── .env.local                  # Your configuration (IMPORTANT!)
├── package.json                # Dependencies
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
└── README.md                   # Documentation
```

---

## Common Issues & Solutions

### Issue: "npm command not found"
**Solution:** Node.js not installed or not in PATH
- Restart computer after installing Node.js
- Verify with: `node --version`

### Issue: Port 3000 already in use
**Solution:** Another app using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

Or use different port:
```bash
PORT=3001 npm run dev
```

### Issue: Database errors
**Solution:** Reset database
```bash
rm -rf data/app.db
npm run db:setup
```

### Issue: `.env.local` not being read
**Solution:** Make sure file is named exactly `.env.local` (not `.env.local.txt`)

### Issue: Stripe not working
**Solution:** Verify keys in `.env.local`
- Keys should start with `pk_test_` and `sk_test_`
- No extra spaces
- Reload page after changing .env.local

### Issue: "Cannot find module"
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

---

## Development Workflow

### During Development
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Make code changes
# Files auto-reload (no restart needed)
```

### File Changes
- **React components** → Instant reload
- **API routes** → Instant reload
- **`.env.local`** → Requires server restart
- **Database schema** → Requires manual update

### View Database
Download SQLite Browser (free):
https://sqlitebrowser.org/

Open `data/app.db` to:
- View orders
- See customer info
- Check package data
- Inspect photos URLs

---

## Optional: Install Development Tools

### Visual Studio Code (Free)
1. Download: https://code.visualstudio.com/
2. Install
3. Open project folder
4. Recommended extensions:
   - ES7+ React/Redux/React-Native
   - Tailwind CSS IntelliSense
   - SQLite

### Git (Version Control)
```bash
# Windows/Mac: https://git-scm.com/downloads
# Linux: sudo apt install git

git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## Stopping the Server

### Terminal
Press: `Ctrl + C`

**Output:**
```
^C
```

---

## Restarting the Server

```bash
npm run dev
```

---

## Create Initial Data

### Add Test Package
1. Go to http://localhost:3000/admin
2. Login
3. Click "Packages" tab
4. Fill in:
   - Name: "Test Package"
   - Quantity: 1
   - Price: 29.99
5. Click "Create Package"

### Test Order
1. Go to http://localhost:3000
2. Upload a photo
3. Select "Test Package"
4. Choose payment method
5. Try checkout (doesn't complete without real Stripe account)

---

## Next Steps

### To Go to Production
See: `INSTALLATION_GUIDE_PRODUCTION.md`

### To Customize
1. Edit components in `components/`
2. Edit styles in `styles/globals.css`
3. Modify colors in `tailwind.config.js`
4. Update text in pages (app/page.js, etc.)

### To Deploy
1. Create account on Vercel, Railway, or similar
2. Connect GitHub repo
3. Add environment variables
4. Deploy (usually one-click)

---

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Initialize database
npm run db:setup

# View installed packages
npm list

# Update packages
npm update

# Check for security issues
npm audit
```

---

## Getting Help

### Check Documentation
- `SETUP_GUIDE.md` - Full setup instructions
- `QUICK_REFERENCE.md` - API reference
- `FEATURES_GUIDE.md` - Feature details

### Common Errors
- Check project's GitHub issues
- Search error message in Google
- Look in browser console (F12)
- Check server terminal for errors

### Logs
The terminal shows:
- Server start messages
- Request logs
- Errors with full stack traces
- Build status

---

## Production Checklist

Before deploying to production:
- [ ] Change ADMIN_PASSWORD to strong password
- [ ] Get live Stripe keys (pk_live_, sk_live_)
- [ ] Create privacy policy page
- [ ] Create terms & conditions page
- [ ] Test all features locally
- [ ] Review all configuration
- [ ] Back up database schema
- [ ] Plan hosting environment

---

## Security Notes (Local Development)

⚠️ **Local Only:**
- `.env.local` contains sensitive keys
- Only store test/development keys locally
- Never commit `.env.local` to Git
- `.gitignore` already excludes it

✅ **Before Production:**
- Use production-grade secrets management
- Never hardcode credentials
- Use environment variables on server
- Use HTTPS/SSL certificates
- Enable firewall rules

---

**Ready to develop!** Your local PhotoPrint Studio is up and running. 🚀

Happy coding! 🎨📸
