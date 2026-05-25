# PhotoPrint Studio - Next.js Setup Guide

## Project Overview

This is a complete Next.js application for a photo printing service with:
- 📸 Advanced photo editor with zoom and pan (touch-enabled)
- 📦 Admin-controlled package/pricing management
- 💳 Dual payment processors: Stripe OR Shopify
- 👥 Customer photo upload with editing capabilities
- 📊 Admin dashboard for order management
- 🗄️ SQLite database (easily upgradeable to PostgreSQL)
- 🎨 Modern, responsive UI design

## New Features in This Version

### 1. Advanced Image Editor
- **Zoom Control**: Slider + buttons for precise zoom (50% - 300%)
- **Pan/Reposition**: Drag images to position them perfectly
- **Touch Support**: Two-finger pinch to zoom, one-finger drag to pan on mobile
- **Canvas Editing**: Real-time preview of edits before saving
- **Edit Indicator**: Shows which photos have been edited

### 2. Package Management
- **Admin-Controlled Pricing**: Create custom packages with quantity and pricing
- **Admin Panel Tab**: Dedicated packages section in admin dashboard
- **Dynamic Selection**: Users see all available packages during checkout
- **Flexible Quantities**: Support single prints to bulk orders

### 3. Payment Processor Options
- **Stripe Integration**: Secure credit card payments (existing)
- **Shopify Payments**: Apple Pay, Google Pay, credit cards via Shopify
- **User Selection**: Customers choose their preferred payment method
- **Webhooks**: Automatic order status updates on payment confirmation

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Database

