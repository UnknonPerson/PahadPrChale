export interface Hotel {
  id: string;
  name: string;
  destination: string;
  destinationId: string;
  category: 'Budget' | 'Standard' | 'Deluxe' | 'Luxury';
  pricePerNight: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  highlights: string[];
}

// Fallback hotel when API fails or database is empty
export const fallbackHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'The Elgin Darjeeling',
    destination: 'Darjeeling',
    destinationId: 'darjeeling',
    category: 'Luxury',
    pricePerNight: 8500,
    originalPrice: 12000,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Room Service', 'Parking', 'Gym', 'Bar'],
    rating: 4.8,
    reviewCount: 324,
    description: 'A heritage luxury hotel offering panoramic views of the Kanchenjunga range with colonial charm.',
    address: 'Laden La Road, Darjeeling',
    highlights: ['Kanchenjunga View', 'Heritage Property', 'Colonial Architecture', 'Fine Dining'],
  },
];

// Keep for backward compatibility
export const hotels = fallbackHotels;
