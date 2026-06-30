import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, CreditCard as Edit2, Trash2, Star, MapPin, X, Upload } from 'lucide-react';
import { hotels as initialHotels } from '../../data/hotels';
import type { Hotel } from '../../data/hotels';

const categories = ['All', 'Budget', 'Standard', 'Deluxe', 'Luxury'];

export default function HotelsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [hotelsList, setHotelsList] = useState<Hotel[]>(initialHotels);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    destinationId: '',
    category: 'Standard' as Hotel['category'],
    pricePerNight: 0,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: '',
    rating: 4.0,
    reviewCount: 0,
    description: '',
    address: '',
    highlights: '',
  });

  const filteredHotels = hotelsList.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || hotel.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Budget':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'Standard':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Deluxe':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Luxury':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      destination: '',
      destinationId: '',
      category: 'Standard',
      pricePerNight: 0,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: '',
      rating: 4.0,
      reviewCount: 0,
      description: '',
      address: '',
      highlights: '',
    });
    setEditingHotel(null);
  };

  const handleEdit = (hotel: Hotel) => {
    setFormData({
      ...hotel,
      amenities: hotel.amenities.join(', '),
      highlights: hotel.highlights.join(', '),
    });
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setHotelsList((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHotel: Hotel = {
      ...formData,
      id: editingHotel?.id || `hotel-${Date.now()}`,
      amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      highlights: formData.highlights.split(',').map((h) => h.trim()).filter(Boolean),
    };

    if (editingHotel) {
      setHotelsList((prev) => prev.map((h) => (h.id === editingHotel.id ? newHotel : h)));
    } else {
      setHotelsList((prev) => [...prev, newHotel]);
    }

    setShowForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Hotels Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage hotel listings and details
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotels..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel, index) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-40">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(hotel.category)}`}>
                  {hotel.category}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-semibold text-white truncate">{hotel.name}</h3>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {hotel.destination}
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {hotel.rating} ({hotel.reviewCount})
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-secondary-500">
                    Rs {hotel.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400">/night</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(hotel)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hotels found
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl my-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    className="input-field h-20 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Hotel['category'] })}
                  >
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price Per Night (Rs) *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="WiFi, Parking, Restaurant, Room Service"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Highlights (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Mountain View, Colonial Architecture"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      className="input-field flex-1"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <button
                      type="button"
                      className="px-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                >
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
