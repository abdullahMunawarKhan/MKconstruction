import React, { useEffect, useRef, useState } from 'react';

const photos = [
  "/images/photo1.jpg",
  "/images/photo2.jpg",
  "/images/photo3.jpg",
  "/images/photo4.jpg",
  // Add more image paths as needed
];

function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4000); // Change image every 4 seconds

    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  return (
    <div
      className="w-full overflow-hidden relative rounded-xl shadow-lg bg-gray-100"
      style={{
        height: '60vh', // Increased height for better portrait image display
        minHeight: 300,
      }}
    >
      {photos.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={src}
            alt={`carousel-${idx}`}
            className="w-full h-full object-contain"
            style={{ 
              objectPosition: 'center',
              maxHeight: '100%',
              maxWidth: '100%'
            }}
          />
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button
        onClick={() => {
          setCurrent((prev) => (prev - 1 + photos.length) % photos.length);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        aria-label="Previous image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => {
          setCurrent((prev) => (prev + 1) % photos.length);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        aria-label="Next image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 right-4 z-20 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
        {current + 1} / {photos.length}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === current ? 'bg-yellow-400' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
