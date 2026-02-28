import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const BRAND_COLORS = {
  Bajaj: 'bg-blue-100 text-blue-800',
  TVS: 'bg-red-100 text-red-800',
  Piaggio: 'bg-purple-100 text-purple-800',
  Universal: 'bg-gray-100 text-gray-700',
  Other: 'bg-yellow-100 text-yellow-800',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const imgUrl = product.images?.[0]?.url || `https://placehold.co/400x300/14532d/white?text=${encodeURIComponent(product.brand)}`;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="card group hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = `https://placehold.co/400x300/14532d/white?text=No+Image`; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-ember-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <span className={`badge ${BRAND_COLORS[product.brand] || 'bg-gray-100 text-gray-700'} text-xs`}>
            {product.brand}
          </span>
          {product.ratings?.count > 0 && (
            <div className="flex items-center text-xs text-amber-500">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-0.5">{product.ratings.average} ({product.ratings.count})</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mt-1 line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-forest-800">KES {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">KES {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <span className={`text-xs ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-3 w-full py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-forest-800 hover:bg-forest-900 text-white active:scale-95'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
