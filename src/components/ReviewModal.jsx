import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const ReviewModal = ({ isOpen, onClose, product = null }) => {
  const { addReview } = useStore();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write feedback text', 'error');
      return;
    }

    addReview({
      productId: product ? product.id : 'store_general',
      productName: product ? product.name : 'General Kirana Store',
      customerName: user ? user.name : 'Customer',
      rating,
      comment: comment.trim()
    });

    addToast('Thank you for your feedback!', 'success');
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-base">{t('writeReview')}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {product && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs truncate">{product.name}</p>
                <p className="text-[10px] text-slate-500">{product.unit} • ₹{product.price}</p>
              </div>
            </div>
          )}

          {/* Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">{t('rating')}</label>
            <div className="flex items-center space-x-2 justify-center py-2 bg-amber-50 rounded-2xl border border-amber-100">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t('feedback')}</label>
            <textarea
              rows="3"
              placeholder="Share your experience with product quality, fresh items, or delivery..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{t('submitReview')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
