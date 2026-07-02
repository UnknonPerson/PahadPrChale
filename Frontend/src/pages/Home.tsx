import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck as CheckCircle, Shield, Headphones, Star, MapPin, TrendingUp } from 'lucide-react';
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
  { icon: Shield,      title: 'Trusted Service',       description: '15+ years of experience with 50,000+ satisfied travelers' },
  { icon: CheckCircle, title: 'Best Price Guarantee',   description: 'We match any competitor price for the same tour package' },
  { icon: Headphones,  title: '24/7 Support',           description: 'Round-the-clock assistance throughout your entire journey' },
  { icon: Star,        title: 'Curated Experiences',    description: 'Handpicked destinations and activities by local experts' },
];

const stats = [
  { value: '50K+',  label: 'Happy Travelers' },
  { value: '150+',  label: 'Tour Packages' },
  { value: '50+',   label: 'Destinations' },
  { value: '4.9★',  label: 'Average Rating' },
];

export default function Home() {
  const { destinations, loading: loadingDest }  = useDestinations();
  const { packages: featuredPackages, loading: loadingPkgs } = useFeaturedPackages(3);
  const { testimonials, loading: loadingTest } = useTestimonials();

  const popularDestinations = [...destinations]
    .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const featuredTestimonials = testimonials
    .filter((t: any) => t.status === 'approved' || t.isFeatured)
    .slice(0, 3);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Himalayan Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-white/90 text-sm font-medium">North East India's #1 Travel Planner</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-5 leading-[1.1] tracking-tight"
          >
            Discover the{' '}
            <span className="text-gradient block sm:inline">Hidden Treasures</span>
            <span className="block mt-1">of Northeast India</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Explore pristine valleys, ancient monasteries, and untouched wilderness with
            expertly curated tours across Sikkim, Darjeeling, Meghalaya, and beyond.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link to="/packages">
              <button className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all text-base">
                Explore Packages <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/custom-tour-request">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-base">
                Plan Custom Tour
              </button>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-white/65 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Fade into page bg */}
          <div className="h-16 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle title="Popular" highlight="Destinations" />
            <p className="section-subtitle max-w-2xl mx-auto">
              Explore the most sought-after destinations across Northeast India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingDest
              ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              : popularDestinations.length > 0
                ? popularDestinations.map((dest: any, idx: number) => (
                    <DestinationCard key={dest.id || dest._id} destination={dest} index={idx} />
                  ))
                : (
                  <div className="col-span-full text-center py-16">
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No destinations available yet</p>
                  </div>
                )
            }
          </div>

          {popularDestinations.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/destinations">
                <Button variant="outline" size="lg">
                  View All Destinations <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle title="Featured Tour" highlight="Packages" />
            <p className="section-subtitle max-w-2xl mx-auto">
              Handpicked packages offering the best Himalayan experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingPkgs
              ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
              : featuredPackages.length > 0
                ? featuredPackages.map((pkg: any, idx: number) => (
                    <PackageCard key={pkg.id || pkg._id} pkg={pkg} index={idx} />
                  ))
                : (
                  <div className="col-span-full text-center py-16">
                    <Star className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No packages available yet</p>
                  </div>
                )
            }
          </div>

          {featuredPackages.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/packages">
                <Button variant="primary" size="lg">
                  Explore All Packages <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle title="Why Choose" highlight="Us?" centered={false} />
              <p className="section-subtitle mb-8">With over 15 years of experience, we're the most trusted travel partner in Northeast India.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="glass-card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Mountain landscape"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-5 shadow-xl hidden sm:block">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-500">15+</div>
                    <div className="text-xs text-gray-500 mt-0.5">Years of Excellence</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-500">50K+</div>
                    <div className="text-xs text-gray-500 mt-0.5">Happy Travelers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {!loadingTest && featuredTestimonials.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionTitle title="What Our" highlight="Travelers Say" />
              <p className="section-subtitle max-w-xl mx-auto">
                Real experiences from people who explored Northeast India with us
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((t: any, i: number) => (
                <TestimonialCard key={t.id || t._id || i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter / CTA ── */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Get Exclusive Travel Updates
            </h2>
            <p className="text-white/75 text-lg mb-8">
              Subscribe and receive the best deals, travel tips, and destination guides right to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder-white/55 outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
