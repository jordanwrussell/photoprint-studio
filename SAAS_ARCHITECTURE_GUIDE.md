# PhotoPrint Studio - SaaS Multi-Tenant Architecture

## Vision: White-Label Photo Printing Platform

Transform PhotoPrint Studio into a **commercial SaaS platform** where:
- ✅ Multiple businesses ("tenants") use the same app
- ✅ Each has their own branded storefront
- ✅ Custom URLs (like: `myprint.photoprint-studio.com`)
- ✅ Custom branding (logo, colors, text)
- ✅ Independent payment processing
- ✅ Separate order management
- ✅ Admin dashboard per tenant

---

## Multi-Tenant Architecture Overview

### **Current Structure (Single Tenant)**
```
PhotoPrint Studio
└── One business
    └── One admin
    └── One storefront
```

### **New SaaS Structure (Multi-Tenant)**
```
PhotoPrint Studio Platform
├── Business A
│   ├── Admin Portal (jordanwrussell.photoprint-studio.com/admin)
│   ├── Custom Storefront (jordanwrussell.photoprint-studio.com)
│   ├── Branding (logo, colors, text)
│   └── Payment Processor A
├── Business B
│   ├── Admin Portal (customprint.photoprint-studio.com/admin)
│   ├── Custom Storefront (customprint.photoprint-studio.com)
│   ├── Branding (different logo, colors, text)
│   └── Payment Processor B
└── Business C
    ├── Admin Portal (professionalphoto.photoprint-studio.com/admin)
    ├── Custom Storefront (professionalphoto.photoprint-studio.com)
    ├── Branding (unique branding)
    └── Payment Processor C
```

---

## Database Schema Changes

### **New Tables Required**

