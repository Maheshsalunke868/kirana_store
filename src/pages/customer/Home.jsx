import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
  Star,
  Plus,
  Store,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ReviewModal } from '../../components/ReviewModal';

export const Home = ({ setCurrentTab }) => {
  const { products, categories, reviews, setSelectedCategory, addToCart } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [isGeneralReviewOpen, setIsGeneralReviewOpen] = useState(false);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const featuredReviews = reviews.slice(0, 3);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setCurrentTab('products');
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider">
            {t('customerStore')}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fresh Groceries Delivered to Your Doorstep
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Order daily essential grains, fresh dairy, spices, and snacks online from your trusted neighborhood Kirana store.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('products')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setIsGeneralReviewOpen(true)}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{t('writeReview')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">Fast Local Delivery</h4>
            <p className="text-[11px] text-slate-500">Express delivery in 30 mins</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">100% Fresh & Authentic</h4>
            <p className="text-[11px] text-slate-500">Quality checked packaged goods</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">Flexible Payment Options</h4>
            <p className="text-[11px] text-slate-500">UPI Digital & Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Dynamic Shop Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('categories')}</h2>
            <p className="text-xs text-slate-500">Browse grocery inventory by shop categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-amber-600">{cat.name}</h4>
                <p className="text-[10px] text-slate-500">Explore items</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Popular Kirana Items</h2>
            <p className="text-xs text-slate-500">Best selling everyday grocery items</p>
          </div>
          <button
            onClick={() => setCurrentTab('products')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
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
                  onClick={(e) => handleAddToCart(p, e)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Showcase */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('customerReviews')}</span>
            <h2 className="text-xl font-extrabold mt-0.5">What Our Buyers Say</h2>
          </div>
          <button
            onClick={() => setIsGeneralReviewOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
          >
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            <span>{t('writeReview')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">{rev.customerName}</span>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{rev.productName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* General Review Modal */}
      <ReviewModal
        isOpen={isGeneralReviewOpen}
        onClose={() => setIsGeneralReviewOpen(false)}
      />
    </div>
  );
};
