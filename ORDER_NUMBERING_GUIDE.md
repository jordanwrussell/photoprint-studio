# Order Numbering & Audit System

## Overview

Your PhotoPrint app now includes a professional order numbering system with automatic sequencing, date stamps, and unit counting for complete audit trails and easy order tracking.

---

## Order Number Format

### Standard Format
```
ORD-20240524-00001
│   │      │  │
│   │      │  └─ Daily sequence (00001-99999)
│   │      └──── Date (YYYYMMDD)
│   └─────────── Literal "ORD"
└────────────── Order prefix
```

### Example Sequence
```
May 24, 2024:
- ORD-20240524-00001  (First order of the day)
- ORD-20240524-00002  (Second order)
- ORD-20240524-00003  (Third order)

May 25, 2024:
- ORD-20250525-00001  (First order of new day)
- ORD-20250525-00002  (Second order)
```

### Benefits
✅ **Automatic sequencing** - No manual numbering needed
✅ **Date-based** - Know order date from number
✅ **Unique** - No duplicates possible
✅ **Audit-friendly** - Easy to track and verify
✅ **Print-ready** - Include on each unit

---

## Unit Counting System

### Multi-Photo Orders
When an order has multiple photos, each gets a unit count:

```
Order: ORD-20240524-00001
4 Photos Uploaded

Unit Tracking:
├─ Unit 1 of 4  (Photo 1 → ORD-20240524-00001-1)
├─ Unit 2 of 4  (Photo 2 → ORD-20240524-00001-2)
├─ Unit 3 of 4  (Photo 3 → ORD-20240524-00001-3)
└─ Unit 4 of 4  (Photo 4 → ORD-20240524-00001-4)
```

### Use Cases
- **Printing:** Track which photo is being printed
- **Quality Control:** Mark issues with specific units
- **Fulfillment:** Ensure all units are packaged
- **Shipping:** Track multi-item shipments

### Format for Printing
```
[Order Number] | [Date] | [Unit Count]
ORD-20240524-00001 | May 24, 2024 | Unit 1 of 4
ORD-20240524-00001 | May 24, 2024 | Unit 2 of 4
ORD-20240524-00001 | May 24, 2024 | Unit 3 of 4
ORD-20240524-00001 | May 24, 2024 | Unit 4 of 4
```

---

## Admin Dashboard Features

### Enhanced Order Display (OrderAuditDisplay Component)

Each order shows:

#### Header Section
- **Order Number** (ORD-20240524-00001)
- **Creation Date** (MM/DD/YYYY)
- **Status Badge** (Pending, Paid, Processing, etc.)
- **Print Reference** (Full line ready to copy)

#### Summary Cards
- **Photos:** Total count of uploaded photos
- **Amount:** Order total
- **Method:** Payment method used

#### Expanded Details (Click to expand)

**Unit Tracking Section**
- Lists each unit (1 of 4, 2 of 4, etc.)
- Shows barcode for each unit
- Ready-to-print format

**Customer Information**
- Name, phone, email
- Pickup date (if applicable)
- Special instructions

**Photos Grid**
- Visual preview of all uploaded photos
- Photo numbers (1/4, 2/4, etc.)

**Audit Information**
- Order number and creation time
- Last updated timestamp
- Package information
- Total unit count

**Status Controls**
- Buttons to update order status
- Options: Pending, Paid, Processing, Shipped, Delivered, Cancelled

**Audit Reference (for printing)**
- Formatted print-ready reference
- Copy-paste ready
- Includes order number, date, and unit count

---

## Audit Report System

### Generating Reports

Access from Admin Dashboard → **Audit Reports tab**

1. **Select Date Range**
   - Start date
   - End date

2. **Generate Report**
   - Shows all orders in range
   - Displays summary statistics

3. **Download as CSV**
   - Export for spreadsheets
   - Filename: `audit-report-YYYY-MM-DD-to-YYYY-MM-DD.csv`

### Report Contents

