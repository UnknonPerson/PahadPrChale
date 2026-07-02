import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="min-h-[calc(100vh-68px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
