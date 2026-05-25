/**
 * Order Numbering System
 * Generates professional order numbers with date stamps and unit counting
 */

import { getAsync, runAsync, allAsync } from './db';

/**
 * Generate order number with date prefix
 * Format: ORD-20240524-00001
 * 
 * @returns {Promise<string>} Order number
 */
export async function generateOrderNumber() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  // Count orders created today
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const result = await getAsync(
    `SELECT COUNT(*) as count FROM orders 
     WHERE DATE(created_at) = DATE(?)`,
    [today.toISOString()]
  );

  const dailyCount = (result?.count || 0) + 1;
  const sequenceNumber = String(dailyCount).padStart(5, '0');

  return `ORD-${datePrefix}-${sequenceNumber}`;
}

/**
 * Get order details including numbering info
 * 
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order with numbering details
 */
export async function getOrderWithNumbering(orderId) {
  const order = await getAsync(
    'SELECT * FROM orders WHERE id = ?',
    [orderId]
  );

  if (!order) {
    return null;
  }

  // Get photo count
  const photos = order.photo_urls ? JSON.parse(order.photo_urls) : [];
  const photoCount = photos.length;

  // Get order number if it exists, otherwise generate
  const orderNumber = order.order_number || await generateOrderNumber();

  // Format creation date
  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return {
    ...order,
    orderNumber,
    photoCount,
    createdDate: formattedDate,
    createdDateTime: createdDate.toISOString(),
  };
}

/**
 * Format unit count for display (e.g., "1 of 4")
 * 
 * @param {number} currentUnit - Current unit number (1-based)
 * @param {number} totalUnits - Total units
 * @returns {string} Formatted unit count
 */
export function formatUnitCount(currentUnit, totalUnits) {
  if (!currentUnit || !totalUnits) return '';
  return `${currentUnit} of ${totalUnits}`;
}

/**
 * Generate complete order reference for printing
 * Includes: Order Number, Date, Unit Count
 * 
 * @param {Object} orderData - Order data
 * @param {number} currentUnit - Current unit number (1-based)
 * @param {number} totalUnits - Total units in this order
 * @returns {Object} Reference object for template
 */
export function generateOrderReference(orderData, currentUnit, totalUnits) {
  const unitCount = formatUnitCount(currentUnit, totalUnits);
  
  return {
    orderNumber: orderData.orderNumber,
    date: orderData.createdDate,
    dateFormatted: new Date(orderData.created_at).toLocaleDateString(),
    unitCount,
    currentUnit,
    totalUnits,
    // For QR code or barcode if needed
    barcode: `${orderData.orderNumber}-${currentUnit}`,
    // Full reference line for printing
    fullReference: `${orderData.orderNumber} | ${orderData.createdDate} | ${unitCount}`,
  };
}

/**
 * Format order reference for display on admin
 * Shows: "ORD-20240524-00001 | May 24, 2024 | Unit 1 of 4"
 * 
 * @param {Object} orderData - Order data
 * @param {number} currentUnit - Current unit (1-based)
 * @param {number} totalUnits - Total units
 * @returns {string} Formatted display string
 */
