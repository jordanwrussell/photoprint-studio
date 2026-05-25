'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShopifyCheckout({ params }) {
  const { orderId } = params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');

  useEffect(() => {
    loadOrderAndCreateCheckout();
  }, [orderId]);

  const loadOrderAndCreateCheckout = async () => {
    try {
      // Fetch order details
      const orderRes = await fetch(`/api/orders/${orderId}`);
      const order = await orderRes.json();
      setOrderDetails(order);

      // Create Shopify checkout session
      const checkoutRes = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: order.amount || 29.99,
          email: order.email,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (checkoutRes.ok && checkoutData.checkoutUrl) {
        setCheckoutUrl(checkoutData.checkoutUrl);
      } else {
        setError(checkoutData.error || 'Failed to create checkout');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p>Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl p-8">
          <div className="text-red-600 mb-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Checkout Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <Link href="/">
            <button className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutUrl) {
    // Redirect to Shopify checkout
    useEffect(() => {
      window.location.href = checkoutUrl;
    }, [checkoutUrl]);
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl p-8 text-center">
        <div className="mb-6">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Redirecting...</h2>
          <p className="text-gray-600 mb-6">Preparing your Shopify checkout page</p>
        </div>

        <div className="spinner mx-auto"></div>

        <p className="text-xs text-gray-500 mt-8">
          If you're not redirected automatically,{' '}
          <button
            onClick={() => {
              if (checkoutUrl) window.location.href = checkoutUrl;
            }}
            className="text-accent font-medium hover:underline"
          >
            click here
          </button>
        </p>
      </div>
    </div>
  );
}
