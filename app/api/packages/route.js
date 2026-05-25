import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '@/lib/db';

export async function GET(request) {
  try {
    const packages = await allAsync(
      'SELECT * FROM packages ORDER BY created_at DESC'
    );
    return Response.json(packages);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, quantity, basePrice, description } = await request.json();
    const packageId = uuidv4();

    await runAsync(
      `INSERT INTO packages (id, name, quantity, base_price, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [packageId, name, quantity, basePrice, description]
    );

    const newPackage = await getAsync('SELECT * FROM packages WHERE id = ?', [packageId]);
    return Response.json(newPackage);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
