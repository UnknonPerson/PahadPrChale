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

// Fallback admin data when API fails or database is empty
export const fallbackBookings: Booking[] = [
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
];

export const fallbackCustomers: Customer[] = [
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
];

export const fallbackReviews: Review[] = [
  {
    id: 'R001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@email.com',
    packageName: 'North Sikkim Adventure',
    rating: 5,
    title: 'Unforgettable Sikkim Adventure',
    text: 'The North Sikkim tour was absolutely magical! The team took care of everything, from permits to comfortable stays.',
    status: 'approved',
    createdAt: '2024-02-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const fallbackMessages: Message[] = [
  {
    id: 'M001',
    name: 'Ankit Verma',
    email: 'ankit@email.com',
    phone: '+91 99999 88888',
    subject: 'Tour Booking Inquiry',
    message: 'I want to book the North Sikkim tour for 6 people in April. Can you provide more details?',
    status: 'unread',
    createdAt: '2024-02-28',
  },
];

export const fallbackDashboardStats = {
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

// Keep for backward compatibility
export const bookings = fallbackBookings;
export const customers = fallbackCustomers;
export const reviews = fallbackReviews;
export const messages = fallbackMessages;
export const dashboardStats = fallbackDashboardStats;
