import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, 
  Calendar, 
  DollarSign, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  User,
  MapPin
} from 'lucide-react';

const SalesSummary = () => {
  const { showNotification } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Modal states
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/bookings/host/sales', {
        params: { page, size }
      });
      const data = response.data.data;
      setSales(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching sales logs';
      showNotification(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetail = async (id) => {
    try {
      setLoadingDetail(true);
      const response = await api.get(`/api/v1/bookings/${id}`);
      setBookingDetail(response.data.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching ticket details';
      showNotification(errMsg);
      setSelectedBookingId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  useEffect(() => {
    if (selectedBookingId) {
      fetchBookingDetail(selectedBookingId);
    } else {
      setBookingDetail(null);
    }
  }, [selectedBookingId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-badge-success';
      case 'PENDING':
        return 'status-badge-pending';
      case 'FAILED':
      default:
        return 'status-badge-failed';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-indigo-400" />
          Sales Summary & Checkout Logs
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor transactional data grids tracking tickets checked out across all your hosted events.
        </p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="dark-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/15">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Checkouts</span>
            <span className="text-2xl font-bold text-white mt-1 block">{totalElements}</span>
          </div>
        </div>
        
        <div className="dark-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/15">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Revenue Collected</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              ${sales
                .filter(s => s.status === 'CONFIRMED')
                .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>

        <div className="dark-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-600/10 text-amber-400 border border-amber-500/15">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">Live Bookings</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {sales.filter(s => s.status === 'PENDING').length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="dark-card overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <span className="font-semibold text-slate-200">Checkout Records</span>
          <span className="text-xs text-slate-400">Click any row to launch receipt ticket breakdown</span>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-slate-400 text-sm">Querying transaction log databases...</span>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            No checkouts or booking logs recorded for your hosted events.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Booking ID</th>
                  <th className="py-3.5 px-6">Customer Email</th>
                  <th className="py-3.5 px-6">Booking Time</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.map((booking) => (
                  <tr 
                    key={booking.id}
                    id={`booking-row-${booking.id}`}
                    onClick={() => setSelectedBookingId(booking.id)}
                    className="hover:bg-slate-900/40 cursor-pointer transition-colors text-sm text-slate-300 group"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
                      {booking.id}
                    </td>
                    <td className="py-4 px-6">
                      {booking.user?.email || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {formatDate(booking.bookingTime)}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-100">
                      ${booking.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Panel */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/20 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing page {page + 1} of {totalPages} ({totalElements} total logs)
            </span>
            <div className="flex gap-2">
              <button
                id="sales-prev-page"
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0 || loading}
                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                id="sales-next-page"
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 z-50 bg-[#05070c]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Receipt & Checkout Details</h3>
                <span className="text-xs text-slate-500 font-mono block mt-1">ID: {selectedBookingId}</span>
              </div>
              <button 
                id="close-receipt-modal"
                onClick={() => setSelectedBookingId(null)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {loadingDetail ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  <span className="text-slate-400 text-xs">Retrieving database allocation...</span>
                </div>
              ) : bookingDetail ? (
                <>
                  {/* Customer Info Card */}
                  <div className="p-5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-5 relative">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                      <User className="w-4 h-4" />
                      <span>Customer Profile</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                      <div className="relative">
                        <span className="text-slate-500 text-xs block">Username</span>
                        <span className="text-slate-200 font-medium">{bookingDetail.user?.username || 'N/A'}</span>
                      </div>
                      <div className="relative">
                        <span className="text-slate-500 text-xs block">Email Address</span>
                        <span className="text-slate-200 font-medium truncate block">{bookingDetail.user?.email || 'N/A'}</span>
                      </div>
                      {bookingDetail.user?.mobNo && (
                        <div className="relative">
                          <span className="text-slate-500 text-xs block">Mobile Number</span>
                          <span className="text-slate-200 font-medium">{bookingDetail.user.mobNo}</span>
                        </div>
                      )}
                      <div className="relative">
                        <span className="text-slate-500 text-xs block">Booking Status</span>
                        <span className={`inline-block mt-0.5 ${getStatusClass(bookingDetail.status)}`}>
                          {bookingDetail.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tickets breakdown list */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                      <Tag className="w-4 h-4" />
                      <span>Ticket Allocations</span>
                    </div>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {bookingDetail.tickets && bookingDetail.tickets.map((tkt, idx) => (
                        <div 
                          key={tkt.id || idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800/60 text-sm"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-200">
                              {tkt.eventInventory?.event?.name || 'Standard Admission'}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Seat: {tkt.seatNumber || 'General'}</span>
                            </div>
                          </div>
                          <span className="font-mono text-slate-100 font-medium">
                            ${tkt.eventInventory?.price?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary amount */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Grand Total Amount</span>
                    <span className="text-xl font-bold text-white">${bookingDetail.totalAmount?.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400 py-6">
                  Failed to load booking details.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
              <button 
                id="close-receipt-footer"
                onClick={() => setSelectedBookingId(null)}
                className="btn-secondary py-1.5 px-4 text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSummary;
