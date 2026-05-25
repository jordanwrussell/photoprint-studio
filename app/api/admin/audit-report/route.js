import { allAsync } from '@/lib/db';

export async function POST(request) {
  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return Response.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Get all orders in date range
    const orders = await allAsync(
      `SELECT * FROM orders 
       WHERE DATE(created_at) BETWEEN ? AND ?
       ORDER BY created_at ASC`,
      [startDate, endDate]
    );

    // Process data
    let totalPhotos = 0;
    const ordersByDate = {};
    const ordersByStatus = {};
    const processedOrders = [];

    orders.forEach((order) => {
      const photos = order.photo_urls ? JSON.parse(order.photo_urls) : [];
      const photoCount = photos.length;
      totalPhotos += photoCount;

      const date = new Date(order.created_at).toLocaleDateString();

      // Group by date
      if (!ordersByDate[date]) {
        ordersByDate[date] = [];
      }
      ordersByDate[date].push(order);

      // Group by status
      if (!ordersByStatus[order.status]) {
        ordersByStatus[order.status] = [];
      }
      ordersByStatus[order.status].push(order);

      // Add to processed list
      processedOrders.push({
        ...order,
        photoCount,
        formattedDate: date,
      });
    });

    const report = {
      dateRange: { start: startDate, end: endDate },
      totalOrders: orders.length,
      totalPhotos,
      ordersByDate,
      ordersByStatus,
      orders: processedOrders,
    };

    return Response.json(report);
  } catch (error) {
    console.error('Audit report error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
