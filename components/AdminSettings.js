'use client';

import { useState, useEffect } from 'react';

function AdminSettings() {
  const [settings, setSettings] = useState({
    enableStripePayment: true,
    enableShopifyPayment: true,
    enableLocalPickup: false,
    enablePhoneOrders: false,
    localPickupLocation: '123 Main St, Your City, CA 90000',
    localPickupHours: 'Monday-Friday 9AM-6PM, Saturday 10AM-4PM',
    autoConfirmLocalPickup: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, ...data });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('✓ Settings saved successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving settings');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary font-display mb-6">System Settings</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.startsWith('✓')
              ? 'bg-green-50 text-green-800 border border-green-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="enableStripePayment"
                checked={settings.enableStripePayment}
                onChange={handleChange}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-gray-700">Enable Stripe Payment (Credit Card)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="enableShopifyPayment"
                checked={settings.enableShopifyPayment}
                onChange={handleChange}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-gray-700">Enable Shopify Payment (Apple Pay, Google Pay)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="enableLocalPickup"
                checked={settings.enableLocalPickup}
                onChange={handleChange}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-gray-700">Enable Local Pickup (Pay at Pickup)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="enablePhoneOrders"
                checked={settings.enablePhoneOrders}
                onChange={handleChange}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-gray-700">Allow Phone Order Requests</span>
            </label>
          </div>
        </div>

        {/* Local Pickup Settings */}
        {settings.enableLocalPickup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Local Pickup Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Pickup Location Address
                </label>
                <input
                  type="text"
                  name="localPickupLocation"
                  value={settings.localPickupLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="123 Main St, Your City, CA 90000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  name="localPickupHours"
                  value={settings.localPickupHours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="Monday-Friday 9AM-6PM, Saturday 10AM-4PM"
                />
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoConfirmLocalPickup"
                  checked={settings.autoConfirmLocalPickup}
                  onChange={handleChange}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-gray-700">
                  Auto-confirm local pickup orders (no manual approval needed)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-semibold text-amber-900 mb-3">💡 Payment Method Notes</h4>
          <ul className="text-sm text-amber-900 space-y-2">
            <li>• <strong>Stripe:</strong> Customers pay online with credit card before pickup/shipping</li>
            <li>• <strong>Shopify:</strong> Customers use Apple Pay, Google Pay, or Shop Pay</li>
            <li>• <strong>Local Pickup:</strong> Customers pay in person when they pick up their prints</li>
            <li>• <strong>Phone Orders:</strong> Shows "Request a Quote" button for customers to contact you</li>
            <li>• Enable at least one payment method for customers to place orders</li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            saving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-opacity-90'
          }`}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;
