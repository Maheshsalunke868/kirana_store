import React from 'react';
import {
  ShoppingBag,
  Users,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Calendar,
  Filter,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportStoreDataToExcel } from '../../utils/excelExport';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminDashboard = ({ setCurrentTab }) => {
  const {
    stats,
    orders,
    products,
    customers,
    updateOrderStatus,
    dashboardDayFilter,
    setDashboardDayFilter,
    dashboardStartDate,
    setDashboardStartDate,
    dashboardEndDate,
    setDashboardEndDate
  } = useStore();
  const { t } = useLanguage();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const lowStockProducts = products.filter((p) => p.quantity <= 30);

  const handleExportExcel = () => {
    exportStoreDataToExcel({ orders, products, customers, stats });
  };

  const resetFilters = () => {
    setDashboardDayFilter('all');
    setDashboardStartDate('');
    setDashboardEndDate('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('appTitle')}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Kirana Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shop sales, customer orders, inventory analytics & multi-language controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{t('exportExcel')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin-orders')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('orders')} ({stats.pendingOrdersCount})</span>
          </button>
        </div>
      </div>

      {/* Analytics Data Filter Bar (Daily Monday-wise & Date-wise) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900">Analytics Data Filters</h3>
          </div>
          {(dashboardDayFilter !== 'all' || dashboardStartDate || dashboardEndDate) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Day-wise (Monday-wise) Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600">{t('dailyFilter')}</label>
            <select
              value={dashboardDayFilter}
              onChange={(e) => setDashboardDayFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
            >
              <option value="all">{t('allDays')}</option>
              <option value="Monday">{t('monday')}</option>
              <option value="Tuesday">{t('tuesday')}</option>
              <option value="Wednesday">{t('wednesday')}</option>
              <option value="Thursday">{t('thursday')}</option>
              <option value="Friday">{t('friday')}</option>
              <option value="Saturday">{t('saturday')}</option>
              <option value="Sunday">{t('sunday')}</option>
            </select>
          </div>

          {/* Date-wise Filter: Start Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600">{t('startDate')}</label>
            <input
              type="date"
              value={dashboardStartDate}
              onChange={(e) => setDashboardStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>

          {/* Date-wise Filter: End Date */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600">{t('endDate')}</label>
            <input
              type="date"
              value={dashboardEndDate}
              onChange={(e) => setDashboardEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>

          {/* Active Filter Indicator */}
          <div className="flex items-end">
            <div className="w-full p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-bold flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">
                Showing: {dashboardDayFilter !== 'all' ? dashboardDayFilter : 'All Days'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('totalSales')}</span>
            <h3 className="text-2xl font-extrabold text-slate-900">₹{stats.totalSales.toLocaleString()}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>UPI & COD Combined</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-inner">
            <IndianRupee className="w-7 h-7" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('totalOrders')}</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalOrders}</h3>
            <p className="text-[11px] text-blue-600 font-semibold">{stats.completedOrdersCount} Delivered</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('totalCustomers')}</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalCustomers}</h3>
            <p className="text-[11px] text-slate-500">Active store buyers</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl shadow-inner">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Pending Action Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('pendingOrdersCount')}</span>
            <h3 className="text-2xl font-extrabold text-amber-600">{stats.pendingOrdersCount}</h3>
            <p className="text-[11px] text-amber-700 font-semibold">Requires acceptance</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Action Queue & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Orders Action Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Pending Action Queue</h2>
              <p className="text-xs text-slate-500">Quickly process incoming customer grocery orders</p>
            </div>
            <button
              onClick={() => setCurrentTab('admin-orders')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>{t('viewAll')} ({orders.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="font-bold text-slate-700 text-sm">All pending orders processed!</p>
              <p className="text-xs">No pending orders awaiting acceptance at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{ord.id}</span>
                      <span className="text-xs font-semibold text-slate-700">• {ord.customerName}</span>
                      <StatusBadge status={ord.orderStatus} />
                    </div>
                    <p className="text-xs text-slate-600">
                      {ord.items?.length} items • <strong className="text-emerald-700">₹{ord.totalPrice}</strong> ({ord.paymentMethod})
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-md">{ord.location}</p>
                  </div>

                  {/* Quick Status Control Buttons */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      {t('orderStatusAccepted')}
                    </button>
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Not Accepted')}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl transition-colors"
                    >
                      {t('orderStatusNotAccepted')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900">{t('lowStockAlert')}</h2>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg bg-white shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500">₹{p.price} / {p.unit}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg shrink-0">
                  {p.quantity} {t('itemsLeft')}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentTab('admin-products')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Update Inventory Stock
          </button>
        </div>
      </div>
    </div>
  );
};
