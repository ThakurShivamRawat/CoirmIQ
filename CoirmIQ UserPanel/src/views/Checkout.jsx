import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Ticket, CreditCard, ArrowLeft, ArrowRight, Sparkles, Check, Home, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve checkout state from router
  const { event, inventory, selectedSeats, venueName } = location.state || {};

  // Form states
  const [step, setStep] = useState(1); // 1: Summary, 2: Payment, 3: Voucher
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Card payment details (simulation)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!event || !inventory || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-6">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 max-w-md w-full">
          <Ticket className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Reservations</h3>
          <p className="text-sm text-slate-400 mb-6">
            Your booking bucket is currently empty. Please navigate back and select seats for your event.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors inline-block"
          >
            Return to Discovery Hub
          </Link>
        </div>
      </div>
    );
  }

  const ticketPrice = inventory.price;
  const quantity = selectedSeats.length;
  const subtotal = ticketPrice * quantity;
  const serviceFee = 4.50 * quantity;
  const totalAmount = parseFloat((subtotal + serviceFee).toFixed(2));

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    // Payment validation simulation
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Please fulfill all payment details.', type: 'warning' }
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/checkout', {
        eventInventoryId: inventory.id,
        seatNumbers: selectedSeats
      });

      const result = response.data.data;
      setBookingResult(result);
      
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Passes reserved successfully!', type: 'success' }
      }));
      
      setStep(3);
    } catch (err) {
      console.error('Checkout error:', err);
      // handled by response interceptor
    } finally {
      setLoading(false);
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

  return (
    <div className="relative min-h-[calc(100vh-80px)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Progress Stepper (hidden in step 3) */}
      {step < 3 && (
        <div className="max-w-md mx-auto mb-10 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-4">
          <span className={step === 1 ? 'text-violet-400' : 'text-slate-400'}>1. Summary</span>
          <div className="h-px bg-white/5 flex-grow mx-4" />
          <span className={step === 2 ? 'text-violet-400' : 'text-slate-400'}>2. Settlement</span>
          <div className="h-px bg-white/5 flex-grow mx-4" />
          <span className="text-slate-500">3. Confirmation</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Ticket Breakdown Card */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
                Review Passes Selection
              </h2>
              
              {/* Event card details */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-20 h-20 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">
                    {event.category?.name}
                  </span>
                  <h3 className="font-bold text-white text-base leading-tight mt-1">{event.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-indigo-400" />{formatDate(event.startTime)}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" />{venueName}</span>
                  </div>
                </div>
              </div>

              {/* Seats list */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Selected Positions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <div
                      key={seat}
                      className="px-3 py-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-bold"
                    >
                      Seat {seat.split('-').pop()} ({seat.split('-')[0]})
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-4 border-t border-white/5 flex items-start gap-3">
                <div className="w-5 h-5 rounded border border-white/10 bg-white/3 flex items-center justify-center text-white cursor-pointer mt-0.5" onClick={(e) => e.currentTarget.classList.toggle('bg-violet-600')}>
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  I authorize this marketplace transaction and agree to the COIMIQ General Terms of Services and Refund Policies. Passes are non-exchangeable once checked out.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 rounded-xl border border-white/5 hover:bg-white/3 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Modify Selection
                </button>
                <button
                  onClick={handleCheckoutSubmit}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.02] active-click text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-violet-500/20 transition-all duration-300"
                >
                  Proceed to Settlement
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sum breakdown card */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="font-display font-bold text-lg text-white">Summary Tallies</h3>
              
              <div className="space-y-3 border-b border-white/5 pb-4">
                <div className="flex justify-between text-sm font-semibold text-slate-400">
                  <span>Passes ({quantity}x)</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-400">
                  <span>Service Fee</span>
                  <span className="text-white">${serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Paid Amount</span>
                  <span className="text-xs text-slate-500">(Includes local tax/fees)</span>
                </div>
                <span className="text-2xl font-display font-extrabold text-violet-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-violet-400" />
                Settlement Terminal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter mock payment details to finalize reservation credentials
              </p>
            </div>

            {/* Premium Credit Card Graphic */}
            <div className="w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-indigo-900/60 to-violet-900/60 border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start z-10">
                <Sparkles className="w-6 h-6 text-violet-300" />
                <span className="font-display font-bold text-sm tracking-widest text-white/50">COIMIQ</span>
              </div>
              <div className="z-10">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-widest block mb-1">Passholder</span>
                <span className="font-display text-lg font-semibold tracking-wider text-white">
                  {cardName || 'YOUR FULL NAME'}
                </span>
              </div>
              <div className="flex justify-between items-end z-10">
                <div>
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-widest block mb-1">Card Number</span>
                  <span className="font-mono text-base tracking-widest text-slate-200">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-widest block mb-1">Expiry</span>
                  <span className="font-mono text-sm text-slate-200">
                    {cardExpiry || 'MM/YY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white glass-input font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="4000123456789010"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white glass-input font-medium font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Expiration</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/29"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white glass-input font-medium font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Security CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white glass-input font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-white/5 hover:bg-white/3 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-violet-500/20 hover:scale-[1.02] active-click transition-all duration-300 w-48"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm Payment
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && bookingResult && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto space-y-8"
          >
            {/* Confetti / Sparkle Headline */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                Checkout Confirmed
              </h2>
              <p className="text-sm text-slate-400">
                Your credentials have been securely stored in the blockchain ledger
              </p>
            </div>

            {/* Glowing Digital Voucher Pass */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-panel-heavy shadow-2xl glow-indigo text-left">
              {/* Ticket Top Half */}
              <div className="p-8 border-b border-dashed border-white/10 space-y-6 relative">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20 text-[10px] font-bold uppercase tracking-widest">
                  Official Pass
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Festival Event</span>
                  <h3 className="text-2xl font-display font-extrabold text-white leading-tight">{event.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm font-semibold">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</span>
                    <span className="text-slate-200 line-clamp-1">{venueName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Scheduled Time</span>
                    <span className="text-slate-200">{formatDate(event.startTime)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pass Holder</span>
                    <span className="text-slate-200 line-clamp-1">{bookingResult.user?.email || 'Authenticated User'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Seats</span>
                    <span className="text-slate-200">{bookingResult.tickets?.map(t => t.seatNumber.split('-').pop()).join(', ')}</span>
                  </div>
                </div>

                {/* Decorative punched holes at the ticket tear seam */}
                <div className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-[#050508] border border-white/10 z-10" />
                <div className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#050508] border border-white/10 z-10" />
              </div>

              {/* Ticket Bottom Half */}
              <div className="p-8 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-6 relative">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Transaction ID</span>
                  <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">
                    {bookingResult.id}
                  </span>
                  <div className="flex gap-4 text-xs font-semibold text-slate-500 justify-center sm:justify-start">
                    <span>Paid ${bookingResult.totalAmount}</span>
                    <span>•</span>
                    <span className="text-emerald-400 uppercase font-bold">{bookingResult.status}</span>
                  </div>
                </div>

                {/* Micro barcode / verification block */}
                <div className="w-32 h-10 flex gap-0.5 items-stretch bg-white/5 p-1 rounded">
                  <div className="w-1 bg-white/70" />
                  <div className="w-3 bg-white/70" />
                  <div className="w-0.5 bg-white/70" />
                  <div className="w-2 bg-white/70" />
                  <div className="w-0.5 bg-white/70" />
                  <div className="w-1.5 bg-white/70" />
                  <div className="w-4 bg-white/70" />
                  <div className="w-1 bg-white/70" />
                  <div className="w-0.5 bg-white/70" />
                  <div className="w-2.5 bg-white/70" />
                  <div className="w-1 bg-white/70" />
                  <div className="w-2 bg-white/70" />
                  <div className="w-0.5 bg-white/70" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/my-tickets"
                className="px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/20 active-click transition-colors flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                View in Passes Ledger
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-xl border border-white/5 hover:bg-white/3 text-slate-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Discovery
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
