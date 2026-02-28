import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner center />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-forest-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place orders, they'll appear here.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-forest-300 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                  <span className="text-gray-400 text-sm ml-2">· {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`badge ${STATUS_COLORS[order.orderStatus]} self-start sm:self-auto`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items.length} item(s)</span>
                <span className="font-bold text-forest-800">KES {order.totalPrice.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(({ data }) => setOrder(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner center />;
  if (!order) return <div className="text-center py-20"><h2 className="text-xl text-gray-700">Order not found</h2></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/orders" className="text-gray-500 hover:text-gray-700">← My Orders</Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`badge ${STATUS_COLORS[order.orderStatus]} text-sm px-4 py-1.5`}>
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      {/* Progress Tracker */}
      {order.orderStatus !== 'cancelled' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-5">Order Progress</h2>
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-forest-600 transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                    i <= currentStep ? 'bg-forest-700 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 capitalize hidden sm:block">{step}</span>
                </div>
              ))}
            </div>
          </div>
          {order.trackingNumber && (
            <p className="mt-4 text-sm text-gray-600">Tracking: <span className="font-semibold">{order.trackingNumber}</span></p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image || 'https://placehold.co/48x48/14532d/white?text=P'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">KES {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>KES {order.subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `KES ${order.shippingCost}`}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>KES {order.tax?.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2"><span>Total</span><span>KES {order.totalPrice.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Payment</h2>
            <div className="text-sm">
              <p className="text-gray-600">Method: <span className="font-medium text-gray-900 capitalize">{order.paymentMethod?.replace('_', ' ')}</span></p>
              <p className="text-gray-600 mt-1">Status: <span className={`font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></p>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Status History</h2>
            <div className="space-y-2">
              {order.statusHistory?.map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  <div>
                    <span className="font-medium text-gray-800 capitalize">{entry.status}</span>
                    {entry.note && <span className="text-gray-500"> — {entry.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
