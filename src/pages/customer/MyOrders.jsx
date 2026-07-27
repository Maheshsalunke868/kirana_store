import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle2, PackageCheck, Truck, CheckCheck, XCircle, Star, IndianRupee } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ReviewModal } from '../../components/ReviewModal';

export const MyOrders = () => {
  const { orders } = useStore();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  // Filter user orders
  const myOrders = orders.filter((o) => o.phone === user?.phone || o.customerId === user?.id);

  return (
    <div className="space-y-6 pb-24 sm:pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t('trackOrder')}</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Grocery Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track live order status, view payment balance ledgers, and rate purchased items
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs font-bold text-amber-900">
          {myOrders.length} Orders Placed
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-slate-700 text-lg">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any grocery orders yet. Start adding items to your cart!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((ord) => {
            const total = ord.totalPrice || 0;
            const paid = ord.paidAmount !== undefined ? ord.paidAmount : (ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Collected' ? total : 0);
            const remaining = ord.remainingBalance !== undefined ? ord.remainingBalance : Math.max(0, total - paid);

            let paymentBadgeStatus = ord.paymentStatus;
            if (paymentBadgeStatus !== 'Paid' && paymentBadgeStatus !== 'Partial' && paymentBadgeStatus !== 'Pending') {
              paymentBadgeStatus = remaining <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';
            }

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-extrabold text-slate-900 text-lg">{ord.id}</span>
                    <StatusBadge status={ord.orderStatus} />
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(ord.createdAt).toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">{t('totalAmount')}</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹{total}</span>
                  </div>
                </div>

                {/* Tracking Timeline Stepper (Accepted / Not Accepted / Packed / Delivered) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">{t('trackOrder')}</h4>

                  {ord.orderStatus === 'Not Accepted' ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Order was Not Accepted by Kirana store. Please contact shop owner.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                      {/* Step 1: Accepted */}
                      <div className={`p-2 rounded-xl flex flex-col items-center space-y-1 font-bold ${
                        ['Accepted', 'Packed', 'Delivered'].includes(ord.orderStatus)
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('orderStatusAccepted')}</span>
                      </div>

                      {/* Step 2: Packed */}
                      <div className={`p-2 rounded-xl flex flex-col items-center space-y-1 font-bold ${
                        ['Packed', 'Delivered'].includes(ord.orderStatus)
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <PackageCheck className="w-4 h-4" />
                        <span>{t('orderStatusPacked')}</span>
                      </div>

                      {/* Step 3: Out for Delivery */}
                      <div className={`p-2 rounded-xl flex flex-col items-center space-y-1 font-bold ${
                        ['Out for Delivery', 'Delivered'].includes(ord.orderStatus)
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Truck className="w-4 h-4" />
                        <span>Dispatched</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className={`p-2 rounded-xl flex flex-col items-center space-y-1 font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <CheckCheck className="w-4 h-4" />
                        <span>{t('orderStatusDelivered')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items & Payment Ledger Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Products */}
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('items')}</h4>
                    <div className="space-y-2">
                      {ord.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-800">{item.name}</p>
                              <p className="text-[10px] text-slate-500">{item.unit} × {item.quantity}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                            <button
                              onClick={() => setSelectedProductForReview(item)}
                              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{t('writeReview')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Ledger Box (Paid Amount, Remaining Balance, Payment Status) */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">{t('yourBalanceLedger')}</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('totalAmount')}:</span>
                        <span className="font-extrabold text-white">₹{total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('paidAmount')}:</span>
                        <span className="font-extrabold text-emerald-400">₹{paid}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                        <span className="text-amber-400">{t('balanceRemaining')}:</span>
                        <span className="font-extrabold text-amber-400 text-sm">₹{remaining}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span
                        className={`w-full text-center block py-1.5 rounded-xl font-extrabold text-xs uppercase ${
                          paymentBadgeStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : paymentBadgeStatus === 'Partial'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {t('paymentStatus')}: {paymentBadgeStatus === 'Paid' ? t('statusPaid') : paymentBadgeStatus === 'Partial' ? t('statusPartial') : t('statusPending')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Review Modal */}
      <ReviewModal
        isOpen={!!selectedProductForReview}
        onClose={() => setSelectedProductForReview(null)}
        product={selectedProductForReview}
      />
    </div>
  );
};
