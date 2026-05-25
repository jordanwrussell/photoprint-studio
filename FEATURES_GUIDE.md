# PhotoPrint Studio - New Features Implementation Guide

## Overview of New Features

Your app now includes three major enhancements:

### 1. ✏️ Advanced Image Editor
**What it does:**
- Users can zoom in/out on photos (50% to 300%)
- Reposition/pan images by dragging
- Full touch support for mobile (pinch-to-zoom, drag-to-pan)
- Real-time canvas preview
- Edit indicator badges

**Files involved:**
- `components/ImageEditor.js` - Main editor component
- `app/page.js` - Integrated with edit buttons on photo thumbnails

**How to use:**
- Click the ✏️ button on any photo thumbnail to open editor
- Desktop: Use slider or +/- buttons to zoom, drag to move
- Mobile: Pinch with two fingers to zoom, drag with one finger to pan
- Click "Save Changes" to apply edits

---

### 2. 📦 Package Management System
**What it does:**
- Admins create custom package options (Single Print, Duo Pack, etc.)
- Set quantity of photos and pricing for each package
- Customers select packages during checkout
- Prices automatically calculated based on selected package

**Files involved:**
- `components/PackageManager.js` - Admin package editor
- `app/admin/page.js` - Package management tab
- `app/api/packages/` - Package API endpoints
- Database tables updated to include packages

**How to use (Admin):**
1. Go to /admin and login
2. Click "Packages" tab
3. Create new packages with:
   - Package Name (e.g., "Single Print")
   - Quantity (photos included)
   - Base Price
   - Description (optional)
4. Edit or delete existing packages

**How to use (Customer):**
1. Upload photos and apply edits
2. See package options with pricing
3. Select desired package
4. Price updates automatically
5. Proceed to checkout

---

### 3. 💳 Dual Payment Processors (Stripe + Shopify)
**What it does:**
- Users can choose between Stripe or Shopify Payments
- Stripe: Traditional credit card checkout
- Shopify: Apple Pay, Google Pay, Shop Pay, credit cards
- Both processors fully integrated with order status tracking
- Webhook support for automatic status updates

**Files involved:**
- `app/page.js` - Payment method selector
- `app/checkout/[orderId]/page.js` - Stripe payment flow
- `app/checkout-shopify/[orderId]/page.js` - Shopify payment flow
- `app/api/payment-intent/route.js` - Stripe integration
- `app/api/shopify/` - Shopify API endpoints
- `lib/stripe-utils.js` - Stripe utilities

**How to set up:**

**Stripe (Already configured):**
1. Get keys from https://dashboard.stripe.com
2. Add to .env.local
3. Works out of the box

**Shopify (New setup required):**
1. Create Shopify store at https://www.shopify.com
2. In Shopify Admin:
   - Settings → Apps and integrations → Develop apps
   - Create new app
   - Get Storefront API access token
3. Create a product called "Custom Photo Print"
4. Get the Product Variant ID
5. Add to .env.local:
   ```
   SHOPIFY_STORE_URL=https://your-store.myshopify.com
   SHOPIFY_STOREFRONT_TOKEN=shpat_xxx...
   SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/xxx
   ```
6. Set up webhooks in Shopify Admin:
   - Add webhook for orders/fulfilled
   - Add webhook for orders/payment_confirmed
   - URL: `https://yourdomain.com/api/shopify/webhooks`

**How to use (Customer):**
1. At checkout, see two payment options
2. Select preferred method
3. Click "Continue to [Stripe/Shopify] Checkout"
4. Complete payment on respective platform
5. Order status updates automatically

---

## File Structure Changes

### New Components
```
components/
├── ImageEditor.js          [NEW] Advanced photo editing
└── PackageManager.js       [NEW] Admin package management
```

### New API Routes
```
app/api/
├── packages/               [NEW] Package CRUD endpoints
│   ├── route.js           GET all, POST create
│   └── [id]/route.js      PATCH update, DELETE
├── shopify/               [NEW] Shopify integration
│   ├── checkout/route.js  Create Shopify checkout
│   └── webhooks/route.js  Handle Shopify webhooks
└── payment-intent/route.js [UPDATED] Now tracks payment method
```

### New Pages
```
app/
├── checkout-shopify/      [NEW] Shopify payment page
│   └── [orderId]/page.js
└── page.js               [UPDATED] Enhanced with packages & editor
```

### Updated Components
```
app/
├── admin/page.js         [UPDATED] Added packages tab
└── api/
    ├── orders/
    │   ├── route.js      [UPDATED] Include package_id and payment_method
    │   └── [orderId]/route.js [UPDATED] Handle payment methods
    └── payment-intent/route.js [UPDATED] Store payment method
```

---

## Database Schema Updates

