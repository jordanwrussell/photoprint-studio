import { createPaymentIntent } from '@/lib/stripe-utils';

export async function POST(request) {
  try {
    const { orderId, amount } = await request.json();

    const paymentIntent = await createPaymentIntent(amount, {
      orderId,
      type: 'photo_print',
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
