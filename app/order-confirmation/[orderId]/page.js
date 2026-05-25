'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderConfirmation({ params }) {
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center animate-fadeIn">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-block bg-green-100 rounded-full p-6 mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-primary mb-4 font-display">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your beautiful prints are being prepared
          </p>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 text-left">
            <h2 className="text-xl font-bold text-primary mb-6 font-display">Order Details</h2>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono text-sm font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Paid
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-accent">$29.99</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Check your email for:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Order confirmation</li>
                <li>✓ Print status updates</li>
                <li>✓ Shipping information</li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-blue-900 mb-4">What Happens Next?</h3>
            <ol className="space-y-3 text-sm text-blue-800">
              <li>
                <strong>1. Review:</strong> Your photos will be reviewed and integrated into the template
              </li>
              <li>
                <strong>2. Quality Check:</strong> Our team ensures perfect color and alignment
              </li>
              <li>
                <strong>3. Print & Ship:</strong> Your prints will be professionally printed and shipped
              </li>
              <li>
                <strong>4. Delivery:</strong> You'll receive tracking info via email
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <button className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90 transition-all">
                Create Another Order
              </button>
            </Link>
            <Link href={`https://support.example.com/orders/${orderId}`}>
              <button className="px-8 py-3 bg-white border-2 border-accent text-accent rounded-lg font-medium hover:bg-accent hover:text-white transition-all">
                View in Dashboard
              </button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            Questions? Contact support@example.com
          </p>
        </div>
      </div>
    </div>
  );
}
