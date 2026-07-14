import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon,
  Loader2,
  FileText
} from 'lucide-react';

const EventsWorkspace = () => {
  const { token, showNotification } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selector data
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null means "Create" mode
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [venueId, setVenueId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/events/host/me');
      setEvents(response.data.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching events';
      showNotification(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectors = async () => {
    try {
      // Venues created by host
      const venueRes = await api.get('/api/v1/venues/host/me', { params: { size: 100 } });
      setVenues(venueRes.data.data.content || []);

      // All categories
      const catRes = await api.get('/api/v1/categories');
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error('Error fetching selector list:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSelectors();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setName('');
    setDescription('');
    setVenueId(venues[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    // Default future startTime: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);
    // Format to YYYY-MM-DDTHH:mm
    const dateStr = tomorrow.toISOString().substring(0, 16);
    setStartTime(dateStr);
    setDuration('120');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setName(event.name);
    setDescription(event.description || '');
    setVenueId(event.venue?.id || '');
    setCategoryId(event.category?.id || '');
    // Formats startTime
    if (event.startTime) {
      setStartTime(event.startTime.substring(0, 16));
    } else {
      setStartTime('');
    }
    setDuration(event.duration?.toString() || '120');
    setImageUrl(event.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action is irreversible.')) {
      return;
    }
    try {
      await api.delete(`/api/v1/events/${id}`);
      showNotification('Event successfully deleted', 'success');
      fetchEvents();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error deleting event';
      showNotification(errMsg);
    }
  };

  // Image direct Cloudinary signed upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // 1. Fetch Secure configurations from backend
      const sigResponse = await api.get('/api/v1/images/signature', {
        params: { folder: 'ticket_events' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { signature, timestamp, api_key, cloud_name, folder } = sigResponse.data.data;

      // 2. Prepare payload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', api_key);
      formData.append('folder', folder);

      // 3. Post direct to Cloudinary
      const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadRes.data && uploadRes.data.secure_url) {
        setImageUrl(uploadRes.data.secure_url);
        showNotification('Image uploaded successfully', 'success');
      } else {
        throw new Error('Cloudinary response did not return a secure_url');
      }
    } catch (err) {
      console.error(err);
      showNotification('Cloudinary signed upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !venueId || !categoryId || !startTime || !duration) {
      showNotification('Please fill in all required inputs.');
      return;
    }

    const payload = {
      name,
      description,
      venueId,
      categoryId,
      startTime: startTime.includes(':') && startTime.split(':').length === 2 ? `${startTime}:00` : startTime,
      duration: parseInt(duration),
      imageUrl: imageUrl
    };

    try {
      setSubmitting(true);
      if (editingEvent) {
        // Edit Action
        await api.put(`/api/v1/events/${editingEvent.id}`, payload);
        showNotification('Event updated successfully', 'success');
      } else {
        // Create Action
        await api.post('/api/v1/events', payload);
        showNotification('Event created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error processing event';
      showNotification(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            My Events Workspace
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Display summaries, adjust configurations, and attach cover art for events you host.
          </p>
        </div>
        <button
          id="btn-create-event"
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Main List Grid */}
      {loading ? (
        <div className="py-24 dark-card flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-slate-400 text-sm">Searching event records...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="py-24 text-center dark-card text-slate-500">
          <p className="mb-4">No events registered yet in your portfolio.</p>
          <button
            onClick={openCreateModal}
            className="btn-secondary py-1.5 px-4 text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id}
              id={`event-card-${event.id}`}
              className="dark-card overflow-hidden flex flex-col justify-between group"
            >
              {/* Event Image Banner */}
              <div className="h-44 relative bg-slate-900 overflow-hidden">
                <img 
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&fit=crop&q=60'} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded bg-[#0B0F19]/90 border border-slate-700/80 text-xs font-semibold text-indigo-400">
                    {event.category?.name || 'Standard'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white leading-tight truncate">{event.name}</h3>
                </div>
              </div>

              {/* Event details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5 text-sm text-slate-300">
                  {event.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{formatEventDate(event.startTime)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="truncate">
                      {event.venue?.name || 'N/A'}, {event.venue?.city || ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Duration: {event.duration} minutes</span>
                  </div>
                </div>

                {/* Bottom workspace controls */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    id={`btn-edit-event-${event.id}`}
                    onClick={() => openEditModal(event)}
                    className="flex-1 btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    id={`btn-delete-event-${event.id}`}
                    onClick={() => handleDelete(event.id)}
                    className="btn-danger p-1.5"
                    aria-label="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation/Adjustment Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#05070c]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">
                {editingEvent ? 'Adjust Event Parameters' : 'Create New Event'}
              </h3>
              <button
                id="close-event-modal"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="max-h-[75vh] overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Event Name *
                  </label>
                  <input
                    id="event-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Neon Electric Symphony"
                    className="input-field"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    id="event-description"
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about standard and VIP layouts or show timings..."
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Venue *
                    </label>
                    <div className="relative">
                      <select
                        id="event-venue-select"
                        value={venueId}
                        onChange={(e) => setVenueId(e.target.value)}
                        className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                        required
                      >
                        {venues.length === 0 ? (
                          <option value="" className="bg-[#0b0f19]">No venues found - create one first</option>
                        ) : (
                          venues.map(v => (
                            <option key={v.id} value={v.id} className="bg-[#0b0f19]">{v.name} ({v.city})</option>
                          ))
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        id="event-category-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                        required
                      >
                        {categories.length === 0 ? (
                          <option value="" className="bg-[#0b0f19]">No categories loaded</option>
                        ) : (
                          categories.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#0b0f19]">{c.name}</option>
                          ))
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Start Time *
                    </label>
                    <input
                      id="event-start-time"
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      id="event-duration"
                      type="number"
                      min="1"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="120"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Secure Cloudinary Image Upload Component */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Cover Image
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="event-image-url"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or input URL: https://..."
                        className="input-field"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="file" 
                        id="cloudinary-image-file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="cloudinary-image-file"
                        className="btn-secondary h-full py-2.5 px-4 cursor-pointer flex items-center gap-1.5 text-xs whitespace-nowrap bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>Upload File</span>
                      </label>
                    </div>
                  </div>

                  {imageUrl && (
                    <div className="mt-3 relative rounded-lg overflow-hidden h-24 border border-slate-800">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  id="btn-cancel-event-form"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-1.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-event-form"
                  disabled={submitting}
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEvent ? 'Save Changes' : 'Publish Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsWorkspace;
