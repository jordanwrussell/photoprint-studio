# PhotoPrint Studio - Quick Reference

## What's New

### ✏️ Image Editor (components/ImageEditor.js)
**Desktop Controls:**
- Zoom slider (50% - 300%)
- +/- buttons for zoom
- Click and drag to pan
- Reset button to start over

**Mobile Controls:**
- Pinch with 2 fingers to zoom
- Drag with 1 finger to pan
- Touch-friendly UI

**Integration:**
- Click ✏️ button on photo to open
- Edit badge shows on edited photos
- All edits are applied before checkout

---

### 📦 Package System (components/PackageManager.js)
**Admin Features:**
- Create new packages with quantity and price
- Edit existing packages
- Delete packages
- See all packages in dashboard

**Customer Features:**
- Browse available packages
- See pricing and quantity details
- Select package during checkout
- Price updates automatically

**Database:**
- New `packages` table stores: name, quantity, base_price, description
- `orders` table now includes package_id
- Orders track which package was selected

---

### 💳 Payment Methods (Stripe + Shopify)

#### Stripe Payment Flow
1. Customer selects Stripe
2. Redirected to `/checkout/[orderId]`
3. Enter card details
4. Payment processed via Stripe
5. Order status: pending → paid
6. Confirmation page shown

#### Shopify Payment Flow
1. Customer selects Shopify
2. Redirected to `/checkout-shopify/[orderId]`
3. Redirected to Shopify checkout
4. Customer selects payment method (Apple Pay, Google Pay, Shop Pay, etc.)
5. Payment processed via Shopify
6. Webhook updates order status
7. Confirmation page shown

#### Webhook Integration
- Shopify sends payment confirmations
- Automatically updates order status
- Admin dashboard reflects changes in real-time

---

## File Navigation

### Customer Journey
```
Home (app/page.js)
  ↓ Upload photos & select package
  ↓ Choose payment method
  ↓ Click "Continue to Checkout"
  ├─ Stripe Route → /checkout/[orderId]
  ├─ Shopify Route → /checkout-shopify/[orderId]
  ↓ Complete payment
  ↓ /order-confirmation/[orderId]
```

### Admin Journey
```
Login (app/admin/page.js)
  ↓ Choose tab
  ├─ Orders Tab: View/manage orders
  ├─ Packages Tab: Create/edit/delete packages
  ↓ Update order status
  ↓ Monitor payments
```

### Image Editor Flow
```
Photo Thumbnail
  ↓ Click ✏️ button
  ↓ ImageEditor modal opens
  ↓ Zoom/pan/edit
  ↓ Save or Cancel
  ↓ Back to upload form
```

---

## API Endpoints Reference

### Orders
```
GET    /api/orders              # Get all orders
POST   /api/orders              # Create order (form data)
GET    /api/orders/[orderId]    # Get specific order
PATCH  /api/orders/[orderId]    # Update order status
```

### Packages
```
GET    /api/packages            # Get all packages
POST   /api/packages            # Create package
GET    /api/packages/[id]       # Get specific package
PATCH  /api/packages/[id]       # Update package
DELETE /api/packages/[id]       # Delete package
```

### Payments
```
POST   /api/payment-intent      # Create Stripe intent
POST   /api/shopify/checkout    # Create Shopify checkout
POST   /api/shopify/webhooks    # Handle Shopify webhooks
```

### Admin
```
POST   /api/admin/auth          # Admin login
```

---

## Component Props

### ImageEditor
```javascript
<ImageEditor
  photo={{
    id: "uuid",
    preview: "data:image/jpeg;base64,...",
    file: File object
  }}
  onSave={(editedPhoto) => {
    // Update photo with edits applied
  }}
  onCancel={() => {
    // Close editor without saving
  }}
/>
```

### PackageManager
```javascript
<PackageManager />
// Standalone component
// Loads/manages packages via API
// No props required
```

---

## Database Queries Reference

### Get all packages with pricing
```sql
SELECT * FROM packages ORDER BY base_price ASC;
```

