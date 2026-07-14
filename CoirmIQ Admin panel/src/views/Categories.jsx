import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Folder, 
  Layers, 
  FileText,
  AlertTriangle
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null means create new
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Confirm Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Endpoint: GET /api/v1/categories
      const response = await api.get('/api/v1/categories');
      const data = response.data.data;
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch categories.';
      showToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Category CRUD Dashboard | COIMIQ';
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setName(category.name || '');
    setDescription(category.description || '');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = { name, description };
      if (editingCategory) {
        // Endpoint: PUT /api/v1/categories/{id}
        const response = await api.put(`/api/v1/categories/${editingCategory.id}`, payload);
        if (response.data && response.data.success) {
          showToast('Category updated successfully.', 'success');
          fetchCategories();
          setModalOpen(false);
        } else {
          throw new Error(response.data?.message || 'Failed to update category.');
        }
      } else {
        // Endpoint: POST /api/v1/categories
        const response = await api.post('/api/v1/categories', payload);
        if (response.data && response.data.success) {
          showToast('Category created successfully.', 'success');
          fetchCategories();
          setModalOpen(false);
        } else {
          throw new Error(response.data?.message || 'Failed to create category.');
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save category.';
      showToast(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);
    try {
      // Endpoint: DELETE /api/v1/categories/{id}
      const response = await api.delete(`/api/v1/categories/${deleteConfirmId}`);
      if (response.data && response.data.success) {
        showToast('Category deleted successfully.', 'success');
        setCategories((prev) => prev.filter((c) => c.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      } else {
        throw new Error(response.data?.message || 'Failed to delete category.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete category.';
      showToast(errMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* View Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1" id="categories-title">
            Category CRUD Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Define and manage ticket categories across the event ecosystem.
          </p>
        </div>
        <button
          id="create-category-btn"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-650 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-650/15 active:translate-y-[1px]"
        >
          <Plus size={15} />
          Create Category
        </button>
      </header>

      {/* Main categories listing */}
      <section className="flex-1 min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center border border-slate-900 bg-slate-900/10 rounded-xl">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-slate-400 font-mono">LOADING CATEGORIES CATALOG...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-800 bg-slate-900/10 rounded-xl">
            <Layers className="mx-auto text-slate-600 mb-3" size={24} />
            <p className="text-sm text-slate-400 font-medium">No event categories registered</p>
            <p className="text-xs text-slate-650 mt-1">Click "Create Category" to set up the first system tag</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                      <Folder size={14} />
                    </div>
                    <h3 className="font-semibold text-slate-200 text-sm">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[40px] line-clamp-3">
                    {category.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-950 flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <span>ID: {category.id.substring(0, 8)}...</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all"
                      title="Edit Category"
                      id={`edit-${category.id}`}
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                      title="Delete Category"
                      id={`delete-${category.id}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create / Edit Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="cat-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Category Name *
                  </label>
                  <input
                    id="cat-name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Music Concerts"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 text-xs transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="cat-desc" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    id="cat-desc"
                    rows={3}
                    placeholder="Provide a brief explanation of what events belong under this tag."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 text-xs transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-350 border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="category-submit-btn"
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10"
                >
                  {submitLoading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : (
                    'Save Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-in">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Delete Event Category?</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  This action cannot be undone. Any events currently referencing this category might lead to catalog mapping errors or fail.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/40">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-350 border border-slate-800 transition-colors"
              >
                No, Keep it
              </button>
              <button
                id="confirm-delete-category-btn"
                onClick={confirmDeleteCategory}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md shadow-rose-600/10"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
