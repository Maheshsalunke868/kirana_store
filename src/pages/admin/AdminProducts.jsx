import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Sparkles, X, Save, Camera, Upload, Link } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { CameraCaptureModal } from '../../components/CameraCaptureModal';

export const AdminProducts = () => {
  const { products, categories, addProduct, editProduct, deleteProduct } = useStore();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('grains');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('1 kg');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory(categories[0]?.id || 'grains');
    setPrice('');
    setOriginalPrice('');
    setQuantity('50');
    setUnit('1 kg');
    setImage('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || '');
    setQuantity(p.quantity);
    setUnit(p.unit);
    setImage(p.image);
    setDescription(p.description);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        addToast('Photo uploaded successfully', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !quantity) {
      addToast('Please fill required fields (Name, Price, Quantity)', 'error');
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      quantity: Number(quantity),
      unit,
      image: image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      description
    };

    if (editingId) {
      editProduct(editingId, payload);
      addToast(`Updated product "${name}"`, 'success');
    } else {
      addProduct(payload);
      addToast(`Added new product "${name}" to store inventory!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (p) => {
    if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
      deleteProduct(p.id);
      addToast(`Deleted product "${p.name}"`, 'info');
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Inventory Control</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('products')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add products with camera photos, edit details anytime, and manage stock catalog
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCat === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCat === cat.id ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-4">{t('products')}</th>
                <th className="p-4">{t('category')}</th>
                <th className="p-4">{t('price')}</th>
                <th className="p-4">{t('stockQty')}</th>
                <th className="p-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const catObj = categories.find((c) => c.id === p.category);
                const catName = catObj ? catObj.name : p.category;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.unit} • {p.description ? p.description.slice(0, 45) : 'No description'}...</p>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[10px] font-bold text-emerald-700">
                      <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {catName}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">
                      ₹{p.price}
                      {p.originalPrice && <span className="text-[10px] text-slate-400 line-through ml-1">₹{p.originalPrice}</span>}
                    </td>
                    <td className="p-4">
                      {p.quantity <= 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">Out of Stock</span>
                      ) : p.quantity <= 30 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">{p.quantity} {t('itemsLeft')}</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">{p.quantity} in stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          title={t('editProduct')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full my-8 overflow-hidden border border-slate-100">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingId ? t('editProduct') : t('addProduct')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('productName')}</label>
                <input
                  type="text"
                  placeholder="e.g. Aashirvaad Chakki Atta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('category')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('unit')}</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg / 500 ml / Pack"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('price')}</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('mrpPrice')}</label>
                  <input
                    type="number"
                    placeholder="e.g. 180"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('stockQty')}</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Product Photo Source Selection (Camera / File Upload / URL) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">{t('productImage')}</label>

                {/* Preview Thumbnail */}
                {image && (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 mx-auto shadow-xs">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t('takeCameraPhoto')}</span>
                  </button>

                  <label className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>{t('uploadPhoto')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={t('imageUrlOption') + ' (https://...)'}
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('description')}</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of product features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? t('save') : t('addProduct')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live WebRTC Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedDataUrl) => {
          setImage(capturedDataUrl);
          addToast('Camera photo captured!', 'success');
        }}
      />
    </div>
  );
};
