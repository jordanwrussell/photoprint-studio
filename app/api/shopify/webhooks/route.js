import crypto from 'crypto';
import { runAsync } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.text();
    const hmac = request.headers.get('X-Shopify-Hmac-SHA256');

    // Verify webhook signature
    const encodedBody = crypto
      .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || '')
      .update(body, 'utf8')
      .digest('base64');

    if (encodedBody !== hmac) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);

    // Handle different webhook types
    if (data.topic === 'orders/fulfilled') {
      // Order was paid and fulfilled
      const orderId = data.properties?.orderId;
      
      if (orderId) {
        await runAsync(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['paid', orderId]
        );
      }
    } else if (data.topic === 'orders/payment_confirmed') {
      // Payment confirmed
      const orderId = data.properties?.orderId;
      
      if (orderId) {
        await runAsync(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['paid', orderId]
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
