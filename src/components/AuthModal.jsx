import React, { useState } from 'react';
import { X, User, Phone, MapPin, ShieldCheck, Lock, ArrowRight, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    loginAdmin,
    loginCustomer,
    signupCustomer
  } = useAuth();

  const { addToast } = useToast();

  // Tab State: 'customer-login' | 'customer-signup' | 'admin-login'
  const [activeTab, setActiveTab] = useState(authMode === 'admin-login' ? 'admin-login' : authMode === 'signup' ? 'customer-signup' : 'customer-login');

  // Customer Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');

  // Admin Form Fields
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'admin-login') {
      const res = loginAdmin(adminUsername, adminPassword);
      if (res.success) {
        addToast(res.message, 'success');
        setIsAuthOpen(false);
      } else {
        addToast(res.message, 'error');
      }
      return;
    }

    if (activeTab === 'customer-signup') {
      if (!name) {
        addToast('Please enter your full name', 'error');
        return;
      }
      if (!phone || phone.length < 10) {
        addToast('Please enter a valid 10-digit mobile number', 'error');
        return;
      }
      if (!location) {
        addToast('Please enter your delivery address', 'error');
        return;
      }

      const res = signupCustomer(name, phone, email, location, customerPassword || '123456');
      if (res.success) {
        addToast(res.message, 'success');
        setIsAuthOpen(false);
      }
      return;
    }

    // Customer Login
    if (!phone) {
      addToast('Please enter your phone number or email', 'error');
      return;
    }

    const res = loginCustomer(phone, customerPassword);
    if (res.success) {
      addToast(res.message, 'success');
      setIsAuthOpen(false);
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative animate-spring-down">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            ✨ Kirana Portal Authentication
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {activeTab === 'admin-login'
              ? 'Admin Security Portal'
              : activeTab === 'customer-signup'
              ? 'Create Customer Account'
              : 'Welcome Back!'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {activeTab === 'admin-login'
              ? 'Manage inventory, orders, customers & sales ledger'
              : 'Access your daily groceries & order history'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('customer-login')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'customer-login'
                  ? 'bg-white text-emerald-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customer-signup')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'customer-signup'
                  ? 'bg-white text-emerald-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin-login')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'admin-login'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {/* ADMIN LOGIN FORM */}
          {activeTab === 'admin-login' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Username / Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter admin email or username"
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Passcode / Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER LOGIN FORM */}
          {activeTab === 'customer-login' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number / Email</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile or email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER SIGN UP FORM */}
          {activeTab === 'customer-signup' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows="2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Flat/House No., Street Name, City, Pincode"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all resize-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Set a password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 text-sm font-extrabold text-slate-950 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'admin-login'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/20'
            }`}
          >
            <span>
              {activeTab === 'admin-login'
                ? 'Login as Admin'
                : activeTab === 'customer-signup'
                ? 'Create Customer Account'
                : 'Log In'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
