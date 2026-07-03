import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Mountain, LogOut, LayoutDashboard, ChevronDown,
  User, Heart, Calendar, Settings, MessageSquare, Map, Bell,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home',         path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Packages',     path: '/packages' },
  { name: 'Hotels',       path: '/hotels' },
  { name: 'Vehicles',     path: '/vehicles' },
  { name: 'Custom Tour',  path: '/custom-tour-request' },
  { name: 'About',        path: '/about' },
  { name: 'Contact',      path: '/contact' },
];

const userMenuItems = [
  { name: 'My Profile',      path: '/profile',         icon: User },
  { name: 'My Bookings',     path: '/bookings/my',     icon: Calendar },
  { name: 'My Custom Tours', path: '/my-custom-tours', icon: Map },
  { name: 'My Messages',     path: '/my-messages',     icon: MessageSquare },
  { name: 'Wishlist',        path: '/wishlist',        icon: Heart },
  { name: 'Settings',        path: '/settings',        icon: Settings },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [elevated, setElevated]         = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef<HTMLDivElement>(null);

  // Add shadow when scrolled — purely decorative, never changes text colors
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const avatar =
    (user as any)?.profileImage ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10B981&color=fff&size=128`;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER — always solid, always theme-aware, never transparent.
          Light mode: white background, dark text.
          Dark  mode: gray-950 background, light text.
          The Tailwind `dark:` prefix handles everything — no JS color logic.
      ───────────────────────────────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 inset-x-0 z-50
          bg-white dark:bg-gray-950
          border-b border-gray-200 dark:border-gray-800
          transition-shadow duration-200
          ${elevated ? 'shadow-md dark:shadow-gray-900/60' : 'shadow-none'}
        `}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
            >
              {/* Icon box — always green-to-sky gradient */}
              <span className="
                flex-shrink-0 w-9 h-9 rounded-xl
                bg-gradient-to-br from-primary-500 to-secondary-500
                flex items-center justify-center
                shadow-sm shadow-primary-500/20
                group-hover:shadow-md group-hover:shadow-primary-500/30
                transition-shadow duration-200
              ">
                <Mountain className="w-5 h-5 text-white" />
              </span>

              {/* Text — explicit light/dark colors, never inherits from hero */}
              <span className="whitespace-nowrap font-display font-bold text-base sm:text-lg leading-none">
                {/* "PahadPer" — dark on light, white on dark */}
                <span className="text-gray-900 dark:text-white">PahadPer</span>
                {/* "Chale" — always brand green */}
                <span className="text-primary-500">Chale</span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(({ name, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {name}
                </NavLink>
              ))}
            </div>

            {/* ── Right-side controls ── */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Theme toggle */}
              <ThemeToggle />

              {isAuthenticated ? (
                /* ── Authenticated: avatar + dropdown ── */
                <div className="relative ml-1" ref={dropRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={`
                      flex items-center gap-2 pl-1 pr-3 py-1 rounded-full
                      transition-colors duration-150
                      ${dropdownOpen
                        ? 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary-500/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <img
                      src={avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-primary-500/25"
                    />
                    <span className="text-sm font-medium max-w-[90px] truncate text-gray-800 dark:text-gray-200">
                      {user?.name?.split(' ')[0] ?? 'Profile'}
                    </span>
                    <ChevronDown
                      className={`
                        w-3.5 h-3.5 flex-shrink-0
                        text-gray-400 dark:text-gray-500
                        transition-transform duration-200
                        ${dropdownOpen ? 'rotate-180' : ''}
                      `}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.13 }}
                        className="
                          absolute right-0 top-full mt-2 w-60
                          bg-white dark:bg-gray-900
                          rounded-2xl border border-gray-200 dark:border-gray-800
                          shadow-xl shadow-black/10 dark:shadow-black/40
                          overflow-hidden
                        "
                      >
                        {/* Profile header */}
                        <div className="px-4 py-3.5 bg-gradient-to-r from-primary-500/8 to-secondary-500/8 dark:from-primary-500/10 dark:to-secondary-500/10 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={avatar}
                              alt={user?.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {userMenuItems.map(({ name: label, path, icon: Icon }) => (
                            <Link
                              key={`${path}-${label}`}
                              to={path}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              {label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-secondary-500" />
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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
                /* ── Guest: Sign In + Get Started ── */
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md hover:shadow-primary-500/25 transition-all duration-150"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile burger ── */}
            <button
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────
          MOBILE DRAWER — always solid, always theme-aware
      ───────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Slide-in panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 flex flex-col shadow-2xl lg:hidden bg-white dark:bg-gray-950"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 min-w-0"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Mountain className="w-4 h-4 text-white" />
                  </span>
                  <span className="whitespace-nowrap font-display font-bold text-sm">
                    <span className="text-gray-900 dark:text-white">PahadPer</span>
                    <span className="text-primary-500">Chale</span>
                  </span>
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

                {/* Authenticated user card */}
                {isAuthenticated && (
                  <div className="mb-4 mx-1 px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Primary nav links */}
                {navLinks.map(({ name, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    {name}
                  </NavLink>
                ))}

                {/* Account section */}
                {isAuthenticated && (
                  <>
                    <p className="px-3 pt-5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                      Account
                    </p>
                    {userMenuItems.map(({ name: label, path, icon: Icon }) => (
                      <Link
                        key={`${path}-${label}`}
                        to={path}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-secondary-500" />
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Drawer footer */}
              <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-100 dark:border-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-gray-400 dark:text-gray-600">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Height spacer — keeps page content below the fixed header */}
      <div className="h-16 lg:h-[68px]" aria-hidden="true" />
    </>
  );
}
