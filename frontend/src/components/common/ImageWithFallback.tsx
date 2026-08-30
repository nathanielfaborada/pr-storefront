import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: 'portrait' | 'square' | 'video';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'portrait',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

  const aspectClass = {
    portrait: 'aspect-[4/5]',
    square: 'aspect-square',
    video: 'aspect-video',
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden bg-canvas-subtle ${aspectClass} ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
      )}
      <img
        src={hasError ? fallback : src}
        alt={alt || 'Vintage Garment'}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
