import { motion } from 'framer-motion';
import {
  Users,
  Award,
  MapPin,
  Calendar,
  Heart,
  Target,
  Compass,
  Shield,
} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import ceo from '../Images/ceo.jpeg'
import tech from '../Images/Technical.jpeg'

const stats = [
  { icon: Users, value: '50,000+', label: 'Happy Travelers' },
  { icon: MapPin, value: '50+', label: 'Destinations' },
  { icon: Calendar, value: '15+', label: 'Years Experience' },
  { icon: Award, value: '25+', label: 'Travel Awards' },
];

const team = [
  {
    name: 'Sunny Yadav',
    role: 'Founder & CEO',
    image: ceo,
    bio: 'A Commerce Studen Trying to Star Traveling Startup,Traveling Indistru Mafia',
  },
  {
    name: 'Tanish Kumar',
    role: 'Head of Technical Assisment',
    image: tech,
    bio: 'Expert in Handeling Online things. And Technical Expert ,It Engeneear',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We live and breathe travel. Our team is passionate about sharing the beauty of Northeast India with the world.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Your safety is our priority. We maintain the highest standards in all our tours and partnerships.',
  },
  {
    icon: Target,
    title: 'Authentic Experiences',
    description: 'We believe in genuine cultural experiences, not tourist traps. Every tour connects you with local life.',
  },
  {
    icon: Compass,
    title: 'Sustainable Tourism',
    description: 'We\'re committed to preserving the environment and supporting local communities through responsible tourism.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto px-4"
            >
              Your trusted partner for discovering the wonders of Northeast India since 2010
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle
                title="Our Story"
                centered={false}
              />
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  HimalayaTravels was born from a simple dream: to share the breathtaking beauty
                  of Northeast India with travelers from around the world. Founded in 2010 by
                  Rajesh Thapa, a native of Darjeeling with an unwavering passion for his homeland,
                  we started as a small family-run operation.
                </p>
                <p>
                  What began with a single jeep and a handful of tours has grown into one of the
                  most trusted travel agencies in the region. Over the years, we&apos;ve helped
                  over 50,000 travelers discover the misty hills of Darjeeling, the ancient
                  monasteries of Sikkim, the living root bridges of Meghalaya, and the pristine
                  wilderness of Arunachal Pradesh.
                </p>
                <p>
                  Our team of local experts brings unmatched knowledge and genuine hospitality
                  to every tour we organize. We don&apos;t just show you destinations—we connect
                  you with the soul of Northeast India.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our team at work"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Our Core Values"
            subtitle="The principles that guide everything we do"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <value.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Meet Our Team"
            subtitle="The passionate people behind your unforgettable journeys"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-20 justify-items-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                    <p className="text-white/80 text-sm">{member.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Let us help you create memories that will last a lifetime.
            </p>
            <button className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors">
              Contact Us Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
