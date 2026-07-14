import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Pagination from '../components/Pagination';
import { 
  MapPin, 
  Building2, 
  Grid, 
  X, 
  User, 
  Navigation,
  Milestone,
  Layers,
  Armchair
} from 'lucide-react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search Filter State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  // Seating Layout Modal State
  const [hierarchyVenueId, setHierarchyVenueId] = useState(null);
  const [hierarchyVenue, setHierarchyVenue] = useState(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);

  const { showToast } = useToast();

  const fetchVenues = async (currentPage, currentSize, nameQuery, cityQuery) => {
    setLoading(true);
    try {
      // Endpoint: GET /api/v1/venues
      const response = await api.get('/api/v1/venues', {
        params: {
          page: currentPage,
          size: currentSize,
          name: nameQuery || undefined,
          city: cityQuery || undefined,
        },
      });

      const data = response.data.data;
      setVenues(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch venues catalog.';
      showToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'System Venues Audit | Antigravity';
    fetchVenues(page, size, name, city);
  }, [page, size, name, city]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setPage(0);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setPage(0);
  };


  const handleViewSeatingHierarchy = async (venueId) => {
    setHierarchyVenueId(venueId);
    setHierarchyLoading(true);
    setHierarchyVenue(null);

    try {
      // Endpoint: GET /api/v1/venues/{id}/hierarchy
      const response = await api.get(`/api/v1/venues/${venueId}/hierarchy`);
      const data = response.data.data;
      if (data) {
        setHierarchyVenue(data);
      } else {
        showToast('Failed to load seating hierarchy payload.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch venue hierarchy.';
      showToast(errMsg);
      setHierarchyVenueId(null);
    } finally {
      setHierarchyLoading(false);
    }
  };

  // Calculate total venue seating capacity
  const calculateTotalCapacity = (venue) => {
    if (!venue?.sections) return 0;
    return venue.sections.reduce((total, section) => {
      if (!section.rows) return total;
      return total + section.rows.reduce((rowTotal, row) => rowTotal + (row.capacity || 0), 0);
    }, 0);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* View Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1" id="venues-title">
            System Venues Audit
          </h1>
          <p className="text-xs text-slate-400">
            Registered stadiums, theaters, and hosting facilities. Inspect physical seating layouts.
          </p>
        </div>
        <button
          onClick={() => { setPage(0); fetchVenues(0, size); }}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium hover:bg-slate-800 text-slate-200 transition-all"
        >
          Refresh Catalog
        </button>
      </header>

      {/* Standalone Input Search Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            id="venue-name-search"
            type="text"
            placeholder="Search by venue name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex-1">
          <input
            id="venue-city-search"
            type="text"
            placeholder="Search by city"
            value={city}
            onChange={handleCityChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Venues Grid */}
      <section className="flex-1 flex flex-col min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center border border-slate-900 bg-slate-900/10 rounded-xl flex-1 flex flex-col justify-center items-center">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-slate-400 font-mono">LOADING VENUE DIRECTORIES...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-xl flex-1 flex flex-col justify-center items-center">
            <Building2 className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-sm text-slate-400 font-medium">No venues registered on the platform</p>
            <p className="text-xs text-slate-650 mt-1">Venues can be added by host accounts or administrators via CLI</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-slate-200 text-base">
                      {venue.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-950 border border-slate-900">
                      ID: {venue.id.substring(0, 8)}
                    </span>
                  </div>

                  {/* Details Sheet */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 mb-6 text-xs">
                    <div className="flex items-start gap-2 text-slate-350">
                      <Navigation size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">City</span>
                        <span>{venue.city || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-350">
                      <Milestone size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Landmark</span>
                        <span className="line-clamp-1" title={venue.landmark}>{venue.landmark || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-350 sm:col-span-2">
                      <Building2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Street Address</span>
                        <span className="leading-relaxed">
                          {venue.buildingNumber ? `${venue.buildingNumber}, ` : ''}{venue.address || 'N/A'} {venue.pincode ? `(${venue.pincode})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer details and Inspect Action */}
                <div className="pt-4 border-t border-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User size={13} className="text-slate-600" />
                    <span>Host: {venue.host?.username || 'System'}</span>
                  </div>
                  <button
                    id={`view-hierarchy-${venue.id}`}
                    onClick={() => handleViewSeatingHierarchy(venue.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all active:translate-y-[1px]"
                  >
                    <Grid size={13} />
                    View Seating Layout Hierarchy
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

      {/* Blueprint Inspector Modal */}
      {hierarchyVenueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div>
                <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <Grid size={16} className="text-indigo-400" />
                  Blueprint Seating Layout Hierarchy
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  GET /api/v1/venues/{'{id}'}/hierarchy
                </p>
              </div>
              <button 
                onClick={() => setHierarchyVenueId(null)}
                className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {hierarchyLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs text-slate-400 font-mono">EXTRACTING HIERARCHY SCHEMAS...</p>
                </div>
              ) : !hierarchyVenue ? (
                <div className="py-12 text-center text-xs text-rose-400">
                  Failed to fetch structure details.
                </div>
              ) : (
                <>
                  {/* Venue Info Banner */}
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{hierarchyVenue.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {hierarchyVenue.buildingNumber ? `${hierarchyVenue.buildingNumber}, ` : ''}{hierarchyVenue.address}, {hierarchyVenue.city}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <Armchair size={14} className="text-indigo-400" />
                      <span className="text-slate-350">Total Cap:</span>
                      <span className="font-bold text-slate-100">{calculateTotalCapacity(hierarchyVenue)} seats</span>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={13} className="text-indigo-400" /> Physical Sections ({hierarchyVenue.sections?.length || 0})
                    </h4>

                    {hierarchyVenue.sections && hierarchyVenue.sections.length > 0 ? (
                      <div className="space-y-3">
                        {hierarchyVenue.sections.map((section) => (
                          <div 
                            key={section.id} 
                            className="p-4 rounded-xl bg-slate-950/30 border border-slate-850"
                          >
                            <h5 className="font-semibold text-slate-200 text-xs mb-3 flex justify-between items-center">
                              <span>Section: {section.sectionName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ID: {section.id?.substring(0, 8)}...
                              </span>
                            </h5>

                            {/* Rows inside section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {section.rows && section.rows.length > 0 ? (
                                section.rows.map((row) => (
                                  <div 
                                    key={row.id}
                                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                      <span className="font-medium text-slate-200">Row {row.rowName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                      <span>Capacity:</span>
                                      <span className="font-bold text-slate-200">{row.capacity}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 text-center py-2 text-[10px] text-slate-500 font-mono">
                                  NO PHYSICAL ROWS MAP REGISTERED FOR THIS SECTION
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 rounded-xl bg-slate-950/20 border border-dashed border-slate-850 text-xs text-slate-500 font-mono">
                        NO SECTIONS REGISTERED FOR THIS VENUE
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/40">
              <button
                type="button"
                onClick={() => setHierarchyVenueId(null)}
                className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-350 border border-slate-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;
