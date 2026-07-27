import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Save, X, Sparkles, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminCategories = () => {
  const { categories, addCategory, editCategory, deleteCategory, products } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      addToast('Please enter category name', 'error');
      return;
    }

    const created = addCategory(newCatName.trim());
    addToast(`Category "${created.name}" created successfully!`, 'success');
    setNewCatName('');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = (catId) => {
    if (!editingName.trim()) {
      addToast('Category name cannot be empty', 'error');
      return;
    }
    editCategory(catId, editingName.trim());
    addToast(`Category updated to "${editingName.trim()}"`, 'success');
    setEditingId(null);
  };

  const handleDelete = (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id);
      addToast(`Deleted category "${cat.name}"`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t('categoryManagement')}</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('categoryManagement')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add custom categories or edit category names anytime to organize your Kirana store products
          </p>
        </div>
      </div>

      {/* Add Custom Category Form */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl">
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder={t('enterCategoryName')}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs bg-white/10 text-white placeholder-slate-300 border border-emerald-500/30 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCategory')}</span>
          </button>
        </form>
      </div>

      {/* Categories Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
          <Store className="w-5 h-5 text-emerald-600" />
          <span>Active Kirana Categories ({categories.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const productCount = products.filter((p) => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                      title={t('save')}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300"
                      title={t('cancel')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">{cat.name}</h4>
                      <p className="text-[11px] font-semibold text-emerald-700">
                        {productCount} items linked
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        title={t('editCategory')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
