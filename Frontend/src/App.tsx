import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './services/ApiContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import TripPlanner from './pages/TripPlanner';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BookingsManagement from './pages/admin/Bookings';
import PackagesManagement from './pages/admin/Packages';
import DestinationsManagement from './pages/admin/Destinations';
import HotelsManagement from './pages/admin/Hotels';
import VehiclesManagement from './pages/admin/Vehicles';
import Customers from './pages/admin/Customers';
import ReviewsManagement from './pages/admin/Reviews';
import Messages from './pages/admin/Messages';
import AdminSettings from './pages/admin/Settings';
import Activities from './pages/admin/Activities';
import CustomTours from './pages/admin/CustomTours';
import CustomTourRequest from './pages/CustomTourRequest';
import MyCustomTours from './pages/MyCustomTours';
import MyMessages from './pages/MyMessages';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <WishlistProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="packages" element={<Packages />} />
                    <Route path="packages/:id" element={<PackageDetail />} />
                    <Route path="destinations" element={<Destinations />} />
                    <Route path="destinations/:id" element={<DestinationDetail />} />
                    <Route path="hotels" element={<Hotels />} />
                    <Route path="hotels/:id" element={<HotelDetail />} />
                    <Route path="vehicles" element={<Vehicles />} />
                    <Route path="vehicles/:id" element={<VehicleDetail />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="booking/confirmation" element={<BookingConfirmation />} />
                    <Route path="trip-planner" element={<TripPlanner />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="custom-tour-request" element={<CustomTourRequest />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />

                  {/* Protected User Routes */}
                  <Route path="/profile" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Profile />} />
                  </Route>
                  <Route path="/bookings/my" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<MyBookings />} />
                  </Route>
                  <Route path="/wishlist" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Wishlist />} />
                  </Route>
                  <Route path="/settings" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Settings />} />
                  </Route>
                  <Route path="/my-custom-tours" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<MyCustomTours />} />
                  </Route>
                  <Route path="/my-messages" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<MyMessages />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="bookings" element={<BookingsManagement />} />
                    <Route path="packages" element={<PackagesManagement />} />
                    <Route path="destinations" element={<DestinationsManagement />} />
                    <Route path="hotels" element={<HotelsManagement />} />
                    <Route path="vehicles" element={<VehiclesManagement />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="reviews" element={<ReviewsManagement />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activities" element={<Activities />} />
                    <Route path="custom-tours" element={<CustomTours />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </WishlistProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
