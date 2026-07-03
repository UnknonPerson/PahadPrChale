import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      {/* Navbar renders its own h-16 lg:h-[68px] spacer, so main starts right below */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