### New `packages` Table
```sql
CREATE TABLE packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  base_price REAL NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Updated `orders` Table
```sql
-- New columns added:
package_id TEXT FOREIGN KEY → packages(id)
payment_method TEXT DEFAULT 'stripe'
amount REAL DEFAULT 29.99
```

---

## Configuration Requirements

### Environment Variables (.env.local)

**Existing (Stripe):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

**New (Shopify):**
```env
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
SHOPIFY_PRODUCT_VARIANT_ID=gid://shopify/ProductVariant/xxx
SHOPIFY_WEBHOOK_SECRET=whsec_xxx
```

**Keep existing:**
```env
ADMIN_PASSWORD=your_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_PATH=./data/app.db
```

---

## Testing Checklist

### Image Editor
- [ ] Click edit button on photo
- [ ] Zoom in/out with slider
- [ ] Zoom in/out with +/- buttons
- [ ] Drag photo to reposition
- [ ] Desktop zoom/pan works
- [ ] Mobile pinch-to-zoom works
- [ ] Mobile drag-to-pan works
- [ ] Reset button returns to original
- [ ] Save changes persists edits
- [ ] Cancel discards changes

### Packages
- [ ] Admin can create package
- [ ] Admin can edit package
- [ ] Admin can delete package
- [ ] Packages display on customer page
- [ ] Customer can select different packages
- [ ] Price updates when package changes
- [ ] Package info saved to order

### Stripe Payments
- [ ] Payment method selector shows
- [ ] Stripe option works as before
- [ ] Test with card: 4242 4242 4242 4242
- [ ] Order confirms after payment
- [ ] Order status updates to "paid"

### Shopify Payments
- [ ] Shopify option appears as alternative
- [ ] Clicking Shopify redirects to Shopify checkout
- [ ] Test payment completes
- [ ] Webhook updates order status
- [ ] Order appears in admin dashboard

### Admin Dashboard
- [ ] Can login with admin password
- [ ] Orders tab shows all orders
- [ ] Packages tab visible and functional
- [ ] Can create/edit/delete packages
- [ ] Payment method displayed in order details
- [ ] Package name shown with order

---

## Deployment Notes

### Before Going Live

1. **Replace Test Keys with Live Keys**
   - Stripe: pk_live_* and sk_live_*
   - Shopify: Use production store and tokens

2. **Update URLs**
   - Set NEXT_PUBLIC_APP_URL to your production domain
   - Update webhook URLs in Shopify Admin

3. **Secure Passwords**
   - Change ADMIN_PASSWORD to a strong password
   - Don't commit .env.local with real keys to git

4. **Database**
   - Back up your SQLite database
   - Consider migrating to PostgreSQL for production

5. **Webhooks**
   - Test webhook delivery in Shopify Admin
   - Verify order status updates work

---

## Customization Examples

### Modify Image Editor Zoom Limits
File: `components/ImageEditor.js`
```javascript
// Change these lines:
<input type="range" min="0.5" max="3" step="0.1" /> // min and max values
```

### Change Package Grid Layout
File: `app/page.js`
```javascript
{/* Package Selection */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Change md:grid-cols-2 to md:grid-cols-3 for 3 columns */}
</div>
```

### Add Package Badges
File: `components/PackageManager.js`
```javascript
// Add before package price:
{pkg.quantity > 3 && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">BULK</span>}
```

### Customize Payment Method Names
File: `app/page.js`
```javascript
<div>
  <p className="font-semibold text-primary">Stripe Pay</p>
  <p className="text-xs text-gray-600">Credit card, secure checkout</p>
</div>
```

---

## Troubleshooting

### Image Editor Not Opening
- Verify ImageEditor component is imported
- Check browser console for errors
- Ensure canvas is supported (all modern browsers)

### Packages Not Showing
- Run `npm run db:setup` to create packages table
- Check Admin → Packages tab to add packages
- Refresh page after creating packages

### Shopify Not Working
- Verify SHOPIFY_STOREFRONT_TOKEN is valid
- Check product variant ID format (should be: gid://shopify/ProductVariant/xxx)
- Test webhook delivery in Shopify Admin
- Check browser console for redirect errors

### Payment Method Not Saving
- Verify payment_method is in order creation
- Check database order table for payment_method column
- Verify env variables are set correctly

---

## Next Steps

1. **Test both payment processors** thoroughly
2. **Create sample packages** in admin
3. **Try uploading and editing photos**
4. **Process test payments** with both methods
5. **Verify webhook integration** works
6. **Deploy to production** with live keys

---

## Support Resources

- **Image Editor**: HTML5 Canvas API docs
- **Packages**: Standard REST API patterns
- **Stripe**: https://stripe.com/docs/payments
- **Shopify**: https://shopify.dev/docs/storefronts

Good luck with your photo print business! 🎉