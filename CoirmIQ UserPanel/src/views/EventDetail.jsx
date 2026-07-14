import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import api from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [venue, setVenue] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const user = JSON.parse(localStorage.getItem('antigravity_user') || 'null');
  const isHostUser = user?.role === 'HOST';
  const isEventEnded = event?.startTime ? new Date(event.startTime) < new Date() : false;
  const totalTicketsAvailable = (inventories || []).reduce((sum, inv) => sum + (inv.availableSeats || 0), 0);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Event Detail
        const eventRes = await api.get(`/api/v1/events/${id}`);
        const eventData = eventRes.data?.data;
        setEvent(eventData);

        // 2. Fetch Event Inventory
        const invRes = await api.get(`/api/v1/events/${id}/inventory`);
        const invData = invRes.data?.data || [];
        setInventories(invData);

        // 3. Fetch Venue Hierarchy
        if (eventData?.venue?.id) {
          const venueRes = await api.get(`/api/v1/venues/${eventData.venue.id}/hierarchy`);
          setVenue(venueRes.data?.data || null);
        }
      } catch (err) {
        console.error('Failed to load event specifications', err);
        window.dispatchEvent(new CustomEvent('antigravity-toast', {
          detail: { message: 'Failed to load event details. Redirecting...', type: 'error' }
        }));
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

  // Helper to find inventory mapped to a specific row
  const getInventoryForRow = (rowId) => {
    return (inventories || []).find((inv) => (inv.rowId === rowId) || (inv.row?.id === rowId));
  };

  // Handle seat clicks
  const handleSeatClick = (inventory, seatNumber) => {
    // If selecting a seat from a different pricing tier/row, reset current selection
    if (selectedInventory?.id !== inventory.id) {
      setSelectedInventory(inventory);
      setSelectedSeats([seatNumber]);
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      const filtered = selectedSeats.filter((s) => s !== seatNumber);
      setSelectedSeats(filtered);
      if (filtered.length === 0) {
        setSelectedInventory(null);
      }
    } else {
      setSelectedSeats((prev) => [...prev, seatNumber]);
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedInventory || selectedSeats.length === 0) {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Please select at least one seat to proceed.', type: 'warning' }
      }));
      return;
    }

    // Check if user is logged in. If not, Route Guard / Interceptor redirects,
    // but redirecting to /checkout will automatically trigger the ProtectedRoute anyway!
    navigate('/checkout', {
      state: {
        event,
        inventory: selectedInventory,
        selectedSeats,
        venueName: venue?.name || event.venue?.name
      }
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
        <span className="text-sm text-slate-400 font-medium">Resolving Seating Blueprints...</span>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="relative pb-24 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* 1. Event Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full relative h-[40vh] rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-slate-950/60 to-transparent z-10" />
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        
        {/* Banner Details Overlay */}
        <div className="absolute inset-x-0 bottom-8 px-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest">
              {event.category?.name || 'Live Event'}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {formatDate(event.startTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                {formatTime(event.startTime)} ({event.duration} min)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {event.venue?.name}, {event.venue?.city}
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Host verification
            </span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              Verified Event
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Content Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: About & Event Description */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Event Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {event.description || 'Join us for an unforgettable experience on the COIMIQ ticket platform.'}
            </p>
          </div>

          {/* Pricing Info Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Available Tiers</h3>
            <div className="space-y-3">
              {inventories.map((inv) => {
                // Find matching row name
                let rowName = 'General Row';
                if (venue?.sections) {
                  for (const sec of venue.sections) {
                    const foundRow = sec.rows?.find((r) => r.id === inv.rowId);
                    if (foundRow) {
                      rowName = `${sec.sectionName} - ${foundRow.rowName}`;
                      break;
                    }
                  }
                }
                return (
                  <div key={inv.id} className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-400">{rowName}</span>
                    <span className="text-violet-400">${inv.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Seating Canvas Dashboard */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
                Seating Layout Canvas
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your specific passes from the visual blueprint below
              </p>
            </div>
            
            {/* Status Legend */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/10" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-violet-500 shadow-md shadow-violet-500/30" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-rose-950/40 border border-rose-900/20 text-rose-500 flex items-center justify-center font-extrabold text-[8px]" >X</div>
                <span>Sold Out</span>
              </div>
            </div>
          </div>

          {/* Interactive Seating Blueprints */}
          {venue?.sections && venue.sections.length > 0 ? (
            <div className="space-y-10">
              {venue.sections.map((section) => (
                <div key={section.id} className="space-y-6">
                  {/* Section Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                      {section.sectionName}
                    </span>
                    <div className="h-px bg-indigo-500/10 flex-grow" />
                  </div>

                  {/* Rows inside Section */}
                  <div className="space-y-6">
                    {section.rows?.map((row) => {
                      const inv = getInventoryForRow(row.id);
                      const capacity = row.capacity || 10;
                      const available = inv ? inv.availableSeats : 0;
                      
                      return (
                        <div key={row.id} className="glass-panel-heavy p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                          {/* Row Details */}
                          <div className="text-left space-y-1">
                            <span className="text-sm font-bold text-white tracking-wide">
                              Row {row.rowName}
                            </span>
                            <div className="flex gap-3 text-xs font-semibold text-slate-400">
                              {inv ? (
                                <>
                                  <span className="text-violet-400">${inv.price.toFixed(2)}</span>
                                  <span>•</span>
                                  <span>{available} / {capacity} Seats Left</span>
                                </>
                              ) : (
                                <span className="text-slate-500">Unallocated</span>
                              )}
                            </div>
                          </div>

                          {/* Seating Grid Blocks / Badge */}
                          {!inv ? (
                            <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed">
                              Pricing Unallocated
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                              {Array.from({ length: capacity }).map((_, seatIdx) => {
                                const seatNum = `${section.sectionName}-${row.rowName}-${seatIdx + 1}`;
                                
                                // Deterministic mock logic:
                                // If capacity is 10 and availableSeats is 8, the last 2 seats (indices 8, 9) are sold out.
                                const isSoldOut = seatIdx >= available;
                                const isSelected = selectedSeats.includes(seatNum);

                                return (
                                  <motion.button
                                    key={seatNum}
                                    whileHover={!isSoldOut ? { scale: 1.15 } : {}}
                                    whileTap={!isSoldOut ? { scale: 0.9 } : {}}
                                    disabled={isSoldOut}
                                    onClick={() => handleSeatClick(inv, seatNum)}
                                    className={`w-8 h-8 rounded-lg font-display text-[10px] font-bold flex items-center justify-center transition-all duration-300 border
                                      ${isSoldOut 
                                        ? 'bg-rose-950/30 border-rose-900/10 text-rose-500 cursor-not-allowed' 
                                        : isSelected
                                          ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/40'
                                          : 'bg-white/5 border-white/5 hover:border-violet-500/40 hover:bg-white/10 text-slate-300'}`}
                                  >
                                    {isSoldOut ? 'X' : seatIdx + 1}
                                  </motion.button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm font-semibold">
              No physical capacity layout mapped for this venue.
            </div>
          )}

          {/* Dynamic Selection Overlay Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300
              ${(isEventEnded || totalTicketsAvailable === 0 || isHostUser)
                ? 'bg-slate-950/40 border-white/5 text-slate-400'
                : 'bg-violet-600/10 border-violet-500/20 glow-purple'}`}
          >
            {isEventEnded ? (
              <div className="w-full flex items-center justify-center py-2 text-slate-400 font-bold text-sm">
                <Info className="w-4 h-4 mr-2" />
                Booking Closed - Event Ended
              </div>
            ) : totalTicketsAvailable === 0 ? (
              <div className="w-full flex items-center justify-center py-2 text-rose-500 font-bold text-sm">
                <Info className="w-4 h-4 mr-2" />
                Sold Out
              </div>
            ) : isHostUser ? (
              <div className="w-full flex items-center justify-center py-2 text-amber-500 font-bold text-sm text-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                Access Restricted: Hosts cannot purchase passes for their own events.
              </div>
            ) : (
              <>
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">
                    Selected Reservation
                  </span>
                  <h4 className="text-lg font-bold text-white leading-snug">
                    {selectedSeats.length > 0 && selectedInventory ? (
                      `${selectedSeats.length} Pass${selectedSeats.length > 1 ? 'es' : ''} in Row ${
                        (() => {
                          if (venue?.sections) {
                            for (const sec of venue.sections) {
                              const r = sec.rows?.find(r => r.id === selectedInventory.rowId);
                              if (r) return r.rowName;
                            }
                          }
                          return '';
                        })()
                      }`
                    ) : (
                      'No Seats Selected'
                    )}
                  </h4>
                  <p className="text-xs text-slate-300 font-semibold line-clamp-1">
                    {selectedSeats.length > 0 ? (
                      `Seats: ${selectedSeats.map(s => s.split('-').pop()).join(', ')}`
                    ) : (
                      'Please select seats from the canvas above'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 font-semibold uppercase">Total Sum</span>
                    <span className="text-2xl font-display font-extrabold text-violet-400">
                      ${selectedInventory ? (selectedInventory.price * selectedSeats.length).toFixed(2) : '0.00'}
                    </span>
                  </div>

                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={handleProceedToCheckout}
                    className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl transition-all duration-300
                      ${selectedSeats.length === 0
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                        : 'bg-white text-slate-950 hover:bg-slate-100 shadow-white/5 active-click'}`}
                  >
                    {selectedSeats.length > 0 ? 'Confirm Reservation' : 'Select Seats Above'}
                    <ArrowRight className={`w-4 h-4 ${selectedSeats.length === 0 ? 'text-slate-400' : 'text-slate-950'}`} />
                  </button>
                </div>
              </>
            )}
          </motion.div>

        </div>

      </div>

    </div>
  );
}
