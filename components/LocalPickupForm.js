'use client';

import { useState, useEffect } from 'react';

export default function LocalPickupForm({ orderId, packageData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pickupDate: '',
    specialInstructions: '',
    optInUpdates: true,
    optInEmail: true,
    optInText: true,
    agreePrivacy: false,
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Set minimum pickup date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, pickupDate: minDate }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10,}/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.pickupDate) newErrors.pickupDate = 'Please select a pickup date';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Please agree to privacy policy';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Please agree to terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitted(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/local-pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending_pickup',
        }),
      });

      if (response.ok) {
        onSubmit(formData);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to submit order' });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-8 font-display">Local Pickup Order</h2>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Summary */}
        <div className="bg-light rounded-lg p-6 border border-gray-300">
          <h3 className="font-bold text-primary mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-semibold">{packageData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-bold text-accent">${packageData?.base_price?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantity:</span>
              <span>{packageData?.quantity} photos</span>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 555-1234"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Details */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">Pickup Details</h3>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Preferred Pickup Date *
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
                errors.pickupDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pickupDate && (
              <p className="text-red-600 text-xs mt-1">{errors.pickupDate}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">Orders can be picked up starting tomorrow</p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-primary mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="e.g., Preferred pickup time, any special requests..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
            />
          </div>
        </div>

        {/* Communication Preferences */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">Communication Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="optInUpdates"
                checked={formData.optInUpdates}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <span className="text-sm text-gray-700">
                I want to receive order updates and notifications
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="optInEmail"
                checked={formData.optInEmail}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <span className="text-sm text-gray-700">
                Send updates to my email ({formData.email || 'your email'})
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="optInText"
                checked={formData.optInText}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <span className="text-sm text-gray-700">
                Send text message updates to {formData.phone || 'your phone'}
                <span className="text-xs text-gray-600 block mt-1">Message and data rates may apply</span>
              </span>
            </label>
          </div>
        </div>

        {/* Privacy & Terms */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Privacy & Terms</h3>

          {/* California Privacy Notice */}
          <div className="mb-6 pb-6 border-b border-gray-300">
            <h4 className="font-semibold text-sm text-primary mb-2">California Privacy Notice</h4>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              We collect and use your personal information (name, email, phone) to process your order and provide customer service. 
              Your information will not be sold or shared with third parties without your consent, except as required by law. 
              You have the right to access, correct, or delete your personal information. 
              For more details, see our full <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
            </p>
          </div>

          {/* Privacy Agreement */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                className={`mt-1 w-4 h-4 accent-accent flex-shrink-0 ${
                  errors.agreePrivacy ? 'ring-2 ring-red-500' : ''
                }`}
              />
              <span className="text-sm text-gray-700">
                I agree to the privacy notice and understand how my personal information will be used *
              </span>
            </label>
            {errors.agreePrivacy && (
              <p className="text-red-600 text-xs mt-1 ml-7">{errors.agreePrivacy}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={`mt-1 w-4 h-4 accent-accent flex-shrink-0 ${
                  errors.agreeTerms ? 'ring-2 ring-red-500' : ''
                }`}
              />
              <span className="text-sm text-gray-700">
                I agree to the <a href="/terms" className="text-accent hover:underline">Terms & Conditions</a> and understand the order and pickup policies *
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-600 text-xs mt-1 ml-7">{errors.agreeTerms}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-light text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitted}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              submitted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent to-orange-600 text-white hover:shadow-lg'
            }`}
          >
            {submitted ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              'Complete Local Pickup Order'
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600">
          * Required fields. Your payment will be collected at pickup.
        </p>
      </form>
    </div>
  );
}
