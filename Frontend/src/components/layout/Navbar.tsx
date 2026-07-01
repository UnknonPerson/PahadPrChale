import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Mountain,
  Phone,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User,
  Heart,
  Calendar,
  Settings,
  MapPin,
  Bus,
  Building2,
  Compass,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations', icon: MapPin },
  { name: 'Packages', path: '/packages', icon: Compass },
  { name: 'Hotels', path: '/hotels', icon: Building2 },
  { name: 'Vehicles', path: '/vehicles', icon: Bus },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const userMenuItems = [
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'My Bookings', path: '/bookings/my', icon: Calendar },
  { name: 'My Custom Tours', path: '/my-custom-tours', icon: MapPin },
  { name: 'My Messages', path: '/my-messages', icon: Phone },
  { name: 'Wishlist', path: '/wishlist', icon: Heart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navBackgroundClass = scrolled
    ? 'glass-nav-solid'
    : isHomePage
    ? 'bg-transparent'
    : 'glass-nav-solid';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBackgroundClass}`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25"
              >
                <Mountain className="w-6 h-6 text-white" />
              </motion.div>
              <span className={`text-xl font-display font-bold transition-colors duration-300 ${
                scrolled || !isHomePage
                  ? 'text-surface-900 dark:text-white'
                  : 'text-white'
              }`}>
                PahadPer<span className="text-primary-500">Chale</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-primary-500'
                        : scrolled || !isHomePage
                        ? 'text-surface-600 dark:text-surface-400 hover:text-primary-500'
                        : 'text-white/90 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+916205584013"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  scrolled || !isHomePage
                    ? 'text-surface-600 dark:text-surface-400 hover:text-primary-500'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>+91 62055 84013</span>
              </a>

              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all duration-300 ${
                      profileOpen
                        ? 'bg-primary-500/10 dark:bg-primary-500/20'
                        : scrolled || !isHomePage
                        ? 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=10B981&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20"
                    />
                    <span className={`text-sm font-medium ${
                      scrolled || !isHomePage
                        ? 'text-surface-700 dark:text-surface-300'
                        : 'text-white'
                    }`}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        profileOpen ? 'rotate-180' : ''
                      } ${
                        scrolled || !isHomePage
                          ? 'text-surface-500'
                          : 'text-white/70'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/5 dark:to-secondary-500/5">
                          <div className="flex items-center gap-3">
                            <img
                              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=10B981&color=fff`}
                              alt={user?.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                            />
                            <div>
                              <p className="font-semibold text-surface-900 dark:text-white">{user?.name}</p>
                              <p className="text-sm text-surface-500">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-primary-500" />
                              {item.name}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-surface-200 dark:border-surface-800">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-secondary-500" />
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className={`text-sm font-medium transition-colors ${
                      scrolled || !isHomePage
                        ? 'text-surface-600 dark:text-surface-400 hover:text-primary-500'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Login
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary py-2.5 px-5 text-sm"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                scrolled || !isHomePage
                  ? 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300'
                  : 'bg-white/10 text-white'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-surface-950 z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center">
                      <Mountain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold text-surface-900 dark:text-white">
                      PahadPer<span className="text-primary-500">Chale</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800"
                  >
                    <X className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                {/* User Info if authenticated */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=10B981&color=fff`}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                      />
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-surface-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                              : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                          }`
                        }
                      >
                        {link.icon && <link.icon className="w-5 h-5" />}
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-surface-200 dark:bg-surface-800" />

                {/* User Menu Items */}
                {isAuthenticated ? (
                  <>
                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          <item.icon className="w-5 h-5 text-primary-500" />
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors mt-2"
                      >
                        <LayoutDashboard className="w-5 h-5 text-secondary-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 mt-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 rounded-xl border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <button className="btn-primary w-full py-3">Create Account</button>
                    </Link>
                  </div>
                )}

                {/* Bottom Section */}
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800">
                  <div className="flex items-center justify-between">
                    <a
                      href="tel:+916205584013"
                      className="flex items-center gap-2 text-surface-600 dark:text-surface-400"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+91 62055 84013</span>
                    </a>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
