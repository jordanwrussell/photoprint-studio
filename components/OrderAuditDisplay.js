'use client';

import { useState, useEffect } from 'react';
import { formatOrderReferenceForDisplay } from '@/lib/order-numbering';

function OrderAuditDisplay({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [auditInfo, setAuditInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Parse order data
  const photos = order.photo_urls ? JSON.parse(order.photo_urls) : [];
  const customerInfo = order.customer_info ? JSON.parse(order.customer_info) : {};
  const photoCount = photos.length;

  // Format dates
  const createdDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Generate order reference
  const orderReference = order.order_number
    ? formatOrderReferenceForDisplay(
        { ...order, createdDate },
        1,
        photoCount
      )
    : 'Generating...';

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    pending_pickup: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleStatusChange = async (newStatus) => {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      onStatusChange(order.id, newStatus);
    }
  };

  const loadAuditInfo = async () => {
    if (auditInfo) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/audit-info`);
      const data = await res.json();
      setAuditInfo(data);
    } catch (err) {
      console.error('Error loading audit info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      loadAuditInfo();
    }
  }, [expanded]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header with Order Number and Status */}
      <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          {/* Order Number Display */}
          <div className="mb-2">
            <h3 className="text-sm font-mono font-bold text-primary">
              {order.order_number || 'ORD-PENDING'}
            </h3>
            <p className="text-xs text-gray-600">
              Created: {createdDate}
            </p>
          </div>

          {/* Order Reference Line for Printing */}
          <div className="bg-gray-50 border border-gray-300 rounded p-2 mb-3">
            <p className="text-xs font-mono text-gray-700 break-all">
              {orderReference}
            </p>
          </div>

          {/* Customer Info */}
          <p className="text-sm text-gray-700">
            {customerInfo.firstName && customerInfo.lastName
              ? `${customerInfo.firstName} ${customerInfo.lastName}`
              : 'Customer info pending'}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
            statusColors[order.status] || statusColors.pending
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center bg-light rounded p-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Photos</p>
          <p className="text-lg font-bold text-primary">{photoCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Amount</p>
          <p className="text-lg font-bold text-accent">${(order.amount || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Method</p>
          <p className="text-lg font-bold text-primary capitalize">{order.payment_method}</p>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
          {/* Unit Counting System */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-3">Unit Tracking</h4>
            <div className="space-y-2">
              {Array.from({ length: photoCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-white border border-blue-300 rounded"
                >
                  <div className="font-mono font-bold text-primary">
                    Unit {idx + 1} of {photoCount}
                  </div>
                  <div className="flex-1 text-right text-xs text-gray-600">
                    {order.order_number}-{idx + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-3">
              💡 Use unit numbers to track each photo through the printing process
            </p>
          </div>

          {/* Customer Information */}
          {customerInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-3">Customer Information</h4>
              <div className="space-y-2 text-sm">
                {customerInfo.firstName && (
                  <p>
                    <span className="font-medium">Name:</span> {customerInfo.firstName}{' '}
                    {customerInfo.lastName}
                  </p>
                )}
                {customerInfo.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {customerInfo.phone}
                  </p>
                )}
                {customerInfo.customerEmail && (
                  <p>
                    <span className="font-medium">Email:</span> {customerInfo.customerEmail}
                  </p>
                )}
                {customerInfo.pickupDate && (
                  <p>
                    <span className="font-medium">Pickup Date:</span> {customerInfo.pickupDate}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Photos Grid */}
          {photos.length > 0 && (
            <div>
              <h4 className="font-bold text-primary mb-3">Uploaded Photos ({photoCount})</h4>
              <div className="grid grid-cols-4 gap-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded font-bold opacity-90">
                      {idx + 1}/{photoCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Information */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading audit information...</p>
            </div>
          ) : auditInfo ? (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-3">Audit Information</h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p>
                  <span className="font-medium">Order Number:</span> {auditInfo.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Created:</span> {auditInfo.createdDateTime}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span> {auditInfo.updatedAt}
                </p>
                <p>
                  <span className="font-medium">Total Units:</span> {photoCount}
                </p>
                <p>
                  <span className="font-medium">Package:</span> {auditInfo.packageName}
                </p>
              </div>
            </div>
          ) : null}

          {/* Status Controls */}
          <div>
            <h4 className="font-bold text-primary mb-3">Update Status</h4>
            <div className="grid grid-cols-2 gap-2">
              {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={order.status === status}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                      order.status === status
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Print Audit Reference */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-600 mb-2">AUDIT REFERENCE (for printing):</p>
            <div className="font-mono text-sm font-bold text-primary break-all p-3 bg-white rounded border border-gray-300">
              {orderReference}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Print this reference on each unit for tracking
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderAuditDisplay;