### Get orders with package details
```sql
SELECT o.*, p.name, p.quantity, p.base_price
FROM orders o
JOIN packages p ON o.package_id = p.id
ORDER BY o.created_at DESC;
```

### Find orders by payment method
```sql
SELECT * FROM orders 
WHERE payment_method = 'shopify' OR payment_method = 'stripe'
ORDER BY created_at DESC;
```

### Get package statistics
```sql
SELECT 
  p.name,
  COUNT(o.id) as orders_count,
  SUM(o.amount) as total_revenue
FROM packages p
LEFT JOIN orders o ON p.id = o.package_id
GROUP BY p.id;
```

---

## Environment Setup Checklist

### Before npm run dev:
- [ ] Copied all files to project directory
- [ ] Ran `npm install`
- [ ] Ran `npm run db:setup`
- [ ] Created .env.local with values:

**Minimum (Stripe only):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
ADMIN_PASSWORD=your_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**With Shopify:**
```env
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=shpat_...
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/...
SHOPIFY_WEBHOOK_SECRET=whsec_...
```

---

## Common Tasks

### Create First Package
1. Go to `/admin`
2. Login with password from .env.local
3. Click "Packages" tab
4. Click "Create Package"
5. Fill in: Name, Quantity, Price
6. Click "Create Package"
7. Refresh customer page to see it

### Test Image Editor
1. Go to `/`
2. Upload any photo
3. Click ✏️ on thumbnail
4. Try zoom slider and drag
5. Click "Save Changes"
6. See "Edited" badge on photo

### Test Stripe Checkout
1. Select Stripe payment
2. Proceed to checkout
3. Use test card: 4242 4242 4242 4242
4. Any future date, any CVC
5. Verify order shows in admin

### Test Shopify Checkout
1. Select Shopify payment
2. Proceed to checkout
3. Get redirected to Shopify
4. Use Shopify test payment method
5. Verify webhook updates order

### View Orders in Admin
1. Go to `/admin`
2. Login
3. Stay on "Orders" tab
4. See all orders with status
5. Click order to expand details
6. See uploaded photos
7. Update status with buttons

---

## Styling Customization

### Change Accent Color
File: `tailwind.config.js`
```javascript
colors: {
  accent: '#ff6b35',  // Change this hex value
}
```

### Change Package Grid
File: `app/page.js`
```javascript
// Single column (mobile-first):
<div className="grid grid-cols-1 gap-4">

// Two columns:
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Three columns:
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

### Modify Editor Canvas Size
File: `components/ImageEditor.js`
```javascript
style={{ height: '400px' }}  // Change this value
```

---

## Troubleshooting Commands

```bash
# Reset database
npm run db:setup

# Check for errors in build
npm run build

# View database contents (requires sqlite3 CLI)
sqlite3 data/app.db

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## Important Notes

⚠️ **Before Production:**
- Change ADMIN_PASSWORD to strong password
- Use Stripe pk_live_ and sk_live_ keys
- Enable HTTPS/SSL
- Set NEXT_PUBLIC_APP_URL to production domain
- Configure Shopify webhooks to production URL
- Back up database

🔒 **Security:**
- Never commit .env.local with real keys
- Admin password should be unique and strong
- Use HTTPS in production
- Validate all file uploads
- Sanitize user inputs

📊 **Performance:**
- Image editor uses Canvas API (hardware accelerated)
- Package queries cached in component state
- Database queries optimized with indexes
- Touch events throttled for smooth mobile UX

---

## Success Criteria

When everything is working:
✅ Photos upload successfully
✅ Image editor opens and responds to zoom/pan
✅ Packages display with correct pricing
✅ Both payment methods appear as options
✅ Stripe payment completes
✅ Shopify payment redirects and completes
✅ Admin can see all orders
✅ Admin can manage packages
✅ Order status updates after payment
✅ All features work on mobile and desktop

Enjoy your photo printing app! 🎨📸