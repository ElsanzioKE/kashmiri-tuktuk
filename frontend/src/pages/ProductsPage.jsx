import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';

const BRANDS = ['Bajaj', 'TVS', 'Piaggio', 'Universal', 'Other'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratings.average', label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    setSearchParams(params);
    productAPI.getAll({ ...params, limit: 12 })
      .then(({ data }) => {
        setProducts(data.data);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', brand: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1 });
  };

  const hasActiveFilters = filters.brand || filters.category || filters.minPrice || filters.maxPrice || filters.keyword;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!filters.category ? 'bg-forest-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', cat._id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${filters.category === cat._id ? 'bg-forest-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter('brand', '')}
            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!filters.brand ? 'bg-forest-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            All Brands
          </button>
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => updateFilter('brand', brand)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${filters.brand === brand ? 'bg-forest-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range (₹)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-1 py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-forest-900">All Products</h1>
        <p className="text-gray-500 mt-1">Browse our complete TukTuk spare parts catalogue</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search parts, brands, SKU..."
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="input-field sm:w-52"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden btn-secondary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters {hasActiveFilters && <span className="bg-ember-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4 text-lg">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative bg-white w-72 max-w-full ml-auto h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${pagination.total || 0} products found`}
            </p>
          </div>

          {loading ? (
            <Spinner center />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFilters((prev) => ({ ...prev, page }))}
                      className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                        pagination.page === page
                          ? 'bg-forest-800 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
