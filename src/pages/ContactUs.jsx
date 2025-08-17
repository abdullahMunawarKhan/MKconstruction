import React, { useState } from 'react';

function ContactUs() {
  const [copyStatus, setCopyStatus] = useState({ phone: false, email: false });
  const [showImageModal, setShowImageModal] = useState(false);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePhoneClick = () => {
    // Copy to clipboard
    copyToClipboard('+91 9922526531', 'phone');
    
    // Open phone app (works on mobile)
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      window.location.href = 'tel:+919922526531';
    }
  };

  const handleEmailClick = () => {
    // Copy to clipboard
    copyToClipboard('mkconstruction@gmail.com', 'email');
    
    // Open email app
    window.location.href = 'mailto:mkconstruction@gmail.com';
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Contractor Info Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-8 border-yellow-400 w-full max-w-2xl mx-auto">
            <div
              className="w-full sm:w-36 h-48 sm:h-36 bg-yellow-100 rounded-2xl flex items-center justify-center overflow-hidden mb-4 sm:mb-0 cursor-pointer"
              onClick={() => setShowImageModal(true)}
              title="Click to enlarge"
            >
              <img
                src="/images/father.png"
                alt="Mr. Munawar Khan Akbar Khan"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-200 hover:scale-105"
                style={{ objectPosition: 'center' }}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-base font-semibold text-gray-800 mb-1 tracking-wide">
                About Contractor
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                Mr. Munawar Khan Akbar Khan
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-600 text-sm font-medium justify-center sm:justify-start">
                <span className="flex items-center">
                  <svg className="inline w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  10+ years experience
                </span>
                <span className="hidden sm:inline h-1 w-1 bg-gray-400 rounded-full mx-2"></span>
                <span className="flex items-center">
                  <svg className="inline w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M4 11h16" />
                  </svg>
                  100+ sites completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative bg-white rounded-2xl shadow-lg p-4 max-w-full max-h-full flex flex-col items-center">
              <button
                className="absolute top-2 right-2 text-gray-700 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                onClick={() => setShowImageModal(false)}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src="/images/father.png"
                alt="Mr. Munawar Khan Akbar Khan"
                className="max-w-[90vw] max-h-[80vh] rounded-xl"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        {/* --- Existing Contact Us content below --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Contact Us</h1>
          <p className="text-gray-600 mb-8">Get in touch with our construction experts</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-8">We're here to help with your construction needs</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <button 
                    onClick={handlePhoneClick}
                    className="text-gray-600 hover:text-yellow-600 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>+91 9922526531</span>
                      {copyStatus.phone && (
                        <span className="text-green-600 text-sm font-medium">✓ Copied!</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">(Mr. Munawar Khan)</div>
                    <div className="text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                      Click to copy & call
                    </div>
                  </button>
                </div>
                
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <button 
                    onClick={handleEmailClick}
                    className="text-gray-600 hover:text-yellow-600 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="break-all text-sm max-w-[180px]">
                        mkconstruction9922@gmail.com
                      </span>
                      {copyStatus.email && (
                        <span className="text-green-600 text-sm font-medium">✓ Copied!</span>
                      )}
                    </div>
                    <div className="text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                      Click to copy & email
                    </div>
                  </button>
                </div>
                
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">Plot no-45 ,himayat bagh,Aurangabad 431001, Maharashtra, India</p>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                <p className="text-gray-600 mb-6">
                  monday - thursday: 9:00 AM - 10:00 PM<br />
                  saturday & Sunday: 9:00 AM - 8:00 PM<br />
                  friday : holiday
                </p>
                
                <button 
                  onClick={() => window.history.back()} 
                  className="btn-primary"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;