import React, { useState } from 'react';
import { Star, MessageSquare, Trash2, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminReviews = () => {
  const { reviews, deleteReview, toggleFeatureReview } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const handleDelete = (r) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      deleteReview(r.id);
      addToast('Review deleted successfully', 'info');
    }
  };

  const handleToggleFeature = (r) => {
    toggleFeatureReview(r.id);
    addToast(r.featured ? 'Removed from featured reviews' : 'Marked as featured review!', 'success');
  };

  const filtered = reviews.filter((r) => {
    const matchRating = filterRating === 'all' || r.rating.toString() === filterRating;
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchRating && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t('reviewsManagement')}</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('customerReviews')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer feedback, star ratings, and manage public featured reviews
          </p>
        </div>

        {/* Rating Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
          {['all', '5', '4', '3', '2', '1'].map((rate) => (
            <button
              key={rate}
              onClick={() => setFilterRating(rate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1 ${
                filterRating === rate ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{rate === 'all' ? 'All Stars' : `${rate} ★`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Customer, Product Name, or Feedback text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
        />
      </div>

      {/* Reviews Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700">No Reviews Found</h3>
          <p className="text-xs text-slate-500">No reviews match your current search and filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{rev.customerName}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">{rev.productName}</p>
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{rev.rating}.0 / 5.0</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleFeature(rev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                    rev.featured
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{rev.featured ? t('featuredReview') : t('featureReview')}</span>
                </button>

                <button
                  onClick={() => handleDelete(rev)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