export function formatOrderReferenceForDisplay(orderData, currentUnit, totalUnits) {
  const date = new Date(orderData.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const unitCount = formatUnitCount(currentUnit, totalUnits);
  return `${orderData.orderNumber} | ${date} | Unit ${unitCount}`;
}

/**
 * Get all orders for a specific date for audit
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Orders for that date
 */
export async function getOrdersByDate(date) {
  const orders = await allAsync(
    `SELECT * FROM orders 
     WHERE DATE(created_at) = ? 
     ORDER BY created_at ASC`,
    [date]
  );

  return orders.map((order, index) => ({
    ...order,
    dailySequence: index + 1,
    dateCreated: new Date(order.created_at).toLocaleDateString(),
    photoCount: order.photo_urls ? JSON.parse(order.photo_urls).length : 0,
  }));
}

/**
 * Generate audit report for a date range
 * 
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Audit report
 */
export async function generateAuditReport(startDate, endDate) {
  const orders = await allAsync(
    `SELECT * FROM orders 
     WHERE DATE(created_at) BETWEEN ? AND ?
     ORDER BY created_at ASC`,
    [startDate, endDate]
  );

  const report = {
    dateRange: { start: startDate, end: endDate },
    totalOrders: orders.length,
    totalPhotos: 0,
    ordersByDate: {},
    ordersByStatus: {},
    orders: [],
  };

  orders.forEach((order) => {
    // Count photos
    const photos = order.photo_urls ? JSON.parse(order.photo_urls) : [];
    report.totalPhotos += photos.length;

    // Group by date
    const date = new Date(order.created_at).toLocaleDateString();
    if (!report.ordersByDate[date]) {
      report.ordersByDate[date] = [];
    }
    report.ordersByDate[date].push(order);

    // Group by status
    if (!report.ordersByStatus[order.status]) {
      report.ordersByStatus[order.status] = [];
    }
    report.ordersByStatus[order.status].push(order);

    // Add formatted order info
    report.orders.push({
      ...order,
      photoCount: photos.length,
      formattedDate: date,
    });
  });

  return report;
}

/**
 * Verify order sequence for a date (audit check)
 * Ensures no gaps in order numbers for a specific date
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Verification result
 */
export async function verifyOrderSequence(date) {
  const orders = await getOrdersByDate(date);
  const verification = {
    date,
    totalOrders: orders.length,
    gaps: [],
    duplicates: [],
    isValid: true,
  };

  const orderNumbers = orders.map((o) => o.order_number).sort();
  
  // Check for duplicates
  for (let i = 0; i < orderNumbers.length - 1; i++) {
    if (orderNumbers[i] === orderNumbers[i + 1]) {
      verification.duplicates.push(orderNumbers[i]);
      verification.isValid = false;
    }
  }

  // Check for gaps in sequence
  if (orders.length > 1) {
    for (let i = 0; i < orders.length - 1; i++) {
      const currentSeq = parseInt(orders[i].order_number.split('-')[2]);
      const nextSeq = parseInt(orders[i + 1].order_number.split('-')[2]);
      
      if (nextSeq !== currentSeq + 1) {
        verification.gaps.push({
          between: `${currentSeq} and ${nextSeq}`,
          missing: Array.from(
            { length: nextSeq - currentSeq - 1 },
            (_, i) => currentSeq + i + 1
          ),
        });
        verification.isValid = false;
      }
    }
  }

  return verification;
}

/**
 * Get next unit number for multi-unit orders
 * Tracks which unit of a multi-photo order is being processed
 * 
 * @param {string} orderId - Order ID
 * @param {number} totalUnits - Total units/photos in order
 * @returns {Promise<number>} Next unit to process (1-based)
 */
export async function getNextUnitNumber(orderId) {
  const order = await getAsync(
    'SELECT * FROM orders WHERE id = ?',
    [orderId]
  );

  if (!order) {
    return 1;
  }

  const photos = order.photo_urls ? JSON.parse(order.photo_urls) : [];
  return Math.min(photos.length, 1); // Return 1-based unit number
}

/**
 * Format order for print template
 * Includes all numbering information ready for template injection
 * 
 * @param {Object} orderData - Order data
 * @param {number} currentUnit - Current unit being processed
 * @param {number} totalUnits - Total units in order
 * @returns {Object} Template-ready order data
 */
export function formatOrderForTemplate(orderData, currentUnit = 1, totalUnits = 1) {
  return {
    orderNumber: orderData.orderNumber,
    createdDate: orderData.createdDate,
    createdDateTime: orderData.created_at,
    unitCurrent: currentUnit,
    unitTotal: totalUnits,
    unitFormatted: formatUnitCount(currentUnit, totalUnits),
    barcode: `${orderData.orderNumber}-${currentUnit}`,
    reference: `${orderData.orderNumber} | ${orderData.createdDate} | ${formatUnitCount(currentUnit, totalUnits)}`,
    // Additional fields for template flexibility
    dateObject: new Date(orderData.created_at),
    totalPhotos: orderData.photoCount || totalUnits,
  };
}

export default {
  generateOrderNumber,
  getOrderWithNumbering,
  formatUnitCount,
  generateOrderReference,
  formatOrderReferenceForDisplay,
  getOrdersByDate,
  generateAuditReport,
  verifyOrderSequence,
  getNextUnitNumber,
  formatOrderForTemplate,
};