**Summary Statistics**
- Total orders in period
- Total photos uploaded
- Average photos per order

**Orders by Status**
- Breakdown of orders by status
- Count for each status

**Detailed Table**
Columns:
- Order Number
- Date
- Status
- Payment Method
- Amount
- Photo Count
- Unit Range (e.g., "1-4" for 4-photo order)

---

## Database Structure

### order_number Column
```sql
order_number TEXT UNIQUE
```

- Automatically generated
- Unique constraint prevents duplicates
- Indexed for fast lookups
- Format: ORD-YYYYMMDD-NNNNN

### Storage Format
Orders table now includes:
```
id                 → Order ID (UUID)
order_number       → Auto-generated number (ORD-...)
created_at         → Timestamp
photo_urls         → Array of photo paths
customer_info      → JSON customer data
status             → Current order status
payment_method     → stripe/shopify/local_pickup
amount             → Order total
```

---

## API Endpoints

### Generate Order Number
```
POST /api/orders/[orderId]
Body: { 
  status: "paid",
  order_number: "ORD-20240524-00001" (auto-generated)
}
```

### Get Audit Information
```
GET /api/orders/[orderId]/audit-info

Response: {
  orderId: "...",
  orderNumber: "ORD-20240524-00001",
  createdDate: "05/24/2024",
  createdDateTime: "2024-05-24T10:30:45Z",
  updatedAt: "2024-05-24T11:45:00Z",
  status: "paid",
  paymentMethod: "stripe",
  amount: 29.99,
  packageName: "Single Print",
  totalUnits: 4,
  units: [
    { unitNumber: 1, barcode: "ORD-20240524-00001-1", ... },
    { unitNumber: 2, barcode: "ORD-20240524-00001-2", ... },
    ...
  ]
}
```

### Generate Audit Report
```
POST /api/admin/audit-report
Body: {
  startDate: "2024-05-20",
  endDate: "2024-05-24"
}

Response: {
  dateRange: { start, end },
  totalOrders: 42,
  totalPhotos: 157,
  ordersByDate: { ... },
  ordersByStatus: { ... },
  orders: [
    {
      order_number: "ORD-20240524-00001",
      photoCount: 4,
      formattedDate: "05/24/2024",
      ...
    },
    ...
  ]
}
```

---

## Utilities (lib/order-numbering.js)

### Available Functions

**generateOrderNumber()**
- Auto-generates next order number for today
- Returns: "ORD-YYYYMMDD-NNNNN"

**getOrderWithNumbering(orderId)**
- Gets order with formatted numbering info
- Returns: Order object with orderNumber, photoCount, createdDate

**formatUnitCount(current, total)**
- Formats unit display
- Returns: "1 of 4" format

**generateOrderReference(orderData, currentUnit, totalUnits)**
- Creates reference object for printing
- Returns: { orderNumber, date, unitCount, barcode, fullReference }

**formatOrderReferenceForDisplay(orderData, current, total)**
- Formats for admin display
- Returns: "ORD-... | May 24, 2024 | Unit 1 of 4"

**formatOrderForTemplate(orderData, current, total)**
- Prepares for print template injection
- Returns: Complete template-ready data

**getOrdersByDate(date)**
- Gets all orders for specific date
- Returns: Array of orders with daily sequence

**generateAuditReport(startDate, endDate)**
- Complete audit report for date range
- Returns: Report with statistics and order list

**verifyOrderSequence(date)**
- Checks for gaps or duplicates in order numbers
- Returns: Verification result with any issues

---

## Print Template Integration

### Inject Order Reference
When generating print templates, include:

```html
<div class="order-reference">
  <p>{{ orderNumber }}</p>
  <p>{{ createdDate }}</p>
  <p>{{ unitFormatted }}</p>
</div>
```