#### **1. Tenants Table**
```sql
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  tenant_slug TEXT UNIQUE,                    -- "jordanwrussell"
  business_name TEXT,                        -- "Jordan's Photo Prints"
  admin_email TEXT,
  admin_password_hash TEXT,
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT,                        -- "#ff6b35"
  secondary_color TEXT,                      -- "#004e89"
  accent_color TEXT,
  custom_domain TEXT UNIQUE NULLABLE,        -- "myprints.com" (optional)
  
  -- Payment Processor
  payment_provider TEXT,                     -- "stripe", "shopify", "square"
  stripe_account_id TEXT NULLABLE,
  shopify_store_url TEXT NULLABLE,
  
  -- Feature Toggles
  enable_local_pickup BOOLEAN DEFAULT false,
  enable_email_notifications BOOLEAN DEFAULT true,
  enable_sms_notifications BOOLEAN DEFAULT false,
  
  -- Business Info
  business_phone TEXT,
  business_email TEXT,
  pickup_location_address TEXT,
  pickup_location_hours TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **2. Tenant Customization Table**
```sql
CREATE TABLE tenant_customization (
  id TEXT PRIMARY KEY,
  tenant_id TEXT UNIQUE,
  
  -- Text Content
  homepage_title TEXT,                       -- "Premium Photo Prints"
  homepage_subtitle TEXT,
  page_headline TEXT,
  call_to_action_text TEXT,
  
  -- Images
  hero_image_url TEXT,
  background_image_url TEXT,
  
  -- Footer
  footer_text TEXT,
  social_links TEXT,                         -- JSON array
  
  -- Custom Pages (privacy, terms, etc)
  privacy_policy_html TEXT,
  terms_html TEXT,
  about_us_html TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

#### **3. Orders Table (Updated)**
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,                   -- Link to tenant
  user_id TEXT,
  package_id TEXT,
  order_number TEXT,
  
  -- ... existing fields ...
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  UNIQUE(tenant_id, order_number)            -- Order numbers unique per tenant
);
```

#### **4. Packages Table (Updated)**
```sql
CREATE TABLE packages (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,                   -- Each tenant has own packages
  name TEXT,
  quantity INTEGER,
  base_price REAL,
  description TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

---

## URL Structure

### **Multi-Domain (Recommended for Professional)**
```
Customer Storefronts:
- https://jordanwrussell.photoprint-studio.com
- https://customprint.photoprint-studio.com
- https://myprints.photoprint-studio.com

Admin Portals:
- https://jordanwrussell.photoprint-studio.com/admin
- https://customprint.photoprint-studio.com/admin
- https://myprints.photoprint-studio.com/admin
```

### **Or Custom Domains (Premium Tier)**
```
- https://myprints.com (customer)
- https://myprints.com/admin (admin)
```

---

## Implementation Architecture

### **Tenant Detection (Middleware)**

Create `lib/tenant-detection.js`:
```javascript
// Detect tenant from request hostname or URL
export function getTenantSlug(req) {
  const host = req.headers.host; // "jordanwrussell.photoprint-studio.com"
  
  if (host.includes('photoprint-studio.com')) {
    return host.split('.')[0]; // "jordanwrussell"
  }
  
  // Check if custom domain
  const customDomain = await getCustomDomainTenant(host);
  return customDomain?.tenant_slug;
}

// Load tenant data
export async function loadTenant(tenantSlug) {
  const tenant = await getAsync(
    'SELECT * FROM tenants WHERE tenant_slug = ?',
    [tenantSlug]
  );
  
  if (!tenant) {
    throw new Error('Tenant not found');
  }
  
  const customization = await getAsync(
    'SELECT * FROM tenant_customization WHERE tenant_id = ?',
    [tenant.id]
  );
  
  return { ...tenant, customization };
}
```

### **Customer-Facing Pages (Tenant-Specific)**

Update `app/[tenant]/page.js`:
```javascript
export default async function HomePage({ params }) {
  const tenant = await loadTenant(params.tenant);
  
  return (
    <div style={{ 
      backgroundColor: tenant.secondary_color,
      color: tenant.primary_color 
    }}>
      {/* Logo */}
      <img src={tenant.logo_url} alt={tenant.business_name} />
      
      {/* Custom Title */}
      <h1>{tenant.customization?.homepage_title}</h1>
      <p>{tenant.customization?.homepage_subtitle}</p>
      
      {/* Upload Form */}
      <PhotoUpload tenantId={tenant.id} />
      
      {/* Custom Footer */}
      <footer>{tenant.customization?.footer_text}</footer>
    </div>
  );
}
```

### **Admin Portal (Tenant-Specific)**

Update `app/[tenant]/admin/page.js`:
```javascript
export default async function AdminDashboard({ params }) {
  const tenant = await loadTenant(params.tenant);
  
  return (
    <div>
      {/* Admin Authentication */}
      <TenantAdminLogin tenantId={tenant.id} />
      
      {/* Admin Dashboard */}
      <TenantAdminDashboard tenant={tenant} />
    </div>
  );
}
```

---

## Admin Panel Features

### **Branding Section**
- [ ] Upload logo (image upload)
- [ ] Primary color picker
- [ ] Secondary color picker
- [ ] Accent color picker
- [ ] Hero image upload
- [ ] Background image upload

### **Content Section**
- [ ] Homepage title (text input)
- [ ] Homepage subtitle (text input)
- [ ] Page headline (text input)
- [ ] Call-to-action text (text input)
- [ ] Footer text (text editor)
- [ ] Privacy policy (HTML editor)
- [ ] Terms & conditions (HTML editor)
- [ ] About us page (HTML editor)

### **Payment Section**
- [ ] Select payment provider (Stripe/Shopify/Square)
- [ ] Connect payment account
  - Stripe: OAuth connection to Stripe
  - Shopify: Storefront API token
  - Square: OAuth connection to Square
- [ ] Test payment processing
- [ ] Payment settings

### **Business Information**
- [ ] Business name
- [ ] Business email
- [ ] Business phone
- [ ] Pickup location address
- [ ] Pickup location hours
- [ ] Enable/disable features (local pickup, email, SMS)

### **Orders Management**
- [ ] View all orders (tenant-specific)
- [ ] Order status tracking
- [ ] Customer information
- [ ] Order numbering (per tenant)
- [ ] Audit reports (per tenant)

### **Packages Management**
- [ ] Create/edit/delete packages
- [ ] Set pricing
- [ ] Quantity settings
- [ ] Descriptions

---

## Payment Integration (Multi-Provider)

### **Tenant Payment Routing**

Create `lib/payment-routing.js`:
```javascript
export async function processPayment(tenantId, orderData) {
  const tenant = await getTenant(tenantId);
  
  switch(tenant.payment_provider) {
    case 'stripe':
      return stripePayment(tenant.stripe_account_id, orderData);
    case 'shopify':
      return shopifyPayment(tenant.shopify_store_url, orderData);
    case 'square':
      return squarePayment(tenant.square_account_id, orderData);
    default:
      throw new Error('Payment provider not configured');
  }
}
```

### **Stripe Multi-Account**

Each tenant connects to their own Stripe account:
- OAuth: User authorizes their Stripe account
- Stripe Connected Accounts: Alternative approach
- Charges go directly to tenant's Stripe account
- Platform takes % as commission

---

## Authentication

### **Tenant Admin Login**

Create `app/[tenant]/admin/login/page.js`:
```javascript
// Two-factor authentication:
// 1. Tenant slug
// 2. Admin password (per tenant)

// Optional: Magic link authentication
// Email-based login instead of password
```

### **API Route Protection**

Update all API routes:
```javascript
export async function POST(request, { params }) {
  const { tenant } = params;
  
  // Verify tenant exists
  const tenantData = await loadTenant(tenant);
  
  // Verify admin is authenticated
  const adminAuth = await verifyAdminAuth(request, tenantData.id);
  if (!adminAuth) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Process request with tenant isolation
  // ...
}
```

---

## Tenant Isolation & Security

### **Data Isolation Rules**

✅ **MUST enforce:**
- Users can only see their own tenant's orders
- Admins can only modify their own tenant
- Packages are per-tenant
- No cross-tenant data leakage

✅ **Database queries always include tenant_id:**
```javascript
// WRONG: SELECT * FROM orders WHERE user_id = ?
// RIGHT:
const orders = await allAsync(
  'SELECT * FROM orders WHERE user_id = ? AND tenant_id = ?',
  [userId, tenantId]
);
```

✅ **API routes validate tenant:**
```javascript
const requestedTenant = getTenantFromRequest();
const authenticatedTenant = getTenantFromAuth();

if (requestedTenant !== authenticatedTenant) {
  return unauthorized();
}
```

---

## Deployment Architecture

### **Single Instance (Recommended Start)**
```
One Vercel deployment
├── Handle multiple tenants
├── Single database (PostgreSQL)
└── Route based on hostname
```

### **Multi-Instance (Enterprise Scale)**
```
Multiple Vercel deployments
├── Load balancer
├── Auto-scaling
├── Shared database
└── CDN for assets
```

---

## Business Model Options

### **Model 1: Commission Per Transaction**
- Tenant signs up free
- You take 5-10% of each transaction
- They keep 90-95%
- Best for: Volume

### **Model 2: Subscription Tiers**
- **Starter:** $29/month (10 orders/month)
- **Pro:** $99/month (unlimited orders)
- **Enterprise:** Custom pricing
- Best for: Predictable revenue

### **Model 3: Hybrid**
- Base monthly fee + commission per transaction
- Example: $15/month + 2% per transaction
- Best for: Balanced revenue

### **Model 4: White-Label Licensing**
- One-time setup fee
- Monthly licensing fee
- They brand it as their own
- Premium pricing: $500-5000+/month

---

## Development Roadmap

### **Phase 1: Basic Multi-Tenant (Start Here)**
- [ ] Tenant creation system
- [ ] Tenant-specific URLs
- [ ] Admin login per tenant
- [ ] Database schema update
- [ ] Tenant detection middleware
- [ ] Data isolation enforcement

**Time:** 1-2 weeks
**Complexity:** Medium

### **Phase 2: Branding & Customization**
- [ ] Logo upload
- [ ] Color customization
- [ ] Text customization
- [ ] Hero images
- [ ] Custom pages (privacy, terms)

**Time:** 1 week
**Complexity:** Low-Medium

### **Phase 3: Payment Integration**
- [ ] Stripe Connect
- [ ] Shopify integration
- [ ] Square integration
- [ ] Payment routing
- [ ] Commission tracking

**Time:** 2 weeks
**Complexity:** High

### **Phase 4: Advanced Features**
- [ ] Custom domains
- [ ] Team accounts per tenant
- [ ] API for partners
- [ ] Advanced analytics
- [ ] Bulk order management

**Time:** Ongoing
**Complexity:** Varies

---

## File Structure Changes

```
app/
├── [tenant]/                          # NEW: Tenant routing
│   ├── page.js                       # Customer storefront
│   ├── layout.js                     # Tenant layout
│   ├── checkout/
│   ├── admin/
│   │   ├── page.js                   # Admin dashboard
│   │   ├── login/page.js             # Admin login
│   │   ├── branding/page.js          # Branding settings
│   │   ├── payment/page.js           # Payment config
│   │   └── customization/page.js     # Content customization
│   └── api/
│       ├── tenant-info/route.js      # Tenant data
│       └── ...

components/
├── TenantBranding.js                 # Apply tenant colors
├── TenantLogo.js                     # Display tenant logo
├── TenantAdminDashboard.js           # NEW
├── TenantBrandingPanel.js            # NEW
├── PaymentProviderSelector.js        # NEW
└── ...

lib/
├── tenant-detection.js               # NEW
├── tenant-db.js                      # NEW
├── tenant-isolation.js               # NEW
├── payment-routing.js                # NEW
└── ...
```

---

## Implementation Steps (Detailed)

### **Step 1: Create Tenant Tables**
```bash
# Update database schema
npm run db:setup
# Add new tables from schema above
```

### **Step 2: Create Tenant Detection Middleware**
```javascript
// lib/tenant-detection.js
// Detect from hostname
// Load tenant data
// Attach to request context
```

### **Step 3: Update App Router**
```javascript
// app/[tenant]/page.js → Customer storefront
// app/[tenant]/admin/page.js → Admin dashboard
// app/[tenant]/layout.js → Apply branding
```

### **Step 4: Create Admin Customization UI**
```javascript
// components/TenantBrandingPanel.js
// components/TenantCustomizationPanel.js
// components/PaymentSetupPanel.js
```

### **Step 5: Update API Routes**
```javascript
// Add tenant_id to all queries
// Add tenant validation to all routes
// Create tenant-specific endpoints
```

### **Step 6: Payment Integration**
```javascript
// lib/payment-routing.js
// Handle multiple providers
// Route to correct payment processor
```

---

## Database Migration Path

### **Existing Single-Tenant Data**
```sql
-- Create default tenant
INSERT INTO tenants (
  id, 
  tenant_slug, 
  business_name, 
  admin_email
) VALUES (
  'default-tenant',
  'original',
  'Original Business',
  'admin@example.com'
);

-- Update existing orders
UPDATE orders SET tenant_id = 'default-tenant';

-- Update existing packages
UPDATE packages SET tenant_id = 'default-tenant';
```

---

## Next Steps

### **Immediate (This Week)**
1. Design database schema finalization
2. Create tenant detection system
3. Update database with tenant tables
4. Create basic multi-tenant routing

### **Short Term (Next 2 Weeks)**
1. Admin portal per tenant
2. Branding customization UI
3. Payment processor selection
4. Tenant isolation enforcement

### **Medium Term (Next Month)**
1. Stripe Connect integration
2. Advanced customization options
3. Custom domain support
4. Analytics per tenant

### **Long Term (Ongoing)**
1. White-label options
2. Team collaboration features
3. API for partners
4. Scaling infrastructure

---

## Pricing Considerations

### **Development Cost to You**
- **Phase 1 (Multi-tenant basics):** 40-60 hours
- **Phase 2 (Branding):** 20-30 hours
- **Phase 3 (Payment integration):** 40-60 hours
- **Total to MVP:** 100-150 hours (2-3 weeks full-time)

### **Hosting Cost (Scaled)**
- **Vercel:** Free → $100-500/month (as you grow)
- **Database:** $15-300/month (PostgreSQL needed)
- **Payment processing:** Platform takes commission
- **Custom domains:** $10-15/year per domain

### **Revenue Potential**
- **Low tier:** 50 tenants × $29/month = $1,450/month
- **Mid tier:** 100 tenants × $99/month = $9,900/month
- **High tier:** Mixed = $20,000+/month

---

## Security Checklist

- [ ] Tenant data isolation enforced
- [ ] Admin authentication per tenant
- [ ] API routes validate tenant ownership
- [ ] Database queries include tenant_id
- [ ] No cross-tenant data exposure
- [ ] Payment accounts securely stored
- [ ] Rate limiting per tenant
- [ ] Audit logging per tenant
- [ ] SSL/HTTPS enforced
- [ ] Regular security audits

---

## Ready to Build?

This is a significant undertaking but **highly valuable** if executed well. The SaaS market for white-label print services is growing.

**Recommendation:** Start with Phase 1 (multi-tenant basics) to validate the concept, then expand.

Would you like me to:
1. Start building Phase 1 (multi-tenant architecture)?
2. Create detailed code for tenant detection?
3. Design the admin customization interface?
4. Set up the database schema?

Let me know where to begin! 🚀

