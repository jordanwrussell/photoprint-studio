# How to Delete All Files in GitHub

## Important
This deletes all files BUT keeps the repository. You'll have an empty repo.

---

## **Option A: Delete Files One by One** (Slower but Safe)

1. **Go to:** https://github.com/jordanwrussell/photoprint-studio

2. **For each file/folder:**
   - Click the file/folder name
   - Click the trash/delete icon (top right)
   - Confirm deletion
   - Repeat for all files

This takes longer but you see what's being deleted.

---

## **Option B: Delete Everything at Once** (Faster)

### **Step 1: Select All Files**
1. Go to your repo: https://github.com/jordanwrussell/photoprint-studio
2. You should see a file list
3. There's usually a checkbox at the top - click it to select all files
4. OR use keyboard shortcut: `Ctrl+A` (Cmd+A on Mac)

### **Step 2: Delete Selected**
1. Look for "Delete" or trash icon option
2. Click it
3. Confirm deletion

---

## **Option C: Via Command Line** (Fastest)

If you have Git installed on your computer:

```bash
# Navigate to your repo folder
cd ~/photomagnet

# Remove all files (but keep .git folder)
rm -rf ./*

# Commit the deletion
git add -A
git commit -m "Delete all files - fresh start"
git push origin main
```

---

## **Option D: Repository Settings** (If Available)

Some GitHub accounts let you delete files from Settings:
1. Go to repo
2. Click "Settings" (top right)
3. Scroll to "Danger Zone"
4. Look for "Delete this repository" option
5. (This DELETES the entire repo, not just files)

---

## **Recommended: Option A or B**

**Option A:** Delete files one by one (safest, you see each one)
**Option B:** Select all and delete at once (faster, requires all-select feature)

Both keep the repository - you just clear out the files.

---

## **After Deleting All Files:**

1. Your GitHub repo is now empty
2. You can upload fresh files with ZIP
3. Or manually add files one by one

---

## **To Verify Deletion:**

Go to your repo: https://github.com/jordanwrussell/photoprint-studio

You should see:
```
This repository is empty
```

Or just the README file (GitHub sometimes auto-creates this).

---

**Which option do you want to use?**

