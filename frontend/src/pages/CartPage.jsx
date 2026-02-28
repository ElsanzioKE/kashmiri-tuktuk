import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = cartTotal > 20000 ? 0 : 1500;
  const tax = Math.round(cartTotal * 0.16);
  const grandTotal = cartTotal + shippingCost + tax;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some spare parts to your cart to get started.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-forest-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={item.images?.[0]?.url || `https://placehold.co/80x80/14532d/white?text=${item.brand}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/80x80/14532d/white?text=Part'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-forest-700 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg leading-none"
                    >−</button>
                    <span className="px-3 py-1 border-x border-gray-300 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors text-lg leading-none"
                    >+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-forest-800">KES {(item.price * item.quantity).toLocaleString()}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="flex items-center gap-2 text-forest-700 hover:text-forest-900 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>KES {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE' : `KES ${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (16%)</span>
                <span>KES {tax.toLocaleString()}</span>
              </div>

              {cartTotal <= 2000 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  Add KES {(20000 - cartTotal).toLocaleString()} more for free shipping!
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>KES {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full mt-6 text-center">
              Proceed to Checkout →
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
