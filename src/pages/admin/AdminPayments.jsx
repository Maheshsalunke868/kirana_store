import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Edit3,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminPayments = () => {
  const { stats, orders, updateOrderPayment } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingTotal, setEditingTotal] = useState('');
  const [editingPaid, setEditingPaid] = useState('');

  const openPaymentEditModal = (ord) => {
    setEditingOrderId(ord.id);
    setEditingTotal(ord.totalPrice);
    const initialPaid = ord.paidAmount !== undefined ? ord.paidAmount : (ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Collected' ? ord.totalPrice : 0);
    setEditingPaid(initialPaid);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!editingOrderId) return;

    const total = Number(editingTotal);
    const paid = Number(editingPaid);

    if (isNaN(total) || isNaN(paid)) {
      addToast('Please enter valid numeric amounts', 'error');
      return;
    }

    updateOrderPayment(editingOrderId, total, paid);
    const remaining = Math.max(0, total - paid);
    addToast(
      `Payment updated for ${editingOrderId}! Total: ₹${total}, Paid: ₹${paid}, Remaining: ₹${remaining}`,
      'success'
    );
    setEditingOrderId(null);
  };

  const upiOrders = orders.filter((o) => o.paymentMethod === 'UPI');
  const codOrders = orders.filter((o) => o.paymentMethod === 'Cash on Delivery');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Financial Management</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('paymentManagement')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Edit order payments (Total, Paid, Remaining) and track live payment statuses (Paid / Partial / Pending)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold text-emerald-800">
            {t('totalSales')}: ₹{stats.totalSales.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* UPI Revenue */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <QrCode className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
              {upiOrders.length} Orders
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">{t('upi')}</span>
            <h3 className="text-3xl font-extrabold mt-1">₹{stats.upiSales.toLocaleString()}</h3>
            <p className="text-xs text-emerald-300 mt-1">Google Pay, PhonePe, Paytm, BHIM VPA</p>
          </div>
        </div>

        {/* COD Revenue */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Banknote className="w-6 h-6 text-amber-400" />
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
              {codOrders.length} Orders
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">{t('cod')}</span>
            <h3 className="text-3xl font-extrabold text-amber-400 mt-1">₹{stats.codSales.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Cash collected at doorstep</p>
          </div>
        </div>

        {/* Balance Ledger Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500">Remaining Balance Ledger</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Collected Payments:</span>
              <span className="font-extrabold text-emerald-600">₹{stats.totalPaidCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Outstanding Balance:</span>
              <span className="font-extrabold text-amber-600">₹{stats.totalRemainingDue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{
                  width: `${stats.totalSales ? Math.min(100, Math.round((stats.totalPaidCollected / stats.totalSales) * 100)) : 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Log & Editable Payment Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900">Payment Ledger (Total, Paid, Remaining)</h2>
          <p className="text-xs text-slate-500">Click "Edit Payment" to adjust Paid & Remaining values</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">{t('totalAmount')}</th>
                <th className="p-4">{t('paidAmount')}</th>
                <th className="p-4">{t('remainingBalance')}</th>
                <th className="p-4">{t('paymentStatus')}</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => {
                const total = ord.totalPrice || 0;
                const paid = ord.paidAmount !== undefined ? ord.paidAmount : (ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Collected' ? total : 0);
                const remaining = ord.remainingBalance !== undefined ? ord.remainingBalance : Math.max(0, total - paid);

                let status = ord.paymentStatus;
                if (status !== 'Paid' && status !== 'Partial' && status !== 'Pending') {
                  status = remaining <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';
                }

                return (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{ord.customerName}</p>
                      <p className="text-[10px] text-slate-500">{ord.phone}</p>
                    </td>
                    <td className="p-4 font-semibold">
                      <span className="flex items-center space-x-1">
                        {ord.paymentMethod === 'UPI' ? (
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{ord.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">₹{total}</td>
                    <td className="p-4 font-extrabold text-emerald-700 text-sm">₹{paid}</td>
                    <td className="p-4 font-extrabold text-amber-600 text-sm">₹{remaining}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase border ${
                          status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : status === 'Partial'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {status === 'Paid' ? t('statusPaid') : status === 'Partial' ? t('statusPartial') : t('statusPending')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openPaymentEditModal(ord)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Payment</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Modal (Total = ₹2000, Paid = ₹100 -> Remaining = ₹1900) */}
      {editingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">{t('editPaymentValues')} ({editingOrderId})</h3>
              <button onClick={() => setEditingOrderId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('totalAmount')}</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={editingTotal}
                  onChange={(e) => setEditingTotal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('paidAmount')}</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={editingPaid}
                  onChange={(e) => setEditingPaid(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Calculated Preview Box */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-amber-900">
                  <span>{t('remainingBalance')}:</span>
                  <span className="font-extrabold text-sm text-amber-700">
                    ₹{Math.max(0, Number(editingTotal || 0) - Number(editingPaid || 0))}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-amber-900">
                  <span>{t('paymentStatus')}:</span>
                  <span className="font-extrabold uppercase text-xs text-amber-800">
                    {Math.max(0, Number(editingTotal || 0) - Number(editingPaid || 0)) <= 0
                      ? t('statusPaid')
                      : Number(editingPaid || 0) > 0
                      ? t('statusPartial')
                      : t('statusPending')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{t('save')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
