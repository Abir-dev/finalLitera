// src/components/RevealOnScroll.jsx
import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 600,
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-500 ease-out';
    const visibilityClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0';
    
    switch (direction) {
      case 'up':
        return `${baseClass} ${visibilityClass} ${!isVisible ? 'translate-y-8' : ''}`;
      case 'down':
        return `${baseClass} ${visibilityClass} ${!isVisible ? '-translate-y-8' : ''}`;
      case 'left':
        return `${baseClass} ${visibilityClass} ${!isVisible ? 'translate-x-8' : ''}`;
      case 'right':
        return `${baseClass} ${visibilityClass} ${!isVisible ? '-translate-x-8' : ''}`;
      case 'scale':
        return `${baseClass} ${visibilityClass} ${!isVisible ? 'scale-95' : ''}`;
      default:
        return `${baseClass} ${visibilityClass}`;
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
