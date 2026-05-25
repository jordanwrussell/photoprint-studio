'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-js';

function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch order details
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrderDetails(data))
      .catch((err) => setError(err.message));
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      // Create payment intent on backend
      const intentRes = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: orderDetails?.amount || 29.99 }),
      });

      const { clientSecret } = await intentRes.json();

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        // Update order status
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid', stripePaymentId: paymentIntent.id }),
        });

        setTimeout(() => {
          window.location.href = `/order-confirmation/${orderId}`;
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!orderDetails) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          ✓ Payment successful! Redirecting...
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1a1a',
                  '::placeholder': {
                    color: '#999',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-light rounded-lg p-6">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600">Subtotal</span>
          <span>${(orderDetails.amount * 0.85).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-3 border-b border-gray-300 pb-3">
          <span className="text-gray-600">Shipping</span>
          <span>${(orderDetails.amount * 0.15).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-accent">${orderDetails.amount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing || !stripe}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          processing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-accent text-white hover:bg-opacity-90'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner"></span>
            Processing...
          </span>
        ) : (
          `Pay $${orderDetails.amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage({ params }) {
  const { orderId } = params;
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    );
  }, []);

  return (
    <div className="min-h-screen bg-light">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8 font-display">Checkout</h1>

          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm orderId={orderId} />
            </Elements>
          ) : (
            <div className="text-center">Loading payment processor...</div>
          )}
        </div>
      </div>
    </div>
  );
}
