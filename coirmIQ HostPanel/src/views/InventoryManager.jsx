import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, 
  Tag, 
  Calendar, 
  Map, 
  DollarSign, 
  Bookmark, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

const InventoryManager = () => {
  const { showNotification } = useAuth();
  
  // Lists
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [currentAllocations, setCurrentAllocations] = useState([]);
  
  // Selected state
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');
  
  // Layout Hierarchy state
  const [hierarchy, setHierarchy] = useState(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);
  const [loadingAllocations, setLoadingAllocations] = useState(false);
  
  // Form states
  const [selectedRowId, setSelectedRowId] = useState('');
  const [availableSeats, setAvailableSeats] = useState('30');
  const [price, setPrice] = useState('99.99');
  const [submitting, setSubmitting] = useState(false);

  const fetchInitialData = async () => {
    try {
      // Get host events
      const eventRes = await api.get('/api/v1/events/host/me');
      const eventList = eventRes.data.data || [];
      setEvents(eventList);
      if (eventList.length > 0) {
        setSelectedEventId(eventList[0].id);
        // Default select venue of that event if present
        if (eventList[0].venue?.id) {
          setSelectedVenueId(eventList[0].venue.id);
        }
      }

      // Get host venues
      const venueRes = await api.get('/api/v1/venues/host/me', { params: { size: 100 } });
      const venueList = venueRes.data.data.content || [];
      setVenues(venueList);
      if (venueList.length > 0 && !selectedVenueId) {
        setSelectedVenueId(venueList[0].id);
      }
    } catch (err) {
      console.error(err);
      showNotification('Error loading initial drop-down parameters');
    }
  };

  const fetchVenueHierarchy = async (venueId) => {
    if (!venueId) {
      setHierarchy(null);
      return;
    }
    try {
      setLoadingHierarchy(true);
      const response = await api.get(`/api/v1/venues/${venueId}/hierarchy`);
      const hierarchyData = response.data.data;
      setHierarchy(hierarchyData);
      
      // Auto select first row if sections exist
      if (hierarchyData.sections?.length > 0) {
        const firstSection = hierarchyData.sections[0];
        if (firstSection.rows?.length > 0) {
          setSelectedRowId(firstSection.rows[0].id);
        } else {
          setSelectedRowId('');
        }
      } else {
        setSelectedRowId('');
      }
    } catch (err) {
      showNotification('Error retrieving venue layout hierarchy');
      setHierarchy(null);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const fetchAllocations = async (eventId) => {
    if (!eventId) return;
    try {
      setLoadingAllocations(true);
      const response = await api.get(`/api/v1/events/${eventId}/inventory`);
      setCurrentAllocations(response.data.data || []);
    } catch (err) {
      console.error(err);
      setCurrentAllocations([]);
    } finally {
      setLoadingAllocations(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Handle Event selection change
  useEffect(() => {
    if (selectedEventId) {
      fetchAllocations(selectedEventId);
      // Auto-set the venue ID that matches the event to improve host experience
      const activeEvent = events.find(e => e.id === selectedEventId);
      if (activeEvent?.venue?.id) {
        setSelectedVenueId(activeEvent.venue.id);
      }
    }
  }, [selectedEventId]);

  // Handle Venue selection change
  useEffect(() => {
    if (selectedVenueId) {
      fetchVenueHierarchy(selectedVenueId);
    }
  }, [selectedVenueId]);

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !selectedRowId || !availableSeats || !price) {
      showNotification('Please fill in all pricing parameters.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/v1/inventory', {
        eventId: selectedEventId,
        rowId: selectedRowId,
        availableSeats: parseInt(availableSeats),
        price: parseFloat(price)
      });
      
      showNotification('Inventory price block allocated successfully', 'success');
      // Refresh allocations list
      fetchAllocations(selectedEventId);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error allocating ticket inventory';
      showNotification(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to flat list rows from hierarchy
  const getAllRows = () => {
    if (!hierarchy || !hierarchy.sections) return [];
    const rows = [];
    hierarchy.sections.forEach(sec => {
      if (sec.rows) {
        sec.rows.forEach(r => {
          rows.push({
            id: r.id,
            name: `${sec.sectionName} - Row ${r.rowName}`,
            capacity: r.capacity
          });
        });
      }
    });
    return rows;
  };

  const rowsList = getAllRows();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          Inventory Allocation & Pricing Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select hosted events, target row layouts, and define pricing tiers and seat locking caps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Mechanics Card */}
        <div className="dark-card p-6 h-fit">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tag className="w-4 h-4 text-indigo-400" />
            Pricing Allocation Form
          </h3>

          <form onSubmit={handleAllocate} className="space-y-5">
            {/* Event Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Target Event
              </label>
              <div className="relative">
                <select
                  id="pricing-event-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                  required
                >
                  <option value="" disabled className="bg-[#0b0f19]">Select event...</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id} className="bg-[#0b0f19]">{e.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Venue Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Venue Location
              </label>
              <div className="relative">
                <select
                  id="pricing-venue-select"
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                  required
                >
                  <option value="" disabled className="bg-[#0b0f19]">Select venue...</option>
                  {venues.map(v => (
                    <option key={v.id} value={v.id} className="bg-[#0b0f19]">{v.name} ({v.city})</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Target Row Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                3. Choose Target Row
              </label>
              <div className="relative">
                {loadingHierarchy ? (
                  <div className="input-field py-3 flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Loading layout rows...</span>
                  </div>
                ) : rowsList.length === 0 ? (
                  <div className="input-field py-3 text-slate-500 text-xs">
                    No rows configured under this venue blueprint
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      id="pricing-row-select"
                      value={selectedRowId}
                      onChange={(e) => setSelectedRowId(e.target.value)}
                      className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                      required
                    >
                      {rowsList.map(r => (
                        <option key={r.id} value={r.id} className="bg-[#0b0f19]">
                          {r.name} (Max: {r.capacity} seats)
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                4. Set Ticket Price ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-medium">
                  $
                </span>
                <input
                  id="pricing-amount"
                  type="number"
                  step="0.01"
                  min="0.00"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99.99"
                  className="input-field pl-8"
                />
              </div>
            </div>

            {/* Capacity Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                5. Lock Capacity / Available Seats
              </label>
              <input
                id="pricing-seats"
                type="number"
                min="0"
                required
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                placeholder="30"
                className="input-field"
              />
              <span className="text-[10px] text-slate-500 mt-1 block leading-relaxed">
                Ensure seat count is within physical layout limits.
              </span>
            </div>

            <button
              id="pricing-submit-btn"
              type="submit"
              disabled={submitting || rowsList.length === 0}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting pricing...</span>
                </>
              ) : (
                <span>Submit Price Mapping</span>
              )}
            </button>
          </form>
        </div>

        {/* Allocations Inspector list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="dark-card p-6">
            <h3 className="font-bold text-white text-base mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                Active Allocations for Selected Event
              </span>
              <span className="text-xs text-indigo-400 font-medium">
                {currentAllocations.length} Active Tiers
              </span>
            </h3>

            {loadingAllocations ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-slate-400 text-xs">Querying allocations table...</span>
              </div>
            ) : currentAllocations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm italic">
                No inventory pricing models published yet for this event. Fill in the form on the left to map pricing.
              </div>
            ) : (
              <div className="space-y-3">
                {currentAllocations.map((alloc) => (
                  <div 
                    key={alloc.id}
                    id={`allocation-item-${alloc.id}`}
                    className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-slate-200">
                        Row ID: {alloc.row?.id || alloc.rowId}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Allocated Capacity: {alloc.availableSeats} seats</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Unit Ticket Price</span>
                      <span className="font-mono font-bold text-emerald-400 text-base">
                        ${alloc.price?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
