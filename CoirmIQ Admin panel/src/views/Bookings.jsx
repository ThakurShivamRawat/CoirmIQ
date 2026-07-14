import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Pagination from '../components/Pagination';
import { 
  Eye, 
  X, 
  Calendar, 
  User, 
  Mail, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State (0-indexed for Spring)
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search/Filter State
  const [customerEmail, setCustomerEmail] = useState('');
  const [status, setStatus] = useState('');

  // Detail Modal State
  const [detailBookingId, setDetailBookingId] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const { showToast } = useToast();

  const fetchBookings = async (currentPage, currentSize, emailQuery, statusQuery) => {
    setLoading(true);
    try {
      // Endpoint: GET /api/v1/bookings/admin/all
      const response = await api.get('/api/v1/bookings/admin/all', {
        params: {
          page: currentPage,
          size: currentSize,
          customerEmail: emailQuery || undefined,
          status: statusQuery || undefined,
        },
      });

      const data = response.data.data;
      setBookings(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch bookings list.';
      showToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Booking Audit Ledger | Antigravity';
    fetchBookings(page, size, customerEmail, status);
  }, [page, size, customerEmail, status]);

  const handleEmailChange = (e) => {
    setCustomerEmail(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(0);
  };


  const handleRowClick = async (bookingId) => {
    setDetailBookingId(bookingId);
    setDetailLoading(true);
    setDetailBooking(null);

    try {
      // Endpoint: GET /api/v1/bookings/{id}
      const response = await api.get(`/api/v1/bookings/${bookingId}`);
      const data = response.data.data;
      if (data) {
        setDetailBooking(data);
      } else {
        showToast('Failed to retrieve booking detail structure.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to load booking details.';
      showToast(errMsg);
      setDetailBookingId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'SUCCESS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Extract event metadata from booking tickets list
  const getBookingEventDetails = (booking) => {
    if (!booking?.tickets || booking.tickets.length === 0) return null;
    const ticket = booking.tickets[0];
    return ticket?.eventInventory?.event || null;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search/Filter Bar header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1" id="bookings-title">
            Global Booking Audit Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Real-time transaction log for all user ticket checkouts. Click any row to inspect detail payloads.
          </p>
        </div>
        <button 
          onClick={() => { setPage(0); fetchBookings(0, size); }}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium hover:bg-slate-800 text-slate-200 transition-all active:translate-y-[1px]"
        >
          Refresh Ledger
        </button>
      </header>

      {/* Independent Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            id="email-search-input"
            type="text"
            placeholder="Search by customer email"
            value={customerEmail}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            id="status-filter-select"
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Filter by status</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Booking List Container */}
      <section className="bg-slate-900/30 border border-slate-900 rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                <th className="py-4 px-6 font-semibold">Transaction ID</th>
                <th className="py-4 px-6 font-semibold">Customer Account</th>
                <th className="py-4 px-6 font-semibold">Booking Time</th>
                <th className="py-4 px-6 font-semibold text-right">Total Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs text-slate-400 font-mono">RETRIEVING TRANSACTION ENTRIES...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-sm text-slate-400 font-medium">No booking transactions found in system database</p>
                    <p className="text-xs text-slate-600 mt-1">Check database state or select a different page size</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr 
                    key={booking.id}
                    onClick={() => handleRowClick(booking.id)}
                    className="hover:bg-slate-900/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-6 font-mono text-xs text-indigo-400 font-medium group-hover:text-indigo-300">
                      {booking.id}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300">
                      {booking.user?.email || 'System User'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 text-xs">
                      {formatDate(booking.bookingTime)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-semibold text-slate-200">
                      {formatPrice(booking.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button 
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-800 transition-colors"
                        title="View Full Payload Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(booking.id);
                        }}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination */}
        <Pagination
          page={page}
          size={size}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={setPage}
          onSizeChange={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
        />
      </section>

      {/* Row Detail Inspector Modal */}
      {detailBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div>
                <h3 className="font-semibold text-slate-200 text-sm font-mono">
                  Payload Inspector: {detailBookingId.substring(0, 8)}...
                </h3>
                <p className="text-[10px] text-slate-500">GET /api/v1/bookings/{'{id}'}</p>
              </div>
              <button 
                onClick={() => setDetailBookingId(null)}
                className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {detailLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs text-slate-400 font-mono">GETTING DETAILED RECORD...</p>
                </div>
              ) : !detailBooking ? (
                <div className="py-12 text-center text-xs text-rose-400">
                  <AlertCircle className="mx-auto mb-2" size={20} />
                  Failed to render booking details.
                </div>
              ) : (
                <>
                  {/* Account Summary & Stats Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <User size={13} className="text-indigo-400" /> Customer Account
                      </h4>
                      <p className="text-sm font-medium text-slate-200 flex items-center gap-2">
                        {detailBooking.user?.username || 'N/A'}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <Mail size={12} className="text-slate-500" />
                        <span>{detailBooking.user?.email || 'N/A'}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 font-mono">
                        UID: {detailBooking.user?.id || 'N/A'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <DollarSign size={13} className="text-indigo-400" /> Financial Details
                      </h4>
                      <p className="text-sm font-semibold text-slate-200">
                        Total paid: {formatPrice(detailBooking.totalAmount)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} className="text-slate-500" />
                        <span>Booked on {formatDate(detailBooking.bookingTime)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusStyle(detailBooking.status)}`}>
                          {detailBooking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details Card */}
                  {getBookingEventDetails(detailBooking) ? (
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Calendar size={13} className="text-indigo-400" /> Event Information
                      </h4>
                      <div className="flex items-start gap-4">
                        {getBookingEventDetails(detailBooking).imageUrl && (
                          <img 
                            src={getBookingEventDetails(detailBooking).imageUrl} 
                            alt="Event Visual"
                            className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200">
                            {getBookingEventDetails(detailBooking).name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                            {getBookingEventDetails(detailBooking).description || 'No description provided.'}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
                            <div>
                              <span className="text-slate-500">Venue:</span> {getBookingEventDetails(detailBooking).venue?.name || 'N/A'}
                            </div>
                            <div>
                              <span className="text-slate-500">Location:</span> {getBookingEventDetails(detailBooking).venue?.city || 'N/A'}
                            </div>
                            <div>
                              <span className="text-slate-500">Time:</span> {formatDate(getBookingEventDetails(detailBooking).startTime)}
                            </div>
                            <div>
                              <span className="text-slate-500">Category:</span> {getBookingEventDetails(detailBooking).category?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 text-center text-xs text-slate-500">
                      No event information linked to this booking payload.
                    </div>
                  )}

                  {/* Assigned Tickets / Seats */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Assigned Seats &amp; Tickets ({detailBooking.tickets?.length || 0})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detailBooking.tickets && detailBooking.tickets.length > 0 ? (
                        detailBooking.tickets.map((ticket, index) => (
                          <div 
                            key={ticket.id || index}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-850/60 text-xs"
                          >
                            <div>
                              <p className="font-semibold text-slate-200">
                                Row {ticket.eventInventory?.row?.rowName || 'N/A'} — Seat {ticket.seatNumber || 'N/A'}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Ticket ID: {ticket.id?.substring(0, 8)}...
                              </p>
                            </div>
                            {ticket.eventInventory?.price && (
                              <div className="font-mono text-slate-300 font-medium">
                                {formatPrice(ticket.eventInventory.price)}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4 text-xs text-slate-500">
                          No seats assigned to this transaction.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/40">
              <button
                type="button"
                onClick={() => setDetailBookingId(null)}
                className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-350 border border-slate-800 transition-colors"
              >
                Close Payload Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
