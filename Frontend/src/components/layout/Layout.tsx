import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className={location.pathname === '/' ? '' : 'pt-20'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
