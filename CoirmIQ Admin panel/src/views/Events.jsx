import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Pagination from '../components/Pagination';
import { 
  Calendar, 
  User, 
  MapPin, 
  Tag, 
  Clock, 
  AlertTriangle, 
  Trash2,
  AlertCircle
} from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search Filter State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Deletion Safeguard State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories');
      const data = response.data.data;
      if (data) {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchEvents = async (currentPage, currentSize, nameQuery, cityQuery, categoryQuery) => {
    setLoading(true);
    try {
      // Endpoint: GET /api/v1/events
      const response = await api.get('/api/v1/events', {
        params: {
          page: currentPage,
          size: currentSize,
          name: nameQuery || undefined,
          city: cityQuery || undefined,
          category: categoryQuery || undefined,
        },
      });

      const data = response.data.data;
      setEvents(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch events catalog.';
      showToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    document.title = 'Event Moderation Overview | Antigravity';
    fetchEvents(page, size, name, city, category);
  }, [page, size, name, city, category]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setPage(0);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };


  const handleDeleteClick = (eventItem) => {
    setDeleteConfirmId(eventItem.id);
    setDeleteConfirmName(eventItem.name || 'this event');
  };

  const confirmDeleteEvent = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);
    try {
      // Endpoint: DELETE /api/v1/events/{id}
      const response = await api.delete(`/api/v1/events/${deleteConfirmId}`);
      if (response.data.success) {
        showToast('Event has been cancelled and deleted from system database.', 'success');
        setEvents((prev) => prev.filter((e) => e.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to cancel/delete event.';
      showToast(errMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (mins) => {
    if (!mins) return 'N/A';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs === 0) return `${mins} mins`;
    if (remainingMins === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${hrs} hr${hrs > 1 ? 's' : ''} ${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* View Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1" id="events-title">
            Event Moderation Overview
          </h1>
          <p className="text-xs text-slate-400">
            Monitor and moderate active events published on the platform. Deleting cancels the event and halts booking capabilities.
          </p>
        </div>
        <button
          onClick={() => { setPage(0); fetchEvents(0, size); }}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium hover:bg-slate-800 text-slate-200 transition-all"
        >
          Refresh Ledger
        </button>
      </header>

      {/* Standalone Input Search Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            id="event-name-search"
            type="text"
            placeholder="Search event name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex-1">
          <input
            id="event-city-search"
            type="text"
            placeholder="Search city name"
            value={city}
            onChange={handleCityChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            id="event-category-filter"
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Filter category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Catalogue */}
      <section className="flex-1 flex flex-col min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center border border-slate-900 bg-slate-900/10 rounded-xl flex-1 flex flex-col justify-center items-center">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-slate-400 font-mono">RETRIEVING PLATFORM EVENTS...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-850 bg-slate-900/10 rounded-xl flex-1 flex flex-col justify-center items-center">
            <Calendar className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-sm text-slate-400 font-medium">No events registered on the platform</p>
            <p className="text-xs text-slate-650 mt-1">Host profiles publish events using the ticketing application client.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image/Visual wrapper */}
                  <div className="relative h-32 rounded-lg bg-slate-950/80 border border-slate-900 overflow-hidden mb-4 shrink-0 flex items-center justify-center">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-[10px] text-slate-600 font-mono flex flex-col items-center gap-1.5">
                        <Calendar size={20} className="text-slate-700" />
                        NO VISUAL ATTACHED
                      </div>
                    )}
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-900">
                      ID: {event.id.substring(0, 8)}
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-sm mb-4 line-clamp-1" title={event.name}>
                    {event.name}
                  </h3>

                  {/* Strictly required event metrics: Host Name, Venue City, Category, Start Time, and Duration */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-950/50">
                      <span className="text-slate-500 flex items-center gap-1.5"><User size={12} /> Host Name</span>
                      <span className="font-medium text-slate-350 font-mono text-[11px]" title={event.host?.username}>
                        {event.host?.username || 'System Host'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-950/50">
                      <span className="text-slate-500 flex items-center gap-1.5"><MapPin size={12} /> Venue City</span>
                      <span className="font-medium text-slate-350">{event.venue?.city || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-950/50">
                      <span className="text-slate-500 flex items-center gap-1.5"><Tag size={12} /> Category</span>
                      <span className="font-medium text-slate-350">{event.category?.name || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-950/50">
                      <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={12} /> Start Time</span>
                      <span className="font-medium text-slate-350 text-[11px] font-mono">{formatDate(event.startTime)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 flex items-center gap-1.5"><Clock size={12} /> Duration</span>
                      <span className="font-medium text-slate-350">{formatDuration(event.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Cancel Safeguard Button */}
                <div className="mt-6 pt-3.5 border-t border-slate-950/60">
                  <button
                    id={`delete-event-${event.id}`}
                    onClick={() => handleDeleteClick(event)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-600 border border-rose-900/30 text-xs font-semibold text-rose-400 hover:text-white transition-all active:translate-y-[1px]"
                  >
                    <Trash2 size={13} />
                    Cancel / Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Deletion Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-in">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Cancel &amp; Delete Event?</h3>
                <p className="text-xs text-slate-450 mt-2 font-semibold text-rose-350">
                  "{deleteConfirmName}"
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Warning: Relational records, customer seat reservations, and transactional bookings linked to this event will be impacted. Confirm deletion from the database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/40">
              <button
                type="button"
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(''); }}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-350 border border-slate-800 transition-colors"
              >
                Keep Event
              </button>
              <button
                id="confirm-delete-event-btn"
                onClick={confirmDeleteEvent}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md shadow-rose-600/10"
              >
                {deleteLoading ? 'Processing...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
