import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';

// Icon mapping for categories (customize as needed)
const categoryIcons = {
  'Residential Construction': (
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-400 text-white mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v7a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" />
      </svg>
    </span>
  ),
  'Commercial Construction': (
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-400 text-white mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21v-7a2 2 0 012-2h2a2 2 0 012 2v7m4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4M4 21h16" />
      </svg>
    </span>
  ),
  'Specialized Services': (
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-400 text-white mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L8 21m7.25-4l1.75 4M12 3v6m0 0l-2.25 2.25M12 9l2.25 2.25" />
      </svg>
    </span>
  ),
};

function CurrentRates() {
  const location = useLocation();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRates() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('construction_rates')
      .select('*')
      .order('category', { ascending: true });
    if (error) setError(error.message);
    else setRates(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRates();
  }, [location.state?.refresh]);

  // Group rates by category for card display
  const groupedRates = rates.reduce((acc, rate) => {
    if (!acc[rate.category]) acc[rate.category] = [];
    acc[rate.category].push(rate);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Rates</h3>
          </div>
          {loading && <div className="text-center text-gray-500">Loading rates...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(groupedRates).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 flex flex-col items-start transition hover:shadow-xl"
                  style={{ minWidth: 320 }}
                >
                  {categoryIcons[category] || (
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-400 text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-3 w-full">
                    {items.map(rate => (
                      <div key={rate.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600">{rate.service}</span>
                          {rate.description && (
                            <span className="block text-xs text-gray-400">{rate.description}</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                          {rate.price_range}
                          {rate.unit ? `/${rate.unit}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrentRates;