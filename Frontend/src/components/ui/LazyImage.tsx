import { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: string;
  aspectRatio?: string;
}

const DEFAULT_FALLBACK = 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function LazyImage({
  src,
  alt,
  fallback = DEFAULT_FALLBACK,
  aspectRatio = '3/2',
  className = '',
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '100px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const imgSrc = error ? fallback : src;

  return (
    <div ref={ref} className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`} style={{ aspectRatio }}>
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      {inView && (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => { if (!error) setError(true); }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}
