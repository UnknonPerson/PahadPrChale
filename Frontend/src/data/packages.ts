export interface Package {
  id: string;
  name: string;
  description: string;
  destination: string;
  duration: string;
  days: number;
  nights: number;
  price: number;
  originalPrice?: number;
  image: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: { day: number; title: string; description: string }[];
  rating: number;
  reviewCount: number;
  maxGroup: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  category: 'Adventure' | 'Cultural' | 'Nature' | 'Pilgrimage';
  featured: boolean;
}

// Fallback package when API fails or database is empty
export const fallbackPackages: Package[] = [
  {
    id: 'darjeeling-gangtok',
    name: 'Darjeeling & Gangtok Explorer',
    description: 'Experience the best of two hill stations with stunning mountain views, ancient monasteries, and colonial charm.',
    destination: 'Darjeeling, Gangtok',
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    price: 24999,
    originalPrice: 29999,
    image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
    highlights: ['Tiger Hill Sunrise', 'Tea Garden Tour', 'MG Marg Shopping', 'Rumtek Monastery', 'Tsomgo Lake'],
    includes: ['Accommodation', 'All meals', 'Transfers', 'Sightseeing', 'Permits'],
    excludes: ['Airfare', 'Personal expenses', 'Adventure activities'],
    itinerary: [
      { day: 1, title: 'Arrival in Darjeeling', description: 'Arrive at Bagdogra, transfer to Darjeeling, evening at Mall Road' },
      { day: 2, title: 'Darjeeling Sightseeing', description: 'Tiger Hill sunrise, tea gardens, Peace Pagoda, ropeway' },
      { day: 3, title: 'Transfer to Gangtok', description: 'Scenic drive to Gangtok, evening at MG Marg' },
      { day: 4, title: 'Gangtok Local', description: 'Rumtek Monastery, Ban Jhakri Falls, Cable Car ride' },
      { day: 5, title: 'Tsomgo Lake Excursion', description: 'Visit Tsomgo Lake, Baba Mandir, Nathula Pass (seasonal)' },
      { day: 6, title: 'Departure', description: 'Transfer to Bagdogra for departure' },
    ],
    rating: 4.8,
    reviewCount: 324,
    maxGroup: 12,
    difficulty: 'Easy',
    category: 'Cultural',
    featured: true,
  },
];

// Keep for backward compatibility
export const packages = fallbackPackages;
