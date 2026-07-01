import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck as CheckCircle, Shield, Headphones, Star, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import DestinationCard from '../components/ui/DestinationCard';
import PackageCard from '../components/ui/PackageCard';
import TestimonialCard from '../components/ui/TestimonialCard';
import SearchBar from '../components/ui/SearchBar';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { useDestinations } from '../hooks/useDestinations';
import { useFeaturedPackages } from '../hooks/usePackages';
import { useTestimonials } from '../hooks/useTestimonials';

const features = [
  {
    icon: Shield,
    title: 'Trusted Service',
    description: 'Over 15 years of experience with 50,000+ satisfied travelers',
  },
  {
    icon: CheckCircle,
    title: 'Best Price Guarantee',
    description: 'We match any competitor price for the same tour package',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock assistance during your entire journey',
  },
  {
    icon: Star,
    title: 'Curated Experiences',
    description: 'Handpicked destinations and activities by local experts',
  },
];

export default function Home() {
  const { destinations, loading: loadingDestinations } = useDestinations();
  const { packages: featuredPackages, loading: loadingPackages } = useFeaturedPackages(3);
  const { testimonials, loading: loadingTestimonials } = useTestimonials();

  // Get top destinations by rating
  const popularDestinations = [...destinations]
    .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // Get featured testimonials
  const featuredTestimonials = testimonials
    .filter((t: any) => t.status === 'approved' || t.isFeatured)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Himalayan Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary-400" />
              <span className="text-white/90 text-sm font-medium">
                Your Personalized North East Travel Planner
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6"
          >
            Discover the{' '}
            <span className="text-gradient">Hidden Treasures</span>
            <br />
            of Northeast India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Explore pristine valleys, ancient monasteries, and untouched wilderness
            with our expertly curated tours across Sikkim, Darjeeling, Meghalaya, and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/packages">
              <Button variant="primary" size="lg">
                Explore Packages
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            {/* <button className="flex items-center gap-2 text-white font-medium hover:text-secondary-400 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Play className="w-5 h-5 fill-current" />
              </div>
              Watch Our Story
            </button> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Popular"
            highlight="Destinations"
            subtitle="Explore the most sought-after destinations in Northeast India, from the misty hills of Darjeeling to the pristine valleys of Sikkim"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingDestinations ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              popularDestinations.map((dest, index) => (
                <DestinationCard key={dest.id} destination={dest} index={index} />
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/destinations">
              <Button variant="outline" size="lg">
                View All Destinations
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Tour"
            highlight="Packages"
            subtitle="Handpicked tour packages offering the best experiences in Northeast India at unbeatable prices"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingPackages ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              featuredPackages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/packages">
              <Button variant="primary" size="lg">
                Explore All Packages
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle
                title="Why Choose"
                highlight="Us?"
                subtitle="With over 15 years of experience, we've built a reputation for delivering exceptional travel experiences in Northeast India"
                centered={false}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <feature.icon className="w-8 h-8 text-primary-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Mountain landscape"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 glass-card p-6 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-primary-500">15+</div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Years of</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Excellence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-secondary-500">50K+</div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Happy</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Travelers
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="What Our"
            highlight="Travelers Say"
            subtitle="Real experiences from real travelers who explored Northeast India with us"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingTestimonials ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              featuredTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Get Exclusive Travel Updates
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Subscribe to our newsletter and receive the best deals, travel tips,
              and destination guides directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/40"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </form>
            <p className="text-white/60 text-sm mt-4">
              No spam, unsubscribe anytime. Read our Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
