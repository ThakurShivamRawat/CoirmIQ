import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, DollarSign, Clock, User, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch all bookings for active user
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/v1/bookings');
        setBookings(res?.data?.data?.content || []);
      } catch (err) {
        console.error('Failed to query bookings list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Fetch single booking details when clicked
  const handleBookingClick = async (bookingId) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/api/v1/bookings/${bookingId}`);
      setSelectedBooking(res.data.data);
    } catch (err) {
      console.error('Failed to query individual booking receipt', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10">
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
          Passes Ledger
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical repository of your marketplace transactions and active access keys
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
          <span className="text-sm text-slate-400 font-medium">Resolving Transaction History...</span>
        </div>
      ) : (!bookings || bookings.length === 0) ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5 max-w-xl mx-auto">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-white mb-1">Your ticket wallet is empty</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto px-4 font-medium">
            Explore the marketplace to acquire your first pass.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Ledger (Left 7 cols on large screens) */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1 mb-2">
              Transaction Timeline
            </h4>
            
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-white/5">
              {bookings?.length > 0 && bookings.map((booking, idx) => (
                <motion.div
                  key={booking?.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleBookingClick(booking?.id)}
                  className={`relative pl-12 cursor-pointer group`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-4 top-6 w-4 h-4 rounded-full border-2 -translate-x-1/2 flex items-center justify-center transition-all duration-300
                    ${booking?.status === 'CONFIRMED' 
                      ? 'bg-[#050508] border-emerald-500 shadow-md shadow-emerald-500/20' 
                      : booking?.status === 'FAILED'
                        ? 'bg-[#050508] border-rose-500 shadow-md shadow-rose-500/20'
                        : 'bg-[#050508] border-amber-500 shadow-md shadow-amber-500/20'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full 
                      ${booking?.status === 'CONFIRMED' ? 'bg-emerald-500' : 
                        booking?.status === 'FAILED' ? 'bg-rose-500' : 'bg-amber-500'}`} 
                    />
                  </div>

                  {/* Transaction Box */}
                  <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4
                    ${selectedBooking?.id === booking?.id 
                      ? 'bg-violet-600/[0.05] border-violet-500/40 shadow-lg shadow-violet-950/15' 
                      : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-slate-400 font-bold block">
                        ID: {booking?.id}
                      </span>
                      <div className="flex gap-4 text-xs font-semibold text-slate-500">
                        <span>{formatDateTime(booking?.bookingTime)}</span>
                        <span>•</span>
                        <span>Amount Paid: <span className="text-slate-300">${booking?.totalAmount}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status indicator badge */}
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider
                        ${booking?.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          booking?.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                      >
                        {booking?.status}
                      </span>
                      
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Pass Details Panel (Right 5 cols on large screens) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {detailsLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-8 h-8 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-3" />
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Verifying Pass Ledger...</p>
                </motion.div>
              ) : selectedBooking ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pl-1">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Glowing Digital Pass
                    </h4>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Digital Voucher */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-panel-heavy shadow-2xl glow-purple">
                    
                    {/* Top Tear */}
                    <div className="p-6 border-b border-dashed border-white/10 space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20 text-[9px] font-bold uppercase tracking-widest">
                          ACCESS PASSPORT
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Validated
                        </div>
                      </div>

                      {/* We fetch populated tickets, event info is attached */}
                      {selectedBooking?.tickets?.[0]?.eventInventory?.event ? (
                        <>
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Event Title</span>
                            <h3 className="text-xl font-display font-extrabold text-white leading-tight">
                              {selectedBooking?.tickets?.[0]?.eventInventory?.event?.name}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Venue</span>
                              <span className="text-slate-200 line-clamp-1">
                                {selectedBooking?.tickets?.[0]?.eventInventory?.event?.venue?.name || 'COIMIQ Arena'}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Scheduled</span>
                              <span className="text-slate-200">
                                {formatDate(selectedBooking?.tickets?.[0]?.eventInventory?.event?.startTime)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Transaction Details</span>
                          <h3 className="text-xl font-display font-extrabold text-white leading-tight">
                            Marketplace Booking Receipt
                          </h3>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Buyer Email</span>
                          <span className="text-slate-200 line-clamp-1">{selectedBooking?.user?.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Seats</span>
                          <span className="text-slate-200">
                            {selectedBooking?.tickets?.map((t) => t.seatNumber?.split('-').pop()).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Punched holes */}
                      <div className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-[#050508] border border-white/10 z-10" />
                      <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#050508] border border-white/10 z-10" />
                    </div>

                    {/* Bottom Tear */}
                    <div className="p-6 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4 relative">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Ledger Verification Key</span>
                        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider line-clamp-1 max-w-[180px]">
                          {selectedBooking?.id}
                        </span>
                        <div className="flex gap-3 text-[10px] font-semibold text-slate-500 justify-center sm:justify-start">
                          <span>Total Paid: ${selectedBooking?.totalAmount}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold uppercase">{selectedBooking?.status}</span>
                        </div>
                      </div>

                      {/* QR Barcode Placeholder */}
                      <div className="w-20 h-8 flex gap-0.5 items-stretch bg-white/5 p-1 rounded">
                        <div className="w-1 bg-white/70" />
                        <div className="w-2 bg-white/70" />
                        <div className="w-0.5 bg-white/70" />
                        <div className="w-1.5 bg-white/70" />
                        <div className="w-3 bg-white/70" />
                        <div className="w-0.5 bg-white/70" />
                        <div className="w-1 bg-white/70" />
                        <div className="w-2 bg-white/70" />
                      </div>
                    </div>

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center py-24"
                >
                  <AlertCircle className="w-8 h-8 text-slate-600 mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1">No Pass Inspected</h4>
                  <p className="text-xs text-slate-400 max-w-[200px]">
                    Select a transaction in the timeline ledger to inspect and render your glowing digital passes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
}
