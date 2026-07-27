import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  PackageCheck,
  Truck,
  CheckCheck,
  XCircle,
  Edit2,
  Trash2,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, editOrder, deleteOrder } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editTotalPrice, setEditTotalPrice] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Updated Order ${orderId} status to "${newStatus}"`, 'success');
  };

  const openEditModal = (ord) => {
    setEditingOrder(ord);
    setEditCustomerName(ord.customerName);
    setEditPhone(ord.phone);
    setEditLocation(ord.location);
    setEditTotalPrice(ord.totalPrice);
    setEditStatus(ord.orderStatus);
    setIsEditModalOpen(true);
  };

  const handleSaveOrderEdit = (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    editOrder(editingOrder.id, {
      customerName: editCustomerName,
      phone: editPhone,
      location: editLocation,
      totalPrice: Number(editTotalPrice),
      orderStatus: editStatus
    });

    addToast(`Order ${editingOrder.id} details updated!`, 'success');
    setIsEditModalOpen(false);
  };

  const handleDeleteOrder = (ord) => {
    if (window.confirm(`${t('confirmDeleteOrder')} (${ord.id})`)) {
      deleteOrder(ord.id);
      addToast(`Order ${ord.id} deleted successfully`, 'info');
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchStatus = filterStatus === 'all' || ord.orderStatus === filterStatus;
    const matchSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.phone.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Store Order Fulfillment</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('orderManagement')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View all orders, edit details, update status, or remove orders from store ledger
          </p>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
          {['all', 'Pending', 'Accepted', 'Not Accepted', 'Packed', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === st ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Order ID (ORD-...), Customer Name, or Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700">No Orders Found</h3>
          <p className="text-xs text-slate-500">No orders match your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden p-6 space-y-4"
            >
              {/* Order Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-extrabold text-slate-900 text-lg">{ord.id}</span>
                  <StatusBadge status={ord.orderStatus} />
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(ord.createdAt).toLocaleString()}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500">{t('totalAmount')}</span>
                    <span className="text-xl font-extrabold text-emerald-700 block">₹{ord.totalPrice}</span>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => openEditModal(ord)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors"
                      title={t('editOrder')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(ord)}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      title={t('deleteOrder')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('items')}</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-2.5">
                          <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg bg-white shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.unit} × {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('customerDetails')}</h4>
                  <p className="font-bold text-slate-900 text-sm">{ord.customerName}</p>
                  <p className="text-slate-600 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ord.phone}</span>
                  </p>
                  <p className="text-slate-600 flex items-start space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{ord.location}</span>
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-medium">
                    <span className="text-slate-500">{t('paymentStatus')}:</span>
                    <span className="font-bold text-slate-800">{ord.paymentMethod} ({ord.paymentStatus})</span>
                  </div>
                </div>
              </div>

              {/* Order Status Control Lifecycle Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500">{t('updateStatus')}:</span>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(ord.id, 'Accepted')}
                    disabled={ord.orderStatus === 'Accepted' || ord.orderStatus === 'Delivered'}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. {t('orderStatusAccepted')}</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(ord.id, 'Packed')}
                    disabled={ord.orderStatus === 'Packed' || ord.orderStatus === 'Delivered'}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>2. {t('orderStatusPacked')}</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(ord.id, 'Delivered')}
                    disabled={ord.orderStatus === 'Delivered'}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>3. {t('orderStatusDelivered')}</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(ord.id, 'Not Accepted')}
                    disabled={ord.orderStatus === 'Not Accepted' || ord.orderStatus === 'Delivered'}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 disabled:opacity-40 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1 ml-auto"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('orderStatusNotAccepted')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">{t('editOrder')} ({editingOrder?.id})</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                <textarea
                  rows="2"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('totalAmount')}</label>
                  <input
                    type="number"
                    value={editTotalPrice}
                    onChange={(e) => setEditTotalPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('status')}</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="Pending">{t('orderStatusPending')}</option>
                    <option value="Accepted">{t('orderStatusAccepted')}</option>
                    <option value="Not Accepted">{t('orderStatusNotAccepted')}</option>
                    <option value="Packed">{t('orderStatusPacked')}</option>
                    <option value="Delivered">{t('orderStatusDelivered')}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
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
