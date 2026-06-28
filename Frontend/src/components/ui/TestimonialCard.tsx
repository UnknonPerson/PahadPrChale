import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';
import type { Testimonial } from '../../data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6 hover:shadow-2xl transition-all duration-300"
    >
      <Quote className="w-10 h-10 text-primary-500/20 mb-4" />
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {testimonial.title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        &quot;{testimonial.text}&quot;
      </p>
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3" />
            {testimonial.location}
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-400">{testimonial.date}</p>
          <p className="text-xs text-primary-500">{testimonial.package}</p>
        </div>
      </div>
    </motion.div>
  );
}
