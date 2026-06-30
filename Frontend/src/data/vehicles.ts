export interface Vehicle {
  id: string;
  name: string;
  type: 'Sedan' | 'SUV' | 'Tempo Traveller' | 'Minibus' | 'Motorcycle';
  seats: number;
  pricePerDay: number;
  pricePerKm?: number;
  image: string;
  gallery?: string[];
  features: string[];
  rating: number;
  reviewCount?: number;
  description: string;
  destinations: string[];
  bestFor: string[];
}

// Fallback vehicle when API fails or database is empty
export const fallbackVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Toyota Innova Crysta',
    type: 'SUV',
    seats: 7,
    pricePerDay: 4500,
    pricePerKm: 15,
    image: 'https://images.pexels.com/photos/116680/pexels-photo-116680.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [],
    features: ['Air Conditioned', 'Push-back Seats', 'USB Charging', 'Ample Boot Space', 'GPS Enabled'],
    rating: 4.7,
    reviewCount: 342,
    description: 'Perfect for mountain roads with comfortable seating and powerful engine for hilly terrain.',
    destinations: ['All Destinations'],
    bestFor: ['Family Trips', 'Group Tours', 'Mountain Roads'],
  },
];

// Keep for backward compatibility
export const vehicles = fallbackVehicles;
