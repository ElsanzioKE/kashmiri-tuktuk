import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';

const BRANDS = [
  { name: 'Bajaj', desc: 'RE Series & Compact', logo: '🛺', color: 'from-blue-600 to-blue-800' },
  { name: 'TVS', desc: 'King Series', logo: '⚙️', color: 'from-red-600 to-red-800' },
  { name: 'Piaggio', desc: 'Ape Series', logo: '🔧', color: 'from-purple-600 to-purple-800' },
];

const FEATURES = [
  { icon: '🛡️', title: 'Genuine Parts', desc: 'OEM-certified spare parts sourced directly from manufacturers.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Express shipping across Mombasa and East Africa.' },
  { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing with no hidden charges.' },
  { icon: '📞', title: '24/7 Support', desc: 'Expert technical support available around the clock.' },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll({ featured: true, limit: 4 })
      .then(({ data }) => setFeaturedProducts(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-forest-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-ember-500/20 border border-ember-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-ember-400 text-sm font-medium">Mombasa's Most Trusted TukTuk Parts Store</span>
            </div>
            <div className="mb-6">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-ember-400 mb-2">
                Kashmiri TukTuk
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-white/90">Spare Parts</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Quality Parts for Every{' '}
              <span className="text-ember-400">TukTuk</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Genuine spare parts for Bajaj, TVS, Piaggio and all major TukTuk brands. Serving Mombasa and East Africa with fast shipping and unbeatable prices.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-lg mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts, brands..."
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-ember-400"
              />
              <button type="submit" className="bg-ember-500 hover:bg-ember-600 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">Browse All Parts</Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-forest-900">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-forest-950/70 backdrop-blur-sm border-t border-forest-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[['5,000+', 'Parts Available'], ['15+ Years', 'Experience'], ['10,000+', 'Happy Customers'], ['2 Countries', 'Served']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-ember-400 font-bold text-xl">{val}</div>
                  <div className="text-gray-400 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-forest-900">Brands We Cover</h2>
            <p className="text-gray-500 mt-2">Specialized parts for all major TukTuk manufacturers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRANDS.map((brand) => (
              <Link
                key={brand.name}
                to={`/products?brand=${brand.name}`}
                className={`bg-gradient-to-br ${brand.color} text-white rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg`}
              >
                <div className="text-5xl mb-4">{brand.logo}</div>
                <h3 className="font-display text-2xl font-bold mb-1">{brand.name}</h3>
                <p className="text-white/70 text-sm">{brand.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium">
                  Browse Parts →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest-900">Featured Parts</h2>
              <p className="text-gray-500 mt-1">Hand-picked top-selling spare parts</p>
            </div>
            <Link to="/products" className="btn-outline hidden sm:inline-flex">View All →</Link>
          </div>

          {loading ? (
            <Spinner center />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🛺</div>
              <p>No featured products yet.</p>
              <Link to="/products" className="btn-primary mt-4 inline-block">Browse All Products</Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-outline">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold">Why Choose Us?</h2>
            <p className="text-gray-400 mt-2">Your trusted partner for TukTuk spare parts</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-forest-800/50 hover:bg-forest-800 transition-colors">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ember-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-ember-100 text-lg mb-8">
            Contact our parts experts. We can source any TukTuk spare part for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-ember-600 hover:bg-ember-50 font-bold px-8 py-3 rounded-lg transition-colors">
              Get in Touch
            </Link>
            <Link to="/products" className="border-2 border-white text-white hover:bg-ember-600 font-bold px-8 py-3 rounded-lg transition-colors">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
