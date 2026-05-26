'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PackageManager from '@/components/PackageManager';

function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const photos = JSON.parse(order.photo_urls || '[]');

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

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <h3 className="font-bold text-primary">{order.id}</h3>
          <p className="text-sm text-gray-600">{order.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.pending}`}>
          {order.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <p>Created: {new Date(order.created_at).toLocaleDateString()}</p>
        <p>Amount: <span className="font-bold text-accent">${(order.amount || 29.99).toFixed(2)}</span></p>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {/* Photos Grid */}
          {photos.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-primary mb-3">Uploaded Photos</h4>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Controls */}
          <div className="mb-6">
            <h4 className="font-medium text-primary mb-3">Update Status</h4>
            <div className="grid grid-cols-2 gap-2">
              {['pending', 'paid', 'processing', 'shipped', 'delivered'].map((status) => (
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
              ))}
            </div>
          </div>

          {/* Template Preview */}
          {order.template_data && (
            <div className="mb-6">
              <h4 className="font-medium text-primary mb-3">Template Preview</h4>
              <div className="bg-light rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Template ready for printing</p>
                <button className="mt-3 px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-opacity-90">
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, shipped: 0 });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
      loadOrders();
    } else {
      alert('Invalid password');
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);

    // Calculate stats
    const stats = {
      total: data.length,
      paid: data.filter((o) => o.status === 'paid').length,
      pending: data.filter((o) => o.status === 'pending').length,
      shipped: data.filter((o) => o.status === 'shipped').length,
    };
    setStats(stats);
    setLoading(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
    loadOrders();
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-black flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold text-primary mb-2 font-display">Admin Panel</h1>
          <p className="text-gray-600 mb-8">PhotoPrint Studio Management</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:bg-opacity-90"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Secure admin access only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary font-display">
            <span className="text-accent">Admin</span> Dashboard
          </h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 text-gray-600 hover:text-primary"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-12 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-600 hover:text-primary'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-medium border-b-2 transition-all ${
              activeTab === 'packages'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-600 hover:text-primary'
            }`}
          >
            Packages
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && <> (
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-blue-200">
            <p className="text-blue-600 text-sm mb-2">Paid</p>
            <p className="text-3xl font-bold text-blue-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-yellow-200">
            <p className="text-yellow-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <p className="text-green-600 text-sm mb-2">Shipped</p>
            <p className="text-3xl font-bold text-green-600">{stats.shipped}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-accent'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No orders in this category</p>
          </div>
        )}
          </>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <PackageManager />
        )}
