import { motion } from 'framer-motion';
import { Users, Award, MapPin, Calendar, Heart, Target, Compass, Shield } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import ceoImg from '../Images/ceo.jpeg';
import techImg from '../Images/Technical.jpeg';

const stats = [
  { icon: Users,    value: '50,000+', label: 'Happy Travelers' },
  { icon: MapPin,   value: '50+',     label: 'Destinations' },
  { icon: Calendar, value: '15+',     label: 'Years Experience' },
  { icon: Award,    value: '25+',     label: 'Travel Awards' },
];

const team = [
  {
    name: 'Sunny Yadav',
    role: 'Founder & CEO',
    image: ceoImg,
    bio: 'A passionate entrepreneur who turned his love for travel into a thriving startup. Leading PahadPerChale with vision and energy.',
  },
  {
    name: 'Tanish Kumar',
    role: 'Head of Technology',
    image: techImg,
    bio: 'IT engineer and technical expert who powers our digital platform. Passionate about building seamless travel experiences online.',
  },
];

const values = [
  { icon: Heart,   title: 'Passion for Travel',     description: 'We live and breathe travel. Every tour is crafted with genuine passion for Northeast India.' },
  { icon: Shield,  title: 'Safety First',            description: 'Your safety is our top priority. We maintain the highest standards across all our tours.' },
  { icon: Target,  title: 'Authentic Experiences',   description: 'Real cultural immersion, not tourist traps. We connect you with the true soul of the Himalayas.' },
  { icon: Compass, title: 'Sustainable Tourism',      description: 'We protect nature and support local communities through responsible, eco-conscious travel.' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-3"
            >
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg text-white/80 max-w-xl mx-auto"
            >
              Your trusted partner for discovering Northeast India since 2010
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-primary-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/75 text-sm mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle title="Our Story" centered={false} />
              <div className="mt-5 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>PahadPerChale was born from a simple dream: to share the breathtaking beauty of Northeast India with travelers from around the world.</p>
                <p>What began with a single jeep and a handful of tours has grown into one of the most trusted travel agencies in the region. Over the years, we've helped over 50,000 travelers create memories that last a lifetime.</p>
                <p>Our team of local experts brings unmatched knowledge and genuine hospitality to every tour. We don't just show you destinations — we connect you with the soul of Northeast India.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our team"
                  className="w-full h-[380px] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-secondary-500 text-white px-6 py-4 rounded-2xl shadow-lg hidden sm:block">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle title="Our Core Values" />
            <p className="section-subtitle max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle title="Meet Our Team" />
            <p className="section-subtitle max-w-xl mx-auto">The passionate people behind your unforgettable journeys</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group flex flex-col"
              >
                {/* Fixed-height image container */}
                <div className="relative h-64 overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm font-medium text-primary-500 mb-2">{member.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-white/80 text-lg mb-8">Let us help you create memories that will last a lifetime.</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Contact Us Today
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
