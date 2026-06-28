export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  package: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Unforgettable Sikkim Adventure',
    text: 'The North Sikkim tour was absolutely magical! The team took care of everything, from permits to comfortable stays. Gurudongmar Lake at sunrise is an image I\'ll cherish forever. Highly recommend for anyone seeking authentic mountain experiences.',
    package: 'North Sikkim Adventure',
    date: 'March 2024',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    location: 'Bangalore, Karnataka',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Best Family Trip Ever',
    text: 'Traveled with my elderly parents and kids to Darjeeling and Gangtok. The itinerary was perfectly planned with comfortable pace. Hotels were excellent and the driver was very knowledgeable. Every detail was taken care of.',
    package: 'Darjeeling & Gangtok Explorer',
    date: 'April 2024',
  },
  {
    id: '3',
    name: 'Ananya Das',
    location: 'Kolkata, West Bengal',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Kaziranga Exceeded Expectations',
    text: 'As a wildlife photographer, I\'ve been to many reserves but Kaziranga was special. The guide was excellent at tracking animals. We saw 15 rhinos in one safari! The resort location right by the park was perfect.',
    package: 'Kaziranga Wildlife Safari',
    date: 'February 2024',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    location: 'Delhi, NCR',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Tawang - A Spiritual Journey',
    text: 'The Tawang trip was transformative. Crossing Sela Pass in snow, the peaceful Tawang Monastery, and the pristine lakes - every moment was special. The team managed all permits seamlessly. Thank you for this incredible experience.',
    package: 'Tawang Spiritual Journey',
    date: 'May 2024',
  },
  {
    id: '5',
    name: 'Meera Patel',
    location: 'Ahmedabad, Gujarat',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Living Root Bridges Were Amazing',
    text: 'The trek to the Double Decker Living Root Bridge was challenging but so worth it! Dawki river with crystal clear water and Mawlynnong village were unforgettable. Northeast India is truly unique.',
    package: 'Meghalaya Discovery',
    date: 'January 2024',
  },
  {
    id: '6',
    name: 'Suresh Nair',
    location: 'Chennai, Tamil Nadu',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    title: 'Great Tea Garden Experience',
    text: 'Staying at a tea estate was a unique experience. Waking up to mountain views, learning about tea processing, and the tasting sessions were excellent. A peaceful getaway from city life.',
    package: 'Darjeeling Tea Trail',
    date: 'December 2023',
  },
];
