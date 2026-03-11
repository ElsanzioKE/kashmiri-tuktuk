import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI, orderAPI, uploadAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const BRANDS = ['Bajaj', 'TVS', 'Piaggio', 'Universal', 'Other'];
const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const TABS = ['Products', 'Orders', 'Categories'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', originalPrice: '', brand: 'Bajaj',
    category: '', stock: '', sku: '', isFeatured: false, shortDescription: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ordRes] = await Promise.all([
        productAPI.getAll({ limit: 50 }),
        categoryAPI.getAll(),
        orderAPI.getAll({ limit: 50 }),
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
      setOrders(ordRes.data.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, description: product.description, price: product.price,
        originalPrice: product.originalPrice || '', brand: product.brand,
        category: product.category?._id || '', stock: product.stock,
        sku: product.sku || '', isFeatured: product.isFeatured, shortDescription: product.shortDescription || '',
        images: product.images || [],
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', originalPrice: '', brand: 'Bajaj', category: '', stock: '', sku: '', isFeatured: false, shortDescription: '', images: [] });
    }
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
      if (productForm.originalPrice) payload.originalPrice = Number(productForm.originalPrice);
      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      setShowProductForm(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      loadData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log('Starting image upload:', {
      fileCount: files.length,
      files: files.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append('images', file));
      
      console.log('Sending upload request with FormData:', {
        files: validFiles.map(f => f.name),
        formDataEntries: Array.from(formData.entries())
      });
      
      const response = await uploadAPI.upload(formData);
      console.log('Upload response:', response);
      
      // Fix: Access images from data.data (backend returns { success: true, data: images })
      const newImages = response.data.data.map((img) => ({
        url: img.url,
        publicId: img.publicId,
        alt: productForm.name || 'Product image',
      }));
      
      console.log('Processed images:', newImages);
      
      setProductForm((f) => ({
        ...f,
        images: [...f.images, ...newImages],
      }));
      
      toast.success(`${newImages.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Upload error details:', {
        error: err,
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      if (err.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (err.response?.status === 500) {
        toast.error('Server error. Please check console for details.');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to upload image(s). Please check console for details.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setProductForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success('Order status updated');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const totalRevenue = orders.filter(o => o.orderStatus === 'delivered').reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const lowStock = products.filter(p => p.stock <= 5).length;

  if (loading) return <Spinner center />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-forest-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Total Orders', value: orders.length, color: 'bg-purple-50 text-purple-700' },
          { label: 'Pending Orders', value: pendingOrders, color: 'bg-amber-50 text-amber-700' },
          { label: 'Revenue (Delivered)', value: `KES ${totalRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-5`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm opacity-80 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {lowStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-red-700 text-sm"><strong>{lowStock} product(s)</strong> are running low on stock (≤5 units).</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab ? 'bg-forest-900 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'Products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-lg">Products ({products.length})</h2>
            <button onClick={() => openProductForm()} className="btn-primary">+ Add Product</button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Product', 'Brand', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">{product.name}</div>
                        {product.sku && <div className="text-xs text-gray-400">{product.sku}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                      <td className="px-4 py-3 font-semibold text-forest-800">KES {product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${product.stock === 0 ? 'bg-red-100 text-red-700' : product.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.isFeatured ? '⭐' : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openProductForm(product)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'Orders' && (
        <div>
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Orders ({orders.length})</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.user?.name}</div>
                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                      <td className="px-4 py-3 font-semibold">KES {order.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                          order.orderStatus === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'Categories' && (
        <div>
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Categories ({categories.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-display text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={productForm.name} onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))} required className="input-field" placeholder="e.g., Bajaj RE Carburetor Assembly" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <select value={productForm.brand} onChange={(e) => setProductForm((f) => ({ ...f, brand: e.target.value }))} className="input-field">
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))} required className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))} required min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (KES)</label>
                  <input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm((f) => ({ ...f, originalPrice: e.target.value }))} min="0" className="input-field" placeholder="For discount display" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" value={productForm.stock} onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))} required min="0" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input value={productForm.sku} onChange={(e) => setProductForm((f) => ({ ...f, sku: e.target.value }))} className="input-field" placeholder="e.g., BAJ-CARB-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input value={productForm.shortDescription} onChange={(e) => setProductForm((f) => ({ ...f, shortDescription: e.target.value }))} className="input-field" placeholder="One-line summary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} required rows={4} className="input-field resize-none" placeholder="Detailed product description..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={productForm.isFeatured} onChange={(e) => setProductForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Product</label>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  uploading 
                    ? 'border-forest-500 bg-forest-50' 
                    : 'border-gray-300 hover:border-forest-500'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="image-upload" 
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Uploading images...' : 'Click to upload images'}
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB each</p>
                    {uploading && (
                      <div className="mt-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forest-600 mx-auto"></div>
                      </div>
                    )}
                  </label>
                </div>
                {productForm.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {productForm.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img.url} alt={img.alt || productForm.name} className="w-full h-16 object-cover rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowProductForm(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