\`\`\`bash
npm run db:setup
\`\`\`

This creates the SQLite database with all required tables including packages.

### 3. Configure Environment Variables

Edit \`.env.local\` with your actual values:

\`\`\`env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# Shopify Configuration (Optional)
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/12345
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Admin Settings
ADMIN_PASSWORD=your_secure_password_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_PATH=./data/app.db
\`\`\`

### 4. Install Stripe & Shopify Packages

\`\`\`bash
npm install @stripe/react-js @stripe/js
npm install shopify-app-js  # Optional, for advanced Shopify features
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit:
- **Customer Upload**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Setting Up Payments

### Stripe Setup
1. Get keys from https://dashboard.stripe.com
2. Add to \`.env.local\`
3. No additional setup needed - integration is ready

### Shopify Setup

1. **Create a Shopify Store** (if not already done)
   - Go to https://www.shopify.com

2. **Get Storefront Access Token**
   - In Shopify Admin, go to Settings → Apps and integrations
   - Create a custom app
   - Get the Storefront API access token

3. **Create a Product in Shopify**
   - Title: "Custom Photo Print"
   - Get the Product Variant ID (format: gid://shopify/ProductVariant/XXXXX)

4. **Set Up Webhooks** (for order status updates)
   - Shopify Admin → Settings → Apps and integrations → Webhooks
   - Add webhook for \`orders/fulfilled\` event
   - URL: \`https://your-domain.com/api/shopify/webhooks\`
   - Add webhook for \`orders/payment_confirmed\` event

5. **Add to \`.env.local\`**
\`\`\`env
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/12345
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
\`\`\`

## Project Structure

\`\`\`
photo-print-app/
├── app/
│   ├── page.js                           # Customer upload with packages
│   ├── checkout/[orderId]/page.js        # Stripe payment page
│   ├── checkout-shopify/[orderId]/page.js # Shopify payment page
│   ├── order-confirmation/               # Confirmation page
│   ├── admin/page.js                     # Admin dashboard (orders + packages)
│   └── api/
│       ├── orders/                       # Order CRUD operations
│       ├── packages/                     # Package management
│       ├── payment-intent/               # Stripe payment handling
│       ├── shopify/
│       │   ├── checkout/                 # Shopify checkout creation
│       │   └── webhooks/                 # Shopify webhook handler
│       └── admin/auth/                   # Admin authentication
├── components/
│   ├── ImageEditor.js                    # Advanced photo editor
│   └── PackageManager.js                 # Package management component
├── lib/
│   ├── db.js                             # Database utilities
│   └── stripe-utils.js                   # Stripe helpers
├── styles/
│   └── globals.css                       # Tailwind + custom styles
├── scripts/
│   └── db-setup.js                       # Database initialization
├── public/
│   └── uploads/                          # Customer photo storage
├── .env.local                            # Environment variables
├── package.json
└── SETUP_GUIDE.md
\`\`\`

## Using the Image Editor

### Desktop Users
- **Zoom**: Use slider or +/- buttons
- **Pan**: Click and drag to move image
- **Reset**: Click Reset button to return to original position

### Mobile Users
- **Zoom**: Pinch with two fingers
- **Pan**: Drag with one finger to reposition
- **Touch-friendly**: Large touch targets, responsive layout

## Creating Packages

### In Admin Dashboard
1. Navigate to Admin → Packages tab
2. Click "Create Package"
3. Fill in:
   - **Package Name** (e.g., "Single Print", "Family Pack")
   - **Quantity** (number of photos included)
   - **Base Price** (e.g., \$29.99)
   - **Description** (optional, shown to customers)
4. Click "Create Package"

### For Customers
- Packages appear on the home page during checkout
- Can select different packages
- Price updates automatically
- Photos must not exceed package quantity (optional validation)

## Database Schema

### Users Table
\`\`\`sql
id (TEXT PRIMARY KEY)
email (TEXT UNIQUE)
created_at (DATETIME)
\`\`\`

### Packages Table
\`\`\`sql
id (TEXT PRIMARY KEY)
name (TEXT)
quantity (INTEGER)
base_price (REAL)
description (TEXT)
created_at (DATETIME)
\`\`\`

### Orders Table
\`\`\`sql
id (TEXT PRIMARY KEY)
user_id (FOREIGN KEY → users)
package_id (FOREIGN KEY → packages)
stripe_payment_id (TEXT) - Stripe payment ID
payment_method (TEXT) - 'stripe' or 'shopify'
status (TEXT) - pending, paid, processing, shipped, delivered
template_data (TEXT) - JSON with template info
photo_urls (TEXT) - JSON array of photo paths
amount (REAL) - Order total
created_at (DATETIME)
updated_at (DATETIME)
\`\`\`

## Customization Guide

### Adding More Payment Processors

1. Create new checkout page: \`/app/checkout-{processor}/[orderId]/page.js\`
2. Create API route: \`/app/api/{processor}/checkout/route.js\`
3. Add option in \`/app/page.js\` payment method selection
4. Update order submission logic to handle new processor

### Customizing Image Editor

Edit \`/components/ImageEditor.js\`:
- Adjust zoom min/max: \`min="0.5" max="3"\`
- Change canvas height: \`height: '400px'\`
- Add filters (brightness, contrast, etc.)
- Add rotation controls

### Modifying Package Display

Edit package card styling in \`/app/page.js\`:
- Change grid columns: \`grid-cols-1 md:grid-cols-2\`
- Adjust pricing display
- Add package badges/tags

## Advanced Features to Implement

### Photo Processing
Implement actual photo-to-template integration:
\`\`\`bash
npm install sharp  # For image manipulation
\`\`\`

### Email Notifications
Send order confirmations and updates:
\`\`\`bash
npm install nodemailer
\`\`\`

### Print API Integration
Connect to actual printing services:
- PrintNinja API
- Lulu API
- Printful API

### Analytics
Track orders, revenue, and customer data:
- Google Analytics integration
- Custom dashboard metrics

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Self-Hosted (Railway, Render, etc.)
1. Push to GitHub
2. Connect repository
3. Set environment variables in platform dashboard
4. Deploy

### Production Checklist
- [ ] Change \`ADMIN_PASSWORD\` to secure value
- [ ] Use Stripe production keys (pk_live_*, sk_live_*)
- [ ] Use Shopify production keys
- [ ] Set \`NEXT_PUBLIC_APP_URL\` to your domain
- [ ] Enable SSL/HTTPS
- [ ] Configure database backups
- [ ] Test payment processing with both processors
- [ ] Set up webhook handlers for both Stripe and Shopify

## Troubleshooting

### Image Editor Not Loading
- Check that canvas is supported in browser (all modern browsers)
- Clear cache and reload
- Check browser console for errors

### Package Not Showing in Checkout
- Verify package created in Admin → Packages tab
- Refresh page to load latest packages
- Check database for package records

### Payment Processing Issues

**Stripe:**
- Verify keys are correct (pk_test_ vs pk_live_)
- Check that @stripe/react-js is installed
- Test with Stripe test card: 4242 4242 4242 4242

**Shopify:**
- Verify storefront token is valid
- Check product variant ID format
- Ensure webhooks are configured correctly
- Check webhook delivery in Shopify admin

### Database Errors
- Run \`npm run db:setup\` again to recreate tables
- Check that \`data/\` directory has write permissions
- Verify \`DATABASE_PATH\` in .env.local

## Support

For questions about:
- **Next.js**: https://nextjs.org/docs
- **Stripe**: https://stripe.com/docs
- **Shopify**: https://shopify.dev/docs
- **Tailwind**: https://tailwindcss.com/docs
- **SQLite**: https://www.sqlite.org/docs.html

## License

MIT - Feel free to modify for your business needs!
