// src/components/PremiumLoader.jsx
import { useState, useEffect } from 'react';

export default function PremiumLoader({ 
  size = 'md', 
  color = 'blue', 
  text = 'Loading...',
  fullScreen = false 
}) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    gold: 'border-yellow-500',
    green: 'border-green-500'
  };

  const LoaderSpinner = () => (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-transparent rounded-full animate-spin ${colorClasses[color]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="card-premium p-8 text-center">
          <LoaderSpinner />
          <p className="mt-4 text-white font-medium">
            {text}{dots}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <LoaderSpinner />
        {text && (
          <p className="mt-4 text-gray-300 font-medium">
            {text}{dots}
          </p>
        )}
      </div>
    </div>
  );
}