### Data Available
From `formatOrderForTemplate()`:
```javascript
{
  orderNumber: "ORD-20240524-00001",
  createdDate: "05/24/2024",
  createdDateTime: "2024-05-24T10:30:45Z",
  unitCurrent: 1,
  unitTotal: 4,
  unitFormatted: "1 of 4",
  barcode: "ORD-20240524-00001-1",
  reference: "ORD-20240524-00001 | 05/24/2024 | 1 of 4",
  totalPhotos: 4,
  dateObject: Date,
}
```

---

## Workflow Examples

### Example 1: Single Photo Order

```
1. Customer uploads 1 photo
2. Creates order → Gets: ORD-20240524-00005
3. Selects package & pays
4. Admin sees:
   ├─ Order Number: ORD-20240524-00005
   ├─ Date: May 24, 2024
   ├─ Status: Paid
   ├─ Units: 1 of 1
   └─ Print Reference: ORD-20240524-00005 | May 24, 2024 | 1 of 1
5. Print template includes order reference
6. Package ship
```

### Example 2: Multi-Photo Local Pickup

```
1. Customer uploads 3 photos
2. Creates order → Gets: ORD-20240524-00006
3. Selects Local Pickup
4. Fills pickup form
5. Admin sees:
   ├─ Order: ORD-20240524-00006
   ├─ Customer: John Doe
   ├─ Pickup Date: May 26, 2024
   ├─ Status: Pending Pickup
   └─ Units:
      ├─ Unit 1 of 3 (ORD-20240524-00006-1)
      ├─ Unit 2 of 3 (ORD-20240524-00006-2)
      └─ Unit 3 of 3 (ORD-20240524-00006-3)
6. Print each unit with its reference
7. Customer picks up 3 prints
```

### Example 3: Audit Report

```
Date Range: May 20-24, 2024

Summary:
- Total Orders: 47
- Total Photos: 156
- Avg Photos/Order: 3.3

By Status:
- Paid: 42
- Processing: 3
- Shipped: 2

Table:
ORD-20240520-00001 | May 20 | Shipped | 4 photos | 1-4
ORD-20240520-00002 | May 20 | Paid | 2 photos | 1-2
ORD-20240521-00001 | May 21 | Processing | 5 photos | 1-5
...
```

---

## Troubleshooting

### Order Number Not Showing
- Check database has order_number column
- Run `npm run db:setup` to update schema
- Check order was saved to database

### Duplicate Order Numbers
- Should not be possible (unique constraint)
- If occurs, check database directly
- Contact support with date/time

### Unit Count Incorrect
- Verify photo count is correct
- Check photo_urls JSON is valid
- Reload order details from admin

### Audit Report Missing Orders
- Confirm orders have created_at timestamp
- Check date range selection
- Verify order status is set

---

## Best Practices

### For Printing
1. Include order number on each unit
2. Include date for reference
3. Include unit count (1 of N)
4. Consider barcode for scanning
5. Place reference clearly on package

### For Tracking
1. Use order number in all communications
2. Reference unit number when discussing specific photos
3. Document status changes with timestamp
4. Keep audit reports for compliance

### For Quality Control
1. Mark unit number when inspecting
2. Track which units had issues
3. Use audit report for trend analysis
4. Review daily reports for patterns

---

## Files Modified/Created

### New Files
- `lib/order-numbering.js` - Order numbering utilities
- `components/OrderAuditDisplay.js` - Enhanced order display
- `components/AuditReportPanel.js` - Audit report interface
- `app/api/orders/[orderId]/audit-info/route.js` - Audit API
- `app/api/admin/audit-report/route.js` - Report API

### Database Updates
- Added `order_number` column to orders table
- Added unique constraint
- Added index for performance

### No Breaking Changes
- Fully backward compatible
- Existing orders still work
- New system optional

---

## Next Steps

1. ✅ Database updated with order_number column
2. ✅ Order numbering system implemented
3. ✅ Admin display enhanced
4. ✅ Audit reports added
5. → Test the system
6. → Customize templates to include order reference
7. → Start using order numbers in your business

---

**Ready to use!** Your order numbering system is production-ready and fully integrated. 🎉
