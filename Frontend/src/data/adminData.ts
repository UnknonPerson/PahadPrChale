export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  destination: string;
  date: string;
  travelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  rating: number;
  title: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  avatar: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export const bookings: Booking[] = [
  {
    id: 'BK001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@email.com',
    customerPhone: '+91 98765 43210',
    packageName: 'Darjeeling & Gangtok Explorer',
    destination: 'Darjeeling, Gangtok',
    date: '2024-03-15',
    travelers: 4,
    totalAmount: 99996,
    status: 'confirmed',
    createdAt: '2024-02-20',
  },
  {
    id: 'BK002',
    customerName: 'Priya Patel',
    customerEmail: 'priya@email.com',
    customerPhone: '+91 87654 32109',
    packageName: 'North Sikkim Adventure',
    destination: 'Gangtok, Lachung, Yumthang',
    date: '2024-04-01',
    travelers: 2,
    totalAmount: 71998,
    status: 'pending',
    createdAt: '2024-02-22',
  },
  {
    id: 'BK003',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@email.com',
    customerPhone: '+91 76543 21098',
    packageName: 'Meghalaya Discovery',
    destination: 'Shillong, Cherrapunji, Dawki',
    date: '2024-03-20',
    travelers: 3,
    totalAmount: 68997,
    status: 'completed',
    createdAt: '2024-02-10',
  },
  {
    id: 'BK004',
    customerName: 'Sneha Singh',
    customerEmail: 'sneha@email.com',
    customerPhone: '+91 65432 10987',
    packageName: 'Kaziranga Wildlife Safari',
    destination: 'Kaziranga, Guwahati',
    date: '2024-04-10',
    travelers: 2,
    totalAmount: 37998,
    status: 'pending',
    createdAt: '2024-02-25',
  },
  {
    id: 'BK005',
    customerName: 'Vikram Das',
    customerEmail: 'vikram@email.com',
    customerPhone: '+91 54321 09876',
    packageName: 'Tawang Spiritual Journey',
    destination: 'Tawang, Bomdila, Sela Pass',
    date: '2024-05-01',
    travelers: 4,
    totalAmount: 171996,
    status: 'confirmed',
    createdAt: '2024-02-28',
  },
  {
    id: 'BK006',
    customerName: 'Meera Nair',
    customerEmail: 'meera@email.com',
    customerPhone: '+91 43210 98765',
    packageName: 'Darjeeling Tea Trail',
    destination: 'Darjeeling',
    date: '2024-03-25',
    travelers: 2,
    totalAmount: 51998,
    status: 'cancelled',
    createdAt: '2024-02-15',
  },
];

