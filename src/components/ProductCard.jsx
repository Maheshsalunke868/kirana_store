import React, { useState, useMemo } from 'react';
import { Plus, Minus, ShoppingBag, Star, Sparkles, Edit3, Scale } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { calculateUnitPrice, getUnitPresets } from '../utils/unitUtils';

export const ProductCard = ({ product }) => {
  const { addToCart } = useStore();
  const { addToast } = useToast();

  const [selectedUnit, setSelectedUnit] = useState(product.unit || '1 kg');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [qty, setQty] = useState(1);

  // Available presets for product unit
  const presets = useMemo(() => getUnitPresets(product.unit), [product.unit]);

  // Dynamically calculated unit price based on selected unit
  const calculatedPrice = useMemo(() => {
    return calculateUnitPrice(product.price, product.unit, selectedUnit);
  }, [product.price, product.unit, selectedUnit]);

  const handleAdd = () => {
    addToCart(product, qty, selectedUnit, calculatedPrice);
    addToast(`Added ${qty} × ${product.name} (${selectedUnit}) to cart!`, 'success');
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
          {discountPercent}% OFF
        </span>
      )}

      {/* Featured Badge */}
      {product.featured && (
        <span className="absolute top-3 right-3 z-10 bg-emerald-700/90 backdrop-blur-md text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Featured</span>
        </span>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.quantity <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
              Base: {product.unit}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* CUSTOMER WEIGHT & QUANTITY SELECTOR / EDITABLE UNIT INPUT */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-700 flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Quantity / Weight:</span>
            </span>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isCustomMode ? 'Presets' : 'Type Custom'}</span>
            </button>
          </div>

          {isCustomMode ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                placeholder="e.g. 500 gm, 250 g, 1.5 kg"
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-emerald-400 rounded-lg text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedUnit(preset)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
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

          <div className="text-[10px] font-bold text-emerald-700">
            Selected: <span className="underline font-black text-slate-900">{selectedUnit}</span>
          </div>
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-slate-900">₹{calculatedPrice}</span>
              {selectedUnit !== product.unit && (
                <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">For {selectedUnit}</p>
          </div>

          {/* Quantity Controls & Add Button */}
          {product.quantity > 0 && (
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center space-x-1"
                title="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
