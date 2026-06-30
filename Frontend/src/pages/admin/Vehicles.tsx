import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, CreditCard as Edit2, Trash2, Star, Users, X, Upload, Fuel } from 'lucide-react';
import { vehicles as initialVehicles } from '../../data/vehicles';
import type { Vehicle } from '../../data/vehicles';

const vehicleTypes = ['All', 'Sedan', 'SUV', 'Tempo Traveller', 'Minibus', 'Motorcycle'];

export default function VehiclesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Sedan' as Vehicle['type'],
    seats: 4,
    pricePerDay: 0,
    pricePerKm: 0,
    features: '',
    rating: 4.0,
    description: '',
    destinations: '',
    bestFor: '',
    image: 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800',
  });

  const filteredVehicles = vehiclesList.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
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
      name: '',
      type: 'Sedan',
      seats: 4,
      pricePerDay: 0,
      pricePerKm: 0,
      features: '',
      rating: 4.0,
      description: '',
      destinations: '',
      bestFor: '',
      image: 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800',
    });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      ...vehicle,
      features: vehicle.features.join(', '),
      destinations: vehicle.destinations.join(', '),
      bestFor: vehicle.bestFor.join(', '),
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehiclesList((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      ...formData,
      id: editingVehicle?.id || `vehicle-${Date.now()}`,
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      destinations: formData.destinations.split(',').map((d) => d.trim()).filter(Boolean),
      bestFor: formData.bestFor.split(',').map((b) => b.trim()).filter(Boolean),
    };

    if (editingVehicle) {
      setVehiclesList((prev) => prev.map((v) => (v.id === editingVehicle.id ? newVehicle : v)));
    } else {
      setVehiclesList((prev) => [...prev, newVehicle]);
    }

    setShowForm(false);
    resetForm();
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

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

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-40">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(vehicle.type)}`}>
                  {vehicle.type}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-semibold text-white truncate">{vehicle.name}</h3>
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
                  {vehicle.type}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {vehicle.rating}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-secondary-500">
                    Rs {vehicle.pricePerDay.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400">/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
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

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No vehicles found
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vehicle Name *
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
                    Vehicle Type
                  </label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
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
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    min="1"
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
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, pricePerKm: parseInt(e.target.value) })}
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
                    Available Destinations (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.destinations}
                    onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                    placeholder="Darjeeling, Gangtok, Pelling"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Best For (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.bestFor}
                    onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                    placeholder="Family Trips, Group Travel, Solo Adventure"
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
