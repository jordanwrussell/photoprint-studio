import { runAsync, getAsync } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pkg = await getAsync('SELECT * FROM packages WHERE id = ?', [id]);

    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    return Response.json(pkg);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { name, quantity, basePrice, description } = await request.json();

    await runAsync(
      `UPDATE packages SET name = ?, quantity = ?, base_price = ?, description = ? WHERE id = ?`,
      [name, quantity, basePrice, description, id]
    );

    const updated = await getAsync('SELECT * FROM packages WHERE id = ?', [id]);
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await runAsync('DELETE FROM packages WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
