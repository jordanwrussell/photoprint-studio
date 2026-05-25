import { getAsync, runAsync } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { orderId } = params;
    const order = await getAsync(
      `SELECT o.*, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`,
      [orderId]
    );

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { status, stripePaymentId, templateData, notes } = body;

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (stripePaymentId) {
      updates.push('stripe_payment_id = ?');
      values.push(stripePaymentId);
    }
    if (templateData) {
      updates.push('template_data = ?');
      values.push(JSON.stringify(templateData));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(orderId);

    await runAsync(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedOrder = await getAsync(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    return Response.json(updatedOrder);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
