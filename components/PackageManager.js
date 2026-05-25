'use client';

import { useState, useEffect } from 'react';

function PackageManager() {
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    basePrice: 29.99,
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error('Error loading packages:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editing ? 'PATCH' : 'POST';
      const url = editing ? `/api/packages/${editing.id}` : '/api/packages';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        loadPackages();
        resetForm();
      }
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const handleEdit = (pkg) => {
    setEditing(pkg);
    setFormData({
      name: pkg.name,
      quantity: pkg.quantity,
      basePrice: pkg.base_price,
      description: pkg.description,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;

    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadPackages();
      }
    } catch (err) {
      console.error('Error deleting package:', err);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      quantity: 1,
      basePrice: 29.99,
      description: '',
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary font-display">Package Management</h2>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6">
          {editing ? 'Edit Package' : 'Add New Package'}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-primary mb-2">Package Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Single Print, Duo Pack"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-primary mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-primary mb-2">Base Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-primary mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Perfect for gifts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
            />
          </div>

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90"
            >
              {editing ? 'Update' : 'Create'} Package
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Packages List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading packages...</p>
        </div>
      ) : packages.length > 0 ? (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-primary">{pkg.name}</h4>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">${pkg.base_price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{pkg.quantity} photo{pkg.quantity !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-light rounded-lg border border-gray-200">
          <p className="text-gray-600">No packages created yet</p>
        </div>
      )}
    </div>
  );
}

export default PackageManager;
