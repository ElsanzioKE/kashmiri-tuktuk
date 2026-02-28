import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'mobile_money', label: 'Mobile Money (M-Pesa / Paytm)', icon: '📱' },
];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    country: user?.address?.country || 'Kenya',
    postalCode: user?.address?.postalCode || '',
  });

  const shippingCost = cartTotal > 20000 ? 0 : 1500;
  const tax = Math.round(cartTotal * 0.16);
  const grandTotal = cartTotal + shippingCost + tax;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }

    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        items: cartItems.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-4 inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-forest-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required className="input-field" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+254 XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select name="country" value={form.country} onChange={handleChange} className="input-field">
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input name="street" value={form.street} onChange={handleChange} required className="input-field" placeholder="House/Shop number, Street name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Region *</label>
                  <input name="state" value={form.state} onChange={handleChange} required className="input-field" placeholder="State or Region" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} className="input-field" placeholder="Optional" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ value, label, icon }) => (
                  <label key={value} className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === value ? 'border-forest-700 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(e) => setPaymentMethod(e.target.value)} className="text-forest-700" />
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <strong>Bank Details:</strong><br />
                  Account: Kashmiri TukTuk Spare Parts<br />
                  Bank: Kenyan Bank | A/C: XXXX XXXX<br />
                  SWIFT: KCBLKEN
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.name} × {item.quantity}</span>
                    <span className="text-gray-900 font-medium flex-shrink-0">KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : `KES ${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (VAT 16%)</span>
                  <span>KES {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>KES {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                ) : (
                  `Place Order — KES ${grandTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
