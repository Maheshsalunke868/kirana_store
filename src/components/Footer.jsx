import React from 'react';
import { Store, Phone, MapPin, Clock, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export const Footer = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center space-x-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30-Minute Express Delivery</h4>
              <p className="text-xs text-slate-400">Fresh grocery delivered straight to your door</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Authentic Quality</h4>
              <p className="text-xs text-slate-400">Directly sourced from verified local brands</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Store Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement at your local store</p>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg">Aapki Apni Kirana</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted neighborhood Kirana store powered by modern technology. Bringing fresh daily essentials, grains, dairy, and spices to your kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Quick Links</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('products')} className="hover:text-emerald-400 transition-colors">
                  All Grocery Products
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('orders')} className="hover:text-emerald-400 transition-colors">
                  My Orders & Status
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('profile')} className="hover:text-emerald-400 transition-colors">
                  Customer Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Top Categories</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Grains, Atta & Rice</li>
              <li>Fresh Dairy & Paneer</li>
              <li>Cold-Pressed Oils & Spices</li>
              <li>Snacks & Indian Sweets</li>
              <li>Teas & Refreshing Drinks</li>
            </ul>
          </div>

          {/* Contact & Store Timing */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Store Contact & Timing</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Shop #4, Main Market, Sector 15, NCR - 110001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 43210 / 011-2435678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Open Everyday: 7:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Aapki Apni Kirana Store. All rights reserved.</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Local Indian Retail Stores</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
