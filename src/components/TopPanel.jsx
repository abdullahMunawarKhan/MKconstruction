import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy user and handlers for demonstration; replace with your actual logic
const user = null; // or { email: "admin@example.com" }
const handleLogout = () => {};
const handleAdminLoginClick = () => {
  navigate('/login');
};

function TopPanel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close menu on outside click
  const menuRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Navigation handlers
  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold font-['Nova_Round',cursive] select-none">
        M K Construction
      </div>

      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 ml-8 flex-wrap">
        <button onClick={() => handleNav('/')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Home</button>
        <button onClick={() => handleNav('/get-appointment')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Get Appointment</button>
        <button onClick={() => handleNav('/contact-us')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Contact Us</button>
        <button onClick={() => handleNav('/sample-bond-paper')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Sample Bond Paper</button>
        <button onClick={() => handleNav('/current-rates')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Check Current Rates</button>
        <button onClick={() => handleNav('/services')} className="text-white px-3 py-1 rounded font-semibold hover:text-yellow-400">Services Provided</button>
        {/* Admin menu for desktop */}
        {!user && (
          <button onClick={handleAdminLoginClick} className="text-yellow-400 px-3 py-1 rounded font-semibold hover:text-yellow-300">Admin Login</button>
        )}
        {user && (
          <>
            <span className="text-xs text-gray-300 px-2">Signed in as <span className="font-bold">{user.email}</span></span>
            <button onClick={() => handleNav('/admin-dashboard')} className="text-yellow-400 px-3 py-1 rounded font-semibold hover:text-yellow-300">Admin Dashboard</button>
            <button onClick={handleLogout} className="text-red-400 px-3 py-1 rounded font-semibold hover:text-red-300">Logout</button>
          </>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex md:hidden">
          <div ref={menuRef} className="ml-auto w-64 bg-white h-full shadow-xl flex flex-col pt-8">
            <button
              className="self-end mr-4 mb-6"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button onClick={() => handleNav('/')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Home</button>
            <button onClick={() => handleNav('/get-appointment')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Get Appointment</button>
            <button onClick={() => handleNav('/contact-us')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Contact Us</button>
            <button onClick={() => handleNav('/sample-bond-paper')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Sample Bond Paper</button>
            <button onClick={() => handleNav('/current-rates')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Check Current Rates</button>
            <button onClick={() => handleNav('/services')} className="text-gray-900 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left">Services Provided</button>
            {/* Admin menu for mobile */}
            <div className="border-t mt-4 pt-4">
              {!user && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleAdminLoginClick();
                  }}
                  className="text-yellow-600 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left"
                >
                  Admin Login
                </button>
              )}
              {user && (
                <>
                  <div className="px-6 py-2 text-xs text-gray-500">
                    Signed in as <span className="font-bold text-gray-900">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleNav('/admin-dashboard');
                    }}
                    className="text-yellow-600 px-6 py-3 text-lg font-semibold hover:bg-yellow-50 text-left"
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-red-600 px-6 py-3 text-lg font-semibold hover:bg-red-50 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default TopPanel;

