import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync } from '@/lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const packageId = formData.get('packageId');
    const paymentMethod = formData.get('paymentMethod') || 'stripe';
    const files = formData.getAll('photos');

    if (!email || files.length === 0 || !packageId) {
      return Response.json(
        { error: 'Email, photos, and package selection required' },
        { status: 400 }
      );
    }

    const orderId = uuidv4();
    const uploadDir = join(process.cwd(), 'public', 'uploads', orderId);

    // Create directory
    await mkdir(uploadDir, { recursive: true });

    // Save files and create URLs
    const photoUrls = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuidv4()}.jpg`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      photoUrls.push(`/uploads/${orderId}/${filename}`);
    }

    // Get package details for pricing
    const pkg = await getAsync('SELECT * FROM packages WHERE id = ?', [packageId]);
    if (!pkg) {
      return Response.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Save to database
    await runAsync(
      `INSERT INTO users (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`,
      [uuidv4(), email]
    );

    const user = await getAsync(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    await runAsync(
      `INSERT INTO orders (id, user_id, package_id, photo_urls, status, amount, payment_method) 
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [orderId, user.id, packageId, JSON.stringify(photoUrls), pkg.base_price, paymentMethod]
    );

    return Response.json({ orderId, photoCount: files.length });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { allAsync } = require('@/lib/db');
    const orders = await allAsync(`
      SELECT o.*, u.email, p.name as package_name
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      LEFT JOIN packages p ON o.package_id = p.id
      ORDER BY o.created_at DESC
    `);

    return Response.json(orders);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
