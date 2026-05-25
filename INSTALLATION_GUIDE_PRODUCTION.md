# PhotoPrint Studio - Production Hosting Installation Guide

## Hosting Options (Recommended Order)

### 1. **Vercel** (Easiest - Recommended for beginners)
- Built for Next.js apps
- Free tier available
- Automatic SSL/HTTPS
- 1-click deployment
- PostgreSQL add-on available

### 2. **Railway** (Great balance)
- Simple deploy process
- Affordable ($5-50/month)
- Good documentation
- PostgreSQL included
- Good for small-medium business

### 3. **Render** (Alternative)
- Similar to Railway
- Good UI
- PostgreSQL available
- Free tier limited

### 4. **Self-hosted** (Advanced)
- Full control
- More expensive
- Requires DevOps knowledge
- DigitalOcean, Linode, AWS, etc.

---

## Option 1: Deploy to Vercel (Easiest)

### Prerequisites
- GitHub account (free at https://github.com)
- Project files on GitHub
- Vercel account (free at https://vercel.com)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/photoprint-studio.git
git push -u origin main
```

### Step 2: Create Vercel Account
1. Visit https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize GitHub

### Step 3: Import Project
1. Go to https://vercel.com/new
2. Find your repository
3. Click "Import"
4. Click "Deploy"

### Step 4: Add Environment Variables
In Vercel Dashboard:
1. Go to project settings
2. Click "Environment Variables"
3. Add each variable from `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_token
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/...
SHOPIFY_WEBHOOK_SECRET=your_secret
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_PATH=./data/app.db
```

### Step 5: Database Migration
Vercel + SQLite is limited. Upgrade to PostgreSQL:

**Option A: Vercel Postgres (Easiest)**
1. In Vercel Dashboard → Storage tab
2. Click "Create Database"
3. Choose "Postgres"
4. Update connection string in env vars

**Option B: External PostgreSQL**
1. Get PostgreSQL connection string from:
   - Railway
   - Neon (free tier)
   - ElephantSQL
2. Add as environment variable

### Step 6: Update Connection
Edit `lib/db.js` to support PostgreSQL:

```javascript
// Use environment variable for connection
const connectionString = process.env.DATABASE_URL;
// Configure for PostgreSQL instead of SQLite
```

### Deployment Complete! 🎉
Your app is live at: `yourdomain.vercel.app`

Custom domain:
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (Vercel shows instructions)

---

## Option 2: Deploy to Railway

### Prerequisites
- GitHub account
- GitHub repo with code
- Railway account (free at https://railway.app)

### Step 1: Connect GitHub
1. Visit https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select your photoprint-studio repo
4. Click "Deploy"

### Step 3: Add PostgreSQL
1. In Railway Dashboard → Add Service
2. Choose "PostgreSQL"
3. Railway automatically adds connection string

### Step 4: Environment Variables
1. Click on app service
2. Click "Variables"
3. Add from `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
SHOPIFY_STORE_URL=...
SHOPIFY_STOREFRONT_TOKEN=...
SHOPIFY_PRODUCT_VARIANT_ID=...
SHOPIFY_WEBHOOK_SECRET=...
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_APP_URL=https://yourdomain.up.railway.app
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### Step 5: Custom Domain
1. Railway Dashboard → Settings
2. Add custom domain
3. Update DNS records

### Costs
- **Free tier:** Limited resources
- **Paid:** $5-50/month depending on usage

---

## Option 3: Self-Hosted on DigitalOcean

### Prerequisites
- DigitalOcean account (https://digitalocean.com)
- SSH client (PuTTY on Windows)
- Domain name
- Credit card

### Step 1: Create Droplet
1. DigitalOcean Dashboard → Create Droplet
2. Choose Ubuntu 22.04 LTS
3. Choose size: $5/month minimum
4. Select region (closest to users)
5. Create SSH key
6. Click "Create Droplet"

### Step 2: Connect to Server
```bash
ssh root@your_droplet_ip
```

### Step 3: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Install Git
apt install -y git
```

### Step 4: Clone Repository
```bash
cd /var/www
git clone https://github.com/yourusername/photoprint-studio.git
cd photoprint-studio
npm install
npm run build
```

### Step 5: Create PostgreSQL Database
```bash
sudo -u postgres psql

CREATE DATABASE photoprint;
CREATE USER photoprint_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE photoprint TO photoprint_user;
\q
```

### Step 6: Create `.env` File
```bash
nano .env
```

Add:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://photoprint_user:secure_password@localhost:5432/photoprint
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Step 7: Start Application with PM2
```bash
pm2 start npm --name "photoprint" -- start
pm2 startup
pm2 save
```

### Step 8: Configure Nginx
```bash
nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 9: Enable HTTPS with Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### Step 10: Restart Services
```bash
systemctl restart nginx
```

### Costs
- **Droplet:** $5-12/month
- **Domain:** $10-15/year
- **Backups:** Optional $1-2/month

---

## PostgreSQL Migration Guide

### Why Migrate from SQLite?
| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Concurrent users | <5 | 100+ |
| Reliability | Good | Excellent |
| Backups | Manual | Automated |
| Scaling | Limited | Full |
| Free tier | Yes | Some hosts |

### Migration Steps

**1. Dump SQLite Data**
```bash
sqlite3 data/app.db .dump > backup.sql
```

**2. Update Connection String**
Use `DATABASE_URL` environment variable instead of `DATABASE_PATH`

**3. Update `lib/db.js`**
Switch from SQLite3 to PostgreSQL client:

```javascript
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function runAsync(sql, params = []) {
  const result = await pool.query(sql, params);
  return { id: result.rows[0]?.id, changes: result.rowCount };
}

export async function getAsync(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0];
}

export async function allAsync(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}
```

**4. Install PostgreSQL Driver**
```bash
npm install pg
```

**5. Run Database Setup**
On your hosted database, run the schema from `scripts/db-setup.js`

---

## Environment Variables (Production)

### Required for All Hosts
```env
# Stripe (Live Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Shopify (If enabled)
SHOPIFY_STORE_URL=https://yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=...
SHOPIFY_PRODUCT_VARIANT_ID=...
SHOPIFY_WEBHOOK_SECRET=...

# Admin & Security
ADMIN_PASSWORD=YOUR_VERY_SECURE_PASSWORD
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Security Best Practices
✅ Use production Stripe keys (pk_live_, sk_live_)
✅ Use strong admin password (20+ characters)
✅ Enable HTTPS/SSL
✅ Set NODE_ENV=production
✅ Use environment variables (never hardcode)
✅ Enable database backups
✅ Set up monitoring/alerts
✅ Use secure secrets manager

---

## Post-Deployment Checklist

### Immediate
- [ ] Test app loads at yourdomain.com
- [ ] Test customer upload
- [ ] Test admin login
- [ ] Test Stripe payment (use test card)
- [ ] Test database operations
- [ ] Verify logs show no errors

### Security
- [ ] HTTPS certificate installed
- [ ] Admin password is strong
- [ ] Firewall configured
- [ ] Database backups enabled
- [ ] No test keys in production
- [ ] Environment variables secured

### Functionality
- [ ] Image upload works
- [ ] Quality scoring shows
- [ ] Email notifications send
- [ ] Stripe/Shopify payments work
- [ ] Local pickup forms save
- [ ] Admin dashboard functions

### Monitoring
- [ ] Set up error logging
- [ ] Set up uptime monitoring
- [ ] Configure backups
- [ ] Plan maintenance windows
- [ ] Document access procedures

---

## Backup Strategy

### Database Backups
**Daily automated backups:**

Railway/Vercel → Built-in backups included

DigitalOcean:
```bash
# Weekly backup script
0 2 * * 0 pg_dump postgresql://user:pass@localhost/db > /backups/db-$(date +\%Y\%m\%d).sql
```

### File Backups
Store uploaded photos:
- Railway/Vercel → Ephemeral storage (upload to S3)
- DigitalOcean → Add second volume

### Restore Plan
Keep documented process for restoring from backups

---

## Monitoring & Maintenance

### Essential Monitoring
- **Uptime:** UptimeRobot (free)
- **Errors:** Sentry (free tier)
- **Performance:** Built-in dashboard

### Regular Tasks
- **Daily:** Check for errors in logs
- **Weekly:** Review orders and reports
- **Monthly:** Backup verification, security review
- **Quarterly:** Update dependencies, security audit

### Update Process
```bash
# Test locally first
npm update
npm run build
npm test

# Deploy
git push
# Auto-deploys via Vercel/Railway
```

---

## Scaling for Growth

### Phase 1: <100 orders/day
- Single Vercel deployment
- PostgreSQL free tier
- SQLite acceptable if backed up

### Phase 2: 100-1000 orders/day
- Upgrade to paid Vercel/Railway
- PostgreSQL paid tier
- Add caching (Redis)
- CDN for images

### Phase 3: 1000+ orders/day
- Load balancing
- Database read replicas
- S3/CloudFront for storage
- Dedicated server infrastructure

---

## Domain Setup

### DNS Configuration
For yourdomain.com:

**With Vercel:**
Add CNAME record:
```
www.yourdomain.com → yourdomain.vercel.app
```

**With Railway:**
```
yourdomain.com → your-railway-app.up.railway.app
```

**With DigitalOcean:**
```
yourdomain.com → your-droplet-ip
```

Allow 24-48 hours for DNS propagation

---

## Cost Comparison

| Platform | Startup | Monthly | Storage | DB |
|----------|---------|---------|---------|-----|
| **Vercel** | Free | $20-100 | Paid | Paid |
| **Railway** | Free | $5-50 | Included | Included |
| **Render** | Free | $10-50 | Paid | Paid |
| **DigitalOcean** | $5 | $5-40 | Included | Included |
| **AWS** | Free | $10-100+ | Paid | Varies |

---

## Getting Help

### Vercel Support
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/next.js

### Railway Support
- Docs: https://docs.railway.app
- Status: https://status.railway.app

### DigitalOcean Support
- Docs: https://docs.digitalocean.com
- Community: https://community.digitalocean.com

### Emergency Rollback
If issues occur:
1. Revert to previous deploy
2. Check error logs
3. Test locally
4. Redeploy

---

## Summary

**Quick Start (Easiest):** Deploy to Vercel
1. Push to GitHub
2. Connect Vercel
3. Add environment variables
4. Done!

**More Control:** Use Railway
1. Similar process to Vercel
2. Includes PostgreSQL
3. Better docs

**Full Control:** Self-host on DigitalOcean
1. More work setup
2. Full customization
3. Potential cost savings

---

**Production deployment complete!** Your PhotoPrint Studio is live and ready for customers. 🚀

Monitor, backup, and scale as your business grows! 📈
