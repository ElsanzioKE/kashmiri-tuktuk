import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const StarRating = ({ rating, interactive = false, onRate }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} text-xl ${star <= (hover || rating) ? 'text-amber-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      productAPI.getOne(id),
      reviewAPI.getByProduct(id),
    ])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data.data);
        setReviews(revRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await reviewAPI.create(id, reviewForm);
      setReviews((prev) => [data.data, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner center />;
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
    </div>
  );

  const images = product.images?.length > 0
    ? product.images
    : [{ url: `https://placehold.co/600x600/14532d/white?text=${encodeURIComponent(product.brand)}`, alt: product.name }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-forest-700">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-forest-700">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
            <img
              src={images[activeImage]?.url}
              alt={images[activeImage]?.alt || product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/600x600/14532d/white?text=No+Image'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-forest-700' : 'border-gray-200'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-forest-100 text-forest-800">{product.brand}</span>
            {product.category?.name && (
              <span className="badge bg-gray-100 text-gray-600">{product.category.name}</span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.ratings.average} />
              <span className="text-sm text-gray-600">{product.ratings.average} ({product.ratings.count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-forest-800">KES {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">KES {product.originalPrice.toLocaleString()}</span>
            )}
            {product.originalPrice && (
              <span className="badge bg-red-100 text-red-700">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
            {product.sku && <span className="text-xs text-gray-400 ml-2">SKU: {product.sku}</span>}
          </div>

          {/* Compatibility */}
          {product.compatibility?.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Compatible With:</h4>
              <div className="flex flex-wrap gap-1.5">
                {product.compatibility.map((model) => (
                  <span key={model} className="badge bg-amber-100 text-amber-800">{model}</span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-gray-100 transition-colors font-semibold"
                >−</button>
                <span className="px-4 py-2.5 border-x border-gray-300 min-w-[3rem] text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 hover:bg-gray-100 transition-colors font-semibold"
                >+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1">
                Add to Cart — KES {(product.price * quantity).toLocaleString()}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
              This product is currently out of stock. <Link to="/contact" className="underline">Contact us</Link> to check availability.
            </div>
          )}

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {product.specifications.map(({ key, value }, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="px-4 py-2.5 w-40 text-sm font-medium text-gray-600 border-r border-gray-200">{key}</div>
                    <div className="px-4 py-2.5 text-sm text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-10">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h2>

        {/* Review Form */}
        {user && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                <StarRating rating={reviewForm.rating} interactive onRate={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
              </div>
              <input
                type="text"
                placeholder="Review title (optional)"
                value={reviewForm.title}
                onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                className="input-field"
              />
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                required
                rows={4}
                className="input-field resize-none"
              />
              <button type="submit" disabled={submittingReview} className="btn-primary">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Review List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{review.user?.name}</span>
                      {review.isVerifiedPurchase && (
                        <span className="badge bg-green-100 text-green-700">✓ Verified Purchase</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      {review.title && <span className="text-sm font-medium text-gray-700">— {review.title}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
