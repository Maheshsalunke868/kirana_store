import React, { useState, useEffect } from 'react';
import { X, CheckCircle, QrCode, Banknote, MapPin, Phone, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

export const CheckoutModal = ({ onOrderPlaced }) => {
  const { user } = useAuth();
  const { cart, cartSubtotal, placeOrder, isCheckoutOpen, setIsCheckoutOpen } = useStore();
  const { addToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Cash on Delivery'
  const [utrNumber, setUtrNumber] = useState('');

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
    }
  }, [user, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 499 ? 30 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!customerName || !phone || !location) {
      addToast('Please complete customer details before placing order', 'error');
      return;
    }

    if (paymentMethod === 'UPI' && !utrNumber) {
      // Auto fill a mock UTR if empty for convenient testing
      setUtrNumber('UPI/' + Math.floor(100000000000 + Math.random() * 900000000000) + '/HDFC');
    }

    const createdOrder = placeOrder({
      customerId: user?.id || 'c_' + Date.now(),
      customerName,
      phone,
      location,
      items: cart,
      totalPrice: grandTotal,
      paymentMethod,
      utrNumber: utrNumber || ('UPI/' + Math.floor(100000000000 + Math.random() * 900000000000) + '/SBI')
    });

    addToast(`🎉 Order ${createdOrder.id} placed successfully!`, 'success');
    setIsCheckoutOpen(false);
    if (onOrderPlaced) onOrderPlaced();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-100 relative">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Checkout & Payment</span>
            <h2 className="text-xl font-extrabold mt-0.5">Complete Your Grocery Order</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
          {/* Customer Details Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Address / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  rows="2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>Instant UPI Payment</span>
                  </div>
                  {paymentMethod === 'UPI' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span>Cash on Delivery</span>
                  </div>
                  {paymentMethod === 'Cash on Delivery' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500">Pay cash upon store delivery</p>
              </button>
            </div>

            {/* UPI QR Code Simulator */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400">Scan & Pay via any UPI App</p>
                    <p className="text-[11px] text-slate-400">Store VPA: <span className="text-white font-mono font-bold">kirana.express@upi</span></p>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400">₹{grandTotal}</span>
                </div>

                <div className="flex items-center space-x-4 bg-white/10 p-3 rounded-xl">
                  {/* Simulated SVG QR Code */}
                  <div className="w-24 h-24 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center">
                    <div className="w-full h-full border-4 border-slate-900 p-1 grid grid-cols-3 gap-1">
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-emerald-600 rounded-xs"></div>
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-amber-500 rounded-xs"></div>
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-slate-900 rounded-xs"></div>
                      <div className="bg-emerald-600 rounded-xs"></div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-200">Payment Reference (Optional UTR)</p>
                    <input
                      type="text"
                      placeholder="e.g. UPI/619283749102/SBI (Auto-fills if blank)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400">Instant verification upon order confirmation</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Order Summary ({cart.length} items)</h4>
            <div className="max-h-32 overflow-y-auto divide-y divide-slate-200 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="py-1.5 flex justify-between">
                  <span className="text-slate-700">{item.name} ({item.unit}) × {item.quantity}</span>
                  <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Payable</span>
              <span className="text-emerald-700 text-base">₹{grandTotal}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all text-base"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Confirm & Place Order (₹{grandTotal})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
