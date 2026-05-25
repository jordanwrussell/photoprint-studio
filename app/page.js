'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageEditor from '@/components/ImageEditor';

export default function Home() {
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
      if (data.length > 0) {
        setSelectedPackage(data[0].id);
      }
    } catch (err) {
      console.error('Error loading packages:', err);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      edited: false,
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handlePhotoEdit = (updatedPhoto) => {
    setPhotos(
      photos.map((p) =>
        p.id === updatedPhoto.id
          ? { ...updatedPhoto, edited: true }
          : p
      )
    );
    setEditingPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || photos.length === 0 || !selectedPackage) {
      setMessage('Please enter email, select a package, and upload at least one photo');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('packageId', selectedPackage);
      formData.append('paymentMethod', paymentMethod);
      
      photos.forEach((photo, idx) => {
        formData.append(`photos`, photo.file);
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage('✓ Order created! Redirecting to payment...');

      // Redirect based on payment method
      setTimeout(() => {
        if (paymentMethod === 'shopify') {
          window.location.href = `/checkout-shopify/${data.orderId}`;
        } else {
          window.location.href = `/checkout/${data.orderId}`;
        }
      }, 1500);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const selectedPackageData = packages.find((p) => p.id === selectedPackage);
  const totalPrice = selectedPackageData ? selectedPackageData.base_price : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-black">
      {/* Navigation */}
      <nav className="border-b border-white border-opacity-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-display">
            <span className="text-accent">Photo</span>Print
          </h1>
          <div className="text-white text-sm opacity-60">Premium Photo Prints</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
              Transform Your <span className="text-accent">Memories</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Upload, edit, and customize your photos. Choose your perfect package and we'll create stunning prints.
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl space-y-8">
            {message && (
              <div className={`p-4 rounded-lg ${
                message.startsWith('✓') 
                  ? 'bg-green-50 text-green-800 border border-green-300' 
                  : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
              />
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-sm font-medium text-primary mb-4">
                Upload & Edit Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-accent hover:bg-accent hover:bg-opacity-5 transition-all cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-lg font-medium text-primary">Click to upload or drag</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 50MB each</p>
                </label>
              </div>
            </div>

            {/* Photo Preview Grid with Edit Option */}
            {photos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primary mb-4">
                  Selected Photos ({photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {photo.edited && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Edited
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditingPhoto(photo)}
                          className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-blue-600"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package Selection */}
            {packages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-primary mb-4">
                  Select Package
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-accent bg-accent bg-opacity-10'
                          : 'border-gray-300 hover:border-accent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-primary">{pkg.name}</h4>
                          <p className="text-xs text-gray-600">{pkg.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-accent">${pkg.base_price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{pkg.quantity} photos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="radio"
                          name="package"
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-600">Select this package</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-primary mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'stripe'
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-gray-300 hover:border-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary">Stripe</p>
                    <p className="text-xs text-gray-600">Credit card, secure checkout</p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('shopify')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'shopify'
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-gray-300 hover:border-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'shopify'}
                    onChange={() => setPaymentMethod('shopify')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary">Shopify Pay</p>
                    <p className="text-xs text-gray-600">Apple Pay, Google Pay, and more</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {selectedPackageData && (
              <div className="bg-light rounded-lg p-4 border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{selectedPackageData.name}</span>
                  <span className="font-bold text-accent">${selectedPackageData.base_price.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {photos.length} of {selectedPackageData.quantity} photos selected
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-accent">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || photos.length === 0 || !selectedPackage}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                uploading || photos.length === 0 || !selectedPackage
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent to-orange-600 text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : (
                `Continue to ${paymentMethod === 'stripe' ? 'Stripe' : 'Shopify'} Checkout`
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              By uploading, you agree to our terms and conditions
            </p>
          </form>
        </div>
      </div>

      {/* Image Editor Modal */}
      {editingPhoto && (
        <ImageEditor
          photo={editingPhoto}
          onSave={handlePhotoEdit}
          onCancel={() => setEditingPhoto(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white border-opacity-10 mt-24">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PhotoPrint Studio. Premium custom prints.</p>
        </div>
      </footer>
    </div>
  );
}
