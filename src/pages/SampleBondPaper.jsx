import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function SampleBondPaper() {
  const [bondPapers, setBondPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBondPapers();
  }, []);

  const fetchBondPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('bond_papers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBondPapers(data || []);
    } catch (error) {
      console.error('Error fetching bond papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBondPapers = selectedCategory === 'all' 
    ? bondPapers 
    : bondPapers.filter(paper => paper.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'performance', label: 'Performance Bonds' },
    { value: 'payment', label: 'Payment Bonds' },
    { value: 'bid', label: 'Bid Bonds' },
    { value: 'maintenance', label: 'Maintenance Bonds' },
    { value: 'subdivision', label: 'Subdivision Bonds' },
    { value: 'license', label: 'License Bonds' },
    { value: 'other', label: 'Other Documents' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Sample Bond Papers</h1>
          <p className="text-gray-600 mb-8">Review our construction bonds and legal documents</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bond papers...</p>
            </div>
          ) : filteredBondPapers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bond Papers Available</h3>
              <p className="text-gray-600">Check back later for updated bond documents.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBondPapers.map((paper) => (
                <div key={paper.id} className="construction-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="badge-primary capitalize">{paper.category}</span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{paper.title}</h4>
                  {paper.description && (
                    <p className="text-gray-600 text-sm mb-4">{paper.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{paper.download_count || 0} downloads</span>
                    </div>
                  </div>

                                     <a
                     href={supabase.storage.from('documents').getPublicUrl(paper.file_path).data.publicUrl}
                     download={paper.file_name}
                     className="btn-primary w-full text-center"
                     onClick={() => {
                       // Increment download count
                       supabase
                         .from('bond_papers')
                         .update({ download_count: (paper.download_count || 0) + 1 })
                         .eq('id', paper.id);
                     }}
                   >
                     📥 Download PDF
                   </a>
                </div>
              ))}
            </div>
          )}



          <div className="text-center mt-8">
            <button 
              onClick={() => window.history.back()} 
              className="btn-secondary"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleBondPaper;
