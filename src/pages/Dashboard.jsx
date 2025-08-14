import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import PhotoCarousel from '../components/PhotoCarousel';

const calculateDays = (start, end) => {
  const startDt = new Date(start);
  const endDt = new Date(end);
  const diffTime = endDt - startDt;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function Dashboard() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSite, setActiveSite] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [likedImages, setLikedImages] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkAdmin();
  }, []);

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('completed_sites')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setSites([]);
      else setSites(data || []);
      setLoading(false);
    };
    fetchSites();
  }, []);

  // Fetch extra images for modal when activeSite changes
  useEffect(() => {
    const fetchImages = async () => {
      if (activeSite) {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('site_id', activeSite.id);
        if (error) setAdditionalImages([]);
        else setAdditionalImages(data.map(img => img.image_url) || []);
        setCurrentImageIndex(0);
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
      } else {
        setAdditionalImages([]);
        setCurrentImageIndex(0);
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
      }
    };
    fetchImages();
  }, [activeSite]);

  // Auto-slide images in modal
  useEffect(() => {
    if (activeSite && additionalImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % (additionalImages.length + 1));
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [activeSite, additionalImages.length]);

  const allImages = activeSite ? [activeSite.cover_image_url, ...additionalImages] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const toggleLike = (imageIndex) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageIndex)) {
        newSet.delete(imageIndex);
      } else {
        newSet.add(imageIndex);
      }
      return newSet;
    });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    if (!activeSite) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        setActiveSite(null);
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
      case '0':
        resetZoom();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeSite, zoomLevel]);

  const renderModal = () =>
    activeSite && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur"
        onClick={() => setActiveSite(null)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative w-full h-full max-w-7xl max-h-[95vh] mx-4" onClick={e => e.stopPropagation()}>
          {/* Top Controls Bar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-black/50 backdrop-blur rounded-full px-6 py-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <span className="text-white text-sm min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Reset zoom"
              >
                1:1
              </button>
            </div>

            {/* Image Counter */}
            <div className="text-white text-sm px-3 py-1 bg-black/30 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Like Button */}
            <button
              onClick={() => toggleLike(currentImageIndex)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                likedImages.has(currentImageIndex)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              aria-label={likedImages.has(currentImageIndex) ? 'Unlike image' : 'Like image'}
            >
              <svg className="w-4 h-4" fill={likedImages.has(currentImageIndex) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors" 
            onClick={() => setActiveSite(null)} 
            aria-label="Close"
          >
            ×
          </button>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image container with zoom and drag */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleMouseDown}
            >
              <img
                src={allImages[currentImageIndex]}
                alt={`Site image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                style={{ 
                  maxHeight: 'calc(95vh - 120px)',
                  maxWidth: 'calc(100vw - 120px)'
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Navigation Tabs */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-black/50 backdrop-blur rounded-full p-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setZoomLevel(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'ring-2 ring-yellow-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {likedImages.has(index) && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                </button>
                ))}
              </div>
            )}

          {/* Site details overlay */}
          <div className="absolute top-20 left-4 bg-black/50 backdrop-blur text-white p-4 rounded-lg max-w-sm">
            <h3 className="font-bold text-lg mb-2 font-['Nova_Round',cursive]">{activeSite.address}</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Start:</span> {new Date(activeSite.start_date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Completion:</span> {new Date(activeSite.final_date).toLocaleDateString()}</p>
              <p className="text-yellow-400 font-semibold">
                Duration: {calculateDays(activeSite.start_date, activeSite.final_date)} days
              </p>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="absolute bottom-20 right-4 bg-black/50 backdrop-blur text-white p-3 rounded-lg text-xs opacity-75">
            <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
            <p>← → Navigate • +/- Zoom • 0 Reset • Esc Close</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <PhotoCarousel />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-['Nova_Round',cursive]">
              Our Completed Projects
            </h1>
            {isAdmin && (
              <button
                onClick={() => navigate('/edit-sites')}
                className="btn-primary"
              >
                Edit Sites
              </button>
            )}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of successfully completed construction projects. Each project represents our commitment to quality, craftsmanship, and timely delivery.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              Loading projects...
            </div>
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600">We're working on adding our completed projects. Check back soon!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map(site => (
              <div
                key={site.id}
                tabIndex={0}
                role="button"
                aria-label={`View details for project at ${site.address}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200/50"
                onClick={() => setActiveSite(site)}
                onKeyDown={e => {
                  if (e.key === 'Enter') setActiveSite(site);
                }}
              >
                {/* Image container with full image display */}
                <div className="relative overflow-hidden bg-gray-100" style={{ height: '400px' }}>
                <img
                  src={site.cover_image_url}
                    alt={`Construction project at ${site.address}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    style={{ 
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors font-['Nova_Round',cursive]">
                    {site.address}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Started: {new Date(site.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Completed: {new Date(site.final_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-yellow-600">
                      {calculateDays(site.start_date, site.final_date)} days
                    </div>
                  <button
                      className="btn-primary text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      setActiveSite(site);
                    }}
                  >
                      View Details
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {renderModal()}
    </div>
  );
}

export default Dashboard;
