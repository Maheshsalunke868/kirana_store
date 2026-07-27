import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';

// Customer Pages
import { Home } from './pages/customer/Home';
import { ProductsPage } from './pages/customer/ProductsPage';
import { MyOrders } from './pages/customer/MyOrders';
import { ProfilePage } from './pages/customer/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCustomers } from './pages/admin/AdminCustomers';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState(isAdmin ? 'dashboard' : 'home');

  // Keep tab consistent when switching admin/customer roles dynamically
  useEffect(() => {
    const adminTabs = [
      'dashboard',
      'admin-products',
      'admin-categories',
      'admin-orders',
      'admin-payments',
      'admin-reviews',
      'admin-customers'
    ];
    if (isAdmin && !adminTabs.includes(currentTab)) {
      setCurrentTab('dashboard');
    } else if (!isAdmin && adminTabs.includes(currentTab)) {
      setCurrentTab('home');
    }
  }, [isAdmin]);

  const renderContent = () => {
    switch (currentTab) {
      // Customer Routes
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <MyOrders />;
      case 'profile':
        return <ProfilePage />;

      // Admin Routes
      case 'dashboard':
        return <AdminDashboard setCurrentTab={setCurrentTab} />;
      case 'admin-products':
        return <AdminProducts />;
      case 'admin-categories':
        return <AdminCategories />;
      case 'admin-orders':
        return <AdminOrders />;
      case 'admin-payments':
        return <AdminPayments />;
      case 'admin-reviews':
        return <AdminReviews />;
      case 'admin-customers':
        return <AdminCustomers />;

      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-6">
        {renderContent()}
      </main>

      <Footer setCurrentTab={setCurrentTab} />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal onOrderPlaced={() => setCurrentTab('orders')} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AuthProvider>
          <StoreProvider>
            <MainApp />
          </StoreProvider>
        </AuthProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
