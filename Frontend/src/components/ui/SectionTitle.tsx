import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  centered?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  highlight,
  centered = true,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="section-title">
        {title}{' '}
        {highlight && (
          <span className="text-gradient">{highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="section-subtitle max-w-2xl mx-auto mt-4">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
