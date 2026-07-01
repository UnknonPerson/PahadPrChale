import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, CreditCard as Edit2, Trash2, Star, Users, X, Upload, Fuel, CircleAlert as AlertCircle, Loader } from 'lucide-react';
import { useVehicles, useVehicleActions } from '../../hooks/useVehicles';
import type { Vehicle } from '../../data/vehicles';

const vehicleTypes = ['All', 'Sedan', 'SUV', 'Tempo Traveller', 'Minibus', 'Motorcycle'];

export default function VehiclesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    vehicleName: '',
    vehicleType: 'Sedan' as Vehicle['type'],
    seats: 4,
    destination: '',
    pricePerDay: 0,
    pricePerKm: 0,
    images: 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: '',
    rating: 4.0,
    description: '',
  });

  // Fetch vehicles from API
  const { vehicles, loading, error, refetch } = useVehicles();
  const { create, update, remove } = useVehicleActions();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleName = vehicle.name || vehicle.vehicleName || '';
    const vehicleType = vehicle.type || vehicle.vehicleType || '';
    const matchesSearch =
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || vehicleType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUV':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      case 'Sedan':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Tempo Traveller':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Minibus':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Motorcycle':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleName: '',
      vehicleType: 'Sedan',
      seats: 4,
      destination: '',
      pricePerDay: 0,
      pricePerKm: 0,
      images: 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: '',
      rating: 4.0,
      description: '',
    });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      vehicleName: vehicle.name || vehicle.vehicleName || '',
      vehicleType: vehicle.type || vehicle.vehicleType || 'Sedan',
      seats: vehicle.seats || 4,
      destination: vehicle.destination || '',
      pricePerDay: vehicle.pricePerDay || 0,
      pricePerKm: vehicle.pricePerKm || 0,
      images: vehicle.image || vehicle.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: vehicle.features?.join(', ') || '',
      rating: vehicle.rating || 4.0,
      description: vehicle.description || '',
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        await remove(id);
        await refetch();
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to delete vehicle');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const vehicleData = {
        vehicleName: formData.vehicleName,
        vehicleType: formData.vehicleType,
        seats: formData.seats,
        destination: formData.destination,
        pricePerDay: formData.pricePerDay,
        pricePerKm: formData.pricePerKm,
        images: [formData.images],
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
        rating: formData.rating,
        description: formData.description,
      };

      if (editingVehicle) {
        await update(editingVehicle.id || editingVehicle._id, vehicleData);
      } else {
        await create(vehicleData);
      }

      await refetch();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Vehicles Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage vehicle fleet and rental options
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          disabled={loading || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-200">Failed to load vehicles</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-200">Operation failed</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading vehicles...</span>
        </div>
      )}

      {/* Vehicles Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => {
          const vehicleId = vehicle.id || vehicle._id;
          const vehicleName = vehicle.name || vehicle.vehicleName || '';
          const vehicleType = vehicle.type || vehicle.vehicleType || '';
          const vehicleImage = vehicle.image || vehicle.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800';
          return (
          <motion.div
            key={vehicleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-40">
              <img
                src={vehicleImage}
                alt={vehicleName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(vehicleType)}`}>
                  {vehicleType}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-semibold text-white truncate">{vehicleName}</h3>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {vehicle.seats} seats
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  {vehicleType}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {vehicle.rating || 4.0}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-secondary-500">
                    Rs {(vehicle.pricePerDay || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400">/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    disabled={loading || isSubmitting}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicleId)}
                    disabled={loading || isSubmitting}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
        })}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No vehicles found
          </div>
        )}
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
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
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
              {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.vehicleName}
                    onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    className="input-field"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as Vehicle['type'] })}
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
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
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 4 })}
                    min="1"
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
                    placeholder="Darjeeling, Gangtok, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price Per Day (Rs) *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price Per Km (Rs)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.pricePerKm}
                    onChange={(e) => setFormData({ ...formData, pricePerKm: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.0 })}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="AC, Music System, GPS, First Aid Kit"
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
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
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
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                  {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
