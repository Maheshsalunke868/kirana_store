import React, { useState, useMemo } from 'react';
import { Plus, Minus, ShoppingBag, Star, Sparkles, Edit3, Scale } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateUnitPrice, getUnitPresets } from '../utils/unitUtils';

export const ProductCard = ({ product }) => {
  const { addToCart } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [selectedUnit, setSelectedUnit] = useState(product.unit || '1 kg');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [qty, setQty] = useState(1);

  // Available presets for product unit
  const presets = useMemo(() => getUnitPresets(product.unit), [product.unit]);

  // Dynamically calculated unit price based on selected unit
  const calculatedPrice = useMemo(() => {
    return calculateUnitPrice(product.price, product.unit, selectedUnit);
  }, [product.price, product.unit, selectedUnit]);

  // Safe availability check (handles numeric quantity, missing field, string, etc.)
  const isAvailable = useMemo(() => {
    if (product.quantity === undefined || product.quantity === null) return true;
    const qtyNum = Number(product.quantity);
    return !isNaN(qtyNum) && qtyNum > 0;
  }, [product.quantity]);

  const maxStock = useMemo(() => {
    if (product.quantity === undefined || product.quantity === null) return 99;
    const qtyNum = Number(product.quantity);
    return isNaN(qtyNum) ? 99 : Math.max(1, qtyNum);
  }, [product.quantity]);

  const handleAdd = () => {
    addToCart(product, qty, selectedUnit, calculatedPrice);
    addToast(`Added ${qty} × ${product.name} (${selectedUnit}) to cart!`, 'success');
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden relative h-full">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-amber-500 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
          {discountPercent}% OFF
        </span>
      )}

      {/* Featured Badge */}
      {product.featured && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-700/90 backdrop-blur-md text-emerald-100 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Featured</span>
        </span>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 text-center">
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 gap-1">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[80px] sm:max-w-none">
              Base: {product.unit}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[10px] hidden sm:inline">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* CUSTOMER WEIGHT & QUANTITY SELECTOR / EDITABLE UNIT INPUT */}
        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700 flex items-center space-x-1 truncate">
              <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Weight/Qty:</span>
            </span>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-[9px] sm:text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-0.5 shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>{isCustomMode ? 'Presets' : 'Custom'}</span>
            </button>
          </div>

          {isCustomMode ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                placeholder="e.g. 500 gm, 250 g"
                className="w-full text-[11px] sm:text-xs font-bold px-2 py-1 bg-white border border-emerald-400 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto scrollbar-none">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedUnit(preset)}
                  className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md transition-all ${
                    selectedUnit === preset
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          <div className="text-[9px] sm:text-[10px] font-bold text-emerald-700 truncate">
            For: <span className="underline font-black text-slate-900">{selectedUnit}</span>
          </div>
        </div>

        {/* Price & Cart Actions - Optimized for All Mobile Sizes */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Price Header */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-base sm:text-lg font-black text-slate-900">₹{calculatedPrice}</span>
              {selectedUnit !== product.unit && product.price > 0 && (
                <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {selectedUnit}
            </span>
          </div>

          {/* Quantity Controls & Add to Cart Button */}
          {isAvailable ? (
            <div className="flex items-center gap-1.5">
              {/* Stepper controls */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shrink-0">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 sm:w-6 text-center text-xs font-extrabold text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Main Prominent Add to Cart Button */}
              <button
                onClick={handleAdd}
                className="flex-1 py-1.5 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center space-x-1 font-bold text-xs"
                title="Add to Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs font-black tracking-tight">{t('addToCart')}</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-1.5 px-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed text-center border border-slate-200"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

