import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/admin-login');
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-gray-900 font-extrabold text-lg shadow-lg">
                MK
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-['Nova_Round',cursive]">M K Construction</h1>
                <p className="text-sm text-yellow-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>

            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              Home
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              View Public Site
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => navigate('/edit-sites')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              Edit Sites
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => navigate('/edit-bond-papers')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              Edit Bond Papers
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => navigate('/edit-rates')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              Edit Rates
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => navigate('/view-appointments')}
              className="nav-link text-gray-700 hover:text-yellow-600 font-medium"
            >
              View Appointments
            </button>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Admin Control Panel</h2>
          <p className="text-gray-600 mb-8">Manage your construction website content and view user interactions</p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Edit Sites */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Sites</h3>
            <p className="text-gray-600 mb-4">Manage completed construction sites, add new projects, and update site information</p>
            <button
              onClick={() => navigate('/edit-sites')}
              className="btn-primary w-full"
            >
              Manage Sites
            </button>
          </div>

          {/* Edit Bond Papers */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Bond Papers</h3>
            <p className="text-gray-600 mb-4">Upload, remove, and manage construction bond documents and legal papers</p>
            <button
              onClick={() => navigate('/edit-bond-papers')}
              className="btn-primary w-full"
            >
              Manage Bonds
            </button>
          </div>

          {/* Edit Rates */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Rates</h3>
            <p className="text-gray-600 mb-4">Update construction rates, pricing information, and service costs</p>
            <button
              onClick={() => navigate('/edit-rates')}
              className="btn-primary w-full"
            >
              Manage Rates
            </button>
          </div>

          {/* View Appointments */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View Appointments</h3>
            <p className="text-gray-600 mb-4">Review and manage all appointment requests from potential clients</p>
            <button
              onClick={() => navigate('/view-appointments')}
              className="btn-primary w-full"
            >
              View Requests
            </button>
          </div>

          {/* Edit Site Info */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Site Info</h3>
            <p className="text-gray-600 mb-4">Update company information, contact details, and website content</p>
            <button
              onClick={() => navigate('/edit-site-info')}
              className="btn-primary w-full"
            >
              Edit Info
            </button>
          </div>

          {/* Quick Stats */}
          <div className="construction-card p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-gray-600 mb-4">View website analytics, user engagement, and performance metrics</p>
            <button
              onClick={() => navigate('/admin-stats')}
              className="btn-primary w-full"
            >
              View Stats
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Last login: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default AdminDashboard;
