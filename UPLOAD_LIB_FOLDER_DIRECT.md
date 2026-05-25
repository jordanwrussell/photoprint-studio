# Upload lib/ Folder to GitHub - Direct Method

## The Problem
Build is failing because `@/lib/db` can't be found.

## The Solution: Upload lib Folder Directly

---

## **Step-by-Step:**

### **Step 1: Go to GitHub**
https://github.com/jordanwrussell/photoprint-studio

### **Step 2: Click "Add file"**
Click the green **"Add file"** button (top right)

### **Step 3: Click "Upload files"**
(NOT "Create new file" - use "Upload files")

### **Step 4: Drag Your lib Folder**
On your computer:
1. Open File Explorer / Finder
2. Navigate to your `photoprint-studio` folder
3. Find the `lib` folder
4. **Drag the entire `lib` folder** into the GitHub upload area

### **Step 5: Wait for Upload**
GitHub will upload all files in the lib folder

### **Step 6: Commit**
- Message: "Add lib folder with all utilities"
- Click "Commit changes"

### **Step 7: Verify in GitHub**
After upload, you should see:
```
lib/
  ├── db.js
  ├── image-validation.js
  ├── order-numbering.js
  └── stripe-utils.js
```

---

## **Then in Vercel:**

1. **Clear cache**
   - Settings → Git → Clear Cache

2. **Redeploy**
   - Deployments → Redeploy

3. **Wait 10-15 minutes**

Build should now succeed! ✓

---

## **If GitHub Won't Let You Upload Folder**

GitHub sometimes doesn't accept folder uploads directly. In that case:

### **Alternative: Upload Individual Files**

1. Click "Add file" → "Create new file"
2. Filename: `lib/db.js`
3. Copy content from your computer's `lib/db.js`
4. Paste it
5. Commit

Repeat for:
- `lib/image-validation.js`
- `lib/order-numbering.js`
- `lib/stripe-utils.js`

---

## **Quick Checklist**

After uploading `lib/` folder, verify in GitHub:
- [ ] Can you see `lib/` folder in repo?
- [ ] Can you see `db.js` inside it?
- [ ] Can you see other files inside?
- [ ] Committed successfully?

If yes to all → Redeploy in Vercel

---

**Try uploading the lib folder now!** 🚀

