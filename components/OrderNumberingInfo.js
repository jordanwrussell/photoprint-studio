'use client';

import { useState, useEffect } from 'react';

function OrderNumberingInfo() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/order-numbering?action=stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner mx-auto mb-4"></div>
        <p>Loading order numbering stats...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-primary font-display mb-2">
            Order Numbering System
          </h3>
          <p className="text-sm text-gray-600">Sequential order tracking and audit trail</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            refreshing
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
          }`}
        >
          {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Year: {stats?.currentYear}</p>
        </div>

        {/* Last Order Number */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 font-medium mb-1">Last Order #</p>
          <p className="text-lg font-mono font-bold text-primary break-all">
            {stats?.lastOrderNumber}
          </p>
        </div>

        {/* Next Order Number */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 font-medium mb-1">Next Order #</p>
          <p className="text-lg font-mono font-bold text-accent">
            ORD-{stats?.currentYear}-{String(stats?.readyForNextOrder || 0).padStart(4, '0')}
          </p>
        </div>

        {/* Last Reset */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 font-medium mb-1">Counter Reset</p>
          <p className="text-sm font-medium text-gray-700">{stats?.lastReset}</p>
          <p className="text-xs text-gray-500 mt-2">(Resets annually)</p>
        </div>
      </div>

      {/* Order Number Format Info */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <h4 className="font-semibold text-sm text-primary mb-3">Order Number Format</h4>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="font-mono text-sm mb-3">
            <span className="text-blue-600 font-bold">ORD</span>
            <span className="text-gray-400">-</span>
            <span className="text-green-600 font-bold">2024</span>
            <span className="text-gray-400">-</span>
            <span className="text-purple-600 font-bold">0001</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              <strong>Prefix:</strong> <span className="text-blue-600">ORD</span> (constant)
            </li>
            <li>
              <strong>Year:</strong> <span className="text-green-600">2024</span> (resets annually)
            </li>
            <li>
              <strong>Sequential:</strong> <span className="text-purple-600">0001-9999</span> (auto-incremented)
            </li>
          </ul>
        </div>
      </div>

      {/* Example Unit Labels */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <h4 className="font-semibold text-sm text-primary mb-3">Unit Label Examples</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { unit: 1, total: 1, label: '1 of 1' },
            { unit: 1, total: 4, label: '1 of 4' },
            { unit: 2, total: 4, label: '2 of 4' },
            { unit: 4, total: 4, label: '4 of 4' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-1">Unit Label</p>
              <p className="font-mono font-bold text-sm text-primary">{item.label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.unit === 1 && item.total === 1 && 'Single'}
                {item.unit === 1 && item.total > 1 && 'First'}
                {item.unit === item.total && item.total > 1 && 'Last'}
                {item.unit > 1 && item.unit < item.total && 'Middle'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
          <p className="text-sm text-blue-900 font-medium mb-2">💡 How It Works</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Each order automatically gets a unique sequential number</li>
            <li>✓ Order date is captured with timestamp</li>
            <li>✓ Unit labels (e.g., "1 of 4") track position in multi-unit orders</li>
            <li>✓ Order number resets each calendar year</li>
            <li>✓ All information printed on template for audit trail</li>
            <li>✓ Barcode-friendly format available (no special characters)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderNumberingInfo;
