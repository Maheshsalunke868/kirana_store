import React, { useState } from 'react';
import {
  Store,
  ShoppingBag,
  User,
  LogOut,
  Globe,
  Layers,
  Star,
  Tag,
  CreditCard,
  Users,
  Menu,
  X,
  Home,
  Package,
  Sparkles,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, isAdmin, logout, setIsAuthOpen, setAuthMode } = useAuth();
  const { cartTotalItems, setIsCartOpen } = useStore();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAdminLogin = () => {
    setAuthMode('admin-login');
    setIsAuthOpen(true);
  };

  const openCustomerLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const openCustomerSignup = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  return (
    <>
      {/* Main Unified Header Navbar - z-[100] Sticky Top Bar */}
      <header className="sticky top-0 z-[100] glass-nav shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => setCurrentTab(isAdmin ? 'dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight block leading-tight group-hover:text-emerald-700 transition-colors">
                {isAdmin ? 'Kirana Admin' : 'Kirana Express'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                <span>{isAdmin ? t('adminPanel') : t('customerStore')}</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'dashboard'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('dashboard')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-products')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-products'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('products')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-categories')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-categories'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{t('categories')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-orders')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-orders'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{t('orders')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-payments')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-payments'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{t('payments')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-reviews')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-reviews'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>{t('reviews')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('admin-customers')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'admin-customers'
                      ? 'bg-white text-emerald-700 shadow-xs scale-100 border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('customers')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'home'
                      ? 'bg-amber-500 text-slate-950 shadow-xs scale-100 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setCurrentTab('products')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'products'
                      ? 'bg-amber-500 text-slate-950 shadow-xs scale-100 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('products')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'orders'
                      ? 'bg-amber-500 text-slate-950 shadow-xs scale-100 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{t('orders')}</span>
                </button>

                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                    currentTab === 'profile'
                      ? 'bg-amber-500 text-slate-950 shadow-xs scale-100 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('profile')}</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Language Picker + Cart + Profile/Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Dropdown */}
            <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-[11px]"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* Shopping Cart Drawer Trigger (Customer Only) */}
            {!isAdmin && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-slate-700 hover:bg-slate-100 active:scale-95 rounded-2xl transition-all duration-200 group"
                title={t('cart')}
              >
                <ShoppingBag className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-badge-pop">
                    {cartTotalItems}
                  </span>
                )}
              </button>
            )}

            {/* Admin Portal Button (when not admin) */}
            {!isAdmin && (
              <button
                onClick={openAdminLogin}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                title="Admin Portal Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}

            {/* User Auth Profile / Login Button */}
            {user ? (
              <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 px-2 truncate max-w-[90px] sm:max-w-[120px]">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={openCustomerLogin}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center space-x-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('login')}</span>
                </button>
                <button
                  onClick={openCustomerSignup}
                  className="hidden sm:flex px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl active:scale-95 transition-all"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6 text-slate-800" />
            </button>
          </div>
        </div>
      </header>

      {/* FULL MOBILE DRAWER OVERLAY - Front Layer z-[110] & z-[120] */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Dark Blurred Backdrop Overlay */}
          <div
            className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-md animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Drawer Content from Top */}
          <div className="fixed top-0 inset-x-0 z-[120] bg-slate-900 text-white rounded-b-3xl shadow-2xl border-b border-slate-800 p-5 animate-spring-down max-h-[85vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight text-white">
                    {isAdmin ? 'Kirana Admin Interface' : 'Kirana Express'}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {isAdmin ? 'Logged in as Admin' : 'Customer Store'}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Admin Portal Button inside Mobile Drawer */}
            <div className="my-4 p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Security Access:</span>
              </span>
              <button
                onClick={() => {
                  openAdminLogin();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs"
              >
                Admin Portal Login
              </button>
            </div>

            {/* Nav Menu Links */}
            <div className="space-y-1.5">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{t('dashboard')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-products'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-products' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>{t('products')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-categories'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-categories' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>{t('categories')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-orders'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-orders' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>{t('orders')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-payments'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-payments' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>{t('payments')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-reviews'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-reviews' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Star className="w-4 h-4 text-emerald-400" />
                    <span>{t('reviews')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('admin-customers'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'admin-customers' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{t('customers')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'home' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'products' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>{t('products')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('orders'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'orders' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>{t('orders')}</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('profile'); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 font-bold text-xs rounded-xl flex items-center space-x-3 transition-colors ${
                      currentTab === 'profile' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>{t('profile')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING MOBILE BOTTOM NAVIGATION BAR - z-[90] */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-[90] glass-bottom-bar rounded-2xl p-1 flex items-center justify-around animate-slide-up-float shadow-2xl">
        {!isAdmin ? (
          <>
            {/* Customer Tab: Home */}
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'home'
                  ? 'text-amber-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Home</span>
            </button>

            {/* Customer Tab: Products */}
            <button
              onClick={() => setCurrentTab('products')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'products'
                  ? 'text-amber-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('products')}</span>
            </button>

            {/* Customer Tab: Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 relative transition-all duration-200 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 mb-0.5 text-emerald-400" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-badge-pop shadow-sm">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight text-emerald-400 font-bold">{t('cart')}</span>
            </button>

            {/* Customer Tab: Orders */}
            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'orders'
                  ? 'text-amber-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('orders')}</span>
            </button>

            {/* Customer Tab: Profile */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'profile'
                  ? 'text-amber-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('profile')}</span>
            </button>
          </>
        ) : (
          <>
            {/* Admin Tab: Dashboard */}
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'dashboard'
                  ? 'text-emerald-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('dashboard')}</span>
            </button>

            {/* Admin Tab: Products */}
            <button
              onClick={() => setCurrentTab('admin-products')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'admin-products'
                  ? 'text-emerald-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('products')}</span>
            </button>

            {/* Admin Tab: Orders */}
            <button
              onClick={() => setCurrentTab('admin-orders')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'admin-orders'
                  ? 'text-emerald-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('orders')}</span>
            </button>

            {/* Admin Tab: Reviews */}
            <button
              onClick={() => setCurrentTab('admin-reviews')}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                currentTab === 'admin-reviews'
                  ? 'text-emerald-400 font-black bg-slate-800/90 shadow-xs scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{t('reviews')}</span>
            </button>

            {/* Admin Tab: More Menu Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200"
            >
              <Menu className="w-5 h-5 mb-0.5 text-amber-400" />
              <span className="text-[10px] tracking-tight text-amber-400 font-bold">More</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
