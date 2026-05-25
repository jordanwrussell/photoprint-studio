'use client';

import { useState, useEffect } from 'react';

function AuditReportPanel() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set default date range (last 7 days)
  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(weekAgo.toISOString().split('T')[0]);
  }, []);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await fetch('/api/admin/audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to generate report');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const csv = generateCSV(report);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    let csv = 'Audit Report\n';
    csv += `Date Range,${data.dateRange.start},to,${data.dateRange.end}\n\n`;
    csv += `Total Orders,${data.totalOrders}\n`;
    csv += `Total Photos,${data.totalPhotos}\n\n`;
    csv += 'Order Number,Date,Status,Payment Method,Amount,Photos,Unit Count\n';

    data.orders.forEach((order) => {
      const units = order.photoCount ? `1-${order.photoCount}` : 'N/A';
      csv += `${order.order_number},${order.formattedDate},${order.status},${order.payment_method},${order.amount},${order.photoCount},${units}\n`;
    });

    return csv;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary font-display">Audit Report Generator</h2>

      {/* Date Range Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Select Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={generateReport}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-opacity-90'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Results */}
      {report && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-primary">{report.totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Total Photos</p>
              <p className="text-4xl font-bold text-accent">{report.totalPhotos}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Avg Photos/Order</p>
              <p className="text-4xl font-bold text-primary">
                {report.totalOrders > 0 ? (report.totalPhotos / report.totalOrders).toFixed(1) : '0'}
              </p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-primary mb-4">Orders by Status</h4>
            <div className="space-y-2">
              {Object.entries(report.ordersByStatus).map(([status, orders]) => (
                <div key={status} className="flex justify-between items-center pb-2 border-b">
                  <span className="capitalize font-medium">{status}</span>
                  <span className="font-bold text-accent">{orders.length}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-light border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Order #</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Payment</th>
                    <th className="px-4 py-3 text-right font-semibold text-primary">Amount</th>
                    <th className="px-4 py-3 text-center font-semibold text-primary">Photos</th>
                    <th className="px-4 py-3 text-center font-semibold text-primary">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-light">
                      <td className="px-4 py-3 font-mono font-bold text-primary">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.formattedDate}</td>
                      <td className="px-4 py-3 capitalize">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-700">{order.payment_method}</td>
                      <td className="px-4 py-3 text-right font-bold text-accent">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{order.photoCount}</td>
                      <td className="px-4 py-3 text-center text-xs font-mono">
                        1-{order.photoCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <button
              onClick={downloadReport}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              📥 Download as CSV
            </button>
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-3">📊 Audit Report Features</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✅ Order number tracking (ORD-YYYYMMDD-NNNNN)</li>
          <li>✅ Date-based reporting</li>
          <li>✅ Unit counting for multi-photo orders</li>
          <li>✅ Status breakdown by order</li>
          <li>✅ CSV export for spreadsheets</li>
          <li>✅ Payment method tracking</li>
        </ul>
      </div>
    </div>
  );
}

export default AuditReportPanel;
