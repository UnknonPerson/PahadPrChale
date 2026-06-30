export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  title?: string;
  text: string;
  package?: string;
  destination?: string;
  date: string;
}

// Fallback testimonial when API fails or database is empty
export const fallbackTestimonials: Testimonial[] = [
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
];

// Keep for backward compatibility
export const testimonials = fallbackTestimonials;
