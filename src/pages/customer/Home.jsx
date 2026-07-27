import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
  Star,
  Store,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ReviewModal } from '../../components/ReviewModal';
import { ProductCard } from '../../components/ProductCard';

export const Home = ({ setCurrentTab }) => {
  const { products, categories, reviews, setSelectedCategory } = useStore();
  const { t } = useLanguage();

  const [isGeneralReviewOpen, setIsGeneralReviewOpen] = useState(false);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 10);
  const featuredReviews = reviews.slice(0, 3);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setCurrentTab('products');
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider inline-block">
            {t('customerStore')}
          </span>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Fresh Groceries Delivered to Your Doorstep
          </h1>

          <p className="text-xs sm:text-base text-slate-300">
            Order daily essential grains, fresh dairy, spices, and snacks online from your trusted neighborhood Kirana store.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('products')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setIsGeneralReviewOpen(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{t('writeReview')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">Fast Local Delivery</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Express delivery in 30 mins</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">100% Fresh & Authentic</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Quality checked packaged goods</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">Flexible Payment Options</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">UPI Digital & Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Dynamic Shop Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{t('categories')}</h2>
            <p className="text-xs text-slate-500">Browse grocery inventory by shop categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all text-left space-y-2 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-amber-600">{cat.name}</h4>
                <p className="text-[10px] text-slate-500">Explore items</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Kirana Items Grid - 2 columns on mobile */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Popular Kirana Items</h2>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Customer Reviews Showcase */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('customerReviews')}</span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">What Our Buyers Say</h2>
          </div>
          <button
            onClick={() => setIsGeneralReviewOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
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
