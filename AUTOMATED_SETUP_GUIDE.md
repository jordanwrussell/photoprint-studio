# PhotoMagnet Pro - Automated Setup Scripts

## What These Scripts Do

I've created **automated setup scripts** that handle all the boring stuff for you:

✅ Check if Git and Node.js are installed
✅ Clone your GitHub repository
✅ Install all dependencies
✅ Create `.env.local` file with your Stripe keys
✅ Initialize the database
✅ Print instructions to start developing

**Time saved:** 15-20 minutes → 3-5 minutes

---

## **For Mac/Linux Users**

### **Step 1: Download the Script**

Download `setup-photomagnet.sh` from the outputs folder and save to your computer.

Or copy-paste this URL:
```
https://github.com/jordanwrussell/photoprint-studio/raw/main/setup-photomagnet.sh
```

### **Step 2: Make It Executable**

Open Terminal and run:
```bash
chmod +x ~/Downloads/setup-photomagnet.sh
```

(Adjust path if you saved it elsewhere)

### **Step 3: Run the Script**

```bash
~/Downloads/setup-photomagnet.sh
```

Or just double-click it in Finder (then click "Open")

### **Step 4: Follow the Prompts**

The script will ask:
1. **Where to clone?** (press Enter for default: `~/photomagnet`)
2. **Stripe Publishable Key** (copy from https://dashboard.stripe.com)
3. **Stripe Secret Key** (copy from Stripe)
4. **Admin Password** (press Enter for `admin123`)

That's it! ✓

---

## **For Windows Users**

### **Step 1: Download the Script**

Download `setup-photomagnet.bat` from the outputs folder to your computer.

### **Step 2: Run the Script**

Double-click `setup-photomagnet.bat`

A command prompt window opens and runs the setup.

### **Step 3: Follow the Prompts**

The script will ask:
1. **Where to clone?** (press Enter for default)
2. **Stripe Publishable Key**
3. **Stripe Secret Key**
4. **Admin Password**

That's it! ✓

---

## **What You Need Before Running**

### **Prerequisites**

Before running the script, make sure you have:

1. **Git** installed
   - Download from: https://git-scm.com/download/win

2. **Node.js LTS** installed
   - Download from: https://nodejs.org/
   - Get the **LTS (Long Term Support)** version
   - This automatically installs npm too

3. **Stripe account** (free)
   - Go to: https://dashboard.stripe.com/register
   - Sign up (takes 5 minutes)
   - Get your test keys from Developers → API Keys

### **Verify Prerequisites**

Open Terminal/Command Prompt and run:

**Mac/Linux:**
```bash
git --version
node --version
npm --version
```

**Windows:**
```cmd
git --version
node --version
npm --version
```

All three should show version numbers. If any fail, install that software first.

---

## **Step-by-Step Walkthrough**

### **Complete Setup in 5 Minutes**

#### **1. Get Your Stripe Keys** (2 min)
- Visit: https://dashboard.stripe.com
- Sign up if needed
- Click "Developers" (top right)
- Click "API Keys"
- Copy both keys (pk_test_... and sk_test_...)
- Keep these ready

#### **2. Run the Script** (1 min)
**Mac/Linux:**
```bash
chmod +x setup-photomagnet.sh
./setup-photomagnet.sh
```

**Windows:**
- Double-click `setup-photomagnet.bat`

#### **3. Answer the Questions** (2 min)
When prompted:
- Where to clone: Press Enter (or type a path)
- Stripe Publishable Key: Paste your `pk_test_...` key
- Stripe Secret Key: Paste your `sk_test_...` key
- Admin Password: Press Enter or type your own

#### **4. Wait for Installation** (2-5 min)
The script:
- Clones your GitHub repo
- Downloads and installs all packages
- Creates configuration files
- Sets up the database

#### **5. Start Developing** (Instant)
The script outputs:
```bash
cd ~/photomagnet
npm run dev
```

Then open: http://localhost:3000

---

## **After Setup**

### **First Time Starting the App**

```bash
# Navigate to your project
cd ~/photomagnet    # Mac/Linux
cd %USERPROFILE%\photomagnet    # Windows

# Start development server
npm run dev
```

You should see:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
✓ Ready
```

### **Visit Your App**

Open browser to: `http://localhost:3000`

You should see:
- PhotoMagnet Pro header
- Photo upload form
- Professional design

### **Test Admin Portal**

Visit: `http://localhost:3000/admin`

Login with password: `admin123` (or your custom password)

### **Test Stripe Payment**

1. Upload a test photo
2. Click "Continue to Payment"
3. Choose "Stripe Payment"
4. Use test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
5. Click "Pay Now"
6. You should see success message

**No real money charged!** (Test mode only)

---

## **If Something Goes Wrong**

### **Script Says "Git not found"**
- Download Git: https://git-scm.com/
- Restart your Terminal/Command Prompt
- Try again

### **Script Says "Node.js not found"**
- Download Node.js: https://nodejs.org/
- Get the **LTS** version
- Restart your Terminal/Command Prompt
- Try again

### **npm install fails**
- Make sure you have internet connection
- Try: `npm install --legacy-peer-deps`
- Or delete `node_modules` folder and try again

### **Port 3000 already in use**
- Use different port: `npm run dev -- -p 3001`
- Then visit: http://localhost:3001

### **Database error**
- Delete the database: `rm data/app.db` (Mac/Linux) or delete manually (Windows)
- Reinitialize: `npm run db:setup`

---

## **Pro Tips**

### **Keep Terminal Open**
Keep the terminal window with `npm run dev` running while you develop
- Changes auto-reload
- See errors in real-time
- Press Ctrl+C to stop when done

### **Use a Code Editor**
I recommend **VS Code** (free):
- Download: https://code.visualstudio.com/
- Open your `photomagnet` folder
- Use built-in terminal for commands
- Get syntax highlighting for code

### **Make Changes Easily**
1. Edit any file in the `app/`, `components/`, or `lib/` folders
2. Save the file
3. Browser auto-refreshes
4. See your changes instantly

### **Push Changes to GitHub**
When you want to save your work online:
```bash
git add .
git commit -m "Your message describing changes"
git push origin main
```

---

## **Next Steps**

### **After Successful Setup**

1. **Test the app locally**
   - Upload photos
   - Test the editor
   - Try payment

2. **Use it for your magnet business**
   - Process real magnet orders
   - Document the workflow
   - Note what works and what needs improvement

3. **Deploy to Vercel** (when ready)
   - Push to GitHub
   - Go to https://vercel.com
   - Import your repo
   - Add environment variables
   - Your app is live!

4. **Build Phase 2** (multi-tenant)
   - Add features for other magnet photographers
   - Create white-label version
   - Scale to 100+ customers

---

## **Files You'll Have**

After setup, you'll have:

```
photomagnet/
├── app/                    # Pages & routes
├── components/            # React components
├── lib/                   # Utilities
├── styles/               # CSS
├── package.json          # Dependencies list
├── .env.local            # Your secret keys (created by script)
├── node_modules/         # All packages (created by script)
└── data/
    └── app.db            # Database (created by script)
```

---

## **Getting Help**

### **During Setup**
- Check QUICK_REFERENCE_CARD.md
- Check LOCAL_SETUP_COMPLETE.md
- Check troubleshooting section above

### **During Development**
- Check LOCAL_SETUP_COMPLETE.md for development workflow
- Check QUICK_REFERENCE_CARD.md for commands

### **When Deploying**
- Check VERCEL_DEPLOYMENT_CHECKLIST.md
- Check GITHUB_SETUP_GUIDE.md

---

## **That's It!**

You now have PhotoMagnet Pro running locally with just ONE script! 🚀

**Questions?** Check the section above or review the other guides.

Happy developing! 💻

