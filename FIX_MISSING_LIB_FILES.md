# Fix: Missing lib/db.js Error

## Problem
Error: "Module not found: Can't resolve '@/lib/db'"

This means the `lib/` folder or its files didn't get uploaded to GitHub.

---

## Solution: Upload Missing Files to GitHub

### **Step 1: Verify Files Exist in Your ZIP**

When you extracted the ZIP on your computer, you should have this structure:
```
photoprint-studio/
├── app/
├── components/
├── lib/           ← THIS FOLDER
│   ├── db.js
│   ├── image-validation.js
│   ├── order-numbering.js
│   └── stripe-utils.js
├── scripts/
├── styles/
├── package.json
└── ...
```

Check: **Do you have a `lib/` folder on your computer?**

---

## **Option A: Re-upload Entire ZIP** (RECOMMENDED)

### Step 1: Delete GitHub Files
1. Go to: https://github.com/jordanwrussell/photoprint-studio
2. Delete ALL files (keep the repo, just remove files)

### Step 2: Upload ZIP Again
1. Click "Add file" → "Upload files"
2. Drag your `photoprint-studio.tar.gz` ZIP
3. Commit: "Fresh upload - include all lib files"
4. Wait 2-3 minutes

### Step 3: Add Config Files
1. Create `.npmrc` (see guide)
2. Create/update `package.json` (see guide)
3. Create/update `next.config.js` (see guide)
4. Commit all

### Step 4: Clear Vercel Cache & Redeploy
1. Vercel Dashboard → Settings → Git → Clear Cache
2. Deployments → Redeploy
3. Wait 10-15 minutes

---

## **Option B: Manually Upload lib/ Folder** (IF YOU KNOW FILES)

If you want to be surgical about it:

### Step 1: In GitHub, Create lib Folder
1. Go to your repo
2. Click "Add file" → "Create new file"
3. Filename: `lib/db.js`
4. Content: Copy from below

### Step 2: Add Each File

**File 1: `lib/db.js`**
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || './data/app.db';
const db = new sqlite3.Database(dbPath);

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { runAsync, getAsync, allAsync, db };
```

---

## **QUICKEST FIX: Option A (Re-upload Entire ZIP)**

1. Delete all GitHub files
2. Upload your ZIP again
3. Add `.npmrc`, `package.json`, `next.config.js`
4. Clear Vercel cache
5. Redeploy

This takes 10 minutes and guarantees everything is included.

---

## **Verify Upload Worked**

After uploading, check GitHub:
1. Go to your repo: https://github.com/jordanwrussell/photoprint-studio
2. You should see folder structure:
   - ✅ `app/` folder
   - ✅ `components/` folder
   - ✅ `lib/` folder (THIS IS KEY!)
   - ✅ `scripts/` folder
   - ✅ `styles/` folder

If `lib/` folder is missing, your files didn't upload properly.

---

## **If Still Not Working**

The most reliable fix is the "nuclear option":

1. Delete entire GitHub repo
2. Create new repo `photoprint-studio-v2`
3. Upload ZIP fresh
4. Add config files
5. Deploy to Vercel

This guarantees a clean start.

---

**Try Option A first** - it's the fastest and most reliable! 🚀

