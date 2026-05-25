import { runAsync, getAsync } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { orderId } = params;
    const body = await request.json();

    const {
      firstName,
      lastName,
      phone,
      email: customerEmail,
      pickupDate,
      specialInstructions,
      optInUpdates,
      optInEmail,
      optInText,
      status,
    } = body;

    // Get order
    const order = await getAsync('SELECT * FROM orders WHERE id = ?', [orderId]);

    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with local pickup details
    const customerInfo = {
      firstName,
      lastName,
      phone,
      customerEmail,
      pickupDate,
      specialInstructions,
      optInUpdates,
      optInEmail,
      optInText,
    };

    await runAsync(
      `UPDATE orders 
       SET status = ?, customer_info = ?, payment_method = 'local_pickup', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status || 'pending_pickup', JSON.stringify(customerInfo), orderId]
    );

    // Send confirmation email if opted in
    if (optInEmail && customerEmail) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail,
          template: 'local-pickup-confirmation',
          data: {
            orderId,
            firstName,
            pickupDate,
          },
        }),
      }).catch((err) => console.error('Email send failed:', err));
    }

    const updatedOrder = await getAsync('SELECT * FROM orders WHERE id = ?', [orderId]);

    return Response.json(updatedOrder);
  } catch (error) {
    console.error('Local pickup error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
