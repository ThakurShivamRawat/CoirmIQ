import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Map, 
  Plus, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Layers, 
  Eye, 
  Building,
  ListCollapse,
  ArrowLeft,
  X
} from 'lucide-react';

const VenueLayoutStudio = () => {
  const { showNotification } = useAuth();
  
  // Table states
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Inspector studio state
  const [activeVenueId, setActiveVenueId] = useState(null);
  const [activeVenue, setActiveVenue] = useState(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // Creation Modals
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  
  // Form states - Venue
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [submittingVenue, setSubmittingVenue] = useState(false);

  // Form states - Section
  const [sectionName, setSectionName] = useState('');
  const [submittingSection, setSubmittingSection] = useState(false);

  // Form states - Row
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [rowName, setRowName] = useState('');
  const [rowCapacity, setRowCapacity] = useState('30');
  const [submittingRow, setSubmittingRow] = useState(false);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/venues/host/me', {
        params: { page, size }
      });
      const data = response.data.data;
      setVenues(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching venues';
      showNotification(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const inspectHierarchy = async (venueId) => {
    try {
      setLoadingHierarchy(true);
      setActiveVenueId(venueId);
      const response = await api.get(`/api/v1/venues/${venueId}/hierarchy`);
      setActiveVenue(response.data.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error fetching venue hierarchy';
      showNotification(errMsg);
      setActiveVenueId(null);
      setActiveVenue(null);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page]);

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    if (!venueName || !address || !buildingNumber || !city || !pincode || !landmark) {
      showNotification('All venue fields are required.');
      return;
    }

    try {
      setSubmittingVenue(true);
      await api.post('/api/v1/venues', {
        name: venueName,
        address,
        buildingNumber,
        city,
        pincode,
        landmark
      });
      showNotification('Venue registered successfully', 'success');
      setIsVenueModalOpen(false);
      // Reset fields
      setVenueName('');
      setAddress('');
      setBuildingNumber('');
      setCity('');
      setPincode('');
      setLandmark('');
      fetchVenues();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error creating venue';
      showNotification(errMsg);
    } finally {
      setSubmittingVenue(false);
    }
  };

  const handleAppendSection = async (e) => {
    e.preventDefault();
    if (!sectionName) return;

    try {
      setSubmittingSection(true);
      await api.post(`/api/v1/venues/${activeVenueId}/layout/sections`, {
        sectionName
      });
      showNotification('Section appended successfully', 'success');
      setIsSectionModalOpen(false);
      setSectionName('');
      inspectHierarchy(activeVenueId); // Reload layout
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error adding section';
      showNotification(errMsg);
    } finally {
      setSubmittingSection(false);
    }
  };

  const handleAppendRow = async (e) => {
    e.preventDefault();
    if (!selectedSectionId || !rowName || !rowCapacity) return;

    try {
      setSubmittingRow(true);
      await api.post(`/api/v1/venues/${activeVenueId}/layout/sections/${selectedSectionId}/rows`, {
        rowName,
        capacity: parseInt(rowCapacity)
      });
      showNotification('Row appended successfully', 'success');
      setIsRowModalOpen(false);
      setRowName('');
      setRowCapacity('30');
      inspectHierarchy(activeVenueId); // Reload layout
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error adding row';
      showNotification(errMsg);
    } finally {
      setSubmittingRow(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-400" />
            Venue Layout Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Map out location blueprints, structurally append sections, and establish row seat capacities.
          </p>
        </div>
        {!activeVenueId && (
          <button
            id="btn-create-venue"
            onClick={() => setIsVenueModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Location</span>
          </button>
        )}
      </div>

      {/* Main Content Workspace Switch */}
      {!activeVenueId ? (
        /* TABLE VIEW OF VENUES */
        <div className="dark-card overflow-hidden">
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <span className="font-semibold text-slate-200">Registered Venues</span>
            <span className="text-xs text-slate-400">Manage structure blueprint mappings</span>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="text-slate-400 text-sm">Searching registered locations...</span>
            </div>
          ) : venues.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              No venues registered yet. Click "New Location" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Venue Details</th>
                    <th className="py-3.5 px-6">Address</th>
                    <th className="py-3.5 px-6">Landmark</th>
                    <th className="py-3.5 px-6">City & Zip</th>
                    <th className="py-3.5 px-6 text-right">Blueprint Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {venues.map((v) => (
                    <tr 
                      key={v.id}
                      className="hover:bg-slate-900/20 text-sm text-slate-300"
                    >
                      <td className="py-4 px-6 font-semibold text-white">
                        {v.name}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {v.buildingNumber ? `${v.buildingNumber}, ` : ''}{v.address}
                      </td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-400">
                        {v.landmark || '-'}
                      </td>
                      <td className="py-4 px-6">
                        {v.city} {v.pincode ? `(${v.pincode})` : ''}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          id={`btn-inspect-venue-${v.id}`}
                          onClick={() => inspectHierarchy(v.id)}
                          className="btn-secondary py-1 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Layout Studio</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/20 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Showing page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  id="venue-prev-page"
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0 || loading}
                  className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  id="venue-next-page"
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
      ) : (
        /* HIERARCHY BLUEPRINT INSPECTOR AND APPEND STUDIO */
        <div className="space-y-5">
          {/* Studio Header toolbar */}
          <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setActiveVenueId(null);
                setActiveVenue(null);
                fetchVenues();
              }}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to locations
            </button>
            <div className="text-right">
              <h3 className="font-bold text-white leading-none">{activeVenue?.name} Blueprint</h3>
              <span className="text-xs text-slate-500">{activeVenue?.city} &bull; {activeVenue?.address}</span>
            </div>
          </div>

          {loadingHierarchy ? (
            <div className="py-24 dark-card flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="text-slate-400 text-sm">Querying layout hierarchy blocks...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar Action controllers */}
              <div className="space-y-4">
                {/* Structural modifiers */}
                <div className="dark-card p-5 space-y-4">
                  <h4 className="font-semibold text-white text-sm flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Layout Builders
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Append sections (such as Gold Ring or VIP Balcony) to establish layout stages. Add rows under sections to specify maximum seat volumes.
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      id="btn-open-section-modal"
                      onClick={() => setIsSectionModalOpen(true)}
                      className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Append New Section</span>
                    </button>
                    <button
                      id="btn-open-row-modal"
                      onClick={() => {
                        if (!activeVenue?.sections || activeVenue.sections.length === 0) {
                          showNotification('Please append a section before mapping rows.');
                          return;
                        }
                        setSelectedSectionId(activeVenue.sections[0]?.id || '');
                        setIsRowModalOpen(true);
                      }}
                      className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Map Row Capacities</span>
                    </button>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="dark-card p-5 space-y-3.5 text-xs text-slate-400">
                  <span className="font-bold text-white block uppercase tracking-wider">Location Metadata</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block">Unique ID</span>
                      <span className="font-mono text-slate-300 select-all">{activeVenue?.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pincode & Landmark</span>
                      <span className="text-slate-300">{activeVenue?.pincode} - {activeVenue?.landmark}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Visualization Canvas */}
              <div className="lg:col-span-2 dark-card p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="font-semibold text-slate-200">Interactive Blueprint Stage</span>
                  <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">
                    {activeVenue?.sections?.length || 0} sections mapped
                  </span>
                </div>

                {!activeVenue?.sections || activeVenue.sections.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-sm space-y-2">
                    <Building className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p>No structural layout mapped for this venue.</p>
                    <p className="text-xs text-slate-600">Use the builders on the left to add a section.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activeVenue.sections.map((section) => (
                      <div 
                        key={section.id} 
                        id={`section-view-${section.id}`}
                        className="p-5 rounded-lg bg-slate-900/50 border border-slate-850 space-y-3.5"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                          <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                            <ListCollapse className="w-4 h-4 text-indigo-400" />
                            {section.sectionName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {section.rows?.length || 0} rows allocated
                          </span>
                        </div>

                        {/* Rows Grid */}
                        {!section.rows || section.rows.length === 0 ? (
                          <div className="py-4 text-center text-xs text-slate-500 italic">
                            No rows defined under this section.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {section.rows.map((row) => (
                              <div 
                                key={row.id}
                                id={`row-view-${row.id}`}
                                className="p-3 rounded bg-[#0B0F19] border border-slate-800 text-xs flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-bold text-slate-300 block">Row {row.rowName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">ID: {row.id.substring(0, 8)}...</span>
                                </div>
                                <span className="font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                  {row.capacity} Seats
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NEW VENUE MODAL */}
      {isVenueModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#05070c]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Register New Location</h3>
              <button 
                onClick={() => setIsVenueModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateVenue}>
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Venue Name *</label>
                  <input
                    id="venue-name"
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Antigravity Concert Hall"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Street Address *</label>
                    <input
                      id="venue-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 5th Ave & E 84th St"
                      className="input-field"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Building/Room Number *</label>
                    <input
                      id="venue-building-no"
                      type="text"
                      required
                      value={buildingNumber}
                      onChange={(e) => setBuildingNumber(e.target.value)}
                      placeholder="e.g. Block A-1"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City *</label>
                    <input
                      id="venue-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New York"
                      className="input-field"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pincode / Zipcode *</label>
                    <input
                      id="venue-pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 10028"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Landmark *</label>
                  <input
                    id="venue-landmark"
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Central Park Met"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVenueModalOpen(false)}
                  className="btn-secondary py-1.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  id="submit-venue-form"
                  type="submit"
                  disabled={submittingVenue}
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                >
                  {submittingVenue && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Register Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SECTION MODAL */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#05070c]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Append Layout Section</h3>
              <button 
                onClick={() => setIsSectionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAppendSection}>
              <div className="p-6 space-y-5">
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Section Name *</label>
                  <input
                    id="section-name-input"
                    type="text"
                    required
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="e.g. VIP Front Ring"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="btn-secondary py-1.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  id="submit-section-form"
                  type="submit"
                  disabled={submittingSection}
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                >
                  {submittingSection && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Section</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ROW MODAL */}
      {isRowModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#05070c]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Append Row Mappings</h3>
              <button 
                onClick={() => setIsRowModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAppendRow}>
              <div className="p-6 space-y-5">
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Section *</label>
                  <div className="relative">
                    <select
                      id="row-section-select"
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      className="w-full appearance-none bg-[#0B0F19] border border-slate-800 text-slate-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer text-sm"
                      required
                    >
                      {activeVenue?.sections?.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#0b0f19]">{s.sectionName}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Row Name *</label>
                  <input
                    id="row-name-input"
                    type="text"
                    required
                    value={rowName}
                    onChange={(e) => setRowName(e.target.value)}
                    placeholder="e.g. A1 or Premium Row 3"
                    className="input-field"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Maximum Capacity *</label>
                  <input
                    id="row-capacity-input"
                    type="number"
                    min="1"
                    required
                    value={rowCapacity}
                    onChange={(e) => setRowCapacity(e.target.value)}
                    placeholder="30"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRowModalOpen(false)}
                  className="btn-secondary py-1.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  id="submit-row-form"
                  type="submit"
                  disabled={submittingRow}
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                >
                  {submittingRow && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Append Row</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueLayoutStudio;
