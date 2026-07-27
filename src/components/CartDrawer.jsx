import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ChevronRight, Minimize2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    cartTotalItems,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 499 ? 30 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  return (
    <div
      className="fixed inset-0 z-[120] overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-black tracking-tight">Your Shopping Cart</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {cartTotalItems} items
              </span>
            </div>

            {/* Header Minimize / Close Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all flex items-center space-x-1 border border-slate-700"
                title="Minimize Cart"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Minimize</span>
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our fresh Kirana daily essentials and add items to your cart!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800 transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-emerald-200 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {item.unit}
                      </span>
                      <span className="text-[10px] text-slate-400">@ ₹{item.price}</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">₹{item.price * item.quantity}</p>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout / Cancel Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Delivery threshold callout */}
              {cartSubtotal < 499 ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center justify-between">
                  <span>Add ₹{499 - cartSubtotal} more for <strong>FREE Delivery</strong></span>
                  <span className="font-bold">₹30 Fee</span>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center space-x-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>You qualified for FREE Express Delivery!</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-slate-800">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-slate-800">
                    {deliveryFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-700 text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons: Proceed to Checkout & Minimize / Continue Shopping */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-180" />
                  <span>Minimize Cart & Continue Shopping</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
