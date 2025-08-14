// src/pages/Welcome.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleVideoEnd = () => {
      navigate('/dashboard');
    };

    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    videoEl.addEventListener('ended', handleVideoEnd);

    return () => {
      videoEl.removeEventListener('ended', handleVideoEnd);
      clearTimeout(skipTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden z-40">
      {/* Full-screen video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop={false}
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/video/welcome-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Enhanced overlay with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />

      {/* Construction pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 construction-pattern"></div>
      </div>

      {/* Additional dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />

      {/* Floating construction elements */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-float">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-400 drop-shadow-lg">
          <path d="M20,80 L80,80 L80,60 L60,40 L40,40 L20,60 Z M30,40 L30,20 L70,20 L70,40" />
        </svg>
      </div>

      <div
        className="absolute bottom-20 right-10 w-20 h-20 opacity-20 animate-float"
        style={{ animationDelay: '2s' }}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-400 drop-shadow-lg">
          <circle cx="50" cy="50" r="40" />
          <rect x="30" y="30" width="40" height="40" rx="5" />
        </svg>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="text-white space-y-6 animate-fade-in-up">
            {/* Brand logo with enhanced styling */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-gray-900 font-extrabold text-2xl shadow-2xl drop-shadow-lg">
                MK
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-['Nova_Round',cursive] text-white drop-shadow-lg">
                  M K Construction
                </h1>
                <p className="text-yellow-400 text-sm font-medium drop-shadow-md">Building Excellence Since 2015</p>
              </div>
            </div>

            {/* Main headline with enhanced readability */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-2xl">
              <span className="text-white">Building Excellence,</span>{' '}
              <span className="text-gradient bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                On Time
              </span>{' '}
              <span className="text-white">and On Budget</span>
            </h2>

            {/* Subtitle with better contrast */}
            <p className="text-white text-lg sm:text-xl max-w-xl leading-relaxed drop-shadow-lg font-medium">
              We deliver residential and commercial construction with craftsmanship and integrity. 
              Explore our services, sample bond papers, and current rates.
            </p>

            {/* Key features with enhanced styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-center gap-3 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                <span className="font-medium text-white drop-shadow-md">Quality Craftsmanship</span>
              </div>
              <div className="flex items-center gap-3 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                <span className="font-medium text-white drop-shadow-md">Timely Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                <span className="font-medium text-white drop-shadow-md">Competitive Rates</span>
              </div>
            </div>

            {/* CTA buttons with enhanced styling */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/services')} 
                className="btn-primary text-lg px-8 py-4 shadow-construction-lg hover:shadow-construction-xl transform hover:scale-105 transition-all duration-300 drop-shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Explore Services
              </button>
              
              {showSkipButton && (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="text-lg px-8 py-4 border-2 border-white/40 text-white hover:bg-white hover:text-gray-900 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 drop-shadow-lg hover:scale-105"
                >
                  Skip Intro
                </button>
              )}
            </div>
          </div>

          {/* Right side - Enhanced Stats Panel */}
          <div
            className="hidden lg:block space-y-6 absolute top-20 right-10 w-96 transform translate-x-10 opacity-0 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="p-8 space-y-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/30 shadow-2xl transition duration-700 ease-out">
              <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Why Choose M K Construction?</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group hover:bg-white/10 p-3 rounded-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 drop-shadow-md">Expert Team</h4>
                    <p className="text-white/90 text-sm leading-relaxed">Skilled professionals with years of experience in construction and project management</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group hover:bg-white/10 p-3 rounded-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 drop-shadow-md">On-Time Delivery</h4>
                    <p className="text-white/90 text-sm leading-relaxed">We respect your time and deadlines, ensuring projects are completed as scheduled</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group hover:bg-white/10 p-3 rounded-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 drop-shadow-md">Competitive Pricing</h4>
                    <p className="text-white/90 text-sm leading-relaxed">Quality work at fair and transparent rates with no hidden costs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes slide-in {
            0% {
              opacity: 0;
              transform: translateX(40px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slide-in {
            animation: slide-in 0.7s ease-out forwards;
          }
          
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
        `}
      </style>

      {/* Progress indicator with enhanced styling */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
          <span className="text-white/80 text-sm font-medium drop-shadow-md">Loading your experience...</span>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
