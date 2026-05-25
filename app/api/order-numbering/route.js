import { generateOrderNumber, getCounterStats, getNextOrderNumberPreview } from '@/lib/order-numbering';
import { runAsync } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'preview') {
      // Get next order number without incrementing
      const nextNumber = await getNextOrderNumberPreview();
      return Response.json({ nextNumber });
    }

    if (action === 'stats') {
      // Get counter statistics
      const stats = await getCounterStats();
      return Response.json(stats);
    }

    // Default: return stats
    const stats = await getCounterStats();
    return Response.json(stats);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, orderId } = await request.json();

    if (action === 'generate') {
      // Generate next sequential order number
      const orderNumber = await generateOrderNumber();

      // Update order with order number
      if (orderId) {
        await runAsync(
          'UPDATE orders SET order_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderNumber, orderId]
        );
      }

      return Response.json({ orderNumber });
    }

    return Response.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
