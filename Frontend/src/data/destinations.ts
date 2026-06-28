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

export const destinations: Destination[] = [
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
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    description: 'The capital of Sikkim offers a perfect blend of natural beauty and modern amenities. Explore ancient monasteries, enjoy cable car rides, and experience the vibrant local culture with stunning mountain backdrops.',
    shortDescription: 'Sikkim\'s capital with monasteries and mountain views',
    image: 'https://images.pexels.com/photos/2161447/pexels-photo-2161447.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2161447/pexels-photo-2161447.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1627928/pexels-photo-1627928.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['MG Marg', 'Rumtek Monastery', 'Tsomgo Lake', 'Cable Car', 'Hanuman Tok'],
    bestTime: 'March to June, October to December',
    altitude: '1,650 m',
    temperature: '4-22°C',
    rating: 4.8,
    reviewCount: 1820,
  },
  {
    id: 'north-sikkim',
    name: 'North Sikkim',
    state: 'Sikkim',
    description: 'A paradise for adventure seekers and nature lovers. Home to the pristine Gurudongmar Lake, stunning Yumthang Valley (Valley of Flowers), and the snow-covered peaks of the Himalayan range.',
    shortDescription: 'Pristine lakes and valleys of flowers',
    image: 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1619960/pexels-photo-1619960.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2161450/pexels-photo-2161450.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Gurudongmar Lake', 'Yumthang Valley', 'Lachung', 'Zero Point', 'Katao'],
    bestTime: 'March to June, November to February',
    altitude: '3,000-5,400 m',
    temperature: '-10 to 15°C',
    rating: 4.9,
    reviewCount: 890,
  },
  {
    id: 'pelling',
    name: 'Pelling',
    state: 'Sikkim',
    description: 'A tranquil town offering spectacular views of Kanchenjunga. Visit the sacred Khecheopalri Lake, explore ancient monasteries, and walk across the glass skywalk for thrilling mountain views.',
    shortDescription: 'Gateway to Kanchenjunga with sacred lakes',
    image: 'https://images.pexels.com/photos/1627929/pexels-photo-1627929.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1627929/pexels-photo-1627929.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2161445/pexels-photo-2161445.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Pemayangtse Monastery', 'Khecheopalri Lake', 'Rabdentse Ruins', 'Skywalk', 'Sanga Choeling'],
    bestTime: 'March to May, October to December',
    altitude: '2,150 m',
    temperature: '5-20°C',
    rating: 4.6,
    reviewCount: 650,
  },
  {
    id: 'kalimpong',
    name: 'Kalimpong',
    state: 'West Bengal',
    description: 'A charming hill town known for its nurseries, Buddhist monasteries, and panoramic Himalayan views. Experience the blend of Nepali, Bhutanese, and Bengali cultures in this serene destination.',
    shortDescription: 'Charming hill town with nurseries and monasteries',
    image: 'https://images.pexels.com/photos/1619960/pexels-photo-1619960.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1619960/pexels-photo-1619960.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1627928/pexels-photo-1627928.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Durpin Monastery', 'Deolo Hill', 'Flower Nurseries', 'Zang Dhok Palri', 'Mangal Dham'],
    bestTime: 'March to May, October to December',
    altitude: '1,250 m',
    temperature: '10-25°C',
    rating: 4.5,
    reviewCount: 420,
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    description: 'The Scotland of the East, known for its rolling hills, waterfalls, and pleasant climate. Explore living root bridges, pristine caves, and the unique matrilineal Khasi culture.',
    shortDescription: 'Scotland of the East with waterfalls and caves',
    image: 'https://images.pexels.com/photos/2161445/pexels-photo-2161445.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2161445/pexels-photo-2161445.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1619960/pexels-photo-1619960.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1627929/pexels-photo-1627929.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Elephant Falls', 'Shillong Peak', 'Ward\'s Lake', 'Don Bosco Museum', 'Police Bazar'],
    bestTime: 'March to June, September to November',
    altitude: '1,525 m',
    temperature: '4-24°C',
    rating: 4.7,
    reviewCount: 980,
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga',
    state: 'Assam',
    description: 'A UNESCO World Heritage Site, home to two-thirds of the world\'s one-horned rhinoceros population. Experience thrilling jeep and elephant safaris in one of India\'s most successful conservation stories.',
    shortDescription: 'UNESCO site with one-horned rhinos',
    image: 'https://images.pexels.com/photos/1322183/pexels-photo-1322183.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/1322183/pexels-photo-1322183.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Rhino Safari', 'Elephant Ride', 'Bird Watching', 'Jeep Safari', 'Orchid Park'],
    bestTime: 'November to April',
    altitude: '40-80 m',
    temperature: '8-35°C',
    rating: 4.8,
    reviewCount: 2100,
  },
  {
    id: 'tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    description: 'A mystical land of monasteries and high mountain passes. Home to the largest Buddhist monastery in India, Tawang offers stunning landscapes, pristine lakes, and a deeply spiritual atmosphere.',
    shortDescription: 'Mystical land of monasteries and mountain passes',
    image: 'https://images.pexels.com/photos/2161468/pexels-photo-2161468.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/2161468/pexels-photo-2161468.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2161447/pexels-photo-2161447.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    highlights: ['Tawang Monastery', 'Sela Pass', 'Madhuri Lake', 'PTSO Lake', 'War Memorial'],
    bestTime: 'March to October',
    altitude: '3,048 m',
    temperature: '-15 to 20°C',
    rating: 4.9,
    reviewCount: 560,
  },
];
