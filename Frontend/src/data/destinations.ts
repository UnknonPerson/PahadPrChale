export interface Destination {
  id: string;
  name: string;
  state: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  highlights: string[];
  bestTime: string;
  altitude: string;
  temperature: string;
  rating: number;
  reviewCount: number;
}

// Fallback destination when API fails or database is empty
export const fallbackDestinations: Destination[] = [
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    description: 'The Queen of Hills, famous for its tea plantations, stunning views of Kanchenjunga, and the heritage toy train. Experience the charming colonial architecture, visit the Peace Pagoda, and witness breathtaking sunrises at Tiger Hill.',
    shortDescription: 'Queen of Hills with stunning Kanchenjunga views',
    image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1627929/pexels-photo-1627929.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Tiger Hill Sunrise', 'Tea Gardens', 'Toy Train', 'Peace Pagoda', 'Mall Road'],
    bestTime: 'March to May, October to December',
    altitude: '2,042 m',
    temperature: '5-20°C',
    rating: 4.7,
    reviewCount: 1250,
  },
];

// Keep for backward compatibility - will be removed once all pages use hooks
export const destinations = fallbackDestinations;
