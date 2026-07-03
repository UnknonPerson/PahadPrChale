import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Mountain, LogOut, LayoutDashboard, ChevronDown,
  User, Heart, Calendar, Settings, Bell, MessageSquare, Map,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Packages', path: '/packages' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Vehicles', path: '/vehicles' },
  { name: 'Custom Tour', path: '/custom-tour-request' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const userMenuItems = [
  { name: 'My Profile',      path: '/profile',           icon: User },
  { name: 'My Bookings',     path: '/bookings/my',       icon: Calendar },
  { name: 'My Custom Tours', path: '/my-custom-tours',   icon: Map },
  { name: 'My Messages',     path: '/my-messages',       icon: MessageSquare },
  { name: 'Wishlist',        path: '/wishlist',          icon: Heart },
  { name: 'Settings',        path: '/settings',          icon: Settings },
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
  const isTransparent = isHomePage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setProfileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => { logout(); setProfileOpen(false); navigate('/'); };

  const avatarSrc = (user as any)?.profileImage || user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10B981&color=fff&size=64`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-[#F5F7F8] dark:bg-gray-950 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/60 shadow-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-display font-bold transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                PahadPer<span className="text-primary-500">Chale</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `
                    relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? isTransparent
                        ? 'text-white bg-white/15'
                        : 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : isTransparent
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 ${
                      profileOpen
                        ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/30'
                        : isTransparent
                          ? 'hover:bg-white/10'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <img src={avatarSrc} alt={user?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30" />
                    <span className={`text-sm font-medium max-w-[80px] truncate ${isTransparent ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${profileOpen ? 'rotate-180' : ''} ${isTransparent ? 'text-white/70' : 'text-gray-400'}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-200 dark:border-gray-800 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3.5 bg-gradient-to-r from-primary-500/8 to-secondary-500/8 dark:from-primary-500/10 dark:to-secondary-500/10 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <img src={avatarSrc} alt={user?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20" />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.path + item.name}
                              to={item.path}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              {item.name}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-sm shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-950 z-50 lg:hidden shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Mountain className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="font-display font-bold text-gray-900 dark:text-white">
                    PahadPer<span className="text-primary-500">Chale</span>
                  </span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {/* Auth info */}
                {isAuthenticated && (
                  <div className="mb-3 px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center gap-3">
                    <img src={avatarSrc} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="pt-3 pb-1">
                      <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Account</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path + item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-secondary-500" />
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Drawer footer */}
              <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 rounded-xl text-center text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="text-xs text-gray-400">Toggle theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-[68px]" />
    </>
  );
}
