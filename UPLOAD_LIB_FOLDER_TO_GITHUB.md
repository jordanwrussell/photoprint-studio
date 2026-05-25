# Upload lib/ Folder to GitHub Directly

## Problem
The `lib/` folder exists on your computer but didn't upload to GitHub with the ZIP.

## Solution: Upload lib Files Manually to GitHub

---

## **Step 1: Go to GitHub**

Visit: https://github.com/jordanwrussell/photoprint-studio

---

## **Step 2: Create lib/db.js**

1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `lib/db.js`
3. **Content:** Copy this exactly:

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

4. Click **"Commit new file"**

---

## **Step 3: Create lib/image-validation.js**

1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `lib/image-validation.js`
3. **Content:** Copy from `/home/claude/lib/image-validation.js` OR see file below

[See: UPLOAD_IMAGE_VALIDATION.md for content]

4. Click **"Commit new file"**

---

## **Step 4: Create lib/order-numbering.js**

1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `lib/order-numbering.js`
3. **Content:** Copy from your computer OR see guide

4. Click **"Commit new file"**

---

## **Step 5: Create lib/stripe-utils.js**

1. Click **"Add file"** → **"Create new file"**
2. **Filename:** `lib/stripe-utils.js`
3. **Content:**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amount, metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata,
    });
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}

module.exports = { createPaymentIntent };
```

4. Click **"Commit new file"**

---

## **EASIER WAY: Copy Files From Your Computer**

Since you have the `lib/` folder on your computer:

1. Open your `lib/` folder on your computer
2. Open each file (db.js, image-validation.js, order-numbering.js, stripe-utils.js)
3. Copy the entire content
4. Paste into GitHub following steps above

---

## **After Uploading lib Files:**

1. Clear Vercel cache
2. Redeploy
3. Build should now find the files!

---

## **Fastest Option:**

Let me know the content of these files and I can create them in GitHub for you directly:
- lib/image-validation.js
- lib/order-numbering.js

I already have the content for db.js and stripe-utils.js above.

