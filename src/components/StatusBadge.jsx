import React from 'react';
import { Clock, CheckCircle2, PackageCheck, Truck, CheckCheck, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          Pending
        </span>
      );
    case 'Accepted':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
          Accepted
        </span>
      );
    case 'Packed':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
          <PackageCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
          Packed
        </span>
      );
    case 'Out for Delivery':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
          <Truck className="w-3.5 h-3.5 mr-1 text-indigo-600 animate-pulse" />
          Out for Delivery
        </span>
      );
    case 'Delivered':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Delivered
        </span>
      );
    case 'Not Accepted':
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
          Not Accepted
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
          {status}
        </span>
      );
  }
};
