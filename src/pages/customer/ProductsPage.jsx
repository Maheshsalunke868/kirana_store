import React from 'react';
import { Search, Plus, Filter, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProductsPage = () => {
  const {
    filteredProducts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart
  } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t('customerStore')}</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('products')} Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search daily grocery essentials, packaged food, dairy items, and kitchen spices
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Dynamic Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
          <Store className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700">No Products Found</h3>
          <p className="text-xs text-slate-500">Try modifying your search keywords or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {p.unit}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{p.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-lg font-extrabold text-slate-900">₹{p.price}</span>
                  {p.originalPrice && <span className="text-xs text-slate-400 line-through ml-1.5">₹{p.originalPrice}</span>}
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