export const customers: Customer[] = [
  {
    id: 'C001',
    name: 'Rahul Sharma',
    email: 'rahul@email.com',
    phone: '+91 98765 43210',
    totalBookings: 3,
    totalSpent: 249999,
    status: 'active',
    joinedDate: '2023-06-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'C002',
    name: 'Priya Patel',
    email: 'priya@email.com',
    phone: '+91 87654 32109',
    totalBookings: 2,
    totalSpent: 107997,
    status: 'active',
    joinedDate: '2023-08-20',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'C003',
    name: 'Amit Kumar',
    email: 'amit@email.com',
    phone: '+91 76543 21098',
    totalBookings: 5,
    totalSpent: 345000,
    status: 'active',
    joinedDate: '2023-01-10',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'C004',
    name: 'Sneha Singh',
    email: 'sneha@email.com',
    phone: '+91 65432 10987',
    totalBookings: 1,
    totalSpent: 18999,
    status: 'active',
    joinedDate: '2024-01-05',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'C005',
    name: 'Vikram Das',
    email: 'vikram@email.com',
    phone: '+91 54321 09876',
    totalBookings: 4,
    totalSpent: 215000,
    status: 'active',
    joinedDate: '2023-03-22',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'C006',
    name: 'Meera Nair',
    email: 'meera@email.com',
    phone: '+91 43210 98765',
    totalBookings: 2,
    totalSpent: 79998,
    status: 'inactive',
    joinedDate: '2023-09-18',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const reviews: Review[] = [
  {
    id: 'R001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@email.com',
    packageName: 'North Sikkim Adventure',
    rating: 5,
    title: 'Unforgettable Sikkim Adventure',
    text: 'The North Sikkim tour was absolutely magical! The team took care of everything, from permits to comfortable stays. Gurudongmar Lake at sunrise is an image I\'ll cherish forever.',
    status: 'approved',
    createdAt: '2024-02-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'R002',
    customerName: 'Priya Patel',
    customerEmail: 'priya@email.com',
    packageName: 'Darjeeling & Gangtok Explorer',
    rating: 5,
    title: 'Best Family Trip Ever',
    text: 'Traveled with my elderly parents and kids. The itinerary was perfectly planned with comfortable pace. Hotels were excellent and the driver was very knowledgeable.',
    status: 'approved',
    createdAt: '2024-02-18',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'R003',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@email.com',
    packageName: 'Kaziranga Wildlife Safari',
    rating: 5,
    title: 'Kaziranga Exceeded Expectations',
    text: 'As a wildlife photographer, I\'ve been to many reserves but Kaziranga was special. The guide was excellent at tracking animals. We saw 15 rhinos in one safari!',
    status: 'pending',
    createdAt: '2024-02-20',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'R004',
    customerName: 'Sneha Singh',
    customerEmail: 'sneha@email.com',
    packageName: 'Meghalaya Discovery',
    rating: 4,
    title: 'Great Experience',
    text: 'The living root bridges were amazing! The trek was challenging but worth it. Dawki river with crystal clear water was unforgettable.',
    status: 'pending',
    createdAt: '2024-02-22',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'R005',
    customerName: 'Vikram Das',
    customerEmail: 'vikram@email.com',
    packageName: 'Tawang Spiritual Journey',
    rating: 5,
    title: 'A Spiritual Journey',
    text: 'The Tawang trip was transformative. Crossing Sela Pass in snow, the peaceful Tawang Monastery, and the pristine lakes - every moment was special.',
    status: 'approved',
    createdAt: '2024-02-24',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const messages: Message[] = [
  {
    id: 'M001',
    name: 'Ankit Verma',
    email: 'ankit@email.com',
    phone: '+91 99999 88888',
    subject: 'Tour Booking Inquiry',
    message: 'I want to book the North Sikkim tour for 6 people in April. Can you provide more details about the itinerary and pricing?',
    status: 'unread',
    createdAt: '2024-02-28',
  },
  {
    id: 'M002',
    name: 'Kavita Reddy',
    email: 'kavita@email.com',
    phone: '+91 88888 77777',
    subject: 'Custom Tour Request',
    message: 'We are planning a 10-day trip covering Darjeeling, Sikkim, and Bhutan. Can you help us create a custom itinerary?',
    status: 'read',
    createdAt: '2024-02-27',
  },
  {
    id: 'M003',
    name: 'Sanjay Joshi',
    email: 'sanjay@email.com',
    subject: 'Customer Support',
    message: 'I have a booking for March 15th but need to change the dates due to family emergency. What are the cancellation/rescheduling policies?',
    status: 'replied',
    createdAt: '2024-02-26',
  },
  {
    id: 'M004',
    name: 'Divya Menon',
    email: 'divya@email.com',
    phone: '+91 77777 66666',
    subject: 'Feedback',
    message: 'Just wanted to say thank you for the amazing Meghalaya trip! Our guide was excellent and everything was well organized.',
    status: 'read',
    createdAt: '2024-02-25',
  },
  {
    id: 'M005',
    name: 'Rohit Gupta',
    email: 'rohit@email.com',
    phone: '+91 66666 55555',
    subject: 'Group Booking Discount',
    message: 'We are a corporate group of 20 people looking for a team outing trip. Can you offer group discounts for a 4-day Sikkim tour?',
    status: 'unread',
    createdAt: '2024-02-24',
  },
];

export const dashboardStats = {
  totalBookings: 156,
  revenue: 4875000,
  activeTours: 12,
  registeredUsers: 1250,
  monthlyRevenue: [
    { month: 'Jan', amount: 320000 },
    { month: 'Feb', amount: 450000 },
    { month: 'Mar', amount: 580000 },
    { month: 'Apr', amount: 420000 },
    { month: 'May', amount: 680000 },
    { month: 'Jun', amount: 550000 },
  ],
  recentActivity: [
    { type: 'booking', message: 'New booking for Darjeeling & Gangtok Explorer', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review for North Sikkim Adventure', time: '4 hours ago' },
    { type: 'message', message: 'New inquiry from Ankit Verma', time: '6 hours ago' },
    { type: 'user', message: 'New user registration: Priya Patel', time: '1 day ago' },
  ],
};
