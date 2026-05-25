'use client';

/**
 * Order Metadata Display Component
 * Shows order number, date, and unit information
 * This would be integrated into your print template/PDF
 */

export function OrderMetadataDisplay({ orderMetadata, size = 'small' }) {
  if (!orderMetadata) {
    return null;
  }

  const sizeStyles = {
    small: {
      container: 'text-xs',
      number: 'text-sm font-mono',
      label: 'text-xs',
      spacing: 'py-1 px-2',
    },
    medium: {
      container: 'text-sm',
      number: 'text-base font-mono',
      label: 'text-xs',
      spacing: 'py-2 px-3',
    },
    large: {
      container: 'text-base',
      number: 'text-2xl font-mono',
      label: 'text-sm',
      spacing: 'py-3 px-4',
    },
  };

  const styles = sizeStyles[size] || sizeStyles.small;

  return (
    <div className={`border border-gray-400 rounded ${styles.spacing} bg-gray-50`}>
      {/* Order Number */}
      <div className="mb-2">
        <p className={`${styles.label} text-gray-600 uppercase font-bold`}>Order Number</p>
        <p className={`${styles.number} text-primary font-bold`}>
          {orderMetadata.orderNumber}
        </p>
      </div>

      {/* Order Date */}
      <div className="mb-2">
        <p className={`${styles.label} text-gray-600 uppercase font-bold`}>Date</p>
        <p className={`${styles.label} font-medium text-gray-800`}>
          {orderMetadata.dateFormatted}
        </p>
        <p className={`${styles.label} text-gray-600`}>
          {orderMetadata.timeFormatted}
        </p>
      </div>

      {/* Unit Label (if multi-unit) */}
      {orderMetadata.totalUnits > 1 && (
        <div className="pt-2 border-t border-gray-300">
          <p className={`${styles.label} text-gray-600 uppercase font-bold`}>Unit</p>
          <p className={`${styles.number} text-primary font-bold`}>
            {orderMetadata.unitLabel}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Audit Trail Component
 * Shows complete audit information for review
 */
export function AuditTrailDisplay({ orderMetadata }) {
  if (!orderMetadata) {
    return null;
  }

  const audit = orderMetadata.metadata?.auditTrail;

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-xs">
      <h3 className="font-bold text-primary mb-3">Audit Trail</h3>
      <div className="space-y-2 font-mono text-gray-700">
        <div>
          <span className="font-bold">Order Number:</span>
          <span className="ml-2">{audit?.orderNumber}</span>
        </div>
        <div>
          <span className="font-bold">Date Processed:</span>
          <span className="ml-2">{new Date(audit?.dateProcessed).toLocaleString()}</span>
        </div>
        <div>
          <span className="font-bold">Unit Count:</span>
          <span className="ml-2">{audit?.unitCount}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Print Template Footer
 * Ready to be embedded in print template PDF/document
 */
export function PrintTemplateFooter({ orderMetadata, includeBarcode = false }) {
  if (!orderMetadata) {
    return null;
  }

  return (
    <div className="border-t border-gray-300 pt-3 mt-4 text-center text-xs print:text-black">
      {/* Barcode-friendly string */}
      {includeBarcode && (
        <div className="mb-2 font-mono font-bold text-sm">
          {orderMetadata.orderNumber.replace(/-/g, '')}
        </div>
      )}

      {/* Order Info */}
      <div className="space-y-1">
        <p>
          <strong>Order:</strong> {orderMetadata.orderNumber} | <strong>Date:</strong>{' '}
          {orderMetadata.dateFormatted}
        </p>

        {/* Unit info if needed */}
        {orderMetadata.totalUnits > 1 && (
          <p>
            <strong>Unit:</strong> {orderMetadata.unitLabel}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Order Summary Box
 * Clean display for admin review
 */
export function OrderSummaryBox({ order, orderMetadata }) {
  if (!order || !orderMetadata) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">Order Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase">Order Number</p>
              <p className="text-2xl font-mono font-bold text-primary">
                {orderMetadata.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-bold uppercase">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {orderMetadata.dateFormatted}
              </p>
              <p className="text-sm text-gray-600">{orderMetadata.timeFormatted}</p>
            </div>

            {orderMetadata.totalUnits > 1 && (
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase">Unit Count</p>
                <p className="text-lg font-semibold text-gray-800">
                  {orderMetadata.unitLabel}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">Details</h3>
          <div className="bg-light rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-semibold text-gray-700">{order.id}</span>
            </div>
            {order.package_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-semibold text-gray-700">{order.package_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-accent">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span className="font-semibold text-gray-700">{order.payment_method}</span>
            </div>
            {order.amount && (
              <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                <span className="font-bold text-gray-800">Amount:</span>
                <span className="font-bold text-accent">${order.amount?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with barcode */}
      <div className="mt-6 pt-6 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-600 mb-2">Barcode / Scan Code</p>
        <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">
          {orderMetadata.orderNumber.replace(/-/g, '')}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {orderMetadata.orderNumber}
        </p>
      </div>
    </div>
  );
}

export default {
  OrderMetadataDisplay,
  AuditTrailDisplay,
  PrintTemplateFooter,
  OrderSummaryBox,
};
