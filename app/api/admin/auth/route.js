export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'change_me_to_secure_password';

    if (password === adminPassword) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
