import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase'; // Adjust path accordingly

function TopPanel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Check current user session on mount + listen for auth updates
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation handlers for new buttons
  const handleGetAppointment = () => {
    // Replace with your actual path or external link
    navigate('/get-appointment');
  };


  const handleContactUs = () => {
    navigate('/contact-us');
  };

  const handleSampleBondPaper = () => {
    navigate('/sample-bond-paper');
  };


  const handleCurrentRates = () => {
  navigate('/current-rates', { state: { refresh: Date.now() } });
  };


  const handleServicesProvided = () => {
    navigate('/services');
  };

  const handleAdminLoginClick = () => {
    setMenuOpen(false);
    navigate('/admin-login');
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  // Add Home button handler
  const handleHome = () => {
    navigate('/dashboard');
  };

  // Utility button styles with hover effects
  const buttonBaseClass =
    "text-white px-3 py-1 rounded font-semibold transition-transform duration-200 ease-in-out hover:scale-110 hover:text-yellow-400 cursor-pointer select-none";

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white sticky top-0 z-50 shadow-md">

      {/* Site Title */}
      <div className="text-2xl font-bold font-['Nova_Round',cursive] select-none">M K Construction</div>

      {/* Middle buttons */}
      <nav className="flex gap-6 ml-8 flex-wrap">
        <button onClick={handleHome} className={buttonBaseClass} aria-label="Home">
          Home
        </button>
        <button onClick={handleGetAppointment} className={buttonBaseClass} aria-label="Get Appointment">
          Get Appointment
        </button>
        <button onClick={handleContactUs} className={buttonBaseClass} aria-label="Contact Us">
          Contact Us
        </button>
        <button onClick={handleSampleBondPaper} className={buttonBaseClass} aria-label="Sample Bond Paper">
          Sample Bond Paper
        </button>
        <button onClick={handleCurrentRates} className={buttonBaseClass} aria-label="Check Current Rates">
          Check Current Rates
        </button>
        <button onClick={handleServicesProvided} className={buttonBaseClass} aria-label="Services Provided">
          Services Provided
        </button>
      </nav>

      {/* Three-dot menu with User dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {/* SVG for three dots */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <ul className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl text-gray-800 ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in">
            {!user && (
              <li>
                <button
                  onClick={handleAdminLoginClick}
                  className="w-full flex items-center gap-2 px-5 py-3 hover:bg-yellow-50 transition text-base font-medium"
                >
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  Admin Login
                </button>
              </li>
            )}

            {user && (
              <>
                <li className="px-5 py-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Signed in as</div>
                    <div
                      className="font-semibold text-gray-900 text-xs break-all leading-tight"
                      style={{ wordBreak: 'break-all', fontSize: '12px', maxWidth: '170px' }}
                    >
                      {user.email}
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/admin-dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-5 py-3 hover:bg-yellow-50 transition text-base font-medium"
                  >
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                    </svg>
                    Admin Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-5 py-3 hover:bg-red-50 transition text-base font-semibold text-red-600"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TopPanel;

