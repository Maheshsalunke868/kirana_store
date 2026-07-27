import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Download,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  CreditCard,
  Building
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminCustomers = () => {
  const { customers, addCustomer, editCustomer, deleteCustomer } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'paid'

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomerHistory, setViewingCustomerHistory] = useState(null);

  // Form States for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    notes: ''
  });

  // Calculate high-level directory totals
  const totalCustomersCount = customers.length;
  const totalCollectedAmount = customers.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const totalPendingDuesAmount = customers.reduce((sum, c) => sum + (c.pendingBalance || 0), 0);
  const customersWithDuesCount = customers.filter((c) => (c.pendingBalance || 0) > 0).length;

  // Search and Filter Logic
  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.location.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') {
      return (c.pendingBalance || 0) > 0;
    }
    if (statusFilter === 'paid') {
      return (c.pendingBalance || 0) <= 0;
    }

    return true;
  });

  // Handle Excel Export
  const handleExportExcel = () => {
    if (!customers || customers.length === 0) {
      addToast('No customer records available for export.', 'error');
      return;
    }

    const exportRows = filteredCustomers.map((c) => ({
      'Customer ID': c.id,
      'Customer Name': c.name,
      'Phone Number': c.phone,
      'Email Address': c.email || 'N/A',
      'Delivery Address / Location': c.location,
      'Registration Date': c.joinedDate || 'N/A',
      'Total Orders': c.totalOrders || 0,
      'Completed Orders (Delivered)': c.completedOrders || 0,
      'Pending Orders': c.pendingOrders || 0,
      'Total Order Amount (₹)': c.totalSpent || 0,
      'Completed Payments / Paid (₹)': c.paidAmount || 0,
      'Pending Dues / Remaining (₹)': c.pendingBalance || 0,
      'Payment Ledger Status': c.paymentLedgerStatus || 'Paid',
      'Notes & Remarks': c.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    // Auto fit column widths
    const colWidths = Object.keys(exportRows[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 18)
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Customers');

    const fileName = `Kirana_Registered_Customers_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    addToast(`Excel report downloaded successfully! (${fileName})`, 'success');
  };

  // Modal Triggers
  const openAddModal = () => {
    setFormData({ name: '', phone: '', email: '', location: '', notes: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name || '',
      phone: cust.phone || '',
      email: cust.email || '',
      location: cust.location || '',
      notes: cust.notes || ''
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('Customer Name and Phone Number are required', 'error');
      return;
    }

    addCustomer(formData);
    addToast(`New customer "${formData.name}" registered successfully!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('Customer Name and Phone Number are required', 'error');
      return;
    }

    editCustomer(editingCustomer.id, formData);
    addToast(`Customer details for "${formData.name}" updated successfully!`, 'success');
    setEditingCustomer(null);
  };

  const handleDelete = (cust) => {
    if (window.confirm(`Are you sure you want to delete registered customer record for "${cust.name}"?`)) {
      deleteCustomer(cust.id);
      addToast(`Customer "${cust.name}" removed from directory.`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Customer Directory & Payment Ledger
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('customerDirectory')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered store buyers, track pending vs completed payment ledgers, edit profile info, and export Excel reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center space-x-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t('exportCustomerExcel')}</span>
          </button>

          {/* Add New Customer Button */}
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center space-x-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCustomer')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Buyers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Registered
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCustomersCount} Buyers</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Collected Payments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              {t('completedPayments')}
            </span>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              ₹{totalCollectedAmount.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Pending Dues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
              {t('pendingPayments')}
            </span>
            <h3 className="text-2xl font-extrabold text-amber-700 mt-1">
              ₹{totalPendingDuesAmount.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Buyers with Dues */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
              Customers With Dues
            </span>
            <h3 className="text-2xl font-extrabold text-rose-700 mt-1">{customersWithDuesCount} Accounts</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="all">All Customers</option>
            <option value="pending">Has Pending Dues (₹ &gt; 0)</option>
            <option value="paid">Fully Paid Clear (₹0 Due)</option>
          </select>
        </div>
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-slate-200/80 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No registered customers found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search filter or click "Add New Customer" to register a buyer.
            </p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const hasDue = (cust.pendingBalance || 0) > 0;
            return (
              <div
                key={cust.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
              >
                {/* Profile Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-emerald-400 font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
                      {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{cust.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.phone}</span>
                        </span>
                        {cust.email && (
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cust.email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider border shrink-0 ${
                      hasDue
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {hasDue ? 'Pending Dues' : 'Fully Paid'}
                  </span>
                </div>

                {/* Delivery Location & Notes */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Delivery Location
                    </span>
                    <p className="flex items-start space-x-1.5 text-slate-800 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cust.location || 'No location provided'}</span>
                    </p>
                  </div>

                  {cust.notes && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Admin Ledger Notes
                      </span>
                      <p className="text-slate-700 italic text-[11px] flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{cust.notes}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment & Order Detailed Ledger Breakdown */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Total Orders */}
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Orders</span>
                    <span className="font-extrabold text-slate-900 text-sm">{cust.totalOrders || 0}</span>
                  </div>

                  {/* Total Spent */}
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Spent</span>
                    <span className="font-extrabold text-slate-900 text-sm">₹{cust.totalSpent || 0}</span>
                  </div>

                  {/* Completed Paid Payment */}
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[9px] text-emerald-600 font-bold uppercase block">Paid Amount</span>
                    <span className="font-extrabold text-emerald-700 text-sm">₹{cust.paidAmount || 0}</span>
                  </div>

                  {/* Pending Balance Due */}
                  <div
                    className={`p-2 rounded-xl border ${
                      hasDue ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase block text-amber-700">Pending Due</span>
                    <span className="font-extrabold text-sm text-amber-800">₹{cust.pendingBalance || 0}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Joined: {cust.joinedDate || '2026'}
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* View History Button */}
                    <button
                      onClick={() => setViewingCustomerHistory(cust)}
                      title="View Orders & Payment History"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Customer Button */}
                    <button
                      onClick={() => openEditModal(cust)}
                      title="Edit Customer Details"
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t('edit')}</span>
                    </button>

                    {/* Delete Customer Button */}
                    <button
                      onClick={() => handleDelete(cust)}
                      title="Delete Customer"
                      className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{editingCustomer ? t('editCustomer') : t('addCustomer')}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingCustomer ? handleSaveEdit : handleSaveAdd}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Location / Full Address
                </label>
                <textarea
                  rows="2"
                  placeholder="House/Flat No, Street, Society, Landmark..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin / Ledger Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning delivery preferred, Regular buyer..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Customer History & Orders Modal */}
      {viewingCustomerHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Customer Profile & History</span>
                <h3 className="font-extrabold text-lg">{viewingCustomerHistory.name}</h3>
                <p className="text-xs text-slate-400">{viewingCustomerHistory.phone} • Joined {viewingCustomerHistory.joinedDate}</p>
              </div>
              <button
                onClick={() => setViewingCustomerHistory(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Payment Overview Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Orders Value</span>
                  <span className="font-extrabold text-slate-900 text-base">₹{viewingCustomerHistory.totalSpent || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Completed Payments</span>
                  <span className="font-extrabold text-emerald-700 text-base">₹{viewingCustomerHistory.paidAmount || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase block">Outstanding Due</span>
                  <span className="font-extrabold text-amber-700 text-base">₹{viewingCustomerHistory.pendingBalance || 0}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Registered Address</span>
                <p className="font-medium bg-white p-3 rounded-xl border border-slate-200">
                  {viewingCustomerHistory.location}
                </p>
              </div>

              {/* Order History Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">Customer Orders Ledger ({viewingCustomerHistory.customerOrders ? viewingCustomerHistory.customerOrders.length : 0})</h4>

                {!viewingCustomerHistory.customerOrders || viewingCustomerHistory.customerOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No individual orders found for this customer.</p>
                ) : (
                  <div className="space-y-3">
                    {viewingCustomerHistory.customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                              {ord.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="text-slate-600 text-[11px]">
                            Items: {ord.items ? ord.items.map((i) => `${i.name} (${i.quantity})`).join(', ') : 'N/A'}
                          </div>
                        </div>

                        <div className="text-right sm:self-center shrink-0 space-y-1">
                          <div className="font-extrabold text-slate-900 text-sm">₹{ord.totalPrice}</div>
                          <div className="text-[11px]">
                            <span className="text-emerald-700 font-bold">Paid: ₹{ord.paidAmount !== undefined ? ord.paidAmount : (ord.paymentStatus === 'Paid' ? ord.totalPrice : 0)}</span>
                            { (ord.remainingBalance || 0) > 0 && (
                              <span className="text-amber-700 font-bold ml-2">Due: ₹{ord.remainingBalance}</span>
                            )}
                          </div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ord.orderStatus === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            Status: {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingCustomerHistory(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
