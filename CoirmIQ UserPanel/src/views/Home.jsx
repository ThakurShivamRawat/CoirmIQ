import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Tag, ChevronLeft, ChevronRight, Calendar, Clock, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';



export default function Home() {
  const navigate = useNavigate();


  // Search & Filter State
  const [eventName, setEventName] = useState('');
  const [cityName, setCityName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside dropdown handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Listings and Pagination
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 6;



  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/v1/categories');
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Events when filters or page change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const queryParams = `?name=${encodeURIComponent(eventName)}&city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(selectedCategory)}&page=${page}&size=${pageSize}`;
        const res = await api.get(`/api/v1/events${queryParams}`);
        const pageData = res.data?.data;
        setEvents(pageData?.content || []);
        setTotalPages(pageData?.totalPages || 1);
        setTotalElements(pageData?.totalElements || 0);
      } catch (err) {
        console.error('Failed to query events catalog', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventName, cityName, selectedCategory, page]);

  // Reset page to 0 on filter change
  const handleEventNameChange = (val) => {
    setEventName(val);
    setPage(0);
  };

  const handleCityNameChange = (val) => {
    setCityName(val);
    setPage(0);
  };

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setPage(0);
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
    <div className="relative pb-24">
      {/* Background glow ambient effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. Cinematic Hero Banner */}
      {events && events.length > 0 ? (
        <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/5 bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={events[0].id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-slate-950/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-[#050508]/40 z-10" />
              <img
                src={events[0].imageUrl}
                alt={events[0].name}
                className="w-full h-full object-cover"
              />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 text-xs font-semibold uppercase tracking-wider mb-4"
                >
                  Featured Show
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display font-extrabold text-4xl md:text-6xl tracking-tight text-white mb-2 leading-none max-w-3xl"
                >
                  {events[0].name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-slate-300 font-medium mb-6 max-w-xl"
                >
                  {events[0].description || 'Join us for an unforgettable live experience.'}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-6"
                >
                  <button
                    onClick={() => navigate(`/event/${events[0].id}`)}
                    className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02] active-click transition-all duration-300 text-sm"
                  >
                    Acquire Passes
                  </button>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    {events[0].venue?.city || 'TBA'}
                    <span className="text-white/20">•</span>
                    <Calendar className="w-4 h-4 text-violet-400" />
                    {formatDate(events[0].startTime)}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="relative h-[65vh] w-full overflow-hidden border-b border-white/5 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-slate-950/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#050508]/40 z-10" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 max-w-md"
          >
            <Calendar className="w-12 h-12 text-violet-500/60 mx-auto mb-4 animate-pulse" />
            <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2 leading-none">
              No Featured Show Available
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Explore the catalog below to find upcoming live experiences.
            </p>
          </motion.div>
        </div>
      )}

      {/* 2. Standalone Filters Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="w-full glass-panel-heavy p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-4">
          
          {/* Filter Indicator Icon */}
          <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-white/5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Filter</p>
              <h4 className="text-sm font-bold text-white">Hub</h4>
            </div>
          </div>

          {/* Event Search Input */}
          <div className="w-full relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={eventName}
              onChange={(e) => handleEventNameChange(e.target.value)}
              placeholder="Search by Event Name..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white glass-input font-medium"
            />
          </div>

          {/* City Search Input */}
          <div className="w-full relative">
            <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={cityName}
              onChange={(e) => handleCityNameChange(e.target.value)}
              placeholder="Filter by City / Landmark..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white glass-input font-medium"
            />
          </div>

          {/* Category Dropdown Input */}
          <div className="w-full relative" ref={dropdownRef}>
            <Tag className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl text-sm text-white glass-input font-medium text-left cursor-pointer flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/10"
            >
              <span>
                {categories.find((c) => c.id === selectedCategory)?.name || 'All Categories'}
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 left-0 right-0 mt-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden py-1.5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleCategoryChange('');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 block
                      ${selectedCategory === '' 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'text-zinc-200 hover:bg-zinc-800 hover:text-white font-medium'}`}
                  >
                    All Categories
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(cat.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 block
                        ${selectedCategory === cat.id 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'text-zinc-200 hover:bg-zinc-800 hover:text-white font-medium'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 3. Event Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Live Showcases
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {totalElements} premium events matching your current filters
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
            <span className="text-sm text-slate-400">Querying database catalog...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl border border-white/5 max-w-xl mx-auto">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No matches in repository</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto px-4">
              We couldn't find any events matching "{eventName || cityName || selectedCategory}". Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/10 hover:scale-[1.01]"
                >
                  {/* Event Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[11px] font-bold text-violet-300 uppercase tracking-widest">
                      {event.category?.name || 'Festival'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-violet-400 transition-colors duration-200 line-clamp-1">
                      {event.name}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mt-3">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="line-clamp-1">{event.venue?.name} • {event.venue?.city}</span>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-semibold mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(event.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.duration} Mins
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/5 bg-white/3 hover:bg-white/5 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors active-click flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm font-semibold text-slate-400">
                  Page <span className="text-white">{page + 1}</span> of <span className="text-white">{totalPages}</span>
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/5 bg-white/3 hover:bg-white/5 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors active-click flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
