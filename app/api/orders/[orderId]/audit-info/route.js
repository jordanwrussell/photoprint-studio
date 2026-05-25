import { getAsync } from '@/lib/db';
import { getOrderWithNumbering } from '@/lib/order-numbering';

export async function GET(request, { params }) {
  try {
    const { orderId } = params;
    
    // Get order with numbering info
    const orderWithNumbering = await getOrderWithNumbering(orderId);
    
    if (!orderWithNumbering) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get package info
    const pkg = await getAsync(
      'SELECT name FROM packages WHERE id = ?',
      [orderWithNumbering.package_id]
    );

    // Get photos count
    const photos = orderWithNumbering.photo_urls 
      ? JSON.parse(orderWithNumbering.photo_urls)
      : [];

    // Prepare audit information
    const auditInfo = {
      orderId,
      orderNumber: orderWithNumbering.orderNumber,
      createdDate: orderWithNumbering.createdDate,
      createdDateTime: orderWithNumbering.createdDateTime,
      updatedAt: new Date(orderWithNumbering.updated_at).toISOString(),
      status: orderWithNumbering.status,
      paymentMethod: orderWithNumbering.payment_method,
      amount: orderWithNumbering.amount,
      packageName: pkg?.name || 'Unknown',
      totalUnits: photos.length,
      units: Array.from({ length: photos.length }, (_, i) => ({
        unitNumber: i + 1,
        barcode: `${orderWithNumbering.orderNumber}-${i + 1}`,
        reference: `Unit ${i + 1} of ${photos.length}`,
      })),
      auditTrail: {
        created: orderWithNumbering.created_at,
        updated: orderWithNumbering.updated_at,
      },
    };

    return Response.json(auditInfo);
  } catch (error) {
    console.error('Audit info error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
